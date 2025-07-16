import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AccountScreen from '../screens/AccountScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ServiceSelectionScreen from '../screens/ServiceSelectionScreen';
import ItemSelectionScreen from '../screens/ItemSelectionScreen';
import TimeSlotSelectionScreen from '../screens/TimeSlotSelectionScreen';
import AddressSelectionScreen from '../screens/AddressSelectionScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import ProofOfDeliveryScreen from '../screens/ProofOfDeliveryScreen';
import CartScreen from '../screens/CartScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CustomQuotesScreen from '../screens/CustomQuotesScreen';
import DiscrepancyReviewScreen from '../screens/DiscrepancyReviewScreen';

import { RootStackParamList, MainTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { colors } = useTheme();
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      {!user ? (
        // Authentication screens
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // Main app screens
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="NewOrder" 
            component={ServiceSelectionScreen}
            options={{ title: 'New Order' }}
          />
          <Stack.Screen 
            name="OrderTracking" 
            component={OrderTrackingScreen}
            options={{ title: 'Track Order' }}
          />
          <Stack.Screen 
            name="OrderHistory" 
            component={OrderHistoryScreen}
            options={{ title: 'Order History' }}
          />
          <Stack.Screen 
            name="Account" 
            component={AccountScreen}
            options={{ title: 'Account' }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen 
            name="ServiceSelection" 
            component={ServiceSelectionScreen}
            options={{ title: 'Choose Service' }}
          />
          <Stack.Screen 
            name="ItemSelection" 
            component={ItemSelectionScreen}
            options={{ title: 'Select Items' }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ title: 'Your Cart' }}
          />
          <Stack.Screen 
            name="TimeSlotSelection" 
            component={TimeSlotSelectionScreen}
            options={{ title: 'Pickup & Delivery' }}
          />
          <Stack.Screen 
            name="AddressSelection" 
            component={AddressSelectionScreen}
            options={{ title: 'Address & Notes' }}
          />
          <Stack.Screen 
            name="OrderSummary" 
            component={OrderSummaryScreen}
            options={{ title: 'Order Summary' }}
          />
          <Stack.Screen 
            name="ProofOfDelivery" 
            component={ProofOfDeliveryScreen}
            options={{ title: 'Delivery Confirmation' }}
          />
          <Stack.Screen 
            name="ChangePassword" 
            component={ChangePasswordScreen}
            options={{ title: 'Change Password' }}
          />
          <Stack.Screen 
            name="CustomQuotes" 
            component={CustomQuotesScreen}
            options={{ title: 'Custom Quotes' }}
          />
          <Stack.Screen 
            name="DiscrepancyReview" 
            component={DiscrepancyReviewScreen}
            options={{ title: 'Discrepancy Review' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator; 