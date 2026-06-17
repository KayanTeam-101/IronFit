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
    <div className="relative w-screen min-h-screen flex  flex-col pt-16">
      {/* Fixed header that slides up/down */}
      <div
        className={`fixed top-0 left-0 w-full h-16 p-4 flex justify-between items-center bg-white/50 backdrop-blur-xl dark:bg-gray-900/50 rounded-b-4xl z-50 transition-transform duration-300 ${
          headerVisible ? "translate-y-0 " : "-translate-y-full"
        }`}
      >
         <div className="relative flex flex-row h-full">
          <div
            className={`w-8 h-8 p-4 flex items-center justify-center rounded-xl outline-3 dark:outline-slate-400/30 ${colorClasses}`}
          >
            <span className="font-bold mt-1">{initial}</span>
          </div>
          

  <div className="flex flex-col justify-center items-start mr-2 mt-2">
            <div className="text-md text-gray-700 dark:text-white flex gap-1">
            <span>
           اهلاً 

            </span>
            <div>
                 {getUserName}
              <span className="text-orange-600">@</span>
            </div>
            </div>

          </div>
          
         </div>
        <div className="header text-orange-500 text-xl flex flex-row items-center justify-center gap-2.5">
          <RiMessage3Fill className="mb-2" />
        </div>

     
      </div>
      <PostsContainer />
    </div>
  );
};

export default Page;