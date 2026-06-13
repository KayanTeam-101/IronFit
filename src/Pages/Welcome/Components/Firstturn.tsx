import React from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
const Firstturn: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg">
      {/* Glowing background blobs */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-400 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

      {/* Main card */}
      <div className="relative bg-white/20 dark:bg-black/20 dark:border-gray-600/5 dark:border-4 backdrop-blur-sm show-second border border-white/50 shadow-2xl rounded-4xl p-8 text-center space-y-6">
        {/* Icon with glowing ring */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-xl opacity-40" />
            <div className="relative pb-10">
              <img src="/logo_192.jpg" alt="Logo" className="w-20 h-full object-contain rounded-full" />
            </div>
          </div>
        </div>

        {/* Welcome text */}
        <div className="show-second ">
          <p className="text-3xl font-extrabold text-gray-800 dark:text-white">أهلاً</p>
          <p className="text-4xl font-black mt-2 dark:text-white text-gray-900">
            بك في{" "}
            <span className="bg-gradient-to-r from-blue-500  to-pink-500 bg-clip-text text-transparent showInTwoSecond">
              IronFit
            </span>
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base font-medium text-gray-600  leading-relaxed px-2 show-third">
          هنا تقدر تنظم كل جدولك الجمّاوّية بشكل بسيط و جميل في نفس الوقت
        </p>

        {/* Subtle divider */}
        <div className="w-2/3 mx-auto h-0.5 animate-pulse delay-1000 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default Firstturn;