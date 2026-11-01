import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS } from '@/theme/colors';

import type { WavelengthQuestion } from './questions';

type Props = {
  initial: WavelengthQuestion;
  onSave: (question: WavelengthQuestion) => void;
  onCancel: () => void;
};

export function ManualQuestionEditor({ initial, onSave, onCancel }: Props) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(initial);
  const valid = !!(draft.prompt.trim() && draft.left.trim() && draft.right.trim());

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>{t('manualTitle')}</Text>
          <TextInput
            value={draft.prompt}
            onChangeText={(prompt) => setDraft((previous) => ({ ...previous, prompt }))}
            placeholder={t('manualPrompt')}
            placeholderTextColor="#897B9B"
            maxLength={120}
            style={[styles.field, styles.questionField]}
            multiline
            autoFocus
          />
          <View style={styles.endpoints}>
            <TextInput
              value={draft.left}
              onChangeText={(left) => setDraft((previous) => ({ ...previous, left }))}
              placeholder={t('manualLeft')}
              placeholderTextColor="#897B9B"
              maxLength={60}
              style={[styles.field, styles.endpointField]}
            />
            <Text style={styles.arrow}>↔</Text>
            <TextInput
              value={draft.right}
              onChangeText={(right) => setDraft((previous) => ({ ...previous, right }))}
              placeholder={t('manualRight')}
              placeholderTextColor="#897B9B"
              maxLength={60}
              style={[styles.field, styles.endpointField]}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={!valid}
            onPress={() => {
              Keyboard.dismiss();
              onSave({ prompt: draft.prompt.trim(), left: draft.left.trim(), right: draft.right.trim() });
            }}
            style={[styles.done, !valid && styles.disabled]}>
            <Text style={styles.doneText}>{t('manualDone')}</Text>
          </Pressable>
          <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancel}>
            <Text style={styles.cancelText}>×</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,4,12,0.92)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  panel: { width: '100%', maxWidth: 420, padding: 22, borderRadius: 27, borderColor: '#7C58A1', borderWidth: 1.5, backgroundColor: '#22162E' },
  title: { color: COLORS.white, fontSize: 24, fontWeight: '900', marginBottom: 19 },
  field: { color: COLORS.white, backgroundColor: '#0D0918', borderColor: '#4B335D', borderWidth: 1, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 13, fontSize: 14 },
  questionField: { minHeight: 72, textAlignVertical: 'top' },
  endpoints: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 12 },
  endpointField: { flex: 1, minWidth: 0, fontSize: 13 },
  arrow: { color: COLORS.pink, fontSize: 18 },
  done: { backgroundColor: COLORS.cyan, borderRadius: 15, minHeight: 53, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  disabled: { opacity: 0.42 },
  doneText: { color: COLORS.background, fontSize: 16, fontWeight: '900' },
  cancel: { position: 'absolute', right: 9, top: 7, padding: 7 },
  cancelText: { color: COLORS.muted, fontSize: 28 },
});
