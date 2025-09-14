export interface GameRequest {
  user_id: string
  game_type: string
  difficulty: string
  topic: string
}

export interface GameResponse {
  gameUrl: string
  gameId: string
  success: boolean
  message?: string
  error?: string
}

// making it dynamic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://google-agentic-ai-594290114400.us-central1.run.app'

export class GameApiService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Game API request failed:', error)
      throw error
    }
  }

  static async generateGame(request: GameRequest): Promise<GameResponse> {
    return this.makeRequest<GameResponse>('/generate-game', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
} 