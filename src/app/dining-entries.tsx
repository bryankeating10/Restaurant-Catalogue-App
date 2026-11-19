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

export default function DiningEntriesScreen() {
  const router = useRouter();
  const entrySkeletons = [1, 2, 3, 4];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Back button, Title, and + New Dining Entry action */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSkeleton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Dining Entries</Text>
          <TouchableOpacity
            style={styles.addButtonSkeleton}
            onPress={() => router.push('/new-dining-entry')}
          >
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar + Filter Row */}
        <View style={styles.controlsSection}>
          <View style={styles.searchSkeleton}>
            <Text style={styles.placeholderText}>Search entries, dishes, or notes...</Text>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>★ Favorites</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Dish ▼</Text>
            </View>
            <View style={styles.filterChipSkeleton}>
              <Text style={styles.filterChipText}>Sort: Recent ▼</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Dining Entries List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {entrySkeletons.map((item) => (
            <View key={item} style={styles.cardSkeleton}>
              {/* Top Section: Multi-Image Strip Placeholder + Action Icons */}
              <View style={styles.multiImageBannerSkeleton}>
                <View style={styles.photoThumbSlot}>
                  <Text style={styles.photoThumbText}>Photo 1</Text>
                </View>
                <View style={styles.photoThumbSlot}>
                  <Text style={styles.photoThumbText}>Photo 2</Text>
                </View>
                <View style={styles.photoThumbSlot}>
                  <Text style={styles.photoThumbText}>+ More</Text>
                </View>

                <View style={styles.cardCornerActions}>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>★</Text>
                  </View>
                  <View style={styles.iconBadgeSkeleton}>
                    <Text style={styles.iconText}>🗑</Text>
                  </View>
                </View>
              </View>

              {/* Card Body: Mapped directly to your Dining Entry fields */}
              <View style={styles.cardBody}>
                {/* Row 1: Dish Reference + Entry ID */}
                <View style={styles.metaRow}>
                  <View style={styles.dishPillSkeleton}>
                    <Text style={styles.pillText}>Dish: #DISH-00{item}</Text>
                  </View>
                  <Text style={styles.idText}>ID: #ENTRY-00{item}</Text>
                </View>

                {/* Row 2: Description Preview */}
                <View style={styles.descriptionGroup}>
                  <View style={styles.descLineFull} />
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

  /* --- ENTRY CARDS --- */
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
  multiImageBannerSkeleton: {
    height: 110,
    backgroundColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    position: 'relative',
  },
  photoThumbSlot: {
    flex: 1,
    height: 82,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoThumbText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  cardCornerActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  iconBadgeSkeleton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardBody: {
    padding: 14,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPillSkeleton: {
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
  idText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    width: '68%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});