import React, { useMemo } from "react";
import { RiCopperCoinLine } from "react-icons/ri";
import {
  FaTimes,
  FaRegCircle,
  FaFire,
  FaHeart,
  FaCommentAlt,
  FaAppleAlt,
  FaUserFriends,
  FaStar,
  FaCrown,
  FaMedal,
  FaAward,
  FaTrophy,
  FaLock,
} from "react-icons/fa";
import { GiNinjaHead } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";
import { BsStar } from "react-icons/bs";
import { useCountUp } from "../../../Hooks/Increasing";

// ----------------------------------------------------------------
//  Date helpers
// ----------------------------------------------------------------
const todayStr = new Date().toISOString().split("T")[0];

const getArrayFromStorage = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const isTodayInArray = (key: string): boolean => {
  const arr = getArrayFromStorage(key);
  return arr.includes(todayStr);
};

// ----------------------------------------------------------------
//  Daily completion flags
// ----------------------------------------------------------------
const hasPostedToday      = isTodayInArray("PostedDays");
const hasLikedPostToday   = isTodayInArray("LikedDays");
const hasCommentedToday   = isTodayInArray("CommentDays");
const hasEatenAllMeals    = isTodayInArray("DoneDays");
const hasUsedTemplateToday = isTodayInArray("SystemStartDate");
const hasCreatedDietPlanToday = isTodayInArray("SetDietManually");

// One‑time flags
const hasShared = localStorage.getItem("mycodeUsed") === "true";
const isIronVIP = localStorage.getItem("IronVIP") === "true";   // example

// ----------------------------------------------------------------
//  Daily tasks definition
// ----------------------------------------------------------------
interface Task {
  icon: React.ReactNode;
  label: string;
  xp: number;
  condition: boolean;   // for today’s highlighting
}

const DAILY_TASKS: Task[] = [
  {
    icon: <GiNinjaHead className="text-blue-600" />,
    label: "انضم إلي IRON-VIP",
    xp: 200,
    condition: isIronVIP,
  },
  {
    icon: <FaHeart className="text-rose-400" />,
    label: "أضف إعجاب على بوست",
    xp: 10,
    condition: hasLikedPostToday,
  },
  {
    icon: <FaCommentAlt className="text-purple-400" />,
    label: "أضف تعليق على بوست",
    xp: 12,
    condition: hasCommentedToday,
  },
  {
    icon: <BsStar className="text-orange-400" />,
    label: "أضف أول بوست!",
    xp: 25,
    condition: hasPostedToday,
  },
  {
    icon: <FaUserFriends className="text-green-400" />,
    label: "شارك مع اصدقائك",
    xp: 17,
    condition: hasShared,
  },
  {
    icon: <LuDumbbell className="text-blue-400" />,
    label: "جرب استخدام قالب رياضي",
    xp: 13,
    condition: hasUsedTemplateToday,
  },
  {
    icon: <FaAppleAlt className="text-sky-400" />,
    label: "عمل نظامك الغذائي الخاص بك",
    xp: 22,
    condition: hasCreatedDietPlanToday,
  },
  {
    icon: <FaFire className="text-orange-400" />,
    label: "أكمل جميع وجباتك لليوم",
    xp: 30,
    condition: hasEatenAllMeals,
  },
];

// ----------------------------------------------------------------
//  XP calculations
// ----------------------------------------------------------------
const calculateTodayXP = (): number =>
  DAILY_TASKS.reduce((sum, task) => (task.condition ? sum + task.xp : sum), 0);

const calculateAllTimeXP = (): number => {
  // Repeatable daily tasks – each completion date gives the task’s XP
  const repeatable = [
    { key: "PostedDays",       xp: 25 },
    { key: "LikedDays",            xp: 10 },
    { key: "CommentDays",          xp: 12 },
    { key: "DoneDays",             xp: 30 },
    { key: "SystemStartDate",      xp: 13 },
    { key: "SetDietManually",      xp: 22 },
  ];

  let total = 0;

  // 1. Sum up XP from every date in every repeatable task
  repeatable.forEach(({ key, xp }) => {
    const dates = getArrayFromStorage(key);
    total += dates.length * xp;
  });

  // 2. One‑time rewards
  if (hasShared) total += 17;
  if (isIronVIP) total += 200;

  return total;
};

// ----------------------------------------------------------------
//  Badge conditions (persistent achievements)
// ----------------------------------------------------------------
const loadCompletedDates = (): string[] => getArrayFromStorage("CompletedDates");
const loadWeightHistory = (): Record<string, number[]> => {
  try {
    return JSON.parse(localStorage.getItem("weightHistory") || "{}");
  } catch {
    return {};
  }
};
const loadFoodInfo = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem("FoodInfo_s") || "[]");
  } catch {
    return [];
  }
};

const BADGES: Badge[] = (() => {
  const completedDates = loadCompletedDates();
  const weightHistory = loadWeightHistory();
  const foodInfo = loadFoodInfo();

  const streak30 = completedDates.length >= 30;
  const weightImprovedBy50Percent = Object.values(weightHistory).some((weights: number[]) => {
    if (weights.length < 2) return false;
    return weights[weights.length - 1] >= weights[0] * 1.5;
  });
  const mealsRecorded = foodInfo.length >= 50;
  const totalExercises = Object.values(weightHistory).reduce((acc, arr) => acc + arr.length, 0) >= 100;
  const invitedFiveFriends = false;   // extendable
  const achievedMonthlyGoal = false;  // extendable

  return [
    {
      icon: <FaTrophy className="text-yellow-400 text-2xl" />,
      name: "البطل الذهبي",
      description: "أكمل 30 يوم تمرين متتالية",
      earned: streak30,
    },
    {
      icon: <FaMedal className="text-sky-400 text-2xl" />,
      name: "المحترف",
      description: "ارفع أوزانك بنسبة 50%",
      earned: weightImprovedBy50Percent,
    },
    {
      icon: <FaAward className="text-purple-400 text-2xl" />,
      name: "خبير التغذية",
      description: "سجل 50 وجبة",
      earned: mealsRecorded,
    },
    {
      icon: <FaCrown className="text-amber-400 text-2xl" />,
      name: "ملك الجيم",
      description: "أكمل 100 تمرين",
      earned: totalExercises,
    },
    {
      icon: <FaStar className="text-pink-400 text-2xl" />,
      name: "النجم الصاعد",
      description: "ادعُ 5 أصدقاء",
      earned: invitedFiveFriends,
    },
    {
      icon: <FaFire className="text-red-400 text-2xl" />,
      name: "شعلة التحدي",
      description: "حقق هدفك الشهري",
      earned: achievedMonthlyGoal,
    },
  ];
})();

interface Badge {
  icon: React.ReactNode;
  name: string;
  description: string;
  earned: boolean;
}

// ----------------------------------------------------------------
//  Tasks & Badges Panel
// ----------------------------------------------------------------
const TasksPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState<"tasks" | "badges">("tasks");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] p-4 show-first">
      <div className="relative w-full max-w-sm min-h-3/4 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-amber-300/60 dark:border-gray-600/50 shadow-2xl rounded-3xl p-6 text-center show-third">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <FaTimes className="text-gray-a500 dark:text-gray-300" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <RiCopperCoinLine className="text-amber-500 dark:text-white mb-2 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {activeTab === "tasks" ? "المهام اليومية" : "الأوسمة"}
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {activeTab === "tasks" ? "أكمل المهام لتربح نقاط XP" : "أوسمة تكتسبها مع تقدمك"}
        </p>

        <div className="flex mb-4 p-1 bg-gray-100/60 dark:bg-gray-700/40 rounded-xl">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "tasks"
                ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            مهام
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "badges"
                ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            أوسمة
          </button>
        </div>

        {activeTab === "tasks" ? (
          <div className="space-y-2 text-right max-h-76 overflow-y-auto">
            {DAILY_TASKS.map((task, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-3 border-2 p-3 ${
                  task.condition
                    ? "bg-teal-100 border-teal-600 dark:border-teal-300 dark:bg-teal-500/20"
                    : "bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-gray-600/30"
                } rounded-3xl hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    {task.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {task.label}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                      +{task.xp} XP
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto">
            {BADGES.map((badge, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  badge.earned
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40 shadow-sm"
                    : "bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/30 opacity-80"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  {badge.earned ? (
                    badge.icon
                  ) : (
                    <div className="relative">
                      {badge.icon}
                      <FaLock className="absolute -bottom-1 -right-1 text-gray-400 dark:text-gray-500 text-xs bg-white dark:bg-gray-800 rounded-full p-0.5" />
                    </div>
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      badge.earned
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {badge.name}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                    {badge.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          {activeTab === "tasks" ? "تتجدد المهام يومياً" : "استمر في التقدم لفتح المزيد"}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
//  XP Badge
// ----------------------------------------------------------------
const Xp: React.FC = () => {
  const [showTasks, setShowTasks] = React.useState(false);
  const allTimeXP = useMemo(() => calculateAllTimeXP(), []);

  return (
    <>
      <div
        onClick={() => setShowTasks(true)}
        className="relative min-w-[4rem] p-2 h-14 overflow-hidden border-2 flex flex-row items-center justify-center text-center shadow-sm dark:bg-amber-400/10 dark:border-2 dark:border-amber-600/20 border-gray-100 rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-95"
      >
        <div className="text-[13px] dark:text-white text-gray-400 flex flex-row gap-0.5 mt-1">
          <RiCopperCoinLine className="text-[16px]" /> XP
        </div>
        <div className="text-lg font-bold dark:text-amber-100 animate-pulse ml-1">
          {useCountUp(allTimeXP, 600)}
        </div>
        <div className="absolute bottom-0 right-0 w-[40%] h-0.5 bg-amber-500" />
      </div>

      {showTasks && <TasksPanel onClose={() => setShowTasks(false)} />}
    </>
  );
};

export default Xp;