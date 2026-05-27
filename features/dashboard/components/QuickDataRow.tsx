
import React from 'react';
import { Flame, Wallet, TrendingUp } from 'lucide-react';

export const QuickDataRow: React.FC = () => {
  return (
    <div className="col-span-12 grid grid-cols-3 gap-2 dir-rtl">
        
        {/* 1. Streak */}
        <div className="relative bg-zinc-950 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-[4.5rem] overflow-hidden group hover:bg-zinc-900 transition-colors shadow-lg">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100" />
            
            <div className="flex justify-between items-start relative z-10">
                 <span className="text-[9px] font-bold text-zinc-500">تداوم</span>
                 <Flame className="w-3.5 h-3.5 text-orange-500 opacity-80" />
            </div>
            
            <div className="relative z-10 flex items-end gap-1">
                <span className="text-lg font-black text-white leading-none">۱۲</span>
                <span className="text-[9px] text-zinc-600 font-bold mb-px">روز</span>
            </div>
        </div>
        
        {/* 2. Cost */}
        <div className="relative bg-zinc-950 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-[4.5rem] overflow-hidden group hover:bg-zinc-900 transition-colors shadow-lg">
             <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="flex justify-between items-start relative z-10">
                <span className="text-[9px] font-bold text-zinc-500">هزینه</span>
                <Wallet className="w-3.5 h-3.5 text-emerald-500 opacity-80" />
            </div>

            <div className="relative z-10 flex items-end gap-1">
                <span className="text-lg font-black text-white leading-none">۲۸۰</span>
                <span className="text-[9px] text-zinc-600 font-bold mb-px">تومن</span>
            </div>
        </div>

         {/* 3. Weight */}
         <div className="relative bg-zinc-950 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-[4.5rem] overflow-hidden group hover:bg-zinc-900 transition-colors shadow-lg">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-2xl -mr-8 -mt-8 transition-opacity opacity-50 group-hover:opacity-100" />

            <div className="flex justify-between items-start relative z-10">
                <span className="text-[9px] font-bold text-zinc-500">وزن</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-500 opacity-80" />
            </div>

            <div className="relative z-10 flex items-end gap-1">
                <span className="text-lg font-black text-white leading-none">۷۵.۵</span>
                <span className="text-[9px] text-zinc-600 font-bold mb-px">kg</span>
            </div>
        </div>
    </div>
  );
};
