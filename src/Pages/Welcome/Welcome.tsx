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
    }, 50);
  };

  onload = () => {
    localStorage.clear();
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col p-2 m-0 items-center bg-linear-to-b from-sky-50 via-white to-white">
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
      <div className="absolute bottom-24 duration-1000 flex items-center justify-around flex-row gap-1 p-1 text-center min-w-5 rounded-2xl  h-5 bg-gray-50 ">
        <div className={turn === 1 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm  "}></div>
        <div className={turn === 2 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 3 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 4 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 5 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 6 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 7 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 8 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 9 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80  animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 10 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80 animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
        <div className={turn === 11 ? "w-10 h-3 bg-sky-500   rounded-3xl drop-shadow-xl drop-shadow-sky-500/80 animate-bounce delay-1000 transition-all" : "w-2 h-2.5 bg-gray-200 rounded-sm"}></div>
      </div>
      <button 
      disabled={IsDisabled} 
      className={`absolute w-11/12 h-16 bottom-4   ${IsDisabled ? "text-gray-400 border-gray-200" : "bg-sky-500 text-white  border-sky-300 shadow-2xs shadow-sky-500"} bofrder-2 rounded-4xl font-extrabold `} 
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
