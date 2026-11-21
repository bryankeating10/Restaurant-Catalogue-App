import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';

export default function DishesScreen() {
  const router = useRouter();
  const {
    dishes,
    restaurants,
    categories,
    dietaryTags,
    toggleFavoriteDish,
    deleteDish,
  } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string | null>(null);

  const restaurantMap = useMemo(() => {
    const map: Record<string, string> = {};
    restaurants.forEach((r) => {
      map[r.id] = r.name;
    });
    return map;
  }, [restaurants]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      if (favoritesOnly && !d.isFavorite) return false;
      if (selectedCategory && d.category !== selectedCategory) return false;
      if (selectedDietary && !d.dietaryTags.includes(selectedDietary)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const restName = (restaurantMap[d.restaurantId] || '').toLowerCase();
        const matchesDish = d.name.toLowerCase().includes(q);
        const matchesDesc = d.description.toLowerCase().includes(q);
        const matchesRest = restName.includes(q);
        if (!matchesDish && !matchesDesc && !matchesRest) return false;
      }
      return true;
    });
  }, [
    dishes,
    favoritesOnly,
    selectedCategory,
    selectedDietary,
    searchQuery,
    restaurantMap,
  ]);

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Dish', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDish(id),
      },
    ]);
  };

  const cycleCategory = () => {
    if (!selectedCategory) {
      setSelectedCategory(categories[0] ?? null);
      return;
    }
    const idx = categories.indexOf(selectedCategory);
    if (idx === -1 || idx === categories.length - 1) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categories[idx + 1]);
    }
  };

  const cycleDietary = () => {
    if (!selectedDietary) {
      setSelectedDietary(dietaryTags[0] ?? null);
      return;
    }
    const idx = dietaryTags.indexOf(selectedDietary);
    if (idx === -1 || idx === dietaryTags.length - 1) {
      setSelectedDietary(null);
    } else {
      setSelectedDietary(dietaryTags[idx + 1]);
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
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Dishes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/new-dish')}
          >
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar + Filter Chips */}
        <View style={styles.controlsSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes, descriptions, or restaurants..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                favoritesOnly && styles.filterChipActive,
              ]}
              onPress={() => setFavoritesOnly((prev) => !prev)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  favoritesOnly && styles.filterChipTextActive,
                ]}
              >
                ★ Favorites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory && styles.filterChipActive,
              ]}
              onPress={cycleCategory}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory && styles.filterChipTextActive,
                ]}
              >
                {selectedCategory
                  ? `Category: ${selectedCategory}`
                  : 'Category: All'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDietary && styles.filterChipActive,
              ]}
              onPress={cycleDietary}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDietary && styles.filterChipTextActive,
                ]}
              >
                {selectedDietary
                  ? `Dietary: ${selectedDietary}`
                  : 'Dietary: All'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Dish Cards List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredDishes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No dishes found</Text>
              <Text style={styles.emptySubtitle}>
                {dishes.length === 0
                  ? 'Tap "+ New" in the top right to log your first dish.'
                  : 'Try clearing your search or filters.'}
              </Text>
            </View>
          ) : (
            filteredDishes.map((dish) => {
              const restaurantName =
                restaurantMap[dish.restaurantId] || 'Unknown Restaurant';

              return (
                <View key={dish.id} style={styles.card}>
                  {/* Square 1:1 Dish Photo or Compact Header */}
                  {dish.image ? (
                    <View style={styles.coverWrapper}>
                      <Image
                        source={{ uri: dish.image }}
                        style={styles.coverImage}
                        resizeMode="cover"
                      />
                      <View style={styles.cardCornerActions}>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() => toggleFavoriteDish(dish.id)}
                        >
                          <Text
                            style={[
                              styles.starIcon,
                              dish.isFavorite && styles.starIconActive,
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() => confirmDelete(dish.id, dish.name)}
                        >
                          <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.noCoverHeader}>
                      <Text style={styles.restaurantRefText}>
                        {restaurantName}
                      </Text>
                      <View style={styles.inlineActions}>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() => toggleFavoriteDish(dish.id)}
                        >
                          <Text
                            style={[
                              styles.starIcon,
                              dish.isFavorite && styles.starIconActive,
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() => confirmDelete(dish.id, dish.name)}
                        >
                          <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Card Body */}
                  <View style={styles.cardBody}>
                    {/* Dish Name + Price */}
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      {dish.price > 0 && (
                        <View style={styles.priceBadge}>
                          <Text style={styles.priceText}>
                            ${dish.price.toFixed(2)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Linked Restaurant Name (shown here when photo is present) */}
                    {dish.image && (
                      <Text style={styles.restaurantRefText}>
                        {restaurantName}
                      </Text>
                    )}

                    {/* Category & Dietary Tag Pills */}
                    <View style={styles.tagsRow}>
                      <View style={styles.categoryPill}>
                        <Text style={styles.pillText}>{dish.category}</Text>
                      </View>
                      {dish.dietaryTags.map((tag) => (
                        <View key={tag} style={styles.dietaryPill}>
                          <Text style={styles.dietaryText}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Description */}
                    {dish.description ? (
                      <Text style={styles.descriptionText}>
                        {dish.description}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
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
  addButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* --- SEARCH & FILTERS --- */
  controlsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    height: 42,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* --- DISH CARDS --- */
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    overflow: 'hidden',
  },
  coverWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  noCoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  cardCornerActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  starIconActive: {
    color: '#F59E0B',
  },
  deleteIcon: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  priceBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  restaurantRefText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  categoryPill: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  dietaryPill: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
    marginTop: 2,
  },
});