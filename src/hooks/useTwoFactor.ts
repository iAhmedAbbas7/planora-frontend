// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS FIELD ==>
  success: boolean;
  // <== DATA FIELD ==>
  data?: T;
  // <== MESSAGE FIELD ==>
  message?: string;
};
// <== REQUEST ENABLE CODE RESPONSE ==>
type RequestEnableCodeResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY ENABLE CODE RESPONSE ==>
type VerifyEnableCodeResponse = {
  // <== QR CODE DATA URL FIELD ==>
  qrCodeDataURL: string;
};
// <== VERIFY ENABLE TOTP RESPONSE ==>
type VerifyEnableTOTPResponse = {
  // <== BACKUP CODES FIELD ==>
  backupCodes: string[];
};
// <== REQUEST DISABLE CODE RESPONSE ==>
type RequestDisableCodeResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== RESEND CODE PARAMS ==>
type ResendCodeParams = {
  // <== TYPE FIELD ==>
  type: "enable" | "disable";
};
// <== GET 2FA STATUS RESPONSE ==>
type Get2FAStatusResponse = {
  // <== ENABLED FIELD ==>
  enabled: boolean;
  // <== HAS BACKUP CODES FIELD ==>
  hasBackupCodes: boolean;
  // <== UNUSED BACKUP CODES COUNT FIELD ==>
  unusedBackupCodesCount: number;
};
// <== REGENERATE BACKUP CODES RESPONSE ==>
type RegenerateBackupCodesResponse = {
  // <== BACKUP CODES FIELD ==>
  backupCodes: string[];
};

// <== REQUEST ENABLE CODE FUNCTION ==>
const requestEnableCode = async (): Promise<RequestEnableCodeResponse> => {
  // SENDING REQUEST TO API
  const response = await apiClient.post<ApiResponse<RequestEnableCodeResponse>>(
    "/security/2fa/enable/request-code"
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(
      response.data.message || "Failed to send verification code"
    );
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== VERIFY ENABLE CODE FUNCTION ==>
const verifyEnableCode = async (
  code: string
): Promise<VerifyEnableCodeResponse> => {
  // VERIFYING CODE TO API
  const response = await apiClient.post<ApiResponse<VerifyEnableCodeResponse>>(
    "/security/2fa/enable/verify-code",
    { code }
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== VERIFY ENABLE TOTP FUNCTION ==>
const verifyEnableTOTP = async (
  token: string
): Promise<VerifyEnableTOTPResponse> => {
  // VERIFYING TOTP TO API
  const response = await apiClient.post<ApiResponse<VerifyEnableTOTPResponse>>(
    "/security/2fa/enable/verify-totp",
    { token }
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify TOTP");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== REQUEST DISABLE CODE FUNCTION ==>
const requestDisableCode = async (): Promise<RequestDisableCodeResponse> => {
  // SENDING REQUEST TO API
  const response = await apiClient.post<
    ApiResponse<RequestDisableCodeResponse>
  >("/security/2fa/disable/request-code");
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(
      response.data.message || "Failed to send verification code"
    );
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== VERIFY DISABLE CODE FUNCTION ==>
const verifyDisableCode = async (code: string): Promise<void> => {
  // VERIFYING CODE TO API
  const response = await apiClient.post<ApiResponse<void>>(
    "/security/2fa/disable/verify-code",
    { code }
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
};

// <== VERIFY DISABLE TOTP FUNCTION ==>
const verifyDisableTOTP = async (token: string): Promise<void> => {
  // VERIFYING TOTP TO API
  const response = await apiClient.post<ApiResponse<void>>(
    "/security/2fa/disable/verify-totp",
    { token }
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify TOTP");
  }
};

// <== RESEND CODE FUNCTION ==>
const resendCode = async (
  params: ResendCodeParams
): Promise<RequestEnableCodeResponse> => {
  // RESENDING CODE TO API
  const response = await apiClient.post<ApiResponse<RequestEnableCodeResponse>>(
    "/security/2fa/resend-code",
    params
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(
      response.data.message || "Failed to resend verification code"
    );
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CANCEL 2FA FUNCTION ==>
const cancel2FA = async (type?: "enable" | "disable"): Promise<void> => {
  // CANCELLING 2FA PROCESS TO API
  const response = await apiClient.delete<ApiResponse<void>>(
    "/security/2fa/cancel",
    type ? { data: { type } } : undefined
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to cancel 2FA process");
  }
};

// <== GET 2FA STATUS FUNCTION ==>
const get2FAStatus = async (): Promise<Get2FAStatusResponse> => {
  // GETTING 2FA STATUS FROM API
  const response = await apiClient.get<ApiResponse<Get2FAStatusResponse>>(
    "/security/2fa/status"
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to get 2FA status");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== REGENERATE BACKUP CODES FUNCTION ==>
const regenerateBackupCodes =
  async (): Promise<RegenerateBackupCodesResponse> => {
    // REGENERATING BACKUP CODES TO API
    const response = await apiClient.post<
      ApiResponse<RegenerateBackupCodesResponse>
    >("/security/2fa/regenerate-backup-codes");
    // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
    if (!response.data.success || !response.data.data) {
      // THROW ERROR WITH MESSAGE FROM RESPONSE
      throw new Error(
        response.data.message || "Failed to regenerate backup codes"
      );
    }
    // RETURN DATA FROM RESPONSE
    return response.data.data;
  };

// <== USE TWO FACTOR HOOK ==>
export const useTwoFactor = () => {
  // GET 2FA STATUS QUERY
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["2fa-status"],
    queryFn: get2FAStatus,
  });
  // REQUEST ENABLE CODE MUTATION
  const {
    mutate: requestEnableCodeMutation,
    isPending: isRequestingEnableCode,
    error: requestEnableCodeError,
  } = useMutation({
    mutationFn: requestEnableCode,
    onSuccess: () => {
      // REFETCH STATUS AFTER SUCCESS
      refetchStatus();
    },
  });
  // VERIFY ENABLE CODE MUTATION
  const {
    mutate: verifyEnableCodeMutation,
    isPending: isVerifyingEnableCode,
    error: verifyEnableCodeError,
  } = useMutation({
    mutationFn: verifyEnableCode,
  });
  // VERIFY ENABLE TOTP MUTATION
  const {
    mutate: verifyEnableTOTPMutation,
    isPending: isVerifyingEnableTOTP,
    error: verifyEnableTOTPError,
  } = useMutation({
    mutationFn: verifyEnableTOTP,
    onSuccess: () => {
      // REFETCH STATUS AFTER SUCCESS
      refetchStatus();
    },
  });
  // REQUEST DISABLE CODE MUTATION
  const {
    mutate: requestDisableCodeMutation,
    isPending: isRequestingDisableCode,
    error: requestDisableCodeError,
  } = useMutation({
    mutationFn: requestDisableCode,
  });
  // VERIFY DISABLE CODE MUTATION
  const {
    mutate: verifyDisableCodeMutation,
    isPending: isVerifyingDisableCode,
    error: verifyDisableCodeError,
  } = useMutation({
    mutationFn: verifyDisableCode,
  });
  // VERIFY DISABLE TOTP MUTATION
  const {
    mutate: verifyDisableTOTPMutation,
    isPending: isVerifyingDisableTOTP,
    error: verifyDisableTOTPError,
  } = useMutation({
    mutationFn: verifyDisableTOTP,
    onSuccess: () => {
      // REFETCH STATUS AFTER SUCCESS
      refetchStatus();
    },
  });
  // RESEND CODE MUTATION
  const {
    mutate: resendCodeMutation,
    isPending: isResendingCode,
    error: resendCodeError,
  } = useMutation({
    mutationFn: resendCode,
  });
  // CANCEL 2FA MUTATION
  const {
    mutate: cancel2FAMutation,
    isPending: isCancelling,
    error: cancelError,
  } = useMutation({
    mutationFn: cancel2FA,
  });
  // REGENERATE BACKUP CODES MUTATION
  const {
    mutate: regenerateBackupCodesMutation,
    isPending: isRegeneratingCodes,
    error: regenerateCodesError,
  } = useMutation({
    mutationFn: regenerateBackupCodes,
  });
  // RETURNING HOOK VALUES
  return {
    status: statusData,
    isStatusLoading,
    isStatusError,
    refetchStatus,
    requestEnableCode: requestEnableCodeMutation,
    isRequestingEnableCode,
    requestEnableCodeError: requestEnableCodeError as AxiosError | null,
    verifyEnableCode: verifyEnableCodeMutation,
    isVerifyingEnableCode,
    verifyEnableCodeError: verifyEnableCodeError as AxiosError | null,
    verifyEnableTOTP: verifyEnableTOTPMutation,
    isVerifyingEnableTOTP,
    verifyEnableTOTPError: verifyEnableTOTPError as AxiosError | null,
    requestDisableCode: requestDisableCodeMutation,
    isRequestingDisableCode,
    requestDisableCodeError: requestDisableCodeError as AxiosError | null,
    verifyDisableCode: verifyDisableCodeMutation,
    isVerifyingDisableCode,
    verifyDisableCodeError: verifyDisableCodeError as AxiosError | null,
    verifyDisableTOTP: verifyDisableTOTPMutation,
    isVerifyingDisableTOTP,
    verifyDisableTOTPError: verifyDisableTOTPError as AxiosError | null,
    resendCode: resendCodeMutation,
    isResendingCode,
    resendCodeError: resendCodeError as AxiosError | null,
    cancel2FA: cancel2FAMutation,
    isCancelling,
    cancelError: cancelError as AxiosError | null,
    regenerateBackupCodes: regenerateBackupCodesMutation,
    isRegeneratingCodes,
    regenerateCodesError: regenerateCodesError as AxiosError | null,
  };
};
