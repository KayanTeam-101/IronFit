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
    <div className="min-h-screen flex justify-center  bg-gradient-to-br from-sky-100 via-white to-purple-100 p-2">
      <div className="w-full max-w-lg  backdrop-blur-xl border border-white/50 shadow-2xl rounded-4xl p-8 space-y-2 animate-fadeIn">
        {/* Header */}
        <div className="text-center ">
          <h1 className='text-3xl relative top-5 text-sky-400 font-extrabold mb-4 text-center '>
            إيه اهدافك <span className="text-sky-500">؟</span>
          </h1>
          <p className="text-gray-500 text-sm">اختر هدفك (يمكنك اختيار أكثر من هدف)</p>
        </div>

    

        {/* Goal selection buttons */}
        <div className="grid grid-cols-2 gap-4">
          {GOALS_DATA.map((goal, idx) => {
            const isSelected = selectedGoal.includes(goal.name);
            const Icon = goal.icon;
            return (
              <button
                key={idx}
                onClick={() => handleToggle(goal.name)}
                className={`group relative flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-br from-sky-400 to-blue-500 border-transparent text-white shadow-xl scale-105"
                    : "bg-white border-gray-200 text-gray-700 hover:border-sky-300 hover:shadow-lg"
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

        {/* Reset button */}
        <div className="flex justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-gray-600 font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
          >
            <FaRegCircleDown />
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};

export default S_Goals;