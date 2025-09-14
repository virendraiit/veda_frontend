"use client"

import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks/redux'
import { initializeLanguage } from '@/lib/slices/languageSlice'

export function LanguageInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeLanguage())
  }, [dispatch])

  return null // This component doesn't render anything
} 