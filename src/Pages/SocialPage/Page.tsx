import { useState, useEffect, useRef,lazy } from "react";
import { getAvatarColorClasses } from "./Components/Post";
import { RiCopperCoinFill } from "react-icons/ri";
import { FaFire } from "react-icons/fa6";
const PostsContainer = lazy(() => import('./Components/PostsContainer'))
const Status = lazy(() => import('./Components/Story'))
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
        className={`fixed top-0 left-0 w-full h-16 p-4 z-5 flex justify-between items-center  transition-transform duration-300 ${
          headerVisible ? "translate-y-0 " : "-translate-y-full"
        } ${window.scrollY > 50 ?"bg-white/50 backdrop-blur-xl dark:bg-gray-900/50 shadow-xl":'' } `}
      >
         <div className="relative flex flex-row h-full">
          {
            localStorage.getItem("PhotoUrl") ? (
           <div className='w-10 h-10 bg-gray-200 rounded-full border-gray-500 border-2 overflow-hidden'>
        <img src={localStorage.getItem("PhotoUrl") || undefined} className='w-full h-full' alt='userImage' />
    </div>
            ) : (
              <div
            className={`w-8 h-8 p-4 flex items-center justify-center rounded-xl outline-3 dark:outline-slate-400/30 ${colorClasses}`}
          >
            <span className="font-bold mt-1">{initial}</span>
          </div>
            )
          }
          

  <div className="flex flex-col justify-center items-start mr-2 mt-2">
            <div className="text-md text-gray-700 dark:text-white flex gap-1">
            
            <div>
                 {getUserName}
              <span className="text-orange-600">@</span>
            </div>
            </div>

          </div>
          
         </div>

         {/* Items Section */}
   {/*  <div className="flex flex-row gap-1.5">
          <div className="dark:text-white dark:bg-[#1111115e] text-gray-500  p-2 rounded-2xl text-xl flex flex-row items-center justify-center gap-2.5">
<span className="font-black">312</span>
<span><RiCopperCoinFill className="text-[18px] text-blue-600 dark:text-sky-500 mb-1" /></span>
        </div>

            <div className="dark:text-white dark:bg-[#1111115e] text-gray-500  p-2 rounded-2xl text-xl flex flex-row items-center justify-center gap-2.5">
<span className="font-black">312</span>
<span><FaFire className="text-[18px] text-rose-600 dark:text-rose-500 mb-1" /></span>
        </div>
    </div>*/}

     
      </div>
      <Status />
      <PostsContainer />
    </div>
  );
};

export default Page;