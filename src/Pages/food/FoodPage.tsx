import React from 'react'
import { FaArrowRight, FaBowlFood } from 'react-icons/fa6';
import Diet from './Diet';
const FoodPage = () => {
  const IsThere_A_Diet : string | null = localStorage.getItem('Diet') || null;
  return (
    <div className='relative min-h-screen max-w-screen p-5 flex flex-col gap-5  '>
      {IsThere_A_Diet ? (
        <Diet />
      ) : (
        <div className='w-11/12 h-52 flex items-center mx-2.5 justify-center flex-col gap-5 bg-indigo-600 border-4 border-indigo-300 outline-8 outline-indigo-50 rounded-3xl'>
<h1 className='text-white text-3xl flex flex-row gap-3 '>لم تقم بوضع نظامك الغذائي بعد <FaBowlFood /></h1>
  <a href="/MkADiet">
<button className='flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-indigo-500 font-bold'>
      اصنع نظامك الغذائي الان! <FaArrowRight />
      </button>
    </a>
  </div>
      )}
    </div>
  )
}

export default FoodPage
