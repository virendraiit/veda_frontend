"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { OverlayLoader } from '@/components/ui/loading'

interface LoadingContextType {
  isLoading: boolean
  loadingText: string
  showLoading: (text?: string) => void
  hideLoading: () => void
  setLoadingText: (text: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: React.ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const showLoading = useCallback((text: string = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingText('Loading...')
  }, [])

  const updateLoadingText = useCallback((text: string) => {
    setLoadingText(text)
  }, [])

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    setLoadingText: updateLoadingText
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <OverlayLoader isVisible={isLoading} text={loadingText} />
    </LoadingContext.Provider>
  )
} 