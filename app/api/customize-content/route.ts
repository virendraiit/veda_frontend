import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl, API_ENDPOINTS } from "@/lib/config"
import { saveCustomContent } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 API: Starting content customization request...')
    const body = await request.json()
    const { subject, grade, topic, userId, userEmail } = body
    console.log('🎨 API: Request body:', { subject, grade, topic, userId, userEmail })

    // Validate required fields
    if (!subject || !grade || !topic || !userId || !userEmail) {
      console.log('🎨 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: subject, grade, topic, userId, userEmail' },
        { status: 400 }
      )
    }

    // Call the external content customization API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    console.log('🎨 API: Using API base URL:', API_BASE_URL)
    const contentResponse = await fetch(`${API_BASE_URL}/customize-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject.trim(),
        grade: grade,
        topic: topic.trim()
      }),
    })

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text()
      console.error('🎨 API: External API error response:', errorText)
      throw new Error(`Content customization API error: ${contentResponse.status} - ${errorText}`)
    }

    const contentData = await contentResponse.json()
    console.log('🎨 API: Received content data:', {
      hasContentLessonPlan: !!contentData.content_lesson_plan,
      contentLessonPlanLength: contentData.content_lesson_plan?.length || 0,
      materialUrl: contentData.material_url,
      imageUrl: contentData.image_url
    })
    
    // Save the content to Firebase
    const saveResult = await saveCustomContent({
      subject,
      grade,
      topic,
      contentLessonPlan: contentData.content_lesson_plan,
      materialUrl: contentData.material_url,
      imageUrl: contentData.image_url,
      userId,
      userEmail,
      createdAt: new Date()
    })

    if (!saveResult.success) {
      throw new Error(`Failed to save content: ${saveResult.error}`)
    }
    
    console.log('🎨 API: Content customized and saved successfully')
    return NextResponse.json({
      success: true,
      data: {
        ...contentData,
        contentId: saveResult.contentId
      },
      message: 'Content customized and saved successfully'
    })

  } catch (error) {
    console.error('Content customization error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to customize content' 
      },
      { status: 500 }
    )
  }
} 