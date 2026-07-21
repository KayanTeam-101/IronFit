import React, { useEffect, useMemo } from "react";
import { useCountUp } from "../../../Hooks/Increasing";
import { FaFire, FaHeartbeat, FaBullseye, FaRulerVertical } from "react-icons/fa";
import CircularProgress from "../../../Components/UI/CircleProgress"; // يمكنك استخدامه إذا أردت حلقات تقدم

// دوال الحساب
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
  const low = Math.round(18.5 * (heightCm / 100) ** 2);
  const high = Math.round(24.9 * (heightCm / 100) ** 2);
  return [low, high];
};

// تصنيف الـ BMI (بدون نصائح طبية)
const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return "نقص في الوزن";
  if (bmi < 25) return "وزن طبيعي";
  if (bmi < 30) return "زيادة في الوزن";
  if (bmi < 35) return "سمنة درجة أولى";
  if (bmi < 40) return "سمنة درجة ثانية";
  return "سمنة مفرطة";
};

interface UserData {
  currentWeight: number;
  targetWeight: number;
  height: number;
  dailyCalories: number;
  age: number;
  gender: "ذكر" | "انثى";
}

const ShowBmi: React.FC = () => {
  // قراءة البيانات من localStorage
  const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
  const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
  const height = Number(localStorage.getItem("height") || 0);
  const age = Number(localStorage.getItem("age") || 0);
  const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
  const gender = (localStorage.getItem("SelectedGender") as "ذكر" | "انثى") || "ذكر";

  // تجميع بيانات المستخدم لتجنب التكرار
  const userData: UserData = useMemo(
    () => ({
      currentWeight,
      targetWeight,
      height,
      dailyCalories: Number(localStorage.getItem("dailyCalories") || 0),
      age,
      gender,
    }),
    [currentWeight, targetWeight, height, age, gender]
  );

  // حساب السعرات اليومية المطلوبة (بدون تأثير جانبي هنا)
  const dailyCaloriesGoal = useMemo(() => {
    if (!challengePeriod || challengePeriod <= 0) return 0;
    const bmr = calcBMR(userData.currentWeight, userData.height, userData.age, userData.gender);
    const tdee = bmr * 1.5; // معامل نشاط متوسط
    const weightDiff = userData.targetWeight - userData.currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;
    if (days === 0) return Math.round(tdee);
    const daily = tdee + totalCaloriesNeeded / days;
    return Math.round(daily);
  }, [userData, challengePeriod]);

  // تخزين السعرات في localStorage عند تغيرها (تأثير جانبي صحيح)
  useEffect(() => {
    localStorage.setItem("dailyCalories", dailyCaloriesGoal.toString());
  }, [dailyCaloriesGoal]);

  // الحسابات الأساسية
  const bmi = calcBMI(userData.currentWeight, userData.height);
  const bmr = calcBMR(userData.currentWeight, userData.height, userData.age, userData.gender);
  const idealRange = getIdealWeightRange(userData.height);
  const weightDiff = userData.targetWeight - userData.currentWeight;

  // قيم مؤثرة للعدادات
  const animatedWeight = useCountUp(userData.currentWeight);
  const animatedTargetWeight = useCountUp(userData.targetWeight);
  const animatedHeight = useCountUp(userData.height);
  const animatedAge = useCountUp(userData.age);
  const animatedBMR = useCountUp(Math.round(bmr));
  const animatedBMI = useCountUp(Number(bmi.toFixed(1)));
  const animatedCalories = useCountUp(dailyCaloriesGoal);

  // سلسلة التمارين (اختياري)
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
      if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime())
        return 0;
      let count = 1;
      let cur = new Date(mostRecent);
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i]);
        prev.setHours(0, 0, 0, 0);
        const diff = (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
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

  // نمط البطاقات
  const cardStyle =
    "bg-white  dark:border-2 dark:border-gray-600/20 shadow-sm rounded-3xl p-4 backdrop-blur-md hover:shadow-xl transition-all";

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* القسم العلوي: السعرات الحرارية اليومية */}
      <div className="relative w-full h-[70vh] overflow-hidden rounded-[60px] shadow-xl show-fast">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500" />
        <FaFire className="absolute top-20 w-3/4 h-1/2 text-emerald-300 dark:text-emerald-300/80 show-third" />

        <div className="relative z-10 flex flex-col justify-center h-full px-6">
          <div className="relative  text-4xl w-3/4 leading-15 text-right text-white mb-4 drop-shadow-2xl text-shadow-xs font-black show-first">
            {localStorage.getItem("SelectedGender") === "ذكر" ? "انت" : "انتي" }
            {" "}

            {localStorage.getItem("SelectedGender") === "ذكر" ? "محتاج" : "محتاجه" }
            {" "}
             
              حوالي 
            {dailyCaloriesGoal.toLocaleString()}
             سعرة حرارية
          </div>
          <p className="text-xl w-11/12 text-gray-100 text-shadow-xs font-black leading-relaxed max-w-md show-second">
             عشان 
            {" "}
            {localStorage.getItem("SelectedGender") === "ذكر" ? "توصل" : "توصلي" }
            {" "}
             
              لــ 
              {targetWeight} 
            كجم في غضون {
            challengePeriod}
            {challengePeriod > 1 ? "شهور" : "شهر"}، 
            لازم يبقي فيه نظام غذائي كويس
         ف مهمة أن يكون فيه نظام غذائي ممتاز علي حسب الاحتياج البدني دي مهمتي
          😄
          </p>
            <div className={cardStyle}>
          <FaFire className="text-amber-400 text-2xl mb-2" />
          <p className="text-sm font-medium text-gray-500 ">معدل الأيض الأساسي</p>
          <p className="text-3xl font-bold text-gray-900">{animatedBMR}</p>
          <p className="text-xs text-gray-500 ">سعرة حرارية في الراحة</p>
        </div>

        </div>
      </div>

    </div>
  );
};

export default ShowBmi;