
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';
import { DayPlan } from '../../../types';

interface NutritionHeroProps {
  plan: DayPlan;
}

export const NutritionHero: React.FC<NutritionHeroProps> = ({ plan }) => {
  // Mock data for "consumed" logic (In a real app, this comes from tracking logs)
  const consumed = 0; 
  const target = plan.caloriesTarget;
  const progress = Math.min(100, (consumed / target) * 100);

  return (
    <div className="relative w-full h-[280px] rounded-[2.5rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl shrink-0">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0">
         <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-orange-500/10 blur-[80px] rounded-full mix-blend-screen animate-pulse" />
         <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
         
         {/* Circular Progress Indicator */}
         <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
            {/* SVG Ring Background */}
            <svg className="w-full h-full rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="6" />
                <motion.circle 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                    className="drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <Flame className="w-6 h-6 text-orange-500 mb-1 fill-orange-500/20" />
                 <span className="text-4xl font-black text-white tracking-tighter leading-none">
                     {target}
                 </span>
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                     هدف روزانه
                 </span>
            </div>
         </div>

         {/* Stats Row */}
         <div className="flex items-center gap-6">
             <div className="flex flex-col items-center">
                 <span className="text-[10px] text-zinc-500 font-bold mb-0.5">پروتئین</span>
                 <span className="text-sm font-black text-blue-400">{plan.macros.protein}g</span>
             </div>
             <div className="w-px h-6 bg-white/10" />
             <div className="flex flex-col items-center">
                 <span className="text-[10px] text-zinc-500 font-bold mb-0.5">کربوهیدرات</span>
                 <span className="text-sm font-black text-orange-400">{plan.macros.carbs}g</span>
             </div>
             <div className="w-px h-6 bg-white/10" />
             <div className="flex flex-col items-center">
                 <span className="text-[10px] text-zinc-500 font-bold mb-0.5">چربی</span>
                 <span className="text-sm font-black text-yellow-400">{plan.macros.fats}g</span>
             </div>
         </div>

      </div>
    </div>
  );
};
