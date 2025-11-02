import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GameHistoryProvider } from "./GameHistoryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameHistoryProvider>
      <App />
    </GameHistoryProvider>
  </StrictMode>
);
