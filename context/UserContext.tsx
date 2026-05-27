
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WeeklyPlan, Message, DailyLog, AgentToolCall, DayPlan, AppView } from '../types';
import { generateInitialPlan, adjustDailyWorkout } from '../services/geminiService';

// --- UTILS ---
const safelyParseJSON = <T,>(key: string, fallback: T | null): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    // Clear corrupted data to prevent persistent crash
    localStorage.removeItem(key);
    return fallback;
  }
};

interface UserContextType {
  user: User | null;
  weeklyPlan: WeeklyPlan | null;
  currentDayIndex: number;
  loadingStage: string;
  currentView: AppView; // Moved to Context
  pendingChatInput: string; // For Deep linking actions to chat
  
  setCurrentView: (view: AppView) => void;
  setPendingChatInput: (text: string) => void;
  setCurrentDayIndex: (idx: number) => void;
  setUser: (user: User) => void;
  completeOnboarding: (data: any) => Promise<void>;
  messages: Message[];
  addMessage: (msg: Message) => void;
  submitDailyLog: (log: Omit<DailyLog, 'readinessScore' | 'date'>) => Promise<void>;
  getTodayLog: () => DailyLog | undefined;
  dispatchAiAction: (toolCall: AgentToolCall) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global State
  const [user, setUserState] = useState<User | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // UI State
  // Calculate default index based on Persian week (Sat=0)
  const getTodayIndex = () => {
    const d = new Date();
    // getDay() is Sun=0, Sat=6.
    // We want Sat=0, Sun=1...
    // (6+1)%7 = 0
    // (0+1)%7 = 1
    return (d.getDay() + 1) % 7;
  };

  const [currentDayIndex, setCurrentDayIndex] = useState(getTodayIndex());
  const [loadingStage, setLoadingStage] = useState<string>('IDLE');
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [pendingChatInput, setPendingChatInput] = useState<string>('');

  // --- PERSISTENCE & INIT ---
  useEffect(() => {
    // Safe load
    const savedUser = safelyParseJSON<User>('hifit_user', null);
    const savedPlan = safelyParseJSON<WeeklyPlan>('hifit_plan', null);
    
    if (savedUser) setUserState(savedUser);
    if (savedPlan) setWeeklyPlan(savedPlan);
  }, []);

  const setUser = (u: User) => {
    setUserState(u);
    localStorage.setItem('hifit_user', JSON.stringify(u));
  };

  const updateWeeklyPlan = (newPlan: WeeklyPlan) => {
      setWeeklyPlan(newPlan);
      localStorage.setItem('hifit_plan', JSON.stringify(newPlan));
  };

  const completeOnboarding = async (data: any) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      tier: 'starter',
      isOnboarded: true,
      logs: {},
      stats: {
        age: parseInt(data.age) || 25,
        gender: data.gender || 'male',
        weight: parseInt(data.weight) || 70,
        height: parseInt(data.height) || 175,
        measurements: data.measurements || { neck: 0, waist: 0 },
        lifestyle: data.lifestyle || { sleepTime: '23:00', wakeTime: '07:00', jobActivity: 'sedentary', workoutTimePreference: 'evening' },
        nutrition: data.nutrition || { dietType: 'omnivore', allergies: [], dislikes: [], supplementsAllowed: true },
        goal: data.goal,
        experience: data.experience,
        equipment: data.equipment,
        homeEquipment: data.homeEquipment || [],
        availability: data.availability || [],
        injuries: data.injuries || 'none'
      }
    };
    
    try {
        setLoadingStage('INIT');
        const aiPlan = await generateInitialPlan(newUser.stats, newUser.name, (stage) => {
            setLoadingStage(stage);
        });

        if (aiPlan) {
            updateWeeklyPlan(aiPlan);
        } else {
             // Fallback logic handled in generateInitialPlan or here if needed
        }
    } catch (e) {
        console.error("Critical Plan Gen Error", e);
    } finally {
        setLoadingStage('IDLE');
        setUser(newUser);
    }
  };

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);

  const getTodayLog = () => {
    if (!user) return undefined;
    const today = new Date().toLocaleDateString('fa-IR');
    return user.logs[today];
  };

  // Phase 4: Async Check-in with Adaptation
  const submitDailyLog = async (data: Omit<DailyLog, 'readinessScore' | 'date'>) => {
    if (!user || !weeklyPlan) return;
    const today = new Date().toLocaleDateString('fa-IR');
    
    // 1. Calculate Score
    let score = 70; 
    if(data.sleepHours > 7) score += 10;
    if(data.mood === 'great') score += 10;
    if(data.mood === 'stressed') score -= 10;
    const finalScore = Math.min(100, Math.max(0, score));
    
    // 2. Create Log Object
    const newLog: DailyLog = { 
        ...data, 
        date: today, 
        readinessScore: finalScore 
    };

    // 3. Save Log Locally
    const updatedUser = { ...user, logs: { ...user.logs, [today]: newLog } };
    setUser(updatedUser);

    // 4. Trigger AI Adaptation if requested
    if (data.shouldAdjustPlan) {
        setLoadingStage('ADJUSTING'); // New Stage
        try {
            const currentPlan = weeklyPlan.days[currentDayIndex];
            const adjustedDay = await adjustDailyWorkout(user.stats, newLog, currentPlan);
            
            if (adjustedDay) {
                const updatedDays = [...weeklyPlan.days];
                updatedDays[currentDayIndex] = adjustedDay;
                updateWeeklyPlan({ ...weeklyPlan, days: updatedDays });
                console.log("Plan Adjusted Successfully via Check-in");
            }
        } catch (error) {
            console.error("Adaptation Failed", error);
        } finally {
            setLoadingStage('IDLE');
        }
    }
  };

  // --- THE BRAIN: EXECUTE AI ACTIONS ---
  const dispatchAiAction = (toolCall: AgentToolCall): boolean => {
    if (!weeklyPlan) return false;

    console.log("Executing Tool:", toolCall.name, toolCall.args);

    try {
        if (toolCall.name === 'update_daily_workout') {
            const { dayIndex, newFocus, exercises } = toolCall.args;
            
            if (typeof dayIndex !== 'number' || dayIndex < 0 || dayIndex >= weeklyPlan.days.length) return false;
            if (!Array.isArray(exercises)) return false;

            const updatedDays = [...weeklyPlan.days];
            // Preserve other properties, only update workout data
            updatedDays[dayIndex] = {
                ...updatedDays[dayIndex],
                focus: newFocus || updatedDays[dayIndex].focus,
                exercises: exercises.map((ex: any) => ({
                    id: ex.id || crypto.randomUUID(),
                    name: ex.name,
                    sets: Number(ex.sets),
                    reps: String(ex.reps),
                    muscleGroup: ex.muscleGroup || 'General',
                    rpe: Number(ex.rpe) || 8,
                    isSuperset: !!ex.isSuperset,
                    lastWeight: ex.lastWeight
                }))
            };

            updateWeeklyPlan({ ...weeklyPlan, days: updatedDays });
            return true;
        }

        if (toolCall.name === 'replace_meal_plan') {
            const { dayIndex, mealType, newMealTitle, ingredients, macros } = toolCall.args;
            
            if (typeof dayIndex !== 'number' || dayIndex < 0 || dayIndex >= weeklyPlan.days.length) return false;

            const updatedDays = [...weeklyPlan.days];
            const targetDay = { ...updatedDays[dayIndex] };
            const updatedMeals = [...(targetDay.meals || [])];

            const mealIndex = updatedMeals.findIndex(m => m.type === mealType);
            
            const newMealData = {
                id: crypto.randomUUID(),
                type: mealType,
                title: newMealTitle,
                ingredients: ingredients || [],
                macros: macros || { p: 0, c: 0, f: 0 },
                timeSuggestions: mealIndex > -1 ? updatedMeals[mealIndex].timeSuggestions : '12:00',
                tags: ['AI Replaced']
            };

            if (mealIndex > -1) {
                updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], ...newMealData };
            } else {
                updatedMeals.push(newMealData);
            }

            targetDay.meals = updatedMeals;
            updatedDays[dayIndex] = targetDay;
            
            updateWeeklyPlan({ ...weeklyPlan, days: updatedDays });
            return true;
        }

        return false;
    } catch (e) {
        console.error("Tool Execution Failed:", e);
        return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, weeklyPlan, currentDayIndex, loadingStage, currentView, pendingChatInput,
      setCurrentView, setPendingChatInput, setCurrentDayIndex, 
      setUser, completeOnboarding, messages, addMessage, submitDailyLog, getTodayLog, dispatchAiAction
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
