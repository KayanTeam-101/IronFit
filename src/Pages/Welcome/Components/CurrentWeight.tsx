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
    <div className=' h-11/12 show-first flex items-center justify-between flex-col  ' >
        <h2 className='text-3xl translate-y-10 text-indigo-400 font-extrabold mb-4 text-center '> ايه وزنك الحالي بالـ كجم <span className='text-indigo-500'>؟</span></h2>
    
      <CounterY arr={numbers} size='lg' onChange={handleChange} />
    </div>
  )
}



export default ChooseHight
