
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export interface Language {
  code: string;
  name: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'zh', name: '中文 (Chinese)' },
];

interface LanguageContextType {
  selectedLanguage: string; // Language code, e.g., 'en', 'es'
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
  getLanguageName: (code: string) => string | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(supportedLanguages[0].code); // Default to English

  const getLanguageName = (code: string): string | undefined => {
    return supportedLanguages.find(lang => lang.code === code)?.name;
  };

  const contextValue = useMemo(() => ({
    selectedLanguage,
    setSelectedLanguage,
    getLanguageName,
  }), [selectedLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
