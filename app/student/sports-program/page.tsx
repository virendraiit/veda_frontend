"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Download, RefreshCw, Video, Target, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateStructuredContent } from "@/lib/gemini"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function StudentSportsProgramPage() {
  const { t, currentLanguage } = useLanguage()
  const [sport, setSport] = useState("")
  const [skill, setSkill] = useState("")
  const [studentLevel, setStudentLevel] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState("")

  const sports = [
    { value: "cricket", label: "Cricket" },
    { value: "football", label: "Football/Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "badminton", label: "Badminton" },
    { value: "tennis", label: "Tennis" },
    { value: "volleyball", label: "Volleyball" },
    { value: "athletics", label: "Athletics/Track & Field" },
    { value: "swimming", label: "Swimming" },
    { value: "kabaddi", label: "Kabaddi" },
    { value: "hockey", label: "Hockey" },
  ]

  const skills = [
    { value: "batting", label: "Batting Technique" },
    { value: "bowling", label: "Bowling Technique" },
    { value: "fielding", label: "Fielding Position" },
    { value: "shooting", label: "Shooting/Scoring" },
    { value: "passing", label: "Passing Technique" },
    { value: "dribbling", label: "Dribbling Skills" },
    { value: "serving", label: "Serving Technique" },
    { value: "footwork", label: "Footwork & Movement" },
    { value: "defense", label: "Defensive Position" },
    { value: "general", label: "General Technique" },
  ]

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedVideo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeTechnique = async () => {
    if (!sport || !skill || !description) {
      alert("Please fill in all required fields")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const prompt = `
        Analyze sports technique and provide improvement suggestions for ${sport} - ${skill}.
        
        Student Level: ${studentLevel || "Beginner"}
        Description: ${description}
        ${uploadedVideo ? "Note: Video analysis would be performed on the uploaded video." : ""}
        
        Please provide:
        1. Technique analysis with common mistakes
        2. Step-by-step correct technique
        3. Specific improvement suggestions
        4. Practice drills and exercises
        5. Safety considerations
        6. Progress tracking metrics
        7. Equipment recommendations
        8. Common errors to avoid
        
        Return as JSON with this structure:
        {
          "sport": "${sport}",
          "skill": "${skill}",
          "level": "${studentLevel}",
          "analysis": {
            "currentTechnique": "Analysis of current technique",
            "commonMistakes": ["mistake1", "mistake2"],
            "strengths": ["strength1", "strength2"],
            "areasForImprovement": ["area1", "area2"]
          },
          "correctTechnique": {
            "steps": ["step1", "step2", "step3"],
            "keyPoints": ["point1", "point2"],
            "bodyPosition": "Description of correct body position"
          },
          "improvements": {
            "immediate": ["immediate1", "immediate2"],
            "shortTerm": ["short1", "short2"],
            "longTerm": ["long1", "long2"]
          },
          "drills": [
            {
              "name": "Drill name",
              "description": "Drill description",
              "duration": "Duration",
              "repetitions": "Reps"
            }
          ],
          "safety": ["safety1", "safety2"],
          "equipment": ["equipment1", "equipment2"],
          "progressMetrics": ["metric1", "metric2"]
        }
      `

      const schema = {
        type: "object",
        properties: {
          sport: { type: "string" },
          skill: { type: "string" },
          level: { type: "string" },
          analysis: {
            type: "object",
            properties: {
              currentTechnique: { type: "string" },
              commonMistakes: { type: "array", items: { type: "string" } },
              strengths: { type: "array", items: { type: "string" } },
              areasForImprovement: { type: "array", items: { type: "string" } },
            },
          },
          correctTechnique: {
            type: "object",
            properties: {
              steps: { type: "array", items: { type: "string" } },
              keyPoints: { type: "array", items: { type: "string" } },
              bodyPosition: { type: "string" },
            },
          },
          improvements: {
            type: "object",
            properties: {
              immediate: { type: "array", items: { type: "string" } },
              shortTerm: { type: "array", items: { type: "string" } },
              longTerm: { type: "array", items: { type: "string" } },
            },
          },
          drills: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                duration: { type: "string" },
                repetitions: { type: "string" },
              },
            },
          },
          safety: { type: "array", items: { type: "string" } },
          equipment: { type: "array", items: { type: "string" } },
          progressMetrics: { type: "array", items: { type: "string" } },
        },
      }

      const result = await generateStructuredContent(prompt, schema)
      setAnalysisResult(result)
    } catch (err) {
      setError("Failed to analyze technique. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadAnalysis = () => {
    if (analysisResult) {
      const content = `
Sports Technique Analysis Report
Sport: ${analysisResult.sport}
Skill: ${analysisResult.skill}
Level: ${analysisResult.level}

CURRENT TECHNIQUE ANALYSIS:
${analysisResult.analysis.currentTechnique}

STRENGTHS:
${analysisResult.analysis.strengths.map((s: string) => `• ${s}`).join("\n")}

COMMON MISTAKES:
${analysisResult.analysis.commonMistakes.map((m: string) => `• ${m}`).join("\n")}

AREAS FOR IMPROVEMENT:
${analysisResult.analysis.areasForImprovement.map((a: string) => `• ${a}`).join("\n")}

CORRECT TECHNIQUE:
Body Position: ${analysisResult.correctTechnique.bodyPosition}

Steps:
${analysisResult.correctTechnique.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}

Key Points:
${analysisResult.correctTechnique.keyPoints.map((p: string) => `• ${p}`).join("\n")}

IMPROVEMENT PLAN:
Immediate Actions:
${analysisResult.improvements.immediate.map((i: string) => `• ${i}`).join("\n")}

Short-term Goals:
${analysisResult.improvements.shortTerm.map((s: string) => `• ${s}`).join("\n")}

Long-term Goals:
${analysisResult.improvements.longTerm.map((l: string) => `• ${l}`).join("\n")}

PRACTICE DRILLS:
${analysisResult.drills
  .map(
    (d: any, i: number) => `
${i + 1}. ${d.name}
   Description: ${d.description}
   Duration: ${d.duration}
   Repetitions: ${d.repetitions}
`,
  )
  .join("\n")}

SAFETY CONSIDERATIONS:
${analysisResult.safety.map((s: string) => `• ${s}`).join("\n")}

EQUIPMENT RECOMMENDATIONS:
${analysisResult.equipment.map((e: string) => `• ${e}`).join("\n")}

PROGRESS TRACKING METRICS:
${analysisResult.progressMetrics.map((m: string) => `• ${m}`).join("\n")}
      `

      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${analysisResult.sport}-${analysisResult.skill}-analysis.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <ProtectedRoute userType="student">
      <LayoutWrapper 
        title="Sports Program Assistant"
        subtitle="AI-Powered Sports Technique Analysis"
        showLoginButton={true}
        logoHref={`/student/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-teal-600" />
                  Technique Analysis
                </CardTitle>
                <CardDescription>
                  Upload video or describe technique for AI analysis and improvement suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sport *</label>
                    <Select value={sport} onValueChange={setSport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Skill/Technique *</label>
                    <Select value={skill} onValueChange={setSkill}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Student Level</label>
                  <Select value={studentLevel} onValueChange={setStudentLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="competitive">Competitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Technique Video (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {uploadedVideo ? (
                      <div className="space-y-4">
                        <video src={uploadedVideo} controls className="max-w-full h-48 mx-auto rounded" />
                        <p className="text-sm text-gray-600">Video uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Video className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">Upload Video</p>
                          <p className="text-sm text-gray-500">Upload technique video for AI analysis</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload">
                      <Button variant="outline" className="mt-4 bg-transparent" asChild>
                        <span className="cursor-pointer">{uploadedVideo ? "Change Video" : "Choose Video"}</span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Technique Description *</label>
                  <Textarea
                    placeholder="Describe the current technique, any issues observed, or specific areas you want to focus on. Example: Student's batting stance is too wide, struggles with timing on fast balls, needs improvement in follow-through."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button onClick={analyzeTechnique} disabled={isAnalyzing} className="w-full" size="lg">
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Technique...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Analyze Technique
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-teal-900 mb-2">Analyzing Sports Technique:</h4>
                    <ul className="text-sm text-teal-700 space-y-1">
                      <li>✓ Processing technique description</li>
                      <li>🔄 Identifying common mistakes</li>
                      <li>🔄 Generating improvement suggestions</li>
                      <li>🔄 Creating practice drills</li>
                      <li>🔄 Preparing safety guidelines</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Technique Analysis Results</CardTitle>
                    <CardDescription>AI-powered analysis with improvement recommendations</CardDescription>
                  </div>
                  {analysisResult && (
                    <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                      <Download className="w-4 h-4 mr-1" />
                      Download Report
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="technique">Correct Form</TabsTrigger>
                      <TabsTrigger value="drills">Practice Drills</TabsTrigger>
                      <TabsTrigger value="progress">Progress Plan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="space-y-4">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Current Technique Analysis
                          </h4>
                          <p className="text-sm text-blue-700">{analysisResult.analysis.currentTechnique}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {analysisResult.analysis.strengths.map((strength: string, index: number) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Common Mistakes
                          </h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {analysisResult.analysis.commonMistakes.map((mistake: string, index: number) => (
                              <li key={index}>• {mistake}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800 mb-2">Areas for Improvement</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            {analysisResult.analysis.areasForImprovement.map((area: string, index: number) => (
                              <li key={index}>• {area}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="technique" className="space-y-4">
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">Correct Body Position</h4>
                          <p className="text-sm text-purple-700">{analysisResult.correctTechnique.bodyPosition}</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-3">Step-by-Step Technique</h4>
                          <ol className="text-sm text-blue-700 space-y-2">
                            {analysisResult.correctTechnique.steps.map((step: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Key Points to Remember</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {analysisResult.correctTechnique.keyPoints.map((point: string, index: number) => (
                              <li key={index}>• {point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="drills" className="space-y-4">
                      <div className="space-y-4">
                        {analysisResult.drills.map((drill: any, index: number) => (
                          <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-800 mb-2">{drill.name}</h4>
                            <p className="text-sm text-yellow-700 mb-2">{drill.description}</p>
                            <div className="flex space-x-4 text-xs text-yellow-600">
                              <span>
                                <strong>Duration:</strong> {drill.duration}
                              </span>
                              <span>
                                <strong>Repetitions:</strong> {drill.repetitions}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Safety Considerations
                          </h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {analysisResult.safety.map((safety: string, index: number) => (
                              <li key={index}>• {safety}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Equipment Recommendations</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {analysisResult.equipment.map((equipment: string, index: number) => (
                              <li key={index}>• {equipment}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-4">
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Immediate Actions (This Week)</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {analysisResult.improvements.immediate.map((action: string, index: number) => (
                              <li key={index}>• {action}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Short-term Goals (1-2 Months)</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {analysisResult.improvements.shortTerm.map((goal: string, index: number) => (
                              <li key={index}>• {goal}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">Long-term Goals (3-6 Months)</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            {analysisResult.improvements.longTerm.map((goal: string, index: number) => (
                              <li key={index}>• {goal}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium text-orange-800 mb-2">Progress Tracking Metrics</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            {analysisResult.progressMetrics.map((metric: string, index: number) => (
                              <li key={index}>• {metric}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Sports Technique Analysis</h3>
                    <p className="text-gray-500 mb-6">
                      Upload a video or describe the technique to get AI-powered analysis and improvement suggestions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <Target className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                        <h4 className="font-medium text-teal-900 mb-1">Technique Analysis</h4>
                        <p className="text-teal-700">Identify wrong techniques and mistakes</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-green-900 mb-1">Improvement Plan</h4>
                        <p className="text-green-700">Get personalized improvement suggestions</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <Dumbbell className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-blue-900 mb-1">Practice Drills</h4>
                        <p className="text-blue-700">Specific exercises to improve skills</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
} 