import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';

interface RecentActivityItem {
  id: string;
  kind: 'Restaurant' | 'Dish' | 'Visit' | 'Takeout' | 'Delivery';
  title: string;
  subtitle: string;
  timestamp: string;
  image?: string;
  route: '/restaurants' | '/dishes' | '/dining-entries';
}

export default function HomeScreen() {
  const router = useRouter();
  const { restaurants, dishes, entries } = useCatalog();

  const recentFeed = useMemo(() => {
    const restMap: Record<string, string> = {};
    restaurants.forEach((r) => {
      restMap[r.id] = r.name;
    });

    const items: RecentActivityItem[] = [];

    restaurants.forEach((r) => {
      items.push({
        id: r.id,
        kind: 'Restaurant',
        title: r.name,
        subtitle: r.cuisine,
        timestamp: r.createdAt,
        image: r.coverImage,
        route: '/restaurants',
      });
    });

    dishes.forEach((d) => {
      items.push({
        id: d.id,
        kind: 'Dish',
        title: d.name,
        subtitle: `${restMap[d.restaurantId] || 'Restaurant'} · ${d.category}`,
        timestamp: d.createdAt,
        image: d.image,
        route: '/dishes',
      });
    });

    entries.forEach((e) => {
      const kindLabel =
        e.type === 'visit'
          ? 'Visit'
          : e.type === 'takeout'
          ? 'Takeout'
          : 'Delivery';
      const firstPhoto = e.dishReviews.flatMap((rev) => rev.photos)[0];
      items.push({
        id: e.id,
        kind: kindLabel,
        title: restMap[e.restaurantId] || 'Dining Entry',
        subtitle: `${e.dishReviews.length} ${
          e.dishReviews.length === 1 ? 'dish' : 'dishes'
        }${typeof e.totalCost === 'number' ? ` · $${e.totalCost.toFixed(2)}` : ''}`,
        timestamp: e.visitedAt,
        image: firstPhoto,
        route: '/dining-entries',
      });
    });

    return items
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 12);
  }, [restaurants, dishes, entries]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* App Header with Linked Settings Gear Button */}
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Catalog</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsText}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* TOP HALF: 2x2 Grid of 4 Action Buttons */}
        <View style={styles.topHalf}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.activeButton}
              activeOpacity={0.7}
              onPress={() => router.push('/restaurants')}
            >
              <Text style={styles.activeLabel}>Restaurants</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.activeButton}
              activeOpacity={0.7}
              onPress={() => router.push('/dishes')}
            >
              <Text style={styles.activeLabel}>Dishes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.activeButton}
              activeOpacity={0.7}
              onPress={() => router.push('/new-entry')}
            >
              <Text style={styles.activeLabel}>+ New Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.activeButton}
              activeOpacity={0.7}
              onPress={() => router.push('/dining-statistics')}
            >
              <Text style={styles.activeLabel}>Dining Statistics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM HALF: Live Recent Additions List */}
        <View style={styles.bottomHalf}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Additions</Text>
            <TouchableOpacity onPress={() => router.push('/dining-entries')}>
              <Text style={styles.viewAllText}>All Entries →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {recentFeed.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Your catalog is empty</Text>
                <Text style={styles.emptySubtitle}>
                  Add a restaurant or tap "+ New Entry" above to start logging
                  meals.
                </Text>
              </View>
            ) : (
              recentFeed.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentRow}
                  activeOpacity={0.75}
                  onPress={() => router.push(item.route)}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarInitial}>
                        {item.title.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.textGroup}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.rowSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>

                  <View style={styles.kindBadge}>
                    <Text style={styles.kindBadgeText}>{item.kind}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 18,
    color: '#111827',
  },
  topHalf: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 12,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  activeButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#111827',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  activeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  bottomHalf: {
    flex: 1,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    gap: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  kindBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
  },
  kindBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
});