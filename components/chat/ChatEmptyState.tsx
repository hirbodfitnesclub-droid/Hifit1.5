
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Camera, Utensils, Activity } from 'lucide-react';

interface ChatEmptyStateProps {
  onSelectPrompt: (text: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    { icon: Utensils, label: 'آنالیز غذا', text: 'میخوام عکس ناهارم رو بفرستم تا کالریش رو حساب کنی.', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: Activity, label: 'تغییر برنامه', text: 'امروز انرژی ندارم، برنامه رو سبک‌تر کن.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Zap, label: 'انگیزه', text: 'یه جمله انگیزشی بگو که پاشم برم تمرین!', color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { icon: Camera, label: 'تحلیل فرم', text: 'عکس بدنم رو میفرستم نقاط ضعفم رو بگو.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
      
      {/* Visual Abstract Art */}
      <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gold-500/20 blur-[50px] rounded-full animate-pulse" />
          <div className="relative z-10 w-full h-full border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10">
                  <span className="text-3xl">🦾</span>
              </div>
          </div>
      </div>

      <h2 className="text-2xl font-black text-white mb-2">مربی شخصی تو</h2>
      <p className="text-zinc-500 text-sm mb-10 max-w-[250px] leading-relaxed">
        من به دیتابیس بدنت وصلم. هر سوالی داری بپرس یا عکس بفرست تا آنالیز کنم.
      </p>

      {/* Quick Prompts Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {suggestions.map((item, idx) => (
            <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectPrompt(item.text)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-800 transition-all duration-300 group"
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
            </motion.button>
        ))}
      </div>
    </div>
  );
};
