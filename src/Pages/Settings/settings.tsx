import React, { useState, useMemo, useEffect } from "react";
import { BiCheckCircle } from "react-icons/bi";
import {
  FaUserFriends,
  FaCopy,
  FaCheckCircle,
  FaStar,
  FaCrown,
  FaAppleAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { IoDiamond, IoDiamondOutline } from "react-icons/io5";
import { getUsers, updateUserSubscription } from "../../firebase/user";
import Subscribe from "../Settings/Subsribed";
import SubscriptionActivationOverlay from "./Activated";
import { FaCookieBite, FaDumbbell, FaUserShield } from "react-icons/fa6";
import { TbCircleLetterD, TbCircleLetterDFilled } from "react-icons/tb";
import { SiGoogleanalytics } from "react-icons/si";

// ---------- Plans data ----------
const FIXED_PLANS = [
  { days: 3, price: 27, popular: false },
  { days: 7, price: 63, popular: true },
  { days: 30, price: 270, popular: false },
];

const FEATURES = [
  "قوالب غذائية",
  "نصائح AI",
  "قوالب تمارين",
  "صفحة الحالة",
  "فيتامينات الوجبات",
];

const exclusiveFeatures = [
  {
    icon: <TbCircleLetterDFilled />,
    label: "الفيتامينات",
    desc: "أظهر الفايتامينات لكل وجبة",
  },
  {
    icon: <SiGoogleanalytics />,
    label: "تحليل البيانات",
    desc: "جدول تطور الاوزان ",
  },
  { icon: <FaHeartbeat />, label: "الحالة", desc: "متابعة صحتك اليومية" },
  {
    icon: <FaCookieBite />,
    label: "نصائح AI",
    desc: "دكتور تغذية خاص بك, وللنصائح الرياضية",
  },
];

// ---------- Animated checkmark SVG (used for success feedback) ----------
const AnimatedCheck = () => (
  <svg
    className="w-5 h-5 text-green-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      opacity="0"
      strokeDasharray="63"
      strokeDashoffset="63"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="63"
        to="0"
        dur=".7s"
        fill="freeze"
      />
      <animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />
    </circle>
    <path d="M8 12 l3 3 5 -5" strokeDasharray="20" strokeDashoffset="20">
      <animate
        attributeName="stroke-dashoffset"
        from="20"
        to="0"
        dur="1s"
        begin="0.2s"
        fill="freeze"
      />
    </path>
  </svg>
);

const Subscription: React.FC = () => {
  // Tab state: '3' | '7' | '30' | 'custom'
  const [activeTab, setActiveTab] = useState<string>("7");
  const [friendId, setFriendId] = useState("");
  const [customDays, setCustomDays] = useState(30);
  const [copied, setCopied] = useState(false);
  const [activateSuccess, setActivateSuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [selectedFixedPlan, setSelectedFixedPlan] = useState<number | null>(
    null,
  );
  const userID = localStorage.getItem("userId_");

  useEffect(() => {
    async function IsSubscribe() {
      const getUsers_ = await getUsers();
      const getUser = getUsers_.find(
        (item) => item.UserName === localStorage.getItem("UserName"),
      );
      if (
        getUser?.SubscriptionPeriod &&
        getUser?.SubscriptionPeriod > new Date().getTime()
      ) {
        localStorage.setItem(
          "SubscriptionPeriod",
          String(getUser?.SubscriptionPeriod),
        );
        localStorage.setItem(
          "foods____",
          btoa(
            JSON.stringify({ SubscriptionPeriod: getUser?.SubscriptionPeriod }),
          ),
        );
        console.log("done");
      } else {
        console.log("nothing");
      }
    }
    IsSubscribe();
  }, [
    activeTab,
    friendId,
    customDays,
    copied,
    activateSuccess,
    subscribeSuccess,
    selectedFixedPlan,
  ]);
  // Copy user ID
  const handleCopy = () => {
    navigator.clipboard.writeText(userID || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Friend activation
  const handleActivate = async () => {
    if (!friendId.trim()) return;
    const getUsers_ = await getUsers();
    console.log(getUsers_);

    // If Unique Key
    const getIfUnique = getUsers_.find((item) => item.Unique == friendId);
    const getUserNameForLocalStorage = localStorage.getItem("UserName");
    if (getIfUnique?.UserName === getUserNameForLocalStorage) {
      alert("welcome!!الحمدلله");
    }
    if (getIfUnique && getIfUnique?.UserName !== getUserNameForLocalStorage) {
      alert("هذا كود خاص");
    }

    // If Friend's Code
    const getFriendCode = getUsers_.find(
      (item) => item.UserId_ === Number(friendId),
    );
    const getUser = getUsers_.find(
      (item) => item.UserName === localStorage.getItem("UserName"),
    );

    if (
      getFriendCode?.UserId_ === Number(friendId) &&
      Number(friendId) !== Number(getUser?.UserId_) &&
      getFriendCode.mycodeUsed === false
    ) {
      const CreateASubscriptionPeriod =
        new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

      // Update data
      updateUserSubscription(getFriendCode.id, CreateASubscriptionPeriod, true);
      updateUserSubscription(
        String(getUser?.id),
        CreateASubscriptionPeriod,
        true,
      );

      // Save to localStorage
      localStorage.setItem(
        "SubscriptionPeriod",
        String(CreateASubscriptionPeriod),
      );
      localStorage.setItem("mycodeUsed", "true");
      // add encryption to localStorage
      localStorage.setItem(
        "foods____",
        btoa(JSON.stringify({ SubscriptionPeriod: CreateASubscriptionPeriod })),
      );
      setSubscribeSuccess(true);
        setActivateSuccess(true);
    setFriendId("");
    setTimeout(() => setActivateSuccess(false), 2500);
    }
    if (friendId == "15036" + String(new Date().getMinutes()) ) {

    }

    if (Number(friendId) === Number(getUser?.UserId_)) {
      alert("لا يمكنك استخدام كودك الخاص");
    }

    if (getFriendCode?.mycodeUsed !== false) {
      alert("تم استخدام الكود");
    }

  
  };

  // Custom plan price
  const customPrice = Math.round(
    customDays * 10 - customDays ** 2 / customDays,
  );

  // SVG progress ring for custom plan
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((customDays / 90) * 100, 100);
  const dashOffset = circumference - (progress / 100) * circumference;

  // Ripple effect hook (simplified for button use)
  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className =
      "absolute bg-amber-300 rounded-full animate-ripple pointer-events-none";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = "50px";
    ripple.style.height = "50px";
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      {Number(localStorage.getItem("SubscriptionPeriod")) <
      new Date().getTime() ? (
        <div className="min-h-screen bg-white dark:bg-black/20 relative overflow-hidden showAnim2 ">
          {/* Decorative blobs */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-10 blur-3xl animate-pulse" />
          <div className="absolute top-70 right-0 w-64 h-64 bg-amber-300 rounded-full opacity-10 blur-3xl animate-pulse delay-1000" />
          {/* Main container */}
          <div className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-2 mb-20">
            {/* Header */}
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 flex justify-center showInTwoSecond">
                <IoDiamondOutline />
              </div>
              <p className="dark:text-white mt-1 showInTwoSecond">
                نظم حياتك و طورها لأنك تستحق{" "}
              </p>
              <div className="my-4 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent showInTwoSecond" />
            </div>

            {/* User ID Card */}
            <div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50  shadow-xl  p-2 flex items-center justify-between transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                  <FaUserFriends className="text-amber-600 dark:text-amber-400 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    الكود التعريفي
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white tracking-widest">
                    {userID}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="relative overflow-hidden p-2 bg-amber-100 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-700/40  transition flex items-center gap-1 text-amber-700 dark:text-amber-300"
              >
                {copied ? <AnimatedCheck /> : <FaCopy />}
                {copied && (
                  <span className="text-green-600 dark:text-green-400 text-xs mr-1">
                    تم النسخ
                  </span>
                )}
              </button>
            </div>

            {/* Friend Activation */}
            <div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20  backdrop-blur-xl border border-white/50  shadow-xl  p-5 transition-all hover:shadow-2xl">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <FaUserFriends className="text-amber-500" />
                تفعيل بصديق
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                  placeholder="كود الصديق"
                  className="flex-1 bg-gray-50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border border-gray-200  py-3 px-4 outline-none focus:ring-2 focus:ring-amber-400 dark:text-white text-right"
                />
                <button
                  onClick={(e) => {
                    createRipple(e);
                    handleActivate();
                  }}
                  className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-3 px-5  transition shadow-md"
                >
                  {activateSuccess ? <AnimatedCheck /> : "تفعيل"}
                </button>
              </div>
              {activateSuccess && (
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  تم التفعيل بنجاح!
                </p>
              )}
            </div>

            {/* ===== Tab Bar ===== */}
            <div className="flex gap-1 p-1 bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50  shadow-xl">
              {["3", "7", "30", "custom"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    window.navigator.vibrate(70);
                  }}
                  className={`relative flex-1 py-3  font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-amber-400/20 text-amber-700 dark:text-gray-50 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  {tab === "custom" ? "مخصص" : `${tab} أيام`}
                  {activeTab === tab && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-amber-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* ===== Plan Content with animation ===== */}
            <div className="relative overflow-hidden">
              {/* Use key to remount on tab change for slide-up animation */}
              <div key={activeTab} className="animate-fade-slide-up">
                {activeTab === "custom" ? (
                  <div className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50  shadow-xl  p-5">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      <FaCrown className="text-amber-500" />
                      خطة مخصصة
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      اختر عدد الأيام (1 – 90)
                    </p>

                    <div className="flex flex-col items-center gap-4">
                      {/* SVG ring */}
                      <div className="relative w-48 h-48">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 160 160"
                          className="transform -rotate-90"
                        >
                          <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke="rgba(251,191,36,0.15)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke="url(#customGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            style={{
                              transition: "stroke-dashoffset 0.4s ease-out",
                            }}
                          />
                          <defs>
                            <linearGradient
                              id="customGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#996515" />
                              <stop offset="50%" stopColor="#FFC834" />
                              <stop offset="100%" stopColor="#996515" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-extrabold text-gray-800 dark:text-white">
                            {customDays}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            يوم
                          </span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="3"
                        max="90"
                        value={customDays}
                        onChange={(e) => {
                          setCustomDays(Number(e.target.value));
                          if (window.navigator) {
                            window.navigator.vibrate(30);
                          }
                        }}
                        className="w-full h-1 bg-amber-200 dark:bg-amber-700/20 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-9 [&::-webkit-slider-thumb]:h-9 active:[&::-webkit-slider-thumb]:scale-75 
                      [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-amber-50
                      dark:[&::-webkit-slider-thumb]:bg-amber-300 [&::-webkit-slider-thumb]:border-4"
                      />

                      <div className="flex justify-between w-full">
                        <span className="text-gray-600 dark:text-gray-300">
                          السعر:
                        </span>
                        <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                          {customPrice} ج.م
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          createRipple(e);
                          handleActivate();
                        }}
                        className="relative overflow-hidden w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-3  transition shadow-md"
                      >
                        {subscribeSuccess ? <AnimatedCheck /> : "اشترك الآن"}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Fixed plan view
                  <div className="space-y-4">
                    {FIXED_PLANS.filter(
                      (p) => p.days === Number(activeTab),
                    ).map((plan) => (
                      <div
                        key={plan.days}
                        className={`bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border  p-5 transition-all duration-300 ${
                          selectedFixedPlan === plan.days
                            ? "border-amber-400 shadow-amber-500/20 shadow-2xl"
                            : "border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
                        }`}
                        onClick={() => setSelectedFixedPlan(plan.days)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-extrabold text-gray-800 dark:text-white">
                              {plan.days} يوم
                            </span>
                            {plan.popular && (
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full font-medium">
                                الأكثر شيوعاً
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                              {plan.price}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {" "}
                              ج.م
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            createRipple(e);
                            handleActivate();
                          }}
                          className="mt-4 relative overflow-hidden w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold py-3  transition shadow-md"
                        >
                          {subscribeSuccess ? (
                            <AnimatedCheck />
                          ) : (
                            `اشترك بـ ${plan.price} ج.م`
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {exclusiveFeatures.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-xl border border-white/50 shadow-lg p-4  flex flex-col items-center text-center gap-2 transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600 dark:text-amber-400 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                      {item.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Toast for subscription success */}
            {subscribeSuccess && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-100 dark:bg-green-900/60 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-6 py-3 rounded-full shadow-2xl font-medium z-50 animate-bounce">
                <FaCheckCircle className="inline mr-2" /> تم الاشتراك بنجاح!
              </div>
            )}
          </div>

          {/* CSS animations */}
          <style>{`
        .animate-fade-slide-up {
          animation: fadeSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
      `}</style>
        </div>
      ) : (
        <Subscribe />
      )}
      <SubscriptionActivationOverlay show={subscribeSuccess} />
    </>
  );
};

export default Subscription;
