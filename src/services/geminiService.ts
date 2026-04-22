import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function generateQuestions(topic: string, level: string, count: number = 5, subject: string = ""): Promise<Question[]> {
  const languageInstruction = subject.toLowerCase() === 'englisch' 
    ? "CRITICAL: The questions, options, and explanations MUST be written entirely in English." 
    : "The questions, options, and explanations should be written in German.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} VERY EASY multiple-choice questions for a learning game about "${topic}" (Subject: ${subject}) specifically for students in ${level}. 
    The questions must be appropriate for the difficulty and curriculum of ${level}.
    The questions should be simple, easy to understand, and SOLVABLE MENTALLY without a calculator or paper.
    ${languageInstruction}
    Return a JSON array of objects with: id (string), text (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string), difficulty (easy/medium/hard).`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
}
