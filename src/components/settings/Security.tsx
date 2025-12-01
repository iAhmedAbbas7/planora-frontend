// <== IMPORTS ==>
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Send,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
  X,
  RefreshCw,
  Monitor,
} from "lucide-react";
import { AxiosError } from "axios";
import SessionList from "./SessionList";
import { useTwoFactor } from "../../hooks/useTwoFactor";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useRef, useEffect, JSX } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import type { ModalType } from "../common/ConfirmationModal";
import SecuritySkeleton from "../skeletons/SecuritySkeleton";

// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== MESSAGE FIELD ==>
  message?: string;
  // <== SUCCESS FIELD ==>
  success?: boolean;
};

// <== SECURITY COMPONENT ==>
const Security = (): JSX.Element => {
  // AUTH STORE
  const { user } = useAuthStore();
  // CURRENT EMAIL
  const currentEmail = user?.email || "";
  // 2FA HOOK
  const {
    status,
    isStatusLoading,
    refetchStatus,
    requestEnableCode,
    isRequestingEnableCode,
    verifyEnableCode,
    isVerifyingEnableCode,
    verifyEnableTOTP,
    isVerifyingEnableTOTP,
    requestDisableCode,
    isRequestingDisableCode,
    verifyDisableCode,
    isVerifyingDisableCode,
    verifyDisableTOTP,
    isVerifyingDisableTOTP,
    resendCode,
    isResendingCode,
    cancel2FA,
    isCancelling,
    regenerateBackupCodes,
    isRegeneratingCodes,
  } = useTwoFactor();
  // ENABLE STEP STATE
  const [enableStep, setEnableStep] = useState<
    "request" | "verify" | "qr" | "backup"
  >("request");
  // DISABLE STEP STATE
  const [disableStep, setDisableStep] = useState<"request" | "verify" | "totp">(
    "request"
  );
  // QR CODE DATA URL STATE
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  // BACKUP CODES STATE
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  // ENABLE VERIFICATION CODE STATES
  const [enableCode, setEnableCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // DISABLE VERIFICATION CODE STATES
  const [disableCode, setDisableCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // ENABLE TOTP CODE STATES
  const [enableTOTPCode, setEnableTOTPCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // DISABLE TOTP CODE STATES
  const [disableTOTPCode, setDisableTOTPCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // ENABLE CODE REFS
  const enableCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // DISABLE CODE REFS
  const disableCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // ENABLE TOTP CODE REFS
  const enableTOTPCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // DISABLE TOTP CODE REFS
  const disableTOTPCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  // SHOW REGENERATE MODAL STATE
  const [showRegenerateModal, setShowRegenerateModal] =
    useState<boolean>(false);
  // HANDLE OTP CHANGE FUNCTION
  const handleOtpChange = (
    value: string,
    index: number,
    setOtp: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<Array<HTMLInputElement | null>>
  ): void => {
    // ONLY ALLOW NUMBERS TO BE ADDED
    if (value && !/^[0-9]$/.test(value)) return;
    // GET THE NEW OTP
    setOtp((prev) => {
      const newOtp = [...prev];
      // ASSIGNING THE VALUE
      newOtp[index] = value;
      // AUTO-FOCUSING THE NEXT INPUT
      if (value && index < 5) {
        // AUTO-FOCUSING THE NEXT INPUT
        refs.current[index + 1]?.focus();
      }
      // RETURNING THE NEW OTP
      return newOtp;
    });
  };
  // HANDLE OTP KEY DOWN FUNCTION
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    setOtp: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<(HTMLInputElement | null)[]>
  ): void => {
    // BACKSPACE INPUT REMOVAL HANDLING
    if (
      e.key === "Backspace" &&
      !(e.target as HTMLInputElement).value &&
      index > 0
    ) {
      // AUTO-FOCUSING THE PREVIOUS INPUT
      refs.current[index - 1]?.focus();
      // SETTING THE NEW OTP
      setOtp((prev) => {
        // GET THE NEW OTP
        const newOtp = [...prev];
        // REMOVING THE VALUE
        newOtp[index - 1] = "";
        // RETURNING THE NEW OTP
        return newOtp;
      });
    }
  };
  // HANDLE REQUEST ENABLE CODE
  const handleRequestEnableCode = (): void => {
    // REQUESTING ENABLE CODE
    requestEnableCode(undefined, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // SETTING ENABLE STEP TO VERIFY
        setEnableStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your email address.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      },
    });
  };
  // HANDLE VERIFY ENABLE CODE
  const handleVerifyEnableCode = (): void => {
    // GET CODE FROM ENABLE CODE STATES
    const code = enableCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      return;
    }
    // VERIFYING ENABLE CODE
    verifyEnableCode(code, {
      // <== ON SUCCESS ==>
      onSuccess: (data) => {
        // SETTING QR CODE DATA URL
        setQrCodeDataURL(data.qrCodeDataURL);
        // SETTING ENABLE STEP TO QR
        setEnableStep("qr");
        // RESET ENABLE CODE STATES
        setEnableCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Verified",
          message: "Please scan the QR code with your authenticator app.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET CODE ON ERROR
        setEnableCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        enableCodeRefs.current[0]?.focus();
      },
    });
  };
  // HANDLE VERIFY ENABLE TOTP
  const handleVerifyEnableTOTP = (): void => {
    // GET TOKEN FROM ENABLE TOTP CODE STATES
    const token = enableTOTPCode.join("");
    // IF TOKEN IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (token.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message:
          "Please enter the complete 6-digit code from your authenticator app.",
      });
      return;
    }
    // VERIFYING ENABLE TOTP
    verifyEnableTOTP(token, {
      // <== ON SUCCESS ==>
      onSuccess: (data) => {
        // SETTING BACKUP CODES
        setBackupCodes(data.backupCodes);
        // SETTING ENABLE STEP TO BACKUP
        setEnableStep("backup");
        // RESET ENABLE TOTP CODE STATES
        setEnableTOTPCode(["", "", "", "", "", ""]);
        // REFETCH STATUS
        refetchStatus();
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to verify TOTP code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET CODE ON ERROR
        setEnableTOTPCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        enableTOTPCodeRefs.current[0]?.focus();
      },
    });
  };
  // HANDLE REQUEST DISABLE CODE
  const handleRequestDisableCode = (): void => {
    // REQUESTING DISABLE CODE
    requestDisableCode(undefined, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // SETTING DISABLE STEP TO VERIFY
        setDisableStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your email address.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      },
    });
  };
  // HANDLE VERIFY DISABLE CODE
  const handleVerifyDisableCode = (): void => {
    // GET CODE FROM DISABLE CODE STATES
    const code = disableCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      return;
    }
    // VERIFYING DISABLE CODE
    verifyDisableCode(code, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // SETTING DISABLE STEP TO TOTP
        setDisableStep("totp");
        // RESET DISABLE CODE STATES
        setDisableCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Verified",
          message: "Please enter the code from your authenticator app.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET CODE ON ERROR
        setDisableCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        disableCodeRefs.current[0]?.focus();
      },
    });
  };
  // HANDLE VERIFY DISABLE TOTP
  const handleVerifyDisableTOTP = (): void => {
    // GET TOKEN FROM DISABLE TOTP CODE STATES
    const token = disableTOTPCode.join("");
    // IF TOKEN IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (token.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message:
          "Please enter the complete 6-digit code from your authenticator app.",
      });
      return;
    }
    // VERIFYING DISABLE TOTP
    verifyDisableTOTP(token, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // SETTING DISABLE STEP TO REQUEST
        setDisableStep("request");
        // RESET DISABLE TOTP CODE STATES
        setDisableTOTPCode(["", "", "", "", "", ""]);
        // REFETCH STATUS
        refetchStatus();
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "2FA Disabled",
          message: "Two-Factor Authentication has been successfully disabled.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to verify TOTP code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET CODE ON ERROR
        setDisableTOTPCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        disableTOTPCodeRefs.current[0]?.focus();
      },
    });
  };
  // HANDLE RESEND CODE
  const handleResendCode = (type: "enable" | "disable"): void => {
    // RESENDING CODE
    resendCode(
      { type },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // SHOW SUCCESS MODAL
          setModalState({
            isOpen: true,
            type: "success",
            title: "Code Resent",
            message: "Verification code resent to your email address.",
          });
        },
        // <== ON ERROR ==>
        onError: (error: unknown) => {
          // TYPE ERROR AS AXIOS ERROR
          const axiosError = error as AxiosError<ApiErrorResponse>;
          // GET ERROR MESSAGE
          const errorMessage =
            axiosError.response?.data?.message ||
            "Failed to resend code. Please try again.";
          // SHOW ERROR MODAL
          setModalState({
            isOpen: true,
            type: "error",
            title: "Error",
            message: errorMessage,
          });
        },
      }
    );
  };
  // HANDLE CANCEL
  const handleCancel = (type: "enable" | "disable"): void => {
    // CANCELLING 2FA PROCESS
    cancel2FA(type, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // RESET ENABLE STEP
        if (type === "enable") {
          // SETTING ENABLE STEP TO REQUEST
          setEnableStep("request");
          // RESET ENABLE CODE STATES
          setEnableCode(["", "", "", "", "", ""]);
          // RESET ENABLE TOTP CODE STATES
          setEnableTOTPCode(["", "", "", "", "", ""]);
          // RESET QR CODE DATA URL
          setQrCodeDataURL("");
        } else {
          // SETTING DISABLE STEP TO REQUEST
          setDisableStep("request");
          // RESET DISABLE CODE STATES
          setDisableCode(["", "", "", "", "", ""]);
          // RESET DISABLE TOTP CODE STATES
          setDisableTOTPCode(["", "", "", "", "", ""]);
        }
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Cancelled",
          message: "2FA process cancelled successfully.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to cancel. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      },
    });
  };
  // HANDLE REGENERATE BACKUP CODES
  const handleRegenerateBackupCodes = (): void => {
    // REGENERATING BACKUP CODES
    regenerateBackupCodes(undefined, {
      // <== ON SUCCESS ==>
      onSuccess: (data) => {
        // SETTING BACKUP CODES
        setBackupCodes(data.backupCodes);
        // CLOSING REGENERATE MODAL
        setShowRegenerateModal(false);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Backup Codes Regenerated",
          message:
            "New backup codes have been generated. Please save them securely.",
        });
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to regenerate backup codes. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      },
    });
  };
  // HANDLE RESET ENABLE FLOW
  const handleResetEnableFlow = (): void => {
    // SETTING ENABLE STEP TO REQUEST
    setEnableStep("request");
    // RESET ENABLE CODE STATES
    setEnableCode(["", "", "", "", "", ""]);
    // RESET ENABLE TOTP CODE STATES
    setEnableTOTPCode(["", "", "", "", "", ""]);
    // RESET QR CODE DATA URL
    setQrCodeDataURL("");
    // RESET BACKUP CODES
    setBackupCodes([]);
  };
  // FOCUS ON FIRST INPUT WHEN STEP CHANGES
  useEffect(() => {
    // IF ENABLE STEP IS VERIFY, FOCUS ON FIRST ENABLE CODE INPUT
    if (enableStep === "verify") {
      enableCodeRefs.current[0]?.focus();
    } else if (enableStep === "qr") {
      // IF ENABLE STEP IS QR, FOCUS ON FIRST ENABLE TOTP CODE INPUT
      enableTOTPCodeRefs.current[0]?.focus();
    } else if (disableStep === "verify") {
      // IF DISABLE STEP IS VERIFY, FOCUS ON FIRST DISABLE CODE INPUT
      disableCodeRefs.current[0]?.focus();
    } else if (disableStep === "totp") {
      // IF DISABLE STEP IS TOTP, FOCUS ON FIRST DISABLE TOTP CODE INPUT
      disableTOTPCodeRefs.current[0]?.focus();
    }
  }, [enableStep, disableStep]);
  // PREVENT BACKGROUND SCROLLING WHEN BACKUP CODES MODAL IS OPEN
  useEffect(() => {
    // CHECK IF BACKUP CODES MODAL IS OPEN
    const isBackupCodesModalOpen =
      backupCodes.length > 0 && showRegenerateModal === false;
    // IF MODAL IS OPEN
    if (isBackupCodesModalOpen) {
      // SAVE ORIGINAL OVERFLOW STYLE
      const originalOverflow = document.body.style.overflow;
      // DISABLE BODY SCROLLING
      document.body.style.overflow = "hidden";
      // CLEANUP: RESTORE ORIGINAL OVERFLOW ON UNMOUNT OR WHEN MODAL CLOSES
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [backupCodes.length, showRegenerateModal]);
  // IF LOADING, SHOW SKELETON
  if (isStatusLoading) {
    return <SecuritySkeleton />;
  }
  // RETURNING THE SECURITY COMPONENT
  return (
    // SECURITY MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6 shadow-sm">
      {/* HEADER SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xl font-semibold text-[var(--text-primary)]">Security</p>
        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--light-text)]">
          Manage your Two-Factor Authentication settings and backup codes.
        </p>
      </div>
      {/* STATUS SECTION */}
      {status ? (
        <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield
                size={24}
                className="text-[var(--accent-color)]"
              />
              <div>
                <p className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                  Two-Factor Authentication:{" "}
                  {status.enabled ? (
                    <span className="flex items-center gap-1 text-green-500 dark:text-green-400">
                      <ShieldCheck size={18} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[var(--light-text)]">
                      <ShieldOff size={18} />
                    </span>
                  )}
                </p>
                {status.enabled && (
                  <p className="text-sm text-[var(--light-text)]">
                    {status.unusedBackupCodesCount > 0
                      ? `${status.unusedBackupCodesCount} unused backup codes available`
                      : "No unused backup codes available"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* ENABLE 2FA SECTION */}
      {!isStatusLoading && status && !status.enabled && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Enable 2FA</h3>
            <p className="text-sm text-[var(--light-text)]">
              Add an extra layer of security to your account by enabling
              Two-Factor Authentication.
            </p>
          </div>
          {/* STEP 1: REQUEST CODE */}
          {enableStep === "request" && (
            <div className="space-y-4">
              <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                <p className="text-sm text-[var(--text-primary)]">
                  To enable 2FA, we need to verify your identity. A verification
                  code will be sent to <strong>{currentEmail}</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                  1
                </div>
                <span>Request Verification Code</span>
              </div>
              <button
                onClick={handleRequestEnableCode}
                disabled={isRequestingEnableCode}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                {isRequestingEnableCode ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          )}
          {/* STEP 2: VERIFY CODE */}
          {enableStep === "verify" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                  2
                </div>
                <span>Verify Code</span>
              </div>
              <p className="text-sm text-[var(--text-primary)]">
                Enter the 6-digit verification code sent to your email address.
              </p>
              <div className="flex gap-2 justify-center">
                {enableCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      enableCodeRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        e.target.value,
                        index,
                        setEnableCode,
                        enableCodeRefs
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(e, index, setEnableCode, enableCodeRefs)
                    }
                    className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyEnableCode}
                  disabled={isVerifyingEnableCode}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isVerifyingEnableCode ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Verify Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleResendCode("enable")}
                  disabled={isResendingCode || isVerifyingEnableCode}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  {isResendingCode ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Resend
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCancel("enable")}
                  disabled={isCancelling}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
              <button
                onClick={() => {
                  setEnableStep("request");
                  setEnableCode(["", "", "", "", "", ""]);
                }}
                className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          )}
          {/* STEP 3: SCAN QR CODE */}
          {enableStep === "qr" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                  3
                </div>
                <span>Scan QR Code</span>
              </div>
              <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-sm text-[var(--text-primary)] mb-4">
                  Scan this QR code with your authenticator app (Google
                  Authenticator, Authy, or similar):
                </p>
                <div className="flex justify-center mb-4">
                  {qrCodeDataURL && (
                    <img
                      src={qrCodeDataURL}
                      alt="2FA QR Code"
                      className="w-64 h-64 border-2 border-[var(--border)] rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {enableTOTPCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          enableTOTPCodeRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index,
                            setEnableTOTPCode,
                            enableTOTPCodeRefs
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(
                            e,
                            index,
                            setEnableTOTPCode,
                            enableTOTPCodeRefs
                          )
                        }
                        className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyEnableTOTP}
                  disabled={isVerifyingEnableTOTP}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isVerifyingEnableTOTP ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Verify & Enable
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEnableStep("verify");
                    setEnableTOTPCode(["", "", "", "", "", ""]);
                  }}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </div>
            </div>
          )}
          {/* STEP 4: BACKUP CODES */}
          {enableStep === "backup" && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  ⚠️ Save These Backup Codes
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Store these codes in a secure location. You'll need them if
                  you lose access to your authenticator app. Each code can only
                  be used once.
                </p>
              </div>
              <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg font-mono text-sm text-center font-semibold text-[var(--accent-color)]"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEnableStep("request");
                    handleResetEnableFlow();
                    refetchStatus();
                  }}
                  className="w-full px-4 py-2 rounded-lg font-medium text-white transition cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <CheckCircle size={16} />
                  I've Saved These Codes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* DISABLE 2FA SECTION */}
      {!isStatusLoading && status && status.enabled && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Disable 2FA</h3>
            <p className="text-sm text-[var(--light-text)]">
              Disabling 2FA will reduce your account security. We recommend
              keeping it enabled.
            </p>
          </div>

          {/* STEP 1: REQUEST CODE */}
          {disableStep === "request" && (
            <div className="space-y-4">
              <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                <p className="text-sm text-red-500 dark:text-red-400 font-semibold mb-2">
                  ⚠️ Security Warning
                </p>
                <p className="text-sm text-[var(--text-primary)]">
                  Disabling 2FA will reduce the security of your account. Your
                  account will only be protected by your password.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-red-500 dark:text-red-400 font-semibold">
                  1
                </div>
                <span>Request Verification Code</span>
              </div>
              <button
                onClick={handleRequestDisableCode}
                disabled={isRequestingDisableCode}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isRequestingDisableCode ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          )}
          {/* STEP 2: VERIFY CODE */}
          {disableStep === "verify" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-red-500 dark:text-red-400 font-semibold">
                  2
                </div>
                <span>Verify Code</span>
              </div>
              <p className="text-sm text-[var(--text-primary)]">
                Enter the 6-digit verification code sent to your email address.
              </p>
              <div className="flex gap-2 justify-center">
                {disableCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      disableCodeRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        e.target.value,
                        index,
                        setDisableCode,
                        disableCodeRefs
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(
                        e,
                        index,
                        setDisableCode,
                        disableCodeRefs
                      )
                    }
                    className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyDisableCode}
                  disabled={isVerifyingDisableCode}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingDisableCode ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Verify Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleResendCode("disable")}
                  disabled={isResendingCode || isVerifyingDisableCode}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  {isResendingCode ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Resend
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCancel("disable")}
                  disabled={isCancelling}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
              <button
                onClick={() => {
                  setDisableStep("request");
                  setDisableCode(["", "", "", "", "", ""]);
                }}
                className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          )}
          {/* STEP 3: VERIFY TOTP */}
          {disableStep === "totp" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-red-500 dark:text-red-400 font-semibold">
                  3
                </div>
                <span>Verify Authenticator Code</span>
              </div>
              <p className="text-sm text-[var(--text-primary)]">
                Enter the 6-digit code from your authenticator app to complete
                the disable process.
              </p>
              <div className="flex gap-2 justify-center">
                {disableTOTPCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      disableTOTPCodeRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        e.target.value,
                        index,
                        setDisableTOTPCode,
                        disableTOTPCodeRefs
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(
                        e,
                        index,
                        setDisableTOTPCode,
                        disableTOTPCodeRefs
                      )
                    }
                    className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyDisableTOTP}
                  disabled={isVerifyingDisableTOTP}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingDisableTOTP ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Verify & Disable
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDisableStep("verify");
                    setDisableTOTPCode(["", "", "", "", "", ""]);
                  }}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </div>
            </div>
          )}
          {/* BACKUP CODES MANAGEMENT */}
          {status.hasBackupCodes && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Backup Codes</h3>
                  <p className="text-sm text-[var(--light-text)]">
                    You have {status.unusedBackupCodesCount} unused backup codes
                    available.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegenerateModal(true)}
                  disabled={isRegeneratingCodes}
                  className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                >
                  {isRegeneratingCodes ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Regenerate
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                <p className="text-sm text-[var(--light-text)]">
                  Backup codes can be used to access your account if you lose
                  access to your authenticator app. Each code can only be used
                  once. If you regenerate codes, your old codes will no longer
                  work.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (modalState.onConfirm) {
            modalState.onConfirm();
          }
          setModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
      {/* REGENERATE BACKUP CODES MODAL */}
      <ConfirmationModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        onConfirm={handleRegenerateBackupCodes}
        title="Regenerate Backup Codes"
        message="Are you sure you want to regenerate your backup codes? Your old codes will no longer work. New codes will be sent to your email address."
        type="warning"
      />
      {/* BACKUP CODES DISPLAY MODAL (AFTER REGENERATION) */}
      {backupCodes.length > 0 && showRegenerateModal === false && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Your New Backup Codes</h3>
              <button
                onClick={() => setBackupCodes([])}
                className="p-1 rounded-full hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                ⚠️ Save These Backup Codes
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Store these codes in a secure location. You'll need them if you
                lose access to your authenticator app. Each code can only be
                used once.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-3 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg font-mono text-sm text-center font-semibold text-[var(--accent-color)]"
                >
                  {code}
                </div>
              ))}
            </div>
            <button
              onClick={() => setBackupCodes([])}
              className="w-full px-4 py-2 rounded-lg font-medium text-white transition cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <CheckCircle size={16} />
              I've Saved These Codes
            </button>
          </div>
        </div>
      )}
      {/* SESSION MANAGEMENT SECTION */}
      <div className="mt-8 p-6 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="text-[var(--accent-color)]" size={24} />
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Active Sessions
          </h2>
        </div>
        <SessionList />
      </div>
    </div>
  );
};

export default Security;
