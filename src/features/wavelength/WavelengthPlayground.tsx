import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import { SemicircleDial } from './SemicircleDial';

export default function WavelengthPlayground() {
  const { t } = useLanguage();
  const [value, setValue] = useState(50);
  const [locked, setLocked] = useState(false);

  const adjustBy = (amount: number) => {
    if (!locked) setValue((previous) => Math.max(0, Math.min(100, previous + amount)));
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[COLORS.background, '#211434', COLORS.background]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.navigation}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>{t('back')}</Text>
          </Pressable>
          <Text style={styles.screenIndex}>02 / PARTYBOX</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.content}>
          <View style={styles.headingBlock}>
            <Text style={styles.eyebrow}>✦  {t('dialBadge')}</Text>
            <Text style={styles.heading}>{t('dialHeading')}</Text>
          </View>

          <View style={styles.questionCard}>
            <View style={styles.questionTopRow}>
              <Text style={styles.questionLabel}>{t('dialQuestionLabel')}</Text>
              <View style={styles.questionDot} />
            </View>
            <Text style={styles.questionText}>{t('dialQuestion')}</Text>

            <View style={styles.dialRegion}>
              <SemicircleDial
                value={value}
                onChange={setValue}
                disabled={locked}
                accessibilityLabel={t('dialHint')}
              />

              <View style={styles.endpoints}>
                <View style={styles.endpointLeft}>
                  <View style={[styles.endpointDot, { backgroundColor: COLORS.cyan }]} />
                  <Text style={styles.endpointText}>{t('dialLeft')}</Text>
                </View>
                <View style={styles.endpointRight}>
                  <Text style={[styles.endpointText, styles.alignRight]}>{t('dialRight')}</Text>
                  <View style={[styles.endpointDot, { backgroundColor: COLORS.pink }]} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.controls}>
            <Text style={styles.hint}>{locked ? t('dialLocked') : t('dialHint')}</Text>

            <View style={styles.adjustRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease by five percent"
                disabled={locked}
                onPress={() => adjustBy(-5)}
                style={[styles.adjustButton, locked && styles.disabled]}>
                <Text style={styles.adjustSymbol}>−</Text>
              </Pressable>

              <View style={styles.valueChip}>
                <Text style={styles.valueNumber}>{value}</Text>
                <Text style={styles.valueUnit}>/ 100</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase by five percent"
                disabled={locked}
                onPress={() => adjustBy(5)}
                style={[styles.adjustButton, locked && styles.disabled]}>
                <Text style={styles.adjustSymbol}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.fineHint}>{t('dialAdjustHint')}</Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => setLocked((previous) => !previous)}
              style={styles.confirmButton}>
              <LinearGradient
                colors={locked ? [COLORS.purple, '#7556C5'] : [COLORS.cyan, '#76B6FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}>
                <Text style={styles.confirmText}>{locked ? t('dialUnlock') : t('dialLock')}</Text>
                <Text style={styles.confirmIcon}>{locked ? '↻' : '↗'}</Text>
              </LinearGradient>
            </Pressable>

            <Text style={styles.footnote}>{t('dialPlayground')}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  navigation: {
    height: 54,
    marginHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingRight: 12 },
  backArrow: { color: COLORS.cyan, fontSize: 32, lineHeight: 35, marginRight: 7, marginTop: -3 },
  backLabel: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  screenIndex: { color: COLORS.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 28 },
  headingBlock: { paddingTop: 12, paddingBottom: 22 },
  eyebrow: { color: COLORS.cyan, letterSpacing: 2.2, fontWeight: '900', fontSize: 10 },
  heading: { color: COLORS.white, fontSize: 31, fontWeight: '900', marginTop: 9, letterSpacing: -0.5 },
  questionCard: {
    backgroundColor: '#1B142C',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#403052',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  questionTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questionLabel: { color: COLORS.purple, fontSize: 11, letterSpacing: 1.7, fontWeight: '900' },
  questionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.pink },
  questionText: { color: COLORS.white, fontSize: 23, fontWeight: '800', marginTop: 15, lineHeight: 32 },
  dialRegion: { marginTop: 12 },
  endpoints: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6, minHeight: 53 },
  endpointLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, maxWidth: '49%' },
  endpointRight: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 8, maxWidth: '49%' },
  endpointDot: { width: 7, height: 7, borderRadius: 4, marginTop: 7 },
  endpointText: { color: COLORS.white, fontSize: 13, fontWeight: '800', lineHeight: 19, flexShrink: 1 },
  alignRight: { textAlign: 'right' },
  controls: { marginTop: 24, alignItems: 'center' },
  hint: { color: COLORS.white, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  adjustRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 18 },
  adjustButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#614A7C',
    backgroundColor: '#281F3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
  adjustSymbol: { color: COLORS.white, fontSize: 28, fontWeight: '500', marginTop: -2 },
  valueChip: { width: 104, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  valueNumber: { color: COLORS.white, fontSize: 33, fontWeight: '900', fontVariant: ['tabular-nums'] },
  valueUnit: { color: COLORS.muted, fontSize: 13, fontWeight: '700', paddingLeft: 4 },
  fineHint: { color: COLORS.muted, fontSize: 11, marginTop: 11 },
  confirmButton: { width: '100%', marginTop: 24, borderRadius: 18, overflow: 'hidden' },
  confirmGradient: { height: 60, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  confirmText: { color: COLORS.background, fontSize: 17, fontWeight: '900' },
  confirmIcon: { color: COLORS.background, fontSize: 23, fontWeight: '900' },
  footnote: { color: COLORS.muted, fontSize: 11, textAlign: 'center', marginTop: 15, lineHeight: 17 },
});
