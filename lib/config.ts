// Configuration for dynamic URLs based on environment
export const getWebSocketUrl = (endpoint: string = '') => {
  // Always use the WebSocket server host, not the current page host
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || 'localhost:8000'
  const wsProtocol = process.env.NEXT_PUBLIC_WS_PROTOCOL || 'ws'
  return `${wsProtocol}://${wsHost}${endpoint}`
}

export const getApiUrl = (endpoint: string = '') => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Use the same host as the current page
    const protocol = window.location.protocol
    const host = window.location.host
    return `${protocol}//${host}${endpoint}`
  }
  
  // Fallback for server-side rendering
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'localhost:8000'
  const apiProtocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http'
  return `${apiProtocol}://${apiHost}${endpoint}`
}

// Specific endpoints
export const WS_ENDPOINTS = {
  ECA_AGENT: '/eca-agent',
  GAME_SERVER: '/game-server',
  STORY_SERVER: '/story-server',
} as const

export const API_ENDPOINTS = {
  GENERATE_VISUAL_AID: '/api/generate-visual-aid',
  GENERATE_QUESTION_PAPER: '/api/generate-question-paper',
  GENERATE_KNOWLEDGE_BASE: '/api/generate-knowledge-base',
} as const 