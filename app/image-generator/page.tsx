"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ImageIcon,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  AlertCircle,
  FileText,
  Grid,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { ButtonLoader } from "@/components/ui/loading"

export default function ImageGeneratorPage() {
  const searchParams = useSearchParams()
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("lang") || "english")
  const [prompt, setPrompt] = useState("")
  const [subject, setSubject] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [aiDescription, setAiDescription] = useState("")
  const [isPlaceholder, setIsPlaceholder] = useState(false)
  const [imageDescription, setImageDescription] = useState("")
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [error, setError] = useState("")

  const subjects = [
    { value: "science", label: "Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "social-studies", label: "Social Studies" },
    { value: "language", label: "Language Arts" },
    { value: "environmental-studies", label: "Environmental Studies" },
    { value: "art", label: "Art & Creativity" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
  ]

  const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "marathi", label: "मराठी (Marathi)" },
  ]

  const handleGenerateImage = async () => {
    if (!prompt) {
      alert("Please enter a description for the image")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedImages([])
    setAiDescription("")

    try {
      const enhancedPrompt = `
        Create an educational image for ${subject || "general education"} suitable for ${gradeLevel || "school"} students.
        
        Description: ${prompt}
        
        Style requirements:
        - Educational and child-friendly
        - Clear and simple design
        - Bright, engaging colors
        - Appropriate for ${selectedLanguage} speaking students
        - Include cultural context relevant to Indian education
        - Make it suitable for classroom display
        
        The image should be informative, visually appealing, and help students understand the concept better.
      `

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          numberOfImages: numberOfImages
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data && result.data.images && result.data.images.length > 0) {
        setGeneratedImages(result.data.images)
        setAiDescription(result.data.description || "Images generated successfully!")
        setIsPlaceholder(false)
      } else {
        // Generate placeholder images when API fails
        const placeholderImages = Array.from(
          { length: numberOfImages },
          (_, index) => `/placeholder.svg?height=400&width=400&text=Educational+Image+${index + 1}`,
        )
        setGeneratedImages(placeholderImages)
        setIsPlaceholder(true)
        setAiDescription("Image generation service is currently unavailable. Showing placeholder images.")
      }
    } catch (err) {
      setError("Failed to generate images. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!prompt) {
      alert("Please enter a description for the image")
      return
    }

    setIsGeneratingDescription(true)
    setError("")

    try {
      const descriptionPrompt = `
        Create a detailed description for an educational image with the following specifications:
        
        Subject: ${subject || "general education"}
        Grade Level: ${gradeLevel || "school"}
        Language: ${selectedLanguage}
        Description: ${prompt}
        
        Please provide a comprehensive description that includes:
        1. Visual elements and composition
        2. Educational content and concepts
        3. Cultural context relevant to Indian students
        4. Age-appropriate styling and colors
        5. Classroom usage suggestions
        
        Make the description detailed enough for an artist or designer to create the image.
      `

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: descriptionPrompt,
          numberOfImages: 1
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data && result.data.description) {
        setImageDescription(result.data.description)
      } else {
        throw new Error('Failed to generate description')
      }
    } catch (err) {
      setError("Failed to generate description. Please try again.")
      console.error(err)
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `educational-image-${index + 1}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download image. Please try again.")
    }
  }

  const copyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl)
    alert("Image URL copied to clipboard!")
  }

  const copyDescription = () => {
    if (!imageDescription) return
    navigator.clipboard.writeText(imageDescription)
    alert("Description copied to clipboard!")
  }

  const copyAiDescription = () => {
    if (!aiDescription) return
    navigator.clipboard.writeText(aiDescription)
    alert("AI description copied to clipboard!")
  }

  const samplePrompts = [
    {
      title: "Plant Parts",
      description: "A colorful diagram showing the parts of a plant including roots, stem, leaves, and flower with clear labels",
      subject: "science",
      grade: "3-5",
    },
    {
      title: "Solar System",
      description: "An engaging illustration of the solar system with planets orbiting around the sun",
      subject: "science",
      grade: "4-6",
    },
    {
      title: "Math Fractions",
      description: "Visual representation of fractions using colorful circles and rectangles",
      subject: "mathematics",
      grade: "3-5",
    },
    {
      title: "Indian Map",
      description: "A simple map of India showing major states and landmarks",
      subject: "geography",
      grade: "4-8",
    },
    {
      title: "Food Pyramid",
      description: "A healthy food pyramid with different food groups and portions",
      subject: "environmental-studies",
      grade: "2-4",
    },
    {
      title: "Story Characters",
      description: "Friendly cartoon characters from Indian folktales and stories",
      subject: "language",
      grade: "1-3",
    },
  ]

  return (
    <ProtectedRoute>
      <LayoutWrapper 
        title="शैक्षणिक चित्र निर्माता"
        subtitle="Educational Image Generator"
        logoHref="/"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                  Image Request
                </CardTitle>
                <CardDescription>Describe the educational image you want to create</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subj) => (
                          <SelectItem key={subj.value} value={subj.value}>
                            {subj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Grade Level</label>
                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="K-2">Kindergarten - Grade 2</SelectItem>
                        <SelectItem value="3-5">Grade 3-5</SelectItem>
                        <SelectItem value="6-8">Grade 6-8</SelectItem>
                        <SelectItem value="9-12">Grade 9-12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Images</label>
                    <Select
                      value={numberOfImages.toString()}
                      onValueChange={(value) => setNumberOfImages(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Image</SelectItem>
                        <SelectItem value="2">2 Images</SelectItem>
                        <SelectItem value="3">3 Images</SelectItem>
                        <SelectItem value="4">4 Images</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Image Description *</label>
                  <Textarea
                    placeholder="Example: A colorful diagram showing the parts of a plant including roots, stem, leaves, and flower with clear labels"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleGenerateImage} disabled={isGenerating} size="lg">
                    {isGenerating ? (
                      <ButtonLoader text="Generating..." />
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Generate Images
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription}
                    variant="outline"
                    size="lg"
                  >
                    {isGeneratingDescription ? (
                      <ButtonLoader text="Creating..." />
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Get Description
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {(isGenerating || isGeneratingDescription) && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-medium text-pink-900 mb-2">
                      {isGenerating ? "Creating Your Images:" : "Generating Description:"}
                    </h4>
                    <ul className="text-sm text-pink-700 space-y-1">
                      <li>✓ Processing your description</li>
                      <li>
                        🔄{" "}
                        {isGenerating
                          ? "Using Gemini 2.0 Flash native image generation"
                          : "Creating detailed description"}
                      </li>
                      <li>🔄 {isGenerating ? "Applying educational styling" : "Adding educational context"}</li>
                      <li>🔄 {isGenerating ? "Finalizing high-quality images" : "Formatting output"}</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>AI-generated educational content with Gemini 2.0 Flash</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="images">
                      <Grid className="w-4 h-4 mr-1" />
                      Images ({generatedImages.length})
                    </TabsTrigger>
                    <TabsTrigger value="ai-description">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      AI Notes
                    </TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                  </TabsList>

                  <TabsContent value="images" className="space-y-4">
                    {generatedImages.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedImages.map((imageUrl, index) => (
                            <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Generated educational image ${index + 1}`}
                                className="w-full h-auto rounded-lg shadow-sm mb-3"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `/placeholder.svg?height=300&width=300&text=Image+${index + 1}`
                                }}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyImageUrl(imageUrl)}
                                  className="flex-1 bg-transparent"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy URL
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadImage(imageUrl, index)}
                                  className="flex-1 bg-transparent"
                                  disabled={isPlaceholder}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                              {isPlaceholder && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-xs text-yellow-800">
                                    This is a placeholder. Image generation service is currently unavailable.
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Usage Tips:</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Use these images in presentations or worksheets</li>
                            <li>• Print for classroom displays or handouts</li>
                            <li>• Share digitally with students and parents</li>
                            <li>• Modify or annotate as needed for your lessons</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate</h3>
                        <p className="text-gray-500 mb-6">
                          Describe the educational images you need and Gemini 2.0 Flash will create high-quality
                          illustrations for your classroom.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="ai-description" className="space-y-4">
                    {aiDescription ? (
                      <div className="space-y-4">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{aiDescription}</pre>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyAiDescription}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy AI Notes
                        </Button>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">AI Generated Notes:</h4>
                          <p className="text-sm text-purple-700">
                            These are the AI's thoughts and explanations about the generated images, providing context and
                            educational insights.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">AI Notes</h3>
                        <p className="text-gray-500 mb-6">
                          Generate images to see AI's explanations and educational context about the created content.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4">
                    {imageDescription ? (
                      <div className="space-y-4">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{imageDescription}</pre>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyDescription}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Description
                        </Button>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">How to Use:</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Use this description with other AI image generators</li>
                            <li>• Share with artists or designers for manual creation</li>
                            <li>• Use as reference for drawing or sketching</li>
                            <li>• Modify and enhance for specific needs</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Generate Description</h3>
                        <p className="text-gray-500 mb-6">
                          Get a detailed description of your image that can be used with other tools or for manual
                          creation.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sample Prompts */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sample Prompts</CardTitle>
              <CardDescription>Get inspired with these example image requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samplePrompts.map((sample, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setPrompt(sample.description)
                      setSubject(sample.subject)
                      setGradeLevel(sample.grade)
                    }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{sample.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{sample.description}</p>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {sample.subject}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Grade {sample.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
