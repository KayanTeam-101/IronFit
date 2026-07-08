import { useEffect, useState } from "react";
import { MdInstallMobile } from "react-icons/md";
import Xp from "./Xp";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);
  const [isFallback, setIsFallback] = useState(false); // true when we show manual guide

  useEffect(() => {
    // 1. Check if already installed (standalone mode)
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const isStandalone =
      standaloneMedia.matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect TikTok in-app browser
    const userAgent = navigator.userAgent || (window as any).opera;
    const tikTokRegex = /TikTok|Bytedance|musical_ly|trill|snssdk|wv/i;
    if (tikTokRegex.test(userAgent)) {
      setIsTikTok(true);
      setShowButton(true);
      return;
    }

    // 3. Listen for the native beforeinstallprompt (Chromium browsers)
    const promptHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener("beforeinstallprompt", promptHandler);

    // 4. Handle successful install
    const installedHandler = () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    // 5. Fallback for browsers that do NOT fire beforeinstallprompt (iOS, Firefox, etc.)
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isMobile = /mobi|android/i.test(navigator.userAgent.toLowerCase());

    // For iOS we can immediately show the manual install guide
    if (isIOS) {
      setIsFallback(true);
      setShowButton(true);
    } else if (isMobile) {
      // For Android non-Chromium browsers, we wait a short time to see if
      // beforeinstallprompt fires. If not, show the manual fallback.
      const timeout = setTimeout(() => {
        if (!deferredPrompt && !isInstalled) {
          setIsFallback(true);
          setShowButton(true);
        }
      }, 1000);
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("beforeinstallprompt", promptHandler);
        window.removeEventListener("appinstalled", installedHandler);
      };
    }

    // Cleanup
    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleAction = async () => {
    // TikTok or generic fallback (including iOS) – guide user to external browser
    if (isTikTok || isFallback) {
      const currentUrl = window.location.href;
      const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent);

      if (/android/i.test(navigator.userAgent)) {
        // Android: try to open with Chrome intent
        const intentUrl = `intent://${currentUrl.replace(
          /^https?:\/\//,
          ""
        )}#Intent;scheme=https;package=com.android.chrome;end`;
        const a = document.createElement("a");
        a.href = intentUrl;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (isIOS) {
        // iOS: copy link and instruct user to open in Safari
        try {
          await navigator.clipboard.writeText(currentUrl);
          alert(
            "تم نسخ الرابط. الرجاء الضغط على زر المشاركة (السهم المربع) واختيار 'إضافة إلى الشاشة الرئيسية'."
          );
        } catch {
          alert(
            "الرجاء فتح هذه الصفحة في Safari ثم الضغط على زر المشاركة (السهم المربع) واختيار 'إضافة إلى الشاشة الرئيسية'."
          );
        }
      } else {
        // Other fallback (e.g., macOS or unknown)
        alert("Please open this page in a supported browser (Chrome, Edge, or Safari) to install the app.");
      }
      return;
    }

    // Standard PWA install (Chromium browsers)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowButton(false);
      }
    }
  };

  // Hide completely if already installed
  if (isInstalled) return <Xp />;

  // Show nothing only if we haven't determined to show the button yet
  if (!showButton) return null;

  // Construct the message and button label based on the scenario
  const isFallbackMode = isTikTok || isFallback;
  const message = isFallbackMode
    ? "تطبيقنا غير متاح للتثبيت المباشر هنا. يرجى الضغط على الزر أدناه لفتح الموقع في متصفحك الخارجي أو إضافته للشاشة الرئيسية."
    : null;

  const buttonLabel = isFallbackMode ? "تثبيت التطبيق" : "حمل التطبيق";

  return (
    <div className="flex flex-col items-center gap-3">
      {message && (
        <p className="text-sm text-rose-600 bg-rose-200/40 p-3 rounded-lg text-center max-w-xs border border-rose-200 animate-pulse">
          {message}
        </p>
      )}

      <button
        onClick={handleAction}
        className={`${
          isFallbackMode
            ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
            : "bg-orange-500 hover:bg-orange-600"
        } dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full max-w-xs outline-swealing`}
      >
        {buttonLabel}
        {!isFallbackMode && <MdInstallMobile className="text-lg" />}
      </button>
    </div>
  );
}

export default InstallButton;