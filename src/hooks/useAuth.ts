// <== IMPORTS ==>
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiClient from "../lib/axios";
import { useAuthStore, type User } from "../store/useAuthStore";

// <== LOGIN REQUEST TYPE ==>
type LoginRequest = {
  email: string;
  password: string;
};

// <== SIGNUP REQUEST TYPE ==>
type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

// <== AUTH RESPONSE TYPE ==>
type AuthResponse = {
  success: boolean;
  message: string;
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
    onSuccess: (data) => {
      // SET USER IN STORE (THIS WILL RESET isLoggingOut FLAG)
      login(data.data);
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Login successful!");
      // NAVIGATE TO DASHBOARD
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // SHOW ERROR TOAST
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
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
    onSuccess: (data) => {
      // SET USER IN STORE (THIS WILL RESET isLoggingOut FLAG)
      login(data.data);
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Signup successful!");
      // NAVIGATE TO DASHBOARD
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // SHOW ERROR TOAST
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
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
      // SET LOGGING OUT FLAG FIRST (BEFORE CLEARING AUTH STATE)
      setLoggingOut(true);
      // NAVIGATE TO LOGIN IMMEDIATELY (PROTECTED ROUTE WILL SEE FLAG AND ALLOW SMOOTH REDIRECT)
      navigate("/login", { replace: true });
      // CLEAR USER STATE MANUALLY (KEEPING isLoggingOut FLAG TRUE)
      // THE LOGIN PAGE WILL RESET THE FLAG WHEN IT MOUNTS
      clearUser();
      // SHOW SUCCESS TOAST
      toast.success("Logout successful!");
    },
    onError: (error: any) => {
      // SET LOGGING OUT FLAG FIRST (BEFORE CLEARING AUTH STATE)
      setLoggingOut(true);
      // NAVIGATE TO LOGIN IMMEDIATELY (PROTECTED ROUTE WILL SEE FLAG AND ALLOW SMOOTH REDIRECT)
      navigate("/login", { replace: true });
      // CLEAR USER STATE MANUALLY (KEEPING isLoggingOut FLAG TRUE)
      // THE LOGIN PAGE WILL RESET THE FLAG WHEN IT MOUNTS
      clearUser();
      // SHOW ERROR TOAST
      const errorMessage =
        error.response?.data?.message || "Logout failed, but you've been signed out.";
      toast.error(errorMessage);
    },
  });
};

