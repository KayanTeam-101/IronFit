import React, { useEffect } from "react";
import Video from "../../../assets/Screenshot from 2026-07-20 09-33-11.png";
import { FaUtensils } from "react-icons/fa";
import { TbDumpling } from "react-icons/tb";
import { RiCopperCoinFill } from "react-icons/ri";
import { LuDumbbell } from "react-icons/lu";

const Firstturn: React.FC = () => {

    window.scrollBy(0,200),[]

  return (
    <div className="absolute top-1/2  left-1/2 -translate-1/2 w-full h-10/12 showAnim2">

      {/* Full‑screen background video */}
      <img
        src={Video}
        className="absolute -top-15 left-1/2 -translate-x-1/2 object-cover w-screen scale-110 opacity-70 blur-[3px] animate-pulse  h-full "
      />
      {/* Gradient overlay: transparent top → semi‑transparent middle → solid black bottom */}
      <div className="absolute inset-0 " />

      {/* Welcome card – positioned at the bottom with padding */}
      <div className="absolute bottom-15 z-20 px-6">

        <div className="mx-auto max-w-sm backdrop-blur-xl dark:bg-black/40 bg-white rounded-3xl p-6 text-center space-y-5 shadow-xl animate-fade-slide-up">
          {/* Logo */}
          <div className="flex justify-center -mt-14">
            <div className="w-16 h-16 rounded-full overflow-hidden pop">
              <img
                src="/logo_512.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Welcome text */}
        <div>
  <h1 className="text-3xl font-black dark:text-white text-gray-700">
    أهلاً بك في
  </h1>

  <h2 className="text-5xl font-thin mt-2 bg-linear-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
    IronFit
  </h2>
        <div className="relative block h-1 w-12 bg-amber-400 mt-2 mx-auto rounded-full fullWidth" />


  <p className="mt-5 dark:text-gray-200 leading-8 text-lg px-6">
    مساعدك الذكي لبناء أسلوب حياة صحي ومتوازن
  </p>
</div>
<div className="space-y-4 mt-6">

  <div className="flex items-center gap-4 bg-emerald-50 rounded-3xl  p-3 backdrop-blur-md text-right">
    <div  className="text-2xl bg-emerald-100 p-2 rounded-2xl"><FaUtensils className="text-emerald-500"/></div>
    <p className=" text-gray-900">
      تنظيم وجباتك وحساب السعرات بسهولة
    </p>
  </div>

  <div className="flex items-center gap-4 bg-orange-50 rounded-3xl  p-3 backdrop-blur-md">
    <div className="text-2xl bg-orange-100 p-2 rounded-2xl"><LuDumbbell className="text-orange-500"/></div>
    <p className=" text-gray-900">
      متابعة التمارين وتطور أدائك
    </p>
  </div>

  <div className="flex items-center gap-4 bg-blue-50 rounded-3xl  p-3 backdrop-blur-md">
    <div className="text-2xl bg-blue-100 p-2 rounded-2xl"><RiCopperCoinFill className="text-blue-600"/></div>
    <p className=" text-gray-900 text-right">
      تحديات يومية ونظام XP يحفزك للاستمرار
    </p>
  </div>

</div>

<div className="w-3/4 mx-auto h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full animate-pulse mt-6" />

<p className="text-center text-orange-400 font-semibold mt-5">
    جاهز لنبدأ رحلتك؟
</p>

          {/* Tagline */}
     
          {/* Animated divider */}
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
};

export default Firstturn;