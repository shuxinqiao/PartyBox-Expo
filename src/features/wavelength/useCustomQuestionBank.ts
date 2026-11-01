import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { type WavelengthQuestion, validQuestion } from './questions';

const STORAGE_KEY = 'partybox.wavelength.customQuestions.v1';
const MAX_QUESTIONS = 100;

export function useCustomQuestionBank() {
  const [questions, setQuestions] = useState<WavelengthQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw || !active) return;
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setQuestions(parsed.filter(validQuestion).slice(0, MAX_QUESTIONS));
      })
      .catch(() => {})
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  const save = useCallback((next: WavelengthQuestion[]) => {
    if (!loaded) return;
    const clean = next.filter(validQuestion).slice(0, MAX_QUESTIONS);
    setQuestions(clean);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clean)).catch(() => {});
  }, [loaded]);

  return { questions, save, loaded };
}
