import { useState,useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { GoHomeFill } from 'react-icons/go'
import { FaFaceMehBlank, FaPersonRunning } from "react-icons/fa6";
import { FaAppleAlt } from 'react-icons/fa';
import { RiMessage3Fill } from 'react-icons/ri';
import { TiPlus } from 'react-icons/ti';
import InputsContainer from '../../Pages/SocialPage/Components/InputsContainer';

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
     className="navbar overflow-hidden fixed bottom-2.5  grid grid-cols-5 items-center w-11/12 h-16 backdrop-blur-[5px]   dark:bg-black/30 border-t  border-gray-200 rounded-4xl text-xl text-sky-950 dark:from-slate-800/40 dark:to-black/40 dark:border-2 dark:border-gray-600/15"
    >
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white "  to="me/home">
          <GoHomeFill />
          <p className='text-[12px] mt-2'>الرئسية</p>
        </NavLink>
        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="me/food">
          <FaAppleAlt />
          <p className='text-[12px] mt-2'>نظامي </p>
          
        </NavLink>


    {
      !isChatPage ? (
            <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Chat">
          <RiMessage3Fill />
          <p className='text-[12px] mt-2'>تواصل</p>

        </NavLink>

      ) :(
           <div className="flex flex-col w-fit items-center gap-1 text-center dark:text-white  " onClick={() => setIsOpened(true)}>
            <div className='bg-blue-600/15 text-blue-600 px-4 p-1 rounded-full  show-first'>
          <TiPlus />

            </div>
<div className='w-3 h-0.5 rounded-2xl bg-blue-600 show-third'></div>
        </div>
      )
    }

        <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/me/exercises">
          <FaPersonRunning />
          <p className='text-[12px] mt-2'>التمارين</p>

        </NavLink>
     
         <NavLink onClick={() => vebrate()} className="flex flex-col text-center dark:text-white " to="/Settings">
          <FaFaceMehBlank />
          <p className='text-[12px] mt-2'>أنا</p>
        </NavLink>
        
    </div>
    {IsOpened && <InputsContainer />}

</>
  )
}

export default Navbar
