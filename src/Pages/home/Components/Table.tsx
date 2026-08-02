import React, { useRef, useEffect, useMemo } from "react";
import { FaCalendarDays } from "react-icons/fa6";

// Short Arabic weekday labels — the rest of the app is fully Arabic, English
// "Sun/Mon/..." abbreviations were the main thing breaking the harmony here.
const weekdays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

const Table = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalDays = useMemo(() => {
    const months = Number(localStorage.getItem("challengePeriod")) || 0;
    const total = months * 30;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, []);

  const startTime = useMemo(
    () => Number(localStorage.getItem("StartedAT") || Date.now()),
    []
  );

  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - startTime) / 86400000
  );
  const currentDayNumber = Math.min(daysSinceStart + 1, totalDays.length);

  const getDayVariant = (dayIndex: number): "past" | "today" | "future" => {
    if (dayIndex === daysSinceStart) return "today";
    if (dayIndex < daysSinceStart) return "past";
    return "future";
  };

  // Reuses the app's existing colour language: neutral card fill for history,
  // the same amber → orange gradient the primary CTAs use for "today", and a
  // quiet, receding treatment for days that haven't happened yet.
  const dayVariantClasses: Record<"past" | "today" | "future", string> = {
    past: "bg-gray-100 dark:bg-slate-800/40 dark:border dark:border-gray-600/20 text-gray-500 dark:text-gray-300",
    today:
      "today-pulse text-white bg-linear-to-br from-amber-400 to-orange-500 dark:border dark:border-orange-300/20",
    future: "text-gray-300 dark:text-gray-600",
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const el = document.getElementById(`day-${currentDayNumber}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentDayNumber]);

  return (
    <div
      className={`${
        localStorage.getItem("Diet") ? "" : "opacity-10"
      } ${
        localStorage.getItem("hasCongratulatedDiet") &&
        !localStorage.getItem("openXpBefore")
          ? "opacity-20"
          : ""
      } table-card-enter relative flex flex-col w-full min-h-14 p-3`}
    >
      <style>{`
        @keyframes tableCardFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .table-card-enter { animation: tableCardFadeIn 320ms cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes todayPulse {
          0%, 100% { box-shadow: 0 4px 14px -2px rgba(249,115,22,0.35), 0 0 0 0 rgba(249,115,22,0.35); }
          50% { box-shadow: 0 4px 14px -2px rgba(249,115,22,0.35), 0 0 0 6px rgba(249,115,22,0.08); }
        }
        .today-pulse { animation: todayPulse 2.4s ease-in-out infinite; }

        .scroll-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
          mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .table-card-enter, .today-pulse { animation: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold dark:text-white text-gray-700 flex items-center gap-1.5">
          <FaCalendarDays className="text-orange-400 text-xs" /> جدول أيامك
        </h3>
        {totalDays.length > 0 && (
          <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
            اليوم {currentDayNumber} من {totalDays.length}
          </span>
        )}
      </div>

      {totalDays.length === 0 ? (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-3">
          هيظهر جدول أيامك بعد ما تحدد مدة تحديك
        </p>
      ) : (
        <div
          ref={scrollContainerRef}
          className="scroll-fade overflow-x-auto pb-1"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="flex gap-2.5 p-1">
            {totalDays.map((day, idx) => {
              const date = new Date(startTime + idx * 86400000);
              const weekday = weekdays[date.getDay()];
              const variant = getDayVariant(idx);
              return (
                <div
                  key={day}
                  id={`day-${day}`}
                  className={`flex flex-col items-center w-12 select-none rounded-full p-1 transition-transform active:scale-90 ${dayVariantClasses[variant]}`}
                >
                  <span className="text-[10px] font-semibold tracking-wide mt-1.5 whitespace-nowrap opacity-80">
                    {weekday}
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-md font-black">
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;