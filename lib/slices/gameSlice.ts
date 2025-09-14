import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { saveGame, getGamesByUser, deleteGame, GameRecord } from '../firebase'
import { GameApiService, GameRequest } from '../services/gameApi'

export interface GameState {
  games: GameRecord[]
  currentGame: GameRecord | null
  isLoading: boolean
  error: string | null
  isGenerating: boolean
  generatedGameUrl: string | null
}

const initialState: GameState = {
  games: [],
  currentGame: null,
  isLoading: false,
  error: null,
  isGenerating: false,
  generatedGameUrl: null,
}



export interface GenerateGameParams {
  title: string
  description: string
  gameType: string
  dificultyLevel: string
  userId: string
  userEmail: string
}

export const generateGame = createAsyncThunk(
  'game/generateGame',  
  async (params: GenerateGameParams, { rejectWithValue }) => {
    try {
      console.log('🎮 Redux: Starting game generation...')
      
      // Call our local API route that handles both external API and Firebase save
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: params.title,
          description: params.description,
          game_type: params.gameType,
          difficulty: params.dificultyLevel,
          user_id: params.userId,
          userEmail: params.userEmail,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.gameUrl) {
        console.log('🎮 Redux: Game generated successfully:', result)
        
        return {
          gameUrl: result.gameUrl,
          gameId: result.gameId,
          gameData: {
            id: result.gameId,
            title: params.title,
            description: params.description,
            gameType: params.gameType,
            gradeLevel: params.dificultyLevel,
            gameUrl: result.gameUrl,
            createdAt: new Date(),
            userId: params.userId,
            userEmail: params.userEmail,
          }
        }
      } else {
        throw new Error(result.error || "Failed to generate game")
      }
    } catch (error) {
      console.error('🎮 Redux: Game generation failed:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate game')
    }
  }
)

export const loadUserGames = createAsyncThunk(
  'game/loadUserGames',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🎮 Redux: Loading games for user:', userId)
      const games = await getGamesByUser(userId)
      console.log('🎮 Redux: Games loaded successfully:', games)
      return games
    } catch (error) {
      console.error('🎮 Redux: Failed to load user games:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load games')
    }
  }
)

export const deleteUserGame = createAsyncThunk(
  'game/deleteUserGame',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const result = await deleteGame(gameId)
      if (result.success) {
        return gameId
      } else {
        throw new Error(result.error || 'Failed to delete game')
      }
    } catch (error) {
      console.error('Failed to delete game:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete game')
    }
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: (state) => {
      state.currentGame = null
      state.error = null
      state.isGenerating = false
      state.generatedGameUrl = null
    },
    clearError: (state) => {
      state.error = null
    },
    setCurrentGame: (state, action: PayloadAction<GameRecord>) => {
      state.currentGame = action.payload
    },
    clearGeneratedGame: (state) => {
      state.generatedGameUrl = null
      state.currentGame = null
    },
    addGameToHistory: (state, action: PayloadAction<GameRecord>) => {
      state.games.unshift(action.payload) // Add to beginning of array
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Game
      .addCase(generateGame.pending, (state) => {
        state.isGenerating = true
        state.error = null
        state.generatedGameUrl = null
      })
      .addCase(generateGame.fulfilled, (state, action) => {
        state.isGenerating = false
        state.generatedGameUrl = action.payload.gameUrl
        state.currentGame = action.payload.gameData
        state.games.unshift(action.payload.gameData) // Add to beginning of history
        state.error = null
      })
      .addCase(generateGame.rejected, (state, action) => {
        state.isGenerating = false
        state.error = action.payload as string || 'Failed to generate game'
        state.generatedGameUrl = null
      })
      // Load User Games
      .addCase(loadUserGames.pending, (state) => {
        console.log('🎮 Redux: loadUserGames.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(loadUserGames.fulfilled, (state, action) => {
        console.log('🎮 Redux: loadUserGames.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.games = action.payload
        state.error = null
      })
      .addCase(loadUserGames.rejected, (state, action) => {
        console.log('🎮 Redux: loadUserGames.rejected with error:', action.payload)
        state.isLoading = false
        state.error = action.payload as string || 'Failed to load games'
      })
      // Delete User Game
      .addCase(deleteUserGame.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUserGame.fulfilled, (state, action) => {
        state.isLoading = false
        state.games = state.games.filter(game => game.id !== action.payload)
        state.error = null
      })
      .addCase(deleteUserGame.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to delete game'
      })
  },
})

export const { 
  resetGame, 
  clearError, 
  setCurrentGame, 
  clearGeneratedGame, 
  addGameToHistory 
} = gameSlice.actions

export default gameSlice.reducer 