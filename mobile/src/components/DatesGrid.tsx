import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { font, space, colors, cardStyle, icon, useLayout } from '../theme';
import { formatShortDate, formatTime } from '../utils/format';
import Svg, { Path, Rect } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';


export interface DatesGridProps {
  dates: {
    registrationClosesAt: string;
    submissionStartsAt: string;
    submissionEndsAt: string;
    resultAt: string;
  };
}

export function DatesGrid({ dates }: DatesGridProps) {
  const { t } = useLocale();
  // Each cell needs ~170pt; below that, fall back to one column (MOBILE_SIZING §4.4)
  const isSmall = useLayout().contentWidth < 340;
  const numColumns = isSmall ? 1 : 2;
  const cellWidth = isSmall ? '100%' : '50%';

  return (
    <View>
      <Text style={styles.title}>{t.importantDates}</Text>
      <View style={styles.grid}>
        <View style={[styles.cell, { width: cellWidth }, !isSmall && styles.borderRight, styles.borderBottom]}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.icon}>
            <Rect x={0.7} y={1.6} width={10.6} height={9.7} rx={1.6} fill="none" stroke={colors.primary} strokeWidth={1.75} />
            <Path d="M0.7 4.5h10.6M3.5 0.5v2.2M8.5 0.5v2.2M3 7.6h6" stroke={colors.primary} strokeWidth={1.75} strokeLinecap="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.registerBefore}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.registrationClosesAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.registrationClosesAt)}</Text>
          </View>
        </View>
        
        <View style={[styles.cell, { width: cellWidth }, styles.borderBottom]}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M11.2 0.8L0.8 4.9l4.3 1.8 1.9 4.4zM11.2 0.8L5.1 6.7" fill="none" stroke={colors.primary} strokeWidth={1.75} strokeLinejoin="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.submissionStarts}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.submissionStartsAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.submissionStartsAt)}</Text>
          </View>
        </View>
        
        <View style={[styles.cell, { width: cellWidth }, !isSmall && styles.borderRight, isSmall && styles.borderBottom]}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M6 8V1M3 3.8L6 0.9l3 2.9M1 7.8v2.3c0 .6.5 1.1 1.1 1.1h7.8c.6 0 1.1-.5 1.1-1.1V7.8" fill="none" stroke={colors.primary} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.submissionEnds}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.submissionEndsAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.submissionEndsAt)}</Text>
          </View>
        </View>
        
        <View style={[styles.cell, { width: cellWidth }]}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M2.5 0.8h6v3a3 3 0 0 1-6 0zM2.5 1.8H0.7v.8a2 2 0 0 0 1.9 2M8.5 1.8h1.8v.8a2 2 0 0 1-1.9 2M5.5 6.8v1.6M3.3 8.4h4.4v2.8H3.3z" fill="none" stroke={colors.primary} strokeWidth={1.75} strokeLinejoin="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.resultDate}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.resultAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.resultAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...font.section,
    color: colors.textPrimary,
    marginBottom: space.sm,
  },
  grid: {
    ...cardStyle,
    padding: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  cellText: {
    flex: 1,
  },
  icon: {
    marginRight: space.sm,
    marginTop: 2,
  },
  label: {
    ...font.label,
    color: colors.textFaint,
    marginBottom: 2,
  },
  date: {
    ...font.bodyStrong,
    color: colors.primary,
    marginBottom: 2,
  },
  time: {
    ...font.bodyStrong,
    color: colors.textPrimary,
  }
});
