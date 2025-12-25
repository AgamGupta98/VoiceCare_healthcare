import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Use Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY || "DEMO_MODE"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a caring and helpful voice assistant for health and wellness. Provide supportive, clear, and concise responses. Keep responses under 100 words for voice output.\n\nUser: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        }),
      },
    )

    if (!response.ok) {
      // Fallback to mock response for demo
      return NextResponse.json({
        response:
          "This is a demo response from Gemini. Please add GOOGLE_GEMINI_API_KEY to enable real Google Gemini AI responses.",
      })
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in Gemini chat:", error)
    return NextResponse.json(
      {
        response:
          "Demo mode: Add your Google Gemini API key for real AI responses. For now, I can help you with basic health and wellness questions!",
        error: "API key not configured",
      },
      { status: 200 },
    )
  }
}
