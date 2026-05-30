import React, { useEffect, useState, useMemo } from "react";
import Meal from "./Meal";
import { FaBowlFood  } from "react-icons/fa6";
import foods from "../../assets/FoodsList.json";
import { VscSettings } from "react-icons/vsc";
import Settings from "./Settings";
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
      [mealName: string]: string[];   // only food names (grams are in FoodInfo_s)
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

// ---------- Component ----------
const Diet = () => {
  // --- Local state ---
  const [history, setHistory] = useState<HistoryType>(
    JSON.parse(localStorage.getItem("History") || "{}")
  );
  const [eatenCalories, setEatenCalories] = useState<number>(0);
  const [settingsOpened, setSettingsOpened] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [text, setText] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [customGrams, setCustomGrams] = useState("");

  // Read planned diet
  const getDiet = localStorage.getItem("Diet");
  const convertToObj: MealPlan | null = getDiet
    ? (JSON.parse(getDiet) as MealPlan)
    : null;

  // --- Recalculate eaten calories ---
  const recalcCalories = () => {
    const currentDate = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
    const todayMeals = history[currentDate]?.meals || {};
    const foodInfoList = JSON.parse(localStorage.getItem("FoodInfo_s") || "[]");

    let total = 0;
    Object.entries(todayMeals).forEach(([meal, foodNames]) => {
      foodNames.forEach((foodName) => {
        const foodEntry = foodInfoList.find(
          (entry: any) => entry[1] === foodName && entry[0] === meal
        );
        if (foodEntry) {
          total += foodEntry[3];   // calories already calculated when added
        }
      });
    });
    setEatenCalories(total);
  };

  useEffect(() => {
    recalcCalories();
  }, [history]);

  // Sync history to localStorage on change
  useEffect(() => {
    localStorage.setItem("History", JSON.stringify(history));
  }, [history]);

  // --- Filtered search results ---
  const filteredFoods = useMemo(() => {
    if (!text.trim()) return [];
    return foods
      .map((f) => f.FoodName)
      .filter((name) => name.toLowerCase().includes(text.toLowerCase()));
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

    // Immediately recalc
    recalcCalories();

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
            onClick={() => (window.location.href = "/me/history")}
            className="bg-gray-100 flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 items-center gap-2 px-4 py-2 rounded-full"
          >
            التاريخ <BiCalendarAlt />
          </button>
        </div>
      </div>

      {/* Progress & add unscheduled button */}
      <div className="grid grid-cols-2 p-2 mb-6">
        <CircularProgress
          current={eatenCalories}
          size={140}
          strokeWidth={12}
          goal={Number(localStorage.getItem("dailyCalories") || "0")}
        />

        <div
          onClick={openAddModal}
          className="bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-4xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition"
        >
          <span className="font-medium text-slate-600 mb-2 text-center">
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
          <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-6 w-full max-w-md animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">أضف طعام</h3>
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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-400 mb-4"
              autoFocus
            />

            <div className="max-h-52 overflow-y-auto space-y-1">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 hover:bg-sky-50 rounded-xl cursor-pointer transition"
                    onClick={() => {
                      setSelectedFood(food);
                      setShowUnitModal(true);
                    }}
                  >
                    <span className="font-medium text-gray-700">{food}</span>
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
          <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
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
              {UNIT_OPTIONS.filter((u) => u.grams !== null).map((unit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUnitSelect(unit)}
                  className="w-full flex justify-between items-center bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 p-3 rounded-xl hover:shadow-md active:scale-[0.98] transition"
                >
                  <span className="font-medium text-gray-700">{unit.label}</span>
                  <span className="text-sm text-sky-600">{unit.grams}غ</span>
                </button>
              ))}

              {/* Custom grams */}
              <div className="pt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="أدخل الغرام"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400"
                  onKeyDown={(e) => e.key === "Enter" && handleCustomGramsSubmit()}
                />
                <button
                  onClick={handleCustomGramsSubmit}
                  className="bg-sky-500 text-white px-4 rounded-xl hover:bg-sky-600 transition"
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