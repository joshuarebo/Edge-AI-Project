import { StyleSheet } from 'react-native';

/**
 * Global color palette
 */
export const colors = {
  primary: '#4630EB',
  secondary: '#2c3e50',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
  light: '#f5f5f5',
  dark: '#333333',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f7fafc',
    200: '#edf2f7',
    300: '#e2e8f0',
    400: '#cbd5e0',
    500: '#a0aec0',
    600: '#718096',
    700: '#4a5568',
    800: '#2d3748',
    900: '#1a202c'
  }
};

/**
 * Typography styles
 */
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48
  },
  fontWeights: {
    hairline: '100',
    thin: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
};

/**
 * Spacing constants
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64
};

/**
 * Layout constants
 */
export const layout = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1700,
    tooltip: 1800
  }
};

/**
 * Shadow styles
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14
  }
};

/**
 * Common styles used across the app
 */
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  card: {
    ...shadows.md,
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md
  },
  screenContainer: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.light
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300]
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.md
  }
});