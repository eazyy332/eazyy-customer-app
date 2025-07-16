import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { OrderProvider } from './src/context/OrderContext';
import RootNavigator from './src/navigation/RootNavigator';
import './src/config/i18n';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function App() {
  const { t } = useTranslation();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <OrderProvider>
              <NavigationContainer>
                <StatusBar style="dark" backgroundColor="#FFFFFF" />
                {/* Example usage of translation */}
                <Text>{t('welcome')}</Text>
                <RootNavigator />
              </NavigationContainer>
            </OrderProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 