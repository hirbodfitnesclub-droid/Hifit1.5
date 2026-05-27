
import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Play, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const StartSessionBar: React.FC = () => {
  return (
    <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-[calc(5rem+1.5rem)] left-0 right-0 px-6 z-50 flex justify-center pointer-events-none"
    >
        <div className="w-full max-w-[340px] pointer-events-auto">
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gold-500/30 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                
                <Button 
                    variant="primary" 
                    className="w-full h-14 rounded-full text-base font-black tracking-wide shadow-2xl flex items-center justify-between pl-2 pr-6 border-2 border-gold-400 hover:scale-[1.02] transition-transform"
                >
                    <span>شروع جلسه تمرین</span>
                    <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                        <Play className="w-5 h-5 fill-black" />
                    </div>
                </Button>
            </div>
        </div>
    </motion.div>
  );
};
