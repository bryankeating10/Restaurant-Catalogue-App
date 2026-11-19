import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  // Placeholder skeleton items for the bottom half
  const recentSkeletons = [1, 2, 3, 4, 5];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* App Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Catalog</Text>
        </View>

        {/* TOP HALF: 2x2 Grid of 4 Skeleton Action Buttons */}
        <View style={styles.topHalf}>
          <View style={styles.gridRow}>
            <View style={styles.skeletonButton}>
              <Text style={styles.skeletonLabel}>+ New Restaurant</Text>
            </View>
            <View style={styles.skeletonButton}>
              <Text style={styles.skeletonLabel}>+ New Dining Entry</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.skeletonButton}>
              <Text style={styles.skeletonLabel}>Favorites</Text>
            </View>
            <View style={styles.skeletonButton}>
              <Text style={styles.skeletonLabel}>Dining Statistics</Text>
            </View>
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
                {/* Left thumbnail placeholder */}
                <View style={styles.skeletonAvatar} />

                {/* Middle text line placeholders */}
                <View style={styles.skeletonTextGroup}>
                  <View style={styles.skeletonTitleBar} />
                  <View style={styles.skeletonSubtitleBar} />
                </View>

                {/* Right badge placeholder (Restaurant vs Entry) */}
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
    // Ensures content clears the status bar on Android devices
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  /* --- TOP HALF (50% of remaining height) --- */
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
  skeletonButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  skeletonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },

  /* --- BOTTOM HALF (50% of remaining height) --- */
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