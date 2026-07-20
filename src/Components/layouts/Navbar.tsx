import { useState,useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { GoHomeFill, GoPlus } from 'react-icons/go'
import { FaPersonRunning } from "react-icons/fa6";
import { FaAppleAlt } from 'react-icons/fa';
import { RiMessage3Fill } from 'react-icons/ri';
import InputsContainer from '../../Pages/SocialPage/Components/InputsContainer';
import { IoDiamond } from 'react-icons/io5';

const Navbar = () => {

  const [IsOpened, setIsOpened] = useState(false);


  const vebrate = () =>{
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100 milliseconds
    }
  }
  const location = useLocation();
  const isChatPage = location.pathname === '/Chat';

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };
  return (
<>

 
     <div
     className="navbar overflow-hidden fixed bottom-0 z-0  grid grid-cols-5 items-center w-full h-12 backdrop-blur-[3px]   dark:bg-black/60 border-t  border-gray-200 r text-xl text-gray-800 dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/15"
    >
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-gray-400 "  to="me/home">
          <GoHomeFill />
          <p className='text-[12px] mt-2'>الرئسية</p>
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-gray-400 " to="me/food">
          <FaAppleAlt />
          <p className='text-[12px] mt-2'>نظامي </p>
          
        </NavLink>


          {!isChatPage ?  <NavLink onClick={() => vebrate()} className="relative flex flex-col text-center dark:text-gray-400 " to="/Chat">
          <RiMessage3Fill />
          <p className='text-[12px] mt-2'>تواصل</p>
    <div className='absolute top-2 right-5 w-2.5 h-2.5 bg-red-500 rounded-2xl animate-ping'></div>
    <div className='absolute top-2 right-5 w-2.5 h-2.5 bg-red-500 rounded-2xl '></div>
        </NavLink> : 
        <div className='w-full flex justify-center items-center show-fast'>
             <div className="flex flex-col w-fit items-center gap-1 text-center dark:text-gray-400  " onClick={() => setIsOpened(true)}>
            <div className='bg-linear-to-br from-orange-600 to-rose-600 text-white p-2  rounded-xl '>
          <GoPlus />

            </div>
<div className='w-5 h-1 rounded-2xl bg-orange-600'></div>
        </div>
        </div>
        
   }
    


        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-gray-400 " to="/me/exercises">
          <FaPersonRunning />
          <p className='text-[12px] mt-2'>التمارين</p>

        </NavLink>
     
         <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-gray-400 " to="/Settings">
          <IoDiamond />
          <p className='text-[12px] mt-2'>أنا</p>
        </NavLink>
        
    </div>
   
    {IsOpened && window.location.pathname === "/Chat" && <InputsContainer />}

</>
  )
}

export default Navbar
