import React from 'react'
import { NavLink } from 'react-router-dom'
import { GoHomeFill } from 'react-icons/go'
import { FaChartSimple } from "react-icons/fa6";
import { FaPersonRunning } from "react-icons/fa6";
import { FaBowlFood } from "react-icons/fa6";
import { LuSettings2 } from 'react-icons/lu';
import { FaAppleAlt } from 'react-icons/fa';

const Navbar = () => {
  const vebrate = () =>{
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100 milliseconds
    }
  }
  return (
    <div className="navbar overflow-hidden fixed bottom-0 left-0 right-0 grid grid-cols-5 items-center h-16 backdrop-blur-[20px] bg-white/30 border-t  border-gray-200 text-xl text-sky-950">
        <NavLink onClick={() => vebrate()} className="flex flex-col"  to="me/home">
          <GoHomeFill />
          <p className='text-[13px] mt-2'>الرئسية</p>
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col" to="me/food">
          <FaAppleAlt />
          <p className='text-[13px] mt-2'>نظامي الغذائي</p>
          
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col" to="/exercises">
          <FaPersonRunning />
          <p className='text-[13px] mt-2'>التمارين</p>

        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col" to="/myStats">
          <FaChartSimple />
          <p className='text-[13px] mt-2'>الاحصائيات</p>

        </NavLink>
         <NavLink onClick={() => vebrate()} className="flex flex-col" to="/myStats">
          <LuSettings2 />
          <p className='text-[13px] mt-2'>الأعدادات</p>
        </NavLink>
        
    </div>
  )
}

export default Navbar
