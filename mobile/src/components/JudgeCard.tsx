import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LoadingImage } from './LoadingImage';
import { useLocale } from '../i18n/LocaleContext';

import { font, space, colors, cardStyle } from '../theme';
import { resolveAssetUrl } from '../api/client';
import Svg, { Path } from 'react-native-svg';

export interface JudgeCardProps {
  judge: {
    name: string;
    title: string;
    experience: string;
    avatarUrl: string;
    introVideoUrl?: string | null;
  };
  onPlayIntro: () => void;
}

export function JudgeCard({ judge, onPlayIntro }: JudgeCardProps) {
  const { t } = useLocale();
  const avatar = resolveAssetUrl(judge.avatarUrl);
  return (
    // The whole card plays the intro video, not just the round button
    <TouchableOpacity
      style={styles.card}
      onPress={onPlayIntro}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${t.introVideo}: ${judge.name}, ${judge.title}`}
    >
      <LoadingImage uri={avatar} style={styles.avatar} accessibilityLabel={`Photo of ${judge.name}`} />
      <View style={styles.info}>
        <Text style={styles.judgeLabel}>{t.judge}</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.title}>{judge.title}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>
      <View style={styles.action}>
        <View style={styles.playBtn}>
          <Svg width={9} height={10} viewBox="0 0 9 10">
            <Path d="M1 0.8v8.4L8.2 5z" fill={colors.primary} />
          </Svg>
        </View>
        <Text style={styles.playText}>{t.introVideo}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    height: 58,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    paddingLeft: 17,
    position: 'relative',
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#EDEFF2',
  },
  info: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  judgeLabel: {
    ...font.label,
    color: colors.textFaint,
  },
  name: {
    ...font.name,
    color: colors.textPrimary,
  },
  title: {
    ...font.body,
    color: colors.textMuted,
  },
  experience: {
    ...font.body,
    color: colors.textMuted,
  },
  action: {
    position: 'absolute',
    right: 30,
    top: 9,
    alignItems: 'center',
    gap: 3,
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.playBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontFamily: font.body.fontFamily,
    fontSize: 6.5,
    lineHeight: 9,
    color: colors.textMuted,
  },
});
