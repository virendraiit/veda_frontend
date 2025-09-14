"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, ArrowLeft, UserCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useAuthContext } from "@/components/providers/AuthProvider"

export default function AccessDeniedPage() {
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { user, logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getUserInfo = () => {
    if (!user?.displayName) return { name: 'User', userType: 'student' }
    const parts = user.displayName.split('|')
    return {
      name: parts[0] || 'User',
      userType: parts[1] || 'student'
    }
  }

  const getRedirectPath = () => {
    const { userType } = getUserInfo()
    return userType === "teacher" ? "/teacher/dashboard" : "/student/dashboard"
  }

  const { name, userType } = getUserInfo()

  return (
    <LayoutWrapper
      title="Access Denied"
      subtitle="You don't have permission to access this page"
      showLoginButton={false}
      logoHref="/"
      className="bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-800">
                Access Denied
              </CardTitle>
              <CardDescription className="text-red-700">
                You don't have permission to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">
                      Why am I seeing this page?
                    </h3>
                    <p className="text-red-700 text-sm">
                      This page is restricted to teachers only. Students cannot access teacher-specific features.
                      If you need to perform actions on this page, please ask your teacher to do it for you.
                    </p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <UserCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Your Account Information
                      </h3>
                      <div className="text-blue-700 text-sm space-y-1">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Account Type:</strong> {userType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push(getRedirectPath())}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Your Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  href="/" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
} 