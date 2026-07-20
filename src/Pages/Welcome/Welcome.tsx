import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa6";

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
import Second from "./Components/SecondPage";
import ShowBmi from "./Components/ShowBmi";
import CreateAUserName from "./Components/CreateAUserName";
import BreakPage from "./Components/BreakPage";
import { GoGoal } from "react-icons/go";
import { PiConfettiLight } from "react-icons/pi";
const TOTAL_STEPS = 14;

const Welcome: React.FC = () => {
  const [turn, setTurn] = useState(1);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isUserDataSaved, setIsUserDataSaved] = useState(false);

  // BMI calculator (raw value)
  const calcBMI = (weightKg: number, heightCm: number) => {
    if (heightCm <= 0) return 0;
    return weightKg / (heightCm / 100) ** 2;
  };

  // BMI details function (no doctor mentions)
  const getBMIDetails = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;

    let category = "";
    let description = "";

    if (bmi <= 0) {
      category = "غير معروف";
      description = "يرجى إدخال طول صحيح";
    } else if (bmi < 18.5) {
      category = "نقص في الوزن";
      description =
        "وزنك أقل من الطبيعي، يُنصح بزيادة السعرات الصحية والتركيز على بناء العضلات.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "وزن طبيعي";
      description =
        "وزنك مثالي – استمر على نظامك المتوازن وتمارينك!";
    } else if (bmi >= 25 && bmi < 30) {
      category = "زيادة في الوزن";
      description =
        "هناك زيادة بسيطة، تحسين التغذية وزيادة النشاط كفيلان بإعادتك للمسار الصحي.";
    } else if (bmi >= 30 && bmi < 35) {
      category = "سمنة من الدرجة الأولى";
      description =
        "الانتباه مطلوب – ابدأ بخطة غذائية ورياضية منظمة.";
    } else if (bmi >= 35 && bmi < 40) {
      category = "سمنة من الدرجة الثانية";
      description =
        "مرحلة تحتاج إلى التزام قوي، تغيير العادات هو المفتاح.";
    } else {
      category = "سمنة مفرطة (الدرجة الثالثة)";
      description =
        "الأولوية لصحتك – تغيير جذري في نمط الحياة يصنع الفرق.";
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
    };
  };

  // Read values from localStorage (as before)
  const targetWeight = Number(localStorage.getItem("targetWeight") || 0);
  const age = Number(localStorage.getItem("age") || 0);
  const challengePeriod = Number(localStorage.getItem("challengePeriod") || 0);
  const gender = localStorage.getItem("SelectedGender") || "";
  const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
  const height = Number(localStorage.getItem("height") || 0);
  const bmi = calcBMI(currentWeight, height);

  const next = () => {
    if (loading) return;
    if (turn === TOTAL_STEPS) {
      window.location.href = "/me/home";
      return;
    }
    setLoading(true);
    setTurn((prev) => prev + 1);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const previous = () => {
    if (turn === 1 || loading) return;
    setTurn((prev) => prev - 1);
  };

  const renderPage = () => {
    switch (turn) {
      case 1:
        return <Firstturn />;
      case 2:
        return <Second />;
      case 3:
        return <CurrentWeight />;
      case 4:
        return <TargetWeight />;
      case 5:
        return <ChooseHight />;
      case 6: {
        const details = getBMIDetails(currentWeight, height);
        return (
          <BreakPage
            heading={`مؤشر كتلة جسمك: ${details.bmi}`}
            text={`${details.category}: ${details.description}`}
            SvgComponent={GoGoal}
          />
        );
      }
      case 7:
        return <ChooseAge />;
      case 8:
          return <SelectGender />;
      case 9 : 
          return <ChPreiod />
      case 10:
        return <ShowBmi />;
  
      case 11:
        return <S_Goals />;
      case 12 :
        return <BreakPage heading="اقتربت أن تكون فرداً منا!" text="متبقي فقط أن تعرفنا علي نفسك" SvgComponent={PiConfettiLight}/>
      case 13:
        return  <CreateAUserName
      setUsername={setUsername}
      onSaveSuccess={() => setIsUserDataSaved(true)}
    />;
      case 14:
        return <FinalSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen dark:bg-neutral-950 flex justify-center">
      {/* Content Width */}
      <div className="w-screen max-w-md flex flex-col h-screen">
        {/* Header */}
        <header className="px-6 pt-6 pb-2">
          <div className="mt-6 w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800/20 overflow-hidden">
            <div
              className="h-full bg-linear-to-l from-pink-500 via-rose-500 to-amber-600 transition-all duration-500 rounded-full"
              style={{
                width: `${(turn / TOTAL_STEPS) * 100}%`,
              }}
            />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 flex items-center justify-around px-6 overflow-y-auto">
          <div className="w-full h-10/12 animate-fade-in">{renderPage()}</div>
        </main>

        {/* Footer */}
        <footer className="p-6">
          <button
            disabled={loading || (turn === 13 && !isUserDataSaved)}
            onClick={next}
            className={`w-full h-14 z-50 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all ${
              loading
                ? "bg-gray-400"
                : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
       {loading
  ? " إنتظر قليلا.."
  : turn === 14 && !isUserDataSaved
  ? "احفظ البيانات أولاً"
  : turn === TOTAL_STEPS
  ? "إبدء !"
  : "استمر"}
            <FaCaretLeft />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;