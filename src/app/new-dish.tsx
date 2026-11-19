import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewDishScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonSkeleton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Dish</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Form Skeleton */}
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Dish ID (Auto-generated) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dish ID (Auto-generated)</Text>
            <View style={[styles.inputSkeleton, styles.readOnlySkeleton]}>
              <Text style={styles.placeholderText}>e.g., DISH-30491</Text>
            </View>
          </View>

          {/* 2. Restaurant ID (Dropdown Selector) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Restaurant</Text>
            <View style={styles.dropdownSkeleton}>
              <Text style={styles.placeholderText}>Select restaurant (Restaurant ID)...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>

          {/* 3. Dish Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dish Name</Text>
            <View style={styles.inputSkeleton}>
              <Text style={styles.placeholderText}>Enter dish name...</Text>
            </View>
          </View>

          {/* 4. Price */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.priceInputSkeleton}>
              <Text style={styles.currencyPrefix}>$</Text>
              <Text style={styles.placeholderText}>0.00</Text>
            </View>
          </View>

          {/* 5. Category Dropdown */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.helperText}>Appetizer, Main, Antipasta, Dessert...</Text>
            </View>
            <View style={styles.dropdownSkeleton}>
              <Text style={styles.placeholderText}>Select a category...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>

          {/* 6. Dietary Tags Dropdown (Customizable in Settings) */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Dietary Tags</Text>
              <Text style={styles.helperText}>Customizable in Settings later</Text>
            </View>
            <View style={styles.dropdownSkeleton}>
              <Text style={styles.placeholderText}>Select dietary tags (e.g., Vegan, GF)...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
            {/* Preview chips showing how multiple selected tags will sit */}
            <View style={styles.selectedChipsRow}>
              <View style={styles.tagChipSkeleton}>
                <Text style={styles.tagChipText}>Vegetarian ×</Text>
              </View>
              <View style={styles.tagChipSkeleton}>
                <Text style={styles.tagChipText}>Gluten-Free ×</Text>
              </View>
            </View>
          </View>

          {/* 7. Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputSkeleton, styles.textAreaSkeleton]}>
              <Text style={styles.placeholderText}>
                Ingredients, portion size, spice level, preparation notes...
              </Text>
            </View>
          </View>

          {/* 8. Single Dish Image Upload Slot */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Dish Photo</Text>
              <Text style={styles.helperText}>Max 1 image</Text>
            </View>
            <View style={styles.singleImageSkeleton}>
              <Text style={styles.imageIcon}>[ + ]</Text>
              <Text style={styles.placeholderText}>Tap to upload 1 dish photo</Text>
            </View>
          </View>

          {/* Save Action Skeleton */}
          <View style={styles.submitButtonSkeleton}>
            <Text style={styles.submitText}>Save Dish</Text>
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
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    gap: 18,
    paddingBottom: 36,
  },
  fieldGroup: {
    gap: 6,
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
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inputSkeleton: {
    height: 46,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  readOnlySkeleton: {
    backgroundColor: '#F3F4F6',
  },
  priceInputSkeleton: {
    height: 46,
    backgroundColor: '#F9FAFB',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  dropdownSkeleton: {
    height: 46,
    backgroundColor: '#F9FAFB',
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
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagChipSkeleton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  textAreaSkeleton: {
    height: 96,
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  singleImageSkeleton: {
    height: 150,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imageIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
  submitButtonSkeleton: {
    marginTop: 8,
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