import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import { CharadesArtwork, WavelengthArtwork } from './GameArtwork';

function AmbientBackground() {
  const [glow] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 8500, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 8500, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [glow]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[COLORS.background, '#191029', COLORS.background]}
        start={{ x: 0.9, y: 0 }}
        end={{ x: 0.1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.purpleGlow,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.30, 0.58] }),
            transform: [
              { translateY: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 38] }) },
            ],
          },
        ]}
      />
      <View style={styles.cyanGlow} />
    </View>
  );
}

type GameCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  accent: string;
  colors: readonly [string, string];
  artwork: ReactNode;
  onPress: () => void;
};

function GameCard({ eyebrow, title, description, footer, accent, colors, artwork, onPress }: GameCardProps) {
  const [scale] = useState(() => new Animated.Value(1));

  function setPressed(pressed: boolean) {
    Animated.spring(scale, {
      toValue: pressed ? 0.975 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 110,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: `${accent}44` }]}>
          <View pointerEvents="none" style={styles.cardArt}>{artwork}</View>
          <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
          <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.76}>
            {title}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {description}
          </Text>
          <View style={styles.cardFooterRow}>
            <Text style={styles.cardFooter} numberOfLines={1}>{footer}</Text>
            <Text style={[styles.cardArrow, { color: accent }]}>↗</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { t, language, toggleLanguage } = useLanguage();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <AmbientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: width < 350 ? 17 : 24 }]}>
          <View style={styles.brandRow}>
            <LinearGradient
              colors={[COLORS.purple, COLORS.pink]}
              style={styles.brandIcon}>
              <Text style={styles.brandStar}>✦</Text>
            </LinearGradient>
            <Text style={styles.brandName}>PARTYBOX</Text>
            <View style={{ flex: 1 }} />
            <Pressable
              style={styles.languageButton}
              onPress={toggleLanguage}
              accessibilityRole="button"
              accessibilityLabel={language === 'zh' ? 'Switch to English' : '切换到中文'}>
              <Text style={styles.languageButtonText}>{language === 'zh' ? 'EN' : '中文'}</Text>
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{t('title')}</Text>
            <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('chooseGame')}</Text>
            <Text style={styles.gameCount}>{t('gameCount')}</Text>
          </View>

          <GameCard
            eyebrow={t('charadesEyebrow')}
            title={t('charadesTitle')}
            description={t('charadesSubtitle')}
            footer={t('charadesFooter')}
            accent={COLORS.pink}
            colors={[COLORS.charadesStart, COLORS.charadesEnd]}
            artwork={<CharadesArtwork />}
            onPress={() => router.push('/charades')}
          />
          <View style={{ height: 16 }} />
          <GameCard
            eyebrow={t('wavelengthEyebrow')}
            title={t('wavelengthTitle')}
            description={t('wavelengthSubtitle')}
            footer={t('wavelengthFooter')}
            accent={COLORS.cyan}
            colors={[COLORS.wavelengthStart, COLORS.wavelengthEnd]}
            artwork={<WavelengthArtwork />}
            onPress={() => router.push('/wavelength')}
          />

          <Text style={styles.footer}>{t('footer')}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  scrollContent: { paddingTop: 24, paddingBottom: 30 },
  purpleGlow: {
    position: 'absolute',
    right: -145,
    top: -115,
    width: 355,
    height: 355,
    borderRadius: 180,
    backgroundColor: '#492375',
  },
  cyanGlow: {
    position: 'absolute',
    left: -150,
    bottom: -150,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(70,232,215,0.045)',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandStar: { color: '#FFFFFF', fontSize: 29, fontWeight: '900' },
  brandName: { fontSize: 19, letterSpacing: 2, fontWeight: '900', color: COLORS.white },
  languageButton: {
    borderRadius: 18,
    borderColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 48,
    alignItems: 'center',
  },
  languageButtonText: { color: COLORS.cyan, fontSize: 12, fontWeight: '800' },
  hero: { paddingTop: 45, paddingBottom: 37 },
  heroTitle: { color: COLORS.white, fontSize: 40, letterSpacing: -1.2, fontWeight: '900' },
  heroSubtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginTop: 7 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: { color: COLORS.white, fontSize: 21, fontWeight: '800' },
  gameCount: { color: COLORS.muted, fontSize: 10, letterSpacing: 1.6 },
  card: { minHeight: 218, borderRadius: 29, borderWidth: 1, padding: 22, overflow: 'hidden' },
  cardArt: { position: 'absolute', right: 12, top: 53, opacity: 0.94 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  cardTitle: { color: '#FFFFFF', fontSize: 29, fontWeight: '800', marginTop: 22, maxWidth: '68%' },
  cardDescription: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: '61%',
    minHeight: 38,
  },
  cardFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17 },
  cardFooter: { color: 'rgba(255,255,255,0.59)', fontSize: 10, flexShrink: 1 },
  cardArrow: { fontSize: 25, fontWeight: '800', marginLeft: 10 },
  footer: {
    color: 'rgba(170,164,190,0.64)',
    fontSize: 9,
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 34,
  },
});
