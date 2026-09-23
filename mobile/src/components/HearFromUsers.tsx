import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, space, radius, icon, hitSlop, fontFamilies } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';

export interface HearFromUsersProps {
  onPress: () => void;
}

export function HearFromUsers({ onPress }: HearFromUsersProps) {
  const { t } = useLocale();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={`${t.hearFromUsers}. ${t.hearFromUsersSub}`}
    >
      <Svg width={11} height={11} viewBox="0 0 11 11">
        <Path
          d="M2 0.8h7A1.3 1.3 0 0 1 10.3 2.1v5A1.3 1.3 0 0 1 9 8.4H4.3L1.8 10.3V8.4A1.3 1.3 0 0 1 .7 7.1v-5A1.3 1.3 0 0 1 2 .8z"
          fill="none"
          stroke={colors.navy}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        <Circle cx={3.6} cy={4.6} r={0.6} fill={colors.navy} />
        <Circle cx={5.5} cy={4.6} r={0.6} fill={colors.navy} />
        <Circle cx={7.4} cy={4.6} r={0.6} fill={colors.navy} />
      </Svg>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{t.hearFromUsers}</Text>
        <Text style={styles.sub}>{t.hearFromUsersSub}</Text>
      </View>
      <Svg width={5} height={8} viewBox="0 0 5 8" style={styles.chevron}>
        <Path
          d="M1 1l3 3-3 3"
          fill="none"
          stroke={colors.navy}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 22,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 11,
    shadowColor: 'rgba(20,30,60,1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textWrap: {
    marginLeft: 7,
    flexDirection: 'column',
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 6.5,
    fontWeight: '600',
    color: colors.navy,
    lineHeight: 9,
  },
  sub: {
    fontFamily: fontFamilies.regular,
    fontSize: 5,
    color: colors.muted,
    lineHeight: 8,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
