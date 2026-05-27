
import React, { useState } from 'react';
import { WorkoutExercise } from '../../../types';
import { Dumbbell, Repeat, Layers, Check, PlayCircle, Info, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  connectionType: 'start' | 'middle' | 'end' | 'none';
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index, connectionType }) => {
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);

  const toggleSet = (setIdx: number) => {
    setCompletedSets(prev => 
      prev.includes(setIdx) ? prev.filter(s => s !== setIdx) : [...prev, setIdx]
    );
  };

  const isSuperset = exercise.isSuperset;

  return (
    <div className="relative pl-3 pr-1">
      
      {/* Superset Connector Line (RTL: Left Side now? No, normally connector is on the side of sequence. Let's keep it Right for RTL flow if icons are right) */}
      {isSuperset && (
          <div className={clsx(
              "absolute -right-[7px] w-[2px] bg-gradient-to-b from-orange-500/50 via-orange-500 to-orange-500/50 z-0",
              connectionType === 'start' && "top-[50%] bottom-[-24px] rounded-t-full",
              connectionType === 'middle' && "-top-[24px] -bottom-[24px]",
              connectionType === 'end' && "-top-[24px] bottom-[50%] rounded-b-full"
          )} />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={clsx(
            "relative z-10 bg-zinc-900 rounded-[2rem] overflow-hidden transition-all duration-300 border group",
            isSuperset ? "border-orange-500/30" : "border-zinc-800",
            "hover:border-zinc-700"
        )}
      >
          {/* Main Content Area */}
          <div className="p-4 flex gap-4">
              
              {/* Thumbnail (Right for RTL) - Visual Placeholder */}
              <div className="relative w-24 h-24 rounded-2xl bg-black border border-zinc-800 shrink-0 overflow-hidden group/media cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-80" />
                  {/* Fake Image Placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-1 group-hover/media:scale-105 transition-transform">
                      <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                      <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                  </div>
              </div>

              {/* Text Info (Left for RTL) */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                      <div className="flex items-center gap-2 mb-1.5">
                          {isSuperset && (
                              <span className="text-[8px] font-black uppercase bg-orange-500 text-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                  <Layers className="w-2.5 h-2.5" /> سوپرست
                              </span>
                          )}
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-700/50 px-1.5 py-0.5 rounded-md">
                              {exercise.muscleGroup}
                          </span>
                      </div>
                      <h3 className="text-lg font-black text-white leading-tight truncate">
                          {exercise.name}
                      </h3>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mt-2">
                      <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-zinc-500 uppercase">تکرار</span>
                          <span className="text-sm font-black text-white flex items-center gap-1">
                              {exercise.reps} <Repeat className="w-3 h-3 text-gold-500" />
                          </span>
                      </div>
                      <div className="w-px h-6 bg-zinc-800" />
                      <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-zinc-500 uppercase">تعداد ست</span>
                          <span className="text-sm font-black text-white flex items-center gap-1">
                              {exercise.sets} <Hash className="w-3 h-3 text-zinc-500" />
                          </span>
                      </div>
                      
                      <button 
                        onClick={() => setExpanded(!expanded)}
                        className="ms-auto w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                          <Info className="w-4 h-4" />
                      </button>
                  </div>
              </div>
          </div>

          {/* Interactive Sets Bar */}
          <div className="bg-black/40 border-t border-zinc-800/50 p-3 flex items-center gap-3">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide shrink-0 rotate-180 py-1" style={{ writingMode: 'vertical-lr' }}>
                  ست
              </span>
              
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar dir-ltr px-1">
                  {Array.from({ length: exercise.sets }).map((_, i) => {
                      const isDone = completedSets.includes(i);
                      return (
                          <button
                              key={i}
                              onClick={() => toggleSet(i)}
                              className={clsx(
                                  "flex-1 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden group/btn min-w-[36px]",
                                  isDone 
                                  ? "bg-gold-500 border-gold-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
                                  : "bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500"
                              )}
                          >
                              {isDone ? (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                      <Check className="w-4 h-4 stroke-[3px]" />
                                  </motion.div>
                              ) : (
                                  <span className="text-[10px] font-black font-mono group-hover/btn:text-zinc-300">{i + 1}</span>
                              )}
                          </button>
                      )
                  })}
              </div>
          </div>

          {/* Expandable Info */}
          <AnimatePresence>
            {expanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-zinc-950 px-4 pb-4"
                >
                    <div className="pt-3 border-t border-zinc-800/50">
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                            <strong className="text-gold-500">نکته تکنیکی:</strong> تمرکز کامل روی دامنه منفی حرکت داشته باشید. در بالاترین نقطه انقباض، ۱ ثانیه مکث کنید.
                        </p>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

      </motion.div>
    </div>
  );
};
