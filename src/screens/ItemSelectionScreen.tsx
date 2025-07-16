import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';
import { categoryService, serviceService } from '../services/database';
import { getValidIcon } from '../utils/icons';
import Button from '../components/Button';
import Card from '../components/Card';
import CartBadge from '../components/CartBadge';
import OrderProgress from '../components/OrderProgress';
import QuickAddSection from '../components/QuickAddSection';
import ItemSearch from '../components/ItemSearch';
import MiniOrderSummary from '../components/MiniOrderSummary';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/formatCurrency';

type ItemSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'ItemSelection'>;
type ItemSelectionRouteProp = RouteProp<RootStackParamList, 'ItemSelection'>;

interface CategoryItem {
  id: string;
  name: string;
  price: number;
  description: string;
  categoryId: string;
  categoryName: string;
  iconName?: string;
}

const ItemSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ItemSelectionNavigationProp>();
  const route = useRoute<ItemSelectionRouteProp>();
  const { serviceType, serviceId } = route.params;
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { addItem, getTotalItems: getCartTotalItems } = useOrder();
  const { user, updateProfile } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const favorites: string[] = user?.preferences?.favorites || [];
  
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [customDescription, setCustomDescription] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryItems, setCategoryItems] = useState<{[categoryId: string]: CategoryItem[]}>({});
  const [expandedCategories, setExpandedCategories] = useState<{[categoryId: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [allItems, setAllItems] = useState<CategoryItem[]>([]);
  const { t } = useTranslation();
  const currency = user?.preferences?.currency || 'EUR';
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  useEffect(() => {
    console.log('ItemSelectionScreen - serviceId:', serviceId, 'serviceType:', serviceType);
    loadServiceAndCategories();
  }, [serviceId]);

  const loadServiceAndCategories = async () => {
    try {
      setLoading(true);
      
      // Load service details
      if (serviceId) {
        const serviceData = await serviceService.getServiceById(serviceId);
        console.log('Service data:', serviceData);
        setService(serviceData);
        
                // Load categories for this service
        const serviceCategories = await categoryService.getCategoriesByService(serviceId);
        console.log('Service categories:', serviceCategories);
        setCategories(serviceCategories);
        
        // Load items for each category
        const itemsMap: {[categoryId: string]: CategoryItem[]} = {};
        const allItemsList: CategoryItem[] = [];
        for (const category of serviceCategories) {
          const items = await categoryService.getItemsByCategory(category.id);
          console.log(`Items for category ${category.name}:`, items);
          itemsMap[category.id] = items;
          allItemsList.push(...items);
        }
        setCategoryItems(itemsMap);
        setAllItems(allItemsList);
        console.log('All items loaded:', allItemsList.length);
      }
    } catch (error) {
      console.error('Error loading service and categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (itemId: string, increment: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + (increment ? 1 : -1))
    }));
  };

  const handleQuickAdd = (items: Array<{categoryId: string; itemId: string; quantity: number}>) => {
    const newSelectedItems = { ...selectedItems };
    items.forEach(({ itemId, quantity }) => {
      newSelectedItems[itemId] = (newSelectedItems[itemId] || 0) + quantity;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleItemSelect = (item: CategoryItem) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  };

  const handleAddToCart = () => {
    if (serviceType === 'custom') {
      if (customDescription.trim()) {
        addItem({
          serviceId: serviceId || 'custom',
          serviceName: service?.name || 'Custom Service',
          serviceType: 'custom',
          quantity: 1,
          unitPrice: 35, // Default price for custom
          description: customDescription.trim(),
          iconName: 'camera-outline',
        });
        setShowAddServiceModal(true);
      }
    } else {
      const itemsToAdd = Object.entries(selectedItems)
        .filter(([_, count]) => count > 0)
        .map(([itemId, count]) => {
          let itemDetails: CategoryItem | null = null;
          for (const items of Object.values(categoryItems)) {
            const item = items.find(i => i.id === itemId);
            if (item) {
              itemDetails = item;
              break;
            }
          }
          return {
            serviceId: serviceId || '',
            serviceName: service?.name || '',
            serviceType: serviceType,
            categoryId: itemDetails?.categoryId || '',
            categoryName: itemDetails?.categoryName || '',
            quantity: count,
            unitPrice: itemDetails?.price || 10,
            iconName: itemDetails?.iconName,
          };
        });
      itemsToAdd.forEach(item => addItem(item));
      setShowAddServiceModal(true);
    }
  };

  const canAddToCart = serviceType === 'custom' 
    ? customDescription.trim().length > 0
    : getTotalSelectedItems() > 0;

  const handleViewCart = () => {
    navigation.navigate('Cart');
  };

  const formatPrice = (price: number) => {
    return formatCurrency(price, currency);
  };

  // Toggle favorite
  const toggleFavorite = async (itemId: string) => {
    if (!user) return;
    setFavoriteLoading(true);
    setFavoriteError(null);
    let newFavorites: string[];
    if (favorites.includes(itemId)) {
      newFavorites = favorites.filter(id => id !== itemId);
    } else {
      newFavorites = [...favorites, itemId];
    }
    const newPrefs = { ...user.preferences, favorites: newFavorites };
    const { error } = await updateProfile({ preferences: newPrefs });
    if (error) setFavoriteError('Failed to update favorites.');
    setFavoriteLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Indicator */}
      <OrderProgress currentStep={2} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <Card style={{ marginBottom: 16 }} padding="large">
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 8 }}>{t('favorites')}</Text>
            {allItems.filter(item => favorites.includes(item.id)).map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: colors.textPrimary }]}>{item.name}</Text>
                    <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatPrice(item.price)} each</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)} disabled={favoriteLoading}>
                  <Ionicons name={favorites.includes(item.id) ? 'heart' : 'heart-outline'} size={22} color={colors.primary} />
                </TouchableOpacity>
                <Button title="Add" size="small" onPress={() => handleItemSelect(item)} />
              </View>
            ))}
            {favoriteError && <Text style={{ color: 'red' }}>{favoriteError}</Text>}
          </Card>
        )}
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {serviceType === 'custom' ? t('describe_your_items') : t('select_items')}
            </Text>
            <CartBadge onPress={handleViewCart} size="large" />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {serviceType === 'custom' 
              ? t('tell_us_what_you_need_cleaned')
              : t('choose_items_to_send')
            }
          </Text>
        </View>

        {serviceType === 'custom' ? (
          /* Custom Quote Section */
          <Card style={styles.customCard} padding="large">
            <View style={styles.customHeader}>
              <Ionicons name="camera-outline" size={32} color={colors.primary} />
              <Text style={[styles.customTitle, { color: colors.textPrimary }]}>
                {t('custom_quote')}
              </Text>
            </View>
            <Text style={[styles.customDescription, { color: colors.textSecondary }]}>
              {t('describe_items_personalized_quote')}
            </Text>
            <TextInput
              style={[styles.textInput, { 
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: colors.backgroundSecondary
              }]}
              placeholder={t('describe_items_placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={customDescription}
              onChangeText={setCustomDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="camera" size={20} color={colors.primary} />
              <Text style={[styles.uploadText, { color: colors.primary }]}>
                Upload Photo (Optional)
              </Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {/* Quick Add Section */}
            <QuickAddSection 
              onQuickAdd={handleQuickAdd}
              serviceType={serviceType}
            />

            {/* Search Section */}
            <ItemSearch
              allItems={allItems}
              onItemSelect={handleItemSelect}
              selectedItems={selectedItems}
              onQuantityChange={handleItemChange}
            />

            {/* Mini Order Summary */}
            <MiniOrderSummary
              selectedItems={selectedItems}
              allItems={allItems}
              onViewCart={handleViewCart}
              onAddToCart={handleAddToCart}
              canAddToCart={canAddToCart}
            />

            {/* Categories and Items Section */}
            <View style={styles.categoriesContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Loading categories...
                  </Text>
                </View>
              ) : categories.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    No categories found for this service
                  </Text>
                  <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: 12 }]}>
                    Categories count: {categories.length}
                  </Text>
                </View>
              ) : (
                categories.map((category) => {
                  const items = categoryItems[category.id] || [];
                  const isExpanded = expandedCategories[category.id];
                  const categoryTotal = items.reduce((sum, item) => sum + (selectedItems[item.id] || 0), 0);
                  
                  return (
                    <Card key={category.id} style={styles.categoryCard} padding="medium">
                      {/* Category Header */}
                      <TouchableOpacity
                        style={styles.categoryHeader}
                        onPress={() => toggleCategory(category.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.categoryInfo}>
                          <Ionicons 
                            name={getValidIcon(category.icon_name, 'category')} 
                            size={24} 
                            color={colors.primary} 
                          />
                          <View style={styles.categoryDetails}>
                            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                              {category.name}
                            </Text>
                            <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                              {category.description}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.categoryActions}>
                          {categoryTotal > 0 && (
                            <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                              <Text style={[styles.categoryBadgeText, { color: colors.textInverse }]}>
                                {categoryTotal}
                              </Text>
                            </View>
                          )}
                          <Ionicons 
                            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                            size={20} 
                            color={colors.textSecondary} 
                          />
                        </View>
                      </TouchableOpacity>

                      {/* Category Items */}
                      {isExpanded && (
                        <View style={styles.itemsContainer}>
                          {items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                              <View style={styles.itemInfo}>
                                <View style={styles.itemDetails}>
                                  <Text style={[styles.itemName, { color: colors.textPrimary }]}> {item.name} </Text>
                                  <Text style={[styles.itemDescription, { color: colors.textSecondary }]}> {item.description} </Text>
                                  <Text style={[styles.itemPrice, { color: colors.primary }]}> {formatPrice(item.price)} each </Text>
                                </View>
                              </View>
                              <TouchableOpacity onPress={() => toggleFavorite(item.id)} disabled={favoriteLoading}>
                                <Ionicons name={favorites.includes(item.id) ? 'heart' : 'heart-outline'} size={22} color={colors.primary} />
                              </TouchableOpacity>
                              <View style={styles.itemCounter}>
                                <TouchableOpacity
                                  style={[styles.counterButton, { 
                                    backgroundColor: colors.backgroundSecondary,
                                    borderColor: colors.border 
                                  }]}
                                  onPress={() => handleItemChange(item.id, false)}
                                  disabled={!selectedItems[item.id]}
                                >
                                  <Ionicons name="remove" size={16} color={colors.textPrimary} />
                                </TouchableOpacity>
                                <Text style={[styles.counterText, { color: colors.textPrimary }]}> {selectedItems[item.id] || 0} </Text>
                                <TouchableOpacity
                                  style={[styles.counterButton, { 
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary 
                                  }]}
                                  onPress={() => handleItemChange(item.id, true)}
                                >
                                  <Ionicons name="add" size={16} color={colors.textInverse} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </Card>
                  );
                })
              )}
            </View>

            {/* Summary */}
            {getTotalSelectedItems() > 0 && (
              <Card style={styles.summaryCard} padding="medium">
                <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                  Selected Items: {getTotalSelectedItems()}
                </Text>
                {Object.entries(selectedItems)
                  .filter(([_, count]) => count > 0)
                  .map(([itemId, count]) => {
                    // Find item details
                    let itemDetails: CategoryItem | null = null;
                    for (const items of Object.values(categoryItems)) {
                      const item = items.find(i => i.id === itemId);
                      if (item) {
                        itemDetails = item;
                        break;
                      }
                    }
                    return (
                      <Text key={itemId} style={[styles.summaryItem, { color: colors.textSecondary }]}>
                        {itemDetails?.name || 'Item'}: {count} × {formatPrice(itemDetails?.price || 0)}
                      </Text>
                    );
                  })}
              </Card>
            )}
          </>
        )}
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title={t('add_to_cart')}
          onPress={handleAddToCart}
          disabled={!canAddToCart}
          size="large"
        />
      </View>
      <Modal
        visible={showAddServiceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddServiceModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 24, width: '80%', alignItems: 'center' }}>
            <Ionicons name="add-circle-outline" size={48} color={colors.primary} style={{ marginBottom: 12 }} />
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Add Another Service?
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 24 }}>
              Would you like to add another service to your order?
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <Button
                title="Add Service"
                onPress={() => {
                  setShowAddServiceModal(false);
                  navigation.navigate('ServiceSelection');
                }}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="No, thank you"
                onPress={() => {
                  setShowAddServiceModal(false);
                  navigation.navigate('Cart');
                }}
                style={{ flex: 1, marginLeft: 8 }}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </Modal>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  customCard: {
    marginBottom: 24,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  customDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 12,
  },
  categoryCard: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDetails: {
    marginLeft: 12,
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
    flex: 1,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default ItemSelectionScreen; 