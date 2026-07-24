import React, { useEffect, useState, useCallback,lazy } from "react";
import { MdInstallMobile } from "react-icons/md";
import { calculateAllTimeXP } from "./Xp";
const Xp = lazy(() => import("./Xp"));

type Platform = "ios" | "android" | "other" | "desktop";

function detectPlatform(ua: string): Platform {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return "ios";
  if (/android/.test(s)) return "android";
  if (/mobi/.test(s)) return "other";
  return "desktop";
}

const EMBEDDED_WEBVIEW_REGEX =
  /TikTok|Bytedance|musical_ly|trill|snssdk|FBAN|FBAV|Instagram|Line\/|MicroMessenger|;\s?wv\)/i;

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [xp, setXp] = useState(0);  // 🆕 state for XP value

  // Fetch XP asynchronously once
  useEffect(() => {
    const fetchXp = async () => {
      const xpValue = await calculateAllTimeXP();
      setXp(xpValue);
    };
    fetchXp();
  }, []);
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
    setIsFallback(false);
    // Clear any fallback timer if the prompt eventually fires
    if (fallbackTimer) clearTimeout(fallbackTimer);
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
    setIsFallback(true);
    setShowButton(true);
  } else {
    // 🔧 FIX: Use setTimeout to wait a bit for the native prompt
    fallbackTimer = setTimeout(() => {
      setDeferredPrompt((dp: any) => {
        if (!dp) {
          if (plat === "android" || plat === "other") {
            console.log("[InstallButton] no native prompt yet -> manual instructions");
            setIsFallback(true);
            setShowButton(true);
          } else {
            alert("Installation is not available in this browser.");
          }
        }
        return dp;
      });
    }, 3000); // wait 3 seconds, adjust as needed
  }

  return () => {
    window.removeEventListener("beforeinstallprompt", promptHandler);
    window.removeEventListener("appinstalled", installedHandler);
    if (fallbackTimer) clearTimeout(fallbackTimer);
  };
}, []);

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
alert("")
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

  if (true) return <Xp xp={xp} />;
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