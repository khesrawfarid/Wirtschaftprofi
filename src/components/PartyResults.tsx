import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function PartyResults({ partyData, playerName, partyCode, isHost, onExit }: { partyData: any, playerName: string, partyCode: string, isHost: boolean, onExit: () => void }) {
  const players = partyData?.players || [];
  const sortedPlayers = [...players].sort((a: any, b: any) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isWinner = winner?.name === playerName;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-12 text-center relative">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", bounce: 0.5 }}
           className="w-32 h-32 bg-[#C2A878] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-[#C2A878] rounded-full animate-ping opacity-20"></div>
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-6xl font-serif italic text-white mb-2 py-2">
          {isWinner ? "Du hast gewonnen!" : `${winner?.name || 'Jemand'} hat gewonnen!`}
        </h2>
        <span className="text-[#E8DCC2] font-mono text-sm uppercase tracking-widest bg-[#4A1E24] px-4 py-2 rounded-xl inline-block mt-4">
          PARTY ERGEBNISSE
        </span>
      </div>
      
      <div className="w-full max-w-2xl bg-[#F5F1E7] rounded-[40px] p-8 md:p-12 shadow-2xl mb-8 border-4 border-white">
        <div className="space-y-4">
          {sortedPlayers.map((p: any, index: number) => (
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               key={index} 
               className={`flex items-center gap-4 p-4 rounded-2xl ${index === 0 ? 'bg-[#722F37] text-white shadow-lg scale-105 transform z-10 relative' : 'bg-white text-[#4A3538] border border-black/5'}`}
             >
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${index === 0 ? 'bg-[#C2A878] text-[#4A3538]' : 'bg-[#E8DCC2] text-[#4A3538]'}`}>
                 {index + 1}
               </div>
               <span className="font-bold text-xl flex-1">{p.name} {p.name === playerName ? '(Du)' : ''}</span>
               <span className="font-mono text-2xl font-black">{p.score || 0}</span>
               <span className="text-xs uppercase tracking-widest opacity-70">Punkte</span>
             </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={async () => {
             try {
                const partyRef = doc(db, 'parties', partyCode);
                const snap = await getDoc(partyRef);
                if (snap.exists()) {
                   const data = snap.data();
                   if (data.host === playerName) {
                      await deleteDoc(partyRef);
                   } else {
                      const playerObj = data.players.find((pl: any) => pl.name === playerName);
                      if (playerObj) {
                         await updateDoc(partyRef, { players: arrayRemove(playerObj) });
                      }
                   }
                }
             } catch(err) {
                console.error(err);
             }
             onExit();
          }}
          className="flex-1 bg-white text-[#722F37] py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[#F5F1E7] shadow-lg transition-all hover:-translate-y-1 active:translate-y-0"
        >
          Menu
        </button>
      </div>
    </div>
  );
}
