import React, { useEffect, useState } from "react";
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
import Second from "./Components/SecondPage";
import ShowBmi from "./Components/ShowBmi";
import CreateAUserName from "./Components/CreateAUserName";

const Welcome: React.FC = () => {
  const [turn, setTurn] = useState(1);
  const [IsDisabled, setIsDisabled] = useState(false);

  // ✅ State for username, initialised from localStorage
  const [username, setUsername] = useState(() => 
    ''
  );

  const handleClick = () => {
    if (turn === 14) {
      setIsDisabled(true);
      window.location.href = "/me/home";
      return;
    }
    setIsDisabled(true);
    setTurn(turn + 1);
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };


  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col p-2 m-0 items-center bg-linear-to-b bg-amber-50 dark:bg-black/20 dark:border-2 ">
      <div className="absolute top-10 z-0 w-full h-100 opacity-35 blur-3xl bg-linear-to-r from-amber-400 via-indigo-400 to-teal-300" />

      {(() => {
        switch (turn) {
          case 1: return <Firstturn />;
          case 2: return <Second />;
          case 3: return <CurrentWeight />;
          case 4: return <TargetWeight />;
          case 5: return <ChooseHight />;
          case 8: return <ShowBmi />;
          case 7: return <ChooseAge />;
          case 6: return <ChPreiod />;
          case 9: return <SelectDays />;
          case 10: return <S_Goals />;
          case 11: return <SelectGender />;
          case 12:
            // ✅ Pass the setter function, not the value
            return <CreateAUserName setUsername={setUsername} />;
          case 13: return <SatisfactionRate />;
          case 14: return <FinalSection />;
          default: return null;
        }
      })()}

      <div className="absolute bottom-24 duration-1000 flex items-center justify-around flex-row gap-1 p-1 text-center min-w-5 rounded-2xl dark:bg-black/20 dark:border-2 h-5 bg-gray-50 ">
        {Array.from({ length: 14 }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={turn === step 
              ? "w-10 h-3 bg-amber-500 dark:bg-orange-600 rounded-3xl drop-shadow-xl delay-1000 transition-all" 
              : "w-2 h-2.5 bg-gray-200 dark:bg-gray-500/20 rounded-sm"
            }
          />
        ))}
      </div>

      <button
        disabled={IsDisabled}
        className={`absolute w-11/12 h-16 bottom-4 transition-all delay-1000 ${
          IsDisabled
            ? "text-gray-400 border-gray-200 bg-gray-100 dark:opacity-30"
            : "bg-orange-400 dark:bg-black/20 dark:border-gray-300/15 text-white border-amber-300 shadow-2xs"
        } border-2 rounded-4xl font-extrabold`}
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