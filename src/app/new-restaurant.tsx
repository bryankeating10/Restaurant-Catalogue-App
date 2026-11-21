import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';

export default function NewRestaurantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    returnToVisit?: string;
    returnToTakeout?: string;
  }>();
  const { cuisines, addRestaurant, setPendingRestaurantId } = useCatalog();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [cuisineModalOpen, setCuisineModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Needed',
        'Please allow photo library access to choose a cover photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a restaurant name.');
      return;
    }
    if (!cuisine) {
      Alert.alert('Missing Cuisine', 'Please select a cuisine.');
      return;
    }

    setIsSaving(true);
    try {
      const created = await addRestaurant({
        name: name.trim(),
        address: address.trim(),
        cuisine,
        coverImage,
      });

      // If opened mid-entry, queue this ID so the Visit/Takeout form auto-selects it
      if (params.returnToVisit === 'true' || params.returnToTakeout === 'true') {
        setPendingRestaurantId(created.id);
      }

      router.back();
    } catch {
      Alert.alert('Save Failed', 'Could not save restaurant. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Restaurant</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Restaurant Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Osteria Mozza"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* 2. Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Street, City, State..."
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* 3. Cuisine Selector */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Cuisine *</Text>
              <Text style={styles.helperText}>Customizable in Settings</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownButton}
              activeOpacity={0.7}
              onPress={() => setCuisineModalOpen(true)}
            >
              <Text
                style={
                  cuisine ? styles.dropdownValueText : styles.placeholderText
                }
              >
                {cuisine || 'Select a cuisine...'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Single Cover Image Upload */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Cover Photo</Text>
              <Text style={styles.helperText}>Optional · 1 image</Text>
            </View>

            {coverImage ? (
              <View style={styles.imagePreviewWrapper}>
                <Image
                  source={{ uri: coverImage }}
                  style={styles.previewImage}
                />
                <View style={styles.imageActionRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={pickImage}
                  >
                    <Text style={styles.secondaryBtnText}>Change Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => setCoverImage(undefined)}
                  >
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePickerBox}
                activeOpacity={0.7}
                onPress={pickImage}
              >
                <Text style={styles.imageIcon}>+ Add Cover Photo</Text>
                <Text style={styles.placeholderText}>
                  Tap to choose from photo library
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save Action */}
          <TouchableOpacity
            style={[styles.submitButton, isSaving && styles.submitDisabled]}
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={handleSave}
          >
            <Text style={styles.submitText}>
              {isSaving ? 'Saving...' : 'Save Restaurant'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Cuisine Picker Modal */}
        <Modal
          visible={cuisineModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setCuisineModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Cuisine</Text>
                <TouchableOpacity onPress={() => setCuisineModalOpen(false)}>
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={cuisines}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = item === cuisine;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        selected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setCuisine(item);
                        setCuisineModalOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
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
    width: 60,
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
  textInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
  },
  dropdownButton: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  imagePickerBox: {
    height: 160,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imageIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  imagePreviewWrapper: {
    gap: 10,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  imageActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  removeBtn: {
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },
  submitButton: {
    marginTop: 8,
    height: 52,
    backgroundColor: '#111827',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* --- MODAL --- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  modalClose: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionSelected: {
    backgroundColor: '#F9FAFB',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    fontWeight: '700',
    color: '#111827',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});