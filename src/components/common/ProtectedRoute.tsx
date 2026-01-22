// <== IMPORTS ==>
import apiClient from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import PURPLE_LOGO from "../../assets/images/LOGO-PURPLE.png";
import { JSX, useEffect, useLayoutEffect, useRef } from "react";

// <== PROTECTED ROUTE PROPS TYPE ==>
type ProtectedRouteProps = {
  // <== CHILDREN ==>
  children: JSX.Element;
  // <== SKIP ONBOARDING CHECK (FOR CERTAIN ROUTES) ==>
  skipOnboardingCheck?: boolean;
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
// <== ONBOARDING RESPONSE TYPE ==>
type OnboardingResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: {
    // <== ONBOARDING COMPLETED ==>
    onboardingCompleted: boolean;
    // <== SELECTED PLAN ==>
    selectedPlan: string | null;
  };
};

// <== PROTECTED ROUTE COMPONENT ==>
const ProtectedRoute = ({
  children,
  skipOnboardingCheck = false,
}: ProtectedRouteProps): JSX.Element => {
  // AUTH STORE
  const {
    isAuthenticated,
    isLoggingOut,
    isCheckingAuth,
    setUser,
    setCheckingAuth,
    user,
  } = useAuthStore();
  // LOCATION HOOK (TO CHECK FOR OAUTH QUERY PARAM)
  const location = useLocation();
  // CHECK IF COMING FROM OAUTH (QUERY PARAM)
  const isOAuthCallback = location.search.includes("oauth=success");
  // CHECK IF WE NEED TO VERIFY AUTHENTICATION
  const needsAuthCheck = (!isAuthenticated && !user) || isOAuthCallback;
  // QUERY SHOULD BE ENABLED IF WE NEED TO CHECK AND NOT YET AUTHENTICATED AND NOT LOGGING OUT
  const shouldCheckAuth = needsAuthCheck && !isAuthenticated && !isLoggingOut;
  // REF TO TRACK TIMEOUT (PREVENT INFINITE LOADING)
  const timeoutRef = useRef<number | null>(null);
  // SET CHECKING AUTH STATE IMMEDIATELY IF NEEDED (BEFORE QUERY RUNS)
  useLayoutEffect(() => {
    if (needsAuthCheck && !isCheckingAuth && !isAuthenticated) {
      // SET TO TRUE IMMEDIATELY WHEN WE NEED TO CHECK
      setCheckingAuth(true);
      // SET TIMEOUT TO CLEAR CHECKING STATE AFTER 10 SECONDS (FALLBACK)
      timeoutRef.current = window.setTimeout(() => {
        // IF STILL CHECKING AFTER 10 SECONDS, CLEAR IT (SOMETHING WENT WRONG)
        setCheckingAuth(false);
      }, 10000);
    }
    // CLEANUP TIMEOUT
    return () => {
      // CLEAR TIMEOUT
      if (timeoutRef.current) {
        // CLEAR TIMEOUT
        clearTimeout(timeoutRef.current);
        // SET TIMEOUT TO NULL
        timeoutRef.current = null;
      }
      // CLEANUP TIMEOUT COMPLETE
    };
  }, [needsAuthCheck, isCheckingAuth, setCheckingAuth, isAuthenticated]);
  // FETCH CURRENT USER IF NEEDED
  const { data, isSuccess, isError, isLoading, isFetching, error } = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["currentUser", "protected-route"],
    // <== QUERY FUNCTION ==>
    queryFn: async (): Promise<UserResponse> => {
      // CALL GET CURRENT USER API
      const response = await apiClient.get<UserResponse>("/auth/me");
      // RETURN RESPONSE DATA
      return response.data;
    },
    // <== ENABLED ==>
    enabled: shouldCheckAuth,
    // <== RETRY ==>
    retry: false,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: false,
    // <== STALE TIME ==>
    staleTime: 60 * 1000,
  });
  // UPDATE USER IN STORE WHEN DATA IS FETCHED
  useEffect(() => {
    // CLEAR TIMEOUT IF QUERY COMPLETES
    if (timeoutRef.current) {
      // CLEAR TIMEOUT
      clearTimeout(timeoutRef.current);
      // SET TIMEOUT TO NULL
      timeoutRef.current = null;
    }
    // IF QUERY IS SUCCESSFUL AND DATA EXISTS, SET USER IN STORE
    if (isSuccess && data?.data) {
      // SET USER IN STORE (THIS WILL SET isAuthenticated TO TRUE)
      setUser(data.data);
      // AUTH CHECK COMPLETE
      setCheckingAuth(false);
      // CLEAN UP OAUTH QUERY PARAM FROM URL IF NEEDED
      if (isOAuthCallback && window.history.replaceState) {
        // CREATE URL OBJECT
        const url = new URL(window.location.href);
        // DELETE OAUTH QUERY PARAM
        url.searchParams.delete("oauth");
        // REPLACE STATE
        window.history.replaceState({}, "", url.toString());
      }
    }
    // IF ERROR, AUTH CHECK IS COMPLETE (NO USER FOUND OR INVALID TOKEN)
    if (isError && error) {
      // CLEAR CHECKING STATE
      setCheckingAuth(false);
      // IF IT'S A 401, THE TOKEN IS INVALID - DON'T RETRY - THE USER WILL BE REDIRECTED TO ACCESS DENIED
    }
  }, [
    isSuccess,
    isError,
    data,
    error,
    setUser,
    setCheckingAuth,
    isOAuthCallback,
  ]);
  // FETCH ONBOARDING STATUS (ONLY IF AUTHENTICATED AND NOT SKIPPING CHECK)
  const {
    data: onboardingData,
    isLoading: isLoadingOnboarding,
  } = useQuery({
    // QUERY KEY
    queryKey: ["onboarding", "status", "protected-route"],
    // QUERY FUNCTION
    queryFn: async (): Promise<OnboardingResponse> => {
      // CALL GET ONBOARDING STATUS API
      const response = await apiClient.get<OnboardingResponse>(
        "/auth/onboarding/status"
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    // ENABLED
    enabled: isAuthenticated && !skipOnboardingCheck,
    // RETRY
    retry: false,
    // REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: false,
    // STALE TIME
    staleTime: 5 * 60 * 1000,
  });
  // IF CHECKING AUTH OR ONBOARDING STATUS, SHOW LOADING
  const isActuallyChecking =
    !isAuthenticated &&
    shouldCheckAuth &&
    (isLoading || isFetching || isCheckingAuth);
  // IF CHECKING ONBOARDING STATUS, SHOW LOADING
  const isCheckingOnboarding =
    isAuthenticated && !skipOnboardingCheck && isLoadingOnboarding;
  // IF CHECKING AUTH OR ONBOARDING, RETURN SPLASH SCREEN STYLE LOADING STATE
  if (isActuallyChecking || isCheckingOnboarding) {
    // RETURN SPLASH SCREEN STYLE LOADING STATE WHILE CHECKING
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
    // IF LOGGING OUT, REDIRECT TO LOGIN (SMOOTH LOGOUT FLOW)
    if (isLoggingOut) {
      return <Navigate to="/login" replace />;
    }
    // OTHERWISE, REDIRECT TO ACCESS DENIED
    return <Navigate to="/access-denied" replace />;
  }
  // CHECK IF ONBOARDING IS REQUIRED (USER AUTHENTICATED BUT ONBOARDING NOT COMPLETE)
  if (
    !skipOnboardingCheck &&
    onboardingData?.data &&
    !onboardingData.data.onboardingCompleted
  ) {
    // REDIRECT TO ONBOARDING PAGE
    return <Navigate to="/onboarding" replace />;
  }
  // RETURN CHILDREN IF AUTHENTICATED AND ONBOARDING COMPLETE
  return children;
};

export default ProtectedRoute;
