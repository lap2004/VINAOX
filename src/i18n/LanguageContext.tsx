import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { en } from './en';
import { vi } from './vi';
import { ko } from './ko';
import { zhCN } from './zhCN';
import {
  Language,
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
  pickLocale,
  type LanguageOption,
  type LocaleVariants,
} from './localize';

export { SUPPORTED_LANGUAGES, normalizeLanguage, pickLocale };
export type { Language, LanguageOption, LocaleVariants };
export type TranslationDict = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  tRaw: <T = unknown>(path: string, fallback?: T) => T;
  pick: <T>(variants: LocaleVariants<T>) => T;
  content: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARIES: Record<Language, TranslationDict> = {
  vi,
  en,
  ko,
  'zh-CN': zhCN,
};

function ensureCjkFontStylesheet(lang: Language): void {
  if (typeof document === 'undefined') return;
  if (lang === 'ko' && !document.getElementById('vinaxo-cjk-font-ko')) {
    const link = document.createElement('link');
    link.id = 'vinaxo-cjk-font-ko';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
  if (lang === 'zh-CN' && !document.getElementById('vinaxo-cjk-font-zh')) {
    const link = document.createElement('link');
    link.id = 'vinaxo-cjk-font-zh';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
}

// Helper to get nested value by dot notation "nav.home"
export function resolvePath(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = normalizeLanguage(urlParams.get('lang'));
      if (urlLang) {
        return urlLang;
      }
      const savedLang = normalizeLanguage(localStorage.getItem('vinaxo_lang'));
      if (savedLang) {
        return savedLang;
      }
    }
    return 'vi';
  });

  const content = useMemo(() => DICTIONARIES[language] || vi, [language]);

  const setLanguage = (lang: Language) => {
    const normalized = normalizeLanguage(lang) || 'vi';
    setLanguageState(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vinaxo_lang', normalized);
      document.documentElement.lang = normalized;
      ensureCjkFontStylesheet(normalized);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    ensureCjkFontStylesheet(language);
  }, [language]);

  const t = (path: string, fallback?: string): string => {
    const val = resolvePath(content, path);
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (fallback !== undefined) return fallback;
    return path;
  };

  const tRaw = <T = unknown>(path: string, fallback?: T): T => {
    const val = resolvePath(content, path);
    if (val !== undefined && val !== null) return val as T;
    return fallback as T;
  };

  const pick = <T,>(variants: LocaleVariants<T>): T => pickLocale(language, variants);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw, pick, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
