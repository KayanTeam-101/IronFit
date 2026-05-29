import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const ChooseHight : React.FC = () => {
    let numbers: number[] = period(10, 60);

     const handleChange = (value: number) => {
    console.log("Selected:", value);
    localStorage.setItem('age', value.toString()) ;
  }; 

  return (
     <div className='  show-first flex items-center justify-between flex-col  ' >
       <h2 className='text-3xl translate-y-10 text-sky-400 font-extrabold mb-4 text-center '>عندك كام سنة <span className='text-sky-500'>؟</span></h2>
      <CounterY arr={numbers} size={window.innerWidth <= 390 ? "md" : "lg"} onChange={handleChange} />
      <div></div>
    </div>
  )
}



export default ChooseHight
