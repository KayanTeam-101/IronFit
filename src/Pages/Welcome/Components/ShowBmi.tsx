import React, { useMemo } from 'react'
import CircularProgress from '../../../Components/UI/CircleProgress';
import { useCountUp } from '../../../Hooks/Increasing';
import { FaBullseye, FaFire, FaRulerVertical } from 'react-icons/fa6';
import { FaHeartbeat } from 'react-icons/fa';

const calcBMI = (weightKg: number, heightCm: number) => {
  if (heightCm <= 0) return 0;
  return weightKg / (heightCm / 100) ** 2;
};

 

const calcBMR = (weight: number, height: number, age: number, gender: string) => {
  // Mifflin-St Jeor
  if (gender === "ذكر") return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
};
interface UserData {
  currentWeight: number;
  targetWeight: number;
  height: number; // cm
  dailyCalories: number;
  age: number;
  gender: "ذكر" | "انثى";
}

const getIdealWeightRange = (heightCm: number) => {
  // Hamwi formula (approximate)
  const low = Math.round(18.5 * (heightCm / 100) ** 2);
  const high = Math.round(24.9 * (heightCm / 100) ** 2);
  return [low, high];
};


const ShowBmi = () => {
    
  const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
  const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
  const height = Number(localStorage.getItem("height") || 0);
  const age = Number(localStorage.getItem("age") || 0);
  const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
  const gender = localStorage.getItem("SelectedGender") || "";


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
    
      const dailyCaloriesGoal = useMemo(() => {
    if (!challengePeriod || challengePeriod <= 0) return 0;

    let bmr: number;
    if (gender === "ذكر") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * 1.5; // activity factor
    const weightDiff = targetWeight - currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;

    if (days === 0) return Math.round(tdee);
    const daily = tdee + totalCaloriesNeeded / days;
    localStorage.setItem("dailyCalories", Math.round(daily).toString());
    return Math.round(daily);
  }, [currentWeight, targetWeight, height, age, challengePeriod, gender]);


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
        const animatedWeight = useCountUp(userData.currentWeight);
      const animatedTargetWeight = useCountUp(userData.targetWeight);
      const animatedHeight = useCountUp(userData.height);
      const animatedAge = useCountUp(userData.age);
      const animatedBMR = useCountUp(Math.round(bmr));
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
    
      // Card style identical to Home component
      const cardStyle =
        "bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 shadow-sm rounded-3xl p-4 backdrop-blur-md hover:shadow-xl transition-all";
    
  return (
    <>
    <div className="min-h-screen w-full flex justify-center items-center show-first z-0 sm:p-5 font-arabic relative overflow-hidden">
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
                  {animatedWeight} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">المستهدف</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {animatedTargetWeight} كجم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">الطول</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {animatedHeight} سم
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-white/5 rounded-xl p-2">
                <span className="text-gray-500 dark:text-gray-400">معدل الأيض</span>
                <p className="font-bold text-amber-700 dark:text-white">
                  {Math.round(animatedBMR)} سعرة
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
              value={useCountUp(userData.dailyCalories)}
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
              icon={<FaRulerVertical className="text-orange-500" />}
              subText={bmi < 18.5 ? "نقص" : bmi < 25 ? "طبيعي" : bmi < 30 ? "زيادة" : "سمنة"}
            />
          </div>

       

          {/* BMR Ring (derived) */}
          <div className={`${cardStyle} flex justify-center`}>
            <CircularProgress
              value={Math.round(animatedBMR)}
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
        <div className="h-16" />
      </div>
    </div>

    </>
  )
}

export default ShowBmi
