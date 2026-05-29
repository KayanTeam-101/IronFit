import "./index.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { registerSW } from 'virtual:pwa-register'

 

registerSW()
ReactDOM.createRoot(document.getElementById("root")!).render(
<div className="w-screen min-h-screen bg-white dark:bg-gray-950">
    <BrowserRouter>
    <App />
  </BrowserRouter>
</div>
);