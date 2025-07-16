import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface OrderProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps?: string[];
}

const OrderProgress: React.FC<OrderProgressProps> = ({ 
  currentStep, 
  totalSteps = 5,
  steps = ['Service', 'Items', 'Cart', 'Schedule', 'Address']
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const isUpcoming = index > currentStep - 1;
          
          return (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepContent}>
                <View style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isCompleted || isCurrent ? colors.primary : colors.backgroundSecondary,
                    borderColor: isCompleted || isCurrent ? colors.primary : colors.border,
                  }
                ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      { color: isCurrent ? colors.textInverse : colors.textSecondary }
                    ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  { 
                    color: isCompleted || isCurrent ? colors.textPrimary : colors.textSecondary,
                    fontWeight: isCurrent ? '600' : '400'
                  }
                ]}>
                  {step}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepLine,
                  { 
                    backgroundColor: isCompleted ? colors.primary : colors.border 
                  }
                ]} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepContent: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    width: '100%',
    height: 2,
    zIndex: -1,
  },
});

export default OrderProgress; 