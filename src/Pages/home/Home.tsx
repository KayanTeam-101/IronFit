import { GoHomeFill } from "react-icons/go";
import { FaBowlFood, FaCookieBite, FaFire } from "react-icons/fa6";
import { BiInfoCircle } from "react-icons/bi";
import ExerciseDay from "./Components/ExcrsiceDay";
import Table from "./Components/Table";
import { useEffect, useMemo, useState } from "react";
import Fire from '../../assets/animatedFire.gif'
import InstallButton from "./Components/InstallButton";
import StatusPage from "../StatusPage/StatusPage";
import { useCountUp } from "../../Hooks/Increasing";
import Subscribe from "./Components/Subscribe";
import { giveHealthAdvice } from "../../utilities/GiveAdvice";
import { NavLink } from "react-router-dom";

// ---------- Streak calculator ----------
const calculateStreak = (): number => {
  const raw = localStorage.getItem("CompletedDates");
  if (!raw) return 0;
  let dates: string[];
  try {
    dates = JSON.parse(raw);
  } catch {
    return 0;
  }
  if (!Array.isArray(dates) || dates.length === 0) return 0;

  // Convert to Date objects and sort newest first
  const sorted = dates
    .map((dateStr) => {
      const [y, m, day] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, day);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const mostRecent = new Date(sorted[0]);
  mostRecent.setHours(0, 0, 0, 0);

  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  let current = new Date(mostRecent);

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i]);
    prev.setHours(0, 0, 0, 0);
    const diffDays = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
      current = prev;
    } else {
      break;
    }
  }

  return streak;
};

const Home = () => {
  // Ensure StartedAT timestamp
  if (!localStorage.getItem("StartedAT")) {
    localStorage.setItem("StartedAT", new Date().getTime().toString());
  }

  // Set isFirstTime based on localStorage length
  if (localStorage.length < 8) {
    localStorage.setItem("isFirstTime", "true");
  } else {
    localStorage.setItem("isFirstTime", "false");
  }
    const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
    const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
    const height = Number(localStorage.getItem("height") || 0);
    const age = Number(localStorage.getItem("age") || 0);
    const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
    const gender = localStorage.getItem("SelectedGender") || "";
      const [showSubscribe, setShowSubscribe] = useState(true); // or false
  const [IsActive, setIsActive] = useState(false);

  useEffect(() => {
   
  
   const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        const period = decoded.SubscriptionPeriod;
        if (period && period > Date.now()) {
          setIsActive(true);
          return;
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []);

  
    // Calculate daily calorie goal once
    const dailyCaloriesGoal = useMemo(() => {
      if (!challengePeriod || challengePeriod <= 0) return 0;
  
      let bmr: number;
      if (gender === "ذكر") {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
      }
  
      const tdee = bmr * 1.5; // activity factor
      const weightDiff = targetWeight - currentWeight;
      const totalCaloriesNeeded = weightDiff * 7700;
      const days = challengePeriod * 30;
  
      if (days === 0) return Math.round(tdee);
      const daily = tdee + totalCaloriesNeeded / days;
      localStorage.setItem("dailyCalories", Math.round(daily).toString());
      return Math.round(daily);
    }, [currentWeight, targetWeight, height, age, challengePeriod, gender]);
  
    useEffect(() => {
    if (dailyCaloriesGoal > 0) {
      localStorage.setItem("dailyCalories", dailyCaloriesGoal.toString());
    }
  }, [dailyCaloriesGoal]);


  const IsThere_A_Diet = localStorage.getItem("Diet");
  const streak = useMemo(() => calculateStreak(),[]);
  const Advice = giveHealthAdvice();
  return (
    <div className="relative min-h-screen w-screen  overflow-hidden p-4 flex flex-col gap-2.5 show-first">
          {showSubscribe  && !IsActive && (
        <Subscribe onClose={() => setShowSubscribe(false)} />
      )}
      {/* Decorative blur */}
      <div className="relative w-full min-h-14 flex  flex-col">
      <div className="w-full flex flex-row justify-between">

          <div className="text-2xl flex flex-row gap-1.5">
            <GoHomeFill className="dark:text-white mt-2.5"/>
            <div className="p-1.5 bg-linear-to-r bg-clip-text  from-yellow-500 via-orange-500  to-pink-500 felx justify-center align-center rounded-full text-sm text-transparent font-bold">
            
  V1.2.55
  <br />
<a href="https://www.tiktok.com/@iron_fit_app" target="_blank" rel="noopener noreferrer" className="underline text-amber-500">
  شاركنا رأيك
</a>
            </div>
          </div>
        <InstallButton /> 
        
      </div>
        <br />

        {IsThere_A_Diet ? (
          <>
            {/* Advice card */}
            <div className="w-full rounded-3xl mb-2 p-5 shadow-sm dark:bg-black/20 dark:border-2 dark:border-gray-600/20  bg-white flex flex-row gap-2">
              <FaCookieBite className="text-2xl text-amber-500 dark:text-amber-300" />
              <p className="font-light text-md show-third dark:text-white">{Advice}</p>
            </div>

            {/* Active streak card */}
            <div className="rounded-3xl bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white text-xl font-black tracking-tight flex flex-row justify-between items-center p-5 shadow-sm">
              <p className="flex flex-row bg-linear-to-r from-rose-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent items-center gap-1">
                الأيام النشطة 
              </p>
              <div className="flex bg-gray-50 dark:bg-transparent p-2 rounded-xl items-center gap-2.5">
            {streak > 0 ?
             <img src={Fire} alt="Fire" className="w-6 h-6 animate-pulse" />
             : <FaFire className="text-gray-400" />}
                <span className="text-amber-500 font-extrabold mt-1 ">{useCountUp(streak)}</span>
              </div>
            </div>
          </>
        ) : (
          /* No diet yet – prompt to create one */
          <NavLink to="/me/food">
            <div className="w-full rounded-2xl mt-1.5 p-5 shadow-sm bg-white dark:bg-gray-400/15  dark:border-gray-600/20 flex flex-row gap-2 border-4 animate-pulse delay-1000">
              <FaBowlFood className="text-2xl text-amber-300" />
              <p className="font-light text-md show-first dark:text-white">دعنا نصنع أفضل نظام غذائي!</p>
            </div>
          </NavLink>
        )}
      </div>

      <ExerciseDay />
      <Table />
      <StatusPage />
      <div className="h-14" />
    </div>
  );
};

export default Home;