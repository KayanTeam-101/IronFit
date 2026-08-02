import React, { useState, useEffect } from "react";
import { BiDumbbell } from "react-icons/bi";
import { BsCaretLeftFill } from "react-icons/bs";
import { FaFire } from "react-icons/fa";
import { GiBiceps, GiWheat } from "react-icons/gi";
import { useNavigate } from "react-router";
import { giveHealthAdvice } from "../../../utilities/GiveAdvice";

const TodayTask = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(0);
  const [isRestDay, setIsRestDay] = useState(false);

  useEffect(() => {
    const startTime = Number(localStorage.getItem("StartedAT") || Date.now());
    const today = new Date();
    const daysSinceStart =
      Math.floor((today.getTime() - startTime) / 86400000) + 1;
    const totalDays =
      Number(localStorage.getItem("challengePeriod") || 0) * 30;
    setCurrentDay(Math.min(daysSinceStart, totalDays));
  }, []);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("none-exercise") || "[]"
    );
    setIsRestDay(stored.includes(currentDay));
  }, [currentDay]);

  useEffect(() => {
    giveHealthAdvice();
  }, []);

  // Read directly from localStorage (no need for state)
  const totalProtine = Number(localStorage.getItem("totalProtine") || 0);
  const totalCarb = Number(localStorage.getItem("totalCarb") || 0);
  const eatenCalories = localStorage.getItem("EatenCalories")
    ? Number(localStorage.getItem("EatenCalories"))
    : null;
  const dailyCalories = Number(localStorage.getItem("dailyCalories") || 0);

  const ProgressBar = ({
    current,
    target,
    color,
  }: {
    current: number | null;
    target: number;
    color: string;
  }) => {
    const percent =
      current !== null ? Math.min((current / target) * 100, 100) : 0;
    return (
      <div className="w-full mt-1">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 show-fast ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="p-1">
            {current?.toFixed(1) ?? "0"}
            {target < 500 ? "جم" : ""}
          </span>
          <span className="p-1">{target.toFixed(1)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className=" p-4 mb-6.5">
      <div
        className={`${
          localStorage.getItem("Diet") ? "" : "opacity-30"
        } ${
            localStorage.getItem("hasCongratulatedDiet") &&
            !localStorage.getItem("openXpBefore")
              ? "opacity-20"
              : ""
          } flex items-center justify-between pb-2`}
      >
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          أهداف اليوم
          <span className="text-sm text-gray-500 dark:text-gray-400">
            (اليوم {currentDay})
          </span>
        </h3>
      </div>

      <div className="flex flex-col gap-2 justify-center">
        <div
          className={`flex flex-col items-start min-w-[100px] active:scale-90 active:opacity-50 transition delay-100 flex-1  ${Number(eatenCalories) >= dailyCalories ? "opacity-50 " : " "} ${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          }`}
        >
          <FaFire className="text-2xl text-red-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
            السعرات
          </p>
          <ProgressBar
            current={eatenCalories}
            target={dailyCalories}
            color="bg-rose-500"
          />
        </div>

        <div
          className={`${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          } flex flex-col items-start min-w-[100px] active:scale-90 active:opacity-50 transition delay-100 flex-1  ${ Number(localStorage.getItem("currentWeight")) * 1.6 <= Number(totalProtine) ? "opacity-50 " : ""}`}
        >
          <GiBiceps className="text-2xl text-blue-600 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
           البروتين
          </p>
          <ProgressBar
            current={totalProtine}
            target={Math.round(
              Number(localStorage.getItem("currentWeight")) * 1.6
            )}
            color="bg-blue-600"
          />
        </div>

        {/* <div
          className={`flex flex-col items-center min-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl ${ Number(localStorage.getItem("currentWeight")) * 1.6 <= Number(totalCarb) ? "border-teal-400 border-2 " : "bg-gray-50 shadow dark:bg-[#222]/50 "} ${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          }`}
        >
          <GiWheat className="text-2xl text-amber-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
            الكربوهيدريت
          </p>
          <ProgressBar
            current={totalCarb}
            target={Number((dailyCalories / 8).toFixed(1))}
            color="bg-amber-500"
          />
        </div> */}
      </div>

      {!localStorage.getItem("Diet") && (
        <div className="slide-up w-full flex flex-col items-center gap-3" style={{ animationDelay: '180ms' }}>
                     <button
                       onClick={() => navigate('/me/food')}
                       className="btn-press relative overflow-hidden flex items-center justify-center gap-2 bg-linear-120 from-orange-400 to-amber-300 px-8 py-4 text-white w-full rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/20 outline-swealing2"
                     >
                       عمل نظامي الغذائي  <BsCaretLeftFill />
                     </button>
                     
                   </div>
       
      )}
    </div>
  );
};

export default TodayTask;