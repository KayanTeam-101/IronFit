

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color: string;
  size?: number;
  strokeWidth?: number;
  textSize?: string;
  subText?: string;
  icon?: React.ReactNode;
}

 
 const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  label,
  unit = "",
  color,
  size = 120,
  strokeWidth = 8,
  textSize = "text-2xl",
  subText,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Ring container */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{transition:"1s "}}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <span className="text-lg mb-0.5">{icon}</span>}
          <span className={`font-extrabold ${textSize} text-gray-800 dark:text-white`}>
            {Math.round(value)}
          </span>
          {unit && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
          )}
          {subText && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {subText}
            </span>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
};
export default CircularProgress;