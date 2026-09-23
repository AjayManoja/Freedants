import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors, space, radius } from '../theme';
import { useLocale } from '../i18n/LocaleContext';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** When false (e.g. while a payment or upload is running) the sheet can't be swiped or tapped away. */
  dismissible?: boolean;
}

// Drag further than this, or flick faster than this, to dismiss
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 1;

export function BottomSheet({ visible, onClose, children, dismissible = true }: BottomSheetProps) {
  const { t } = useLocale();
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(0);

  // Latest props for the gesture handlers, which are created once
  const latest = useRef({ dismissible, onClose, height });
  latest.current = { dismissible, onClose, height };

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      scrollY.current = 0;
    }
  }, [visible, translateY]);

  const springBack = () =>
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();

  const dismiss = () => {
    if (!latest.current.dismissible) return springBack();
    Animated.timing(translateY, { toValue: latest.current.height, duration: 200, useNativeDriver: true }).start(() =>
      latest.current.onClose()
    );
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Take over a downward drag only when the content is scrolled to the top,
        // so scrolling inside the sheet keeps working.
        onMoveShouldSetPanResponderCapture: (_, g) =>
          latest.current.dismissible && g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx) && scrollY.current <= 0,
        onPanResponderMove: (_, g) => translateY.setValue(Math.max(0, g.dy)),
        onPanResponderRelease: (_, g) => {
          if (g.dy > DISMISS_DISTANCE || g.vy > DISMISS_VELOCITY) dismiss();
          else springBack();
        },
        onPanResponderTerminate: springBack,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  };

  // Backdrop fades as the sheet is dragged down
  const backdropOpacity = translateY.interpolate({ inputRange: [0, height * 0.6], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => dismissible && onClose()}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]} />
        <Pressable style={styles.flex} onPress={() => dismissible && onClose()} accessibilityRole="button" accessibilityLabel={t.close} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            bounces={false}
            overScrollMode="never"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
  },
  // Taller than the visible handle so it's easy to grab
  handleArea: {
    alignItems: 'center',
    paddingTop: space.md,
    paddingBottom: space.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.sheetHandle,
  },
});
