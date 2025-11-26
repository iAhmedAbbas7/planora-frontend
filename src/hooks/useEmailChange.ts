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
// <== SEND CURRENT EMAIL CODE PARAMS ==>
type SendCurrentEmailCodeParams = {
  // <== NEW EMAIL FIELD ==>
  newEmail: string;
};
// <== SEND CURRENT EMAIL CODE RESPONSE ==>
type SendCurrentEmailCodeResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY CURRENT EMAIL CODE PARAMS ==>
type VerifyCurrentEmailCodeParams = {
  // <== NEW EMAIL FIELD ==>
  newEmail: string;
  code: string;
};
// <== VERIFY NEW EMAIL CODE PARAMS ==>
type VerifyNewEmailCodeParams = {
  // <== NEW EMAIL FIELD ==>
  newEmail: string;
  // <== CODE FIELD ==>
  code: string;
};
// <== VERIFY NEW EMAIL CODE RESPONSE ==>
type VerifyNewEmailCodeResponse = {
  // <== EMAIL FIELD ==>
  email: string;
  // <== PROVIDER FIELD ==>
  provider?: string | null;
  // <== PROVIDER EMAIL FIELD ==>
  providerEmail?: string | null;
  // <== IS OAUTH USER FIELD ==>
  isOAuthUser?: boolean;
};
// <== RESEND CODE PARAMS ==>
type ResendCodeParams = {
  // <== NEW EMAIL FIELD ==>
  newEmail: string;
  // <== TYPE FIELD ==>
  type: "current" | "new";
};
// <== CANCEL EMAIL CHANGE PARAMS ==>
type CancelEmailChangeParams = {
  // <== NEW EMAIL FIELD ==>
  newEmail?: string;
};

// <== SEND CURRENT EMAIL CODE FUNCTION ==>
const sendCurrentEmailCode = async (
  params: SendCurrentEmailCodeParams
): Promise<SendCurrentEmailCodeResponse> => {
  // SENDING CURRENT EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<SendCurrentEmailCodeResponse>
  >("/account/email/verify-current", params);
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

// <== VERIFY CURRENT EMAIL CODE FUNCTION ==>
const verifyCurrentEmailCode = async (
  params: VerifyCurrentEmailCodeParams
): Promise<SendCurrentEmailCodeResponse> => {
  // VERIFYING CURRENT EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<SendCurrentEmailCodeResponse>
  >("/account/email/verify-current-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== VERIFY NEW EMAIL CODE FUNCTION ==>
const verifyNewEmailCode = async (
  params: VerifyNewEmailCodeParams
): Promise<VerifyNewEmailCodeResponse> => {
  // VERIFYING NEW EMAIL CODE TO API
  const response = await apiClient.post<
    ApiResponse<VerifyNewEmailCodeResponse>
  >("/account/email/verify-new-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== RESEND CODE FUNCTION ==>
const resendCode = async (
  params: ResendCodeParams
): Promise<SendCurrentEmailCodeResponse> => {
  // RESENDING CODE TO API
  const response = await apiClient.post<
    ApiResponse<SendCurrentEmailCodeResponse>
  >("/account/email/resend-code", params);
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to resend code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CANCEL EMAIL CHANGE FUNCTION ==>
const cancelEmailChange = async (
  params: CancelEmailChangeParams
): Promise<void> => {
  // CANCELING EMAIL CHANGE TO API
  const response = await apiClient.delete<ApiResponse<void>>(
    "/account/email/cancel",
    { data: params }
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to cancel email change");
  }
};

// <== USE EMAIL CHANGE HOOK ==>
export const useEmailChange = () => {
  // GET AUTH STORE
  const { user, setUser } = useAuthStore();
  // SEND CURRENT EMAIL CODE MUTATION
  const sendCurrentEmailCodeMutation = useMutation<
    SendCurrentEmailCodeResponse,
    AxiosError<{ message?: string }>,
    SendCurrentEmailCodeParams
  >({
    mutationFn: sendCurrentEmailCode,
  });
  // VERIFY CURRENT EMAIL CODE MUTATION
  const verifyCurrentEmailCodeMutation = useMutation<
    SendCurrentEmailCodeResponse,
    AxiosError<{ message?: string }>,
    VerifyCurrentEmailCodeParams
  >({
    mutationFn: verifyCurrentEmailCode,
  });
  // VERIFY NEW EMAIL CODE MUTATION
  const verifyNewEmailCodeMutation = useMutation<
    VerifyNewEmailCodeResponse,
    AxiosError<{ message?: string }>,
    VerifyNewEmailCodeParams
  >({
    mutationFn: verifyNewEmailCode,
    onSuccess: (data) => {
      // UPDATE USER EMAIL IN AUTH STORE
      if (user) {
        setUser({
          ...user,
          email: data.email,
        });
      }
    },
  });
  // RESEND CODE MUTATION
  const resendCodeMutation = useMutation<
    SendCurrentEmailCodeResponse,
    AxiosError<{ message?: string }>,
    ResendCodeParams
  >({
    mutationFn: resendCode,
  });
  // CANCEL EMAIL CHANGE MUTATION
  const cancelEmailChangeMutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    CancelEmailChangeParams
  >({
    mutationFn: cancelEmailChange,
  });
  // RETURN HOOK VALUES
  return {
    sendCurrentEmailCode: sendCurrentEmailCodeMutation.mutateAsync,
    isSendingCurrentCode: sendCurrentEmailCodeMutation.isPending,
    sendCurrentCodeError: sendCurrentEmailCodeMutation.error,
    verifyCurrentEmailCode: verifyCurrentEmailCodeMutation.mutateAsync,
    isVerifyingCurrentCode: verifyCurrentEmailCodeMutation.isPending,
    verifyCurrentCodeError: verifyCurrentEmailCodeMutation.error,
    verifyNewEmailCode: verifyNewEmailCodeMutation.mutateAsync,
    isVerifyingNewCode: verifyNewEmailCodeMutation.isPending,
    verifyNewCodeError: verifyNewEmailCodeMutation.error,
    resendCode: resendCodeMutation.mutateAsync,
    isResendingCode: resendCodeMutation.isPending,
    resendCodeError: resendCodeMutation.error,
    cancelEmailChange: cancelEmailChangeMutation.mutateAsync,
    isCancelling: cancelEmailChangeMutation.isPending,
    cancelError: cancelEmailChangeMutation.error,
  };
};
