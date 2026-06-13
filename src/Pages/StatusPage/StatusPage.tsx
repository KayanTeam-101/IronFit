import React, { useMemo, useEffect, useState } from "react";
import {
  FaWeight,
  FaFire,
  FaRulerVertical,
  FaBullseye,
  FaHeartbeat,
  FaTint,
  FaRunning,
  FaDatabase,
} from "react-icons/fa";

// ---------- Types ----------
interface UserData {
  currentWeight: number;
  targetWeight: number;
  height: number; // cm
  dailyCalories: number;
  age: number;
  gender: "ذكر" | "انثى";
}

// ---------- Circular Progress Ring (Samsung‑style) ----------
interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  textSize?: string;
  subText?: string;
  icon?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  label,
  unit = "",
  color,
  size = 120,
  strokeWidth = 8,
  textSize = "text-2xl",
  subText,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Ring container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <span className="text-lg mb-0.5">{icon}</span>}
          <span className={`font-extrabold ${textSize} text-gray-800 dark:text-white`}>
            {Math.round(value)}
          </span>
          {unit && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
          )}
          {subText && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {subText}
            </span>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
};

// ---------- Helpers ----------
const calcBMI = (weightKg: number, heightCm: number) => {
  if (heightCm <= 0) return 0;
  return weightKg / (heightCm / 100) ** 2;
};

const calcBMR = (weight: number, height: number, age: number, gender: string) => {
  // Mifflin-St Jeor
  if (gender === "ذكر") return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

const getIdealWeightRange = (heightCm: number) => {
  // Hamwi formula (approximate)
  const low = Math.round(18.5 * (heightCm / 100) ** 2);
  const high = Math.round(24.9 * (heightCm / 100) ** 2);
  return [low, high];
};

// ---------- Main Component ----------
const StatusPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch all data from localStorage
  const userData: UserData = useMemo(() => {
    return {
      currentWeight: Number(localStorage.getItem("currentWeight")) || 45,
      targetWeight: Number(localStorage.getItem("targetWeight")) || 52,
      height: Number(localStorage.getItem("height")) || 132,
      dailyCalories: Number(localStorage.getItem("dailyCalories")) || 2683,
      age: Number(localStorage.getItem("age")) || 25,
      gender: (localStorage.getItem("SelectedGender") as "ذكر" | "انثى") || "ذكر",
    };
  }, []);

  const bmi = calcBMI(userData.currentWeight, userData.height);
  const bmr = calcBMR(
    userData.currentWeight,
    userData.height,
    userData.age,
    userData.gender
  );
  const idealRange = getIdealWeightRange(userData.height);
  const weightDiff = userData.targetWeight - userData.currentWeight;

  // Progress percentages for rings
  const weightProgressPercent = Math.min(
    (userData.currentWeight / userData.targetWeight) * 100,
    100
  );
  const caloriePercent = Math.min((userData.dailyCalories / 3000) * 100, 100);
  const bmiPercent = Math.min((bmi / 40) * 100, 100);

  // Exercise streak (if available)
  const streak = useMemo(() => {
    const raw = localStorage.getItem("CompletedDates");
    if (!raw) return 0;
    try {
      const dates: string[] = JSON.parse(raw);
      if (!Array.isArray(dates) || dates.length === 0) return 0;
      const sorted = dates
        .map((d) => {
          const [y, m, day] = d.split("-").map(Number);
          return new Date(y, m - 1, day);
        })
        .sort((a, b) => b.getTime() - a.getTime());
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const mostRecent = new Date(sorted[0]);
      mostRecent.setHours(0, 0, 0, 0);
      if (
        mostRecent.getTime() !== today.getTime() &&
        mostRecent.getTime() !== yesterday.getTime()
      )
        return 0;
      let count = 1;
      let cur = new Date(mostRecent);
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i]);
        prev.setHours(0, 0, 0, 0);
        const diff =
          (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          count++;
          cur = prev;
        } else break;
      }
      return count;
    } catch {
      return 0;
    }
  }, []);

  // All localStorage keys (excluding some internal ones)
  const allKeys = useMemo(() => {
    const exclude = [
      "HistoryOfExercises",
      "ExercisePlan",
      "isFirstTime",
      "StartedAT",
      "EatenCalories",
      "CompletedDates",
    ]; // keep these out of the raw list
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !exclude.includes(key)) {
        keys.push({
          key,
          value: localStorage.getItem(key) || "",
        });
      }
    }
    return keys;
  }, []);

  // Card style identical to Home component
  const cardStyle =
    "bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 shadow-sm rounded-3xl p-4 backdrop-blur-md hover:shadow-xl transition-all";

  return (
    <div className="min-h-screen show-first z-0     sm:p-5 font-arabic relative overflow-hidden">
      {/* Decorative blur */}

        
      <div className="relative z-10">
        {/* Header */}
        {/* Extra Data Cards (non‑ring) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  
          {/* Quick stats */}
          <div className={`${cardStyle} space-y-2`}>
            <h3 className="text-lg font-bold text-sky-800 dark:text-white flex items-center gap-2">
              <FaHeartbeat className="text-rose-500" /> ملخص سريع
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الوزن الحالي</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {userData.currentWeight} كجم
                </p>
              </div>
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">المستهدف</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {userData.targetWeight} كجم
                </p>
              </div>
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الطول</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {userData.height} سم
                </p>
              </div>
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">العمر</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {userData.age} سنة
                </p>
              </div>
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الجنس</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {userData.gender}
                </p>
              </div>
              <div className="bg-sky-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">معدل الأيض</span>
                <p className="font-bold text-sky-700 dark:text-white">
                  {Math.round(bmr)} سعرة
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Circular Progress Rings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
     

          {/* Daily Calories Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={userData.dailyCalories}
              max={localStorage.getItem("dailyCalories") ? Number(localStorage.getItem("dailyCalories")) : 0}
              label="س.ع المستهدفة"
              unit="سعرة"
              color="#f97316"
              icon={<FaFire className="text-orange-400" />}
            />
          </div>

          {/* BMI Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={bmi}
              max={40}
              label="مؤشر كتلة الجسم"
              unit="BMI"
              color="#3b82f6"
              icon={<FaRulerVertical className="text-blue-500" />}
              subText={bmi < 18.5 ? "نقص" : bmi < 25 ? "طبيعي" : bmi < 30 ? "زيادة" : "سمنة"}
            />
          </div>

       

          {/* BMR Ring (derived) */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={Math.round(bmr)}
              max={2500}
              label="معدل الأيض الأساسي"
              unit="سعرة"
              color="#8b5cf6"
              icon={<FaHeartbeat className="text-purple-500" />}
              subText="حرق أثناء الراحة"
            />
          </div>

          {/* Weight Difference Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={Math.abs(weightDiff)}
              max={20}
              label="الفرق عن المستهدف"
              unit="كجم"
              color={weightDiff > 0 ? "#f59e0b" : "#22c55e"}
              icon={<FaBullseye className="text-yellow-500" />}
              subText={weightDiff > 0 ? "تحتاج زيادة" : "فوق المستهدف"}
            />
          </div>

          

          {/* Water Intake Ring (place holder - if you store water) */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={0}
              max={8}
              label="الماء (أكواب)"
              unit="كوب"
              color="#06b6d4"
              icon={<FaTint className="text-cyan-500" />}
              subText="لم يتم التسجيل بعد"
            />
          </div>
        </div>

        {/* Bottom spacer for mobile nav */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default StatusPage;