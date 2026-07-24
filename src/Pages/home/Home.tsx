import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { FaFire } from "react-icons/fa6";
import Fire from "../../assets/animatedFire.gif";
import { RiCopperCoinLine } from "react-icons/ri";
import { calculateAllTimeXP } from "./Components/Xp";
import { ImInfo } from "react-icons/im";
import Subscribe from "./Components/Subscribe";

const ExerciseDay = lazy(() => import("./Components/ExcrsiceDay"));
const Table = lazy(() => import("./Components/Table"));
const InstallButton = lazy(() => import("./Components/InstallButton"));
const StatusPage = lazy(() => import("../StatusPage/StatusPage"));
const TodayTask = lazy(() => import("./Components/TodayTask"));
const TasksPanel = lazy(() =>
  import("./Components/Xp").then((mod) => ({ default: mod.TasksPanel }))
);

const calculateStreak = (): number => {
  const raw = localStorage.getItem("DoneDays");
  if (!raw) return 0;
  let dates: string[];
  try { 
    dates = JSON.parse(raw);
  } catch {
    return 0;
  }
  if (!Array.isArray(dates) || dates.length === 0) return 0;
  const sorted = dates
    .map((dateStr) => new Date(dateStr + "T00:00:00"))
    .sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const mostRecent = new Date(sorted[0]);
  mostRecent.setHours(0, 0, 0, 0);
  if (
    mostRecent.getTime() !== today.getTime() &&
    mostRecent.getTime() !== yesterday.getTime()
  )
    return 0;
  let streak = 1;
  let current = new Date(mostRecent);
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i]);
    prev.setHours(0, 0, 0, 0);
    const diffDays =
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
      current = prev;
    } else break;
  }
  return streak;
};

const Home = () => {
  const [allTimeXP, setAllTimeXP] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [isActive, setIsActive] = useState(false);

  // Initialize localStorage only once
  useEffect(() => {
    if (!localStorage.getItem("StartedAT")) {
      localStorage.setItem("StartedAT", String(Date.now()));
    }
    const isFirst = localStorage.length < 8;
    localStorage.setItem("isFirstTime", isFirst ? "true" : "false");
  }, []);

  // Fetch XP
  useEffect(() => {
    const fetchXp = async () => {
      const xp = await calculateAllTimeXP();
      setAllTimeXP(xp);
    };
    fetchXp();
  }, []);

  // Check subscription
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
      } catch {}
    }
    setIsActive(false);
  }, []);

  // Derive profile data once on mount
  const [profile, setProfile] = useState({
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    age: 0,
    challengePeriod: 0,
    gender: "",
  });
  useEffect(() => {
    setProfile({
      currentWeight: Number(localStorage.getItem("currentWeight") || 0),
      targetWeight: Number(localStorage.getItem("targetWeight") || 0),
      height: Number(localStorage.getItem("height") || 0),
      age: Number(localStorage.getItem("age") || 0),
      challengePeriod: Number(localStorage.getItem("challengePeriod") || 0),
      gender: localStorage.getItem("SelectedGender") || "",
      
    });
  }, []);

  const dailyCaloriesGoal = useMemo(() => {
    const { currentWeight, targetWeight, height, age, challengePeriod, gender } =
      profile;
    if (!challengePeriod || challengePeriod <= 0) return 0;
    let bmr: number;
    if (gender === "ذكر") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }
    const tdee = bmr * 1.5;
    const weightDiff = targetWeight - currentWeight;
    const totalCaloriesNeeded = weightDiff * 7700;
    const days = challengePeriod * 30;
    if (days === 0) return Math.round(tdee);
    const daily = tdee + totalCaloriesNeeded / days;
    return Math.round(daily);
  }, [profile]);

  useEffect(() => {
    if (dailyCaloriesGoal > 0) {
      localStorage.setItem("dailyCalories", String(dailyCaloriesGoal));
    }
  }, [dailyCaloriesGoal]);

  const streak = useMemo(() => calculateStreak(), []);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden p-2 flex flex-col gap-5 show-first">
      {showSubscribe && !isActive && (
        <Subscribe onClose={() => setShowSubscribe(false)} />
      )}

      <Suspense fallback={null}>
        <div className="relative w-full min-h-14 flex flex-col">
          <div className="w-full flex flex-row justify-between z-10">
            <div
              className={`text-2xl flex flex-row items-center gap-2.5 ${
                localStorage.getItem("Diet") ? "" : "opacity-10"
              }`}
            >
              <div className="h-12 w-12 rounded-full">
                <img
                  src={localStorage.getItem("PhotoUrl") || ""}
                  alt="user"
                  className="w-full h-full scale-105 border border-orange-500 object-cover rounded-full shadow-[0_0_10px_-2px_orange]"
                />
              </div>
              <div className="flex flex-col">
                <p className="dark:text-white font-thin text-[15px]">
                  اهلاً {localStorage.getItem("UserName")} 👋
                </p>
                <p className="font-thin text-[12px] -mb-2 text-gray-500">
                  جاهز ليوم مليئ بالتحديات؟🔥
                </p>
              </div>
            </div>
            <InstallButton />
          </div>
          <br />

          <Table />
          <TodayTask />

          {showTasks && (
            <TasksPanel
              showTasks={showTasks}
              setShowTasks={setShowTasks}
              showRanking={showRanking}
              setShowRank={setShowRanking}
              onClose={() => setShowTasks(false)}
            />
          )}

          {/* Streak and XP cards */}
          <div className="flex flex-row gap-3">
            <div
              onClick={() =>
                alert(
                  "الأيام النشطة عبارة عن الأيام ال إنتظمت فيها حيث كان يوم تمرين و لعبتو أو أكلت وجبة اليوم كاملة"
                )
              }
              className={`${
                localStorage.getItem("Diet") ? "" : "opacity-10"
              } relative rounded-3xl active:scale-85 transition-all bg-white dark:bg-[#222]/50 dark:border-2 dark:border-gray-600/20 text-white text-xl font-black tracking-tight flex flex-row w-1/2 justify-between items-center p-2 shadow-sm ${
                localStorage.getItem("hasCongratulatedDiet") &&
                !localStorage.getItem("openXpBefore")
                  ? "opacity-20"
                  : ""
              }`}
            >
              <ImInfo className="absolute top-2 left-3 text-gray-400 text-[12px]" />
              <p className="relative flex flex-row bg-linear-to-r from-rose-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent items-center gap-1 mt-2">
                الأيام النشطة
              </p>
              <div className="flex p-2 rounded-xl items-center gap-2.5">
                {streak > 0 ? (
                  <img src={Fire} alt="Fire" className="w-6 h-6 animate-pulse" />
                ) : (
                  <FaFire className="text-gray-400" />
                )}
                <span className="text-amber-500 font-extrabold mt-1">
                  {streak}
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                setShowTasks(true);
                localStorage.setItem("openXpBefore", "done");
              }}
              className={`relative rounded-3xl bg-white dark:bg-[#222]/50 dark:border-2 dark:border-gray-600/20 active:scale-85 active:opacity-65 transition delay-75 text-white text-xl font-black tracking-tight flex flex-row w-1/2 justify-between items-center p-2 shadow-sm ${
                localStorage.getItem("Diet") ? "" : "opacity-10"
              } ${
                localStorage.getItem("hasCongratulatedDiet") &&
                !localStorage.getItem("openXpBefore")
                  ? "outline-swealing2"
                  : ""
              }`}
            >
              <p className="flex flex-row bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent items-center gap-1 mt-2">
                نقاط Xp
              </p>
              <div className="flex p-2 rounded-xl items-center gap-2.5">
                <RiCopperCoinLine className="text-blue-500" />
                {!localStorage.getItem("hasCongratulatedDiet") &&
                localStorage.getItem("openXpBefore") ? (
                  <ImInfo className="absolute top-2 right-3 text-gray-400 text-[12px]" />
                ) : (
                  ""
                )}
                <span className="dark:text-white text-gray-600 font-extrabold mt-2">
                  {allTimeXP}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ExerciseDay />
        <StatusPage />
      </Suspense>

      <div className="h-14" />
    </div>
  );
};

export default Home;