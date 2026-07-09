import { useEffect, useState, useRef, useCallback } from "react";
import { MdInstallMobile } from "react-icons/md";
import Xp from "./Xp";

type Platform = "ios" | "android" | "other" | "desktop";

function detectPlatform(ua: string): Platform {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return "ios";
  if (/android/.test(s)) return "android";
  if (/mobi/.test(s)) return "other";
  return "desktop";
}

// Genuine in-app / embedded webviews that block install APIs entirely
// and need to be redirected out to a real browser first.
const EMBEDDED_WEBVIEW_REGEX =
  /TikTok|Bytedance|musical_ly|trill|snssdk|FBAN|FBAV|Instagram|Line\/|MicroMessenger|;\s?wv\)/i;

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false); // was "isTikTok"
  const [isFallback, setIsFallback] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  const errorLoggedRef = useRef(false);
  const hideAndLog = useCallback((reason: string) => {
    setShowButton(false);
    if (!errorLoggedRef.current) {
      console.error(`[InstallButton] ${reason}`);
      errorLoggedRef.current = true;
    }
  }, []); // stable forever now — a ref instead of state

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const isStandalone =
      standaloneMedia.matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const ua = navigator.userAgent || (window as any).opera || "";
    const plat = detectPlatform(ua);
    setPlatform(plat);

    // Real embedded browser: never fires beforeinstallprompt reliably,
    // so don't wait for it — go straight to the "open in real browser" flow.
    if (EMBEDDED_WEBVIEW_REGEX.test(ua)) {
      console.log("[InstallButton] embedded webview detected");
      setIsEmbedded(true);
      setShowButton(true);
      return;
    }

    const promptHandler = (e: Event) => {
      console.log("[InstallButton] beforeinstallprompt fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
      setIsFallback(false); // real event beats any earlier fallback guess
    };
    window.addEventListener("beforeinstallprompt", promptHandler);

    const installedHandler = () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    if (plat === "ios") {
      // Safari/Chrome/Firefox on iOS never fire beforeinstallprompt at all.
      setIsFallback(true);
      setShowButton(true);
    } else {
      // Give the real event a fair window before assuming it isn't coming.
      fallbackTimer = setTimeout(() => {
        setDeferredPrompt((dp: any) => {
          if (!dp) {
            if (plat === "android" || plat === "other") {
              console.log("[InstallButton] no native prompt yet -> manual instructions");
              setIsFallback(true);
              setShowButton(true);
            } else {
              hideAndLog("Installation is not available in this browser.");
            }
          }
          return dp;
        });
      }, 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", promptHandler);
      window.removeEventListener("appinstalled", installedHandler);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [hideAndLog]); // effectively runs once — hideAndLog never changes now

  // Manual instructions only — NEVER navigates/redirects anything.
  const openInstructions = () => {
    if (platform === "ios") {
      alert(
        "لتثبيت التطبيق: اضغط على زر المشاركة (المربع وبه سهم لأعلى) ثم اختر 'إضافة إلى الشاشة الرئيسية'."
      );
    } else {
      alert(
        " لتثبيت التطبيق: اضغط على قائمة المتصفح (⋮) في الأعلى ثم اختر 'تثبيت التطبيق' أو 'إضافة إلى الشاشة الرئيسية للحصول علي كافة المميزات'."
      );
    }
  };

  // Only ever called when isEmbedded is true — i.e. only inside a real
  // in-app webview, never inside plain Chrome/Safari.
  const escapeEmbeddedBrowser = async () => {
    const currentUrl = window.location.href;
    try {
      if (platform === "android") {
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
      } else if (platform === "ios") {
        await navigator.clipboard.writeText(currentUrl);
        alert(
          "تم نسخ الرابط. الرجاء الضغط على زر المشاركة (السهم المربع) واختيار 'إضافة إلى الشاشة الرئيسية'."
        );
      } else {
        alert("افتح الرابط في متصفح Chrome أو Safari لتثبيت التطبيق.");
      }
    } catch (err) {
      hideAndLog("Escaping embedded browser failed.");
    }
  };

  const handleAction = async () => {
    console.log("[InstallButton] click", {
      isEmbedded,
      isFallback,
      hasPrompt: !!deferredPrompt,
      platform,
    });

    if (isEmbedded) {
      await escapeEmbeddedBrowser();
      return;
    }

    if (isFallback || !deferredPrompt) {
      openInstructions();
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowButton(false);
      } else {
        setIsFallback(true);
      }
    } catch (err) {
      console.error("[InstallButton] native prompt failed", err);
      setIsFallback(true);
      openInstructions();
    }
  };

  if (isInstalled) return <Xp />;
  if (!showButton) return null;

  const message = isEmbedded
    ? "تطبيقنا غير متاح للتثبيت المباشر هنا. يرجى الضغط على الزر أدناه لفتح الموقع في متصفحك الخارجي أو إضافته للشاشة الرئيسية."
    : null;

  const buttonLabel = isEmbedded || isFallback ? "تثبيت التطبيق" : "حمل التطبيق";

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
          isEmbedded || isFallback
            ? "bg-rose-500 hover:bg-rose-600 animate-pulse"
            : "bg-orange-500 hover:bg-orange-600"
        } dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full max-w-xs outline-swealing`}
      >
        {buttonLabel}
        {!(isEmbedded || isFallback) && <MdInstallMobile className="text-lg" />}
      </button>
    </div>
  );
}

export default InstallButton;