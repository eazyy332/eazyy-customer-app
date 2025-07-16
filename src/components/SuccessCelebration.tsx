import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Confetti from './Confetti';
import { useTheme } from '../context/ThemeContext';

interface SuccessCelebrationProps {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
}

const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({ visible, message = 'Order Successful!', onComplete }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      scale.value = withTiming(0.7, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return visible ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Confetti visible={visible} onComplete={() => { setConfettiDone(true); if (onComplete) onComplete(); }} />
      <Animated.View style={[styles.center, animatedStyle]}>
        <View style={[styles.smiley, { backgroundColor: colors.primaryLight }]}> 
          <Text style={styles.smileyFace}>😊</Text>
        </View>
        <Text style={[styles.message, { color: colors.primary }]}>{message}</Text>
      </Animated.View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  smiley: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  smileyFace: {
    fontSize: 56,
  },
  message: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SuccessCelebration; 