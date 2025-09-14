"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Download, Copy, RefreshCw, Sparkles, FileText, Users } from "lucide-react"
import Link from "next/link"
import { generateContent } from "@/lib/gemini"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"

export default function ContentGeneratorPage() {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [contentType, setContentType] = useState("")
  const [language, setLanguage] = useState("marathi")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [error, setError] = useState("")

  const subjects = [
    { value: "mathematics", label: "Mathematics / गणित" },
    { value: "science", label: "Science / विज्ञान" },
    { value: "social-studies", label: "Social Studies / सामाजिक अध्ययन" },
    { value: "language", label: "Language / भाषा" },
    { value: "environmental-studies", label: "Environmental Studies / पर्यावरण अध्ययन" },
    { value: "art", label: "Art / कला" },
    { value: "physical-education", label: "Physical Education / शारीरिक शिक्षण" },
  ]

  const contentTypes = [
    { value: "lesson-plan", label: "Lesson Plan / धडा योजना" },
    { value: "worksheet", label: "Worksheet / कार्यपत्रक" },
    { value: "quiz", label: "Quiz / प्रश्नमंजुषा" },
    { value: "story", label: "Story / कथा" },
    { value: "explanation", label: "Explanation / स्पष्टीकरण" },
    { value: "activities", label: "Activities / क्रियाकलाप" },
    { value: "assessment", label: "Assessment / मूल्यांकन" },
  ]

  const languages = [
    { value: "marathi", label: "मराठी (Marathi)" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "english", label: "English" },
    { value: "bilingual", label: "Bilingual / द्विभाषिक" },
  ]

  const gradeOptions = [
    { value: "1-2", label: "Grade 1-2 (Ages 6-8)" },
    { value: "3-5", label: "Grade 3-5 (Ages 8-11)" },
    { value: "6-8", label: "Grade 6-8 (Ages 11-14)" },
    { value: "9-10", label: "Grade 9-10 (Ages 14-16)" },
  ]

  const generateEducationalContent = async () => {
    if (!topic || !subject || !gradeLevel || !contentType) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const prompt = `
        Create educational content with the following specifications:
        
        Topic: ${topic}
        Subject: ${subject}
        Grade Level: ${gradeLevel}
        Content Type: ${contentType}
        Language: ${language}
        
        Please create comprehensive, age-appropriate content that includes:
        
        1. Clear learning objectives
        2. Step-by-step explanations suitable for the grade level
        3. Interactive elements or activities
        4. Assessment questions
        5. Cultural context relevant to Indian students
        6. Use simple language appropriate for the grade level
        
        If the language is bilingual, include both English and local language terms.
        Make the content engaging and practical for classroom use.
        
        Format the response with clear headings and sections.
      `

      const result = await generateContent(prompt)
      setGeneratedContent(result)
    } catch (err) {
      setError("Failed to generate content. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadContent = () => {
    if (!generatedContent) return
    
    const element = document.createElement("a")
    const file = new Blob([generatedContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `educational-content-${topic}-${subject}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const copyContent = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(generatedContent)
    alert("Content copied to clipboard!")
  }

  const sampleTopics = [
    {
      topic: "Water Cycle",
      subject: "science",
      grade: "3-5",
      type: "lesson-plan",
      description: "Complete lesson plan for teaching the water cycle to elementary students"
    },
    {
      topic: "Basic Fractions",
      subject: "mathematics",
      grade: "3-5",
      type: "worksheet",
      description: "Interactive worksheet for learning basic fractions"
    },
    {
      topic: "Indian Independence",
      subject: "social-studies",
      grade: "6-8",
      type: "story",
      description: "Engaging story about India's independence movement"
    },
    {
      topic: "Parts of Speech",
      subject: "language",
      grade: "1-2",
      type: "activities",
      description: "Fun activities for teaching parts of speech"
    },
  ]

  return (
    <ProtectedRoute>
      <LayoutWrapper 
        title="इयत्ता-आधारित सामग्री"
        subtitle="Grade-Based Content Generator"
        logoHref="/"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  Content Specifications
                </CardTitle>
                <CardDescription>Define what educational content you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Topic / विषय *</label>
                  <Input
                    placeholder="e.g., Water Cycle, Fractions, Indian History"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject / शाखा *</label>
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
                    <label className="text-sm font-medium mb-2 block">Grade Level / इयत्ता *</label>
                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Content Type / प्रकार *</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Language / भाषा</label>
                    <Select value={language} onValueChange={setLanguage}>
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
                </div>

                <Button onClick={generateEducationalContent} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Educational Content
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Creating Your Content:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Analyzing grade-level requirements</li>
                      <li>🔄 Creating age-appropriate explanations</li>
                      <li>🔄 Adding interactive elements</li>
                      <li>🔄 Including cultural context</li>
                      <li>🔄 Formatting for classroom use</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>Ready-to-use educational material</CardDescription>
                  </div>
                  {generatedContent && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyContent}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadContent}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{generatedContent}</pre>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">How to Use This Content:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Review and customize for your specific classroom needs</li>
                        <li>• Print or share digitally with students</li>
                        <li>• Use as a starting point for lesson planning</li>
                        <li>• Adapt activities based on student responses</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate</h3>
                    <p className="text-gray-500 mb-6">
                      Fill in the specifications above to create customized educational content for your students.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Grade-Appropriate</h4>
                        <p className="text-green-700">Content tailored to specific age groups and learning levels</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Culturally Relevant</h4>
                        <p className="text-blue-700">Examples and context suitable for Indian students</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sample Topics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Sample Content Ideas
              </CardTitle>
              <CardDescription>Click on any sample to auto-fill the form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sampleTopics.map((sample, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setTopic(sample.topic)
                      setSubject(sample.subject)
                      setGradeLevel(sample.grade)
                      setContentType(sample.type)
                    }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{sample.topic}</h4>
                    <p className="text-sm text-gray-600 mb-3">{sample.description}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {sample.subject}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Grade {sample.grade}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {sample.type}
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
