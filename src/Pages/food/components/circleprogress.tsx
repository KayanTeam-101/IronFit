import React from "react";
import { FaFire } from "react-icons/fa";

interface CircularProgressProps {
  goal: number;     // e.g. from localStorage 'dailyCalories'
  current: number;  // e.g. eatenCalories
  size?: number;    // diameter in px (default 120)
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  goal,
  current,
  size = 120,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer glow ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 drop-shadow-xl"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(245,245,245,1)"
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
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" /> {/* orange-500 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div
        className="absolute bottom-0 flex flex-col items-center justify-center text-black drop-shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">{Math.round(percent)}</span>
          <span className="text-sm opacity-80">%</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs font-medium text-black">
          <FaFire className="text-orange-400" />
          <span>
            {goal} / {current}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;