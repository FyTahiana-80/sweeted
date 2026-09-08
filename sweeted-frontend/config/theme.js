// Thème partagé Sweeted
// Capture uniquement les couleurs et constantes déjà utilisées dans le projet,
// sans introduire de nouvelle palette, afin de rester cohérent visuellement.

export const COLORS = {
  // Verts Sweeted
  primary: '#00B43C',
  primaryDark: '#009A32',
  headerGreen: '#00B43C',
  toggleBackground: '#3bcc7c',
  toggleActive: '#b5e8c4',
  toggleBorder: '#198048',

  // Fonds
  background: '#FFFFFF',
  screenBackground: '#F5F5F5',
  formBackground: '#F5F5F7',
  inputBackground: '#F0F2F5',
  cardBackground: '#FFFFFF',
  divider: '#F0F0F0',
  toggleInactive: '#E0E0E0',
  textInput: '#E8E8E8',

  // Textes
  text: '#121212',
  textPrimary: '#000000',
  textDark: '#333333',
  textSecondary: '#6A6A6A',
  textMuted: '#888888',
  textLight: '#999999',
  placeholder: '#999999',

  // Accents
  reaction: '#E85D75',
  danger: '#FF5B5B',
  disabled: '#CCCCCC',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 15,
  xl: 20,
  xxl: 30,
};

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  xxl: 20,
  fab: 28,
  full: 9999,
};

export const FONTS = {
  sizeSmall: 11,
  sizeBody: 14,
  sizeRegular: 16,
  sizeTitle: 18,
  sizeLarge: 22,
  weightRegular: '400',
  weightSemiBold: '600',
  weightBold: '700',
};

export const SHADOWS = {
  small: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  large: {
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
};

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

