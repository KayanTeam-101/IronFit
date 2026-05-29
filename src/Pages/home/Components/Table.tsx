import React from 'react'
import {BsFlagFill } from "react-icons/bs";

const Table = () => {
  // Function to generate array of day numbers (1, 2, 3... up to total days)
  function calculateDays() {
    const getMonthsCount: number = Number(localStorage.getItem("challengePeriod")) || 0; 
    const NOD = getMonthsCount * 30;
    const daysArray = [];
    for (let i = 1; i <= NOD; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }



  // Alternative version if you want to track "completed" days
  function getDayColorAlternative(day: number) {
    // Get the current day of challenge (1-based)
      const startTime = Number(localStorage.getItem("StartedAT"));
          console.log("Start Time :" + startTime);
          
          const today = new Date();
          const daysSinceStart = Math.floor((today.getTime() - startTime) / (60 * 60 * 24 *1000));

          console.log("Days Since Start :"+ daysSinceStart );
          
    // If this day is in the past of the challenge
    if (day < daysSinceStart) {
      return "bg-linear-to-t from-blue-200 scale-90 opacity-60   dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/20  text-white"; // Completed days
    } 
    // If this is today's challenge day
    
    else if (day === daysSinceStart) {
      return "bg-linear-to-t from-sky-300 to-blue-400 shadow-md text-white dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/20 "; // Current day
    }else{
      return " text-gray-500"; // Future days
    }
  }

  return (
    <div className='relative flex items-center flex-col w-full min-h-14 p-2 bg-white  dark:bg-black/40 dark:border-2 dark:border-gray-600/20 rounded-2xl border-sky-50 '>
      <div className='w-full h-10 flex items-center justify-between border-b-2 border-sky-100 dark:border-b-gray-400/20 mb-2'>
        <div className='flex items-center'>
          <span className='dark:text-white'>تقدمي</span>
        </div>
        <div className='flex items-center'>
          <BsFlagFill className=' text-xl dark:text-white' />
        </div>
      </div>
      {/* End Header */}
      <div className='w-full min-h-2.5 max-h-60 p-2 grid grid-cols-7 gap-1.5 overflow-y-scroll'>
        {calculateDays().map((item,idx) => (
          <div 
            key={item} 
            className={`w-7 h-10 select-none ${getDayColorAlternative(idx)}  rounded-full  flex items-center justify-center font-blod`}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Optional: Display current progress */}
      <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
        {(() => {
          const startTime = Number(localStorage.getItem("StartedAT"));
          console.log("Start Time :" + startTime);
          
          const today = new Date();
          const daysSinceStart = Math.floor((today.getTime() - startTime) / (60 * 60 * 24 *1000));

          console.log("Days Since Start :"+ daysSinceStart );
          
          
          const totalDays = calculateDays().length;
          
          return `اليوم ${Math.min(daysSinceStart + 1, totalDays)} من  ${totalDays}`;
        })()}
      </div>
    </div>
  )
}

export default Table