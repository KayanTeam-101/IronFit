import React, { useState, useMemo } from "react";
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
} from "react-icons/fa";
import { GiBiceps, GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import foods from "../../assets/FoodsList.json"; // adjust the import path as needed
import { HiTemplate } from "react-icons/hi";
import {EXERCISE_TEMPLATES, DIET_TEMPLATES} from "./Templates";
interface FoodItem {
  FoodName: string;
  ProtineForOneKilo: string;
  MostVitamens: string[];
  calForOneKilo: string;
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
  let calories = 0, protein = 0;
  const vitaminsSet = new Set<string>();
  entries.forEach(entry => {
    const food = getFoodData(entry.foodName);
    if (food) {
      const calPerKilo = Number(food.calForOneKilo);
      const protPerKilo = Number(food.ProtineForOneKilo);
      calories += (calPerKilo * entry.grams) / 1000;
      protein += (protPerKilo * entry.grams) / 1000;
      food.MostVitamens.forEach(v => v && vitaminsSet.add(v));
    }
  });
  return { calories, protein, vitamins: Array.from(vitaminsSet) };
}

function calcTotalNutrition(meals: DietTemplate["meals"]) {
  let totalCal = 0, totalProt = 0;
  const allVitamins = new Set<string>();
  Object.values(meals).forEach(entries => {
    const { calories, protein, vitamins } = calcMealNutrition(entries);
    totalCal += calories;
    totalProt += protein;
    vitamins.forEach(v => allVitamins.add(v));
  });
  return { calories: totalCal, protein: totalProt, vitamins: Array.from(allVitamins) };
}

// ---------- Main Component ----------
const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"diet" | "exercise">("diet");
  const [selectedDiet, setSelectedDiet] = useState<DietTemplate | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

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
      const { calories, protein, vitamins } = calcMealNutrition(entries);
      dietObj[mealKey] = [foodNames, [calories, protein, vitamins]];
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
          foodInfo.push([mealKey, entry.foodName, entry.grams, cal, prot]);
        }
      });
    });
    localStorage.setItem("FoodInfo_s", JSON.stringify(foodInfo));
    setSuccessMessage("تم تطبيق القالب الغذائي بنجاح!");
    setTimeout(() => setSuccessMessage(""), 3000);
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
  setTimeout(() => setSuccessMessage(""), 3000);
};












  const dietNutrition = useMemo(() => {
    if (!selectedDiet) return null;
    return calcTotalNutrition(selectedDiet.meals);
  }, [selectedDiet]);

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
      case "beginner": return "text-green-400";
      case "intermediate": return "text-yellow-400";
      case "advanced": return "text-red-400";
    }
  };

  return (
    <div className="min-h-screen  dark:text-white text-black p-4 pb-20 show-first">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6 pt-4">
 <div className="text-2xl flex flex-row gap-1.5">
            <HiTemplate className="dark:text-white"/>
            <div className="p-0.5 felx justify-center align-center rounded-full text-sm text-transparent font-bold">
  
<a href="https://www.tiktok.com/@iron_fit_app" target="_blank" rel="noopener noreferrer" className="underline text-amber-500">
  شاركنا رأيك
</a>
            </div>
          </div>
       
        <p className="text-gray-400 mt-1">ابدأ بسرعة مع قوالب مصممة لأهدافك</p>
      </div>

      {/* Tabs */}
      <div className="flex z-20 justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab("diet")}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "diet"
              ? "bg-amber-500 text-white "
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <FaUtensils /> غذائي
        </button>
        <button
          onClick={() => setActiveTab("exercise")}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "exercise"
              ? "bg-orange-500 text-white "
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <FaDumbbell /> تمارين

        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500  text-black dark:text-white px-6 py-2 rounded-full shadow-2xl font-bold animate-fadeIn">
          <FaCheckCircle className="inline mr-2" /> {successMessage}
        </div>
      )}

      {/* Template cards */}
      <div className="grid gap-4  max-w-lg mx-auto">

        {activeTab === "diet" &&
          DIET_TEMPLATES.map(template => {
            const nut = calcTotalNutrition(template.meals);
            return (
              <div
              key={template.id}
              className="bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-3xl p-5 hover:shadow-2xl transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(template.type)}
                      <h3 className="text-lg font-bold">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-orange-400">
                        <FaFire className="text-xs" /> {Math.round(nut.calories)} كال
                      </span>
                      <span className="flex items-center gap-1 text-teal-400">
                        <GiBiceps className="text-xs" /> {Math.round(nut.protein)}غ بروتين
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openDietPreview(template)}
                      className="p-2.5 px-5 dark:bg-gray-700 bg-slate-100 rounded-full hover:bg-gray-600 transition"
                      title="معاينة"
                    >
                      <FaEye className="dark:text-gray-300 text-slate-600" />
                    </button>
                 
                  </div>
                </div>
              </div>
            );
          })}

        {activeTab === "exercise" &&
          EXERCISE_TEMPLATES.map(template => (
            <div
              key={template.id}
              className=" dark:bg-black/20 dark:border-2 dark:border-gray-600/20  backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-3xl p-5 hover:shadow-2xl transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-black dark:text-white">
                    <FaDumbbell className="text-amber-400" /> {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-300">
                      <FaRunning /> {template.daysPerWeek} أيام
                    </span>
                    <span className={`font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty === "beginner" ? "مبتدئ" : template.difficulty === "intermediate" ? "متوسط" : "متقدم"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openExercisePreview(template)}
                    className="p-2.5 px-5 flex flex-row gap-2 items-center  dark:bg-gray-700 bg-slate-100 rounded-full hover:bg-gray-600 transition"
                    title="معاينة"
                  >
                    <FaEye className="dark:text-gray-300 text-slate-600" /> 
                  </button>
                
                </div>
              </div>
            </div>
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
              <div className="flex gap-3 mb-4">
                <span className="bg-none text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(dietNutrition.calories)} سعرة
                </span>
                <span className="bg-none text-teal-400 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(dietNutrition.protein)}غ بروتين
                </span>
              </div>
            )}
               <button
              onClick={() => {
                applyDietTemplate(selectedDiet);
                setSelectedDiet(null);
              }}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
            {(Object.keys(selectedDiet.meals) as Array<keyof typeof selectedDiet.meals>).map(mealKey => {
              const entries = selectedDiet.meals[mealKey];
              if (entries.length === 0) return null;
              return (
                <div key={mealKey} className="mb-3">
                  <h4 className="text-sm font-semibold dark:text-gray-300 text-black mb-1">{mealKey}</h4>
                  <ul className="space-y-1">
                    {entries.map((entry, idx) => (
                      <li key={idx} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg px-3 py-1">
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
              onClick={() => {
                applyExerciseTemplate(selectedExercise);
                setSelectedExercise(null);
              }}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
            {selectedExercise.days.map((day, idx) => (
              <div key={idx} className="mb-3">
                <h4 className="text-sm font-semibold text-amber-400 mb-1">{day.dayName}</h4>
                <ul className="space-y-1">
                  {day.exercises.map((ex, i) => (
                    <li key={i} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg px-3 py-1">
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