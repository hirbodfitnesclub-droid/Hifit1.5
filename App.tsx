
import React from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Layout } from './components/Layout';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { Dashboard } from './features/dashboard/Dashboard';
import { WorkoutPlan } from './features/workout/WorkoutPlan';
import { NutritionPlan } from './features/nutrition/NutritionPlan';
import { AiCoach } from './features/coach/AiCoach';
import { AppView } from './types';
import { User, Settings, CreditCard } from 'lucide-react';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';

const MainApp = () => {
  const { user, currentView, setCurrentView } = useUser();

  if (!user?.isOnboarded) {
    return <OnboardingFlow />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.WORKOUT:
        return <WorkoutPlan />;
      case AppView.NUTRITION:
        return <NutritionPlan />;
      case AppView.CHAT:
        return <AiCoach />;
      case AppView.PROFILE:
        return (
          <div className="px-6">
             <div className="flex flex-col items-center mb-10 pt-4">
                 <div className="w-28 h-28 rounded-full bg-gradient-to-br from-zinc-800 to-black border-2 border-gold-500/50 flex items-center justify-center mb-6 shadow-2xl shadow-gold-500/10">
                    <User className="w-12 h-12 text-gold-500" />
                 </div>
                 <h2 className="text-3xl font-black text-white">{user.name}</h2>
                 <span className="text-sm text-zinc-500 mt-1 font-mono tracking-widest uppercase">ID: 8842-XF</span>
                 
                 <div className="mt-6 flex gap-3">
                    <span className="px-4 py-2 bg-gold-500 text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-neon-gold">
                        {user.tier} Plan
                    </span>
                    <button className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-zinc-400" />
                    </button>
                 </div>
             </div>
             
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card variant="solid" className="p-5 text-center">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-2">وزن فعلی</p>
                        <p className="text-2xl font-black text-white">{user.stats.weight} <span className="text-sm text-zinc-600">kg</span></p>
                    </Card>
                    <Card variant="solid" className="p-5 text-center">
                        <p className="text-zinc-500 text-xs font-bold uppercase mb-2">قد</p>
                        <p className="text-2xl font-black text-white">{user.stats.height} <span className="text-sm text-zinc-600">cm</span></p>
                    </Card>
                </div>

                <Card variant="glass" className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">اشتراک شما</h3>
                        <CreditCard className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">وضعیت</span>
                            <span className="text-emerald-400 font-bold">فعال</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">تاریخ تمدید</span>
                            <span className="text-white">۱۴۰۳/۰۸/۱۲</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full text-xs h-10">مدیریت اشتراک</Button>
                </Card>
             </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

export default App;
