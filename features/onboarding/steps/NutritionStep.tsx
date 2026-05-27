
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Utensils, Ban, Leaf } from 'lucide-react';
import { NutritionPreferences } from '../../../types';

interface NutritionStepProps {
  onNext: (data: { nutrition: NutritionPreferences }) => void;
}

export const NutritionStep: React.FC<NutritionStepProps> = ({ onNext }) => {
  const [dietType, setDietType] = useState<NutritionPreferences['dietType']>('omnivore');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState('');

  const diets = [
      { id: 'omnivore', label: 'همه‌چیز خوار', icon: Utensils },
      { id: 'vegetarian', label: 'گیاه‌خوار', icon: Leaf },
      { id: 'keto', label: 'کتوژنیک', icon: Ban }, // Using Ban as abstract symbol for restriction
  ];

  const commonAllergies = ['لبنیات', 'بادام زمینی', 'گلوتن', 'تخم‌مرغ', 'ماهی'];

  const toggleAllergy = (item: string) => {
      if (allergies.includes(item)) setAllergies(allergies.filter(i => i !== item));
      else setAllergies([...allergies, item]);
  };

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۷/۹</span>
      <h2 className="text-4xl font-black mb-6 leading-tight">تغذیه</h2>

      <div className="space-y-6">
        
        {/* Diet Type */}
        <div className="space-y-3">
            <label className="text-xs text-zinc-400 font-bold">سبک رژیم</label>
            <div className="grid grid-cols-3 gap-2">
                {diets.map(d => (
                    <button
                        key={d.id}
                        onClick={() => setDietType(d.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${dietType === d.id ? 'bg-zinc-800 border-gold-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                    >
                        <d.icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{d.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
            <label className="text-xs text-zinc-400 font-bold">حساسیت‌ها</label>
            <div className="flex flex-wrap gap-2">
                {commonAllergies.map(alg => (
                    <button
                        key={alg}
                        onClick={() => toggleAllergy(alg)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${allergies.includes(alg) ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                    >
                        {alg}
                    </button>
                ))}
            </div>
        </div>

        {/* Dislikes */}
        <div className="space-y-3">
             <label className="text-xs text-zinc-400 font-bold">غذاهایی که دوست ندارید (اختیاری)</label>
             <textarea 
                value={dislikes}
                onChange={e => setDislikes(e.target.value)}
                placeholder="مثلاً: بادمجان، کله‌پاچه، میگو..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-sm focus:border-gold-500 outline-none min-h-[80px]"
             />
        </div>

        <Button 
          variant="primary" 
          className="w-full mt-4"
          onClick={() => onNext({ 
              nutrition: { 
                  dietType, 
                  allergies, 
                  dislikes: dislikes.split(',').map(s => s.trim()).filter(s => s),
                  supplementsAllowed: true // Default true for now
              } 
          })}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
