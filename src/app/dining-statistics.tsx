import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';

const PIE_COLORS = [
  '#111827',
  '#4B5563',
  '#9CA3AF',
  '#D97706',
  '#059669',
  '#2563EB',
];

function formatHalfHourBucket(dateIso: string): { key: string; order: number } {
  const d = new Date(dateIso);
  const hours = d.getHours();
  const mins = d.getMinutes() < 30 ? 0 : 30;
  const order = hours * 60 + mins;
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours < 12 ? 'a' : 'p';
  const minStr = mins === 0 ? '00' : '30';
  return { key: `${displayHour}:${minStr}${ampm}`, order };
}

export default function DiningStatisticsScreen() {
  const router = useRouter();
  const { entries, restaurants, dishes } = useCatalog();

  const [period, setPeriod] = useState<'all' | '30d' | 'year'>('all');

  const cyclePeriod = () => {
    setPeriod((prev) =>
      prev === 'all' ? '30d' : prev === '30d' ? 'year' : 'all'
    );
  };

  const periodLabels: Record<string, string> = {
    all: 'All Time ▼',
    '30d': 'Last 30d ▼',
    year: 'This Year ▼',
  };

  const stats = useMemo(() => {
    const now = new Date();
    const filtered = entries.filter((e) => {
      const d = new Date(e.visitedAt);
      if (period === '30d') {
        return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
      }
      if (period === 'year') {
        return d.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const restMap: Record<string, { name: string; cuisine: string }> = {};
    restaurants.forEach((r) => {
      restMap[r.id] = { name: r.name, cuisine: r.cuisine };
    });

    const dishPriceMap: Record<string, number> = {};
    dishes.forEach((d) => {
      dishPriceMap[d.id] = d.price;
    });

    // Determine effective cost per entry (explicit totalCost, or sum of dish prices if > 0)
    const entryCosts: { cost: number; monthKey: string; cuisine: string }[] =
      [];

    filtered.forEach((e) => {
      const d = new Date(e.visitedAt);
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const cuisine = restMap[e.restaurantId]?.cuisine || 'Other';

      let cost = typeof e.totalCost === 'number' ? e.totalCost : 0;
      if (cost === 0) {
        cost = e.dishReviews.reduce(
          (sum, rev) => sum + (dishPriceMap[rev.dishId] || 0),
          0
        );
      }
      if (cost > 0) {
        entryCosts.push({ cost, monthKey, cuisine });
      }
    });

    const avgEatOutCost =
      entryCosts.length > 0
        ? entryCosts.reduce((s, item) => s + item.cost, 0) / entryCosts.length
        : null;

    // Average monthly cost across active months
    const monthlyTotals: Record<string, number> = {};
    entryCosts.forEach(({ cost, monthKey }) => {
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + cost;
    });
    const activeMonths = Object.values(monthlyTotals);
    const avgMonthlyCost =
      activeMonths.length > 0
        ? activeMonths.reduce((s, v) => s + v, 0) / activeMonths.length
        : null;

    // Cuisine breakdown
    const cuisineCounts: Record<string, number> = {};
    filtered.forEach((e) => {
      const c = restMap[e.restaurantId]?.cuisine || 'Other';
      cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
    });
    const totalEntries = filtered.length;
    const cuisineBreakdown = Object.entries(cuisineCounts)
      .map(([cuisine, count], idx) => ({
        cuisine,
        count,
        pct: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
        color: PIE_COLORS[idx % PIE_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);

    // Half-hour histogram
    const bucketMap: Record<string, { label: string; order: number; count: number }> = {};
    filtered.forEach((e) => {
      const { key, order } = formatHalfHourBucket(e.visitedAt);
      if (!bucketMap[key]) {
        bucketMap[key] = { label: key, order, count: 0 };
      }
      bucketMap[key].count += 1;
    });
    const histogramBuckets = Object.values(bucketMap).sort(
      (a, b) => a.order - b.order
    );
    const maxBucketCount = histogramBuckets.reduce(
      (m, b) => Math.max(m, b.count),
      1
    );

    // Dining frequency per week
    let perWeek: number | null = null;
    if (filtered.length > 0) {
      const sortedDates = filtered
        .map((e) => new Date(e.visitedAt).getTime())
        .sort((a, b) => a - b);
      const spanWeeks = Math.max(
        1,
        (now.getTime() - sortedDates[0]) / (7 * 24 * 60 * 60 * 1000)
      );
      perWeek = Math.round((filtered.length / spanWeeks) * 10) / 10;
    }

    // Best value cuisine (highest avg rating / avg cost)
    const cuisineScores: Record<string, { scores: number[]; costs: number[] }> =
      {};
    filtered.forEach((e) => {
      const c = restMap[e.restaurantId]?.cuisine || 'Other';
      if (!cuisineScores[c]) cuisineScores[c] = { scores: [], costs: [] };
      if (typeof e.atmosphereRating === 'number')
        cuisineScores[c].scores.push(e.atmosphereRating);
      if (typeof e.serviceRating === 'number')
        cuisineScores[c].scores.push(e.serviceRating);
      e.dishReviews.forEach((rev) => {
        if (typeof rev.flavor === 'number')
          cuisineScores[c].scores.push(rev.flavor);
      });
      if (typeof e.totalCost === 'number' && e.totalCost > 0) {
        cuisineScores[c].costs.push(e.totalCost);
      }
    });

    let bestValueCuisine: string | null = null;
    let bestRatio = -1;
    Object.entries(cuisineScores).forEach(([c, data]) => {
      if (data.scores.length > 0 && data.costs.length > 0) {
        const avgS =
          data.scores.reduce((s, n) => s + n, 0) / data.scores.length;
        const avgC = data.costs.reduce((s, n) => s + n, 0) / data.costs.length;
        const ratio = avgS / avgC;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestValueCuisine = c;
        }
      }
    });

    // Top-rated restaurants leaderboard
    const restScores: Record<string, { name: string; cuisine: string; scores: number[]; visits: number }> = {};
    filtered.forEach((e) => {
      const info = restMap[e.restaurantId];
      if (!info) return;
      if (!restScores[e.restaurantId]) {
        restScores[e.restaurantId] = {
          name: info.name,
          cuisine: info.cuisine,
          scores: [],
          visits: 0,
        };
      }
      restScores[e.restaurantId].visits += 1;
      if (typeof e.atmosphereRating === 'number')
        restScores[e.restaurantId].scores.push(e.atmosphereRating);
      if (typeof e.serviceRating === 'number')
        restScores[e.restaurantId].scores.push(e.serviceRating);
      e.dishReviews.forEach((rev) => {
        if (typeof rev.flavor === 'number')
          restScores[e.restaurantId].scores.push(rev.flavor);
      });
    });

    const leaderboard = Object.entries(restScores)
      .filter(([, data]) => data.scores.length > 0)
      .map(([id, data]) => ({
        id,
        name: data.name,
        cuisine: data.cuisine,
        visits: data.visits,
        avgScore:
          Math.round(
            (data.scores.reduce((s, n) => s + n, 0) / data.scores.length) * 10
          ) / 10,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    return {
      totalEntries,
      avgEatOutCost,
      avgMonthlyCost,
      cuisineBreakdown,
      histogramBuckets,
      maxBucketCount,
      perWeek,
      bestValueCuisine,
      leaderboard,
    };
  }, [entries, restaurants, dishes, period]);

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
          <Text style={styles.title}>Dining Statistics</Text>
          <TouchableOpacity style={styles.periodChip} onPress={cyclePeriod}>
            <Text style={styles.periodText}>{periodLabels[period]}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. COST METRICS ROW */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Avg Eat-Out Cost</Text>
              <Text style={styles.kpiValue}>
                {stats.avgEatOutCost !== null
                  ? `$${stats.avgEatOutCost.toFixed(2)}`
                  : '--'}
              </Text>
              <Text style={styles.kpiSubtext}>Per priced entry</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Avg Monthly Cost</Text>
              <Text style={styles.kpiValue}>
                {stats.avgMonthlyCost !== null
                  ? `$${stats.avgMonthlyCost.toFixed(2)}`
                  : '--'}
              </Text>
              <Text style={styles.kpiSubtext}>Across active months</Text>
            </View>
          </View>

          {/* 2. CUISINE BREAKDOWN */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Cuisine Breakdown</Text>
              <Text style={styles.cardSubtitle}>
                {stats.totalEntries}{' '}
                {stats.totalEntries === 1 ? 'entry' : 'entries'} logged
              </Text>
            </View>

            {stats.cuisineBreakdown.length === 0 ? (
              <Text style={styles.emptyChartText}>
                Record a visit or takeout order to see your cuisine breakdown.
              </Text>
            ) : (
              <>
                {/* Proportional Stacked Bar */}
                <View style={styles.stackedBarTrack}>
                  {stats.cuisineBreakdown.map((seg) => (
                    <View
                      key={seg.cuisine}
                      style={[
                        styles.stackedBarSegment,
                        {
                          flex: seg.count,
                          backgroundColor: seg.color,
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Legend Rows */}
                <View style={styles.legendGroup}>
                  {stats.cuisineBreakdown.map((seg) => (
                    <View key={seg.cuisine} style={styles.legendRow}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: seg.color },
                        ]}
                      />
                      <Text style={styles.legendLabel}>{seg.cuisine}</Text>
                      <Text style={styles.legendCount}>({seg.count})</Text>
                      <Text style={styles.legendPct}>{seg.pct}%</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* 3. EATING TIME OF DAY HISTOGRAM (30-Min Buckets) */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Eating Time of Day</Text>
              <Text style={styles.cardSubtitle}>
                Grouped by 30-min intervals
              </Text>
            </View>

            {stats.histogramBuckets.length === 0 ? (
              <Text style={styles.emptyChartText}>
                No meal timestamps recorded yet.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.histogramScrollContent}
              >
                {stats.histogramBuckets.map((bucket) => {
                  const pctHeight = Math.max(
                    14,
                    Math.round((bucket.count / stats.maxBucketCount) * 100)
                  );
                  return (
                    <View key={bucket.label} style={styles.barColumn}>
                      <Text style={styles.barCountText}>{bucket.count}</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${pctHeight}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.barAxisLabel}>{bucket.label}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 4. FREQUENCY & BEST VALUE CUISINE */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Dining Frequency</Text>
              <Text style={styles.kpiValue}>
                {stats.perWeek !== null ? `${stats.perWeek} / wk` : '--'}
              </Text>
              <Text style={styles.kpiSubtext}>
                {stats.totalEntries} total entries
              </Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Best Value Cuisine</Text>
              <Text style={styles.kpiValue} numberOfLines={1}>
                {stats.bestValueCuisine || '--'}
              </Text>
              <Text style={styles.kpiSubtext}>Highest rating / $ spent</Text>
            </View>
          </View>

          {/* 5. TOP-RATED RESTAURANTS LEADERBOARD */}
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Top-Rated Restaurants</Text>
              <Text style={styles.cardSubtitle}>
                Average across visit & dish ratings
              </Text>
            </View>

            {stats.leaderboard.length === 0 ? (
              <Text style={styles.emptyChartText}>
                Rate atmosphere, service, or dishes on a visit to build your
                leaderboard.
              </Text>
            ) : (
              <View style={styles.leaderboardList}>
                {stats.leaderboard.map((item, idx) => (
                  <View key={item.id} style={styles.leaderboardRow}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{idx + 1}</Text>
                    </View>
                    <View style={styles.leaderboardTextGroup}>
                      <Text style={styles.leaderName}>{item.name}</Text>
                      <Text style={styles.leaderSub}>
                        {item.cuisine} · {item.visits}{' '}
                        {item.visits === 1 ? 'entry' : 'entries'}
                      </Text>
                    </View>
                    <View style={styles.scorePill}>
                      <Text style={styles.scoreText}>
                        {item.avgScore} / 10
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
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
  periodChip: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
  kpiCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
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
  chartCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
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
    color: '#6B7280',
  },
  emptyChartText: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingVertical: 12,
  },

  /* --- CUISINE BAR + LEGEND --- */
  stackedBarTrack: {
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    gap: 2,
  },
  stackedBarSegment: {
    height: '100%',
  },
  legendGroup: {
    gap: 8,
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
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  legendCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    width: 36,
    textAlign: 'right',
  },

  /* --- HISTOGRAM --- */
  histogramScrollContent: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 8,
    paddingRight: 8,
  },
  barColumn: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    gap: 4,
  },
  barCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 6,
  },
  barAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },

  /* --- LEADERBOARD --- */
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
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardTextGroup: {
    flex: 1,
    gap: 2,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  leaderSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  scorePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
});