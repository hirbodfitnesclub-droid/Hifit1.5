
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../../context/UserContext';
import { BatteryWarning, Home, Briefcase, Zap, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AppView } from '../../../types';

interface WorkoutContextFabProps {
  onClose: () => void;
}

export const WorkoutContextFab: React.FC<WorkoutContextFabProps> = ({ onClose }) => {
  const { setPendingChatInput, setCurrentView } = useUser();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = [
      { id: 'low_energy', icon: BatteryWarning, label: 'خسته و بی‌انرژی‌ام', color: 'text-orange-400', prompt: 'امروز خیلی خسته‌م و انرژی ندارم. لطفاً فشار تمرین رو کم کن و حجمش رو بیار پایین.' },
      { id: 'short_time', icon: Briefcase, label: 'وقتم کمه (۳۰ دقیقه)', color: 'text-blue-400', prompt: 'فقط ۳۰ دقیقه وقت دارم. برنامه رو فشرده کن و فقط حرکات اصلی رو نگه دار.' },
      { id: 'home_workout', icon: Home, label: 'امروز خونه تمرین میکنم', color: 'text-emerald-400', prompt: 'امروز نمیتونم برم باشگاه و توی خونه تمرین میکنم. برنامه رو با تجهیزات دمبل و کش تغییر بده.' },
      { id: 'injury_flare', icon: Zap, label: 'درد مفصل دارم', color: 'text-red-400', prompt: 'امروز مفصل (زانو/کمر/شانه) درد میکنه. حرکاتی که فشار میارن رو حذف یا جایگزین کن.' },
  ];

  const handleApply = () => {
      if (!selectedScenario) return;
      const scenario = scenarios.find(s => s.id === selectedScenario);
      if (scenario) {
          setPendingChatInput(scenario.prompt);
          setCurrentView(AppView.CHAT);
          onClose(); // Close modal
      }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none"
    >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

        {/* Modal Content */}
        <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full sm:max-w-md bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t border-white/10 p-6 pointer-events-auto shadow-2xl relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-white">تغییر شرایط تمرین</h3>
                    <p className="text-xs text-zinc-500 mt-1">هوش مصنوعی برنامه را با شرایط جدیدت تطبیق میده.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-black rounded-full border border-zinc-800 text-zinc-400">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {scenarios.map((item) => {
                    const isSelected = selectedScenario === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedScenario(item.id)}
                            className={`p-4 rounded-2xl border text-right transition-all duration-200 relative overflow-hidden group ${
                                isSelected 
                                ? 'bg-zinc-800 border-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                : 'bg-black border-zinc-800 hover:bg-zinc-800'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-3 ${isSelected ? 'bg-gold-500 text-black border-gold-500' : ''}`}>
                                <item.icon className={`w-5 h-5 ${isSelected ? 'text-black' : item.color}`} />
                            </div>
                            <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                {item.label}
                            </span>
                            {isSelected && (
                                <div className="absolute top-3 right-3 text-gold-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action Button */}
            <Button 
                variant="primary" 
                className="w-full h-14 text-base"
                disabled={!selectedScenario}
                onClick={handleApply}
            >
                اعمال تغییرات هوشمند
                <ArrowRight className="w-5 h-5 mr-2" />
            </Button>

        </motion.div>
    </motion.div>
  );
};
