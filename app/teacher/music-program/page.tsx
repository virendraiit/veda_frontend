"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Music, Download, RefreshCw, Mic, Volume2, Target, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateStructuredContent } from "@/lib/gemini"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useLanguage } from "@/lib/hooks/useLanguage"

export default function MusicProgramPage() {
  const { t, currentLanguage } = useLanguage()
  const [instrument, setInstrument] = useState("")
  const [skill, setSkill] = useState("")
  const [studentLevel, setStudentLevel] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState("")

  const instruments = [
    { value: "piano", label: "Piano/Keyboard" },
    { value: "guitar", label: "Guitar" },
    { value: "violin", label: "Violin" },
    { value: "flute", label: "Flute" },
    { value: "drums", label: "Drums" },
    { value: "harmonium", label: "Harmonium" },
    { value: "tabla", label: "Tabla" },
    { value: "sitar", label: "Sitar" },
    { value: "vocals", label: "Vocals/Singing" },
    { value: "saxophone", label: "Saxophone" },
    { value: "trumpet", label: "Trumpet" },
    { value: "veena", label: "Veena" },
  ]

  const skills = [
    { value: "fingering", label: "Fingering Technique" },
    { value: "rhythm", label: "Rhythm & Timing" },
    { value: "pitch", label: "Pitch Accuracy" },
    { value: "breathing", label: "Breathing Technique" },
    { value: "posture", label: "Playing Posture" },
    { value: "scales", label: "Scales & Exercises" },
    { value: "expression", label: "Musical Expression" },
    { value: "coordination", label: "Hand Coordination" },
    { value: "tone", label: "Tone Quality" },
    { value: "general", label: "General Technique" },
  ]

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedAudio(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeTechnique = async () => {
    if (!instrument || !skill || !description) {
      alert("Please fill in all required fields")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const prompt = `
        Analyze music technique and provide improvement suggestions for ${instrument} - ${skill}.
        
        Student Level: ${studentLevel || "Beginner"}
        Description: ${description}
        ${uploadedAudio ? "Note: Audio analysis would be performed on the uploaded recording." : ""}
        
        Please provide:
        1. Technique analysis with common issues
        2. Step-by-step correct technique
        3. Specific improvement suggestions
        4. Practice exercises and scales
        5. Timing and rhythm guidance
        6. Progress tracking methods
        7. Equipment and setup recommendations
        8. Common mistakes to avoid
        
        Return as JSON with this structure:
        {
          "instrument": "${instrument}",
          "skill": "${skill}",
          "level": "${studentLevel}",
          "analysis": {
            "currentTechnique": "Analysis of current technique",
            "commonIssues": ["issue1", "issue2"],
            "strengths": ["strength1", "strength2"],
            "areasForImprovement": ["area1", "area2"]
          },
          "correctTechnique": {
            "steps": ["step1", "step2", "step3"],
            "keyPoints": ["point1", "point2"],
            "posture": "Description of correct posture",
            "handPosition": "Hand positioning guidance"
          },
          "improvements": {
            "immediate": ["immediate1", "immediate2"],
            "shortTerm": ["short1", "short2"],
            "longTerm": ["long1", "long2"]
          },
          "exercises": [
            {
              "name": "Exercise name",
              "description": "Exercise description",
              "tempo": "Tempo guidance",
              "duration": "Practice duration"
            }
          ],
          "rhythmGuidance": ["rhythm1", "rhythm2"],
          "equipment": ["equipment1", "equipment2"],
          "progressMetrics": ["metric1", "metric2"],
          "practiceSchedule": {
            "daily": "Daily practice routine",
            "weekly": "Weekly goals",
            "monthly": "Monthly milestones"
          }
        }
      `

      const schema = {
        type: "object",
        properties: {
          instrument: { type: "string" },
          skill: { type: "string" },
          level: { type: "string" },
          analysis: {
            type: "object",
            properties: {
              currentTechnique: { type: "string" },
              commonIssues: { type: "array", items: { type: "string" } },
              strengths: { type: "array", items: { type: "string" } },
              areasForImprovement: { type: "array", items: { type: "string" } },
            },
          },
          correctTechnique: {
            type: "object",
            properties: {
              steps: { type: "array", items: { type: "string" } },
              keyPoints: { type: "array", items: { type: "string" } },
              posture: { type: "string" },
              handPosition: { type: "string" },
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
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                tempo: { type: "string" },
                duration: { type: "string" },
              },
            },
          },
          rhythmGuidance: { type: "array", items: { type: "string" } },
          equipment: { type: "array", items: { type: "string" } },
          progressMetrics: { type: "array", items: { type: "string" } },
          practiceSchedule: {
            type: "object",
            properties: {
              daily: { type: "string" },
              weekly: { type: "string" },
              monthly: { type: "string" },
            },
          },
        },
      }

      const result = await generateStructuredContent(prompt, schema)
      setAnalysisResult(result)
    } catch (err) {
      setError("Failed to analyze music technique. Please try again.")
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadAnalysis = () => {
    if (analysisResult) {
      const content = `
Music Technique Analysis Report
Instrument: ${analysisResult.instrument}
Skill: ${analysisResult.skill}
Level: ${analysisResult.level}

CURRENT TECHNIQUE ANALYSIS:
${analysisResult.analysis.currentTechnique}

STRENGTHS:
${analysisResult.analysis.strengths.map((s: string) => `• ${s}`).join("\n")}

COMMON ISSUES:
${analysisResult.analysis.commonIssues.map((i: string) => `• ${i}`).join("\n")}

AREAS FOR IMPROVEMENT:
${analysisResult.analysis.areasForImprovement.map((a: string) => `• ${a}`).join("\n")}

CORRECT TECHNIQUE:
Posture: ${analysisResult.correctTechnique.posture}
Hand Position: ${analysisResult.correctTechnique.handPosition}

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

PRACTICE EXERCISES:
${analysisResult.exercises
  .map(
    (e: any, i: number) => `
${i + 1}. ${e.name}
   Description: ${e.description}
   Tempo: ${e.tempo}
   Duration: ${e.duration}
`,
  )
  .join("\n")}

RHYTHM GUIDANCE:
${analysisResult.rhythmGuidance.map((r: string) => `• ${r}`).join("\n")}

EQUIPMENT RECOMMENDATIONS:
${analysisResult.equipment.map((e: string) => `• ${e}`).join("\n")}

PROGRESS TRACKING METRICS:
${analysisResult.progressMetrics.map((m: string) => `• ${m}`).join("\n")}

PRACTICE SCHEDULE:
Daily: ${analysisResult.practiceSchedule.daily}
Weekly: ${analysisResult.practiceSchedule.weekly}
Monthly: ${analysisResult.practiceSchedule.monthly}
      `

      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${analysisResult.instrument}-${analysisResult.skill}-analysis.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <LayoutWrapper 
      title="Music Learning Program"
      subtitle="AI-Powered Music Technique Analysis"
      showLoginButton={true}
      logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
      className="bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="w-5 h-5 mr-2 text-cyan-600" />
                Music Technique Analysis
              </CardTitle>
              <CardDescription>
                Upload audio or describe technique for AI analysis and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Instrument *</label>
                  <Select value={instrument} onValueChange={setInstrument}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
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
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audio Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Upload Audio Recording (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadedAudio ? (
                    <div className="space-y-4">
                      <audio src={uploadedAudio} controls className="max-w-full mx-auto" />
                      <p className="text-sm text-gray-600">Audio uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Mic className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">Upload Audio</p>
                        <p className="text-sm text-gray-500">Upload performance recording for AI analysis</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button variant="outline" className="mt-4 bg-transparent" asChild>
                      <span className="cursor-pointer">{uploadedAudio ? "Change Audio" : "Choose Audio"}</span>
                    </Button>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Technique Description *</label>
                <Textarea
                  placeholder="Describe the current technique, any issues observed, or specific areas you want to focus on. Example: Student's finger positioning on piano is incorrect, struggles with rhythm in fast passages, needs improvement in dynamics control."
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
                    Analyze Music Technique
                  </>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-medium text-cyan-900 mb-2">Analyzing Music Technique:</h4>
                  <ul className="text-sm text-cyan-700 space-y-1">
                    <li>✓ Processing technique description</li>
                    <li>🔄 Analyzing rhythm and timing</li>
                    <li>🔄 Evaluating pitch accuracy</li>
                    <li>🔄 Generating practice exercises</li>
                    <li>🔄 Creating improvement plan</li>
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
                  <CardTitle>Music Analysis Results</CardTitle>
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
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                    <TabsTrigger value="schedule">Practice Plan</TabsTrigger>
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
                          Common Issues
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {analysisResult.analysis.commonIssues.map((issue: string, index: number) => (
                            <li key={index}>• {issue}</li>
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
                        <h4 className="font-medium text-purple-800 mb-2">Correct Posture</h4>
                        <p className="text-sm text-purple-700">{analysisResult.correctTechnique.posture}</p>
                      </div>

                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-medium text-indigo-800 mb-2">Hand Position</h4>
                        <p className="text-sm text-indigo-700">{analysisResult.correctTechnique.handPosition}</p>
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

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Rhythm Guidance
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {analysisResult.rhythmGuidance.map((guidance: string, index: number) => (
                            <li key={index}>• {guidance}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="exercises" className="space-y-4">
                    <div className="space-y-4">
                      {analysisResult.exercises.map((exercise: any, index: number) => (
                        <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-medium text-yellow-800 mb-2">{exercise.name}</h4>
                          <p className="text-sm text-yellow-700 mb-2">{exercise.description}</p>
                          <div className="flex space-x-4 text-xs text-yellow-600">
                            <span>
                              <strong>Tempo:</strong> {exercise.tempo}
                            </span>
                            <span>
                              <strong>Duration:</strong> {exercise.duration}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Equipment Recommendations</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {analysisResult.equipment.map((equipment: string, index: number) => (
                            <li key={index}>• {equipment}</li>
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

                  <TabsContent value="schedule" className="space-y-4">
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

                      <div className="bg-cyan-50 p-4 rounded-lg">
                        <h4 className="font-medium text-cyan-800 mb-3">Practice Schedule</h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-cyan-700 text-sm">Daily Practice:</h5>
                            <p className="text-sm text-cyan-600">{analysisResult.practiceSchedule.daily}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-cyan-700 text-sm">Weekly Goals:</h5>
                            <p className="text-sm text-cyan-600">{analysisResult.practiceSchedule.weekly}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-cyan-700 text-sm">Monthly Milestones:</h5>
                            <p className="text-sm text-cyan-600">{analysisResult.practiceSchedule.monthly}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Music Technique Analysis</h3>
                  <p className="text-gray-500 mb-6">
                    Upload an audio recording or describe the technique to get AI-powered analysis and improvement
                    suggestions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <Target className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                      <h4 className="font-medium text-cyan-900 mb-1">Technique Analysis</h4>
                      <p className="text-cyan-700">Identify technique issues and mistakes</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900 mb-1">Improvement Plan</h4>
                      <p className="text-green-700">Get personalized practice suggestions</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Volume2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-900 mb-1">Practice Exercises</h4>
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
  )
}
