"use client"

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/hooks/useLanguage"
import {
  FileText,
  HelpCircle,
  PenTool,
  Mic,
  Gamepad2,
  Users,
  Sparkles,
  ImageIcon,
  Music,
  Dumbbell,
  Award,
  BookOpen,
  GraduationCap,
  User,
  BarChart3,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import Image from "next/image"
import { VideoSlider } from "@/components/video-slider"
import { useToast } from "@/hooks/use-toast"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useAuthContext } from "@/components/providers/AuthProvider"

export default function HomePage() {
  const { t, currentLanguage } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user, loading } = useAuthContext()
  const [isLogin, setLoggedIn] = useState(false)

  // Video slider data
  const videoSlides = [
    {
      id: 1,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/StoryTelling.mp4", // Replace with your actual video URL
      title: "Dynamic Storytelling AI Agent",
      subtitle: "Engaging Learning Experiences",
      description: "Generate engaging stories with TTS narration, cartoon visuals, and automated comprehension tests for interactive learning.",
      ctaText: "Explore Stories",
      ctaLink: "/storytelling",
      overlayColor: "from-purple-900/70 via-purple-800/50 to-transparent"
    },
    {
      id: 2,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/ECI%202.mp4",
      title: "AI Educational Ecosystem",
      subtitle: "For Teachers & Students",
      description: "AI-Powered Educational Ecosystem for Modern Learning",
      ctaText: "Get Started",
      ctaLink: "/auth/login",
      overlayColor: "from-blue-900/70 via-blue-800/50 to-transparent"
    },
    {
      id: 4,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Football%202.mp4", // Replace with your actual video URL
      title: "Vertex AI Powered Sports & Music Programs",
      subtitle: "AI-Powered Training",
      description: "Specialized programs for sports technique analysis and music learning with AI feedback and personalized recommendations.",
      ctaText: "Learn More",
      ctaLink: "/sports-program",
      overlayColor: "from-green-900/70 via-green-800/50 to-transparent"
    },
    {
      id: 3,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Games.mp4",
      title: "Game Creation Agent",
      subtitle: "AI-Powered Training",
      description: "Create interactive educational games with AI assistance for engaging student learning experiences.",
      ctaText: "Create Games",
      ctaLink: "/teacher/game-creator",
      overlayColor: "from-orange-900/70 via-orange-800/50 to-transparent"
    },
    {
      id: 4,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Music.mp4",
      title: "AI Based Music Learning",
      subtitle: "AI-Powered Training",
      description: "Specialized programs for music technique analysis and learning with AI feedback and personalized recommendations.",
      ctaText: "Learn More",
      ctaLink: "/teacher/music-program",
      overlayColor: "from-cyan-900/70 via-cyan-800/50 to-transparent"
    },
    {
      id: 5,
      videoUrl: "https://storage.googleapis.com/angel-ai-chatbot/Agentic%20AI%20Day%20Videos/Q%26A.mp4",
      title: "AI Based Q&A",
      subtitle: "Intelligent Knowledge Base",
      description: "AI-powered question answering system with comprehensive knowledge base and interactive learning support.",
      ctaText: "Explore Q&A",
      ctaLink: "/teacher/knowledge-base",
      overlayColor: "from-indigo-900/70 via-indigo-800/50 to-transparent"
    }
    // {
    //   id: 7,
    //   videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", // Replace with your actual video URL
    //   title: "Vertex AI Powered Sports & Music Programs",
    //   subtitle: "AI-Powered Training",
    //   description: "Specialized programs for sports technique analysis and music learning with AI feedback and personalized recommendations.",
    //   ctaText: "Learn More",
    //   ctaLink: "/sports-program",
    //   overlayColor: "from-green-900/70 via-green-800/50 to-transparent"
    // }
  ]

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    if (isAuthenticated && !loading) {
      // Parse user type from displayName (format: "Name|userType")
      const userType = user?.displayName?.split('|')[1] || 'student'
      if (userType === 'teacher') {
        router.push('/teacher/dashboard')
      } else if (userType === 'student') {
        router.push('/student/dashboard')
      }
    }
    
    // Update login status for UI
    setLoggedIn(!!isAuthenticated)
  }, [isAuthenticated, user, loading, router])

  const handleFeatureClick = (featureHref: string, featureTitle: string) => {
    // Check if user is authenticated
    if (isAuthenticated) {
      // User is logged in, navigate to feature page
      console.log("Navigating to:", `${featureHref}?lang=${currentLanguage}`)
      router.push(`${featureHref}?lang=${currentLanguage}`)
    } else {
      // User is not logged in, show toast and redirect to login page
      console.log("User not logged in, redirecting to login")
      toast({
        title: t("loginRequired"),
        description: `${t("loginRequired")} ${featureTitle}`,
        variant: "destructive",
      })
      router.push("/auth/login")
    }
  }


  const features = [
    {
      title: t("dynamicStorytelling"),
      description: t("dynamicStorytellingDesc"),
      icon: BookOpen,
      href: "/teacher/storytelling",
      color: "bg-blue-500",
      badge: t("aiStoriesAudio"),
    },
    {
      title: t("gradeBasedContent"),
      description: t("gradeBasedContentDesc"),
      icon: FileText,
      href: "/content-customization",
      color: "bg-green-500",
      badge: t("multiGrade"),
    },
    {
      title: t("intelligentQnA"),
      description: t("intelligentQnADesc"),
      icon: HelpCircle,
      href: "/knowledge-base",
      color: "bg-purple-500",
      badge: t("qnaAudio"),
    },
    {
      title: t("visualAidDesign"),
      description: t("visualAidDesignDesc"),
      icon: PenTool,
      href: "/visual-aids",
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
      title: t("modelTestPaper"),
      description: t("modelTestPaperDesc"),
      icon: Award,
      href: "/test-generator",
      color: "bg-indigo-500",
      badge: t("testAI"),
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
    <LayoutWrapper>
      {/* Hero Section with Video Slider */}
      {/* <section className="py-8 px-4"> */}
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
      {/* </section> */}

      {/* Features Badges Section */}
      {/* <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              AI Storytelling + Audio
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              Teacher & Student Dashboards
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Analytics
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              <Dumbbell className="w-4 h-4 mr-2" />
              Sports & Music Programs
            </Badge>
            <Badge className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Gemini 2.0 Flash + Audio AI
            </Badge>
          </div>
        </div>
      </section> */}

      {/* Features Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t("completeTeachingTools")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={index} 
                  onClick={() => handleFeatureClick(feature.href, feature.title)}
                  className="cursor-pointer"
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${isLogin ? 'hover:border-blue-200' : 'hover:border-red-200'} ${!isLogin ? 'opacity-80' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                          {isLogin ? (
                            <span>{feature.badge}</span>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>{t("loginRequired")}</span>
                            </>
                          )}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm leading-tight">
                        <div className="font-bold text-gray-900">{feature.title}</div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">{t("platformHighlights")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t("dynamicStorytelling")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {t("dynamicStorytellingDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{t("dualDashboards")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {t("dualDashboardsDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{t("sportsMusicAI")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {t("sportsMusicAIDesc")}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{t("smartAnalytics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {t("smartAnalyticsDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  )
}
