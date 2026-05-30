import React, { useMemo } from "react";

interface CircularProgressProps {
  goal: number;       // target value (e.g. dailyCalories)
  current: number;    // actual consumed value
  size?: number;      // diameter in px (default 150)
  strokeWidth?: number;
  label?: string;     // optional label below the ring
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  goal,
  current,
  size = 150,
  strokeWidth = 14,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = useMemo(
    () => (goal > 0 ? Math.min((current / goal) * 100, 100) : 0),
    [goal, current]
  );
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
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
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />

        {/* Gradient – adapts automatically */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />   {/* sky-500 */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-gray-900 dark:text-white"
        style={{ width: size, height: size }}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tabular-nums">
            {Math.round(percent)}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            %
          </span>
        </div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
          {current.toFixed(0)} / {goal.toFixed(0)}
        </div>
        {label && (
          <span className="text-xs mt-1 text-gray-400 dark:text-gray-500">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;