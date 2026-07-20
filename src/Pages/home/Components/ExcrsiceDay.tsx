import React, { useMemo } from "react";
import {
  FaArrowRight,
  FaCaretLeft,
  FaFire,
  FaClock,
  FaDumbbell,
} from "react-icons/fa6";
import { GiShoulderArmor } from "react-icons/gi";
import { useNavigate } from "react-router";

// ---------- Helpers (mirrors ExercisePage logic) ----------
const getTodayWeekday = (): string =>
  new Date().toLocaleDateString("ar-EG", { weekday: "long" });

const normalize = (day: string) =>
  day.replace(/[أإآ]/g, "ا").replace("ى", "ي");

// System workout order – same as SYSTEMS in ExercisePage
const SYSTEM_WORKOUTS: Record<string, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  "بروسبلت": ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};

const getWorkoutForWeekday = (weekday: string): string | null => {
  const selectedDays: string[] = JSON.parse(
    localStorage.getItem("SelectedDays") || "[]"
  );
  if (!selectedDays.length) return null;

  // Check if today is a training day
  const todayNorm = normalize(weekday);
  const isToday = selectedDays.some((d) => normalize(d) === todayNorm);
  if (!isToday) return null;

  // Use stored workout names if available (from templates)
  const storedNames = localStorage.getItem("WorkoutNames");
  let workoutNames: string[] = [];
  if (storedNames) {
    try {
      const arr = JSON.parse(storedNames);
      if (Array.isArray(arr) && arr.length === selectedDays.length) {
        workoutNames = arr;
      }
    } catch {}
  }
  if (workoutNames.length === selectedDays.length) {
    const idx = selectedDays.findIndex((d) => normalize(d) === todayNorm);
    return workoutNames[idx] || null;
  }

  // Fallback: use system workouts
  const system = localStorage.getItem("SystemOfExercise") || "بروسبلت";
  const systemList = SYSTEM_WORKOUTS[system] || SYSTEM_WORKOUTS["بروسبلت"];
  const idx = selectedDays.findIndex((d) => normalize(d) === todayNorm);
  if (idx >= 0 && idx < systemList.length) return systemList[idx];
  return null;
};

const getNextTrainingDay = (): string | null => {
  const SortedDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
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
};

const ExerciseDay: React.FC = () => {
  const navigate = useNavigate();
  const todayWeekday = getTodayWeekday();
  const todayWorkout = getWorkoutForWeekday(todayWeekday);
  const nextTrainingDay = getNextTrainingDay();

  // For demo purposes – you can later make these dynamic
  const estimatedDuration = "60 دقيقة";
  const estimatedCalories = 400;

  // ----- Case 1: Today is a training day -----
  if (todayWorkout) {
    return (
      <div className={`${localStorage.getItem("Diet") ? "" : "opacity-40"} relative min-h-60 w-full p-5 bg-gradient-to-br from-sky-500 to-blue-600  overflow-hidden rounded-3xl border border-sky-50 dark:border-gray-600/20 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl`}>
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
          الذهاب لصفحة التمارين <FaCaretLeft />
        </button>
      </div>
    );
  }

  // ----- Case 2: Today is not a training day, but there is a next one -----
  if (nextTrainingDay) {
    return (
      <div className={`relative min-h-60 w-full p-5 bg-gradient-to-b from-amber-500 to-orange-500  overflow-hidden rounded-3xl border border-amber-50 dark:border-gray-600/20 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl ${localStorage.getItem("Diet") ? "" : "opacity-40"}`}>
        <div className="flex flex-row items-center justify-between text-white/80 text-sm">
          <span>التمرين القادم</span>
        </div>

        <div className="relative w-full h-full">
          <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 drop-shadow-lg">
            {nextTrainingDay}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            اليوم ليس يوم تمرين، استعد للقادم
          </p>
        </div>

        <GiShoulderArmor className="absolute text-8xl scale-250 left-5 top-15 opacity-50 text-white" />

        <button
          onClick={() => navigate("/me/exercises")}
          className="flex cursor-pointer items-center gap-2 bg-white p-3 shadow-lg dark:border-2 dark:border-gray-600/20 w-fit rounded-3xl text-amber-600 font-bold hover:bg-amber-50 dark:hover:bg-white/10 active:scale-95 transition"
        >
          الذهاب لصفحة التمارين <FaCaretLeft />
        </button>
      </div>
    );
  }

  // ----- Case 3: No training days selected at all -----
  return (
    <div className="relative min-h-60 w-full p-5 bg-slate-300 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 overflow-hidden rounded-3xl border-gray-200 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-3xl text-white font-bold">أيام التمرين</h2>
      </div>
      <h1 className="text-2xl text-white font-bold mb-2">
        لم تقم باختيار أيام التمرين بعد!
      </h1>
      <GiShoulderArmor className="absolute text-8xl scale-150 left-0 top-0 opacity-20 text-white" />
      <button
        onClick={() => navigate("/me/exercises")}
        className="flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-amber-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 font-bold"
      >
        اختر أيام التمرين <FaCaretLeft />
      </button>
    </div>
  );
};

export default ExerciseDay;