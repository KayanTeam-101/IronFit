import React,{useEffect, useState} from 'react'
import { BiCookie } from 'react-icons/bi';
import { BsFire, BsMoon, BsPlus, BsPlusCircleFill, BsSave, BsSave2Fill, BsSun } from 'react-icons/bs';
import { FaBowlFood, FaFire } from 'react-icons/fa6';
import { HiOutlineChevronUpDown } from 'react-icons/hi2';
import { PiPlus } from 'react-icons/pi';
import AdditionPage from './AdditionPage';
import { useNavigate } from "react-router-dom";
import { GiBiceps, GiChickenOven } from 'react-icons/gi';
import { MdDelete } from 'react-icons/md';
import { GoGoal } from 'react-icons/go';
type MealPlan = {
  Breakfast: string[][],
  Lunch: string[][],
  Snacks: string[][],
  Dinner: string[][]
}

const MakeADiet: React.FC = () => {
  if (localStorage.getItem('Diet') === null) {
    localStorage.setItem('Diet', JSON.stringify({
      Breakfast: [[], []],
      Lunch: [[], []],
      Snacks: [[], []],
      Dinner: [[], []]
    }));
  }

  const mealPlan: MealPlan = JSON.parse(localStorage.getItem('Diet') || '{}') || {
      Breakfast: [[], []],
        Lunch: [[], []],
        Snacks: [[], []],
        Dinner: [[], []]
  };

  const CurrentWeight: number = Number(localStorage.getItem('currentWeight') || 0);
  const targetWeight: number = Number(localStorage.getItem('targetWeight') || 0);
  const height: number = Number(localStorage.getItem('height') || 0);
  const age: number = Number(localStorage.getItem('age') || 0);
  const [IsClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  // نفترض أنه بالشهور
  const ChallengePeriod: number = Number(localStorage.getItem('challengePeriod') || 0);
  const getDiv: React.RefObject<HTMLDivElement> | any = React.useRef<HTMLDivElement>(null);
  const Gender: string = localStorage.getItem('SelectedGender') || '';
    const progress = 75; // النسبة الحالية
  const size = "75vw"; // 75% من عرض الشاشة
  const strokeWidth = 7;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (progress / 100) * circumference;

  const ChooseNameOfMealInArabic=(mealName:string)=>{
    switch (mealName) {
      case "Breakfast":
        return "الفطور";
      case "Lunch":
        return "الغداء";
      case "Snacks":
        return "الوجبات الخفيفة";
      case "Dinner":
        return "العشاء";
      default:
        return mealName;
    }
  }
  // نشاط متوسط
  const activityFactor = 1.5;

 useEffect(() =>{
   const CalculateKals = (): number => {
    if (!ChallengePeriod || ChallengePeriod <= 0) return 0;

    let bmr: number;

    if (Gender === 'ذكر') {
      bmr = 10 * CurrentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * CurrentWeight + 6.25 * height - 5 * age - 161;
    }

    // سعرات الثبات
    const tdee = bmr * activityFactor;

    // فرق الوزن (موجب = زيادة، سالب = تخسيس)
    const weightDiff = targetWeight - CurrentWeight;

    // إجمالي السعرات المطلوبة
    const totalCaloriesNeeded = weightDiff * 7700;

    // نحول المدة لأيام
    const days = ChallengePeriod * 30;
    if (days === 0) return Math.round(tdee);

    // السعرات اليومية للوصول للهدف
    const dailyCalories = tdee + totalCaloriesNeeded / days;
    localStorage.setItem('dailyCalories', dailyCalories.toString());
    return Math.round(dailyCalories);
  }; 
  CalculateKals()
 },[])

  // Toggle window (يعمل على العنصر الحاوي)
const ToggleWindow = (e: React.MouseEvent<HTMLDivElement>) => {
  const parent = e.currentTarget.parentElement as HTMLDivElement | null;
  if (!parent) return;

  if (parent.classList.contains('opened')) {
    // Close: set to a fixed height (e.g., 56px ≈ 3.5rem, matching your h-14)
    parent.style.height = '56px';
    parent.classList.remove('opened');
  } else {
    // Open: set to the full scroll height (content height + padding)
    parent.style.height = parent.scrollHeight + 50 + 'px';
    parent.classList.add('opened');
  }
};

  // إضافة وجبة: نمرّر المفتاح بدل الاعتماد على DOM classes
  const AddADish = (mealKey: keyof MealPlan) => {
  //  Set The Current Meal To Add To It
  localStorage.setItem('currentMeal', mealKey);
   setIsClicked(true);
  }


  const Save = () => {
    if (confirm("Save Date and go back to home page")) {
   if (mealPlan.Breakfast[0].length > 0 && mealPlan.Lunch[0].length > 0 && mealPlan.Snacks[0].length > 0 && mealPlan.Dinner[0].length > 0) {
       localStorage.setItem('Diet',JSON.stringify(mealPlan));
      navigate('/me/home');
    
   }else{
    alert("برجاء إضافة وجبة واحدة على الأقل لكل وجبة (فطور، غداء، وجبات خفيفة، عشاء) قبل الحفظ.");
      }
    }

  }
  // نطبع الوجبات بعد كل تغيير (setState غير متزامن)

  const calcAllCalories = (): number => {
    return Object.values(mealPlan).reduce((acc, curr: any) => acc + curr[1][0], 0);
  };
  const calcAllProtein = (): number => {
    return Object.values(mealPlan).reduce((acc, curr: any) => acc + curr[1][1], 0);
  };
  return (
<div className='relative min-h-screen w-full p-5 flex flex-col gap-5 justify-start show-first mb-20'>
        <div className='w-full absolute top-0 left-0 h-44 bg-gradient-to-r  from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600  '>
        <h1 className='text-white text-md font-bold text-center mt-5'>اصنع نظامك الغذائي</h1>

      </div>

      <div className='relative top-6 w-full h-fit flex justify-center items-center text-gray-700 '>

       <div
      style={{
        width: size,
        aspectRatio: "1/1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 220 220"
      >
        {/* الخلفية */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#eff"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* التقدم */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#38bbf8"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
          style={{
            transition: "0.5s ease",
          }}
        />
      </svg>

      {/* النص داخل الدائرة */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <div
        
          className='flex justify-center items-center flex-col'
        >
          <div>
            <span className='text-2xl'>2100</span>
            <span>/</span>
            <span>2500</span>
          </div>
          سعرة
        </div>
      </div>
    </div>
{/*         
        <div>الوزن : <span>{CurrentWeight} كجم</span></div>
        <div>الوزن المُستهدف : <span>{targetWeight} كجم</span></div>
        <div className='flex flex-row'>هدف السعرات: <span className='flex flex-row'>{CalculateKals()} <GoGoal  /></span></div>
        <div>العُمر : <span>{age} </span></div>
        <div>فترة التحدي : <span>{ChallengePeriod} شهر</span></div>
{ !Number.isNaN(calcAllCalories()) && (
    <div className='flex flex-row '>Cal in meals: <span className='flex flex-row '>{calcAllCalories().toFixed(1)} <BsFire className='text-orange-400'/> </span></div>
)}
{ !Number.isNaN(calcAllProtein()) && (
    <div className='flex flex-row '>Protein in meals: <span className='flex flex-row '>{calcAllProtein().toFixed(2)} <GiBiceps className='text-teal-500 text-lg -mt-0.5'/></span></div>
)} */}
      </div>
      {/* Meal Plans */}
      {
        (Object.keys(mealPlan) as Array<keyof MealPlan>).map((meal) => (
      <div
  aria-details="mainContainer"
  className="container relative top-6  w-full overflow-hidden bg-white active:bg-gray-200 active:opacity-60 border-r-sky-500 border-r-4 px-5 py-1 rounded-xl transition-all duration-500 ease-in-out"
  style={{ height: '56px' }}   // initial closed height
  key={meal}
>
            <div className="w-full h-12 hover:cursor-pointer flex flex-row justify-between items-center p-2 text-xl" onClick={e => ToggleWindow(e)}>
              <h1 className='flex flex-row gap-3'>
                {ChooseNameOfMealInArabic(meal)}
              </h1>
             <div>
                 {meal === 'Breakfast' && <BsSun />} 
                {meal === 'Lunch' && <FaBowlFood />}
                {meal === 'Snacks' && <BiCookie />}
                {meal === 'Dinner' && <BsMoon />}
              <HiOutlineChevronUpDown />
             </div>
            </div>

            <div className='w-full min-h-20 p-3 rounded-2xl'>
              <div
               ref={getDiv}
               className={`w-full h-fit flex flex-row gap-1.5 flex-wrap`}>
                <button
                  className='w-full flex cursor-pointer items-center gap-2 bg-gradient-to-r  from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 p-3 shadow  rounded-2xl text-white'
                  onClick={() => AddADish(meal)}
                >
                  إضافة طبق للوجبة <BsPlus className='-translate-y-0.5' />
                </button>

                {/* عرض الوجبات المضافة */}
                {mealPlan[meal][0].map((dish, idx) => (
                  <div key={meal + '-' + idx} className='w-full p-3.5 bg-gray-100 rounded-lg text-md active:bg-blue-100 active:text-blue-600 cursor-pointer activeAnim'>
                    {dish}
                  </div>
                ))}
        {/* SetInformations */}
              <div className='relative top-3 w-full h-fit flex flex-row gap-0 .5 flex-wrap '>
                  {mealPlan[meal][1].map((info, idx) => (
                  <div key={meal + '-info-' + idx} className={`flex w-fit p-2.5 font-medium  bg-gray-50 rounded-2xl  gap-1.5 text-md text-black cursor-pointer activeAnim`}>
                  {idx ===0 ? ( <div className='flex flex-row gap-1.5'>
                                          
                                          Calories: {Number(info).toFixed(1)}
                    <FaFire className={`text-md  text-orange-400`} />
                    </div>) : ``}
                    {idx === 1 ? `Proteins: ${Number(info).toFixed(1)} g` : ``}
                    {idx === 2 ? `Vitamins: ${info}` : ``}

                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        ))
      }
  <button className='relative top-26 w-full  p-3 bg-linear-to-r from-blue-500 to-blue-500 text-white rounded-full text-lg font-medium flex items-center justify-center gap-2 active:bg-blue-700 activeAnim' onClick={Save}>
       حفظ<BsSave2Fill />
        </button>
        {IsClicked && <AdditionPage Meal={localStorage.getItem('currentMeal') || ''} />}
    </div>
  )
}

export default MakeADiet;
