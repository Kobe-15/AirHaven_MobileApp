/**
 * theme.js — AirHaven Design System.
 *
 * Clean, modern, calming — based on the AirHaven logo palette.
 * Exports color tokens, typography scales, spacing/radius constants,
 * shadow definitions, and a glass-morphism style helper.
 *
 * Logo colors:
 *   Dark Blue   #0A2A66
 *   Deep Blue   #1F4FA3
 *   Bright Blue #2D9CDB
 *   Light Blue  #4FA9E6
 *
 * @module theme
 * @exports PALETTE
 * @exports LIGHT_COLORS
 * @exports DARK_COLORS
 * @exports FONTS
 * @exports SPACING
 * @exports RADIUS
 * @exports SHADOWS
 * @exports glassStyle
 */

import { Platform } from 'react-native';

/* ─── Color Palette ─── */

export const PALETTE = {
  navy:       '#0A2A66',
  deepBlue:   '#1F4FA3',
  brightBlue: '#2D9CDB',
  lightBlue:  '#4FA9E6',
  skyBlue:    '#A8D8F0',
  paleBlue:   '#E8F4FD',
  white:      '#FFFFFF',
  offWhite:   '#F7FAFC',
  gray50:     '#F8FAFC',
  gray100:    '#F1F5F9',
  gray200:    '#E2E8F0',
  gray300:    '#CBD5E1',
  gray400:    '#94A3B8',
  gray500:    '#64748B',
  gray600:    '#475569',
  gray700:    '#334155',
  gray800:    '#1E293B',
  gray900:    '#0F172A',
  black:      '#000000',

  // Semantic
  green:      '#22C55E',
  greenLight: '#DCFCE7',
  yellow:     '#EAB308',
  yellowLight:'#FEF9C3',
  orange:     '#F97316',
  orangeLight:'#FFF7ED',
  red:        '#EF4444',
  redLight:   '#FEE2E2',
  purple:     '#8B5CF6',
  purpleLight:'#F3E8FF',
  maroon:     '#7E0023',
  maroonLight:'#FDE8ED',
};

/* ─── Light Theme ─── */
export const LIGHT_COLORS = {
  // Backgrounds
  background:     PALETTE.offWhite,
  surface:        PALETTE.white,
  surfaceElevated:PALETTE.white,
  card:           PALETTE.white,

  // Brand
  primary:        PALETTE.brightBlue,
  primaryDark:    PALETTE.deepBlue,
  primaryLight:   PALETTE.lightBlue,
  primaryPale:    PALETTE.paleBlue,
  accent:         PALETTE.brightBlue,
  navy:           PALETTE.navy,

  // Text
  textPrimary:    PALETTE.gray900,
  textSecondary:  PALETTE.gray500,
  textMuted:      PALETTE.gray400,
  textOnPrimary:  PALETTE.white,

  // Borders / Dividers
  border:         PALETTE.gray200,
  divider:        PALETTE.gray100,

  // Status
  success:        PALETTE.green,
  successBg:      PALETTE.greenLight,
  warning:        PALETTE.yellow,
  warningBg:      PALETTE.yellowLight,
  error:          PALETTE.red,
  errorBg:        PALETTE.redLight,

  // AQI Standard (US EPA / DENR)
  aqiGood:        '#00E400',
  aqiModerate:    '#FFFF00',
  aqiSensitive:   '#FF7E00',
  aqiUnhealthy:   '#FF0000',
  aqiVeryUnhealthy:'#8F3F97',
  aqiHazardous:   '#7E0023',

  // Misc
  overlay:        'rgba(15,23,42,0.50)',
  shimmer:        PALETTE.gray200,
};

/* ─── Dark Theme ─── */
export const DARK_COLORS = {
  // Backgrounds
  background:     PALETTE.gray900,
  surface:        PALETTE.gray800,
  surfaceElevated:'#253346',
  card:           PALETTE.gray800,

  // Brand
  primary:        PALETTE.lightBlue,
  primaryDark:    PALETTE.brightBlue,
  primaryLight:   PALETTE.skyBlue,
  primaryPale:    'rgba(79,169,230,0.12)',
  accent:         PALETTE.lightBlue,
  navy:           PALETTE.lightBlue,

  // Text
  textPrimary:    PALETTE.gray50,
  textSecondary:  PALETTE.gray400,
  textMuted:      PALETTE.gray500,
  textOnPrimary:  PALETTE.gray900,

  // Borders / Dividers
  border:         PALETTE.gray700,
  divider:        PALETTE.gray700,

  // Status
  success:        '#4ADE80',
  successBg:      'rgba(74,222,128,0.12)',
  warning:        '#FACC15',
  warningBg:      'rgba(250,204,21,0.12)',
  error:          '#F87171',
  errorBg:        'rgba(248,113,113,0.12)',

  // AQI Standard (US EPA / DENR)
  aqiGood:        '#00E400',
  aqiModerate:    '#FFFF00',
  aqiSensitive:   '#FF7E00',
  aqiUnhealthy:   '#FF0000',
  aqiVeryUnhealthy:'#8F3F97',
  aqiHazardous:   '#7E0023',

  // Misc
  overlay:        'rgba(0,0,0,0.65)',
  shimmer:        PALETTE.gray700,
};

/* ─── Typography ─── */
export const FONTS = {
  thin:     '100',
  light:    '300',
  regular:  '400',
  medium:   '500',
  semiBold: '600',
  bold:     '700',
  black:    '900',
};

/* ─── Spacing (4-pt grid) ─── */
export const SPACING = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

/* ─── Border Radius ─── */
export const RADIUS = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  xxl:   28,
  round: 999,
};

/* ─── Shadows ─── */
export const SHADOWS = {
  sm: {
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

/* ─── Glassmorphism helper ─── */

/**
 * Returns a style object that creates a glass-card effect.
 * Uses backdrop-filter on web, semi-transparent bg on native.
 *
 * @param {boolean} isDark – whether dark mode is active
 * @param {number} opacity – background opacity (0–1), default 0.55
 * @param {number} blur – blur radius in px, default 16
 */
export const glassStyle = (isDark = false, opacity = 0.55, blur = 16) => {
  const bg = isDark
    ? `rgba(30, 41, 59, ${opacity})`   // gray-800 tint
    : `rgba(255, 255, 255, ${opacity})`; // white tint

  const borderColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(255,255,255,0.60)';

  return {
    backgroundColor: bg,
    borderWidth: 1,
    borderColor,
    ...(Platform.OS === 'web'
      ? { backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }
      : {}),
  };
};
