 import React, { useEffect, useState } from "react";

interface CircularProgressProps {
  goal: number;     // e.g. from localStorage 'dailyCalories'
  current: number;  // e.g. eatenCalories
  size?: number;    // diameter in px (default 120)
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  goal,
  current,
  size = 150,
  strokeWidth = 15,
}) => {
const [GetSuccessfullDays, SetGetSuccessfullDays] = useState<string[]>(
  JSON.parse(localStorage.getItem('GetSuccessfullDays') || '[]')
);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const offset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const checkifSuccessfull = () => {
            if (goal <= current) {
          const today = new Date();
          const currentDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
          if (GetSuccessfullDays.includes(currentDate)) {
            return false
          }else{
            const UpdatedData =[...GetSuccessfullDays,currentDate]
            localStorage.setItem('GetSuccessfullDays',JSON.stringify(UpdatedData))
            alert('Congratulations! You have achieved your daily calorie goa!')
          }
        }
    }
    checkifSuccessfull();

  },[])
  return (
    <div className="relative w-fit h-fit   flex flex-col items-center justify-center ">
      {/* Outer glow ring */}
      <svg
        width={size }
        height={size  }
        
        className="transform -rotate-90 bg-transparent overflow-visible "
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(245,245,245,.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.8s ease-in-out" }}
        />
         <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 5}
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth }
          strokeLinecap="round"
          strokeDasharray={circumference }
          strokeDashoffset={offset}
          className="blur-sm"
          style={{ transition: "stroke-dashoffset 1.8s ease-in-out"}}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1fb8f6" /> {/* teal-500 */}
            <stop offset="50%" stopColor="pink" /> {/* orange-600 */}
            <stop offset="60%" stopColor="#FFC0CB" /> {/* orange-600 */}
            <stop offset="75%" stopColor="skyblue" /> {/* orange-600 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* orange-600 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div
        className="absolute dark:text-white bottom-0 flex flex-col items-center justify-center text-black drop-shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="relative flex items-baseline  gap-1">
          <span className="text-3xl font-black">{Math.round(percent)}</span>
          <div className="text-sm  flex-row flex ">%

          </div>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs font-medium text-black">
          <span  className="dark:text-white text-slate-800">
            {goal.toFixed(0)} / {current.toFixed(0)} 
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;