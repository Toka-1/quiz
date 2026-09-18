"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dictionaries,
  type Dictionary,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "quizapp.locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dict: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "mn") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      setLocale,
      dict,
      t: (key) => dict[key] ?? dictionaries.en[key] ?? key,
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
