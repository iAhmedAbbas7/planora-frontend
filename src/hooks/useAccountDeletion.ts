// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS FIELD ==>
  success: boolean;
  // <== DATA FIELD ==>
  data?: T;
  // <== MESSAGE FIELD ==>
  message?: string;
};
// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== MESSAGE FIELD ==>
  message?: string;
  // <== SUCCESS FIELD ==>
  success?: boolean;
};
// <== SEND DELETION CODE RESPONSE ==>
type SendDeletionCodeResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY DELETION CODE PARAMS ==>
type VerifyDeletionCodeParams = {
  // <== CODE FIELD ==>
  code: string;
};
// <== CONFIRM DELETION RESPONSE ==>
type ConfirmDeletionResponse = {
  // <== FLAGGED AT FIELD ==>
  flaggedAt: string;
};

// <== SEND DELETION CODE FUNCTION ==>
const sendDeletionCode = async (): Promise<SendDeletionCodeResponse> => {
  // SENDING DELETION CODE TO BACKEND
  const response = await apiClient.post<ApiResponse<SendDeletionCodeResponse>>(
    "/account/deletion/send-code"
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

// <== VERIFY DELETION CODE FUNCTION ==>
const verifyDeletionCode = async (
  params: VerifyDeletionCodeParams
): Promise<void> => {
  // VERIFYING DELETION CODE TO BACKEND
  const response = await apiClient.post<ApiResponse<null>>(
    "/account/deletion/verify-code",
    params
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
};

// <== CONFIRM DELETION FUNCTION ==>
const confirmDeletion = async (): Promise<ConfirmDeletionResponse> => {
  // CONFIRMING DELETION TO BACKEND
  const response = await apiClient.post<ApiResponse<ConfirmDeletionResponse>>(
    "/account/deletion/confirm"
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to confirm deletion");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== RESEND DELETION CODE FUNCTION ==>
const resendDeletionCode = async (): Promise<SendDeletionCodeResponse> => {
  // RESENDING DELETION CODE TO BACKEND
  const response = await apiClient.post<ApiResponse<SendDeletionCodeResponse>>(
    "/account/deletion/resend-code"
  );
  // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
  if (!response.data.success || !response.data.data) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to resend code");
  }
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CANCEL DELETION FUNCTION ==>
const cancelDeletion = async (): Promise<void> => {
  // CANCELING DELETION TO BACKEND
  const response = await apiClient.delete<ApiResponse<null>>(
    "/account/deletion/cancel"
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to cancel deletion");
  }
};

// <== USE ACCOUNT DELETION HOOK ==>
export const useAccountDeletion = () => {
  // QUERY CLIENT FOR INVALIDATING QUERIES
  const queryClient = useQueryClient();
  // SEND CODE MUTATION FOR SENDING DELETION CODE
  const sendCodeMutation = useMutation<
    SendDeletionCodeResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: sendDeletionCode,
  });
  // VERIFY CODE MUTATION FOR VERIFYING DELETION CODE
  const verifyCodeMutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    VerifyDeletionCodeParams
  >({
    mutationFn: verifyDeletionCode,
  });
  // CONFIRM DELETION MUTATION FOR CONFIRMING DELETION
  const confirmDeletionMutation = useMutation<
    ConfirmDeletionResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: confirmDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  // RESEND CODE MUTATION FOR RESENDING DELETION CODE
  const resendCodeMutation = useMutation<
    SendDeletionCodeResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: resendDeletionCode,
  });
  // CANCEL DELETION MUTATION FOR CANCELING DELETION
  const cancelMutation = useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: cancelDeletion,
  });
  return {
    sendCode: sendCodeMutation.mutateAsync,
    isSendingCode: sendCodeMutation.isPending,
    sendCodeError: sendCodeMutation.error,

    verifyCode: verifyCodeMutation.mutateAsync,
    isVerifyingCode: verifyCodeMutation.isPending,
    verifyCodeError: verifyCodeMutation.error,

    confirmDeletion: confirmDeletionMutation.mutateAsync,
    isConfirmingDeletion: confirmDeletionMutation.isPending,
    confirmDeletionError: confirmDeletionMutation.error,

    resendCode: resendCodeMutation.mutateAsync,
    isResendingCode: resendCodeMutation.isPending,
    resendCodeError: resendCodeMutation.error,

    cancelDeletion: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
    cancelError: cancelMutation.error,
  };
};
