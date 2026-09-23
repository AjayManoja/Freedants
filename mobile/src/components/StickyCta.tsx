import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, radius, hitSlop, fontFamilies } from '../theme';

export interface StickyCtaProps {
  title: string;
  sub: string;
  disabled?: boolean;
  onPress: () => void;
  bgColor?: string;
}

export function StickyCta({ title, sub, disabled, onPress, bgColor }: StickyCtaProps) {
  return (
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: disabled ? colors.disabled : (bgColor || colors.primary) }]} 
      disabled={disabled}
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={`${title}. ${sub}`}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { 
    width: '100%', 
    height: 24, 
    borderRadius: 6, 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 11,
    color: colors.white,
  },
  sub: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    fontWeight: '400',
    lineHeight: 8,
    color: colors.white,
    opacity: 0.9,
  },
});
