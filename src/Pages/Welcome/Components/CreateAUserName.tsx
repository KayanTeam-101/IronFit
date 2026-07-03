import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebase/main";
import { SetUser } from "../../../firebase/user";
import imageCompression from 'browser-image-compression'; // ✅ import
import { PiPlusBold } from "react-icons/pi";

const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 14;

const getValidationError = (username: string): string | null => {
  const trimmed = username.trim();
  if (!trimmed) return null;

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return `اسم المستخدم يجب أن يكون مكون من ${USERNAME_MIN_LENGTH} أحرف علي الأقل`;
  }
  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return `اسم المستخدم يجب أن يكون أقل من ${USERNAME_MAX_LENGTH} أحرف`;
  }
  if (!/\d/.test(trimmed)) {
    return `يجب إضافة أرقام إلى اسم المستخدم مثال Ahmed-777`;
  }
  return null;
};

const CreateAUserName = ({
  setUsername,
}: {
  setUsername: (name: string) => void;
}) => {
  const [text, setText] = useState(localStorage.getItem("UserName") || "");
  const [email, setEmail] = useState(localStorage.getItem("Email") || "");
  const [photoUrl, setPhotoUrl] = useState(localStorage.getItem("PhotoUrl") || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isCompressing, setIsCompressing] = useState(false); // ✅ new

  const validationError = getValidationError(text);
  const isValidFormat = text.trim().length > 0 && validationError === null;

  const checkUsername = useCallback(async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed || getValidationError(trimmed)) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const q = query(
        collection(db, "users"),
        where("UserNameLower", "==", trimmed.toLowerCase()),
        limit(1),
      );
      const snapshot = await getDocs(q);
      setIsAvailable(snapshot.empty);
    } catch (error) {
      console.error("Error checking username:", error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
    setUsername(text);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsername(text.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [text, checkUsername]);

 // Helper: get existing userId or generate a new one from the username
const getOrCreateUserId = (username: string): number => {
  const stored = localStorage.getItem("userId_");
  if (stored) return Number(stored);

  // djb2 hash – deterministic, max 15 digits
  let hash = 5381;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 33) ^ username.charCodeAt(i);
  }
  const userId = Math.abs(hash) % 1_000_000_000_000_000; // 10^15
  localStorage.setItem("userId_", String(userId));
  return userId;
};

const handleSave = async () => {
  // Early exit if not ready
  if (!isAvailable || !isValidFormat || saveState !== "idle" || isCompressing) {
    return;
  }

  setSaveState("loading");

  try {
    const trimmed = text.trim();

    // Persist user data locally
    localStorage.setItem("UserName", trimmed);
    localStorage.setItem("Email", email);
    localStorage.setItem("PhotoUrl", photoUrl);

    // Obtain a numeric user ID (reuse existing or create new)
    const userId = getOrCreateUserId(trimmed);

    // Save to Firestore (or your backend)
    await SetUser(trimmed, email, photoUrl, userId);

    setSaveState("success");
  } catch (error) {
    console.error("Failed to save user:", error);
    setSaveState("error");
  }
};
  
 const canSave =
  isAvailable && isValidFormat && !isChecking && saveState === "idle" && !isCompressing;

  // ✅ Compress image before setting state
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // Compress to < 0.5 MB
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        useWebWorker: true, // improves performance
      });

      // Convert compressed file to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setIsCompressing(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compression failed:", error);
      // Fallback: use original file if compression fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setIsCompressing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-11/12 h-screen flex justify-center flex-col">
      {/* Main container for all fields */}
      <div className="relative w-full  space-y-4 -top-40">
        {/* Username input */}
        <div>
          <div className="relative w-50 m-5 h-50">
          <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
            {isCompressing && "⏳ جاري الضغط..."}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isCompressing}

            className="absolute h-full opacity-0 w-full text-sm z-50 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200 disabled:opacity-50"
          />
            {!photoUrl && (
            <div className="relative h-full mt-2 w-full flex justify-center items-center">
              <div
              className="absolute z-10 w-full h-full gap-2 flex-col animate-pulse text-gray-600 dark:text-gray-300   bg-gray-100/50 border-2 border-gray-200/60 rounded-full text-2xl flex items-center justify-center">
                <PiPlusBold /> 
<p className=" text-sm mt-2">
                صورة شخصية

</p>
              </div>
            </div>
          )}
          {photoUrl && (
            <div className="mt-2 w-full flex justify-center items-center">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-50 h-50 rounded-full object-cover border-4 shadow-xl border-gray-300/20 "
              />
            </div>
          )}
        </div>

          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            maxLength={USERNAME_MAX_LENGTH}
            autoFocus
            placeholder="أكتب اسم المستخدم, مثال: Ahmed-Fit1"
            className={`border-b-2 border-gray-600/40 bg-gray-400/50 outline-none p-4 px-5  w-full text-md dark:text-white ${
              saveState === "success"
                ? "border-teal-500/40 bg-green-700/15 text-green-600"
                : "border-slate-500/40 bg-gray-700/15 text-gray-600"
            }`}
          />
          {validationError && (
            <p className="text-rose-500 mt-2">{validationError}</p>
          )}
          {!validationError && isChecking && (
            <p className="text-gray-500 mt-2">Checking...</p>
          )}
          {!validationError && !isChecking && isAvailable !== null && (
            <p
              className={`mt-2 ${
                isAvailable ? "text-green-600" : "text-rose-500"
              }`}
            >
              {isAvailable
                ? "اسم المستخدم متاح"
                : "تم إستخدام هذا الاسم من قبل شخص اخر"}
            </p>
          )}
        </div>

        {/* Email input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني (اختياري)"
            className="border-b-2 border-slate-500/40 bg-gray-700/15 text-gray-600 outline-none p-4 px-5 w-full text-md dark:text-white"
          />
        </div>

        {/* Photo (image) input with compression */}
        
        {saveState === "error" && (
          <p className="text-rose-500 mt-2">
{saveState}
          </p>
        )}
      </div>

      {/* Save button – styles untouched */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`absolute bottom-4 right-0 z-50  h-16  bg-white dark:bg-gray-950 outline-none p-4 px-5  w-full text-md dark:text-white flex items-center justify-center gap-2 transition-colors
          ${!canSave ? " cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
          ${saveState === "success" ? "bg-green-600 text-white border-green-600 hidden" : ""}
        `}
      >
        {saveState === "success"
          ? `تم الحفظ: ${localStorage.getItem("UserName")}`
          : "Save"}
      </button>
    </div>
  );
};

export default CreateAUserName;