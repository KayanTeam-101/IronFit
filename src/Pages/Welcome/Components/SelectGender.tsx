import React, { useState } from 'react';
import { BiFemale, BiMale } from 'react-icons/bi';

const SelectGender: React.FC = () => {
  const genders = ['ذكر', 'أنثى'];
  const [selectedGender, setSelectedGender] = useState<string>(
    localStorage.getItem('SelectedGender') || ''
  );

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
    localStorage.setItem('SelectedGender', gender);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 ">
 
      {/* Title with animated underline */}
      <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12 tracking-tight">
        ذكر أم أنثى<span className="text-amber-500">؟</span>
        <div className="block h-1 w-12 bg-amber-400 mt-2 mx-auto rounded-full" />
      </h2>

      {/* Gender buttons */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md px-4">
        {genders.map((g) => {
          const isSelected = selectedGender === g;
          const isMale = g === 'ذكر';

          return (
            <button
              key={g}
              onClick={() => handleSelect(g)}
              className={`
                relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
                active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300/50
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl shadow-amber-400/30 scale-105'
                    : '  text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700'
                }
              `}
            >
              {/* Icon container */}
              <div
                className={`
                  p-4 rounded-full transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-amber-100 dark:bg-amber-900/20'
                  }
                `}
              >
                {isMale ? (
                  <BiMale className="text-6xl" />
                ) : (
                  <BiFemale className="text-6xl" />
                )}
              </div>
              <span className="text-xl font-bold">{g}</span>

              {/* Selection checkmark */}
         
            </button>
          );
        })}
      </div>

      
    </div>
  );
};

export default SelectGender;