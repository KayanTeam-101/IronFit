import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const CurrentWeight : React.FC = () => {
    let numbers: number[] = period(30, 140);
  let [Value, setValue] :any = React.useState('')
     const handleChange = (value: number) => {
    console.log("Selected:", value);
        localStorage.setItem('currentWeight', value.toString()) ;
        setValue(value);
      }; 

  return (
    <div className='  show-first h-3/4 flex items-center justify-around flex-col  ' >
      <div className='w-fit relative'>
        <h2 className='text-3xl  text-gray-800 dark:text-white font-extrabold mb-4 text-center '> ايه وزنك الحالي بالـ كجم <span className='text-amber-500'>؟</span></h2>
        <div className="relative block h-1 w-12 bg-amber-400 mt-2 mx-auto rounded-full fullWidth" />
        
      </div>
       <CounterY arr={numbers} size={window.innerWidth <= 390 ? "md" : "lg"} onChange={handleChange} />
    </div>
  )
}



export default CurrentWeight
