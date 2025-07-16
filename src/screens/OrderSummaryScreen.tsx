import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';
import { getValidIcon } from '../utils/icons';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingScreen from '../components/LoadingScreen';
import SuccessCelebration from '../components/SuccessCelebration';
import { RootStackParamList } from '../types/navigation';

type OrderSummaryNavigationProp = StackNavigationProp<RootStackParamList, 'OrderSummary'>;

const OrderSummaryScreen: React.FC = () => {
  const navigation = useNavigation<OrderSummaryNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { state, getTotalItems, getTotalPrice, resetOrder } = useOrder();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = getTotalItems() > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        resetOrder(); // Clear the cart after successful order
        navigation.navigate('OrderTracking', { orderId: 'new-order-123' });
      }, 2000);
    }, 1200);
  };

  const getItemsByService = () => {
    const grouped: { [serviceId: string]: any[] } = {};
    state.items.forEach(item => {
      if (!grouped[item.serviceId]) {
        grouped[item.serviceId] = [];
      }
      grouped[item.serviceId].push(item);
    });
    return grouped;
  };

  if (isProcessing) {
    return <LoadingScreen />;
  }

  if (showCelebration) {
    return <SuccessCelebration visible={true} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Order Summary
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Review your order before confirming
          </Text>
        </View>

        {/* Items by Service */}
        {Object.entries(getItemsByService()).map(([serviceId, items]) => (
          <Card key={serviceId} style={styles.sectionCard} padding="large">
            <View style={styles.sectionHeader}>
              <Ionicons 
                name={getValidIcon(items[0]?.iconName, 'service')} 
                size={24} 
                color={colors.primary} 
              />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {items[0]?.serviceName}
              </Text>
            </View>
            
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Ionicons 
                    name={getValidIcon(item.iconName, 'category')} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: colors.textPrimary }]}>
                      {item.categoryName || item.description || 'Custom Item'}
                    </Text>
                    <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                      Quantity: {item.quantity}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>
                  {formatPrice(item.totalPrice)}
                </Text>
              </View>
            ))}
          </Card>
        ))}

        {/* Schedule */}
        {state.pickupDate && state.deliveryDate && (
          <Card style={styles.sectionCard} padding="large">
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={24} color={colors.info} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Schedule
              </Text>
            </View>
            
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Ionicons name="car-outline" size={20} color={colors.primary} />
                <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>Pickup</Text>
                <Text style={[styles.scheduleValue, { color: colors.textPrimary }]}>
                  {formatDate(state.pickupDate)} at {state.pickupTime}
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Ionicons name="home-outline" size={20} color={colors.success} />
                <Text style={[styles.scheduleLabel, { color: colors.textSecondary }]}>Delivery</Text>
                <Text style={[styles.scheduleValue, { color: colors.textPrimary }]}>
                  {formatDate(state.deliveryDate)} at {state.deliveryTime}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Addresses */}
        {state.pickupAddress && state.deliveryAddress && (
          <Card style={styles.sectionCard} padding="large">
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={24} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Addresses
              </Text>
            </View>
            
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>Pickup</Text>
                <Text style={[styles.addressValue, { color: colors.textPrimary }]}>
                  {state.pickupAddress}
                </Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>Delivery</Text>
                <Text style={[styles.addressValue, { color: colors.textPrimary }]}>
                  {state.deliveryAddress}
                </Text>
              </View>
            </View>
            
            {state.deliveryNotes && (
              <View style={styles.notesRow}>
                <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>Instructions</Text>
                <Text style={[styles.notesValue, { color: colors.textPrimary }]}>
                  {state.deliveryNotes}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Price Breakdown */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Price Breakdown
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Service</Text>
            <Text style={[styles.priceValue, { color: colors.textPrimary }]}>{formatPrice(subtotal)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
            <Text style={[styles.priceValue, { color: colors.textPrimary }]}>{formatPrice(deliveryFee)}</Text>
          </View>
          
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(total)}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Confirm Order Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title={`Confirm Order (${formatPrice(total)})`}
          onPress={handleConfirmOrder}
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '400',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleItem: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressItem: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  notesRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default OrderSummaryScreen; 