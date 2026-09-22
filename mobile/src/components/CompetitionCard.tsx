import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { font, space, radius, icon, colors, cardStyle, useLayout } from '../theme';
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
  const { isWide } = useLayout();
  const spotsLeft = Math.max(0, capacity - bookedCount);
  const showBadge = status === 'registered' || status === 'submitted';
  const badgeLabel = status === 'submitted' ? t.submitted : t.registered;
  const barFillRatio = capacity > 0 ? Math.min(1, bookedCount / capacity) : 0;

  const spotsLabel = (
    <View style={styles.spotsLeftGroup}>
      <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 10">
        <Circle cx={4} cy={3} r={2} fill="none" stroke={colors.primary} strokeWidth={1.5} />
        <Path d="M0.6 9.4a3.4 3.4 0 0 1 6.8 0" fill="none" stroke={colors.primary} strokeWidth={1.5} />
        <Circle cx={8.3} cy={3} r={1.7} fill="none" stroke={colors.primary} strokeWidth={1.5} />
        <Path d="M8.6 6a3 3 0 0 1 2.8 3.4" fill="none" stroke={colors.primary} strokeWidth={1.5} />
      </Svg>
      <Text style={styles.spotsText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.3}>
        {fmt(t.onlySpotsLeft, { n: spotsLeft })}
      </Text>
    </View>
  );
  const bookedLabel = (
    <Text style={styles.bookedText} maxFontSizeMultiplier={1.3}>{fmt(t.booked, { booked: bookedCount, capacity })}</Text>
  );
  const progress = (
    <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: capacity, now: bookedCount }}>
      <View style={[styles.progressFill, { width: `${barFillRatio * 100}%` }]} />
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {showBadge && (
          <View style={styles.badge}>
            <Svg width={icon.xs} height={icon.xs} viewBox="0 0 10 10">
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
            <Svg width={icon.xs} height={icon.xs} viewBox="0 0 8 10">
              <Path d="M1.5 1h5v2.2a2.5 2.5 0 0 1-5 0zM4 5.7v1.8M2.3 9h3.4M2.8 7.5h2.4v1.5H2.8z" fill="none" stroke={colors.primary} strokeWidth={1.5} strokeLinejoin="round" />
            </Svg>
            <Text style={styles.perkText}>{perks[0]}</Text>
          </View>
        )}
      </View>

      <View style={styles.columns}>
        <View style={isWide ? styles.columnAuto : styles.column}>
          <Text style={styles.colLabel}>{t.prizePool}</Text>
          <Text style={styles.prizeVal} numberOfLines={1}>{formatMoney(prizePool, currency)}</Text>
        </View>
        <View style={isWide ? styles.columnAuto : styles.column}>
          <Text style={styles.colLabel}>{t.entryFee}</Text>
          <Text style={styles.feeVal} numberOfLines={1}>{formatMoney(entryFee, currency)}</Text>
        </View>

        {/* Wide screens: spots as a third column, as in the design */}
        {isWide && (
          <View style={styles.spotsColumn}>
            {spotsLabel}
            {progress}
            {bookedLabel}
          </View>
        )}
      </View>

      {/* Regular screens: spots block runs full width (MOBILE_SIZING §4.1) */}
      {!isWide && (
        <View style={styles.spotsBlock}>
          <View style={styles.spotsRow}>
            {spotsLabel}
            {bookedLabel}
          </View>
          {progress}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  title: {
    ...font.title,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  badge: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.badgeBg,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...font.label,
    fontFamily: font.bodyStrong.fontFamily,
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
  },
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    height: 26,
    justifyContent: 'center',
  },
  chipText: {
    ...font.label,
    color: colors.textPrimary,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginLeft: space.xs,
  },
  perkText: {
    ...font.label,
    color: colors.primary,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: space.lg,
    gap: space.md,
  },
  column: {
    flex: 1,
  },
  columnAuto: {
    flexShrink: 0,
  },
  colLabel: {
    ...font.label,
    color: colors.textMuted,
  },
  prizeVal: {
    ...font.display,
    color: colors.primary,
  },
  feeVal: {
    ...font.amountLg,
    color: colors.textPrimary,
  },
  spotsColumn: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
    gap: space.xs,
  },
  spotsBlock: {
    marginTop: space.lg,
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  spotsLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flexShrink: 1,
  },
  spotsText: {
    ...font.bodyStrong,
    color: colors.primary,
    flexShrink: 1,
  },
  bookedText: {
    ...font.label,
    color: colors.textMuted,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    marginTop: space.sm,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
