import React from 'react'
import { period } from '../../../utilities/utilities';
import CounterY from '../../../utilities/CounterY';

const SatisfactionRate : React.FC = () => {
    let numbers: number[] = period(0, 10);

     const handleChange = (value: number) => {
    console.log("Selected:", value);
        localStorage.setItem('SatisfactionRate', value.toString()) ;

  }; 

  return (
       <div className='  show-first flex items-center justify-between flex-col  ' >
     <h2 className='text-3xl translate-y-0 text-sky-400 font-extrabold  text-center '> ما مدي رضاك عن شكل جسمك <span className='text-sky-500'>؟</span></h2>
        <div className=' text-sm text-amber-700   text-center'>الرقم مجرد رأي لحظي — أنت أكبر من رقم. ابدأ بخطوة بسيطة النهاردة، ومهم تفتكر إن التغيّر الحقيقي بيبدأ بالاستمرار مش بالسرعة</div>
             <CounterY arr={numbers} size={window.innerWidth <= 390 ? "md" : "lg"} onChange={handleChange} />
      <div></div>
    </div>
  )
}



export default SatisfactionRate
