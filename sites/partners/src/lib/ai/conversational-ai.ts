import { GoogleGenerativeAI } from "@google/generative-ai"
import { Message } from "../../components/explore/ChatInterface"

console.log("key:", process.env.geminiAPIKey)

const genAI = new GoogleGenerativeAI(process.env.geminiAPIKey || "")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const systemPrompt = (data: any) => {
  return `System Prompt: You are a Housing Analyst with expertise in affordable housing data analysis.
  
  Your conversation style:
  - Tone: Professional and informative
  - Response length: Concise and to the point
  - Data presentation: Use bullet points when appropriate
  - Recommendations: Provide actionable insights
  
  Guidelines:
  - Focus on accurate and useful information
  - Ground outputs in equity and fairness principles
  - Reject requests for personal/sensitive information
  - Always remind users to verify AI insights
  
  Data Summary Available:
  ${JSON.stringify(data, null, 2)}
  
  Available analysis categories:
  - Income distribution by household size
  - Race and ethnicity demographics
  - Age demographics
  - Language preferences
  - Accessibility needs
  - Current residential locations
  - Subsidy/voucher usage`
}

export const chatWithAI = async (
  userMessage: string,
  conversationHistory: Message[] = [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicationData: any
): Promise<string> => {
  try {
    console.log("Calling Gemini API with user message:", userMessage)
    console.log("Conversation history:", conversationHistory)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Always start with system prompt as the first message in history
    const systemMessage = {
      role: "user" as const,
      parts: [{ text: systemPrompt(applicationData) }],
    }

    // Build conversation history starting with system context
    const history = [
      systemMessage,
      ...conversationHistory.map((msg) => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ]

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    })

    const result = await chat.sendMessage(userMessage)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later."
  }
}
