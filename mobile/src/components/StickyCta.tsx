import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, radius } from '../theme';

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
    >
      <Text style={[font.button, styles.title]}>{title}</Text>
      <Text style={[font.caption, styles.sub]}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { 
    width: '100%', 
    height: 56, 
    borderRadius: radius.md, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { color: colors.white },
  sub: { color: colors.white, opacity: 0.9 }
});
