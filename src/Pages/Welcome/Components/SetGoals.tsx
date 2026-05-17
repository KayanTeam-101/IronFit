    import React,{useState} from 'react'

    const S_Goals: React.FC = () => {
        const Goals = ["تعديل الوزن","بناء عضلات","زيادة طول","زيادة عرض الاكتاف"];
        let [SelectedGoal, setSelectedGoal] = useState<string[]>(localStorage.getItem('SelectedGoal') ? JSON.parse(localStorage.getItem('SelectedGoal') || '[]') : []);
        const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) =>{
            const day = e.currentTarget.textContent;
            if(!SelectedGoal.includes(day || '')){
                setSelectedGoal([...SelectedGoal, day || '']);
                localStorage.setItem('SelectedGoal', JSON.stringify([...SelectedGoal, day || '']));
            }
         
        }
           const reset =  () => {
                localStorage.setItem('SelectedGoal', JSON.stringify([]));
                setSelectedGoal([]);
            };
    return (
        <div className=' h-11/12 show-first flex items-center justify-items-normal flex-col  ' >
           <div>
             <h2 className='text-4xl relative top-5 text-indigo-400 font-extrabold mb-4 text-center '> إيه اهدافك <span className='text-indigo-500'>؟</span></h2>
           </div>
            <div className='relative top-5 min-w-0 max-w-11/12 min-h-20  rounded-4xl  flex items-center  flex-wrap text-indigo-600 font-semibold text-lg p-2 gap-3.5  '>
     {SelectedGoal.length === 0 ? <p className='text-indigo-500 text-xl'> ...</p> : SelectedGoal.map((day,i) => (
        <div key={i} className='bg-white  rounded-xl shadow-lg'>{day}</div>
     ))}  
            </div>
            <div className='relative w-11/12 top-10 text-center  p-3 rounded-2xl'>
             <div className='grid grid-cols-2 gap-2'>
  {Goals.map((Goal,i) => (
    <button key={i} className={`p-2 text-2xl transition-all delay-200  ${SelectedGoal.includes(Goal) ? 'bg-indigo-500 text-white border' : 'border border-indigo-500 text-indigo-600'} rounded-4xl`} onClick={handleSelect}>{Goal}</button>
  ))}   
</div>
  <button className='relative top-2 p-1 text-xl bg-gray-100 border-indigo-500 text-indigo-600 rounded-xl' onClick={reset}>إعادة تعيين</button>

            </div>
        </div>
    )
    }



    export default S_Goals;
