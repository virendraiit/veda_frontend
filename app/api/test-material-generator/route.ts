import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test API: Testing external material generator API...')
    
    // Test the external API with the same data from your curl example
    const testData = {
      subject: "Science",
      grade: "5",
      topic: "Refraction"
    }
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    console.log('🧪 Test API: Using API base URL:', API_BASE_URL)
    
    const materialResponse = await fetch(`${API_BASE_URL}/generate-materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log('🧪 Test API: Response status:', materialResponse.status)
    console.log('🧪 Test API: Response headers:', Object.fromEntries(materialResponse.headers.entries()))

    if (!materialResponse.ok) {
      const errorText = await materialResponse.text()
      console.error('🧪 Test API: Error response:', errorText)
      return NextResponse.json({
        success: false,
        error: `External API error: ${materialResponse.status}`,
        errorDetails: errorText,
        testData
      })
    }

    const materialData = await materialResponse.json()
    console.log('🧪 Test API: Success response keys:', Object.keys(materialData))
    console.log('🧪 Test API: Has materials:', !!materialData.materials)
    console.log('🧪 Test API: Materials length:', materialData.materials?.length || 0)
    
    return NextResponse.json({
      success: true,
      testData,
      responseKeys: Object.keys(materialData),
      hasMaterials: !!materialData.materials,
      materialsLength: materialData.materials?.length || 0,
      materialUrl: materialData.material_url,
      imageUrl: materialData.image_url,
      sampleContent: materialData.materials?.substring(0, 200) + '...'
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