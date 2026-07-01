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

   {!isChatPage ? (
     <div
     className="navbar overflow-hidden fixed bottom-2.5  grid grid-cols-5 items-center w-11/12 h-16 backdrop-blur-[15px]   dark:bg-black/60 border-t  border-gray-200 rounded-4xl text-xl text-amber-950 dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/15"
    >
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white "  to="me/home">
          <GoHomeFill />
          <p className='text-[12px] mt-2'>الرئسية</p>
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="me/food">
          <FaAppleAlt />
          <p className='text-[12px] mt-2'>نظامي </p>
          
        </NavLink>


            <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Chat">
          <RiMessage3Fill />
          <p className='text-[12px] mt-2'>تواصل</p>

        </NavLink>


        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/me/exercises">
          <FaPersonRunning />
          <p className='text-[12px] mt-2'>التمارين</p>

        </NavLink>
     
         <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Settings">
          <IoDiamond />
          <p className='text-[12px] mt-2'>أنا</p>
        </NavLink>
        
    </div>
   ) : (
     <div
     className="navbar overflow-hidden z-20 fixed bottom-0 rounded-t-4xl grid grid-cols-5 items-center w-full h-12 backdrop-blur-[15px]   dark:bg-black/60 border-t  border-gray-200  text-lg text-amber-950 dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/15  showAnim2"
    >
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white "  to="me/home">
          <GoHomeFill />
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="me/food">
          <FaAppleAlt />
          
        </NavLink>


    
    
        <div className='w-full flex justify-center items-center'>
             <div className="flex flex-col w-fit items-center gap-1 text-center dark:text-white  " onClick={() => setIsOpened(true)}>
            <div className='bg-orange-600 text-white p-2  rounded-xl '>
          <GoPlus />

            </div>
<div className='w-3 h-0.5 rounded-2xl bg-orange-600'></div>
        </div>
        </div>
        
    
    

        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/me/exercises">
          <FaPersonRunning />

        </NavLink>
     
         <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Settings">
          <IoDiamond />
        </NavLink>
        
    </div>
   )}
    {IsOpened && window.location.pathname === "/Chat" && <InputsContainer />}

</>
  )
}

export default Navbar
