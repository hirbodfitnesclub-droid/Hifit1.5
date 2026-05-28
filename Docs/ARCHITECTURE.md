# ARCHITECTURE.md — Hifit 1.5

> پروژه از قبل موجود است. این سند **درخت کامل را بازترسیم نمی‌کند**؛ فقط منطق مسیردهی و نقاط دقیق دخالت برای Pivot انگلیسی/LTR را تعریف می‌کند.

---

## ۱. منطق مسیردهی (File Tree Logic — همان ساختار فعلی)
- `index.html` — Bootstrap، Tailwind config inline، فونت، `<html>` attributes.
- `index.tsx` / `App.tsx` — ریشه React، انتخاب View با `AppView`.
- `context/UserContext.tsx` — تنها منبع State سراسری (User, WeeklyPlan, Messages, Logs). Persistence با `localStorage` (keys: `hifit_user`, `hifit_plan`).
- `services/geminiService.ts` — تمام تماس‌ها با Gemini API. شامل System Prompts، Schemas، Sanitizers، Tool Declarations.
- `types.ts` — تمام مدل‌های دامنه (User, UserStats, DayPlan, Meal, Message, AppView).
- `constants.ts` — رشته‌های UI (در حال حاضر فارسی، باید بازنگری/حذف شود).
- `components/` — کامپوننت‌های اشتراکی (Layout, ui/*, chat/*).
- `features/<domain>/` — هر دامنه فیچر، صفحه + sub-componentهایش (`onboarding`, `dashboard`, `workout`, `nutrition`, `coach`).
- `hooks/` — هوک‌های اشتراکی.
- `utils/chatHelpers.ts` — کمک‌توابع چت.
- `Docs/` — این سه فایل معماری.

> **قانون:** هیچ فایل جدیدی برای این Pivot ساخته نمی‌شود مگر اینکه در tasks.md صراحتاً ذکر شود. هدف ریفکتور است، نه افزودن فیچر.

## ۲. اسکیمای دیتا (Data Schema — بدون تغییر ساختاری)
شکل `User`, `UserStats`, `DayPlan`, `Meal`, `Message` در `types.ts` **حفظ می‌شود**. تنها تغییرات:
- مقادیر متنی (e.g. `goal`, `focus`, `muscleGroup`, `meal.title`, `meal.ingredients`, `nutritionTip`, `dayName`) که کاربر/AI می‌بیند، باید در زمان تولید/ذخیره **انگلیسی** باشند.
- enum-ها (`'omnivore' | 'vegetarian' | ...`, `'breakfast' | 'lunch' | ...`, `'great' | 'good' | ...`) از قبل انگلیسی هستند ⇒ بدون تغییر.
- `WeekDay` enum (`Saturday`...`Friday`) از قبل انگلیسی است ⇒ حفظ شود، اما **اولویت نمایش هفته** از Sat-first به **Mon-first** تغییر می‌کند (استاندارد ISO/Global). این نیاز به به‌روزرسانی `getTodayIndex()` در `UserContext` و منطق مرتبط در `geminiService.sanitizeGeneratedPlan` دارد.

## ۳. جریان داده (Data Flow — بدون تغییر مسیر، فقط تغییر زبان)
```
[OnboardingFlow] --collect--> completeOnboarding(data)
        ↓
[UserContext.completeOnboarding] --build UserStats--> generateInitialPlan(stats, name)
        ↓
[geminiService] --(English System Prompt)--> Gemini API
        ↓ JSON (English values)
[sanitizeGeneratedPlan] --(English fallbacks)--> WeeklyPlan
        ↓ persist localStorage
[Dashboard / WorkoutPlan / NutritionPlan] --read--> WeeklyPlan.days[currentDayIndex]

[AiCoach] --user message--> generateAgentResponse(history, user, ...)
        ↓
[geminiService] --(English System Prompt + Tools)--> Gemini
        ↓ text + functionCall(s)
[useAiCoachLogic] --dispatch--> UserContext.dispatchAiAction(toolCall)
        ↓
[UserContext] mutates WeeklyPlan → re-render
[DailyCheckInModal] --submitDailyLog--> readinessScore + optional adjustDailyWorkout
        ↓
[geminiService.adjustDailyWorkout] → patched DayPlan
```
هیچ مرحله‌ای حذف یا اضافه نمی‌شود. تنها **محتوای متنی** عبوری از این لوله‌ها انگلیسی می‌شود.

## ۴. نقاط مداخله (Surgical Touch Points)
این لیست راهنمای کدنویس است — هر تسک در `tasks.md` به یک یا چند مورد از این‌ها لینک می‌شود.

### A. Bootstrap & Global Style
- **A1** `index.html`
  - `<html lang="fa" dir="rtl">` → `<html lang="en">` (بدون `dir`).
  - حذف `<link>` فونت Vazirmatn → افزودن `<link>` Inter از Google Fonts.
  - در `tailwind.config.script` بلاک `fontFamily.sans` از `'Vazirmatn'` به `'Inter'` تغییر کند.
  - `body { font-family: 'Vazirmatn', sans-serif; }` → `'Inter', sans-serif`.
  - `<title>` و meta اگر فارسی شدند، انگلیسی شوند.
- **A2** `metadata.json`
  - فیلدهای `name`, `description` در صورت داشتن متن فارسی، بازنویسی انگلیسی.
- **A3** `package.json`
  - `name: "شروع-اصلاح-ظاهر-hifit-1.331"` → `name: "hifit"` (یا slug انگلیسی معتبر).

### B. Strings & Constants
- **B1** `constants.ts`
  - object `STRINGS` یا حذف شود، یا تماماً انگلیسی شود (ترجیح معمار: حذف شود و رشته‌ها در همان کامپوننت inline شوند، تا تله‌ی i18n DIY ساخته نشود).
  - `MOCK_INITIAL_PLAN` از قبل انگلیسی است ⇒ حفظ.

### C. AI Service (هسته‌ی Pivot)
- **C1** `services/geminiService.ts`
  - `BASE_SYSTEM_INSTRUCTION` کاملاً بازنویسی: persona جدید (Elite International S&C Coach)، حذف Slang فارسی، الزام صریح به خروجی انگلیسی طبیعی و حرفه‌ای.
  - تمام نمونه‌های in-prompt که می‌گفتند "Persian/Farsi" یا exercise mappings فارسی ⇒ حذف و جایگزینی با معادل انگلیسی استاندارد.
  - **[حیاتی]** در `_generateWorkoutPhase` متن `"1. Create a 7-day plan (Saturday to Friday)."` ⇒ `"1. Create a 7-day plan (Monday to Sunday)."` تا با ترتیب Mon-first در sanitizer و UI هماهنگ باشد. اگر این تغییر داده نشود، AI روزها را Sat-first تولید می‌کند ولی UI آن‌ها را Mon-first رندر می‌کند ⇒ شیفت کامل برنامه.
  - کامنت داخلی sanitizer (`// Adjust to make Saturday index 0`) ⇒ `// Adjust to make Monday index 0`.
  - تمام Fallback ها (`getFallbackMeals`, sanitizer defaults: `'استراحت و ریکاوری'`, `'تمرین عمومی'`, `'آب کافی بنوشید.'`, `'حرکت نامشخص'`, `'مواد سالم'`, `'وعده سالم'`) ⇒ معادل انگلیسی.
  - error string `"خطای ارتباط با سرور."` و `"متوجه نشدم."` در `generateAgentResponse` ⇒ انگلیسی.
  - `dayName: today.toLocaleDateString('fa-IR', { weekday: 'long' })` ⇒ `'en-US'`.

### D. Global State
- **D1** `context/UserContext.tsx`
  - `getTodayIndex()`: محاسبه‌ی Saturday-first → **Monday-first** (ISO standard). فرمول جدید: `(d.getDay() + 6) % 7` (Mon=0).
  - `getTodayLog()` و `submitDailyLog()`: کلید تاریخ از `toLocaleDateString('fa-IR')` ⇒ **`toLocaleDateString('en-CA')`** (خروجی `YYYY-MM-DD` در **منطقه زمانی محلی کاربر**). مهم: از `toISOString().slice(0,10)` استفاده **نشود** چون UTC است و در ساعات بامداد کاربر، log روز اشتباه ثبت می‌شود (timezone bug). این تغییر سازگاری با logهای قبلی را می‌شکند، که در فاز pre-launch قابل قبول است.

### E. UI Layer (LTR + English)
هر کامپوننت زیر باید: (۱) رشته‌های فارسی hardcoded را به انگلیسی برگرداند، (۲) کلاس‌های `space-x-reverse`, `flex-row-reverse` (در صورت وجود) را با LTR طبیعی جایگزین کند، (۳) margin/padding های جهت‌دار (`mr-`, `ml-`, `pr-`, `pl-`) را از منظر **LTR** بازنگری کند (آنچه در RTL "شروع" بود، اکنون باید ml/pl باشد یا برعکس)، (۴) جایی که `text-right` صرفاً برای زبان RTL بود، حذف یا `text-left` شود.

- **E1** `App.tsx` (بلاک Profile inline) — رشته‌ها: `وزن فعلی`, `قد`, `اشتراک شما`, `وضعیت`, `فعال`, `تاریخ تمدید`, `۱۴۰۳/۰۸/۱۲`, `مدیریت اشتراک`, `Plan` suffix، `ID:` ⇒ انگلیسی + تاریخ Gregorian.
- **E2** `components/Layout.tsx` — TabBar labels.
- **E3** `components/ui/*` — معمولاً generic، فقط بررسی Card/Button برای متن hardcoded.
- **E4** `components/chat/*` (5 فایل) — placeholder, empty state copy, header title, typing indicator.
- **E5** `features/onboarding/OnboardingFlow.tsx` + 9 step (`NameStep`, `GoalStep`, `ExperienceStep`*, `BiometricsStep`, `MeasurementsStep`, `EquipmentStep`, `AvailabilityStep`, `LifestyleStep`, `NutritionStep`, `HealthStep`) — همه prompt ها، optionها، error messageها انگلیسی شوند. *(در درخت، Experience جدا نیست؛ احتمالاً داخل GoalStep است — تأیید با Read.)*
  - **E5a** `AvailabilityStep` — ترتیب نمایش روزها از Mon-first.
  - **E5b** `BiometricsStep` / `MeasurementsStep` — لیبل‌ها (`Weight (kg)`, `Height (cm)`, `Neck`, `Waist`, `Hips`, `Wrist`, `Age`).
- **E6** `features/dashboard/Dashboard.tsx` + 4 widget — Greeting, "Today's Focus", CTAs, modal.
- **E7** `features/dashboard/DailyCheckInModal.tsx` — سؤالات و option labels (mood, soreness, sleep).
- **E8** `features/workout/WorkoutPlan.tsx` + 5 sub-component — DateStrip (نام روزها از `en-US`), ExerciseCard, RestDayView, StartSessionBar, WorkoutContextFab, WorkoutHero.
- **E9** `features/nutrition/NutritionPlan.tsx` + 3 sub-component — meal cards, hero, hydration.
- **E10** `features/coach/AiCoach.tsx` + `useAiCoachLogic.ts` — system messages, error toasts.

### F. Helpers
- **F1** `utils/chatHelpers.ts` — اگر رشته‌ی فارسی دارد، انگلیسی.
- **F2** `hooks/useChatScroll.ts` — احتمالاً خنثی، فقط بررسی شود.

### G. Validation Pass (Final)
- **G1** اجرای regex بازرسی فارسی روی کل سورس، تأیید صفر-match.
- **G2** dev run + بررسی Onboarding تا Dashboard تا Chat در LTR.
