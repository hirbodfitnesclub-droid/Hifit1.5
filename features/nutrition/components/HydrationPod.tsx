
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';

interface HydrationPodProps {
  glasses: number;
  setGlasses: (val: number) => void;
}

export const HydrationPod: React.FC<HydrationPodProps> = ({ glasses, setGlasses }) => {
  const maxGlasses = 12;
  const fillHeight = (glasses / maxGlasses) * 100;

  return (
    <div className="relative h-full min-h-[160px] bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col justify-between p-1 group">
        
        {/* Liquid Effect */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-500/20 transition-all duration-700 ease-out" style={{ height: `${fillHeight}%` }}>
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400/50 blur-md" />
            <motion.div 
                animate={{ x: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute -top-4 left-[-50%] right-[-50%] h-8 bg-blue-500/20 blur-xl rounded-full" 
            />
        </div>

        {/* Content */}
        <div className="relative z-10 flex justify-between items-start p-3">
             <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/5">
                 <Droplets className="w-4 h-4 text-blue-400" />
             </div>
             <div className="flex flex-col items-end">
                 <span className="text-2xl font-black text-white leading-none">{glasses}</span>
                 <span className="text-[8px] font-bold text-zinc-500 uppercase">لیوان</span>
             </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex justify-between gap-1 p-1">
            <button 
                onClick={() => setGlasses(Math.max(0, glasses - 1))}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/5 flex items-center justify-center text-zinc-400 transition-colors"
            >
                <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
                onClick={() => setGlasses(Math.min(maxGlasses, glasses + 1))}
                className="h-8 flex-1 rounded-full bg-blue-500 hover:bg-blue-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all active:scale-95"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};
