import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewRestaurantScreen() {
  const router = useRouter();
  const ratingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
          <Text style={styles.title}>New Restaurant</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Form Skeleton */}
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Restaurant ID (Read-Only / Auto-Generated Placeholder) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Restaurant ID (Auto-generated)</Text>
            <View style={[styles.inputSkeleton, styles.readOnlySkeleton]}>
              <Text style={styles.placeholderText}>e.g., REST-84920</Text>
            </View>
          </View>

          {/* 2. Restaurant Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputSkeleton}>
              <Text style={styles.placeholderText}>Enter restaurant name...</Text>
            </View>
          </View>

          {/* 3. Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputSkeleton}>
              <Text style={styles.placeholderText}>Street, City, State...</Text>
            </View>
          </View>

          {/* 4. Cuisine Dropdown Skeleton */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Cuisine</Text>
              <Text style={styles.helperText}>Customizable in Settings later</Text>
            </View>
            <View style={styles.dropdownSkeleton}>
              <Text style={styles.placeholderText}>Select a cuisine...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>

          {/* 5. Atmosphere Rating (1-10) */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Atmosphere Rating</Text>
              <Text style={styles.helperText}>1 – 10</Text>
            </View>
            <View style={styles.ratingRow}>
              {ratingScale.map((num) => (
                <View key={num} style={styles.ratingBoxSkeleton}>
                  <Text style={styles.ratingNum}>{num}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 6. Service Rating (1-10) */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Service Rating</Text>
              <Text style={styles.helperText}>1 – 10</Text>
            </View>
            <View style={styles.ratingRow}>
              {ratingScale.map((num) => (
                <View key={num} style={styles.ratingBoxSkeleton}>
                  <Text style={styles.ratingNum}>{num}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7. Description (Multi-line Text Area) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputSkeleton, styles.textAreaSkeleton]}>
              <Text style={styles.placeholderText}>
                Notes on vibe, parking, reservations, specialties...
              </Text>
            </View>
          </View>

          {/* 8. Single Restaurant Image Upload Slot */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Restaurant Photo</Text>
              <Text style={styles.helperText}>Max 1 image</Text>
            </View>
            <View style={styles.singleImageSkeleton}>
              <Text style={styles.imageIcon}>[ + ]</Text>
              <Text style={styles.placeholderText}>Tap to upload 1 cover photo</Text>
            </View>
          </View>

          {/* Save Action Skeleton */}
          <View style={styles.submitButtonSkeleton}>
            <Text style={styles.submitText}>Save Restaurant</Text>
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
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  ratingBoxSkeleton: {
    flex: 1,
    height: 38,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingNum: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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