import { useEffect, useState } from "react";
import { MdInstallMobile } from "react-icons/md";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
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

  const handleInstall = async () => {
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

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstall}
      className="bg-blue-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 text-white px-4 py-2 rounded-xl"
    >
      Download App <MdInstallMobile className="inline-block ml-2" />
    </button>
  );
}

export default InstallButton;