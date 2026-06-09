'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang, translations, Translations } from '@/lib/i18n'

interface LangContextValue {
  lang: Lang
  t: Translations
  toggle: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  t: translations.fr,
  toggle: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'fr' || stored === 'en') setLang(stored)
  }, [])

  function toggle() {
    const next: Lang = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
