import { useState, useRef, useEffect } from "react";
import { sendPost } from "../../../firebase/post";
import { TiPlus } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import ImagePicker from "./ImagePicker";

const compressImage = (
  dataUrl: string,
  maxWidth = 1024,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = (height / width) * maxWidth;
          width = maxWidth;
        } else {
          width = (width / height) * maxWidth;
          height = maxWidth;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not available"));
      ctx.drawImage(img, 0, 0, width, height);
      // Return as JPEG data URL (already base64)
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Image load failed"));
  });
};


const InputsContainer = () => {
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

  const uploadImageToStorage = async (dataUrl: string): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `posts/${Date.now()}.jpg`);
    // uploadString expects base64 or raw data; we'll use base64
    const snapshot = await uploadString(storageRef, dataUrl, "data_url");
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handelClicked = async () => {
    if (!inputs.trim() && !image) return;

    setIsSending(true);
    setSendError(null);
    setProgress(0);

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
    }, 300);

    try {
      let imageUrl: string | undefined;

      if (image) {
        // 1. Compress locally
        const compressed = await compressImage(image, 1024, 0.7);
        // 2. Upload to Storage (this will be the heavy part)
        imageUrl = await uploadImageToStorage(compressed);
      }

      // 3. Save post with only the URL (tiny string)
      await sendPost(inputs, "Ahmed", imageUrl ?? undefined);

      // Success
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error: any) {
      console.error("Failed to send post:", error);
      alert(error.message);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSendError("حدث خطأ أثناء الإرسال، حاول مرة أخرى");
      setProgress(0);
      setIsSending(false);
    }
  };
  

  return (
    <div className="fixed top-0 left-0 z-50 min-h-screen w-screen overflow-y-scroll p-5 bg-white dark:bg-black dark:border-2 dark:border-gray-600/20 rounded-2xl border-gray-200 flex flex-col gap-3">
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

      {/* Progress bar – visible only during send */}
      {isSending && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
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

export default InputsContainer;