import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en, TranslationKeys } from './en';
import { hi } from './hi';

type Lang = 'en' | 'hi';
interface LocaleCtx {
  lang: Lang;
  t: TranslationKeys;
  setLang: (l: Lang) => void;
}

const LocaleContext = createContext<LocaleCtx>({ lang: 'en', t: en, setLang: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = lang === 'hi' ? hi : en;
  return <LocaleContext.Provider value={{ lang, t, setLang }}>{children}</LocaleContext.Provider>;
}

export function useLocale() { return useContext(LocaleContext); }
