import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewEntryScreen() {
  const router = useRouter();

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
          <Text style={styles.title}>New Entry</Text>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/dining-entries')}
          >
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Two Large Mode Selection Cards */}
        <View style={styles.choicesContainer}>
          <Text style={styles.promptText}>What kind of meal are you logging?</Text>

          <TouchableOpacity
            style={styles.choiceCard}
            activeOpacity={0.75}
            onPress={() => router.push('/record-visit')}
          >
            <Text style={styles.choiceTitle}>🍽️ Record a Visit</Text>
            <Text style={styles.choiceSubtitle}>
              Dine-in experience with restaurant atmosphere & service ratings, plus multiple dishes.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.choiceCard}
            activeOpacity={0.75}
            onPress={() => router.push('/record-takeout')}
          >
            <Text style={styles.choiceTitle}>🥡 Record Takeout or Delivery</Text>
            <Text style={styles.choiceSubtitle}>
              Off-premise meal focusing on dish reviews, packaging, and delivery/pickup notes.
            </Text>
          </TouchableOpacity>
        </View>
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
  historyButton: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  choicesContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 16,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 4,
  },
  choiceCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#111827',
    borderRadius: 16,
    padding: 22,
    gap: 8,
  },
  choiceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  choiceSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
});