import "./styles/index.css";
import { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.jsx";
import MainAuthentication from "./pages/authentication/page.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth/:page" element={<MainAuthentication />} />
        </Routes>
      </Router>
    </Theme>
  </StrictMode>
);
