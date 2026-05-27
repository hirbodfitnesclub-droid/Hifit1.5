
import React from 'react';
import { Clock, Flame, Zap, Crosshair, ChevronLeft } from 'lucide-react';
import { DayPlan } from '../../../types';

interface WorkoutHeroProps {
  plan: DayPlan;
}

export const WorkoutHero: React.FC<WorkoutHeroProps> = ({ plan }) => {
  return (
    <div className="relative w-full rounded-[2.5rem] bg-zinc-900 overflow-hidden border border-zinc-800 group shadow-2xl">
      
      {/* Background Layer with Image & Gradient */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900/90 to-transparent" />
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0" />

      <div className="relative z-10 p-6 flex flex-col justify-between min-h-[220px]">
        
        {/* Top Section */}
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-gold-500 text-black text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                        ماموریت امروز
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold font-mono">ID: #84X-2</span>
                 </div>
                 <h2 className="text-2xl font-black text-white leading-tight mt-2 max-w-[80%] line-clamp-2 drop-shadow-lg">
                    {plan.focus}
                 </h2>
            </div>
            
            {/* Intensity Dial (Visual) */}
            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5 text-gold-500 fill-gold-500" />
            </div>
        </div>

        {/* Middle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent my-4" />

        {/* Bottom Stats */}
        <div>
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> زمان
                    </span>
                    <span className="text-lg font-black text-white">45 <span className="text-[10px] text-zinc-400 font-medium">دقیقه</span></span>
                </div>
                <div className="flex flex-col border-r border-white/10 pr-4">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> انرژی
                    </span>
                    <span className="text-lg font-black text-white">320 <span className="text-[10px] text-zinc-400 font-medium">کالری</span></span>
                </div>
                <div className="flex flex-col border-r border-white/10 pr-4">
                     <span className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5 flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> ست‌ها
                    </span>
                    <span className="text-lg font-black text-white">{plan.exercises.reduce((acc, ex) => acc + ex.sets, 0)} <span className="text-[10px] text-zinc-400 font-medium">کل</span></span>
                </div>
            </div>

            {/* Micro Tip */}
            {plan.nutritionTip && (
                <div className="inline-flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-2 w-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-zinc-300 font-medium truncate">
                        {plan.nutritionTip}
                    </p>
                    <ChevronLeft className="w-3 h-3 text-zinc-600 ms-auto" />
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
