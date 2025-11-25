// <== IMPORTS ==>
import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useCallback } from "react";

// <== CONSTANTS ==>
// ACCESS TOKEN EXPIRY TIME (15 MINUTES IN MILLISECONDS)
const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
// REFRESH THRESHOLD (1 MINUTE BEFORE EXPIRY)
const REFRESH_THRESHOLD_MS = 1 * 60 * 1000;
// LOCAL STORAGE KEY FOR LAST REFRESH TIME
const LAST_REFRESH_TIME_KEY = "planora_last_token_refresh";

// <== TOKEN MONITOR HOOK ==>
export const useTokenMonitor = (): void => {
  // AUTH STORE
  const { isAuthenticated, isLoggingOut, setSessionExpired, user } =
    useAuthStore();
  // INTERVAL REFERENCE (RETURNS NUMBER IN BROWSER ENVIRONMENT)
  const intervalRef = useRef<number | null>(null);
  // LAST REFRESH TIME REFERENCE (TO TRACK WHEN TOKEN WAS LAST REFRESHED)
  const lastRefreshTimeRef = useRef<number>(0);
  // IS CHECKING FLAG (TO PREVENT CONCURRENT CHECKS)
  const isCheckingRef = useRef<boolean>(false);
  // CHECK TOKEN FUNCTION (MEMOIZED WITH useCallback)
  const checkTokens = useCallback(async (): Promise<void> => {
    // IF NOT AUTHENTICATED OR LOGGING OUT, DON'T CHECK
    if (!isAuthenticated || !user || isLoggingOut) {
      return;
    }
    // PREVENT CONCURRENT CHECKS
    if (isCheckingRef.current) {
      return;
    }
    // GET CURRENT TIME
    const now = Date.now();
    // GET LAST REFRESH TIME FROM REF OR LOCAL STORAGE
    let lastRefreshTime = lastRefreshTimeRef.current;
    // IF LAST REFRESH TIME IS 0, TRY TO GET FROM LOCAL STORAGE
    if (lastRefreshTime === 0) {
      // TRY TO GET FROM LOCAL STORAGE
      const storedTime = localStorage.getItem(LAST_REFRESH_TIME_KEY);
      // IF STORED TIME IS FOUND, PARSE IT AND SET LAST REFRESH TIME
      if (storedTime) {
        // PARSE STORED TIME
        lastRefreshTime = parseInt(storedTime, 10);
        // SET LAST REFRESH TIME IN REF
        lastRefreshTimeRef.current = lastRefreshTime;
      } else {
        // NO STORED TIME - SET TO NOW
        lastRefreshTime = now;
        // SET LAST REFRESH TIME IN REF
        lastRefreshTimeRef.current = lastRefreshTime;
        // STORE IN LOCAL STORAGE FOR PERSISTENCE ACROSS PAGE REFRESHES
        localStorage.setItem(LAST_REFRESH_TIME_KEY, lastRefreshTime.toString());
        // DON'T REFRESH ON FIRST CHECK
        return;
      }
    }
    // CALCULATE TIME SINCE LAST REFRESH
    const timeSinceLastRefresh = now - lastRefreshTime;
    // CALCULATE TIME UNTIL EXPIRY (14 MINUTES = 1 MINUTE BEFORE 15 MINUTE EXPIRY)
    const timeUntilExpiry = ACCESS_TOKEN_EXPIRY_MS - timeSinceLastRefresh;
    // ONLY REFRESH IF TOKEN IS ABOUT TO EXPIRE (1 MINUTE OR LESS REMAINING)
    if (timeUntilExpiry > REFRESH_THRESHOLD_MS) {
      // TOKEN IS STILL VALID, NO NEED TO REFRESH
      return;
    }
    // SET CHECKING FLAG
    isCheckingRef.current = true;
    // TRY TO REFRESH TOKEN PROACTIVELY
    try {
      // CALL REFRESH TOKEN ENDPOINT
      await apiClient.post("/auth/refresh");
      // UPDATE LAST REFRESH TIME
      const refreshTime = Date.now();
      // SET LAST REFRESH TIME IN REF
      lastRefreshTimeRef.current = refreshTime;
      // STORE IN LOCAL STORAGE FOR PERSISTENCE ACROSS PAGE REFRESHES
      localStorage.setItem(LAST_REFRESH_TIME_KEY, refreshTime.toString());
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
  }, [isAuthenticated, user, isLoggingOut, setSessionExpired]);
  // TOKEN MONITORING EFFECT
  useEffect(() => {
    // IF NOT AUTHENTICATED OR LOGGING OUT, DON'T MONITOR
    if (!isAuthenticated || !user || isLoggingOut) {
      // CLEAR INTERVAL IF EXISTS
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        // SET INTERVAL TO NULL
        intervalRef.current = null;
      }
      // RESET CHECKING FLAG
      isCheckingRef.current = false;
      // CLEAR STORED REFRESH TIME ON LOGOUT
      localStorage.removeItem(LAST_REFRESH_TIME_KEY);
      return;
    }
    // INITIALIZE LAST REFRESH TIME FROM STORAGE OR SET TO NOW
    const storedTime = localStorage.getItem(LAST_REFRESH_TIME_KEY);
    // GET CURRENT TIME
    const now = Date.now();
    // IF STORED TIME IS FOUND, PARSE IT AND SET LAST REFRESH TIME
    if (storedTime) {
      // PARSE STORED TIME
      const storedTimeValue = parseInt(storedTime, 10);
      // CALCULATE TIME SINCE STORED TIME
      const timeSinceStored = now - storedTimeValue;
      // IF STORED TIME IS OLDER THAN TOKEN EXPIRY, RESET IT
      if (timeSinceStored > ACCESS_TOKEN_EXPIRY_MS) {
        // STORED TIME IS TOO OLD - RESET TO NOW
        lastRefreshTimeRef.current = now;
        // STORE IN LOCAL STORAGE FOR PERSISTENCE ACROSS PAGE REFRESHES
        localStorage.setItem(LAST_REFRESH_TIME_KEY, now.toString());
      } else {
        // USE STORED TIME AND SET LAST REFRESH TIME IN REF
        lastRefreshTimeRef.current = storedTimeValue;
      }
    } else {
      // NO STORED TIME - SET TO NOW
      lastRefreshTimeRef.current = now;
      // STORE IN LOCAL STORAGE FOR PERSISTENCE ACROSS PAGE REFRESHES
      localStorage.setItem(LAST_REFRESH_TIME_KEY, now.toString());
    }
    // SET UP INTERVAL TO CHECK EVERY 30 SECONDS (TO DETECT WHEN TOKEN IS ABOUT TO EXPIRE)
    intervalRef.current = setInterval(() => {
      // RUN PERIODIC CHECK
      void checkTokens();
    }, 30000);
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
    // ADD EVENT LISTENER FOR WINDOW FOCUS (USER RETURNS TO TAB)
    window.addEventListener("focus", handleFocus);
    // ADD EVENT LISTENER FOR VISIBILITY CHANGE (TAB BECOMES VISIBLE)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // RETURN CLEANUP FUNCTION
    return () => {
      // CLEAR INTERVAL IF EXISTS
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        // SET INTERVAL TO NULL
        intervalRef.current = null;
      }
      // REMOVE EVENT LISTENER FOR WINDOW FOCUS
      window.removeEventListener("focus", handleFocus);
      // REMOVE EVENT LISTENER FOR VISIBILITY CHANGE
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // RESET CHECKING FLAG
      isCheckingRef.current = false;
    };
  }, [isAuthenticated, user, isLoggingOut, setSessionExpired, checkTokens]);
};
