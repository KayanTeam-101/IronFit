import { useState, useRef, useEffect } from "react";
import { sendStory } from "../../../../firebase/story";
import { TiPlus } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ImagePicker from "../ImagePicker";
import imageCompression from "browser-image-compression";
import { FaXmark } from "react-icons/fa6";

// Helper: data URL → File
const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Helper: File → data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AddStroy: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [inputs, setInputs] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

const handelClicked = async () => {
  if (!inputs.trim() && !image) return;
  setIsSending(true);
  setSendError(null);
  setProgress(0);

  intervalRef.current = window.setInterval(() => {
    setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
  }, 300);

  try {
    const userId = localStorage.getItem("userId_");
    if (!userId) throw new Error("User not logged in");

    let finalImage: string | undefined = undefined;
    if (image) {
      const imageFile = dataURLtoFile(image, "upload.jpg");
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      finalImage = await fileToDataURL(compressedFile);
    }

    await sendStory(userId,localStorage.getItem("UserName") || "",inputs, finalImage || "");
    setProgress(100);

    // Update localStorage (without early return)
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("PostedStoryDays") || "[]";
    const postedDays = JSON.parse(stored);
    if (!postedDays.includes(today)) {
      postedDays.push(today);
      localStorage.setItem("PostedStoryDays", JSON.stringify(postedDays));
    }

    // Success – close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 600);

  } catch (error: any) {
    console.error("Failed to send story:", error);
    setSendError("حدث خطأ أثناء الإرسال، حاول مرة أخرى");
    setProgress(0);
    // Re‑throw or alert – but the UI will show the error
    alert(error.message);
  } finally {
    // Always clean up
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSending(false);
  }
};

  return (
    <div className="fixed top-0 left-0 z-50 min-h-screen w-screen overflow-y-scroll p-5 bg-white/20 dark:bg-black/40 backdrop-blur-2xl  dark:border-2 dark:border-gray-600/20  border-gray-200 flex flex-col gap-3">
      <button
        onClick={() => onClose()}
        className="w-14 h-14 z-50 rounded-xl bg-gray-800/40 text-white flex items-center justify-center"
      >
        <FaXmark />
      </button>
      <ImagePicker onImageSelect={setImage} />

      <textarea
        placeholder="شارك محتواك !"
        className="w-full min-h-20 max-h-40 p-6 dark:bg-gray-300/10 dark:border-gray-300/5 border-2 resize-none rounded-2xl dark:text-white bg-white border-gray-200 outline-none"
        onChange={(e) => setInputs(e.target.value)}
        value={inputs}
      />

      {sendError && (
        <p className="text-red-500 dark:text-red-400 text-sm text-center -mb-2">
          {sendError}
        </p>
      )}

      {isSending && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-linear-to-l from-amber-200 via-teal-200 to-pink-300  rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        className={`w-full h-6 p-6 flex-row border-2 rounded-2xl outline-none flex items-center gap-1.5 justify-center active:scale-95 transition-all duration-200 ${
          isSending
            ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500"
            : "dark:bg-gray-300/10 dark:border-gray-300/5 dark:text-white bg-white border-gray-200"
        }`}
        onClick={handelClicked}
        disabled={isSending}
      >
        {isSending ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin mb-0.5" />
            <span>جاري الإرسال... {Math.min(progress, 100).toFixed(0)}%</span>
          </>
        ) : (
          <>
            <TiPlus className="mb-1" />
            <span>Send</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddStroy;
