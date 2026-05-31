import { useEffect, useState } from "react";
import { BsBrowserChrome } from "react-icons/bs";
import { MdInstallMobile } from "react-icons/md";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    // 1. فحص ما إذا كان المستخدم يفتح الموقع من داخل تطبيق تيك توك
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (userAgent.includes("TikTok")) {
      setIsTikTok(true);
      setShowButton(true); // إظهار الزر فوراً داخل تيك توك
      return; 
    }

    // 2. إذا كان متصفحاً عادياً، ننتظر دعم الـ PWA للتثبيت
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true); // إظهار الزر فقط إذا كان المتصفح يدعم التثبيت
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleAction = async () => {
    // الحالة الأولى: إذا كان المستخدم داخل تيك توك
    if (isTikTok) {
      const currentUrl = window.location.href;

      // نظام أندرويد: فتح متصفح كروم الخارجي تلقائياً
      if (/android/i.test(navigator.userAgent)) {
        window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
      } else {
        // نظام آيفون (iOS): نسخ الرابط وإظهار تعليمات للمستخدم
        try {
          await navigator.clipboard.writeText(currentUrl);
          alert("تم نسخ رابط الموقع! يرجى الضغط على الثلاث نقاط (...) بالأعلى واختيار 'Open in Safari' لتتمكن من تحميل التطبيق.");
        } catch (err) {
          alert("يرجى الضغط على الثلاث نقاط (...) بأعلى الشاشة ثم اختيار 'Open in Safari' لتحميل التطبيق.");
        }
      }
      return;
    }

    // الحالة الثانية: إذا كان في المتصفح الخارجي ويدعم التثبيت
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (isTikTok) {
    alert("تطبيقنا غير متاح للتثبيت داخل تيك توك. يرجى الضغط على زر \"الذهاب للمتصفح\" لفتح الموقع في المتصفح الخارجي حيث يمكنك تحميل التطبيق بسهولة.");
  }
  // إذا لم يتحقق أي شرط (متصفح لا يدعم PWA أو لم يظهر الحدث بعد)، لا يتم عرض الزر
  if (!showButton) {
    return null;
  };

  return (
    <button
      onClick={handleAction}
      className={`${
        isTikTok 
          ? "bg-red-500 hover:bg-sky-600 dark:bg-rose-400 animate-pulse outline-swealing" // شكل الزر داخل تيك توك
          : "bg-blue-500 hover:bg-blue-600"            // شكل الزر في المتصفح العادي
      } dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2`}
    >
      {/* تغيير نص الزر ديناميكياً بناءً على مكان تصفح المستخدم */}
      {isTikTok ? "الذهاب للمتصفح" : "حمل التطبيق"}
      {isTikTok ? (
        <BsBrowserChrome className="text-lg" />
      ) : (
        <MdInstallMobile className="text-lg" />
      )}
    </button>
  );
}

export default InstallButton;