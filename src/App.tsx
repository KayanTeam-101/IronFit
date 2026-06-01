import Navbar from "./Components/layouts/Navbar";
import Exersice from "./Pages/Exersices/Exersice";
import FoodPage from "./Pages/food/FoodPage";
import Page from "./Pages/food/History/page";
import Home from "./Pages/home/Home";
import MakeADiet from "./Pages/MKDiet/MakeADiet";
import Welcome from "./Pages/Welcome/Welcome";

import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ExercisePage from "./Pages/Exersices/Exersice";
import StatusPage from "./Pages/StatusPage/StatusPage";
import Settings from "./Pages/Settings/settings";
import TemplatesPage from "./Pages/Templates/TemplatesPage";

function App() {
  const isFirstTime: boolean = localStorage.getItem("isFirstTime") === null;

  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false); // 1. حالة جديدة لاكتشاف الحاسوب

  useEffect(() => {
    // التحقق من التحميل
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // 2. فحص حجم الشاشة لمعرفة ما إذا كان المستخدم على حاسوب
  useEffect(() => {
    const checkDeviceType = () => {
      // إذا كان عرض الشاشة أكبر من 768 بكسل (أجهزة التابلت والكمبيوتر)
      if (window.innerWidth > 768) {
        setIsDesktop(true);
      } else {
        setIsDesktop(false);
      }
    };

    // الفحص عند أول تحميل
    checkDeviceType();

    // الفحص في حال قام المستخدم بتغيير حجم نافذة المتصفح
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  // 3. شاشة التحميل
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white">
        <p className="text-2xl font-bold text-gray-800">Loading...</p>
      </div>
    );
  }

  // 4. إذا كان المستخدم يفتح من حاسوب، نظهر له هذه الشاشة بدلاً من التطبيق
  if (isDesktop) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-5 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md border border-gray-100">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            هذا الموقع مخصص للهواتف فقط
          </h1>
          <p className="text-gray-500 leading-relaxed">
            للحصول على أفضل تجربة استخدام، يرجى فتح هذا الرابط من خلال متصفح هاتفك المحمول.
          </p>
        </div>
      </div>
    );
  }

  // 5. إذا كان من الهاتف، يتم عرض التطبيق بشكل طبيعي
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isFirstTime ? (
              <Welcome />
            ) : (
              <Navigate to="/me/home" replace />
            )
          }
        />

        <Route path="/me/home" element={<Home />} />
        <Route path="/me/food" element={<FoodPage />} />
        <Route path="/mkAdiet" element={<MakeADiet />} />
        <Route path="/me/exercises" element={<ExercisePage />} />
        <Route path="/Templates" element={<TemplatesPage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route
          path="*"
          element={<h1 className="p-5">Coming SOOOOOOOOON إن شاء الله</h1>}
        />

        <Route
          path="/me/history"
          element={
            localStorage.getItem("History") ? (
              <Page />
            ) : (
              <Navigate to="/me/home" replace />
            )
          }
        />
      </Routes>

      {!isFirstTime && window.location.pathname !== "/MkADiet" && <Navbar />}
    </>
  );
}

export default App;