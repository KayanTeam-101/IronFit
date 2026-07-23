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
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 show-fast ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="p-1">
            {current ?? "???"}
            {target < 500 ? "جم" : ""}
          </span>
          <span className="p-1">{target}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#222]/20 dark:border-2 dark:border-gray-600/20 rounded-4xl border border-amber-100 p-4 shadow-sm mb-6.5">
      <div
        className={`${
          localStorage.getItem("Diet") ? "" : "opacity-30"
        } flex items-center justify-between pb-2`}
      >
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          أهداف اليوم
          <span className="text-sm text-gray-500 dark:text-gray-400">
            (اليوم {currentDay})
          </span>
        </h3>
      </div>

      <div className="flex flex-row gap-2 justify-center">
        <div
          className={`flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow dark:bg-[#222]/50 ${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          } ${
            localStorage.getItem("hasCongratulatedDiet") &&
            !localStorage.getItem("openXpBefore")
              ? "opacity-20"
              : ""
          }`}
        >
          <FaFire className="text-3xl text-red-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
            السعرات
          </p>
          <ProgressBar
            current={eatenCalories}
            target={dailyCalories}
            color="bg-red-500"
          />
        </div>

        <div
          className={`${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          } flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow dark:bg-[#222]/50`}
        >
          <GiBiceps className="text-3xl text-blue-600 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
            البروتين
          </p>
          <ProgressBar
            current={totalProtine === 0 ? null : totalProtine}
            target={Math.round(
              Number(localStorage.getItem("currentWeight")) * 1.6
            )}
            color="bg-blue-600"
          />
        </div>

        <div
          className={`flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow dark:bg-[#222]/50 ${
            localStorage.getItem("Diet") ? "" : "opacity-10"
          }`}
        >
          <GiWheat className="text-3xl text-amber-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">
            الكربوهيدريت
          </p>
          <ProgressBar
            current={totalCarb}
            target={50}
            color="bg-amber-500"
          />
        </div>
      </div>

      {!localStorage.getItem("Diet") && (
        <div
          onClick={() => navigate("/me/food")}
          className="outline-swealing2 bg-linear-to-l from-amber-400 to-orange-500 flex justify-center items-center p-2 font-black mt-2 text-white rounded-xl"
        >
          اضغط هنا لإنشاء نظامك{" "}
          <BsCaretLeftFill className="mb-1 text-sm" />
        </div>
      )}
    </div>
  );
};

export default TodayTask;