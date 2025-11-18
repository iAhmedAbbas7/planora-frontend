// <== IMPORTS ==>
import { useContext } from "react";
import { ThemeContext, ThemeContextValue } from "../context/themeContextConfig";

// <== USE THEME HOOK ==>
export function useTheme(): ThemeContextValue {
  // GET CONTEXT
  const ctx = useContext(ThemeContext);
  // THROW ERROR IF NOT WITHIN PROVIDER
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  // RETURN CONTEXT
  return ctx;
}

