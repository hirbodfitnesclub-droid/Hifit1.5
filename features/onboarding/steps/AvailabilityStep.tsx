
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { WeekDay } from '../../../types';

interface AvailabilityStepProps {
  onNext: (data: { availability: WeekDay[] }) => void;
}

const DAYS: { id: WeekDay; label: string }[] = [
    { id: 'Saturday', label: 'شنبه' },
    { id: 'Sunday', label: 'یکشنبه' },
    { id: 'Monday', label: 'دوشنبه' },
    { id: 'Tuesday', label: 'سه‌شنبه' },
    { id: 'Wednesday', label: 'چهارشنبه' },
    { id: 'Thursday', label: 'پنجشنبه' },
    { id: 'Friday', label: 'جمعه' },
];

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ onNext }) => {
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);

  const toggleDay = (day: WeekDay) => {
      if (selectedDays.includes(day)) {
          setSelectedDays(selectedDays.filter(d => d !== day));
      } else {
          setSelectedDays([...selectedDays, day]);
      }
  };

  return (
    <>
      <span className="text-gold-500 font-bold text-sm tracking-widest uppercase mb-2 block">مرحله ۴/۶</span>
      <h2 className="text-4xl font-black mb-4 leading-tight">برنامه هفتگی</h2>
      <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          کدام روزها فرصت تمرین دارید؟ <br/>
          <span className="text-gold-500 text-xs">هوش مصنوعی برنامه را دقیقاً برای همین روزها می‌چیند.</span>
      </p>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
            {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                    <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all group ${
                            isSelected 
                            ? 'bg-zinc-800 border-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                        }`}
                    >
                        <span className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                            {day.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-gold-500 border-gold-500' : 'border-zinc-600'
                        }`}>
                            {isSelected && <CalendarDays className="w-3 h-3 text-black" />}
                        </div>
                    </button>
                )
            })}
        </div>

        <Button 
          variant="primary" 
          className="w-full"
          disabled={selectedDays.length === 0}
          onClick={() => onNext({ availability: selectedDays })}
        >
          ادامه ({selectedDays.length} روز) <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};
