import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCatalog } from '../context/CatalogContext';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    cuisines,
    categories,
    dietaryTags,
    addCuisine,
    removeCuisine,
    addCategory,
    removeCategory,
    addDietaryTag,
    removeDietaryTag,
  } = useCatalog();

  const [newCuisine, setNewCuisine] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddCuisine = async () => {
    if (!newCuisine.trim()) return;
    await addCuisine(newCuisine);
    setNewCuisine('');
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory);
    setNewCategory('');
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    await addDietaryTag(newTag);
    setNewTag('');
  };

  const confirmRemove = (label: string, onConfirm: () => Promise<void>) => {
    Alert.alert('Remove Option', `Remove "${label}" from dropdown options?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onConfirm },
    ]);
  };

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
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. CUSTOM CUISINES */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cuisines</Text>
              <Text style={styles.sectionSubtitle}>
                Dropdown options for Restaurants
              </Text>
            </View>

            <View style={styles.addRow}>
              <TextInput
                style={styles.addInput}
                placeholder="Add new cuisine (e.g., Korean)..."
                placeholderTextColor="#9CA3AF"
                value={newCuisine}
                onChangeText={setNewCuisine}
                onSubmitEditing={handleAddCuisine}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addChipButton}
                activeOpacity={0.75}
                onPress={handleAddCuisine}
              >
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pillsContainer}>
              {cuisines.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.itemPill}
                  onPress={() =>
                    confirmRemove(item, () => removeCuisine(item))
                  }
                >
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 2. CUSTOM DISH CATEGORIES */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dish Categories</Text>
              <Text style={styles.sectionSubtitle}>
                Dropdown options for Dishes
              </Text>
            </View>

            <View style={styles.addRow}>
              <TextInput
                style={styles.addInput}
                placeholder="Add category (e.g., Soup, Brunch)..."
                placeholderTextColor="#9CA3AF"
                value={newCategory}
                onChangeText={setNewCategory}
                onSubmitEditing={handleAddCategory}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addChipButton}
                activeOpacity={0.75}
                onPress={handleAddCategory}
              >
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pillsContainer}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.itemPill}
                  onPress={() =>
                    confirmRemove(item, () => removeCategory(item))
                  }
                >
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. CUSTOM DIETARY TAGS */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dietary Tags</Text>
              <Text style={styles.sectionSubtitle}>
                Multi-select tags for Dishes
              </Text>
            </View>

            <View style={styles.addRow}>
              <TextInput
                style={styles.addInput}
                placeholder="Add tag (e.g., Halal, Spicy)..."
                placeholderTextColor="#9CA3AF"
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addChipButton}
                activeOpacity={0.75}
                onPress={handleAddTag}
              >
                <Text style={styles.addChipButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pillsContainer}>
              {dietaryTags.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.itemPill}
                  onPress={() =>
                    confirmRemove(item, () => removeDietaryTag(item))
                  }
                >
                  <Text style={styles.itemPillText}>{item}</Text>
                  <Text style={styles.removeIcon}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 4. STORAGE INFO */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Data & Storage</Text>
              <Text style={styles.sectionSubtitle}>
                Saved locally on this device
              </Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingRowLabel}>Currency</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueBadgeText}>USD ($)</Text>
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingRowLabel}>Storage Mode</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueBadgeText}>Local Device</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },
  sectionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
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
    color: '#6B7280',
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  addChipButton: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChipButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemPill: {
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
    color: '#111827',
  },
  removeIcon: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  settingRow: {
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
  valueBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  valueBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});