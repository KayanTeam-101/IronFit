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
    <div className='h-11/12 flex flex-col items-center'>
        <h2 className='text-3xl translate-y-10 text-amber-400 font-extrabold mb-4 text-center '> ذكر أم انثي<span className='text-amber-500'>؟</span></h2>

      <div className='relative top-15 grid grid-cols-2 gap-2'>
        {genders.map((g, i) => {
          const isSelected = selectedGender === g;
    
          return (
            <button
              key={i}
              onClick={() => handleSelect(g)}
              className={`p-3 px-5 text-2xl rounded-xl flex flex-row items-center gap-2
                ${isSelected
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border-4 border-amber-500 text-amber-600 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white'}`}
            >
              {g} {g === 'ذكر' ? <BiMale /> : <BiFemale />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectGender;
