# tasks.md — Hifit 1.5 Pivot Roadmap (Persian → Global English / RTL → LTR)

> این تسک‌ها **متوالی** اجرا می‌شوند. تسک‌هایی که روی فایل‌های مشترک می‌نویسند هرگز موازی نمی‌شوند. کدنویس هر تسک را تا تأیید Validation تمام می‌کند، سپس به تسک بعدی می‌رود.
>
> **قانون طلایی برای هر تسک:** پس از اعمال تغییر، در فایل‌های لمس‌شده هیچ کاراکتر `[\u0600-\u06FF]` (فارسی/عربی) باقی نماند؛ مگر اینکه تسک صراحتاً اجازه داده باشد.
>
> **ترتیب اجرا:** 01 → 02 → 03 → 04 → **05A → 05B** → 06 → 07 → 08 → **09A → 09B** → 10 → 11.

---

## TASK 01 — Bootstrap LTR/English Shell
**هدف:** تغییر پوسته HTML، فونت، Tailwind config inline و metadata پروژه از فارسی/RTL به انگلیسی/LTR.

**راهنمای پیاده‌سازی:**
1. در `index.html`:
   - `<html lang="fa" dir="rtl">` ⇒ `<html lang="en">` (بدون attribute `dir`).
   - حذف `<link>` فونت Vazirmatn از Google Fonts.
   - افزودن `<link>` فونت **Inter** (weights: `400;500;600;700;800;900`) از `https://fonts.googleapis.com`.
   - در inline `tailwind.config`: `fontFamily.sans: ['Vazirmatn', 'sans-serif']` ⇒ `['Inter', 'sans-serif']`.
   - در `<style>` body: `font-family: 'Vazirmatn', sans-serif;` ⇒ `'Inter', sans-serif;`.
   - `<title>` را به `Hifit | Your AI Strength Coach` تغییر بده. اگر meta description فارسی هست، انگلیسی کن.
2. `metadata.json`: تمام فیلدهای متنی به انگلیسی.
3. `package.json`: `name` به `"hifit"` (یا `"hifit-app"`) تغییر کند. سایر فیلدها دست نخورد.

**محدودیت‌ها:**
- **نباید** کتابخانه فونت جدیدی به `dependencies` اضافه شود (Inter از CDN در `index.html` بارگذاری می‌شود).
- **نباید** ساختار Tailwind config inline (colors, boxShadow, ...) تغییر کند؛ فقط `fontFamily.sans`.
- **نباید** هیچ JSX/Component تغییر داده شود در این تسک.

**Validation:**
- `grep -E '[\u0600-\u06FF]|Vazirmatn|fa-IR|dir="rtl"' index.html metadata.json package.json` ⇒ صفر match.

`CONTEXT_FILES: ["index.html", "metadata.json", "package.json"]`

---

## TASK 02 — Purge Constants + Establish String Convention
**هدف:** پاکسازی `constants.ts` از رشته‌های فارسی و تعیین convention که از این پس رشته‌های UI **inline در همان کامپوننت** نوشته می‌شوند (No i18n, No central STRINGS dictionary).

**راهنمای پیاده‌سازی:**
1. در `constants.ts`:
   - object `STRINGS` به‌طور **کامل حذف** شود.
   - `APP_NAME = "Hifit"` ⇒ بدون تغییر.
   - `MOCK_INITIAL_PLAN` از قبل انگلیسی است ⇒ بدون تغییر.
2. اگر فایلی `STRINGS` را import کرده، آن import حذف نمی‌شود در این تسک — جای آن در تسک‌های UI بعدی هنگام بازنویسی کامپوننت رفع می‌شود. (در این تسک با `Grep` فقط لیست مصرف‌کنندگان شناسایی شود تا گزارش شود، اما تغییر داده نشود.)

**محدودیت‌ها:**
- **نباید** فایل جدیدی برای dictionary انگلیسی ساخته شود (مثل `i18n/en.ts`).
- **نباید** هیچ کتابخانه‌ای نصب شود.

**Validation:**
- `constants.ts` فقط شامل `APP_NAME` و `MOCK_INITIAL_PLAN` باشد، صفر کاراکتر فارسی.

`CONTEXT_FILES: ["constants.ts"]`

---

## TASK 03 — Rewrite Gemini System Prompts & Sanitizer Fallbacks (English-only AI)
**هدف:** بازنویسی کامل تمام Promptها، Persona و Fallbackهای متنی در `services/geminiService.ts` تا خروجی AI تماماً انگلیسی حرفه‌ای باشد.

**راهنمای پیاده‌سازی:**
1. `BASE_SYSTEM_INSTRUCTION` بازنویسی شود به این روح:
   ```
   You are Hifit, an elite AI Strength & Conditioning Coach for a global English-speaking audience.
   Persona: motivating, scientific, friendly-direct (think modern personal trainer—NOT cheesy).
   Language: Professional, natural Modern English (en-US). EVERY value you output MUST be in English.
   Philosophy: Evidence-based programming, progressive overload, recovery-aware.
   CRITICAL RULES:
   1) ALL strings (exercise names, focus, nutrition tips, muscle groups, meal titles, ingredients, chat replies, day names, time suggestions, reps notation) MUST be in English. Never use Persian/Farsi/Arabic characters or transliteration.
   2) Use standard exercise nomenclature (e.g., "Bench Press", "Back Squat", "Romanian Deadlift", "Overhead Press", "Bent-Over Row", "Lat Pulldown").
   3) When asked for JSON, output ONLY valid JSON—no markdown fences, no commentary.
   ```
2. در سه prompt محلی (`_generateWorkoutPhase`, `_generateNutritionAtomic`, `adjustDailyWorkout`, `generateAgentResponse`): هر دستور "MUST BE IN PERSIAN" را به "MUST BE IN ENGLISH" برگردان و مثال‌های فارسی (مثل `"پرس سینه"`) را با معادل انگلیسی استاندارد جایگزین کن. به‌خصوص در `_generateNutritionAtomic` راهنمایی "Persian Cuisine compatible" را به **"Internationally familiar, balanced cuisine (lean proteins, whole grains, vegetables, healthy fats)"** تغییر بده.
3. **[بحرانی — هم‌راستاسازی هفته با Mon-first]** در `_generateWorkoutPhase`، خط `"1. Create a 7-day plan (Saturday to Friday)."` را به `"1. Create a 7-day plan (Monday to Sunday)."` تغییر بده. اگر فقط sanitizer Mon-first شود ولی این prompt همچنان Sat-first بخواهد، AI روزها را با ترتیب اشتباه تولید می‌کند و UI کاربر روز اشتباه تمرین می‌بیند.
4. در `sanitizeGeneratedPlan`:
   - `dayName: today.toLocaleDateString('fa-IR', { weekday: 'long' })` ⇒ `toLocaleDateString('en-US', { weekday: 'long' })`.
   - تغییر شروع هفته از Saturday-first به **Monday-first**: فرمول `const diff = (dayOfWeek + 6) % 7;` (Mon=0).
   - کامنت `// Adjust to make Saturday index 0` ⇒ `// Adjust to make Monday index 0`.
   - Fallbackها: `'استراحت و ریکاوری'` ⇒ `'Rest & Recovery'`، `'تمرین عمومی'` ⇒ `'General Training'`، `'آب کافی بنوشید.'` ⇒ `'Stay well hydrated.'`، `'حرکت نامشخص'` ⇒ `'Unnamed Exercise'`، `'مواد سالم'` ⇒ `'Healthy ingredients'`، `'وعده سالم'` ⇒ `'Healthy meal'`.
5. در `getFallbackMeals`: تمام titleها و ingredients به انگلیسی (مثلاً `'Protein Breakfast (Default)'`, `['Eggs', 'Whole-grain toast', 'Tea']`).
6. در `generateAgentResponse`: `"خطای ارتباط با سرور."` ⇒ `"Connection error. Please try again."`، `"متوجه نشدم."` ⇒ `"Sorry, I didn't catch that."`.

**محدودیت‌ها:**
- **نباید** مدل (`gemini-3.5-flash`) یا Schemaها (`WORKOUT_SCHEMA`, `DAILY_MEAL_SCHEMA`, `SINGLE_DAY_SCHEMA`, ToolDeclarationها) تغییر کنند.
- **نباید** اسامی function/export ها عوض شود (سازگاری با مصرف‌کنندگان).
- **نباید** thinkingConfig یا maxOutputTokens تغییر کند.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' services/geminiService.ts` ⇒ صفر match.
- `grep -n 'Saturday to Friday' services/geminiService.ts` ⇒ صفر match.
- `grep -n 'Monday to Sunday' services/geminiService.ts` ⇒ حداقل ۱ match.
- یک onboarding تستی end-to-end ⇒ خروجی JSON برنامه کاملاً انگلیسی است و روز اول `Monday` است.

`CONTEXT_FILES: ["services/geminiService.ts", "types.ts"]`

---

## TASK 04 — UserContext: ISO Date Keys + Monday-First Index
**هدف:** هم‌راستا کردن `UserContext.tsx` با Locale انگلیسی/ISO.

**راهنمای پیاده‌سازی:**
1. `getTodayIndex()`: فرمول از `(d.getDay() + 1) % 7` (Sat=0) ⇒ `(d.getDay() + 6) % 7` (Mon=0).
2. `getTodayLog()` و `submitDailyLog()`: کلید تاریخ از `new Date().toLocaleDateString('fa-IR')` ⇒ **`new Date().toLocaleDateString('en-CA')`** (خروجی `YYYY-MM-DD` در منطقه زمانی **محلی** کاربر).
   - **[حیاتی — Timezone Trap]** از `new Date().toISOString().slice(0, 10)` استفاده **نشود**. `toISOString()` همیشه UTC می‌دهد؛ کاربری که ساعت ۱ بامداد به وقت محلی خود log می‌زند، در UTC هنوز روز قبل است و log به اشتباه روی روز گذشته نوشته می‌شود. `en-CA` خروجی `YYYY-MM-DD` ولی **در timezone محلی** برمی‌گرداند که هم locale-agnostic است هم از این تله مصون.
3. کامنت‌ها/console.logهای فارسی (در صورت وجود) ⇒ انگلیسی.

**محدودیت‌ها:**
- **نباید** API/exportهای Context تغییر کنند.
- **نباید** ساختار `User`, `DailyLog` در `types.ts` تغییر کند.
- **نباید** منطق `dispatchAiAction`, `updateWeeklyPlan`, persistence logic تغییر کند (فقط رشته‌ها/تاریخ‌ها).

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' context/UserContext.tsx` ⇒ صفر match.
- `grep -n 'toISOString' context/UserContext.tsx` ⇒ صفر match (نباید برای کلید تاریخ روزانه استفاده شود).
- `grep -n "toLocaleDateString\\('en-CA'\\)" context/UserContext.tsx` ⇒ حداقل ۲ match (در `getTodayLog` و `submitDailyLog`).
- Onboarding ⇒ Dashboard ⇒ نمایش روز جاری روی index صحیح Mon-first.

`CONTEXT_FILES: ["context/UserContext.tsx", "types.ts", "services/geminiService.ts"]`

---

## TASK 05A — Onboarding Shell + Steps 1–5
**هدف:** تبدیل Orchestrator و نیمه اول Onboarding (Name → Goal → Biometrics → Measurements → Equipment) به انگلیسی LTR.

**راهنمای پیاده‌سازی:**
1. در `OnboardingFlow.tsx`: عنوان‌های مرحله، progress label، دکمه‌های Next/Back/Finish، loading stage labels (`WORKOUT`, `NUTRITION`, `FINALIZING`, `INIT`, `ADJUSTING`) ⇒ متن انگلیسی طبیعی (مثلاً `"Building your workout split..."`, `"Designing your nutrition..."`, `"Finalizing your plan..."`).
2. هر فایل Step از این پنج‌تا (`NameStep`, `GoalStep`, `BiometricsStep`, `MeasurementsStep`, `EquipmentStep`):
   - Question copy + helper text ⇒ انگلیسی.
   - Option labels (e.g., goalها: "Build muscle", "Lose fat", "Athletic performance", "General health"; experience: "Beginner / Intermediate / Advanced"; equipment: "Gym / Home").
   - Form labels: `Weight (kg)`, `Height (cm)`, `Age (years)`, `Neck (cm)`, `Waist (cm)`, `Hips (cm)`, `Wrist (cm)`.
   - Validation messages ⇒ انگلیسی.
3. کلاس‌های Tailwind مختص RTL در این پنج فایل + Orchestrator (`text-right`, `space-x-reverse`, `flex-row-reverse`, `mr-`/`ml-` که در منطق RTL "شروع" بود) — هر کدام را با چشم LTR بازبینی کن.

**محدودیت‌ها:**
- **نباید** ترتیب stepها یا data shape ارسالی به `completeOnboarding` تغییر کند.
- **نباید** سیستم Imperial اضافه شود.
- **نباید** فایل‌های step ۶ تا ۹ در این تسک لمس شوند (مال 05B).
- **نباید** فیلد جدیدی به `UserStats` اضافه شود.

**Validation:**
- `grep -E '[\u0600-\u06FF]' features/onboarding/OnboardingFlow.tsx features/onboarding/steps/NameStep.tsx features/onboarding/steps/GoalStep.tsx features/onboarding/steps/BiometricsStep.tsx features/onboarding/steps/MeasurementsStep.tsx features/onboarding/steps/EquipmentStep.tsx` ⇒ صفر.
- اجرای Onboarding تا انتهای EquipmentStep بدون شکستگی LTR.

`CONTEXT_FILES: ["features/onboarding/OnboardingFlow.tsx", "features/onboarding/steps/NameStep.tsx", "features/onboarding/steps/GoalStep.tsx", "features/onboarding/steps/BiometricsStep.tsx", "features/onboarding/steps/MeasurementsStep.tsx", "features/onboarding/steps/EquipmentStep.tsx", "context/UserContext.tsx", "types.ts", "components/ui/Button.tsx", "components/ui/Card.tsx"]`

---

## TASK 05B — Onboarding Steps 6–9 (Availability → Lifestyle → Nutrition → Health)
**هدف:** تبدیل نیمه دوم Onboarding با تأکید بر بازچینی روزهای هفته به Mon-first.

**راهنمای پیاده‌سازی:**
1. هر فایل Step از این چهارتا (`AvailabilityStep`, `LifestyleStep`, `NutritionStep`, `HealthStep`):
   - Question copy + helper text + option labels + validation ⇒ انگلیسی.
   - `dietType`: "Omnivore / Vegetarian / Vegan / Keto / Paleo".
   - `mood` / `jobActivity`: option labels انگلیسی.
2. **[بحرانی — Mon-first]** در `AvailabilityStep`:
   - آرایه `DAYS` باید **بازچینی شود** تا اولین آبجکت `Monday` باشد، نه `Saturday`. ترتیب نهایی: `Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday`.
   - مقادیر `id` (که از `WeekDay` enum در `types.ts` می‌آیند) همان رشته‌های انگلیسی فعلی هستند ⇒ تغییر نمی‌کنند، فقط ترتیب آرایه و `label`ها (`'شنبه'` ⇒ `'Saturday'` و …) عوض می‌شوند.
3. کلاس‌های جهت‌دار LTR-اصلاح در همین چهار فایل.

**محدودیت‌ها:**
- **نباید** type `WeekDay` در `types.ts` تغییر کند.
- **نباید** فایل‌های step ۱ تا ۵ لمس شوند.
- **نباید** Orchestrator (`OnboardingFlow.tsx`) لمس شود (آن در 05A انجام شد).

**Validation:**
- `grep -E '[\u0600-\u06FF]' features/onboarding/steps/AvailabilityStep.tsx features/onboarding/steps/LifestyleStep.tsx features/onboarding/steps/NutritionStep.tsx features/onboarding/steps/HealthStep.tsx` ⇒ صفر.
- در رندر `AvailabilityStep`، اولین چیپ روز `Monday` باشد و آخرین `Sunday`.

`CONTEXT_FILES: ["features/onboarding/steps/AvailabilityStep.tsx", "features/onboarding/steps/LifestyleStep.tsx", "features/onboarding/steps/NutritionStep.tsx", "features/onboarding/steps/HealthStep.tsx", "types.ts", "components/ui/Button.tsx", "components/ui/Card.tsx"]`

---

## TASK 06 — Dashboard + Daily Check-in English/LTR
**هدف:** تبدیل Dashboard و modal Check-in به انگلیسی LTR.

**راهنمای پیاده‌سازی:**
1. `features/dashboard/Dashboard.tsx`:
   - Greeting (e.g., `سلام {name}` ⇒ `Hi, {name}` یا time-aware: `Good morning, {name}`).
   - Section titles: "Today's Focus", "Daily Check-in", "Quick Stats", "Today's Nutrition", "Upgrade to Pro", "Change Workout Context".
2. `DailyCheckInModal.tsx`:
   - عنوان: "How are you feeling today?".
   - Sleep slider label: "Hours of sleep last night".
   - Mood options: `'great' | 'good' | 'tired' | 'stressed'` ⇒ labels: "Great", "Good", "Tired", "Stressed".
   - Soreness: "None / Mild / High".
   - CTA: "Submit Check-in" / "Submit & Adapt Plan".
3. Sub-components (`QuickDataRow`, `ReadinessWidget`, `StatWidgets`, `WorkoutTicket`):
   - تمام لیبل‌های فارسی ⇒ انگلیسی (e.g., "Readiness Score", "Today's Workout", "Calories", "Protein", "Carbs", "Fats", "Weight", "Steps").
   - فرمت اعداد: `toLocaleString('fa-IR')` (در صورت وجود) ⇒ `toLocaleString('en-US')`.
   - تاریخ‌ها: هر `fa-IR` ⇒ `en-US`.
4. کلاس‌های جهت‌دار (`mr-`/`ml-`، `text-right`، `space-x-reverse`) با چشم LTR اصلاح شوند.

**محدودیت‌ها:**
- **نباید** ساختار widgetها یا motion variants تغییر کند.
- **نباید** widget جدیدی اضافه شود.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' features/dashboard/` ⇒ صفر.
- Dashboard render کامل بدون overflow / misalignment در mobile.

`CONTEXT_FILES: ["features/dashboard/Dashboard.tsx", "features/dashboard/DailyCheckInModal.tsx", "features/dashboard/components/QuickDataRow.tsx", "features/dashboard/components/ReadinessWidget.tsx", "features/dashboard/components/StatWidgets.tsx", "features/dashboard/components/WorkoutTicket.tsx", "context/UserContext.tsx", "types.ts", "components/ui/Card.tsx", "components/ui/Button.tsx"]`

---

## TASK 07 — Workout Plan & Sub-Components English/LTR
**هدف:** تبدیل صفحه Workout و اجزای آن.

**راهنمای پیاده‌سازی:**
1. `WorkoutPlan.tsx`: عنوان صفحه، tab labels.
2. `DateStrip.tsx`: تولید روزها با `toLocaleDateString('en-US', { weekday: 'short' })` (Mon, Tue, ...). ترتیب از Mon-first.
3. `ExerciseCard.tsx`: لیبل‌های `Sets`, `Reps`, `RPE`, `Muscle`, `Last weight`, دکمه `Log set`، badge `Superset`.
4. `RestDayView.tsx`: تیتر "Rest Day"، توضیح ریکاوری انگلیسی.
5. `StartSessionBar.tsx`: "Start Session", "Resume", "Finish Workout".
6. `WorkoutContextFab.tsx`: tooltip و سؤال‌های context تغییر تمرین انگلیسی شود (e.g., "Quick context change").
7. `WorkoutHero.tsx`: تیتر هدف روز و خلاصه.
8. کلاس‌های جهت‌دار LTR-اصلاح.

**محدودیت‌ها:**
- **نباید** ساختار داده‌ای `DayPlan.exercises` تغییر کند.
- **نباید** logic تغییر یافته‌ای به‌جز رشته‌ها و locale بنویسی.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' features/workout/` ⇒ صفر.
- DateStrip روزها را Mon-Sun به انگلیسی نشان دهد.

`CONTEXT_FILES: ["features/workout/WorkoutPlan.tsx", "features/workout/components/DateStrip.tsx", "features/workout/components/ExerciseCard.tsx", "features/workout/components/RestDayView.tsx", "features/workout/components/StartSessionBar.tsx", "features/workout/components/WorkoutContextFab.tsx", "features/workout/components/WorkoutHero.tsx", "context/UserContext.tsx", "types.ts"]`

---

## TASK 08 — Nutrition Plan & Sub-Components English/LTR
**هدف:** تبدیل صفحه Nutrition.

**راهنمای پیاده‌سازی:**
1. `NutritionPlan.tsx`: عنوان، meal type headings (Breakfast / Lunch / Dinner / Snack / Pre-Workout / Post-Workout — همان enum انگلیسی، فقط display formatting).
2. `MealCard.tsx`: لیبل‌های Macros (`P / C / F`), `Calories`, time, ingredients heading "Ingredients", CTA "Replace meal" / "Mark as eaten".
3. `NutritionHero.tsx`: تیتر "Today's Nutrition" + KPI labels (Calories Target, Protein, Carbs, Fats).
4. `HydrationPod.tsx`: "Hydration", "{n} of {target} cups", "Add a cup".
5. کلاس‌های جهت‌دار LTR-اصلاح.

**محدودیت‌ها:**
- **نباید** enum `Meal['type']` تغییر کند.
- **نباید** ساختار macros (`p`, `c`, `f`) تغییر کند.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' features/nutrition/` ⇒ صفر.

`CONTEXT_FILES: ["features/nutrition/NutritionPlan.tsx", "features/nutrition/components/MealCard.tsx", "features/nutrition/components/NutritionHero.tsx", "features/nutrition/components/HydrationPod.tsx", "context/UserContext.tsx", "types.ts"]`

---

## TASK 09A — AI Coach: Chat UI Shell (English/LTR)
**هدف:** تبدیل لایه ارائه چت (Header, Input, Empty state, Bubble, List) به انگلیسی LTR.

**راهنمای پیاده‌سازی:**
1. `AiCoach.tsx`: header title "Coach"، subtitle، حالت‌های loading/error انگلیسی.
2. `components/chat/ChatHeader.tsx`: عنوان، avatar tooltip.
3. `components/chat/ChatInput.tsx`: placeholder `"Ask your coach anything..."`، send button aria-label.
4. `components/chat/ChatEmptyState.tsx`: copy ابتدایی انگلیسی + suggested prompts (e.g., "Make today lighter — I slept 5 hours", "Replace my lunch with something high-protein").
5. `components/chat/MessageBubble.tsx`:
   - timestamp formatter `'fa-IR'` ⇒ `'en-US'`.
   - **[نکته مهم — کلاس‌ها را عوض نکن]** منطق فعلی `isUser ? "flex-row-reverse" : "flex-row"` در حالت LTR **به‌طور طبیعی و درست** کاربر را سمت راست و coach را سمت چپ قرار می‌دهد (در RTL برعکس می‌شد، که قصد قبلی هم همین بود). پس کلاس‌های alignment **نباید تغییر کنند**؛ فقط در حین تست بصری مطمئن شو که آیکون‌ها، gap و avatar spacingها در LTR ظاهر تمیزی دارند و در صورت لزوم فقط فاصله‌های جهت‌دار (`mr-`/`ml-`) را تنظیم کن.
6. `components/chat/MessageList.tsx`: scroll behavior، separator labels.

**محدودیت‌ها:**
- **نباید** قرارداد Tool Calling یا shape `Message` تغییر کند.
- **نباید** vision/attachment logic تغییر کند.
- **نباید** `useAiCoachLogic.ts`, `utils/chatHelpers.ts`, `hooks/useChatScroll.ts` در این تسک لمس شوند (مال 09B).

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' features/coach/AiCoach.tsx components/chat/` ⇒ صفر.
- یک پیام تستی ⇒ bubble کاربر سمت راست، coach سمت چپ، timestamp انگلیسی.

`CONTEXT_FILES: ["features/coach/AiCoach.tsx", "components/chat/ChatHeader.tsx", "components/chat/ChatInput.tsx", "components/chat/ChatEmptyState.tsx", "components/chat/MessageBubble.tsx", "components/chat/MessageList.tsx", "types.ts"]`

---

## TASK 09B — AI Coach: Logic & Helpers (English copy)
**هدف:** تبدیل error/success copy و templateهای داخلی منطق چت.

**راهنمای پیاده‌سازی:**
1. `useAiCoachLogic.ts`: error toasts، system messages، success copy از tool calls (e.g., "Plan updated", "Meal replaced") انگلیسی.
2. `utils/chatHelpers.ts`: هر template/string فارسی ⇒ انگلیسی.
3. `hooks/useChatScroll.ts`: بازبینی شود؛ معمولاً خنثی است و نیاز به تغییر ندارد، اما اگر کامنت/log فارسی دارد، انگلیسی شود.

**محدودیت‌ها:**
- **نباید** signature و export های هیچ هوک/helper تغییر کند.
- **نباید** فایل‌های UI لایه ارائه (TASK 09A) لمس شوند.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' features/coach/useAiCoachLogic.ts utils/chatHelpers.ts hooks/useChatScroll.ts` ⇒ صفر.
- یک پیام تستی end-to-end ⇒ پاسخ کاملاً انگلیسی، toastها انگلیسی، tool call success message انگلیسی.

`CONTEXT_FILES: ["features/coach/useAiCoachLogic.ts", "utils/chatHelpers.ts", "hooks/useChatScroll.ts", "context/UserContext.tsx", "services/geminiService.ts", "types.ts"]`

---

## TASK 10 — Shell, Layout, Profile View, Shared UI
**هدف:** اتمام UI shell و حذف بقایای فارسی در App.tsx، Layout، components/ui.

**راهنمای پیاده‌سازی:**
1. `App.tsx` (Profile inline):
   - `وزن فعلی` ⇒ `Current Weight`، `قد` ⇒ `Height`، `اشتراک شما` ⇒ `Your Subscription`، `وضعیت` ⇒ `Status`، `فعال` ⇒ `Active`، `تاریخ تمدید` ⇒ `Renewal Date`، `۱۴۰۳/۰۸/۱۲` ⇒ یک تاریخ Gregorian معتبر (مثلاً `Aug 12, 2026` یا `2026-08-12`)، `مدیریت اشتراک` ⇒ `Manage Subscription`، badge `{tier} Plan` ⇒ `{tier.toUpperCase()} Plan`، `ID:` و کد ID ⇒ بدون تغییر.
   - بازبینی `mr-`/`ml-`، `text-right` در این بلاک — اصلاح به LTR.
2. `components/Layout.tsx`: tab labels (Dashboard / Workout / Nutrition / Coach / Profile)، چک کلاس bottom-nav برای LTR.
3. `components/ui/Button.tsx`, `components/ui/Card.tsx`, `components/ui/LoadingScreen.tsx`: هر copy فارسی (به‌خصوص LoadingScreen که احتمالاً پیام‌های stage دارد) ⇒ انگلیسی هماهنگ با labelهای TASK 05.

**محدودیت‌ها:**
- **نباید** API کامپوننت‌های ui/* تغییر کند.
- **نباید** TabBar order تغییر کند.

**Validation:**
- `grep -E '[\u0600-\u06FF]|fa-IR' App.tsx components/` ⇒ صفر.

`CONTEXT_FILES: ["App.tsx", "index.tsx", "components/Layout.tsx", "components/ui/Button.tsx", "components/ui/Card.tsx", "components/ui/LoadingScreen.tsx", "context/UserContext.tsx", "types.ts"]`

---

## TASK 11 — Final Cross-Cutting Sweep & Acceptance
**هدف:** تأیید نهایی Pivot. هیچ کاراکتر فارسی، هیچ ارجاع RTL/Vazirmatn/fa-IR در کل سورس باقی نمانده باشد.

**راهنمای پیاده‌سازی:**
1. اجرای regex جامع روی کل ریشه (به‌جز `Docs/`, `app_detail/`, `node_modules/`, `user_read_only_context/`):
   - `[\u0600-\u06FF]`
   - `Vazirmatn`
   - `fa-IR`
   - `dir="rtl"`
   - `space-x-reverse|divide-x-reverse|flex-row-reverse|rtl:`
2. هر match باقی‌مانده ⇒ تعمیر در همان فایل (string ⇒ English، direction class ⇒ LTR).
3. کامنت‌های فارسی در سورس (نه در `Docs/`) ⇒ ترجمه/حذف.
4. Smoke test دستی:
   - Onboarding کامل از NameStep تا اتمام تولید plan.
   - Dashboard ⇒ Daily Check-in ⇒ Submit & Adapt Plan ⇒ تأیید plan انگلیسی به‌روزرسانی شد.
   - Workout ⇒ Start Session ⇒ نمایش exerciseها به انگلیسی.
   - Nutrition ⇒ Replace Meal از طریق چت ⇒ تأیید.
   - Coach Chat ⇒ ارسال پیام، دریافت پاسخ کاملاً انگلیسی، bubble alignment صحیح در LTR.
5. تأیید کنسول مرورگر: هیچ خطا/warning مربوط به فونت یا direction.

**محدودیت‌ها:**
- **نباید** هیچ تغییر معنایی فراتر از زبان/جهت اعمال شود.
- **نباید** dependency جدید نصب شود.
- **نباید** فایل جدیدی ایجاد شود.

**Validation (Definition of Done):**
- چک‌لیست `PROJECT.md > §5` همه تیک خورده.
- صفر match در regexهای بالا.
- Dev server بدون خطا بالا می‌آید و هر ۵ View به‌درستی LTR/English رندر می‌شوند.

`CONTEXT_FILES: ["Docs/PROJECT.md", "Docs/ARCHITECTURE.md", "index.html", "App.tsx", "context/UserContext.tsx", "services/geminiService.ts", "constants.ts"]`
