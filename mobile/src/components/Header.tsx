import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, space, radius, icon, hitSlop, fontFamilies } from '../theme';
import Svg, { Path } from 'react-native-svg';

import { useLocale } from '../i18n/LocaleContext';

export function Header() {
  const { lang, t, setLang } = useLocale();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} hitSlop={hitSlop} accessibilityRole="button">
        <Svg width={14} height={12} viewBox="0 0 14 12">
          <Path d="M13 6H1.5M6 1L1 6l5 5" fill="none" stroke={colors.navy} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.backText}>{t.goBack}</Text>
      </TouchableOpacity>
      <View style={styles.pill}>
        <TouchableOpacity 
          style={[styles.engBtn, lang === 'en' && styles.activeBg]} 
          onPress={() => setLang('en')}
          accessibilityRole="button"
        >
          <Text style={[styles.engText, lang === 'en' && styles.activeText]}>ENG</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.hindiBtn, lang === 'hi' && styles.activeBg]} 
          onPress={() => setLang('hi')}
          accessibilityRole="button"
        >
          <Text style={[styles.hindiText, lang === 'hi' && styles.activeText]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 44,
  },
  backText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.navy,
  },
  pill: { 
    flexDirection: 'row', 
    backgroundColor: colors.langPillBg, 
    borderRadius: 12, 
    padding: 2, 
    height: 24, 
    alignItems: 'center',
  },
  engBtn: {
    width: 32,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  hindiBtn: {
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeBg: {
    backgroundColor: colors.primary,
  },
  engText: {
    fontFamily: fontFamilies.bold,
    fontSize: 7,
    fontWeight: '700',
    color: colors.navy,
  },
  hindiText: {
    fontFamily: fontFamilies.medium,
    fontSize: 8,
    fontWeight: '500',
    color: colors.navy,
  },
  activeText: {
    color: colors.white,
  },
});
