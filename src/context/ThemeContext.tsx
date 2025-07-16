import React, { createContext, useContext, ReactNode } from 'react';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS, ANIMATION } from '../constants/theme';

interface ThemeContextType {
  colors: typeof COLORS;
  spacing: typeof SPACING;
  borderRadius: typeof BORDER_RADIUS;
  fontSizes: typeof FONT_SIZES;
  fontWeights: typeof FONT_WEIGHTS;
  shadows: typeof SHADOWS;
  animation: typeof ANIMATION;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme: ThemeContextType = {
    colors: COLORS,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    shadows: SHADOWS,
    animation: ANIMATION,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 