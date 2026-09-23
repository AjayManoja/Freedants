import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, font, radius, space, hitSlop, MAX_CONTENT_WIDTH } from '../theme';
import { useLocale } from '../i18n/LocaleContext';

// Only import expo-av on native platforms
let Video: any = null;
let ResizeMode: any = null;
if (Platform.OS !== 'web') {
  const av = require('expo-av');
  Video = av.Video;
  ResizeMode = av.ResizeMode;
}

interface VideoModalProps {
  visible: boolean;
  title: string;
  url?: string | null;
  /** Extra request headers, e.g. auth for the user's own submission */
  headers?: Record<string, string>;
  onClose: () => void;
}

/** Web-only: renders a native HTML5 <video> with object-fit:contain */
function WebVideo({ url, onLoad, onError }: { url: string; onLoad: () => void; onError: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Attach event listeners after mount
    const el = ref.current;
    if (!el) return;
    const handleLoad = () => onLoad();
    const handleError = () => onError();
    el.addEventListener('loadeddata', handleLoad);
    el.addEventListener('error', handleError);
    return () => {
      el.removeEventListener('loadeddata', handleLoad);
      el.removeEventListener('error', handleError);
    };
  }, [url]);

  return React.createElement('video', {
    ref,
    src: url,
    controls: true,
    autoPlay: true,
    playsInline: true,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      borderRadius: radius.md,
      backgroundColor: 'transparent',
    },
  });
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

  const renderPlayer = () => {
    if (!url || failed || !visible) return null;

    if (Platform.OS === 'web') {
      return (
        <WebVideo
          url={url}
          onLoad={() => setLoading(false)}
          onError={() => { setFailed(true); setLoading(false); }}
        />
      );
    }

    // Native: use expo-av Video
    return (
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
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={[font.name, styles.title, { width: contentWidth }]} numberOfLines={2}>{title}</Text>
        <View style={[styles.player, { width: contentWidth }]}>
          {renderPlayer()}
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
