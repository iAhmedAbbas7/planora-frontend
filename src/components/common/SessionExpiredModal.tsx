// <== IMPORTS ==>
import { useEffect, JSX } from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/useAuthStore";

// <== SESSION EXPIRED MODAL COMPONENT ==>
const SessionExpiredModal = (): JSX.Element => {
  // AUTH STORE TO CHECK IF SESSION IS EXPIRED
  const { isSessionExpired, setSessionExpired } = useAuthStore();
  // THEME HOOK TO DETERMINE THEME
  const { isDark } = useTheme();
  // LOGOUT MUTATION TO LOGOUT USER
  const logoutMutation = useLogout();
  // DETERMINE BUTTON COLOR BASED ON THEME
  const buttonColor =
    "bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)]";
  // DETERMINE ICON BACKGROUND COLOR BASED ON THEME
  const iconBg = isDark ? "bg-red-900/30" : "bg-red-100";
  // DETERMINE ICON COLOR BASED ON THEME
  const iconColor = isDark ? "text-red-400" : "text-red-600";
  // HANDLE LOGOUT FUNCTION
  const handleLogout = (): void => {
    // SET SESSION EXPIRED TO FALSE
    setSessionExpired(false);
    // CALL LOGOUT MUTATION TO LOGOUT USER
    logoutMutation.mutate();
  };
  // PREVENT BODY SCROLL WHEN SESSION EXPIRED MODAL IS VISIBLE
  useEffect(() => {
    // IF SESSION EXPIRED MODAL IS VISIBLE, PREVENT BODY SCROLL
    if (isSessionExpired) {
      // SAVE CURRENT OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // SET BODY OVERFLOW TO HIDDEN
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN SESSION EXPIRED MODAL HIDES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isSessionExpired]);
  // LISTEN FOR SESSION EXPIRED EVENT TO SET SESSION EXPIRED TO TRUE
  useEffect(() => {
    // HANDLE SESSION EXPIRED EVENT
    const handleSessionExpired = (): void => {
      // SET SESSION EXPIRED TO TRUE
      setSessionExpired(true);
    };
    // ADD EVENT LISTENER FOR SESSION EXPIRED EVENT
    window.addEventListener("session-expired", handleSessionExpired);
    // CLEANUP: REMOVE EVENT LISTENER FOR SESSION EXPIRED EVENT
    return () => {
      // REMOVE EVENT LISTENER FOR SESSION EXPIRED EVENT
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, [setSessionExpired]);
  // IF SESSION NOT EXPIRED, RETURN NULL
  if (!isSessionExpired) return <></>;
  // IF SESSION EXPIRED, RENDER SESSION EXPIRED MODAL
  return (
    // MODAL OVERLAY (NON-DISMISSIBLE)
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* MODAL CONTAINER */}
      <div className="bg-[var(--cards-bg)] rounded-2xl shadow-2xl p-8 max-w-md w-[90%] mx-4 border border-[var(--border)]">
        {/* MODAL CONTENT */}
        <div className="text-center">
          {/* WARNING ICON */}
          <div
            className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${iconBg} mb-4`}
          >
            <LogOut className={`h-8 w-8 ${iconColor}`} strokeWidth={2.5} />
          </div>
          {/* TITLE */}
          <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-2">
            Session Expired
          </h2>
          {/* MESSAGE */}
          <p className="text-[var(--light-text)] mb-6">
            Your session has expired. Please log in again to continue.
          </p>
          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className={`w-full px-6 py-3 ${buttonColor} text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2`}
          >
            {/* LOGOUT ICON */}
            <LogOut className="h-5 w-5" strokeWidth={2.5} />
            {/* BUTTON TEXT */}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
