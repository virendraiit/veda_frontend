import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Handle GET requests for English communication resources
    return NextResponse.json({
      success: true,
      message: "English Communication API is working",
      endpoints: {
        practice: "POST /api/english-communication/practice",
        assessment: "POST /api/english-communication/assessment",
        feedback: "POST /api/english-communication/feedback"
      }
    })
  } catch (error) {
    console.error("Error in English communication API:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, level } = body

    if (!type) {
      return NextResponse.json({ 
        error: "Type is required. Available types: practice, assessment, feedback" 
      }, { status: 400 })
    }

    // Handle different types of English communication requests
    switch (type) {
      case "practice":
        return NextResponse.json({
          success: true,
          type: "practice",
          exercises: [
            {
              id: 1,
              title: "Daily Conversation Practice",
              description: "Practice common daily conversations",
              difficulty: level || "beginner"
            },
            {
              id: 2,
              title: "Grammar Exercise",
              description: "Improve your grammar skills",
              difficulty: level || "intermediate"
            }
          ]
        })

      case "assessment":
        return NextResponse.json({
          success: true,
          type: "assessment",
          questions: [
            {
              id: 1,
              question: "What is the correct form of the verb in this sentence?",
              options: ["is", "are", "am", "be"],
              correct: 0
            }
          ]
        })

      case "feedback":
        return NextResponse.json({
          success: true,
          type: "feedback",
          message: "Thank you for your submission. Your feedback has been recorded.",
          suggestions: [
            "Practice speaking regularly",
            "Read English books",
            "Watch English movies with subtitles"
          ]
        })

      default:
        return NextResponse.json({ 
          error: "Invalid type. Available types: practice, assessment, feedback" 
        }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in English communication API:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
} 