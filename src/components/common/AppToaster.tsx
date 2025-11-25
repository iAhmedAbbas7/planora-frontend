// <== IMPORTS ==>
import { JSX } from "react";
import { Toaster } from "sonner";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/useAuthStore";

// <== APP TOASTER COMPONENT ==>
const AppToaster = (): JSX.Element => {
  // AUTH STORE
  const { isAuthenticated } = useAuthStore();
  // THEME HOOK
  const { isDark } = useTheme();
  // DETERMINE TOASTER THEME
  const toasterTheme = isAuthenticated ? (isDark ? "dark" : "light") : "light";
  // RETURNING THE TOASTER COMPONENT
  return (
    <Toaster
      position="top-right"
      richColors={false}
      theme={toasterTheme}
      expand={true}
      closeButton={false}
      toastOptions={{
        classNames: {
          toast: isAuthenticated ? "toast-authenticated" : "toast-public",
          success: isAuthenticated
            ? "toast-success-authenticated"
            : "toast-success-public",
          error: "toast-error",
          info: "toast-info",
          warning: "toast-warning",
          icon: "toast-icon",
        },
      }}
    />
  );
};

export default AppToaster;
