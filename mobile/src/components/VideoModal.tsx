import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Svg, { Path } from 'react-native-svg';
import { colors, font, radius, space, hitSlop, MAX_CONTENT_WIDTH } from '../theme';
import { useLocale } from '../i18n/LocaleContext';

interface VideoModalProps {
  visible: boolean;
  title: string;
  url?: string | null;
  /** Extra request headers, e.g. auth for the user's own submission */
  headers?: Record<string, string>;
  onClose: () => void;
}

export function VideoModal({ visible, title, url, headers, onClose }: VideoModalProps) {
  const { t } = useLocale();
  const contentWidth = MAX_CONTENT_WIDTH;
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setFailed(false);
    }
  }, [visible, url]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={[font.name, styles.title, { width: contentWidth }]} numberOfLines={2}>{title}</Text>
        <View style={[styles.player, { width: contentWidth }]}>
          {!!url && !failed && visible && (
            <Video
              source={{ uri: url, headers }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls
              isLooping={false}
              onReadyForDisplay={() => setLoading(false)}
              onLoad={() => setLoading(false)}
              onError={() => { setFailed(true); setLoading(false); }}
            />
          )}
          {loading && !failed && !!url && (
            <View style={styles.overlay} pointerEvents="none">
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          )}
          {(!url || failed) && (
            <View style={styles.overlay}>
              <Text style={[font.body, styles.message]}>
                {failed ? t.videoUnavailable : t.videoComingSoon}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={hitSlop} accessibilityLabel={t.closeVideo}>
            <Svg width={16} height={16} viewBox="0 0 9 9">
              <Path d="M1 1l7 7M8 1L1 8" stroke={colors.white} strokeWidth={1.4} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.videoBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    marginBottom: space.md,
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.videoBg,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  message: {
    color: colors.disabled,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
