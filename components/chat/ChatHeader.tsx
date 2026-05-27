
import React from 'react';
import { Sparkles, MoreVertical } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  return (
    <div className="flex-none z-30 px-5 pt-4 pb-2 bg-gradient-to-b from-black via-black/90 to-transparent backdrop-blur-sm">
      <div className="flex justify-between items-center bg-zinc-900/50 border border-white/5 rounded-2xl p-3 shadow-lg backdrop-blur-md">
        
        {/* Left: Avatar & Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white tracking-wide">Hifit Intelligence</h1>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Gemini 3.0 • <span className="text-emerald-500">Online</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
