import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const recentSkeletons = [1, 2, 3, 4, 5];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* App Header with Settings Placeholder */}
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Catalog</Text>
          <View style={styles.settingsSkeleton}>
            <Text style={styles.settingsText}>⚙</Text>
          </View>
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
              onPress={() => router.push('/dining-entries')}
            >
              <Text style={styles.activeLabel}>Dining Entries</Text>
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

        {/* BOTTOM HALF: Recent Additions Skeleton List */}
        <View style={styles.bottomHalf}>
          <Text style={styles.sectionTitle}>Recent Additions</Text>

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {recentSkeletons.map((item) => (
              <View key={item} style={styles.skeletonRow}>
                <View style={styles.skeletonAvatar} />
                <View style={styles.skeletonTextGroup}>
                  <View style={styles.skeletonTitleBar} />
                  <View style={styles.skeletonSubtitleBar} />
                </View>
                <View style={styles.skeletonBadge} />
              </View>
            ))}
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
  settingsSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 18,
    color: '#6B7280',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 12,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  skeletonTextGroup: {
    flex: 1,
    gap: 8,
  },
  skeletonTitleBar: {
    height: 14,
    width: '65%',
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  skeletonSubtitleBar: {
    height: 10,
    width: '40%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  skeletonBadge: {
    width: 54,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E5E7EB',
  },
});