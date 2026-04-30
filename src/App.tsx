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
  Award,
  Star
} from 'lucide-react';
import { generateQuestions, Question } from './services/geminiService';
import { vocabulary } from './data/questions';
import { GamePlan, UserProgress, MOTIVATION_THEORIES, GAMIFICATION_ELEMENTS } from './types';

type AppState = 'landing' | 'planning' | 'pre-test' | 'game' | 'post-test' | 'evaluation' | 'results' | 'achievements' | 'vocabulary' | 'multiplayer';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [selectedVocab, setSelectedVocab] = useState<string[]>(vocabulary.map(v => v.en));
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
      name: 'Englisch', 
      topic: 'Vokabeln', 
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
  const [textAnswer, setTextAnswer] = useState("");
  const [originalQuestionCount, setOriginalQuestionCount] = useState(1);
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);

  // Load questions when game starts
  const startLearningJourney = async () => {
    setIsLoading(true);
    try {
      const q = await generateQuestions(plan.subject.topic || plan.subject.name, `${plan.subject.curriculumLevel}. Klasse`, 999, plan.subject.name);
      
      // Filter generated questions to only include those in selectedVocab
      // Note: `q.text` usually contains the vocabulary word in quotes.
      const filteredQ = q.filter(question => {
        return selectedVocab.some(vocabEn => {
          const vocabMatch = vocabulary.find(v => v.en === vocabEn);
          return vocabMatch && (question.text.includes(`"${vocabMatch.en}"`) || question.text.includes(`"${vocabMatch.de}"`));
        });
      });

      // If no questions are left after filtering, show an alert.
      if (filteredQ.length === 0) {
        alert("Bitte wähle mindestens eine Vokabel im Vokabel-Menü aus.");
        setIsLoading(false);
        return;
      }

      setQuestions(filteredQ);
      setOriginalQuestionCount(filteredQ.length);
      setCurrentQuestionIndex(0);
      setFirstAttemptCorrectCount(0);
      setMistakeCount(0);
      setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
      setState('game');
    } catch (error: any) {
      console.error(error);
      alert(`Ups! Es gab ein Problem beim Generieren der Fragen: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeAnswer = (str: string) => {
    let res = str.toLowerCase();
    
    // Remove common filler words (with or without dot)
    const tokensToRemoveRegex = /\b(to|sth|sb|jdn|jdm|etw|sich|etwas|jemanden|jemandem)\b\.?/g;
    res = res.replace(tokensToRemoveRegex, ' ');
    
    // Remove all punctuation (parentheses, slashes, dots, commas, etc)
    res = res.replace(/[.,\/()]/g, ' ');
    
    // Split by whitespace, filter out empty tokens, and join
    return res.split(/\s+/).filter(w => w !== '').join(' ').trim();
  };

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textAnswer.trim() || feedback) return;

    const currentQ = questions[currentQuestionIndex];
    const correctString = currentQ.options[currentQ.correctAnswer];
    
    // Check against full string first, then against normalized version if that fails
    let isCorrect = textAnswer.trim().toLowerCase() === correctString.trim().toLowerCase();
    
    if (!isCorrect) {
      const validAnswers = correctString.split(',').map(ans => normalizeAnswer(ans));
      const userAnswerNormalized = normalizeAnswer(textAnswer);
      isCorrect = validAnswers.some(ans => ans === userAnswerNormalized);
    }
    
    let nextQuestions = [...questions];

    if (isCorrect) {
      if (!currentQ.failed) {
        setFirstAttemptCorrectCount(prev => prev + 1);
      }
      setProgress(prev => ({ ...prev, gameScore: prev.gameScore + 100 }));
      setFeedback({ correct: true, message: "Hervorragend! Dopamin-Kick aktiviert! 🚀" });
      
      if (currentQ.vocabId) {
        const remainingLength = nextQuestions.length - currentQuestionIndex - 1;
        nextQuestions = nextQuestions.filter((q, idx) => {
          if (idx <= currentQuestionIndex) return true;
          return q.vocabId !== currentQ.vocabId;
        });
        const removedCount = remainingLength - (nextQuestions.length - currentQuestionIndex - 1);
        if (removedCount > 0) {
          setOriginalQuestionCount(prev => prev - removedCount);
        }
        setQuestions(nextQuestions);
      }
    } else {
      setMistakeCount(prev => prev + 1);
      setFeedback({ correct: false, message: `Nicht ganz. Die richtige Antwort ist: "${correctString}". ${currentQ.explanation}` });
      // Append the question to the end so it gets repeated later, marked as failed
      nextQuestions = [...nextQuestions, { ...currentQ, failed: true }];
      setQuestions(nextQuestions);
    }

    setTimeout(() => {
      setFeedback(null);
      setTextAnswer("");
      if (currentQuestionIndex < nextQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // End of quiz
        const ratio = firstAttemptCorrectCount / originalQuestionCount;
        
        let newBadges = [...progress.badges];
        let titleToAward = null;

        if (ratio === 1) {
          titleToAward = 'Vokabel-Legende';
        } else if (ratio >= 0.9) {
          titleToAward = 'Wortschatz-Meister';
        } else if (ratio >= 0.75) {
          titleToAward = 'Sprach-Talent';
        } else if (ratio >= 0.5) {
          titleToAward = 'Fleißiger Schüler';
        }
        
        if (titleToAward && !newBadges.includes(titleToAward)) {
          newBadges.push(titleToAward);
        }

        setProgress(prev => ({ ...prev, postTestScore: null, badges: newBadges }));
        setState('results');
      }
    }, 3000);
  };

  const resetGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setFirstAttemptCorrectCount(0);
    setMistakeCount(0);
    setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
    setState('planning');
  };

  return (
    <div className="min-h-screen bg-[#722F37] text-white font-sans selection:bg-[#F5F1E7] selection:text-[#722F37]">
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 h-full w-24 bg-[#4A1E24] flex flex-col items-center py-8 gap-8 z-50 shadow-xl">
        <div className="flex-1 flex flex-col gap-6 w-full px-2 text-white/40">
          <div 
            className={`flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors py-2 ${state === 'vocabulary' ? 'text-white' : ''}`} 
            onClick={() => setState('vocabulary')} 
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-center">Vokabeln</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors py-2 ${state === 'planning' ? 'text-white' : ''}`} 
            onClick={() => setState('planning')} 
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-center">Einstellungen</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors py-2 ${state === 'landing' ? 'text-white' : ''}`} 
            onClick={() => {
              setQuestions([]);
              setCurrentQuestionIndex(0);
              setFirstAttemptCorrectCount(0);
              setMistakeCount(0);
              setProgress(prev => ({ ...prev, gameScore: 0, postTestScore: null }));
              setState('landing');
            }} 
          >
            <Play className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-center">Start</span>
          </div>
          <div 
            className={`flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors py-2 ${state === 'multiplayer' ? 'text-white' : ''}`} 
            onClick={() => setState('multiplayer')} 
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-center">Party</span>
          </div>
        </div>
      </nav>

      <main className="pl-24 min-h-screen flex flex-col">
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
                <h1 className="text-6xl md:text-8xl font-black text-[#722F37] tracking-tighter uppercase">
                  Englisch<br/>profi
                </h1>
              </div>
              <p className="text-2xl font-bold mb-12 max-w-2xl text-white/90 drop-shadow-md">
                Bist du bereit für das ultimative Lern-Quiz?
              </p>
              <button 
                onClick={() => setState('planning')}
                className="group flex items-center gap-4 bg-[#4A3538] text-white px-12 py-6 rounded-xl text-2xl font-black uppercase shadow-[0_6px_0_0_#2A1114] active:translate-y-1 active:shadow-none transition-all"
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
              <div className="space-y-12 text-[#4A3538]">
                {/* Subject */}
                <div className="bg-white p-8 rounded-3xl border border-[#2A1114]/5 shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-6 h-6 text-[#722F37]" />
                    <h3 className="font-black uppercase tracking-wider text-xl">Was lernst du heute?</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase opacity-50 ml-1">Fach & Klasse</label>
                      <div className="grid grid-cols-2 gap-4">
                        <select 
                          className="p-4 rounded-xl border-2 border-[#F5F1E7] bg-[#E8DCC2] text-[#4A3538] font-bold opacity-70 cursor-not-allowed"
                          value={plan.subject.name}
                          disabled
                        >
                          <option>Englisch</option>
                        </select>
                        <select 
                          className="p-4 rounded-xl border-2 border-[#F5F1E7] bg-[#E8DCC2] text-[#4A3538] font-bold opacity-70 cursor-not-allowed"
                          value={plan.subject.curriculumLevel}
                          disabled
                        >
                          <option value="10">10. Klasse</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase opacity-50 ml-1">Konkretes Thema</label>
                      <input 
                        className="w-full p-4 rounded-xl border-2 border-[#F5F1E7] bg-[#E8DCC2] text-[#4A3538] font-bold opacity-70 cursor-not-allowed"
                        value={plan.subject.topic}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startLearningJourney}
                  disabled={isLoading}
                  className="w-full bg-[#C2A878] text-white py-8 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#B09665] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
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
              <div className="bg-white text-[#4A3538] p-12 border-b border-[#2A1114]/5 flex flex-col items-center text-center">
                <div className="max-w-4xl w-full">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-30">
                      Frage {currentQuestionIndex + 1} von {questions.length}
                    </div>
                    <div className="text-sm font-black text-[#722F37] uppercase tracking-widest">
                      Quiz
                    </div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-30">
                      Score: {progress.gameScore}
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#2A1114]">
                    {questions[currentQuestionIndex].text}
                  </h2>
                </div>
              </div>

              {/* Answer Input */}
              <div className="max-w-4xl mx-auto w-full px-8 pb-12 flex-1 pt-12">
                <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={e => setTextAnswer(e.target.value)}
                    disabled={!!feedback}
                    placeholder="Deine Antwort hier eingeben..."
                    className="w-full p-8 text-xl md:text-2xl font-bold bg-white text-[#4A3538] rounded-3xl border-2 border-[#F5F1E7] focus:border-[#722F37] outline-none transition-colors shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!!feedback || !textAnswer.trim()}
                    className="w-full p-6 text-xl font-black text-white bg-[#C2A878] rounded-3xl hover:bg-[#B09665] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg hover:shadow-xl"
                  >
                    Antwort überprüfen
                  </button>
                </form>
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
                        ? 'bg-[#C2A878]/90 border-[#C2A878] text-white' 
                        : 'bg-[#9A2A2A]/90 border-[#9A2A2A] text-white'}
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

              <div className="space-y-8 bg-white p-12 rounded-[40px] border border-[#2A1114]/5 text-[#4A3538]">
                <div>
                  <p className="font-bold mb-4">Wie viel Spaß hat das Spiel gemacht?</p>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className="flex-1 py-4 border border-[#2A1114]/10 rounded-xl hover:bg-[#2A1114] hover:text-white transition-colors font-mono">
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-4">Waren die Regeln verständlich?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 border border-[#2A1114]/10 rounded-xl hover:bg-[#2A1114] hover:text-white transition-colors">Ja, absolut</button>
                    <button className="py-4 border border-[#2A1114]/10 rounded-xl hover:bg-[#2A1114] hover:text-white transition-colors">Eher nicht</button>
                  </div>
                </div>

                <button 
                  onClick={() => setState('results')}
                  className="w-full bg-[#2A1114] text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#4A2C31] transition-all"
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

              <div className="flex justify-center mb-12 text-[#4A3538]">
                <div className="bg-white p-12 rounded-[40px] border border-[#2A1114]/5 text-center w-full max-w-md shadow-xl">
                  <p className="text-sm font-black uppercase tracking-[0.2em] opacity-50 mb-4">Dein Ergebnis</p>
                  <p className="text-8xl font-black text-[#722F37]">{mistakeCount}</p>
                  <p className="mt-6 mb-2 text-lg">
                    {mistakeCount === 1 ? 'Fehler' : 'Fehler'} gemacht
                  </p>
                  <p className="font-bold opacity-70">
                    {mistakeCount === 0 ? 'Perfekt!' : mistakeCount <= 2 ? 'Gut gemacht!' : 'Übe noch ein bisschen!'}
                  </p>
                </div>
              </div>

              {(firstAttemptCorrectCount / originalQuestionCount) >= 0.5 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`mb-12 p-12 bg-gradient-to-br ${(firstAttemptCorrectCount / originalQuestionCount) === 1 ? 'from-[#722F37] to-[#2A1114] border-yellow-400/20 text-white' : 'from-[#C2A878] to-[#9A2A2A] border-white/20 text-white'} rounded-[40px] text-center shadow-2xl border-4`}
                >
                  <Trophy className={`w-20 h-20 mx-auto mb-6 ${(firstAttemptCorrectCount / originalQuestionCount) === 1 ? 'text-yellow-400 animate-bounce' : 'text-white/80'} `} />
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">{(firstAttemptCorrectCount / originalQuestionCount) === 1 ? 'Unglaublich!' : 'Glückwunsch!'}</h3>
                  <p className={`text-2xl font-black ${(firstAttemptCorrectCount / originalQuestionCount) === 1 ? 'text-yellow-400' : 'text-white'} uppercase tracking-[0.2em]`}>
                    {(firstAttemptCorrectCount / originalQuestionCount) === 1 ? 'Vokabel-Legende' : 
                     (firstAttemptCorrectCount / originalQuestionCount) >= 0.9 ? 'Wortschatz-Meister' : 
                     (firstAttemptCorrectCount / originalQuestionCount) >= 0.75 ? 'Sprach-Talent' : 'Fleißiger Schüler'}
                  </p>
                  <p className="mt-6 opacity-80 font-medium max-w-md mx-auto">
                    Ein neuer Titel wurde deiner Sammlung hinzugefügt. Sieh ihn dir in der Ruhmeshalle an!
                  </p>
                </motion.div>
              )}

              <div className="mt-12 text-center">
                <button 
                  onClick={resetGame}
                  className="inline-flex items-center gap-4 border border-[#2A1114] px-8 py-4 rounded-full hover:bg-[#2A1114] hover:text-white transition-all"
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
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest opacity-80 mb-4 block text-[#E8DCC2]">Ruhmeshalle</span>
                <h2 className="text-6xl font-serif italic text-[#F5F1E7]">Deine Erfolge</h2>
                <p className="mt-4 text-[#E8DCC2] opacity-80 max-w-2xl mx-auto">
                  Eine Übersicht deiner besten Leistungen und erworbenen Auszeichnungen. Jeder fehlerfreie Durchlauf belohnt dich mit neuen Trophäen.
                </p>
              </div>

              <div className="bg-[#F5F1E7] p-10 md:p-14 rounded-[40px] text-[#4A3538] shadow-2xl relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#E8DCC2] rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#C2A878] rounded-full blur-3xl opacity-20"></div>

                {progress.badges.length === 0 ? (
                  <div className="relative z-10 text-center py-20">
                    <div className="w-32 h-32 mx-auto mb-8 relative">
                      <div className="absolute inset-0 bg-[#E8DCC2] rounded-full opacity-50 animate-pulse"></div>
                      <Award className="w-16 h-16 absolute inset-0 m-auto text-[#722F37] opacity-40" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-[#2A1114]">Die Halle ist noch leer</h3>
                    <p className="text-lg opacity-70 max-w-md mx-auto">
                      Beantworte alle 10 Vokabeln im ersten Versuch richtig, um deine erste goldene Trophäe freizuschalten.
                    </p>
                    <button 
                      onClick={() => setState('vocabulary')}
                      className="mt-10 px-8 py-4 bg-[#722F37] text-[#F5F1E7] rounded-2xl font-bold uppercase tracking-wider hover:bg-[#4A1E24] transition-colors shadow-lg"
                    >
                      Jetzt lernen!
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b-2 border-[#E8DCC2]">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-3xl font-black text-[#2A1114]">Trophäen-Kollektion</h3>
                        <p className="opacity-70 mt-1">{progress.badges.length} {progress.badges.length === 1 ? 'Auszeichnung' : 'Auszeichnungen'} erhalten</p>
                      </div>
                      <div className="flex items-center gap-2 bg-[#E8DCC2] px-4 py-2 rounded-xl">
                        <Trophy className="w-5 h-5 text-[#9A2A2A]" />
                        <span className="font-bold text-[#722F37]">{progress.badges.length} Titel</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {progress.badges.map((badge, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-[#722F37] text-[#F5F1E7] p-8 rounded-3xl text-center shadow-xl border border-[#4A1E24]/20 relative group hover:-translate-y-2 transition-transform duration-300"
                        >
                          <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#C2A878] to-[#9A2A2A] rounded-full flex items-center justify-center p-1 mb-6 shadow-lg rotate-0 group-hover:rotate-12 transition-transform duration-500">
                            <div className="w-full h-full bg-[#4A1E24] rounded-full flex items-center justify-center relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                              <Trophy className="w-8 h-8 text-[#C2A878]" />
                            </div>
                          </div>
                          
                          <p className="font-black uppercase tracking-widest text-xs text-[#E8DCC2] mb-2">Titel</p>
                          <p className="font-serif italic text-2xl px-2 line-clamp-2">{badge}</p>
                          
                          {/* Decorative stars */}
                          <div className="flex justify-center gap-1 mt-6 opacity-60">
                            <Star className="w-3 h-3 text-[#C2A878]" fill="currentColor" />
                            <Star className="w-4 h-4 text-[#C2A878]" fill="currentColor" />
                            <Star className="w-3 h-3 text-[#C2A878]" fill="currentColor" />
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Empty slots for visual balancing if few badges */}
                      {progress.badges.length < 3 && Array.from({ length: 3 - progress.badges.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-[#E8DCC2]/30 border-2 border-dashed border-[#C2A878]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70">
                          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C2A878]/40 mb-4 flex items-center justify-center">
                            <Award className="w-6 h-6 text-[#C2A878]/50" />
                          </div>
                          <p className="font-medium text-[#4A3538]/50 mb-1">Gesperrt</p>
                          <p className="text-xs text-[#4A3538]/40">Weitere fehlerfreie Runden benötigt</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
          {state === 'vocabulary' && (
            <motion.section 
              key="vocabulary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-12 px-8 w-full flex flex-col h-screen"
            >
              <div className="flex-shrink-0 mb-8">
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2 block">Vokabel-Manager</span>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-serif italic mb-2">Deine Vokabeln</h2>
                    <p className="text-white/60">
                      {selectedVocab.length} von {vocabulary.length} Vokabeln ausgewählt
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedVocab(vocabulary.map(v => v.en))}
                      className="px-4 py-2 bg-[#8B3A43] hover:bg-[#4A1E24] rounded-lg font-bold text-sm transition-colors"
                    >
                      Alle
                    </button>
                    <button
                      onClick={() => setSelectedVocab([])}
                      className="px-4 py-2 border border-[#8B3A43] hover:bg-[#8B3A43] rounded-lg font-bold text-sm transition-colors"
                    >
                      Keine
                    </button>
                    <button
                      onClick={startLearningJourney}
                      disabled={isLoading || selectedVocab.length === 0}
                      className="px-6 py-2 bg-[#C2A878] hover:bg-[#B09665] text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                    >
                      {isLoading ? 'Lädt...' : 'Lernen starten'}
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col bg-[#4A1E24]/50 rounded-3xl border border-white/10 mb-8">
                {/* Header Row */}
                <div className="flex items-center px-6 py-4 border-b border-white/10 bg-[#4A1E24]/80">
                  <div className="w-10 flex-shrink-0"></div>
                  <div className="flex-1 font-mono text-xs uppercase tracking-widest opacity-50">Englisch</div>
                  <div className="flex-1 font-mono text-xs uppercase tracking-widest opacity-50 text-right pr-4">Deutsch</div>
                </div>
                
                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  <div className="flex flex-col gap-1">
                    {vocabulary.map((vocab, index) => {
                      const isSelected = selectedVocab.includes(vocab.en);
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedVocab(prev => 
                              isSelected 
                                ? prev.filter(v => v !== vocab.en)
                                : [...prev, vocab.en]
                            );
                          }}
                          className={`
                            group flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all
                            ${isSelected 
                              ? 'bg-white/10 hover:bg-white/15' 
                              : 'hover:bg-white/5 opacity-50 hover:opacity-80'
                            }
                          `}
                        >
                          <div className="w-10 flex-shrink-0 list-none flex items-center">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded border-2 border-[#C2A878] bg-[#C2A878] flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-white/20 group-hover:border-white/40 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>{vocab.en}</p>
                          </div>
                          <div className="flex-1 text-right pr-2">
                            <p className={`${isSelected ? 'text-white/90' : 'text-white/60'}`}>{vocab.de}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          {state === 'multiplayer' && (
            <motion.section 
              key="multiplayer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto py-12 px-8 w-full flex flex-col items-center justify-center min-h-[80vh] text-center"
            >
              <div className="mb-12">
                <div className="w-24 h-24 mx-auto bg-[#E8DCC2] rounded-full flex items-center justify-center p-6 mb-6 shadow-xl relative">
                   <div className="absolute inset-0 bg-[#E8DCC2] rounded-full opacity-50 animate-ping"></div>
                   <Users className="w-full h-full text-[#722F37] relative z-10" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest opacity-80 mb-4 block text-[#E8DCC2]">Party-Modus</span>
                <h2 className="text-6xl font-serif italic text-[#F5F1E7] mb-6">Gemeinsam Lernen</h2>
                <p className="text-lg opacity-80 max-w-lg mx-auto text-[#E8DCC2]">
                  Erstelle eine Party oder trete einer bei, um gemeinsam in Echtzeit Vokabeln auf die Probe zu stellen.
                </p>
              </div>

              <div className="w-full max-w-md bg-[#F5F1E7] p-8 md:p-12 rounded-[40px] shadow-2xl text-[#4A3538] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[#E8DCC2] rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-6">
                  <button className="w-full bg-[#722F37] text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4A1E24] shadow-lg transition-all hover:-translate-y-1 active:translate-y-0">
                    Party erstellen
                  </button>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#4A3538]/10"></div>
                    <span className="flex-shrink-0 mx-4 text-[#4A3538]/40 text-xs font-bold uppercase tracking-widest">oder</span>
                    <div className="flex-grow border-t border-[#4A3538]/10"></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text" 
                      placeholder="PARTY-CODE"
                      className="w-full bg-[#E8DCC2] border-2 border-transparent focus:border-[#C2A878] focus:bg-white text-center text-[#4A3538] font-mono tracking-[0.2em] py-4 rounded-xl outline-none transition-all uppercase font-bold placeholder:text-[#4A3538]/30 placeholder:tracking-widest"
                    />
                    <button className="w-full bg-[#C2A878] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#B09665] shadow-md transition-all hover:-translate-y-1 active:translate-y-0">
                      Beitreten
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
