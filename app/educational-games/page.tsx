"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gamepad2, Play, Trophy, Star, RefreshCw, Zap } from "lucide-react"
import Link from "next/link"

export default function EducationalGamesPage() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [gameType, setGameType] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedGame, setGeneratedGame] = useState<any>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const subjects = [
    { value: "mathematics", label: "Mathematics / गणित" },
    { value: "science", label: "Science / विज्ञान" },
    { value: "language", label: "Language / भाषा" },
    { value: "social-studies", label: "Social Studies / सामाजिक अध्ययन" },
    { value: "general-knowledge", label: "General Knowledge / सामान्य ज्ञान" },
  ]

  const gameTypes = [
    { value: "quiz", label: "Quiz / प्रश्नमंजुषा" },
    { value: "word-match", label: "Word Matching / शब्द जुळवणी" },
    { value: "fill-blanks", label: "Fill in the Blanks / रिकाम्या जागा भरा" },
    { value: "true-false", label: "True/False / खरे/खोटे" },
    { value: "puzzle", label: "Puzzle / कोडे" },
    { value: "memory", label: "Memory Game / स्मृती खेळ" },
  ]

  const generateGame = async () => {
    if (!selectedSubject || !selectedGrade || !gameType) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const sampleGame = {
        title: "गणित प्रश्नमंजुषा",
        titleEn: "Mathematics Quiz",
        type: "quiz",
        subject: "Mathematics",
        grade: selectedGrade,
        description: "Basic addition and subtraction problems",
        instructions: "प्रत्येक प्रश्नाचे योग्य उत्तर निवडा",
        instructionsEn: "Choose the correct answer for each question",
        totalQuestions: 10,
        timeLimit: 300, // 5 minutes
        questions: [
          {
            id: 1,
            question: "15 + 23 = ?",
            options: ["38", "35", "40", "33"],
            correct: 0,
            explanation: "15 + 23 = 38",
          },
          {
            id: 2,
            question: "50 - 17 = ?",
            options: ["33", "43", "37", "27"],
            correct: 0,
            explanation: "50 - 17 = 33",
          },
          {
            id: 3,
            question: "8 × 7 = ?",
            options: ["54", "56", "64", "48"],
            correct: 1,
            explanation: "8 × 7 = 56",
          },
          {
            id: 4,
            question: "72 ÷ 9 = ?",
            options: ["8", "9", "7", "6"],
            correct: 0,
            explanation: "72 ÷ 9 = 8",
          },
          {
            id: 5,
            question: "25 + 34 + 11 = ?",
            options: ["70", "65", "75", "60"],
            correct: 0,
            explanation: "25 + 34 + 11 = 70",
          },
        ],
      }

      setGeneratedGame(sampleGame)
      setGameState({
        currentQuestion: 0,
        score: 0,
        answers: [],
        timeRemaining: sampleGame.timeLimit,
        isCompleted: false,
      })
      setIsGenerating(false)
    }, 2000)
  }

  const startGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameState({
      ...gameState,
      currentQuestion: 0,
      score: 0,
      answers: [],
      isCompleted: false,
      startTime: Date.now(),
    })
  }

  const answerQuestion = (answerIndex: number) => {
    if (!generatedGame || !gameState) return

    const question = generatedGame.questions[currentQuestion]
    const isCorrect = answerIndex === question.correct
    const newScore = isCorrect ? score + 10 : score

    setScore(newScore)

    const newAnswers = [
      ...gameState.answers,
      {
        questionId: question.id,
        selectedAnswer: answerIndex,
        isCorrect: isCorrect,
      },
    ]

    if (currentQuestion + 1 >= generatedGame.questions.length) {
      // Game completed
      setGameState({
        ...gameState,
        answers: newAnswers,
        isCompleted: true,
        finalScore: newScore,
        endTime: Date.now(),
      })
    } else {
      // Next question
      setCurrentQuestion(currentQuestion + 1)
      setGameState({
        ...gameState,
        currentQuestion: currentQuestion + 1,
        answers: newAnswers,
      })
    }
  }

  const resetGame = () => {
    setGeneratedGame(null)
    setGameState(null)
    setScore(0)
    setCurrentQuestion(0)
  }

  const prebuiltGames = [
    {
      title: "संख्या ओळख",
      titleEn: "Number Recognition",
      subject: "Mathematics",
      grade: "1-2",
      type: "Interactive",
      description: "Learn to identify numbers 1-100",
      color: "bg-blue-500",
    },
    {
      title: "प्राणी आणि त्यांची घरे",
      titleEn: "Animals and Their Homes",
      subject: "Science",
      grade: "2-4",
      type: "Matching",
      description: "Match animals with their habitats",
      color: "bg-green-500",
    },
    {
      title: "मराठी वर्णमाला",
      titleEn: "Marathi Alphabet",
      subject: "Language",
      grade: "1-3",
      type: "Learning",
      description: "Learn Marathi letters with sounds",
      color: "bg-purple-500",
    },
    {
      title: "भारताचे राज्य",
      titleEn: "States of India",
      subject: "Social Studies",
      grade: "4-6",
      type: "Geography",
      description: "Identify Indian states on map",
      color: "bg-orange-500",
    },
  ]

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
                <h1 className="text-xl font-bold text-gray-900">शैक्षणिक खेळ</h1>
                <p className="text-sm text-gray-600">Educational Games</p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Gamepad2 className="w-4 h-4 mr-1" />
              Interactive Learning
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!generatedGame ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Generator */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Create Custom Game
                </CardTitle>
                <CardDescription>Generate a new educational game based on your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject / विषय *</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Grade Level / इयत्ता *</label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">Grade 1-2</SelectItem>
                      <SelectItem value="3-5">Grade 3-5</SelectItem>
                      <SelectItem value="6-8">Grade 6-8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Game Type / खेळाचा प्रकार *</label>
                  <Select value={gameType} onValueChange={setGameType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Topic (Optional)</label>
                  <Input
                    placeholder="e.g., Addition up to 50"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                </div>

                <Button onClick={generateGame} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Game...
                    </>
                  ) : (
                    <>
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Generate Game
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prebuilt Games */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ready-to-Play Games</CardTitle>
                  <CardDescription>Pre-built educational games for immediate use</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prebuiltGames.map((game, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center`}>
                              <Gamepad2 className="w-5 h-5 text-white" />
                            </div>
                            <Badge variant="outline">{game.type}</Badge>
                          </div>
                          <CardTitle className="text-base">
                            <div className="font-bold text-gray-900">{game.title}</div>
                            <div className="text-sm font-medium text-gray-600 mt-1">{game.titleEn}</div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {game.subject}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Grade {game.grade}
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Game Interface
          <div className="max-w-4xl mx-auto">
            {!gameState?.isCompleted ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{generatedGame.title}</CardTitle>
                      <CardDescription>{generatedGame.titleEn}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        <Trophy className="w-3 h-3 mr-1" />
                        Score: {score}
                      </Badge>
                      <Badge variant="outline">
                        Question {currentQuestion + 1} of {generatedGame.questions.length}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={resetGame}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {gameState && !gameState.startTime ? (
                    <div className="text-center py-12">
                      <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">{generatedGame.title}</h3>
                      <p className="text-gray-500 mb-4">{generatedGame.instructions}</p>
                      <p className="text-sm text-gray-400 mb-6">{generatedGame.instructionsEn}</p>
                      <Button onClick={startGame} size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-medium text-blue-900 mb-4">
                          {generatedGame.questions[currentQuestion]?.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {generatedGame.questions[currentQuestion]?.options.map((option: string, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="p-4 h-auto text-left justify-start hover:bg-blue-100 bg-transparent"
                              onClick={() => answerQuestion(index)}
                            >
                              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                {String.fromCharCode(65 + index)}
                              </span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Game Results
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Game Completed! 🎉</CardTitle>
                  <CardDescription className="text-center">Here are your results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-800">{gameState.finalScore}</div>
                        <div className="text-sm text-yellow-700">Final Score</div>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg">
                        <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-800">
                          {gameState.answers.filter((a: any) => a.isCorrect).length}/{generatedGame.questions.length}
                        </div>
                        <div className="text-sm text-green-700">Correct Answers</div>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="text-2xl font-bold text-blue-800">
                          {Math.round(
                            (gameState.answers.filter((a: any) => a.isCorrect).length /
                              generatedGame.questions.length) *
                              100,
                          )}
                          %
                        </div>
                        <div className="text-sm text-blue-700">Accuracy</div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button onClick={startGame} size="lg">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Button onClick={resetGame} variant="outline" size="lg">
                        Create New Game
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
