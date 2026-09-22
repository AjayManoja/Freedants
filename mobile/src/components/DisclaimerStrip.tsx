import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, space, radius } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';


export interface DisclaimerStripProps {
  text: string;
}

export function DisclaimerStrip({ text }: DisclaimerStripProps) {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Svg width={16} height={16} viewBox="0 0 9 9" style={styles.icon}>
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
  container: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.tintBg, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.md },
  icon: { marginRight: space.sm, marginTop: 2 },
  textContainer: { flex: 1 },
  prefix: { ...font.bodyStrong, color: colors.primary },
  text: { ...font.body, color: colors.textPrimary }
});

