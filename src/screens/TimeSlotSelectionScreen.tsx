import React, { useState, useEffect } from 'react';
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
import { useOrder } from '../context/OrderContext';
import Button from '../components/Button';
import Card from '../components/Card';
import OrderProgress from '../components/OrderProgress';
import { RootStackParamList } from '../types/navigation';
import { Calendar } from 'react-native-calendars';

type TimeSlotNavigationProp = StackNavigationProp<RootStackParamList, 'TimeSlotSelection'>;

const TimeSlotSelectionScreen: React.FC = () => {
  const navigation = useNavigation<TimeSlotNavigationProp>();
  const { colors, spacing, fontSizes, fontWeights } = useTheme();
  const { state, setPickupSchedule, setDeliverySchedule, getTotalItems } = useOrder();
  
  const [selectedPickupDate, setSelectedPickupDate] = useState<string>('');
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>('');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>('');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });

  // Set smart defaults on component mount
  useEffect(() => {
    const availableDates = getAvailableDates();
    if (availableDates.length > 0) {
      // Default pickup: tomorrow
      setSelectedPickupDate(availableDates[1] || availableDates[0]);
      // Default delivery: day after pickup
      setSelectedDeliveryDate(availableDates[2] || availableDates[1]);
    }
    
    // Default times: most popular slots
    setSelectedPickupTime('13:00 - 15:00');
    setSelectedDeliveryTime('15:00 - 17:00');
  }, []);

  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper to mark the range on the calendar
  const getMarkedDates = () => {
    const { start, end } = dateRange;
    if (!start) return {};
    if (!end || start === end) {
      return {
        [start]: { startingDay: true, endingDay: true, color: colors.primary, textColor: colors.textInverse },
      };
    }
    // Build range
    const range: any = {};
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      if (dateStr === start) {
        range[dateStr] = { startingDay: true, color: colors.primary, textColor: colors.textInverse };
      } else if (dateStr === end) {
        range[dateStr] = { endingDay: true, color: colors.success, textColor: colors.textInverse };
      } else {
        range[dateStr] = { color: colors.primary + '55', textColor: colors.textPrimary };
      }
      current.setDate(current.getDate() + 1);
    }
    return range;
  };

  // Handle calendar day press
  const handleDayPress = (day: { dateString: string }) => {
    const { start, end } = dateRange;
    if (!start || (start && end)) {
      setDateRange({ start: day.dateString, end: null });
    } else if (start && !end) {
      if (day.dateString > start) {
        setDateRange({ start, end: day.dateString });
      } else {
        setDateRange({ start: day.dateString, end: null });
      }
    }
  };

  // Sync pickup/delivery date state for compatibility
  React.useEffect(() => {
    if (dateRange.start) setSelectedPickupDate(dateRange.start);
    if (dateRange.end) setSelectedDeliveryDate(dateRange.end);
  }, [dateRange]);

  const handleContinue = () => {
    if (selectedPickupDate && selectedPickupTime && selectedDeliveryDate && selectedDeliveryTime) {
      setPickupSchedule(selectedPickupDate, selectedPickupTime);
      setDeliverySchedule(selectedDeliveryDate, selectedDeliveryTime);
      navigation.navigate('AddressSelection');
    }
  };

  const canContinue = selectedPickupDate && selectedPickupTime && selectedDeliveryDate && selectedDeliveryTime;

  const totalItems = getTotalItems();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Indicator */}
      <OrderProgress currentStep={4} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Pickup & Delivery Schedule
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose when you'd like us to pick up and deliver your {totalItems} item{totalItems !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Pickup & Delivery Date Selection */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Pickup & Delivery Dates</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>Select your pickup and delivery dates (delivery must be after pickup).</Text>
          <Calendar
            minDate={(() => {
              const d = new Date();
              d.setDate(d.getDate() + 1); // tomorrow
              return d.toISOString().split('T')[0];
            })()}
            maxDate={(() => {
              const d = new Date();
              d.setDate(d.getDate() + 30); // up to 30 days ahead
              return d.toISOString().split('T')[0];
            })()}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType="period"
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.textInverse,
              todayTextColor: colors.primary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textTertiary,
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              indicatorColor: colors.primary,
            }}
          />
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>
              Pickup: {dateRange.start ? formatDate(dateRange.start) : 'Select a date'}
            </Text>
            <Text style={{ color: colors.textPrimary, fontWeight: 'bold', marginTop: 4 }}>
              Delivery: {dateRange.end ? formatDate(dateRange.end) : 'Select a date after pickup'}
            </Text>
          </View>
        </Card>

        {/* Pickup Time Selection */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Pickup Time
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            What time works best for pickup?
          </Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  { 
                    backgroundColor: selectedPickupTime === time ? colors.primary : colors.backgroundSecondary,
                    borderColor: selectedPickupTime === time ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedPickupTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  { color: selectedPickupTime === time ? colors.textInverse : colors.textPrimary }
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Delivery Time Selection */}
        <Card style={styles.sectionCard} padding="large">
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Delivery Time
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            What time works best for delivery?
          </Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  { 
                    backgroundColor: selectedDeliveryTime === time ? colors.success : colors.backgroundSecondary,
                    borderColor: selectedDeliveryTime === time ? colors.success : colors.border
                  }
                ]}
                onPress={() => setSelectedDeliveryTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  { color: selectedDeliveryTime === time ? colors.textInverse : colors.textPrimary }
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard} padding="medium">
          <View style={styles.infoContent}>
            <Ionicons name="information-circle-outline" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Delivery is available 24 hours after pickup. Same-day delivery available for urgent orders.
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          size="large"
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
    marginBottom: 24,
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
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default TimeSlotSelectionScreen; 