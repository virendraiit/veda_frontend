import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl, API_ENDPOINTS } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    console.log('🧠 API: Starting knowledge base generation request...')
    const body = await request.json()
    const { topic, grade } = body
    console.log('🧠 API: Request body:', { topic, grade })

    // Validate required fields
    if (!topic || !grade) {
      console.log('🧠 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: topic and grade' },
        { status: 400 }
      )
    }

    // Call the external knowledge base generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getApiUrl()
    const knowledgeBaseResponse = await fetch(`${API_BASE_URL}/generate-paper-with-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topic.trim(),
        grade: grade
      }),
    })

    if (!knowledgeBaseResponse.ok) {
      throw new Error(`Knowledge base generation API error: ${knowledgeBaseResponse.status}`)
    }

    const knowledgeBaseData = await knowledgeBaseResponse.json()
    
    console.log('🧠 API: Knowledge base generated successfully')
    return NextResponse.json({
      success: true,
      data: knowledgeBaseData,
      message: 'Knowledge base generated successfully'
    })

  } catch (error) {
    console.error('Knowledge base generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate knowledge base' 
      },
      { status: 500 }
    )
  }
} 