import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, font, space, radius, fontFamilies } from '../theme';
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
  const disabled = !referralUrl;
  const caption = fmt(t.earnPerSignup, { amount: rewardPerSignup });

  return (
    <View style={styles.card}>
      <Svg width={26} height={20} viewBox="0 0 26 20">
        <Path
          d="M3 7.2h4.5L17 2v16L7.5 12.8H3a1.4 1.4 0 0 1-1.4-1.4V8.6A1.4 1.4 0 0 1 3 7.2zM5.5 12.8l1.6 5.4h2.6L8.4 12.8M20 6.2l3.2-2.4M20.5 10h4M20 13.8l3.2 2.4"
          fill="none"
          stroke={colors.referIcon}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      <View style={styles.textCol}>
        <Text style={styles.title}>{t.referEarn}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={referralUrl ?? ''}
            editable={false}
            selectTextOnFocus
            numberOfLines={1}
            accessibilityLabel="Referral link"
          />
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={onCopyLink}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={copied ? t.copied : t.copyLink}
          >
            <Text style={styles.copyText}>{copied ? t.copied : t.copyLink}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.referBtn, disabled && styles.disabled]}
          onPress={onReferNow}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={t.referNow}
        >
          <Text style={styles.referText}>{t.referNow}</Text>
        </TouchableOpacity>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 39,
    borderRadius: 8,
    backgroundColor: colors.mintBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    position: 'relative',
  },
  textCol: {
    marginLeft: 11,
    marginTop: -1,
    flexDirection: 'column',
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 7,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 1,
  },
  input: {
    width: 131,
    height: 15,
    borderWidth: 1,
    borderColor: colors.copyBorder,
    borderRadius: 3,
    backgroundColor: colors.white,
    fontFamily: fontFamilies.regular,
    fontSize: 5,
    color: colors.textBody,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  copyBtn: {
    width: 39,
    height: 15,
    borderWidth: 1,
    borderColor: colors.copyBorder,
    borderRadius: 3,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  copyText: {
    fontFamily: fontFamilies.medium,
    fontSize: 5,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  rightSection: {
    position: 'absolute',
    left: 234,
    top: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  referBtn: {
    width: 88,
    height: 16,
    borderRadius: 3,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  referText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 6.5,
    fontWeight: '600',
    color: colors.white,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: colors.earnText,
    marginTop: 3,
  },
});
