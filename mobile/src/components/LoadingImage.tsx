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

  let source: any = { uri };
  if (uri?.includes('judge.jpg')) {
    source = require('../../assets/thumb/judge.jpg');
  } else if (uri?.includes('w1.jpg')) {
    source = require('../../assets/thumb/w1.jpg');
  } else if (uri?.includes('w2.jpg')) {
    source = require('../../assets/thumb/w2.jpg');
  } else if (uri?.includes('w3.jpg')) {
    source = require('../../assets/thumb/w3.jpg');
  } else if (uri?.includes('w4.jpg')) {
    source = require('../../assets/thumb/w4.jpg');
  } else if (uri?.includes('profile.jpg')) {
    source = require('../../assets/thumb/profile.jpg');
  }

  return (
    <View style={[styles.wrap, { width: flat.width, height: flat.height, borderRadius: flat.borderRadius }]}>
      {!!uri && (
        <Image
          source={source}
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
