"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { RegistrationStatus } from "@/components/auth/RegistrationStatus"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { ButtonLoader, LoadingSpinner } from "@/components/ui/loading"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { login, signup, loading, error, clearError, isAuthenticated, user, checkRegistration } = useAuthContext()
  
  const [teacherLogin, setTeacherLogin] = useState({ name: "", email: "", password: "" })
  const [studentLogin, setStudentLogin] = useState({ name: "", email: "", password: "" })
  const [teacherUserType, setTeacherUserType] = useState<"teacher" | "student">("teacher")
  const [studentUserType, setStudentUserType] = useState<"teacher" | "student">("student")
  const [isSignup, setIsSignup] = useState(false)
  const [activeTab, setActiveTab] = useState("teacher")
  const [existingUser, setExistingUser] = useState<{ email: string; userType?: string } | null>(null)

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Parse user type from displayName (format: "Name|userType")
      const userType = user?.displayName?.split('|')[1] || 'student'
      if (userType === 'teacher') {
        router.push('/teacher/dashboard')
      } else if (userType === 'student') {
        router.push('/student/dashboard')
      }
    }
  }, [isAuthenticated, user, loading, router])

  // Clear error and existing user when tab changes
  useEffect(() => {
    if (error) {
      clearError()
    }
    setExistingUser(null)
  }, [activeTab])

  const handleTeacherAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const { name, email, password } = teacherLogin
    
    if (isSignup) {
      // Check if user is already registered
      const { isRegistered, userType } = await checkRegistration(email)
      if (isRegistered) {
        // Show registration status component
        setExistingUser({ email, userType })
        return
      }
      
      // Create new teacher account with name and userType in displayName
      const displayName = `${name}|${teacherUserType}`
      const result = await signup(email, password, teacherUserType, displayName)
      if (result.success) {
        router.push("/teacher/dashboard")
      }
    } else {
      // Login existing user
      const result = await login(email, password)
      if (result.success) {
        // Redirect based on user type from displayName
        const userType = result.user?.displayName?.split('|')[1] || 'student'
        if (userType === 'teacher') {
          router.push("/teacher/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      }
    }
  }

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const { name, email, password } = studentLogin
    
    if (isSignup) {
      // Check if user is already registered
      const { isRegistered, userType } = await checkRegistration(email)
      if (isRegistered) {
        // Show registration status component
        setExistingUser({ email, userType })
        return
      }
      
      // Create new student account with name and userType in displayName
      const displayName = `${name}|${studentUserType}`
      const result = await signup(email, password, studentUserType, displayName)
      if (result.success) {
        router.push("/student/dashboard")
      }
    } else {
      // Login existing user
      const result = await login(email, password)
      if (result.success) {
        // Redirect based on user type from displayName
        const userType = result.user?.displayName?.split('|')[1] || 'student'
        if (userType === 'teacher') {
          router.push("/teacher/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      }
    }
  }

  return (
    <LayoutWrapper 
      title={t("appName")}
      subtitle={t("appSubtitle")}
      showLoginButton={false}
      logoHref="/"
      className="bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">

          <Card>
            <CardHeader>
              <CardTitle>{t("welcome")}</CardTitle>
              <CardDescription>{t("loginRequired")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="teacher" className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{t("teacher")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="student" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{t("student")}</span>
                  </TabsTrigger>
                </TabsList>

                              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Existing User Registration Status */}
              {existingUser && (
                <div className="mt-4">
                  <RegistrationStatus
                    email={existingUser.email}
                    userType={existingUser.userType}
                    onSwitchToLogin={() => {
                      setIsSignup(false)
                      setExistingUser(null)
                    }}
                  />
                </div>
              )}

                <TabsContent value="teacher">
                  <form onSubmit={handleTeacherAuth} className="space-y-4">
                    {isSignup && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            value={teacherLogin.name}
                            onChange={(e) => setTeacherLogin({ ...teacherLogin, name: e.target.value })}
                            required={isSignup}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">User Type</label>
                          <Select value={teacherUserType} onValueChange={(value: "teacher" | "student") => setTeacherUserType(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("userEmail")}</label>
                      <Input
                        type="email"
                        placeholder="teacher@school.edu"
                        value={teacherLogin.email}
                        onChange={(e) => setTeacherLogin({ ...teacherLogin, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("password")}</label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={teacherLogin.password}
                        onChange={(e) => setTeacherLogin({ ...teacherLogin, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <ButtonLoader text={t("loading")} />
                      ) : (
                        (isSignup ? t("signUp") : t("login")) + ` ${t("teacher")}`
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="student">
                  <form onSubmit={handleStudentAuth} className="space-y-4">
                    {isSignup && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            value={studentLogin.name}
                            onChange={(e) => setStudentLogin({ ...studentLogin, name: e.target.value })}
                            required={isSignup}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">User Type</label>
                          <Select value={studentUserType} onValueChange={(value: "teacher" | "student") => setStudentUserType(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("userEmail")}</label>
                      <Input
                        type="email"
                        placeholder="student@school.edu"
                        value={studentLogin.email}
                        onChange={(e) => setStudentLogin({ ...studentLogin, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("password")}</label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={studentLogin.password}
                        onChange={(e) => setStudentLogin({ ...studentLogin, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <ButtonLoader text={t("loading")} />
                      ) : (
                        (isSignup ? t("signUp") : t("login")) + ` ${t("student")}`
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Toggle between Login and Signup */}
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-sm"
                >
                  {isSignup ? t("login") : t("signUp")}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-blue-600 hover:underline">
                  {t("back")} {t("home")}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>
                <strong>{t("teacher")}:</strong> teacher@demo.com / password123
              </div>
              <div>
                <strong>{t("student")}:</strong> student@demo.com / password123
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </LayoutWrapper>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
