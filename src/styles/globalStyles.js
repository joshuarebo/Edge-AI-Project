import { StyleSheet } from 'react-native';

/**
 * Global color palette
 */
export const colors = {
  // Primary color and variants
  primary: '#5C6BC0',     // Indigo 400
  primaryLight: '#8E99F3',
  primaryDark: '#26418F',
  
  // Accent color
  accent: '#FFD54F',      // Amber 300
  
  // Backgrounds
  background: '#FFFFFF',
  card: '#F5F5F5',
  
  // Text
  text: '#212121',
  textLight: '#757575',
  
  // Status
  success: '#66BB6A',     // Green 400
  warning: '#FFA726',     // Orange 400
  error: '#EF5350',       // Red 400
  info: '#29B6F6',        // Light Blue 400
  
  // UI Elements
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Expression colors
  happy: '#4CAF50',       // Green 500
  sad: '#5C6BC0',         // Indigo 400
  angry: '#F44336',       // Red 500
  surprised: '#FFEB3B',   // Yellow 500
  fear: '#9C27B0',        // Purple 500
  disgust: '#795548',     // Brown 500
  neutral: '#9E9E9E',     // Gray 500
  
  // Gender colors
  male: '#42A5F5',        // Blue 400
  female: '#EC407A',      // Pink 400
  
  // Age group colors
  child: '#FFEB3B',       // Yellow 500
  teen: '#26C6DA',        // Cyan 400
  young: '#66BB6A',       // Green 400
  adult: '#5C6BC0',       // Indigo 400
  senior: '#8D6E63',      // Brown 400
};

/**
 * Typography styles
 */
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
  },
  overline: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
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
  xxl: 48,
};

/**
 * Layout constants
 */
export const layout = {
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    pill: 24,
  },
  maxWidth: {
    container: 1200,
    content: 960,
  },
};

/**
 * Shadow styles
 */
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

/**
 * Common styles used across the app
 */
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    ...shadows.small,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    ...typography.button,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  label: {
    ...typography.subtitle2,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});