export interface GamePlan {
  targetGroup: {
    age: string;
    level: string;
    priorKnowledge: string;
    differentiation: string;
  };
  objectives: {
    learningGoal: string;
    competencies: string[];
    behaviorChange: string;
    funFactor: string;
  };
  subject: {
    name: string;
    topic: string;
    curriculumLevel: string;
  }; 
  motivationTheories: string[];
  gamificationElements: string[];
}

export interface UserProgress {
  preTestScore: number | null;
  postTestScore: number | null;
  gameScore: number;
  badges: string[];
  surveyCompleted: boolean;
}

export const MOTIVATION_THEORIES = [
  { id: 'maslow', name: 'Maslow (Bedürfnisse)', description: 'Zugehörigkeit & Anerkennung' },
  { id: 'conditioning', name: 'Konditionierung', description: 'Reize & Belohnungen' },
  { id: 'flow', name: 'Flow-Erleben', description: 'Optimale Herausforderung' },
  { id: 'intrinsic', name: 'Intrinsisch/Extrinsisch', description: 'Inhalt vs. Belohnung' },
  { id: 'dopamine', name: 'Dopamin-Kick', description: 'Glücksgefühle & Wiederholung' }
];

export const GAMIFICATION_ELEMENTS = [
  { id: 'points', name: 'Punkte/Scoring' },
  { id: 'levels', name: 'Levels/Ränge' },
  { id: 'rewards', name: 'Belohnungen/Badges' },
  { id: 'leaderboard', name: 'Leaderboards' },
  { id: 'challenges', name: 'Challenges/Missionen' },
  { id: 'feedback', name: 'Sofortiges Feedback' },
  { id: 'story', name: 'Story/Narrative' },
  { id: 'collaboration', name: 'Zusammenarbeit' }
];
