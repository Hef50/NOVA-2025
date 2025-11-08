import React, { createContext, useContext, useEffect, useState } from 'react'
import { authStorage } from '../utils/authStorage'

interface AuthContextType {
  currentUser: string | null
  isLoggedIn: boolean
  login: (username: string, password: string) => { success: boolean; error?: string }
  register: (username: string, password: string, passwordConfirm: string, email?: string) => { success: boolean; error?: string }
  logout: () => void
  deleteAccount: (username: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    // Initialize test accounts on first load
    authStorage.initializeTestAccounts()
    
    // Load current user
    const user = authStorage.getCurrentUser()
    setCurrentUser(user)
  }, [])

  const login = (username: string, password: string) => {
    const result = authStorage.login(username, password)
    if (result.success) {
      setCurrentUser(username)
    }
    return result
  }

  const register = (username: string, password: string, passwordConfirm: string, email?: string) => {
    if (password !== passwordConfirm) {
      return { success: false, error: 'Passwords do not match' }
    }
    
    const result = authStorage.register(username, password, email)
    if (result.success) {
      // Auto-login after registration
      authStorage.login(username, password)
      setCurrentUser(username)
    }
    return result
  }

  const logout = () => {
    authStorage.logout()
    setCurrentUser(null)
  }

  const deleteAccount = (username: string) => {
    authStorage.deleteAccount(username)
    if (currentUser === username) {
      setCurrentUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: currentUser !== null,
      login,
      register,
      logout,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

