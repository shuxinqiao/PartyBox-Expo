import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import { CustomBankEditor } from './CustomBankEditor';
import { ManualQuestionEditor } from './ManualQuestionEditor';
import { MechanicalDial } from './MechanicalDial';
import { type PresetId, type WavelengthQuestion, presetQuestions } from './questions';
import { scoreForGuess } from './dialGeometry';
import { useCustomQuestionBank } from './useCustomQuestionBank';
import { WavelengthSetup } from './WavelengthSetup';

type SessionMode = PresetId | 'custom' | 'manual';
type Screen = 'setup' | 'bank' | 'game';
type GameStep = 'target' | 'handoff' | 'guess' | 'reveal';

const BLANK_QUESTION: WavelengthQuestion = { prompt: '', left: '', right: '' };

export default function WavelengthGame() {
  const { t, language } = useLanguage();
  const { width, height } = useWindowDimensions();
  const { questions: customQuestions, save: saveCustomQuestions, loaded } = useCustomQuestionBank();

  const [screen, setScreen] = useState<Screen>('setup');
  const [mode, setMode] = useState<SessionMode>('friends');
  const [step, setStep] = useState<GameStep>('target');
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(50);
  const [guess, setGuess] = useState(50);
  const [totalScore, setTotalScore] = useState(0);
  const [manualQuestion, setManualQuestion] = useState<WavelengthQuestion>(BLANK_QUESTION);
  const [manualEditing, setManualEditing] = useState(false);

  const preset = mode !== 'custom' && mode !== 'manual' ? presetQuestions[language][mode] : [];
  const deck = mode === 'custom' ? customQuestions : preset;
  const question = mode === 'manual'
    ? manualQuestion
    : deck[round % Math.max(deck.length, 1)] ?? presetQuestions[language].friends[0];

  const score = scoreForGuess(target, guess);
  const dialWidth = Math.max(238, Math.min(width - 12, 402, (height - 330) * 1.2));
  const compact = height < 740;

  function begin(sessionMode: SessionMode) {
    if (sessionMode === 'custom' && customQuestions.length === 0) {
      setScreen('bank');
      return;
    }
    setMode(sessionMode);
    setRound(0);
    setTarget(50);
    setGuess(50);
    setTotalScore(0);
    setStep('target');
    if (sessionMode === 'manual') {
      setManualQuestion(BLANK_QUESTION);
      setManualEditing(true);
    } else {
      setManualEditing(false);
    }
    setScreen('game');
  }

  function continueGame() {
    if (step === 'target') {
      setStep('handoff');
    } else if (step === 'handoff') {
      setGuess(50);
      setStep('guess');
    } else if (step === 'guess') {
      setTotalScore((previous) => previous + scoreForGuess(target, guess));
      setStep('reveal');
    } else {
      setTarget(50);
      setGuess(50);
      setRound((previous) => previous + 1);
      setStep('target');
      if (mode === 'manual') setManualEditing(true);
    }
  }

  if (screen === 'setup') {
    return (
      <WavelengthSetup
        customCount={customQuestions.length}
        loaded={loaded}
        onBack={() => router.back()}
        onPreset={begin}
        onManual={() => begin('manual')}
        onCustomPlay={() => begin('custom')}
        onCustomEdit={() => setScreen('bank')}
      />
    );
  }

  if (screen === 'bank') {
    return (
      <CustomBankEditor
        questions={customQuestions}
        onSave={saveCustomQuestions}
        onBack={() => setScreen('setup')}
        onPlay={() => begin('custom')}
      />
    );
  }

  const stageLabel = step === 'target' ? t('gameA') : step === 'guess' ? t('gameB') : t('gameReveal');
  const actionLabel = step === 'target'
    ? t('gameAButton')
    : step === 'handoff'
      ? t('gameHandoffButton')
      : step === 'guess'
        ? t('gameBButton')
        : t('gameNextButton');

  return (
    <View style={styles.root}>
      <LinearGradient colors={[COLORS.background, '#21152D', COLORS.background]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.navRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => { setManualEditing(false); setScreen('setup'); }}
            style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.roundBadge}>{t('meterRound')} {String(round + 1).padStart(2, '0')}</Text>
          <View style={styles.navRight} />
        </View>

        {step === 'handoff' ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.handoffBody}>
            <View style={styles.handoffEmblem}>
              <Text style={styles.handoffGlyph}>⇄</Text>
            </View>
            <Text style={styles.handoffTitle}>{t('gameHandoff')}</Text>
            <Text style={styles.handoffPlayer}>B</Text>
          </Animated.View>
        ) : (
          <>
            <View style={[styles.questionArea, compact && styles.questionAreaCompact]}>
              <View style={styles.stageRow}>
                <Text style={styles.stageLabel}>{stageLabel}</Text>
                {mode === 'manual' && step === 'target' && (
                  <Pressable accessibilityRole="button" onPress={() => setManualEditing(true)} style={styles.editQuestion}>
                    <Text style={styles.editQuestionText}>{t('gameChangeQuestion')}</Text>
                  </Pressable>
                )}
              </View>
              <Text style={[styles.questionText, compact && styles.questionTextCompact]} numberOfLines={3} adjustsFontSizeToFit>
                {question.prompt}
              </Text>
            </View>

            <View style={styles.dialStage}>
              <MechanicalDial
                key={`${round}-${step}`}
                mode={step === 'target' ? 'target' : step === 'guess' ? 'hidden' : 'reveal'}
                value={step === 'target' ? target : guess}
                targetCenter={target}
                onChange={step === 'target' ? setTarget : setGuess}
                width={dialWidth}
                label={stageLabel}
              />
              <View style={[styles.endpoints, { width: dialWidth - 27 }]}>
                <Text style={styles.endpointLeft} numberOfLines={3} adjustsFontSizeToFit>{question.left}</Text>
                <Text style={styles.endpointRight} numberOfLines={3} adjustsFontSizeToFit>{question.right}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomDock}>
          {step === 'reveal' && (
            <Animated.View entering={FadeIn.duration(350)} style={styles.scoreStrip}>
              <View style={styles.scorePair}>
                <Text style={styles.scoreNumber}>{score}</Text>
                <Text style={styles.scoreLabel}>{t('gameScore')}</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scorePair}>
                <Text style={styles.totalNumber}>{totalScore}</Text>
                <Text style={styles.scoreLabel}>{t('gameTotal')}</Text>
              </View>
            </Animated.View>
          )}
          <Pressable onPress={continueGame} accessibilityRole="button" style={styles.actionButton}>
            <LinearGradient
              colors={step === 'reveal' ? [COLORS.purple, COLORS.pink] : [COLORS.cyan, '#8AB8FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}>
              <Text style={styles.actionText}>{actionLabel}</Text>
              <Text style={styles.actionArrow}>{step === 'reveal' ? '↻' : '→'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>

      {manualEditing && (
        <ManualQuestionEditor
          initial={manualQuestion}
          onSave={(next) => { setManualQuestion(next); setManualEditing(false); }}
          onCancel={() => {
            setManualEditing(false);
            if (!manualQuestion.prompt) setScreen('setup');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  navRow: { height: 47, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  backArrow: { color: COLORS.white, fontSize: 35, marginTop: -3 },
  roundBadge: { color: COLORS.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  navRight: { width: 44 },
  questionArea: { paddingHorizontal: 27, paddingTop: 10, minHeight: 128 },
  questionAreaCompact: { paddingTop: 4, minHeight: 105 },
  stageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 31 },
  stageLabel: { color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  editQuestion: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#392849' },
  editQuestionText: { color: COLORS.pink, fontWeight: '800', fontSize: 11 },
  questionText: { color: COLORS.white, fontWeight: '900', fontSize: 27, lineHeight: 36, marginTop: 11 },
  questionTextCompact: { fontSize: 23, lineHeight: 31, marginTop: 7 },
  dialStage: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -6 },
  endpoints: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: 45, paddingTop: 3 },
  endpointLeft: { color: '#BDEFE8', fontSize: 15, fontWeight: '900', maxWidth: '45%', lineHeight: 20 },
  endpointRight: { color: '#FFBCB1', fontSize: 15, fontWeight: '900', maxWidth: '45%', lineHeight: 20, textAlign: 'right' },
  bottomDock: { paddingHorizontal: 22, paddingBottom: 17 },
  actionButton: { borderRadius: 20, overflow: 'hidden' },
  actionGradient: { minHeight: 62, paddingHorizontal: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionText: { color: COLORS.background, fontSize: 18, fontWeight: '900' },
  actionArrow: { color: COLORS.background, fontSize: 25, fontWeight: '900' },
  scoreStrip: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 },
  scorePair: { flexDirection: 'row', gap: 7, alignItems: 'baseline', minWidth: 95, justifyContent: 'center' },
  scoreNumber: { fontSize: 35, fontWeight: '900', color: COLORS.cyan },
  totalNumber: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  scoreLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '800' },
  scoreDivider: { width: 1, height: 34, marginHorizontal: 15, backgroundColor: '#554164' },
  handoffBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  handoffEmblem: { width: 125, height: 125, borderRadius: 39, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2F1E40', borderWidth: 2, borderColor: '#68477E' },
  handoffGlyph: { color: COLORS.cyan, fontSize: 76, fontWeight: '300' },
  handoffTitle: { color: COLORS.white, fontSize: 29, fontWeight: '900', marginTop: 31 },
  handoffPlayer: { color: COLORS.pink, fontSize: 100, fontWeight: '900', marginTop: 10 },
});
