import { useEffect, useState } from "react";
import { BsBrowserChrome } from "react-icons/bs";
import { MdInstallMobile } from "react-icons/md";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    // 1. فحص شامل لكل المعرفات التي يستخدمها تيك توك في الأندرويد والآيفون
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isTikTokBrowser = /TikTok|Bytedance|musical_ly|trill|snssdk|wv/i.test(userAgent);

    if (isTikTokBrowser) {
      setIsTikTok(true);
      setShowButton(true); // إظهار الزر فوراً
      // ❌ تم إزالة alert() نهائياً لأنها توقف الكود في متصفح تيك توك
      return; 
    }

    // 2. المتصفح العادي
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true); 
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);
  useEffect(() => {
  // إذا لم يكن تيك توك، أظهر الزر بعد ثانية احتياطاً
  if (!isTikTok) {
    const timer = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(timer);
  }
}, [isTikTok]);
  const handleAction = async () => {
    if (isTikTok) {
      const currentUrl = window.location.href;

      if (/android/i.test(navigator.userAgent)) {
        window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
      } else {
        try {
          await navigator.clipboard.writeText(currentUrl);
          // استخدمنا alert هنا فقط لأن المستخدم هو من ضغط على الزر بنفسه (User interaction)، وهذا مسموح به
          alert("تم نسخ الرابط! يرجى الضغط على الثلاث نقاط (...) بالأعلى واختيار 'Open in Safari' لتحميل التطبيق.");
        } catch (err) {
          alert("يرجى الضغط على الثلاث نقاط (...) بأعلى الشاشة ثم اختيار 'Open in Safari'.");
        }
      }
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* عرض التنبيه كنص في الواجهة بدلاً من نافذة مزعجة قد يتم حظرها */}
      {isTikTok && (
        <p className="text-sm text-rose-600 bg-rose-100 p-3 rounded-lg text-center max-w-xs border border-rose-200 animate-pulse">
          تطبيقنا غير متاح للتثبيت المباشر هنا. يرجى الضغط على الزر أدناه لفتح الموقع في متصفحك الخارجي.
        </p>
      )}

      <button
        onClick={handleAction}
        className={`${
          isTikTok 
            ? "bg-rose-500 hover:bg-rose-600 animate-pulse" 
            : "bg-orange-500 hover:bg-orange-600"            
        } dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full max-w-xs`}
      >
        {isTikTok ? "الذهاب للمتصفح" : "حمل التطبيق"}
        {isTikTok ? (
          ""
        ) : (
          <MdInstallMobile className="text-lg" />
        )}
      </button>
    </div>
  );
}

export default InstallButton;