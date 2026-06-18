import { useEffect, useState } from "react";
import { MdInstallMobile } from "react-icons/md";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Detect TikTok in-app browser
    const userAgent = navigator.userAgent || (window as any).opera;
    if (/TikTok|Bytedance|musical_ly|trill|snssdk|wv/i.test(userAgent)) {
      setIsTikTok(true);
      setShowButton(true); // always show the alternative button
      return;
    }

    // Listen for the native install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true); // only now we show the button
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Hide after successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowButton(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleAction = async () => {
    if (isTikTok) {
      const currentUrl = window.location.href;
      if (/android/i.test(navigator.userAgent)) {
        const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
        // Create a hidden link to trigger the intent
        const a = document.createElement("a");
        a.href = intentUrl;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        try {
          await navigator.clipboard.writeText(currentUrl);
          alert("تم نسخ الرابط. الرجاء الضغط على الثلاث نقاط بالأعلى واختيار 'Open in Safari' لتثبيت التطبيق.");
        } catch {
          alert("الرجاء الضغط على الثلاث نقاط بالأعلى واختيار 'Open in Safari'.");
        }
      }
      return;
    }

    // Standard PWA install
    if (!deferredPrompt) return; // safety
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowButton(false);
    }
  };

  // Hide completely if already installed or nothing to show
  if (isInstalled || !showButton) return null;

  return (
    <div className="flex flex-col items-center gap-3">
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
        {!isTikTok && <MdInstallMobile className="text-lg" />}
      </button>
    </div>
  );
}

export default InstallButton;