import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, space, radius, icon, fontFamilies } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';

export function AdSlot() {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Svg width={10} height={9} viewBox="0 0 10 9">
        <Path
          d="M1.3 3h1.8l4.2-2.2v7.4L3.1 6H1.3A.6.6 0 0 1 .7 5.4V3.6A.6.6 0 0 1 1.3 3zM2.4 6l.7 2.2"
          fill="none"
          stroke={colors.adText}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.text}>{t.adHere}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 22,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.dashedBorder,
    borderStyle: 'dashed',
    borderRadius: 6,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontFamily: fontFamilies.medium,
    fontSize: 6,
    fontWeight: '500',
    color: colors.adText,
  },
});
