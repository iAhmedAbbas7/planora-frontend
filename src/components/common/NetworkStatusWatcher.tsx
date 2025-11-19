// <== IMPORTS ==>
import { useEffect, useState, JSX } from "react";
import { useTheme } from "../../hooks/useTheme";
import { WifiOff, RefreshCcw } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

// <== NETWORK INFORMATION INTERFACE ==>
interface NetworkInformation extends EventTarget {
  // <== EFFECTIVE TYPE ==>
  effectiveType?: string;
  // <== ADD EVENT LISTENER ==>
  addEventListener(type: "change", listener: () => void): void;
  // <== REMOVE EVENT LISTENER ==>
  removeEventListener(type: "change", listener: () => void): void;
}
// <== NAVIGATOR WITH CONNECTION INTERFACE ==>
interface NavigatorWithConnection extends Navigator {
  // <== CONNECTION ==>
  connection?: NetworkInformation;
  // <== MOZ CONNECTION ==>
  mozConnection?: NetworkInformation;
  // <== WEBKIT CONNECTION ==>
  webkitConnection?: NetworkInformation;
}

// <== NETWORK STATUS WATCHER COMPONENT ==>
const NetworkStatusWatcher = (): JSX.Element | null => {
  // IS POOR CONNECTION STATE VARIABLE
  const [isPoor, setIsPoor] = useState<boolean>(false);
  // IS OFFLINE STATE VARIABLE
  const [isOffline, setIsOffline] = useState<boolean>(false);
  // THEME HOOK TO DETERMINE THEME
  const { isDark } = useTheme();
  // AUTH STORE TO CHECK IF USER IS AUTHENTICATED
  const { isAuthenticated } = useAuthStore();
  // DETERMINE BUTTON COLOR BASED ON USER AUTHENTICATION STATUS
  const buttonColor = isAuthenticated
    ? "bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)]"
    : "bg-violet-500 hover:bg-violet-600";
  // DETERMINE OFFLINE ICON BACKGROUND COLOR BASED ON THEME
  const offlineIconBg = isDark ? "bg-orange-900/30" : "bg-orange-100";
  // DETERMINE OFFLINE ICON COLOR BASED ON THEME
  const offlineIconColor = isDark ? "text-orange-400" : "text-orange-600";
  // DETERMINE POOR CONNECTION ICON BACKGROUND COLOR BASED ON THEME
  const poorIconBg = isDark ? "bg-yellow-900/30" : "bg-yellow-100";
  // DETERMINE POOR CONNECTION ICON COLOR BASED ON THEME
  const poorIconColor = isDark ? "text-yellow-400" : "text-yellow-600";
  // PREVENT BODY SCROLL WHEN OFFLINE OR POOR CONNECTION MODAL IS VISIBLE
  useEffect(() => {
    // IF OFFLINE OR POOR CONNECTION MODAL IS VISIBLE, PREVENT BODY SCROLL
    if (isOffline || isPoor) {
      // SAVE CURRENT OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // SET BODY OVERFLOW TO HIDDEN
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN OFFLINE OR POOR CONNECTION MODAL HIDES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOffline, isPoor]);
  // CONNECTIVITY CHECKING
  useEffect(() => {
    // CHECKING FOR POOR CONNECTION VIA NETWORK CONNECTION API
    const nav = navigator as NavigatorWithConnection;
    // GET CONNECTION INFORMATION
    const connection: NetworkInformation | undefined =
      nav.connection || nav.mozConnection || nav.webkitConnection;
    // INITIAL CONNECTION STATUS CHECK
    if (!navigator.onLine) {
      // SET OFFLINE STATE TO TRUE
      setIsOffline(true);
      // LOG OFFLINE STATUS
      console.log("Offline!");
    }
    // INITIAL CONNECTION QUALITY CHECK
    if (connection && connection.effectiveType) {
      // GET SLOW CONNECTION TYPES
      const slowTypes = ["slow-2g", "2g"];
      // SET POOR CONNECTION STATE TO TRUE IF CONNECTION IS SLOW
      setIsPoor(slowTypes.includes(connection.effectiveType));
    }
    // HANDLING OFFLINE STATUS
    const handleOffline = (): void => {
      // SET OFFLINE STATE TO TRUE
      setIsOffline(true);
      // LOG OFFLINE STATUS
      console.log("Offline!");
    };
    // HANDLING ONLINE STATUS
    const handleOnline = (): void => {
      // SET OFFLINE STATE TO FALSE
      setIsOffline(false);
      // SET POOR CONNECTION STATE TO FALSE
      setIsPoor(false);
      // LOG ONLINE STATUS
      console.log("Online!");
    };
    // HANDLING QUALITY CHANGES (FOR POOR CONNECTION)
    let updateQuality: (() => void) | undefined;
    // IF CONNECTION EXISTS, UPDATE QUALITY
    if (connection) {
      // UPDATE QUALITY FUNCTION
      updateQuality = (): void => {
        // GET SLOW CONNECTION TYPES
        const slowTypes = ["slow-2g", "2g"];
        // SET POOR CONNECTION STATE TO TRUE IF CONNECTION IS SLOW
        setIsPoor(slowTypes.includes(connection.effectiveType ?? ""));
      };
      // ADD EVENT LISTENER FOR QUALITY CHANGES
      connection.addEventListener("change", updateQuality);
      // UPDATE QUALITY IMMEDIATELY
      updateQuality();
    }
    // ADD EVENT LISTENER FOR OFFLINE STATUS
    window.addEventListener("offline", handleOffline);
    // ADD EVENT LISTENER FOR ONLINE STATUS
    window.addEventListener("online", handleOnline);
    // CLEANUP: REMOVE EVENT LISTENERS FOR OFFLINE AND ONLINE STATUS
    return () => {
      // REMOVE EVENT LISTENER FOR OFFLINE STATUS
      window.removeEventListener("offline", handleOffline);
      // REMOVE EVENT LISTENER FOR ONLINE STATUS
      window.removeEventListener("online", handleOnline);
      // REMOVE EVENT LISTENER FOR QUALITY CHANGES IF APPLICABLE
      if (connection && updateQuality) {
        // REMOVE EVENT LISTENER FOR QUALITY CHANGES
        connection.removeEventListener("change", updateQuality);
      }
    };
  }, []);
  // IF CONNECTION IS FINE, RENDER NOTHING
  if (!isOffline && !isPoor) return null;
  // IF OFFLINE, RENDER OFFLINE DIALOG
  if (isOffline) {
    return (
      // MODAL OVERLAY (NON-DISMISSIBLE)
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        {/* MODAL CONTAINER */}
        <div className="bg-[var(--cards-bg)] rounded-2xl shadow-2xl p-8 max-w-md w-[90%] mx-4 border border-[var(--border)]">
          {/* MODAL CONTENT */}
          <div className="text-center">
            {/* OFFLINE ICON */}
            <div
              className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${offlineIconBg} mb-4`}
            >
              <WifiOff
                className={`h-8 w-8 ${offlineIconColor}`}
                strokeWidth={2.5}
              />
            </div>
            {/* TITLE */}
            <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-2">
              You&apos;re Offline
            </h2>
            {/* MESSAGE */}
            <p className="text-[var(--light-text)] mb-6">
              Your Internet Connection appears to be Offline
            </p>
            {/* RELOAD BUTTON */}
            <button
              onClick={() => window.location.reload()}
              type="button"
              className={`w-full px-6 py-3 ${buttonColor} text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2`}
            >
              {/* REFRESH ICON */}
              <RefreshCcw className="h-5 w-5" strokeWidth={2.5} />
              {/* BUTTON TEXT */}
              <span>Reload</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // POOR CONNECTION DIALOG
  if (isPoor) {
    return (
      // MODAL OVERLAY (NON-DISMISSIBLE)
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        {/* MODAL CONTAINER */}
        <div className="bg-[var(--cards-bg)] rounded-2xl shadow-2xl p-8 max-w-md w-[90%] mx-4 border border-[var(--border)]">
          {/* MODAL CONTENT */}
          <div className="text-center">
            {/* POOR CONNECTION ICON */}
            <div
              className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${poorIconBg} mb-4`}
            >
              <WifiOff
                className={`h-8 w-8 ${poorIconColor}`}
                strokeWidth={2.5}
              />
            </div>
            {/* TITLE */}
            <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-2">
              Poor Connection
            </h2>
            {/* MESSAGE */}
            <p className="text-[var(--light-text)] mb-6">
              Your Internet Connection appears to be very Slow
            </p>
            {/* RELOAD BUTTON */}
            <button
              onClick={() => window.location.reload()}
              type="button"
              className={`w-full px-6 py-3 ${buttonColor} text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2`}
            >
              {/* REFRESH ICON */}
              <RefreshCcw className="h-5 w-5" strokeWidth={2.5} />
              {/* BUTTON TEXT */}
              <span>Reload</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFENSIVE RETURN
  return null;
};

export default NetworkStatusWatcher;
