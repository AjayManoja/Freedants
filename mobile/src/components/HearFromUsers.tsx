import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, space, radius, icon } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';


export interface HearFromUsersProps {
  onPress: () => void;
}

export function HearFromUsers({ onPress }: HearFromUsersProps) {
  const { t } = useLocale();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.icon}>
        <Path d="M2 0.8h7A1.3 1.3 0 0 1 10.3 2.1v5A1.3 1.3 0 0 1 9 8.4H4.3L1.8 10.3V8.4A1.3 1.3 0 0 1 .7 7.1v-5A1.3 1.3 0 0 1 2 .8z" fill="none" stroke={colors.navy} strokeWidth={1} strokeLinejoin="round" />
        <Circle cx={3.6} cy={4.6} r={0.6} fill={colors.navy} />
        <Circle cx={5.5} cy={4.6} r={0.6} fill={colors.navy} />
        <Circle cx={7.4} cy={4.6} r={0.6} fill={colors.navy} />
      </Svg>
      <View style={styles.textWrap}>
        <Text style={[font.section, styles.title]}>{t.hearFromUsers}</Text>
        <Text style={[font.caption, styles.sub]}>{t.hearFromUsersSub}</Text>
      </View>
      <Svg width={icon.sm} height={icon.sm} viewBox="0 0 6 10">
        <Path d="M1 1l3 3-3 3" fill="none" stroke={colors.navy} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  icon: { marginRight: space.md },
  textWrap: { flex: 1 },
  title: { color: colors.navy },
  sub: { color: colors.muted }
});
