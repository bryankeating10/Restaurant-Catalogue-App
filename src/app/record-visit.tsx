import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';
import { DishReview } from '../types/catalog';

interface DraftDishReview {
  tempId: string;
  dishId: string;
  flavor?: number;
  size?: number;
  texture?: number;
  presentation?: number;
  description: string;
  photos: string[];
}

const createEmptyDraftDish = (): DraftDishReview => ({
  tempId: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  dishId: '',
  description: '',
  photos: [],
});

export default function RecordVisitScreen() {
  const router = useRouter();
  const {
    restaurants,
    dishes,
    addDiningEntry,
    pendingRestaurantId,
    setPendingRestaurantId,
    pendingDishId,
    setPendingDishId,
  } = useCatalog();

  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const metricKeys: {
    key: 'flavor' | 'size' | 'texture' | 'presentation';
    label: string;
  }[] = [
    { key: 'flavor', label: 'Flavor' },
    { key: 'size', label: 'Size' },
    { key: 'texture', label: 'Texture' },
    { key: 'presentation', label: 'Presentation' },
  ];

  const [restaurantId, setRestaurantId] = useState('');
  const [atmosphereRating, setAtmosphereRating] = useState<number | undefined>(
    undefined
  );
  const [serviceRating, setServiceRating] = useState<number | undefined>(
    undefined
  );
  const [totalCostText, setTotalCostText] = useState('');
  const [notes, setNotes] = useState('');
  const [draftDishes, setDraftDishes] = useState<DraftDishReview[]>([
    createEmptyDraftDish(),
  ]);

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [activeDishPickerIndex, setActiveDishPickerIndex] = useState<
    number | null
  >(null);
  const [activeMetricEdit, setActiveMetricEdit] = useState<{
    dishIndex: number;
    metric: 'flavor' | 'size' | 'texture' | 'presentation';
    label: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-populate restaurant or dish only when this screen regains focus
  useFocusEffect(
    useCallback(() => {
      if (pendingRestaurantId) {
        setRestaurantId(pendingRestaurantId);
        setPendingRestaurantId(null);
      }

      if (pendingDishId) {
        const createdDish = dishes.find((d) => d.id === pendingDishId);
        if (createdDish && !restaurantId) {
          setRestaurantId(createdDish.restaurantId);
        }
        setDraftDishes((prev) => {
          const emptyIdx = prev.findIndex((item) => !item.dishId);
          if (emptyIdx !== -1) {
            return prev.map((item, i) =>
              i === emptyIdx ? { ...item, dishId: pendingDishId } : item
            );
          }
          return [
            ...prev,
            { ...createEmptyDraftDish(), dishId: pendingDishId },
          ];
        });
        setPendingDishId(null);
      }
    }, [
      pendingRestaurantId,
      setPendingRestaurantId,
      pendingDishId,
      setPendingDishId,
      dishes,
      restaurantId,
    ])
  );

  const selectedRestaurant = restaurants.find((r) => r.id === restaurantId);

  const availableDishes = restaurantId
    ? dishes.filter((d) => d.restaurantId === restaurantId)
    : dishes;

  const updateDraftDish = (
    index: number,
    patch: Partial<DraftDishReview>
  ) => {
    setDraftDishes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeDraftDish = (index: number) => {
    if (draftDishes.length === 1) {
      setDraftDishes([createEmptyDraftDish()]);
      return;
    }
    setDraftDishes((prev) => prev.filter((_, i) => i !== index));
  };

  const addDishPhotos = async (index: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Needed',
        'Please allow photo library access to attach photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map((a) => a.uri);
      setDraftDishes((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, photos: [...item.photos, ...newUris] } : item
        )
      );
    }
  };

  const removeDishPhoto = (dishIndex: number, photoIndex: number) => {
    setDraftDishes((prev) =>
      prev.map((item, i) =>
        i === dishIndex
          ? {
              ...item,
              photos: item.photos.filter((_, pIdx) => pIdx !== photoIndex),
            }
          : item
      )
    );
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Missing Restaurant', 'Please select a restaurant.');
      return;
    }

    const validDishes = draftDishes.filter((d) => d.dishId);
    if (validDishes.length === 0) {
      Alert.alert(
        'No Dishes Selected',
        'Please select at least one dish from your visit.'
      );
      return;
    }

    const parsedCost = parseFloat(totalCostText);
    if (totalCostText.trim() && (isNaN(parsedCost) || parsedCost < 0)) {
      Alert.alert('Invalid Total', 'Please enter a valid dollar amount.');
      return;
    }

    setIsSaving(true);
    try {
      const dishReviews: DishReview[] = validDishes.map((d) => ({
        id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        dishId: d.dishId,
        flavor: d.flavor,
        size: d.size,
        texture: d.texture,
        presentation: d.presentation,
        description: d.description.trim() || undefined,
        photos: d.photos,
      }));

      await addDiningEntry({
        type: 'visit',
        restaurantId,
        visitedAt: new Date().toISOString(),
        atmosphereRating,
        serviceRating,
        totalCost: isNaN(parsedCost) ? undefined : parsedCost,
        notes: notes.trim() || undefined,
        dishReviews,
      });

      Alert.alert('Saved!', 'Visit recorded successfully.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch {
      Alert.alert('Save Failed', 'Could not save visit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Record a Visit</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: RESTAURANT & VISIT RATINGS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>1. Restaurant Details</Text>

            {/* Restaurant Selector + Quick Create */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Restaurant *</Text>
                <TouchableOpacity
                  style={styles.inlineCreateBtn}
                  onPress={() =>
                    router.push('/new-restaurant?returnToVisit=true')
                  }
                >
                  <Text style={styles.inlineCreateText}>+ New Restaurant</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setRestaurantModalOpen(true)}
              >
                <Text
                  style={
                    selectedRestaurant
                      ? styles.dropdownValueText
                      : styles.placeholderText
                  }
                >
                  {selectedRestaurant
                    ? selectedRestaurant.name
                    : 'Select existing restaurant...'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Optional Atmosphere Rating */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Atmosphere Rating</Text>
                <Text style={styles.optionalTag}>Optional (1–10)</Text>
              </View>
              <View style={styles.ratingRow}>
                {ratingScale.map((num) => {
                  const selected = atmosphereRating === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.ratingBox,
                        selected && styles.ratingBoxActive,
                      ]}
                      onPress={() =>
                        setAtmosphereRating(selected ? undefined : num)
                      }
                    >
                      <Text
                        style={[
                          styles.ratingNum,
                          selected && styles.ratingNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional Service Rating */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Service Rating</Text>
                <Text style={styles.optionalTag}>Optional (1–10)</Text>
              </View>
              <View style={styles.ratingRow}>
                {ratingScale.map((num) => {
                  const selected = serviceRating === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.ratingBox,
                        selected && styles.ratingBoxActive,
                      ]}
                      onPress={() =>
                        setServiceRating(selected ? undefined : num)
                      }
                    >
                      <Text
                        style={[
                          styles.ratingNum,
                          selected && styles.ratingNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional Total Cost */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Total Paid (incl. tax/tip)</Text>
                <Text style={styles.optionalTag}>Optional</Text>
              </View>
              <View style={styles.priceInputRow}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={totalCostText}
                  onChangeText={setTotalCostText}
                />
              </View>
            </View>

            {/* Optional Visit Notes */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Visit Notes</Text>
                <Text style={styles.optionalTag}>Optional</Text>
              </View>
              <TextInput
                style={styles.smallTextArea}
                placeholder="Overall vibe, wait time, seating, occasion..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* SECTION 2: DISHES ORDERED (Repeatable Cards) */}
          <View style={styles.sectionCard}>
            <View style={styles.labelRow}>
              <Text style={styles.sectionTitle}>2. Dishes Ordered *</Text>
              <TouchableOpacity
                style={styles.inlineCreateBtn}
                onPress={() =>
                  router.push(
                    `/new-dish?returnToVisit=true&preselectedRestaurantId=${restaurantId}`
                  )
                }
              >
                <Text style={styles.inlineCreateText}>+ New Dish</Text>
              </TouchableOpacity>
            </View>

            {draftDishes.map((draft, index) => {
              const dishObj = dishes.find((d) => d.id === draft.dishId);

              return (
                <View key={draft.tempId} style={styles.dishItemCard}>
                  <View style={styles.labelRow}>
                    <Text style={styles.dishHeaderLabel}>
                      Dish #{index + 1}
                    </Text>
                    <TouchableOpacity onPress={() => removeDraftDish(index)}>
                      <Text style={styles.removeDishText}>
                        {draftDishes.length > 1 ? 'Remove' : 'Clear'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Select Dish Dropdown */}
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setActiveDishPickerIndex(index)}
                  >
                    <Text
                      style={
                        dishObj
                          ? styles.dropdownValueText
                          : styles.placeholderText
                      }
                    >
                      {dishObj ? dishObj.name : 'Select dish from menu...'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>

                  {/* Optional 4 Dish Metrics */}
                  <View style={styles.metricsBlock}>
                    <View style={styles.labelRow}>
                      <Text style={styles.subLabel}>Dish Metrics</Text>
                      <Text style={styles.optionalTag}>
                        Optional · Tap to rate
                      </Text>
                    </View>

                    <View style={styles.metricsGrid}>
                      {metricKeys.map(({ key, label }) => {
                        const val = draft[key];
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[
                              styles.metricPill,
                              val !== undefined && styles.metricPillActive,
                            ]}
                            onPress={() =>
                              setActiveMetricEdit({
                                dishIndex: index,
                                metric: key,
                                label,
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.metricName,
                                val !== undefined && styles.metricNameActive,
                              ]}
                            >
                              {label}
                            </Text>
                            <Text
                              style={[
                                styles.metricScore,
                                val !== undefined && styles.metricScoreActive,
                              ]}
                            >
                              {val !== undefined ? `${val} / 10` : '--'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Dish Written Description */}
                  <TextInput
                    style={styles.smallTextArea}
                    placeholder="Written notes for this dish (optional)..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={draft.description}
                    onChangeText={(txt) =>
                      updateDraftDish(index, { description: txt })
                    }
                  />

                  {/* Multi-Photo Upload */}
                  {draft.photos.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.photoThumbRow}
                    >
                      {draft.photos.map((uri, pIdx) => (
                        <View key={`${uri}_${pIdx}`} style={styles.thumbWrapper}>
                          <Image
                            source={{ uri }}
                            style={styles.thumbImage}
                          />
                          <TouchableOpacity
                            style={styles.thumbRemoveBadge}
                            onPress={() => removeDishPhoto(index, pIdx)}
                          >
                            <Text style={styles.thumbRemoveText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  <TouchableOpacity
                    style={styles.photoRowBtn}
                    onPress={() => addDishPhotos(index)}
                  >
                    <Text style={styles.photoPrompt}>
                      + Add Dish Photos ({draft.photos.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Add Another Dish to This Visit */}
            <TouchableOpacity
              style={styles.addAnotherDishBtn}
              onPress={() =>
                setDraftDishes((prev) => [...prev, createEmptyDraftDish()])
              }
            >
              <Text style={styles.addAnotherText}>
                + Add Another Dish to Visit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save Visit Action */}
          <TouchableOpacity
            style={[styles.submitButton, isSaving && styles.submitDisabled]}
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={handleSave}
          >
            <Text style={styles.submitText}>
              {isSaving ? 'Saving...' : 'Save Visit'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MODAL 1: Restaurant Selector */}
        <Modal
          visible={restaurantModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setRestaurantModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Restaurant</Text>
                <TouchableOpacity onPress={() => setRestaurantModalOpen(false)}>
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>

              {restaurants.length === 0 ? (
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>
                    No restaurants saved yet.
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCreateBtn}
                    onPress={() => {
                      setRestaurantModalOpen(false);
                      router.push('/new-restaurant?returnToVisit=true');
                    }}
                  >
                    <Text style={styles.modalCreateBtnText}>
                      + Create First Restaurant
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={restaurants}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const selected = item.id === restaurantId;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.modalOption,
                          selected && styles.modalOptionSelected,
                        ]}
                        onPress={() => {
                          setRestaurantId(item.id);
                          setRestaurantModalOpen(false);
                        }}
                      >
                        <View>
                          <Text
                            style={[
                              styles.modalOptionText,
                              selected && styles.modalOptionTextSelected,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.modalSubText}>{item.cuisine}</Text>
                        </View>
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </Modal>

        {/* MODAL 2: Dish Selector */}
        <Modal
          visible={activeDishPickerIndex !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveDishPickerIndex(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedRestaurant
                    ? `Dishes at ${selectedRestaurant.name}`
                    : 'Select Dish'}
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveDishPickerIndex(null)}
                >
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>

              {availableDishes.length === 0 ? (
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>
                    No dishes saved for this restaurant yet.
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCreateBtn}
                    onPress={() => {
                      setActiveDishPickerIndex(null);
                      router.push(
                        `/new-dish?returnToVisit=true&preselectedRestaurantId=${restaurantId}`
                      );
                    }}
                  >
                    <Text style={styles.modalCreateBtnText}>
                      + Add New Dish
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={availableDishes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const currentDishId =
                      activeDishPickerIndex !== null
                        ? draftDishes[activeDishPickerIndex]?.dishId
                        : '';
                    const selected = item.id === currentDishId;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.modalOption,
                          selected && styles.modalOptionSelected,
                        ]}
                        onPress={() => {
                          if (activeDishPickerIndex !== null) {
                            updateDraftDish(activeDishPickerIndex, {
                              dishId: item.id,
                            });
                            if (!restaurantId) {
                              setRestaurantId(item.restaurantId);
                            }
                          }
                          setActiveDishPickerIndex(null);
                        }}
                      >
                        <View>
                          <Text
                            style={[
                              styles.modalOptionText,
                              selected && styles.modalOptionTextSelected,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.modalSubText}>
                            {item.category}
                            {item.price > 0 ? ` · $${item.price.toFixed(2)}` : ''}
                          </Text>
                        </View>
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </Modal>

        {/* MODAL 3: Dish Metric 1–10 Picker */}
        <Modal
          visible={activeMetricEdit !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveMetricEdit(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.metricModalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Rate {activeMetricEdit?.label} (1–10)
                </Text>
                <TouchableOpacity onPress={() => setActiveMetricEdit(null)}>
                  <Text style={styles.modalClose}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.metricScaleGrid}>
                {ratingScale.map((num) => {
                  const currentVal =
                    activeMetricEdit !== null
                      ? draftDishes[activeMetricEdit.dishIndex]?.[
                          activeMetricEdit.metric
                        ]
                      : undefined;
                  const selected = currentVal === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.metricScaleBox,
                        selected && styles.metricScaleBoxActive,
                      ]}
                      onPress={() => {
                        if (activeMetricEdit) {
                          updateDraftDish(activeMetricEdit.dishIndex, {
                            [activeMetricEdit.metric]: selected
                              ? undefined
                              : num,
                          });
                        }
                        setActiveMetricEdit(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.metricScaleNum,
                          selected && styles.metricScaleNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 60,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionalTag: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  inlineCreateBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inlineCreateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  dropdownButton: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  priceInputRow: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
  },
  ratingBox: {
    flex: 1,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBoxActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  ratingNum: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  ratingNumActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dishItemCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  dishHeaderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  removeDishText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
  },
  metricsBlock: {
    gap: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricPill: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metricPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  metricNameActive: {
    color: '#FFFFFF',
  },
  metricScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  metricScoreActive: {
    color: '#FFFFFF',
  },
  smallTextArea: {
    height: 76,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#111827',
  },
  photoThumbRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  thumbWrapper: {
    position: 'relative',
  },
  thumbImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  thumbRemoveBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbRemoveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  photoRowBtn: {
    height: 40,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPrompt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  addAnotherDishBtn: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#111827',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  submitButton: {
    height: 52,
    backgroundColor: '#111827',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* --- MODALS --- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalClose: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  modalEmpty: {
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  modalEmptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalCreateBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCreateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#F9FAFB',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    fontWeight: '700',
    color: '#111827',
  },
  modalSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  metricModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  metricScaleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
    justifyContent: 'center',
  },
  metricScaleBox: {
    width: '17%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricScaleBoxActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  metricScaleNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  metricScaleNumActive: {
    color: '#FFFFFF',
  },
});