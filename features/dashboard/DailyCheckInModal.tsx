
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronRight, Brain, Battery, Frown, Meh, Smile, CheckCircle2, Loader2, Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

interface DailyCheckInModalProps {
  onSubmit: (data: any) => Promise<void> | void; // Allow async
}

// Minimal Compact Mood Button
const MoodButton = ({ 
  selected, 
  onClick, 
  icon: Icon, 
  label, 
  colorClass 
}: { 
  selected: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
  colorClass: string 
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative group overflow-hidden rounded-2xl p-4 transition-all duration-300 w-full flex flex-col items-center justify-center gap-3 border",
      selected 
        ? "bg-zinc-800 border-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.15)] scale-[1.02]" 
        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
    )}
  >
    <div className={clsx(
      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
      selected ? "bg-white/5" : "bg-transparent"
    )}>
      <Icon className={clsx("w-7 h-7 transition-colors", selected ? colorClass : "text-zinc-500 group-hover:text-zinc-300")} />
    </div>
    <span className={clsx("font-bold text-sm", selected ? "text-white" : "text-zinc-500")}>
      {label}
    </span>
    {selected && (
      <motion.div layoutId="check" className="absolute top-2 right-2 text-gold-500">
        <CheckCircle2 className="w-4 h-4 fill-gold-500/10" />
      </motion.div>
    )}
  </button>
);

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<'intro' | 'sleep' | 'mood' | 'adjustment' | 'analyzing'>('intro');
  const [sleep, setSleep] = useState(7);
  const [mood, setMood] = useState<'great'|'good'|'tired'|'stressed' | null>(null);
  const [shouldAdjust, setShouldAdjust] = useState<boolean | null>(null);

  // Auto-advance intro faster
  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => setStep('sleep'), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleMoodSelection = (selectedMood: 'great'|'good'|'tired'|'stressed') => {
      setMood(selectedMood);
      // Wait a bit then go to adjustment
      setTimeout(() => setStep('adjustment'), 500);
  };

  const handleFinish = async (adjust: boolean) => {
    setShouldAdjust(adjust);
    setStep('analyzing');
    
    // Call parent submit. If it returns a promise, we wait for it.
    // The parent handles the API call if adjust is true.
    await onSubmit({ 
        sleepHours: sleep, 
        mood, 
        soreness: 'none',
        shouldAdjustPlan: adjust 
    });
    
    // Parent closes modal via logic, or if we want to force close here we could,
    // but usually onSubmit in parent sets ShowCheckin(false).
  };

  const getAdjustmentText = () => {
      if (mood === 'tired' || mood === 'stressed' || sleep < 6) {
          return {
              title: "کاهش فشار تمرین؟",
              desc: "با توجه به شرایطت، هوش مصنوعی پیشنهاد میده حجم تمرین امروز رو ۲۰٪ کم کنیم تا ریکاوری بهتر انجام بشه.",
              action: "کاهش فشار",
              icon: ArrowDownRight
          };
      }
      if (mood === 'great' && sleep > 7) {
          return {
              title: "افزایش چالش؟",
              desc: "انرژیت عالیه! میخوای یک ست اضافه یا تکنیک دراپ‌ست به تمرین امروز اضافه کنم؟",
              action: "افزایش چالش",
              icon: ArrowUpRight
          };
      }
      return {
          title: "بهینه‌سازی هوشمند؟",
          desc: "میخوای ترتیب حرکات رو بر اساس سطح انرژی امروزت بازچینی کنم؟",
          action: "بهینه‌سازی",
          icon: Sparkles
      };
  };

  const adjText = getAdjustmentText();
  const ActionIcon = adjText.icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="w-full h-[100dvh] sm:h-auto sm:max-w-md bg-black sm:rounded-[2.5rem] relative flex flex-col overflow-hidden sm:border sm:border-white/10 sm:shadow-2xl">
        
        {/* Minimal Background Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Content Container */}
        <div className="flex-1 flex flex-col px-6 pt-8 pb-10 relative z-10 h-full">
          
          {/* Header Navigation */}
          {step !== 'intro' && step !== 'analyzing' && (
             <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => {
                      if (step === 'adjustment') setStep('mood');
                      else if (step === 'mood') setStep('sleep');
                      else setStep('intro');
                  }} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                   <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Minimal Progress Dots */}
                <div className="flex gap-2 dir-ltr">
                   <div className={clsx("w-2 h-2 rounded-full transition-colors", "bg-gold-500")} />
                   <div className={clsx("w-2 h-2 rounded-full transition-colors", step === 'sleep' ? "bg-zinc-800" : "bg-gold-500")} />
                   <div className={clsx("w-2 h-2 rounded-full transition-colors", (step === 'sleep' || step === 'mood') ? "bg-zinc-800" : "bg-gold-500")} />
                   <div className={clsx("w-2 h-2 rounded-full transition-colors", step === 'adjustment' ? "bg-gold-500" : "bg-zinc-800")} />
                </div>
             </div>
          )}

          <AnimatePresence mode='wait'>
            
            {/* 1. INTRO */}
            {step === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                 <div className="w-28 h-28 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold-500/10 animate-pulse" />
                    <Brain className="w-12 h-12 text-gold-500 relative z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">HIFIT AI</h2>
                    <p className="text-zinc-500 text-base font-medium">در حال کالیبره کردن برنامه امروز...</p>
                 </div>
              </motion.div>
            )}

            {/* 2. SLEEP */}
            {step === 'sleep' && (
              <motion.div 
                key="sleep"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black text-white mb-2">کیفیت خواب؟</h3>
                  <p className="text-sm text-zinc-500">برای محاسبه توان ریکاوری سیستم عصبی</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                   {/* Modern Slider UI */}
                   <div className="w-full relative py-10 bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6">
                       <div className="flex justify-between items-end px-2 mb-6">
                           <span className="text-7xl font-black text-white tracking-tighter">{sleep}</span>
                           <span className="text-sm font-bold text-zinc-500 mb-3">ساعت</span>
                       </div>
                       
                       <input 
                         type="range" 
                         min="3" max="12" step="0.5"
                         value={sleep}
                         onChange={(e) => setSleep(parseFloat(e.target.value))}
                         className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 transition-all mb-4"
                       />
                       
                       <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                           <span>کم (3h)</span>
                           <span>ایده‌آل (8h)</span>
                           <span>زیاد (12h)</span>
                       </div>
                   </div>
                </div>

                <Button 
                    variant="primary"
                    className="w-full h-14 text-base rounded-2xl mt-auto"
                    onClick={() => setStep('mood')}
                >
                    ادامه
                </Button>
              </motion.div>
            )}

            {/* 3. MOOD */}
            {step === 'mood' && (
              <motion.div 
                key="mood"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black text-white mb-2">سطح انرژی؟</h3>
                  <p className="text-sm text-zinc-500">تحلیل آمادگی روانی برای فشار تمرین</p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-auto">
                    <MoodButton selected={mood === 'great'} onClick={() => handleMoodSelection('great')} icon={Smile} label="بمب انرژی" colorClass="text-emerald-400" />
                    <MoodButton selected={mood === 'good'} onClick={() => handleMoodSelection('good')} icon={Meh} label="نرمال" colorClass="text-blue-400" />
                    <MoodButton selected={mood === 'tired'} onClick={() => handleMoodSelection('tired')} icon={Battery} label="خسته و کوفته" colorClass="text-orange-400" />
                    <MoodButton selected={mood === 'stressed'} onClick={() => handleMoodSelection('stressed')} icon={Frown} label="ذهن شلوغ" colorClass="text-red-400" />
                </div>
              </motion.div>
            )}

            {/* 4. ADJUSTMENT PROMPT (New UX Step) */}
            {step === 'adjustment' && (
                <motion.div
                    key="adjustment"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-center"
                >
                     <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />
                        
                        <div className="w-20 h-20 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                             <div className="absolute inset-0 bg-gold-500/5 blur-xl" />
                            <ActionIcon className="w-10 h-10 text-gold-500 relative z-10" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4">{adjText.title}</h3>
                        <p className="text-base text-zinc-400 leading-relaxed mb-10 px-2">
                            {adjText.desc}
                        </p>

                        <div className="grid gap-4">
                            <Button 
                                variant="primary" 
                                className="w-full h-14 text-base"
                                onClick={() => handleFinish(true)}
                            >
                                <span className="ml-2">بله، {adjText.action}</span>
                                <CheckCircle2 className="w-5 h-5" />
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                className="w-full h-12 text-zinc-500 hover:text-white"
                                onClick={() => handleFinish(false)}
                            >
                                نه، طبق برنامه پیش میرم
                            </Button>
                        </div>
                     </div>
                </motion.div>
            )}

            {/* 5. ANALYZING - Now Real */}
            {step === 'analyzing' && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center pb-10"
              >
                  <div className="relative mb-10">
                      <div className="absolute inset-0 bg-gold-500/20 blur-[50px] rounded-full" />
                      <Loader2 className="w-20 h-20 text-white animate-spin relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">در حال بروزرسانی برنامه...</h3>
                  <div className="flex gap-2 justify-center mt-4">
                      {shouldAdjust ? (
                           <span className="px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-sm font-bold text-gold-500 animate-pulse">تغییرات هوشمند</span>
                      ) : (
                           <span className="px-4 py-1.5 bg-zinc-800 rounded-full text-sm font-bold text-zinc-400">برنامه استاندارد</span>
                      )}
                  </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
