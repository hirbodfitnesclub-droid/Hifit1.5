
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface HealthStepProps {
  onNext: (data: { injuries: string }) => void;
}

export const HealthStep: React.FC<HealthStepProps> = ({ onNext }) => {
  const [hasInjury, setHasInjury] = useState<boolean | null>(null);
  const [detail, setDetail] = useState('');

  const handleFinish = () => {
      onNext({ injuries: hasInjury ? detail : 'none' });
  };

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۶/۶</span>
      <h2 className="text-4xl font-black mb-4 leading-tight">سلامت جسمانی</h2>
      <p className="text-zinc-400 mb-8 text-sm">
          آیا آسیب دیدگی خاصی (کمر درد، زانو درد، دیسک...) دارید که باید در برنامه لحاظ شود؟
      </p>

      <div className="space-y-6">
        
        <div className="space-y-3">
             <button
                onClick={() => setHasInjury(false)}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    hasInjury === false
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
             >
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${hasInjury === false ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                     {hasInjury === false && <CheckCircle2 className="w-4 h-4 text-black" />}
                 </div>
                 <span className={`font-bold ${hasInjury === false ? 'text-emerald-400' : 'text-zinc-400'}`}>
                     خیر، کاملاً سالمم
                 </span>
             </button>

             <button
                onClick={() => setHasInjury(true)}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    hasInjury === true
                    ? 'bg-orange-500/10 border-orange-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
             >
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${hasInjury === true ? 'bg-orange-500 border-orange-500' : 'border-zinc-600'}`}>
                     {hasInjury === true && <AlertCircle className="w-4 h-4 text-black" />}
                 </div>
                 <span className={`font-bold ${hasInjury === true ? 'text-orange-400' : 'text-zinc-400'}`}>
                     بله، آسیب دیدگی دارم
                 </span>
             </button>
        </div>

        {hasInjury && (
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs text-zinc-500 font-bold mb-2 block">توضیح دهید (مثلاً: دیسک کمر خفیف)</label>
                <textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white text-sm min-h-[80px] focus:border-gold-500 outline-none"
                    placeholder="جزئیات را بنویسید..."
                />
            </div>
        )}

        <Button 
          variant="primary" 
          className="w-full mt-4"
          disabled={hasInjury === null || (hasInjury && !detail)}
          onClick={handleFinish}
        >
          پایان و ساخت برنامه
        </Button>
      </div>
    </>
  );
};
