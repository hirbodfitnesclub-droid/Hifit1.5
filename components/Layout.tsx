import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { AppView } from '../types';
import { Home, MessageSquare, User as UserIcon, Dumbbell, Utensils } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const { user } = useUser();

  if (!user?.isOnboarded) {
    return <main className="w-full h-full bg-black">{children}</main>;
  }

  const navItems = [
    { id: AppView.DASHBOARD, icon: Home },
    { id: AppView.WORKOUT, icon: Dumbbell },
    { id: AppView.NUTRITION, icon: Utensils },
    { id: AppView.CHAT, icon: MessageSquare },
    { id: AppView.PROFILE, icon: UserIcon },
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900 via-black to-black z-0 pointer-events-none" />
      
      {/* Main Content - Removed padding top since header is gone */}
      <main className={`flex-1 ${currentView === AppView.CHAT ? 'h-full overflow-hidden' : 'overflow-y-auto overflow-x-hidden pb-32'} relative z-10 scrollbar-hide`}>
        {children}
      </main>

      {/* Floating Dock Navigation */}
      <div className="absolute bottom-6 left-0 w-full px-6 z-40 flex justify-center">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-6 py-5 flex items-center justify-between gap-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] w-full max-w-[340px]">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className="relative group flex flex-col items-center justify-center w-8 h-8"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-gold-500/30 blur-xl rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'opacity-40 group-hover:opacity-100'}`}>
                  <item.icon 
                    className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-gold-400 fill-gold-400/10' : 'text-white'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                {isActive && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-3 w-1 h-1 bg-gold-500 rounded-full box-shadow-neon" 
                    />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};