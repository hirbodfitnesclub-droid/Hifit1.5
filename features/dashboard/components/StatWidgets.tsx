
import React from 'react';
import { Moon, Flame, Zap } from 'lucide-react';

interface StatWidgetProps {
  value: number;
  max: number;
}

export const SleepWidget: React.FC<StatWidgetProps> = ({ value }) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-900 to-indigo-950/30 border border-zinc-800 rounded-[2rem] p-4 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full" />

         <div className="flex justify-between items-start relative z-10 dir-rtl">
             <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold mb-0.5">خواب شبانه</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{value}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">ساعت</span>
                </div>
             </div>
             <div className="w-8 h-8 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Moon className="w-4 h-4 text-indigo-400" />
             </div>
         </div>
         
         {/* Visual: Sleep Cycles Graph */}
         <div className="relative mt-auto h-10 w-full flex items-end gap-[3px] opacity-60 px-1 dir-ltr">
             {[15, 30, 45, 60, 35, 80, 50, 25, 10].map((h, i) => (
                 <div 
                    key={i} 
                    className="flex-1 bg-indigo-500 rounded-t-[2px] transition-all hover:bg-indigo-400" 
                    style={{ height: `${h}%`, opacity: 0.4 + (i/20) }} 
                 />
             ))}
         </div>
    </div>
  );
};

export const CaloriesWidget: React.FC<StatWidgetProps> = ({ value, max }) => {
  const percent = Math.min(100, (value / max) * 100);
  
  return (
    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-4 relative overflow-hidden flex flex-col justify-between group hover:border-orange-500/30 transition-colors">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 blur-2xl rounded-full" />

         <div className="flex justify-between items-start relative z-10 dir-rtl">
             <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold mb-0.5">سوخت روزانه</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{value}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">کالری</span>
                </div>
             </div>
             <div className="w-8 h-8 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Flame className="w-4 h-4 text-orange-400" />
             </div>
         </div>

         {/* Visual: Fuel Progress */}
         <div className="relative mt-auto pt-3">
             <div className="flex justify-between text-[8px] font-bold text-zinc-600 mb-1.5 px-0.5 dir-rtl">
                 <span>مصرف شده</span>
                 <span>هدف: {max}</span>
             </div>
             <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden flex items-center p-[2px] border border-white/5">
                 <div 
                    className="h-full rounded-full bg-gradient-to-l from-orange-600 via-orange-500 to-yellow-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                    style={{ width: `${percent}%` }} 
                 />
             </div>
         </div>
    </div>
  );
};
