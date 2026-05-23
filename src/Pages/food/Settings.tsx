import React from "react";
import { BsClockFill } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { RiResetRightFill } from "react-icons/ri";

const Settings = () => {
    const SuringToResetADiet = () =>{
        const Sure = confirm("YOU WILL DELETE YOUR DIET IF YOU CLICK AT 'OK' AND CREATE NEW ONE");
        if (Sure) {
            localStorage.removeItem("Diet");
            window.location.reload();
        }else{
            return false;
        }
    }
  return (
    <div className="fixed show-first top-0 left-0 z-50 w-screen h-lvh flex justify-center items-center bg-black/5 backdrop-blur-sm ">
      <div className="w-10/12 min-h-62 p-5 bg-white rounded-2xl">
      
        <div className="w-full h-full flex flex-col gap-3 justify-around">
          <div className="flex justify-between w-full p-3.5  rounded-lg  text-md cursor-pointer activeAnim">
            الاعدادات <div onClick={() => window.location.reload()} className="p-1.5 rounded-2xl  bg-gray-50"><FaXmark className="text-blue-600" /></div>
          </div>
          <div className="flex justify-between w-full p-3.5 bg-gray-100 rounded-lg  text-md active:bg-sky-100 active:text-sky-600 cursor-pointer activeAnim">
            التاريخ <BsClockFill />
          </div>

          <div onClick={SuringToResetADiet} className="flex justify-between w-full p-3.5 bg-gray-100 rounded-lg  text-md active:bg-sky-100 active:text-sky-600 cursor-pointer activeAnim">
            
            إعادة تعيين النظام الغذائي <RiResetRightFill />
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
