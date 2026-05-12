import { GoHomeFill } from "react-icons/go";
import ExerciseDay from "./Components/ExcrsiceDay";
import Table from "./Components/Table"
        import { FaBowlFood, FaCookieBite } from "react-icons/fa6";

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
    <div className="relative min-h-screen w-screen overflow-hidden p-5 flex flex-col gap-5">

      <div className="relative w-full min-h-14 flex flex-col gap-3">
        <div className="text-2xl  "><GoHomeFill /></div>
        <div className="w-full rounded-2xl mb-2 p-5 shadow-sm bg-white flex flex-row gap-2">
      <FaCookieBite className="text-2xl text-indigo-500 " />
          <p className="font-light text-md show-first">{Advice}</p>
        </div>
      {!IsThere_A_Diet &&  <a href="/me/food">
         <div className="w-full rounded-2xl mb-2 p-5 shadow-sm bg-white flex flex-row gap-2">
      <FaBowlFood className="text-2xl text-indigo-500 " />
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
