import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewDiningEntryScreen() {
  const router = useRouter();
  const photoSlots = [1, 2, 3];

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
          <Text style={styles.title}>New Dining Entry</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Form Skeleton */}
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Entry ID (Auto-generated) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Entry ID (Auto-generated)</Text>
            <View style={[styles.inputSkeleton, styles.readOnlySkeleton]}>
              <Text style={styles.placeholderText}>e.g., ENTRY-50182</Text>
            </View>
          </View>

          {/* 2. Dish ID (Dropdown Selector) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dish</Text>
            <View style={styles.dropdownSkeleton}>
              <Text style={styles.placeholderText}>Select dish (Dish ID)...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>

          {/* 3. Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputSkeleton, styles.textAreaSkeleton]}>
              <Text style={styles.placeholderText}>
                How was the dish? Flavor notes, presentation, experience...
              </Text>
            </View>
          </View>

          {/* 4. Multiple Images Upload Grid */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Photos</Text>
              <Text style={styles.helperText}>Multiple images allowed</Text>
            </View>

            <View style={styles.multiImageGrid}>
              {/* Add Photo Button Slot */}
              <View style={styles.addPhotoBoxSkeleton}>
                <Text style={styles.imageIcon}>[ + ]</Text>
                <Text style={styles.addPhotoLabel}>Add Photos</Text>
              </View>

              {/* Preview Thumbnail Placeholders */}
              {photoSlots.map((slot) => (
                <View key={slot} style={styles.photoPreviewSkeleton}>
                  <Text style={styles.previewSlotText}>Img {slot}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Save Action Skeleton */}
          <View style={styles.submitButtonSkeleton}>
            <Text style={styles.submitText}>Save Dining Entry</Text>
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
  textAreaSkeleton: {
    height: 120,
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  multiImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addPhotoBoxSkeleton: {
    width: '48%',
    height: 110,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  imageIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B5563',
  },
  addPhotoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  photoPreviewSkeleton: {
    width: '48%',
    height: 110,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSlotText: {
    fontSize: 12,
    color: '#9CA3AF',
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