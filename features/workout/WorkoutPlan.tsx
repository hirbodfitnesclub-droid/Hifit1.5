
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { CalendarOff, Sparkles, SlidersHorizontal } from 'lucide-react';

// Components
import { DateStrip } from './components/DateStrip';
import { WorkoutHero } from './components/WorkoutHero';
import { ExerciseCard } from './components/ExerciseCard';
import { RestDayView } from './components/RestDayView';
import { WorkoutContextFab } from './components/WorkoutContextFab';
import { StartSessionBar } from './components/StartSessionBar';

export const WorkoutPlan: React.FC = () => {
  const { user, weeklyPlan, currentDayIndex, setCurrentDayIndex } = useUser();
  const [showAiContext, setShowAiContext] = useState(false);

  // Defensive: Handle Loading/Empty States
  if (!weeklyPlan || !user) return null;

  const currentPlan = weeklyPlan.days[currentDayIndex];
  if (!currentPlan) return null;

  const daysData = weeklyPlan.days.map(d => ({ dayName: d.dayName, isRestDay: d.isRestDay }));

  const phaseName = useMemo(() => {
    const goalMap: Record<string, string> = {
        'کاهش وزن': 'Phase 1: Metabolic Burn',
        'عضله سازی': 'Phase 1: Hypertrophy',
        'افزایش قدرت': 'Phase 1: Strength Base',
        'لایف استایل': 'Phase 1: Active Life'
    };
    return goalMap[user.stats.goal] || 'Phase 1: Foundation';
  }, [user.stats.goal]);

  return (
    <div className="flex flex-col h-[100dvh] bg-black relative overflow-hidden isolate font-sans">
      
      {/* --- BACKGROUND AMBIENCE (Cyber-Luxury) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* --- 1. STICKY HUD HEADER --- */}
      <header className="flex-none z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 pt-safe-top transition-all duration-300">
          <div className="px-5 pt-4 pb-2 flex justify-between items-center">
               <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                       <h1 className="text-2xl font-black text-white tracking-tighter italic">
                           WORKOUT
                           <span className="text-gold-500 not-italic">.</span>
                       </h1>
                   </div>
                   <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                           {user.tier}
                       </span>
                       <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase truncate max-w-[150px]">
                           {phaseName}
                       </span>
                   </div>
               </div>

               {/* AI Context Trigger (Glass Button) */}
               <button 
                  onClick={() => setShowAiContext(true)}
                  className="group relative w-11 h-11 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center overflow-hidden transition-all hover:bg-zinc-800 active:scale-95"
               >
                   <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <SlidersHorizontal className="w-5 h-5 text-zinc-300 group-hover:text-gold-500 transition-colors" />
               </button>
          </div>
          
          <div className="pb-4 pt-2">
            <DateStrip 
                days={daysData} 
                currentIndex={currentDayIndex} 
                onSelect={setCurrentDayIndex} 
            />
          </div>
      </header>

      {/* --- 2. SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide w-full relative z-10 pb-40">
         <div className="px-5 pt-6 space-y-8 min-h-full">
             
             <AnimatePresence mode='wait'>
                <motion.div
                    key={currentDayIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                >
                    
                    {/* A. MISSION BRIEFING (Hero) */}
                    {!currentPlan.isRestDay && <WorkoutHero plan={currentPlan} />}

                    {/* B. MAIN VIEW SWITCHER */}
                    {currentPlan.isRestDay ? (
                        <RestDayView />
                    ) : (
                        <div className="relative mt-8">
                            {/* Section Header */}
                            <div className="flex items-end justify-between mb-6 px-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                                        Sequence
                                    </span>
                                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                                        لیست حرکات
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                                            {currentPlan.exercises.length}
                                        </span>
                                    </h3>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 via-zinc-800/50 to-transparent mx-4 mb-2" />
                            </div>

                            {/* Exercises Stream */}
                            {currentPlan.exercises.length > 0 ? (
                                <div className="space-y-5">
                                    {currentPlan.exercises.map((ex, idx) => {
                                        // Superset Logic
                                        const isPrevSuperset = currentPlan.exercises[idx - 1]?.isSuperset;
                                        const isNextSuperset = currentPlan.exercises[idx + 1]?.isSuperset;
                                        const connectionType = ex.isSuperset 
                                            ? (isNextSuperset && !isPrevSuperset ? 'start' : (!isNextSuperset && isPrevSuperset ? 'end' : 'middle')) 
                                            : 'none';

                                        return (
                                            <ExerciseCard 
                                                key={ex.id || idx} 
                                                exercise={ex} 
                                                index={idx}
                                                connectionType={connectionType}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-24 flex flex-col items-center text-center border border-dashed border-zinc-800 rounded-[2.5rem] bg-zinc-900/20 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                                        <CalendarOff className="w-6 h-6 text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-400">روز بدون تمرین</h3>
                                    <p className="text-xs text-zinc-600 mt-2">هیچ حرکتی تنظیم نشده است.</p>
                                </div>
                            )}
                        </div>
                    )}

                </motion.div>
             </AnimatePresence>
         </div>
      </div>

      {/* --- 3. FLOATING ACTION MODAL (AI CONTEXT) --- */}
      <AnimatePresence>
          {showAiContext && (
              <WorkoutContextFab onClose={() => setShowAiContext(false)} />
          )}
      </AnimatePresence>

      {/* --- 4. START BUTTON (Safe Area Fixed) --- */}
      {!currentPlan.isRestDay && (
          <StartSessionBar />
      )}

    </div>
  );
};
