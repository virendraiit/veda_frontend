import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl, API_ENDPOINTS } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API: Starting question paper generation request...')
    const body = await request.json()
    const { topic, grade } = body
    console.log('📝 API: Request body:', { topic, grade })

    // Validate required fields
    if (!topic || !grade) {
      console.log('📝 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: topic and grade' },
        { status: 400 }
      )
    }

    // Call the external question paper generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getApiUrl()
    const questionPaperResponse = await fetch(`${API_BASE_URL}/generate-paper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topic.trim(),
        grade: grade
      }),
    })

    if (!questionPaperResponse.ok) {
      throw new Error(`Question paper generation API error: ${questionPaperResponse.status}`)
    }

    const questionPaperData = await questionPaperResponse.json()
    
    console.log('📝 API: Question paper generated successfully')
    return NextResponse.json({
      success: true,
      data: questionPaperData,
      message: 'Question paper generated successfully'
    })

  } catch (error) {
    console.error('Question paper generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate question paper' 
      },
      { status: 500 }
    )
  }
} 