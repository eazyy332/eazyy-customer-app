import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';

interface MiniOrderSummaryProps {
  selectedItems: { [key: string]: number };
  allItems: Array<{
    id: string;
    name: string;
    price: number;
    categoryName: string;
  }>;
  onViewCart: () => void;
  onAddToCart: () => void;
  canAddToCart: boolean;
}

const MiniOrderSummary: React.FC<MiniOrderSummaryProps> = ({
  selectedItems,
  allItems,
  onViewCart,
  onAddToCart,
  canAddToCart,
}) => {
  const { colors } = useTheme();

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = allItems.find(i => i.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const getSelectedItemsList = () => {
    return Object.entries(selectedItems)
      .filter(([_, count]) => count > 0)
      .map(([itemId, count]) => {
        const item = allItems.find(i => i.id === itemId);
        return { ...item, quantity: count, id: itemId };
      })
      .filter(item => item.name) // Only include items that have a name
      .slice(0, 3); // Show only first 3 items
  };

  const totalItems = getTotalSelectedItems();
  const totalPrice = getTotalPrice();
  const selectedItemsList = getSelectedItemsList();
  const hasMoreItems = Object.keys(selectedItems).filter(key => selectedItems[key] > 0).length > 3;

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  if (totalItems === 0) return null;

  return (
    <Card style={styles.container} padding="medium">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="bag-outline" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Order Summary
          </Text>
        </View>
        <TouchableOpacity onPress={onViewCart} style={styles.viewCartButton}>
          <Text style={[styles.viewCartText, { color: colors.primary }]}>
            View Cart
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsPreview}>
          {selectedItemsList.map((item) => (
            <View key={item.id} style={styles.itemPreview}>
              <Text style={[styles.itemName, { color: colors.textPrimary }]}>
                {item.name}
              </Text>
              <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                ×{item.quantity}
              </Text>
            </View>
          ))}
          {hasMoreItems && (
            <Text style={[styles.moreItems, { color: colors.textSecondary }]}>
              +{Object.keys(selectedItems).filter(key => selectedItems[key] > 0).length - 3} more items
            </Text>
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Items ({totalItems})
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Delivery
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
              €5.00
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {formatPrice(totalPrice + 5)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.addToCartButton,
          { 
            backgroundColor: canAddToCart ? colors.primary : colors.backgroundSecondary,
            opacity: canAddToCart ? 1 : 0.6
          }
        ]}
        onPress={onAddToCart}
        disabled={!canAddToCart}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="add-circle-outline" 
          size={20} 
          color={canAddToCart ? colors.textInverse : colors.textSecondary} 
        />
        <Text style={[
          styles.addToCartText,
          { color: canAddToCart ? colors.textInverse : colors.textSecondary }
        ]}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  content: {
    marginBottom: 16,
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '500',
  },
  moreItems: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MiniOrderSummary; 