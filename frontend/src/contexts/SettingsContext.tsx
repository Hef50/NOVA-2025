import React, { createContext, useContext, useEffect, useState } from 'react'

export interface Settings {
  notifications: boolean
  emailUpdates: boolean
  currency: string
  language: string
  distanceUnit: 'km' | 'miles'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  notifications: true,
  emailUpdates: false,
  currency: 'USD',
  language: 'English',
  distanceUnit: 'km'
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('vacai_settings')
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem('vacai_settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

