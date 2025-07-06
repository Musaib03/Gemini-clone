import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(prompt) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const result = await geminiModel.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 2048,
      }
    });

    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('Full error:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

export default function runCli() {
}