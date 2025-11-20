// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "sonner";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore, type User } from "../store/useAuthStore";

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
};

// <== AUTH RESPONSE TYPE ==>
type AuthResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: User;
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
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Login successful!");
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

// <== USE SIGNUP HOOK ==>
export const useSignup = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
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
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Signup successful!");
      // NAVIGATE TO DASHBOARD
      navigate("/dashboard");
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
  // LOGOUT MUTATION
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // CALL LOGOUT API
      await apiClient.post("/auth/logout");
    },
    onSuccess: () => {
      // SET LOGGING OUT FLAG
      setLoggingOut(true);
      // NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
      // CLEAR USER STATE
      clearUser();
      // SHOW SUCCESS TOAST
      toast.success("Logout successful!");
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SET LOGGING OUT FLAG
      setLoggingOut(true);
      // NAVIGATE TO LOGIN
      navigate("/login", { replace: true });
      // CLEAR USER STATE
      clearUser();
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Logout failed, but you've been signed out.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
