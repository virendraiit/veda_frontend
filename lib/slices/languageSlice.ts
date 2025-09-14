import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LanguageState {
  currentLanguage: string
  availableLanguages: Array<{
    value: string
    label: string
    flag: string
  }>
}

const initialState: LanguageState = {
  currentLanguage: 'hindi', // Default language
  availableLanguages: [
    { value: "english", label: "English", flag: "🇺🇸" },
    { value: "hindi", label: "हिंदी", flag: "🇮🇳" },
    { value: "marathi", label: "मराठी", flag: "🇮🇳" },
    { value: "gujarati", label: "ગુજરાતી", flag: "🇮🇳" },
    { value: "tamil", label: "தமிழ்", flag: "🇮🇳" },
    { value: "telugu", label: "తెలుగు", flag: "🇮🇳" },
    { value: "bengali", label: "বাংলা", flag: "🇮🇳" },
    { value: "kannada", label: "ಕನ್ನಡ", flag: "🇮🇳" },
    { value: "malayalam", label: "മലയാളം", flag: "🇮🇳" },
    { value: "punjabi", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ]
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedLanguage', action.payload)
      }
    },
    initializeLanguage: (state) => {
      // Load from localStorage on app initialization
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('selectedLanguage')
        if (savedLanguage && state.availableLanguages.some(lang => lang.value === savedLanguage)) {
          state.currentLanguage = savedLanguage
        }
      }
    }
  }
})

export const { setLanguage, initializeLanguage } = languageSlice.actions
export default languageSlice.reducer 