import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, cardStyle, fontFamilies } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { formatMoney } from '../utils/format';
import { useLocale } from '../i18n/LocaleContext';

export interface Reward {
  _id?: string;
  id?: string;
  position: number | string;
  label?: string;
  amount: number | string;
  icon?: string;
}

export interface RewardsListProps {
  rewards: Reward[];
  currency: string;
}

export function RewardsList({ rewards, currency }: RewardsListProps) {
  const { t } = useLocale();

  const getIcon = (pos: number | string) => {
    const p = String(pos);
    if (p.includes('1')) return (
      <Svg width={10} height={10} viewBox="0 0 10 10" style={styles.icon}>
        <Path d="M2 0.5h6v2.8a3 3 0 0 1-6 0z" fill={colors.gold} />
        <Path d="M2 1.4H0.6v.6A1.8 1.8 0 0 0 2.3 3.8M8 1.4h1.4v.6A1.8 1.8 0 0 1 7.7 3.8" fill="none" stroke={colors.gold} strokeWidth={0.8} />
        <Path d="M4.4 6.2h1.2v1.6H4.4zM2.7 7.8h4.6v1.7H2.7z" fill={colors.gold} />
      </Svg>
    );
    if (p.includes('2')) return (
      <Svg width={10} height={10} viewBox="0 0 10 10" style={styles.icon}>
        <Path d="M3 0.4h1.4L5 2.2 5.6 0.4H7L5.9 3.2H4.1z" fill="#A9B2B8" />
        <Circle cx={5} cy={6.4} r={3} fill={colors.silver} />
        <Circle cx={5} cy={6.4} r={1.6} fill="#E3E8EA" />
      </Svg>
    );
    if (p.includes('3')) return (
      <Svg width={10} height={10} viewBox="0 0 10 10" style={styles.icon}>
        <Path d="M3 0.4h1.4L5 2.2 5.6 0.4H7L5.9 3.2H4.1z" fill="#C9722E" />
        <Circle cx={5} cy={6.4} r={3} fill={colors.bronze} />
        <Circle cx={5} cy={6.4} r={1.6} fill="#F0B27A" />
      </Svg>
    );
    return (
      <Svg width={10} height={10} viewBox="0 0 10 10" style={styles.icon}>
        <Path d="M5 0.8l1.25 2.6 2.85.35-2.1 1.95.55 2.8L5 7.1 2.45 8.5 3 5.7 0.9 3.75l2.85-.35z" fill="none" stroke={colors.primary} strokeWidth={0.9} strokeLinejoin="round" />
      </Svg>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>{t.rewards}</Text>
        <Text style={styles.sub} maxFontSizeMultiplier={1.3}>{t.allPositions}</Text>
      </View>
      <View style={styles.list}>
        {rewards.map((r, i) => {
          const posText = r.label || (typeof r.position === 'number' ? `${r.position === 1 ? '1st' : r.position === 2 ? '2nd' : r.position === 3 ? '3rd' : `${r.position}th`} Winner` : String(r.position));
          const amtText = typeof r.amount === 'number' ? formatMoney(r.amount, currency) : String(r.amount);
          return (
            <View key={r._id || r.id || i} style={styles.row}>
              {getIcon(r.position)}
              <Text style={styles.posText} maxFontSizeMultiplier={1.3}>{posText}</Text>
              <Text style={styles.amountText} maxFontSizeMultiplier={1.3}>{amtText}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    borderRadius: 8,
    paddingTop: 6,
    paddingRight: 25,
    paddingBottom: 0,
    paddingLeft: 10,
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    height: 10,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 7,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 10,
  },
  sub: {
    fontFamily: fontFamilies.regular,
    fontSize: 6,
    color: colors.textFaint,
    lineHeight: 10,
  },
  list: {
    flexDirection: 'column',
    marginTop: 2,
  },
  row: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 7,
  },
  posText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 7,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
    lineHeight: 10,
  },
  amountText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 'auto',
    lineHeight: 10,
  },
});
