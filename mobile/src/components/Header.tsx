import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, space, radius, icon, hitSlop, fontFamilies } from '../theme';
import Svg, { Path } from 'react-native-svg';

import { useLocale } from '../i18n/LocaleContext';

export function Header() {
  const { lang, t, setLang } = useLocale();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} hitSlop={hitSlop}>
        <Svg width={icon.md} height={icon.md} viewBox="0 0 15 15">
          <Path d="M13 6H1.5M6 1L1 6l5 5" fill="none" stroke={colors.navy} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={[font.button, styles.backText]}>{t.goBack}</Text>
      </TouchableOpacity>
      <View style={styles.pill}>
        <TouchableOpacity 
          style={[styles.engBtn, lang === 'en' && styles.activeBg]} 
          onPress={() => setLang('en')}
        >
          <Text style={[styles.engText, lang === 'en' && styles.activeText]}>ENG</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.hindiBtn, lang === 'hi' && styles.activeBg]} 
          onPress={() => setLang('hi')}
        >
          <Text style={[styles.hindiText, lang === 'hi' && styles.activeText]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  backText: { color: colors.navy, marginLeft: space.sm },
  pill: { 
    flexDirection: 'row', 
    backgroundColor: colors.langPillBg, 
    borderRadius: radius.md, 
    padding: 2, 
    height: 36, 
    width: 88,
    alignItems: 'center',
    justifyContent: 'center'
  },
  engBtn: { width: 42, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  hindiBtn: { width: 42, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  activeBg: { backgroundColor: colors.primary },
  engText: { fontFamily: fontFamilies.bold, fontSize: 12, color: colors.navy },
  hindiText: { fontFamily: fontFamilies.medium, fontSize: 13, color: colors.navy },
  activeText: { color: colors.white }
});
