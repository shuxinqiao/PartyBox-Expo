import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

export function GamePlaceholder({ game }: { game: 'charades' | 'wavelength' }) {
  const { t } = useLanguage();
  const title = t(game === 'charades' ? 'charadesTitle' : 'wavelengthTitle');
  const accent = game === 'charades' ? COLORS.pink : COLORS.cyan;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={[COLORS.background, '#201438', COLORS.background]}
          style={styles.background}
        />
        <Text style={[styles.star, { color: accent }]}>✦</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{t('comingSoon')}{'\n'}{t('comingSoonSubtitle')}</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={styles.backButton}>
          <Text style={[styles.backText, { color: accent }]}>←  {t('back')}</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  background: StyleSheet.absoluteFill,
  star: { fontSize: 76 },
  title: { color: COLORS.white, fontWeight: '900', fontSize: 34, marginTop: 10 },
  subtitle: { color: COLORS.muted, fontSize: 15, lineHeight: 25, textAlign: 'center', marginTop: 13 },
  backButton: { marginTop: 28, paddingHorizontal: 18, paddingVertical: 12 },
  backText: { fontWeight: '800', fontSize: 15 },
});
