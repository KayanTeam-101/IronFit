import React, { useEffect, useState, useMemo, useCallback } from "react";
import Meal from "./components/Meal";
import { FaBowlFood, FaCookieBite } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import foods from "../../assets/FoodsList.json";
import { VscSettings } from "react-icons/vsc";
import Settings from "./Settings";
import { giveHealthAdvice } from "../../utilities/GiveAdvice";
import { BiCalendarAlt, BiInfoCircle } from "react-icons/bi";
import { GrAddCircle } from "react-icons/gr";
import CircularProgress from "./components/circleprogress";
import { IoClose } from "react-icons/io5";

// ---------- Types ----------
type MealPlan = {
  Breakfast: string[];
  Lunch: string[];
  Snacks: string[];
  Dinner: string[];
};

type HistoryType = {
  [date: string]: {
    meals: {
      [mealName: string]: string[]; // only food names (grams are in FoodInfo_s)
    };
  };
};

// ---------- Unit options (same as before) ----------
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

// Precomputed once at module load — avoids filtering this tiny array on every render
const GRAM_UNIT_OPTIONS = UNIT_OPTIONS.filter((u) => u.grams !== null);

// Precomputed once at module load — avoids mapping/lowercasing the whole
// food list on every keystroke in the search box
const FOOD_NAME_ENTRIES = foods.map((f) => ({
  name: f.FoodName,
  lower: f.FoodName.toLowerCase(),
}));

// ---------- Component ----------
const Diet = () => {
  // --- Local state ---
  const [history, setHistory] = useState<HistoryType>(
    () => JSON.parse(localStorage.getItem("History") || "{}")
  );
  const [eatenCalories, setEatenCalories] = useState<number>(0);
  const [settingsOpened, setSettingsOpened] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [text, setText] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [customGrams, setCustomGrams] = useState("");
  const navigate = useNavigate();
  // --- Daily calorie goal (computed once on mount from saved profile data) ---
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

    const tdee = bmr * 1.5; // activity factor
    const weightDiff = targetWeight - currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;

    if (days === 0) return Math.round(tdee);
    const daily = tdee + totalCaloriesNeeded / days;
    return Math.round(daily);
  }, []);

  useEffect(() => {
    if (dailyCaloriesGoal > 0) {
      localStorage.setItem("dailyCalories", dailyCaloriesGoal.toString());
    } else {
      localStorage.removeItem("dailyCalories");
    }
    
  }, [dailyCaloriesGoal]);
  const Advice = giveHealthAdvice();

  // Read planned diet — re-parsed only on mount and whenever Settings closes,
  // since that's the only place the saved plan can change
  const convertToObj: MealPlan | null = useMemo(() => {
    const getDiet = localStorage.getItem("Diet");
    return getDiet ? (JSON.parse(getDiet) as MealPlan) : null;
  }, [settingsOpened]);

  // --- Recalculate eaten calories ---
   const recalcCalories = useCallback(() => {
    const today = new Date();
    const currentDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const todayMeals = history[currentDate]?.meals || {};
    const foodInfoList: any[] = JSON.parse(localStorage.getItem("FoodInfo_s") || "[]");

    // Build a (meal, food) -> calories lookup once — O(n) — instead of
    // scanning the whole FoodInfo_s list for every food item — O(n*m)
    const calorieMap = new Map<string, number>();
    for (const entry of foodInfoList) {
      const key = JSON.stringify([entry[0], entry[1]]);
      if (!calorieMap.has(key)) {
        calorieMap.set(key, entry[3]);
      }
    }

    let total = 0;
    for (const [meal, foodNames] of Object.entries(todayMeals)) {
      for (const foodName of foodNames) {
        const cal = calorieMap.get(JSON.stringify([meal, foodName]));
        if (cal !== undefined) total += cal;
      }
    }
    localStorage.setItem("EatenCalories",String(total))
    setEatenCalories(total);
  }, [history]);

  // Sync history to localStorage on change
  useEffect(() => {
    localStorage.setItem("History", JSON.stringify(history));
    recalcCalories();
  }, [history, recalcCalories]);
  useEffect(() =>{
    function CheckAllMealsHasEatn(){
    if (localStorage.getItem("dailyCalories") === localStorage.getItem("eatenCalories")) {
       const today = new Date().toISOString().split("T")[0];
    const DoneDays = localStorage.getItem("DoneDays") || "[]";
    const LikedDays = JSON.parse(DoneDays);
    if (!LikedDays.includes(today)) {
      LikedDays.push(today);
      localStorage.setItem("DoneDays", JSON.stringify(LikedDays));
    } else {
      return; // Already liked today, exit early
    }

    }
   }
   CheckAllMealsHasEatn()
  },[])
  // --- Filtered search results ---
  const filteredFoods = useMemo(() => {
    const query = text.trim().toLowerCase();
    if (!query) return [];
    return FOOD_NAME_ENTRIES.filter((f) => f.lower.includes(query)).map((f) => f.name);
  }, [text]);

  // --- Food addition logic ---
  const addFoodWithGrams = (foodName: string, grams: number) => {
    const today = new Date();
    const currentDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    // Get food data
    const foodData = foods.find((f) => f.FoodName === foodName);
    if (!foodData) return;

    const calPerKilo = Number(foodData.calForOneKilo);
    const protPerKilo = Number(foodData.ProtineForOneKilo);
    const cal = (calPerKilo * grams) / 1000;
    const prot = (protPerKilo * grams) / 1000;

    // We'll add to "Unscheduled" meal (or you can add a selector)
    const mealKey = "Unscheduled";

    // Update history
    setHistory((prev) => {
      const newHistory = { ...prev };
      if (!newHistory[currentDate]) {
        newHistory[currentDate] = { meals: {} };
      }
      const meals = { ...newHistory[currentDate].meals };
      meals[mealKey] = [...(meals[mealKey] || []), foodName];
      newHistory[currentDate] = { ...newHistory[currentDate], meals };
      return newHistory;
    });

    // Update FoodInfo_s (used for calorie calculation)
    const foodInfoList = JSON.parse(localStorage.getItem("FoodInfo_s") || "[]");
    foodInfoList.push([mealKey, foodName, grams, cal, prot]);
    localStorage.setItem("FoodInfo_s", JSON.stringify(foodInfoList));

    // Updating `history` above triggers the effect that recalculates
    // eatenCalories with up-to-date data — no need to call it again here.

    // Close modals
    setShowUnitModal(false);
    setShowAddModal(false);
    setText("");
  };

  const handleUnitSelect = (unit: UnitOption) => {
    if (unit.grams !== null) {
      addFoodWithGrams(selectedFood, unit.grams);
    } else {
      // wait for custom grams
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

  // Open food search modal
  const openAddModal = () => {
    setText("");
    setShowAddModal(true);
  };

  return (
    <div className="relative min-h-screen  ">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="text-2xl">
          <FaBowlFood className="dark:text-white"/>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSettingsOpened(true)}
            className="bg-gray-100 flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 items-center gap-2 px-4 py-2 rounded-full"
          >
            الاعدادات <VscSettings />
          </button>
          <button
            onClick={() => navigate("/me/history")}
            className="bg-gray-100 flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 items-center gap-2 px-4 py-2 rounded-full"
          >
            التاريخ <BiCalendarAlt />
          </button>
        </div>
      </div>
 <div className="w-full rounded-3xl mb-2 p-5 flex flex-row gap-2">
<div className="w-5 h-5">
              <FaCookieBite className="text-2xl text-amber-500 dark:text-amber-300" />

</div>
              <p className="font-light text-md show-third dark:text-white" dangerouslySetInnerHTML={{__html:Advice}}></p>
            </div>
      {/* Progress & add unscheduled button */}
      <div className="grid grid-cols-2 p-2 mb-6">
        <CircularProgress
          current={eatenCalories}
          size={140}
          strokeWidth={12}
          goal={dailyCaloriesGoal}
        />

        <div
          onClick={openAddModal}
          className="bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-4xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition"
        >
          <span className="font-medium text-slate-600 dark:text-gray-100 mb-2 text-center">
            اكلت طعام غير مجدول
          </span>
          <GrAddCircle className="text-slate-500 text-2xl" />
        </div>
      </div>

      {/* Planned meals */}
      <div className=" space-y-4">
        {convertToObj &&
          (Object.keys(convertToObj) as Array<keyof MealPlan>).map(
            (key, idx) => <Meal key={idx} MealName={key} />
          )}
      </div>

      {settingsOpened && <Settings />}

      {/* ---------- Add Food Modal ---------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 dark:bg-slate-900/20 dark:border-gray-600/20 dark:text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              autoFocus
            />

            <div className="max-h-52 overflow-y-auto space-y-1">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-600/20  hover:bg-amber-50 rounded-xl cursor-pointer transition"
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
                text.trim() && (
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
          <div className="bg-white/90 dark:bg-black/20 backdrop-blur-md border dark:border-black/70 border-white/50   shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-scaleIn">
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
                  className="w-full flex justify-between items-center bg-orange-50 border border-amber-100 dark:bg-gray-600/15 dark:border-black   p-3 rounded-xl hover:shadow-md active:scale-[0.98] transition"
                >
                  <span className="font-medium text-gray-700 dark:text-white text-shadow-xs">{unit.label}</span>
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

      {/* Spacer for bottom nav */}
      <div className="h-14" />
    </div>
  );
};

export default Diet;