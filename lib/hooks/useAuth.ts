import { useState, useEffect, useCallback } from 'react'
import { User } from 'firebase/auth'
import { 
  onAuthStateChange, 
  signInUser, 
  signUpUser, 
  signOutUser,
  getUserProfile,
  validateUserAccess,
  checkUserRegistration,
  setAuthCookies,
  clearAuthCookies,
  type UserProfile
} from '@/lib/firebase'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Get user profile when user is authenticated
        const userProfile = await getUserProfile(user.uid)
        
        // Set cookies for middleware
        if (userProfile && typeof window !== 'undefined') {
          setAuthCookies(user, userProfile)
        }
        
        setAuthState({
          user,
          userProfile,
          loading: false,
          error: null
        })
      } else {
        // Clear cookies when user is not authenticated
        if (typeof window !== 'undefined') {
          clearAuthCookies()
        }
        
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
          error: null
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    console.log('Starting login process for:', email)
    
    const { user, error } = await signInUser(email, password)
    
    if (error) {
      console.error('Login failed:', error)
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: getErrorMessage(error.code) 
      }))
      return { success: false, error: getErrorMessage(error.code) }
    }

    if (user) {
      console.log('Login successful, user:', user.email)
      
      // Get user profile from Firestore if available
      let userProfile = null
      try {
        userProfile = await getUserProfile(user.uid)
      } catch (profileError) {
        console.log('Could not fetch user profile, continuing with Firebase Auth user:', profileError)
      }
      
      // Store userType in localStorage for backward compatibility
      if (typeof window !== 'undefined') {
        // Parse userType from displayName
        const userType = user.displayName?.split('|')[1] || 'student'
        window.localStorage.setItem('userType', userType)
        window.localStorage.setItem('userEmail', user.email || '')
        
        // Set cookies for middleware if userProfile exists
        if (userProfile) {
          setAuthCookies(user, userProfile)
        }
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        userProfile,
        loading: false, 
        error: null 
      }))
    }
    
    return { success: true, user }
  }, [])

  const signup = useCallback(async (email: string, password: string, userType: 'teacher' | 'student', displayName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    console.log('Starting signup process for:', email, 'userType:', userType)
    
    const { user, error } = await signUpUser(email, password, userType, displayName)
    
    if (error) {
      console.error('Signup failed:', error)
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: getErrorMessage(error.code) 
      }))
      return { success: false, error: getErrorMessage(error.code) }
    }

    if (user) {
      console.log('Signup successful, user:', user.email)
      
      // Get user profile from Firestore if available
      let userProfile = null
      try {
        userProfile = await getUserProfile(user.uid)
      } catch (profileError) {
        console.log('Could not fetch user profile, continuing with Firebase Auth user:', profileError)
      }
      
      // Store userType in localStorage for backward compatibility
      if (typeof window !== 'undefined') {
        // Parse userType from displayName
        const userType = user.displayName?.split('|')[1] || 'student'
        window.localStorage.setItem('userType', userType)
        window.localStorage.setItem('userEmail', user.email || '')
        
        // Set cookies for middleware if userProfile exists
        if (userProfile) {
          setAuthCookies(user, userProfile)
        }
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        userProfile,
        loading: false, 
        error: null 
      }))
    }
    
    return { success: true, user }
  }, [])

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    const { error } = await signOutUser()
    
    if (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: getErrorMessage(error.code) 
      }))
      return { success: false, error: getErrorMessage(error.code) }
    }

    // Clear localStorage and cookies
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userType')
      window.localStorage.removeItem('userEmail')
      clearAuthCookies()
    }

    setAuthState({
      user: null,
      userProfile: null,
      loading: false,
      error: null
    })
    
    return { success: true }
  }, [])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  const checkRegistration = useCallback(async (email: string) => {
    return await checkUserRegistration(email)
  }, [])

  const validateAccess = useCallback(async (requiredUserType: 'teacher' | 'student') => {
    if (!authState.user) return { hasAccess: false }
    return await validateUserAccess(authState.user.uid, requiredUserType)
  }, [authState.user])

  return {
    user: authState.user,
    userProfile: authState.userProfile,
    loading: authState.loading,
    error: authState.error,
    login,
    signup,
    logout,
    clearError,
    checkRegistration,
    validateAccess,
    isAuthenticated: !!authState.user
  }
}

// Helper function to convert Firebase error codes to user-friendly messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection'
    default:
      return 'An error occurred. Please try again'
  }
} 