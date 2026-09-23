import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, space, radius, fontFamilies } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';

export interface DisclaimerStripProps {
  text: string;
}

export function DisclaimerStrip({ text }: DisclaimerStripProps) {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Svg width={9} height={9} viewBox="0 0 9 9">
        <Circle cx={4.5} cy={4.5} r={3.9} fill="none" stroke={colors.primary} strokeWidth={0.9} />
        <Path d="M4.5 4v2.3" stroke={colors.primary} strokeWidth={0.9} strokeLinecap="round" />
        <Circle cx={4.5} cy={2.7} r={0.5} fill={colors.primary} />
      </Svg>
      <Text style={styles.textContainer}>
        <Text style={styles.prefix}>{t.disclaimer} </Text>
        <Text style={styles.text}>{text}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.tintBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
    gap: 7,
  },
  textContainer: {
    flex: 1,
  },
  prefix: {
    fontFamily: fontFamilies.bold,
    fontSize: 6,
    fontWeight: '700',
    color: colors.primary,
  },
  text: {
    fontFamily: fontFamilies.regular,
    fontSize: 6,
    color: colors.textPrimary,
  },
});
