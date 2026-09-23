import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';

// Components
import { Header } from '../components/Header';
import { CompetitionCard } from '../components/CompetitionCard';
import { JudgeCard } from '../components/JudgeCard';
import { CountdownStrip } from '../components/CountdownStrip';
import { DatesGrid } from '../components/DatesGrid';
import { WinnersList } from '../components/WinnersList';
import { InfoTabs } from '../components/InfoTabs';
import { RewardsList } from '../components/RewardsList';
import { DisclaimerStrip } from '../components/DisclaimerStrip';
import { PrizeTrustCard } from '../components/PrizeTrustCard';
import { ReferCard } from '../components/ReferCard';
import { HearFromUsers } from '../components/HearFromUsers';
import { AdSlot } from '../components/AdSlot';
import { StickyCta } from '../components/StickyCta';
import { BottomNav } from '../components/BottomNav';
import { Toast } from '../components/Toast';

// Sheets
import { PaymentSheet, PayMethod } from './sheets/PaymentSheet';
import { UploadSheet } from './sheets/UploadSheet';
import { SubmissionSheet } from './sheets/SubmissionSheet';
import { ReviewsSheet } from './sheets/ReviewsSheet';
import { VideoModal } from '../components/VideoModal';

// Hooks & Theme
import { useCompetition, useRegister, useConfirmPayment, useSubmitEntry, useSubmission } from '../api/hooks';
import { useLocale } from '../i18n/LocaleContext';
import { fmt, TranslationKeys } from '../i18n/en';
import { getServerTimeOffset, resolveAssetUrl, authedMediaSource } from '../api/client';
import { colors, font, space, radius, GUTTER, MAX_CONTENT_WIDTH } from '../theme';
import { formatDateTime, formatMoney } from '../utils/format';

const DEFAULT_SUBMISSION_RULES = { maxSizeMb: 50, acceptedFormats: ['mp4', 'mov'] };

// Upload endpoint error codes → translation keys
const UPLOAD_ERRORS: Record<string, keyof TranslationKeys> = {
  FILE_TOO_LARGE: 'errTooLarge',
  LIMIT_FILE_SIZE: 'errTooLarge',
  UNSUPPORTED_FORMAT: 'errFormat',
  OUTSIDE_SUBMISSION_WINDOW: 'errWindow',
  ALREADY_SUBMITTED: 'errAlreadySubmitted',
  NOT_REGISTERED: 'errNotRegistered',
};

export interface CompetitionDetailScreenProps {
  slug: string;
}

export function CompetitionDetailScreen({ slug }: CompetitionDetailScreenProps) {
  const { t, lang } = useLocale();
  // Content (about, rules, judge…) is fetched in the selected language
  const { data, isLoading, isError, refetch } = useCompetition(slug, lang);
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const [activeSheet, setActiveSheet] = useState<null | 'pay' | 'upload' | 'view' | 'reviews' | 'video'>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoHeaders, setVideoHeaders] = useState<Record<string, string> | undefined>(undefined);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const registerMutation = useRegister();
  const confirmMutation = useConfirmPayment();
  const submitMutation = useSubmitEntry();
  const submissionQuery = useSubmission(
    data?.competition._id ?? '',
    activeSheet === 'view' && data?.me.registrationStatus === 'submitted'
  );

  // Toast auto-dismiss
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t.loadFailed}</Text>
        <Text style={styles.errorHint}>{t.checkConnection}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>{t.retry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { competition: comp, me, spotsLeft, serverTime } = data;
  const status = me.registrationStatus;

  // ── CTA Logic (HANDOFF §3) ──────────────────────────
  let ctaTitle = t.register;
  const feeText = formatMoney(comp.entryFee, comp.currency);
  const submissionRules = comp.submissionRules ?? DEFAULT_SUBMISSION_RULES;
  let ctaSub = `${t.entryFee} ${feeText} · ${spotsLeft} ${t.spotsLeft}`;
  let ctaDisabled = false;
  let ctaBg = colors.primary;

  if (status === 'submitted') {
    ctaTitle = t.view;
    ctaSub = t.submitted;
  } else if (status === 'registered') {
    ctaTitle = t.upload;
    ctaSub = t.registered;
  } else if (status === 'pending') {
    ctaTitle = t.completePayment;
    ctaSub = `${t.entryFee} ${feeText} · ${t.spotReserved}`;
  } else if (status === 'closed') {
    ctaTitle = t.closed;
    ctaSub = t.closedHint;
    ctaDisabled = true;
    ctaBg = colors.disabled;
  } else if (status === 'full' || (status === 'open' && spotsLeft === 0)) {
    ctaTitle = t.full;
    ctaSub = t.fullHint;
    ctaDisabled = true;
    ctaBg = colors.disabled;
  }

  const handleCtaPress = () => {
    if (status === 'submitted') setActiveSheet('view');
    else if (status === 'registered') setActiveSheet('upload');
    else if (status === 'pending' || (status === 'open' && spotsLeft > 0)) setActiveSheet('pay');
  };

  // ── Payment Flow ─────────────────────────────────────
  const handlePay = async (_method: PayMethod, shouldSucceed: boolean): Promise<string> => {
    let registrationId = me.registrationId;
    if (status !== 'pending' || !registrationId) {
      const reg = await registerMutation.mutateAsync(comp._id);
      registrationId = reg._id;
    }

    await new Promise((r) => setTimeout(r, 1800));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const paymentId = 'pay_' + Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    if (!shouldSucceed) {
      await confirmMutation.mutateAsync({ registrationId, success: false });
      throw { error: 'PAYMENT_DECLINED' };
    }
    await confirmMutation.mutateAsync({ registrationId, success: true, paymentId });
    return paymentId;
  };

  const handlePaymentDone = () => {
    setActiveSheet(null);
    showToast(t.paymentSuccessToast);
    refetch();
  };

  // ── File Picker ──────────────────────────────────────
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/mp4', 'video/quicktime'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const file = result.assets[0];

      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!submissionRules.acceptedFormats.includes(ext)) {
        showToast(t.errFormat);
        return;
      }
      if (file.size && file.size > submissionRules.maxSizeMb * 1024 * 1024) {
        showToast(fmt(t.videoMaxSize, { size: submissionRules.maxSizeMb }));
        return;
      }
      setFileName(file.name);
      setFileUri(file.uri);
      setFileMime(file.mimeType);
    } catch {
      showToast(t.pickerFailed);
    }
  };

  // ── Upload/Submit Flow ───────────────────────────────
  const handleSubmit = async () => {
    if (!fileUri || !fileName || uploading) return;
    setUploading(true);
    setUploadProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p = Math.min(90, p + 6);
      setUploadProgress(p);
    }, 150);

    try {
      await submitMutation.mutateAsync({ competitionId: comp._id, fileUri, fileName, mimeType: fileMime });
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setActiveSheet(null);
        setUploading(false);
        setUploadProgress(0);
        showToast(t.uploadSuccess);
        refetch();
      }, 300);
    } catch (e: any) {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(0);
      const key = UPLOAD_ERRORS[e?.error];
      showToast(key ? t[key] : t.uploadFailed);
    }
  };

  // ── Copy & Share ─────────────────────────────────────
  const referralUrl = me.referralUrl;

  const handleCopyLink = async () => {
    if (!referralUrl) return;
    await Clipboard.setStringAsync(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferNow = async () => {
    if (!referralUrl) return;
    await Clipboard.setStringAsync(referralUrl);
    showToast(`${t.referralCopied} ${fmt(t.earnPerSignup, { amount: comp.referral.rewardPerSignup })}`);
  };

  // ── Open Video ───────────────────────────────────────
  const openVideo = (title: string, url?: string | null) => {
    setVideoTitle(title);
    setVideoUrl(resolveAssetUrl(url) || null);
    setVideoHeaders(undefined);
    setActiveSheet('video');
  };

  const playSubmission = () => {
    const sub = submissionQuery.data;
    if (!sub?.playbackPath) return;
    const source = authedMediaSource(sub.playbackPath);
    setVideoTitle(sub.fileName || t.yourSubmission);
    setVideoUrl(source.uri);
    setVideoHeaders(source.headers);
    setActiveSheet('video');
  };

  // ── Countdown helper ─────────────────────────────────
  const serverTimeOffset = getServerTimeOffset();

  const submissionWindow = `${formatDateTime(comp.dates.submissionStartsAt)} – ${formatDateTime(comp.dates.submissionEndsAt)}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrap}>
        <Header />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={pullRefreshing}
            onRefresh={() => { setPullRefreshing(true); refetch().finally(() => setPullRefreshing(false)); }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <CompetitionCard
          title={comp.title}
          tags={comp.tags}
          perks={comp.perks}
          prizePool={comp.prizePool}
          entryFee={comp.entryFee}
          capacity={comp.capacity}
          bookedCount={comp.bookedCount}
          currency={comp.currency}
          status={status}
        />

        <JudgeCard
          judge={comp.judge}
          onPlayIntro={() => openVideo(`${t.introVideo} · ${comp.judge.name}`, comp.judge.introVideoUrl)}
        />

        <CountdownStrip
          targetDate={comp.dates.registrationClosesAt}
          serverTimeOffset={serverTimeOffset}
          onExpire={() => refetch()}
        />

        <DatesGrid dates={comp.dates} />

        <WinnersList
          winners={comp.previousWinners}
          onPlayVideo={(name, position, url) => openVideo(`${name} · ${position}`, url)}
        />

        <InfoTabs
          about={comp.about}
          judgingParameters={comp.judgingParameters}
          rules={comp.rules}
        />

        <RewardsList rewards={comp.rewards} currency={comp.currency} />

        <DisclaimerStrip text={comp.disclaimer} />

        <PrizeTrustCard
          onPlayVideo={() => openVideo(t.howReceivePrize, comp.prizeInfoVideoUrl)}
        />

        <ReferCard
          referralUrl={referralUrl}
          onCopyLink={handleCopyLink}
          onReferNow={handleReferNow}
          copied={copied}
          rewardPerSignup={comp.referral.rewardPerSignup}
        />

        <HearFromUsers onPress={() => setActiveSheet('reviews')} />

        <AdSlot />
      </ScrollView>

      <View style={styles.ctaWrap}>
        <View style={styles.column}>
          <StickyCta
            title={ctaTitle}
            sub={ctaSub}
            disabled={ctaDisabled}
            onPress={handleCtaPress}
            bgColor={ctaBg}
          />
        </View>
      </View>

      <BottomNav
        avatarUrl={resolveAssetUrl(me.avatarUrl)}
        onNavPress={(tab) => showToast(fmt(t.notOnThisScreen, { tab }))}
      />

      {/* ── Sheets & Modals ── */}
      <PaymentSheet
        visible={activeSheet === 'pay'}
        onClose={() => { setActiveSheet(null); refetch(); }}
        competition={comp}
        spotsLeft={spotsLeft}
        payerName={me.name}
        onPay={handlePay}
        onDone={handlePaymentDone}
      />

      <UploadSheet
        visible={activeSheet === 'upload'}
        onClose={() => setActiveSheet(null)}
        onPickFile={handlePickFile}
        onSubmit={handleSubmit}
        fileName={fileName}
        uploading={uploading}
        progress={uploadProgress}
        submissionWindow={submissionWindow}
        maxSizeMb={submissionRules.maxSizeMb}
        acceptedFormats={submissionRules.acceptedFormats}
      />

      <SubmissionSheet
        visible={activeSheet === 'view'}
        onClose={() => setActiveSheet(null)}
        submission={submissionQuery.data}
        loading={submissionQuery.isLoading}
        resultAt={comp.dates.resultAt}
        onPlay={playSubmission}
      />

      <ReviewsSheet
        visible={activeSheet === 'reviews'}
        onClose={() => setActiveSheet(null)}
      />

      <VideoModal
        visible={activeSheet === 'video'}
        title={videoTitle}
        url={videoUrl}
        headers={videoHeaders}
        onClose={() => setActiveSheet(null)}
      />

      <Toast message={toastMessage || ''} visible={toastVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
  },
  column: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  headerWrap: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH + 2 * GUTTER,
    alignSelf: 'center',
    paddingHorizontal: GUTTER,
    paddingVertical: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH + 2 * GUTTER,
    alignSelf: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: 0,
    paddingBottom: space.md,
    gap: 0,
  },
  ctaWrap: {
    backgroundColor: colors.white,
    paddingHorizontal: GUTTER,
    paddingVertical: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorText: {
    ...font.bodyStrong,
    color: colors.textPrimary,
    marginBottom: space.xs,
  },
  errorHint: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginHorizontal: space.xl,
    marginBottom: space.lg,
  },
  retryBtn: {
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  retryBtnText: {
    ...font.button,
    color: colors.white,
  },
});
