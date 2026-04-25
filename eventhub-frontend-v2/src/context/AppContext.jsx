import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "../i18n/translations";

const AppContext = createContext(null);


export function AppProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem("eh-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("eh-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ── Language ───────────────────────────────────────────────────────────────
  const [lang, setLang] = useState(() => localStorage.getItem("eh-lang") || "fr");
  const t = useCallback((path) => {
    const keys = path.split(".");
    let val = translations[lang];
    for (const k of keys) val = val?.[k];
    return val || path;
  }, [lang]);

  const toggleLang = () => {
    const next = lang === "fr" ? "en" : "fr";
    setLang(next);
    localStorage.setItem("eh-lang", next);
  };

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("eh-user")); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("eh-token") || null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("eh-user", JSON.stringify(userData));
    localStorage.setItem("eh-token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eh-user");
    localStorage.removeItem("eh-token");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t, user, token, login, logout, isAdmin }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
// export const useApp = () => {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error("useApp must be used within AppProvider");
//   return ctx;
// };
