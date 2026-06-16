import React, { useState, useEffect, useRef } from "react";
import InputsContainer from "./Components/InputsContainer";
import { getAvatarColorClasses } from "./Components/Post";
import PostsContainer from "./Components/PostsContainer";
import { RiMessage3Fill } from "react-icons/ri";
import { FaFire } from "react-icons/fa6";

const Page = () => {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const getUserName = (localStorage.getItem("UserName") || "");
  const initial = getUserName.charAt(0).toUpperCase();
  const colorClasses = getAvatarColorClasses(getUserName);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show header if at the very top
      if (currentScrollY < 10) {
        setHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scrolling down → hide, scrolling up → show
      if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-screen min-h-screen flex gap-1 flex-col pt-16">
      {/* Fixed header that slides up/down */}
      <div
        className={`fixed top-0 left-0 w-full h-16 p-4 flex justify-between items-center bg-white/50 backdrop-blur-xl dark:bg-gray-900/50  z-50 transition-transform duration-300 ${
          headerVisible ? "translate-y-0 shadow-sm" : "-translate-y-full"
        }`}
      >
         <div className="relative flex flex-row h-full">
          <div
            className={`w-10 h-10 p-4 flex items-center justify-center rounded-xl ${colorClasses}`}
          >
            <span className="font-bold mt-1">{initial}</span>
          </div>
          

  <div className="flex flex-col justify-center items-start m-2">
            <p className="text-md text-gray-700 dark:text-white">
              {getUserName}
              <span className="text-blue-600">@</span>
            </p>
<div className="flex flex-row items-center justify-center gap-1 -mt-1">
            <p className="text-xs text-gray-500 ">2h ago</p>
            <div className="w-1 h-1 bg-gray-500 rounded-xl"></div>
            <p className="text-[13px] text-gray-500 flex flex-row gap-1">4 <span className="text-amber-600 text-[10px] mt-1"><FaFire /></span></p>

</div>
          </div>
          
         </div>
        <div className="header text-blue-500 text-xl flex flex-row items-center justify-center gap-2.5">
          <RiMessage3Fill className="mb-2" />
        </div>

     
      </div>

      <PostsContainer />
    </div>
  );
};

export default Page;