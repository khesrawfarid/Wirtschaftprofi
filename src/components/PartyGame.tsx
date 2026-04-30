import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TIME_PER_QUESTION = 15; // in seconds
const TIME_PER_ROUND_END = 5;

export function PartyGame({ partyData, playerName, partyCode, isHost, onExit }: { partyData: any, playerName: string, partyCode: string, isHost: boolean, onExit: () => void }) {
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [textAnswer, setTextAnswer] = useState("");
  const [answeredInfo, setAnsweredInfo] = useState<{answer: string, correct: boolean} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentQuestionIndex = partyData.currentQuestionIndex || 0;
  const questions = partyData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const roundState = partyData.roundState || 'playing'; // 'playing' | 'round-end'
  
  useEffect(() => {
    if (!currentQuestion) return;
    
    // Reset local answer state when question changes and round starts
    if (roundState === 'playing') {
      setAnsweredInfo(null);
      setTextAnswer("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    const startTime = partyData.questionStartTime || Date.now();
    const duration = roundState === 'playing' ? TIME_PER_QUESTION : TIME_PER_ROUND_END;
    
    const interval = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
      
      if (remaining === 0 && isHost) {
        clearInterval(interval);
        
        try {
           if (roundState === 'playing') {
             // Go to round end
             await updateDoc(doc(db, 'parties', partyCode), {
               roundState: 'round-end',
               questionStartTime: Date.now()
             });
           } else {
             // Go to next question or game over
             const nextIndex = currentQuestionIndex + 1;
             if (nextIndex >= questions.length) {
               await updateDoc(doc(db, 'parties', partyCode), {
                 state: 'results'
               });
             } else {
               await updateDoc(doc(db, 'parties', partyCode), {
                 currentQuestionIndex: nextIndex,
                 roundState: 'playing',
                 questionStartTime: Date.now()
               });
             }
           }
        } catch(err) {
           console.error(err);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentQuestionIndex, partyData.questionStartTime, isHost, roundState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredInfo || roundState !== 'playing' || !textAnswer.trim() || timeLeft <= 0) return;
    
    const expectedAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const isCorrect = textAnswer.trim().toLowerCase() === expectedAnswer.toLowerCase();
    
    setAnsweredInfo({ answer: textAnswer.trim(), correct: isCorrect });
    
    if (isCorrect) {
      // Add points based on time left (e.g., 100 base + 10 * time left)
      const points = 100 + (timeLeft * 10);
      
      try {
         const partyRef = doc(db, 'parties', partyCode);
         const snap = await getDoc(partyRef);
         if (snap.exists()) {
             const data = snap.data();
             const players = data.players || [];
             const updatedPlayers = players.map((p: any) => {
                if (p.name === playerName) {
                   return { ...p, score: (p.score || 0) + points };
                }
                return p;
             });
             
             await updateDoc(partyRef, { players: updatedPlayers });
         }
      } catch (err) {
         console.error(err);
      }
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-8 flex justify-between w-full text-[#E8DCC2]">
        <div className="font-mono text-sm uppercase tracking-widest bg-[#4A1E24] px-4 py-2 rounded-xl">Runde: {currentQuestionIndex + 1} / {questions.length}</div>
        <div className="font-mono font-black text-2xl text-white bg-[#722F37] px-6 py-2 rounded-xl shadow-lg border border-white/20">
          {timeLeft}s
        </div>
      </div>
      
      {roundState === 'playing' ? (
        <div className="w-full bg-[#F5F1E7] rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden mb-8">
          <h2 className="text-3xl md:text-5xl font-serif italic text-[#4A3538] mb-8">{currentQuestion.text}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={textAnswer}
              onChange={e => setTextAnswer(e.target.value)}
              disabled={!!answeredInfo || timeLeft <= 0}
              placeholder="Deine Antwort hier eingeben..."
              className="w-full p-6 text-xl font-bold bg-white text-[#4A3538] rounded-2xl border-2 border-[#E8DCC2] focus:border-[#722F37] outline-none transition-colors shadow-sm text-center"
              autoFocus
            />
            <button
              type="submit"
              disabled={!!answeredInfo || !textAnswer.trim() || timeLeft <= 0}
              className={`w-full py-6 px-4 rounded-2xl text-lg font-bold uppercase tracking-wide shadow-md transition-all 
                ${answeredInfo 
                  ? answeredInfo.correct 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white" 
                  : "bg-[#722F37] hover:bg-[#4A1E24] text-white disabled:opacity-50"
                } disabled:transform-none`}
            >
              {answeredInfo ? (answeredInfo.correct ? "Richtig!" : "Falsch!") : "Antworten"}
            </button>
            {answeredInfo && !answeredInfo.correct && (
              <p className="mt-4 text-[#722F37] font-bold">Die richtige Antwort ist: {currentQuestion.options[currentQuestion.correctAnswer]}</p>
            )}
            {answeredInfo && answeredInfo.correct && (
              <p className="mt-4 text-green-600 font-bold">Warte auf das Ende der Runde...</p>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full bg-[#F5F1E7] rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden mb-8">
           <h2 className="text-3xl font-serif italic text-[#4A3538] mb-8">Runde {currentQuestionIndex + 1} beendet!</h2>
           <p className="text-xl text-[#722F37] font-bold mb-8">Richtige Antwort: {currentQuestion.options[currentQuestion.correctAnswer]}</p>
           
           <div className="bg-[#4A1E24] rounded-[24px] p-6 w-full max-w-sm mx-auto shadow-xl border border-white/10">
             <h3 className="text-[#E8DCC2] font-mono text-xs uppercase tracking-widest mb-4 opacity-70">Spieler Punkte</h3>
             <div className="space-y-2">
                {partyData.players?.slice().sort((a: any, b: any) => b.score - a.score).map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-white p-2 rounded-lg bg-white/5">
                     <span className="font-bold">{p.name} {p.name === playerName ? '(Du)' : ''}</span>
                     <span className="font-mono bg-[#722F37] px-3 py-1 rounded-md">{p.score || 0}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
      
      <button 
        onClick={onExit}
        className="mt-8 text-[#E8DCC2] hover:text-white uppercase font-black text-xs tracking-widest opacity-50 hover:opacity-100 transition-opacity"
      >
        Party verlassen
      </button>
    </div>
  );
}

