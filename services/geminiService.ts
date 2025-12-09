import { GoogleGenAI } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize the Google GenAI client
// The API key is safely accessed from the environment variable
const apiKey = process.env.API_KEY || '';

// We only initialize if the key exists to prevent immediate crashes, 
// though the component utilizing this should handle the missing key state.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model'; text: string }[]) => {
  if (!ai) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
