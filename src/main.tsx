// src/main.tsx
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";

// Register our hand-written service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')   // this file is in public/
      .catch(err => console.error('SW registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="w-screen min-h-screen bg-gray-100 dark:bg-[#111111]">
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </div>
);