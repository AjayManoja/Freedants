import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { colors } from '../theme';

interface LoadingImageProps {
  uri?: string;
  style: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

/** Remote image that shows a spinner until it has loaded (or keeps it if the load fails). */
export function LoadingImage({ uri, style, accessibilityLabel }: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const flat = StyleSheet.flatten(style) || {};

  return (
    <View style={[styles.wrap, { width: flat.width, height: flat.height, borderRadius: flat.borderRadius }]}>
      {!!uri && (
        <Image
          source={{ uri }}
          style={[style, !loaded && styles.hidden]}
          onLoad={() => setLoaded(true)}
          accessibilityLabel={accessibilityLabel}
        />
      )}
      {!loaded && (
        <View style={styles.spinner}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.chipBg, overflow: 'hidden' },
  hidden: { opacity: 0 },
  spinner: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
