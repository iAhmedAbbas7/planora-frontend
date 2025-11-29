// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import apiClient from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// <== REQUEST PASSWORD RESET REQUEST TYPE ==>
type RequestPasswordResetRequest = {
  // <== EMAIL ==>
  email: string;
  // <== USE RECOVERY EMAIL ==>
  useRecoveryEmail?: boolean;
};
// <== REQUEST PASSWORD RESET RESPONSE TYPE ==>
type RequestPasswordResetResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
};
// <== RESET PASSWORD REQUEST TYPE ==>
type ResetPasswordRequest = {
  // <== EMAIL ==>
  email: string;
  // <== CODE ==>
  code: string;
  // <== NEW PASSWORD ==>
  newPassword: string;
};
// <== RESET PASSWORD RESPONSE TYPE ==>
type ResetPasswordResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
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

// <== USE REQUEST PASSWORD RESET HOOK ==>
export const useRequestPasswordReset = () => {
  // REQUEST PASSWORD RESET MUTATION
  return useMutation({
    mutationFn: async (
      credentials: RequestPasswordResetRequest
    ): Promise<RequestPasswordResetResponse> => {
      // CALL REQUEST PASSWORD RESET API
      const response = await apiClient.post<RequestPasswordResetResponse>(
        "/auth/forgot-password",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(
        data.message ||
          "If an account exists with this email, a password reset code has been sent."
      );
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to send password reset code. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// <== USE RESET PASSWORD HOOK ==>
export const useResetPassword = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // RESET PASSWORD MUTATION
  return useMutation({
    mutationFn: async (
      credentials: ResetPasswordRequest
    ): Promise<ResetPasswordResponse> => {
      // CALL RESET PASSWORD API
      const response = await apiClient.post<ResetPasswordResponse>(
        "/auth/reset-password",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Password reset successfully!");
      // NAVIGATE TO LOGIN PAGE
      navigate("/login", { replace: true });
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // SHOW ERROR TOAST
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Password reset failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};
