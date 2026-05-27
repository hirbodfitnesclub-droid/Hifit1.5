
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

// Import Single-Task Steps
import { NameStep } from './steps/NameStep';
import { BiometricsStep } from './steps/BiometricsStep';
import { MeasurementsStep } from './steps/MeasurementsStep'; 
import { GoalStep } from './steps/GoalStep';
import { AvailabilityStep } from './steps/AvailabilityStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { LifestyleStep } from './steps/LifestyleStep'; 
import { NutritionStep } from './steps/NutritionStep'; 
import { HealthStep } from './steps/HealthStep';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, loadingStage } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  
  const totalSteps = 9;

  const handleStepData = (data: any) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    
    if (step < totalSteps) {
        setStep(step + 1);
    } else {
        finish(updated);
    }
  };

  const finish = async (finalData: any) => {
    await completeOnboarding(finalData);
  };

  // Show the luxury loading screen if loadingStage is active (not IDLE)
  if (loadingStage !== 'IDLE') {
      return <LoadingScreen stage={loadingStage} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-black text-white relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900 to-black z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Progress Bar */}
      <div className="relative z-10 w-full h-1 bg-zinc-900 rounded-full mt-4">
        <motion.div 
          className="h-full bg-gold-500 shadow-[0_0_10px_#EAB308]"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode='wait'>
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full max-w-md mx-auto"
            >
              {step === 1 && <NameStep onNext={handleStepData} />}
              {step === 2 && <BiometricsStep onNext={handleStepData} />}
              {step === 3 && <MeasurementsStep gender={formData.gender} onNext={handleStepData} />}
              {step === 4 && <GoalStep onNext={handleStepData} />}
              {step === 5 && <AvailabilityStep onNext={handleStepData} />}
              {step === 6 && <LifestyleStep onNext={handleStepData} />}
              {step === 7 && <NutritionStep onNext={handleStepData} />}
              {step === 8 && <EquipmentStep onNext={handleStepData} />}
              {step === 9 && <HealthStep onNext={handleStepData} />}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
