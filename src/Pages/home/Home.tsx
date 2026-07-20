import { GoHomeFill } from "react-icons/go";
import { FaBowlFood, FaCookieBite, FaFire } from "react-icons/fa6";
import { BiInfoCircle } from "react-icons/bi";
import ExerciseDay from "./Components/ExcrsiceDay";
import Table from "./Components/Table";
import React, { useEffect, useMemo, useState } from "react";
import Fire from '../../assets/animatedFire.gif'
import InstallButton from "./Components/InstallButton";
import StatusPage from "../StatusPage/StatusPage";
import { useCountUp } from "../../Hooks/Increasing";
import Subscribe from "./Components/Subscribe";
import { TasksPanel } from "./Components/Xp";
import { NavLink } from "react-router-dom";
import { RiCopperCoinLine } from "react-icons/ri";
import { PiTiktokLogoBold, PiTiktokLogoLight } from "react-icons/pi";
import TodayTask from "./Components/TodayTask";
import Xp, { calculateAllTimeXP } from "./Components/Xp";
import { getUserRank, getUsers } from "../../firebase/user";
import { BsInfoCircleFill } from "react-icons/bs";
import { ImInfo } from "react-icons/im";
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

const getUsers_ = await getUsers();
const thisUser =getUsers_.find(item => item.UserId_ === Number(localStorage.getItem("userId_")))
export const rank = await getUserRank(thisUser?.id || "");
localStorage.setItem("rank",String(rank));

const Home = () => {
  // Ensure StartedAT timestamp
const [allTimeXP, setAllTimeXP] = React.useState(0);
const [showTasks, setShowTasks] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    const fetchXp = async () => {
      const xp = await calculateAllTimeXP();
      setAllTimeXP(xp);
    };
    fetchXp();
  }, []);
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


  const streak = useMemo(() => calculateStreak(),[]);
  return (
    <div className="relative min-h-screen w-screen  overflow-hidden p-4 flex flex-col gap-5 show-first">
          {showSubscribe  && !IsActive && (
        <Subscribe onClose={() => setShowSubscribe(false)} />
      )}
      {/* Decorative blur */}
      <div className="relative w-full min-h-14 flex  flex-col">
      <div className="w-full flex flex-row justify-between">

          <div className="text-2xl flex flex-row items-center  gap-2.5">
<div className="h-12 w-12  rounded-full ">
  <img src={localStorage.getItem("PhotoUrl") || ""} alt="user imgage" className="w-full h-full scale-105 border border-orange-500 object-cover rounded-full shadow-[0_0_10px_-2px_orange]" />
</div>
<div className="flex flex-col">
  <p className="dark:text-white font-thin text-[15px]"> اهلاً  {localStorage.getItem("UserName")} 👋</p>
  <p className="font-thin text-[12px] -mb-2 text-gray-500"> جاهز ليوم مليئ بالتحديات؟🔥</p>
  
  </div>          
          </div>
        <InstallButton /> 
        
      </div>
        <br />

          
            {/* Advice card */}
      <Table />
    <TodayTask />

     {showTasks && <TasksPanel   showTasks={showTasks}
        setShowTasks={setShowTasks}
        showRanking={showRanking}
        setShowRank={setShowRanking} onClose={() => setShowTasks(false)} />}

            {/* Active streak card */}
          <div className="flex flex-row gap-3">
                <div className={` ${localStorage.getItem("Diet") ? "" : "opacity-60"} rounded-3xl bg-white dark:bg-[#222]/50 dark:border-2 dark:border-gray-600/20 text-white text-xl font-black tracking-tight flex flex-row  w-1/2 justify-between items-center p-2 shadow-sm`}>
              <p className="flex flex-row bg-linear-to-r from-rose-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent items-center gap-1 mt-2">
                الأيام النشطة 
              </p>
              <div className="flex  p-2 rounded-xl items-center gap-2.5">
            {streak > 0 ?
             <img src={Fire} alt="Fire" className="w-6 h-6 animate-pulse" />
             : <FaFire className="text-gray-400" />}
                <span className="text-amber-500 font-extrabold mt-1 ">{useCountUp(streak,800)}</span>
              </div>
            </div>
            
              <div 
  onClick={() => setShowTasks(true)}   // ✅ أضف هذا السطر
              className={`relative rounded-3xl  bg-white dark:bg-[#222]/50 dark:border-2 dark:border-gray-600/20 active:scale-85 active:opacity-65 transition delay-75 text-white text-xl font-black tracking-tight flex flex-row  w-1/2 justify-between items-center p-2 shadow-sm ${localStorage.getItem("Diet") ? "" : "opacity-60"}`}>
              <p className="flex flex-row bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent items-center gap-1 mt-2">
                 نقاط Xp
              </p>
              <div className="flex  p-2 rounded-xl items-center gap-2.5">
           <RiCopperCoinLine className="text-blue-500 " />
           <ImInfo className="absolute top-2 right-2 text-gray-400 text-[12px]"/>
                <span className="dark:text-white text-gray-600 font-extrabold mt-2 ">{useCountUp( allTimeXP,800)}</span>
              </div>
            </div>
            
          </div>
          
      </div>

      <ExerciseDay />
      <StatusPage />
      
      <div className="h-14" />
    </div>
  );
};

export default Home;