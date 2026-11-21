import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
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

export default function NewDishScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    returnToVisit?: string;
    returnToTakeout?: string;
    preselectedRestaurantId?: string;
  }>();

  const {
    restaurants,
    categories,
    dietaryTags,
    addDish,
    pendingRestaurantId,
    setPendingRestaurantId,
    setPendingDishId,
  } = useCatalog();

  const [restaurantId, setRestaurantId] = useState(
    params.preselectedRestaurantId || ''
  );
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [dietaryModalOpen, setDietaryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select newly created restaurant only when NewDishScreen regains focus
  useFocusEffect(
    useCallback(() => {
      if (pendingRestaurantId) {
        setRestaurantId(pendingRestaurantId);
        setPendingRestaurantId(null);
      }
    }, [pendingRestaurantId, setPendingRestaurantId])
  );

  const selectedRestaurant = restaurants.find((r) => r.id === restaurantId);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Needed',
        'Please allow photo library access to choose a dish photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!restaurantId) {
      Alert.alert('Missing Restaurant', 'Please select a restaurant.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a dish name.');
      return;
    }
    const parsedPrice = parseFloat(priceText);
    if (priceText.trim() && (isNaN(parsedPrice) || parsedPrice < 0)) {
      Alert.alert('Invalid Price', 'Please enter a valid price (e.g., 14.50).');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }

    setIsSaving(true);
    try {
      const created = await addDish({
        restaurantId,
        name: name.trim(),
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        category,
        dietaryTags: selectedTags,
        description: description.trim(),
        image,
      });

      if (params.returnToVisit === 'true' || params.returnToTakeout === 'true') {
        setPendingDishId(created.id);
      }

      router.back();
    } catch {
      Alert.alert('Save Failed', 'Could not save dish. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Dish</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Restaurant Selector */}
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
              activeOpacity={0.7}
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
                  : 'Select restaurant...'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Dish Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Spicy Rigatoni Vodka"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* 3. Price */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.priceInputRow}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={priceText}
                onChangeText={setPriceText}
              />
            </View>
          </View>

          {/* 4. Category Dropdown */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Category *</Text>
              <Text style={styles.helperText}>Customizable in Settings</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownButton}
              activeOpacity={0.7}
              onPress={() => setCategoryModalOpen(true)}
            >
              <Text
                style={
                  category ? styles.dropdownValueText : styles.placeholderText
                }
              >
                {category || 'Select a category...'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 5. Dietary Tags Multi-Select */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Dietary Tags</Text>
              <Text style={styles.helperText}>Optional · Multi-select</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownButton}
              activeOpacity={0.7}
              onPress={() => setDietaryModalOpen(true)}
            >
              <Text
                style={
                  selectedTags.length > 0
                    ? styles.dropdownValueText
                    : styles.placeholderText
                }
              >
                {selectedTags.length > 0
                  ? `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
                  : 'Select dietary tags...'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {selectedTags.length > 0 && (
              <View style={styles.selectedChipsRow}>
                {selectedTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagChip}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={styles.tagChipText}>{tag} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 6. Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ingredients, portion size, spice level, preparation notes..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* 7. Single Square Dish Image */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Dish Photo</Text>
              <Text style={styles.helperText}>Optional · 1 square image</Text>
            </View>

            {image ? (
              <View style={styles.imagePreviewWrapper}>
                <Image
                  source={{ uri: image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <View style={styles.imageActionRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={pickImage}
                  >
                    <Text style={styles.secondaryBtnText}>Change Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => setImage(undefined)}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePickerBox}
                activeOpacity={0.7}
                onPress={pickImage}
              >
                <Text style={styles.imageIcon}>+ Add Dish Photo</Text>
                <Text style={styles.placeholderText}>
                  Tap to choose from photo library
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSaving && styles.submitDisabled]}
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={handleSave}
          >
            <Text style={styles.submitText}>
              {isSaving ? 'Saving...' : 'Save Dish'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MODAL 1: Restaurant Picker */}
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

        {/* MODAL 2: Category Picker */}
        <Modal
          visible={categoryModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setCategoryModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setCategoryModalOpen(false)}>
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = item === category;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        selected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setCategory(item);
                        setCategoryModalOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>

        {/* MODAL 3: Dietary Tags Multi-Select */}
        <Modal
          visible={dietaryModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setDietaryModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Dietary Tags</Text>
                <TouchableOpacity onPress={() => setDietaryModalOpen(false)}>
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={dietaryTags}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = selectedTags.includes(item);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        selected && styles.modalOptionSelected,
                      ]}
                      onPress={() => toggleTag(item)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
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
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    gap: 18,
    paddingBottom: 36,
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
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
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
  textInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
  },
  priceInputRow: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  dropdownButton: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagChip: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    paddingVertical: 12,
  },
  imagePickerBox: {
    height: 160,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imageIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  imagePreviewWrapper: {
    gap: 10,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  imageActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  removeBtn: {
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },
  submitButton: {
    marginTop: 8,
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
});