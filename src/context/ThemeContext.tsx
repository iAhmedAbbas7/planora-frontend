// <== IMPORTS ==>
import { useAuthStore } from "../store/useAuthStore";
import { useAppearance } from "../hooks/useAppearance";
import { ThemeContext, ThemeContextValue } from "./themeContextConfig";
import { useEffect, useMemo, useState, useRef, JSX, ReactNode } from "react";

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
  // REMOVE DARK CLASS
  else root.classList.remove("dark");
}

// <== THEME PROVIDER COMPONENT ==>
export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // AUTH STORE
  const { isAuthenticated } = useAuthStore();
  // APPEARANCE HOOK (ONLY FETCH IF AUTHENTICATED)
  const {
    appearance: backendAppearance,
    isLoading: isLoadingAppearance,
    updateAppearance,
  } = useAppearance(isAuthenticated);
  // DEBOUNCE TIMER REF
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  // LOAD APPEARANCE FROM BACKEND ON AUTHENTICATION
  useEffect(() => {
    // IF AUTHENTICATED AND APPEARANCE LOADED
    if (isAuthenticated && !isLoadingAppearance && backendAppearance) {
      // UPDATE THEME FROM BACKEND
      setTheme(backendAppearance.theme);
      // UPDATE ACCENT COLOR FROM BACKEND
      setAccentColor(backendAppearance.accentColor);
      // UPDATE LOCAL STORAGE AS CACHE
      localStorage.setItem("theme-pref", backendAppearance.theme);
      localStorage.setItem("accent-color", backendAppearance.accentColor);
    }
  }, [isAuthenticated, isLoadingAppearance, backendAppearance]);
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
    // SAVE ACCENT COLOR TO LOCAL STORAGE (CACHE)
    localStorage.setItem("accent-color", accentColor);
    // SYNC TO BACKEND IF AUTHENTICATED (DEBOUNCED)
    if (isAuthenticated) {
      // CLEAR EXISTING TIMER
      if (debounceTimerRef.current) {
        // CLEAR TIMER
        clearTimeout(debounceTimerRef.current);
      }
      // SET NEW TIMER (DEBOUNCE 500MS)
      debounceTimerRef.current = setTimeout(() => {
        updateAppearance({
          accentColor: accentColor as "violet" | "pink" | "blue" | "green",
        }).catch(() => {
          // SILENTLY FAIL - LOCAL STORAGE IS ALREADY UPDATED
        });
      }, 500);
    }
    // CLEANUP TIMER
    return () => {
      if (debounceTimerRef.current) {
        // CLEAR TIMER
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [accentColor, isAuthenticated, updateAppearance]);
  // KEEP CLASS IN SYNC WITH THEME EFFECT
  useEffect(() => {
    // DETERMINE IF DARK MODE
    const isDark =
      theme === "dark" || (theme === "system" && getSystemPrefersDark());
    // APPLY DARK CLASS
    applyClass(isDark);
    // SAVE THEME TO LOCAL STORAGE (CACHE)
    localStorage.setItem("theme-pref", theme);
    // SYNC TO BACKEND IF AUTHENTICATED (DEBOUNCED)
    if (isAuthenticated) {
      // CLEAR EXISTING TIMER
      if (debounceTimerRef.current) {
        // CLEAR TIMER
        clearTimeout(debounceTimerRef.current);
      }
      // SET NEW TIMER (DEBOUNCE 500MS)
      debounceTimerRef.current = setTimeout(() => {
        updateAppearance({ theme }).catch(() => {
          // SILENTLY FAIL - LOCAL STORAGE IS ALREADY UPDATED
        });
      }, 500);
    }
    // CLEANUP TIMER
    return () => {
      if (debounceTimerRef.current) {
        // CLEAR TIMER
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [theme, isAuthenticated, updateAppearance]);
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
