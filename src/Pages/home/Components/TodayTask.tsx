import React, { useState, useEffect } from 'react';
import { BiCheck, BiDumbbell } from 'react-icons/bi';
import { BsCaretLeftFill } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { GiBiceps, GiWaterDrop, GiWheat } from 'react-icons/gi';
import { useNavigate } from 'react-router';
const TodayTask = () => {
  // ---------- Day tracking ----------
  const startTime = Number(localStorage.getItem('StartedAT') || Date.now());
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startTime) / 86400000) + 1;
  const totalDays = Number(localStorage.getItem('challengePeriod') || 0) * 30;
  const currentDay = Math.min(daysSinceStart, totalDays);
  const [allProtine,SetProtine] = useState(0);
  const [allCarb,SetCarb] = useState(0);
  const [isRestDay, setIsRestDay] = useState(false);
    const navigate = useNavigate();
  
    const BreakFast = Number(localStorage.getItem("Breakfast-prot"))
    const Lunch = Number(localStorage.getItem("Lunch-prot"));
    const Snacks = Number(localStorage.getItem("Snacks-prot"));
    const Dinner = Number(localStorage.getItem("Dinner-prot"));
        const BreakFast_ = Number(localStorage.getItem("Breakfast-carb"))
    const Lunch_ = Number(localStorage.getItem("Lunch-carb"));
    const Snacks_ = Number(localStorage.getItem("Snacks-carb"));
    const Dinner_ = Number(localStorage.getItem("Dinner-carb"));
    useEffect(() => {
      const stored = JSON.parse(localStorage.getItem('none-exercise') || '[]');
      setIsRestDay(stored.includes(currentDay));
  }, [currentDay]);
  useEffect(() => {
    SetProtine(BreakFast + Lunch + Snacks + Dinner);
    SetCarb(BreakFast_ + Lunch_ + Snacks_ + Dinner_);}
,[])
  const toggleRestDay = () => {
    const stored = JSON.parse(localStorage.getItem('none-exercise') || '[]');
    const updated = isRestDay
      ? stored.filter((d: number) => d !== currentDay)
      : [...stored, currentDay];
    localStorage.setItem('none-exercise', JSON.stringify(updated));
    setIsRestDay(!isRestDay);
  };

  // ---------- Sample progress (replace with real data) ----------
  const stats = {
    calories: { current: 2000, target: 3211 },
    protein: { current: 32, target: 60 },
    water: { current: 1, target: 8 },
  };

  // ---------- Linear progress bar component ----------
  const ProgressBar = ({ current, target, color }: { current: any; target: any; color: string }) => {
    const percent = Math.min((current / target) * 100, 100);
    return (
      <div className="w-full mt-1">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 show-fast ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className='p-1'>{current}</span>
          <span className='p-1'>{target}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#222]/20 dark:border-2 dark:border-gray-600/20 rounded-4xl border border-amber-100 p-4 shadow-sm mb-6.5">
      {/* Header */}
      <div className="flex items-center justify-between   pb-2">
        <h3 className="text-lg font-semibold dark:text-white flex items-center gap-2">
          أهداف اليوم
          <span className="text-sm text-gray-500 dark:text-gray-400">(اليوم {currentDay})</span>
        </h3>
      </div>

      {/* Tasks container – flex-row, wraps on small screens */}
      <div className="flex flex-row  gap-2 justify-center">
      
        {/* Calories card – flex-col */}
        <div className="flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow  dark:bg-[#222]/50  ">
          <FaFire className="text-3xl text-red-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">السعرات</p>
          <ProgressBar current={localStorage.getItem("EatenCalories") ? Number(localStorage.getItem("EatenCalories")) : "???"} target={Number(localStorage.getItem("dailyCalories"))} color="bg-red-500" />
        </div>

        {/* Protein card – flex-col */}
        <div className="flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow  dark:bg-[#222]/50 ">
          <GiBiceps className="text-3xl text-blue-600 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">البروتين</p>
          <ProgressBar current={allProtine === 0 ? "???" : allProtine} target={Math.round(Number(localStorage.getItem("currentWeight")) * 1.6)} color="bg-blue-600" />
        </div>

        {/* Water card – flex-col */}
        <div className="flex flex-col items-center max-w-[100px] active:scale-95 transition delay-100 flex-1 p-3 rounded-xl bg-gray-50 shadow dark:bg-[#222]/50 ">
          <GiWheat className="text-3xl text-amber-500 mb-1" />
          <p className="text-[12px] p-1 font-medium dark:text-white">الكربوهيدريت</p>
          <ProgressBar current={allCarb} target={50} color="bg-amber-500" />
        </div>
        
      </div>
      
{!localStorage.getItem("Diet") &&
      <div onClick={() => navigate('/me/food')} className='bg-linear-to-l from-amber-400 to-orange-500 flex justify-center items-center p-2 font-black mt-2 text-white rounded-xl'>اضغط هنا لإنشاء نظامك <BsCaretLeftFill className='mb-1 text-sm'/></div>
}

    </div>
  );
};

export default TodayTask;