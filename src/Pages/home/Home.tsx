import { GoHomeFill } from "react-icons/go";
import { FaBowlFood, FaCookieBite, FaFire } from "react-icons/fa6";
import { BiInfoCircle } from "react-icons/bi";
import ExerciseDay from "./Components/ExcrsiceDay";
import Table from "./Components/Table";
import { useMemo } from "react";


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
      const [y, m, day] = dateStr.split("-").map(Number);   // ✅ 'day' instead of 'd'
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

  const IsThere_A_Diet = localStorage.getItem("Diet");
  const streak = useMemo(() => calculateStreak(), []);
  const Advice = "قليلُ مستمر خيرُ من كثيرٍ منقطع";

  return (
    <div className="relative min-h-screen w-screen overflow-hidden p-5 flex flex-col gap-1.5 show-first">
      {/* Decorative blur */}
      <div className="absolute top-10 z-0 w-full h-[400px] opacity-35 blur-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300" />

      <div className="relative w-full min-h-14 flex flex-col">
        <div className="text-2xl"><GoHomeFill /></div>
        <br />

        {IsThere_A_Diet ? (
          <>
            {/* Advice card */}
            <div className="w-full rounded-3xl mb-2 p-5 shadow-sm bg-white flex flex-row gap-2">
              <FaCookieBite className="text-2xl text-sky-500" />
              <p className="font-light text-md show-third">{Advice}</p>
            </div>

            {/* Active streak card */}
            <div className="rounded-3xl bg-white text-white text-xl font-black tracking-tight flex flex-row justify-between items-center p-5 shadow-sm">
              <p className="flex flex-row bg-gradient-to-r from-rose-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent items-center gap-1">
                الأيام النشطة 
              </p>
              <div className="flex bg-gray-50 p-2 rounded-xl items-center gap-2.5">
                <FaFire className={`text-2xl ${streak > 0 ? "text-amber-500 " : "text-gray-300"}`} />
                <span className="text-amber-500 font-extrabold mt-1 ">{streak}</span>
              </div>
            </div>
          </>
        ) : (
          /* No diet yet – prompt to create one */
          <a href="/me/food">
            <div className="w-full rounded-2xl mt-1.5 p-5 shadow-sm bg-white flex flex-row gap-2 outline-swealing">
              <FaBowlFood className="text-2xl text-sky-500" />
              <p className="font-light text-md show-first">دعنا نصنع أفضل نظام غذائي!</p>
            </div>
          </a>
        )}
      </div>

      <ExerciseDay />
      <Table />
      <div className="h-14" />
    </div>
  );
};

export default Home;