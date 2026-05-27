
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Dumbbell, Utensils, Zap, CheckCircle2, Cpu } from 'lucide-react';

interface LoadingScreenProps {
  stage: string; // 'INIT' | 'WORKOUT' | 'NUTRITION' | 'FINALIZING'
}

const steps = [
  { id: 'INIT', label: 'آنالیز فیزیولوژی و بیومتریک', icon: Brain },
  { id: 'WORKOUT', label: 'طراحی سیستم تمرینی (Hypertrophy)', icon: Dumbbell },
  { id: 'NUTRITION', label: 'مهندسی رژیم غذایی و ماکروها', icon: Utensils },
  { id: 'FINALIZING', label: 'تولید نهایی برنامه', icon: Database },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === stage);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.05),transparent_70%)]" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Central HUD */}
      <div className="relative z-10 w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4 animate-pulse">
                <Cpu className="w-3 h-3 text-gold-500" />
                <span className="text-[10px] font-bold text-gold-500 tracking-widest uppercase">Gemini 3 Flash Engine</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">در حال پردازش</h2>
            <p className="text-zinc-500 text-xs">لطفاً صفحه را نبندید. این عملیات ممکن است تا ۲ دقیقه زمان ببرد.</p>
        </div>

        {/* Steps Visualization */}
        <div className="space-y-6 relative">
            {/* Connecting Line */}
            <div className="absolute top-4 right-[1.65rem] bottom-4 w-0.5 bg-zinc-900 z-0" />
            <div 
                className="absolute top-4 right-[1.65rem] w-0.5 bg-gold-500 z-0 transition-all duration-1000"
                style={{ height: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }} 
            />

            {steps.map((step, idx) => {
                const isActive = stage === step.id;
                const isCompleted = currentIndex > idx;
                const isPending = currentIndex < idx;

                return (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className={`relative z-10 flex items-center gap-4 ${isPending ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
                    >
                        {/* Icon Box */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                            isActive 
                            ? 'bg-black border-gold-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-110' 
                            : isCompleted 
                                ? 'bg-gold-500 border-gold-500' 
                                : 'bg-zinc-900 border-zinc-800'
                        }`}>
                            {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-black" />
                            ) : (
                                <step.icon className={`w-6 h-6 ${isActive ? 'text-gold-500 animate-pulse' : 'text-zinc-500'}`} />
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <span className={`text-[9px] font-bold tracking-widest uppercase block mb-0.5 ${isActive ? 'text-gold-500' : 'text-zinc-600'}`}>
                                فاز {idx + 1}
                            </span>
                            <span className={`text-sm font-bold ${isActive ? 'text-white' : isCompleted ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {step.label}
                            </span>
                            {isActive && (
                                <div className="h-1 w-24 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-gold-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Timer Footer */}
        <div className="mt-12 text-center">
             <div className="font-mono text-4xl font-black text-zinc-800 tracking-widest">
                00:{elapsed.toString().padStart(2, '0')}
             </div>
             <div className="text-[10px] text-zinc-600 mt-2 font-bold uppercase tracking-[0.2em] animate-pulse">
                 Connecting to Neural Net...
             </div>
        </div>

      </div>
    </div>
  );
};
