import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import Button from '../components/Button';
import Card from '../components/Card';
import CartBadge from '../components/CartBadge';
import { RootStackParamList } from '../types/navigation';
import { useTranslation } from 'react-i18next';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { user } = useAuth();
  const { getTotalItems } = useOrder();
  const { t } = useTranslation();

  const quickAccessItems = [
    {
      id: 'track',
      title: t('track_order'),
      subtitle: t('see_real_time_updates'),
      icon: 'location-outline',
      onPress: () => navigation.navigate('OrderTracking', { orderId: 'current' }),
    },
    {
      id: 'history',
      title: t('order_history'),
      subtitle: t('view_past_orders'),
      icon: 'time-outline',
      onPress: () => navigation.navigate('OrderHistory'),
    },
    {
      id: 'addresses',
      title: t('my_addresses'),
      subtitle: t('manage_pickup_points'),
      icon: 'home-outline',
      onPress: () => navigation.navigate('Account'),
    },
    {
      id: 'support',
      title: t('support'),
      subtitle: t('get_help_anytime'),
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image source={require('../../assets/eazyy_logo.png')} style={{ width: 120, height: 40, resizeMode: 'contain', marginBottom: 4 }} />
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t('good_morning')}</Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{user?.first_name || t('user')}! 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <CartBadge 
              onPress={() => navigation.navigate('Cart')} 
              size="medium"
            />
            <TouchableOpacity
              style={[styles.notificationButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main CTA */}
        <Card style={styles.mainCard} padding="large">
          <View style={styles.mainCardContent}>
            <View style={styles.mainCardText}>
              <Text style={[styles.mainCardTitle, { color: colors.textPrimary }]}>{t('ready_for_fresh_laundry')}</Text>
              <Text style={[styles.mainCardSubtitle, { color: colors.textSecondary }]}>{t('schedule_pickup_cta')}</Text>
            </View>
            <View style={[styles.mainCardIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="shirt-outline" size={32} color={colors.textInverse} />
            </View>
          </View>
          <Button
            title={t('schedule_a_pickup')}
            onPress={() => navigation.navigate('ServiceSelection')}
            size="large"
            style={styles.mainButton}
          />
        </Card>

        {/* Promo Banner */}
        <Card style={styles.promoCard} padding="medium">
          <View style={styles.promoContent}>
            <View style={styles.promoText}>
              <Text style={[styles.promoTitle, { color: colors.textPrimary }]}>{t('first_order_free')}</Text>
              <Text style={[styles.promoSubtitle, { color: colors.textSecondary }]}>{t('get_50_off_first_order')}</Text>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Access */}
        <View style={styles.quickAccessSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick Access
          </Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickAccessItem, { backgroundColor: colors.backgroundSecondary }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.quickAccessIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name={item.icon as any} size={20} color={colors.textInverse} />
                </View>
                <Text style={[styles.quickAccessTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.quickAccessSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background }]}> 
        <Button
          title="Custom Quote"
          onPress={() => navigation.navigate('CustomQuotes')}
          size="large"
        />
        <Button
          title="Discrepancy Review"
          onPress={() => navigation.navigate('DiscrepancyReview')}
          size="large"
          style={{ marginTop: 12 }}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    marginBottom: 16,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainCardText: {
    flex: 1,
  },
  mainCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  mainCardSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  mainCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: '100%',
  },
  promoCard: {
    marginBottom: 24,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  promoButton: {
    padding: 8,
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default HomeScreen; 