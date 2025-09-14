"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Loader2,
  GraduationCap
} from "lucide-react"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { LoadingSpinner } from "@/components/ui/loading"
import { getMaterialById, type MaterialRecord } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"

export default function ViewMaterial() {
  const params = useParams()
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuthContext()

  const [material, setMaterial] = useState<MaterialRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const materialId = params.id as string

  useEffect(() => {
    if (materialId) {
      loadMaterial()
    }
  }, [materialId])

  const loadMaterial = async () => {
    if (!materialId) return

    setIsLoading(true)
    try {
      const materialData = await getMaterialById(materialId)
      if (materialData) {
        setMaterial(materialData)
      } else {
        toast({
          title: "Error",
          description: "Material not found",
          variant: "destructive"
        })
        router.push("/teacher/material-generator")
      }
    } catch (error) {
      console.error("Error loading material:", error)
      toast({
        title: "Error",
        description: "Failed to load material",
        variant: "destructive"
      })
      router.push("/teacher/material-generator")
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
    if (material?.materialUrl) {
      window.open(material.materialUrl, '_blank')
    }
  }

  const renderMarkdownContent = (content: string) => {
    // Simple markdown to HTML conversion for basic formatting
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^<p/, '<p class="mb-4"')
  }

  if (isLoading) {
    return (
      <ProtectedRoute userType="teacher">
        <LayoutWrapper
          title="Loading Material"
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

  if (!material) {
    return (
      <ProtectedRoute userType="teacher">
        <LayoutWrapper
          title="Material Not Found"
          subtitle="The requested material could not be found"
          showLoginButton={true}
          logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
          className="bg-gradient-to-br from-blue-50 via-white to-green-50"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Material Not Found</h3>
              <p className="text-gray-600 mb-4">The requested material could not be found or has been deleted.</p>
              <Button onClick={() => router.push("/teacher/material-generator")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Materials
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
        title="Educational Material"
        subtitle={`${material.subject} - Grade ${material.grade}`}
        showLoginButton={true}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/teacher/material-generator")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Materials
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{material.topic}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{material.subject}</Badge>
                  <Badge variant="outline">Grade {material.grade}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(material.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {material.userEmail}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleDownloadMaterial} disabled={!material.materialUrl}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Material
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Material Content</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="visual-aid">Visual Aid</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Educational Material Content
                  </CardTitle>
                  <CardDescription>
                    Comprehensive teaching materials with detailed lesson plans, exercises, and resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdownContent(material.materials) 
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="download" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Materials
                  </CardTitle>
                  <CardDescription>
                    Access downloadable versions of the teaching materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {material.materialUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Complete Material Package</h4>
                            <p className="text-sm text-gray-500">Download the full educational material package</p>
                          </div>
                        </div>
                        <Button onClick={handleDownloadMaterial}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Download Available</h3>
                      <p className="text-gray-600">Downloadable version is not available for this material.</p>
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
                  {material.imageUrl ? (
                    <div className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={material.imageUrl}
                          alt={`Visual aid for ${material.topic}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => window.open(material.imageUrl, '_blank')}>
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