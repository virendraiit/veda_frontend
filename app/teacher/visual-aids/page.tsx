"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Image, Volume2, Download, Copy, RefreshCw, Eye, Play, FileText, Lightbulb, BookOpen, MessageSquare, Plus, List } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { getApiUrl, API_ENDPOINTS } from "@/lib/config"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore"

interface VisualAidResponse {
  status: string
  topic: string
  description: string
  example: string
  audio_path: string
  image_path: string
  image_saved_locally: string
  message: string
}

interface StoredVisualAid {
  id: string
  topic: string
  language: string
  grade: string
  description: string
  example: string
  audio_path: string
  image_path: string
  image_saved_locally: string
  createdAt: Timestamp
}

export default function VisualAidsPage() {
  const { toast } = useToast()
  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("en")
  const [grade, setGrade] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [visualAid, setVisualAid] = useState<VisualAidResponse | null>(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState('description')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [storedAids, setStoredAids] = useState<StoredVisualAid[]>([])
  const [isLoadingAids, setIsLoadingAids] = useState(false)
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create')

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi / हिंदी" },
    { value: "mr", label: "Marathi / मराठी" },
    { value: "gu", label: "Gujarati / ગુજરાતી" },
    { value: "bn", label: "Bengali / বাংলা" },
    { value: "ta", label: "Tamil / தமிழ்" },
    { value: "kn", label: "Kannada / ಕನ್ನಡ" },
    { value: "pa", label: "Punjabi / ਪੰਜਾਬੀ" },
  ]

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

  const sampleTopics = [
    {
      topic: "Honesty",
      description: "ईमानदारी के गुण और महत्व",
      category: "Values",
      grade: "3-5",
    },
    {
      topic: "Water Cycle",
      description: "जल चक्र की प्रक्रिया और महत्व",
      category: "Science",
      grade: "4-6",
    },
    {
      topic: "Photosynthesis",
      description: "पौधों में भोजन बनाने की प्रक्रिया",
      category: "Science",
      grade: "5-7",
    },
    {
      topic: "Fractions",
      description: "भिन्नों की समझ और गणना",
      category: "Mathematics",
      grade: "4-6",
    },
    {
      topic: "Indian Independence",
      description: "भारतीय स्वतंत्रता संग्राम",
      category: "History",
      grade: "6-8",
    },
    {
      topic: "Healthy Eating",
      description: "स्वस्थ भोजन और पोषण",
      category: "Health",
      grade: "3-5",
    },
    {
      topic: "Solar System",
      description: "सौर मंडल और ग्रह",
      category: "Science",
      grade: "5-7",
    },
    {
      topic: "Environmental Protection",
      description: "पर्यावरण संरक्षण के उपाय",
      category: "Environment",
      grade: "4-6",
    },
  ]

  const generateVisualAid = async () => {
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
    setVisualAid(null)

    try {
      const apiUrl = getApiUrl(API_ENDPOINTS.GENERATE_VISUAL_AID);
      console.log('API URL:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          language: language,
          grade: grade
        }),
      })
      console.log('Response:', response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setVisualAid(result.data)
        toast({
          title: "Success!",
          description: "Visual aid generated successfully",
        })
      } else {
        throw new Error(result.error || 'Failed to generate visual aid')
      }
    } catch (err) {
      console.error('Error generating visual aid:', err)
      setError('Failed to generate visual aid. Please check if the backend server is running.')
      
      toast({
        title: "Generation Failed",
        description: "Could not connect to the visual aid generation service. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  const downloadImage = () => {
    if (visualAid?.image_saved_locally) {
      const link = document.createElement('a')
      link.href = visualAid.image_saved_locally
      link.download = `visual-aid-${topic}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getAccessibleImageUrl = (gcsPath: string) => {
    if (gcsPath?.startsWith('gs://')) {
      const bucketPath = gcsPath?.replace('gs://veda_storage/', '')
      return `https://storage.googleapis.com/veda_storage/${bucketPath}`
    }
    return gcsPath
  }

  const getAccessibleAudioUrl = (gcsPath: string) => {
    if (gcsPath?.startsWith('gs://')) {
      const bucketPath = gcsPath?.replace('gs://veda_storage/', '')
      return `https://storage.googleapis.com/veda_storage/${bucketPath}`
    }
    return gcsPath
  }

  const playAudio = () => {
    if (visualAid?.audio_path) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      const audioUrl = getAccessibleAudioUrl(visualAid.audio_path)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true)
          toast({
            title: "Playing Audio",
            description: "Audio explanation is now playing",
          })
        }).catch((error) => {
          console.error('Audio play failed:', error)
          setIsAudioPlaying(false)
          toast({
            title: "Audio Error",
            description: "Could not play audio file",
            variant: "destructive",
          })
        })
      }
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsAudioPlaying(false)
      toast({
        title: "Audio Stopped",
        description: "Audio playback stopped",
      })
    }
  }

  const playStoredAudio = (aid: StoredVisualAid) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audioUrl = getAccessibleAudioUrl(aid.audio_path)
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true)
        toast({
          title: "Playing Audio",
          description: "Audio explanation is now playing",
        })
      }).catch((error) => {
        console.error('Audio play failed:', error)
        setIsAudioPlaying(false)
        toast({
          title: "Audio Error",
          description: "Could not play audio file",
          variant: "destructive",
        })
      })
    }
  }

  const stopStoredAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsAudioPlaying(false)
      toast({
        title: "Audio Stopped",
        description: "Audio playback stopped",
      })
    }
  }

  const fetchStoredAids = async () => {
    setIsLoadingAids(true)
    try {
      const q = query(collection(db, "visualAids"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const aids: StoredVisualAid[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt as Timestamp,
      })) as StoredVisualAid[]
      setStoredAids(aids)
    } catch (error) {
      console.error("Error fetching stored aids:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stored visual aids.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAids(false)
    }
  }

  const createNewVisualAid = async () => {
    if (!topic.trim() || !grade || !visualAid) {
      toast({
        title: "Validation Error",
        description: "Please generate a visual aid first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const newAid = {
        topic: topic.trim(),
        language: language,
        grade: grade,
        description: visualAid.description,
        example: visualAid.example,
        audio_path: visualAid.audio_path,
        image_path: visualAid.image_path,
        image_saved_locally: visualAid.image_saved_locally,
        createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "visualAids"), newAid)
      toast({
        title: "Success!",
        description: "Visual aid saved successfully!",
      })
      fetchStoredAids()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsAudioPlaying(false)
      }
      setViewMode('list')
    } catch (error) {
      console.error("Error creating new visual aid:", error)
      setError('Failed to save visual aid. Please try again later.')
      toast({
        title: "Save Failed",
        description: "Could not save visual aid. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    fetchStoredAids()
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  return (
    <ProtectedRoute>
      <LayoutWrapper
        title="Visual Aid AI Agent"
        subtitle="AI-Powered Visual Learning Materials Generator"
        showLoginButton={true}
        logoHref="/"
        className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'create' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                    setIsAudioPlaying(false)
                  }
                  setViewMode('create')
                }}
                className="rounded-md"
              >
                <Image className="w-4 h-4 mr-2" />
                Create Visual Aid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                    setIsAudioPlaying(false)
                  }
                  setViewMode('list')
                }}
                className="rounded-md"
              >
                <List className="w-4 h-4 mr-2" />
                Your Visual Aids
              </Button>
            </div>
          </div>

          {viewMode === 'create' && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="w-5 h-5 mr-2 text-blue-600" />
                    Generate Visual Aid
                  </CardTitle>
                  <CardDescription>
                    Create comprehensive visual learning materials with images and audio explanations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Topic *</label>
                      <Input
                        placeholder="e.g., Honesty, Water Cycle, Photosynthesis"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Grade Level *</label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions?.map((gradeOption) => (
                            <SelectItem key={gradeOption.value} value={gradeOption.value}>
                              {gradeOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={generateVisualAid}
                    disabled={!topic.trim() || !grade || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating Visual Aid...
                      </>
                    ) : (
                      <>
                        <Image className="w-4 h-4 mr-2" />
                        Generate Visual Aid
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">Generating Visual Aid:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Analyzing topic requirements</li>
                        <li>🔄 Creating visual representation</li>
                        <li>🔄 Generating detailed description</li>
                        <li>🔄 Creating audio explanation</li>
                        <li>🔄 Saving image and audio files</li>
                      </ul>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p className="text-red-800 text-sm flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {error}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <Card className="xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                      Sample Topics
                    </CardTitle>
                    <CardDescription>Popular topics for visual aid generation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {sampleTopics.map((sample, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setTopic(sample.topic)
                            setGrade(sample.grade.split('-')[0])
                          }}
                        >
                          <div className="font-medium text-sm text-gray-900 mb-1">{sample.topic}</div>
                          <div className="text-xs text-gray-600 mb-2">{sample.description}</div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {sample.category}
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

                <div className="xl:col-span-3">
                  {visualAid ? (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                              Generated Visual Aid
                            </CardTitle>
                            <CardDescription>Topic: {visualAid.topic} | Grade: {grade} | Language: {languageOptions.find(l => l.value === language)?.label}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(visualAid.description)}>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadImage}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={createNewVisualAid}
                              disabled={isGenerating}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Save to Library
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="example">Example</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                          </TabsList>

                          <TabsContent value="description" className="mt-6">
                            <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                              <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{visualAid.description}</pre>
                              </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg mt-4">
                              <h4 className="font-medium text-green-800 mb-2">How to Use This Description:</h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                <li>• Read the description to students in simple terms</li>
                                <li>• Use it as a script for classroom presentation</li>
                                <li>• Adapt the content for your specific grade level</li>
                                <li>• Encourage student questions and discussion</li>
                              </ul>
                            </div>
                          </TabsContent>

                          <TabsContent value="example" className="mt-6">
                            <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                              <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{visualAid.example}</pre>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                              <h4 className="font-medium text-blue-800 mb-2">Teaching Application:</h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Use this example to explain the concept visually</li>
                                <li>• Draw the visual elements on the blackboard</li>
                                <li>• Ask students to identify different parts</li>
                                <li>• Connect the example to real-life situations</li>
                              </ul>
                            </div>
                          </TabsContent>

                          <TabsContent value="media" className="mt-6">
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center">
                                  <Image className="w-5 h-5 mr-2 text-blue-600" />
                                  Generated Image
                                </h4>
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                                  <div className="text-center">
                                    <img 
                                      src={getAccessibleImageUrl(visualAid.image_path)} 
                                      alt={`Visual aid for ${visualAid.topic}`}
                                      className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                                      style={{ maxHeight: '400px' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                    <div className="hidden text-center py-8">
                                      <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                      <p className="text-gray-500 mb-2">Image generated successfully!</p>
                                      <p className="text-xs text-gray-400">Path: {visualAid.image_path}</p>
                                      <p className="text-xs text-gray-400">Local: {visualAid.image_saved_locally}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-lg mb-3 flex items-center">
                                  <Volume2 className="w-5 h-5 mr-2 text-purple-600" />
                                  Audio Explanation
                                </h4>
                                <div className="bg-purple-50 border rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm text-purple-800 mb-2">
                                        Audio file generated successfully!
                                      </p>
                                      <p className="text-xs text-purple-600 mb-2">
                                        This audio file contains the narrated explanation of the visual aid.
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      {isAudioPlaying ? (
                                        <Button variant="outline" size="sm" onClick={stopAudio}>
                                          <Volume2 className="w-4 h-4 mr-1" />
                                          Stop Audio
                                        </Button>
                                      ) : (
                                        <Button variant="outline" size="sm" onClick={playAudio}>
                                          <Play className="w-4 h-4 mr-1" />
                                          Play Audio
                                        </Button>
                                      )}
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                          const audioUrl = getAccessibleAudioUrl(visualAid.audio_path)
                                          const link = document.createElement('a')
                                          link.href = audioUrl
                                          link.download = `audio-${visualAid.topic}-${Date.now()}.wav`
                                          document.body.appendChild(link)
                                          link.click()
                                          document.body.removeChild(link)
                                        }}
                                      >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <audio
                          ref={audioRef}
                          onPlay={() => setIsAudioPlaying(true)}
                          onPause={() => setIsAudioPlaying(false)}
                          onEnded={() => setIsAudioPlaying(false)}
                          onError={() => {
                            setIsAudioPlaying(false)
                            toast({
                              title: "Audio Error",
                              description: "Could not load audio file. The file might not be publicly accessible.",
                              variant: "destructive",
                            })
                          }}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate Visual Aids</h3>
                        <p className="text-gray-500 mb-6">
                          Create comprehensive visual learning materials with images and audio explanations for any topic and grade level.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Visual Images</h4>
                            <p className="text-blue-700">AI-generated images that illustrate concepts clearly</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Audio Explanations</h4>
                            <p className="text-green-700">Narrated explanations to accompany visual materials</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">Multi-language Support</h4>
                            <p className="text-yellow-700">Content in multiple Indian languages</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">Grade Specific</h4>
                            <p className="text-purple-700">Content tailored for different grade levels</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}

          {viewMode === 'list' && (
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <List className="w-5 h-5 mr-2 text-blue-600" />
                    Your Visual Aids
                  </CardTitle>
                  <CardDescription>Browse and manage your generated visual aids</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAids ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Loading visual aids...</p>
                  </div>
                ) : storedAids.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No visual aids generated yet. Click "Create Visual Aid" to create one!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {storedAids.map((aid) => (
                      <Card key={aid.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{aid.topic}</CardTitle>
                              <CardDescription>
                                Grade {aid.grade} • {languageOptions.find(l => l.value === aid.language)?.label}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {aid.createdAt.toDate().toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <img 
                                src={getAccessibleImageUrl(aid.image_path)} 
                                alt={`Visual aid for ${aid.topic}`}
                                className="w-full h-32 object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setVisualAid({
                                    status: "success",
                                    topic: aid.topic,
                                    description: aid.description,
                                    example: aid.example,
                                    audio_path: aid.audio_path,
                                    image_path: aid.image_path,
                                    image_saved_locally: aid.image_saved_locally,
                                    message: "Success",
                                  })
                                  setViewMode('create')
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(aid.description)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              {isAudioPlaying ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={stopStoredAudio}
                                >
                                  <Volume2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => playStoredAudio(aid)}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
}
