import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { colors, font, space, radius } from '../../theme';
import Svg, { Path } from 'react-native-svg';
import { useLocale } from '../../i18n/LocaleContext';
import { fmt } from '../../i18n/en';

interface UploadSheetProps {
  visible: boolean;
  onClose: () => void;
  onPickFile: () => void;
  onSubmit: () => void;
  fileName: string | null;
  uploading: boolean;
  progress: number;
  submissionWindow: string;
  maxSizeMb: number;
  acceptedFormats: string[];
}

export function UploadSheet({ visible, onClose, onPickFile, onSubmit, fileName, uploading, progress, submissionWindow, maxSizeMb, acceptedFormats }: UploadSheetProps) {
  const { t } = useLocale();
  return (
    <BottomSheet visible={visible} onClose={onClose} dismissible={!uploading}>
      <Text style={styles.title}>{t.upload}</Text>
      <Text style={styles.subtitle}>{submissionWindow}</Text>

      <TouchableOpacity style={styles.picker} onPress={onPickFile} disabled={uploading}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.pickerLabel}>{fileName || t.tapToSelect}</Text>
        <Text style={styles.pickerHint}>{fmt(t.maxUpload, { size: maxSizeMb, formats: acceptedFormats.map((f) => f.toUpperCase()).join(', ') })}</Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}

      <TouchableOpacity 
        style={[styles.submitBtn, (!fileName || uploading) && styles.submitBtnDisabled]} 
        onPress={onSubmit} 
        disabled={!fileName || uploading}
      >
        <Text style={styles.submitBtnText}>{uploading ? t.uploading : t.submitEntry}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={uploading}>
        <Text style={styles.cancelBtnText}>{t.cancel}</Text>
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
  picker: {
    height: 140,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,0,0.05)', // or tintBg if it matches primary better
    marginBottom: space.xl,
  },
  pickerLabel: {
    ...font.bodyStrong,
    color: colors.primary,
    marginTop: space.sm,
    marginBottom: space.xs,
  },
  pickerHint: {
    ...font.caption,
    color: colors.textMuted,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: space.xl,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  submitBtnDisabled: {
    backgroundColor: colors.border,
  },
  submitBtnText: {
    ...font.button,
    color: colors.white,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  cancelBtnText: {
    ...font.button,
    color: colors.textMuted,
  },
});
