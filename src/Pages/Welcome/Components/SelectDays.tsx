import React, { useState } from "react";
import {
  FaCheckCircle,
  FaRedoAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

// Map day names to short codes for styling (optional)
const DAY_MAP: Record<string, { ar: string; code: string }> = {
  السبت: { ar: "السبت", code: "Sa" },
  الأحد: { ar: "الأحد", code: "Su" },
  الإثنين: { ar: "الإثنين", code: "Mo" },
  الثلاثاء: { ar: "الثلاثاء", code: "Tu" },
  الأربعاء: { ar: "الأربعاء", code: "We" },
  الخميس: { ar: "الخميس", code: "Th" },
  الجمعة: { ar: "الجمعة", code: "Fr" },
};

const SelectDays: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    localStorage.getItem("SelectedDays")
      ? JSON.parse(localStorage.getItem("SelectedDays") || "[]")
      : []
  );

  const toggleDay = (day: string) => {
    const newSelection = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newSelection);
    localStorage.setItem("SelectedDays", JSON.stringify(newSelection));
  };

  const resetAll = () => {
    localStorage.setItem("SelectedDays", JSON.stringify([]));
    setSelectedDays([]);
  };

  const totalDays = 7;
  const selectedCount = selectedDays.length;

  return (
    <div className="h-full w-full flex  justify-center">
      <div className="relative w-11/12 max-w-lg mt-5 ">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-3xl" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
          
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            إيه أيام التمرين <span className="text-sky-500">؟</span>
          </h2>
  
        </div>

        {/* Progress bar */}
        

        {/* Selected days chips */}
        {selectedCount > 0 ? (
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            {selectedDays.map((day, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 dark:text-white bg-white/80 dark:border-black/30 dark:bg-black/20 dark:border border border-sky-200  rounded-full text-sm font-medium text-sky-700"
              >
                {day}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDay(day);
                  }}
                  className="text-sky-400 dark:text-white hover:text-red-500 transition"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 text-lg mb-5">...</p>
        )}

        {/* Day buttons */}
        <div className="grid grid-cols-2 gap-3">
          {Object.values(DAY_MAP).map((day) => {
            const isSelected = selectedDays.includes(day.ar);
            return (
              <button
                key={day.ar}
                onClick={() => toggleDay(day.ar)}
                className={`relative flex items-center justify-center gap-2 p-4 rounded-3xl border-2 font-semibold text-lg transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-blue-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border-transparent text-white  scale-105"
                    : "bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 opacity-60 border-gray-200 text-gray-700 hover:border-sky-300 "
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isSelected ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {day.code}
                </span>
                <span>{day.ar}</span>
                {isSelected && (
                  <FaCheckCircle className="absolute top-1.5 right-1.5 text-white text-sm" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default SelectDays;