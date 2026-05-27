
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal } from '../../../types';
import { ChevronDown, RefreshCw, ChefHat, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MealCardProps {
  meal: Meal;
  isExpanded: boolean;
  onToggle: () => void;
  onSwap: (meal: Meal) => void;
  index: number;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, isExpanded, onToggle, onSwap, index }) => {
  
  const getMealMeta = (type: string) => {
     switch(type) {
         case 'breakfast': return { color: 'text-orange-400', bg: 'bg-orange-500', label: 'صبحانه' };
         case 'lunch': return { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'ناهار' };
         case 'dinner': return { color: 'text-indigo-400', bg: 'bg-indigo-500', label: 'شام' };
         case 'pre_workout': return { color: 'text-red-400', bg: 'bg-red-500', label: 'قبل تمرین' };
         case 'post_workout': return { color: 'text-blue-400', bg: 'bg-blue-500', label: 'بعد تمرین' };
         default: return { color: 'text-zinc-400', bg: 'bg-zinc-500', label: 'میان وعده' };
     }
  };

  const meta = getMealMeta(meal.type);

  return (
    <div className="relative pl-6">
        {/* Timeline Dot & Line */}
        <div className="absolute right-[-5px] top-0 bottom-0 flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${meta.bg} shadow-[0_0_10px_currentColor] z-10`} />
            <div className="w-0.5 flex-1 bg-zinc-800 my-1" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative bg-zinc-900/80 border rounded-[1.8rem] overflow-hidden transition-all duration-300
                ${isExpanded ? 'border-gold-500/30 shadow-2xl' : 'border-zinc-800 hover:border-zinc-700'}
            `}
        >
             {/* Collapsed View */}
             <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={onToggle}
             >
                 <div className="flex items-center gap-4">
                     {/* Image Placeholder */}
                     <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                         <ChefHat className={`w-6 h-6 ${meta.color}`} />
                     </div>
                     
                     <div className="flex flex-col">
                         <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-white/5 ${meta.color}`}>
                                 {meta.label}
                             </span>
                             <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> {meal.timeSuggestions}
                             </span>
                         </div>
                         <h3 className="text-base font-bold text-white leading-tight line-clamp-1">
                             {meal.title}
                         </h3>
                     </div>
                 </div>

                 <button className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : 'text-zinc-500'}`}>
                     <ChevronDown className="w-4 h-4" />
                 </button>
             </div>

             {/* Expanded Details */}
             <AnimatePresence>
                 {isExpanded && (
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                     >
                         <div className="px-4 pb-4">
                             <div className="h-px w-full bg-white/5 mb-4" />
                             
                             {/* Ingredients */}
                             <div className="mb-4">
                                 <span className="text-[9px] font-bold text-zinc-500 uppercase block mb-2">مواد اولیه</span>
                                 <div className="flex flex-wrap gap-2">
                                     {meal.ingredients.map((ing, i) => (
                                         <span key={i} className="text-xs text-zinc-300 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg">
                                             {ing}
                                         </span>
                                     ))}
                                 </div>
                             </div>

                             {/* Macro Detail Row */}
                             <div className="grid grid-cols-3 gap-2 mb-4 bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                                 <div className="text-center">
                                     <span className="block text-xs font-black text-blue-400">{meal.macros.p}g</span>
                                     <span className="text-[8px] text-zinc-500">پروتئین</span>
                                 </div>
                                 <div className="text-center border-r border-l border-white/5">
                                     <span className="block text-xs font-black text-orange-400">{meal.macros.c}g</span>
                                     <span className="text-[8px] text-zinc-500">کربوهیدرات</span>
                                 </div>
                                 <div className="text-center">
                                     <span className="block text-xs font-black text-yellow-400">{meal.macros.f}g</span>
                                     <span className="text-[8px] text-zinc-500">چربی</span>
                                 </div>
                             </div>

                             {/* Actions */}
                             <Button 
                                variant="outline" 
                                className="w-full h-10 text-xs border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-gold-500/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSwap(meal);
                                }}
                             >
                                 <RefreshCw className="w-3.5 h-3.5 mr-2" />
                                 پیشنهاد جایگزین توسط هوش مصنوعی
                             </Button>
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>
        </motion.div>
    </div>
  );
};
