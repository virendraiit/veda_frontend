"use client"

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, RefreshCw, Eye, Printer, Copy } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import QuestionPaperPDF from "@/components/question-paper-pdf"
import QuestionPaperDemo from "@/components/question-paper-demo"

interface QuestionPaper {
  mcq: Array<{
    question: string;
    options: Array<{
      a: string;
      b: string;
      c: string;
      d: string;
    }>;
    answer: string;
    marks: number;
  }>;
  short_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
  mid_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
  long_q: Array<{
    question: string;
    answer: string;
    marks: number;
  }>;
}

const QuestionPaperGeneratorPage = () => {
  const { currentLanguage } = useLanguage()
  const { user, userProfile } = useAuthContext()
  const { toast } = useToast()
  
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('mcq')
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  const gradeOptions = [
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
  ]

  const generateQuestionPaper = async () => {
    if (!topic.trim() || !grade) {
      toast({
        title: "Validation Error",
        description: "Please fill in both topic and grade",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError('')
    setQuestionPaper(null)

    try {
      const response = await fetch('/api/generate-question-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          grade: grade
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setQuestionPaper(result.data)
      } else {
        throw new Error(result.error || 'Failed to generate question paper')
      }
      
      toast({
        title: "Success!",
        description: "Question paper generated successfully",
      })
    } catch (err) {
      console.error('Error generating question paper:', err)
      setError('Failed to generate question paper. The backend API might not be available.')
      
      // Show demo option when API fails
      toast({
        title: "API Unavailable",
        description: "Backend API is not available. Would you like to see a demo?",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemoModal(true)}
            className="ml-2"
          >
            View Demo
          </Button>
        ),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAsPDF = () => {
    setShowPDFModal(true)
  }



  const copyToClipboard = () => {
    if (!questionPaper) return
    
    const paperText = generatePaperText(questionPaper, topic, grade)
    navigator.clipboard.writeText(paperText)
    
    toast({
      title: "Copied!",
      description: "Question paper copied to clipboard",
    })
  }

  const generatePaperText = (paper: QuestionPaper, topic: string, grade: string) => {
    let text = `QUESTION PAPER\n`
    text += `Topic: ${topic}\n`
    text += `Grade: ${grade}\n`
    text += `Time: 2 Hours\n\n`

    text += `Section A: Multiple Choice Questions\n`
    paper.mcq.forEach((q, i) => {
      text += `Q${i + 1}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `a) ${q.options[0].a}\n`
      text += `b) ${q.options[0].b}\n`
      text += `c) ${q.options[0].c}\n`
      text += `d) ${q.options[0].d}\n\n`
    })

    text += `Section B: Short Answer Questions\n`
    paper.short_q.forEach((q, i) => {
      text += `Q${i + 11}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    text += `Section C: Medium Answer Questions\n`
    paper.mid_q.forEach((q, i) => {
      text += `Q${i + 21}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    text += `Section D: Long Answer Questions\n`
    paper.long_q.forEach((q, i) => {
      text += `Q${i + 26}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n\n`
    })

    return text
  }

  return (
    <ProtectedRoute>
      <LayoutWrapper
        title="Question Paper Generator"
        subtitle="AI-Powered Question Paper Creation"
        showLoginButton={true}
        logoHref="/"
        className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Paper Specifications
                </CardTitle>
                <CardDescription>Define the topic and grade for your question paper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Topic *</label>
                  <Input
                    placeholder="e.g., Honesty, Water Cycle, Fractions"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Grade Level *</label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((gradeOption) => (
                        <SelectItem key={gradeOption.value} value={gradeOption.value}>
                          {gradeOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateQuestionPaper}
                  disabled={!topic.trim() || !grade || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Paper...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Question Paper
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowDemoModal(true)}
                  disabled={!topic.trim() || !grade}
                  className="w-full"
                  size="lg"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Demo Paper
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Generating Question Paper:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Analyzing topic requirements</li>
                      <li>🔄 Creating multiple choice questions</li>
                      <li>🔄 Generating short answer questions</li>
                      <li>🔄 Preparing medium answer questions</li>
                      <li>🔄 Crafting long answer questions</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {questionPaper ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Question Paper</CardTitle>
                        <CardDescription>Topic: {topic} | Grade: {grade}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                                                 <Button
                           variant="outline"
                           size="sm"
                           onClick={downloadAsPDF}
                         >
                           <Download className="w-4 h-4 mr-2" />
                           Generate PDF
                         </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="mcq">MCQ ({questionPaper.mcq.length})</TabsTrigger>
                        <TabsTrigger value="short">Short ({questionPaper.short_q.length})</TabsTrigger>
                        <TabsTrigger value="mid">Medium ({questionPaper.mid_q.length})</TabsTrigger>
                        <TabsTrigger value="long">Long ({questionPaper.long_q.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="mcq" className="mt-6">
                        <div className="space-y-6">
                          {questionPaper.mcq.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold">Q{i + 1}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="space-y-2 ml-4">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">a)</span>
                                  <span>{q.options[0].a}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">b)</span>
                                  <span>{q.options[0].b}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">c)</span>
                                  <span>{q.options[0].c}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">d)</span>
                                  <span>{q.options[0].d}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="short" className="mt-6">
                        <div className="space-y-6">
                          {questionPaper.short_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">Q{i + 11}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="mid" className="mt-6">
                        <div className="space-y-6">
                          {questionPaper.mid_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">Q{i + 21}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="long" className="mt-6">
                        <div className="space-y-6">
                          {questionPaper.long_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold">Q{i + 26}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate Question Paper</h3>
                    <p className="text-gray-500 mb-6">
                      Enter a topic and select a grade level to create a comprehensive question paper with multiple sections.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">MCQ Section</h4>
                        <p className="text-blue-700">10 multiple choice questions with 4 options each</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Short Questions</h4>
                        <p className="text-green-700">10 short answer questions (2 marks each)</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Medium Questions</h4>
                        <p className="text-purple-700">5 medium answer questions (3 marks each)</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Long Questions</h4>
                        <p className="text-orange-700">5 long answer questions (5 marks each)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
                 </div>
       </LayoutWrapper>
       
       {/* PDF Modal */}
       {showPDFModal && questionPaper && (
         <QuestionPaperPDF
           paper={questionPaper}
           topic={topic}
           grade={grade}
           onClose={() => setShowPDFModal(false)}
         />
       )}

       {/* Demo Modal */}
       {showDemoModal && (
         <QuestionPaperDemo
           topic={topic}
           grade={grade}
           onClose={() => setShowDemoModal(false)}
         />
       )}
     </ProtectedRoute>
   );
 };

export default QuestionPaperGeneratorPage; 