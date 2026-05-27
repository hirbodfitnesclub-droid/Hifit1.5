
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { AppView, Meal } from '../../types';
import { NutritionHero } from './components/NutritionHero';
import { HydrationPod } from './components/HydrationPod';
import { MealCard } from './components/MealCard';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NutritionPlan: React.FC = () => {
  const { weeklyPlan, currentDayIndex, setCurrentView, setPendingChatInput } = useUser();
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  if (!weeklyPlan) return null;
  const currentPlan = weeklyPlan.days[currentDayIndex];

  const handleSwap = (meal: Meal) => {
    const mealName = meal.type; // Can map to Persian label if needed
    const dayName = currentPlan.dayName;
    const prompt = `لطفاً وعده "${meal.title}" (${mealName}) برای روز ${dayName} رو تغییر بده. من این غذا رو دوست ندارم یا موادش رو ندارم. یه پیشنهاد جایگزین با همون ماکروها بده.`;
    
    setPendingChatInput(prompt);
    setCurrentView(AppView.CHAT);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black relative overflow-hidden font-sans">
        
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
           <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full" />
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide w-full relative z-10 pb-32">
             <div className="px-5 pt-8 space-y-6">
                 
                 {/* Header */}
                 <header className="flex justify-between items-end mb-2">
                     <div>
                         <span className="text-[10px] font-bold text-gold-500 tracking-[0.2em] uppercase block mb-1 opacity-80">
                             استودیوی تغذیه
                         </span>
                         <h1 className="text-3xl font-black text-white leading-none">
                             برنامه غذایی
                         </h1>
                     </div>
                     <span className="text-xs font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                         {currentPlan.dayName}
                     </span>
                 </header>

                 {/* Top Grid: Hero + Hydration */}
                 <div className="grid grid-cols-12 gap-3">
                     <div className="col-span-8">
                         <NutritionHero plan={currentPlan} />
                     </div>
                     <div className="col-span-4">
                         <HydrationPod glasses={waterGlasses} setGlasses={setWaterGlasses} />
                     </div>
                 </div>

                 {/* Separator */}
                 <div className="flex items-center gap-4 py-2">
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                         وعده‌های امروز
                     </span>
                     <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent" />
                 </div>

                 {/* Meal Timeline */}
                 <div className="space-y-4 pb-10">
                     {(!currentPlan.meals || currentPlan.meals.length === 0) ? (
                         <div className="p-8 text-center border border-dashed border-zinc-800 rounded-[2rem] bg-zinc-900/20">
                             <p className="text-zinc-500 text-sm">برنامه‌ای برای امروز یافت نشد.</p>
                         </div>
                     ) : (
                         currentPlan.meals.map((meal, idx) => (
                             <MealCard 
                                key={meal.id} 
                                meal={meal} 
                                index={idx}
                                isExpanded={expandedMealId === meal.id}
                                onToggle={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                                onSwap={handleSwap}
                             />
                         ))
                     )}
                 </div>

             </div>
        </div>

        {/* Floating AI Scan Action (Optional UX enhancement for 'Gen Z') */}
        <div className="absolute bottom-24 left-5 z-20">
            <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gold-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-white/20"
                onClick={() => {
                    setPendingChatInput("میخوام عکس غذام رو بفرستم تا آنالیز کنی.");
                    setCurrentView(AppView.CHAT);
                }}
            >
                <div className="w-1.5 h-1.5 bg-black rounded-full absolute top-3 right-3" />
                <ArrowLeft className="w-5 h-5 -rotate-45" />
            </motion.button>
        </div>
    </div>
  );
};
