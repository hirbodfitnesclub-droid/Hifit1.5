
import React from 'react';
import { Activity, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ReadinessWidgetProps {
  score: number;
}

export const ReadinessWidget: React.FC<ReadinessWidgetProps> = ({ score }) => {
  const getReadinessConfig = (s: number) => {
    if (s >= 80) return { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'اوج آمادگی', ring: 'border-emerald-500/50', glow: 'shadow-emerald-500/20' };
    if (s >= 50) return { color: 'text-gold-400', bg: 'bg-gold-500', label: 'آماده تمرین', ring: 'border-gold-500/50', glow: 'shadow-gold-500/20' };
    return { color: 'text-red-400', bg: 'bg-red-500', label: 'نیاز به ریکاوری', ring: 'border-red-500/50', glow: 'shadow-red-500/20' };
  };

  const config = getReadinessConfig(score);

  return (
    <div className="col-span-7 row-span-2 relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-6 shadow-2xl group min-h-[220px]">
      
      {/* Dynamic Background Noise & Gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className={clsx("absolute top-[-50%] left-[-50%] w-[150%] h-[150%] rounded-full blur-[80px] transition-colors duration-1000 opacity-30", config.bg)} />
      </div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>

      {/* Header - RTL Aligned */}
      <div className="relative z-10 flex justify-between items-start dir-rtl">
          <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-zinc-400 mb-1.5 opacity-80">وضعیت سیستم عصبی</span>
              <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg transition-all", config.glow)}>
                  <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", config.bg)} />
                  <span className={clsx("text-xs font-black tracking-wide", config.color)}>
                      {config.label}
                  </span>
              </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
             <Activity className={clsx("w-4 h-4 drop-shadow-lg", config.color)} />
          </div>
      </div>

      {/* Central Reactor Core Visualization */}
      <div className="relative flex items-center justify-center flex-1 py-2 mt-2">
           {/* Static Decor Rings */}
           <div className="absolute w-32 h-32 border border-zinc-800/60 rounded-full" />
           <div className="absolute w-24 h-24 border border-zinc-800/40 rounded-full" />
           
           {/* Animated Outer Ring */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className={clsx("absolute w-28 h-28 border border-dashed rounded-full opacity-40", config.ring)} 
           />
           
           {/* Animated Inner Arc */}
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-20 h-20 rounded-full border-t-2 border-b-2 border-transparent border-t-white/20 border-b-white/10" 
           />
           
           {/* Core Glow */}
           <div className={clsx("absolute w-14 h-14 rounded-full blur-xl opacity-30 animate-pulse", config.bg)} />

           {/* The Number */}
           <div className="text-center relative z-10 flex flex-col items-center justify-center pt-1">
               <span className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">{score}</span>
               <span className="text-[9px] font-bold text-zinc-500 mt-0.5">امتیاز کل</span>
           </div>
      </div>

      {/* Footer Details - RTL */}
      <div className="relative z-10 border-t border-white/5 pt-3 mt-1 flex justify-between items-center dir-rtl">
          <div className="flex items-center gap-1.5">
             <Zap className="w-3 h-3 text-zinc-500" />
             <span className="text-[10px] font-bold text-zinc-500">پتانسیل:</span>
          </div>
          <span className="text-[10px] font-bold text-white tracking-wide">۱۰۰٪ نرمال</span>
      </div>
    </div>
  );
};
