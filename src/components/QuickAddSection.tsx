import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';

interface QuickAddItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: Array<{
    categoryId: string;
    itemId: string;
    quantity: number;
  }>;
  totalPrice: number;
}

interface QuickAddSectionProps {
  onQuickAdd: (items: QuickAddItem['items']) => void;
  serviceType?: string;
}

const QuickAddSection: React.FC<QuickAddSectionProps> = ({ onQuickAdd, serviceType }) => {
  const { colors } = useTheme();

  // Popular combinations based on service type
  const getQuickAddItems = (): QuickAddItem[] => {
    // Return empty array since we don't have mock data anymore
    // Quick add items should be fetched from Supabase or configured dynamically
    return [];
  };

  const quickAddItems = getQuickAddItems();

  const handleQuickAdd = (item: QuickAddItem) => {
    onQuickAdd(item.items);
  };

  if (quickAddItems.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash-outline" size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Quick Add
        </Text>
      </View>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Popular combinations for quick selection
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {quickAddItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.quickAddCard}
            onPress={() => handleQuickAdd(item)}
            activeOpacity={0.7}
          >
            <Card style={styles.cardContent} padding="medium">
              <View style={styles.itemHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.itemFooter}>
                <Text style={[styles.price, { color: colors.primary }]}>
                  €{item.totalPrice.toFixed(2)}
                </Text>
                <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
                  <Ionicons name="add" size={16} color={colors.textInverse} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  quickAddCard: {
    width: 200,
    marginRight: 12,
  },
  cardContent: {
    height: 120,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuickAddSection; 