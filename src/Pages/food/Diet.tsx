import React, { useEffect, useState, useMemo, useCallback } from "react";
import Meal from "./components/Meal";
import { FaCookieBite } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import foods from "../../assets/FoodsList.json";
import { VscSettings } from "react-icons/vsc";
import Settings from "./Settings";
import { giveHealthAdvice } from "../../utilities/GiveAdvice";
import { BiCalendarAlt, BiInfoCircle } from "react-icons/bi";
import { GrAddCircle } from "react-icons/gr";
import CircularProgress from "./components/circleprogress";
import { IoClose } from "react-icons/io5";
import BreakPage from "../Welcome/Components/BreakPage";
import { RiCopperCoinLine } from "react-icons/ri";

// ---------- Types ----------
type FoodInfoEntry = [string, string, number, number, number];

// The actual structure of the saved diet plan
type MealPlanData = {
  [key: string]: [string[], [number, number, number, number, string[]]];
};

type HistoryType = {
  [date: string]: {
    meals: {
      [mealName: string]: string[];
    };
  };
};

// ---------- Unit options (unchanged) ----------
interface UnitOption {
  label: string;
  grams: number | null;
}

const UNIT_OPTIONS: UnitOption[] = [
  { label: "طبق صغير (100 غ)", grams: 100 },
  { label: "طبق وسط (200 غ)", grams: 200 },
  { label: "طبق كبير (300 غ)", grams: 300 },
  { label: "قطعة (150 غ)", grams: 150 },
  { label: "كوب (200 غ)", grams: 200 },
  { label: "ملعقة كبيرة (15 غ)", grams: 15 },
  { label: "غرام (أدخل الكمية)", grams: null },
];

const GRAM_UNIT_OPTIONS = UNIT_OPTIONS.filter((u) => u.grams !== null);

// Precomputed food list for fast filtering
const FOOD_NAME_ENTRIES = foods.map((f) => ({
  name: f.FoodName,
  lower: f.FoodName.toLowerCase(),
}));

// ---------- Custom debounce hook ----------
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ---------- Helper to get today's date string ----------
const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
};

// ---------- Component ----------
const Diet = () => {
  // --- State ---
  const [history, setHistory] = useState<HistoryType>(
    () => JSON.parse(localStorage.getItem("History") || "{}")
  );
  const [foodInfoList, setFoodInfoList] = useState<FoodInfoEntry[]>(
    () => JSON.parse(localStorage.getItem("FoodInfo_s") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("History", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("FoodInfo_s", JSON.stringify(foodInfoList));
  }, [foodInfoList]);

  const [settingsOpened, setSettingsOpened] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [customGrams, setCustomGrams] = useState("");
  const [showCongratulation, setShowCongratulation] = useState(false);
  const navigate = useNavigate();

  // --- Daily calorie goal ---
  const dailyCaloriesGoal = useMemo(() => {
    const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
    const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
    const height = Number(localStorage.getItem("height") || 0);
    const age = Number(localStorage.getItem("age") || 0);
    const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
    const gender = localStorage.getItem("SelectedGender") || "";

    if (!challengePeriod || challengePeriod <= 0) return 0;

    let bmr: number;
    if (gender === "ذكر") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * 1.5;
    const weightDiff = targetWeight - currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;

    if (days === 0) return Math.round(tdee);
    return Math.round(tdee + totalCaloriesNeeded / days);
  }, []);

  useEffect(() => {
    if (dailyCaloriesGoal > 0) {
      localStorage.setItem("dailyCalories", dailyCaloriesGoal.toString());
    } else {
      localStorage.removeItem("dailyCalories");
    }
  }, [dailyCaloriesGoal]);

  // --- Derived calorie map and today's total ---
  const calorieMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of foodInfoList) {
      map.set(JSON.stringify([entry[0], entry[1]]), entry[3]);
    }
    return map;
  }, [foodInfoList]);

  const todayKey = getTodayString();
  const eatenCalories = useMemo(() => {
    const todayMeals = history[todayKey]?.meals || {};
    let total = 0;
    for (const [meal, foodNames] of Object.entries(todayMeals)) {
      for (const foodName of foodNames) {
        total += calorieMap.get(JSON.stringify([meal, foodName])) || 0;
      }
    }
    localStorage.setItem("EatenCalories", String(total));
    return total;
  }, [history, calorieMap, todayKey]);

  // --- Planned diet (re‑read only when Settings closes) ---
  const convertToObj: MealPlanData | null = useMemo(() => {
    const raw = localStorage.getItem("Diet");
    return raw ? (JSON.parse(raw) as MealPlanData) : null;
  }, [settingsOpened]);

  // --- Health advice ---
  const Advice = giveHealthAdvice();

  // --- Congratulation check on mount ---
  useEffect(() => {
    const checkAllMealsEaten = () => {
      if (Number(localStorage.getItem("dailyCalories")) <= Number(localStorage.getItem("eatenCalories"))) {
        const todayISO = new Date().toISOString().split("T")[0];
        const DoneDays = localStorage.getItem("DoneDays") || "[]";
        const LikedDays = JSON.parse(DoneDays);
        if (!LikedDays.includes(todayISO)) {
          LikedDays.push(todayISO);
          localStorage.setItem("DoneDays", JSON.stringify(LikedDays));
        }
      }
    };
    checkAllMealsEaten();

    if (localStorage.getItem("Diet") && !localStorage.getItem("hasCongratulatedDiet")) {
      localStorage.setItem("hasCongratulatedDiet", "done");
      setShowCongratulation(true);
      window.scrollBy(0, 150);
    }
  }, []);

  const hideCongratulation = () => {
    setShowCongratulation(false);
    window.scrollTo(0, 100);
    setTimeout(() => {
      navigate("/me/home");
    }, 3500);
  };

  // --- Debounced search ---
  const debouncedSearch = useDebounce(searchText, 300);
  const filteredFoods = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return [];
    return FOOD_NAME_ENTRIES.filter((f) => f.lower.includes(query)).map((f) => f.name);
  }, [debouncedSearch]);

  // --- Add unscheduled food ---
  const addFoodWithGrams = useCallback(
    (foodName: string, grams: number) => {
      const foodData = foods.find((f) => f.FoodName === foodName);
      if (!foodData) return;

      const calPerKilo = Number(foodData.calForOneKilo);
      const protPerKilo = Number(foodData.ProtineForOneKilo);
      const cal = (calPerKilo * grams) / 1000;
      const prot = (protPerKilo * grams) / 1000;

      const mealKey = "Unscheduled";
      const currentDate = getTodayString();

      setHistory((prev) => {
        const newHistory = { ...prev };
        if (!newHistory[currentDate]) newHistory[currentDate] = { meals: {} };
        const meals = { ...newHistory[currentDate].meals };
        meals[mealKey] = [...(meals[mealKey] || []), foodName];
        newHistory[currentDate] = { ...newHistory[currentDate], meals };
        return newHistory;
      });

      setFoodInfoList((prev) => [...prev, [mealKey, foodName, grams, cal, prot]]);

      setShowUnitModal(false);
      setShowAddModal(false);
      setSearchText("");
    },
    []
  );

  // --- Toggle planned dish (passed to Meal) ---
  const handleToggleDish = useCallback(
    (dish: string, mealName: string) => {
      const currentDate = getTodayString();

      setHistory((prev) => {
        const dayMeals = { ...(prev[currentDate]?.meals || {}) };
        const currentDishes = dayMeals[mealName] || [];
        const alreadyEaten = currentDishes.includes(dish);
        dayMeals[mealName] = alreadyEaten
          ? currentDishes.filter((d) => d !== dish)
          : [...currentDishes, dish];
        return {
          ...prev,
          [currentDate]: { meals: dayMeals },
        };
      });

      const alreadyEaten = history[currentDate]?.meals?.[mealName]?.includes(dish);
      if (!alreadyEaten) {
        // Adding dish – use a default weight (100g) or extract from plan if available
        const grams = 100; // You can improve this by reading actual planned grams later
        const foodData = foods.find((f) => f.FoodName === dish);
        if (foodData) {
          const cal = (Number(foodData.calForOneKilo) * grams) / 1000;
          const prot = (Number(foodData.ProtineForOneKilo) * grams) / 1000;
          setFoodInfoList((prev) => [...prev, [mealName, dish, grams, cal, prot]]);
        }
      } else {
        // Removing dish
        setFoodInfoList((prev) =>
          prev.filter((entry) => !(entry[0] === mealName && entry[1] === dish))
        );
      }
    },
    [history]
  );

  // --- Subscription status ---
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        if (decoded.SubscriptionPeriod && decoded.SubscriptionPeriod > Date.now()) {
          setIsSubscribed(true);
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []);

  // --- Unit selection handlers ---
  const handleUnitSelect = (unit: UnitOption) => {
    if (unit.grams !== null) {
      addFoodWithGrams(selectedFood, unit.grams);
    }
  };

  const handleCustomGramsSubmit = () => {
    const g = parseFloat(customGrams);
    if (isNaN(g) || g <= 0) {
      alert("الرجاء إدخال كمية صحيحة");
      return;
    }
    addFoodWithGrams(selectedFood, g);
    setCustomGrams("");
  };

  const openAddModal = () => {
    setSearchText("");
    setShowAddModal(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Congratulation overlay */}
      {showCongratulation && (
        <div
          onDoubleClick={hideCongratulation}
          className="fixed flex justify-center items-center top-0 left-0 w-screen h-screen backdrop-blur-[2px] z-50"
        >
          <div className="w-11/12 z-50 showAnim2 relative">
            <BreakPage
              heading="مبروك 🥳 "
              text="كدا نكون حققنا أول نظام غذائي , اتمني إنه يكون مناسب (ولو لقيته غير مناسب ممكن نغيره بعدين) , ومتنساش إن الاستمرارية من أهم الحاجات في الفترة دي عشان نضمن إننا نوصل ف أسرع وقت🔥"
              SvgComponent={RiCopperCoinLine}
            />
            <div
              className="absolute inset-0 -z-10 blur-3xl animate-pulse opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center p">
        <div className="text-2xl"></div>
        <div className="flex gap-2">
          <button
            onClick={() => setSettingsOpened(true)}
            className="bg-gray-100 flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 items-center gap-2 px-2 rounded-full"
          >
            <span className="text-[12px] dark:text-white">الإعدادات</span>
            <VscSettings />
          </button>
          <button
            onClick={() => navigate("/me/history")}
            className="bg-gray-100 flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 items-center gap-2 px-2 py-2 rounded-full"
          >
            <span className="text-[12px] dark:text-white">التاريخ</span>
            <BiCalendarAlt />
          </button>
        </div>
      </div>

      {/* Advice */}
      <div className="w-full rounded-3xl mb-2 p-5 flex flex-row gap-2">
        <div className="w-5 h-5">
          <FaCookieBite className="text-2xl text-amber-500 dark:text-amber-300" />
        </div>
        <p
          className="font-light text-md show-third dark:text-white"
          dangerouslySetInnerHTML={{ __html: Advice }}
        ></p>
      </div>

      {/* Progress & add unscheduled */}
      <div className="flex flex-col gap-3 mb-6">
        <CircularProgress
          current={Number(eatenCalories.toFixed(0))}
          goal={Number(dailyCaloriesGoal.toFixed(0))}
        />
        <div
          onClick={openAddModal}
          className="bg-white dark:bg-[#222]/30 rounded-xl p-4 flex flex-row items-center justify-between cursor-pointer hover:shadow-lg transition"
        >
          <span className="font-medium text-slate-600 dark:text-gray-100 mb-2 text-center">
            اكلت طعام غير مجدول
          </span>
          <GrAddCircle className="text-slate-500 dark:text-white text-xl mb-1" />
        </div>
      </div>

      {/* Planned meals – stable keys and all props passed */}
      <div className="space-y-4">
        {convertToObj &&
          (Object.keys(convertToObj) as Array<keyof MealPlanData>).map((mealName) => (
            <Meal
              key={mealName}
              mealName={mealName}
              history={history}
              foodInfoList={foodInfoList}
              dietPlan={convertToObj}
              onToggleDish={handleToggleDish}
              isSubscribed={isSubscribed}
            />
          ))}
      </div>

      {settingsOpened && <Settings />}

      {/* ---------- Add Food Modal ---------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] p-4 animate-fadeIn">
          <div className="bg-white/90 dark:bg-black/20 backdrop-blur-md border border-white/50 dark:border-black/70 shadow-2xl rounded-3xl p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">أضف طعام</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="ابحث عن طعام..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 dark:bg-slate-900/20 dark:border-gray-600/20 dark:text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              autoFocus
            />

            <div className="max-h-52 overflow-y-auto space-y-1">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-600/20 hover:bg-amber-50 rounded-xl cursor-pointer transition"
                    onClick={() => {
                      setSelectedFood(food);
                      setShowUnitModal(true);
                    }}
                  >
                    <span className="font-medium text-gray-700 dark:text-white">{food}</span>
                    <BiInfoCircle className="text-gray-400" />
                  </div>
                ))
              ) : (
                searchText.trim() && (
                  <p className="text-center text-gray-400 py-4">لا توجد نتائج</p>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Unit Selector Modal ---------- */}
      {showUnitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white/90 dark:bg-black/20 backdrop-blur-md border dark:border-black/70 border-white/50 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                اختر كمية {selectedFood}
              </h3>
              <button
                onClick={() => setShowUnitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {GRAM_UNIT_OPTIONS.map((unit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUnitSelect(unit)}
                  className="w-full flex justify-between items-center bg-orange-50 border border-amber-100 dark:bg-gray-600/15 dark:border-black p-3 rounded-xl hover:shadow-md active:scale-[0.98] transition"
                >
                  <span className="font-medium text-gray-700 dark:text-white text-shadow-xs">
                    {unit.label}
                  </span>
                  <span className="text-sm text-amber-600">{unit.grams}غ</span>
                </button>
              ))}

              {/* Custom grams */}
              <div className="pt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="أدخل كمية معينة (غرام)"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-black dark:text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-400"
                  onKeyDown={(e) => e.key === "Enter" && handleCustomGramsSubmit()}
                />
                <button
                  onClick={handleCustomGramsSubmit}
                  className="bg-amber-500 text-white px-4 rounded-xl hover:bg-amber-600 transition"
                >
                  تم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-14" />
    </div>
  );
};

export default Diet;