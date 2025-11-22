// <== IMPORTS ==>
import apiClient from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef } from "react";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore, type User } from "../store/useAuthStore";

// <== USER RESPONSE TYPE ==>
type UserResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: User;
};

// <== USE AUTH CHECK HOOK ==>
export const useAuthCheck = (): void => {
  // AUTH STORE
  const { setUser, setCheckingAuth } = useAuthStore();
  // REF TO TRACK IF WE'VE ALREADY SET CHECKING AUTH (PREVENT MULTIPLE SETS)
  const hasSetCheckingRef = useRef(false);
  // SHOULD CHECK AUTH (ALWAYS FALSE - AUTH CHECK IS HANDLED BY ProtectedRoute)
  const shouldCheckAuth = false;
  // SET CHECKING AUTH STATE SYNCHRONOUSLY (BEFORE PAINT)
  useLayoutEffect(() => {
    if (shouldCheckAuth && !hasSetCheckingRef.current) {
      // SET TO TRUE IMMEDIATELY WHEN WE NEED TO CHECK
      setCheckingAuth(true);
      // SET REF TO TRUE
      hasSetCheckingRef.current = true;
    } else if (!shouldCheckAuth && hasSetCheckingRef.current) {
      // CLEAR CHECKING STATE IF WE DON'T NEED TO CHECK
      setCheckingAuth(false);
      // SET REF TO FALSE
      hasSetCheckingRef.current = false;
    }
  }, [shouldCheckAuth, setCheckingAuth]);
  // FETCH CURRENT USER
  const { data, isSuccess, isError, error } = useQuery({
    // QUERY KEY
    queryKey: ["currentUser"],
    // QUERY FUNCTION
    queryFn: async (): Promise<UserResponse> => {
      // CALL GET CURRENT USER API WITH SKIP REFRESH FLAG (TO PREVENT INTERCEPTOR FROM TRYING TO REFRESH)
      const response = await apiClient.get<UserResponse>("/auth/me", {
        skipTokenRefresh: true,
      } as InternalAxiosRequestConfig & { skipTokenRefresh?: boolean });
      // RETURN RESPONSE DATA
      return response.data;
    },
    // ENABLED
    enabled: shouldCheckAuth,
    // RETRY ONCE IF FAILS (BUT NOT ON 401 - THAT MEANS NO AUTH)
    retry: (failureCount, error: unknown) => {
      // CHECK IF ERROR IS AN AXIOS ERROR
      const axiosError = error as AxiosError<{
        code?: string;
        message?: string;
        success?: boolean;
      }>;
      // DON'T RETRY ON 401 ERRORS (NO AUTHENTICATION)
      if (axiosError?.response?.status === 401) {
        return false;
      }
      // RETRY ONCE FOR OTHER ERRORS
      return failureCount < 1;
    },
    // DON'T REFETCH ON WINDOW FOCUS (TO AVOID UNNECESSARY CALLS)
    refetchOnWindowFocus: false,
    // DON'T REFETCH ON RECONNECT
    refetchOnReconnect: false,
  });
  // UPDATE USER IN STORE WHEN DATA IS FETCHED
  useEffect(() => {
    if (isSuccess && data?.data) {
      // SET USER IN STORE (THIS WILL SET isAuthenticated TO TRUE)
      setUser(data.data);
      // AUTH CHECK COMPLETE
      setCheckingAuth(false);
      // RESET REF
      hasSetCheckingRef.current = false;
    }
    // IF ERROR, AUTH CHECK IS COMPLETE (NO USER FOUND OR INVALID TOKEN)
    if (isError && error) {
      // GET ERROR STATUS (TYPE AS AXIOS ERROR)
      const axiosError = error as AxiosError<{
        code?: string;
        message?: string;
        success?: boolean;
      }>;
      const errorStatus = axiosError?.response?.status;
      // CHECK IF ERROR STATUS IS 401 OR 403
      if (errorStatus === 401 || errorStatus === 403) {
        // NO VALID AUTHENTICATION - CLEAR CHECKING STATE
        setCheckingAuth(false);
        // RESET REF
        hasSetCheckingRef.current = false;
      }
    }
  }, [isSuccess, isError, data, error, setUser, setCheckingAuth]);
};
