// <== IMPORTS ==>
import apiClient from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import PURPLE_LOGO from "../../assets/images/LOGO-PURPLE.png";
import { JSX, useEffect, useLayoutEffect, useRef } from "react";

// <== ONBOARDING ROUTE PROPS TYPE ==>
type OnboardingRouteProps = {
  // <== CHILDREN ==>
  children: JSX.Element;
};

// <== USER RESPONSE TYPE ==>
type UserResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: {
    // <== USER ID ==>
    id: string;
    // <== USER NAME ==>
    name: string;
    // <== USER EMAIL ==>
    email: string;
  };
};

// <== ONBOARDING ROUTE COMPONENT ==>
const OnboardingRoute = ({ children }: OnboardingRouteProps): JSX.Element => {
  // AUTH STORE
  const {
    isAuthenticated,
    isLoggingOut,
    isCheckingAuth,
    setUser,
    setCheckingAuth,
    user,
  } = useAuthStore();
  // LOCATION HOOK
  const location = useLocation();
  // CHECK IF COMING FROM OAUTH
  const isOAuthCallback = location.search.includes("oauth=success");
  // CHECK IF WE NEED TO VERIFY AUTHENTICATION
  const needsAuthCheck = (!isAuthenticated && !user) || isOAuthCallback;
  // QUERY SHOULD BE ENABLED IF WE NEED TO CHECK
  const shouldCheckAuth = needsAuthCheck && !isAuthenticated && !isLoggingOut;
  // REF TO TRACK TIMEOUT
  const timeoutRef = useRef<number | null>(null);
  // SET CHECKING AUTH STATE IMMEDIATELY IF NEEDED
  useLayoutEffect(() => {
    // IF NEEDS AUTH CHECK, NOT CHECKING AUTH, AND NOT AUTHENTICATED, SET CHECKING AUTH TO TRUE
    if (needsAuthCheck && !isCheckingAuth && !isAuthenticated) {
      // SET CHECKING AUTH TO TRUE
      setCheckingAuth(true);
      // SET TIMEOUT TO CLEAR CHECKING AUTH AFTER 10 SECONDS
      timeoutRef.current = window.setTimeout(() => {
        // SET CHECKING AUTH TO FALSE
        setCheckingAuth(false);
      }, 10000);
    }
    // CLEANUP TIMEOUT
    return () => {
      // CLEAR TIMEOUT IF EXISTS
      if (timeoutRef.current) {
        // CLEAR TIMEOUT
        clearTimeout(timeoutRef.current);
        // SET TIMEOUT TO NULL
        timeoutRef.current = null;
      }
    };
  }, [needsAuthCheck, isCheckingAuth, setCheckingAuth, isAuthenticated]);
  // FETCH CURRENT USER IF NEEDED
  const { data, isSuccess, isError, isLoading, isFetching, error } = useQuery({
    // QUERY KEY
    queryKey: ["currentUser", "onboarding-route"],
    // QUERY FUNCTION
    queryFn: async (): Promise<UserResponse> => {
      // CALL GET CURRENT USER API
      const response = await apiClient.get<UserResponse>("/auth/me");
      // RETURN RESPONSE DATA
      return response.data;
    },
    // ENABLED
    enabled: shouldCheckAuth,
    // RETRY
    retry: false,
    // REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: false,
    // REFETCH ON RECONNECT
    refetchOnReconnect: false,
    // STALE TIME
    staleTime: 60 * 1000,
  });
  // UPDATE USER IN STORE WHEN DATA IS FETCHED
  useEffect(() => {
    // CLEAR TIMEOUT IF EXISTS
    if (timeoutRef.current) {
      // CLEAR TIMEOUT
      clearTimeout(timeoutRef.current);
      // SET TIMEOUT TO NULL
      timeoutRef.current = null;
    }
    // IF SUCCESS AND DATA EXISTS, SET USER IN STORE
    if (isSuccess && data?.data) {
      // SET USER IN STORE
      setUser(data.data);
      // SET CHECKING AUTH TO FALSE
      setCheckingAuth(false);
      // IF OAUTH CALLBACK AND WINDOW HISTORY REPLACE STATE, DELETE OAUTH QUERY PARAM
      if (isOAuthCallback && window.history.replaceState) {
        // CREATE URL OBJECT
        const url = new URL(window.location.href);
        // DELETE OAUTH QUERY PARAM
        url.searchParams.delete("oauth");
        // REPLACE STATE
        window.history.replaceState({}, "", url.toString());
      }
    }
    // IF ERROR AND ERROR EXISTS, SET CHECKING AUTH TO FALSE
    if (isError && error) {
      // SET CHECKING AUTH TO FALSE
      setCheckingAuth(false);
    }
  }, [isSuccess, isError, data, error, setUser, setCheckingAuth, isOAuthCallback]);
  // FETCH ONBOARDING STATUS
  const {
    data: onboardingStatus,
    isLoading: isLoadingOnboarding,
  } = useQuery({
    // QUERY KEY
    queryKey: ["onboarding", "status"],
    // QUERY FUNCTION
    queryFn: async () => {
      // CALL GET ONBOARDING STATUS API
      const response = await apiClient.get<{
        success: boolean;
        data: { onboardingCompleted: boolean };
      }>("/auth/onboarding/status");
      // RETURN RESPONSE DATA
      return response.data.data;
    },
    // ENABLED
    enabled: isAuthenticated,
    // RETRY
    retry: false,
    // STALE TIME
    staleTime: 60 * 1000,
  });
  // IF CHECKING AUTH OR ONBOARDING STATUS, SHOW LOADING
  const isActuallyChecking =
    !isAuthenticated &&
    shouldCheckAuth &&
    (isLoading || isFetching || isCheckingAuth);
  // IF CHECKING AUTH OR ONBOARDING STATUS, SHOW LOADING
  if (isActuallyChecking || (isAuthenticated && isLoadingOnboarding)) {
    // RETURN LOADING COMPONENT
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={PURPLE_LOGO}
            alt="PlanOra Logo"
            className="w-20 h-20"
            style={{
              opacity: 0,
              animation: "fadeInOut 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    );
  }
  // IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    // IF LOGGING OUT, REDIRECT TO LOGIN
    if (isLoggingOut) {
      // REDIRECT TO LOGIN
      return <Navigate to="/login" replace />;
    }
    // REDIRECT TO ACCESS DENIED
    return <Navigate to="/access-denied" replace />;
  }
  // IF ONBOARDING IS ALREADY COMPLETE, REDIRECT TO DASHBOARD
  if (onboardingStatus?.onboardingCompleted) {
    // REDIRECT TO DASHBOARD
    return <Navigate to="/dashboard" replace />;
  }
  // RETURN CHILDREN IF AUTHENTICATED AND ONBOARDING NOT COMPLETE
  return children;
};

export default OnboardingRoute;
