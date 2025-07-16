import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import { RootStackParamList } from '../types/navigation';

type OrderTrackingNavigationProp = StackNavigationProp<RootStackParamList, 'OrderTracking'>;
type OrderTrackingRouteProp = RouteProp<RootStackParamList, 'OrderTracking'>;

const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<OrderTrackingNavigationProp>();
  const route = useRoute<OrderTrackingRouteProp>();
  const { orderId } = route.params;
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(2); // 0: Ordered, 1: Picked up, 2: Processing, 3: Out for delivery, 4: Delivered
  const [eta, setEta] = useState('14:30');

  const orderSteps = [
    { id: 0, title: 'Order Placed', description: 'Your order has been confirmed', icon: 'checkmark-circle' },
    { id: 1, title: 'Picked Up', description: 'Driver collected your items', icon: 'car' },
    { id: 2, title: 'In Processing', description: 'Your laundry is being cleaned', icon: 'shirt' },
    { id: 3, title: 'Out for Delivery', description: 'Driver is on the way', icon: 'bicycle' },
    { id: 4, title: 'Delivered', description: 'Order completed successfully', icon: 'home' },
  ];

  const driverInfo = {
    name: 'Alex Johnson',
    photo: '👨‍💼',
    vehicle: 'Van (AB-123-CD)',
    rating: 4.8,
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStepColor = (stepId: number) => {
    if (stepId < currentStep) return colors.success;
    if (stepId === currentStep) return colors.primary;
    return colors.textTertiary;
  };

  const getStepIcon = (step: any) => {
    if (step.id < currentStep) {
      return 'checkmark-circle';
    }
    return step.icon;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Track Your Order
          </Text>
          <Text style={[styles.orderId, { color: colors.textSecondary }]}>
            Order #{orderId}
          </Text>
        </View>

        {/* Status Card */}
        <Card style={styles.statusCard} padding="large">
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="location" size={24} color={colors.textInverse} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: colors.textPrimary }]}>
                {orderSteps[currentStep].title}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                {orderSteps[currentStep].description}
              </Text>
            </View>
          </View>
          
          <View style={styles.etaContainer}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.etaText, { color: colors.textSecondary }]}>
              Estimated delivery: {eta}
            </Text>
          </View>
        </Card>

        {/* Progress Steps */}
        <Card style={styles.progressCard} padding="large">
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
            Order Progress
          </Text>
          
          {orderSteps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <View style={[
                  styles.stepIcon,
                  { 
                    backgroundColor: getStepColor(step.id),
                    borderColor: getStepColor(step.id)
                  }
                ]}>
                  <Ionicons 
                    name={getStepIcon(step) as any} 
                    size={20} 
                    color={colors.textInverse} 
                  />
                </View>
                {index < orderSteps.length - 1 && (
                  <View style={[
                    styles.stepLine,
                    { backgroundColor: step.id < currentStep ? colors.success : colors.border }
                  ]} />
                )}
              </View>
              
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepTitle,
                  { color: step.id <= currentStep ? colors.textPrimary : colors.textTertiary }
                ]}>
                  {step.title}
                </Text>
                <Text style={[
                  styles.stepDescription,
                  { color: step.id <= currentStep ? colors.textSecondary : colors.textTertiary }
                ]}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Driver Info */}
        {currentStep >= 1 && currentStep <= 3 && (
          <Card style={styles.driverCard} padding="large">
            <View style={styles.driverHeader}>
              <Text style={[styles.driverTitle, { color: colors.textPrimary }]}>
                Your Driver
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {driverInfo.rating}
                </Text>
              </View>
            </View>
            
            <View style={styles.driverInfo}>
              <Text style={[styles.driverEmoji, { fontSize: 48 }]}>
                {driverInfo.photo}
              </Text>
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: colors.textPrimary }]}>
                  {driverInfo.name}
                </Text>
                <Text style={[styles.driverVehicle, { color: colors.textSecondary }]}>
                  {driverInfo.vehicle}
                </Text>
              </View>
            </View>
            
            <View style={styles.driverActions}>
              <View style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="call-outline" size={20} color={colors.textInverse} />
                <Text style={[styles.actionText, { color: colors.textInverse }]}>
                  Call
                </Text>
              </View>
              <View style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.textPrimary} />
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                  Message
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Map Placeholder */}
        <Card style={styles.mapCard} padding="large">
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.mapText, { color: colors.textSecondary }]}>
              Live map view coming soon
            </Text>
          </View>
        </Card>

        {/* Order Details */}
        <Card style={styles.detailsCard} padding="large">
          <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>
            Order Details
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Service</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>Wash & Iron</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Items</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>5 shirts, 2 pants</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Pickup</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>Today, 14:00</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Delivery</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>Tomorrow, 14:30</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '400',
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 8,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepLine: {
    width: 2,
    height: 30,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  driverCard: {
    marginBottom: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverEmoji: {
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  driverVehicle: {
    fontSize: 14,
    fontWeight: '400',
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  mapCard: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 12,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderTrackingScreen; 