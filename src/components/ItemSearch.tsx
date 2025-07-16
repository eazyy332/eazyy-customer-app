import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';

interface SearchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  categoryId: string;
  iconName?: string;
}

interface ItemSearchProps {
  allItems: SearchItem[];
  onItemSelect: (item: SearchItem) => void;
  selectedItems: { [key: string]: number };
  onQuantityChange: (itemId: string, increment: boolean) => void;
}

const ItemSearch: React.FC<ItemSearchProps> = ({ 
  allItems, 
  onItemSelect, 
  selectedItems, 
  onQuantityChange 
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return allItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  const handleItemPress = (item: SearchItem) => {
    if (selectedItems[item.id]) {
      onQuantityChange(item.id, true);
    } else {
      onItemSelect(item);
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const renderSearchItem = ({ item }: { item: SearchItem }) => {
    const quantity = selectedItems[item.id] || 0;
    
    return (
      <TouchableOpacity
        style={styles.searchItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemInfo}>
          <Ionicons 
            name={item.iconName as any || 'shirt-outline'} 
            size={20} 
            color={colors.textSecondary} 
          />
          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>
              {item.categoryName}
            </Text>
            <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            {formatPrice(item.price)}
          </Text>
          {quantity > 0 && (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.quantityButton, { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border 
                }]}
                onPress={() => onQuantityChange(item.id, false)}
              >
                <Ionicons name="remove" size={12} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: colors.textPrimary }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={[styles.quantityButton, { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary 
                }]}
                onPress={() => onQuantityChange(item.id, true)}
              >
                <Ionicons name="add" size={12} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchToggle}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.searchToggleContent}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
            Search for items...
          </Text>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color={colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <Card style={styles.searchCard} padding="medium">
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { 
                color: colors.textPrimary,
                backgroundColor: colors.backgroundSecondary
              }]}
              placeholder="Type to search items..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {searchQuery.length > 0 && (
            <View style={styles.resultsContainer}>
              {filteredItems.length > 0 ? (
                <FlatList
                  data={filteredItems}
                  renderItem={renderSearchItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  style={styles.resultsList}
                />
              ) : (
                <View style={styles.noResults}>
                  <Ionicons name="search-outline" size={32} color={colors.textTertiary} />
                  <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                    No items found for "{searchQuery}"
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchToggle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
  },
  searchToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  searchCard: {
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  resultsContainer: {
    maxHeight: 300,
  },
  resultsList: {
    flex: 1,
  },
  searchItem: {
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
  itemCategory: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ItemSearch; 