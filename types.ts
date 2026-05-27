
export type SubscriptionTier = 'starter' | 'pro' | 'vip';
export type Gender = 'male' | 'female';
export type WeekDay = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

// Phase 1: Deep Data Structures
export interface BodyMeasurements {
  neck: number; // cm
  waist: number; // cm
  hips?: number; // cm (Required for females)
  wrist?: number; // cm (Optional for frame size)
}

export interface LifestyleData {
  sleepTime: string; // "23:00"
  wakeTime: string; // "07:00"
  jobActivity: 'sedentary' | 'light' | 'active' | 'very_active'; // Job nature
  workoutTimePreference: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface NutritionPreferences {
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  allergies: string[]; // e.g. ['nuts', 'dairy']
  dislikes: string[]; // e.g. ['eggplant']
  supplementsAllowed: boolean;
}

export interface UserStats {
  // Biometrics (Basic)
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  
  // Phase 1: Deep Metrics
  measurements: BodyMeasurements;
  lifestyle: LifestyleData;
  nutrition: NutritionPreferences;
  
  // Goals & Exp
  goal: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  
  // Logistics
  availability: WeekDay[]; // Days user can workout
  equipment: 'gym' | 'home';
  homeEquipment?: string[]; // e.g. ['dumbbells', 'bands'] if home
  injuries?: string; // specific injuries or 'none'
}

export interface DailyLog {
  date: string;
  sleepHours: number;
  mood: 'great' | 'good' | 'tired' | 'stressed';
  soreness: 'none' | 'low' | 'high';
  readinessScore: number; // 0-100
  shouldAdjustPlan?: boolean;
}

export interface User {
  id: string;
  name: string;
  tier: SubscriptionTier;
  stats: UserStats;
  isOnboarded: boolean;
  logs: Record<string, DailyLog>;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  muscleGroup: string;
  lastWeight?: number;
  rpe?: number;
  isSuperset?: boolean;
}

// Phase 2: Detailed Meal Structure
export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  title: string;
  timeSuggestions: string; // e.g., "08:00 AM"
  ingredients: string[]; // List of items
  macros: {
    p: number;
    c: number;
    f: number;
  };
  tags?: string[]; // e.g., ['High Protein', 'Quick']
}

export interface DayPlan {
  id: string; // Added for structural integrity
  date: string;
  dayName: string;
  isRestDay: boolean;
  focus: string;
  exercises: WorkoutExercise[];
  nutritionTip: string;
  // Phase 2: Full Meal Plan
  meals: Meal[]; 
  caloriesTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface WeeklyPlan {
  id: string;
  startDate: string;
  days: DayPlan[];
}

export interface Attachment {
  type: 'image';
  data: string; // Base64 string
  mimeType: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isAction?: boolean; // True if this message triggered a tool call
  attachments?: Attachment[]; // Phase 4: Vision Support
}

// --- AI AGENT TYPES ---
export interface AgentToolCall {
  name: string;
  args: any;
}

export interface AgentResponse {
  text: string;
  toolCalls?: AgentToolCall[];
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  WORKOUT = 'WORKOUT',
  NUTRITION = 'NUTRITION',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}
