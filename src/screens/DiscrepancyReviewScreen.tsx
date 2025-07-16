import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/database';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const DiscrepancyReviewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) fetchDiscrepancyOrders();
  }, [user]);

  const fetchDiscrepancyOrders = async () => {
    if (!user) return;
    setLoading(true);
    const allOrders = await orderService.getUserOrders(user.id);
    const discrepancyOrders = allOrders.filter(o => o.has_discrepancy && Array.isArray(o.facility_updated_items) && o.facility_updated_items.length > 0);
    setOrders(discrepancyOrders);
    setLoading(false);
  };

  const handleApprove = async (orderId: string, itemIdx: number) => {
    setUpdating(true);
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) return;
    const updatedItems = [...order.facility_updated_items];
    updatedItems[itemIdx].status = 'approved';
    // Update in Supabase
    await orderService.updateOrder(orderId, { facility_updated_items: updatedItems });
    await fetchDiscrepancyOrders();
    setUpdating(false);
  };

  const handleDecline = async (orderId: string, itemIdx: number, reason: string) => {
    setUpdating(true);
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) return;
    const updatedItems = [...order.facility_updated_items];
    updatedItems[itemIdx].status = 'declined';
    updatedItems[itemIdx].decline_reason = reason;
    // Update in Supabase
    await orderService.updateOrder(orderId, { facility_updated_items: updatedItems });
    await fetchDiscrepancyOrders();
    setUpdating(false);
    setModalVisible(false);
    setDeclineReason('');
  };

  const renderItem = ({ item: order }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={[styles.orderTitle, { color: colors.primary }]}>Order #{order.order_number}</Text>
      {order.facility_updated_items.map((item: any, idx: number) => (
        <View key={idx} style={[styles.itemCard, { borderColor: colors.border }]}> 
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: colors.textPrimary }]}>{item.item_name} ({item.service_type})</Text>
            <Text style={[styles.itemStatus, { color: item.status === 'pending' ? colors.warning : item.status === 'approved' ? colors.success : colors.error }]}>Status: {item.status}</Text>
          </View>
          <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>Quantity: {item.quantity}</Text>
          {item.price && <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>Price: €{item.price}</Text>}
          {item.notes && <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>Notes: {item.notes}</Text>}
          {item.photo_url && <Image source={{ uri: item.photo_url }} style={styles.itemPhoto} />}
          {item.status === 'pending' && (
            <View style={styles.actionRow}>
              <Button title="Approve" onPress={() => handleApprove(order.id, idx)} disabled={updating} style={{ flex: 1, marginRight: 8 }} />
              <Button title="Decline" variant="secondary" onPress={() => { setSelectedOrder(order); setSelectedItem({ ...item, idx }); setModalVisible(true); }} disabled={updating} style={{ flex: 1 }} />
            </View>
          )}
          {item.status === 'declined' && item.decline_reason && (
            <Text style={[styles.itemDetail, { color: colors.error }]}>Decline reason: {item.decline_reason}</Text>
          )}
        </View>
      ))}
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={[styles.title, { color: colors.primary }]}>Discrepancy Review</Text>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32 }}>Please log in to view discrepancy items.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.primary }]}>Discrepancy Review</Text>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
        <FlatList
          data={orders}
          keyExtractor={o => o.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 32 }}>No discrepancy items found.</Text>}
        />
      )}
      {/* Decline Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}> 
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Decline Item</Text>
            <Text style={{ color: colors.textPrimary, marginBottom: 8 }}>Please provide a reason (optional):</Text>
            <TextInput
              value={declineReason}
              onChangeText={setDeclineReason}
              placeholder="Reason for declining..."
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
              multiline
            />
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Button title="Cancel" variant="secondary" onPress={() => { setModalVisible(false); setDeclineReason(''); }} style={{ flex: 1, marginRight: 8 }} />
              <Button title="Decline" onPress={() => handleDecline(selectedOrder.id, selectedItem.idx, declineReason)} style={{ flex: 1 }} disabled={updating} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  orderCard: { marginBottom: 24, padding: 16, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
  orderTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  itemCard: { marginBottom: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemStatus: { fontSize: 14, fontWeight: '600' },
  itemDetail: { fontSize: 14, marginBottom: 2 },
  itemPhoto: { width: 100, height: 100, borderRadius: 8, marginTop: 8, marginBottom: 8 },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 60, marginBottom: 8 },
});

export default DiscrepancyReviewScreen; 