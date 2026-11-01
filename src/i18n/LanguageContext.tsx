import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type Language, type TranslationKey, messages } from './messages';

const STORAGE_KEY = 'partybox.language';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function systemLanguage(): Language {
  return getLocales()[0]?.languageCode === 'zh' ? 'zh' : 'en';
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setCurrentLanguage] = useState<Language>(systemLanguage);
  const manuallyChanged = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (active && !manuallyChanged.current && (saved === 'zh' || saved === 'en')) {
          setCurrentLanguage(saved);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((next: Language) => {
    manuallyChanged.current = true;
    setCurrentLanguage(next);
    void AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t: (key) => messages[language][key] }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be inside LanguageProvider');
  return value;
}
