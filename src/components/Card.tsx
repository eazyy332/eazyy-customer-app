import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
  margin = 'none',
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return spacing.sm;
      case 'medium': return spacing.md;
      case 'large': return spacing.lg;
      default: return spacing.md;
    }
  };

  const getMargin = () => {
    switch (margin) {
      case 'none': return 0;
      case 'small': return spacing.sm;
      case 'medium': return spacing.md;
      case 'large': return spacing.lg;
      default: return 0;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          borderRadius: borderRadius.lg,
          padding: getPadding(),
          margin: getMargin(),
          ...shadows.sm,
          borderWidth: 1,
          borderColor: colors.borderLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card; 