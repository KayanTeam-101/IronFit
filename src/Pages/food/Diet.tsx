import Meal from './Meal'
import { FaBowlFood, FaFire } from 'react-icons/fa6'
import { VscSettings } from 'react-icons/vsc'
import React, { useEffect, useState } from 'react'
import Settings from './Settings'
import { BiCalendarAlt } from 'react-icons/bi'
import FoodList from '../../assets/FoodsList.json'
import { GrAddCircle } from 'react-icons/gr'

type MealPlan = {
  Breakfast: string[]
  Lunch: string[]
  Snacks: string[]
  Dinner: string[]
}

type HistoryType = {
  [date: string]: {
    meals: {
      [mealName: string]: string[]
    }
  }
}

const Diet = () => {
  const [settingsOpened, setSettingsOpened] = useState(false)
  const [eatenCalories, setEatenCalories] = useState<number>(0)

  // Read planned diet
  const getDiet = localStorage.getItem('Diet')

  const convertToObj: MealPlan | null = getDiet
    ? (JSON.parse(getDiet) as MealPlan)
    : null

  // Calculate today's eaten calories
  const calculateEatenCalories = () => {
    const history: HistoryType = JSON.parse(
      localStorage.getItem('History') || '{}'
    )
    const getAmount = JSON.parse(localStorage.getItem('FoodInfo_s') || '[]');
    console.log('History data:', history);
    
    const currentDate =
      new Date().getFullYear() +
      '/' +
      (new Date().getMonth() + 1) +
      '/' +
      new Date().getDate()

    const todayMeals = history[currentDate]?.meals || {}

    let totalCalories = 0

    Object.values(todayMeals).forEach((mealFoods) => {
      mealFoods.forEach((foodName) => {
        const food = (FoodList as any[]).find(
          (item) => item.FoodName === foodName
        )
        const foodAmount = (getAmount as any[]).find((e: any) => e[1] === foodName)?.[2] ?? null;

console.log(`Checking calories for ${foodName}:`, food?.calForOneKilo);

        if (food?.calForOneKilo) {
          totalCalories += Number((food.calForOneKilo / 1000) * Number(foodAmount)) // Assuming calForOneKilo is per 1000 grams;
          console.log(`Added ${food.calForOneKilo} calories from ${foodName}. Total now: ${totalCalories}`);
          
        }else{
          console.warn(`Calories not found for ${foodName}. Skipping.`);
        }
      
      })
    })

    setEatenCalories(totalCalories)
  }

  useEffect(() => {
    calculateEatenCalories();
    console.log('eaten calories calculated:', eatenCalories);
    
  }, [])

  return (
    <div>
      <div className="relative w-full min-h-14 flex flex-row justify-between">
        <div className="text-xl flex flex-row">
          <FaBowlFood />
        </div>

        <div className="flex flex-row gap-2">
          <div
            onClick={() => setSettingsOpened(true)}
            className="bg-gray-100 text-md flex items-center cursor-pointer flex-row gap-2 mb-5 p-2 rounded-4xl"
          >
            الاعدادات
            <VscSettings />
          </div>

          <div
            onClick={() => (window.location.href = '/me/history')}
            className="bg-gray-100 text-md flex items-center cursor-pointer flex-row gap-2 mb-5 p-2 rounded-4xl"
          >
            التاريخ
            <BiCalendarAlt />
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="flex gap-4 flex-col">
        <div className='p-1 rounded-xl bg-gradient-to-r show-first from-orange-50 to-yellow-50 border border-orange-200 text-orange-700 font-medium w-max flex items-center gap-2'>
          السعرات الحرارية المتناولة اليوم:
          <div className="font-bold text-lg flex flex-row gap-1 items-center">
            {eatenCalories} <FaFire className='text-orange-500 mb-1'/>
          </div>
       
        </div>
         <div className='p-1 rounded-xl bg-gradient-to-b show-first from-white to-gray-200 border border-slate-200  font-medium w-max flex items-center gap-2'>
اكلت طعام غير مجدول <GrAddCircle className='text-gray-500'  />
</div>
<div className={undefined}></div>
        {convertToObj &&
          (Object.keys(convertToObj) as Array<keyof MealPlan>).map(
            (key, idx) => <Meal key={idx} MealName={key} />
          )}
      </div>

      {settingsOpened && <Settings />}

      <div className="h-14"></div>
    </div>
  )
}

export default Diet