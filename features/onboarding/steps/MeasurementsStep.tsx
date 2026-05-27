
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Ruler } from 'lucide-react';
import { Gender } from '../../../types';

interface MeasurementsStepProps {
  gender: Gender;
  onNext: (data: { measurements: { neck: number; waist: number; hips?: number } }) => void;
}

export const MeasurementsStep: React.FC<MeasurementsStepProps> = ({ gender, onNext }) => {
  const [data, setData] = useState({ neck: '', waist: '', hips: '' });

  // Hips are mandatory for females for US Navy Fat Calc, optional but good for males
  const isValid = data.neck && data.waist && (gender === 'male' || data.hips);

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۳/۹</span>
      <h2 className="text-4xl font-black mb-4 leading-tight">سایز دقیق</h2>
      <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
         برای محاسبه دقیق درصد چربی و متابولیسم، به این اندازه‌ها نیاز دارم. 
         <span className="text-xs block mt-1 text-gold-500 opacity-80">(اندازه‌گیری با متر خیاطی)</span>
      </p>

      <div className="space-y-6">
         
         {/* Neck */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                <Ruler className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">دور گردن (cm)</label>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="مثلا: 38"
                    value={data.neck}
                    onChange={e => setData({...data, neck: e.target.value})}
                />
            </div>
         </div>

         {/* Waist */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                <div className="w-5 h-1 bg-zinc-500 rounded-full" />
            </div>
            <div className="flex-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">دور کمر (cm)</label>
                <span className="text-[9px] text-zinc-600 block mb-1">باریک‌ترین قسمت (بالای ناف)</span>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="مثلا: 85"
                    value={data.waist}
                    onChange={e => setData({...data, waist: e.target.value})}
                />
            </div>
         </div>

         {/* Hips (Highlighted for Females) */}
         <div className={`bg-zinc-900 border rounded-2xl p-4 relative flex items-center gap-4 transition-all ${gender === 'female' ? 'border-gold-500/30' : 'border-zinc-800'}`}>
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                <div className="w-6 h-3 border-2 border-zinc-500 rounded-full" />
            </div>
            <div className="flex-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                    دور باسن (cm) {gender === 'male' && '(اختیاری)'}
                </label>
                <span className="text-[9px] text-zinc-600 block mb-1">پهن‌ترین قسمت برجستگی</span>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="مثلا: 100"
                    value={data.hips}
                    onChange={e => setData({...data, hips: e.target.value})}
                />
            </div>
         </div>

        <Button 
          variant="primary" 
          className="w-full mt-4"
          disabled={!isValid}
          onClick={() => onNext({ 
              measurements: { 
                  neck: parseFloat(data.neck), 
                  waist: parseFloat(data.waist), 
                  hips: data.hips ? parseFloat(data.hips) : undefined 
              } 
          })}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
