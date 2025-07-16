import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';

interface CartBadgeProps {
  onPress?: () => void;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CartBadge: React.FC<CartBadgeProps> = ({ 
  onPress, 
  showCount = true, 
  size = 'medium' 
}) => {
  const { colors } = useTheme();
  const { getTotalItems } = useOrder();
  const itemCount = getTotalItems();

  const sizeMap = {
    small: { icon: 16, badge: 12, fontSize: 10 },
    medium: { icon: 20, badge: 16, fontSize: 12 },
    large: { icon: 24, badge: 20, fontSize: 14 },
  };

  const currentSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="bag-outline" 
        size={currentSize.icon} 
        color={colors.textPrimary} 
      />
      {showCount && itemCount > 0 && (
        <View style={[
          styles.badge,
          {
            backgroundColor: colors.primary,
            width: currentSize.badge,
            height: currentSize.badge,
            borderRadius: currentSize.badge / 2,
          }
        ]}>
          <Text style={[
            styles.badgeText,
            {
              color: colors.textInverse,
              fontSize: currentSize.fontSize,
            }
          ]}>
            {itemCount > 99 ? '99+' : itemCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 16,
  },
  badgeText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CartBadge; 