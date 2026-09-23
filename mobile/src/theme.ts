import { ViewStyle } from 'react-native';

// ── Design constants ──────────────────────────────────────
// The original design is 390px wide with 18px side gutters.
// All sizes below are the exact design px from Main.dc.html.
export const GUTTER = 18;
export const MAX_CONTENT_WIDTH = 354;

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

// ── Spacing & Layout Tokens (design px) ───────────────────
export const space = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 };
export const radius = { sm: 4, md: 8, lg: 14, pill: 999 };
export const icon = { xs: 10, sm: 12, md: 14, lg: 28 };
export const hit = 44; // minimum touch target (kept for accessibility)

export const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

export const cardStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  padding: 9,
  shadowColor: 'rgba(20,30,60,1)',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

// ── Typography Tokens (original design px from Main.dc.html) ──
export const fontFamilies = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const font = {
  display:    { fontFamily: fontFamilies.bold,     fontSize: 21, lineHeight: 26 },
  amountLg:   { fontFamily: fontFamilies.bold,     fontSize: 16.5, lineHeight: 26 },
  title:      { fontFamily: fontFamilies.bold,     fontSize: 14.5, lineHeight: 17 },
  timer:      { fontFamily: fontFamilies.bold,     fontSize: 10, lineHeight: 24 },
  name:       { fontFamily: fontFamilies.bold,     fontSize: 10.5, lineHeight: 14 },
  section:    { fontFamily: fontFamilies.bold,     fontSize: 7.5, lineHeight: 12 },
  button:     { fontFamily: fontFamilies.semiBold, fontSize: 8, lineHeight: 11 },
  amount:     { fontFamily: fontFamilies.bold,     fontSize: 8, lineHeight: 10 },
  bodyStrong: { fontFamily: fontFamilies.semiBold, fontSize: 7, lineHeight: 11 },
  body:       { fontFamily: fontFamilies.regular,  fontSize: 6.5, lineHeight: 11 },
  label:      { fontFamily: fontFamilies.medium,   fontSize: 6.5, lineHeight: 9 },
  caption:    { fontFamily: fontFamilies.regular,  fontSize: 5.5, lineHeight: 9 },
} as const;
