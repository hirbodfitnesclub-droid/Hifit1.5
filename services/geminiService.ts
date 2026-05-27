import { GoogleGenAI, FunctionDeclaration, Type, Schema } from "@google/genai";
import { Message, User, UserStats, WeeklyPlan, AgentResponse, DayPlan, Meal, DailyLog } from '../types';

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });
// Using Flash for speed/cost balance, specifically set to the recommended gemini-3.5-flash
const MODEL_ID = 'gemini-3.5-flash'; 

// --- SHARED PROMPTS ---
const BASE_SYSTEM_INSTRUCTION = `
You are **Hifit**, an elite AI Strength & Conditioning Coach for Gen Z Iranians.
**Persona:** Energetic, Bro-Coach, Scientific, Persian Slang ("رفیق", "بترکون").
**Language:** Fluent Modern Persian (Farsi).
**Philosophy:** Data-driven logic.
**CRITICAL RULE:** When asked for JSON, output ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
`;

// --- SCHEMAS ---

const WORKOUT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayName: { type: Type.STRING },
          isRestDay: { type: Type.BOOLEAN },
          focus: { type: Type.STRING },
          nutritionTip: { type: Type.STRING },
          caloriesTarget: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
            },
            required: ['protein', 'carbs', 'fats']
          },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.INTEGER },
                reps: { type: Type.STRING },
                muscleGroup: { type: Type.STRING },
                rpe: { type: Type.INTEGER },
                isSuperset: { type: Type.BOOLEAN },
              },
              required: ['name', 'sets', 'reps', 'muscleGroup']
            }
          }
        },
        required: ['dayName', 'isRestDay', 'focus', 'exercises', 'caloriesTarget', 'macros']
      }
    }
  },
  required: ['days']
};

const DAILY_MEAL_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        meals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'] },
                    title: { type: Type.STRING },
                    timeSuggestions: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    macros: {
                        type: Type.OBJECT,
                        properties: {
                            p: { type: Type.NUMBER },
                            c: { type: Type.NUMBER },
                            f: { type: Type.NUMBER },
                        },
                        required: ['p', 'c', 'f']
                    }
                },
                required: ['type', 'title', 'ingredients', 'macros']
            }
        }
    },
    required: ['meals']
};

const SINGLE_DAY_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        focus: { type: Type.STRING },
        nutritionTip: { type: Type.STRING },
        exercises: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sets: { type: Type.INTEGER },
              reps: { type: Type.STRING },
              muscleGroup: { type: Type.STRING },
              rpe: { type: Type.INTEGER },
              isSuperset: { type: Type.BOOLEAN },
            },
            required: ['name', 'sets', 'reps', 'muscleGroup']
          }
        }
    },
    required: ['focus', 'exercises', 'nutritionTip']
};

// --- UTILITIES ---

/**
 * Robust JSON parser that handles Markdown code blocks and common JSON errors.
 */
function cleanAndParseJSON<T>(text: string | undefined, fallback: T): T {
    if (!text) return fallback;

    let cleanText = text.trim();

    // 1. Strip Markdown Code Blocks
    if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "");
    } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```/, "").replace(/```$/, "");
    }

    try {
        return JSON.parse(cleanText) as T;
    } catch (error) {
        console.error("JSON Parsing Failed. Raw Text:", text.substring(0, 100) + "...");
        // Fallback strategy could be enhanced here (e.g., trying to repair JSON), 
        // but returning a safe fallback prevents app crash.
        return fallback;
    }
}

// --- SANITIZER ---
function sanitizeGeneratedPlan(plan: any): WeeklyPlan {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sun=0 ... Sat=6
    // Adjust to make Saturday index 0
    const diff = (dayOfWeek + 1) % 7; 
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - diff);
    weekStart.setHours(0,0,0,0);

    const safePlan: WeeklyPlan = {
        id: plan?.id || `plan-${Date.now()}`,
        startDate: weekStart.toISOString(),
        days: []
    };

    const rawDays = Array.isArray(plan?.days) ? plan.days : [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const isoDate = d.toISOString();
        const dayName = d.toLocaleDateString('fa-IR', { weekday: 'long' });

        const day = rawDays[i] || {};

        safePlan.days.push({
            id: crypto.randomUUID(),
            date: isoDate,
            dayName: dayName,
            isRestDay: !!day?.isRestDay,
            focus: day?.focus || (day?.isRestDay ? 'استراحت و ریکاوری' : 'تمرین عمومی'),
            nutritionTip: day?.nutritionTip || 'آب کافی بنوشید.',
            caloriesTarget: Number(day?.caloriesTarget) || 2000,
            macros: {
                protein: Number(day?.macros?.protein) || 150,
                carbs: Number(day?.macros?.carbs) || 200,
                fats: Number(day?.macros?.fats) || 60,
            },
            exercises: Array.isArray(day?.exercises) ? day.exercises.map((ex: any) => ({
                id: crypto.randomUUID(),
                name: ex.name || 'حرکت نامشخص',
                sets: Number(ex.sets) || 3,
                reps: ex.reps || '12',
                muscleGroup: ex.muscleGroup || 'General',
                rpe: Number(ex.rpe) || 7,
                isSuperset: !!ex.isSuperset,
            })) : [],
            meals: Array.isArray(day?.meals) ? day.meals.map((m: any) => ({
                id: crypto.randomUUID(),
                type: m.type || 'snack',
                title: m.title || 'وعده سالم',
                timeSuggestions: m.timeSuggestions || '12:00',
                ingredients: Array.isArray(m.ingredients) ? m.ingredients : ['مواد سالم'],
                tags: [],
                macros: {
                    p: Number(m.macros?.p) || 10,
                    c: Number(m.macros?.c) || 20,
                    f: Number(m.macros?.f) || 5
                }
            })) : []
        });
    }

    return safePlan;
}

// --- ORCHESTRATOR ---

export const generateInitialPlan = async (
    userStats: UserStats, 
    userName: string,
    onStatusUpdate: (stage: string) => void
): Promise<WeeklyPlan | null> => {
  if (!apiKey) {
    console.warn("API Key missing. Generating a premium offline fallback plan...");
    // Provide a beautiful transitions simulation for premium UX
    onStatusUpdate('WORKOUT');
    await new Promise(resolve => setTimeout(resolve, 600));
    onStatusUpdate('NUTRITION');
    await new Promise(resolve => setTimeout(resolve, 600));
    onStatusUpdate('FINALIZING');
    await new Promise(resolve => setTimeout(resolve, 400));
    return sanitizeGeneratedPlan({});
  }

  try {
    // Phase 1: Workout
    onStatusUpdate('WORKOUT');
    const workoutPlanRaw = await _generateWorkoutPhase(userStats, userName);
    // Even if workout gen fails partially, we get a sanitized structure.
    // If it fails completely, we create a dummy structure to pass to nutrition.
    const basePlan = workoutPlanRaw || { days: Array(7).fill({ isRestDay: false, focus: 'General Fitness', caloriesTarget: 2000, macros: {protein: 150, carbs: 150, fats: 60}, exercises: [] }) };

    // Phase 2: Nutrition (Atomic Daily Generation)
    onStatusUpdate('NUTRITION');
    const nutritionData = await _generateNutritionAtomic(userStats, basePlan);
    
    // Phase 3: Merge & Sanitize
    onStatusUpdate('FINALIZING');
    const finalPlanRaw = _mergePlans(basePlan, nutritionData);
    
    const validatedPlan = sanitizeGeneratedPlan(finalPlanRaw);
    return validatedPlan;

  } catch (error) {
    console.error("Plan Orchestration Failed:", error);
    // Return a basic fallback plan to prevent app crash
    return sanitizeGeneratedPlan({});
  }
};


// --- INTERNAL GENERATORS ---

async function _generateWorkoutPhase(userStats: UserStats, userName: string): Promise<any> {
    const prompt = `
      ${BASE_SYSTEM_INSTRUCTION}
      **TASK: GENERATE WORKOUT SPLIT (JSON ONLY)**
      
      User: ${userName}, ${userStats.gender}, ${userStats.experience} level.
      Goal: ${userStats.goal}.
      Equipment: ${userStats.equipment}.
      Injuries: ${userStats.injuries}.
      Available Days: ${userStats.availability.join(', ')}.

      **INSTRUCTIONS:**
      1. Create a 7-day plan (Saturday to Friday).
      2. If a day is NOT in Available Days, set "isRestDay": true and empty exercises.
      3. Target Calories: Based on goal (${userStats.goal}).
      4. Output strictly valid JSON matching the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: WORKOUT_SCHEMA,
                // Removed thinkingConfig to save tokens and prevent timeout on strict JSON tasks
                maxOutputTokens: 8000, 
            }
        });
        
        return cleanAndParseJSON(response.text, null);

    } catch (e) {
        console.error("Workout Gen Failed", e);
        return null;
    }
}

async function _generateNutritionAtomic(userStats: UserStats, workoutPlan: any): Promise<{ days: { meals: Meal[] }[] } | null> {
    
    // Fallback Meal Plan if AI fails
    const getFallbackMeals = (dayType: string): Meal[] => [
        { id: '1', type: 'breakfast', title: 'صبحانه پروتئینی (پیش‌فرض)', timeSuggestions: '08:00', ingredients: ['تخم مرغ', 'نان جو', 'چای'], macros: {p: 20, c: 30, f: 10} },
        { id: '2', type: 'lunch', title: 'ناهار سالم (پیش‌فرض)', timeSuggestions: '13:00', ingredients: ['سینه مرغ', 'برنج', 'سالاد'], macros: {p: 30, c: 40, f: 10} },
        { id: '3', type: 'dinner', title: 'شام سبک (پیش‌فرض)', timeSuggestions: '21:00', ingredients: ['ماهی', 'سبزیجات'], macros: {p: 25, c: 10, f: 10} }
    ] as Meal[];

    const generateSingleDay = async (dayIndex: number, dayData: any, retryCount = 0): Promise<{ meals: Meal[] }> => {
        const context = `Day ${dayIndex + 1}: ${dayData.isRestDay ? 'Rest' : 'Training'} (${dayData.caloriesTarget || 2000} kcal). Focus: ${dayData.focus}`;

        const prompt = `
          ${BASE_SYSTEM_INSTRUCTION}
          **TASK: GENERATE 1-DAY MEAL PLAN (JSON)**
          
          Context: ${context}
          Diet: ${userStats.nutrition.dietType}.
          Allergies: ${userStats.nutrition.allergies.join(', ') || 'None'}.

          **REQUIREMENTS:**
          - 3 Main Meals + 1 Snack.
          - Persian Cuisine compatible.
          - STRICT JSON output. No text.
        `;

        try {
            const response = await ai.models.generateContent({
                model: MODEL_ID,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: DAILY_MEAL_SCHEMA,
                    maxOutputTokens: 4000, // Increased limit
                }
            });
            
            const result = cleanAndParseJSON(response.text, { meals: [] });
            if (result.meals.length === 0) throw new Error("Empty meals");
            return result;

        } catch (e) {
            console.error(`Day ${dayIndex} failed (Attempt ${retryCount + 1})`, e);
            if (retryCount < 1) {
                // Retry once
                return generateSingleDay(dayIndex, dayData, retryCount + 1);
            }
            // Return Fallback
            return { meals: getFallbackMeals(dayData.isRestDay ? 'rest' : 'train') };
        }
    };

    const allDaysData = workoutPlan?.days || Array(7).fill({});
    const results: { meals: Meal[] }[] = new Array(7);

    // Process safely in parallel chunks
    const processChunk = async (indices: number[]) => {
        const promises = indices.map(i => {
            if (i >= allDaysData.length) return Promise.resolve({ meals: getFallbackMeals('rest') });
            return generateSingleDay(i, allDaysData[i]);
        });
        const chunkResults = await Promise.all(promises);
        chunkResults.forEach((res, idx) => {
            results[indices[idx]] = res;
        });
    };

    // Sequential chunks to avoid rate limits
    await processChunk([0, 1]);
    await processChunk([2, 3]);
    await processChunk([4, 5, 6]);

    return { days: results };
}

function _mergePlans(workout: any, nutrition: { days: { meals: Meal[] }[] } | null): any {
    const days = workout?.days || [];
    const mergedDays = days.map((day: any, index: number) => {
        return {
            ...day,
            meals: nutrition?.days?.[index]?.meals || []
        };
    });

    return {
        ...workout,
        days: mergedDays
    };
}

// --- ADAPTATION LOGIC ---

export const adjustDailyWorkout = async (
    userStats: UserStats,
    dailyLog: DailyLog,
    currentPlan: DayPlan
): Promise<DayPlan | null> => {
    if (!apiKey) return null;

    const prompt = `
        ${BASE_SYSTEM_INSTRUCTION}
        **TASK: ADJUST WORKOUT (JSON)**
        
        Log: Sleep ${dailyLog.sleepHours}h, Mood ${dailyLog.mood}, Score ${dailyLog.readinessScore}.
        Original Focus: ${currentPlan.focus}.
        
        Logic:
        - If Score < 50: Reduce Sets by 30%, RPE -2.
        - If Score > 80: Increase Intensity.
        
        Output valid JSON matching schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: SINGLE_DAY_SCHEMA,
                maxOutputTokens: 4000,
            }
        });

        const newDayData = cleanAndParseJSON<any>(response.text, {});
        
        return {
            ...currentPlan,
            focus: newDayData.focus || currentPlan.focus,
            nutritionTip: newDayData.nutritionTip || currentPlan.nutritionTip,
            exercises: newDayData.exercises || currentPlan.exercises,
        };
    } catch (e) {
        console.error("Adaptation Failed", e);
        return null;
    }
}


// --- AGENT CHAT ---

const updateWorkoutTool: FunctionDeclaration = {
    name: 'update_daily_workout',
    description: 'Modifies the workout exercises for a specific day.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        dayIndex: { type: Type.INTEGER },
        newFocus: { type: Type.STRING },
        reason: { type: Type.STRING },
        exercises: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sets: { type: Type.INTEGER },
              reps: { type: Type.STRING },
              muscleGroup: { type: Type.STRING },
              rpe: { type: Type.INTEGER },
              isSuperset: { type: Type.BOOLEAN }
            },
            required: ['name', 'sets', 'reps', 'muscleGroup']
          }
        }
      },
      required: ['dayIndex', 'newFocus', 'exercises', 'reason']
    }
  };
  
const replaceMealTool: FunctionDeclaration = {
    name: 'replace_meal_plan',
    description: 'Replaces a specific meal in the plan.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        dayIndex: { type: Type.INTEGER },
        mealType: { type: Type.STRING },
        newMealTitle: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        macros: { 
            type: Type.OBJECT, 
            properties: { p: { type: Type.INTEGER }, c: { type: Type.INTEGER }, f: { type: Type.INTEGER } },
            required: ['p', 'c', 'f']
        }
      },
      required: ['dayIndex', 'mealType', 'newMealTitle', 'ingredients', 'macros']
    }
  };
  
const ALL_TOOLS = [updateWorkoutTool, replaceMealTool];

export const generateAgentResponse = async (
  history: Message[],
  userContext: User,
  lastMessage: string,
  currentDayIndex: number,
  todayPlan: DayPlan
): Promise<AgentResponse> => {
    if (!apiKey) return { text: "خطای ارتباط با سرور." };

    const lastUserMsg = history[history.length - 1];
    const hasImages = lastUserMsg?.role === 'user' && lastUserMsg.attachments && lastUserMsg.attachments.length > 0;

    const parts: any[] = [];
    
    if (hasImages) {
        lastUserMsg.attachments!.forEach(att => {
            parts.push({
                inlineData: {
                    mimeType: att.mimeType,
                    data: att.data
                }
            });
        });
    }

    const systemPrompt = `
      ${BASE_SYSTEM_INSTRUCTION}
      **CONTEXT:**
      User: ${userContext.name}
      Plan: ${todayPlan?.focus || 'General'}
      Request: ${lastMessage}
    `;
    parts.push({ text: systemPrompt });

    try {
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: { parts: parts },
            config: { tools: [{ functionDeclarations: ALL_TOOLS }] }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (!part) return { text: "متوجه نشدم." };
        
        const toolCalls = response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall).map(p => ({
            name: p.functionCall!.name,
            args: p.functionCall!.args
        }));

        return {
            text: part.text || "انجام شد.",
            toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined
        };
    } catch (e) {
        console.error("Agent Error", e);
        return { text: "خطا در پردازش هوش مصنوعی." };
    }
};