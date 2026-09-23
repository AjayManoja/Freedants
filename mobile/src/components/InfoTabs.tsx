import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, cardStyle, fontFamilies, hitSlop } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';

export interface InfoTabsProps {
  about: string[];
  judgingParameters: string[];
  rules: string[];
}

const TAB_WIDTHS = [94, 110, 100];

export function InfoTabs({ about, judgingParameters, rules }: InfoTabsProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabs = [t.aboutCompetition, t.judgingParameters, t.rulesEligibility];
  
  const content = [about, judgingParameters, rules][activeTab];

  const tabButtons = tabs.map((tab, i) => {
    const active = activeTab === i;
    return (
      <TouchableOpacity
        key={tab}
        style={[
          styles.tab,
          { width: TAB_WIDTHS[i] ?? 100 },
          active && styles.tabActive,
        ]}
        onPress={() => { setActiveTab(i); setExpanded(false); }}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        hitSlop={hitSlop}
      >
        <Text
          style={[styles.tabText, active && styles.tabTextActive]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
        >
          {tab}
        </Text>
      </TouchableOpacity>
    );
  });
  const displayContent = expanded ? content : content.slice(0, 3);
  
  return (
    <View style={styles.card}>
      <View style={styles.tabRow}>
        {tabButtons}
      </View>
      <View style={styles.content}>
        {displayContent.map((text, i) => (
          <Text key={i} style={styles.bodyText}>• {text}</Text>
        ))}
        {content.length > 3 && (
          <TouchableOpacity 
            style={styles.moreBtn} 
            onPress={() => setExpanded(!expanded)}
            hitSlop={hitSlop}
            accessibilityRole="button"
          >
            <Text style={styles.moreText}>{expanded ? t.viewLess : t.viewMore}</Text>
            <Svg width={7} height={5} viewBox="0 0 7 5" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
              <Path d="M0.8 0.8L3.5 3.8 6.2 0.8" fill="none" stroke={colors.primary} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 0,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9EE',
  },
  tab: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    marginBottom: -1,
  },
  tabText: {
    fontFamily: fontFamilies.medium,
    fontSize: 7,
    fontWeight: '500',
    color: colors.textInactiveTab,
    lineHeight: 11,
  },
  tabTextActive: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    marginTop: 9,
  },
  bodyText: {
    fontFamily: fontFamilies.regular,
    fontSize: 6.5,
    color: '#6C7286',
    lineHeight: 11,
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 1,
    gap: 8,
  },
  moreText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 6.5,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 11,
  },
});
