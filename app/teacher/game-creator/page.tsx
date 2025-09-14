"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Gamepad2, 
  RefreshCw, 
  Play, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Clock,
  User,
  Calendar
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { LayoutWrapper } from "@/components/common/LayoutWrapper"
import { useAuthContext } from "@/components/providers/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { generateGame, loadUserGames, deleteUserGame, resetGame, clearError } from "@/lib/slices/gameSlice"
import { ButtonLoader, RefreshButton, LoadingSpinner } from "@/components/ui/loading"

interface GameHistory {
  id: string
  title: string
  description: string
  gameType: string
  gradeLevel: string
  gameUrl: string
  createdAt: Date
  userId: string
  userEmail: string
  isPlayed?: boolean
  playedAt?: Date
}

export default function GameCreatorPage() {
  const dispatch = useAppDispatch()
  const { t, currentLanguage } = useLanguage()
  const { toast } = useToast()
  const { user } = useAuthContext()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [gameType, setGameType] = useState("")
  const [dificultyLevel, setDificultyLevel] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  // Redux state
  const { 
    games: gameHistory, 
    currentGame, 
    isLoading, 
    error, 
    isGenerating, 
    generatedGameUrl 
  } = useAppSelector((state) => state.game)

  const gameTypes = [
    // { value: "quiz", label: "Quiz Game / प्रश्नमंजुषा खेळ" },
    { value: "Board Game", label: "Board Game / बोर्ड खेळ" },
    { value: "Puzzle Gamw", label: "Puzzle Game / कोडे खेळ" },
    { value: "crossword", label: "Crossword / शब्दकोशी" },
    // { value: "memory", label: "Memory Game / स्मरण खेळ" },
    // { value: "matching", label: "Matching Game / जुळवणी खेळ" },
    // { value: "word-search", label: "Word Search / शब्द शोध" },
  ]

  const dificultyLevels = [
    { value: "Easy", label: "Easy" },
    { value: "Hard", label: "Medium" },
    { value: "Medium", label: "Hard" }
  ]

  // Load game history from Firebase
  useEffect(() => {
    if (user) {
      console.log('🔄 Loading games for user:', user.uid)
      dispatch(loadUserGames(user.uid))
    }
  }, [user, dispatch])

  // Debug: Log game history changes
  useEffect(() => {
    console.log('🎮 Game history updated:', gameHistory)
    console.log('🎮 Total games:', gameHistory.length)
    console.log('🎮 Games not played:', gameHistory.filter(game => !game.isPlayed).length)
    console.log('🎮 Games played:', gameHistory.filter(game => game.isPlayed).length)
  }, [gameHistory])

  const handleGenerateGame = async () => {
    if (!title.trim() || !description.trim() || !gameType || !dificultyLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await dispatch(generateGame({
        title,
        description,
        gameType,
        dificultyLevel, // <-- fixed property name
        userId: user!.uid,
        userEmail: user!.email!,
      })).unwrap()

      toast({
        title: "Success!",
        description: "Game generated successfully!",
      })
      
      setActiveTab("generated")
    } catch (err) {
      console.error("Game generation error:", err)
      toast({
        title: "Error",
        description: "Failed to generate game. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyGameUrl = () => {
    if (generatedGameUrl) {
      navigator.clipboard.writeText(generatedGameUrl)
      toast({
        title: "Copied!",
        description: "Game URL copied to clipboard",
      })
    }
  }

  const openGame = () => {
    if (generatedGameUrl) {
      window.open(generatedGameUrl, '_blank')
    }
  }

  const handleDeleteGame = async (gameId: string) => {
    try {
      await dispatch(deleteUserGame(gameId)).unwrap()
      
      toast({
        title: "Deleted!",
        description: "Game removed from history",
      })
    } catch (error) {
      console.error("Error deleting game:", error)
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive",
      })
    }
  }

  const handlePlayGame = async (gameId: string, gameUrl: string) => {
    try {
      // Mark game as played by updating Firebase
      const { updateGamePlayed } = await import('@/lib/firebase')
      await updateGamePlayed(gameId)
      
      // Refresh the games list
      if (user) {
        dispatch(loadUserGames(user.uid))
      }
      
      // Open the game in new tab
      window.open(gameUrl, '_blank')
      
      toast({
        title: "Game Started!",
        description: "Game has been marked as played",
      })
    } catch (error) {
      console.error("Error marking game as played:", error)
      // Still open the game even if marking as played fails
      window.open(gameUrl, '_blank')
    }
  }


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getGameTypeLabel = (type: string) => {
    return gameTypes.find(gt => gt.value === type)?.label || type
  }

  const getGradeLabel = (grade: string) => {
    return dificultyLevels.find(gl => gl.value === grade)?.label || grade
  }

  // Helper functions to filter games
  const getUnplayedGames = () => {
    return gameHistory.filter(game => !game.isPlayed)
  }

  const getPlayedGames = () => {
    return gameHistory.filter(game => game.isPlayed === true)
  }

  return (
    <ProtectedRoute userType="teacher">
      <LayoutWrapper 
        title={t("gameCreation")}
        subtitle={t("gameCreationDesc")}
        logoHref={`/teacher/dashboard?lang=${currentLanguage}`}
      >
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Create Game
              </TabsTrigger>
              <TabsTrigger value="generated">
                <Play className="w-4 h-4 mr-2" />
                Generated Games ({getUnplayedGames().length})
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="w-4 h-4 mr-2" />
                Game History ({getPlayedGames().length})
              </TabsTrigger>
            </TabsList>

            {/* Create Game Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-2 text-purple-600" />
                    Create Educational Game
                  </CardTitle>
                  <CardDescription>
                    Generate interactive educational games using AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Game Topic *</label>
                    <Input
                      placeholder="e.g., Electromagnetic, Optics , Nuclear Physics etc."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Game Description *</label>
                    <Textarea
                      placeholder="Describe what the game should teach and how it should work..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Game Type *</label>
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
                      <label className="text-sm font-medium mb-2 block">Dificulty Level *</label>
                      <Select value={dificultyLevel} onValueChange={setDificultyLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Dificulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          {dificultyLevels.map((dificulty) => (
                            <SelectItem key={dificulty.value} value={dificulty.value}>
                              {dificulty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleGenerateGame} 
                      disabled={isGenerating} 
                      className="w-full" 
                      size="lg"
                    >
                      {isGenerating ? (
                        <ButtonLoader text="Generating Game..." />
                      ) : (
                        <>
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Generate Game
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Creating Your Game:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>✓ Processing your requirements</li>
                        <li>🔄 Designing game mechanics</li>
                        <li>🔄 Creating interactive elements</li>
                        <li>🔄 Adding educational content</li>
                        <li>🔄 Finalizing game interface</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sample Games */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Sample Game Ideas
                  </CardTitle>
                  <CardDescription>Click on any sample to auto-fill the form</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Math Quiz Adventure",
                        description: "An interactive quiz game for learning basic mathematics with multiple choice questions and scoring",
                        gameType: "quiz",
                        gradeLevel: "1", // Easy
                      },
                      {
                        title: "Science Puzzle Challenge",
                        description: "A puzzle game where students match scientific concepts with their definitions and examples",
                        gameType: "puzzle",
                        gradeLevel: "2", // Medium
                      },
                      {
                        title: "Memory Match: Indian History",
                        description: "A memory card game featuring important events and figures from Indian history",
                        gameType: "memory",
                        gradeLevel: "1", // Easy
                      },
                      {
                        title: "Word Search: Parts of Speech",
                        description: "A word search game where students find different parts of speech hidden in a grid",
                        gameType: "word-search",
                        gradeLevel: "1", // Easy
                      },
                      {
                        title: "Crossword: Geography",
                        description: "A crossword puzzle with clues about Indian geography, states, and landmarks",
                        gameType: "crossword",
                        gradeLevel: "3", // Hard
                      },
                      {
                        title: "Matching: Animal Habitats",
                        description: "A matching game where students connect animals with their natural habitats",
                        gameType: "matching",
                        gradeLevel: "1", // Easy
                      },
                    ].map((sample, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setTitle(sample.title)
                          setDescription(sample.description)
                          setGameType(sample.gameType)
                          setDificultyLevel(sample.gradeLevel)
                        }}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{sample.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{sample.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {getGameTypeLabel(sample.gameType)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getGradeLabel(sample.gradeLevel)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Generated Games Tab */}
            <TabsContent value="generated" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Play className="w-5 h-5 mr-2 text-green-600" />
                      Generated Games ({getUnplayedGames().length})
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (user) {
                          console.log('🔄 Manually refreshing games...')
                          dispatch(loadUserGames(user.uid))
                        }
                      }}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Games that have been created but not played yet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm font-medium">Error loading games:</p>
                      <p className="text-red-700 text-sm">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          if (user) {
                            dispatch(clearError())
                            dispatch(loadUserGames(user.uid))
                          }
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-500">Loading games...</p>
                    </div>
                  ) : getUnplayedGames().length > 0 ? (
                    <div className="space-y-4">
                      {getUnplayedGames().map((game) => (
                        <div key={game.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">{game.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getGameTypeLabel(game.gameType)}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {getGradeLabel(game.gradeLevel)}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  New
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(game.createdAt)}
                                </span>
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {game.userEmail}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePlayGame(game.id, game.gameUrl)}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(game.gameUrl)
                                  toast({
                                    title: "Copied!",
                                    description: "Game URL copied to clipboard",
                                  })
                                }}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteGame(game.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Generated Games</h3>
                      <p className="text-gray-500 mb-6">
                        Create your first educational game to see it here.
                      </p>
                      <Button onClick={() => setActiveTab("create")}>
                        Create Your First Game
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Game History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Game History ({getPlayedGames().length})
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (user) {
                          console.log('🔄 Manually refreshing games...')
                          dispatch(loadUserGames(user.uid))
                        }
                      }}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Games that have been played
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 text-sm font-medium">Error loading games:</p>
                      <p className="text-red-700 text-sm">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          if (user) {
                            dispatch(clearError())
                            dispatch(loadUserGames(user.uid))
                          }
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-500">Loading games...</p>
                    </div>
                  ) : getPlayedGames().length > 0 ? (
                    <div className="space-y-4">
                      {getPlayedGames().map((game) => (
                        <div key={game.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">{game.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getGameTypeLabel(game.gameType)}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {getGradeLabel(game.gradeLevel)}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  Played
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Created: {formatDate(game.createdAt)}
                                </span>
                                {game.playedAt && (
                                  <span className="flex items-center">
                                    <Play className="w-3 h-3 mr-1" />
                                    Played: {formatDate(game.playedAt)}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {game.userEmail}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(game.gameUrl, '_blank')}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Play Again
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(game.gameUrl)
                                  toast({
                                    title: "Copied!",
                                    description: "Game URL copied to clipboard",
                                  })
                                }}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteGame(game.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Played Games</h3>
                      <p className="text-gray-500 mb-6">
                        Play some games to see them in your history.
                      </p>
                      <Button onClick={() => setActiveTab("generated")}>
                        View Generated Games
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  )
} 