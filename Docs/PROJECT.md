# PROJECT.md — Hifit 1.5 (Global English Pivot)

> ستاره قطبی پروژه. هر تصمیم کدنویسی باید با این سند سنجیده شود.

---

## ۱. هدف بیزینس
Hifit یک «مربی هوشمند بدنسازی» (AI Strength & Conditioning Coach) مبتنی بر Gemini است که برنامه تمرین و تغذیه شخصی‌سازی‌شده تولید می‌کند، آن را با وضعیت روزانه کاربر تطبیق می‌دهد و از طریق چت Agentic (با Function Calling) امکان ویرایش زنده برنامه را می‌دهد.
**Pivot جاری:** خروج کامل از بازار ایران و عرضه به‌عنوان یک محصول **Global / English-Only** برای کاربران بین‌المللی Gen Z و Millennial علاقه‌مند به بدنسازی هوشمند.

## ۲. پرسونای هدف
- **Primary:** کاربران ۱۸–۳۵ ساله انگلیسی‌زبان، آشنا به اپ‌های فیتنس مدرن (Whoop, Hevy, Fitbod)، علاقه‌مند به برنامه‌ریزی داده‌محور و تعامل با AI.
- **Secondary:** افراد مبتدی تا متوسطی که می‌خواهند برنامه باشگاه/خانه با تطبیق روزانه بر اساس Readiness داشته باشند.
- **Locale پیش‌فرض:** `en-US`. سیستم اندازه‌گیری: **Metric** (kg / cm) — Imperial فعلاً خارج از scope است.

## ۳. پشته تکنولوژی (Tech Stack — تثبیت شده)
| لایه | انتخاب | توضیح |
|---|---|---|
| Build Tool | **Vite 6** | بدون تغییر |
| Framework | **React 19** + **TypeScript 5.8** | SPA، فقط CSR |
| Styling | **Tailwind CSS** (CDN از `index.html`) | همان توکن‌های فعلی (gold / obsidian / charcoal / glass) حفظ می‌شود |
| Animation | **framer-motion 12** | حفظ تجربه پریمیوم |
| Icons | **lucide-react** | بدون تغییر |
| Utilities | **clsx**, **tailwind-merge** | بدون تغییر |
| AI | **@google/genai** (Gemini)، مدل `gemini-3.5-flash` | فقط System Prompts بازنویسی می‌شود |
| State | **React Context API** + **localStorage** | بدون افزودن Zustand/Redux |
| Routing | بدون router؛ سوییچ View با `AppView` enum | حفظ شود |
| Fonts | **Inter** (Google Fonts) به جای Vazirmatn | تنها فونت پروژه |

## ۴. نبایدهای سخت‌گیرانه (Anti-Patterns — اکیداً ممنوع)

> هر یک از موارد زیر در هر PR/کامیتی پیدا شود، Reject است.

### ۴.۱ زبان و جهت
1. **ممنوع:** هرگونه کاراکتر فارسی/عربی (`[\u0600-\u06FF]`) در سورس `.ts`, `.tsx`, `.html`, `.json`، شامل کامنت، رشته، Placeholder، Toast، Error، Label، Tooltip، Alt و System Prompt.
2. **ممنوع:** صفت/attribute `dir="rtl"` یا `lang="fa"` در هر JSX یا HTML. مقادیر مجاز فقط `dir="ltr"` (یا حذف کامل، چون LTR پیش‌فرض است) و `lang="en"`.
3. **ممنوع:** کلاس‌های Tailwind مختص RTL مثل `space-x-reverse`, `divide-x-reverse`، یا منطق شرطی `rtl:` / `ltr:`. همه باید با utilityهای منطقی LTR (`ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`) جایگزین شوند **با معنای LTR**.
4. **ممنوع:** فونت Vazirmatn و هر فونت فارسی. تنها فونت مجاز **Inter** است.
5. **ممنوع:** فرمت‌گرهای فارسی: `toLocaleDateString('fa-IR')`, `toLocaleString('fa-IR')`, تاریخ/عدد جلالی، اعداد فارسی (`۰-۹`). فقط `en-US` و اعداد ASCII.

### ۴.۲ معماری زبان
6. **ممنوع:** افزودن هر کتابخانه i18n (`react-i18next`, `next-intl`, `lingui`, `formatjs`, `polyglot`, ...). تمام رشته‌ها **هاردکد انگلیسی** هستند. دلیل: حفظ سادگی MVP.
7. **ممنوع:** سیستم Locale Switcher، Language Selector، یا هر UI تغییر زبان.
8. **ممنوع:** نگهداری فایل `constants.ts > STRINGS` به‌عنوان dictionary چندزبانه. این object یا حذف می‌شود یا فقط مقادیر انگلیسی مستقیم نگه می‌دارد (ترجیحاً inline در کامپوننت).

### ۴.۳ AI & Data
9. **ممنوع:** هر System Prompt که به مدل Gemini دستور به فارسی بودن بدهد. تمام Prompt ها صراحتاً باید بگویند: *"All output values MUST be in natural, professional English."*
10. **ممنوع:** Fallback meal/exercise/focus به فارسی در `geminiService.ts` و `UserContext.tsx`. همه باید English باشند.
11. **ممنوع:** افزودن سیستم Imperial (lbs/in) در این فاز. فقط Metric (kg/cm) با لیبل انگلیسی.

### ۴.۴ کلی
12. **ممنوع:** ORM یا کتابخانه DB (پروژه فقط localStorage دارد).
13. **ممنوع:** افزودن Router (مثل react-router). الگوی `AppView` حفظ شود.
14. **ممنوع:** CSS خطی (inline `style={...}` برای layout). فقط Tailwind. استثنا: مقادیر داینامیک (مثل `width: ${progress}%`).
15. **ممنوع:** استفاده از emoji به‌عنوان آیکون. فقط `lucide-react`.

## ۵. معیار «Done» برای این Pivot
- [ ] دستور `grep -rEn '[\u0600-\u06FF]' --include='*.{ts,tsx,html,json,md,css}' .` در ریشه پروژه (به استثنای پوشه `Docs/` و `app_detail/`) **صفر match** برگرداند.
- [ ] `index.html` دارای `lang="en"` و **بدون** `dir="rtl"` باشد.
- [ ] هیچ reference به `Vazirmatn` یا `fa-IR` در سورس باقی نمانده باشد.
- [ ] خروجی Gemini در سه مسیر `generateInitialPlan`, `adjustDailyWorkout`, `generateAgentResponse` کاملاً انگلیسی باشد (بررسی دستی روی یک onboarding تست).
- [ ] فرم‌های Onboarding، Dashboard، Workout، Nutrition و Chat در DevTools به صورت LTR رندر شوند، بدون شکستگی Layout.
- [ ] `package.json > name` به یک slug انگلیسی معتبر تغییر کند.
