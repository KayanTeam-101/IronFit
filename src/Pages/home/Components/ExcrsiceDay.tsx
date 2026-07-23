import React, { useMemo } from "react";
import { FaCaretLeft, FaFire, FaClock } from "react-icons/fa6";
import { GiShoulderArmor } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router";

const SortedDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
const SYSTEM_WORKOUTS: Record<string, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  بروسبلت: ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};
const normalize = (day: string) =>
  day.replace(/[أإآ]/g, "ا").replace("ى", "ي");

const ExerciseDay: React.FC = () => {
  const navigate = useNavigate();

  const todayWeekday = useMemo(
    () => new Date().toLocaleDateString("ar-EG", { weekday: "long" }),
    []
  );

  const todayWorkout = useMemo(() => {
    const selectedDays: string[] = JSON.parse(
      localStorage.getItem("SelectedDays") || "[]"
    );
    if (!selectedDays.length) return null;
    const todayNorm = normalize(todayWeekday);
    if (!selectedDays.some((d) => normalize(d) === todayNorm)) return null;

    const storedNames = localStorage.getItem("WorkoutNames");
    let workoutNames: string[] = [];
    if (storedNames) {
      try {
        const arr = JSON.parse(storedNames);
        if (Array.isArray(arr) && arr.length === selectedDays.length)
          workoutNames = arr;
      } catch {}
    }
    if (workoutNames.length === selectedDays.length) {
      const idx = selectedDays.findIndex((d) => normalize(d) === todayNorm);
      return workoutNames[idx] || null;
    }

    const system = localStorage.getItem("SystemOfExercise") || "بروسبلت";
    const systemList = SYSTEM_WORKOUTS[system] || SYSTEM_WORKOUTS["بروسبلت"];
    const idx = selectedDays.findIndex((d) => normalize(d) === todayNorm);
    return idx >= 0 && idx < systemList.length ? systemList[idx] : null;
  }, [todayWeekday]);

  const nextTrainingDay = useMemo(() => {
    const GetTrainDays: string[] = JSON.parse(
      localStorage.getItem("SelectedDays") || "[]"
    );
    const normalizedTrainDays = GetTrainDays.map(normalize);
    const todayIndex = new Date().getDay();

    for (let i = 1; i <= 7; i++) {
      const nextIndex = (todayIndex + i) % 7;
      const nextDay = SortedDays[nextIndex];
      if (normalizedTrainDays.includes(normalize(nextDay))) {
        return nextDay;
      }
    }
    return null;
  }, []);

  const estimatedDuration = "60 دقيقة";
  const estimatedCalories = 400;

  // Today is a training day
  if (todayWorkout) {
    return (
      <div
        className={`${
          localStorage.getItem("Diet") ? "" : "opacity-10"
        } relative min-h-60 w-full p-5 bg-gradient-to-br from-sky-500 to-blue-600 overflow-hidden rounded-3xl border border-sky-50 dark:border-gray-600/20 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl`}
      >
        <div className="flex items-center justify-between text-white/80 text-sm">
          <span>تمرين اليوم</span>
          <span className="font-black">{todayWeekday}</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl text-white font-bold mb-1 drop-shadow-lg">
            {todayWorkout}
          </h1>
          <div className="flex flex-col gap-4 mt-3 mr-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <FaClock className="text-amber-300" /> {estimatedDuration}
            </span>
            <span className="flex items-center gap-1">
              <FaFire className="text-amber-300" /> {estimatedCalories} سعرة
            </span>
          </div>
        </div>
        <GiShoulderArmor className="absolute text-8xl scale-250 left-7 top-20 opacity-50 text-white" />
        <button
          onClick={() => navigate("/me/exercises")}
          className="mt-4 flex items-center gap-2 bg-white backdrop-blur border border-white/50 dark:border-gray-600/20 p-3 shadow-lg w-fit rounded-3xl text-blue-500 font-bold transition-all hover:bg-white dark:hover:bg-white/20 active:scale-95"
        >
          صفحة التمارين <FaCaretLeft />
        </button>
      </div>
    );
  }

  // Next training day exists
  if (nextTrainingDay) {
    return (
      <div
        className={`relative min-h-60 w-full p-5 bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden rounded-3xl border border-amber-50 dark:border-gray-600/20 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl ${
          localStorage.getItem("Diet") ? "" : "opacity-10"
        }`}
      >
        <div className="flex flex-row items-center justify-between text-white/80 text-sm">
          <span>التمرين القادم</span>
        </div>
        <div className="relative w-full h-full">
          <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 drop-shadow-lg">
            {nextTrainingDay}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            انهاردة مش يوم تمرين, ريح جسمك وركز ع الجي
          </p>
        </div>
        <GiShoulderArmor className="absolute text-8xl scale-250 left-5 top-15 opacity-50 text-white" />
        <button
          onClick={() => navigate("/me/exercises")}
          className="flex cursor-pointer items-center gap-2 bg-white p-3 shadow-lg dark:border-2 dark:border-gray-600/20 w-fit rounded-3xl text-amber-600 font-bold hover:bg-amber-50 dark:hover:bg-white/10 active:scale-95 transition"
        >
          صفحة التمرين <FaCaretLeft />
        </button>
      </div>
    );
  }

  // No training days selected
  return (
    <div
      className={`relative min-h-60 w-full p-5 bg-gray-200 dark:bg-black/20 rounded-4xl flex flex-col justify-between transition-all hover:shadow-2xl ${
        localStorage.getItem("Diet") ? "" : "opacity-10"
      }`}
    >
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-3xl dark:text-white text-gray-500 font-bold">
          جدول التدريب
        </h2>
      </div>
      <h1 className="text-2xl dark:text-gray-300 text-gray-400 font-bold mb-2">
        لسة مش موجود جدول لحد دلوقتي
      </h1>
      <SlCalender className="absolute text-8xl left-10 top-10 scale-170 opacity-20 text-white" />
      <button
        onClick={() => navigate("/me/exercises")}
        className="flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-amber-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 font-bold"
      >
        صفحة التمرين <FaCaretLeft />
      </button>
    </div>
  );
};

export default ExerciseDay;