import { predefinedQuestions } from '../data/questions';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateQuestions(topic: string, level: string, count: number = 5, subject: string = ""): Promise<Question[]> {
  // Simulate network delay to maintain the visual "loading" effect
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Use predefined questions for the requested subject or 'Gemischt' as fallback
  const subjectList = predefinedQuestions[subject] || predefinedQuestions['Gemischt'];
  
  // Mix them up and return the requested amount (up to the amount available)
  const mixed = shuffleArray(subjectList);
  return mixed.slice(0, count);
}
