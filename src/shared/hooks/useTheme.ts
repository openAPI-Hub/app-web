import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'openapi-hub-theme'

type Theme = 'light' | 'dark'

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'

    root.classList.toggle('dark', isDark)
    root.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return {
    dark: theme === 'dark',
    toggle: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
  }
}
