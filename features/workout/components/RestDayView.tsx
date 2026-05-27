
import React from 'react';
import { BatteryCharging, Coffee, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export const RestDayView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      
      {/* Animated Battery Icon */}
      <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full" />
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-40 h-40 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10"
          >
              <BatteryCharging className="w-16 h-16 text-emerald-500" />
          </motion.div>
      </div>

      <h2 className="text-3xl font-black text-white mb-3">ریکاوری فعال</h2>
      <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto mb-10">
          امروز روز استراحت است. عضلات شما در حال رشد هستند. برای نتیجه بهتر، پروتئین کافی مصرف کنید و خواب خوبی داشته باشید.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-zinc-300">نوشیدن آب</span>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-bold text-zinc-300">مدیتیشن</span>
          </div>
      </div>
    </div>
  );
};
