import { type NextRequest, NextResponse } from "next/server"
import { getApiUrl } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ API: Starting image generation request...')
    const body = await request.json()
    const { prompt, numberOfImages = 1 } = body
    console.log('🖼️ API: Request body:', { prompt, numberOfImages })

    // Validate required fields
    if (!prompt) {
      console.log('🖼️ API: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields: prompt' },
        { status: 400 }
      )
    }

    // Call the external image generation API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getApiUrl()
    const imageResponse = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        numberOfImages: numberOfImages
      }),
    })

    if (!imageResponse.ok) {
      throw new Error(`Image generation API error: ${imageResponse.status}`)
    }

    const imageData = await imageResponse.json()
    
    console.log('🖼️ API: Image generated successfully')
    return NextResponse.json({
      success: true,
      data: imageData,
      message: 'Image generated successfully'
    })

  } catch (error) {
    console.error('Image generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate image' 
      },
      { status: 500 }
    )
  }
}
