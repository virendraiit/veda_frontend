"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, UserCheck } from 'lucide-react'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { useLanguage } from '@/lib/hooks/useLanguage'

interface RegistrationStatusProps {
  email: string
  userType?: string
  onSwitchToLogin: () => void
}

export const RegistrationStatus: React.FC<RegistrationStatusProps> = ({
  email,
  userType,
  onSwitchToLogin
}) => {
  const { t } = useLanguage()

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-green-600" />
          <CardTitle className="text-green-800">User Already Registered</CardTitle>
        </div>
        <CardDescription className="text-green-700">
          This email is already registered in our system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">
            Email: <strong>{email}</strong>
          </span>
        </div>
        
        {userType && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-blue-500 text-blue-600">
              {userType === 'teacher' ? 'Teacher' : 'Student'}
            </Badge>
            <span className="text-sm text-green-700">
              Account Type: <strong>{userType}</strong>
            </span>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            onClick={onSwitchToLogin} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Switch to Login
          </Button>
        </div>
        
        <p className="text-xs text-green-600 text-center">
          If you forgot your password, you can reset it from the login page.
        </p>
      </CardContent>
    </Card>
  )
} 