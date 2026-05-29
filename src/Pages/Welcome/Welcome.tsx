import React,{ useState } from "react";
import Firstturn from "./Components/Firstturn";
import ChooseHight from "./Components/ChooseHight";
import ChooseAge from "./Components/ChooseAge";
import CurrentWeight from "./Components/CurrentWeight";
import TargetWeight from "./Components/TargetWeight";
import SatisfactionRate from "./Components/SatisfactionRate";
import SelectDays from "./Components/SelectDays";
import SelectGender from "./Components/SelectGender";
import FinalSection from "./Components/FinalSection";
import ChPreiod from "./Components/ChPreiod";
import S_Goals from "./Components/SetGoals";
import { FaArrowLeft } from "react-icons/fa6";
  
const Welcome : React.FC= () => {
  const [turn, setTurn] = useState(1);
  const [IsDisabled, setIsDisabled] = useState(false);
 
  let handleClick = () => {
    if (turn === 10) {
      setIsDisabled(true);
      window.location.href = "/me/home";
      return;
    }
    
    setIsDisabled(true);
    setTurn(turn + 1)
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  onload = () => {
    localStorage.clear();
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col p-2 m-0 items-center bg-linear-to-b bg-sky-50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20">
      <div className="absolute top-10 z-0 w-full h-[400px] opacity-35 blur-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300" />

      {(() => {
        switch (turn) {
          case 1:
            return <Firstturn />;
          case 2:
            return <CurrentWeight />;
          case 3:
            return <TargetWeight />;
          case 4:
            return <ChooseHight />;
          case 5:
            return <ChooseAge />;
            case 6:
            return <ChPreiod />;
            case 7:
            return <SelectDays />;
            case 8:
            return <S_Goals />;
                 case 9:
            return <SelectGender />;
               case 10:
            return <SatisfactionRate />;
             case 11:
            return <FinalSection />;
        }
      })()}
      <div className="absolute bottom-24 duration-1000 flex items-center justify-around flex-row gap-1 p-1 text-center min-w-5 rounded-2xl dark:bg-black/20 dark:border-2   h-5 bg-gray-50 ">
        <div className={turn === 1 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm  "}></div>
        <div className={turn === 2 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 3 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 4 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 5 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 6 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 7 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 8 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 9 ? "w-10 h-3 bg-sky-500  dark:bg-slate-800  rounded-3xl drop-shadow-xl  delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 10 ? "w-10 h-3 bg-sky-500 dark:bg-slate-800   rounded-3xl drop-shadow-xl delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
        <div className={turn === 11 ? "w-10 h-3 bg-sky-500 dark:bg-slate-800   rounded-3xl drop-shadow-xl delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 bg-gray-500/20 rounded-sm"}></div>
      </div>
      <button 
      disabled={IsDisabled} 
      className={`absolute w-11/12 h-16 bottom-4    ${IsDisabled ? "text-gray-400 border-gray-200" : "bg-blue-400 dark:bg-black/20 dark:border-gray-600/10 text-white  border-sky-300 shadow-2xs "} border-2 rounded-4xl font-extrabold `} 
      onClick={handleClick}
      >
        <div className="w-full h-full flex gap-5 items-center justify-center">
          
        التالي
      <FaArrowLeft />
        </div>
       </button>
    </div>
  );
};  

export default Welcome;
