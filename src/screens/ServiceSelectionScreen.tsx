import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { useOrder } from '../context/OrderContext';
import { serviceService } from '../services/database';
import { getValidIcon } from '../utils/icons';
import Card from '../components/Card';
import CartBadge from '../components/CartBadge';
import OrderProgress from '../components/OrderProgress';
import { RootStackParamList } from '../types/navigation';

type ServiceSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceSelection'>;

const ServiceSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { getTotalItems } = useOrder();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const activeServices = await serviceService.getActiveServices();
      setServices(activeServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: any) => {
    navigation.navigate('ItemSelection', { 
      serviceType: service.service_identifier,
      serviceId: service.id 
    });
  };

  const handleViewCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Indicator */}
      <OrderProgress currentStep={1} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Choose Your Service
            </Text>
            <CartBadge onPress={handleViewCart} size="large" />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the service that best fits your needs
          </Text>
        </View>

        {/* Services */}
        <View style={styles.servicesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading services...
              </Text>
            </View>
          ) : (
            services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServiceSelect(service)}
                activeOpacity={0.7}
              >
                <Card style={styles.serviceCardContent} padding="large">
                  <View style={styles.serviceHeader}>
                    <View style={[styles.serviceIcon, { backgroundColor: service.color_hex }]}>
                      <Ionicons name={getValidIcon(service.icon_name, 'service')} size={24} color={colors.textInverse} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                        {service.name}
                      </Text>
                      <Text style={[styles.serviceSubtitle, { color: colors.textSecondary }]}>
                        {service.short_description}
                      </Text>
                    </View>
                    <View style={styles.servicePrice}>
                      <Text style={[styles.priceText, { color: colors.primary }]}>
                        From €{service.price_starts_at}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>
                    {service.description}
                  </Text>
                  <View style={styles.serviceFooter}>
                    <View style={[styles.selectButton, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.selectButtonText, { color: colors.textInverse }]}>
                        Select
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.textInverse} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Info Section */}
        <Card style={styles.infoCard} padding="medium">
          <View style={styles.infoContent}>
            <Ionicons name="information-circle-outline" size={24} color={colors.info} />
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                Need help choosing?
              </Text>
              <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                Our team is here to help you select the best service for your items.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  servicesContainer: {
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
  serviceCard: {
    marginBottom: 16,
  },
  serviceCardContent: {
    borderWidth: 0,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFooter: {
    alignItems: 'flex-end',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});

export default ServiceSelectionScreen; 