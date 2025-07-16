import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';

const ProofOfDeliveryScreen: React.FC = () => {
  const { colors } = useTheme();
  // Placeholder data
  const deliveryPhoto = 'https://placehold.co/300x200?text=Delivery+Photo';
  const signature = 'Sarah J.';
  const dropOffConfirmed = true;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Proof of Delivery</Text>
        <Card style={styles.photoCard} padding="large">
          <Image source={{ uri: deliveryPhoto }} style={styles.photo} resizeMode="cover" />
        </Card>
        <Card style={styles.infoCard} padding="large">
          <View style={styles.row}>
            <Ionicons name="checkmark-circle-outline" size={24} color={dropOffConfirmed ? colors.success : colors.error} />
            <Text style={[styles.infoText, { color: dropOffConfirmed ? colors.success : colors.error }]}>Drop-off {dropOffConfirmed ? 'Confirmed' : 'Not Confirmed'}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>Signature: {signature}</Text>
          </View>
        </Card>
        <Button title="Leave Feedback" onPress={() => {}} size="large" style={styles.feedbackButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  photoCard: { marginBottom: 16 },
  photo: { width: '100%', height: 200, borderRadius: 16 },
  infoCard: { marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 16, fontWeight: '500', marginLeft: 12 },
  feedbackButton: { marginTop: 16 },
});

export default ProofOfDeliveryScreen; 