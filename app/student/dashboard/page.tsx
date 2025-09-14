"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  TrendingUp,
  Award,
  Music,
  Dumbbell,
  MessageSquare,
  Gamepad2,
  Mic,
  Settings,
  LogOut,
  Sparkles,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useLanguage } from "@/lib/hooks/useLanguage"

export default function StudentDashboard() {
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { logout, user } = useAuthContext()

  // Get user name from displayName
  const getUserName = () => {
    if (!user?.displayName) return "Student"
    const parts = user.displayName.split('|')
    return parts[0] || "Student"
  }

  const [studentData, setStudentData] = useState({
    name: "Arjun Patel",
    email: "student@demo.com",
    grade: "Grade 7",
    rollNumber: "2024-07-015",
    overallScore: 78,
    rank: 12,
    totalStudents: 45,
    completedLessons: 32,
    pendingAssignments: 5,
  })

  const [subjectPerformance, setSubjectPerformance] = useState([
    { subject: "Mathematics", score: 85, progress: 85, improvement: "+8%", color: "bg-blue-500" },
    { subject: "Science", score: 78, progress: 78, improvement: "+5%", color: "bg-green-500" },
    { subject: "English", score: 82, progress: 82, improvement: "+12%", color: "bg-purple-500" },
    { subject: "Social Studies", score: 75, progress: 75, improvement: "+3%", color: "bg-orange-500" },
    { subject: "Hindi", score: 88, progress: 88, improvement: "+6%", color: "bg-red-500" },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { type: "test", title: "Completed Mathematics Test - Chapter 5", score: 85, time: "2 hours ago" },
    { type: "lesson", title: "Watched Science lesson on Water Cycle", time: "1 day ago" },
    { type: "game", title: "Played English vocabulary game", score: 92, time: "2 days ago" },
    { type: "assignment", title: "Submitted Hindi essay assignment", time: "3 days ago" },
  ])

  const [recommendations, setRecommendations] = useState([
    {
      type: "improvement",
      subject: "Science",
      title: "Focus on Chemical Reactions",
      description: "Practice more problems on balancing equations",
      priority: "high",
    },
    {
      type: "strength",
      subject: "Mathematics",
      title: "Excellent in Algebra",
      description: "Continue practicing advanced problems",
      priority: "medium",
    },
    {
      type: "practice",
      subject: "English",
      title: "Improve Pronunciation",
      description: "Use AI pronunciation tool daily",
      priority: "medium",
    },
  ])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const learningTools = [
    {
      title: "Interactive Stories",
      description: "Listen to AI-generated stories with visuals and comprehension tests",
      icon: BookOpen,
      href: "/student/stories",
      color: "bg-blue-500",
      badge: "Stories",
    },
    {
      title: "Game Generator",
      description: "Create and play educational games with AI assistance",
      icon: Gamepad2,
      href: "/student/game-generator",
      color: "bg-yellow-500",
      badge: "Games",
    },
    {
      title: "English Communication Improvement",
      description: "Improve pronunciation and grammar with AI feedback",
      icon: Mic,
      href: "/student/english-improvement",
      color: "bg-red-500",
      badge: "Audio AI",
    },
    {
      title: "Story Telling Agent",
      description: "Generate engaging stories with TTS narration and visuals",
      icon: BookOpen,
      href: "/student/storytelling",
      color: "bg-purple-500",
      badge: "Stories",
    },
  ]

  return (
    <ProtectedRoute userType="student">
      <LayoutWrapper 
        title="Veda-Shikshak Sahachar"
        subtitle="Student Dashboard"
        showLoginButton={true}
        logoHref={`/student/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {getUserName()}!</h2>
          <p className="text-gray-600">
            Continue your learning journey with AI-powered tools and personalized recommendations.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <Badge variant="outline">{studentData.grade}</Badge>
            <Badge variant="outline">Roll No: {studentData.rollNumber}</Badge>
            <Badge variant="outline">
              Rank: {studentData.rank}/{studentData.totalStudents}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{studentData.overallScore}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">#{studentData.rank}</div>
              <div className="text-sm text-gray-600">Class Rank</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{studentData.completedLessons}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{studentData.pendingAssignments}</div>
              <div className="text-sm text-gray-600">Pending Tasks</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Your progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{subject.subject}</h3>
                        <p className="text-sm text-gray-600">Current Score: {subject.score}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-600">
                          {subject.improvement}
                        </Badge>
                      </div>
                      <Progress value={subject.progress} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Personalized suggestions for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          rec.type === "improvement" ? "destructive" : rec.type === "strength" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {rec.type === "improvement" ? "Focus Area" : rec.type === "strength" ? "Strength" : "Practice"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.subject}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest learning activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {activity.type === "test" && <Award className="w-4 h-4 text-green-600" />}
                    {activity.type === "lesson" && <BookOpen className="w-4 h-4 text-blue-600" />}
                    {activity.type === "game" && <Gamepad2 className="w-4 h-4 text-yellow-600" />}
                    {activity.type === "assignment" && <CheckCircle className="w-4 h-4 text-purple-600" />}
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                  {activity.score && (
                    <Badge variant="outline" className="text-xs">
                      Score: {activity.score}%
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Tools */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Learning Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningTools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Link key={index} href={tool.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tool.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm leading-tight">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs leading-relaxed">{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
