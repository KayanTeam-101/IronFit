import { useEffect, useState, useCallback } from "react";
import { MdInstallMobile } from "react-icons/md";
import Xp from "./Xp";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [errorLogged, setErrorLogged] = useState(false);

  // Helper to hide the button and log once
  const hideAndLog = useCallback(
    (reason: string) => {
      setShowButton(false);
      if (!errorLogged) {
        console.error(`[InstallButton] ${reason}`);
        setErrorLogged(true);
      }
    },
    [errorLogged]
  );

  useEffect(() => {
    // Already installed as PWA → nothing to do
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const isStandalone =
      standaloneMedia.matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect TikTok
    const userAgent = navigator.userAgent || (window as any).opera;
    const tikTokRegex = /TikTok|Bytedance|musical_ly|trill|snssdk|wv/i;
    if (tikTokRegex.test(userAgent)) {
      setIsTikTok(true);
      setShowButton(true);
      return;
    }

    // Listen for native install prompt (Chromium)
    const promptHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener("beforeinstallprompt", promptHandler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    // Fallback for iOS / non‑Chromium Android
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isMobile = /mobi|android/i.test(navigator.userAgent.toLowerCase());

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    if (isIOS) {
      setIsFallback(true);
      setShowButton(true);
    } else if (isMobile) {
      // Wait a moment – if the prompt never appears, show manual guide
      fallbackTimer = setTimeout(() => {
        if (!deferredPrompt && !isInstalled) {
          setIsFallback(true);
          setShowButton(true);
        }
      }, 1000);
    }

    // If none of the above conditions activated, we'll hide and log an error
    const finalTimer = setTimeout(() => {
      if (!showButton && !isInstalled && !deferredPrompt && !isTikTok && !isIOS && !isMobile) {
        // This is a desktop or unsupported browser where install isn't possible
        hideAndLog("Installation is not available in this browser.");
      }
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", installedHandler);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      clearTimeout(finalTimer);
    };
  }, []);

  // Action handler
  const handleAction = async () => {
    // ----- TikTok / Fallback path -----
    if (isTikTok || isFallback) {
      const currentUrl = window.location.href;
      const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent);

      try {
        if (/android/i.test(navigator.userAgent)) {
          // Open in Chrome via intent (Android)
          const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
          const a = document.createElement("a");
          a.href = intentUrl;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else if (isIOS) {
          await navigator.clipboard.writeText(currentUrl);
          alert(
            "تم نسخ الرابط. الرجاء الضغط على زر المشاركة (السهم المربع) واختيار 'إضافة إلى الشاشة الرئيسية'."
          );
        } else {
          alert(
            "Please open this page in a supported browser (Chrome, Edge, or Safari) to install the app."
          );
        }
      } catch (err) {
        // Something went wrong with the fallback → hide button and log
        hideAndLog("Fallback install action failed.");
      }
      return;
    }

    // ----- Native PWA install path -----
    if (!deferredPrompt) {
      // Should not happen, but if it does: hide and log
      hideAndLog("Native install prompt was not available.");
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowButton(false);
      }
    } catch (err) {
      hideAndLog("Native install prompt failed.");
    }
  };

  // Already installed → show XP badge instead of button
  if (isInstalled) return <Xp />;

  // If we decided to hide the button entirely, render nothing
  if (!showButton) return null;

  // Only TikTok gets the pink warning message
  const message = isTikTok
    ? "تطبيقنا غير متاح للتثبيت المباشر هنا. يرجى الضغط على الزر أدناه لفتح الموقع في متصفحك الخارجي أو إضافته للشاشة الرئيسية."
    : null;

  const buttonLabel =
    isTikTok || isFallback ? "تثبيت التطبيق" : "حمل التطبيق";

  return (
    <div className="flex flex-col items-center gap-3">
      {message && (
        <p className="text-sm text-rose-600 bg-rose-200/40 p-3 rounded-lg text-center max-w-xs border border-rose-200 animate-pulse">
          {message}
        </p>
      )}
      <button
      type="button"
        onClick={handleAction}
        className={`${
          isTikTok || isFallback
            ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
            : "bg-orange-500 hover:bg-orange-600"
        } dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full max-w-xs outline-swealing`}
      >
        {buttonLabel}
        {!(isTikTok || isFallback) && <MdInstallMobile className="text-lg" />}
      </button>
    </div>
  );
}

export default InstallButton;