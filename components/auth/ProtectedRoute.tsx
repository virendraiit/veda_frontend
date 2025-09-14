"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { PageLoader } from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  userType?: 'teacher' | 'student'
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  userType,
  fallback
}) => {
  const { user, loading, isAuthenticated } = useAuthContext()
  const router = useRouter()
  const [accessValidated, setAccessValidated] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const validateUserAccess = async () => {
      if (!loading) {
        if (!isAuthenticated) {
          // User is not authenticated, redirect to home
          router.push('/')
          return
        }

        // Parse user type from displayName (format: "Name|userType")
        const currentUserType = user?.displayName?.split('|')[1] || 'student'

        // If userType is specified, validate user access
        if (userType) {
          const hasAccess = currentUserType === userType
          setHasAccess(hasAccess)
          setAccessValidated(true)
          
          if (!hasAccess) {
            // User doesn't have access, redirect to access denied page
            router.push('/access-denied')
            return
          }
        } else {
          // No specific userType required, just need to be authenticated
          setHasAccess(true)
          setAccessValidated(true)
        }
      }
    }

    validateUserAccess()
  }, [loading, isAuthenticated, user, userType, router])

  // Show loading while checking authentication and access
  if (loading || !accessValidated) {
    return <PageLoader text="Checking access..." />
  }

  // If user doesn't have access, show fallback or nothing (will redirect)
  if (!hasAccess) {
    return fallback || null
  }

  // User is authenticated and has access
  return <>{children}</>
} 