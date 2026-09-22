import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { font, space, radius, colors, icon } from '../theme';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';


export interface CountdownStripProps {
  targetDate: string;
  serverTimeOffset: number;
  /** Fired once when the countdown reaches zero. */
  onExpire?: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  return `${pad(d)}d : ${pad(h)}h : ${pad(m)}m : ${pad(sec)}s`;
}

export function CountdownStrip({ targetDate, serverTimeOffset, onExpire }: CountdownStripProps) {
  const { t } = useLocale();
  const target = new Date(targetDate).getTime();
  const [now, setNow] = useState(() => Date.now() + serverTimeOffset);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + serverTimeOffset), 1000);
    return () => clearInterval(id);
  }, [serverTimeOffset]);

  const expired = now >= target;
  useEffect(() => {
    if (expired) onExpire?.();
  }, [expired]);

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={styles.labelRow}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.hourglass}>
            <Path d="M0.5 0.7h7M0.5 11.3h7M1.3 0.7c0 3 5.4 3 5.4 5.3S1.3 8.3 1.3 11.3M6.7 0.7c0 3-5.4 3-5.4 5.3s5.4 2.3 5.4 5.3" fill="none" stroke={colors.primary} strokeWidth={1.1} strokeLinecap="round" />
          </Svg>
          <Text style={styles.label} maxFontSizeMultiplier={1.3}>{t.closesIn}</Text>
        </View>
        <Text style={styles.timerText} maxFontSizeMultiplier={1.3}>{formatRemaining(target - now)}</Text>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.hurryChip}>
          <Svg width={icon.sm} height={icon.sm} viewBox="0 0 12 12" style={styles.stopwatch}>
            <Circle cx={5.5} cy={6.8} r={4.4} fill="none" stroke={colors.primary} strokeWidth={1.1} />
            <Path d="M5.5 4.5v2.4M4 0.8h3M5.5 0.8v1.6M9.2 2.8l0.9-0.9" fill="none" stroke={colors.primary} strokeWidth={1.1} strokeLinecap="round" />
          </Svg>
          <Text style={styles.hurry} maxFontSizeMultiplier={1.3}>{t.hurry}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.tintBg,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftCol: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.xs,
  },
  hourglass: {
    marginRight: space.xs,
  },
  label: {
    ...font.bodyStrong,
    color: colors.textPrimary,
  },
  timerText: {
    ...font.timer,
    color: colors.primary,
  },
  rightCol: {
    marginLeft: space.sm,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  hurryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: radius.sm,
  },
  stopwatch: {
    marginRight: space.xs,
  },
  hurry: {
    ...font.bodyStrong,
    color: colors.primary,
  }
});
