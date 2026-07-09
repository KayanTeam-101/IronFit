import React from 'react'
import { FaArrowLeft, FaBowlFood } from 'react-icons/fa6';
import Diet from './Diet';
const FoodPage = () => {
  const IsThere_A_Diet : string | null = localStorage.getItem('Diet') || null;
  const IsValid = IsThere_A_Diet ? (JSON.parse(IsThere_A_Diet) && IsThere_A_Diet.length > 130) : null;
  return (
    <div className='relative show-first min-h-screen max-w-screen p-5 flex flex-col gap-5  '>
      
      {IsValid ? (
<div className='relative min-h-screen w-full flex flex-col gap-5 '>
      <div className="absolute top-10 z-0 w-full h-[400px] opacity-20 blur-3xl bg-gradient-to-r from-amber-400 via-indigo-400 to-teal-300" />

        <Diet />

</div>
) : (
        <div className='w-11/12 h-52 flex overflow-hidden items-center mx-2.5 justify-center flex-col gap-5 bg-amber-600 dark:bg-black/20 dark:border-2 dark:border-gray-600/20  dark:outline-0 border-4 border-amber-300 outline-8 outline-amber-50 rounded-3xl'>
      <div className="absolute  top-10 -z-10 w-full h-[400px] opacity-35 blur-3xl bg-amber-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 from-amber-400 via-indigo-400 to-teal-300" />

<h1 className='text-white text-3xl flex flex-row gap-3 text-center'>لم تقم بوضع نظامك الغذائي بعد ؟</h1>
  <a href="/MkADiet">
<button className='flex items-center gap-2 bg-white p-3 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 shadow-2xl w-fit rounded-xl text-amber-500 font-bold'>
      اصنع نظامك الغذائي الان! <FaArrowLeft />
      </button>
    </a>
  </div>
      )}
    </div>
  )
}

export default FoodPage
