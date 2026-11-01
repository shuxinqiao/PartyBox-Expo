import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import { type PresetId, PRESET_IDS } from './questions';

type Props = {
  customCount: number;
  loaded: boolean;
  onBack: () => void;
  onPreset: (preset: PresetId) => void;
  onManual: () => void;
  onCustomPlay: () => void;
  onCustomEdit: () => void;
};

const PRESET_DESIGN = {
  friends: { icon: '✦', color: COLORS.cyan, title: 'presetFriends', sub: 'presetFriendsSub' },
  couples: { icon: '♥', color: COLORS.pink, title: 'presetCouples', sub: 'presetCouplesSub' },
  family: { icon: '✳', color: COLORS.orange, title: 'presetFamily', sub: 'presetFamilySub' },
} as const;

export function WavelengthSetup({ customCount, loaded, onBack, onPreset, onManual, onCustomPlay, onCustomEdit }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.root}>
      <LinearGradient colors={[COLORS.background, '#1D1230', COLORS.background]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}>
          <Text style={styles.backLabel}>‹  PARTYBOX</Text>
        </Pressable>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>02  /  {t('wavelengthTitle')}</Text>
          <Text style={styles.title}>{t('setupTitle')}</Text>
          <Text style={styles.subtitle}>{t('setupSubtitle')}</Text>

          <View style={styles.deckList}>
            {PRESET_IDS.map((preset) => {
              const design = PRESET_DESIGN[preset];
              return (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  onPress={() => onPreset(preset)}
                  style={styles.deckRow}>
                  <View style={[styles.iconBox, { backgroundColor: `${design.color}1C`, borderColor: `${design.color}55` }]}>
                    <Text style={[styles.icon, { color: design.color }]}>{design.icon}</Text>
                  </View>
                  <View style={styles.deckCopy}>
                    <Text style={styles.deckTitle}>{t(design.title)}</Text>
                    <Text style={styles.deckSubtitle}>{t(design.sub)}</Text>
                  </View>
                  <Text style={styles.chevron}>→</Text>
                </Pressable>
              );
            })}

            <View style={styles.customRow}>
              <Pressable
                accessibilityRole="button"
                disabled={!loaded}
                onPress={customCount ? onCustomPlay : onCustomEdit}
                style={styles.customMain}>
                <View style={[styles.iconBox, styles.customIconBox]}>
                  <Text style={[styles.icon, { color: COLORS.purple }]}>▤</Text>
                </View>
                <View style={styles.deckCopy}>
                  <Text style={styles.deckTitle}>{t('setupCustom')}</Text>
                  <Text style={styles.deckSubtitle}>{loaded ? `${customCount} ${t('setupQuestionCount')}` : '…'}</Text>
                </View>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={!loaded} onPress={onCustomEdit} style={styles.editButton}>
                <Text style={styles.editText}>{t('setupEdit')}</Text>
              </Pressable>
            </View>

            <Pressable accessibilityRole="button" onPress={onManual} style={[styles.deckRow, styles.manualRow]}>
              <View style={[styles.iconBox, styles.manualIconBox]}>
                <Text style={[styles.icon, { color: COLORS.white }]}>✎</Text>
              </View>
              <View style={styles.deckCopy}>
                <Text style={styles.deckTitle}>{t('setupManual')}</Text>
                <Text style={styles.deckSubtitle}>{t('setupManualSub')}</Text>
              </View>
              <Text style={styles.chevron}>→</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  back: { minHeight: 48, marginHorizontal: 22, justifyContent: 'center' },
  backLabel: { color: COLORS.muted, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  content: { paddingHorizontal: 23, paddingTop: 12, paddingBottom: 35 },
  eyebrow: { color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: COLORS.white, fontSize: 34, fontWeight: '900', marginTop: 14 },
  subtitle: { color: COLORS.muted, fontSize: 14, marginTop: 8 },
  deckList: { gap: 13, marginTop: 33 },
  deckRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, minHeight: 83, borderRadius: 23, borderWidth: 1, borderColor: '#41324F', backgroundColor: '#20172E' },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  icon: { fontSize: 25, fontWeight: '700' },
  deckCopy: { flex: 1, marginLeft: 14 },
  deckTitle: { color: COLORS.white, fontSize: 18, fontWeight: '900' },
  deckSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 5 },
  chevron: { color: COLORS.cyan, fontSize: 23, marginLeft: 6 },
  customRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, minHeight: 83, borderRadius: 23, borderWidth: 1, borderColor: '#574272', backgroundColor: '#251A37' },
  customMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  customIconBox: { borderColor: '#865DA5', backgroundColor: '#413058' },
  editButton: { minHeight: 40, minWidth: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#48305C' },
  editText: { color: COLORS.white, fontWeight: '800', fontSize: 12 },
  manualRow: { backgroundColor: '#2B1D3E', borderColor: '#654879' },
  manualIconBox: { borderColor: '#8856A2', backgroundColor: '#533466' },
});
