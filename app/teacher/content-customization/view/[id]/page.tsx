"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Image as ImageIcon,
  Download,
  ExternalLink,
  BookOpen,
  Target,
  Clock,
  Users,
  Award,
  Loader2
} from "lucide-react"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { LoadingSpinner } from "@/components/ui/loading"
import { getCustomContentById, type CustomContentRecord } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"

export default function ViewCustomContent() {
  const params = useParams()
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuthContext()

  const [content, setContent] = useState<CustomContentRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [parsedLessonPlan, setParsedLessonPlan] = useState<any>(null)
  const [rawLessonPlan, setRawLessonPlan] = useState<string>("")

  const contentId = params.id as string

  useEffect(() => {
    if (contentId) {
      loadContent()
    }
  }, [contentId])

  const loadContent = async () => {
    if (!contentId) return

    setIsLoading(true)
    try {
      const contentData = await getCustomContentById(contentId)
      if (contentData) {
        setContent(contentData)
        setRawLessonPlan(contentData.contentLessonPlan)
        
        // Parse the lesson plan JSON
        try {
          const lessonPlanText = contentData.contentLessonPlan
          console.log("Raw lesson plan text:", lessonPlanText)
          
          // Remove the markdown code block wrapper if present
          const jsonMatch = lessonPlanText.match(/```json\n([\s\S]*?)\n```/)
          const jsonString = jsonMatch ? jsonMatch[1] : lessonPlanText
          console.log("JSON string to parse:", jsonString)
          
          const parsed = JSON.parse(jsonString)
          console.log("Parsed lesson plan:", parsed)
          setParsedLessonPlan(parsed)
        } catch (parseError) {
          console.error("Error parsing lesson plan:", parseError)
          console.log("Failed to parse lesson plan text:", contentData.contentLessonPlan)
          setParsedLessonPlan(null)
        }
      } else {
        toast({
          title: "Error",
          description: "Content not found",
          variant: "destructive"
        })
        router.push("/teacher/content-customization")
      }
    } catch (error) {
      console.error("Error loading content:", error)
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      })
      router.push("/teacher/content-customization")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleDownloadMaterial = () => {
    if (content?.materialUrl) {
      window.open(content.materialUrl, '_blank')
    }
  }

  const renderLessonPlan = () => {
    if (!parsedLessonPlan) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Plan Not Available</h3>
              <p className="text-gray-600 mb-4">The lesson plan could not be parsed properly.</p>
              <details className="text-left">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View Raw Data</summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                  {rawLessonPlan}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Get the lesson plan object - it could be nested under "lesson_plan" or be the root
    const lessonPlan = parsedLessonPlan.lesson_plan || parsedLessonPlan

    // Recursive function to render any JSON structure
    const renderJsonValue = (value: any, key: string, level: number = 0): JSX.Element => {
      const indent = level * 16 // 16px per level

      if (value === null || value === undefined) {
        return <span className="text-gray-500 italic">null</span>
      }

      if (typeof value === 'string') {
        return <span className="text-gray-900">{value}</span>
      }

      if (typeof value === 'number') {
        return <span className="text-blue-600 font-medium">{value}</span>
      }

      if (typeof value === 'boolean') {
        return <span className={`font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
          {value ? 'true' : 'false'}
        </span>
      }

      if (Array.isArray(value)) {
        return (
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  {typeof item === 'object' && item !== null ? (
                    <div className="space-y-2">
                      {Object.entries(item).map(([subKey, subValue]) => (
                        <div key={subKey} className="ml-4">
                          <span className="font-medium text-gray-700">{subKey}: </span>
                          {renderJsonValue(subValue, subKey, level + 1)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    renderJsonValue(item, `${key}[${index}]`, level + 1)
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }

      if (typeof value === 'object') {
        return (
          <div className="space-y-3">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey} className="border-l-2 border-gray-200 pl-4">
                <div className="font-medium text-gray-900 mb-2 capitalize">
                  {subKey.replace(/_/g, ' ')}
                </div>
                <div className="ml-4">
                  {renderJsonValue(subValue, subKey, level + 1)}
                </div>
              </div>
            ))}
          </div>
        )
      }

      return <span className="text-gray-500">{String(value)}</span>
    }

    // Function to render a section with proper styling
    const renderSection = (title: string, content: any, icon?: React.ReactNode) => {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderJsonValue(content, title)}
          </CardContent>
        </Card>
      )
    }

    // Get all top-level keys from the lesson plan
    const topLevelKeys = Object.keys(lessonPlan)

    return (
      <div className="space-y-6">
        {/* Lesson Overview - Special handling for common fields */}
        {(lessonPlan.lesson_title || lessonPlan.lessonTitle || content?.topic) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Lesson Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {lessonPlan.lesson_title || lessonPlan.lessonTitle || content?.topic || "Lesson Plan"}
                </h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  {lessonPlan.lesson_duration && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lessonPlan.lesson_duration}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Grade {content?.grade}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Render all other sections dynamically */}
        {topLevelKeys.map((key) => {
          // Skip lesson_title as it's handled in overview
          if (key === 'lesson_title' || key === 'lessonTitle') return null

          const value = lessonPlan[key]
          let icon = <FileText className="w-5 h-5" />
          
          // Assign appropriate icons based on key names
          if (key.includes('objective') || key.includes('learning')) {
            icon = <Target className="w-5 h-5" />
          } else if (key.includes('material')) {
            icon = <Award className="w-5 h-5" />
          } else if (key.includes('activity') || key.includes('main')) {
            icon = <BookOpen className="w-5 h-5" />
          } else if (key.includes('assessment')) {
            icon = <Target className="w-5 h-5" />
          } else if (key.includes('closure') || key.includes('summary')) {
            icon = <Clock className="w-5 h-5" />
          } else if (key.includes('differentiation')) {
            icon = <Users className="w-5 h-5" />
          } else if (key.includes('support') || key.includes('teacher')) {
            icon = <User className="w-5 h-5" />
          }

          return (
            <div key={key}>
              {renderSection(key, value, icon)}
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <ProtectedRoute userType="teacher">
        <LayoutWrapper
          title="Loading Content"
          subtitle="Please wait..."
          showLoginButton={true}
          logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
          className="bg-gradient-to-br from-blue-50 via-white to-green-50"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          </div>
        </LayoutWrapper>
      </ProtectedRoute>
    )
  }

  if (!content) {
    return (
      <ProtectedRoute userType="teacher">
        <LayoutWrapper
          title="Content Not Found"
          subtitle="The requested content could not be found"
          showLoginButton={true}
          logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
          className="bg-gradient-to-br from-blue-50 via-white to-green-50"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Content Not Found</h3>
              <p className="text-gray-600 mb-4">The requested content could not be found or has been deleted.</p>
              <Button onClick={() => router.push("/teacher/content-customization")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Content
              </Button>
            </div>
          </div>
        </LayoutWrapper>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute userType="teacher">
      <LayoutWrapper
        title="Custom Content"
        subtitle={`${content.subject} - Grade ${content.grade}`}
        showLoginButton={true}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/teacher/content-customization")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.topic}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{content.subject}</Badge>
                  <Badge variant="outline">Grade {content.grade}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(content.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {content.userEmail}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleDownloadMaterial} disabled={!content.materialUrl}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Material
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="lesson-plan" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lesson-plan">Lesson Plan</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="visual-aid">Visual Aid</TabsTrigger>
            </TabsList>

            <TabsContent value="lesson-plan" className="space-y-6">
              {renderLessonPlan()}
            </TabsContent>

            <TabsContent value="materials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Teaching Materials
                  </CardTitle>
                  <CardDescription>
                    Download and access supplementary materials for this lesson
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {content.materialUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Lesson Materials</h4>
                            <p className="text-sm text-gray-500">Supplementary resources and materials</p>
                          </div>
                        </div>
                        <Button onClick={handleDownloadMaterial}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Material
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Available</h3>
                      <p className="text-gray-600">No supplementary materials are available for this lesson.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual-aid" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Visual Aid
                  </CardTitle>
                  <CardDescription>
                    Visual materials to support the lesson
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {content.imageUrl ? (
                    <div className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={content.imageUrl}
                          alt={`Visual aid for ${content.topic}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => window.open(content.imageUrl, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Full Size
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Visual Aid Available</h3>
                      <p className="text-gray-600">No visual materials are available for this lesson.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
} 