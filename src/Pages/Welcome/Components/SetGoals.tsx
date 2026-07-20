import React, { useState } from "react";
import {
  FaWeightScale,
  FaCheck,
  
} from "react-icons/fa6";
import { GiMuscleUp, GiBodyHeight, GiShoulderArmor } from "react-icons/gi";

const GOALS_DATA = [
  { name: "تعديل الوزن", icon: FaWeightScale, color: "from-amber-500 to-yellow-400" },
  { name: "بناء عضلات", icon: GiMuscleUp, color: "from-red-500 to-rose-500" },
  { name: "زيادة طول", icon: GiBodyHeight, color: "from-emerald-500 to-green-400" },
  { name: "زيادة عرض الاكتاف", icon: GiShoulderArmor, color: "from-purple-500 to-violet-400" },
];

const S_Goals: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string[]>(
    localStorage.getItem("SelectedGoal")
      ? JSON.parse(localStorage.getItem("SelectedGoal") || "[]")
      : []
  );

  const handleToggle = (goal: string) => {
    const newSelection = selectedGoal.includes(goal)
      ? selectedGoal.filter((g) => g !== goal)
      : [...selectedGoal, goal];
    setSelectedGoal(newSelection);
    localStorage.setItem("SelectedGoal", JSON.stringify(newSelection));
  };


  return (
    <div className="flex flex-col items-center justify-center px-4 pt-6 pb-2">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400 rounded-full  blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400 rounded-full  blur-3xl animate-pulse" />

      {/* Header */}
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl font-extrabold dark:text-white tracking-wide">
          إيه أهدافك <span className="text-amber-500">؟</span>
        </h1>
        <p className="text-gray-400 mt-2">اختر هدفًا أو أكثر عشان أعرف اهدافك !</p>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {GOALS_DATA.map((goal, idx) => {
          const isSelected = selectedGoal.includes(goal.name);
          const Icon = goal.icon;
          return (
            <button
              key={idx}
              onClick={() => handleToggle(goal.name)}
              className={`group relative flex flex-col items-center justify-center p-5 rounded-3xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95
                ${
                  isSelected
                    ? "bg-gradient-to-br " + goal.color + " text-white shadow-lg shadow-amber-500/20 border-amber-400/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }
              `}
            >
              <div
                className={`mb-2 p-3 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "bg-white/20"
                    : "bg-gray-800/50 group-hover:bg-gray-700/50"
                }`}
              >
                <Icon
                  className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${
                    isSelected ? "text-white drop-shadow-md" : goal.color
                  }`}
                />
              </div>
              <span className="font-bold text-sm">{goal.name}</span>

              {/* Checkmark badge */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-bounce-in">
                  <FaCheck className="text-black text-xs" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
  
    </div>
  );
};

export default S_Goals;