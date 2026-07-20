import React from 'react';
import { FaTimes, FaCrown } from 'react-icons/fa';
import { RiBarChartFill, RiCopperCoinFill } from 'react-icons/ri';


export const levels = [
    {
      text: '0-150',
      name: 'برونزي',
      gradient: 'from-amber-700 to-amber-600',
      border: 'border-amber-900',
      shadow: 'shadow-amber-900',
      iconColor: 'text-amber-950',
    },
    {
      text: '150-450',
      name: 'فضي',
      gradient: 'from-gray-400 via-gray-300 to-gray-600',
      border: 'border-gray-400',
      shadow: 'shadow-gray-400',
      iconColor: 'text-gray-700',
    },
    {
      text: '450-850',
      name: 'ذهبي',
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      border: 'border-yellow-500',
      shadow: 'shadow-yellow-500',
      iconColor: 'text-yellow-800',
    },
    {
      text: '850-950',
      name: 'ملحمي',
      gradient: 'from-purple-400 to-blue-400 ',
      border: 'border-none',
      shadow: 'shadow-cyan-500',
      iconColor: 'text-pink-100',
    },
    {
      text: '950-1000',
      name: 'ماسي',
      gradient: 'from-cyan-300  to-blue-500',
      border: 'border-cyan-100',
      shadow: 'shadow-cyan-500',
      iconColor: 'text-cyan-50',
    },
    {
      text: '1000-1500',
      name: 'أسطوري',
      gradient: 'from-fuchsia-600 via-purple-600 to-indigo-600',
      border: 'border-fuchsia-400',
      shadow: 'shadow-purple-500',
      iconColor: 'text-fuchsia-200',
      crown: true,   
    },
    {
      text: '1500-2500',
      name: 'بلاتيني',
      gradient: 'from-indigo-500 via-blue-600 to-teal-500',
      border: 'border-indigo-400',
      shadow: 'shadow-blue-500',
      iconColor: 'text-blue-200',
      crown: true,   

    },
    {
      text: '2500-10000',
      name: 'خارق',
      gradient: 'from-rose-600 via-red-600 to-orange-500',
      border: 'border-red-600',
      shadow: 'shadow-red-500',
      iconColor: 'text-rose-200',
      crown: true,   // top tier gets crown
    },
];
const Rank: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const currentXP = Number(localStorage.getItem('Xp') || 0);

  // Tiers styled with modern gradients and shadows
   
  // Find current level index
  const getCurrentLevelIndex = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      const range = levels[i].text.replace('+', '').split('-');
      const min = Number(range[0]);
      const max = range[1] ? Number(range[1]) : Infinity;
      if (currentXP >= min && currentXP <= max) return i;
    }
    return -1;
  };

  const currentIndex = getCurrentLevelIndex();

  return (
    <div
      onDoubleClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-2xl p-6 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 transition"
        >
          <FaTimes className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header – user info pill */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-full px-5 py-2 shadow-lg">
           
            <div className="flex items-center gap-1 text-lg font-bold text-amber-600 dark:text-white">
              <RiCopperCoinFill className="text-2xl text-blue-600" />
              {currentXP.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Levels section */}
        <div className='relative h-full w-full'>
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400">
            <RiBarChartFill className="text-lg" />
            <span className="font-semibold">المستويات</span>
          </div>

          <div className="space-y-3 h-[380px] w-full flex flex-col items-center  overflow-y-scroll overflow-x-auto ">
            {levels.map((level, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={level.text}
                  className={`relative flex scale-95 flex-row items-center justify-between w-full gap-3 rounded-2xl border-2 ${level.border} ${level.shadow}
                    bg-gradient-to-r ${level.gradient} p-4 transition-all duration-300 
                    ${isCurrent ? 'ring-2 ring-offset-2 ring-white/60 dark:ring-white/30 ' : ''}
                  `}
                >
                  {/* Level icon */}

                  {/* Level name & range */}
                  <div className="flex-1 text-right">
                    <p className="text-white font-bold text-sm drop-shadow-md ">{level.name}</p>
                    <p className="text-white/70 text-xs">{level.text} XP</p>
                  </div>

                  {/* Current badge */}
                  {isCurrent && (
                    <span className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      الحالي
                    </span>
                  )}
                  <div className={`p-2 rounded-full bg-white/20 ${level.iconColor}`}>
                    {level.crown ? (
                      <FaCrown className="text-xl" />
                    ) : (
                      <RiCopperCoinFill className="text-xl" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rank;