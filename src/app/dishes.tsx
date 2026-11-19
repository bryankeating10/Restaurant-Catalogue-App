import { useRouter } from 'expo-router';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DishesScreen() {
  const router = useRouter();
  const dishSkeletons = [1, 2, 3, 4];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Back button, Title, and + New Dish action */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSkeleton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Dishes</Text>
          <TouchableOpacity
            style={styles.addButtonSkeleton}
            onPress={() => router.push('/new-dish')}
          >
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar + Filter Row (Favorites, Category, Dietary) */}
        <View style={styles.controlsSection}>
          <View style={styles.searchSkeleton}>
            <Text style={styles.placeholderText}>Search dishes or restaurants...</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>★ Favorites</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Category ▼</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Dietary ▼</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Dish Cards List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {dishSkeletons.map((item) => (
            <View key={item} style={styles.cardSkeleton}>
              {/* Top Section: Single Dish Photo + Action Icons */}
              <View style={styles.coverImageSkeleton}>
                <Text style={styles.coverHint}>1 Dish Photo</Text>
                <View style={styles.cardCornerActions}>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>★</Text>
                  </View>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>🗑</Text>
                  </View>
                </View>
              </View>

              {/* Card Body: Mapped directly to your Dish fields */}
              <View style={styles.cardBody}>
                {/* Row 1: Dish Name + Price */}
                <View style={styles.cardTitleRow}>
                  <View style={styles.namePlaceholder} />
                  <View style={styles.priceBadgeSkeleton}>
                    <Text style={styles.priceText}>$--.--</Text>
                  </View>
                </View>

                {/* Row 2: Linked Restaurant + Dish ID */}
                <View style={styles.metaRow}>
                  <Text style={styles.restaurantRefText}>Restaurant: #REST-00{item}</Text>
                  <Text style={styles.idText}>ID: #DISH-00{item}</Text>
                </View>

                {/* Row 3: Category & Dietary Tags */}
                <View style={styles.tagsRow}>
                  <View style={styles.categoryPillSkeleton}>
                    <Text style={styles.pillText}>Category</Text>
                  </View>
                  <View style={styles.dietaryPillSkeleton}>
                    <Text style={styles.dietaryText}>+ Dietary Tag</Text>
                  </View>
                  <View style={styles.dietaryPillSkeleton}>
                    <Text style={styles.dietaryText}>+ Dietary Tag</Text>
                  </View>
                </View>

                {/* Row 4: Description Preview */}
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

  /* --- DISH CARDS --- */
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
    height: 115,
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
    width: '58%',
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
  priceBadgeSkeleton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantRefText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  idText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryPillSkeleton: {
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
  dietaryPillSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietaryText: {
    fontSize: 11,
    color: '#6B7280',
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
    width: '72%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});