
import React from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface NameStepProps {
  onNext: (data: { name: string }) => void;
}

export const NameStep: React.FC<NameStepProps> = ({ onNext }) => {
  const handleNext = (val: string) => {
    if (val.trim()) onNext({ name: val });
  };

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۱/۶</span>
      <h2 className="text-5xl font-black mb-12 leading-tight">اسم شما چیه؟</h2>

      <div className="space-y-8">
        <input
          autoFocus
          type="text"
          className="w-full bg-transparent border-b border-zinc-800 focus:border-gold-500 text-3xl py-4 outline-none text-right placeholder:text-zinc-800 transition-colors font-bold text-white"
          placeholder="مثلاً: علی"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              handleNext(e.currentTarget.value);
            }
          }}
        />
        <Button 
          variant="primary" 
          className="w-full"
          onClick={(e) => {
             const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement).value;
             handleNext(input);
          }}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
