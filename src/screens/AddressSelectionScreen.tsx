import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';
import Button from '../components/Button';
import Card from '../components/Card';
import OrderProgress from '../components/OrderProgress';
import { RootStackParamList } from '../types/navigation';
import { useTranslation } from 'react-i18next';

type AddressSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'AddressSelection'>;

const AddressSelectionScreen: React.FC = () => {
  const navigation = useNavigation<AddressSelectionNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { setAddresses, getTotalItems } = useOrder();
  const { t } = useTranslation();
  
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<string>('');
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Set smart defaults on component mount
  useEffect(() => {
    // Default to home address for both pickup and delivery
    const homeAddress = savedAddresses.find(addr => addr.type === 'home');
    if (homeAddress) {
      setSelectedPickupAddress(homeAddress.address);
      setSelectedDeliveryAddress(homeAddress.address);
    }
  }, []);

  const savedAddresses = [
    {
      id: 'home',
      name: 'Home',
      address: '123 Main Street, Amsterdam',
      type: 'home',
    },
    {
      id: 'office',
      name: 'Office',
      address: '456 Business Ave, Amsterdam',
      type: 'business',
    },
    {
      id: 'gym',
      name: 'Gym',
      address: '789 Fitness St, Amsterdam',
      type: 'other',
    },
  ];

  const handleContinue = () => {
    if (selectedPickupAddress && selectedDeliveryAddress) {
      setAddresses(selectedPickupAddress, selectedDeliveryAddress, deliveryNotes);
      navigation.navigate('OrderSummary');
    }
  };

  const canContinue = selectedPickupAddress && selectedDeliveryAddress;

  const totalItems = getTotalItems();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Indicator */}
      <OrderProgress currentStep={5} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('address_and_notes')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('pickup_and_delivery_question', { count: totalItems })}</Text>
        </View>

        {/* Pickup Address */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="car-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('pickup_address')}</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t('pickup_address_description')}</Text>
          
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressButton,
                { 
                  backgroundColor: selectedPickupAddress === address.address ? colors.primary : colors.backgroundSecondary,
                  borderColor: selectedPickupAddress === address.address ? colors.primary : colors.border
                }
              ]}
              onPress={() => setSelectedPickupAddress(address.address)}
            >
              <View style={styles.addressContent}>
                <Ionicons 
                  name={address.type === 'home' ? 'home-outline' : address.type === 'business' ? 'business-outline' : 'location-outline'} 
                  size={20} 
                  color={selectedPickupAddress === address.address ? colors.textInverse : colors.textSecondary} 
                />
                <View style={styles.addressInfo}>
                  <Text style={[
                    styles.addressName,
                    { color: selectedPickupAddress === address.address ? colors.textInverse : colors.textPrimary }
                  ]}>
                    {address.name}
                  </Text>
                  <Text style={[
                    styles.addressText,
                    { color: selectedPickupAddress === address.address ? colors.textInverse : colors.textSecondary }
                  ]}>
                    {address.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Delivery Address */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="home-outline" size={24} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Delivery Address
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Where should we deliver your cleaned items?
          </Text>
          
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressButton,
                { 
                  backgroundColor: selectedDeliveryAddress === address.address ? colors.success : colors.backgroundSecondary,
                  borderColor: selectedDeliveryAddress === address.address ? colors.success : colors.border
                }
              ]}
              onPress={() => setSelectedDeliveryAddress(address.address)}
            >
              <View style={styles.addressContent}>
                <Ionicons 
                  name={address.type === 'home' ? 'home-outline' : address.type === 'business' ? 'business-outline' : 'location-outline'} 
                  size={20} 
                  color={selectedDeliveryAddress === address.address ? colors.textInverse : colors.textSecondary} 
                />
                <View style={styles.addressInfo}>
                  <Text style={[
                    styles.addressName,
                    { color: selectedDeliveryAddress === address.address ? colors.textInverse : colors.textPrimary }
                  ]}>
                    {address.name}
                  </Text>
                  <Text style={[
                    styles.addressText,
                    { color: selectedDeliveryAddress === address.address ? colors.textInverse : colors.textSecondary }
                  ]}>
                    {address.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Delivery Notes */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.info} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('delivery_notes')}</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t('delivery_notes_description')}</Text>
          <TextInput
            style={[styles.notesInput, { 
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: colors.backgroundSecondary
            }]}
            placeholder={t('delivery_notes_placeholder')}
            placeholderTextColor={colors.textTertiary}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard} padding="medium">
          <View style={styles.infoContent}>
            <Ionicons name="information-circle-outline" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('pickup_delivery_notification')}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title={t('continue_to_review')}
          onPress={handleContinue}
          disabled={!canContinue}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  addressButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '400',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default AddressSelectionScreen; 