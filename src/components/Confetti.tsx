import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#007AFF', '#4DA3FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const CONFETTI_COUNT = 24;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

interface ConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ visible, onComplete }) => {
  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    const x = getRandom(0, width);
    const delay = getRandom(0, 300);
    const duration = getRandom(1200, 1800);
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const size = getRandom(8, 16);
    const rotate = getRandom(0, 360);
    return { x, delay, duration, color, size, rotate };
  });

  return visible ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {confetti.map((c, i) => {
        const translateY = useSharedValue(-40);
        useEffect(() => {
          if (visible) {
            const timer = setTimeout(() => {
              translateY.value = withTiming(height + 40, {
                duration: c.duration,
                easing: Easing.out(Easing.quad),
              }, (finished) => {
                if (finished && i === 0 && onComplete) runOnJS(onComplete)();
              });
            }, c.delay);
            
            return () => clearTimeout(timer);
          } else {
            translateY.value = -40;
          }
        }, [visible]);
        const style = useAnimatedStyle(() => ({
          position: 'absolute',
          left: c.x,
          top: translateY.value,
          transform: [{ rotate: `${c.rotate}deg` }],
        }));
        return (
          <Animated.View key={i} style={style}>
            {i % 2 === 0 ? (
              <Svg width={c.size} height={c.size}>
                <Circle cx={c.size / 2} cy={c.size / 2} r={c.size / 2} fill={c.color} />
              </Svg>
            ) : (
              <Svg width={c.size} height={c.size}>
                <Rect width={c.size} height={c.size} fill={c.color} rx={3} />
              </Svg>
            )}
          </Animated.View>
        );
      })}
    </View>
  ) : null;
};

export default Confetti; 