import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
import Card from '../components/Card';
import Button from '../components/Button';
import OrderProgress from '../components/OrderProgress';
import { RootStackParamList } from '../types/navigation';

type CartNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { 
    state, 
    updateItemQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice,
    getItemsByService 
  } = useOrder();

  const itemsByService = getItemsByService();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const deliveryFee = totalItems > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    const item = state.items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + (increment ? 1 : -1));
      updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItem(itemId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleContinue = () => {
    if (totalItems > 0) {
      navigation.navigate('TimeSlotSelection');
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  if (totalItems === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <OrderProgress currentStep={3} />
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Add some items to get started
          </Text>
          <Button
            title="Browse Services"
            onPress={() => navigation.navigate('ServiceSelection')}
            size="large"
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Indicator */}
      <OrderProgress currentStep={3} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Your Cart
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} selected
          </Text>
          {totalItems > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={[styles.clearText, { color: colors.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items by Service */}
        {Object.entries(itemsByService).map(([serviceId, items]) => (
          <Card key={serviceId} style={styles.serviceCard} padding="large">
            <View style={styles.serviceHeader}>
              <Ionicons 
                name={getValidIcon(items[0]?.iconName, 'service')} 
                size={24} 
                color={colors.primary} 
              />
              <Text style={[styles.serviceName, { color: colors.textPrimary }]}>
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
                      {item.categoryName ? `${item.categoryName} - ${item.description || 'Item'}` : item.description || 'Custom Item'}
                    </Text>
                    <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                      {formatPrice(item.unitPrice)} each
                    </Text>
                  </View>
                </View>
                
                <View style={styles.itemActions}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={[styles.quantityButton, { 
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border 
                      }]}
                      onPress={() => handleQuantityChange(item.id, false)}
                      disabled={item.quantity <= 1}
                    >
                      <Ionicons name="remove" size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.quantityText, { color: colors.textPrimary }]}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={[styles.quantityButton, { 
                        backgroundColor: colors.primary,
                        borderColor: colors.primary 
                      }]}
                      onPress={() => handleQuantityChange(item.id, true)}
                    >
                      <Ionicons name="add" size={16} color={colors.textInverse} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.itemTotal}>
                    <Text style={[styles.totalText, { color: colors.primary }]}>
                      {formatPrice(item.totalPrice)}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Ionicons name="close-circle-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        ))}

        {/* Summary */}
        <Card style={styles.summaryCard} padding="large">
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {formatPrice(deliveryFee)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {formatPrice(total)}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title={`Continue to Schedule (${formatPrice(total)})`}
          onPress={handleContinue}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    marginTop: 16,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  itemPrice: {
    fontSize: 14,
    fontWeight: '400',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
    marginTop: 8,
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

export default CartScreen; 