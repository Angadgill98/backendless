import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Router />
    </StrictMode>
  </BrowserRouter>,
);
