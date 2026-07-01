import React from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { GiLeg } from 'react-icons/gi';
import {GiShoulderArmor} from 'react-icons/gi'
import { useNavigate } from 'react-router';
const ExerciseDay = () => {
const SetNextDay = () => {
  const SortedDays = ["الأحد","الإثنين","الثلاثاء","الاربعاء","الخميس","الجمعة","السبت"];

  const normalize = (day: string) =>
    day.replace(/[أإآ]/g, "ا");

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

  return false;
};

  const navigate = useNavigate();
  
    return (
   <>
  { SetNextDay() ? (
     <div className='relative min-h-72 w-full p-5 bg-linear-to-b from-amber-300 overflow-hidden dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/20  to-orange-500 rounded-3xl border-amber-50 flex flex-col gap-10'>
<div className='flex flex-row items-center justify-between'>
</div>
<div className='relative w-full h-full'>
    <h1 className='text-5xl text-white text-shadow-lg font-bold mb-2 leading-14'>اليوم القادم <br/><span className='text-white'>{SetNextDay()}</span> <div><GiShoulderArmor className='absolute text-9xl scale-200 left-0 top-0 opacity-20'/></div></h1>
<div className='absolute -left-1 -top-2 w-full h-full  '></div>
</div>
    <button 
    onClick={() => navigate('/me/exercises')}
    className='flex cursor-pointer items-center gap-2 bg-white p-3 shadow-2xl dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 overflow-hidden w-fit rounded-xl text-amber-500 font-bold'>
      الذهاب لصفحة التمارين <FaArrowLeft />
    </button>
    </div>
   ) : (
    <div 
    className='relative min-h-96 w-full p-5 bg-slate-300 overflow-hidden dark:bg-black/20 dark:border-2 dark:border-gray-600/20  rounded-2xl border-gray-200 flex flex-col gap-10'
    >
<div className='flex flex-row items-center justify-between'>
      <h2 className='text-4xl text-white font-bold'>أيام التمرين</h2>
</div>
<div className='relative w-full h-full'>
    <h1 className='text-3xl text-white font-bold mb-2'>لم تقم باختيار أيام التمرين بعد! <div><GiShoulderArmor className='absolute text-9xl scale-200 left-0 top-0 opacity-20'/></div></h1>
<div className='absolute -left-1 -top-2 w-full h-full  '></div>
</div>
    <a href="/me/exercises">
    <button className='flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-amber-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 font-bold'>
      اختر أيام التمرين <FaArrowRight />
    </button>
    </a>
    </div>
   )}
   </>
  )
}

export default ExerciseDay
