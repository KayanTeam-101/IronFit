import React from 'react'
import { FaArrowLeft, FaBowlFood } from 'react-icons/fa6';
import Diet from './Diet';
const FoodPage = () => {
  const IsThere_A_Diet : string | null = localStorage.getItem('Diet') || null;
  return (
    <div className='relative min-h-screen max-w-screen p-5 flex flex-col gap-5  '>
      
      {IsThere_A_Diet ? (
        <Diet />
      ) : (
        <div className='w-11/12 h-52 flex overflow-hidden items-center mx-2.5 justify-center flex-col gap-5 bg-sky-600 border-4 border-sky-300 outline-8 outline-sky-50 rounded-3xl'>
      <div className="absolute  top-10 -z-10 w-full h-[400px] opacity-35 blur-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300" />

<h1 className='text-white text-3xl flex flex-row gap-3 text-center'>لم تقم بوضع نظامك الغذائي بعد </h1>
  <a href="/MkADiet">
<button className='flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-sky-500 font-bold'>
      اصنع نظامك الغذائي الان! <FaArrowLeft />
      </button>
    </a>
  </div>
      )}
    </div>
  )
}

export default FoodPage
