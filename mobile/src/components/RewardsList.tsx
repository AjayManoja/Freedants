import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, cardStyle, font, space, radius } from '../theme';
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
      <Svg width={22} height={22} viewBox="0 0 10 10">
        <Path d="M2 0.5h6v2.8a3 3 0 0 1-6 0z" fill={colors.gold} />
        <Path d="M2 1.4H0.6v.6A1.8 1.8 0 0 0 2.3 3.8M8 1.4h1.4v.6A1.8 1.8 0 0 1 7.7 3.8" fill="none" stroke={colors.gold} strokeWidth={0.8} />
        <Path d="M4.4 6.2h1.2v1.6H4.4zM2.7 7.8h4.6v1.7H2.7z" fill={colors.gold} />
      </Svg>
    );
    if (p.includes('2')) return (
      <Svg width={22} height={22} viewBox="0 0 10 10">
        <Path d="M3 0.4h1.4L5 2.2 5.6 0.4H7L5.9 3.2H4.1z" fill="#A9B2B8" />
        <Circle cx={5} cy={6.4} r={3} fill={colors.silver} />
        <Circle cx={5} cy={6.4} r={1.6} fill="#E3E8EA" />
      </Svg>
    );
    if (p.includes('3')) return (
      <Svg width={22} height={22} viewBox="0 0 10 10">
        <Path d="M3 0.4h1.4L5 2.2 5.6 0.4H7L5.9 3.2H4.1z" fill="#C9722E" />
        <Circle cx={5} cy={6.4} r={3} fill={colors.bronze} />
        <Circle cx={5} cy={6.4} r={1.6} fill="#F0B27A" />
      </Svg>
    );
    return (
      <Svg width={22} height={22} viewBox="0 0 10 10">
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
              <View style={styles.left}>
                {getIcon(r.position)}
                <Text style={styles.posText} maxFontSizeMultiplier={1.3}>{posText}</Text>
              </View>
              <Text style={styles.amountText} maxFontSizeMultiplier={1.3}>{amtText}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle },
  header: { flexDirection: 'row', alignItems: 'baseline', marginBottom: space.md },
  title: { ...font.section, color: colors.textPrimary },
  sub: { ...font.body, color: colors.textFaint, marginLeft: space.xs },
  list: { flexDirection: 'column' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, borderBottomWidth: 1, borderBottomColor: colors.border },
  left: { flexDirection: 'row', alignItems: 'center' },
  posText: { ...font.bodyStrong, color: colors.textPrimary, marginLeft: space.sm },
  amountText: { ...font.amount, color: colors.primary }
});

