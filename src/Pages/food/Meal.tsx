import { FaFire } from "react-icons/fa6";
import { IoInformationCircle } from "react-icons/io5";
import { Eaten } from "../../utilities/utilities";
import { GiBiceps } from "react-icons/gi";
import { useEffect } from "react";

const Meal = (props: any) => {
  const getData: string | null = localStorage.getItem("Diet");
  const History = JSON.parse(localStorage.getItem("History") || "{}");
  const FoodInfo_s = JSON.parse(localStorage.getItem("FoodInfo_s") || "{}");

const IsEaten = (dish: string, meal: string): boolean => {
  const today = new Date();
  const currentDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  const mealDishes = History[currentDate]?.meals?.[meal];
  console.log(mealDishes)
  return Array.isArray(mealDishes) ? mealDishes.includes(dish) : false;
};

useEffect(() => {
  console.log("History data:", History);
}, [History]);
  const chooseIconsForMeal = (mealName: string) => {
    switch (mealName) {
      case "Breakfast":
        return "🍳";
      case "Lunch":
        return "🍽️";
      case "Snacks":
        return "🍪";
      case "Dinner":
        return "🌙";
      default:
        return "🍽️";
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-lg border border-white/50 show-third shadow-xl rounded-3xl p-6 space-y-6 transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {props.MealName}
          <span className="text-2xl">{chooseIconsForMeal(props.MealName)}</span>
        </h1>
        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <IoInformationCircle className="text-base" />
          <span className="text-[0.7rem]">اضغط مرتان للتنفيذ</span>
        </div>
      </div>

      {/* Dish Cards */}
      <div className="grid gap-3">
        {getData &&
          JSON.parse(getData)[props.MealName][0].map(
            (dish: string, idx: number) => (
              <button
                key={props.MealName + "-" + idx}
                onClick={() => Eaten(dish, props.MealName)}
                className={`group relative flex items-center justify-between p-4 rounded-2xl  ${ IsEaten(dish,props.MealName) ? "bg-green-50 text-green-500 border-green-400 border-2 font-extrabold" :("bg-gradient-to-r from-green-50 to-indigo-50 hover:border-indigo-300 border border-indigo-100")} active:scale-[0.98] transition-all duration-200 hover:shadow-md `}
              >
                <span className="text-md   group-hover:text-indigo-700">
<div className="mb-2">
                  {dish}

</div>
                  <div className="absolute bottom-1.5 text-sm opacity-60 ">
                                   {
    FoodInfo_s?.find(
      (e: [string, string, number]) =>{
        console.log(e[0], e[1],e[2]);
        
      return  e[1] === dish && e[0] === props.MealName
      }
    )?.[2]
  } غرام
                                </div>
                </span>
                <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-indigo-100 transition-colors">
                  <IoInformationCircle className="text-xl text-gray-400 group-hover:text-indigo-500" />
                </div>
           
              </button>
            )
          )}
      </div>

      {/* Nutrition Info Chips */}
      <div className="flex flex-wrap gap-2.5">
        {getData &&
          JSON.parse(getData)[props.MealName][1].map(
            (info: string, idx: number) => (
              <div
                key={props.MealName + "-info-" + idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-transform hover:scale-105"
                style={
                  idx === 0
                    ? { background: "linear-gradient(135deg, #fff3c755, #fde68a55)", color: "#92400e" }
                    : idx === 1
                    ? { background: "linear-gradient(135deg, #ccfbf155, #99f6e455)", color: "#115e59" }
                    : { background: "linear-gradient(135deg, #00f77f85,#0077ff55)", color: "#000" }
                }
              >
                {idx === 0 && (
                  <>
                    <FaFire className="text-base text-orange-500" />
                    السعرات الحرارية: {Number(info).toFixed(1)}
                  </>
                )}
                {idx === 1 && (
                  <>
                    <GiBiceps className="text-base text-teal-500" />
                    البروتين: {Number(info).toFixed(1)}
                  </>
                )}
                {idx === 2 && `الفيتامين: ${info}`}
              </div>
            )
          )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );
};

export default Meal;