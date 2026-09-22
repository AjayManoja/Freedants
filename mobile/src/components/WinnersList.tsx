import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LoadingImage } from './LoadingImage';
import { useLocale } from '../i18n/LocaleContext';

import { font, space, radius, colors } from '../theme';
import { resolveAssetUrl } from '../api/client';
import Svg, { Path } from 'react-native-svg';

export interface PreviousWinner {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  role?: string;
  thumbUrl?: string;
  photoUrl?: string;
  videoUrl?: string | null;
}

export interface WinnersListProps {
  winners: PreviousWinner[];
  onPlayVideo: (name: string, position: string, videoUrl?: string | null) => void;
}

const TILE_WIDTH = 180;

export function WinnersList({ winners, onPlayVideo }: WinnersListProps) {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.previousWinners}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={winners}
        keyExtractor={(w, index) => w._id || w.id || `${w.name}-${index}`}
        snapToInterval={TILE_WIDTH + space.md}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const imgUrl = resolveAssetUrl(item.thumbUrl || item.photoUrl);
          const subtitle = item.position || item.role || '';
          return (
            // The whole tile plays the winner's video, not just the small badge
            <TouchableOpacity
              style={styles.tile}
              onPress={() => onPlayVideo(item.name, item.position, item.videoUrl)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Play video: ${item.name}, ${subtitle}`}
            >
              <View style={styles.photoWrap}>
                <LoadingImage uri={imgUrl} style={styles.photo} />
                <View style={styles.playBadge}>
                  <Svg width={10} height={10} viewBox="0 0 6 6">
                    <Path d="M1 0.5v5L5.5 3z" fill={colors.white} />
                  </Svg>
                </View>
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.role} numberOfLines={2}>{subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    ...font.section,
    color: colors.textPrimary,
    marginBottom: space.md,
  },
  listContent: {
    paddingRight: space.lg,
  },
  tile: {
    width: TILE_WIDTH,
    backgroundColor: colors.winnerCardBg,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.sm,
    marginRight: space.md,
  },
  photoWrap: {
    width: 72,
    height: 72,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  playBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  info: {
    flex: 1,
    marginLeft: space.sm,
  },
  name: {
    ...font.caption,
    fontFamily: 'Poppins_500Medium',
    color: colors.textPrimary,
  },
  role: {
    ...font.caption,
    color: colors.winnerRole,
    marginTop: 2,
  }
});
