// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS FIELD ==>
  success: boolean;
  // <== DATA FIELD ==>
  data?: T;
  // <== MESSAGE FIELD ==>
  message?: string;
};
// <== REQUEST ADD RECOVERY EMAIL PARAMS ==>
type RequestAddRecoveryEmailParams = {
  // <== RECOVERY EMAIL FIELD ==>
  recoveryEmail: string;
};
// <== REQUEST ADD RECOVERY EMAIL RESPONSE ==>
type RequestAddRecoveryEmailResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY ADD RECOVERY EMAIL PARAMS ==>
type VerifyAddRecoveryEmailParams = {
  // <== CODE FIELD ==>
  code: string;
};
// <== VERIFY ADD RECOVERY EMAIL RESPONSE ==>
type VerifyAddRecoveryEmailResponse = {
  // <== RECOVERY EMAIL FIELD ==>
  recoveryEmail: string;
  // <== VERIFIED FIELD ==>
  verified: boolean;
};
// <== REQUEST UPDATE RECOVERY EMAIL PARAMS ==>
type RequestUpdateRecoveryEmailParams = {
  // <== NEW RECOVERY EMAIL FIELD ==>
  newRecoveryEmail: string;
};
// <== REQUEST UPDATE RECOVERY EMAIL RESPONSE ==>
type RequestUpdateRecoveryEmailResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
  // <== NEW RECOVERY EMAIL FIELD ==>
  newRecoveryEmail: string;
};
// <== VERIFY UPDATE RECOVERY EMAIL CURRENT PARAMS ==>
type VerifyUpdateRecoveryEmailCurrentParams = {
  // <== CODE FIELD ==>
  code: string;
  // <== NEW RECOVERY EMAIL FIELD ==>
  newRecoveryEmail: string;
};
// <== VERIFY UPDATE RECOVERY EMAIL NEW PARAMS ==>
type VerifyUpdateRecoveryEmailNewParams = {
  // <== CODE FIELD ==>
  code: string;
};
// <== VERIFY UPDATE RECOVERY EMAIL NEW RESPONSE ==>
type VerifyUpdateRecoveryEmailNewResponse = {
  // <== RECOVERY EMAIL FIELD ==>
  recoveryEmail: string;
  // <== VERIFIED FIELD ==>
  verified: boolean;
};
// <== REQUEST REMOVE RECOVERY EMAIL RESPONSE ==>
type RequestRemoveRecoveryEmailResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY REMOVE RECOVERY EMAIL PARAMS ==>
type VerifyRemoveRecoveryEmailParams = {
  // <== CODE FIELD ==>
  code: string;
};
// <== RESEND CODE PARAMS ==>
type ResendRecoveryEmailCodeParams = {
  // <== TYPE FIELD ==>
  type: "add" | "update" | "remove";
};
// <== CANCEL RECOVERY EMAIL PARAMS ==>
type CancelRecoveryEmailParams = {
  // <== TYPE FIELD ==>
  type?: "add" | "update" | "remove";
};

// <== REQUEST ADD RECOVERY EMAIL FUNCTION ==>
const requestAddRecoveryEmail = async (
  params: RequestAddRecoveryEmailParams
): Promise<RequestAddRecoveryEmailResponse> => {
  // REQUESTING ADD RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<RequestAddRecoveryEmailResponse>
  >("/account/recovery-email/add/request-code", params);
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

// <== VERIFY ADD RECOVERY EMAIL FUNCTION ==>
const verifyAddRecoveryEmail = async (
  params: VerifyAddRecoveryEmailParams
): Promise<VerifyAddRecoveryEmailResponse> => {
  // VERIFYING ADD RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<VerifyAddRecoveryEmailResponse>
  >("/account/recovery-email/add/verify-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== REQUEST UPDATE RECOVERY EMAIL FUNCTION ==>
const requestUpdateRecoveryEmail = async (
  params: RequestUpdateRecoveryEmailParams
): Promise<RequestUpdateRecoveryEmailResponse> => {
  // REQUESTING UPDATE RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<RequestUpdateRecoveryEmailResponse>
  >("/account/recovery-email/update/request-code", params);
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

// <== VERIFY UPDATE RECOVERY EMAIL CURRENT FUNCTION ==>
const verifyUpdateRecoveryEmailCurrent = async (
  params: VerifyUpdateRecoveryEmailCurrentParams
): Promise<RequestUpdateRecoveryEmailResponse> => {
  // VERIFYING UPDATE RECOVERY EMAIL CURRENT CODE TO API
  const response = await apiClient.post<
    ApiResponse<RequestUpdateRecoveryEmailResponse>
  >("/account/recovery-email/update/verify-current-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== VERIFY UPDATE RECOVERY EMAIL NEW FUNCTION ==>
const verifyUpdateRecoveryEmailNew = async (
  params: VerifyUpdateRecoveryEmailNewParams
): Promise<VerifyUpdateRecoveryEmailNewResponse> => {
  // VERIFYING UPDATE RECOVERY EMAIL NEW CODE TO API
  const response = await apiClient.post<
    ApiResponse<VerifyUpdateRecoveryEmailNewResponse>
  >("/account/recovery-email/update/verify-new-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== REQUEST REMOVE RECOVERY EMAIL FUNCTION ==>
const requestRemoveRecoveryEmail = async (): Promise<RequestRemoveRecoveryEmailResponse> => {
  // REQUESTING REMOVE RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<RequestRemoveRecoveryEmailResponse>
  >("/account/recovery-email/remove/request-code");
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

// <== VERIFY REMOVE RECOVERY EMAIL FUNCTION ==>
const verifyRemoveRecoveryEmail = async (
  params: VerifyRemoveRecoveryEmailParams
): Promise<void> => {
  // VERIFYING REMOVE RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<ApiResponse<void>>(
    "/account/recovery-email/remove/verify-code",
    params
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
};

// <== RESEND RECOVERY EMAIL CODE FUNCTION ==>
const resendRecoveryEmailCode = async (
  params: ResendRecoveryEmailCodeParams
): Promise<RequestAddRecoveryEmailResponse> => {
  // RESENDING RECOVERY EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<RequestAddRecoveryEmailResponse>
  >("/account/recovery-email/resend-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to resend code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CANCEL RECOVERY EMAIL FUNCTION ==>
const cancelRecoveryEmail = async (
  params: CancelRecoveryEmailParams
): Promise<void> => {
  // CANCELING RECOVERY EMAIL TO API
  const response = await apiClient.delete<ApiResponse<void>>(
    "/account/recovery-email/cancel",
    { data: params }
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(
      response.data.message || "Failed to cancel recovery email process"
    );
  }
};

// <== USE RECOVERY EMAIL HOOK ==>
export const useRecoveryEmail = () => {
  // GET AUTH STORE
  const { user, setUser } = useAuthStore();
  // REQUEST ADD RECOVERY EMAIL MUTATION
  const requestAddRecoveryEmailMutation = useMutation<
    RequestAddRecoveryEmailResponse,
    AxiosError<{ message?: string }>,
    RequestAddRecoveryEmailParams
  >({
    mutationFn: requestAddRecoveryEmail,
  });
  // VERIFY ADD RECOVERY EMAIL MUTATION
  const verifyAddRecoveryEmailMutation = useMutation<
    VerifyAddRecoveryEmailResponse,
    AxiosError<{ message?: string }>,
    VerifyAddRecoveryEmailParams
  >({
    mutationFn: verifyAddRecoveryEmail,
    onSuccess: (data) => {
      // UPDATE USER RECOVERY EMAIL IN AUTH STORE
      if (user) {
        setUser({
          ...user,
          recoveryEmail: data.recoveryEmail,
          recoveryEmailVerified: data.verified,
        });
      }
    },
  });
  // REQUEST UPDATE RECOVERY EMAIL MUTATION
  const requestUpdateRecoveryEmailMutation = useMutation<
    RequestUpdateRecoveryEmailResponse,
    AxiosError<{ message?: string }>,
    RequestUpdateRecoveryEmailParams
  >({
    mutationFn: requestUpdateRecoveryEmail,
  });
  // VERIFY UPDATE RECOVERY EMAIL CURRENT MUTATION
  const verifyUpdateRecoveryEmailCurrentMutation = useMutation<
    RequestUpdateRecoveryEmailResponse,
    AxiosError<{ message?: string }>,
    VerifyUpdateRecoveryEmailCurrentParams
  >({
    mutationFn: verifyUpdateRecoveryEmailCurrent,
  });
  // VERIFY UPDATE RECOVERY EMAIL NEW MUTATION
  const verifyUpdateRecoveryEmailNewMutation = useMutation<
    VerifyUpdateRecoveryEmailNewResponse,
    AxiosError<{ message?: string }>,
    VerifyUpdateRecoveryEmailNewParams
  >({
    mutationFn: verifyUpdateRecoveryEmailNew,
    onSuccess: (data) => {
      // UPDATE USER RECOVERY EMAIL IN AUTH STORE
      if (user) {
        setUser({
          ...user,
          recoveryEmail: data.recoveryEmail,
          recoveryEmailVerified: data.verified,
        });
      }
    },
  });
  // REQUEST REMOVE RECOVERY EMAIL MUTATION
  const requestRemoveRecoveryEmailMutation = useMutation<
    RequestRemoveRecoveryEmailResponse,
    AxiosError<{ message?: string }>
  >({
    mutationFn: requestRemoveRecoveryEmail,
  });
  // VERIFY REMOVE RECOVERY EMAIL MUTATION
  const verifyRemoveRecoveryEmailMutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    VerifyRemoveRecoveryEmailParams
  >({
    mutationFn: verifyRemoveRecoveryEmail,
    onSuccess: () => {
      // UPDATE USER RECOVERY EMAIL IN AUTH STORE
      if (user) {
        setUser({
          ...user,
          recoveryEmail: null,
          recoveryEmailVerified: false,
        });
      }
    },
  });
  // RESEND RECOVERY EMAIL CODE MUTATION
  const resendRecoveryEmailCodeMutation = useMutation<
    RequestAddRecoveryEmailResponse,
    AxiosError<{ message?: string }>,
    ResendRecoveryEmailCodeParams
  >({
    mutationFn: resendRecoveryEmailCode,
  });
  // CANCEL RECOVERY EMAIL MUTATION
  const cancelRecoveryEmailMutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    CancelRecoveryEmailParams
  >({
    mutationFn: cancelRecoveryEmail,
  });
  // RETURN HOOK VALUES
  return {
    requestAddRecoveryEmail: requestAddRecoveryEmailMutation.mutateAsync,
    isRequestingAddCode: requestAddRecoveryEmailMutation.isPending,
    requestAddCodeError: requestAddRecoveryEmailMutation.error,
    verifyAddRecoveryEmail: verifyAddRecoveryEmailMutation.mutateAsync,
    isVerifyingAddCode: verifyAddRecoveryEmailMutation.isPending,
    verifyAddCodeError: verifyAddRecoveryEmailMutation.error,
    requestUpdateRecoveryEmail: requestUpdateRecoveryEmailMutation.mutateAsync,
    isRequestingUpdateCode: requestUpdateRecoveryEmailMutation.isPending,
    requestUpdateCodeError: requestUpdateRecoveryEmailMutation.error,
    verifyUpdateRecoveryEmailCurrent:
      verifyUpdateRecoveryEmailCurrentMutation.mutateAsync,
    isVerifyingUpdateCurrentCode:
      verifyUpdateRecoveryEmailCurrentMutation.isPending,
    verifyUpdateCurrentCodeError:
      verifyUpdateRecoveryEmailCurrentMutation.error,
    verifyUpdateRecoveryEmailNew:
      verifyUpdateRecoveryEmailNewMutation.mutateAsync,
    isVerifyingUpdateNewCode: verifyUpdateRecoveryEmailNewMutation.isPending,
    verifyUpdateNewCodeError: verifyUpdateRecoveryEmailNewMutation.error,
    requestRemoveRecoveryEmail: requestRemoveRecoveryEmailMutation.mutateAsync,
    isRequestingRemoveCode: requestRemoveRecoveryEmailMutation.isPending,
    requestRemoveCodeError: requestRemoveRecoveryEmailMutation.error,
    verifyRemoveRecoveryEmail: verifyRemoveRecoveryEmailMutation.mutateAsync,
    isVerifyingRemoveCode: verifyRemoveRecoveryEmailMutation.isPending,
    verifyRemoveCodeError: verifyRemoveRecoveryEmailMutation.error,
    resendRecoveryEmailCode: resendRecoveryEmailCodeMutation.mutateAsync,
    isResendingCode: resendRecoveryEmailCodeMutation.isPending,
    resendCodeError: resendRecoveryEmailCodeMutation.error,
    cancelRecoveryEmail: cancelRecoveryEmailMutation.mutateAsync,
    isCancelling: cancelRecoveryEmailMutation.isPending,
    cancelError: cancelRecoveryEmailMutation.error,
  };
};

