import { useAppSelector, useAppDispatch } from './redux'
import { setLanguage } from '../slices/languageSlice'
import { translations, Translations } from '../translations'

export const useLanguage = () => {
  const dispatch = useAppDispatch()
  const { currentLanguage, availableLanguages } = useAppSelector((state) => state.language)

  const t = (key: keyof Translations): string => {
    const translation = translations[currentLanguage]
    if (!translation) {
      // Fallback to English if translation not found
      const englishTranslation = translations.english
      return englishTranslation[key] || key
    }
    return translation[key] || key
  }

  const changeLanguage = (language: string) => {
    dispatch(setLanguage(language))
  }

  const getCurrentLanguage = () => currentLanguage

  const getAvailableLanguages = () => availableLanguages

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    currentLanguage,
    availableLanguages
  }
} 