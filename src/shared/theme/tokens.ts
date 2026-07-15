/** Design tokens — единственный источник правды по визуальной системе (раздел 28 ТЗ) */

export const colors = {
  bgPrimary: '#05090B',
  bgSecondary: '#091013',
  surfacePrimary: '#101619',
  surfaceElevated: '#151D21',
  surfaceSoft: '#0C1215',
  borderSubtle: '#1D282D',
  borderStrong: '#2A383E',

  textPrimary: '#F5F7F8',
  textSecondary: '#B6BEC6',
  textMuted: '#747E87',
  textDisabled: '#4E565E',

  accentPrimary: '#18D49B',
  accentBright: '#27E6B0',
  accentDeep: '#07966F',
  accentHover: '#24DEAA',
  accentPressed: '#0CB584',
  accentSurface: 'rgba(24,212,155,0.11)',
  accentSurfaceStrong: 'rgba(24,212,155,0.18)',
  accentBorder: 'rgba(39,230,176,0.32)',
  accentGlow: 'rgba(18,214,156,0.22)',

  warning: '#F4B740',
  error: '#F05D5E',
  info: '#5CA8FF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 40, lineHeight: 46, fontWeight: '800' as const, letterSpacing: -1.2 },
  h1: { fontSize: 30, lineHeight: 36, fontWeight: '800' as const, letterSpacing: -0.7 },
  h2: { fontSize: 23, lineHeight: 29, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  bodyL: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodyM: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  number: { fontSize: 52, lineHeight: 58, fontWeight: '700' as const, letterSpacing: -1.4 },
} as const;

export const hitSlop = { minWidth: 44, minHeight: 44 } as const;
