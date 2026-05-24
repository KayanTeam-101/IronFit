import React, { useState, useEffect, useMemo } from "react";
import { FaFire, FaCheck, FaRegCircle } from "react-icons/fa6";
import { IoInformationCircle } from "react-icons/io5";
import { GiBiceps } from "react-icons/gi";
import { Eaten } from "../../utilities/utilities";

const Meal = (props: any) => {
  const mealName = props.MealName as string;

  // Reactive state – we refresh when history changes
  const [tick, setTick] = useState(0);
  const forceUpdate = () => setTick((t) => t + 1);

  // Listen to storage changes from other components
  useEffect(() => {
    const handle = () => forceUpdate();
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  // Read stored data
  const getData = useMemo(() => {
    const raw = localStorage.getItem("Diet");
    return raw ? JSON.parse(raw) : null;
  }, [tick]);

  const History = useMemo(() => {
    return JSON.parse(localStorage.getItem("History") || "{}");
  }, [tick]);

  const FoodInfo_s = useMemo(() => {
    return JSON.parse(localStorage.getItem("FoodInfo_s") || "[]");
  }, [tick]);

  // Today's eaten dishes for this meal
  const today = new Date();
  const currentDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  const eatenDishes: string[] = useMemo(
    () => History[currentDate]?.meals?.[mealName] || [],
    [History, currentDate, mealName]
  );

  // Planned dishes
  const plannedDishes: string[] = useMemo(
    () => (getData?.[mealName]?.[0] || []),
    [getData, mealName]
  );

  // Progress info
  const totalPlanned = plannedDishes.length;
  const eatenCount = plannedDishes.filter((d) => eatenDishes.includes(d)).length;
  const progressPercent = totalPlanned > 0 ? (eatenCount / totalPlanned) * 100 : 0;
  const allEaten = totalPlanned > 0 && eatenCount === totalPlanned;

  // Calculate actually consumed nutrition for this meal today
  const consumedNutrition = useMemo(() => {
    let cal = 0,
      prot = 0;
    eatenDishes.forEach((dish) => {
      const entry = FoodInfo_s.find(
        (e: any) => e[1] === dish && e[0] === mealName
      );
      if (entry) {
        cal += entry[3] || 0; // stored calories
        prot += entry[4] || 0; // stored protein
      }
    });
    return { calories: cal, protein: prot };
  }, [eatenDishes, FoodInfo_s, mealName]);

  // Toggle dish eaten status
  const handleToggle = (dish: string) => {
    // The Eaten utility already handles toggling and updates History
    Eaten(dish, mealName);
    // After that, we need to force a refresh because Eaten modifies localStorage directly
    forceUpdate();
  };

  // Icons & names
  const mealIcons: Record<string, string> = {
    Breakfast: "🍳",
    Lunch: "🍽️",
    Snacks: "🍪",
    Dinner: "🌙",
  };
  const mealNamesAr: Record<string, string> = {
    Breakfast: "الفطور",
    Lunch: "الغداء",
    Snacks: "الوجبات الخفيفة",
    Dinner: "العشاء",
  };

  return (
    <div
      className={`relative bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl rounded-3xl p-6 space-y-5 transition-all duration-500 hover:shadow-2xl ${
        allEaten ? "ring-2 ring-green-300 shadow-green-100/50" : ""
      }`}
    >
      {/* Header with progress ring */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {mealNamesAr[mealName] || mealName}
          <span className="text-2xl">{mealIcons[mealName] || "🍽️"}</span>
        </h2>
        {/* Mini progress ring */}
        {totalPlanned > 0 && (
          <div className="relative w-10 h-10">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="url(#mealGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                strokeDashoffset="25"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {eatenCount}/{totalPlanned}
            </div>
            <svg width="0" height="0">
              <defs>
                <linearGradient id="mealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* Dish list */}
      {plannedDishes.length > 0 ? (
        <div className="grid gap-3">
          {plannedDishes.map((dish, idx) => {
            const isEaten = eatenDishes.includes(dish);
            const dishInfo = FoodInfo_s.find(
              (e: any) => e[1] === dish && e[0] === mealName
            );
            const grams = dishInfo?.[2] || "-";
            const dishCal = dishInfo?.[3]?.toFixed(1) || "0";
            const dishProt = dishInfo?.[4]?.toFixed(1) || "0";

            return (
              <button
                key={mealName + "-" + idx}
                onClick={() => handleToggle(dish)}
                className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                  isEaten
                    ? "bg-green-50 border-green-400 text-green-700 font-bold"
                    : "bg-gradient-to-r from-green-50 to-sky-50 border-sky-100 hover:border-sky-300"
                }`}
              >
                {/* Left side: dish name + weight */}
                <div className="text-start">
                  <div className="text-md font-semibold">{dish}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {grams} غرام · {dishCal} سعرة · {dishProt} غ بروتين
                  </div>
                </div>

                {/* Right side: status icon */}
                <div className="flex items-center gap-2">
                  {isEaten ? (
                    <FaCheck className="text-xl text-green-500 drop-shadow-sm" />
                  ) : (
                    <FaRegCircle className="text-xl text-gray-300 group-hover:text-sky-400 transition-colors" />
                  )}
                  <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-sky-100 transition-colors">
                    <IoInformationCircle className="text-xl text-gray-400 group-hover:text-sky-500" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-4">
          لا توجد وجبات مخططة لهذه الوجبة
        </div>
      )}

      {/* Nutrition chips – dynamic based on actual consumption */}
      <div className="flex flex-wrap gap-2.5">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
          style={{
            background: "linear-gradient(135deg, #fff3c755, #fde68a55)",
            color: "#92400e",
          }}
        >
          <FaFire className="text-base text-orange-500" />
          السعرات: {consumedNutrition.calories.toFixed(1)} 
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
          style={{
            background: "linear-gradient(135deg, #ccfbf155, #99f6e455)",
            color: "#115e59",
          }}
        >
          <GiBiceps className="text-base text-teal-500" />
          البروتين: {consumedNutrition.protein.toFixed(1)} غ 
        </div>
        {/* Optional: show total planned for comparison */}
     
      </div>

      {/* All-eaten celebration */}
      {allEaten && (
        <div className="absolute -top-2 -right-2 bg-green-400 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce">
          ✓ مكتملة
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );
};

export default Meal;