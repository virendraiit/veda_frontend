"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Mic, MicOff, RotateCcw, CheckCircle, AlertCircle, Volume2, Globe } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReadingAssessmentPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("3-5")
  const [selectedLanguage, setSelectedLanguage] = useState("marathi")
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const languages = [
    { value: "marathi", label: "मराठी (Marathi)" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "english", label: "English" },
  ]

  const readingTexts = {
    marathi: {
      "1-2": {
        title: "माझा मित्र",
        titleEn: "My Friend",
        text: "राम माझा चांगला मित्र आहे. तो रोज शाळेत येतो. आम्ही एकत्र खेळतो. त्याला फुटबॉल खेळायला आवडते. आम्ही एकमेकांना मदत करतो.",
        difficulty: "Beginner",
        expectedWPM: "30-50",
        totalWords: 25,
      },
      "3-5": {
        title: "पर्यावरण संरक्षण",
        titleEn: "Environmental Protection",
        text: "आपल्या पृथ्वीचे संरक्षण करणे हे आपले कर्तव्य आहे. झाडे लावणे, पाणी वाचवणे, कचरा योग्य ठिकाणी टाकणे यासारख्या छोट्या गोष्टींमुळे मोठा फरक पडतो. प्रत्येक व्यक्तीने पर्यावरणाची काळजी घेतली पाहिजे. तरच आपली भावी पिढी सुरक्षित राहील.",
        difficulty: "Intermediate",
        expectedWPM: "60-80",
        totalWords: 45,
      },
      "6-8": {
        title: "विज्ञान आणि तंत्रज्ञान",
        titleEn: "Science and Technology",
        text: "आजच्या युगात विज्ञान आणि तंत्रज्ञानाचा वेगवान विकास होत आहे. संगणक, मोबाईल फोन, इंटरनेट यांनी आपले जीवन सोपे केले आहे. परंतु या तंत्रज्ञानाचा योग्य वापर करणे महत्वाचे आहे. शिक्षणाच्या क्षेत्रात तंत्रज्ञानामुळे नवीन शक्यता निर्माण झाल्या आहेत. विद्यार्थी आता घरबसल्या जगभरातील ज्ञान मिळवू शकतात.",
        difficulty: "Advanced",
        expectedWPM: "80-120",
        totalWords: 65,
      },
    },
    hindi: {
      "1-2": {
        title: "मेरा दोस्त",
        titleEn: "My Friend",
        text: "राम मेरा अच्छा दोस्त है। वह रोज स्कूल आता है। हम साथ खेलते हैं। उसे फुटबॉल खेलना पसंद है। हम एक दूसरे की मदद करते हैं।",
        difficulty: "Beginner",
        expectedWPM: "30-50",
        totalWords: 25,
      },
      "3-5": {
        title: "पर्यावरण संरक्षण",
        titleEn: "Environmental Protection",
        text: "हमारी पृथ्वी की रक्षा करना हमारा कर्तव्य है। पेड़ लगाना, पानी बचाना, कचरा सही जगह डालना जैसी छोटी बातों से बड़ा फर्क पड़ता है। हर व्यक्ति को पर्यावरण की देखभाल करनी चाहिए। तभी हमारी आने वाली पीढ़ी सुरक्षित रहेगी।",
        difficulty: "Intermediate",
        expectedWPM: "60-80",
        totalWords: 45,
      },
      "6-8": {
        title: "विज्ञान और प्रौद्योगिकी",
        titleEn: "Science and Technology",
        text: "आज के युग में विज्ञान और प्रौद्योगिकी का तेज़ विकास हो रहा है। कंप्यूटर, मोबाइल फोन, इंटरनेट ने हमारा जीवन आसान बना दिया है। लेकिन इस तकनीक का सही उपयोग करना महत्वपूर्ण है। शिक्षा के क्षेत्र में तकनीक से नई संभावनाएं पैदा हुई हैं। छात्र अब घर बैठे दुनिया भर का ज्ञान प्राप्त कर सकते हैं।",
        difficulty: "Advanced",
        expectedWPM: "80-120",
        totalWords: 65,
      },
    },
    english: {
      "1-2": {
        title: "My Friend",
        titleEn: "My Friend",
        text: "Ram is my good friend. He comes to school every day. We play together. He likes to play football. We help each other.",
        difficulty: "Beginner",
        expectedWPM: "30-50",
        totalWords: 25,
      },
      "3-5": {
        title: "Environmental Protection",
        titleEn: "Environmental Protection",
        text: "Protecting our Earth is our duty. Small things like planting trees, saving water, and throwing garbage in the right place make a big difference. Every person should take care of the environment. Only then will our future generations be safe.",
        difficulty: "Intermediate",
        expectedWPM: "60-80",
        totalWords: 45,
      },
      "6-8": {
        title: "Science and Technology",
        titleEn: "Science and Technology",
        text: "In today's age, science and technology are developing rapidly. Computers, mobile phones, and the internet have made our lives easier. However, it is important to use this technology properly. Technology has created new possibilities in the field of education. Students can now gain knowledge from around the world while sitting at home.",
        difficulty: "Advanced",
        expectedWPM: "80-120",
        totalWords: 65,
      },
    },
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      analyzeReading()
    }
  }

  const analyzeReading = () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const currentTextData = getCurrentTextData()
      const wpm = Math.floor(Math.random() * 40) + 60 // Simulate WPM calculation
      const accuracy = Math.floor(Math.random() * 20) + 80 // Simulate accuracy

      const results = {
        wpm: wpm,
        accuracy: accuracy,
        fluency: wpm > 70 ? "Good" : wpm > 50 ? "Average" : "Needs Improvement",
        totalWords: currentTextData.totalWords,
        readingTime: recordingTime,
        strengths: [
          "Clear pronunciation of consonants",
          "Good pace in simple sentences",
          "Proper pauses at punctuation",
        ],
        improvements: [
          "Work on complex word pronunciation",
          "Practice reading with expression",
          "Focus on maintaining consistent pace",
        ],
        recommendations: [
          "Practice reading aloud for 10 minutes daily",
          "Read stories with family members",
          "Use finger tracking while reading",
        ],
      }

      setAssessmentResults(results)
      setIsAnalyzing(false)
    }, 3000)
  }

  const resetAssessment = () => {
    setAssessmentResults(null)
    setAudioBlob(null)
    setRecordingTime(0)
    setCurrentText("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentTextData = () => {
    return readingTexts[selectedLanguage as keyof typeof readingTexts][
      selectedGrade as keyof typeof readingTexts.marathi
    ]
  }

  const currentTextData = getCurrentTextData()

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
                <h1 className="text-xl font-bold text-gray-900">वाचन मूल्यांकन</h1>
                <p className="text-sm text-gray-600">Reading Assessment</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800">
              <Mic className="w-4 h-4 mr-1" />
              Speech Recognition
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reading Text Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Volume2 className="w-5 h-5 mr-2 text-red-600" />
                    Reading Passage
                  </CardTitle>
                  <CardDescription>Read the text aloud clearly and at a comfortable pace</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            {lang.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">Grade 1-2</SelectItem>
                      <SelectItem value="3-5">Grade 3-5</SelectItem>
                      <SelectItem value="6-8">Grade 6-8</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline">{currentTextData.difficulty}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentTextData.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{currentTextData.titleEn}</p>
                <div className="text-lg leading-relaxed text-gray-800 font-serif">{currentTextData.text}</div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-500">Words: {currentTextData.totalWords}</span>
                  <span className="text-sm text-gray-500">Expected WPM: {currentTextData.expectedWPM}</span>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} size="lg" variant="destructive">
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  <Button onClick={resetAssessment} variant="outline" size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono text-red-600 mb-2">{formatTime(recordingTime)}</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Recording in progress...</span>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Analyzing your reading...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Assessment Results
              </CardTitle>
              <CardDescription>Detailed analysis of reading performance</CardDescription>
            </CardHeader>
            <CardContent>
              {assessmentResults ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{assessmentResults.wpm}</div>
                        <div className="text-sm text-blue-800">Words per Minute</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{assessmentResults.accuracy}%</div>
                        <div className="text-sm text-green-800">Accuracy</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Reading Fluency</span>
                        <span className="font-medium">{assessmentResults.fluency}</span>
                      </div>
                      <Progress
                        value={
                          assessmentResults.fluency === "Good" ? 85 : assessmentResults.fluency === "Average" ? 60 : 35
                        }
                        className="h-2"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Reading Statistics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Words:</span>
                          <span>{assessmentResults.totalWords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reading Time:</span>
                          <span>{formatTime(assessmentResults.readingTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grade Level:</span>
                          <span>{selectedGrade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Language:</span>
                          <span>{languages.find((l) => l.value === selectedLanguage)?.label}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {assessmentResults.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {assessmentResults.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                            • {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {assessmentResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-700 mb-2">Ready to Assess</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select your language and grade level, then click "Start Recording" to read the passage aloud.
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg text-left">
                    <h4 className="font-medium text-yellow-800 mb-1">Tips for Best Results:</h4>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Find a quiet environment</li>
                      <li>• Speak clearly and naturally</li>
                      <li>• Read at a comfortable pace</li>
                      <li>• Don't rush through the text</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
