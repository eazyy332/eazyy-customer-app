import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { RootStackParamList } from '../types/navigation';
import { useOrder } from '../context/OrderContext';

type OrderHistoryNavigationProp = StackNavigationProp<RootStackParamList, 'OrderHistory'>;

const orders = [
  {
    id: 'ORD-001',
    date: '2024-06-01',
    service: 'EasyBag',
    status: 'Delivered',
    total: 25,
    items: 'Mixed laundry',
  },
  {
    id: 'ORD-002',
    date: '2024-05-25',
    service: 'Wash & Iron',
    status: 'Delivered',
    total: 42,
    items: '5 shirts, 2 pants',
  },
  {
    id: 'ORD-003',
    date: '2024-05-10',
    service: 'Dry Cleaning',
    status: 'Delivered',
    total: 18,
    items: '1 suit',
  },
];

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<OrderHistoryNavigationProp>();
  const { colors } = useTheme();
  const { clearCart, addItem } = useOrder();

  // Helper to handle reorder
  const handleReorder = (order: typeof orders[0]) => {
    clearCart();
    // TODO: Replace with real order items when available
    // For now, add a placeholder item to the cart
    addItem({
      serviceId: order.id,
      serviceName: order.service,
      serviceType: order.service,
      quantity: 1,
      unitPrice: order.total,
      categoryId: undefined,
      categoryName: undefined,
      description: order.items,
      iconName: undefined,
    });
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Order History</Text>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No past orders yet</Text>
          </View>
        ) : (
          orders.map((order) => (
            <Card key={order.id} style={styles.orderCard} padding="large">
              <View style={styles.orderHeader}>
                <Text style={[styles.orderId, { color: colors.textTertiary }]}>#{order.id}</Text>
                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{order.date}</Text>
              </View>
              <Text style={[styles.orderService, { color: colors.textPrimary }]}>{order.service}</Text>
              <Text style={[styles.orderItems, { color: colors.textSecondary }]}>{order.items}</Text>
              <View style={styles.orderFooter}>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>€{order.total}</Text>
                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                  >
                    <Ionicons name="eye-outline" size={20} color={colors.primary} />
                    <Text style={[styles.actionText, { color: colors.primary }]}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleReorder(order)}
                  >
                    <Ionicons name="repeat-outline" size={20} color={colors.success} />
                    <Text style={[styles.actionText, { color: colors.success }]}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  orderCard: { marginBottom: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 14, fontWeight: '500' },
  orderDate: { fontSize: 14, fontWeight: '400' },
  orderService: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  orderItems: { fontSize: 14, fontWeight: '400', marginBottom: 12 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 16, fontWeight: '700' },
  orderActions: { flexDirection: 'row' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  actionText: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  emptyState: { alignItems: 'center', marginTop: 64 },
  emptyText: { fontSize: 16, fontWeight: '400', marginTop: 16 },
});

export default OrderHistoryScreen; 