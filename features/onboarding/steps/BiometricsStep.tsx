
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Gender } from '../../../types';

interface BiometricsStepProps {
  onNext: (data: { age: string; gender: Gender; height: string; weight: string }) => void;
}

export const BiometricsStep: React.FC<BiometricsStepProps> = ({ onNext }) => {
  const [data, setData] = useState({ age: '', gender: 'male' as Gender, height: '', weight: '' });

  const isValid = data.age && data.height && data.weight;

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۲/۶</span>
      <h2 className="text-4xl font-black mb-8 leading-tight">اطلاعات فیزیکی</h2>

      <div className="space-y-6">
        
        {/* Gender Selection */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => setData({ ...data, gender: 'male' })}
                className={`p-4 rounded-2xl border transition-all ${data.gender === 'male' ? 'bg-gold-500 text-black border-gold-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
            >
                <span className="font-bold">آقا</span>
            </button>
            <button 
                onClick={() => setData({ ...data, gender: 'female' })}
                className={`p-4 rounded-2xl border transition-all ${data.gender === 'female' ? 'bg-gold-500 text-black border-gold-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
            >
                <span className="font-bold">خانم</span>
            </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4">
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">سن</label>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="25"
                    value={data.age}
                    onChange={e => setData({...data, age: e.target.value})}
                />
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">وزن (kg)</label>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="75"
                    value={data.weight}
                    onChange={e => setData({...data, weight: e.target.value})}
                />
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative col-span-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">قد (cm)</label>
                <input 
                    type="number" 
                    className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder:text-zinc-700"
                    placeholder="175"
                    value={data.height}
                    onChange={e => setData({...data, height: e.target.value})}
                />
             </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full mt-4"
          disabled={!isValid}
          onClick={() => onNext(data)}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
