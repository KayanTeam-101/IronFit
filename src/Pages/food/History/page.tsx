import React, { useEffect, useState } from "react";
import { FiCalendar, FiChevronDown, FiCoffee, FiSun, FiMoon, FiClock } from "react-icons/fi";

// Improved typing for History
type DayMeals = Record<string, string[]>;
type History = Record<string, { meals: DayMeals }>;

const MEAL_ICONS: Record<string, React.ReactNode> = {
  breakfast: <FiCoffee className="text-amber-500" />,
  lunch: <FiSun className="text-orange-500" />,
  dinner: <FiMoon className="text-sky-500" />,
  default: <FiClock className="text-gray-500" />,
};

const Page = () => {
  const [history, setHistory] = useState<History>({});
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const getWightOfMeals = JSON.parse(localStorage.getItem("FoodInfo_s") || "{}");
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

  if (!history) {
    window.location.href = "/";
    console.log(Object.keys(history).length);
    console.log(Object.keys(history));

    
  }


  const dates = Object.keys(history).sort().reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 mb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-md">
              <FiCalendar className="text-2xl text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold  bg-clip-text text-slate-800 ">
              التاريخ الغذائي
            </h1>
          </div>
         
        </div>

        {/* Empty state */}
        {dates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-white rounded-full shadow-lg mb-6">
              <FiCoffee className="text-5xl text-slate-300" />
            </div>
            <p className="text-xl text-slate-400 font-medium">لا توجد وجبات مسجلة بعد</p>
            <p className="text-slate-300 mt-2">ابدأ بإضافة وجباتك اليومية</p>
          </div>
        ) : (
          /* Accordion list */
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
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  {/* Accordion trigger */}
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full flex items-center justify-between p-5 text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-50 rounded-xl">
                        <FiCalendar className="text-xl text-sky-600" />
                      </div>
                      <div className="text-start">
                        <h2 className="text-lg font-semibold text-gray-800">{date}</h2>
                        <p className="text-sm text-gray-500">{totalDishes} أصناف</p>
                      </div>
                    </div>
                    <FiChevronDown
                      className={`text-2xl text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Accordion content */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 pt-1 space-y-4">
                      {mealCategories.map((meal) => (
                        <div key={meal} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">
                              {MEAL_ICONS[meal] || MEAL_ICONS.default}
                            </span>
                            <h3 className="font-medium text-gray-700 capitalize">
                              {meal}
                            </h3>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dayData[meal].map((dish, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm text-gray-600"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                {dish}
                                <span className="mb-3 text-sm text-gray-400">
                                   {
    getWightOfMeals.find(
      (e: [string, string, number]) =>{
        console.log(e[0], e[1],e[2]);
        
      return  e[1] === dish && e[0] === meal
      }
    )?.[2]
  } غرام
                                </span>
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

export default Page;