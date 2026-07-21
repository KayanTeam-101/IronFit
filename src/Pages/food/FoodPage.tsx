import React from 'react'
import { FaArrowLeft, FaBowlFood } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import Diet from './Diet';

const FoodPage = () => {
  const navigate = useNavigate(); 
  const IsThere_A_Diet : string | null = localStorage.getItem('Diet') || null;
  const IsValid = IsThere_A_Diet ? (JSON.parse(IsThere_A_Diet) && IsThere_A_Diet.length > 130) : null;
  return (
    <div className='relative show-first min-h-screen max-w-screen p-5 flex flex-col gap-5  '>
      
      {IsValid ? (
<div className='relative min-h-screen w-full flex flex-col gap-5 '>

        <Diet />

</div>
) : (
       <>   
       <div className="absolute top-10 z-0 w-full h-[400px] animate-pulse blur-[100px] bg-gradient-to-r from-blue-600  to-teal-500" />
  <div className='w-11/12 h-52 z-40 flex overflow-hidden items-center mx-2.5 justify-center flex-col gap-5'>

<h1 className='dark:text-white text-3xl flex flex-row gap-3 text-center'>لم تقم بوضع نظامك الغذائي بعد ؟</h1>
<button onClick={() => navigate('/MKADiet')} className='flex items-center gap-2 bg-white p-3 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-slate-300 shadow-2xl w-fit rounded-xl text-amber-500 font-bold outline-swealing2'>
      اصنع نظامك الغذائي الان! <FaArrowLeft />
      </button>
  </div>
     </> )}
    </div>
  )
}

export default FoodPage
