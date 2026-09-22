import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, cardStyle, font, space, radius, hitSlop, useLayout } from '../theme';
import Svg, { Path } from 'react-native-svg';
import { useLocale } from '../i18n/LocaleContext';


export interface InfoTabsProps {
  about: string[];
  judgingParameters: string[];
  rules: string[];
}

export function InfoTabs({ about, judgingParameters, rules }: InfoTabsProps) {
  const { t } = useLocale();
  const { isWide } = useLayout();
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabs = [t.aboutCompetition, t.judgingParameters, t.rulesEligibility];
  
  const content = [about, judgingParameters, rules][activeTab];

  const tabButtons = tabs.map((tab, i) => {
    const active = activeTab === i;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isWide && styles.tabFixed, active && styles.tabActive]}
        onPress={() => { setActiveTab(i); setExpanded(false); }}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
      >
        <Text
          style={[styles.tabText, active && styles.tabTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit={isWide}
          minimumFontScale={0.85}
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
        {/* Wide screens: three equal tabs as in the design. Regular: scrollable tab bar (MOBILE_SIZING §4.6). */}
        {isWide ? (
          <View style={styles.fixedTabs}>{tabButtons}</View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {tabButtons}
          </ScrollView>
        )}
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
          >
            <Text style={styles.moreText}>{expanded ? t.viewLess : t.viewMore}</Text>
            <Svg width={12} height={8} viewBox="0 0 7 5" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }], marginLeft: space.xs }}>
              <Path d="M0.8 0.8L3.5 3.8 6.2 0.8" fill="none" stroke={colors.primary} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...cardStyle, borderRadius: radius.md, padding: 0 },
  tabRow: { borderBottomWidth: 1, borderBottomColor: colors.border },
  scrollContent: { paddingHorizontal: space.lg },
  tab: { minHeight: 44, paddingVertical: space.md, paddingHorizontal: space.sm, marginRight: space.md, justifyContent: 'center' },
  fixedTabs: { flexDirection: 'row', paddingHorizontal: space.sm },
  tabFixed: { flex: 1, marginRight: 0, alignItems: 'center', paddingHorizontal: space.xs },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...font.body, color: colors.textInactiveTab },
  tabTextActive: { ...font.bodyStrong, color: colors.primary },
  content: { padding: space.lg },
  bodyText: { ...font.body, color: colors.textBody, marginBottom: space.xs },
  moreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: space.md, minHeight: 44 },
  moreText: { ...font.bodyStrong, color: colors.primary }
});
