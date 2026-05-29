import React, { useState } from "react";
import {
  FaWeightScale,
  FaRegCircleDown,
  FaCheck,
} from "react-icons/fa6";
import { GiMuscleUp, GiBodyHeight, GiShoulderArmor } from "react-icons/gi";

// Map each goal to an icon and a short English key (optional)
const GOALS_DATA = [
  { name: "تعديل الوزن", icon: FaWeightScale, color: "text-amber-500" },
  { name: "بناء عضلات", icon: GiMuscleUp, color: "text-red-500" },
  { name: "زيادة طول", icon: GiBodyHeight, color: "text-emerald-500" },
  { name: "زيادة عرض الاكتاف", icon: GiShoulderArmor, color: "text-purple-500" },
];

const S_Goals: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string[]>(
    localStorage.getItem("SelectedGoal")
      ? JSON.parse(localStorage.getItem("SelectedGoal") || "[]")
      : []
  );

  // Toggle goal selection
  const handleToggle = (goal: string) => {
    const newSelection = selectedGoal.includes(goal)
      ? selectedGoal.filter((g) => g !== goal)
      : [...selectedGoal, goal];
    setSelectedGoal(newSelection);
    localStorage.setItem("SelectedGoal", JSON.stringify(newSelection));
  };

  const reset = () => {
    localStorage.setItem("SelectedGoal", JSON.stringify([]));
    setSelectedGoal([]);
  };

  return (
    <div className="min-h-screen flex justify-center  p-2">
      <div className="w-full max-w-lg  rounded-4xl p-8 space-y-2 ">
        {/* Header */}
        <div className="text-center ">
          <h1 className='text-3xl relative  text-sky-400 dark:text-white font-extrabold mb-4 text-center '>
            إيه اهدافك <span className="text-sky-500">؟</span>
          </h1>
        </div>

    

        {/* Goal selection buttons */}
        <div className="grid grid-cols-2 gap-4 mt-20">
          {GOALS_DATA.map((goal, idx) => {
            const isSelected = selectedGoal.includes(goal.name);
            const Icon = goal.icon;
            return (
              <button
                key={idx}
                onClick={() => handleToggle(goal.name)}
                className={`group relative flex flex-col items-center justify-center p-5 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-3xl border-2 transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-blue-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border-transparent text-white  scale-105"
                    : "bg-white dark:bg-black/20 dark:text-white dark:border-2 dark:border-gray-600/20 opacity-60 border-gray-200 text-gray-700 hover:border-sky-300 "
                }`}
              >
                <Icon
                  className={`text-4xl mb-2 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-white" : goal.color
                  }`}
                />
                <span className="font-semibold text-lg">{goal.name}</span>
                {isSelected && (
                  <FaCheck className="absolute top-2 right-2 text-white text-lg" />
                )}
              </button>
            );
          })}
        </div>

 =
      </div>
    </div>
  );
};

export default S_Goals;