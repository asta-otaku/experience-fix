import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Bubble from "./Bubble.tsx";
import BubbleSpecial from "./BubbleSpecial.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bubble/:slug" element={<Bubble />} />
        <Route path="/bubble-special/:slug" element={<BubbleSpecial />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
