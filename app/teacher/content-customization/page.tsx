"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Download,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { LoadingSpinner } from "@/components/ui/loading"
import { getCustomContentByUser, deleteCustomContent, type CustomContentRecord } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"

export default function ContentCustomization() {
  const router = useRouter()
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuthContext()

  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customContent, setCustomContent] = useState<CustomContentRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    topic: ""
  })

  const subjects = [
    "Science", "Mathematics", "English", "History", "Geography", 
    "Physics", "Chemistry", "Biology", "Computer Science", "Art",
    "Music", "Physical Education", "Social Studies", "Literature"
  ]

  const grades = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
  ]

  useEffect(() => {
    if (user?.uid) {
      loadCustomContent()
    }
  }, [user?.uid])

  const loadCustomContent = async () => {
    if (!user?.uid) return
    
    setIsLoading(true)
    try {
      const content = await getCustomContentByUser(user.uid)
      setCustomContent(content)
    } catch (error) {
      console.error("Error loading custom content:", error)
      toast({
        title: "Error",
        description: "Failed to load custom content",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContent = async () => {
    if (!user?.uid || !user?.email) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive"
      })
      return
    }

    if (!formData.subject || !formData.grade || !formData.topic) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/customize-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          grade: formData.grade,
          topic: formData.topic,
          userId: user.uid,
          userEmail: user.email
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Content created successfully!",
        })
        
        // Reset form
        setFormData({ subject: "", grade: "", topic: "" })
        
        // Reload content
        await loadCustomContent()
        
        // Navigate to the created content
        if (result.data.contentId) {
          router.push(`/teacher/content-customization/view/${result.data.contentId}`)
        }
      } else {
        throw new Error(result.error || "Failed to create content")
      }
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create content",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const result = await deleteCustomContent(contentId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Content deleted successfully",
        })
        await loadCustomContent()
      } else {
        throw new Error(result.error || "Failed to delete content")
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete content",
        variant: "destructive"
      })
    }
  }

  const filteredContent = customContent.filter(content => {
    const matchesSearch = content.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || content.subject === selectedSubject
    const matchesGrade = selectedGrade === "all" || content.grade === selectedGrade
    
    return matchesSearch && matchesSubject && matchesGrade
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <ProtectedRoute userType="teacher">
      <LayoutWrapper
        title="Content Customization"
        subtitle="Create and manage custom lesson content"
        showLoginButton={true}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Customization</h1>
            <p className="text-gray-600">
              Create personalized lesson plans and educational content for your students
            </p>
          </div>

          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New Content</TabsTrigger>
              <TabsTrigger value="manage">Manage Content</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Custom Content
                  </CardTitle>
                  <CardDescription>
                    Generate personalized lesson plans and educational materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade *</Label>
                      <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              Grade {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic *</Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Photosynthesis, Algebra, World War II"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateContent} 
                    disabled={isCreating || !formData.subject || !formData.grade || !formData.topic}
                    className="w-full"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Content...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Your Content</CardTitle>
                  <CardDescription>
                    View, edit, and manage your custom educational content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search by topic or subject..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : filteredContent.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                      <p className="text-gray-600">
                        {searchTerm || selectedSubject !== "all" || selectedGrade !== "all" 
                          ? "Try adjusting your search or filters"
                          : "Create your first custom content to get started"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredContent.map((content) => (
                        <Card key={content.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{content.topic}</CardTitle>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="secondary">{content.subject}</Badge>
                                  <Badge variant="outline">Grade {content.grade}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(content.createdAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/teacher/content-customization/view/${content.id}`)}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteContent(content.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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