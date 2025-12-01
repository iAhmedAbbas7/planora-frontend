// <== IMPORTS ==>
import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import { toast } from "../lib/toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== CODE ==>
  code?: string;
  // <== MESSAGE ==>
  message?: string;
  // <== SUCCESS ==>
  success?: boolean;
};
// <== REQUEST DEVICE VERIFICATION REQUEST ==>
type RequestDeviceVerificationRequest = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
};
// <== REQUEST DEVICE VERIFICATION RESPONSE ==>
type RequestDeviceVerificationResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== SESSION ID ==>
  sessionId?: string;
};
// <== VERIFY DEVICE CODE REQUEST ==>
type VerifyDeviceCodeRequest = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== CODE ==>
  code: string;
  // <== SESSION ID (OPTIONAL - BACKEND CAN FIND IT) ==>
  sessionId?: string;
  // <== REMEMBER DEVICE ==>
  rememberDevice?: boolean;
};
// <== VERIFY DEVICE CODE RESPONSE ==>
type VerifyDeviceCodeResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== REQUIRES 2FA ==>
  requires2FA?: boolean;
  // <== SESSION ID ==>
  sessionId?: string;
  // <== DATA (IF LOGIN COMPLETED) ==>
  data?: {
    // <== ID ==>
    id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== PHONE NUMBER ==>
    phoneNumber?: string | null;
    // <== PHONE NUMBER VERIFIED ==>
    phoneNumberVerified?: boolean;
    // <== RECOVERY EMAIL ==>
    recoveryEmail?: string | null;
    // <== RECOVERY EMAIL VERIFIED ==>
    recoveryEmailVerified?: boolean;
  };
};
// <== VERIFY DEVICE 2FA REQUEST ==>
type VerifyDevice2FARequest = {
  // <== EMAIL ==>
  email: string;
  // <== SESSION ID ==>
  sessionId: string;
  // <== TWO FACTOR TOKEN ==>
  twoFactorToken?: string;
  // <== BACKUP CODE ==>
  backupCode?: string;
};
// <== VERIFY DEVICE 2FA RESPONSE ==>
type VerifyDevice2FAResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data?: {
    // <== ID ==>
    id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== PHONE NUMBER ==>
    phoneNumber?: string | null;
    // <== PHONE NUMBER VERIFIED ==>
    phoneNumberVerified?: boolean;
    // <== RECOVERY EMAIL ==>
    recoveryEmail?: string | null;
    // <== RECOVERY EMAIL VERIFIED ==>
    recoveryEmailVerified?: boolean;
  };
};
// <== COMPLETE DEVICE LOGIN REQUEST ==>
type CompleteDeviceLoginRequest = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== REMEMBER DEVICE ==>
  rememberDevice?: boolean;
};
// <== COMPLETE DEVICE LOGIN RESPONSE ==>
type CompleteDeviceLoginResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data?: {
    // <== ID ==>
    id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== PHONE NUMBER ==>
    phoneNumber?: string | null;
    // <== PHONE NUMBER VERIFIED ==>
    phoneNumberVerified?: boolean;
    // <== RECOVERY EMAIL ==>
    recoveryEmail?: string | null;
    // <== RECOVERY EMAIL VERIFIED ==>
    recoveryEmailVerified?: boolean;
  };
};

// <== USE REQUEST DEVICE VERIFICATION HOOK ==>
export const useRequestDeviceVerification = () => {
  // REQUEST DEVICE VERIFICATION MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (
      credentials: RequestDeviceVerificationRequest
    ): Promise<RequestDeviceVerificationResponse> => {
      // CALL REQUEST DEVICE VERIFICATION API
      const response = await apiClient.post<RequestDeviceVerificationResponse>(
        "/auth/device-verification/request",
        credentials
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Verification code sent to your email!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to send verification code. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE VERIFY DEVICE CODE HOOK ==>
export const useVerifyDeviceCode = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // VERIFY DEVICE CODE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (
      credentials: VerifyDeviceCodeRequest
    ): Promise<VerifyDeviceCodeResponse> => {
      // CALL VERIFY DEVICE CODE API
      const response = await apiClient.post<VerifyDeviceCodeResponse>(
        "/auth/device-verification/verify-code",
        credentials
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: async (data) => {
      if (!data.requires2FA && data.data) {
        // LOGIN COMPLETED - SET USER AND NAVIGATE
        try {
          // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
          const userResponse = await apiClient.get<{
            success: boolean;
            message: string;
            data: {
              id: string;
              name: string;
              email: string;
              phoneNumber?: string | null;
              phoneNumberVerified?: boolean;
              recoveryEmail?: string | null;
              recoveryEmailVerified?: boolean;
            };
          }>("/auth/me");
          // SET USER IN STORE WITH LATEST DATA
          if (userResponse.data?.data) {
            // SET USER IN STORE WITH LATEST DATA
            login(userResponse.data.data);
          } else {
            // SET USER IN STORE WITH RESPONSE DATA
            login(data.data);
          }
        } catch {
          // SET USER IN STORE WITH RESPONSE DATA
          login(data.data);
        }
        // SHOW SUCCESS TOAST
        toast.success(data.message || "Device verified and login successful!");
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      } else if (data.requires2FA) {
        // SHOW SUCCESS TOAST
        toast.success(data.message || "Email code verified!");
      }
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Invalid verification code. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE VERIFY DEVICE 2FA HOOK ==>
export const useVerifyDevice2FA = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // VERIFY DEVICE 2FA MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (
      credentials: VerifyDevice2FARequest
    ): Promise<VerifyDevice2FAResponse> => {
      // CALL VERIFY DEVICE 2FA API
      const response = await apiClient.post<VerifyDevice2FAResponse>(
        "/auth/device-verification/verify-2fa",
        credentials
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.data) {
        try {
          // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
          const userResponse = await apiClient.get<{
            success: boolean;
            message: string;
            data: {
              id: string;
              name: string;
              email: string;
              phoneNumber?: string | null;
              phoneNumberVerified?: boolean;
              recoveryEmail?: string | null;
              recoveryEmailVerified?: boolean;
            };
          }>("/auth/me");
          // SET USER IN STORE WITH LATEST DATA
          if (userResponse.data?.data) {
            // SET USER IN STORE WITH LATEST DATA
            login(userResponse.data.data);
          } else {
            // SET USER IN STORE WITH RESPONSE DATA
            login(data.data);
          }
        } catch {
          // SET USER IN STORE WITH RESPONSE DATA
          login(data.data);
        }
        // SHOW SUCCESS TOAST
        toast.success(data.message || "2FA verified and login successful!");
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      }
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Invalid 2FA code. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE COMPLETE DEVICE LOGIN HOOK ==>
export const useCompleteDeviceLogin = () => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // AUTH STORE
  const { login } = useAuthStore();
  // COMPLETE DEVICE LOGIN MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (
      credentials: CompleteDeviceLoginRequest
    ): Promise<CompleteDeviceLoginResponse> => {
      // CALL COMPLETE DEVICE LOGIN API
      const response = await apiClient.post<CompleteDeviceLoginResponse>(
        "/auth/device-verification/complete",
        credentials
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.data) {
        try {
          // FETCH LATEST USER DATA FROM SERVER TO ENSURE CONSISTENCY
          const userResponse = await apiClient.get<{
            success: boolean;
            message: string;
            data: {
              id: string;
              name: string;
              email: string;
              phoneNumber?: string | null;
              phoneNumberVerified?: boolean;
              recoveryEmail?: string | null;
              recoveryEmailVerified?: boolean;
            };
          }>("/auth/me");
          // SET USER IN STORE WITH LATEST DATA
          if (userResponse.data?.data) {
            // SET USER IN STORE WITH LATEST DATA
            login(userResponse.data.data);
          } else {
            // SET USER IN STORE WITH RESPONSE DATA
            login(data.data);
          }
        } catch {
          // SET USER IN STORE WITH RESPONSE DATA
          login(data.data);
        }
        // SHOW SUCCESS TOAST
        toast.success(data.message || "Device verified and login successful!");
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      }
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to complete login. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
