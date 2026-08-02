import React from "react";
import {
  FaBullseye,
  FaFire,
  FaChartLine,
  FaTrophy,
  FaBrain,
  FaUtensils,
  FaMoneyBillAlt,
  FaGrinHearts,
} from "react-icons/fa";
import img from "/undraw_fitness-stats_bd09.svg";
import { FaDumbbell } from "react-icons/fa6";
import { TbFriends } from "react-icons/tb";
import { LuDumbbell } from "react-icons/lu";
import { SiGoogleanalytics } from "react-icons/si";
import { GiDiamondTrophy } from "react-icons/gi";
import { IoAnalyticsOutline } from "react-icons/io5";

const features = [
  {
    title: "متابعة لتمارينك",
    icon: <LuDumbbell className="text-blue-400"/>,
  },
  {
    title: "وجبات ذكية",
    icon: <FaUtensils className="text-orange-400"/>,
  },
  {
    title: "مجاني",
    icon: <FaGrinHearts className="text-yellow-400"/>,
  },
  {
    title: "متابعة التقدم",
    icon: <IoAnalyticsOutline className="text-indigo-500"/>,
  },
  {
    title: "XP وإنجازات",
    icon: <GiDiamondTrophy className="text-blue-500"/>,
  },
  {
    title: "مجتمع للرياضيين",
    icon: <TbFriends className="text-emerald-400"/>,
  },
];

const Second: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center px-5 ">
      <div className="w-full max-w-lg">

       
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-thin text-gray-900 dark:text-white mt-10 show-fast">
            بسم الله الرحمن الرحيم
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7 show-first">
ليه             
            <span className="font-black text-orange-500">
              {" "}
                IronFit  
            </span>
<span className="p-1">
           تحديدا ؟

</span>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-10">

          {features.map((feature, index) => (
            <div
              key={index}
              style={{ "--time": `${(index + 1 ) * 0.8}s` } as React.CSSProperties}
              className="group p-1 py-3 flex flex-col gap-3.5 rounded-3xl active:scale-95 border border-gray-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900  text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animation-with-delay"
            >

              <p className="font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </p>
              <div className="mx-auto mb-2 flex h-7 w-14 items-center justify-center rounded-full     text-3xl  group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
   
         {/* SVG */}
        <div className="flex justify-center">
          <img
            src={img}
            alt="Fitness"
            className="w-full "
          />
        </div>

      </div>
    </div>
  );
};

export default Second;