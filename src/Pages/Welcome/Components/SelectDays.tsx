    import React,{useState} from 'react'

    const SelectDays: React.FC = () => {
        const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        let [SelectedDays, setSelectedDays] = useState<string[]>(localStorage.getItem('SelectedDays') ? JSON.parse(localStorage.getItem('SelectedDays') || '[]') : []);
        const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) =>{
            const day = e.currentTarget.textContent;
            if(SelectedDays.length < 7 && !SelectedDays.includes(day || '')){
                setSelectedDays([...SelectedDays, day || '']);
                localStorage.setItem('SelectedDays', JSON.stringify([...SelectedDays, day || '']));
            }
         
        }
           const reset =  () => {
                localStorage.setItem('SelectedDays', JSON.stringify([]));
                setSelectedDays([]);
            };
    return (
        <div className=' h-11/12 show-first flex items-center justify-items-normal flex-col  ' >
           <div>
           </div>
             <h2 className='text-3xl relative top-5 text-indigo-400 font-extrabold mb-4 text-center '> إيه ايام  الجم<span className='text-indigo-500 '>؟</span></h2>
            
            <div className='relative  min-w-0 max-w-11/12 min-h-20  rounded-4xl  flex items-center  flex-wrap text-indigo-600 font-semibold text-lg p-2 gap-3.5  '>
     {SelectedDays.length === 0 ? <p className='text-indigo-500 text-xl'> ...</p> : SelectedDays.map((day,i) => (
        <div key={i} className='bg-white rounded-xl shadow-lg'>{day}</div>
     ))}  
            </div>
            <div className='relative w-11/12  text-center    rounded-2xl'>
            <div className='text-indigo-400 text-3xl p-5'>اختر الأيام التي تناسبك لممارسة الرياضة</div>
             <div className='grid grid-cols-2 gap-2'>
  {days.map((day,i) => (
    <button key={i} className={`p-2 transition-all delay-50 text-2xl  ${SelectedDays.includes(day) ? 'bg-indigo-500 text-white border' : 'border border-indigo-500 text-indigo-600'} rounded-4xl`} onClick={handleSelect}>{day}</button>
  ))}   
</div>
  <button className='relative top-2 p-1 text-xl bg-gray-100  text-indigo-600 rounded-xl' onClick={reset}>إعادة تعيين</button>

            </div>
        </div>
    )
    }



    export default SelectDays;
