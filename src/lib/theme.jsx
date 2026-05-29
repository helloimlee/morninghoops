import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("morning-hoops-theme");
    if (stored) return stored === "dark";
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return false;
    return true;
  });

  useEffect(() => {
    localStorage.setItem("morning-hoops-theme", dark ? "dark" : "light");
    const metaThemeColor = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const color = dark ? '#09090B' : '#F7F6F3';
    if (metaThemeColor) metaThemeColor.setAttribute('content', color);
    if (metaThemeColorLight) metaThemeColorLight.setAttribute('content', color);
    
    // Update body background to prevent flashes
    document.documentElement.style.backgroundColor = dark ? "#09090B" : "#F7F6F3";
  }, [dark]);

  const t = {
    bg: dark ? "#09090B" : "#F7F6F3",
    card: dark ? "#16161A" : "#FFFFFF",
    inset: dark ? "#0D0D0F" : "#EDECEB",
    border: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)",
    text: dark ? "#EDEDEF" : "#1A1A1A",
    t2: dark ? "#A1A1AA" : "#6B7280",
    t3: dark ? "#7E7E87" : "#9CA3AF",
    accent: "#EF6234",
    blue: dark ? "#5B8DEF" : "#3B6BF5",
    white: dark ? "#B4BCD0" : "#64748B",
    green: "#34D399",
    gold: "#FBBF24",
    red: "#F87171",
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
