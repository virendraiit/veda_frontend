"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, HelpCircle, Lightbulb, BookOpen, RefreshCw, MessageSquare, FileText, Download, Copy, Eye } from "lucide-react"
import Link from "next/link"
import { generateContent } from "@/lib/gemini"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"

interface KnowledgeBasePaper {
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

export default function KnowledgeBasePage() {
  const { toast } = useToast()
  const [question, setQuestion] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [answer, setAnswer] = useState("")
  const [searchHistory, setSearchHistory] = useState<Array<{ question: string; answer: string; timestamp: string }>>([])
  const [error, setError] = useState("")
  
  // Knowledge Base Paper Generation States
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [knowledgeBasePaper, setKnowledgeBasePaper] = useState<KnowledgeBasePaper | null>(null)
  const [activeTab, setActiveTab] = useState('mcq')

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

  const commonQuestions = [
    {
      question: "आकाश निळे का दिसते?",
      questionEn: "Why is the sky blue?",
      category: "Science",
      grade: "3-5",
    },
    {
      question: "पाऊस कसा पडतो?",
      questionEn: "How does it rain?",
      category: "Science",
      grade: "1-3",
    },
    {
      question: "चंद्राचे आकार का बदलतात?",
      questionEn: "Why do moon phases change?",
      category: "Science",
      grade: "4-6",
    },
    {
      question: "गणित का महत्वाचे आहे?",
      questionEn: "Why is mathematics important?",
      category: "Mathematics",
      grade: "All",
    },
    {
      question: "भारतात किती राज्ये आहेत?",
      questionEn: "How many states are in India?",
      category: "Social Studies",
      grade: "4-8",
    },
    {
      question: "झाडे कशी श्वास घेतात?",
      questionEn: "How do trees breathe?",
      category: "Science",
      grade: "3-6",
    },
    {
      question: "पृथ्वी कशी फिरते?",
      questionEn: "How does Earth rotate?",
      category: "Science",
      grade: "4-7",
    },
    {
      question: "भाषा कशी शिकावी?",
      questionEn: "How to learn a language?",
      category: "Language",
      grade: "All",
    },
  ]

  const handleSearch = async (searchQuestion?: string) => {
    const queryQuestion = searchQuestion || question
    if (!queryQuestion.trim()) {
      alert("Please enter a question")
      return
    }

    setIsSearching(true)
    setError("")

    try {
      const prompt = `
        You are an AI teaching assistant for Indian schools. A student or teacher has asked: "${queryQuestion}"
        
        Please provide a comprehensive answer that includes:
        
        1. **Simple Explanation**: A clear, easy-to-understand explanation suitable for school children
        2. **Examples**: Use analogies and examples from daily Indian life and culture
        3. **Step-by-Step Breakdown**: Break down complex concepts into simple steps
        4. **Cultural Context**: Include relevant Indian cultural context where appropriate
        5. **Fun Fact**: Add an interesting or surprising detail related to the topic
        6. **Learning Activity**: Suggest a simple activity, experiment, or game to reinforce learning
        7. **Related Questions**: Suggest 2-3 related questions students might ask
        
        Use both English and Hindi/Marathi terms where helpful. Keep the language simple and age-appropriate.
        Make the response engaging and educational for children aged 6-16.
        
        Format your response with clear headings and bullet points for easy reading.
      `

      const result = await generateContent(prompt)
      setAnswer(result)

      const timestamp = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      setSearchHistory((prev) => [{ question: queryQuestion, answer: result, timestamp }, ...prev.slice(0, 9)])
      setQuestion("")
    } catch (err) {
      setError("Failed to get answer. Please check your internet connection and try again.")
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const copyAnswer = () => {
    if (answer) {
      navigator.clipboard.writeText(answer)
      alert("Answer copied to clipboard!")
    }
  }

  const shareAnswer = () => {
    if (answer && navigator.share) {
      navigator
        .share({
          title: "Educational Answer",
          text: answer,
        })
        .catch(console.error)
    } else {
      copyAnswer()
    }
  }

  const generateKnowledgeBase = async () => {
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
    setKnowledgeBasePaper(null)

    try {
      const response = await fetch('/api/generate-knowledge-base', {
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
        setKnowledgeBasePaper(result.data)
      } else {
        throw new Error(result.error || 'Failed to generate knowledge base')
      }
      
      toast({
        title: "Success!",
        description: "Knowledge base generated successfully",
      })
    } catch (err) {
      console.error('Error generating knowledge base:', err)
      setError('Failed to generate knowledge base. The backend API might not be available.')
      
      toast({
        title: "API Unavailable",
        description: "Backend API is not available. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!knowledgeBasePaper) return
    
    const paperText = generatePaperText(knowledgeBasePaper, topic, grade)
    navigator.clipboard.writeText(paperText)
    
    toast({
      title: "Copied!",
      description: "Knowledge base copied to clipboard",
    })
  }

  const generatePaperText = (paper: KnowledgeBasePaper, topic: string, grade: string) => {
    let text = `KNOWLEDGE BASE - ${topic.toUpperCase()}\n`
    text += `Grade: ${grade}\n`
    text += `Generated with Answers\n\n`

    text += `Section A: Multiple Choice Questions\n`
    paper.mcq.forEach((q, i) => {
      text += `Q${i + 1}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `a) ${q.options[0].a}\n`
      text += `b) ${q.options[0].b}\n`
      text += `c) ${q.options[0].c}\n`
      text += `d) ${q.options[0].d}\n`
      text += `Answer: ${q.answer}\n\n`
    })

    text += `Section B: Short Answer Questions\n`
    paper.short_q.forEach((q, i) => {
      text += `Q${i + 11}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `Answer: ${q.answer}\n\n`
    })

    text += `Section C: Medium Answer Questions\n`
    paper.mid_q.forEach((q, i) => {
      text += `Q${i + 21}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `Answer: ${q.answer}\n\n`
    })

    text += `Section D: Long Answer Questions\n`
    paper.long_q.forEach((q, i) => {
      text += `Q${i + 26}. ${q.question} [${q.marks} Mark${q.marks > 1 ? 's' : ''}]\n`
      text += `Answer: ${q.answer}\n\n`
    })

    return text
  }

  return (
    <ProtectedRoute>
      <LayoutWrapper
        title="Intelligent Knowledge Base Q&A"
        subtitle="AI-Powered Question & Answer System"
        showLoginButton={true}
        logoHref="/"
        className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen"
      >

        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-purple-600" />
                Ask Any Question
              </CardTitle>
              <CardDescription>
                Get simple, accurate explanations for student questions in your local language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Type your question in any language / कोणताही प्रश्न विचारा"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isSearching && handleSearch()}
                  className="flex-1"
                  disabled={isSearching}
                />
                <Button onClick={() => handleSearch()} disabled={isSearching || !question.trim()} size="lg">
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-800 text-sm flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              {isSearching && (
                <div className="bg-purple-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-purple-900 mb-2">Searching for Answer:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✓ Processing your question</li>
                    <li>🔄 Consulting knowledge base</li>
                    <li>🔄 Creating simple explanation</li>
                    <li>🔄 Adding examples and activities</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Knowledge Base Generation Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Generate Knowledge Base with Answers
              </CardTitle>
              <CardDescription>
                Create comprehensive question papers with answers for any topic and grade level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <div className="flex items-end">
                  <Button
                    onClick={generateKnowledgeBase}
                    disabled={!topic.trim() || !grade || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Knowledge Base
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isGenerating && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Generating Knowledge Base:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Analyzing topic requirements</li>
                    <li>🔄 Creating multiple choice questions with answers</li>
                    <li>🔄 Generating short answer questions with answers</li>
                    <li>🔄 Preparing medium answer questions with answers</li>
                    <li>🔄 Crafting long answer questions with answers</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Common Questions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Common Questions
                </CardTitle>
                <CardDescription>Frequently asked questions by students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {commonQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSearch(q.question)}
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1">{q.question}</div>
                      <div className="text-xs text-gray-600 mb-2">{q.questionEn}</div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {q.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Grade {q.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Answer Display */}
            <div className="lg:col-span-2">
              {answer ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                          Answer
                        </CardTitle>
                        <CardDescription>Simple explanation with examples and activities</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyAnswer}>
                          <BookOpen className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareAnswer}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{answer}</pre>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg mt-4">
                      <h4 className="font-medium text-green-800 mb-2">How to Use This Answer:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Read the explanation to students in simple terms</li>
                        <li>• Try the suggested activity or experiment</li>
                        <li>• Ask the related questions to encourage discussion</li>
                        <li>• Adapt the content for your specific grade level</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Answer Questions & Generate Papers</h3>
                    <p className="text-gray-500 mb-6">
                      Ask any question for instant answers, or generate comprehensive question papers with answers for any topic and grade level.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Instant Q&A</h4>
                        <p className="text-blue-700">Get immediate answers to any educational question</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Paper Generation</h4>
                        <p className="text-green-700">Create comprehensive question papers with answers</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-2">Multiple Formats</h4>
                        <p className="text-yellow-700">MCQ, short, medium, and long answer questions</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Grade Specific</h4>
                        <p className="text-purple-700">Content tailored for different grade levels</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Questions</CardTitle>
                    <CardDescription>Your recent searches and answers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {searchHistory.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm text-gray-900">{item.question}</div>
                            <span className="text-xs text-gray-500">{item.timestamp}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAnswer(item.answer)}
                            className="text-xs text-blue-600 p-0 h-auto"
                          >
                            View Answer →
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Knowledge Base Results */}
              {knowledgeBasePaper && (
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Knowledge Base</CardTitle>
                        <CardDescription>Topic: {topic} | Grade: {grade} | With Answers</CardDescription>
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="mcq">MCQ ({knowledgeBasePaper.mcq.length})</TabsTrigger>
                        <TabsTrigger value="short">Short ({knowledgeBasePaper.short_q.length})</TabsTrigger>
                        <TabsTrigger value="mid">Medium ({knowledgeBasePaper.mid_q.length})</TabsTrigger>
                        <TabsTrigger value="long">Long ({knowledgeBasePaper.long_q.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="mcq" className="mt-6">
                        <div className="space-y-6">
                          {knowledgeBasePaper.mcq.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold">Q{i + 1}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="space-y-2 ml-4 mb-4">
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
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-1">Answer:</div>
                                <div className="text-green-700">{q.answer}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="short" className="mt-6">
                        <div className="space-y-6">
                          {knowledgeBasePaper.short_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold">Q{i + 11}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-1">Answer:</div>
                                <div className="text-green-700">{q.answer}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="mid" className="mt-6">
                        <div className="space-y-6">
                          {knowledgeBasePaper.mid_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold">Q{i + 21}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-1">Answer:</div>
                                <div className="text-green-700">{q.answer}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="long" className="mt-6">
                        <div className="space-y-6">
                          {knowledgeBasePaper.long_q.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold">Q{i + 26}. {q.question}</h4>
                                <Badge variant="secondary">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-1">Answer:</div>
                                <div className="text-green-700">{q.answer}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
