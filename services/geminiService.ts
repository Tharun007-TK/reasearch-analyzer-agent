import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock response for fallback when no API key is present
const MOCK_RESPONSE = "I apologize, but I am running in demo mode without a valid API key. In a real environment, I would analyze the document using Gemini's advanced reasoning capabilities to provide a specific answer. For now, I can tell you that the document discusses the impact of generative AI on early childhood education, specifically highlighting a 24% increase in vocabulary retention in hybrid learning environments.";

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  if (!ai) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_RESPONSE;
  }

  try {
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful research assistant capable of analyzing complex academic documents.',
      },
      history: history // Pass history if needed, though usually managed by the Chat object state in a real session
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service.";
  }
};

export const generateSummary = async (): Promise<string> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "The paper argues that generative AI tools, when integrated into early childhood curriculums, significantly enhance vocabulary acquisition but require careful monitoring to prevent over-reliance on synthetic feedback loops.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Summarize the key thesis of the provided document regarding AI in education.",
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary.";
  }
};