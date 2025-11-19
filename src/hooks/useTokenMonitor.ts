// <== IMPORTS ==>
import apiClient from "../lib/axios";
import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { AxiosError } from "axios";

// <== TOKEN MONITOR HOOK ==>
export const useTokenMonitor = (): void => {
  // AUTH STORE
  const { isAuthenticated, setSessionExpired, user } = useAuthStore();
  // INTERVAL REFERENCE (RETURNS NUMBER IN BROWSER ENVIRONMENT)
  const intervalRef = useRef<number | null>(null);
  // LAST CHECK TIME REFERENCE (TO PREVENT RAPID CHECKS)
  const lastCheckRef = useRef<number>(0);
  // IS CHECKING FLAG (TO PREVENT CONCURRENT CHECKS)
  const isCheckingRef = useRef<boolean>(false);
  // CHECK TOKEN FUNCTION (MEMOIZED WITH useCallback)
  const checkTokens = useCallback(async (): Promise<void> => {
    // IF NOT AUTHENTICATED, DON'T CHECK
    if (!isAuthenticated || !user) {
      return;
    }
    // PREVENT CONCURRENT CHECKS
    if (isCheckingRef.current) {
      return;
    }
    // GET CURRENT TIME
    const now = Date.now();
    // PREVENT RAPID CHECKS (MINIMUM 30 SECONDS BETWEEN CHECKS)
    if (now - lastCheckRef.current < 30000) {
      return;
    }
    // UPDATE LAST CHECK TIME
    lastCheckRef.current = now;
    // SET CHECKING FLAG
    isCheckingRef.current = true;
    // TRY TO REFRESH TOKEN PROACTIVELY
    try {
      // CALL REFRESH TOKEN ENDPOINT
      await apiClient.post("/auth/refresh");
      // TOKEN REFRESHED SUCCESSFULLY - TOKENS ARE VALID
    } catch (error) {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // IF REFRESH FAILS, CHECK IF BOTH TOKENS ARE MISSING
      const errorMessage = axiosError.response?.data?.message || "";
      // GET STATUS CODE
      const status = axiosError.response?.status;
      // IF REFRESH TOKEN IS MISSING OR INVALID, SESSION IS EXPIRED
      if (
        status === 401 &&
        (errorMessage.includes("Refresh token not found") ||
          errorMessage.includes("Invalid or expired refresh token") ||
          errorMessage.includes("Refresh token not found or expired"))
      ) {
        // SET SESSION EXPIRED TO TRUE
        setSessionExpired(true);
        // CLEAR INTERVAL
        if (intervalRef.current) {
          // CLEAR INTERVAL
          clearInterval(intervalRef.current);
          // SET INTERVAL TO NULL
          intervalRef.current = null;
        }
      }
    } finally {
      // SET CHECKING FLAG TO FALSE
      isCheckingRef.current = false;
    }
  }, [isAuthenticated, user, setSessionExpired]);
  // TOKEN MONITORING EFFECT
  useEffect(() => {
    // IF NOT AUTHENTICATED, DON'T MONITOR
    if (!isAuthenticated || !user) {
      // CLEAR INTERVAL IF EXISTS
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // RUN IMMEDIATE CHECK
    void checkTokens();
    // RUN PERIODIC CHECK AFTER 30 SECONDS (TO AVOID RAPID CHECKS)
    const initialTimeout = setTimeout(() => {
      // RUN PERIODIC CHECK
      void checkTokens();
    }, 30000);

    // SET UP INTERVAL TO CHECK EVERY MINUTE (60000ms)
    intervalRef.current = setInterval(() => {
      // RUN PERIODIC CHECK
      void checkTokens();
    }, 60000);
    // CHECK ON WINDOW FOCUS (USER RETURNS TO TAB)
    const handleFocus = (): void => {
      // CHECK TOKENS WHEN USER RETURNS TO TAB
      void checkTokens();
    };
    // CHECK ON VISIBILITY CHANGE (TAB BECOMES VISIBLE)
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        // CHECK TOKENS WHEN TAB BECOMES VISIBLE
        void checkTokens();
      }
    };
    // ADD EVENT LISTENERS
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // CLEANUP FUNCTION
    return () => {
      // CLEAR INITIAL TIMEOUT
      clearTimeout(initialTimeout);
      // CLEAR INTERVAL
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // REMOVE EVENT LISTENERS
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, user, setSessionExpired, checkTokens]);
};
