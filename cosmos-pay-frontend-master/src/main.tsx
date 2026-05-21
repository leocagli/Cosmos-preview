import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { StellarWalletProvider } from "./context/StellarWalletContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <StellarWalletProvider>
        <App />
      </StellarWalletProvider>
    </ThemeProvider>
  </StrictMode>
);
