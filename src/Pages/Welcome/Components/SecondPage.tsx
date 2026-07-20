import React from "react";
import { GoGoal } from "react-icons/go";
import { LiaDumbbellSolid } from "react-icons/lia";
const Second: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg showInTwoSecond">
      {/* Glowing background blobs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-400 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

      {/* Main card */}
      <div className="relative bg-linear-to-b from-orange-500 to-amber-400  show-second  shadow-2xl rounded-4xl p-8 text-center space-y-6">
        {/* Icon with glowing ring */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl " />
            
          <h1 className=" text-9xl font-black mt-2 text-white showAnim2"><GoGoal /></h1>
          </div>
        </div>

        {/* Welcome text */}
        <div className="show-second ">
          <p className="text-3xl font-extrabold text-white"> بسم اللّه</p>
          <p className="text-2xl font-black mt-2 text-white">
        هنحتاج دقيقة واحدة عشان تكّمل الأسئلة الجاية          
          </p>
        </div>

        {/* Tagline */}
      

        {/* Subtle divider */}
      </div>
    </div>
  );
};

export default Second;