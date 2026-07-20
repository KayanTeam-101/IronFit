import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import Loading from "./Components/layouts/Loading";

// Lazy‑loaded page components
const Welcome = lazy(() => import("./Pages/Welcome/Welcome"));
const Home = lazy(() => import("./Pages/home/Home"));
const FoodPage = lazy(() => import("./Pages/food/FoodPage"));
const MakeADiet = lazy(() => import("./Pages/MKDiet/MakeADiet"));
const ExercisePage = lazy(() => import("./Pages/Exersices/Exersice"));
const TemplatesPage = lazy(() => import("./Pages/Templates/TemplatesPage"));
const SocialPage = lazy(() => import("./Pages/SocialPage/Page"));
const Settings = lazy(() => import("./Pages/Settings/settings"));
const Page = lazy(() => import("./Pages/food/History/page"));
const Navbar = lazy(() => import("./Components/layouts/Navbar"));

function App() {
  const isFirstTime: boolean = localStorage.getItem("isFirstTime") === null;

  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [condition, SetCondition] = useState(
    localStorage.length >= 12 && window.location.pathname !== "/MKADiet"
  );

  const location = useLocation(); // needed to update condition on route change

  // Initial load & path guard
  useEffect(() => {
    (function () {
      if (
        (localStorage.length < 12 && window.location.pathname !== "/") ||
        (window.location.pathname !== "/" &&
          !localStorage.getItem("UserName"))
      ) {
        localStorage.clear();
        window.location.href = "/";
      }
    })();

    const handleLoad = () => {
      setIsLoading(false)
    };

    if (document.readyState === "complete") {
      setIsLoading(false)
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  // Detect desktop
  useEffect(() => {
    const checkDeviceType = () => {
      setIsDesktop(window.innerWidth > 868);
    };
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  // Update Navbar visibility on route change
  useEffect(() => {
    SetCondition(
      localStorage.length >= 12 && location.pathname !== "/MKADiet"
    );
  }, [location.pathname]);

  // 1. Initial app loader
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-[#111]">
        <div className="w-1/4">
          <Loading />
        </div>
      </div>
    );
  }

  // 2. Desktop restriction
  if (isDesktop) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-5 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            هذا الموقع مخصص للهواتف فقط
          </h1>
          <p className="text-gray-500 leading-relaxed">
            للحصول على أفضل تجربة استخدام، يرجى فتح هذا الرابط من خلال متصفح
            هاتفك المحمول.
          </p>
        </div>
      </div>
    );
  }

  // 3. Main app with lazy routes and Navbar
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
<div className="w-25">
          <Loading />

</div>
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            localStorage.length < 12 ? (
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
        <Route path="/Chat" element={<SocialPage />} />
        <Route path="/Settings" element={<Settings />} />
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
        <Route
          path="*"
          element={<h1 className="p-5 text-9xl text-rose-600">404</h1>}
        />
      </Routes>

      {condition && <Navbar />}
    </Suspense>
  );
}

export default App;