import React, { lazy, useState, useEffect } from 'react';
import { FaCaretLeft } from "react-icons/fa6";
import { FaCalendarAlt, FaBullseye, FaUser, FaCheck } from "react-icons/fa";
import Firstturn from './Components/Firstturn';
import Second from './Components/SecondPage';
const ChooseHight = lazy(() => import('./Components/ChooseHight'));
const ChooseAge = lazy(() => import('./Components/ChooseAge'));
const CurrentWeight = lazy(() => import('./Components/CurrentWeight'));
const TargetWeight = lazy(() => import('./Components/TargetWeight'));
const SelectGender = lazy(() => import('./Components/SelectGender'));
const FinalSection = lazy(() => import('./Components/FinalSection'));
const ChPreiod = lazy(() => import('./Components/ChPreiod'));
const S_Goals = lazy(() => import('./Components/SetGoals'));
const ShowBmi = lazy(() => import('./Components/ShowBmi'));
const CreateAUserName = lazy(() => import('./Components/CreateAUserName'));
const BreakPage = lazy(() => import('./Components/BreakPage'));

import { GoGoal } from "react-icons/go";
import { PiConfettiLight } from "react-icons/pi";
import { IoScaleOutline } from 'react-icons/io5';
import { BsCheckCircleFill } from 'react-icons/bs';

const TOTAL_STEPS = 15;

// تسمية المراحل
const stepLabels = [
  { alert: "أهلاً👋", step: 1 },
  { alert: "انت مين؟", step: 5 },
  { alert: "اختار اهدافك🎯", step: 10 },
  { alert: "مبروووك", step: 15 },
];

// ربط الخطوات بالأيقونات المخصصة
const stepIconMap: Record<number, React.ComponentType<{ className?: string }>> = {
  5: IoScaleOutline,
  7: GoGoal,
  10: FaCalendarAlt,
  12: FaBullseye,
  14: FaUser,
};

const Welcome: React.FC = () => {
  const [turn, setTurn] = useState(1);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [isUserDataSaved, setIsUserDataSaved] = useState(false);
  const [isTikTokBrowser, setIsTikTokBrowser] = useState(false);

  // ---- New states for the improved TikTok flow ----
  const [showTikTokModal, setShowTikTokModal] = useState(true); // can be dismissed
  const [linkCopied, setLinkCopied] = useState(false);

  // Detect TikTok browser
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (
      /tiktok/i.test(userAgent) ||
      /aweme/i.test(userAgent) ||
      /musical_ly/i.test(userAgent) ||
      /Bytedance/i.test(userAgent)
    ) {
      setIsTikTokBrowser(true);
    }
  }, []);

  // ---- Replaced handleOpenLink with copy-first approach ----
  const handleOpenLink = () => {
    const url = 'https://iron-fit-blush.vercel.app';
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);

    // Universal clipboard helper
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    };

    const fallbackCopy = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(textarea);
    };

    // Always copy the link immediately
    copyToClipboard(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1200);


    // No alert – the modal already provides instructions.
  };

  // ---- All your existing code (BMI calc, next, previous, etc.) unchanged ----
  const calcBMI = (weightKg: number, heightCm: number) => {
    if (heightCm <= 0) return 0;
    return weightKg / (heightCm / 100) ** 2;
  };

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
      description = "وزنك أقل من الطبيعي، يُنصح بزيادة السعرات الصحية والتركيز على بناء العضلات.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "وزن طبيعي";
      description = "وزنك مثالي – استمر على نظامك المتوازن وتمارينك!";
    } else if (bmi >= 25 && bmi < 30) {
      category = "زيادة في الوزن";
      description = "هناك زيادة بسيطة، تحسين التغذية وزيادة النشاط كفيلان بإعادتك للمسار الصحي.";
    } else if (bmi >= 30 && bmi < 35) {
      category = "سمنة من الدرجة الأولى";
      description = "الانتباه مطلوب – ابدأ بخطة غذائية ورياضية منظمة.";
    } else if (bmi >= 35 && bmi < 40) {
      category = "سمنة من الدرجة الثانية";
      description = "مرحلة تحتاج إلى التزام قوي، تغيير العادات هو المفتاح.";
    } else {
      category = "سمنة مفرطة (الدرجة الثالثة)";
      description = "الأولوية لصحتك – تغيير جذري في نمط الحياة يصنع الفرق.";
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
    };
  };

  const currentWeight = Number(localStorage.getItem("currentWeight") || 0);
  const height = Number(localStorage.getItem("height") || 0);

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
    }, 3500);
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
        return (
          <BreakPage
            heading={'فرق الوزن  ' + " " + localStorage.getItem("abs") + "كجم"}
            text={localStorage.getItem("directionLabel") || ""}
            SvgComponent={IoScaleOutline}
          />
        );
      case 6:
        return <ChooseHight />;
      case 7: {
        const details = getBMIDetails(currentWeight, height);
        return (
          <BreakPage
            heading={`مؤشر كتلة جسمك: ${details.bmi}`}
            text={`${details.category}: ${details.description}`}
            SvgComponent={GoGoal}
          />
        );
      }
      case 8:
        return <ChooseAge />;
      case 9:
        return <SelectGender />;
      case 10:
        return <ChPreiod />;
      case 11:
        return <ShowBmi />;
      case 12:
        return <S_Goals />;
      case 13:
        return (
          <BreakPage
            heading="اقتربت أن تكون فرداً منا!"
            text="متبقي فقط أن تعرفنا علي نفسك"
            SvgComponent={PiConfettiLight}
          />
        );
      case 14:
        return (
          <CreateAUserName
            setUsername={setUsername}
            onSaveSuccess={() => setIsUserDataSaved(true)}
          />
        );
      case 15:
        return <FinalSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen dark:bg-neutral-950 flex justify-center">
      <div className="absolute -top-20 right-1/2 w-70 h-50 dark:bg-amber-400 blur-[120px] opacity-75 animate-pulse" />
      <div className="w-screen max-w-md flex flex-col h-screen">
        {/* الهيدر – شريط الخطوات المحسن */}
        {turn > 2 && <header className="px-6 pt-6 pb-2">
          <div className="relative w-full mt-6  flex items-center">
            { stepLabels.map((label) => {
               const stepNumber = label.step;

              const isCompleted = turn > stepNumber;
              const isCurrent = turn === stepNumber;

              const IconComponent = stepIconMap[stepNumber];

              return (
                <React.Fragment key={stepNumber}>
                  {/* الدائرة مع النص */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted || isCurrent
                          ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20"
                          : " bg-[#D9D9D955]"
                      }`}
                    >
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-white transition-all duration-300 ${
                          isCompleted || isCurrent
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        }`}
                      >
                        {IconComponent ? (
                          <IconComponent className="w-3 h-3" />
                        ) : (
                          <span className="text-[10px] leading-none"><FaCheck /></span>
                        )}
                      </span>
                    </div>
                    <span
                      className={`absolute w-full top-6 text-[10px] leading-tight text-center transition-colors duration-300 ${
                        isCurrent
                          ? "text-orange-600 dark:text-orange-400 font-bold"
                          : isCompleted
                          ? "text-[#222222] dark:text-gray-200"
                          : "text-[#8E8E93] dark:text-gray-500"
                      }`}
                    >
                      {label.alert}
                    </span>
                  </div>

                  {/* الخط الواصل */}
                  {label.step < TOTAL_STEPS - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full mx-1 transition-all duration-500 ${
                        stepNumber < turn
                          ? "bg-gradient-to-r from-orange-500 to-orange-400"
                          : "bg-[#D9D9D9]"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </header>}

        {/* المحتوى الرئيسي */}
        <main className="flex-1 w-screen overflow-x-hidden flex items-center justify-around px-6 overflow-y-auto">
          <div className="w-full h-10/12 animate-fade-in">{renderPage()}</div>
        </main>

        {/* الفوتر مع زر المتابعة */}
        <footer className="p-6">
          <button
            disabled={loading || (turn === 14 && !isUserDataSaved)}
            onClick={next}
            className={`w-full h-14 z-50 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all ${
              loading
                ? "bg-gray-400"
                : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
            }`}
          >
            {loading
              ? " إنتظر قليلا.."
              : turn === 13 && !isUserDataSaved
              ? "احفظ البيانات أولاً"
              : turn === TOTAL_STEPS
              ? "إبدء !"
              : "استمر"}
            <FaCaretLeft />
          </button>
        </footer>
      </div>

      {/* ---- New TikTok Browser Modal (copy & paste) ---- */}
{turn === 8 && isTikTokBrowser && showTikTokModal && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 showAnim2">
    <div className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-2xl">

<article className='text-center p-6 flex gap-6 flex-col'>
  <div className='text-2xl font-black text-gray-900 dark:text-gray-100 mb-2 '>
    IronFit
    غير قادر علي العمل بشكل كامل هنا
  </div>

  <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed px-6'>
    <span className='font-bold'>IronFit</span>،
    للحصول على أفضل تجربة، افتح الموقع في{' '}
    <span className='font-bold text-emerald-600'>Chrome</span> أو{' '}
    <span className='font-bold text-emerald-600'>Safari</span>.
  </p>


  <div className='mt-3 text-xl text-gray-700 font-mono break-all select'>
    <span>http</span>
    <span className='text-green-600 font-bold'>s</span>
    <span>://iron-fit-blush.vercel.app</span>
  </div>

  {linkCopied && (
    <div className='mt-3 text-emerald-500 dark:text-green-400 text-sm animate-pulse flex flex-col'>
           <BsCheckCircleFill className='text-xl'/>

      تم النسخ بنجاح! تقدر الآن تفتح الرابط في متصفحك ,بدلا من متصفح التيك توك لأنه غير مدعوم بميزة "تطبيق الويب التقدمي", مستنيك هناك يا صديقي
      😄
    </div>
  )}
</article>

<div className='flex flex-col gap-2 p-4 bg-gray-50 dark:bg-neutral-900'>
  <button
    onClick={handleOpenLink}
    className='w-full h-12 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-xl font-semibold flex items-center justify-center flex-row text-sm gap-2 transition-all'
  >
    <div>
      الإستمرار 
      </div>
    <FaCaretLeft className="text-lg" />
  </button>

  <div className='text-center text-sm text-gray-500 dark:text-gray-400 px-2 underline '>
    قم بالمتابعة علي Chrome أو Safari.
  </div>


</div>

    </div>
  </div>
)}
    </div>
  );
};

export default Welcome;