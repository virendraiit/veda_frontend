export interface StoryRequest {
  topic: string
  grade: string
  language: string
  user_id: string
}

export interface StoryResponse {
  story: string
  audio_url: string
  worksheet: string // JSON string
  image_url: string
}

// making it dynamic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://google-agentic-ai-594290114400.us-central1.run.app'

export class StoryApiService {
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
      console.error('API request failed:', error)
      throw error
    }
  }

  static async generateStory(request: StoryRequest): Promise<StoryResponse> {
    return this.makeRequest<StoryResponse>('/generate-story', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
}

export const convertAgeGroupToGrade = (ageGroup: string): string => {
  const ageToGradeMap: Record<string, string> = {
    '3-5': '3',
    '6-8': '6',
    '9-12': '9',
    // '13-16': '8',
  }
  return ageToGradeMap[ageGroup] || '5'
}

export const convertLanguageToApiFormat = (language: string): string => {
  const languageMap: Record<string, string> = {
    'english': 'english',
    'hindi': 'hindi',
    'marathi': 'marathi',
    'bilingual': 'bilingual',
  }
  return languageMap[language] || 'en'
} 