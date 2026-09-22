import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, font, space, radius } from '../../theme';
import Svg, { Path } from 'react-native-svg';
import { Submission } from '../../api/types';
import { useLocale } from '../../i18n/LocaleContext';
import { formatDateTime, formatFileSize, formatShortDate } from '../../utils/format';
import { fmt } from '../../i18n/en';

interface SubmissionSheetProps {
  visible: boolean;
  onClose: () => void;
  submission?: Submission;
  loading: boolean;
  resultAt: string;
  /** Plays the uploaded video */
  onPlay: () => void;
}

export function SubmissionSheet({ visible, onClose, submission, loading, resultAt, onPlay }: SubmissionSheetProps) {
  const { t } = useLocale();
  const details = submission
    ? [submission.fileSize ? formatFileSize(submission.fileSize) : null, fmt(t.uploadedOn, { date: formatDateTime(submission.submittedAt) })]
        .filter(Boolean)
        .join(' · ')
    : '';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>{t.yourSubmission}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: space.xl }} />
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={onPlay}
          disabled={!submission?.playbackPath}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={t.tapToPlay}
        >
          <View style={styles.iconCircle}>
            <Svg width={16} height={16} viewBox="0 0 9 9">
              <Path d="M1 0.8v8.4L8.2 5z" fill={colors.white} />
            </Svg>
          </View>
          <View style={styles.info}>
            <Text style={styles.fileName} numberOfLines={1}>{submission?.fileName || t.submitted}</Text>
            {!!details && <Text style={styles.meta}>{details}</Text>}
            <Text style={styles.status}>{t.submitted} · {t.resultDate} {formatShortDate(resultAt)}</Text>
            {!!submission?.playbackPath && <Text style={styles.playHint}>{t.tapToPlay}</Text>}
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
        <Text style={styles.doneBtnText}>{t.done}</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    ...font.title,
    color: colors.textDark,
    marginBottom: space.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.winnerCardBg,
    padding: space.lg,
    borderRadius: radius.md,
    marginBottom: space.xl,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.md,
  },
  info: {
    flex: 1,
  },
  fileName: {
    ...font.bodyStrong,
    color: colors.textDark,
    marginBottom: space.xs,
  },
  meta: {
    ...font.caption,
    color: colors.textMuted,
    marginBottom: space.xs,
  },
  playHint: {
    ...font.label,
    color: colors.primary,
    marginTop: space.xs,
  },
  status: {
    ...font.caption,
    color: colors.success,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    ...font.button,
    color: colors.white,
  },
});
