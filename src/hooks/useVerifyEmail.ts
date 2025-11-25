// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== VERIFY EMAIL REQUEST TYPE ==>
type VerifyEmailRequest = {
  // <== EMAIL ==>
  email: string;
  // <== CODE ==>
  code: string;
};
// <== VERIFY EMAIL RESPONSE TYPE ==>
type VerifyEmailResponse = {
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
// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== CODE ==>
  code?: string;
  // <== MESSAGE ==>
  message?: string;
  // <== SUCCESS ==>
  success?: boolean;
};
// <== RESEND CODE REQUEST TYPE ==>
type ResendCodeRequest = {
  // <== EMAIL ==>
  email: string;
};
// <== RESEND CODE RESPONSE TYPE ==>
type ResendCodeResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
};

// <== USE VERIFY EMAIL HOOK ==>
export const useVerifyEmail = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // VERIFY EMAIL MUTATION
  return useMutation({
    mutationFn: async (
      credentials: VerifyEmailRequest
    ): Promise<VerifyEmailResponse> => {
      // CALL VERIFY EMAIL API
      const response = await apiClient.post<VerifyEmailResponse>(
        "/auth/verify-email",
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      try {
        // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
        type UserResponse = {
          success: boolean;
          message: string;
          data: {
            id: string;
            name: string;
            email: string;
          };
        };
        const userResponse = await apiClient.get<UserResponse>("/auth/me");
        // SET USER IN STORE WITH LATEST DATA
        if (userResponse.data?.data) {
          // SET USER IN STORE WITH LATEST DATA
          login(userResponse.data.data);
        } else if (data?.data) {
          // SET USER IN STORE WITH RESPONSE DATA
          login(data.data);
        }
      } catch {
        // SET USER IN STORE WITH RESPONSE DATA
        if (data?.data) {
          login(data.data);
        }
      }
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Email verified successfully!");
      // NAVIGATE TO DASHBOARD WITH REPLACE
      navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Verification failed. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE RESEND CODE HOOK ==>
export const useResendCode = () => {
  // RESEND CODE MUTATION
  return useMutation({
    mutationFn: async (
      email: ResendCodeRequest
    ): Promise<ResendCodeResponse> => {
      // CALL RESEND CODE API
      const response = await apiClient.post<ResendCodeResponse>(
        "/auth/resend-verification",
        email
      );
      return response.data;
    },
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(
        data.message || "Verification code resent! Please check your email."
      );
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to resend code. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
