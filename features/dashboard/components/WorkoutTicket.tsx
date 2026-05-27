
import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Timer, Play, ChevronLeft, Dumbbell, Zap } from 'lucide-react';
import { DayPlan } from '../../../types';

interface WorkoutTicketProps {
  plan: DayPlan;
}

export const WorkoutTicket: React.FC<WorkoutTicketProps> = ({ plan }) => {
  // Defensive check for date
  const dateId = plan?.date ? plan.date.split('T')[0].slice(5).replace('-', '') : '---';

  return (
    <div className="col-span-12 mt-2 dir-rtl">
        <div className="relative h-44 w-full rounded-[2rem] overflow-hidden group cursor-pointer border border-zinc-800 hover:border-gold-500/50 transition-all duration-500 shadow-2xl">
            
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-l from-zinc-950 via-zinc-900/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 backdrop-blur-[1px]" />

            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                
                {/* Top Row: Tag & Title */}
                <div className="flex justify-between items-start pl-2">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-gold-500 text-black text-[10px] font-black shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                                جلسه امروز
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold tracking-wide">
                                شناسه: {dateId}
                            </span>
                        </div>
                        {/* Removed max-w, increased line height, added line clamp just in case */}
                        <h2 className="text-2xl font-black text-white leading-snug mt-1 w-full drop-shadow-xl line-clamp-2">
                            {plan?.focus || 'تمرین امروز'}
                        </h2>
                    </div>
                </div>

                {/* Bottom Row: Stats & Action */}
                <div className="flex items-end justify-between">
                    
                    {/* Stats */}
                    <div className="flex gap-2 sm:gap-4 mb-1">
                         <div className="flex items-center gap-1.5 text-zinc-300 bg-black/50 px-2 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                            <Timer className="w-3.5 h-3.5 text-gold-500" />
                            <span className="text-xs font-bold">۴۵ دقیقه</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300 bg-black/50 px-2 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                            <Zap className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs font-bold">شدت بالا</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button className="h-10 px-4 rounded-xl bg-white text-black hover:bg-gold-500 transition-colors flex items-center gap-2 font-black shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] text-xs sm:text-sm">
                        <span>شروع</span>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};
