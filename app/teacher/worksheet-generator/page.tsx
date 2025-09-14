"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, FileText, Download, Eye, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateStructuredContent } from "@/lib/gemini"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function WorksheetGeneratorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [worksheets, setWorksheets] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateWorksheets = async () => {
    if (!uploadedImage) return

    setIsProcessing(true)
    setError("")

    try {
      const prompt = `
        Analyze this textbook page image and create differentiated worksheets for multiple grade levels.
        
        Please:
        1. Identify the main topic and concepts from the image
        2. Extract key learning objectives
        3. Create 3 different worksheets for Grade 1-2, Grade 3-5, and Grade 6-8
        4. Each worksheet should be appropriate for the grade level
        5. Include questions, activities, and exercises
        6. Use simple language and culturally relevant examples
        7. Add both English and Hindi/Marathi labels where appropriate
        
        Return the response in JSON format with this structure:
        {
          "topic": "Main topic identified",
          "subject": "Subject area",
          "worksheets": [
            {
              "grade": "Grade 1-2",
              "title": "Worksheet title",
              "difficulty": "Easy/Medium/Hard",
              "content": "Complete worksheet content with questions and activities",
              "objectives": ["Learning objective 1", "Learning objective 2"]
            }
          ]
        }
      `

      const schema = {
        type: "object",
        properties: {
          topic: { type: "string" },
          subject: { type: "string" },
          worksheets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                grade: { type: "string" },
                title: { type: "string" },
                difficulty: { type: "string" },
                content: { type: "string" },
                objectives: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      }

      const result = await generateStructuredContent(prompt, schema)
      setWorksheets(result.worksheets || [])
    } catch (err) {
      setError("Failed to analyze image and generate worksheets. Please try again.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadWorksheet = (worksheet: any) => {
    const element = document.createElement("a")
    const file = new Blob([worksheet.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${worksheet.title.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">कार्यपत्रक विभेदीकरण</h1>
                  <p className="text-sm text-gray-600">Worksheet Differentiation</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <FileText className="w-4 h-4 mr-1" />
                Gemini Vision
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-green-600" />
                  Upload Textbook Page
                </CardTitle>
                <CardDescription>Upload a photo of a textbook page to generate differentiated worksheets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded textbook page"
                        className="max-w-full h-48 object-contain mx-auto rounded"
                      />
                      <p className="text-sm text-gray-600">Textbook page uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">Upload Image</p>
                        <p className="text-sm text-gray-500">Take a photo of textbook page or upload from gallery</p>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="mt-4 bg-transparent" asChild>
                      <span className="cursor-pointer">{uploadedImage ? "Change Image" : "Choose Image"}</span>
                    </Button>
                  </label>
                </div>

                <Button
                  onClick={generateWorksheets}
                  disabled={!uploadedImage || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing & Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Worksheets
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Processing Steps:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Image uploaded successfully</li>
                      <li>🔄 Analyzing content with Gemini Vision</li>
                      <li>🔄 Identifying key concepts</li>
                      <li>🔄 Generating grade-appropriate versions</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {worksheets.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Worksheets</CardTitle>
                    <CardDescription>Differentiated worksheets for multiple grade levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="0" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        {worksheets.map((worksheet, index) => (
                          <TabsTrigger key={index} value={index.toString()}>
                            {worksheet.grade}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {worksheets.map((worksheet, index) => (
                        <TabsContent key={index} value={index.toString()}>
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline">{worksheet.grade}</Badge>
                                    <Badge
                                      variant={
                                        worksheet.difficulty === "Easy"
                                          ? "default"
                                          : worksheet.difficulty === "Medium"
                                            ? "secondary"
                                            : "destructive"
                                      }
                                    >
                                      {worksheet.difficulty}
                                    </Badge>
                                  </div>
                                  {worksheet.objectives && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Learning Objectives:</p>
                                      <ul className="text-xs text-gray-600 space-y-1">
                                        {worksheet.objectives.map((obj: string, objIndex: number) => (
                                          <li key={objIndex}>• {obj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => downloadWorksheet(worksheet)}>
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                  {worksheet.content}
                                </pre>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate Worksheets</h3>
                    <p className="text-gray-500 mb-6">
                      Upload a textbook page image to automatically generate differentiated worksheets for multiple grade
                      levels in your classroom.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Grade 1-2</h4>
                        <p className="text-blue-700">Simple, visual-based exercises with basic concepts</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Grade 3-5</h4>
                        <p className="text-green-700">Intermediate problems with step-by-step guidance</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Grade 6-8</h4>
                        <p className="text-purple-700">Advanced concepts with real-world applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
