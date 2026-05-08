import Meal from './Meal'
import { FaBowlFood, FaClock } from 'react-icons/fa6'
import { VscSettings } from 'react-icons/vsc'
import React, { useState } from 'react'
import Settings from './Settings';
type MealPlan = {
  Breakfast: string[]
  Lunch: string[]
  Snacks: string[]
  Dinner: string[]
}

const Diet = () => {
  const [SettingsOpened,SetSettingsOpened] = useState(false);

  const getDiet: string | null = localStorage.getItem('Diet')

  const convertToObj: MealPlan | null = getDiet
    ? JSON.parse(getDiet) as MealPlan
    : null
console.log(convertToObj);

  return (
    <div className=''>
      <div className="relative w-full min-h-14 flex flex-row justify-between">
        <div className="text-2xl flex flex-row ">My Diet <FaBowlFood /></div>
 <div className='flex flex-row gap-2'>
         <div onClick={() =>{SetSettingsOpened(() => true) }} className="bg-gray-100 text-md flex items-center cursor-pointer flex-row  gap-2 mb-5   p-2 rounded-4xl ">Settings <VscSettings /></div>
        <div onClick={e => window.location.href="/me/history"} className="bg-gray-100 text-md flex items-center cursor-pointer flex-row  gap-2 mb-5   p-2 rounded-4xl ">History <FaClock /></div>
   
 </div>
    </div>

      {/* Meals Section */}
<div className='flex gap-4 flex-col'>
          {convertToObj &&
        (Object.keys(convertToObj) as Array<keyof MealPlan>).map((key,idx)=> (

<>
          <Meal key={idx} MealName={key}  />

</>
        ))
      }
</div>
{SettingsOpened && <Settings />}

<div className='h-14'></div>
    </div>
  )
}

export default Diet
