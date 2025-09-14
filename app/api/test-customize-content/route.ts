import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test API: Testing external content customization API...')
    
    // Test the external API with the same data from your curl example
    const testData = {
      subject: "Science",
      grade: "5",
      topic: "Refraction"
    }
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    console.log('🧪 Test API: Using API base URL:', API_BASE_URL)
    
    const contentResponse = await fetch(`${API_BASE_URL}/customize-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log('🧪 Test API: Response status:', contentResponse.status)
    console.log('🧪 Test API: Response headers:', Object.fromEntries(contentResponse.headers.entries()))

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text()
      console.error('🧪 Test API: Error response:', errorText)
      return NextResponse.json({
        success: false,
        error: `External API error: ${contentResponse.status}`,
        errorDetails: errorText,
        testData
      })
    }

    const contentData = await contentResponse.json()
    console.log('🧪 Test API: Success response keys:', Object.keys(contentData))
    console.log('🧪 Test API: Has content_lesson_plan:', !!contentData.content_lesson_plan)
    console.log('🧪 Test API: Content lesson plan length:', contentData.content_lesson_plan?.length || 0)
    
    return NextResponse.json({
      success: true,
      testData,
      responseKeys: Object.keys(contentData),
      hasContentLessonPlan: !!contentData.content_lesson_plan,
      contentLessonPlanLength: contentData.content_lesson_plan?.length || 0,
      materialUrl: contentData.material_url,
      imageUrl: contentData.image_url,
      sampleContent: contentData.content_lesson_plan?.substring(0, 200) + '...'
    })

  } catch (error) {
    console.error('🧪 Test API: Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
} 