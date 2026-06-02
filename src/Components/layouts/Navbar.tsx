import { NavLink } from 'react-router-dom'
import { GoHomeFill, GoRepoTemplate } from 'react-icons/go'
import { FaPersonRunning } from "react-icons/fa6";
import { LuLayoutTemplate, LuSettings2 } from 'react-icons/lu';
import { FaAppleAlt } from 'react-icons/fa';

const Navbar = () => {
  const vebrate = () =>{
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100 milliseconds
    }
  }
  return (
    <div className="navbar overflow-hidden fixed bottom-0 left-0 right-0 grid grid-cols-5 items-center h-16 backdrop-blur-[20px]  dark:bg-black/30 border-t  border-gray-200 text-xl text-sky-950 dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/20">
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white "  to="me/home">
          <GoHomeFill />
          <p className='text-[12px] mt-2'>الرئسية</p>
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="me/food">
          <FaAppleAlt />
          <p className='text-[12px] mt-2'>نظامي </p>
          
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/me/exercises">
          <FaPersonRunning />
          <p className='text-[12px] mt-2'>التمارين</p>

        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Templates">
          <LuLayoutTemplate />
          <p className='text-[12px] mt-2'>قوالب</p>

        </NavLink>
         <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Settings">
          <LuSettings2 />
          <p className='text-[12px] mt-2'>الأعدادات</p>
        </NavLink>
        
    </div>
  )
}

export default Navbar
