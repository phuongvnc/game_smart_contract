import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ResetCSS } from "@pancakeswap-libs/uikit";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeContextProvider } from "./Provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
      <ResetCSS />
    </ThemeContextProvider>
  </StrictMode>
);

reportWebVitals();
