import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Users, 
  BookOpen, 
  Settings, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  Star,
  Zap,
  Heart,
  Brain,
  MessageSquare,
  Award
} from 'lucide-react';
import { generateQuestions, Question } from './services/geminiService';
import { GamePlan, UserProgress, MOTIVATION_THEORIES, GAMIFICATION_ELEMENTS } from './types';

type AppState = 'landing' | 'planning' | 'pre-test' | 'game' | 'post-test' | 'evaluation' | 'results' | 'achievements';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [plan, setPlan] = useState<GamePlan>({
    targetGroup: { 
      age: '', 
      level: '', 
      priorKnowledge: '', 
      differentiation: '' 
    },
    objectives: { 
      learningGoal: '', 
      competencies: [], 
      behaviorChange: '', 
      funFactor: '' 
    },
    subject: { 
      name: 'Mathe', 
      topic: '', 
      curriculumLevel: '10' 
    },
    motivationTheories: [],
    gamificationElements: []
  });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress>({
    preTestScore: null,
    postTestScore: null,
    gameScore: 0,
    badges: [],
    surveyCompleted: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  // Load questions when game starts
  const startLearningJourney = async () => {
    setIsLoading(true);
    try {
      const q = await generateQuestions(plan.subject.topic || plan.subject.name, `${plan.subject.curriculumLevel}. Klasse`, 10, plan.subject.name);
      setQuestions(q);
      setCurrentQuestionIndex(0);
      setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
      setState('game');
    } catch (error: any) {
      console.error(error);
      alert(`Ups! Es gab ein Problem beim Generieren der Fragen: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    let nextQuestions = questions;

    if (isCorrect) {
      setProgress(prev => ({ ...prev, gameScore: prev.gameScore + 100 }));
      setFeedback({ correct: true, message: "Hervorragend! Dopamin-Kick aktiviert! 🚀" });
    } else {
      setFeedback({ correct: false, message: `Nicht ganz. ${questions[currentQuestionIndex].explanation}` });
      // Append the question to the end so it gets repeated later
      nextQuestions = [...questions, questions[currentQuestionIndex]];
      setQuestions(nextQuestions);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < nextQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // End of quiz
        // Score is based on 10 questions divided by total attempts (nextQuestions.length)
        const score = (10 / nextQuestions.length) * 100;
        
        let newBadges = [...progress.badges];
        if (score === 100) {
          const title = plan.subject.name === 'Mathe' ? 'Mathe Meister' : 
                        plan.subject.name === 'Deutsch' ? 'Deutsch Profi' : 
                        plan.subject.name === 'Englisch' ? 'Englisch Master' : 
                        plan.subject.name === 'PuG' ? 'PuG Experte' : 'Wirtschafts-Ass';
          if (!newBadges.includes(title)) {
            newBadges.push(title);
          }
        }

        setProgress(prev => ({ ...prev, postTestScore: score, badges: newBadges }));
        setState('results');
      }
    }, 3000);
  };

  const resetGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
    setState('planning');
  };

  return (
    <div className="min-h-screen bg-[#46178F] text-white font-sans selection:bg-[#F2F2F2] selection:text-[#46178F]">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-16 bg-[#250850] flex flex-col items-center py-8 gap-8 z-50 shadow-xl">
        <div className="flex-1 flex flex-col gap-6 text-white/40">
          <Settings 
            className={`cursor-pointer hover:text-white transition-colors ${state === 'planning' ? 'text-white' : ''}`} 
            onClick={() => setState('planning')} 
          />
          <Play 
            className={`cursor-pointer hover:text-white transition-colors ${state === 'landing' ? 'text-white' : ''}`} 
            onClick={() => {
              setQuestions([]);
              setCurrentQuestionIndex(0);
              setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
              setState('landing');
            }} 
          />
          <Award 
            className={`cursor-pointer hover:text-white transition-colors ${state === 'achievements' ? 'text-white' : ''}`} 
            onClick={() => setState('achievements')} 
          />
        </div>
      </nav>

      <main className="pl-16 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <motion.section 
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-2xl mb-8 rotate-3">
                <h1 className="text-6xl md:text-8xl font-black text-[#46178F] tracking-tighter uppercase">
                  Wirtschaft<br/>profi
                </h1>
              </div>
              <p className="text-2xl font-bold mb-12 max-w-2xl text-white/90 drop-shadow-md">
                Bist du bereit für das ultimative Lern-Quiz?
              </p>
              <button 
                onClick={() => setState('planning')}
                className="group flex items-center gap-4 bg-[#333333] text-white px-12 py-6 rounded-xl text-2xl font-black uppercase shadow-[0_6px_0_0_#1a1a1a] active:translate-y-1 active:shadow-none transition-all"
              >
                Start <ArrowRight className="w-8 h-8" />
              </button>
            </motion.section>
          )}

          {state === 'planning' && (
            <motion.section 
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-20 px-8"
            >
              <div className="space-y-12 text-[#333333]">
                {/* Subject */}
                <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-6 h-6 text-[#46178F]" />
                    <h3 className="font-black uppercase tracking-wider text-xl">Was lernst du heute?</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase opacity-50 ml-1">Fach & Klasse</label>
                      <div className="grid grid-cols-2 gap-4">
                        <select 
                          className="p-4 rounded-xl border-2 border-[#F2F2F2] focus:border-[#46178F] outline-none bg-[#F8F8F8] text-[#333333] font-bold"
                          value={plan.subject.name}
                          onChange={e => setPlan({...plan, subject: {...plan.subject, name: e.target.value}})}
                        >
                          <option>Mathe</option>
                          <option>Deutsch</option>
                          <option>Englisch</option>
                          <option>PuG</option>
                          <option>Gemischt</option>
                        </select>
                        <select 
                          className="p-4 rounded-xl border-2 border-[#F2F2F2] focus:border-[#46178F] outline-none bg-[#F8F8F8] text-[#333333] font-bold"
                          value={plan.subject.curriculumLevel}
                          onChange={e => setPlan({...plan, subject: {...plan.subject, curriculumLevel: e.target.value}})}
                        >
                          {Array.from({length: 11}, (_, i) => i + 1).map(n => (
                            <option key={n} value={n.toString()}>{n}. Klasse</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase opacity-50 ml-1">Konkretes Thema (Optional)</label>
                      <input 
                        placeholder="z.B. Bruchrechnen oder Grammatik" 
                        className="w-full p-4 rounded-xl border-2 border-[#F2F2F2] focus:border-[#46178F] outline-none bg-[#F8F8F8] text-[#333333] font-bold"
                        value={plan.subject.topic}
                        onChange={e => setPlan({...plan, subject: {...plan.subject, topic: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startLearningJourney}
                  disabled={isLoading}
                  className="w-full bg-[#26890C] text-white py-8 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#1a5e08] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Lädt...' : 'Spiel starten!'}
                </button>
              </div>
            </motion.section>
          )}

          {state === 'game' && questions.length > 0 && (
            <motion.section 
              key="gameplay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              {/* Question Header */}
              <div className="bg-white text-[#333333] p-12 border-b border-[#141414]/5 flex flex-col items-center text-center">
                <div className="max-w-4xl w-full">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-30">
                      Frage {currentQuestionIndex + 1} von {questions.length}
                    </div>
                    <div className="text-sm font-black text-[#46178F] uppercase tracking-widest">
                      Quiz
                    </div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-30">
                      Score: {progress.gameScore}
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#141414]">
                    {questions[currentQuestionIndex].text}
                  </h2>
                </div>
              </div>

              {/* Media Placeholder Area */}
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full max-w-2xl aspect-video bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-[#141414]/5 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#46178F]/5 to-transparent opacity-50" />
                  <Brain className="w-32 h-32 text-[#46178F]/10 group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>

              {/* Answer Grid */}
              <div className="max-w-4xl mx-auto w-full px-8 pb-12">
                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestionIndex].options.map((opt, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={!!feedback}
                        className={`
                          group relative w-full p-8 text-left rounded-3xl border-2 transition-all duration-300
                          ${feedback ? 'opacity-50' : 'hover:border-[#46178F] hover:shadow-xl hover:-translate-y-1'}
                          bg-white border-[#F2F2F2]
                        `}
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-[#F8F8F8] flex items-center justify-center font-black text-[#46178F] group-hover:bg-[#46178F] group-hover:text-white transition-colors">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-xl font-bold text-[#333333]">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl p-8 rounded-[32px] shadow-2xl z-[100] backdrop-blur-xl border-2
                      ${feedback.correct 
                        ? 'bg-[#26890C]/90 border-[#26890C] text-white' 
                        : 'bg-[#E21B3C]/90 border-[#E21B3C] text-white'}
                    `}
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        {feedback.correct ? <CheckCircle2 className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-wider mb-2">
                          {feedback.correct ? 'Richtig!' : 'Falsch!'}
                        </h3>
                        <p className="text-lg font-medium opacity-90 leading-relaxed">
                          {feedback.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {state === 'evaluation' && (
            <motion.section 
              key="evaluation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto py-20 px-8"
            >
              <h2 className="text-5xl font-serif italic mb-8 text-center">Evaluation</h2>
              <p className="text-center opacity-60 mb-12">Hilf uns, die A-Tutor-League noch besser zu machen. Dein Feedback zählt!</p>

              <div className="space-y-8 bg-white p-12 rounded-[40px] border border-[#141414]/5 text-[#333333]">
                <div>
                  <p className="font-bold mb-4">Wie viel Spaß hat das Spiel gemacht?</p>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className="flex-1 py-4 border border-[#141414]/10 rounded-xl hover:bg-[#141414] hover:text-white transition-colors font-mono">
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-4">Waren die Regeln verständlich?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 border border-[#141414]/10 rounded-xl hover:bg-[#141414] hover:text-white transition-colors">Ja, absolut</button>
                    <button className="py-4 border border-[#141414]/10 rounded-xl hover:bg-[#141414] hover:text-white transition-colors">Eher nicht</button>
                  </div>
                </div>

                <button 
                  onClick={() => setState('results')}
                  className="w-full bg-[#141414] text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#5A5A40] transition-all"
                >
                  Ergebnisse ansehen
                </button>
              </div>
            </motion.section>
          )}

          {state === 'results' && (
            <motion.section 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto py-20 px-8"
            >
              <div className="text-center mb-20">
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 block">A-Tutor-League Report</span>
                <h2 className="text-6xl font-serif italic">Deine Auswertung</h2>
              </div>

              <div className="flex justify-center mb-12 text-[#333333]">
                <div className="bg-white p-12 rounded-[40px] border border-[#141414]/5 text-center w-full max-w-md shadow-xl">
                  <p className="text-sm font-black uppercase tracking-[0.2em] opacity-50 mb-4">Dein Ergebnis</p>
                  <p className="text-8xl font-black text-[#46178F]">{Math.round(progress.postTestScore || 0)}%</p>
                  <p className="mt-4 font-bold opacity-70">
                    {progress.postTestScore === 100 ? 'Perfekt!' : progress.postTestScore! >= 60 ? 'Gut gemacht!' : 'Übe noch ein bisschen!'}
                  </p>
                </div>
              </div>

              {progress.postTestScore === 100 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-12 p-12 bg-gradient-to-br from-[#46178F] to-[#141414] text-white rounded-[40px] text-center shadow-2xl border-4 border-yellow-400/20"
                >
                  <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-400 animate-bounce" />
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">Unglaublich!</h3>
                  <p className="text-2xl font-black text-yellow-400 uppercase tracking-[0.2em]">
                    {plan.subject.name === 'Mathe' ? 'Mathe Meister' : 
                     plan.subject.name === 'Deutsch' ? 'Deutsch Profi' : 
                     plan.subject.name === 'Englisch' ? 'Englisch Master' : 
                     plan.subject.name === 'PuG' ? 'PuG Experte' : 'Wirtschafts-Ass'}
                  </p>
                  <p className="mt-6 opacity-80 font-medium max-w-md mx-auto">
                    Du hast alle 10 Fragen perfekt beantwortet. Du bist jetzt offiziell ein Profi in diesem Thema!
                  </p>
                </motion.div>
              )}

              <div className="mt-12 text-center">
                <button 
                  onClick={resetGame}
                  className="inline-flex items-center gap-4 border border-[#141414] px-8 py-4 rounded-full hover:bg-[#141414] hover:text-white transition-all"
                >
                  Neues Spiel planen <ChevronRight />
                </button>
              </div>
            </motion.section>
          )}

          {state === 'achievements' && (
            <motion.section 
              key="achievements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto py-20 px-8"
            >
              <div className="text-center mb-20">
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 block">Trophäenraum</span>
                <h2 className="text-6xl font-serif italic">Deine Erfolge</h2>
              </div>

              <div className="bg-white p-12 rounded-[40px] border border-[#141414]/5 text-[#333333] shadow-xl">
                {progress.badges.length === 0 ? (
                  <div className="text-center py-12 opacity-50">
                    <Award className="w-24 h-24 mx-auto mb-6 opacity-20" />
                    <p className="text-2xl font-bold">Noch keine Titel gesammelt.</p>
                    <p className="mt-2">Beantworte alle 10 Fragen in einem Quiz richtig, um Meistertitel freizuschalten!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {progress.badges.map((badge, i) => (
                      <div key={i} className="bg-gradient-to-br from-[#46178F] to-[#250850] text-white p-8 rounded-3xl text-center shadow-lg border-2 border-yellow-400/20 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                        <p className="font-black uppercase tracking-wider text-lg">{badge}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
