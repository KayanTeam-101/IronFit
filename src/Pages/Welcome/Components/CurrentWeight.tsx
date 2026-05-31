import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const ChooseHight : React.FC = () => {
    let numbers: number[] = period(30, 140);
  let [Value, setValue] :any = React.useState('')
     const handleChange = (value: number) => {
    console.log("Selected:", value);
        localStorage.setItem('currentWeight', value.toString()) ;
        setValue(value);
      }; 

  return (
    <div className='  show-first h-3/4 flex items-center justify-around flex-col  ' >
        <h2 className='text-3xl translate-y-10 text-sky-400 font-extrabold mb-4 text-center '> ايه وزنك الحالي بالـ كجم <span className='text-sky-500'>؟</span></h2>
       <CounterY arr={numbers} size={window.innerWidth <= 390 ? "md" : "lg"} onChange={handleChange} />
    </div>
  )
}



export default ChooseHight
