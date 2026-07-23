import React, { useRef, useEffect, useMemo } from "react";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const getDayColor = (dayIndex: number) => {
    if (dayIndex < daysSinceStart)
      return "bg-white dark:bg-slate-800/40 dark:border dark:border-gray-600/20 text-white";
    if (dayIndex === daysSinceStart)
      return "shadow-md text-white bg-orange-500/90 dark:border dark:border-gray-600/20";
    return "text-gray-500";
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
      } relative flex flex-col w-full min-h-14 p-2 rounded-2xl border-amber-50`}
    >
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-1"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex space-x-3 p-1">
          {totalDays.map((day, idx) => {
            const date = new Date(startTime + idx * 86400000);
            const weekday = weekdays[date.getDay()];
            const bgClass = getDayColor(idx);
            return (
              <div
                key={day}
                id={`day-${day}`}
                className={`flex flex-col items-center w-12 select-none rounded-full p-1 ${bgClass}`}
              >
                <span className="text-[9.5px] text-gray-400 dark:text-gray-100 mt-1.5 whitespace-nowrap">
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
    </div>
  );
};

export default Table;