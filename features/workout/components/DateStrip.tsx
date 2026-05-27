
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DateStripProps {
  days: { dayName: string; isRestDay: boolean }[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ days, currentIndex, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const target = itemsRef.current[currentIndex];
    if (target && scrollRef.current) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
  }, [currentIndex]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar relative z-10" ref={scrollRef}>
      <div className="flex gap-2.5 w-max items-center px-5">
        {days.map((day, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              ref={(el) => { itemsRef.current[idx] = el }}
              onClick={() => onSelect(idx)}
              className={`
                relative flex flex-col items-center justify-center shrink-0 w-[4.5rem] h-[5.5rem] rounded-[1.2rem] transition-all duration-300 group
                ${isActive
                  ? 'bg-zinc-800 border border-gold-500/50 shadow-[0_0_20px_-5px_rgba(234,179,8,0.25)] z-10'
                  : 'bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700'
                }
              `}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <motion.div 
                    layoutId="active-indicator"
                    className="absolute top-0 w-8 h-1 bg-gold-500 rounded-b-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                />
              )}

              <span className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 transition-colors ${isActive ? 'text-gold-500' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                {day.dayName.split(' ')[0]}
              </span>
              
              <span className={`text-2xl font-black leading-none transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-zinc-400 group-hover:text-white'}`}>
                {idx + 1}
              </span>

               {/* Rest Day Indicator */}
               {day.isRestDay && (
                    <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
               )}
            </button>
          );
        })}
        <div className="w-2 shrink-0" />
      </div>
    </div>
  );
};
