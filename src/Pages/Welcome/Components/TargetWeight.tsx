import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const ChooseHight: React.FC = () => {
  const numbers: number[] = period(30, 110);

  const CurrentWeight =
    Number(localStorage.getItem('currentWeight')) || 30;

  const handleChange = (value: number) => {
    console.log("Selected:", value);
    localStorage.setItem('targetWeight', value.toString());
  };

  return (
       <div className=' min-h-lvh show-first flex items-center justify-between flex-col  ' >
      <h2 className='text-4xl translate-y-10 text-sky-400 font-extrabold mb-4 text-center'>
        ايه الوزن ال نفسك توصلو<span className='text-sky-500'>؟</span>
      </h2>

      <CounterY
        arr={numbers}
        delValue={CurrentWeight}   // ✅ now number
        size={window.innerWidth <= 390 ? "md" : "lg"}
        onChange={handleChange}
      />
      <div></div>
    </div>
    
  )
}

export default ChooseHight;
