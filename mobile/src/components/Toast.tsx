import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius } from '../theme';

export interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;
  
  return (
    <View style={[styles.container, { bottom: 64 + 80 + 16 + insets.bottom }]}>
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: { backgroundColor: colors.toastBg, borderRadius: radius.lg, paddingVertical: 12, paddingHorizontal: 20 },
  text: { fontFamily: fontFamilies.medium, fontSize: 14, color: colors.white }
});
