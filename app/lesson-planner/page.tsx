"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Users, BookOpen, Target, CheckCircle, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateStructuredContent } from "@/lib/gemini"

export default function LessonPlannerPage() {
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("")
  const [grades, setGrades] = useState("")
  const [objectives, setObjectives] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [lessonPlan, setLessonPlan] = useState<any>(null)
  const [error, setError] = useState("")

  const subjects = [
    { value: "science", label: "Science / विज्ञान" },
    { value: "mathematics", label: "Mathematics / गणित" },
    { value: "social-studies", label: "Social Studies / सामाजिक अध्ययन" },
    { value: "language", label: "Language / भाषा" },
    { value: "environmental-studies", label: "Environmental Studies / पर्यावरण अध्ययन" },
    { value: "moral-education", label: "Moral Education / नैतिक शिक्षा" },
  ]

  const generateLessonPlan = async () => {
    if (!subject || !topic || !duration || !grades) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const prompt = `
        Create a comprehensive lesson plan for Indian schools with these specifications:
        
        Subject: ${subject}
        Topic: ${topic}
        Duration: ${duration} minutes
        Grade Levels: ${grades}
        Additional Objectives: ${objectives}
        
        Please create a detailed lesson plan that includes:
        1. Clear learning objectives in both English and Hindi/Marathi
        2. Time-structured activities suitable for multi-grade classroom
        3. Materials needed (considering resource constraints)
        4. Step-by-step teaching activities
        5. Assessment methods
        6. Homework assignments
        7. Extension activities for advanced learners
        8. Cultural context relevant to Indian students
        
        Format as JSON with this structure:
        {
          "title": "Lesson title",
          "titleLocal": "Title in local language",
          "subject": "Subject name",
          "duration": "Duration",
          "grades": "Grade levels",
          "objectives": ["Objective 1", "Objective 2", ...],
          "materials": ["Material 1", "Material 2", ...],
          "activities": [
            {
              "time": "0-10 min",
              "activity": "Activity name",
              "description": "Detailed description",
              "type": "Activity type"
            }
          ],
          "assessment": ["Assessment method 1", "Assessment method 2", ...],
          "homework": "Homework description",
          "extensions": ["Extension 1", "Extension 2", ...]
        }
      `

      const schema = {
        type: "object",
        properties: {
          title: { type: "string" },
          titleLocal: { type: "string" },
          subject: { type: "string" },
          duration: { type: "string" },
          grades: { type: "string" },
          objectives: {
            type: "array",
            items: { type: "string" },
          },
          materials: {
            type: "array",
            items: { type: "string" },
          },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time: { type: "string" },
                activity: { type: "string" },
                description: { type: "string" },
                type: { type: "string" },
              },
            },
          },
          assessment: {
            type: "array",
            items: { type: "string" },
          },
          homework: { type: "string" },
          extensions: {
            type: "array",
            items: { type: "string" },
          },
        },
      }

      const result = await generateStructuredContent(prompt, schema)
      setLessonPlan(result)
    } catch (err) {
      setError("Failed to generate lesson plan. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadLessonPlan = () => {
    if (lessonPlan) {
      const content = `
${lessonPlan.title}
${lessonPlan.titleLocal}

Subject: ${lessonPlan.subject}
Duration: ${lessonPlan.duration}
Grade Levels: ${lessonPlan.grades}

Learning Objectives:
${lessonPlan.objectives.map((obj: string) => `• ${obj}`).join("\n")}

Materials Needed:
${lessonPlan.materials.map((mat: string) => `• ${mat}`).join("\n")}

Activities:
${lessonPlan.activities
  .map(
    (act: any) => `
${act.time} - ${act.activity}
${act.description}
Type: ${act.type}
`,
  )
  .join("\n")}

Assessment:
${lessonPlan.assessment.map((assess: string) => `• ${assess}`).join("\n")}

Homework:
${lessonPlan.homework}

Extension Activities:
${lessonPlan.extensions.map((ext: string) => `• ${ext}`).join("\n")}
      `

      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${lessonPlan.title.replace(/\s+/g, "-")}-lesson-plan.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
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
                <h1 className="text-xl font-bold text-gray-900">पाठ योजनाकार</h1>
                <p className="text-sm text-gray-600">AI Lesson Planner</p>
              </div>
            </div>
            <Badge className="bg-indigo-100 text-indigo-800">
              <Calendar className="w-4 h-4 mr-1" />
              Gemini Planner
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Lesson Details
              </CardTitle>
              <CardDescription>Provide lesson information to generate a structured plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject / विषय *</label>
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
                <label className="text-sm font-medium mb-2 block">Topic / विषय *</label>
                <Input
                  placeholder="e.g., Water Conservation / पाणी संवर्धन"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration / कालावधी *</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Grade Levels / इयत्ता *</label>
                  <Select value={grades} onValueChange={setGrades}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">Grade 1-2</SelectItem>
                      <SelectItem value="3-5">Grade 3-5</SelectItem>
                      <SelectItem value="6-8">Grade 6-8</SelectItem>
                      <SelectItem value="mixed">Mixed Grades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Learning Objectives / उद्दिष्टे</label>
                <Textarea
                  placeholder="What should students learn from this lesson?"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={generateLessonPlan} disabled={isGenerating} className="w-full" size="lg">
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {isGenerating && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-2">Creating Your Plan:</h4>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>✓ Analyzing subject and topic</li>
                    <li>🔄 Structuring activities</li>
                    <li>🔄 Adding assessment methods</li>
                    <li>🔄 Including extension activities</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {lessonPlan ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{lessonPlan.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{lessonPlan.titleLocal}</CardDescription>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {lessonPlan.duration}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {lessonPlan.grades}
                        </Badge>
                        <Badge variant="outline">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {lessonPlan.subject}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" onClick={downloadLessonPlan}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activities">Activities</TabsTrigger>
                      <TabsTrigger value="assessment">Assessment</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-green-600" />
                          Learning Objectives / शिक्षणाचे उद्दिष्टे
                        </h3>
                        <ul className="space-y-2">
                          {lessonPlan.objectives.map((obj: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">Required Materials / आवश्यक साहित्य</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {lessonPlan.materials.map((material: string, index: number) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                              • {material}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="activities" className="space-y-4">
                      {lessonPlan.activities.map((activity: any, index: number) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{activity.activity}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {activity.time}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700">{activity.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="assessment" className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Assessment Methods / मूल्यांकन पद्धती</h3>
                        <ul className="space-y-3">
                          {lessonPlan.assessment.map((method: string, index: number) => (
                            <li key={index} className="bg-yellow-50 p-3 rounded-lg">
                              <span className="font-medium text-yellow-800">Method {index + 1}:</span>
                              <span className="ml-2 text-sm">{method}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">Homework / गृहपाठ</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">{lessonPlan.homework}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Extension Activities / विस्तार क्रियाकलाप</h3>
                        <div className="grid gap-3">
                          {lessonPlan.extensions.map((extension: string, index: number) => (
                            <div key={index} className="bg-purple-50 p-3 rounded-lg">
                              <span className="text-sm text-purple-800">• {extension}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">Additional Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Related Videos</h4>
                              <p className="text-sm text-gray-600">Search for educational videos in local language</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Books & Stories</h4>
                              <p className="text-sm text-gray-600">Local stories and books related to the topic</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Create Lesson Plan</h3>
                  <p className="text-gray-500 mb-6">
                    Fill in the lesson details to generate a comprehensive, structured lesson plan with activities,
                    assessments, and resources.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Structured Activities</h4>
                      <p className="text-blue-700">Time-based activities with clear instructions</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Assessment Methods</h4>
                      <p className="text-green-700">Built-in evaluation and homework suggestions</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Extension Ideas</h4>
                      <p className="text-purple-700">Additional activities for advanced learners</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
