// <== IMPORTS ==>
import "./index.css";
import React from "react";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";

// <== SELECTING THE ROOT ELEMENT ==>
const rootElement = document.getElementById("root") as HTMLDivElement;

// <== CREATING THE ROOT ELEMENT ==>
const root = createRoot(rootElement);

// <== RENDERING THE APP ==>
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
