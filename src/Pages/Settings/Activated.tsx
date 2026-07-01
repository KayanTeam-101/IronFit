import React, { useEffect, useState } from "react";
import { IoDiamond, IoDiamondOutline } from "react-icons/io5";

interface Props {
  show: boolean;
}

const SubscriptionActivationOverlay: React.FC<Props> = ({ show }) => {
  const [phase, setPhase] = useState<"hidden" | "diamond" | "text" | "done">("hidden");

  useEffect(() => {
    if (show && phase === "hidden") {
      setPhase("diamond");
    }
  }, [show, phase]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "diamond") {
      timer = setTimeout(() => setPhase("text"), 1200);
    } else if (phase === "text") {
      timer = setTimeout(() => {
        setPhase("done");
        window.location.reload();
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  if (!show && phase === "hidden") return null;

  // أيقونة الألماس المخطط مستوحاة من IoDiamondOutline
  const DiamondSvg = () => (
  <IoDiamond className="text-amber-400 dark:text-amber-300 text-9xl showAnim2" />
  );

  // علامة الصح المتحركة (يمكن وضعها داخل SVG أو منفصلة)
  const CheckMark = () => (
   ""
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* حاوية الألماس مع حركة الارتفاع */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            phase === "text" ? "-translate-y-10" : "translate-y-0"
          } ${phase === "diamond" ? "animate-pop-in" : ""}`}
        >
          <DiamondSvg />
          <CheckMark />
        </div>

        {/* النص */}
        <div
          className={`mt-8 text-2xl font-bold text-white dark:text-amber-100 text-center transition-all duration-700 ease-out ${
            phase === "text"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          تم تفعيل الاشتراك
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionActivationOverlay;