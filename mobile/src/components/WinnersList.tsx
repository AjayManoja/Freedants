import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LoadingImage } from './LoadingImage';
import { useLocale } from '../i18n/LocaleContext';

import { font, space, radius, colors, cardStyle, fontFamilies } from '../theme';
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

const TILE_WIDTH = 85;
const GAP = 8;

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
        snapToInterval={TILE_WIDTH + GAP}
        decelerationRate="fast"
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const imgUrl = resolveAssetUrl(item.thumbUrl || item.photoUrl);
          const subtitle = item.position || item.role || '';
          const photoWidth = index === 0 ? 42 : 40;
          const infoMarginLeft = index === 0 ? 6 : 7;

          return (
            // The whole tile plays the winner's video, not just the small badge
            <TouchableOpacity
              style={styles.tile}
              onPress={() => onPlayVideo(item.name, item.position, item.videoUrl)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Play video: ${item.name}, ${subtitle}`}
            >
              <View style={[styles.photoWrap, { width: photoWidth }]}>
                <LoadingImage uri={imgUrl} style={[styles.photo, { width: photoWidth }]} />
                <View style={styles.playBadge}>
                  <Svg width={5} height={6} viewBox="0 0 5 6">
                    <Path d="M0.5 0.4v5.2L4.7 3z" fill={colors.white} />
                  </Svg>
                </View>
              </View>
              <View style={[styles.info, { marginLeft: infoMarginLeft }]}>
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
  container: {
    ...cardStyle,
    height: 69,
    marginTop: 5,
    padding: 0,
    paddingTop: 5,
    paddingLeft: 8,
    paddingRight: 0,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 7.5,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 12,
  },
  list: {
    marginTop: 3,
  },
  listContent: {
    gap: GAP,
    paddingRight: 8,
  },
  tile: {
    width: TILE_WIDTH,
    height: 42,
    backgroundColor: colors.winnerCardBg,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoWrap: {
    height: 42,
    position: 'relative',
  },
  photo: {
    height: 42,
    borderRadius: 5,
  },
  playBadge: {
    position: 'absolute',
    right: 3,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamilies.medium,
    fontSize: 5.5,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 9,
  },
  role: {
    fontFamily: fontFamilies.regular,
    fontSize: 5.5,
    color: colors.winnerRole,
    lineHeight: 9,
  },
});
