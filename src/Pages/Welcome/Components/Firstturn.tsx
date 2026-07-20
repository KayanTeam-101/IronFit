import React from "react";
import Video from "../../../assets/Screenshot from 2026-07-20 09-33-11.png";

const Firstturn: React.FC = () => {



  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-10/12 showAnim2">

      {/* Full‑screen background video */}
      <img
        src={Video}
        className="absolute -top-15 left-1/2 -translate-x-1/2 object-cover w-screen sca blur-[3px] animate-pulse   h-full "
      />
      {/* Gradient overlay: transparent top → semi‑transparent middle → solid black bottom */}
      <div className="absolute inset-0 " />

      {/* Welcome card – positioned at the bottom with padding */}
      <div className="absolute bottom-40 left-0 right-0 z-20 px-6">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

        <div className="mx-auto max-w-sm backdrop-blur-xl dark:bg-black/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-fade-slide-up">
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
            <p className="text-5xl font-extrabold text-white tracking-wide show-third">
              أهلاً
            </p>
            <p className="text-4xl font-black mt-1 text-white show-third">
              بك في{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-lg showAnim2">
                IronFit
              </span>
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg font-medium text-gray-300 leading-relaxed showAnim">
    هنا تقدر تنظم حياتك الصحية و البدنية و حتي النفسية
          </p>

          {/* Animated divider */}
          <div className="w-3/4 mx-auto h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-pulse" />
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