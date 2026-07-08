import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaCheck, FaShareAlt, FaTimes } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";

interface SubscribeProps {
  onClose: () => void;
  referralCode?: string;   // optional – defaults to "123456"
}

const Subscribe: React.FC<SubscribeProps> = ({
  onClose,
  referralCode = localStorage.getItem('userId_')
}) => {
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (localStorage.getItem("SubscriptionPeriod")) return null; // Don't show if user already has a subscription

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-[1px] p-4 showAnim2">
      {/* Main card */}
      <div className="relative w-full max-w-sm  border dark:bg-black/95  dark:border-2 dark:border-gray-600/20 border-amber-300 bg-white/95 shadow-2xl  p-6 text-center show-third">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full dark:bg-black/20 dark:border-2 dark:border-gray-600/20 bg-white/60 opacity-70"
        >
          <FaTimes className="text-gray-500 dark:text-gray-300" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="p-3 w-full flex items-center flex-col">
            <IoDiamond className="text-amber-400 dark:text-amber-400 text-6xl" />
<p className="dark:text-white mt-2">
          شارك التطبيق واحصل على 3 أيام VIP مجانية

</p>
        <div className="my-4 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        </h2>

        {/* Explanation steps */}
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 text-right leading-relaxed">
          <p className="py-4 border-r-2 border-amber-300/40  px-2"> <strong>الخطوة ١:</strong> أرسل الكود التعريفي  لصديقك.</p>
          <p className="py-4 border-r-2 border-amber-300/60  px-2"><strong>الخطوة ٢:</strong> صديقك يدخل الكود في <span onClick={() => navigate("/Settings") } className="text-blue-600 dark:text-blue-400 font-medium  p-1 border   ">“تفعيل بصديق”</span> من صفحة أنا.</p>
          <p className="py-4 border-r-2 border-amber-300  px-2"><strong>الخطوة ٣:</strong> بعد التفعيل، تحصل تلقائياً على 3 أيام مجانية!</p>
        </div>

        {/* Divider */}

        {/* Referral code */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">الكود التعريفي الخاص بك</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-extrabold tracking-widest text-gray-800 dark:text-white">
              {referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-amber-100 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-700/40 transition text-amber-700 dark:text-amber-300"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>
          </div>
        </div>

      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Subscribe;