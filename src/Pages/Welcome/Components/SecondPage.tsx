import React from "react";
import { GoGoal } from "react-icons/go";
import { LiaDumbbellSolid } from "react-icons/lia";
const Second: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg showInTwoSecond">
      {/* Glowing background blobs */}
 
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