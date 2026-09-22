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
          <Svg width={16} height={16} viewBox="0 0 10 10">
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  info: {
    flex: 1,
    marginLeft: space.md,
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
    alignItems: 'center',
    marginLeft: space.md,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.playBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  playText: {
    ...font.caption,
    color: colors.textPrimary,
    marginTop: space.sm,
  },
});
