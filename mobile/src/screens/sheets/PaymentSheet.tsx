import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { BottomSheet } from '../../components/BottomSheet';
import { RazorpayLogo } from '../../components/RazorpayLogo';
import { colors, font, space, radius, hitSlop } from '../../theme';
import { Competition } from '../../api/types';
import { formatMoney, formatDateTime } from '../../utils/format';
import { useLocale } from '../../i18n/LocaleContext';
import { fmt } from '../../i18n/en';

export type PayMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentResult {
  paymentId: string;
  method: PayMethod;
  paidAt: Date;
}

interface PaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  competition: Competition;
  spotsLeft: number;
  /** Pre-fills the name on card */
  payerName?: string | null;
  /** Runs the payment. Resolves with the payment id, or throws an error with `error`/`message`. */
  onPay: (method: PayMethod, shouldSucceed: boolean) => Promise<string>;
  /** Called when the user dismisses the success screen. */
  onDone: () => void;
}

type Step = 'summary' | 'method' | 'processing' | 'success' | 'failed';

const BANKS = ['HDFC', 'SBI', 'ICICI', 'Axis'];
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay'];

// Test mode (development builds only), following Razorpay's test conventions:
// these inputs simulate a declined payment, and the form is pre-filled with test values.
const TEST_MODE = __DEV__;
const FAIL_UPI = 'failure@razorpay';
const FAIL_CARD = '4000000000000002';
const TEST_VALUES = { upi: 'success@razorpay', card: '4111 1111 1111 1111', expiry: '12/30', cvv: '123' };

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function expiryValid(v: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export function PaymentSheet({ visible, onClose, competition, spotsLeft, payerName, onPay, onDone }: PaymentSheetProps) {
  const { t } = useLocale();
  const METHODS: { key: PayMethod; label: string; sub: string }[] = [
    { key: 'upi', label: 'UPI', sub: t.payUpiSub },
    { key: 'card', label: t.payCard, sub: t.payCardSub },
    { key: 'netbanking', label: t.payNetbanking, sub: t.payNetbankingSub },
    { key: 'wallet', label: t.payWallet, sub: t.payWalletSub },
  ];
  const [step, setStep] = useState<Step>('summary');
  const [method, setMethod] = useState<PayMethod>('upi');
  const [upiId, setUpiId] = useState(TEST_MODE ? TEST_VALUES.upi : '');
  const [cardNumber, setCardNumber] = useState(TEST_MODE ? TEST_VALUES.card : '');
  const [expiry, setExpiry] = useState(TEST_MODE ? TEST_VALUES.expiry : '');
  const [cvv, setCvv] = useState(TEST_MODE ? TEST_VALUES.cvv : '');
  const [cardName, setCardName] = useState(payerName ?? '');
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [failReason, setFailReason] = useState('');

  useEffect(() => {
    if (visible) {
      if (payerName && !cardName) setCardName(payerName);
      setStep('summary');
      setResult(null);
      setFailReason('');
    }
  }, [visible]);

  const fee = competition.entryFee;
  const feeText = formatMoney(fee, competition.currency);
  const busy = step === 'processing';

  const upiValid = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim());
  const cardDigits = cardNumber.replace(/\D/g, '');
  const cardValid = cardDigits.length === 16 && expiryValid(expiry) && /^\d{3}$/.test(cvv) && cardName.trim().length > 1;
  const methodValid = method === 'upi' ? upiValid : method === 'card' ? cardValid : true;

  const pay = async () => {
    if (!methodValid || busy) return;
    const shouldSucceed = !TEST_MODE || !(
      (method === 'upi' && upiId.trim().toLowerCase() === FAIL_UPI) ||
      (method === 'card' && cardDigits === FAIL_CARD)
    );
    setStep('processing');
    try {
      const paymentId = await onPay(method, shouldSucceed);
      setResult({ paymentId, method, paidAt: new Date() });
      setStep('success');
    } catch (e: any) {
      if (__DEV__) console.warn('Payment failed', e);
      const code = e?.error;
      setFailReason(
        code === 'FULL' ? t.payErrFull
        : code === 'CLOSED' ? t.payErrClosed
        : code === 'PAYMENT_DECLINED' ? t.payErrDeclined
        : t.payErrNetwork
      );
      setStep('failed');
    }
  };

  const methodLabel = (m: PayMethod) =>
    m === 'upi' ? `UPI · ${upiId.trim()}`
    : m === 'card' ? fmt(t.cardEnding, { last4: cardDigits.slice(-4) })
    : m === 'netbanking' ? `${t.payNetbanking} · ${bank}`
    : `${t.payWallet} · ${wallet}`;

  return (
    <BottomSheet visible={visible} onClose={onClose} dismissible={!busy}>
      {step === 'summary' && (
        <>
          <Text style={styles.title}>{t.confirmRegistration}</Text>
          <Text style={styles.subtitle}>{competition.title}</Text>

          <View style={styles.box}>
            <Row label={t.entryFee} value={feeText} />
            <Row label={t.spotsLeftLabel} value={String(spotsLeft)} />
            <View style={styles.divider} />
            <Row label={t.totalPayable} value={feeText} strong />
          </View>

          <SecuredBy label={t.securedBy} />

          <PrimaryButton label={fmt(t.proceedToPay, { amount: feeText })} onPress={() => setStep('method')} />
          <SecondaryButton label={t.cancel} onPress={onClose} />
        </>
      )}

      {step === 'method' && (
        <>
          <View style={styles.checkoutHead}>
            <TouchableOpacity onPress={() => setStep('summary')} hitSlop={hitSlop} style={styles.backBtn} accessibilityLabel={t.back}>
              <Svg width={20} height={20} viewBox="0 0 15 15">
                <Path d="M13 7.5H2M6.5 3l-4.5 4.5L6.5 12" fill="none" stroke={colors.textPrimary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.merchant}>Feedants</Text>
              <Text style={styles.merchantSub}>{competition.title}</Text>
            </View>
            <Text style={styles.headAmount}>{feeText}</Text>
          </View>

          <Text style={styles.sectionLabel}>{t.paymentMethod}</Text>
          {METHODS.map((m) => {
            const active = method === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.methodRow, active && styles.methodRowActive]}
                onPress={() => setMethod(m.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <MethodIcon method={m.key} />
                <View style={{ flex: 1, marginLeft: space.md }}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodSub}>{m.sub}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.form}>
            {method === 'upi' && (
              <>
                <Field label={t.upiId} value={upiId} onChangeText={setUpiId} placeholder="name@bank" autoCapitalize="none" keyboardType="email-address" error={upiId.length > 0 && !upiValid ? t.upiInvalid : undefined} />
                {TEST_MODE && <Text style={styles.hint}>Test mode: use {FAIL_UPI} to simulate a failed payment.</Text>}
              </>
            )}
            {method === 'card' && (
              <>
                <Field label={t.cardNumber} value={cardNumber} onChangeText={(v) => setCardNumber(formatCard(v))} keyboardType="number-pad" placeholder="1234 5678 9012 3456" />
                <View style={styles.fieldRow}>
                  <View style={{ flex: 1 }}>
                    <Field label={t.expiry} value={expiry} onChangeText={(v) => setExpiry(formatExpiry(v))} keyboardType="number-pad" placeholder="MM/YY" error={expiry.length === 5 && !expiryValid(expiry) ? t.cardExpired : undefined} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label={t.cvv} value={cvv} onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 3))} keyboardType="number-pad" placeholder="123" secureTextEntry />
                  </View>
                </View>
                <Field label={t.nameOnCard} value={cardName} onChangeText={setCardName} placeholder="Full name" autoCapitalize="words" />
                {TEST_MODE && <Text style={styles.hint}>Test mode: card 4000 0000 0000 0002 is declined.</Text>}
              </>
            )}
            {method === 'netbanking' && (
              <ChipGroup options={BANKS} value={bank} onChange={setBank} />
            )}
            {method === 'wallet' && (
              <ChipGroup options={WALLETS} value={wallet} onChange={setWallet} />
            )}
          </View>

          <PrimaryButton label={fmt(t.payAmount, { amount: feeText })} onPress={pay} disabled={!methodValid} />
          <SecuredBy label={t.securedBy} />
        </>
      )}

      {step === 'processing' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.title, styles.centerText, { marginTop: space.lg }]}>{t.processing}</Text>
          <Text style={[styles.subtitle, styles.centerText]}>{t.dontClose}</Text>
          <SecuredBy label={t.securedBy} />
        </View>
      )}

      {step === 'success' && result && (
        <View>
          <View style={styles.center}>
            <View style={[styles.statusCircle, { backgroundColor: colors.badgeBg }]}>
              <Svg width={36} height={36} viewBox="0 0 24 24">
                <Path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={colors.primary} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={[styles.title, styles.centerText]}>{t.paymentSuccessful}</Text>
            <Text style={[styles.subtitle, styles.centerText]}>{fmt(t.registeredFor, { title: competition.title })}</Text>
          </View>
          <View style={styles.box}>
            <Row label={t.amountPaid} value={feeText} strong />
            <Row label={t.paidVia} value={methodLabel(result.method)} />
            <Row label={t.paymentId} value={result.paymentId} />
            <Row label={t.date} value={formatDateTime(result.paidAt)} />
          </View>
          <PrimaryButton label={t.done} onPress={onDone} />
        </View>
      )}

      {step === 'failed' && (
        <View>
          <View style={styles.center}>
            <View style={[styles.statusCircle, { backgroundColor: colors.dangerBg }]}>
              <Svg width={32} height={32} viewBox="0 0 24 24">
                <Path d="M7 7l10 10M17 7L7 17" fill="none" stroke="#D64545" strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.title, styles.centerText]}>{t.paymentFailed}</Text>
            <Text style={[styles.subtitle, styles.centerText]}>{failReason}</Text>
          </View>
          <PrimaryButton label={t.tryAgain} onPress={() => setStep('method')} />
          <SecondaryButton label={t.cancel} onPress={onClose} />
        </View>
      )}
    </BottomSheet>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.strong]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function SecuredBy({ label }: { label: string }) {
  return (
    <View style={styles.trustRow}>
      <Svg width={16} height={18} viewBox="0 0 12 14">
        <Path d="M6 0L0 2v5c0 4.5 2.5 8.5 6 10 3.5-1.5 6-5.5 6-10V2L6 0z" fill={colors.success} />
        <Path d="M3.4 7l1.8 1.8L8.8 5.2" fill="none" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.trustText}>{label}</Text>
      <RazorpayLogo size={14} />
    </View>
  );
}

function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.payBtn, disabled && { backgroundColor: colors.disabled }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.payBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.cancelBtn} onPress={onPress}>
      <Text style={styles.cancelBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Field({ label, error, ...props }: React.ComponentProps<typeof TextInput> & { label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, !!error && { borderColor: colors.danger }]}
        placeholderTextColor={colors.textFaint}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

function ChipGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const active = o === value;
        return (
          <TouchableOpacity key={o} style={[styles.chip, active && styles.chipActive]} onPress={() => onChange(o)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MethodIcon({ method }: { method: PayMethod }) {
  const c = colors.primary;
  return (
    <View style={styles.methodIcon}>
      <Svg width={20} height={20} viewBox="0 0 20 20">
        {method === 'upi' && <Path d="M8 2l-4 16M12 2l4 8-4 8" fill="none" stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />}
        {method === 'card' && (
          <>
            <Rect x={1.5} y={4} width={17} height={12} rx={2} fill="none" stroke={c} strokeWidth={1.75} />
            <Path d="M1.5 8h17M4.5 12.5h4" stroke={c} strokeWidth={1.75} strokeLinecap="round" />
          </>
        )}
        {method === 'netbanking' && <Path d="M2 8l8-5 8 5M3.5 8v7M7.5 8v7M12.5 8v7M16.5 8v7M2 17.5h16" fill="none" stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />}
        {method === 'wallet' && (
          <>
            <Rect x={2} y={4.5} width={16} height={12} rx={2} fill="none" stroke={c} strokeWidth={1.75} />
            <Circle cx={14} cy={10.5} r={1.3} fill={c} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...font.title, color: colors.textDark, marginBottom: space.xs },
  subtitle: { ...font.body, color: colors.textMuted, marginBottom: space.xl },
  box: { borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, padding: space.lg, marginBottom: space.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 28, gap: space.md },
  label: { ...font.body, color: colors.textSecondary },
  value: { ...font.bodyStrong, color: colors.textDark, flexShrink: 1, textAlign: 'right' },
  strong: { fontFamily: font.title.fontFamily, color: colors.textDark },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space.sm },
  trustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginVertical: space.md },
  trustText: { ...font.label, color: colors.textMuted },
  payBtn: { backgroundColor: colors.primary, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  payBtnText: { ...font.button, color: colors.white },
  cancelBtn: { alignItems: 'center', justifyContent: 'center', height: 52 },
  cancelBtnText: { ...font.button, color: colors.textMuted },

  checkoutHead: { flexDirection: 'row', alignItems: 'center', paddingBottom: space.md, marginBottom: space.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginLeft: -space.sm, paddingLeft: space.sm },
  merchant: { ...font.name, color: colors.textDark },
  merchantSub: { ...font.label, color: colors.textMuted },
  headAmount: { ...font.amountLg, color: colors.textDark },
  sectionLabel: { ...font.label, color: colors.textMuted, marginBottom: space.sm, textTransform: 'uppercase', letterSpacing: 0.5 },

  methodRow: { flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingHorizontal: space.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: space.sm },
  methodRowActive: { borderColor: colors.primary, backgroundColor: colors.tintBg },
  methodIcon: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { ...font.bodyStrong, color: colors.textDark },
  methodSub: { ...font.caption, color: colors.textMuted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.dashedBorder, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  form: { marginTop: space.sm, marginBottom: space.sm },
  field: { marginBottom: space.md },
  fieldRow: { flexDirection: 'row', gap: space.md },
  fieldLabel: { ...font.label, color: colors.textSecondary, marginBottom: space.xs },
  input: { height: 48, borderWidth: 1, borderColor: colors.copyBorder, borderRadius: radius.sm, paddingHorizontal: space.md, ...font.body, color: colors.textDark, paddingVertical: 0 },
  error: { ...font.caption, color: colors.danger, marginTop: space.xs },
  hint: { ...font.caption, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { minHeight: 44, paddingHorizontal: space.lg, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.tintBg },
  chipText: { ...font.bodyStrong, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },

  center: { alignItems: 'center', paddingVertical: space.lg },
  centerText: { textAlign: 'center' },
  statusCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: space.lg },
});
