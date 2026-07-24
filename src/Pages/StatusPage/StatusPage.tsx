import React, { useMemo, useEffect, useState } from "react";
import CircularProgress from "../../Components/UI/CircleProgress";
import {
  FaWeight,
  FaFire,
  FaRulerVertical,
  FaBullseye,
  FaHeartbeat,
  
} from "react-icons/fa";
import { IoAnalytics, IoDiamond, IoDiamondOutline } from "react-icons/io5";

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
  const [IsActive, setIsActive] = useState(false);

  useEffect(() => {
   
  
   const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        const period = decoded.SubscriptionPeriod;
        if (period && period > Date.now()) {
          setIsActive(true);
          return;
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []);

  // Fetch all data from localStorage
  const userData: UserData = useMemo(() => {
    return {
      currentWeight: Number(localStorage.getItem("currentWeight")) || 0,
      targetWeight: Number(localStorage.getItem("targetWeight")) || 0,
      height: Number(localStorage.getItem("height")) || 132,
      dailyCalories: Number(localStorage.getItem("dailyCalories")) || 0,
      age: Number(localStorage.getItem("age")) || 0,
      gender: (localStorage.getItem("SelectedGender") as "ذكر" | "انثى") || "ذكر",
    };
  }, []);

  const bmr = calcBMR(
    userData.currentWeight,
    userData.height,
    userData.age,
    userData.gender
  );

const bmi = calcBMI(userData.currentWeight, userData.height);
// Progress percentages for rings
  const weightProgressPercent = Math.min(
    (userData.currentWeight / userData.targetWeight) * 100,
    100
  );
  // const caloriePercent = Math.min((userData.dailyCalories / 3000) * 100, 100);
  // const bmiPercent = Math.min((bmi / 40) * 100, 100);

  // // Exercise streak (if available)
  // const streak = useMemo(() => {
  //   const raw = localStorage.getItem("CompletedDates");
  //   if (!raw) return 0;
  //   try {
  //     const dates: string[] = JSON.parse(raw);
  //     if (!Array.isArray(dates) || dates.length === 0) return 0;
  //     const sorted = dates
  //       .map((d) => {
  //         const [y, m, day] = d.split("-").map(Number);
  //         return new Date(y, m - 1, day);
  //       })
  //       .sort((a, b) => b.getTime() - a.getTime());
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     const yesterday = new Date(today);
  //     yesterday.setDate(today.getDate() - 1);
  //     const mostRecent = new Date(sorted[0]);
  //     mostRecent.setHours(0, 0, 0, 0);
  //     if (
  //       mostRecent.getTime() !== today.getTime() &&
  //       mostRecent.getTime() !== yesterday.getTime()
  //     )
  //       return 0;
  //     let count = 1;
  //     let cur = new Date(mostRecent);
  //     for (let i = 1; i < sorted.length; i++) {
  //       const prev = new Date(sorted[i]);
  //       prev.setHours(0, 0, 0, 0);
  //       const diff =
  //         (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
  //       if (diff === 1) {
  //         count++;
  //         cur = prev;
  //       } else break;
  //     }
  //     return count;
  //   } catch {
  //     return 0;
  //   }
  // }, []);
  let  weightDiff= userData.targetWeight - userData.currentWeight;
  // Card style identical to Home component
  const cardStyle =
    "bg-white dark:bg-black/40 dark:border-2 dark:border-gray-600/20 shadow-sm rounded-3xl p-4 backdrop-blur-md hover:shadow-xl transition-all";

  return (
   IsActive ? (
     <div className="min-h-fit show-first z-0 sm:p-5 font-arabic relative overflow-hidden">
      {/* Decorative blur */}
        
      <div className="relative z-10">
        {/* Header */}
        {/* Extra Data Cards (non‑ring) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  
          {/* Quick stats */}
          <div className={`${cardStyle} space-y-2`}>
            <h3 className="text-lg font-bold text-amber-800 dark:text-white flex items-center gap-2">
              <FaHeartbeat className="text-rose-500" />  نظرة عامة
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الوزن الحالي</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {userData.currentWeight} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">المستهدف</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {userData.targetWeight} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الطول</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {userData.height} سم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">العمر</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {userData.age} سنة
                </p>
              </div>
         
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">معدل الأيض</span>
                <p className="font-bold text-amber-700 dark:text-white">
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
              label="الهدف"
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

          

        
        </div>

        {/* Bottom spacer for mobile nav */}
      </div>
    </div>
   ) : (
     <div className="mt-5">
      <div>
<div className="w-full h-1 mb-5  flex justify-start mr-3 items-center m">
<div className="relative top-2.5 bg-white dark:bg-[#111] flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-4 font-black">
  تحليل البيانات <IoAnalytics className="text-amber-400 text-[20px]" />

</div>
</div>
      </div>
      <div className="min-h-fit show-first z-0 sm:p-5 font-arabic relative overflow-hidden ">
      {/* Decorative blur */}
        <div className="absolute w-full h-full  dark:bg-black/10 backdrop-blur-sm z-40 rounded-3xl flex justify-center items-center ">
      <div className="z-40 flex items-center justify-center flex-col gap-2">
          <IoDiamondOutline className="text-amber-400 z-50 text-3xl" />
        <p className="text-amber-400 text-xl ">اشترك في VIP</p>
      </div>
        </div>
      <div className="relative z-10 animate-pulse">
        {/* Header */}
        {/* Extra Data Cards (non‑ring) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
  
          {/* Quick stats */}
          <div className={`${cardStyle} space-y-2`}>
            <h3 className="text-lg font-bold text-amber-800 dark:text-white flex items-center gap-2">
              <FaHeartbeat className="text-rose-500" />  نظرة عامة
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الوزن الحالي</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {0} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">المستهدف</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {0} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الطول</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {0} سم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">العمر</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {0} سنة
                </p>
              </div>
         
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">معدل الأيض</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {Math.round(0)} سعرة
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Circular Progress Rings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
     

     
          {/* BMI Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={0}
              max={40}
              label="اشترك في VIP"
              unit="BMI"
              color="#3b82f6"
              icon={<FaRulerVertical className="text-blue-500" />}
              subText={"مؤشر كتلة الجسم"}
            />
          </div>

       

          {/* BMR Ring (derived) */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={0}
              max={2500}
              label="اشترك في VIP"
              unit="سعرة"
              color="#8b5cf6"
              icon={<FaHeartbeat className="text-purple-500" />}
              subText="معدل الأيض"
            />
          </div>  

             {/* Weight Difference Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={Math.abs(0)}
              max={20}
              label="الفرق عن المستهدف"
              unit="كجم"
              color={0 > 0 ? "#f59e0b" : "#22c55e"}
              icon={<FaBullseye className="text-yellow-500" />}
              subText={0 > 0 ? "تحتاج زيادة" : "فوق المستهدف"}
            />
          </div>

   {/* Weight Difference Ring */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={Math.abs(0)}
              max={20}
              label="الفرق عن المستهدف"
              unit="كجم"
              color={0 > 0 ? "#f59e0b" : "#22c55e"}
              icon={<FaBullseye className="text-yellow-500" />}
              subText={0 > 0 ? "تحتاج زيادة" : "فوق المستهدف"}
            />
          </div>

        </div>
      </div>
    </div>
     </div>
   )
  );
};

export default StatusPage;