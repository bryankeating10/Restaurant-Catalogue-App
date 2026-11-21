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

function formatTimeSince(isoDate: string | null): string {
  if (!isoDate) return 'No visits yet';
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Visited today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

export default function RestaurantsScreen() {
  const router = useRouter();
  const {
    restaurants,
    cuisines,
    toggleFavoriteRestaurant,
    deleteRestaurant,
    getRestaurantStats,
  } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (favoritesOnly && !r.isFavorite) return false;
      if (selectedCuisine && r.cuisine !== selectedCuisine) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesAddress = r.address.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress) return false;
      }
      return true;
    });
  }, [restaurants, favoritesOnly, selectedCuisine, searchQuery]);

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Restaurant',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRestaurant(id),
        },
      ]
    );
  };

  const cycleCuisineFilter = () => {
    if (!selectedCuisine) {
      setSelectedCuisine(cuisines[0] ?? null);
      return;
    }
    const idx = cuisines.indexOf(selectedCuisine);
    if (idx === -1 || idx === cuisines.length - 1) {
      setSelectedCuisine(null);
    } else {
      setSelectedCuisine(cuisines[idx + 1]);
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
          <Text style={styles.title}>Restaurants</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/new-restaurant')}
          >
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar + Filter Row */}
        <View style={styles.controlsSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or address..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.filterRow}>
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
                selectedCuisine && styles.filterChipActive,
              ]}
              onPress={cycleCuisineFilter}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCuisine && styles.filterChipTextActive,
                ]}
              >
                {selectedCuisine ? `Cuisine: ${selectedCuisine}` : 'Cuisine: All'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Cards List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No restaurants found</Text>
              <Text style={styles.emptySubtitle}>
                {restaurants.length === 0
                  ? 'Tap "+ New" in the top right to add your first restaurant.'
                  : 'Try clearing your search or filters.'}
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => {
              const stats = getRestaurantStats(restaurant.id);
              return (
                <View key={restaurant.id} style={styles.card}>
                  {/* Top Cover Image + Corner Actions */}
                  {restaurant.coverImage ? (
                    <View style={styles.coverWrapper}>
                      <Image
                        source={{ uri: restaurant.coverImage }}
                        style={styles.coverImage}
                      />
                      <View style={styles.cardCornerActions}>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() =>
                            toggleFavoriteRestaurant(restaurant.id)
                          }
                        >
                          <Text
                            style={[
                              styles.starIcon,
                              restaurant.isFavorite && styles.starIconActive,
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() =>
                            confirmDelete(restaurant.id, restaurant.name)
                          }
                        >
                          <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.noCoverHeader}>
                      <View style={styles.cuisinePill}>
                        <Text style={styles.pillText}>{restaurant.cuisine}</Text>
                      </View>
                      <View style={styles.inlineActions}>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() =>
                            toggleFavoriteRestaurant(restaurant.id)
                          }
                        >
                          <Text
                            style={[
                              styles.starIcon,
                              restaurant.isFavorite && styles.starIconActive,
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconBadge}
                          onPress={() =>
                            confirmDelete(restaurant.id, restaurant.name)
                          }
                        >
                          <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Card Body */}
                  <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.restaurantName}>
                        {restaurant.name}
                      </Text>
                      {restaurant.coverImage && (
                        <View style={styles.cuisinePill}>
                          <Text style={styles.pillText}>
                            {restaurant.cuisine}
                          </Text>
                        </View>
                      )}
                    </View>

                    {restaurant.address ? (
                      <Text style={styles.addressText}>
                        {restaurant.address}
                      </Text>
                    ) : null}

                    {/* Aggregated Visit Metrics */}
                    <View style={styles.ratingsRow}>
                      <View style={styles.ratingPill}>
                        <Text style={styles.ratingLabel}>
                          Atmosphere:{' '}
                          {stats.avgAtmosphere !== null
                            ? `${stats.avgAtmosphere} / 10`
                            : '--'}
                        </Text>
                      </View>
                      <View style={styles.ratingPill}>
                        <Text style={styles.ratingLabel}>
                          Service:{' '}
                          {stats.avgService !== null
                            ? `${stats.avgService} / 10`
                            : '--'}
                        </Text>
                      </View>
                    </View>

                    {/* Visit Count & Time Since Last Visit */}
                    <View style={styles.footerMetaRow}>
                      <Text style={styles.metaStatText}>
                        {stats.visitCount}{' '}
                        {stats.visitCount === 1 ? 'entry' : 'entries'}
                      </Text>
                      <Text style={styles.metaStatText}>
                        {formatTimeSince(stats.lastVisitDate)}
                      </Text>
                    </View>
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

  /* --- CARDS --- */
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
    height: 140,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
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
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  cuisinePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
  },
  ratingsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  ratingPill: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  footerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});