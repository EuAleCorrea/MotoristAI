import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider"; // Importando o ThemeProvider

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> {/* Adicionando ThemeProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);