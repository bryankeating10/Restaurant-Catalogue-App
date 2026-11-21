import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordTakeoutScreen() {
  const router = useRouter();
  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dishMetrics = ['Flavor', 'Size', 'Texture', 'Presentation'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Takeout / Delivery</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: ORDER & RESTAURANT DETAILS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>1. Order Details</Text>

            {/* Takeout vs Delivery Toggle Skeleton */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Order Type</Text>
              <View style={styles.toggleRow}>
                <View style={[styles.toggleOption, styles.toggleOptionActive]}>
                  <Text style={styles.toggleTextActive}>🥡 Takeout</Text>
                </View>
                <View style={styles.toggleOption}>
                  <Text style={styles.toggleText}>🛵 Delivery</Text>
                </View>
              </View>
            </View>

            {/* Restaurant Selector + Quick Create */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Restaurant</Text>
                <TouchableOpacity
                  style={styles.inlineCreateBtn}
                  onPress={() => router.push('/new-restaurant?returnToTakeout=true')}
                >
                  <Text style={styles.inlineCreateText}>+ New Restaurant</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dropdownSkeleton}>
                <Text style={styles.placeholderText}>Select existing restaurant...</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
            </View>

            {/* Optional Packaging & Order Accuracy Rating */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Packaging & Accuracy</Text>
                <Text style={styles.optionalTag}>Optional (1–10)</Text>
              </View>
              <View style={styles.ratingRow}>
                {ratingScale.map((num) => (
                  <View key={num} style={styles.ratingBoxSkeleton}>
                    <Text style={styles.ratingNum}>{num}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Optional Order Total (Captures delivery fees/tips for stats) */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Total Paid (incl. fees/tip)</Text>
                <Text style={styles.optionalTag}>Optional</Text>
              </View>
              <View style={styles.priceInputSkeleton}>
                <Text style={styles.currencyPrefix}>$</Text>
                <Text style={styles.placeholderText}>0.00</Text>
              </View>
            </View>
          </View>

          {/* SECTION 2: DISHES ORDERED (Repeatable Cards) */}
          <View style={styles.sectionCard}>
            <View style={styles.labelRow}>
              <Text style={styles.sectionTitle}>2. Dishes Ordered</Text>
              <TouchableOpacity
                style={styles.inlineCreateBtn}
                onPress={() => router.push('/new-dish?returnToTakeout=true')}
              >
                <Text style={styles.inlineCreateText}>+ New Dish</Text>
              </TouchableOpacity>
            </View>

            {/* Dish #1 Entry Block */}
            <View style={styles.dishItemCard}>
              <View style={styles.labelRow}>
                <Text style={styles.dishHeaderLabel}>Dish #1</Text>
                <Text style={styles.removeDishText}>Remove</Text>
              </View>

              {/* Select Dish Dropdown */}
              <View style={styles.dropdownSkeleton}>
                <Text style={styles.placeholderText}>Select dish from menu...</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>

              {/* Optional 4 Dish Metrics */}
              <View style={styles.metricsBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.subLabel}>Dish Metrics</Text>
                  <Text style={styles.optionalTag}>All optional (tap to rate)</Text>
                </View>

                <View style={styles.metricsGrid}>
                  {dishMetrics.map((metric) => (
                    <View key={metric} style={styles.metricPillSkeleton}>
                      <Text style={styles.metricName}>{metric}</Text>
                      <Text style={styles.metricScore}>-- / 10</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Dish Written Description */}
              <View style={styles.textAreaSkeleton}>
                <Text style={styles.placeholderText}>
                  How did it travel? Written notes (optional)...
                </Text>
              </View>

              {/* Multi-Photo Upload Slot */}
              <View style={styles.photoRowSkeleton}>
                <Text style={styles.photoPrompt}>+ Add Dish Photos (Optional)</Text>
              </View>
            </View>

            {/* Add Another Dish */}
            <View style={styles.addAnotherDishBtn}>
              <Text style={styles.addAnotherText}>+ Add Another Dish to Order</Text>
            </View>
          </View>

          {/* Save Order Action */}
          <View style={styles.submitButtonSkeleton}>
            <Text style={styles.submitText}>Save Takeout / Delivery</Text>
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
  headerSpacer: {
    width: 50,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  fieldGroup: {
    gap: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleOptionActive: {
    borderStyle: 'solid',
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionalTag: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  inlineCreateBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inlineCreateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  dropdownSkeleton: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceInputSkeleton: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
  },
  ratingBoxSkeleton: {
    flex: 1,
    height: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNum: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  dishItemCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  dishHeaderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  removeDishText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricsBlock: {
    gap: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricPillSkeleton: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  metricScore: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  textAreaSkeleton: {
    height: 76,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
  },
  photoRowSkeleton: {
    height: 40,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPrompt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  addAnotherDishBtn: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  submitButtonSkeleton: {
    height: 50,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
});