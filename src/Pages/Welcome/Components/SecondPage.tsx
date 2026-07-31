import React from "react";
import {
  FaBullseye,
  FaFire,
  FaChartLine,
  FaTrophy,
  FaBrain,
  FaUtensils,
  FaMoneyBillAlt,
} from "react-icons/fa";
import img from "/undraw_fitness-stats_bd09.svg";
import { FaDumbbell } from "react-icons/fa6";
import { TbFriends } from "react-icons/tb";

const features = [
  {
    title: "متابعة لتمارينك",
    icon: <FaDumbbell />,
  },
  {
    title: "وجبات ذكية",
    icon: <FaUtensils />,
  },
  {
    title: "مجاني",
    icon: <FaMoneyBillAlt />,
  },
  {
    title: "متابعة التقدم",
    icon: <FaChartLine />,
  },
  {
    title: "XP وإنجازات",
    icon: <FaTrophy />,
  },
  {
    title: "مجتمع للرياضيين",
    icon: <TbFriends />,
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
              className="group p-1 py-3 rounded-2xl border border-amber-50 dark:border-neutral-700/60 bg-white dark:bg-neutral-900  text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 show-third"
            >
              <div className="mx-auto mb-2 flex h-7 w-14 items-center justify-center rounded-full bg-amber-50/90 dark:bg-orange-500/5  text-orange-400 text-xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              <p className="font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </p>
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