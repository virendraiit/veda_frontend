"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  PenTool,
  Gamepad2,
  Music,
  Dumbbell,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ImageIcon,
  Mic,
  HelpCircle,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { VideoSlider } from "@/components/video-slider"
import { LoadingSpinner, RefreshButton } from "@/components/ui/loading"

export default function TeacherDashboard() {
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { logout, user } = useAuthContext()

  // Get user name from displayName
  const getUserName = () => {
    if (!user?.displayName) return "Teacher"
    const parts = user.displayName.split('|')
    return parts[0] || "Teacher"
  }

  // Video slider data for teacher dashboard
  const videoSlides = [
    {
      id: 1,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/StoryTelling.mp4",
      title: "Dynamic Storytelling AI Agent",
      subtitle: "Engaging Learning Experiences",
      description: "Generate engaging stories with TTS narration, cartoon visuals, and automated comprehension tests for interactive learning.",
      ctaText: "Explore Stories",
      ctaLink: "/teacher/storytelling",
      overlayColor: "from-purple-900/70 via-purple-800/50 to-transparent"
    },
    {
      id: 2,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/ECI%202.mp4",
      title: "AI Educational Ecosystem",
      subtitle: "For Teachers & Students",
      description: "AI-Powered Educational Ecosystem for Modern Learning",
      ctaText: "Get Started",
      ctaLink: "/teacher/dashboard",
      overlayColor: "from-blue-900/70 via-blue-800/50 to-transparent"
    },
    {
      id: 3,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Football%202.mp4",
      title: "Vertex AI Powered Sports & Music Programs",
      subtitle: "AI-Powered Training",
      description: "Specialized programs for sports technique analysis and music learning with AI feedback and personalized recommendations.",
      ctaText: "Learn More",
      ctaLink: "/teacher/sports-program",
      overlayColor: "from-green-900/70 via-green-800/50 to-transparent"
    },
    {
      id: 4,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Games.mp4",
      title: "Game Creation Agent",
      subtitle: "AI-Powered Training",
      description: "Create interactive educational games with AI assistance for engaging student learning experiences.",
      ctaText: "Create Games",
      ctaLink: "/teacher/game-creator",
      overlayColor: "from-orange-900/70 via-orange-800/50 to-transparent"
    },
    {
      id: 5,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Music.mp4",
      title: "AI Based Music Learning",
      subtitle: "AI-Powered Training",
      description: "Specialized programs for music technique analysis and learning with AI feedback and personalized recommendations.",
      ctaText: "Learn More",
      ctaLink: "/teacher/music-program",
      overlayColor: "from-cyan-900/70 via-cyan-800/50 to-transparent"
    },
    {
      id: 6,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Q%26A.mp4",
      title: "AI Based Q&A",
      subtitle: "Intelligent Knowledge Base",
      description: "AI-powered question answering system with comprehensive knowledge base and interactive learning support.",
      ctaText: "Explore Q&A",
      ctaLink: "/teacher/knowledge-base",
      overlayColor: "from-indigo-900/70 via-indigo-800/50 to-transparent"
    }
  ]

  const [teacherData, setTeacherData] = useState({
    name: "Dr. Priya Sharma",
    email: "teacher@demo.com",
    subjects: ["Mathematics", "Science", "English"],
    classes: ["Grade 6", "Grade 7", "Grade 8"],
    totalStudents: 120,
    activeClasses: 8,
    completedLessons: 45,
    upcomingTests: 3,
  })

  const [classPerformance, setClassPerformance] = useState([
    { class: "Grade 6", students: 40, avgScore: 78, improvement: "+5%" },
    { class: "Grade 7", students: 45, avgScore: 82, improvement: "+3%" },
    { class: "Grade 8", students: 35, avgScore: 85, improvement: "+7%" },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { type: "lesson", title: "Created lesson plan for Algebra", time: "2 hours ago" },
    { type: "test", title: "Generated test for Grade 7 Science", time: "4 hours ago" },
    { type: "story", title: "Created story about Water Cycle", time: "1 day ago" },
    { type: "game", title: "Generated math puzzle for Grade 6", time: "2 days ago" },
  ])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const teachingTools = [
    {
      title: t("dynamicStorytelling"),
      description: t("dynamicStorytellingDesc"),
      icon: BookOpen,
      href: "/teacher/storytelling",
      color: "bg-blue-500",
      badge: t("aiStoriesAudio"),
    },
    {
      title: "Content Customization",
      description: "Create personalized lesson plans and educational content for your students",
      icon: FileText,
      href: "/teacher/content-customization",
      color: "bg-green-500",
      badge: "AI-Powered",
    },
    {
      title: "Material Generator",
      description: "Generate comprehensive educational materials with detailed lesson plans and resources",
      icon: GraduationCap,
      href: "/teacher/material-generator",
      color: "bg-purple-500",
      badge: "AI-Powered",
    },
    {
      title: t("intelligentQnA"),
      description: t("intelligentQnADesc"),
      icon: HelpCircle,
      href: "/teacher/knowledge-base",
      color: "bg-indigo-500",
      badge: t("qnaAudio"),
    },
    {
      title: t("visualAidDesign"),
      description: t("visualAidDesignDesc"),
      icon: PenTool,
      href: "/teacher/visual-aids",
      color: "bg-orange-500",
      badge: t("visualAudio"),
    },
    {
      title: t("gameCreation"),
      description: t("gameCreationDesc"),
      icon: Gamepad2,
      href: "/teacher/game-creator",
      color: "bg-yellow-500",
      badge: t("gameAI"),
    },
    {
      title: "Question Paper Generator",
      description: "Generate comprehensive question papers with MCQ, short, medium, and long answer questions",
      icon: FileText,
      href: "/teacher/question-paper-generator",
      color: "bg-blue-600",
      badge: "AI-Powered",
    },
    {
      title: t("englishCommunication"),
      description: t("englishCommunicationDesc"),
      icon: Mic,
      href: "/teacher/english-improvement",
      color: "bg-red-500",
      badge: t("audioAI"),
    },
    {
      title: t("sportsProgram"),
      description: t("sportsProgramDesc"),
      icon: Dumbbell,
      href: "/teacher/sports-program",
      color: "bg-teal-500",
      badge: t("sportsAI"),
    },
    {
      title: t("musicLearning"),
      description: t("musicLearningDesc"),
      icon: Music,
      href: "/teacher/music-program",
      color: "bg-cyan-500",
      badge: t("musicAI"),
    },
    {
      title: t("performanceAnalytics"),
      description: t("performanceAnalyticsDesc"),
      icon: BarChart3,
      href: "/analytics",
      color: "bg-emerald-500",
      badge: t("analytics"),
    },
  ]

  return (
    <ProtectedRoute userType="teacher">
      <LayoutWrapper
        title={t("appName")}
        subtitle={t("dashboard")}
        showLoginButton={true}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        {/* Video Carousel Section - Full Width */}
        <div className="mx-auto">
          <VideoSlider
            videos={videoSlides}
            autoPlay={true}
            autoPlayInterval={8000}
            showControls={true}
            showIndicators={true}
            className="overflow-hidden shadow-2xl"
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("welcome")} {getUserName()}!</h2>
            <p className="text-gray-600">
              {t("dashboard")} - {t("completeTeachingTools")}
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{teacherData.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{teacherData.activeClasses}</div>
                <div className="text-sm text-gray-600">Active Classes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{teacherData.completedLessons}</div>
                <div className="text-sm text-gray-600">Lessons Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{teacherData.upcomingTests}</div>
                <div className="text-sm text-gray-600">Upcoming Tests</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Class Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
                <CardDescription>Track your students' progress across different grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classPerformance.map((classData, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{classData.class}</h3>
                          <p className="text-sm text-gray-600">{classData.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{classData.avgScore}%</span>
                          <Badge variant="outline" className="text-green-600">
                            {classData.improvement}
                          </Badge>
                        </div>
                        <Progress value={classData.avgScore} className="w-24 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest teaching activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === "lesson" && <BookOpen className="w-4 h-4 text-blue-600" />}
                        {activity.type === "test" && <Award className="w-4 h-4 text-green-600" />}
                        {activity.type === "story" && <FileText className="w-4 h-4 text-purple-600" />}
                        {activity.type === "game" && <Gamepad2 className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teaching Tools */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("completeTeachingTools")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachingTools.map((tool, index) => {
                const IconComponent = tool.icon
                return (
                  <Link key={index} href={`${tool.href}?lang=${currentLanguage}`}>
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
