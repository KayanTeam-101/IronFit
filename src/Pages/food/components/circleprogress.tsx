import React from "react";
import { HiFire } from "react-icons/hi2";
import { useCountUp } from "../../../Hooks/Increasing";

interface ModernLinearProgressProps {
  goal: number; // Daily target calories
  current: number; // Eaten calories
  width?: string; // e.g., "100%" or "350px"
  dir?: "rtl" | "ltr"; // Defaults to "rtl"
}

const ModernLinearProgress: React.FC<ModernLinearProgressProps> = ({
  goal,
  current,
  width = "100%",
  dir = "rtl",
}) => {
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div
      dir={dir}
      className="flex items-center gap-3 w-full bg-white dark:bg-[#222]/30 rounded-xl p-4 "
      style={{ maxWidth: width }}
    >
   

      {/* Main Progress Bar Outer Track */}
      <div className="relative flex-1 h-5 rounded-full bg-slate-100 dark:bg-[#111] p-1 shadow-inner border border-slate-200/50 dark:border-slate-700/50">
        {/* Animated Filled Bar */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-l from-orange-500 to-amber-400 shadow-md"
          style={{ width: `${percent}%` }}
        />

        {/* Text Overlay */}
        <div className="absolute -top-8 inset-0 flex items-center justify-between px-4 text-xs font-bold text-slate-700 dark:text-slate-200">
<span>
            {current.toLocaleString()} 

</span>
          <span>
             {goal.toLocaleString()}{" "}
          </span>
        </div>
      </div>

      {/* Percentage Indicator */}
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 font-black border-orange-400/40 border dark:bg-amber-500/20 shrink-0">
        {useCountUp(Math.round(percent),700)}%
      </div>
    </div>
  );
};

export default ModernLinearProgress;