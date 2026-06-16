import "./index.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { registerSW } from 'virtual:pwa-register'
import { Analytics } from "@vercel/analytics/react";

 

registerSW()
ReactDOM.createRoot(document.getElementById("root")!).render(
<div className="w-screen min-h-screen bg-gray-100 dark:bg-[#111111]">
    <BrowserRouter>
    <App />
  </BrowserRouter>
  <Analytics />
</div>
);