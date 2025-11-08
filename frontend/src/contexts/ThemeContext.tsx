import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load theme from localStorage, sessionStorage, or default to light
    const savedTheme = localStorage.getItem('vacai_theme') || sessionStorage.getItem('vacai_theme')
    
    // Also check system preference as fallback
    if (!savedTheme && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    
    return (savedTheme as Theme) || 'light'
  })

  useEffect(() => {
    // Apply theme to document with smooth transition
    const root = document.documentElement
    
    // Add transition class for smooth theme switching
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('vacai_theme', theme)
    
    // Also save to sessionStorage for immediate persistence
    sessionStorage.setItem('vacai_theme', theme)
    
    // Remove transition after theme change completes
    setTimeout(() => {
      root.style.transition = ''
    }, 300)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

