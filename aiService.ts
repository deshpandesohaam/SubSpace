import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface InsightData {
  title: string;
  content: string;
  metadata?: any;
}

/**
 * Generate AI-powered insight from content
 * Falls back to mock implementation if OpenAI API key is not provided
 */
export async function generateInsight(
  content: string,
  type:
    | "SUMMARY"
    | "TRANSCRIPT"
    | "KEY_POINTS"
    | "ACTION_ITEMS"
    | "SENTIMENT" = "SUMMARY"
): Promise<InsightData> {
  // Use OpenAI if available
  if (openai) {
    try {
      const prompt = getPromptForType(content, type);

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates insights from video content and recordings.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiContent = response.choices[0]?.message?.content || "";

      return {
        title: getTitleForType(type),
        content: aiContent,
        metadata: {
          model: "gpt-4-turbo-preview",
          type,
          tokens: response.usage?.total_tokens,
        },
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fall back to mock
      return generateMockInsight(content, type);
    }
  }

  // Mock implementation
  return generateMockInsight(content, type);
}

function getPromptForType(content: string, type: string): string {
  const prompts = {
    SUMMARY: `Summarize the following content in 2-3 paragraphs:\n\n${content}`,
    TRANSCRIPT: `Create a detailed transcript from the following content:\n\n${content}`,
    KEY_POINTS: `Extract the key points from the following content as bullet points:\n\n${content}`,
    ACTION_ITEMS: `Identify action items and next steps from the following content:\n\n${content}`,
    SENTIMENT: `Analyze the sentiment and tone of the following content:\n\n${content}`,
  };

  return prompts[type as keyof typeof prompts] || prompts.SUMMARY;
}

function getTitleForType(type: string): string {
  const titles = {
    SUMMARY: "Content Summary",
    TRANSCRIPT: "Transcript",
    KEY_POINTS: "Key Points",
    ACTION_ITEMS: "Action Items",
    SENTIMENT: "Sentiment Analysis",
  };

  return titles[type as keyof typeof titles] || "Insight";
}

function generateMockInsight(content: string, type: string): InsightData {
  const mockResponses: Record<string, InsightData> = {
    SUMMARY: {
      title: "Content Summary",
      content: `This is a mock summary of the provided content: "${content.substring(
        0,
        100
      )}...". In a production environment with OpenAI API configured, this would be a detailed AI-generated summary.

To enable real AI insights:
1. Get an OpenAI API key from https://platform.openai.com
2. Add it to your backend/.env file: OPENAI_API_KEY=your-key-here
3. Restart the backend server`,
      metadata: {
        type: "MOCK",
        note: "Using mock implementation. Configure OPENAI_API_KEY for real AI insights.",
      },
    },
    KEY_POINTS: {
      title: "Key Points",
      content: `• Point 1: Key insight from the content\n• Point 2: Another important observation\n• Point 3: Additional noteworthy detail\n\nNote: This is a mock response. Configure OPENAI_API_KEY for real AI-generated key points.`,
      metadata: { type: "MOCK" },
    },
    ACTION_ITEMS: {
      title: "Action Items",
      content: `• Action Item 1: Task derived from content\n• Action Item 2: Follow-up action\n• Action Item 3: Additional task\n\nNote: This is a mock response. Configure OPENAI_API_KEY for real AI-generated action items.`,
      metadata: { type: "MOCK" },
    },
    SENTIMENT: {
      title: "Sentiment Analysis",
      content: `Sentiment: Positive\nTone: Professional and informative\nConfidence: High\n\nNote: This is a mock response. Configure OPENAI_API_KEY for real AI-generated sentiment analysis.`,
      metadata: { type: "MOCK" },
    },
    TRANSCRIPT: {
      title: "Transcript",
      content: `This is a mock transcript of the provided content. In production with OpenAI API, this would be a detailed word-by-word transcript.\n\nContent: ${content}\n\nNote: Configure OPENAI_API_KEY for real transcript generation.`,
      metadata: { type: "MOCK" },
    },
  };

  return mockResponses[type] || mockResponses.SUMMARY;
}
