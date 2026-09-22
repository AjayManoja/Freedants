import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, cardStyle, font, space, useLayout } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { RazorpayLogo } from './RazorpayLogo';
import { useLocale } from '../i18n/LocaleContext';

export interface PrizeTrustCardProps {
  onPlayVideo: () => void;
}

function ShieldIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 8 10">
      <Path d="M4.5 0.6L0.8 2v3.2c0 2.4 1.6 4.3 3.7 5.1 2.1-.8 3.7-2.7 3.7-5.1V2z" fill="none" stroke={colors.textPrimary} strokeWidth={1.2} strokeLinejoin="round" />
      <Path d="M2.9 5.4l1.1 1.1 2.1-2.2" fill="none" stroke={colors.textPrimary} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PrizeTrustCard({ onPlayVideo }: PrizeTrustCardProps) {
  const { t } = useLocale();
  const { isWide } = useLayout();

  return (
    // Wide screens: video | trust rows side by side (as in the design).
    // Regular screens: stacked with a horizontal divider (MOBILE_SIZING §4.9).
    <View style={[styles.card, isWide && styles.cardWide]}>
      <TouchableOpacity
        style={[styles.videoRow, isWide && styles.half]}
        onPress={onPlayVideo}
        accessibilityRole="button"
        accessibilityLabel={`${t.howReceivePrize} ${t.watchVideo}`}
      >
        <View style={styles.playBox}>
          <View style={styles.playCircle}>
            <Svg width={12} height={12} viewBox="0 0 6 6">
              <Path d="M1 1v4l4-2z" fill={colors.white} />
            </Svg>
          </View>
        </View>
        <View style={styles.videoText}>
          <Text style={styles.title}>{t.howReceivePrize}</Text>
          <Text style={styles.sub}>{t.watchVideo}</Text>
        </View>
      </TouchableOpacity>

      <View style={isWide ? styles.dividerVertical : styles.divider} />

      <View style={isWide ? styles.half : undefined}>
        <View style={styles.row}>
          <ShieldIcon />
          <Text style={styles.trustText}>{t.refundPolicy}</Text>
        </View>
        <View style={styles.row}>
          <ShieldIcon />
          <View style={styles.poweredWrap}>
            <Text style={styles.poweredText}>{t.securePayments}</Text>
            <RazorpayLogo size={14} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  cardWide: { flexDirection: 'row', alignItems: 'center' },
  half: { flex: 1 },
  videoRow: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  playBox: { width: 48, height: 48, backgroundColor: colors.playBgAlt, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  playCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', paddingLeft: 2 },
  videoText: { marginLeft: space.md, flex: 1 },
  title: { ...font.bodyStrong, color: colors.textPrimary },
  sub: { ...font.caption, color: colors.textMuted, marginTop: space.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space.md },
  dividerVertical: { width: 1, alignSelf: 'stretch', backgroundColor: colors.border, marginHorizontal: space.md },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 28, marginVertical: 2 },
  trustText: { ...font.body, color: colors.textPrimary, marginLeft: space.sm, flexShrink: 1 },
  poweredWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6, marginLeft: space.sm },
  poweredText: { ...font.body, color: colors.textPrimary },
});
