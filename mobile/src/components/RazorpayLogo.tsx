import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { fontFamilies } from '../theme';

const MARK_LIGHT = '#3395FF';
const MARK_DARK = '#072654';

export interface RazorpayLogoProps {
  /** Height of the wordmark text in pt; the mark scales with it. */
  size?: number;
  color?: string;
}

/** Razorpay wordmark: two-tone slanted mark followed by bold "Razorpay". */
export function RazorpayLogo({ size = 14, color = MARK_DARK }: RazorpayLogoProps) {
  const markSize = Math.round(size * 1.1);
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Razorpay">
      <Svg width={markSize} height={markSize} viewBox="0 0 24 24">
        <Path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24z" fill={MARK_LIGHT} />
        <Path d="M14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z" fill={MARK_DARK} />
      </Svg>
      <Text
        style={[styles.text, { fontSize: size, lineHeight: Math.round(size * 1.3), color }]}
        maxFontSizeMultiplier={1.3}
      >
        Razorpay
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { fontFamily: fontFamilies.bold, marginLeft: 2, letterSpacing: -0.2 },
});
