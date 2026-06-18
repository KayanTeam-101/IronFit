import React, { useState, useEffect, useMemo } from "react";
import { FaFire, FaCheck, FaRegCircle } from "react-icons/fa6";
import { IoInformationCircle } from "react-icons/io5";
import { GiBiceps, GiMeal } from "react-icons/gi";
import { Eaten } from "../../utilities/utilities";
import { MdFreeBreakfast, type MdBreakfastDining } from "react-icons/md";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiCheckDuotone } from "react-icons/pi";

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

    const GetVitamines: string[] = useMemo(
    () => (getData?.[mealName]?.[1][2] || []),
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
    forceUpdate();
    window.location.reload(); 
  };

  // Icons & names
  const mealIcons: Record<string, React.ReactNode> = {
    Breakfast: <MdFreeBreakfast />,
    Lunch: <GiMeal />,
    Snacks: <LiaCookieBiteSolid />,
    Dinner: <PiCheckDuotone />,
  };
  const mealNamesAr: Record<string, string> = {
    Breakfast: "الفطور",
    Lunch: "الغداء",
    Snacks: "الوجبات الخفيفة",
    Dinner: "العشاء",
  };

  return (
    <div
      className={`relative bg-white/70 backdrop-blur-lg border dark:bg-black/20 dark:border dark:border-gray-600/20 border-white/50 dark:shadow-none shadow-xl rounded-3xl p-6 space-y-5 transition-all duration-500 hover:shadow-2xl ${
        allEaten ? "ring-2 ring-teal-500 shadow-green-100/50" : ""
      }`}
    >
      {/* Header with progress ring */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl dark:text-white text-gray-800 flex items-center gap-2">
          {mealNamesAr[mealName] || mealName}
          <span className="text-2xl">{mealIcons[mealName]}</span>
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
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-100">
              {eatenCount}/{totalPlanned}
            </div>
            <svg width="0" height="0">
              <defs>
                <linearGradient id="mealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1fb8f6" /> {/* teal-500 */}
            <stop offset="50%" stopColor="pink" /> {/* orange-600 */}
            <stop offset="75%" stopColor="skyblue" /> {/* orange-600 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* orange-600 */}
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
                className={`group relative flex items-center dark:bg-black/20 border-2 border-gray-600/10 justify-between p-4 rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                  isEaten
                    ? "bg-green-50  dark:text-teal-500 border-teal-400 border-2 text-green-700  hover:opacity-50"
                    : "bg-amber-50 dark:bg-slate-600/20 dark:text-white border-amber-100/30 hover:border-amber-300"
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
                    <FaCheck className="text-xl text-green-500 dark:text-teal-500 drop-shadow-sm" />
                  ) : (
                    <FaRegCircle className="text-xl text-gray-300 group-hover:text-amber-400 transition-colors" />
                  )}
               
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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-amber-600 rounded-full text-sm font-medium  dark:text-white dark:bg-black"
          style={{
            // background: "linear-gradient(135deg, #fff3c755, #fde68a55)",
            color: "#92400e",
          }}
        >
          <FaFire className="text-base text-orange-500" />
          السعرات: {consumedNutrition.calories.toFixed(1)} 
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-amber-600 rounded-full text-sm font-medium  dark:text-white dark:bg-black"
          style={{
            color: "#115e59",
          }}
        >
          <GiBiceps className="text-base text-teal-500" />
          البروتين: {consumedNutrition.protein.toFixed(1)} غ 
        </div>
          <div className="flex gap-1 flex-wrap w-11/12 ">
            {GetVitamines.map(e => <span className="p-1 text-indigo-600 bg-indigo-50 rounded-xl dark:text-gray-100 border border-gray-200/30 dark:bg-black">{e}</span>)}
          </div>
      </div>

      {/* All-eaten celebration */}
      {allEaten && (
        <div className="absolute -top-2.5 right-0 bg-teal-500 text-white text-xs px-3 py-1 rounded-2xl rounded-br-none">
           مكتملة
        </div>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );
};

export default Meal;