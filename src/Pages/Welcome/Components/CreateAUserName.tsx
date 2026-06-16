import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebase/main";
import { SetUser } from "../../../firebase/user";
import { BiSave } from "react-icons/bi";

const USERNAME_MIN_LENGTH = 6;
const USERNAME_MAX_LENGTH = 14;

const getValidationError = (username: string): string | null => {
  const trimmed = username.trim();
  if (!trimmed) return null;

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return `اسم المستخدم يجب أن يكون مكون من ${USERNAME_MIN_LENGTH} أحرف علي الأقل`;
  }
  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return `اسم المستخدم يجب أن يكون أقل من  ${USERNAME_MAX_LENGTH} أحرف`;
  }
  if (!/\d/.test(trimmed)) {
    return `يجب إضافة أرقام إلى اسم المستخدم مثال  Ahmed-777 `;
  }
  return null;
};

const CreateAUserName = () => {
  const [text, setText] = useState(localStorage.getItem('UserName') || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); // NEW: tracks save lifecycle

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
    } catch (error) {
      console.error("Error checking username:", error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsername(text.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [text, checkUsername]);

  const handleSave = async () => {
    // Prevent clicking if conditions aren't met or already saving/done
    if (!isAvailable || !isValidFormat || saveState !== "idle") return;

    setSaveState("loading"); // disable button immediately
    try {
      await SetUser(text.trim(), "null", "null");
      setSaveState("success"); // green button on success
      localStorage.setItem('UserName',text.trim());
    } catch (error) {
      console.error("Failed to save user:", error);
      setSaveState("error"); // stays disabled, but not green

    }
  };

  // Button is clickable only when idle AND all other conditions are met
  const canSave = isAvailable && isValidFormat && !isChecking && saveState === "idle";

  return (
    <div className="w-11/12 h-screen flex justify-center flex-col">
      <div className="relative w-full h-26 top-10">
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          maxLength={USERNAME_MAX_LENGTH}
          autoFocus
          placeholder="أكتب اسم المستخدم, مثال: Ahmed-Fit1"
          className={`border-2 border-gray-600/40 outline-none p-4 px-5 rounded-2xl w-full text-md dark:text-white ${saveState === "success" ? "border-teal-900/40 bg-green-700/15 text-green-600" : ''}`}
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

        {/* Optional: show error if save failed */}
        {saveState === "error" && (
          <p className="text-rose-500 mt-2">حدث خطأ أثناء الحفظ. حاول مجددًا.</p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`relative h-16 top-10 border-2 border-gray-600/40 outline-none p-4 px-5 rounded-2xl w-full text-md dark:text-white flex items-center justify-center gap-2 transition-colors
          ${!canSave ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
          ${saveState === "success" ? "bg-green-600 text-white border-green-600" : ""}
        `}
      >
        {saveState === "success" ? <div>تم الحفظ :{localStorage.getItem('UserName')}</div> : "Save"}
        {/* <BiSave className="mb-2" /> */}
      </button>
    </div>
  );
};

export default CreateAUserName;