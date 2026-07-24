import React, { useState, useEffect, useMemo } from "react";
import { FaCheck, FaLeaf, FaRegCircle } from "react-icons/fa6";
import { FaFire, FaTachometerAlt } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import { GiBiceps, GiMeal, GiWheat } from "react-icons/gi";
import { Eaten } from "../../../utilities/utilities";
import { MdFreeBreakfast } from "react-icons/md";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { BiMoon } from "react-icons/bi";

const Meal = (props: any) => {
  const mealName = props.MealName as string;
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

  const [tick, setTick] = useState(0);
  const forceUpdate = () => setTick((t) => t + 1);

  useEffect(() => {
    const handle = () => forceUpdate();
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

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

  // Use zero-padded date to match the key created by the Eaten utility
const today = new Date();
const currentDate = `${today.getFullYear()}/${String(today.getMonth() + 1)}/${String(today.getDate())}`;
const eatenDishes: string[] = useMemo(
  () => History[currentDate]?.meals?.[mealName] || [],
  [History, currentDate, mealName]
);

const consumedNutrition = useMemo(() => {
  let cal = 0, prot = 0, fat = 0, carb = 0;

  eatenDishes.forEach((dish) => {
    const entry = FoodInfo_s.find(
      (e: any) => e[1] === dish && e[0] === mealName
    );
    if (entry) {
      cal += Number(entry[3]) || 0;
      prot += Number(entry[4]) || 0;
      fat += Number(entry[5]) || 0;
      carb += Number(entry[6]) || 0;
    }
  });

  // If nothing eaten yet, fall back to the planned totals from getData
 if (eatenDishes.length === 0 && getData?.[mealName]?.[1]) {
  const planned = getData[mealName][1];
  return {
    calories: Number(planned[0]) || 0,
    protein: Number(planned[1]) || 0,
    Fat: Number(planned[2]) || 0,
    Carb: Number(planned[3]) || 0,
  };
}

  return { calories: cal, protein: prot, Fat: fat, Carb: carb };
}, [eatenDishes, FoodInfo_s, mealName, getData]);

  const plannedDishes: string[] = useMemo(
    () => (getData?.[mealName]?.[0] || []),
    [getData, mealName]
  );

  const GetVitamines: string[] = useMemo(
    () => (getData?.[mealName]?.[1]?.[4] || []),
    [getData, mealName]
  );

  const totalPlanned = plannedDishes.length;
  const eatenCount = plannedDishes.filter((d) => eatenDishes.includes(d)).length;
  const progressPercent = totalPlanned > 0 ? (eatenCount / totalPlanned) * 100 : 0;
  const allEaten = totalPlanned > 0 && eatenCount === totalPlanned;



  const handleToggle = (dish: string) => {
    Eaten(dish, mealName);
    localStorage.setItem(mealName +"-prot",String(consumedNutrition.protein));
    localStorage.setItem(mealName +"-carb",String(consumedNutrition.Carb));
    forceUpdate();
    window.location.reload();
  };

  const mealIcons: Record<string, React.ReactNode> = {
    Breakfast: <MdFreeBreakfast />,
    Lunch: <GiMeal />,
    Snacks: <LiaCookieBiteSolid />,
    Dinner: <BiMoon />,
  };
  const mealNamesAr: Record<string, string> = {
    Breakfast: "الفطور",
    Lunch: "الغداء",
    Snacks: "الوجبات الخفيفة",
    Dinner: "العشاء",
  };

  return (
    <div
      className={`relative bg-white/70 backdrop-blur-lg border dark:bg-[#222]/20 dark:border dark:border-gray-600/20 border-white/50 dark:shadow-none shadow-xl rounded-3xl p-6 space-y-5 transition-all duration-500 hover:shadow-2xl ${
        allEaten ? "ring-2 ring-teal-500 shadow-green-100/50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl dark:text-white text-gray-800 flex items-center gap-2">
          {mealNamesAr[mealName] || mealName}
          <span className="text-2xl">{mealIcons[mealName]}</span>
        </h2>
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
                  <stop offset="0%" stopColor="#1fb8f6" />
                  <stop offset="50%" stopColor="pink" />
                  <stop offset="75%" stopColor="skyblue" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

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
                    ? "bg-green-50  dark:text-green-500 border-green-400/50 dark:bg-teal-500/10 text-green-700  hover:opacity-50"
                    : "bg-blue-50 dark:bg-slate-600/20 dark:text-white border-amber-100/30 hover:border-amber-300"
                }`}
              >
                <div className="text-start">
                  <div className="text-md font-semibold">{dish}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {grams} غرام · {dishCal} سعرة · {dishProt} غ بروتين
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEaten ? (
                    <FaCheck className="text-xl text-green-500 drop-shadow-sm" />
                  ) : (
                    <FaRegCircle className="text-xl text-gray-300/50 group-hover:text-amber-400 transition-colors" />
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

      <div className="flex flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-rose-500 bg-rose-500/3 rounded-full text-sm font-black">
          <FaFire className="text-base text-rose-500" />
          السعرات: {consumedNutrition.calories.toFixed(1)}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/3 text-emerald-500 rounded-full text-sm font-black">
          <GiBiceps className="text-base text-teal-500" />
          البروتين: {consumedNutrition.protein.toFixed(1)} غ
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/3 text-orange-500 rounded-full text-sm font-black">
          <FaTachometerAlt className="text-base text-orange-500" />
          الدهون: {consumedNutrition.Fat.toFixed(1)} غ
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/3 text-amber-500 rounded-full text-sm font-black">
          <GiWheat className="text-base text-amber-500" />
          كارب {consumedNutrition.Carb.toFixed(1)} غ
        </div>
        <div>
          <div className="flex flex-row gap-2 p-3 dark:text-white">
            الفيتامينات و المعادن <FaLeaf className="text-green-400" />
          </div>
          <div className="flex gap-1 flex-wrap w-11/12">
            {IsActive
              ? Array.from(GetVitamines).map((e) => (
                  <span className="p-1 text-gray-600 bg-stone-100 rounded-xl dark:text-gray-100 dark:bg-[#121212] flex flex-row gap-1 px-2">
                    {e} <FaCheck className="text-sm mt-1 text-green-600" />
                  </span>
                ))
              : Array.from(GetVitamines).map(() => (
                  <div className="p-1 text-amber-500 bg-stone-100 rounded-3xl dark:text-gray-100 dark:bg-black flex flex-row gap-1 px-3 justify-center items-center">
                    <IoDiamond className="mb-1 text-sm text-amber-400" /> VIP
                  </div>
                ))}
          </div>
        </div>
      </div>

      {allEaten && (
        <div className="absolute -top-2.5 right-0 bg-teal-500 text-white text-xs px-3 py-1 rounded-2xl rounded-br-none">
          مكتملة
        </div>
      )}
    </div>
  );
};

export default Meal;