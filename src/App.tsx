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

function App() {
  const isFirstTime: boolean =
    localStorage.getItem("isFirstTime") === null;

  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const handleLoad = () => {
    setIsLoading(false);
  };

  // If page already loaded
  if (document.readyState === "complete") {
    setIsLoading(false);
  } else {
    window.addEventListener("load", handleLoad);
  }

  return () => {
    window.removeEventListener("load", handleLoad);
  };
}, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white">
        <p className="text-2xl font-bold text-gray-800">
          Loading...
        </p>
      </div>
    );
  }

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
        <Route path="/exercises" element={<ExercisePage  />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />

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

      {!isFirstTime && window.location.pathname != '/MkADiet' && <Navbar />}
    </>
  );
}

export default App;