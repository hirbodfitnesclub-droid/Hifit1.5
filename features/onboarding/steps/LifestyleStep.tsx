
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Sun, Moon, Briefcase, Clock } from 'lucide-react';
import { LifestyleData } from '../../../types';

interface LifestyleStepProps {
  onNext: (data: { lifestyle: LifestyleData }) => void;
}

export const LifestyleStep: React.FC<LifestyleStepProps> = ({ onNext }) => {
  const [data, setData] = useState<Partial<LifestyleData>>({
      jobActivity: undefined,
      workoutTimePreference: undefined,
      sleepTime: '23:00',
      wakeTime: '07:00'
  });

  const isValid = data.jobActivity && data.workoutTimePreference && data.sleepTime && data.wakeTime;

  const activities = [
      { id: 'sedentary', label: 'پشت میز نشین', desc: 'تحرک خیلی کم' },
      { id: 'light', label: 'سبک', desc: 'کمی پیاده‌روی/ایستاده' },
      { id: 'active', label: 'فعال', desc: 'کار فیزیکی/پرتحرک' },
  ];

  const times = [
      { id: 'morning', label: 'صبح' },
      { id: 'afternoon', label: 'ظهر' },
      { id: 'evening', label: 'عصر' },
      { id: 'night', label: 'شب' },
  ];

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۶/۹</span>
      <h2 className="text-4xl font-black mb-6 leading-tight">سبک زندگی</h2>

      <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-1 pb-1 scrollbar-hide">
        
        {/* Sleep Schedule */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <Moon className="w-4 h-4" /> چرخه خواب
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">ساعت خواب</label>
                    <input 
                        type="time" 
                        value={data.sleepTime}
                        onChange={e => setData({...data, sleepTime: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-center font-mono text-sm focus:border-gold-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">ساعت بیداری</label>
                    <input 
                        type="time" 
                        value={data.wakeTime}
                        onChange={e => setData({...data, wakeTime: e.target.value})}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-center font-mono text-sm focus:border-gold-500 outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Job Activity */}
        <div>
            <h3 className="text-xs font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> فعالیت شغلی
            </h3>
            <div className="grid grid-cols-3 gap-2">
                {activities.map(act => (
                    <button
                        key={act.id}
                        onClick={() => setData({...data, jobActivity: act.id as any})}
                        className={`p-2 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${data.jobActivity === act.id ? 'bg-zinc-800 border-gold-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                    >
                        <span className="text-xs font-bold">{act.label}</span>
                        <span className="text-[8px] opacity-70">{act.desc}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Workout Time */}
        <div>
            <h3 className="text-xs font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> زمان تمرین (ترجیحی)
            </h3>
            <div className="grid grid-cols-4 gap-2">
                {times.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setData({...data, workoutTimePreference: t.id as any})}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${data.workoutTimePreference === t.id ? 'bg-gold-500 text-black border-gold-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full mt-2"
          disabled={!isValid}
          onClick={() => onNext({ lifestyle: data as LifestyleData })}
        >
          ادامه <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
