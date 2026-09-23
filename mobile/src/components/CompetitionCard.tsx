import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { font, space, radius, icon, colors, cardStyle, fontFamilies } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { RegistrationStatus } from '../api/types';
import { useLocale } from '../i18n/LocaleContext';
import { fmt } from '../i18n/en';
import { formatMoney } from '../utils/format';

export interface CompetitionCardProps {
  title: string;
  tags: string[];
  perks: string[];
  prizePool: number;
  entryFee: number;
  capacity: number;
  bookedCount: number;
  currency: string;
  status: RegistrationStatus;
}

export function CompetitionCard({ title, tags, perks, prizePool, entryFee, capacity, bookedCount, currency, status }: CompetitionCardProps) {
  const { t } = useLocale();
  const spotsLeft = Math.max(0, capacity - bookedCount);
  const showBadge = status === 'registered' || status === 'submitted';
  const badgeLabel = status === 'submitted' ? t.submitted : t.registered;
  const barFillRatio = capacity > 0 ? Math.min(1, bookedCount / capacity) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {showBadge && (
          <View style={styles.badge}>
            <Svg width={10} height={10} viewBox="0 0 10 10">
              <Circle cx={5} cy={5} r={5} fill={colors.primary} />
              <Path d="M2.9 5.1l1.4 1.4 2.8-2.9" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      <View style={styles.tagsRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.chip}>
            <Text style={styles.chipText}>{tag}</Text>
          </View>
        ))}
        {perks.length > 0 && (
          <View style={styles.perkRow}>
            <Svg width={8} height={10} viewBox="0 0 8 10">
              <Path d="M1.5 1h5v2.2a2.5 2.5 0 0 1-5 0zM4 5.7v1.8M2.3 9h3.4M2.8 7.5h2.4v1.5H2.8z" fill="none" stroke={colors.primary} strokeWidth={1} strokeLinejoin="round" />
            </Svg>
            <Text style={styles.perkText}>{perks[0]}</Text>
          </View>
        )}
      </View>

      <View style={styles.columns}>
        <View style={styles.prizeCol}>
          <Text style={styles.colLabel}>{t.prizePool}</Text>
          <Text style={styles.prizeVal} numberOfLines={1}>{formatMoney(prizePool, currency)}</Text>
        </View>
        <View style={styles.feeCol}>
          <Text style={styles.colLabel}>{t.entryFee}</Text>
          <Text style={styles.feeVal} numberOfLines={1}>{formatMoney(entryFee, currency)}</Text>
        </View>
        <View style={styles.spotsCol}>
          <View style={styles.spotsLeftGroup}>
            <Svg width={10} height={9} viewBox="0 0 12 10">
              <Circle cx={4} cy={3} r={2} fill="none" stroke={colors.primary} strokeWidth={1} />
              <Path d="M0.6 9.4a3.4 3.4 0 0 1 6.8 0" fill="none" stroke={colors.primary} strokeWidth={1} />
              <Circle cx={8.3} cy={3} r={1.7} fill="none" stroke={colors.primary} strokeWidth={1} />
              <Path d="M8.6 6a3 3 0 0 1 2.8 3.4" fill="none" stroke={colors.primary} strokeWidth={1} />
            </Svg>
            <Text style={styles.spotsText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.3}>
              {fmt(t.onlySpotsLeft, { n: spotsLeft })}
            </Text>
          </View>
          <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: capacity, now: bookedCount }}>
            <View style={[styles.progressFill, { width: `${barFillRatio * 100}%` }]} />
          </View>
          <Text style={styles.bookedText} maxFontSizeMultiplier={1.3}>
            {fmt(t.booked, { booked: bookedCount, capacity })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    paddingTop: 7,
    paddingRight: 11,
    paddingBottom: 0,
    paddingLeft: 12,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  title: {
    ...font.title,
    color: colors.textPrimary,
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  badge: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 0,
    paddingRight: 6,
    paddingBottom: 0,
    paddingLeft: 5,
    backgroundColor: colors.badgeBg,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 7,
    fontWeight: '600',
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: fontFamilies.medium,
    fontSize: 6,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 9,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 3,
  },
  perkText: {
    fontFamily: fontFamilies.medium,
    fontSize: 7.5,
    fontWeight: '500',
    color: colors.primary,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  prizeCol: {
    width: 104,
  },
  feeCol: {
    width: 110,
  },
  spotsCol: {
    width: 116,
    marginTop: -3,
  },
  colLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 6.5,
    color: colors.textMuted,
    lineHeight: 9,
  },
  prizeVal: {
    ...font.display,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  feeVal: {
    ...font.amountLg,
    color: colors.navy,
  },
  spotsLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  spotsText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 8,
    fontWeight: '600',
    color: colors.primary,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    marginTop: 5,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  bookedText: {
    fontFamily: fontFamilies.regular,
    fontSize: 6.5,
    color: colors.textMuted,
    marginTop: 3,
  },
});
