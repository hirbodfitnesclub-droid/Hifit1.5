
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { Bell } from 'lucide-react';
import { DailyCheckInModal } from './DailyCheckInModal';
import { clsx } from 'clsx';

// Import New Widgets
import { ReadinessWidget } from './components/ReadinessWidget';
import { SleepWidget, CaloriesWidget } from './components/StatWidgets';
import { QuickDataRow } from './components/QuickDataRow';
import { WorkoutTicket } from './components/WorkoutTicket';

export const Dashboard: React.FC = () => {
  const { user, weeklyPlan, currentDayIndex, getTodayLog, submitDailyLog } = useUser();
  const todayLog = getTodayLog();
  const [showCheckIn, setShowCheckIn] = useState(false);

  // Trigger modal if no log exists for today
  useEffect(() => {
    if (!todayLog) {
      setShowCheckIn(true);
    }
  }, [todayLog]);

  if (!user || !weeklyPlan || !weeklyPlan.days || weeklyPlan.days.length === 0) return null;
  const todayPlan = weeklyPlan.days[currentDayIndex] || weeklyPlan.days[0];
  const displayScore = todayLog?.readinessScore || 0;

  return (
    <>
      <AnimatePresence>
        {showCheckIn && (
          <DailyCheckInModal onSubmit={async (data) => {
            // We wait for the async process (which might include AI adaptation)
            await submitDailyLog(data);
            setShowCheckIn(false);
          }} />
        )}
      </AnimatePresence>

      <div className={clsx("min-h-screen px-5 pt-6 pb-40 space-y-5 transition-all duration-700 bg-black", showCheckIn && "blur-xl scale-95 opacity-50 overflow-hidden h-screen")}>
        
        {/* --- 1. LUXURY HEADER --- */}
        <header className="flex justify-between items-center py-2 mb-2">
          <div className="flex items-center gap-3">
             <div className="relative">
                 <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-lg">
                     <span className="font-black text-xl text-zinc-500">{user.name[0]}</span>
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 </div>
             </div>
             <div>
                <h1 className="text-xl font-black text-white leading-none tracking-tight">{user.name}</h1>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                    {user.tier} MEMBER <span className="text-gold-500">///</span>
                </span>
             </div>
          </div>
          
          <button className="w-11 h-11 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative group hover:bg-zinc-800">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3.5 w-1.5 h-1.5 bg-red-500 rounded-full box-shadow-neon border border-black" />
          </button>
        </header>

        {/* --- 2. COMMAND CENTER GRID --- */}
        <div className="grid grid-cols-12 gap-3">
          
          {/* A. READINESS (Energy Core) */}
          <ReadinessWidget score={displayScore} />

          {/* B. SIDE STACK */}
          <div className="col-span-5 flex flex-col gap-3">
              <SleepWidget value={todayLog?.sleepHours || 0} max={12} />
              <CaloriesWidget value={todayPlan.caloriesTarget} max={3000} />
          </div>

          {/* C. QUICK DATA (Streak, Cost, Weight) */}
          <QuickDataRow />

          {/* D. WORKOUT BOARDING PASS */}
          {todayPlan && <WorkoutTicket plan={todayPlan} />}
          
        </div>
      </div>
    </>
  );
};
