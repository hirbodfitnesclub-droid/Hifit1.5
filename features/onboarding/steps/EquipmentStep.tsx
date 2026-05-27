
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Building2, Home, Check } from 'lucide-react';

interface EquipmentStepProps {
  onNext: (data: { equipment: 'gym' | 'home'; homeEquipment?: string[] }) => void;
}

const HOME_TOOLS = ['دمبل', 'هالتر', 'کش مقاومتی', 'میله بارفیکس', 'بند TRX', 'نیمکت'];

export const EquipmentStep: React.FC<EquipmentStepProps> = ({ onNext }) => {
  const [place, setPlace] = useState<'gym' | 'home' | null>(null);
  const [tools, setTools] = useState<string[]>([]);

  const toggleTool = (tool: string) => {
      if (tools.includes(tool)) setTools(tools.filter(t => t !== tool));
      else setTools([...tools, tool]);
  };

  const handleNext = () => {
      if (!place) return;
      onNext({ 
          equipment: place, 
          homeEquipment: place === 'home' ? tools : [] 
      });
  };

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۵/۶</span>
      <h2 className="text-4xl font-black mb-8 leading-tight">محل تمرین</h2>

      <div className="space-y-6">
        
        {/* Main Selection */}
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => setPlace('gym')}
                className={`p-6 rounded-[2rem] border flex flex-col items-center gap-4 transition-all ${
                    place === 'gym' 
                    ? 'bg-zinc-800 border-gold-500' 
                    : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                }`}
            >
                <Building2 className={`w-8 h-8 ${place === 'gym' ? 'text-gold-500' : 'text-zinc-500'}`} />
                <span className={`font-bold ${place === 'gym' ? 'text-white' : 'text-zinc-400'}`}>باشگاه</span>
            </button>

            <button
                onClick={() => setPlace('home')}
                className={`p-6 rounded-[2rem] border flex flex-col items-center gap-4 transition-all ${
                    place === 'home' 
                    ? 'bg-zinc-800 border-gold-500' 
                    : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                }`}
            >
                <Home className={`w-8 h-8 ${place === 'home' ? 'text-gold-500' : 'text-zinc-500'}`} />
                <span className={`font-bold ${place === 'home' ? 'text-white' : 'text-zinc-400'}`}>خانه</span>
            </button>
        </div>

        {/* Dynamic Sub-selection for Home */}
        <AnimatePresence>
            {place === 'home' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800 mt-2">
                        <p className="text-xs font-bold text-zinc-400 mb-4">چه تجهیزاتی دارید؟</p>
                        <div className="grid grid-cols-2 gap-2">
                            {HOME_TOOLS.map(t => (
                                <button
                                    key={t}
                                    onClick={() => toggleTool(t)}
                                    className={`px-3 py-2 rounded-lg text-sm border flex justify-between items-center transition-all ${
                                        tools.includes(t)
                                        ? 'bg-gold-500/10 border-gold-500/50 text-gold-400'
                                        : 'bg-black/20 border-zinc-700 text-zinc-500'
                                    }`}
                                >
                                    {t}
                                    {tools.includes(t) && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <Button 
          variant="primary" 
          className="w-full mt-4"
          disabled={!place}
          onClick={handleNext}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
