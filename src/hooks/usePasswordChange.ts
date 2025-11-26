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
// <== SEND PASSWORD CHANGE CODE RESPONSE ==>
type SendPasswordChangeCodeResponse = {
  // <== EXPIRES IN FIELD ==>
  expiresIn: number;
};
// <== VERIFY PASSWORD CHANGE CODE PARAMS ==>
type VerifyPasswordChangeCodeParams = {
  // <== CODE FIELD ==>
  code: string;
};
// <== CHANGE PASSWORD PARAMS ==>
type ChangePasswordParams = {
  // <== NEW PASSWORD FIELD ==>
  newPassword: string;
};

// <== SEND PASSWORD CHANGE CODE FUNCTION ==>
const sendPasswordChangeCode =
  async (): Promise<SendPasswordChangeCodeResponse> => {
    // SENDING PASSWORD CHANGE CODE TO BACKEND
    const response = await apiClient.post<
      ApiResponse<SendPasswordChangeCodeResponse>
    >("/account/password/send-code");
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

// <== VERIFY PASSWORD CHANGE CODE FUNCTION ==>
const verifyPasswordChangeCode = async (
  params: VerifyPasswordChangeCodeParams
): Promise<void> => {
  // VERIFYING PASSWORD CHANGE CODE TO BACKEND
  const response = await apiClient.post<ApiResponse<null>>(
    "/account/password/verify-code",
    params
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to verify code");
  }
};

// <== CHANGE PASSWORD FUNCTION ==>
const changePassword = async (params: ChangePasswordParams): Promise<void> => {
  // CHANGING PASSWORD TO BACKEND
  const response = await apiClient.post<ApiResponse<null>>(
    "/account/password/change",
    params
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(response.data.message || "Failed to change password");
  }
};

// <== RESEND PASSWORD CHANGE CODE FUNCTION ==>
const resendPasswordChangeCode =
  async (): Promise<SendPasswordChangeCodeResponse> => {
    // RESENDING PASSWORD CHANGE CODE TO BACKEND
    const response = await apiClient.post<
      ApiResponse<SendPasswordChangeCodeResponse>
    >("/account/password/resend-code");
    // IF RESPONSE IS NOT SUCCESS OR DATA IS NOT PRESENT, THROW ERROR
    if (!response.data.success || !response.data.data) {
      // THROW ERROR WITH MESSAGE FROM RESPONSE
      throw new Error(response.data.message || "Failed to resend code");
    }
    // RETURN DATA FROM RESPONSE
    return response.data.data;
  };

// <== CANCEL PASSWORD CHANGE FUNCTION ==>
const cancelPasswordChange = async (): Promise<void> => {
  // CANCELING PASSWORD CHANGE TO BACKEND
  const response = await apiClient.delete<ApiResponse<null>>(
    "/account/password/cancel"
  );
  // IF RESPONSE IS NOT SUCCESS, THROW ERROR
  if (!response.data.success) {
    // THROW ERROR WITH MESSAGE FROM RESPONSE
    throw new Error(
      response.data.message || "Failed to cancel password change"
    );
  }
};

// <== USE PASSWORD CHANGE HOOK ==>
export const usePasswordChange = () => {
  // QUERY CLIENT FOR INVALIDATING QUERIES
  const queryClient = useQueryClient();

  // SEND CODE MUTATION FOR SENDING PASSWORD CHANGE CODE
  const sendCodeMutation = useMutation<
    SendPasswordChangeCodeResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: sendPasswordChangeCode,
  });
  // VERIFY CODE MUTATION FOR VERIFYING PASSWORD CHANGE CODE
  const verifyCodeMutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    VerifyPasswordChangeCodeParams
  >({
    mutationFn: verifyPasswordChangeCode,
  });
  // CHANGE PASSWORD MUTATION FOR CHANGING PASSWORD
  const changePasswordMutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    ChangePasswordParams
  >({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  // RESEND CODE MUTATION FOR RESENDING PASSWORD CHANGE CODE
  const resendCodeMutation = useMutation<
    SendPasswordChangeCodeResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: resendPasswordChangeCode,
  });
  // CANCEL PASSWORD CHANGE MUTATION FOR CANCELING PASSWORD CHANGE
  const cancelMutation = useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: cancelPasswordChange,
  });

  return {
    sendCode: sendCodeMutation.mutateAsync,
    isSendingCode: sendCodeMutation.isPending,
    sendCodeError: sendCodeMutation.error,

    verifyCode: verifyCodeMutation.mutateAsync,
    isVerifyingCode: verifyCodeMutation.isPending,
    verifyCodeError: verifyCodeMutation.error,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,

    resendCode: resendCodeMutation.mutateAsync,
    isResendingCode: resendCodeMutation.isPending,
    resendCodeError: resendCodeMutation.error,

    cancelPasswordChange: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
    cancelError: cancelMutation.error,
  };
};
