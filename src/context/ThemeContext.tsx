// <== IMPORTS ==>
import { useEffect, useMemo, useState, JSX, ReactNode } from "react";
import { ThemeContext, ThemeContextValue } from "./themeContextConfig";

// <== THEME TYPE ==>
type Theme = "light" | "dark" | "system";
// <== GET SYSTEM PREFERS DARK FUNCTION ==>
function getSystemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}
// <== APPLY CLASS FUNCTION ==>
function applyClass(isDark: boolean): void {
  // GET ROOT ELEMENT
  const root = document.documentElement;
  // ADD OR REMOVE DARK CLASS
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

// <== THEME PROVIDER COMPONENT ==>
export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // THEME STATE
  const [theme, setTheme] = useState<Theme>(() => {
    // GET SAVED THEME FROM LOCAL STORAGE
    const saved = localStorage.getItem("theme-pref") as Theme | null;
    // RETURN SAVED THEME OR DEFAULT TO SYSTEM
    return saved ?? "system";
  });
  // ACCENT COLOR STATE
  const [accentColor, setAccentColor] = useState(() => {
    // GET SAVED ACCENT COLOR FROM LOCAL STORAGE
    return localStorage.getItem("accent-color") || "violet";
  });
  // APPLY ACCENT COLOR AS CSS VARIABLES EFFECT
  useEffect(() => {
    // SET ACCENT COLOR CSS VARIABLES
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${accentColor}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${accentColor}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${accentColor}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${accentColor}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${accentColor}-700)`
    );
    // SAVE ACCENT COLOR TO LOCAL STORAGE
    localStorage.setItem("accent-color", accentColor);
  }, [accentColor]);
  // KEEP CLASS IN SYNC WITH THEME EFFECT
  useEffect(() => {
    // DETERMINE IF DARK MODE
    const isDark =
      theme === "dark" || (theme === "system" && getSystemPrefersDark());
    // APPLY DARK CLASS
    applyClass(isDark);
    // SAVE THEME TO LOCAL STORAGE
    localStorage.setItem("theme-pref", theme);
  }, [theme]);
  // REACT TO OS CHANGES WHEN ON SYSTEM EFFECT
  useEffect(() => {
    // RETURN IF NOT SYSTEM THEME
    if (theme !== "system") return;
    // GET MEDIA QUERY
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // HANDLER FUNCTION
    const handler = () => applyClass(mq.matches);
    // ADD EVENT LISTENER
    mq.addEventListener?.("change", handler);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => mq.removeEventListener?.("change", handler);
  }, [theme]);
  // MEMOIZED CONTEXT VALUE
  const value = useMemo<ThemeContextValue>(() => {
    // DETERMINE IF DARK MODE
    const isDark =
      theme === "dark" || (theme === "system" && getSystemPrefersDark());
    // RETURN CONTEXT VALUE
    return { theme, setTheme, isDark, accentColor, setAccentColor };
  }, [theme, accentColor]);
  // RETURNING THE THEME PROVIDER
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
