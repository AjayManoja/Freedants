import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, cardStyle, font, space, fontFamilies } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { RazorpayLogo } from './RazorpayLogo';
import { useLocale } from '../i18n/LocaleContext';

export interface PrizeTrustCardProps {
  onPlayVideo: () => void;
}

function ShieldIcon() {
  return (
    <Svg width={9} height={11} viewBox="0 0 9 11">
      <Path d="M4.5 0.6L0.8 2v3.2c0 2.4 1.6 4.3 3.7 5.1 2.1-.8 3.7-2.7 3.7-5.1V2z" fill="none" stroke={colors.textPrimary} strokeWidth={0.9} strokeLinejoin="round" />
      <Path d="M2.9 5.4l1.1 1.1 2.1-2.2" fill="none" stroke={colors.textPrimary} strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PrizeTrustCard({ onPlayVideo }: PrizeTrustCardProps) {
  const { t } = useLocale();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.videoRow}
        onPress={onPlayVideo}
        accessibilityRole="button"
        accessibilityLabel={`${t.howReceivePrize} ${t.watchVideo}`}
      >
        <View style={styles.playBox}>
          <View style={styles.playCircle}>
            <Svg width={5} height={6} viewBox="0 0 5 6">
              <Path d="M0.6 0.4v5.2L4.7 3z" fill={colors.white} />
            </Svg>
          </View>
        </View>
        <View style={styles.videoText}>
          <Text style={styles.title}>{t.howReceivePrize}</Text>
          <Text style={styles.sub}>{t.watchVideo}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.dividerVertical} />

      <View style={styles.trustCol}>
        <View style={styles.row}>
          <ShieldIcon />
          <Text style={styles.trustText}>{t.refundPolicy}</Text>
        </View>
        <View style={styles.row}>
          <ShieldIcon />
          <View style={styles.poweredWrap}>
            <Text style={styles.poweredText}>{t.securePayments}</Text>
            <RazorpayLogo size={7} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    height: 41,
    padding: 0,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBox: {
    width: 26,
    height: 27,
    borderRadius: 5,
    backgroundColor: colors.playBgAlt,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  playCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginLeft: 11,
    width: 98,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 6.5,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 9,
  },
  sub: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: colors.textMuted,
    lineHeight: 9,
    marginTop: 2,
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.divider,
    marginLeft: 17,
  },
  trustCol: {
    marginLeft: 15,
    flexDirection: 'column',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  trustText: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: colors.textSecondary,
  },
  poweredWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  poweredText: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: colors.textSecondary,
  },
});
