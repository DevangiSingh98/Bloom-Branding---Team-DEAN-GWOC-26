import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("React version:", React.version);

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  console.error("Failed to find the root element. Make sure you have a <div id=\"root\"></div> in your HTML.");
} else {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
