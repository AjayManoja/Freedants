import { useWindowDimensions, ViewStyle } from 'react-native';

export const GUTTER = 16;

// ── Responsive layout ─────────────────────────────────────
// compact  < 360pt   small phones (iPhone SE 1st gen, small Androids): single-column fallbacks
// regular  360–409pt most phones: stacked rows from MOBILE_SIZING.md §4
// wide     ≥ 410pt   large phones (Pixel Pro, iPhone Plus/Pro Max): side-by-side rows as in the design
// On tablets the content column is capped and centred.
export const BREAKPOINTS = { compact: 360, wide: 410 } as const;
export const MAX_CONTENT_WIDTH = 560;

export function useLayout() {
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width, MAX_CONTENT_WIDTH + 2 * GUTTER);
  return {
    width,
    containerWidth,
    contentWidth: containerWidth - 2 * GUTTER,
    isCompact: width < BREAKPOINTS.compact,
    isWide: width >= BREAKPOINTS.wide,
  };
}

// ── Colours ──────────────────────────────────────────────
export const colors = {
  primary: '#0B7B7D',
  primaryDark: '#085E60',
  textPrimary: '#1B2340',
  textSecondary: '#3E4660',
  textInactiveTab: '#3E4A6B',
  textMuted: '#7E8497',
  textFaint: '#8A90A2',
  textBody: '#6C7286',
  winnerRole: '#3A8E8F',
  border: '#EEF0F3',
  divider: '#E6E9EE',
  chipBg: '#F2F4F7',
  winnerCardBg: '#F4F6F9',
  tintBg: '#EAF7F6',
  badgeBg: '#E8F5F4',
  playBg: '#EAF5F4',
  playBgAlt: '#DFF2EF',
  mintBg: '#E9FBF2',
  referIcon: '#3FAF93',
  progressTrack: '#D5E9E8',
  gold: '#E0A52C',
  silver: '#B7C0C4',
  bronze: '#D98A3F',
  navInactiveIcon: '#8E90AC',
  navInactiveLabel: '#9496AE',
  disabled: '#9AA3B2',
  razorpayText: '#0C2451',
  razorpayMark: '#1B3B8F',
  white: '#FFFFFF',
  sheetHandle: '#D9DDE4',
  backdrop: 'rgba(15,20,40,0.45)',
  dashedBorder: '#CDD2DA',
  adText: '#5B637C',
  langPillBg: '#F2F4F6',
  earnText: '#2F8C83',
  copyBorder: '#DDE3E6',
  toastBg: '#1B2340',
  danger: '#D64545',
  dangerBg: '#FDECEC',
  videoBg: '#000000',
  videoBackdrop: 'rgba(10,14,24,0.88)',

  // Aliases for compatibility
  navy: '#1B2340',
  muted: '#7E8497',
  faint: '#8A90A2',
  textDark: '#1B2340',
  body: '#6C7286',
  inactive: '#3E4A6B',
  success: '#0B7B7D',
};

// ── Spacing & Layout Tokens ───────────────────────────────────────────
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 8, md: 12, lg: 14, pill: 999 };
export const icon = { xs: 16, sm: 20, md: 24, lg: 44 };
export const hit = 44; // minimum touch target

export const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

export const cardStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  padding: space.lg,
  shadowColor: 'rgba(20,30,60,1)',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

// ── Typography Tokens ───────────────────────────────────────────
export const fontFamilies = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const font = {
  display:    { fontFamily: fontFamilies.bold,     fontSize: 30, lineHeight: 36 },
  amountLg:   { fontFamily: fontFamilies.bold,     fontSize: 24, lineHeight: 30 },
  title:      { fontFamily: fontFamilies.bold,     fontSize: 20, lineHeight: 26 },
  timer:      { fontFamily: fontFamilies.bold,     fontSize: 18, lineHeight: 24 },
  name:       { fontFamily: fontFamilies.bold,     fontSize: 16, lineHeight: 22 },
  section:    { fontFamily: fontFamilies.semiBold, fontSize: 15, lineHeight: 22 },
  button:     { fontFamily: fontFamilies.semiBold, fontSize: 16, lineHeight: 22 },
  amount:     { fontFamily: fontFamilies.bold,     fontSize: 15, lineHeight: 20 },
  bodyStrong: { fontFamily: fontFamilies.semiBold, fontSize: 14, lineHeight: 20 },
  body:       { fontFamily: fontFamilies.regular,  fontSize: 13, lineHeight: 20 },
  label:      { fontFamily: fontFamilies.medium,   fontSize: 12, lineHeight: 16 },
  caption:    { fontFamily: fontFamilies.regular,  fontSize: 11, lineHeight: 14 },
};

