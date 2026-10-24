import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { en } from './en';
import { vi } from './vi';

export type Language = 'vi' | 'en';
export type TranslationDict = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  tRaw: <T = unknown>(path: string, fallback?: T) => T;
  content: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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
    // Check URL param first
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'vi' || urlLang === 'en') {
        return urlLang;
      }
      const savedLang = localStorage.getItem('vinaxo_lang');
      if (savedLang === 'vi' || savedLang === 'en') {
        return savedLang;
      }
    }
    return 'vi';
  });

  const content = useMemo(() => (language === 'vi' ? vi : en), [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vinaxo_lang', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw, content }}>
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
