import { NextRequest, NextResponse } from 'next/server'
import { saveMaterial } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    console.log('📚 API: Starting material generation request...')
    const body = await request.json()
    const { subject, grade, topic, userId, userEmail } = body
    console.log('📚 API: Request body:', { subject, grade, topic, userId, userEmail })

    // Validate required fields
    if (!subject || !grade || !topic || !userId || !userEmail) {
      console.log('📚 API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: subject, grade, topic, userId, userEmail' },
        { status: 400 }
      )
    }

    // Call the external material generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    console.log('📚 API: Using API base URL:', API_BASE_URL)
    const materialResponse = await fetch(`${API_BASE_URL}/generate-materials`, {
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

    if (!materialResponse.ok) {
      const errorText = await materialResponse.text()
      console.error('📚 API: External API error response:', errorText)
      throw new Error(`Material generation API error: ${materialResponse.status} - ${errorText}`)
    }

    const materialData = await materialResponse.json()
    console.log('📚 API: Received material data:', {
      hasMaterials: !!materialData.materials,
      materialsLength: materialData.materials?.length || 0,
      materialUrl: materialData.material_url,
      imageUrl: materialData.image_url
    })
    
    // Save the material to Firebase
    const saveResult = await saveMaterial({
      subject,
      grade,
      topic,
      materials: materialData.materials,
      materialUrl: materialData.material_url,
      imageUrl: materialData.image_url,
      userId,
      userEmail,
      createdAt: new Date()
    })

    if (!saveResult.success) {
      throw new Error(`Failed to save material: ${saveResult.error}`)
    }
    
    console.log('📚 API: Material generated and saved successfully')
    return NextResponse.json({
      success: true,
      data: {
        ...materialData,
        materialId: saveResult.materialId
      },
      message: 'Material generated and saved successfully'
    })

  } catch (error) {
    console.error('Material generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate material' 
      },
      { status: 500 }
    )
  }
} 