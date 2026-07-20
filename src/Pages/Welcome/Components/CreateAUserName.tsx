import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebase/main";
import { SetUser } from "../../../firebase/user";
import imageCompression from "browser-image-compression";
import { PiPlusBold } from "react-icons/pi";

const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 13;

const getValidationError = (username: string): string | null => {
  const trimmed = username.trim();
  if (!trimmed) return null;
  if (trimmed.length < USERNAME_MIN_LENGTH)
    return `يجب أن يكون ${USERNAME_MIN_LENGTH} أحرف و أرقام على الأقل Ahmed-fit901 :`;
  if (trimmed.length > USERNAME_MAX_LENGTH)
    return `يجب أن يكون أقل من ${USERNAME_MAX_LENGTH} حرف`;
  if (!/\d/.test(trimmed)) return "يجب أن يحتوي على أرقام، مثال: Ahmed-fit901";
  return null;
};

const CreateAUserName = ({
  setUsername,
  onSaveSuccess, // new callback
}: {
  setUsername: (name: string) => void;
  onSaveSuccess?: () => void;
}) => {
  const [text, setText] = useState(localStorage.getItem("UserName") || "");
  const [email, setEmail] = useState(localStorage.getItem("Email") || "");
  const [photoUrl, setPhotoUrl] = useState(localStorage.getItem("PhotoUrl") || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success" | "error">("idle");

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
        limit(1)
      );
      const snapshot = await getDocs(q);
      setIsAvailable(snapshot.empty);
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkUsername(text.trim()), 500);
    return () => clearTimeout(timer);
  }, [text, checkUsername]);

  useEffect(() => {
    setUsername(text);
  }, [text, setUsername]);

  const getOrCreateUserId = (username: string): number => {
    const stored = localStorage.getItem("userId_");
    if (stored) return Number(stored);
    let hash = 5381;
    for (let i = 0; i < username.length; i++)
      hash = (hash * 33) ^ username.charCodeAt(i);
    const userId = Math.abs(hash) % 1_000_000_000_000_000;
    localStorage.setItem("userId_", String(userId));
    return userId;
  };

  const handleSave = async () => {
    if (!isAvailable || !isValidFormat || saveState !== "idle" || isCompressing) return;
    setSaveState("loading");
    try {
      const trimmed = text.trim();
      localStorage.setItem("UserName", trimmed);
      localStorage.setItem("Email", email);
      localStorage.setItem("PhotoUrl", photoUrl);
      const userId = getOrCreateUserId(trimmed);
      await SetUser(trimmed, email, photoUrl, userId);
      setSaveState("success");
      onSaveSuccess?.(); // notify parent
    } catch {
      setSaveState("error");
    }
  };

  const canSave =
    isAvailable && photoUrl && isValidFormat && !isChecking && saveState === "idle" && !isCompressing;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 0.5, useWebWorker: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setIsCompressing(false);
      };
      reader.readAsDataURL(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setIsCompressing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full px-4 flex flex-col items-center">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-400 rounded-full animate-pulse opacity-35 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400 rounded-full animate-pulse opacity-35 blur-3xl" />

      <div className="w-full max-w-sm space-y-6">
        {/* Image upload (kept same style as original but without absolute overlay) */}
        <div className="flex flex-col items-center">
          {photoUrl ? (
            <div className="relative w-40 h-40">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-full rounded-full object-cover  border-2 border-orange-400 shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-5 bg-amber-500 text-white p-1 rounded-full cursor-pointer hover:bg-teal-600"
              >
                <PiPlusBold className="w-4 h-4" />
              </label>
            </div>
          ) : (
            <label
              htmlFor="avatar-upload"
              className="w-45 h-45 rounded-full border-2 border-dashed dark:border-gray-500 border-gray-400 dark:bg-[#111] pop bg-transparent flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 "
            >
              <PiPlusBold className="text-3xl text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">صورة شخصية</span>
            </label>
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isCompressing}
            className="hidden"
          />
          {isCompressing && <p className="text-orange-400 text-xs mt-2">⏳ يرجي الانتظار قليلا ...</p>}
        </div>

        {/* Username input (border-bottom style like original) */}
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={USERNAME_MAX_LENGTH}
            placeholder="أكتب اسم المستخدم, مثال: Ahmed-Fit1"
            className="w-full bg-transparent border-2 rounded-2xl border-gray-600/40 px-4 py-3 dark:text-white text-slate-900 placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
          />
          {validationError && <p className="text-rose-400 text-sm mt-2">{validationError}</p>}
          {!validationError && isChecking && <p className="text-gray-400 text-sm mt-2">التحقق...</p>}
          {!validationError && isAvailable === true && (
            <p className="text-emerald-400 text-sm mt-2">✓ اسم المستخدم متاح</p>
          )}
          {!validationError && isAvailable === false && (
            <p className="text-rose-400 text-sm mt-2">✗ هذا الاسم مستخدم من قبل</p>
          )}
        </div>

        {/* Email input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني (اختياري)"
            className="w-full bg-transparent border-2 rounded-2xl border-gray-600/40 px-4 py-3 dark:text-white text-slate-900 placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        {/* Save button (no longer absolute) */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-fit p-3 rounded-xl font-semibold transition-all duration-200 ${
            canSave
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/25"
              : "dark:bg-gray-700/50 dark:text-gray-400 bg-gray-300 text-gray-400 cursor-not-allowed"
          } ${saveState === "success" ? "hidden" : ""}`}
        >
          {saveState === "loading" ? "⏳  يرجي الانتظار قليلا..." : "حفظ البيانات"}
        </button>
        {saveState === "error" && <p className="text-rose-400 text-sm text-center">حدث خطأ، حاول مجدداً</p>}
      </div>
    </div>
  );
};

export default CreateAUserName;