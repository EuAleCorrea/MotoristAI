import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class"> {/* Adicionando attribute="class" explicitamente */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);