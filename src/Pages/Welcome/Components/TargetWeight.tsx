import React, { useEffect, useState } from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';
import { useCountUp } from '../../../Hooks/Increasing';

const TargetWhight: React.FC = () => {
  const numbers: number[] = period(30, 110);
  const [color,SetColor] =useState("");
  const [Dif,SetDif] = useState(0);
  const [directionLabel,SetdirectionLabel] = useState("");
  const CurrentWeight =
    Number(localStorage.getItem('currentWeight')) || 30;

 const handleChange = (value: number) => {
  const current = Number(localStorage.getItem('currentWeight')) || 0;
  const target = value;
  localStorage.setItem('targetWeight', target.toString());

  const dif = target - current;      // signed difference
  const absDif = Math.abs(dif);      // intensity of change

  let intensityColor = '';
  let directionLabel = '';

  // 1. Direction (gain vs loss)
  if (dif > 0) {
    directionLabel = ' (زيادة في الوزن) '
  }
  if (dif < 0) {
    directionLabel = ' (نقص في الوزن) '
  }
  if (Math.abs(Dif) < 5) {
        directionLabel += ' ودي بداية ممتازة و أعتقد انه من السهل الاستمرار عليها لمدة شهر أو شهرين';

  }  if (Math.abs(Dif) >= 5) {
    directionLabel += 'دا تحدي كويس و يحتاج شوية صبر و مثابرة !';
  } 

  // 2. Intensity based on absolute difference
  if (absDif <= 5) {
    intensityColor = 'text-green-500';        // easy goal
  } else if (absDif <= 10) {
    intensityColor = 'text-yellow-500';       // moderate
  } else if (absDif <= 20) {
    intensityColor = 'text-orange-500';       // ambitious
  } else {
    intensityColor = 'text-red-500';          // very ambitious / extreme
  }

  // If you want separate colors for weight loss:
  SetdirectionLabel(directionLabel)
  SetColor(intensityColor);
  SetDif(absDif);   // store absolute difference if you only want intensity
  // or keep signed if you need the direction elsewhere
};

  
  return (
       <div className='  show-first h-full flex items-center justify-between flex-col  ' >
      <h2 className='text-4xl translate-y-10 text-amber-400 dark:text-white font-extrabold mb-4 text-center'>
        ايه الوزن ال نفسك توصلو<span className='text-amber-500'>؟</span>
      </h2>

      <CounterY
        arr={numbers}
        delValue={CurrentWeight}   // ✅ now number
        size={window.innerWidth <= 390 ? "md" : "lg"}
        onChange={handleChange}
      />
      <div className='w-full h-fit p-4 dark:text-white rounded-2xl  bg-gray-100 shadow dark:bg-[#666]/20 font-black'>
         فرق الوزن بين الحالي و المُستهدف  
        <span className={`${color} p-1 transition-all`}>
           
          {Dif} كجم
        </span>
        <span>{directionLabel}</span>
      </div>
    </div>
    
  )
}

export default TargetWhight;
