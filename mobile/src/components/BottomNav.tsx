import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, space, radius, icon, hitSlop, fontFamilies } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';

const FALLBACK_AVATAR = require('../../assets/profile.jpg');

export interface BottomNavProps {
  onNavPress?: (tab: string) => void;
  avatarUrl?: string;
}

export function BottomNav({ onNavPress, avatarUrl }: BottomNavProps = {}) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  
  return (
    <View style={[styles.container, { height: 30 + insets.bottom, paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        style={styles.item}
        hitSlop={hitSlop}
        accessibilityRole="button"
        onPress={() => onNavPress?.(t.home)}
      >
        <Svg width={12} height={12} viewBox="0 0 12 12">
          <Path d="M1 5.2L6 1l5 4.2V11H7.6V7.8H4.4V11H1z" fill={colors.navInactiveIcon} />
        </Svg>
        <Text style={styles.label} maxFontSizeMultiplier={1.3} numberOfLines={1}>{t.home}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.item}
        hitSlop={hitSlop}
        accessibilityRole="button"
        onPress={() => onNavPress?.(t.explore)}
      >
        <Svg width={13} height={13} viewBox="0 0 13 13">
          <Circle cx={5.5} cy={5.5} r={4.3} fill="none" stroke={colors.navInactiveIcon} strokeWidth={1.4} />
          <Path d="M8.7 8.7l3.4 3.4" stroke={colors.navInactiveIcon} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
        <Text style={styles.label} maxFontSizeMultiplier={1.3} numberOfLines={1}>{t.explore}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.createBtn}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={t.create}
        onPress={() => onNavPress?.(t.create)}
      >
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Circle cx={8} cy={8} r={7} fill="none" stroke={colors.white} strokeWidth={1.6} />
          <Path d="M8 4.4v7.2M4.4 8h7.2" stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.item}
        hitSlop={hitSlop}
        accessibilityRole="button"
        onPress={() => onNavPress?.(t.competitions)}
      >
        <Svg width={12} height={12} viewBox="0 0 12 12">
          <Path
            d="M3 0.6h6v3.2a3 3 0 0 1-6 0zM3 1.6H1v.8a2 2 0 0 0 2 2M9 1.6h2v.8a2 2 0 0 1-2 2M5.2 6.6h1.6v2H5.2zM3.4 8.6h5.2v2.8H3.4z"
            fill={colors.primary}
            stroke={colors.primary}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={[styles.label, styles.activeLabel]} maxFontSizeMultiplier={1.3} numberOfLines={1}>{t.competitions}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.item}
        hitSlop={hitSlop}
        accessibilityRole="button"
        onPress={() => onNavPress?.(t.profile)}
      >
        <Image
          source={avatarUrl ? { uri: avatarUrl } : FALLBACK_AVATAR}
          defaultSource={FALLBACK_AVATAR}
          style={styles.avatar}
          accessibilityLabel="Your profile photo"
        />
        <Text style={styles.label} maxFontSizeMultiplier={1.3} numberOfLines={1}>{t.profile}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: colors.white, 
    borderTopWidth: 1, 
    borderTopColor: colors.border, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: 5,
    color: colors.navInactiveLabel,
    marginTop: 2,
  },
  activeLabel: {
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    color: colors.primary,
  },
  createBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 5, 
    backgroundColor: colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  avatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
  },
});
