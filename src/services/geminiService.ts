import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    let apiKey = "";
    try {
      // The AI Studio environment provides this specifically
      apiKey = process.env.GEMINI_API_KEY || "";
    } catch (error) {
      console.warn("process.env is not accessible. You may need to configure your API key.");
    }

    // Fallback for standard Vite environments if the user added it correctly
    if (!apiKey && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
    }

    if (!apiKey) {
      throw new Error(`Gemini API Key fehlt in der gebauten App!
      
Auf GitHub Pages musst du folgendes prüfen:
1. In GitHub bei "Settings" (links "Pages"): Ist die "Source" auf "GitHub Actions" gestellt? (Nicht "Deploy from branch").
2. In GitHub bei "Settings -> Secrets and variables -> Actions": Hast du das Secret EXACT als "VITE_GEMINI_API_KEY" (unter Repository secrets) angelegt?
3. Nachdem du Punkt 1 und 2 gemacht hast, musst du den Code nochmal exportieren/pushen oder in Actions den letzten Workflow manuell neu starten (\`Re-run all jobs\`).`);
    }
    
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function generateQuestions(topic: string, level: string, count: number = 5, subject: string = ""): Promise<Question[]> {
  try {
    const aiClient = getAiClient();
    console.log("AI Client successfully initialized. Requesting subject: ", subject);
    const languageInstruction = subject.toLowerCase() === 'englisch' 
      ? "CRITICAL: The questions, options, and explanations MUST be written entirely in English." 
      : "The questions, options, and explanations should be written in German.";

    const response = await aiClient.models.generateContent({
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

    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to generate questions", e);
    // Rethrow to be caught by the UI
    throw e;
  }
}
