import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();

  // Sample default placeholders for your customizable dropdown lists
  const sampleCuisines = ['Italian', 'Japanese', 'Mexican', 'Thai', 'American'];
  const sampleCategories = ['Appetizer', 'Main', 'Antipasta', 'Dessert', 'Drink'];
  const sampleDietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Lactose-Free'];

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
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. CUSTOM CUISINES (Used in New Restaurant) */}
          <View style={styles.sectionCardSkeleton}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cuisines</Text>
              <Text style={styles.sectionSubtitle}>Dropdown options for Restaurants</Text>
            </View>

            {/* Add New Cuisine Input Row */}
            <View style={styles.addRow}>
              <View style={styles.addInputSkeleton}>
                <Text style={styles.placeholderText}>Add new cuisine (e.g., Korean)...</Text>
              </View>
              <View style={styles.addChipButtonSkeleton}>
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </View>
            </View>

            {/* Current Cuisine Pills */}
            <View style={styles.pillsContainer}>
              {sampleCuisines.map((item) => (
                <View key={item} style={styles.itemPillSkeleton}>
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 2. CUSTOM DISH CATEGORIES (Used in New Dish) */}
          <View style={styles.sectionCardSkeleton}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dish Categories</Text>
              <Text style={styles.sectionSubtitle}>Dropdown options for Dishes</Text>
            </View>

            <View style={styles.addRow}>
              <View style={styles.addInputSkeleton}>
                <Text style={styles.placeholderText}>Add category (e.g., Side, Soup)...</Text>
              </View>
              <View style={styles.addChipButtonSkeleton}>
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </View>
            </View>

            <View style={styles.pillsContainer}>
              {sampleCategories.map((item) => (
                <View key={item} style={styles.itemPillSkeleton}>
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 3. CUSTOM DIETARY TAGS (Used in New Dish) */}
          <View style={styles.sectionCardSkeleton}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dietary Tags</Text>
              <Text style={styles.sectionSubtitle}>Multi-select tags for Dishes</Text>
            </View>

            <View style={styles.addRow}>
              <View style={styles.addInputSkeleton}>
                <Text style={styles.placeholderText}>Add tag (e.g., Nut-Free, Halal)...</Text>
              </View>
              <View style={styles.addChipButtonSkeleton}>
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </View>
            </View>

            <View style={styles.pillsContainer}>
              {sampleDietaryTags.map((item) => (
                <View key={item} style={styles.itemPillSkeleton}>
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 4. GENERAL PREFERENCES & DATA PLACEHOLDERS */}
          <View style={styles.sectionCardSkeleton}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preferences & Data</Text>
              <Text style={styles.sectionSubtitle}>Display & storage options</Text>
            </View>

            <View style={styles.settingRowSkeleton}>
              <Text style={styles.settingRowLabel}>Currency Symbol</Text>
              <View style={styles.valueBadgeSkeleton}>
                <Text style={styles.valueBadgeText}>USD ($) ▼</Text>
              </View>
            </View>

            <View style={styles.settingRowSkeleton}>
              <Text style={styles.settingRowLabel}>Cloud Sync Status</Text>
              <View style={styles.valueBadgeSkeleton}>
                <Text style={styles.valueBadgeText}>Local Only</Text>
              </View>
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
  headerSpacer: {
    width: 50,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },

  /* --- SECTION CARDS --- */
  sectionCardSkeleton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  /* --- ADD INPUT ROW --- */
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addInputSkeleton: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  addChipButtonSkeleton: {
    height: 42,
    paddingHorizontal: 14,
    backgroundColor: '#E5E7EB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChipButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  /* --- TAG PILLS --- */
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemPillSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  itemPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  removeIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },

  /* --- PREFERENCES ROWS --- */
  settingRowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  settingRowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  valueBadgeSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  valueBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});