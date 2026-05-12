import React from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import { GiLeg } from 'react-icons/gi';
import { LiaDumbbellSolid } from "react-icons/lia";

const ExerciseDay = () => {
const SetNextDay = () => {
  const SortedDays = ["الاحد","الإثنين","الثلاثاء","الاربعاء","الخميس","الجمعة","السبت"];

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

  return "لا يوجد يوم تمرين";
};

    return (
    <div className='relative min-h-96 w-full p-5 bg-linear-to-b from-indigo-500  to-indigo-700 rounded-2xl border-indigo-50 flex flex-col gap-10'>
<div className='flex flex-row items-center justify-between'>
      <h2 className='text-4xl text-white font-bold'>التمرين</h2>
<div className='mb-5 font-medium'>  اليوم التالي : <span >{SetNextDay()}</span></div>
</div>
<div className='relative w-full h-full'>
    <h1 className='text-5xl text-white font-bold mb-2'>يوم القدم <div><GiLeg className='absolute text-9xl scale-200 left-0 top-0 opacity-20'/></div></h1>
<div className='absolute -left-1 -top-2 w-full h-full  '></div>
</div>
    <button className='flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-indigo-500 font-bold'>
      go to exercises <FaArrowRight />
    </button>
      <div>
          <LiaDumbbellSolid className="text-9xl text-indigo-100 absolute bottom-5 right-5 " />
      </div>
    </div>
  )
}

export default ExerciseDay
