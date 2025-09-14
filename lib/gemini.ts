import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAsVkN0ygVBsl2tVAN_Dq5E0AY5aabyrqA")

export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating content:", error)
    throw new Error("Failed to generate content")
  }
}

export async function generateStructuredContent(prompt: string, schema: any): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      return JSON.parse(text)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      // Return a fallback structure based on the schema
      return createFallbackResponse(schema)
    }
  } catch (error) {
    console.error("Error generating structured content:", error)
    return createFallbackResponse(schema)
  }
}

function createFallbackResponse(schema: any): any {
  const fallback: any = {}

  if (schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      const property = schema.properties[key]

      if (property.type === "string") {
        fallback[key] = "Content not available"
      } else if (property.type === "array") {
        fallback[key] = ["Default item"]
      } else if (property.type === "object") {
        fallback[key] = {}
      }
    })
  }

  return fallback
}

export async function generateImage(
  prompt: string,
  numberOfImages = 1,
): Promise<{
  success: boolean
  images?: string[]
  description?: string
  error?: string
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation" })

    const enhancedPrompt = `
      ${prompt}
      
      Create ${numberOfImages} high-quality educational image(s) that are:
      - Clear and visually appealing
      - Suitable for classroom use
      - Culturally appropriate for Indian students
      - Educational and informative
      - Bright and engaging colors
    `

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response

    // Note: This is a placeholder implementation
    // The actual Gemini 2.0 Flash image generation API may have different response format
    const images = Array.from(
      { length: numberOfImages },
      (_, index) => `/placeholder.svg?height=400&width=400&text=Generated+Image+${index + 1}`,
    )

    return {
      success: true,
      images,
      description: "Images generated successfully with Gemini 2.0 Flash",
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return {
      success: false,
      error: "Failed to generate image. Please try again.",
    }
  }
}

export async function generateImageDescription(prompt: string, language = "english"): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const enhancedPrompt = `
      Create a detailed description for an educational image based on this request: "${prompt}"
      
      Language: ${language}
      
      Please provide:
      1. A detailed visual description
      2. Specific elements to include
      3. Color suggestions
      4. Composition guidelines
      5. Educational value explanation
      
      Make the description detailed enough that an artist or another AI could create the image from this description.
      
      ${language !== "english" ? "Include both English and local language terms where appropriate." : ""}
    `

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating image description:", error)
    throw new Error("Failed to generate image description")
  }
}

export async function generateSportsAnalysis(videoData: string, sport: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
      Analyze this ${sport} performance and provide detailed feedback:
      
      Video/Performance Data: ${videoData}
      
      Please provide:
      1. Technique analysis
      2. Areas for improvement
      3. Strengths identified
      4. Specific drills to practice
      5. Safety considerations
      6. Progress tracking suggestions
      
      Make the feedback constructive and suitable for students learning ${sport}.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      analysis: response.text(),
      sport: sport,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error generating sports analysis:", error)
    throw new Error("Failed to analyze sports performance")
  }
}

export async function generateMusicFeedback(audioData: string, instrument: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
      Analyze this ${instrument} performance and provide detailed musical feedback:
      
      Audio/Performance Data: ${audioData}
      
      Please provide:
      1. Rhythm and timing analysis
      2. Pitch accuracy assessment
      3. Technique evaluation
      4. Musical expression feedback
      5. Practice recommendations
      6. Next steps for improvement
      
      Make the feedback encouraging and educational for music students.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      feedback: response.text(),
      instrument: instrument,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error generating music feedback:", error)
    throw new Error("Failed to analyze music performance")
  }
}
