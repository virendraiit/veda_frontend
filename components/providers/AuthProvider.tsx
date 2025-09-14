"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  signup: (email: string, password: string, userType: 'teacher' | 'student', displayName?: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  checkRegistration: (email: string) => Promise<{ isRegistered: boolean; userType?: string }>
  validateAccess: (requiredUserType: 'teacher' | 'student') => Promise<{ hasAccess: boolean; userProfile?: any }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
} 