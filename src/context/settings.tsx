import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LANGS, translate, type Lang, type TKey } from '../i18n'

export type Theme = 'emerald' | 'white' | 'black'
export const THEMES: Theme[] = ['emerald', 'white', 'black']

export type TextSize = 'normal' | 'large'

interface Settings {
  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  textSize: TextSize
  toggleTextSize: () => void
  t: (key: TKey) => string
  dir: 'ltr' | 'rtl'
}

const Ctx = createContext<Settings | null>(null)

function stored<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T) || fallback
  } catch {
    return fallback
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => stored('albaqaa.lang', 'en' as Lang))
  const [theme, setThemeState] = useState<Theme>(() => stored('albaqaa.theme', 'emerald' as Theme))
  const [textSize, setTextSizeState] = useState<TextSize>(() => stored('albaqaa.textSize', 'normal' as TextSize))

  const dir = useMemo(() => LANGS.find((l) => l.code === lang)?.dir ?? 'ltr', [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.textsize = textSize
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [theme, lang, dir, textSize])

  const value: Settings = {
    lang,
    theme,
    textSize,
    toggleTextSize: () => {
      const next: TextSize = textSize === 'normal' ? 'large' : 'normal'
      setTextSizeState(next)
      try { localStorage.setItem('albaqaa.textSize', next) } catch { /* ignore */ }
    },
    dir,
    setLang: (l) => {
      setLangState(l)
      try { localStorage.setItem('albaqaa.lang', l) } catch { /* ignore */ }
    },
    setTheme: (th) => {
      setThemeState(th)
      try { localStorage.setItem('albaqaa.theme', th) } catch { /* ignore */ }
    },
    t: (key) => translate(lang, key),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSettings(): Settings {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings outside SettingsProvider')
  return ctx
}
