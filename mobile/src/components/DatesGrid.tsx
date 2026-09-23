import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { font, fontFamilies, space, colors, cardStyle, icon } from '../theme';
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

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.importantDates}</Text>
      <View style={styles.grid}>
        <View style={[styles.cell, styles.cellTopLeft]}>
          <Svg width={12} height={12} viewBox="0 0 12 12" style={styles.icon}>
            <Rect x={0.7} y={1.6} width={10.6} height={9.7} rx={1.6} fill="none" stroke={colors.primary} strokeWidth={1.1} />
            <Path d="M0.7 4.5h10.6M3.5 0.5v2.2M8.5 0.5v2.2M3 7.6h6" stroke={colors.primary} strokeWidth={1.1} strokeLinecap="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.registerBefore}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.registrationClosesAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.registrationClosesAt)}</Text>
          </View>
        </View>

        <View style={[styles.cell, styles.cellTopRight]}>
          <Svg width={12} height={12} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M11.2 0.8L0.8 4.9l4.3 1.8 1.9 4.4zM11.2 0.8L5.1 6.7" fill="none" stroke={colors.primary} strokeWidth={1.1} strokeLinejoin="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.submissionStarts}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.submissionStartsAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.submissionStartsAt)}</Text>
          </View>
        </View>

        <View style={[styles.cell, styles.cellBottomLeft]}>
          <Svg width={12} height={12} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M6 8V1M3 3.8L6 0.9l3 2.9M1 7.8v2.3c0 .6.5 1.1 1.1 1.1h7.8c.6 0 1.1-.5 1.1-1.1V7.8" fill="none" stroke={colors.primary} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <View style={styles.cellText}>
            <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.submissionEnds}</Text>
            <Text style={styles.date} maxFontSizeMultiplier={1.3}>{formatShortDate(dates.submissionEndsAt)}</Text>
            <Text style={styles.time} maxFontSizeMultiplier={1.3}>{formatTime(dates.submissionEndsAt)}</Text>
          </View>
        </View>

        <View style={[styles.cell, styles.cellBottomRight]}>
          <Svg width={12} height={12} viewBox="0 0 12 12" style={styles.icon}>
            <Path d="M2.5 0.8h6v3a3 3 0 0 1-6 0zM2.5 1.8H0.7v.8a2 2 0 0 0 1.9 2M8.5 1.8h1.8v.8a2 2 0 0 1-1.9 2M5.5 6.8v1.6M3.3 8.4h4.4v2.8H3.3z" fill="none" stroke={colors.primary} strokeWidth={1.1} strokeLinejoin="round" />
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
  card: {
    ...cardStyle,
    height: 105,
    marginTop: 4,
    padding: 0,
    paddingTop: 4,
    paddingHorizontal: 9,
    paddingBottom: 0,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 7.5,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 12,
    marginLeft: 1,
  },
  grid: {
    marginTop: 3,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 5,
    height: 82,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cell: {
    width: '50%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cellTopLeft: {
    paddingTop: 7,
    paddingLeft: 32,
    paddingRight: 0,
    paddingBottom: 0,
    gap: 7,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cellTopRight: {
    paddingTop: 7,
    paddingLeft: 27,
    paddingRight: 0,
    paddingBottom: 0,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cellBottomLeft: {
    paddingTop: 7,
    paddingLeft: 32,
    paddingRight: 0,
    paddingBottom: 0,
    gap: 7,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
  },
  cellBottomRight: {
    paddingTop: 7,
    paddingLeft: 29,
    paddingRight: 0,
    paddingBottom: 0,
    gap: 10,
  },
  icon: {
    marginTop: 5,
  },
  cellText: {
    flexDirection: 'column',
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: 6,
    color: colors.textFaint,
    lineHeight: 9,
  },
  date: {
    fontFamily: fontFamilies.bold,
    fontSize: 7.5,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 10,
  },
  time: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 6.5,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 10,
  },
});
