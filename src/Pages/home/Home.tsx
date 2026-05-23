import { GoHomeFill } from "react-icons/go";
import ExerciseDay from "./Components/ExcrsiceDay";
import Table from "./Components/Table"
        import { FaBowlFood, FaCookieBite, FaFire } from "react-icons/fa6";
import { BiInfoCircle } from "react-icons/bi";

const Home = () => {
   if (!localStorage.getItem("StartedAT")) {
    const currentDate = new Date();

    localStorage.setItem("StartedAT", currentDate.getTime().toString());
    
  }
  if (localStorage.length < 8) {
  localStorage.setItem("isFirstTime", "true");
  }else{localStorage.setItem('isFirstTime','false')}
  const IsThere_A_Diet : any =localStorage.getItem('Diet');

  let Advice ="قليلُ مستمر خيرُ من كثيرٍ منقطع"
  return (
    <div className="relative min-h-screen w-screen overflow-hidden p-5 flex flex-col gap-5 show-first">
<div className='absolute top-10 z-0  w-full h-[400px] opacity-35 blur-3xl bg-linear-210 from-sky-400 via-indigo-400 to-teal-300'></div>
      
      <div className="relative w-full min-h-14 flex flex-col gap-3">
        <div className="text-2xl  "><GoHomeFill /></div>

        <div className="w-full rounded-3xl mb-2 p-5 shadow-sm bg-white flex flex-row gap-2">
      <FaCookieBite className="text-2xl text-sky-500 " />
          <p className="font-light text-md show-first">{Advice}</p>
        </div>
          <div className="rounded-full  shadow-2xl bg-linear-to-r from-orange-400 to-yellow-300 text-white text-shadow-lg text-xl font-black tracking-tight flex flex-row justify-between items-center p-5 ">
            <p className="flex flex-row gap-1.5 ">ألايام النشطة <BiInfoCircle /></p>
            <p className="flex flex-row">
                {/* Set Here */}
                 <FaFire />

            </p>
          </div>

       

      {!IsThere_A_Diet &&  <a href="/me/food">
         <div className="w-full rounded-2xl mb-2 p-5 shadow-sm bg-white flex flex-row gap-2 outline-swealing">
      <FaBowlFood className="text-2xl text-sky-500 " />
          <p className="font-light text-md show-first">دعنا نصنع أفضل نظام غذائي!</p>
        </div>
       </a>}
    </div>

<ExerciseDay />
<Table />
<div className='h-14'></div>

    </div>
  )
}

export default Home
