import React, { useEffect, useState, useCallback } from "react";
import { BiCheckCircle } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaClock,
  FaHourglassHalf,
  FaStopwatch,
} from "react-icons/fa";
import { IoDiamond, IoDiamondOutline } from "react-icons/io5";

// -------- دالة توجيه بسيطة --------
const navigate = (path: string) => {
  window.location.href = path;
};

// -------- مكون المؤقت التنازلي (نفسه) --------
const CountdownTimer: React.FC<{ targetTimestamp: number }> = ({ targetTimestamp }) => {
  const calculateTimeLeft = useCallback(() => {
    const now = Date.now();
    const difference = targetTimestamp - now;
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetTimestamp]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex justify-center gap-3 text-center">
      {/* الأيام */}
      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-gray-700/40 shadow-lg  p-3 min-w-[70px]">
        <FaCalendarAlt className="mx-auto text-amber-500 dark:text-amber-400 text-lg mb-1" />
        <span className="block text-3xl font-extrabold text-gray-800 dark:text-white tabular-nums">
          {pad(timeLeft.days)}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">يوم</span>
      </div>
      {/* الساعات */}
      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-gray-700/40 shadow-lg  p-3 min-w-[70px]">
        <FaClock className="mx-auto text-amber-500 dark:text-amber-400 text-lg mb-1" />
        <span className="block text-3xl font-extrabold text-gray-800 dark:text-white tabular-nums">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">ساعة</span>
      </div>
      {/* الدقائق */}
      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-gray-700/40 shadow-lg  p-3 min-w-[70px]">
        <FaHourglassHalf className="mx-auto text-amber-500 dark:text-amber-400 text-lg mb-1" />
        <span className="block text-3xl font-extrabold text-gray-800 dark:text-white tabular-nums">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">دقيقة</span>
      </div>
      {/* الثواني */}
      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-gray-700/40 shadow-lg  p-3 min-w-[70px]">
        <FaStopwatch className="mx-auto text-amber-500 dark:text-amber-400 text-lg mb-1" />
        <span className="block text-3xl font-extrabold text-gray-800 dark:text-white tabular-nums transition-colors duration-100">
          {pad(timeLeft.seconds)}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">ثانية</span>
      </div>
    </div>
  );
};

// -------- صفحة المشتركين فقط --------
const SubscribedOnlyPage: React.FC = () => {
  const [isValid, setIsValid] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<number>(0);

  useEffect(() => {
    const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        const period = decoded.SubscriptionPeriod;
        if (period && period > Date.now()) {
          setIsValid(true);
          setSubscriptionEnd(period);
          return;
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []); // بدون navigate في مصفوفة التبعيات لأنه ثابت

  if (!isValid) {
    return (
      <div className="min-h-screen bg-white dark:bg-black/20 flex items-center justify-center">
        <div className="animate-pulse text-amber-600 dark:text-amber-400 text-xl">
          جاري التحقق من الاشتراك...
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white dark:bg-black/20 relative overflow-hidden showAnim2">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-10 blur-3xl animate-pulse" />
      <div className="absolute top-70 right-0 w-64 h-64 bg-amber-300 rounded-full opacity-10 blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-4 mb-20">
        <div className="text-center">
          <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 flex justify-center showInTwoSecond">
            <IoDiamond />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-2 showInTwoSecond">
            مرحباً بك في المساحة المميزة
          </h1>
          <p className="text-gray-500 dark:text-gray-400 showInTwoSecond">اشتراكك نشط – استمتع بكل الميزات</p>
          <div className="my-4 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent showInTwoSecond" />
        </div>
<div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50 shadow-xl p-5 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium"> {localStorage.getItem("UserName") + " -  " + localStorage.getItem("userId_")}</p>
        </div>
        <div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50 shadow-xl p-5 transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <IoDiamondOutline className="text-amber-500" /> الوقت المتبقي
            </h3>
            
          </div>
          <CountdownTimer targetTimestamp={subscriptionEnd} />
        </div>

    

        <div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50 shadow-xl p-5 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium"> أنت من الـ 1% المميزين – استمر في التطور!</p>
        </div>
      </div>

      <style>{`
        .animate-fade-slide-up {
          animation: fadeSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SubscribedOnlyPage;