import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiCoffee,
  FiSun,
  FiMoon,
  FiClock,
  FiBookOpen,
} from "react-icons/fi";

// نوع البيانات
type DayMeals = Record<string, string[]>;
type History = Record<string, { meals: DayMeals }>;

// أيقونات ملونة لكل وجبة
const MEAL_ICONS: Record<string, React.ReactNode> = {
  breakfast: <FiCoffee className="text-sky-500" />,
  lunch: <FiSun className="text-emerald-500" />,
  dinner: <FiMoon className="text-purple-400" />,
  default: <FiClock className="text-gray-400" />,
};

// ألوان النقاط الصغيرة بجانب الأطباق حسب الوجبة
const MEAL_DOT_COLORS: Record<string, string> = {
  breakfast: "bg-sky-400",
  lunch: "bg-emerald-400",
  dinner: "bg-purple-400",
  default: "bg-gray-400",
};

const FoodHistoryPage = () => {
  const [history, setHistory] = useState<History>({});
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem("History");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const dates = Object.keys(history).sort().reverse();
  const totalDays = dates.length;
  const totalDishesAll = dates.reduce((sum, date) => {
    const meals = history[date].meals;
    return sum + Object.values(meals).reduce((s, arr) => s + arr.length, 0);
  }, 0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-black/20 dark:to-[#111] p-4 md:p-8 mb-20">
      <div className="max-w-3xl mx-auto">
        {/* رأس الصفحة مع ملخص */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
        
              <div>
                <h1 className="text-3xl m-1 font-bold text-slate-800 dark:text-white">
                  التاريخ الغذائي
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {totalDays > 0
                    ? `${totalDays} أيام مسجلة · ${totalDishesAll} صنف`
                    : "لم تُسجل وجبات بعد"}
                </p>
              </div>
            </div>
            <div className="hidden sm:block px-4 py-2 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-md border border-white/20">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {totalDays > 0 ? `${totalDays} أيام` : "فارغ"}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent dark:via-slate-600" />
        </div>

        {/* حالة فارغة */}
        {dates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-8 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-2xl mb-6 border border-white/20">
              <FiCoffee className="text-6xl text-slate-300 dark:text-slate-500" />
            </div>
            <p className="text-2xl font-medium text-slate-500 dark:text-slate-400">
              لا توجد وجبات مسجلة بعد
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-2">
              ابدأ بإضافة وجباتك اليومية من الصفحة الرئيسية
            </p>
          </div>
        ) : (
          /* قائمة الأكورديون */
          <div className="space-y-4">
            {dates.map((date) => {
              const isOpen = openDates.has(date);
              const dayData = history[date].meals;
              const mealCategories = Object.keys(dayData);
              const totalDishes = mealCategories.reduce(
                (sum, meal) => sum + dayData[meal].length,
                0
              );

              return (
                <div
                  key={date}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 dark:border-slate-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* زر التوسيع */}
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full flex items-center justify-between p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <FiCalendar className="text-xl text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <div className="text-start">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                          {date}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {totalDishes} {totalDishes === 1 ? "صنف" : "أصناف"}
                        </p>
                      </div>
                    </div>
                    <FiChevronDown
                      className={`text-2xl text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* المحتوى */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 space-y-3">
                      {mealCategories.map((meal) => (
                        <div
                          key={meal}
                          className="bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">
                              {MEAL_ICONS[meal] || MEAL_ICONS.default}
                            </span>
                            <h3 className="font-medium text-slate-700 dark:text-slate-200 capitalize">
                              {meal}
                            </h3>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dayData[meal].map((dish, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800/60 rounded-xl shadow-sm text-slate-700 dark:text-slate-200"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    MEAL_DOT_COLORS[meal] || MEAL_DOT_COLORS.default
                                  }`}
                                ></span>
                                {dish}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodHistoryPage;