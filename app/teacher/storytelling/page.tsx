"use client"

import React, { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Pause, RotateCcw, Volume2, Users, Target, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { generateStory, resetStory, setNarrating, setStoryData } from "@/lib/slices/storySlice"
import type { StoryResponse } from '@/lib/services/storyApi'
import { useLanguage } from "@/lib/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { ButtonLoader, LoadingSpinner, ProgressLoader } from "@/components/ui/loading"

export default function StorytellingPage() {
  const dispatch = useAppDispatch()
  const { t, currentLanguage } = useLanguage()
  const { storyData, isLoading, error, isNarrating, currentSection } = useAppSelector((state) => state.story)
  
  const [topic, setTopic] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [language, setLanguage] = useState("bilingual")
  const [storyLength, setStoryLength] = useState("medium")
  const [validationErrors, setValidationErrors] = useState({
    topic: false,
    ageGroup: false,
    language: false,
  })

  // For audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  // For worksheet answers (optional, can be extended)
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, string>>({})

  // For image loading state
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const ageGroups = [
    { value: "3-5", label: "Ages 3-5 (Preschool)" },
    { value: "6-8", label: "Ages 6-8 (Primary)" },
    { value: "9-12", label: "Ages 9-12 (Elementary)" },
    // { value: "13-16", label: "College (Secondary)" },
  ]

  const languages = [
    { value: "marathi", label: "मराठी (Marathi)" },
    { value: "hindi", label: "हिंदी (Hindi)" },
    { value: "english", label: "English" },
    { value: "bilingual", label: "Bilingual / द्विभाषिक" },
  ]

  const storyLengths = [
    { value: "short", label: "Short (2-3 minutes)" },
    { value: "medium", label: "Medium (5-7 minutes)" },
    { value: "long", label: "Long (10-15 minutes)" },
  ]

  const handleGenerateStory = async () => {
    setValidationErrors({
      topic: false,
      ageGroup: false,
      language: false,
    })

    const errors = {
      topic: !topic.trim(),
      ageGroup: !ageGroup,
      language: !language,
    }

    setValidationErrors(errors)
    
    if (errors.topic || errors.ageGroup || errors.language) {
      return
    }

    try {
      await dispatch(generateStory({ topic, ageGroup, language, storyLength })).unwrap()
    } catch (err) {
      console.error("Story generation error:", err)
      // Provide a fallback story if API fails
      const fallbackStory: StoryResponse = {
        story: `Once upon a time, in a beautiful garden, there lived a small bird named Chiku. Chiku was very kind and always helped other animals in the garden.\n\nOne day, Chiku saw an old cat stuck in a tree. The cat was scared and couldn't come down. All the other animals were afraid to help because the cat had been mean to them before.\n\nBut Chiku remembered what his mother had taught him: \"Always help others, even if they haven't been kind to you.\"\n\nChiku flew to the cat and said, \"Don't worry, I'll help you!\" He called all his bird friends, and together they guided the cat safely down the tree.\n\nThe cat was so grateful that he promised never to be mean again. From that day on, all the animals in the garden lived happily together.`,
        image_url: "https://via.placeholder.com/300x200",
        audio_url: "https://example.com/audio.mp3",
        worksheet: JSON.stringify({
          questions: [
            {
              question: "Why do you think Chiku helped the cat?",
              question_type: "open_ended",
              answer_guidance: "Think about Chiku's character and his mother's teachings."
            },
            {
              question: "What would you have done in Chiku's place?",
              question_type: "open_ended",
              answer_guidance: "Consider your own experiences and how you would react."
            },
            {
              question: "How did the cat change after being helped?",
              question_type: "open_ended",
              answer_guidance: "Reflect on the cat's behavior and how it affected the garden."
            }
          ]
        }, null, 2)
      }
      dispatch(setStoryData(fallbackStory))
    }
  }

  const narrateStory = (text: string, section: string) => {
    if (isNarrating) {
      speechSynthesis.cancel()
      dispatch(setNarrating({ isNarrating: false }))
      return
    }

    dispatch(setNarrating({ isNarrating: true, section }))

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1.1
    utterance.volume = 1

    // Set language based on selection
    if (language === "hindi") {
      utterance.lang = "hi-IN"
    } else if (language === "marathi") {
      utterance.lang = "mr-IN"
    } else {
      utterance.lang = "en-IN"
    }

    utterance.onend = () => {
      dispatch(setNarrating({ isNarrating: false }))
    }

    utterance.onerror = () => {
      dispatch(setNarrating({ isNarrating: false }))
      alert("Speech synthesis not supported in your browser")
    }

    speechSynthesis.speak(utterance)
  }

  const stopNarration = () => {
    speechSynthesis.cancel()
    dispatch(setNarrating({ isNarrating: false }))
  }

  const handleResetStory = () => {
    dispatch(resetStory())
    setTopic("")
    setAgeGroup("")
    setLanguage("bilingual")
    setValidationErrors({
      topic: false,
      ageGroup: false,
      language: false,
    })
    stopNarration()
  }

  const sampleTopics = [
    "The Honest Woodcutter",
    "Friendship and Sharing",
    "The Importance of Hard Work",
    "Respecting Nature",
    "Being Brave and Confident",
    "The Value of Education",
    "Helping Others in Need",
    "The Magic of Reading",
  ]

  // Helper: Split story into paragraphs and highlight sound cues
  function renderStoryParagraphs(story: string) {
    return story.split(/\n+/).map((para, idx) => {
      // Highlight (Sound cue: ...)
      const parts = para.split(/(\(Sound cue:.*?\))/g)
      return (
        <p key={idx} className="mb-4 text-gray-800 leading-relaxed">
          {parts.map((part, i) =>
            part.startsWith("(Sound cue:") ? (
              <span key={i} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-semibold mx-1">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      )
    })
  }

  // Helper: Parse worksheet JSON
  function parseWorksheet(worksheet: string | undefined) {
    if (!worksheet) return null
    try {
      // Some APIs return worksheet as a code block string, so strip if needed
      const jsonStr = worksheet.trim().replace(/^```json|```$/g, "")
      const parsed = JSON.parse(jsonStr)
      
      // Handle both array format and object format
      if (Array.isArray(parsed)) {
        return { questions: parsed }
      } else if (parsed.questions) {
        return parsed
      } else {
        return { questions: [] }
      }
    } catch (error) {
      console.error('Failed to parse worksheet:', error)
      return null
    }
  }

  // Helper: Handle image load
  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }


  return (
    <ProtectedRoute userType="teacher">
      <LayoutWrapper 
        title={t("dynamicStorytelling")}
        subtitle={t("dynamicStorytellingDesc")}
        showLoginButton={true}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
        className="bg-gradient-to-br from-purple-50 via-white to-pink-50"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Story Generation Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  {t("dynamicStorytelling")}
                </CardTitle>
                <CardDescription>{t("dynamicStorytellingDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t("storyTopic")} *</label>
                  <Input
                    placeholder={t("storyTopicPlaceholder")}
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value)
                      if (validationErrors.topic) {
                        setValidationErrors(prev => ({ ...prev, topic: false }))
                      }
                    }}
                    className={validationErrors.topic ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {validationErrors.topic && (
                    <p className="text-red-500 text-xs mt-1">{t("storyTopicError")}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("ageGroup")} *</label>
                    <Select 
                      value={ageGroup} 
                      onValueChange={(value) => {
                        setAgeGroup(value)
                        if (validationErrors.ageGroup) {
                          setValidationErrors(prev => ({ ...prev, ageGroup: false }))
                        }
                      }}
                    >
                      <SelectTrigger className={validationErrors.ageGroup ? "border-red-500 focus:border-red-500" : ""}>
                        <SelectValue placeholder={t("ageGroupPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.ageGroup && (
                      <p className="text-red-500 text-xs mt-1">{t("ageGroupError")}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("language")} *</label>
                    <Select 
                      value={language} 
                      onValueChange={(value) => {
                        console.log(value)
                        setLanguage(value)
                        if (validationErrors.language) {
                          setValidationErrors(prev => ({ ...prev, language: false }))
                        }
                      }}
                    >
                      <SelectTrigger className={validationErrors.language ? "border-red-500 focus:border-red-500" : ""}>
                        <SelectValue placeholder={t("languagePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.language && (
                      <p className="text-red-500 text-xs mt-1">{t("languageError")}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">{t("storyLength")}</label>
                  <Select value={storyLength} onValueChange={setStoryLength}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("storyLengthPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {storyLengths.map((length) => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleGenerateStory} disabled={isLoading} className="flex-1" size="lg">
                    {isLoading ? (
                      <ButtonLoader text={t("loading")} />
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        {t("generateStory")}
                      </>
                    )}
                  </Button>

                  <Button onClick={handleResetStory} variant="outline" size="lg">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("reset")}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {isLoading && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">{t("creatingYourStory")}</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>{t("analyzingTopic")}</li>
                      <li>{t("writingNarrative")}</li>
                      <li>{t("addingObjectives")}</li>
                      <li>{t("creatingQuestions")}</li>
                      <li>{t("designingActivities")}</li>
                    </ul>
                  </div>
                )}

                {/* Sample Topics */}
                <div>
                  <h4 className="font-medium mb-3">{t("sampleTopics")}:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleTopics.map((sampleTopic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setTopic(sampleTopic)}
                        className="text-xs h-8"
                      >
                        {sampleTopic}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story Display Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("dynamicStorytelling")}</CardTitle>
                    <CardDescription>{t("dynamicStorytellingDesc")}</CardDescription>
                  </div>
                  {storyData && storyData.audio_url && (
                    <div className="flex space-x-2">
                      {isAudioPlaying ? (
                        <Button variant="outline" size="sm" onClick={() => {
                          audioRef.current?.pause()
                          setIsAudioPlaying(false)
                        }}>
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => {
                          audioRef.current?.play()
                          setIsAudioPlaying(true)
                        }}>
                          <Play className="w-4 h-4 mr-1" />
                          Play Audio
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {storyData ? (
                  <Tabs defaultValue="story" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="story">Story</TabsTrigger>
                      <TabsTrigger value="questions">Questions</TabsTrigger>
                    </TabsList>

                    {/* STORY TAB */}
                    <TabsContent value="story" className="space-y-4">
                      {storyData?.image_url && (
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            {imageLoading && (
                              <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                              </div>
                            )}
                            {imageError && (
                              <div className="w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center text-gray-500">
                                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm">Image not available</p>
                                </div>
                              </div>
                            )}
                            <img
                              src={storyData.image_url}
                              alt="Story visual"
                              className={`rounded-lg shadow max-h-64 object-contain border ${
                                imageLoading || imageError ? 'hidden' : ''
                              }`}
                              onLoad={handleImageLoad}
                              onError={handleImageError}
                              onLoadStart={() => setImageLoading(true)}
                            />
                          </div>
                        </div>
                      )}
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          {renderStoryParagraphs(storyData?.story || "")}
                        </div>
                      </div>
                      {storyData?.audio_url && (
                        <audio
                          ref={audioRef}
                          src={storyData.audio_url}
                          onPlay={() => setIsAudioPlaying(true)}
                          onPause={() => setIsAudioPlaying(false)}
                          onEnded={() => setIsAudioPlaying(false)}
                          controls
                          className="w-full mt-2"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </TabsContent>

                    {/* QUESTIONS TAB */}
                    <TabsContent value="questions" className="space-y-4">
                      {(() => {
                        const parsedWorksheet = parseWorksheet(storyData?.worksheet)
                        console.log('Parsed worksheet:', parsedWorksheet) // Debug log
                        if (!parsedWorksheet) return <p className="text-gray-500 text-sm">No worksheet available</p>
                        return (
                          <div>
                            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                              <HelpCircle className="w-4 h-4 mr-1" />
                              Comprehension & Creative Questions
                            </h4>
                            <div className="space-y-4">
                              {parsedWorksheet.questions && parsedWorksheet.questions.length > 0 ? (
                                parsedWorksheet.questions.map((q: any, idx: number) => (
                                  <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                                    <div className="mb-2">
                                      <span className="font-semibold text-blue-900">Q{idx + 1}:</span> {q.question}
                                    </div>
                                    {q.question_type === "multiple_choice" && q.options && (
                                      <div className="space-y-1 ml-4">
                                        {q.options.map((opt: string, oidx: number) => (
                                          <label key={oidx} className="flex items-center space-x-2">
                                            <input
                                              type="radio"
                                              name={`q${idx}`}
                                              value={opt}
                                              checked={worksheetAnswers[`q${idx}`] === opt}
                                              onChange={() => setWorksheetAnswers(a => ({ ...a, [`q${idx}`]: opt }))}
                                            />
                                            <span>{opt}</span>
                                          </label>
                                        ))}
                                      </div>
                                    )}
                                    {(q.question_type === "open_ended" || q.question_type === "creative") && (
                                      <textarea
                                        className="w-full border rounded p-2 mt-2"
                                        rows={q.question_type === "creative" ? 3 : 2}
                                        placeholder={q.question_type === "creative" ? "Draw or describe your answer!" : "Type your answer here..."}
                                        value={worksheetAnswers[`q${idx}`] || ""}
                                        onChange={e => setWorksheetAnswers(a => ({ ...a, [`q${idx}`]: e.target.value }))}
                                      />
                                    )}
                                    {q.answer_guidance && (
                                      <div className="text-xs text-gray-500 mt-2">Guidance: {q.answer_guidance}</div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">No questions available</p>
                              )}
                            </div>
                          </div>
                        )
                      })()}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Create Stories</h3>
                    <p className="text-gray-500 mb-6">
                      {t("dynamicStorytellingDesc")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">AI-Generated Stories</h4>
                        <p className="text-purple-700">Custom stories tailored to your topic and student age group</p>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-medium text-pink-900 mb-2">Interactive Narration</h4>
                        <p className="text-pink-700">Audio narration with local language support</p>
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
