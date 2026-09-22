import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTestimonials } from '../../api/hooks';
import { useLocale } from '../../i18n/LocaleContext';
import { fmt } from '../../i18n/en';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, font, space, radius } from '../../theme';

interface ReviewsSheetProps {
  visible: boolean;
  onClose: () => void;
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export function ReviewsSheet({ visible, onClose }: ReviewsSheetProps) {
  const { t, lang } = useLocale();
  const { data, isLoading, isError, refetch } = useTestimonials(visible, lang);
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>{t.hearFromUsers}</Text>
      <Text style={styles.subtitle}>{t.hearFromUsersSub}</Text>

      {isLoading && (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {isError && (
        <View style={styles.state}>
          <Text style={styles.review}>{t.reviewsError}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>{t.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      )}
      {data && data.length === 0 && (
        <View style={styles.state}>
          <Text style={styles.review}>{t.noReviews}</Text>
        </View>
      )}
      {data?.map((r) => (
        <View key={r._id} style={styles.card}>
          <View style={styles.reviewHead}>
            <View style={styles.initials}>
              <Text style={styles.initialsText}>{initials(r.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{r.name}</Text>
              {!!r.meta && <Text style={styles.meta}>{r.meta}</Text>}
            </View>
            <Text style={styles.stars} accessibilityLabel={fmt(t.ratingOutOf5, { n: r.rating })}>
              {'★'.repeat(r.rating)}{'☆'.repeat(Math.max(0, 5 - r.rating))}
            </Text>
          </View>
          <Text style={styles.review}>{r.text}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>{t.done}</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    ...font.title,
    color: colors.textDark,
    marginBottom: space.xs,
  },
  subtitle: {
    ...font.caption,
    color: colors.textMuted,
    marginBottom: space.xl,
  },
  card: {
    padding: space.lg,
    backgroundColor: colors.winnerCardBg,
    borderRadius: radius.md,
    marginBottom: space.md,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  initials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.badgeBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.md,
  },
  initialsText: {
    ...font.bodyStrong,
    color: colors.primary,
  },
  name: {
    ...font.bodyStrong,
    color: colors.textDark,
  },
  meta: {
    ...font.caption,
    color: colors.textMuted,
  },
  stars: {
    fontSize: 14,
    color: colors.gold,
    letterSpacing: 1,
  },
  review: {
    ...font.body,
    color: colors.textMuted,
  },
  state: {
    alignItems: 'center',
    paddingVertical: space.xl,
    gap: space.md,
  },
  retryBtn: {
    minHeight: 44,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  retryText: {
    ...font.bodyStrong,
    color: colors.white,
  },
  closeBtn: {
    marginTop: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  closeBtnText: {
    ...font.button,
    color: colors.textMuted,
  },
});
