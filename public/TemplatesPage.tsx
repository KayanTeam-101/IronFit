import React, { useState, useMemo, useEffect } from "react";
import {
  FaDumbbell,
  FaUtensils,
  FaEye,
  FaCheckCircle,
  FaFire,
  FaArrowRight,
  FaTimes,
  FaLeaf,
  FaRunning,
  FaPlus,
  FaTiktok,
} from "react-icons/fa";
import { GiBiceps, GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import foods from "../../assets/FoodsList.json"; // adjust the import path as needed
import {EXERCISE_TEMPLATES, DIET_TEMPLATES} from "./Templates";
interface FoodItem {
  FoodName: string;
  ProtineForOneKilo: string;
  calForOneKilo: string;
  FatForOneKilo: string;
  CarbForOneKilo: string;
  MostVitamens: string[];
}
interface MealEntry {
  foodName: string;
  grams: number;
}

interface DietTemplate {
  id: string;
  name: string;
  description: string;
  type: "bulk" | "cut" | "maintenance" | "keto";
  meals: {
    Breakfast: MealEntry[];
    Lunch: MealEntry[];
    Snacks: MealEntry[];
    Dinner: MealEntry[];
  };
}

interface ExerciseEntry {
  name: string;
  weight: number;
}

interface WorkoutDay {
  dayName: string;
  exercises: ExerciseEntry[];
}

interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  days: WorkoutDay[];
}

// ---------- Helpers ----------
const foodList = foods as FoodItem[];

function getFoodData(foodName: string) {
  return foodList.find(f => f.FoodName === foodName);
}

function calcMealNutrition(entries: MealEntry[]) {
  let calories = 0, protein = 0,fat=0,carb=0;
  const vitaminsSet = new Set<string>();
  entries.forEach(entry => {
    const food = getFoodData(entry.foodName);
    if (food) {
      const calPerKilo = Number(food.calForOneKilo);
      const protPerKilo = Number(food.ProtineForOneKilo);
      const FatPerKilo = Number(food.FatForOneKilo);
      const CarbPerKilo = Number(food.CarbForOneKilo);
      calories += (calPerKilo * entry.grams) / 1000;
      protein += (protPerKilo * entry.grams) / 1000;
      fat += (FatPerKilo * entry.grams) / 1000;
      carb += (CarbPerKilo * entry.grams) / 1000;
      food.MostVitamens.forEach(v => v && vitaminsSet.add(v));
    }
  });
  return { calories, protein,fat,carb, vitamins: Array.from(vitaminsSet) };
}

function calcTotalNutrition(meals: DietTemplate["meals"]) {
  let totalCal = 0, totalProt = 0,totalFat=0,totalCarb=0;
  const allVitamins = new Set<string>();
  Object.values(meals).forEach(entries => {
    const { calories, protein,fat,carb, vitamins } = calcMealNutrition(entries);
    totalCal += calories;
    totalProt += protein;
    totalFat += fat;
    totalCarb += carb;
    vitamins.forEach(v => allVitamins.add(v));
  });
  return { calories: totalCal, protein: totalProt,fat:totalFat,carb:totalCarb, vitamins: Array.from(allVitamins) };
}

// Human-readable goal label per diet template type, shown as a chip on each card.
const DIET_GOAL_LABEL: Record<DietTemplate["type"], string> = {
  bulk: "زيادة الكتلة العضلية",
  cut: "خسارة الدهون",
  maintenance: "الحفاظ على الوزن",
  keto: "نظام كيتو",
};

// ---------- Small presentational helpers ----------

// Counts up from 0 to `value` once, using an eased animation. Respects
// prefers-reduced-motion by snapping straight to the final value.
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 650 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !Number.isFinite(value)) {
      setDisplay(value);
      return;
    }

    let raf: number;
    let start: number | null = null;
    const from = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString("en-US")}</>;
};

// Lightweight ripple, spawned from a real click position on the primary buttons.
function createRipple(event: React.MouseEvent<HTMLButtonElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "ripple-span";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 600);
}

const SkeletonCard: React.FC = () => (
  <div
    className="rounded-3xl p-5 border border-gray-200/70 dark:border-gray-600/20 bg-white dark:bg-black/20"
    aria-hidden="true"
  >
    <div className="skeleton-shimmer h-4 w-2/3 rounded-full mb-3" />
    <div className="skeleton-shimmer h-3 w-1/3 rounded-full mb-4" />
    <div className="skeleton-shimmer h-3 w-full rounded-full mb-2" />
    <div className="skeleton-shimmer h-3 w-5/6 rounded-full mb-4" />
    <div className="flex gap-2.5">
      <div className="skeleton-shimmer h-11 flex-1 rounded-2xl" />
      <div className="skeleton-shimmer h-11 w-20 rounded-2xl" />
    </div>
  </div>
);

// ---------- Main Component ----------
const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"diet" | "exercise">("diet");
  const [selectedDiet, setSelectedDiet] = useState<DietTemplate | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Brief skeleton beat on mount and on every tab switch — keeps the page
  // feeling responsive rather than an abrupt content swap.
  useEffect(() => {
    setIsLoading(true);
    const t = window.setTimeout(() => setIsLoading(false), 320);
    return () => window.clearTimeout(t);
  }, [activeTab]);

  const openDietPreview = (template: DietTemplate) => setSelectedDiet(template);
  const openExercisePreview = (template: ExerciseTemplate) => setSelectedExercise(template);

  // ---------- Systems (same as ExercisePage) ----------
type SystemName = "ارنو سبلت" | "بروسبلت" | "بوش بون ليج";

const SYSTEMS: Record<SystemName, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  "بروسبلت": ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};

  const applyDietTemplate = (template: DietTemplate) => {
    const Confirm = window.confirm("هل أنت متأكد أنك تريد تطبيق هذا القالب الغذائي؟ سيحل محل نظامك الحالي.");
    if (!Confirm) return;
    const dietObj: any = {};
    (Object.keys(template.meals) as Array<keyof typeof template.meals>).forEach(mealKey => {
      const entries = template.meals[mealKey];
      const foodNames = entries.map(e => e.foodName);
      const { calories, protein,fat,carb, vitamins } = calcMealNutrition(entries);
      dietObj[mealKey] = [foodNames, [calories, protein,fat,carb, vitamins]];
    });
    localStorage.setItem("Diet", JSON.stringify(dietObj));

    const foodInfo: any[] = [];
    (Object.entries(template.meals) as [string, MealEntry[]][]).forEach(([mealKey, entries]) => {
      entries.forEach(entry => {
        const food = getFoodData(entry.foodName);
        if (food) {
          const calPerKilo = Number(food.calForOneKilo);
          const protPerKilo = Number(food.ProtineForOneKilo);
          const cal = (calPerKilo * entry.grams) / 1000;
          const prot = (protPerKilo * entry.grams) / 1000;
          const Fat = (protPerKilo * entry.grams) / 1000;
          const Carb = (protPerKilo * entry.grams) / 1000;
          foodInfo.push([mealKey, entry.foodName, entry.grams, cal, prot,Fat,Carb]);
        }
      });
    });
    localStorage.setItem("FoodInfo_s", JSON.stringify(foodInfo));
    localStorage.setItem("UseDietTemplate","done");
    
    setSuccessMessage("تم تطبيق القالب الغذائي بنجاح!");
  navigate('/me/food')
  };
// At the top of TemplatesPage, add this constant for default weekdays
const DEFAULT_WEEKDAYS = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];


const applyExerciseTemplate = (template: ExerciseTemplate) => {
  const Confirm = window.confirm(
    "هل أنت متأكد أنك تريد تطبيق هذا القالب التمريني؟ سيحل محل نظامك الحالي."
  );
  if (!Confirm) return;

  const neededDays = template.days.length;

  // 1. Choose weekdays (default: Saturday → Friday)
  const DEFAULT_WEEKDAYS = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  let existingSelectedDays: string[] = [];
  try {
    const raw = localStorage.getItem("SelectedDays");
    existingSelectedDays = raw ? JSON.parse(raw) : [];
  } catch {
    existingSelectedDays = [];
  }

  let chosenWeekdays: string[];
  if (existingSelectedDays.length >= neededDays) {
    chosenWeekdays = existingSelectedDays.slice(0, neededDays);
  } else {
    chosenWeekdays = DEFAULT_WEEKDAYS.slice(0, neededDays);
  }

  // 2. Extract workout names from the template
  const templateWorkoutNames = template.days.map(day => day.dayName); // e.g., ["Push","Pull","Legs"]

  // 3. Save to localStorage
  localStorage.setItem("SelectedDays", JSON.stringify(chosenWeekdays));
  localStorage.setItem("WorkoutNames", JSON.stringify(templateWorkoutNames)); // new key
  localStorage.setItem("SystemOfExercise", ""); // clear system, not needed
  localStorage.setItem(
    "SystemStartDate",
    new Date().toISOString().slice(0, 10)
  );

  // 4. Save exercises under the original workout names
  template.days.forEach((day) => {
    const key = `exercises_workout_${day.dayName}`; // e.g., exercises_workout_Push
    const exercises = day.exercises.map((ex) => ({
      name: ex.name,
      weight: ex.weight,
    }));
    localStorage.setItem(key, JSON.stringify(exercises));
  });
  localStorage.setItem("SetWorkout", "true");
  setSuccessMessage("تم تطبيق قالب التمارين بنجاح!");
  navigate('/me/exercises')
  
};

  const dietNutrition = useMemo(() => {
    if (!selectedDiet) return null;
    return calcTotalNutrition(selectedDiet.meals);
  }, [selectedDiet]);

  // Daily calorie need, read straight from storage same as before.
  const dailyCaloriesRaw = localStorage.getItem("dailyCalories");
  const dailyCalories = dailyCaloriesRaw && !Number.isNaN(Number(dailyCaloriesRaw)) ? Number(dailyCaloriesRaw) : null;

  // Diet templates sorted so the one closest to the user's daily need leads.
  const sortedDietTemplates = useMemo(() => {
    const withNutrition = DIET_TEMPLATES.map(template => ({
      template,
      nut: calcTotalNutrition(template.meals),
    }));
    if (dailyCalories === null) return withNutrition;
    return [...withNutrition].sort(
      (a, b) => Math.abs(a.nut.calories - dailyCalories) - Math.abs(b.nut.calories - dailyCalories)
    );
  }, [dailyCalories]);

  const getTypeIcon = (type: DietTemplate["type"]) => {
    switch (type) {
      case "bulk": return <GiMuscleUp className="text-orange-400" />;
      case "cut": return <FaLeaf className="text-green-400" />;
      case "maintenance": return '';
      case "keto": return <GiBiceps className="text-purple-400" />;
    }
  };

  const getDifficultyColor = (level: ExerciseTemplate["difficulty"]) => {
    switch (level) {
      case "beginner": return "text-orange-400";
      case "intermediate": return "text-yellow-400";
      case "advanced": return "text-teal-400";
    }
  };

  return (
    <div className="min-h-screen page-fade-in dark:text-white text-black p-4 pb-20 show-first">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

        @keyframes pageFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .page-fade-in { animation: pageFadeIn 320ms cubic-bezier(0.22,1,0.36,1); }

        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: cardEnter 280ms cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes borderGlowPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(249,115,22,0.35), 0 0 18px rgba(249,115,22,0.12); }
          50% { box-shadow: 0 0 0 1.5px rgba(249,115,22,0.55), 0 0 26px rgba(249,115,22,0.26); }
        }
        .template-card.recommended { animation: borderGlowPulse 2.6s ease-in-out infinite; }

        .template-card {
          transition: transform 220ms cubic-bezier(0.22,1,0.36,1),
                      box-shadow 220ms cubic-bezier(0.22,1,0.36,1),
                      border-color 220ms cubic-bezier(0.22,1,0.36,1);
        }
        .template-card:hover { transform: translateY(-2px) scale(1.02); }
        .template-card:active { transform: scale(0.99); }

        .btn-press { transition: transform 150ms cubic-bezier(0.22,1,0.36,1), filter 150ms ease; }
        .btn-press:active { transform: scale(0.95); }

        .ripple-span {
          position: absolute;
          border-radius: 9999px;
          background: rgba(255,255,255,0.55);
          transform: scale(0);
          animation: rippleAnim 600ms ease-out;
          pointer-events: none;
        }
        @keyframes rippleAnim { to { transform: scale(2.6); opacity: 0; } }

        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, rgba(148,163,184,0.10) 25%, rgba(148,163,184,0.22) 37%, rgba(148,163,184,0.10) 63%);
          background-size: 400px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .segmented-pill { transition: transform 260ms cubic-bezier(0.22,1,0.36,1); }

        @media (prefers-reduced-motion: reduce) {
          .page-fade-in, .card-enter, .template-card.recommended, .skeleton-shimmer, .ripple-span { animation: none !important; }
          .template-card, .btn-press, .segmented-pill { transition: none !important; }
        }
      `}</style>

      {/* Feedback link */}
      <div className="flex justify-center mb-4 pt-2">
        <a
          href="https://www.tiktok.com/@iron_fit_app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-2"
        >
          <FaTiktok /> شاركنا رأيك
        </a>
      </div>

      {/* Segmented control */}
      <div className="relative flex bg-gray-100 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-1.5 max-w-xs mx-auto mb-6">
        <div
          className="segmented-pill absolute inset-y-1.5 rounded-xl shadow-md"
          style={{
            width: "calc(50% - 9px)",
            transform: activeTab === "diet" ? "translateX(0px)" : "translateX(calc(100% + 6px))",
            background:
              activeTab === "diet"
                ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                : "linear-gradient(135deg,#f97316,#ea580c)",
          }}
        />
        <button
          onClick={() => setActiveTab("diet")}
          className={`relative z-10 flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors duration-200 ${
            activeTab === "diet" ? "text-white" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <FaUtensils /> غذائي
        </button>
        <button
          onClick={() => setActiveTab("exercise")}
          className={`relative z-10 flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors duration-200 ${
            activeTab === "exercise" ? "text-white" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <FaDumbbell /> رياضي
        </button>
      </div>

      {/* Friendly title + reassurance */}
      <div className="text-center max-w-md mx-auto mb-6">
        <h1 className="text-xl font-black">اختر قالباً يناسب احتياجك</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          يمكنك تغيير القالب لاحقاً في أي وقت، القرار مش نهائي.
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500  text-black dark:text-white px-6 py-2 rounded-full shadow-2xl font-bold animate-fadeIn">
          <FaCheckCircle className="inline mr-2" /> {successMessage}
        </div>
      )}

      <div className="grid gap-4 max-w-lg mx-auto">
        {/* Daily calories card — diet tab only */}
        {activeTab === "diet" && (
          <div className="card-enter relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-500/15 dark:via-amber-500/5 border border-orange-200/60 dark:border-orange-500/20 backdrop-blur-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">احتياجك اليومي</p>
            <p className="text-3xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              {dailyCalories !== null ? <AnimatedNumber value={dailyCalories} /> : "—"} سعرة
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">سنقترح القوالب الأقرب لاحتياجك.</p>
          </div>
        )}

        {activeTab === "exercise" && (
          <p className="card-enter text-black dark:text-gray-50 text-sm font-semibold text-center">
            بعد تطبيق القالب تقدر تعدل الأوزان براحتك.
          </p>
        )}

        {/* Diet templates */}
        {activeTab === "diet" &&
          (isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            sortedDietTemplates.map(({ template, nut }, idx) => {
              const isRecommended = dailyCalories !== null && idx === 0;
              return (
                <div
                  key={template.id}
                  className={`template-card card-enter relative bg-white dark:bg-black/20 dark:border-2 backdrop-blur-sm shadow-lg rounded-3xl p-5 group ${
                    isRecommended
                      ? "border-orange-400/70 dark:border-orange-400/50 recommended"
                      : "border border-gray-200/70 dark:border-gray-600/20"
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      موصى به
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {getTypeIcon(template.type)}
                    <h3 className="text-lg font-bold">{template.name}</h3>
                  </div>

                  <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full mb-2">
                    {DIET_GOAL_LABEL[template.type]}
                  </span>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{template.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">مناسب حسب احتياجك الخاص</p>

                  <div className="flex gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-semibold">
                      <FaFire className="text-xs" /> <AnimatedNumber value={Math.round(nut.calories)} /> كال
                    </span>
                    <span className="flex items-center gap-1.5 text-teal-500 dark:text-teal-400 font-semibold">
                      <GiBiceps className="text-xs" /> <AnimatedNumber value={Math.round(nut.protein)} />غ بروتين
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onMouseDown={createRipple}
                      onClick={() => applyDietTemplate(template)}
                      className="btn-press relative overflow-hidden flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-500/20 hover:brightness-110"
                    >
                      استخدم القالب
                    </button>
                    <button
                      onClick={() => openDietPreview(template)}
                      className="btn-press py-3 px-4 rounded-2xl text-sm font-semibold dark:bg-gray-700/70 bg-slate-100 hover:bg-gray-600/70 hover:text-white dark:text-gray-300 text-slate-600 transition flex items-center gap-1.5"
                    >
                      <FaEye /> معاينة
                    </button>
                  </div>
                </div>
              );
            })
          ))}

        {/* Exercise templates */}
        {activeTab === "exercise" &&
          (isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            EXERCISE_TEMPLATES.map((template, idx) => (
              <div
                key={template.id}
                className="template-card card-enter dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border border-gray-200/70 backdrop-blur-sm shadow-lg rounded-3xl p-5 group"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <h3 className="text-lg font-bold flex items-center gap-2 text-black dark:text-white mb-1">
                  <FaDumbbell className="text-amber-400" /> {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{template.description}</p>
                <div className="flex gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-300 font-semibold">
                    <FaRunning /> {template.daysPerWeek} أيام
                  </span>
                  <span className={`font-semibold ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty === "beginner" ? "مبتدئ" : template.difficulty === "intermediate" ? "متوسط" : "متقدم"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onMouseDown={createRipple}
                    onClick={() => applyExerciseTemplate(template)}
                    className="btn-press relative overflow-hidden flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-amber-500/20 hover:brightness-110"
                  >
                    استخدم القالب
                  </button>
                  <button
                    onClick={() => openExercisePreview(template)}
                    className="btn-press py-3 px-4 rounded-2xl text-sm font-semibold dark:bg-gray-700/70 bg-slate-100 hover:bg-gray-600/70 hover:text-white dark:text-gray-300 text-slate-600 transition flex items-center gap-1.5"
                  >
                    <FaEye /> معاينة
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>

      {/* Diet Preview Modal */}
      {selectedDiet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:shadow-2xl rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold dark:text-white text-black">{selectedDiet.name}</h3>
              <button onClick={() => setSelectedDiet(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>

            <p className="dark:text-gray-400 text-black mb-4">{selectedDiet.description}</p>
            {dietNutrition && (
              <div className="flex gap-3 mb-4 flex-wrap">
                <span className="bg-none text-orange-400 px-3 py-1 rounded-full text-sm font-black">
                  {Math.round(dietNutrition.calories)} سعرة
                </span>
                <span className="bg-none text-teal-400 px-3 py-1 rounded-full text-sm font-black">
                  {Math.round(dietNutrition.protein)}غ بروتين
                </span>
                <span className="bg-none text-blue-400 px-3 py-1 rounded-full text-sm font-black">
                  {Math.round(dietNutrition.fat)}غ دهون
                </span>
                <span className="bg-none text-amber-400 px-3 py-1 rounded-full text-sm font-black">
                  {Math.round(dietNutrition.carb)}غ كارب
                </span>
              </div>
            )}
               <button
              onMouseDown={createRipple}
              onClick={() => {
                applyDietTemplate(selectedDiet);
                setSelectedDiet(null);
              }}
              className="btn-press relative overflow-hidden w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
            {(Object.keys(selectedDiet.meals) as Array<keyof typeof selectedDiet.meals>).map(mealKey => {
              const entries = selectedDiet.meals[mealKey];
              if (entries.length === 0) return null;
              return (
                <div key={mealKey} className="mb-3 mt-4">
                  <h4 className="text-sm font-semibold dark:text-gray-300 text-black mb-1">{mealKey}</h4>
                  <ul className="space-y-2">
                    {entries.map((entry, idx) => (
                      <li key={idx} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg p-3">
                        <span>{entry.foodName}</span>
                        <span className="dark:text-gray-400 text-black">{entry.grams}غ</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
         
          </div>
        </div>
      )}

      {/* Exercise Preview Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:shadow-2xl rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold dark:text-white text-black">{selectedExercise.name}</h3>
              <button onClick={() => setSelectedExercise(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <p className="dark:text-gray-400 text-black mb-4">{selectedExercise.description}</p>
            <div className="flex gap-4 mb-4 text-sm">
              <span className="dark:text-gray-300 text-black"><FaRunning className="inline mr-1" /> {selectedExercise.daysPerWeek} أيام</span>
              <span className={`font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
                {selectedExercise.difficulty === "beginner" ? "مبتدئ" : selectedExercise.difficulty === "intermediate" ? "متوسط" : "متقدم"}
              </span>
            </div>
             <button
              onMouseDown={createRipple}
              onClick={() => {
                applyExerciseTemplate(selectedExercise);
                setSelectedExercise(null);
              }}
              className="btn-press relative overflow-hidden w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
            {selectedExercise.days.map((day, idx) => (
              <div key={idx} className="mb-3 mt-4">
                <h4 className="text-sm font-semibold text-amber-400 mb-1">{day.dayName}</h4>
                <ul className="space-y-2">
                  {day.exercises.map((ex, i) => (
                    <li key={i} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg p-3">
                      <span>{ex.name}</span>
                      <span className="dark:text-gray-400 text-black">{ex.weight > 0 ? `${ex.weight} كغ` : "وزن الجسم"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
           
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
