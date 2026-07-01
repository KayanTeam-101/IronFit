import React, { useEffect, useState, useMemo } from "react";
import {
  BiCookie,
} from "react-icons/bi";
import {
  BsFire,
  BsMoon,
  BsPlus,
  BsSave2Fill,
  BsSun,
} from "react-icons/bs";
import {
  FaBowlFood,
  FaFire,
} from "react-icons/fa6";
import {
  HiOutlineChevronUpDown,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import {
  GiBiceps,
} from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import AdditionPage from "./AdditionPage";

// ---------- Types ----------
type MealKey = "Breakfast" | "Lunch" | "Snacks" | "Dinner";

type MealPlan = {
  [key in MealKey]: [string[], number[]];
};

// ---------- Helpers ----------
const MEAL_NAMES_AR: Record<MealKey, string> = {
  Breakfast: "الفطور",
  Lunch: "الغداء",
  Snacks: "الوجبات الخفيفة",
  Dinner: "العشاء",
};

const MEAL_ICONS: Record<MealKey, React.ReactNode> = {
  Breakfast: <BsSun className="text-amber-500" />,
  Lunch: <FaBowlFood className="text-orange-500" />,
  Snacks: <BiCookie className="text-yellow-600" />,
  Dinner: <BsMoon className="text-indigo-400" />,
};

// ---------- Component ----------
const MakeADiet: React.FC = () => {
  const navigate = useNavigate();

  // Initialize diet if not present
  if (!localStorage.getItem("Diet")) {
    localStorage.setItem(
      "Diet",
      JSON.stringify({
        Breakfast: [[], []],
        Lunch: [[], []],
        Snacks: [[], []],
        Dinner: [[], []],
      })
    );
  }

  const [mealPlan, setMealPlan] = useState<MealPlan>(
    JSON.parse(localStorage.getItem("Diet") || "{}")
  );
  const [isClicked, setIsClicked] = useState(false);

  // User data
  const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
  const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
  const height = Number(localStorage.getItem("height") || 0);
  const age = Number(localStorage.getItem("age") || 0);
  const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
  const gender = localStorage.getItem("SelectedGender") || "";

  // Calculate daily calorie goal once
  const dailyCaloriesGoal = useMemo(() => {
    if (!challengePeriod || challengePeriod <= 0) return 0;

    let bmr: number;
    if (gender === "ذكر") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

 
    const tdee = bmr * 1.5; // activity factor
    const weightDiff = targetWeight - currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;

    if (days === 0) return Math.round(tdee);
    const daily = tdee + totalCaloriesNeeded / days;
    localStorage.setItem("dailyCalories", Math.round(daily).toString());
    return Math.round(daily);
  }, [currentWeight, targetWeight, height, age, challengePeriod, gender]);

  useEffect(() => {
  if (dailyCaloriesGoal > 0) {
    localStorage.setItem("dailyCalories", dailyCaloriesGoal.toString());
  }
}, [dailyCaloriesGoal]);

  // Eaten calories & protein from all meals
  const eatenCalories = useMemo(
    () =>
      Object.values(mealPlan).reduce(
        (sum, meal) => sum + (meal[1][0] || 0),
        0
      ),
    [mealPlan]
  );
  const eatenProtein = useMemo(
    () =>
      Object.values(mealPlan).reduce(
        (sum, meal) => sum + (meal[1][1] || 0),
        0
      ),
    [mealPlan]
  );

  // Progress percentage
  const progressPercent = dailyCaloriesGoal > 0
    ? Math.min((eatenCalories / dailyCaloriesGoal) * 100, 100)
    : 0;

  // SVG progress ring values
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  // Toggle a meal section open/closed
  const toggleMeal = (meal: MealKey) => {
    const el = document.getElementById(`meal-${meal}`);
    if (!el) return;
    if (el.classList.contains("opened")) {
      el.style.height = "60px";
      el.classList.remove("opened");
    } else {
      el.style.height = el.scrollHeight + "px";
      el.classList.add("opened");
    }
  };

  // Add dish – opens the AdditionPage modal
  const addDish = (mealKey: MealKey) => {
    localStorage.setItem("currentMeal", mealKey);
    setIsClicked(true);
  };

  // Save diet – validate and navigate
  const saveDiet = () => {
    const emptyMeal = (Object.keys(mealPlan) as MealKey[]).find(
      (key) => mealPlan[key][0].length === 0
    );
    if (emptyMeal) {
      alert("يجب إضافة وجبة واحدة على الأقل لكل فئة قبل الحفظ.");
      return;
    }
    localStorage.setItem("Diet", JSON.stringify(mealPlan));
    navigate("/me/home");
  };

  // Update mealPlan state whenever localStorage is changed (by AdditionPage)
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("Diet");
      if (stored) setMealPlan(JSON.parse(stored));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Also refresh when AdditionPage closes
  const handleCloseAddition = () => {
    const stored = localStorage.getItem("Diet");
    if (stored) setMealPlan(JSON.parse(stored));
    setIsClicked(false);
  };

 const [IsActive, setIsActive] = useState(false);

  useEffect(() => {
   
  
   const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        const period = decoded.SubscriptionPeriod;
        if (period && period > Date.now()) {
          setIsActive(true);
          return;
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []);



  return (
    <div className="min-h-screen show-first bg-amber-50 dark:bg-black/20 relative pb-24">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-amber-400  to-orange-500 dark:from-black/20 dark:to-amber-400/20 dark:border-2 dark:border-gray-600/20 p-12 pt-10 rounded-b-full shadow-xl godown">
          <div className="flex justify-between mt-5 text-white/90 text-sm">
          <span>الوزن: {currentWeight} كغ</span>
          <span>الهدف: {targetWeight} كغ</span>
          <span>المدة: {challengePeriod} شهر</span>
<br />

        </div>
        <div className="flex items-center gap-3">
       
          <h1 className="text-white  w-full text-2xl text-center mt-2">اصنع نظامك الغذائي</h1>
        </div>
        {/* Quick stats */}
      
      </div>

      {/* Progress Ring + Nutrients */}
      <div className="flex flex-col items-center -mt-5 mb-6">
        <div className="relative w-53 h-53">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 160 160"
            className="transform -rotate-90 drop-shadow-xl"
          >
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="13"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#calorieGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
            <span className="text-3xl font-extrabold dark:text-white"><span className="text-sm">%</span>{Math.round(progressPercent)}  </span>
            <div className="flex items-center gap-1 text-sm font-medium mt-1">
              <FaFire className="text-orange-500 dark:text-white" />
              <span className="text-[11px] dark:text-white"> أنت تحتاج {dailyCaloriesGoal} </span>
            </div>
            <span className="text-xs text-gray-500 mt-0.5">سعرة</span>
          </div>
        </div>

        {/* Protein chip */}
        <div className="mt-3 flex items-center gap-2 bg-white/70 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-md">
          <GiBiceps className="text-teal-500 text-lg" />
          <span className="font-semibold text-gray-700 dark:text-white">
            {eatenProtein.toFixed(1)} غرام بروتين
          </span>
        </div>
      
      </div>
    <div className="p-4 flex items-center justify-center w-screen ">
          <div className="bg-amber-300/60 dark:bg-amber-300/20 border border-amber-400/50 rounded-xl w-11/12 p-2 dark:text-white text-black min-h-10 animate-pulse">
 مكسل تعمل دايت؟! تقدر تجرب القوالب الغذائية الجاهزة من <span onClick={() => window.location.href = "/templates"} className="text-amber-400 cursor-pointer underline">هنا</span>
    </div>
    </div>
      {/* Meal Cards */}
      <div className="px-4 space-y-4">
        {(Object.keys(mealPlan) as MealKey[]).map((meal) => (
          <div
            id={`meal-${meal}`}
            key={meal}
            className="relative bg-white/70 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-lg border border-white/60 shadow-xl rounded-3xl overflow-hidden transition-all duration-500 ease-in-out"
            style={{ height: "60px" }}
          >
            {/* Header – click to toggle */}
            <div
              onClick={() => toggleMeal(meal)}
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                {MEAL_ICONS[meal]}
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {MEAL_NAMES_AR[meal]}
                </h2>
                {mealPlan[meal][0].length > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 dark:bg-black/15 dark:text-white px-2 py-0.5 rounded-full">
                    {mealPlan[meal][0].length} أطباق
                  </span>
                )}
              </div>
              <HiOutlineChevronUpDown className="text-gray-400 text-xl" />
            </div>

            {/* Expanded content */}
            <div className="px-5 pb-5 space-y-3">
              {/* Add button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addDish(meal);
                }}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 dark:bg-orange-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg active:scale-95 transition"
              >
                <BsPlus size={20} /> إضافة طبق
              </button>

              {/* Dishes */}
              {mealPlan[meal][0].length > 0 ? (
                <div className="space-y-2">
                  {mealPlan[meal][0].map((dish, idx) => (
                    <div
                      key={`${meal}-${idx}`}
                      className="flex items-center justify-between bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-xl border border-amber-100"
                    >
                      <span className="font-medium text-gray-700">{dish}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  لا توجد أطباق مضافة
                </p>
              )}

              {/* Nutrition info for this meal */}
              <div className="flex flex-wrap gap-2 mt-2">
                {mealPlan[meal][1].map((value, idx) => {
                  if (idx === 0) {
                    return (
                      <div
                        key={`${meal}-info-0`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-700"
                      >
                        <FaFire className="text-orange-500" />
                        السعرات: {Number(value).toFixed(1)}
                      </div>
                    );
                  }
                  if (idx === 1) {
                    return (
                      <div
                        key={`${meal}-info-1`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-50 text-teal-700"
                      >
                        <GiBiceps className="text-teal-500" />
                        بروتين: {Number(value).toFixed(1)} غ
                      </div>
                    );
                  }
                  if (idx === 2 && IsActive) {
                    return (
                      <div
                        key={`${meal}-info-2`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700"
                      >
                        فيتامين: {value}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="relative p-5 left-0 right-0 flex justify-center z-50">
        <button
          onClick={saveDiet}
          className="flex items-center justify-center w-full gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl active:scale-95 transition hover:shadow-3xl"
        >
          <BsSave2Fill size={22} />
          حفظ النظام
        </button>
      </div>

      {/* AdditionPage Modal */}
      {isClicked && (
        <AdditionPage
          Meal={localStorage.getItem("currentMeal") || ""}
          onClose={handleCloseAddition}
        />
      )}
    </div>
  );
};

export default MakeADiet;