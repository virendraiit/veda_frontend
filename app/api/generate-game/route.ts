import { NextRequest, NextResponse } from 'next/server'
import { saveGame, getGamesByUser } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Starting game generation request...')
    const body = await request.json()
    const { topic, description, game_type, difficulty, user_id, userEmail } = body
    console.log('🚀 API: Request body:', { topic, description, game_type, difficulty, user_id, userEmail })

    // Validate required fields
    if (!topic || !description || !game_type || !difficulty || !user_id || !userEmail) {
      console.log('🚀 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call the external game generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://google-agentic-ai-594290114400.us-central1.run.app'
    const gameGenerationResponse = await fetch(`${API_BASE_URL}/generate-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API keys or authentication headers here
        // 'Authorization': `Bearer ${process.env.GAME_API_KEY}`,
      },
      body: JSON.stringify({
        user_id: user_id,
        game_type: game_type,
        difficulty: difficulty,
        topic: topic,
      }),
    })

    if (!gameGenerationResponse.ok) {
      throw new Error(`Game generation API error: ${gameGenerationResponse.status}`)
    }

    const gameData = await gameGenerationResponse.json()
    
    // Extract the game URL from the response
    const gameUrl = gameData.game_url || gameData.url || gameData.htmlUrl

    if (!gameUrl) {
      throw new Error('No game URL received from generation API')
    }

    // Create game record for Firebase
    const gameRecord = {
      id: Date.now().toString(), // Generate unique ID
      title: topic,
      description,
      gameType: game_type,
      gradeLevel: difficulty,
      gameUrl,
      createdAt: new Date(),
      userId: user_id,
      userEmail,
    }

    // Save to Firebase
    console.log('🚀 API: Saving game to Firebase...')
    const saveResult = await saveGame(gameRecord)
    console.log('🚀 API: Firebase save result:', saveResult)
    
    if (!saveResult.success) {
      console.error('🚀 API: Failed to save game to Firebase:', saveResult.error)
      throw new Error(saveResult.error || 'Failed to save game to database')
    }

    console.log('🚀 API: Game saved successfully with ID:', saveResult.gameId)
    return NextResponse.json({
      success: true,
      gameUrl,
      gameId: saveResult.gameId,
      message: 'Game generated successfully'
    })

  } catch (error) {
    console.error('Game generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate game' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const games = await getGamesByUser(userId)
    
    return NextResponse.json({
      success: true,
      games
    })

  } catch (error) {
    console.error('Error fetching games:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch games' 
      },
      { status: 500 }
    )
  }
} 