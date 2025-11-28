// <== IMPORTS ==>
import { toast } from "../lib/toast";
import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type User } from "../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// <== LOGIN REQUEST TYPE ==>
type LoginRequest = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
};
// <== SIGNUP REQUEST TYPE ==>
type SignupRequest = {
  // <== NAME ==>
  name: string;
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== ACCEPTED TERMS ==>
  acceptedTerms: boolean;
};
// <== AUTH RESPONSE TYPE ==>
type AuthResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: User;
  // <== REQUIRES 2FA ==>
  requires2FA?: boolean;
};
// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== CODE ==>
  code?: string;
  // <== MESSAGE ==>
  message?: string;
  // <== SUCCESS ==>
  success?: boolean;
};
// <== USER RESPONSE TYPE ==>
type UserResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: User;
};

// <== VERIFY 2FA REQUEST TYPE ==>
type Verify2FARequest = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== TOKEN (TOTP) ==>
  token?: string;
  // <== BACKUP CODE ==>
  backupCode?: string;
};

// <== USE LOGIN HOOK ==>
export const useLogin = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // LOGIN MUTATION
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      // CALL LOGIN API
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // CHECK IF 2FA IS REQUIRED
      if (data.requires2FA) {
        // RETURN EARLY - DON'T LOGIN YET, WAIT FOR 2FA VERIFICATION
        return;
      }
      try {
        // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
        const userResponse = await apiClient.get<UserResponse>("/auth/me");
        // SET USER IN STORE WITH LATEST DATA (THIS WILL RESET isLoggingOut FLAG)
        if (userResponse.data?.data) {
          // SET USER IN STORE WITH LATEST DATA
          login(userResponse.data.data);
        } else {
          // FALLBACK TO RESPONSE DATA IF FETCH FAILS
          login(data.data);
        }
      } catch {
        // FALLBACK TO RESPONSE DATA IF FETCH FAILS
        login(data.data);
      }
      // CHECK IF ACCOUNT WAS REACTIVATED
      const accountReactivated = (data.data as { accountReactivated?: boolean })
        ?.accountReactivated;
      // SHOW SUCCESS TOAST WITH REACTIVATION MESSAGE IF APPLICABLE
      if (accountReactivated) {
        toast.success(
          "🎉 Welcome back! Your account has been successfully reactivated. All your data has been restored.",
          { duration: 6000 }
        );
      } else {
        toast.success(data.message || "Login successful!");
      }
      // NAVIGATE TO DASHBOARD
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// <== USE VERIFY 2FA HOOK ==>
export const useVerify2FA = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // VERIFY 2FA MUTATION
  return useMutation({
    mutationFn: async (
      credentials: Verify2FARequest
    ): Promise<AuthResponse> => {
      // CALL VERIFY 2FA API
      const response = await apiClient.post<AuthResponse>(
        "/auth/verify-2fa",
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      try {
        // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
        const userResponse = await apiClient.get<UserResponse>("/auth/me");
        // SET USER IN STORE WITH LATEST DATA (THIS WILL RESET isLoggingOut FLAG)
        if (userResponse.data?.data) {
          login(userResponse.data.data);
        } else {
          // FALLBACK TO RESPONSE DATA IF FETCH FAILS
          login(data.data);
        }
      } catch {
        // FALLBACK TO RESPONSE DATA IF FETCH FAILS
        login(data.data);
      }
      // CHECK IF ACCOUNT WAS REACTIVATED
      const accountReactivated = (data.data as { accountReactivated?: boolean })
        ?.accountReactivated;
      // SHOW SUCCESS TOAST WITH REACTIVATION MESSAGE IF APPLICABLE
      if (accountReactivated) {
        toast.success(
          "🎉 Welcome back! Your account has been successfully reactivated. All your data has been restored.",
          { duration: 6000 }
        );
      } else {
        toast.success(data.message || "Login successful!");
      }
      // NAVIGATE TO DASHBOARD
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "2FA verification failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// <== USE SIGNUP HOOK ==>
export const useSignup = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // SIGNUP MUTATION
  return useMutation({
    mutationFn: async (userData: SignupRequest): Promise<AuthResponse> => {
      // CALL SIGNUP API
      const response = await apiClient.post<AuthResponse>(
        "/auth/signup",
        userData
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // SHOW SUCCESS TOAST
      toast.success(
        data.message ||
          "Verification code sent! Please check your email to verify your account."
      );
      // NAVIGATE TO VERIFY EMAIL PAGE WITH EMAIL IN STATE
      navigate("/verify-email", {
        state: { email: data.data?.email || "" },
        replace: true,
      });
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// <== USE LOGOUT HOOK ==>
export const useLogout = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { clearUser, setLoggingOut } = useAuthStore();
  // QUERY CLIENT (FOR CLEARING CACHE)
  const queryClient = useQueryClient();
  // LOGOUT MUTATION
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // CALL LOGOUT API
      await apiClient.post("/auth/logout");
    },
    onSuccess: () => {
      // SET LOGGING OUT FLAG FIRST (PREVENTS OTHER QUERIES FROM RUNNING)
      setLoggingOut(true);
      // CLEAR USER STATE IMMEDIATELY
      clearUser();
      // CANCEL ALL ACTIVE QUERIES
      queryClient.cancelQueries();
      // CLEAR ALL QUERY CACHE
      queryClient.clear();
      // NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
      // SHOW SUCCESS TOAST
      toast.success("Logout successful!");
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SET LOGGING OUT FLAG FIRST (PREVENTS OTHER QUERIES FROM RUNNING)
      setLoggingOut(true);
      // CLEAR USER STATE IMMEDIATELY
      clearUser();
      // CANCEL ALL ACTIVE QUERIES
      queryClient.cancelQueries();
      // CLEAR ALL QUERY CACHE
      queryClient.clear();
      // NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Logout failed, but you've been signed out.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
