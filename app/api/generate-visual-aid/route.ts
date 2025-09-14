import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 API: Starting visual aid generation request...')
    const body = await request.json()
    const { topic, language = "en", grade } = body
    console.log('🎨 API: Request body:', { topic, language, grade })

    // Validate required fields
    if (!topic || !grade) {
      console.log('🎨 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: topic and grade' },
        { status: 400 }
      )
    }

    // Call the external visual aid generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getApiUrl()
    const visualAidResponse = await fetch(`${API_BASE_URL}/generate-visual-aid`, {
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

    if (!visualAidResponse.ok) {
      throw new Error(`Visual aid generation API error: ${visualAidResponse.status}`)
    }

    const visualAidData = await visualAidResponse.json()
    
    console.log('🎨 API: Visual aid generated successfully')
    return NextResponse.json({
      success: true,
      data: visualAidData,
      message: 'Visual aid generated successfully'
    })

  } catch (error) {
    console.error('Visual aid generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate visual aid' 
      },
      { status: 500 }
    )
  }
} 