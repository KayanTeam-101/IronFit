import React, { useState, useEffect } from "react";
import { FaSave, FaDownload, FaWeight, FaRulerVertical, FaCalendarAlt, FaBullseye } from "react-icons/fa";

const Settings = () => {
  // Load initial values from localStorage
  const [currentWeight, setCurrentWeight] = useState(
    () => localStorage.getItem("currentWeight") || ""
  );
  const [targetWeight, setTargetWeight] = useState(
    () => localStorage.getItem("targetWeight") || ""
  );
  const [age, setAge] = useState(
    () => localStorage.getItem("age") || ""
  );
  const [height, setHeight] = useState(
    () => localStorage.getItem("height") || ""
  );
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    // Save all four values to localStorage
    if (currentWeight.trim() !== "") localStorage.setItem("currentWeight", currentWeight);
    if (targetWeight.trim() !== "") localStorage.setItem("targetWeight", targetWeight);
    if (age.trim() !== "") localStorage.setItem("age", age);
    if (height.trim() !== "") localStorage.setItem("height", height);

    // Show success message briefly
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const downloadAllData = () => {
    // Gather all localStorage keys into an object
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || "";
      }
    }

    // Create a Blob and trigger download
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-health-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cardStyle =
    "bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 shadow-sm rounded-3xl p-5 backdrop-blur-md";

  const inputStyle ="";
    // "w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-5 font-arabic">
      {/* Decorative blur */}
      <div className="absolute top-10 left-0 w-full h-[400px] opacity-35 blur-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300 dark:from-sky-600 dark:via-indigo-600 dark:to-teal-600 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}

        {/* Form Card */}
        <div className={`${cardStyle} mb-6`}>
          <div className="space-y-5">
            {/* Current Weight */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaWeight className="text-sky-500" /> الوزن الحالي (كجم)
              </label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="مثال: 65"
                className={inputStyle}
              />
            </div>

            {/* Target Weight */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaBullseye className="text-rose-500" /> الوزن المستهدف (كجم)
              </label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="مثال: 60"
                className={inputStyle}
              />
            </div>

            {/* Height */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaRulerVertical className="text-indigo-500" /> الطول (سم)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="مثال: 170"
                className={inputStyle}
              />
            </div>

            {/* Age */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="text-amber-500" /> العمر
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="مثال: 25"
                className={inputStyle}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <FaSave /> حفظ التعديلات
            </button>

            {savedMessage && (
              <p className="text-center text-sm text-green-600 dark:text-green-400 animate-pulse">
                ✅ تم الحفظ بنجاح
              </p>
            )}
          </div>
        </div>

        {/* Download Card */}
        <div className={`${cardStyle} text-center`}>
          <h2 className="text-lg font-bold text-sky-800 dark:text-white mb-3 flex items-center justify-center gap-2">
            <FaDownload className="text-indigo-500" /> تصدير البيانات
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            قم بتنزيل جميع بياناتك المحفوظة  
          </p>
          <button
            onClick={downloadAllData}
            className="w-full sm:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <FaDownload /> تحميل JSON File 
          </button>
        </div>
      </div>
      <div className="relative top-10 w-screen h-fit flex flex-row text-gray-400 dark:text-white/50">
            <p>الإصدار : <span>Beta v2.0.0</span></p>
      </div>
    </div>
  );
};

export default Settings;