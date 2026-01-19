import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DarkModeProvider from "./providers/ModeProvider";
import App from "./App";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element (#root) not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>,
);
