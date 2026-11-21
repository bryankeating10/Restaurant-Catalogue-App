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

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function DiningEntriesScreen() {
  const router = useRouter();
  const {
    entries,
    restaurants,
    dishes,
    toggleFavoriteEntry,
    deleteDiningEntry,
  } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'visit' | 'takeout' | 'delivery'
  >('all');

  const restaurantMap = useMemo(() => {
    const map: Record<string, string> = {};
    restaurants.forEach((r) => {
      map[r.id] = r.name;
    });
    return map;
  }, [restaurants]);

  const dishMap = useMemo(() => {
    const map: Record<string, string> = {};
    dishes.forEach((d) => {
      map[d.id] = d.name;
    });
    return map;
  }, [dishes]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (favoritesOnly && !entry.isFavorite) return false;
      if (typeFilter !== 'all' && entry.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const restName = (restaurantMap[entry.restaurantId] || '').toLowerCase();
        const notesMatch = (entry.notes || '').toLowerCase().includes(q);
        const dishMatch = entry.dishReviews.some((rev) => {
          const dName = (dishMap[rev.dishId] || '').toLowerCase();
          const dDesc = (rev.description || '').toLowerCase();
          return dName.includes(q) || dDesc.includes(q);
        });
        if (!restName.includes(q) && !notesMatch && !dishMatch) return false;
      }
      return true;
    });
  }, [entries, favoritesOnly, typeFilter, searchQuery, restaurantMap, dishMap]);

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this dining entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDiningEntry(id),
        },
      ]
    );
  };

  const cycleTypeFilter = () => {
    const order: ('all' | 'visit' | 'takeout' | 'delivery')[] = [
      'all',
      'visit',
      'takeout',
      'delivery',
    ];
    const nextIdx = (order.indexOf(typeFilter) + 1) % order.length;
    setTypeFilter(order[nextIdx]);
  };

  const typeLabelMap: Record<string, string> = {
    all: 'Type: All',
    visit: '🍽️ Dine-In Visits',
    takeout: '🥡 Takeout',
    delivery: '🛵 Delivery',
  };

  const badgeMap: Record<string, string> = {
    visit: '🍽️ Visit',
    takeout: '🥡 Takeout',
    delivery: '🛵 Delivery',
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
          <Text style={styles.title}>Dining Entries</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/new-entry')}
          >
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search + Filter Chips */}
        <View style={styles.controlsSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes, or notes..."
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
                typeFilter !== 'all' && styles.filterChipActive,
              ]}
              onPress={cycleTypeFilter}
            >
              <Text
                style={[
                  styles.filterChipText,
                  typeFilter !== 'all' && styles.filterChipTextActive,
                ]}
              >
                {typeLabelMap[typeFilter]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Entries List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No dining entries yet</Text>
              <Text style={styles.emptySubtitle}>
                {entries.length === 0
                  ? 'Tap "+ New" to record a restaurant visit or takeout order.'
                  : 'Try clearing your search or filters.'}
              </Text>
            </View>
          ) : (
            filteredEntries.map((entry) => {
              const restName =
                restaurantMap[entry.restaurantId] || 'Unknown Restaurant';
              const allPhotos = entry.dishReviews.flatMap((r) => r.photos);

              return (
                <View key={entry.id} style={styles.card}>
                  {/* Top Row: Type Badge, Date & Corner Actions */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {badgeMap[entry.type]}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>
                      {formatDateTime(entry.visitedAt)}
                    </Text>
                    <View style={styles.inlineActions}>
                      <TouchableOpacity
                        style={styles.iconBadge}
                        onPress={() => toggleFavoriteEntry(entry.id)}
                      >
                        <Text
                          style={[
                            styles.starIcon,
                            entry.isFavorite && styles.starIconActive,
                          ]}
                        >
                          ★
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconBadge}
                        onPress={() => confirmDelete(entry.id)}
                      >
                        <Text style={styles.deleteIcon}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Restaurant Title & Total Cost */}
                  <View style={styles.titleRow}>
                    <Text style={styles.restaurantName}>{restName}</Text>
                    {typeof entry.totalCost === 'number' && (
                      <View style={styles.costPill}>
                        <Text style={styles.costText}>
                          ${entry.totalCost.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Visit / Packaging Ratings */}
                  {(entry.atmosphereRating !== undefined ||
                    entry.serviceRating !== undefined ||
                    entry.packagingRating !== undefined) && (
                    <View style={styles.ratingsRow}>
                      {entry.atmosphereRating !== undefined && (
                        <View style={styles.ratingPill}>
                          <Text style={styles.ratingLabel}>
                            Atmosphere: {entry.atmosphereRating}/10
                          </Text>
                        </View>
                      )}
                      {entry.serviceRating !== undefined && (
                        <View style={styles.ratingPill}>
                          <Text style={styles.ratingLabel}>
                            Service: {entry.serviceRating}/10
                          </Text>
                        </View>
                      )}
                      {entry.packagingRating !== undefined && (
                        <View style={styles.ratingPill}>
                          <Text style={styles.ratingLabel}>
                            Packaging: {entry.packagingRating}/10
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Overall Entry Notes */}
                  {entry.notes ? (
                    <Text style={styles.notesText}>{entry.notes}</Text>
                  ) : null}

                  {/* Dish Reviews Breakdown */}
                  <View style={styles.dishesBlock}>
                    {entry.dishReviews.map((rev) => {
                      const dName = dishMap[rev.dishId] || 'Dish';
                      const metricParts: string[] = [];
                      if (rev.flavor !== undefined)
                        metricParts.push(`Flavor ${rev.flavor}/10`);
                      if (rev.size !== undefined)
                        metricParts.push(`Size ${rev.size}/10`);
                      if (rev.texture !== undefined)
                        metricParts.push(`Texture ${rev.texture}/10`);
                      if (rev.presentation !== undefined)
                        metricParts.push(`Pres. ${rev.presentation}/10`);

                      return (
                        <View key={rev.id} style={styles.dishReviewRow}>
                          <Text style={styles.dishReviewTitle}>• {dName}</Text>
                          {metricParts.length > 0 && (
                            <Text style={styles.dishMetricsText}>
                              {metricParts.join(' · ')}
                            </Text>
                          )}
                          {rev.description ? (
                            <Text style={styles.dishDescText}>
                              {rev.description}
                            </Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>

                  {/* Horizontal Photo Strip (if photos attached) */}
                  {allPhotos.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.photoStrip}
                    >
                      {allPhotos.map((uri, idx) => (
                        <Image
                          key={`${uri}_${idx}`}
                          source={{ uri }}
                          style={styles.photoThumb}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  )}
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
    padding: 14,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  dateText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  starIconActive: {
    color: '#F59E0B',
  },
  deleteIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  titleRow: {
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
  costPill: {
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  costText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingPill: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
  },
  dishesBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  dishReviewRow: {
    gap: 2,
  },
  dishReviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dishMetricsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    paddingLeft: 10,
  },
  dishDescText: {
    fontSize: 12,
    color: '#6B7280',
    paddingLeft: 10,
  },
  photoStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 2,
  },
  photoThumb: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
});