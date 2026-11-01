import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import type { WavelengthQuestion } from './questions';

const EMPTY_QUESTION: WavelengthQuestion = { prompt: '', left: '', right: '' };

type Props = {
  questions: WavelengthQuestion[];
  onSave: (questions: WavelengthQuestion[]) => void;
  onBack: () => void;
  onPlay: () => void;
};

export function CustomBankEditor({ questions, onSave, onBack, onPlay }: Props) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState<WavelengthQuestion>(EMPTY_QUESTION);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const valid = draft.prompt.trim().length > 0 && draft.left.trim().length > 0 && draft.right.trim().length > 0;

  function saveDraft() {
    if (!valid) return;
    const next = {
      prompt: draft.prompt.trim(),
      left: draft.left.trim(),
      right: draft.right.trim(),
    };
    if (editingIndex === null) onSave([...questions, next]);
    else onSave(questions.map((question, index) => index === editingIndex ? next : question));
    setDraft(EMPTY_QUESTION);
    setEditingIndex(null);
    Keyboard.dismiss();
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable onPress={onBack} accessibilityRole="button" style={styles.back}>
          <Text style={styles.backText}>‹  {t('setupCustom')}</Text>
        </Pressable>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('bankTitle')}</Text>
          <Text style={styles.count}>{questions.length} {t('setupQuestionCount')}</Text>

          <View style={styles.form}>
            <TextInput
              value={draft.prompt}
              onChangeText={(prompt) => setDraft((previous) => ({ ...previous, prompt }))}
              placeholder={t('manualPrompt')}
              placeholderTextColor="#8C809D"
              maxLength={120}
              style={[styles.input, styles.promptInput]}
              multiline
            />
            <View style={styles.polarInputs}>
              <TextInput
                value={draft.left}
                onChangeText={(left) => setDraft((previous) => ({ ...previous, left }))}
                placeholder={t('manualLeft')}
                placeholderTextColor="#8C809D"
                maxLength={60}
                style={[styles.input, styles.polarInput]}
              />
              <Text style={styles.arrow}>↔</Text>
              <TextInput
                value={draft.right}
                onChangeText={(right) => setDraft((previous) => ({ ...previous, right }))}
                placeholder={t('manualRight')}
                placeholderTextColor="#8C809D"
                maxLength={60}
                style={[styles.input, styles.polarInput]}
              />
            </View>
            <Pressable
              onPress={saveDraft}
              disabled={!valid || (editingIndex === null && questions.length >= 100)}
              style={[styles.saveButton, (!valid || (editingIndex === null && questions.length >= 100)) && styles.disabled]}>
              <Text style={styles.saveText}>{editingIndex === null ? t('bankAdd') : t('bankSave')}</Text>
            </Pressable>
          </View>

          {questions.length === 0 && <Text style={styles.empty}>{t('bankEmpty')}</Text>}
          {questions.map((question, index) => (
            <View key={`${index}-${question.prompt}`} style={styles.questionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => { setDraft(question); setEditingIndex(index); }}
                style={styles.questionCopy}>
                <Text style={styles.questionPrompt}>{index + 1}. {question.prompt}</Text>
                <Text style={styles.questionSides}>{question.left}  ↔  {question.right}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onSave(questions.filter((_, itemIndex) => itemIndex !== index));
                  setEditingIndex(null);
                  setDraft(EMPTY_QUESTION);
                }}
                style={styles.deleteButton}>
                <Text style={styles.deleteText}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        {questions.length > 0 && (
          <Pressable onPress={onPlay} accessibilityRole="button" style={styles.playButton}>
            <Text style={styles.playText}>{t('bankStart')}  →</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  back: { minHeight: 46, marginHorizontal: 22, justifyContent: 'center' },
  backText: { color: COLORS.muted, fontWeight: '800', fontSize: 14 },
  scroll: { paddingHorizontal: 22, paddingTop: 17, paddingBottom: 25 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '900' },
  count: { color: COLORS.cyan, fontSize: 12, marginTop: 6, marginBottom: 20 },
  form: { padding: 15, backgroundColor: '#221932', borderRadius: 20, borderWidth: 1, borderColor: '#48345C' },
  input: { color: COLORS.white, backgroundColor: '#110D1F', borderRadius: 13, borderWidth: 1, borderColor: '#4B3B5C', fontSize: 15, paddingHorizontal: 13, paddingVertical: 12 },
  promptInput: { minHeight: 64, textAlignVertical: 'top' },
  polarInputs: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 11 },
  polarInput: { flex: 1, minWidth: 0, fontSize: 13 },
  arrow: { color: COLORS.pink, fontSize: 19 },
  saveButton: { backgroundColor: COLORS.cyan, minHeight: 49, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  disabled: { opacity: 0.42 },
  saveText: { color: COLORS.background, fontWeight: '900', fontSize: 15 },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 28, fontSize: 13 },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: '#40314C', paddingVertical: 15 },
  questionCopy: { flex: 1 },
  questionPrompt: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  questionSides: { color: COLORS.muted, fontSize: 12, marginTop: 6 },
  deleteButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#3D2639' },
  deleteText: { color: COLORS.pink, fontSize: 25, fontWeight: '600' },
  playButton: { minHeight: 57, margin: 15, borderRadius: 17, backgroundColor: COLORS.purple, alignItems: 'center', justifyContent: 'center' },
  playText: { color: COLORS.background, fontSize: 16, fontWeight: '900' },
});
