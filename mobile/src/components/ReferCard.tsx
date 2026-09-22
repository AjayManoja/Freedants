import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, font, space, radius, useLayout } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';
import { fmt } from '../i18n/en';

export interface ReferCardProps {
  referralUrl: string | null;
  onCopyLink: () => void;
  onReferNow: () => void;
  copied: boolean;
  rewardPerSignup: number;
}

export function ReferCard({ referralUrl, onCopyLink, onReferNow, copied, rewardPerSignup }: ReferCardProps) {
  const { t } = useLocale();
  const { isWide } = useLayout();
  const disabled = !referralUrl;
  const caption = fmt(t.earnPerSignup, { amount: rewardPerSignup });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Svg width={40} height={32} viewBox="0 0 24 24" style={styles.icon}>
          <Path d="M3 7.2h4.5L17 2v16L7.5 12.8H3a1.4 1.4 0 0 1-1.4-1.4V8.6A1.4 1.4 0 0 1 3 7.2zM5.5 12.8l1.6 5.4h2.6L8.4 12.8M20 6.2l3.2-2.4M20.5 10h4M20 13.8l3.2 2.4" fill="none" stroke={colors.referIcon} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.title}>{t.referEarn}</Text>
      </View>

      <View style={styles.linkRow}>
        <TextInput style={styles.input} value={referralUrl ?? ''} editable={false} selectTextOnFocus numberOfLines={1} />
        <TouchableOpacity style={styles.copyBtn} onPress={onCopyLink} disabled={disabled}>
          <Text style={styles.copyText}>{copied ? t.copied : t.copyLink}</Text>
        </TouchableOpacity>
      </View>

      {/* Wide screens: button and caption side by side; regular: stacked (MOBILE_SIZING §4.10) */}
      <View style={isWide ? styles.actionsWide : undefined}>
        <TouchableOpacity style={[styles.referBtn, isWide && styles.referBtnWide, disabled && styles.disabled]} onPress={onReferNow} disabled={disabled}>
          <Text style={styles.referText}>{t.referNow}</Text>
        </TouchableOpacity>
        <Text style={[styles.caption, isWide && styles.captionWide]}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.mintBg, borderRadius: radius.md, padding: space.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: space.md },
  icon: { marginRight: space.sm },
  title: { ...font.section, color: colors.textPrimary, flex: 1 },
  linkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.sm, overflow: 'hidden', height: 44, marginBottom: space.md, borderWidth: 1, borderColor: colors.copyBorder },
  input: { flex: 1, height: 44, paddingHorizontal: space.sm, ...font.body, color: colors.textPrimary, paddingVertical: 0 },
  copyBtn: { width: 96, height: 44, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.copyBorder },
  copyText: { ...font.bodyStrong, color: colors.textPrimary },
  actionsWide: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  referBtn: { height: 44, backgroundColor: colors.primary, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center', marginBottom: space.sm },
  referBtnWide: { flex: 1, marginBottom: 0 },
  disabled: { backgroundColor: colors.disabled },
  referText: { ...font.button, fontSize: 15, color: colors.white },
  caption: { ...font.caption, color: colors.textMuted, textAlign: 'center' },
  captionWide: { flex: 1, textAlign: 'left', color: colors.earnText },
});
