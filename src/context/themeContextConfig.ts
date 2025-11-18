// <== IMPORTS ==>
import { createContext } from "react";

// <== THEME CONTEXT VALUE INTERFACE ==>
export type ThemeContextValue = {
  // <== THEME ==>
  theme: "light" | "dark" | "system";
  // <== SET THEME FUNCTION ==>
  setTheme: (v: "light" | "dark" | "system") => void;
  // <== IS DARK ==>
  isDark: boolean;
  // <== ACCENT COLOR ==>
  accentColor: string;
  // <== SET ACCENT COLOR FUNCTION ==>
  setAccentColor: (v: string) => void;
};

// <== THEME CONTEXT ==>
export const ThemeContext = createContext<ThemeContextValue | null>(null);
