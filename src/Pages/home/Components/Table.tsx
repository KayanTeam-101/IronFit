import React, { useRef, useEffect } from 'react';

const Table = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ---------- helpers ----------
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function calculateDays() {
    const months = Number(localStorage.getItem('challengePeriod')) || 0;
    const total = months * 30;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const startTime = Number(localStorage.getItem('StartedAT') || Date.now());
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startTime) / 86400000);
  const totalDays = calculateDays().length;
  const currentDayNumber = Math.min(daysSinceStart + 1, totalDays);

  // ---------- localStorage trackers ----------
  const noneExerciseDays: number[] = JSON.parse(
    localStorage.getItem('none-exercise') || '[]'
  );
  const eatAllDishesDays: number[] = JSON.parse(
    localStorage.getItem('EatAllDishes') || '[]'
  );

  // ---------- day box background (original logic) ----------
  function getDayColor(dayIndex: number) {
    if (dayIndex < daysSinceStart) {
      return ' bg-white dark:bg-slate-800/40 dark:border dark:border-gray-600/20 text-white';
    }
    if (dayIndex === daysSinceStart) {
      return 'shadow-md text-white bg-orange-500/90  dark:border dark:border-gray-600/20';
    }
    return 'text-gray-500';
  }

  

  // ---------- auto‑scroll to today ----------
  useEffect(() => {
    if (scrollContainerRef.current) {
      const el = document.getElementById(`day-${currentDayNumber}`);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentDayNumber]);

  return (
    <div className={`${localStorage.getItem("Diet") ? "" : "opacity-10"} relative flex flex-col w-full min-h-14 p-2   rounded-2xl border-amber-50`}>
  
      {/* Days row – horizontally scrollable */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex space-x-3 p-1">
          {calculateDays().map((day, idx) => {
            const date = new Date(startTime + idx * 86400000);
            const weekday = weekdays[date.getDay()];
            const bgClass = getDayColor(idx);

            return (
              <div
                key={day}
                id={`day-${day}`}
                className={`flex flex-col items-center w-12 select-none  rounded-full p-1 ${bgClass} `}
              >
                {/* weekday name */}
                <span className="text-[9.5px] text-gray-400 dark:text-gray-100 mt-1.5 whitespace-nowrap">
                  {weekday}
                </span>

                {/* day number box */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-md font-black  `}
                >
                  {day}
                </div>

                {/* status dot */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress info
      <div className=" text-sm text-gray-600 dark:text-gray-400 text-center">
        {`اليوم ${currentDayNumber} من ${totalDays}`}
      </div> */}
    </div>
  );
};

export default Table;