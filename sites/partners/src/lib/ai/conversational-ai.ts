import OpenAI from "openai"
import { Message } from "../../components/explore/ChatInterface"

const openai = new OpenAI({
  apiKey: process.env.geminiAPIKey || "",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/",
  dangerouslyAllowBrowser: true,
})

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
    const systemMessageText: string = systemPrompt(applicationData)
    // Always start with system prompt as the first message in history
    const systemMessage = {
      role: "system" as const,
      content: systemMessageText,
    }

    // Build conversation history starting with system context
    const history = [
      systemMessage,
      ...conversationHistory.map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: userMessage,
      },
    ]

    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [systemMessage, ...history],
    })

    // Get the response text
    const fullText = response.choices[0]?.message?.content || ""
    return fullText
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later."
  }
}
