
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface GoalStepProps {
  onNext: (data: { goal: string; experience: string }) => void;
}

export const GoalStep: React.FC<GoalStepProps> = ({ onNext }) => {
  const [goal, setGoal] = useState('');
  const [exp, setExp] = useState('');

  const goals = ['کاهش وزن', 'عضله سازی', 'افزایش قدرت', 'لایف استایل'];
  const exps = [
      { id: 'beginner', label: 'مبتدی', desc: 'زیر ۶ ماه' },
      { id: 'intermediate', label: 'متوسط', desc: '۶ ماه تا ۲ سال' },
      { id: 'advanced', label: 'حرفه‌ای', desc: 'بالای ۲ سال' }
  ];

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۳/۶</span>
      <h2 className="text-4xl font-black mb-6 leading-tight">هدف و تجربه</h2>

      <div className="space-y-6">
        
        {/* Goals */}
        <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">هدف اصلی شما؟</label>
            <div className="grid grid-cols-2 gap-3">
                {goals.map(g => (
                    <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all ${goal === g ? 'bg-gold-500 text-black border-gold-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>

        {/* Experience */}
        <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">سابقه تمرین؟</label>
            <div className="space-y-2">
                {exps.map(e => (
                    <button
                        key={e.id}
                        onClick={() => setExp(e.id)}
                        className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${exp === e.id ? 'bg-zinc-800 border-gold-500 text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'}`}
                    >
                        <span className="font-bold">{e.label}</span>
                        <span className="text-xs opacity-60">{e.desc}</span>
                    </button>
                ))}
            </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full"
          disabled={!goal || !exp}
          onClick={() => onNext({ goal, experience: exp })}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
