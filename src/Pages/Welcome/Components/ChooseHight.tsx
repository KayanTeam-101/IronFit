import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const ChooseHight : React.FC = () => {
    let numbers: number[] = period(90, 190);
     const handleChange = (value: number) => {
    console.log("Selected:", value);
        localStorage.setItem('height', value.toString()) ;
  }; 

  return (
       <div className='  show-first h-3/4 flex items-center justify-between flex-col  ' >
         <h2 className='text-3xl translate-y-10 text-gray-800 dark:text-white font-extrabold mb-4 text-center '> طولك كام بل سم<span className='text-amber-500'>؟</span>
        <div className="relative block h-1 w-12 bg-amber-400 mt-2 mx-auto rounded-full fullWidth" />
         </h2>
      <CounterY arr={numbers} size={window.innerWidth <= 390 ? "md" : "lg"} onChange={handleChange} />
      <div></div>
    </div>
  )
}



export default ChooseHight
