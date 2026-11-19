import { Link, useRouter } from 'expo-router';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantsScreen() {
  const router = useRouter();

  // Placeholder skeleton cards representing saved restaurants
  const restaurantSkeletons = [1, 2, 3, 4];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Back button, Title, and + New Restaurant action */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSkeleton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Restaurants</Text>
          <Link href="/new-restaurant" asChild>
            <TouchableOpacity style={styles.addButtonSkeleton}>
              <Text style={styles.addText}>+ New</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Search Bar + Filter Row (Favorites & Cuisine) */}
        <View style={styles.controlsSection}>
          <View style={styles.searchSkeleton}>
            <Text style={styles.placeholderText}>Search by name or address...</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>★ Favorites</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Cuisine ▼</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Sort: Rating ▼</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Restaurant Cards List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {restaurantSkeletons.map((item) => (
            <View key={item} style={styles.cardSkeleton}>
              {/* Top Section: Single Cover Photo + Action Icons (Favorite / Delete) */}
              <View style={styles.coverImageSkeleton}>
                <Text style={styles.coverHint}>1 Cover Image</Text>
                <View style={styles.cardCornerActions}>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>★</Text>
                  </View>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>🗑</Text>
                  </View>
                </View>
              </View>

              {/* Card Body: Mapped directly to your Restaurant fields */}
              <View style={styles.cardBody}>
                {/* Row 1: Name + Cuisine Pill */}
                <View style={styles.cardTitleRow}>
                  <View style={styles.namePlaceholder} />
                  <View style={styles.cuisinePillSkeleton}>
                    <Text style={styles.pillText}>Cuisine</Text>
                  </View>
                </View>

                {/* Row 2: Address + Auto ID */}
                <View style={styles.metaRow}>
                  <View style={styles.addressPlaceholder} />
                  <Text style={styles.idText}>ID: #000{item}</Text>
                </View>

                {/* Row 3: Atmosphere & Service Ratings (1–10) */}
                <View style={styles.ratingsRow}>
                  <View style={styles.ratingPillSkeleton}>
                    <Text style={styles.ratingLabel}>Atmosphere: -- / 10</Text>
                  </View>
                  <View style={styles.ratingPillSkeleton}>
                    <Text style={styles.ratingLabel}>Service: -- / 10</Text>
                  </View>
                </View>

                {/* Row 4: Description Preview (2 lines) */}
                <View style={styles.descriptionGroup}>
                  <View style={styles.descLineFull} />
                  <View style={styles.descLineShort} />
                </View>
              </View>
            </View>
          ))}
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
  backButtonSkeleton: {
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
  addButtonSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  /* --- SEARCH & FILTERS --- */
  controlsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchSkeleton: {
    height: 42,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChipSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  /* --- RESTAURANT CARDS --- */
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  cardSkeleton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    overflow: 'hidden',
  },
  coverImageSkeleton: {
    height: 120,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coverHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  cardCornerActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  iconBadgeSkeleton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardBody: {
    padding: 14,
    gap: 10,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  namePlaceholder: {
    height: 18,
    width: '55%',
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
  cuisinePillSkeleton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressPlaceholder: {
    height: 12,
    width: '65%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  idText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ratingsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingPillSkeleton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  descriptionGroup: {
    gap: 6,
    marginTop: 2,
  },
  descLineFull: {
    height: 10,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  descLineShort: {
    height: 10,
    width: '75%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});