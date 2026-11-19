import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiningStatisticsScreen() {
  const router = useRouter();

  // Sample bar heights for the half-hour eating time histogram wireframe
  const timeSlots = [
    { label: '11:30', height: 28 },
    { label: '12:00', height: 64 },
    { label: '12:30', height: 82 },
    { label: '13:00', height: 48 },
    { label: '17:30', height: 34 },
    { label: '18:00', height: 70 },
    { label: '18:30', height: 95 },
    { label: '19:00', height: 100 },
    { label: '19:30', height: 76 },
    { label: '20:00', height: 44 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSkeleton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Dining Statistics</Text>
          <View style={styles.periodChipSkeleton}>
            <Text style={styles.periodText}>All Time ▼</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. COST METRICS ROW (Avg Eat-Out Cost & Avg Monthly Cost) */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCardSkeleton}>
              <Text style={styles.kpiLabel}>Avg Eat-Out Cost</Text>
              <Text style={styles.kpiValue}>$--.--</Text>
              <Text style={styles.kpiSubtext}>Per dining entry</Text>
            </View>

            <View style={styles.kpiCardSkeleton}>
              <Text style={styles.kpiLabel}>Avg Monthly Cost</Text>
              <Text style={styles.kpiValue}>$---.--</Text>
              <Text style={styles.kpiSubtext}>Across active months</Text>
            </View>
          </View>

          {/* 2. CUISINE BREAKDOWN PIE CHART */}
          <View style={styles.chartCardSkeleton}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Cuisine Breakdown</Text>
              <Text style={styles.cardSubtitle}>Share of visits & dishes</Text>
            </View>

            <View style={styles.pieSectionRow}>
              {/* Donut / Pie Ring Wireframe */}
              <View style={styles.pieCircleSkeleton}>
                <View style={styles.pieInnerHole}>
                  <Text style={styles.pieCenterNum}>--</Text>
                  <Text style={styles.pieCenterLabel}>Cuisines</Text>
                </View>
              </View>

              {/* Legend Placeholders */}
              <View style={styles.legendGroup}>
                {[1, 2, 3, 4].map((item) => (
                  <View key={item} style={styles.legendRow}>
                    <View style={styles.legendDot} />
                    <View style={styles.legendBar} />
                    <Text style={styles.legendPct}>--%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 3. EATING TIME OF DAY HISTOGRAM (30-Min Buckets) */}
          <View style={styles.chartCardSkeleton}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Eating Time of Day</Text>
              <Text style={styles.cardSubtitle}>Grouped by 30-min intervals</Text>
            </View>

            <View style={styles.histogramContainer}>
              {timeSlots.map((slot) => (
                <View key={slot.label} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFillSkeleton,
                        { height: `${slot.height}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barAxisLabel}>{slot.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 4. ADDITIONAL INSIGHTS: TOP RATED & FREQUENCY */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCardSkeleton}>
              <Text style={styles.kpiLabel}>Dining Frequency</Text>
              <Text style={styles.kpiValue}>-.- / wk</Text>
              <Text style={styles.kpiSubtext}>-- total entries</Text>
            </View>

            <View style={styles.kpiCardSkeleton}>
              <Text style={styles.kpiLabel}>Best Value Cuisine</Text>
              <Text style={styles.kpiValue}>-------</Text>
              <Text style={styles.kpiSubtext}>Highest rating / $ spent</Text>
            </View>
          </View>

          {/* 5. TOP RESTAURANTS LEADERBOARD (Atmosphere + Service Avg) */}
          <View style={styles.chartCardSkeleton}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Top-Rated Restaurants</Text>
              <Text style={styles.cardSubtitle}>Combined Atmosphere & Service</Text>
            </View>

            <View style={styles.leaderboardList}>
              {[1, 2, 3].map((rank) => (
                <View key={rank} style={styles.leaderboardRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{rank}</Text>
                  </View>
                  <View style={styles.leaderboardTextGroup}>
                    <View style={styles.leaderTitleBar} />
                    <View style={styles.leaderSubBar} />
                  </View>
                  <View style={styles.scorePill}>
                    <Text style={styles.scoreText}>-- / 10</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
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
  periodChipSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },

  /* --- KPI METRIC CARDS --- */
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCardSkeleton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 2,
  },
  kpiSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  /* --- CHART CARDS --- */
  chartCardSkeleton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  /* --- PIE CHART SKELETON --- */
  pieSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 4,
  },
  pieCircleSkeleton: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieInnerHole: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
  },
  pieCenterLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  legendGroup: {
    flex: 1,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9CA3AF',
  },
  legendBar: {
    flex: 1,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 32,
    textAlign: 'right',
  },

  /* --- HISTOGRAM SKELETON --- */
  histogramContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 8,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFillSkeleton: {
    width: '100%',
    backgroundColor: '#D1D5DB',
    borderTopWidth: 1.5,
    borderColor: '#9CA3AF',
    borderRadius: 4,
  },
  barAxisLabel: {
    fontSize: 9,
    color: '#6B7280',
    transform: [{ rotate: '-35deg' }],
  },

  /* --- LEADERBOARD SKELETON --- */
  leaderboardList: {
    gap: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  leaderboardTextGroup: {
    flex: 1,
    gap: 6,
  },
  leaderTitleBar: {
    height: 12,
    width: '60%',
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  leaderSubBar: {
    height: 9,
    width: '38%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  scorePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
});