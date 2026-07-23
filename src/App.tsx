import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import Loading from "./Components/layouts/Loading";
import { getUser } from "./Pages/Settings/settings";

// Eagerly loaded – always needed
import Welcome from "./Pages/Welcome/Welcome";
import Navbar from "./Components/layouts/Navbar";   // ← eager, avoids extra Suspense

// Lazy‑loaded page components (code‑split at route level)
const Home = lazy(() => import("./Pages/home/Home"));
const FoodPage = lazy(() => import("./Pages/food/FoodPage"));
const MakeADiet = lazy(() => import("./Pages/MKDiet/MakeADiet"));
const ExercisePage = lazy(() => import("./Pages/Exersices/Exersice"));
const TemplatesPage = lazy(() => import("./Pages/Templates/TemplatesPage"));
const SocialPage = lazy(() => import("./Pages/SocialPage/Page"));
const Settings = lazy(() => import("./Pages/Settings/settings"));
const Page = lazy(() => import("./Pages/food/History/page"));

// ---------- helpers ----------
const isAuthenticated = () =>
  localStorage.length >= 12 && !!localStorage.getItem("UserName");

// Protected route wrapper – clears storage and redirects if not logged in
function RequireAuth() {
  if (!isAuthenticated()) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

// ---------- App ----------
function App() {
  // Avoid flash on desktop: initialize with actual value
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 868);
  const location = useLocation();

  // Keep desktop state updated
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 868);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Store subscription data once on mount
 // useEffect(() => {
   // try {
     // const user = getUser;          // call the function
    //  localStorage.setItem(
      //  "foods____",
      //  btoa(JSON.stringify({ SubscriptionPeriod: user?.SubscriptionPeriod }))
     // );
   // } catch {
      // silently ignore
   // }
  //}, []);

  // Navbar shown on all authenticated pages except /mkAdiet
  const showNavbar = isAuthenticated() && location.pathname !== "/mkAdiet";

  // ---------- Desktop guard ----------
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

  // ---------- Main app ----------
  return (
    <>
      {/* Suspense only wraps the route content – Navbar stays visible */}
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
          {/* Landing / login */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/me/home" replace />
              ) : (
                <Welcome />
              )
            }
          />

          {/* All routes that require authentication */}
          <Route element={<RequireAuth />}>
            <Route path="/me/home" element={<Home />} />
            <Route path="/me/food" element={<FoodPage />} />
            <Route path="/me/exercises" element={<ExercisePage />} />
            <Route path="/Chat" element={<SocialPage />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Templates" element={<TemplatesPage />} />
            <Route path="/mkAdiet" element={<MakeADiet />} />
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
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={<h1 className="p-5 text-9xl text-rose-600">404</h1>}
          />
        </Routes>
      </Suspense>

      {/* Navbar rendered outside Suspense → never disappears on route change */}
      {showNavbar && <Navbar />}
    </>
  );
}

export default App;