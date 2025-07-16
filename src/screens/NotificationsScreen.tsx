import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';

const notifications = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Order Picked Up',
    message: 'Your laundry was picked up by Alex.',
    time: '10 min ago',
    icon: 'car-outline',
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: '50% Off First Order',
    message: 'Use code EAZYY50 at checkout.',
    time: '1 hour ago',
    icon: 'pricetag-outline',
  },
  {
    id: 'notif-3',
    type: 'driver',
    title: 'Driver Arriving Soon',
    message: 'Alex is 5 minutes away.',
    time: '2 hours ago',
    icon: 'bicycle-outline',
  },
];

const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notifications</Text>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id} style={styles.notifCard} padding="large">
              <View style={styles.notifHeader}>
                <View style={[styles.notifIcon, { backgroundColor: colors.primaryLight }]}> 
                  <Ionicons name={notif.icon as any} size={20} color={colors.textInverse} />
                </View>
                <View style={styles.notifInfo}>
                  <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>{notif.title}</Text>
                  <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>{notif.message}</Text>
                </View>
                <Text style={[styles.notifTime, { color: colors.textTertiary }]}>{notif.time}</Text>
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
  notifCard: { marginBottom: 16 },
  notifHeader: { flexDirection: 'row', alignItems: 'center' },
  notifIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  notifInfo: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: '600' },
  notifMessage: { fontSize: 14, fontWeight: '400' },
  notifTime: { fontSize: 12, fontWeight: '400', marginLeft: 8 },
  emptyState: { alignItems: 'center', marginTop: 64 },
  emptyText: { fontSize: 16, fontWeight: '400', marginTop: 16 },
});

export default NotificationsScreen; 