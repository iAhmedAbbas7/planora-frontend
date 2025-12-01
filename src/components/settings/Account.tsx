// <== IMPORTS ==>
import {
  Eye,
  EyeOff,
  Trash2,
  Mail,
  Lock,
  X,
  Shield,
  Send,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmailChange } from "../../hooks/useEmailChange";
import ConfirmationModal from "../common/ConfirmationModal";
import type { ModalType } from "../common/ConfirmationModal";
import { useRecoveryEmail } from "../../hooks/useRecoveryEmail";
import { usePasswordChange } from "../../hooks/usePasswordChange";
import { useAuthStore, type User } from "../../store/useAuthStore";
import { useAccountDeletion } from "../../hooks/useAccountDeletion";
import { useState, useRef, useEffect, JSX, ChangeEvent } from "react";

// <== CONDITION ITEM COMPONENT ==>
const ConditionItem = ({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) => (
  <div
    className={`w-full flex items-center gap-2 p-1.5 rounded border ${
      passed
        ? "bg-[var(--inside-card-bg)] border-[var(--accent-color)] text-[var(--accent-color)]"
        : "bg-[var(--inside-card-bg)] border-[var(--border)] text-[var(--light-text)]"
    }`}
  >
    {passed ? (
      <CheckCircle2 size={16} className="text-[var(--accent-color)]" />
    ) : (
      <Lock size={16} className="text-[var(--light-text)]" />
    )}
    <span className="text-xs">{label}</span>
  </div>
);

// <== ACCOUNT COMPONENT ==>
const Account = (): JSX.Element => {
  // ACTIVE SUB-TAB STATE
  const [activeTab, setActiveTab] = useState<
    "email" | "password" | "recovery" | "delete"
  >("email");
  // AUTH STORE
  const { user } = useAuthStore();
  // CURRENT EMAIL
  const currentEmail = user?.email || "";
  // EMAIL CHANGE HOOK
  const {
    sendCurrentEmailCode,
    isSendingCurrentCode,
    verifyCurrentEmailCode,
    isVerifyingCurrentCode,
    verifyNewEmailCode,
    isVerifyingNewCode,
    resendCode,
    isResendingCode,
    cancelEmailChange,
    isCancelling,
  } = useEmailChange();
  // PASSWORD CHANGE HOOK
  const {
    sendCode,
    isSendingCode,
    verifyCode,
    isVerifyingCode,
    changePassword: changePasswordAPI,
    isChangingPassword,
    resendCode: resendPasswordCode,
    isResendingCode: isResendingPasswordCode,
    cancelPasswordChange,
    isCancelling: isCancellingPasswordChange,
  } = usePasswordChange();
  // SHOW NEW PASSWORD STATES
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  // SHOW CONFIRM PASSWORD STATES
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  // MINIMUM LENGTH VALIDATION STATE
  const [hasMinLength, setHasMinLength] = useState<boolean>(false);
  // LOWERCASE LETTER VALIDATION STATE
  const [hasLower, setHasLower] = useState<boolean>(false);
  // UPPERCASE LETTER VALIDATION STATE
  const [hasUpper, setHasUpper] = useState<boolean>(false);
  // DIGIT VALIDATION STATE
  const [hasDigit, setHasDigit] = useState<boolean>(false);
  // SPECIAL CHARACTER VALIDATION STATE
  const [hasSpecial, setHasSpecial] = useState<boolean>(false);
  // PASSWORD MATCH VALIDATION STATE
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
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
  // CURRENT EMAIL VERIFICATION CODE STATES
  const [currentEmailCode, setCurrentEmailCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // NEW EMAIL VERIFICATION CODE STATES
  const [newEmailCode, setNewEmailCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // PASSWORD CHANGE VERIFICATION CODE STATES
  const [passwordChangeCode, setPasswordChangeCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // CURRENT EMAIL VERIFICATION CODE REFS
  const currentEmailCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // NEW EMAIL VERIFICATION CODE REFS
  const newEmailCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // PASSWORD CHANGE VERIFICATION CODE REFS
  const passwordChangeCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // ACCOUNT DELETION HOOK
  const {
    sendCode: sendDeletionCode,
    isSendingCode: isSendingDeletionCode,
    verifyCode: verifyDeletionCode,
    isVerifyingCode: isVerifyingDeletionCode,
    confirmDeletion,
    isConfirmingDeletion,
    resendCode: resendDeletionCode,
    isResendingCode: isResendingDeletionCode,
    cancelDeletion,
    isCancelling: isCancellingDeletion,
  } = useAccountDeletion();
  // RECOVERY EMAIL HOOK
  const {
    requestAddRecoveryEmail,
    isRequestingAddCode,
    verifyAddRecoveryEmail,
    isVerifyingAddCode,
    requestUpdateRecoveryEmail,
    isRequestingUpdateCode,
    verifyUpdateRecoveryEmailCurrent,
    isVerifyingUpdateCurrentCode,
    verifyUpdateRecoveryEmailNew,
    isVerifyingUpdateNewCode,
    requestRemoveRecoveryEmail,
    isRequestingRemoveCode,
    verifyRemoveRecoveryEmail,
    isVerifyingRemoveCode,
    resendRecoveryEmailCode,
    isResendingCode: isResendingRecoveryCode,
    cancelRecoveryEmail,
    isCancelling: isCancellingRecovery,
  } = useRecoveryEmail();
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // DELETION STEP STATE
  const [deletionStep, setDeletionStep] = useState<
    "request" | "verify" | "confirm"
  >("request");
  // DELETION VERIFICATION CODE STATES
  const [deletionCode, setDeletionCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // DELETION VERIFICATION CODE REFS
  const deletionCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // RECOVERY EMAIL VERIFICATION STEPS
  const [recoveryEmailStep, setRecoveryEmailStep] = useState<
    "add" | "update" | "remove"
  >("add");
  // RECOVERY EMAIL ADD STEP
  const [recoveryEmailAddStep, setRecoveryEmailAddStep] = useState<
    "request" | "verify"
  >("request");
  // RECOVERY EMAIL UPDATE STEP
  const [recoveryEmailUpdateStep, setRecoveryEmailUpdateStep] = useState<
    "request" | "verifyCurrent" | "verifyNew"
  >("request");
  // RECOVERY EMAIL REMOVE STEP
  const [recoveryEmailRemoveStep, setRecoveryEmailRemoveStep] = useState<
    "request" | "verify"
  >("request");
  // RECOVERY EMAIL VERIFICATION CODE STATES
  const [recoveryEmailCode, setRecoveryEmailCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // RECOVERY EMAIL VERIFICATION CODE REFS
  const recoveryEmailCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // EMAIL VERIFICATION STEPS
  const [emailStep, setEmailStep] = useState<
    "newEmail" | "verifyCurrent" | "verifyNew"
  >("newEmail");
  // PASSWORD VERIFICATION STEPS
  const [passwordStep, setPasswordStep] = useState<
    "request" | "verify" | "change"
  >("request");
  // FORM DATA STATE
  const [formData, setFormData] = useState({
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    recoveryEmail: "",
    newRecoveryEmail: "",
  });
  // CHECKING FOR EACH PASSWORD CONDITION WHEN NEW PASSWORD CHANGES
  useEffect(() => {
    // GET PASSWORD FROM FORM DATA
    const password = formData.newPassword;
    // CHECK IF PASSWORD HAS AT LEAST 8 CHARACTERS
    setHasMinLength(password.length >= 8);
    // CHECK IF PASSWORD HAS AT LEAST ONE LOWERCASE LETTER
    setHasLower(/[a-z]/.test(password));
    // CHECK IF PASSWORD HAS AT LEAST ONE UPPERCASE LETTER
    setHasUpper(/[A-Z]/.test(password));
    // CHECK IF PASSWORD HAS AT LEAST ONE DIGIT
    setHasDigit(/[0-9]/.test(password));
    // CHECK IF PASSWORD HAS AT LEAST ONE SPECIAL CHARACTER
    setHasSpecial(/[^A-Za-z0-9]/.test(password));
  }, [formData.newPassword]);
  // CHECKING FOR PASSWORD MATCH ON EACH CHANGE
  useEffect(() => {
    // CHECK IF NEW PASSWORD AND CONFIRM PASSWORD ARE NOT EMPTY AND IF THEY MATCH
    setPasswordsMatch(
      formData.newPassword !== "" &&
        formData.confirmPassword !== "" &&
        formData.newPassword === formData.confirmPassword
    );
  }, [formData.newPassword, formData.confirmPassword]);
  // HANDLE CHANGE EMAIL FUNCTION
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET THE NAME AND VALUE FROM THE TARGET
    const { name, value } = e.target;
    // SET THE FORM DATA
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLE CURRENT EMAIL OTP CHANGE FUNCTION
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
  // HANDLE CURRENT EMAIL OTP KEY DOWN FUNCTION
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
  // HANDLE SEND VERIFICATION CODE (CURRENT EMAIL)
  const handleSendCurrentEmailCode = (): void => {
    // IF NO EMAIL, SHOW ERROR MODAL
    if (!currentEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No email address found. Please contact support.",
      });
      return;
    }
    // IF NO NEW EMAIL, SHOW ERROR MODAL
    if (!formData.newEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Please enter a new email address.",
      });
      return;
    }
    // VALIDATING EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // IF EMAIL FORMAT IS INVALID, SHOW ERROR MODAL
    if (!emailRegex.test(formData.newEmail)) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }
    // SENDING CURRENT EMAIL CODE TO API
    sendCurrentEmailCode({ newEmail: formData.newEmail })
      .then(() => {
        // SETTING EMAIL STEP TO VERIFY CURRENT
        setEmailStep("verifyCurrent");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your current email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE SEND PASSWORD CHANGE CODE
  const handleSendPasswordCode = (): void => {
    // IF NO EMAIL, SHOW ERROR MODAL
    if (!currentEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No email address found. Please contact support.",
      });
      return;
    }
    // SENDING PASSWORD CHANGE CODE TO API
    sendCode()
      .then(() => {
        // SETTING PASSWORD STEP TO VERIFY
        setPasswordStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE VERIFY CURRENT EMAIL
  const handleVerifyCurrentEmail = (): void => {
    // GET CODE FROM CURRENT EMAIL CODE STATES
    const code = currentEmailCode.join("");
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
    // IF NO NEW EMAIL, SHOW ERROR MODAL
    if (!formData.newEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New email address is required.",
      });
      return;
    }
    // VERIFYING CURRENT EMAIL CODE TO API
    verifyCurrentEmailCode({ newEmail: formData.newEmail, code })
      .then(() => {
        // SETTING EMAIL STEP TO VERIFY NEW
        setEmailStep("verifyNew");
        // RESET CURRENT EMAIL CODE STATES
        setCurrentEmailCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Verified",
          message:
            "Current email verified. Verification code sent to your new email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET CODE ON ERROR
        setCurrentEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        currentEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE VERIFY NEW EMAIL
  const handleVerifyNewEmail = (): void => {
    // GET CODE FROM NEW EMAIL CODE STATES
    const code = newEmailCode.join("");
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
    // IF NO NEW EMAIL, SHOW ERROR MODAL
    if (!formData.newEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New email address is required.",
      });
      return;
    }
    // VERIFYING NEW EMAIL CODE TO API
    verifyNewEmailCode({ newEmail: formData.newEmail, code })
      .then((response) => {
        // SETTING EMAIL STEP TO NEW EMAIL
        setEmailStep("newEmail");
        // RESET FORM DATA
        setFormData((prev) => ({ ...prev, newEmail: "" }));
        // RESET CURRENT EMAIL CODE STATES
        setCurrentEmailCode(["", "", "", "", "", ""]);
        // RESET NEW EMAIL CODE STATES
        setNewEmailCode(["", "", "", "", "", ""]);
        // BUILD SUCCESS MESSAGE WITH OAUTH SYNC INFO
        let successMessage =
          "Your email address has been successfully updated! Confirmation emails have been sent to both your old and new email addresses.";
        // IF OAUTH USER, ADD OAUTH SYNC INFO TO SUCCESS MESSAGE
        if (response.isOAuthUser && response.provider) {
          // GET PROVIDER NAME
          const providerName =
            response.provider === "google"
              ? "Google"
              : response.provider === "github"
              ? "GitHub"
              : response.provider;
          successMessage += `\n\nYour OAuth account information will be automatically synced the next time you log in with ${providerName}.`;
        }
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Updated",
          message: successMessage,
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET NEW EMAIL CODE STATES
        setNewEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        newEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE VERIFY PASSWORD CODE
  const handleVerifyPasswordCode = (): void => {
    // GET CODE FROM PASSWORD CHANGE CODE STATES
    const code = passwordChangeCode.join("");
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
    // VERIFYING PASSWORD CHANGE CODE TO API
    verifyCode({ code })
      .then(() => {
        // SETTING PASSWORD STEP TO CHANGE
        setPasswordStep("change");
        // RESET PASSWORD CHANGE CODE STATES
        setPasswordChangeCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Verified",
          message:
            "Email verified successfully. You can now change your password.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET PASSWORD CHANGE CODE STATES
        setPasswordChangeCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        passwordChangeCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE CHANGE PASSWORD
  const handleChangePassword = (): void => {
    // IF NO NEW PASSWORD OR CONFIRM PASSWORD, SHOW ERROR MODAL
    if (!formData.newPassword || !formData.confirmPassword) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Please fill in all password fields.",
      });
      return;
    }
    // CHECK PASSWORD VALIDATION
    const allPasswordValid =
      hasMinLength && hasLower && hasUpper && hasDigit && hasSpecial;
    if (!allPasswordValid) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Password",
        message: "Please ensure your password meets all the requirements.",
      });
      return;
    }
    // IF NEW PASSWORD AND CONFIRM PASSWORD DO NOT MATCH, SHOW ERROR MODAL
    if (!passwordsMatch) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New password and confirmation password do not match.",
      });
      return;
    }
    // CHANGING PASSWORD TO API
    changePasswordAPI({ newPassword: formData.newPassword })
      .then(() => {
        // SETTING PASSWORD STEP TO REQUEST
        setPasswordStep("request");
        // RESET FORM DATA
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
        // RESET PASSWORD CHANGE CODE STATES
        setPasswordChangeCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Password Changed",
          message: "Your password has been successfully changed!",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to change password. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE SEND DELETION CODE
  const handleSendDeletionCode = (): void => {
    // SENDING DELETION CODE TO API
    sendDeletionCode()
      .then(() => {
        // SETTING DELETION STEP TO VERIFY
        setDeletionStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE VERIFY DELETION CODE
  const handleVerifyDeletionCode = (): void => {
    // GET CODE FROM STATE
    const code = deletionCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter a valid 6-digit verification code.",
      });
      return;
    }
    // VERIFYING DELETION CODE TO API
    verifyDeletionCode({ code })
      .then(() => {
        // SETTING DELETION STEP TO CONFIRM
        setDeletionStep("confirm");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Verified",
          message:
            "Verification code verified successfully. You can now confirm deletion.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
        // RESET CODE
        setDeletionCode(["", "", "", "", "", ""]);
        // FOCUS FIRST INPUT
        deletionCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE CONFIRM DELETION
  const handleConfirmDeletion = (): void => {
    // SHOW WARNING MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Confirm Account Deletion",
      message:
        "Are you sure you want to delete your account? Your account will be flagged for deletion and you will have 30 days to reactivate it by logging in. After 30 days, your account and all data will be permanently deleted.",
      onConfirm: () => {
        // CONFIRMING DELETION TO API
        confirmDeletion()
          .then(() => {
            // SHOW SUCCESS MODAL
            setModalState({
              isOpen: true,
              type: "success",
              title: "Account Flagged for Deletion",
              message:
                "Your account has been flagged for deletion. You will be logged out shortly. You have 30 days to log in and reactivate your account.",
              onConfirm: () => {
                // AUTH STORE
                const { logout } = useAuthStore.getState();
                // CALL LOGOUT FUNCTION
                logout();
                // NAVIGATE TO LOGIN PAGE
                navigate("/login");
              },
            });
          })
          .catch((error) => {
            // GET ERROR MESSAGE FROM RESPONSE
            const errorMessage =
              error.response?.data?.message ||
              "Failed to confirm deletion. Please try again.";
            // SHOW ERROR MODAL
            setModalState({
              isOpen: true,
              type: "error",
              title: "Error",
              message: errorMessage,
            });
          });
      },
    });
  };
  // HANDLE RESEND DELETION CODE
  const handleResendDeletionCode = (): void => {
    // RESENDING DELETION CODE TO API
    resendDeletionCode()
      .then(() => {
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Resent",
          message: "Verification code resent to your email address.",
        });
        // RESET CODE
        setDeletionCode(["", "", "", "", "", ""]);
        // FOCUS FIRST INPUT
        deletionCodeRefs.current[0]?.focus();
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to resend code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE CANCEL DELETION
  const handleCancelDeletion = (): void => {
    // SHOW WARNING MODAL
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Cancel Account Deletion",
      message: "Are you sure you want to cancel the account deletion process?",
      onConfirm: () => {
        // CANCELING DELETION TO API
        cancelDeletion()
          .then(() => {
            // RESET DELETION STEP
            setDeletionStep("request");
            // RESET CODE
            setDeletionCode(["", "", "", "", "", ""]);
            // SHOW SUCCESS MODAL
            setModalState({
              isOpen: true,
              type: "success",
              title: "Deletion Cancelled",
              message: "Account deletion process has been cancelled.",
            });
          })
          .catch((error) => {
            // GET ERROR MESSAGE FROM RESPONSE
            const errorMessage =
              error.response?.data?.message ||
              "Failed to cancel deletion. Please try again.";
            // SHOW ERROR MODAL
            setModalState({
              isOpen: true,
              type: "error",
              title: "Error",
              message: errorMessage,
            });
          });
      },
    });
  };
  // RESET DELETION FLOW
  const handleResetDeletionFlow = (): void => {
    // CANCEL DELETION ON BACKEND IF IN PROGRESS
    if (deletionStep !== "request") {
      // CANCELING DELETION ON BACKEND IF IN PROGRESS
      cancelDeletion().catch(() => {
        // SILENTLY FAIL - CLEANUP WILL HAPPEN ON BACKEND
      });
    }
    // SETTING DELETION STEP TO REQUEST
    setDeletionStep("request");
    // RESET CODE
    setDeletionCode(["", "", "", "", "", ""]);
  };
  // RESET EMAIL FLOW
  const handleResetEmailFlow = (): void => {
    // CANCEL EMAIL CHANGE ON BACKEND IF IN PROGRESS
    if (emailStep !== "newEmail" && formData.newEmail) {
      // CANCELING EMAIL CHANGE ON BACKEND IF IN PROGRESS
      cancelEmailChange({ newEmail: formData.newEmail }).catch(() => {
        // SILENTLY FAIL - CLEANUP WILL HAPPEN ON BACKEND
      });
    }
    // SETTING EMAIL STEP TO NEW EMAIL
    setEmailStep("newEmail");
    // RESET FORM DATA
    setFormData((prev) => ({ ...prev, newEmail: "" }));
    // RESET CURRENT EMAIL CODE STATES
    setCurrentEmailCode(["", "", "", "", "", ""]);
    // RESET NEW EMAIL CODE STATES
    setNewEmailCode(["", "", "", "", "", ""]);
  };
  // HANDLE RESEND CODE
  const handleResendCode = (type: "current" | "new"): void => {
    // IF NO NEW EMAIL, SHOW ERROR MODAL
    if (!formData.newEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New email address is required.",
      });
      return;
    }
    // RESENDING CODE TO API
    resendCode({ newEmail: formData.newEmail, type })
      .then(() => {
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Resent",
          message: `Verification code sent to your ${
            type === "current" ? "current" : "new"
          } email address.`,
        });
        // RESET CODE INPUTS
        if (type === "current") {
          // RESET CURRENT EMAIL CODE STATES
          setCurrentEmailCode(["", "", "", "", "", ""]);
          // FOCUS ON FIRST INPUT
          currentEmailCodeRefs.current[0]?.focus();
        } else {
          // RESET NEW EMAIL CODE STATES
          setNewEmailCode(["", "", "", "", "", ""]);
          // FOCUS ON FIRST INPUT
          newEmailCodeRefs.current[0]?.focus();
        }
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to resend code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // CLOSE MODAL FUNCTION
  const closeModal = (): void => {
    // CLOSE MODAL
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };
  // RESET PASSWORD FLOW
  const handleResetPasswordFlow = (): void => {
    // CANCEL PASSWORD CHANGE ON BACKEND IF IN PROGRESS
    if (passwordStep !== "request") {
      cancelPasswordChange().catch(() => {
        // SILENTLY FAIL - CLEANUP WILL HAPPEN ON BACKEND
      });
    }
    // SETTING PASSWORD STEP TO REQUEST
    setPasswordStep("request");
    // RESET FORM DATA
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    // RESET PASSWORD CHANGE CODE STATES
    setPasswordChangeCode(["", "", "", "", "", ""]);
  };
  // RESET RECOVERY EMAIL FLOW
  const handleResetRecoveryEmailFlow = (): void => {
    // CANCEL RECOVERY EMAIL PROCESS ON BACKEND IF IN PROGRESS
    if (
      recoveryEmailAddStep !== "request" ||
      recoveryEmailUpdateStep !== "request" ||
      recoveryEmailRemoveStep !== "request"
    ) {
      cancelRecoveryEmail({ type: recoveryEmailStep }).catch(() => {
        // SILENTLY FAIL - CLEANUP WILL HAPPEN ON BACKEND
      });
    }
    // SETTING RECOVERY EMAIL STEP BASED ON WHETHER USER HAS RECOVERY EMAIL
    if (user?.recoveryEmail && user?.recoveryEmailVerified) {
      // SETTING RECOVERY EMAIL STEP TO UPDATE
      setRecoveryEmailStep("update");
    } else {
      // SETTING RECOVERY EMAIL STEP TO ADD
      setRecoveryEmailStep("add");
    }
    // SETTING RECOVERY EMAIL ADD STEP TO REQUEST
    setRecoveryEmailAddStep("request");
    // SETTING RECOVERY EMAIL UPDATE STEP TO REQUEST
    setRecoveryEmailUpdateStep("request");
    // SETTING RECOVERY EMAIL REMOVE STEP TO REQUEST
    setRecoveryEmailRemoveStep("request");
    // RESET FORM DATA
    setFormData((prev) => ({
      ...prev,
      recoveryEmail: "",
      newRecoveryEmail: "",
    }));
    // RESET RECOVERY EMAIL CODE STATES
    setRecoveryEmailCode(["", "", "", "", "", ""]);
  };
  // HANDLE REQUEST ADD RECOVERY EMAIL
  const handleRequestAddRecoveryEmail = (): void => {
    // IF NO RECOVERY EMAIL, SHOW ERROR MODAL
    if (!formData.recoveryEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Recovery email address is required.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    // VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // IF EMAIL FORMAT IS INVALID, SHOW ERROR MODAL
    if (!emailRegex.test(formData.recoveryEmail)) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Email",
        message: "Please provide a valid email address.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    // REQUESTING ADD RECOVERY EMAIL CODE
    requestAddRecoveryEmail({ recoveryEmail: formData.recoveryEmail })
      .then(() => {
        // SETTING RECOVERY EMAIL ADD STEP TO VERIFY
        setRecoveryEmailAddStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your recovery email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE VERIFY ADD RECOVERY EMAIL
  const handleVerifyAddRecoveryEmail = (): void => {
    // GETTING CODE FROM RECOVERY EMAIL CODE STATES
    const code = recoveryEmailCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    verifyAddRecoveryEmail({ code })
      .then(() => {
        // SETTING RECOVERY EMAIL ADD STEP TO REQUEST
        setRecoveryEmailAddStep("request");
        // RESET FORM DATA
        setFormData((prev) => ({ ...prev, recoveryEmail: "" }));
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Recovery Email Added",
          message:
            "Your recovery email has been successfully added! Confirmation email has been sent to your primary email.",
        });
        // SETTING RECOVERY EMAIL STEP TO UPDATE
        setRecoveryEmailStep("update");
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        recoveryEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE REQUEST UPDATE RECOVERY EMAIL
  const handleRequestUpdateRecoveryEmail = (): void => {
    // IF NO NEW RECOVERY EMAIL, SHOW ERROR MODAL
    if (!formData.newRecoveryEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New recovery email address is required.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    // VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // IF EMAIL FORMAT IS INVALID, SHOW ERROR MODAL
    if (!emailRegex.test(formData.newRecoveryEmail)) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Email",
        message: "Please provide a valid email address.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    requestUpdateRecoveryEmail({ newRecoveryEmail: formData.newRecoveryEmail })
      .then(() => {
        // SETTING RECOVERY EMAIL UPDATE STEP TO VERIFY CURRENT
        setRecoveryEmailUpdateStep("verifyCurrent");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message:
            "Verification code sent to your current recovery email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE VERIFY UPDATE RECOVERY EMAIL CURRENT
  const handleVerifyUpdateRecoveryEmailCurrent = (): void => {
    // GETTING CODE FROM RECOVERY EMAIL CODE STATES
    const code = recoveryEmailCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    // IF NO NEW RECOVERY EMAIL, SHOW ERROR MODAL
    if (!formData.newRecoveryEmail) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "New recovery email address is required.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    verifyUpdateRecoveryEmailCurrent({
      code,
      newRecoveryEmail: formData.newRecoveryEmail,
    })
      .then(() => {
        // SETTING RECOVERY EMAIL UPDATE STEP TO VERIFY NEW
        setRecoveryEmailUpdateStep("verifyNew");
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Email Verified",
          message:
            "Current recovery email verified. Verification code sent to your new recovery email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        recoveryEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE VERIFY UPDATE RECOVERY EMAIL NEW
  const handleVerifyUpdateRecoveryEmailNew = (): void => {
    // GETTING CODE FROM RECOVERY EMAIL CODE STATES
    const code = recoveryEmailCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    verifyUpdateRecoveryEmailNew({ code })
      .then(() => {
        // SETTING RECOVERY EMAIL UPDATE STEP TO REQUEST
        setRecoveryEmailUpdateStep("request");
        // RESET FORM DATA
        setFormData((prev) => ({ ...prev, newRecoveryEmail: "" }));
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Recovery Email Updated",
          message:
            "Your recovery email has been successfully updated! Confirmation email has been sent to your primary email.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        recoveryEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE REQUEST REMOVE RECOVERY EMAIL
  const handleRequestRemoveRecoveryEmail = (): void => {
    // REQUESTING REMOVE RECOVERY EMAIL CODE
    requestRemoveRecoveryEmail()
      .then(() => {
        // SETTING RECOVERY EMAIL REMOVE STEP TO VERIFY
        setRecoveryEmailRemoveStep("verify");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Sent",
          message: "Verification code sent to your primary email address.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send verification code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // HANDLE VERIFY REMOVE RECOVERY EMAIL
  const handleVerifyRemoveRecoveryEmail = (): void => {
    // GETTING CODE FROM RECOVERY EMAIL CODE STATES
    const code = recoveryEmailCode.join("");
    // IF CODE IS NOT 6 DIGITS, SHOW ERROR MODAL
    if (code.length !== 6) {
      setModalState({
        isOpen: true,
        type: "error",
        title: "Invalid Code",
        message: "Please enter the complete 6-digit code.",
      });
      // RETURNING FROM THE FUNCTION
      return;
    }
    verifyRemoveRecoveryEmail({ code })
      .then(() => {
        // SETTING RECOVERY EMAIL REMOVE STEP TO REQUEST
        setRecoveryEmailRemoveStep("request");
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // SETTING RECOVERY EMAIL STEP TO ADD
        setRecoveryEmailStep("add");
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Recovery Email Removed",
          message:
            "Your recovery email has been successfully removed! Confirmation email has been sent to your primary email.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify code. Please check and try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Verification Failed",
          message: errorMessage,
        });
        // RESET RECOVERY EMAIL CODE STATES
        setRecoveryEmailCode(["", "", "", "", "", ""]);
        // FOCUS ON FIRST INPUT
        recoveryEmailCodeRefs.current[0]?.focus();
      });
  };
  // HANDLE RESEND RECOVERY EMAIL CODE
  const handleResendRecoveryEmailCode = (): void => {
    resendRecoveryEmailCode({ type: recoveryEmailStep })
      .then(() => {
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Code Resent",
          message: "New verification code sent successfully.",
        });
      })
      .catch((error) => {
        // GET ERROR MESSAGE FROM RESPONSE
        const errorMessage =
          error.response?.data?.message ||
          "Failed to resend code. Please try again.";
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      });
  };
  // AUTO-FOCUS FIRST OTP INPUT
  useEffect(() => {
    // IF EMAIL STEP IS VERIFY CURRENT, FOCUS ON FIRST CURRENT EMAIL CODE INPUT
    if (emailStep === "verifyCurrent") {
      currentEmailCodeRefs.current[0]?.focus();
    } else if (emailStep === "verifyNew") {
      // IF EMAIL STEP IS VERIFY NEW, FOCUS ON FIRST NEW EMAIL CODE INPUT
      newEmailCodeRefs.current[0]?.focus();
    } else if (passwordStep === "verify") {
      // IF PASSWORD STEP IS VERIFY, FOCUS ON FIRST PASSWORD CHANGE CODE INPUT
      passwordChangeCodeRefs.current[0]?.focus();
    } else if (
      recoveryEmailAddStep === "verify" ||
      recoveryEmailUpdateStep === "verifyCurrent" ||
      recoveryEmailUpdateStep === "verifyNew" ||
      recoveryEmailRemoveStep === "verify"
    ) {
      // IF RECOVERY EMAIL STEP IS VERIFY, FOCUS ON FIRST RECOVERY EMAIL CODE INPUT
      recoveryEmailCodeRefs.current[0]?.focus();
    }
  }, [
    emailStep,
    passwordStep,
    recoveryEmailAddStep,
    recoveryEmailUpdateStep,
    recoveryEmailRemoveStep,
  ]);
  // SET RECOVERY EMAIL STEP BASED ON USER STATE
  useEffect(() => {
    if (user?.recoveryEmail && user?.recoveryEmailVerified) {
      setRecoveryEmailStep("update");
    } else {
      setRecoveryEmailStep("add");
    }
  }, [user?.recoveryEmail, user?.recoveryEmailVerified]);
  // RETURNING THE ACCOUNT COMPONENT
  return (
    // ACCOUNT MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6 shadow-sm">
      {/* HEADER SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xl font-semibold">Account</p>
        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--light-text)]">
          Manage your account settings and security preferences.
        </p>
      </div>
      {/* SUB-TABS */}
      <div className="border-b border-[var(--border)]">
        <div className="flex gap-2">
          {/* CHANGE EMAIL TAB */}
          <button
            onClick={() => {
              setActiveTab("email");
              handleResetEmailFlow();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "email"
                ? "bg-[var(--inside-card-bg)] text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            Change Email
          </button>
          {/* CHANGE PASSWORD TAB */}
          <button
            onClick={() => {
              setActiveTab("password");
              handleResetPasswordFlow();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "password"
                ? "bg-[var(--inside-card-bg)] text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            Change Password
          </button>
          {/* RECOVERY EMAIL TAB */}
          <button
            onClick={() => {
              setActiveTab("recovery");
              handleResetRecoveryEmailFlow();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "recovery"
                ? "bg-[var(--inside-card-bg)] text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            Recovery Email
          </button>
          {/* DELETE ACCOUNT TAB */}
          <button
            onClick={() => setActiveTab("delete")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === "delete"
                ? "bg-[var(--inside-card-bg)] text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            Delete Account
          </button>
        </div>
      </div>
      {/* TAB CONTENT */}
      <div className="pt-4">
        {/* CHANGE EMAIL TAB CONTENT */}
        {activeTab === "email" && (
          <div className="space-y-6">
            {/* CURRENT EMAIL INFO */}
            <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] space-y-2">
              <div>
                <p className="text-sm text-[var(--light-text)] mb-1">
                  Current Email
                </p>
                <p className="text-base font-medium">{currentEmail || "N/A"}</p>
              </div>
              {/* OAUTH INFO */}
              {(() => {
                const userWithProvider = user as User & {
                  provider?: string;
                  providerEmail?: string;
                };
                return (
                  userWithProvider?.provider && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <p className="text-xs text-[var(--light-text)]">
                        Account created via{" "}
                        <span className="font-medium capitalize">
                          {userWithProvider.provider}
                        </span>
                        {userWithProvider.providerEmail &&
                          userWithProvider.providerEmail !== currentEmail && (
                            <>
                              <br />
                              <span className="text-[var(--light-text)]">
                                Original OAuth email:{" "}
                                <span className="font-medium">
                                  {userWithProvider.providerEmail}
                                </span>
                              </span>
                            </>
                          )}
                        <br />
                        <span className="text-[var(--light-text)] italic">
                          Note: Your OAuth account information will be
                          automatically synced the next time you log in with{" "}
                          <span className="font-medium capitalize">
                            {userWithProvider.provider}
                          </span>
                          .
                        </span>
                      </p>
                    </div>
                  )
                );
              })()}
            </div>
            {/* NEW EMAIL INPUT STEP */}
            {emailStep === "newEmail" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="newEmail"
                    className="block text-sm font-medium mb-2"
                  >
                    New Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      className="absolute left-3 text-[var(--accent-color)]"
                      size={18}
                    />
                    <input
                      type="email"
                      id="newEmail"
                      name="newEmail"
                      value={formData.newEmail}
                      onChange={handleChange}
                      placeholder="Enter new email address"
                      className="w-full pl-10 pr-10 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                      disabled={isSendingCurrentCode}
                    />
                    {formData.newEmail && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, newEmail: "" }))
                        }
                        className="absolute right-3 p-1 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer"
                      >
                        <X size={16} className="text-[var(--light-text)]" />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSendCurrentEmailCode}
                  disabled={!formData.newEmail || isSendingCurrentCode}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isSendingCurrentCode ? (
                    <>
                      <RotateCcw size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={18} />
                      Continue
                    </>
                  )}
                </button>
              </div>
            )}
            {/* VERIFY CURRENT EMAIL STEP */}
            {emailStep === "verifyCurrent" && (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    A verification code has been sent to{" "}
                    <strong>{currentEmail}</strong>. Please enter the code to
                    verify your current email.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {currentEmailCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          currentEmailCodeRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index,
                            setCurrentEmailCode,
                            currentEmailCodeRefs
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(
                            e,
                            index,
                            setCurrentEmailCode,
                            currentEmailCodeRefs
                          )
                        }
                        className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        disabled={isVerifyingCurrentCode || isResendingCode}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetEmailFlow}
                      disabled={isCancelling}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={handleVerifyCurrentEmail}
                      disabled={
                        currentEmailCode.some((d) => !d) ||
                        isVerifyingCurrentCode ||
                        isResendingCode
                      }
                      className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      {isVerifyingCurrentCode ? (
                        <>
                          <RotateCcw size={18} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleResendCode("current")}
                    disabled={isResendingCode || isVerifyingCurrentCode}
                    className="w-full px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                  >
                    {isResendingCode ? (
                      <>
                        <RotateCcw size={16} className="animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* VERIFY NEW EMAIL STEP */}
            {emailStep === "verifyNew" && (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    A verification code has been sent to{" "}
                    <strong>{formData.newEmail}</strong>. Please enter the code
                    to verify your new email.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {newEmailCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          newEmailCodeRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index,
                            setNewEmailCode,
                            newEmailCodeRefs
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(
                            e,
                            index,
                            setNewEmailCode,
                            newEmailCodeRefs
                          )
                        }
                        className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        disabled={isVerifyingNewCode || isResendingCode}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEmailStep("verifyCurrent")}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button
                      onClick={handleVerifyNewEmail}
                      disabled={
                        newEmailCode.some((d) => !d) ||
                        isVerifyingNewCode ||
                        isResendingCode
                      }
                      className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      {isVerifyingNewCode ? (
                        <>
                          <RotateCcw size={18} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Verify & Update Email
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleResendCode("new")}
                    disabled={isResendingCode || isVerifyingNewCode}
                    className="w-full px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                  >
                    {isResendingCode ? (
                      <>
                        <RotateCcw size={16} className="animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* CHANGE PASSWORD TAB CONTENT */}
        {activeTab === "password" && (
          <div className="space-y-6">
            {/* REQUEST VERIFICATION STEP */}
            {passwordStep === "request" && (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    To change your password, we need to verify your identity. A
                    verification code will be sent to{" "}
                    <strong>{currentEmail}</strong>.
                  </p>
                </div>
                <button
                  onClick={handleSendPasswordCode}
                  disabled={isSendingCode}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isSendingCode ? (
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
            {/* VERIFY CODE STEP */}
            {passwordStep === "verify" && (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    A verification code has been sent to{" "}
                    <strong>{currentEmail}</strong>. Please enter the code to
                    continue.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {passwordChangeCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          passwordChangeCodeRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index,
                            setPasswordChangeCode,
                            passwordChangeCodeRefs
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(
                            e,
                            index,
                            setPasswordChangeCode,
                            passwordChangeCodeRefs
                          )
                        }
                        className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleResetPasswordFlow}
                      disabled={isCancellingPasswordChange}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={handleVerifyPasswordCode}
                      disabled={
                        passwordChangeCode.some((d) => !d) || isVerifyingCode
                      }
                      className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      {isVerifyingCode ? (
                        <>
                          <RotateCcw size={18} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => resendPasswordCode()}
                    disabled={isResendingPasswordCode || isVerifyingCode}
                    className="w-full px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                  >
                    {isResendingPasswordCode ? (
                      <>
                        <RotateCcw size={16} className="animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* CHANGE PASSWORD STEP */}
            {passwordStep === "change" && (
              <div className="space-y-4">
                {/* NEW PASSWORD */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      className="absolute left-3 text-[var(--light-text)]"
                      size={18}
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-20 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 p-1 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff
                          size={18}
                          className="text-[var(--light-text)]"
                        />
                      ) : (
                        <Eye size={18} className="text-[var(--light-text)]" />
                      )}
                    </button>
                  </div>
                  {/* PASSWORD VALIDATION CONDITIONS */}
                  {formData.newPassword && (
                    <div className="mt-2 space-y-1.5">
                      <ConditionItem
                        label="At least 8 characters"
                        passed={hasMinLength}
                      />
                      <ConditionItem
                        label="Contains lowercase letter"
                        passed={hasLower}
                      />
                      <ConditionItem
                        label="Contains uppercase letter"
                        passed={hasUpper}
                      />
                      <ConditionItem label="Contains digit" passed={hasDigit} />
                      <ConditionItem
                        label="Contains special character"
                        passed={hasSpecial}
                      />
                    </div>
                  )}
                </div>
                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      className="absolute left-3 text-[var(--light-text)]"
                      size={18}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-20 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 p-1 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={18}
                          className="text-[var(--light-text)]"
                        />
                      ) : (
                        <Eye size={18} className="text-[var(--light-text)]" />
                      )}
                    </button>
                  </div>
                  {/* PASSWORD MATCH VALIDATION */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      <ConditionItem
                        label="Passwords match"
                        passed={passwordsMatch}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPasswordStep("verify")}
                    className="px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      !formData.newPassword ||
                      !formData.confirmPassword ||
                      !hasMinLength ||
                      !hasLower ||
                      !hasUpper ||
                      !hasDigit ||
                      !hasSpecial ||
                      !passwordsMatch ||
                      isChangingPassword
                    }
                    className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    {isChangingPassword ? (
                      <>
                        <RotateCcw size={18} className="animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock
                          size={18}
                          className="text-[var(--accent-color)]"
                        />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* RECOVERY EMAIL TAB CONTENT */}
        {activeTab === "recovery" && (
          <div className="space-y-6">
            {/* RECOVERY EMAIL INFO */}
            <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] space-y-2">
              <div>
                <p className="text-sm text-[var(--light-text)] mb-1">
                  Recovery Email Status
                </p>
                <p className="text-base font-medium text-[var(--text-primary)]">
                  {user?.recoveryEmail && user?.recoveryEmailVerified
                    ? user.recoveryEmail
                    : "Not Set"}
                </p>
              </div>
              {user?.recoveryEmail && user?.recoveryEmailVerified && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Verified
                </p>
              )}
            </div>
            {/* ADD RECOVERY EMAIL SECTION */}
            {recoveryEmailStep === "add" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Add Recovery Email
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Add a recovery email to help you regain access to your
                    account if you lose access to your primary email.
                  </p>
                </div>
                {/* REQUEST STEP */}
                {recoveryEmailAddStep === "request" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        A verification code will be sent to the recovery email
                        address you provide. This email will be used for account
                        recovery and security notifications.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="recoveryEmail"
                        className="block text-sm font-medium text-[var(--text-primary)]"
                      >
                        Recovery Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                        />
                        <input
                          type="email"
                          id="recoveryEmail"
                          name="recoveryEmail"
                          value={formData.recoveryEmail}
                          onChange={handleChange}
                          placeholder="Enter recovery email address"
                          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleRequestAddRecoveryEmail}
                      disabled={isRequestingAddCode || !formData.recoveryEmail}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      {isRequestingAddCode ? (
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
                {/* VERIFY STEP */}
                {recoveryEmailAddStep === "verify" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        Enter the 6-digit verification code sent to{" "}
                        <strong>{formData.recoveryEmail}</strong>
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {recoveryEmailCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            recoveryEmailCodeRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e.target.value,
                              index,
                              setRecoveryEmailCode,
                              recoveryEmailCodeRefs
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !recoveryEmailCode[index] &&
                              index > 0
                            ) {
                              recoveryEmailCodeRefs.current[index - 1]?.focus();
                              e.preventDefault();
                              setRecoveryEmailCode((prev) => {
                                const newOtp = [...prev];
                                newOtp[index - 1] = "";
                                return newOtp;
                              });
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyAddRecoveryEmail}
                        disabled={
                          recoveryEmailCode.some((d) => !d) ||
                          isVerifyingAddCode
                        }
                        className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      >
                        {isVerifyingAddCode ? (
                          <>
                            <RotateCcw size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Verify & Add
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleResendRecoveryEmailCode}
                        disabled={isResendingRecoveryCode || isVerifyingAddCode}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        {isResendingRecoveryCode ? (
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
                        onClick={() => {
                          setRecoveryEmailAddStep("request");
                          setRecoveryEmailCode(["", "", "", "", "", ""]);
                          cancelRecoveryEmail({ type: "add" }).catch(() => {});
                        }}
                        disabled={isCancellingRecovery}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setRecoveryEmailAddStep("request");
                        setRecoveryEmailCode(["", "", "", "", "", ""]);
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* UPDATE RECOVERY EMAIL SECTION */}
            {recoveryEmailStep === "update" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Update Recovery Email
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Update your recovery email address. You'll need to verify
                    both your current recovery email and the new one.
                  </p>
                </div>
                {/* CURRENT RECOVERY EMAIL INFO */}
                <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                  <p className="text-sm text-[var(--text-primary)]">
                    Current Recovery Email:{" "}
                    <strong>{user?.recoveryEmail}</strong>
                  </p>
                </div>
                {/* REQUEST STEP */}
                {recoveryEmailUpdateStep === "request" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="newRecoveryEmail"
                        className="block text-sm font-medium text-[var(--text-primary)]"
                      >
                        New Recovery Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                        />
                        <input
                          type="email"
                          id="newRecoveryEmail"
                          name="newRecoveryEmail"
                          value={formData.newRecoveryEmail}
                          onChange={handleChange}
                          placeholder="Enter new recovery email address"
                          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleRequestUpdateRecoveryEmail}
                      disabled={
                        isRequestingUpdateCode || !formData.newRecoveryEmail
                      }
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    >
                      {isRequestingUpdateCode ? (
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
                {/* VERIFY CURRENT STEP */}
                {recoveryEmailUpdateStep === "verifyCurrent" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        Enter the 6-digit verification code sent to your current
                        recovery email: <strong>{user?.recoveryEmail}</strong>
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {recoveryEmailCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            recoveryEmailCodeRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e.target.value,
                              index,
                              setRecoveryEmailCode,
                              recoveryEmailCodeRefs
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !recoveryEmailCode[index] &&
                              index > 0
                            ) {
                              recoveryEmailCodeRefs.current[index - 1]?.focus();
                              e.preventDefault();
                              setRecoveryEmailCode((prev) => {
                                const newOtp = [...prev];
                                newOtp[index - 1] = "";
                                return newOtp;
                              });
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyUpdateRecoveryEmailCurrent}
                        disabled={
                          recoveryEmailCode.some((d) => !d) ||
                          isVerifyingUpdateCurrentCode
                        }
                        className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      >
                        {isVerifyingUpdateCurrentCode ? (
                          <>
                            <RotateCcw size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Verify
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleResendRecoveryEmailCode}
                        disabled={
                          isResendingRecoveryCode ||
                          isVerifyingUpdateCurrentCode
                        }
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        {isResendingRecoveryCode ? (
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
                        onClick={() => {
                          setRecoveryEmailUpdateStep("request");
                          setRecoveryEmailCode(["", "", "", "", "", ""]);
                          cancelRecoveryEmail({ type: "update" }).catch(
                            () => {}
                          );
                        }}
                        disabled={isCancellingRecovery}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setRecoveryEmailUpdateStep("request");
                        setRecoveryEmailCode(["", "", "", "", "", ""]);
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  </div>
                )}
                {/* VERIFY NEW STEP */}
                {recoveryEmailUpdateStep === "verifyNew" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        Enter the 6-digit verification code sent to your new
                        recovery email:{" "}
                        <strong>{formData.newRecoveryEmail}</strong>
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {recoveryEmailCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            recoveryEmailCodeRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e.target.value,
                              index,
                              setRecoveryEmailCode,
                              recoveryEmailCodeRefs
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !recoveryEmailCode[index] &&
                              index > 0
                            ) {
                              recoveryEmailCodeRefs.current[index - 1]?.focus();
                              e.preventDefault();
                              setRecoveryEmailCode((prev) => {
                                const newOtp = [...prev];
                                newOtp[index - 1] = "";
                                return newOtp;
                              });
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyUpdateRecoveryEmailNew}
                        disabled={
                          recoveryEmailCode.some((d) => !d) ||
                          isVerifyingUpdateNewCode
                        }
                        className="flex-1 px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      >
                        {isVerifyingUpdateNewCode ? (
                          <>
                            <RotateCcw size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Verify & Update
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleResendRecoveryEmailCode}
                        disabled={
                          isResendingRecoveryCode || isVerifyingUpdateNewCode
                        }
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        {isResendingRecoveryCode ? (
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
                        onClick={() => {
                          setRecoveryEmailUpdateStep("verifyCurrent");
                          setRecoveryEmailCode(["", "", "", "", "", ""]);
                        }}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    </div>
                  </div>
                )}
                {/* REMOVE RECOVERY EMAIL OPTION */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Remove Recovery Email
                      </h4>
                      <p className="text-sm text-[var(--light-text)]">
                        Remove your recovery email from your account. You'll
                        need to verify your identity using your primary email.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setRecoveryEmailStep("remove");
                        setRecoveryEmailRemoveStep("request");
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-500 dark:text-red-400 border border-red-500/30 dark:border-red-800 rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* REMOVE RECOVERY EMAIL SECTION */}
            {recoveryEmailStep === "remove" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Remove Recovery Email
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Remove your recovery email from your account. This will
                    reduce your account recovery options.
                  </p>
                </div>
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    <strong className="text-red-500 dark:text-red-400">
                      ⚠️ Warning:
                    </strong>{" "}
                    Without a recovery email, you may have difficulty recovering
                    your account if you lose access to your primary email.
                  </p>
                </div>
                {/* REQUEST STEP */}
                {recoveryEmailRemoveStep === "request" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        A verification code will be sent to your primary email
                        address: <strong>{currentEmail}</strong>
                      </p>
                    </div>
                    <button
                      onClick={handleRequestRemoveRecoveryEmail}
                      disabled={isRequestingRemoveCode}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isRequestingRemoveCode ? (
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
                {/* VERIFY STEP */}
                {recoveryEmailRemoveStep === "verify" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                      <p className="text-sm text-[var(--text-primary)]">
                        Enter the 6-digit verification code sent to your primary
                        email: <strong>{currentEmail}</strong>
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {recoveryEmailCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            recoveryEmailCodeRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e.target.value,
                              index,
                              setRecoveryEmailCode,
                              recoveryEmailCodeRefs
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !recoveryEmailCode[index] &&
                              index > 0
                            ) {
                              recoveryEmailCodeRefs.current[index - 1]?.focus();
                              e.preventDefault();
                              setRecoveryEmailCode((prev) => {
                                const newOtp = [...prev];
                                newOtp[index - 1] = "";
                                return newOtp;
                              });
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-semibold border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyRemoveRecoveryEmail}
                        disabled={
                          recoveryEmailCode.some((d) => !d) ||
                          isVerifyingRemoveCode
                        }
                        className="flex-1 px-6 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isVerifyingRemoveCode ? (
                          <>
                            <RotateCcw size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Verify & Remove
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleResendRecoveryEmailCode}
                        disabled={
                          isResendingRecoveryCode || isVerifyingRemoveCode
                        }
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        {isResendingRecoveryCode ? (
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
                        onClick={() => {
                          setRecoveryEmailRemoveStep("request");
                          setRecoveryEmailCode(["", "", "", "", "", ""]);
                          cancelRecoveryEmail({ type: "remove" }).catch(
                            () => {}
                          );
                        }}
                        disabled={isCancellingRecovery}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-[var(--text-primary)]"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setRecoveryEmailRemoveStep("request");
                        setRecoveryEmailCode(["", "", "", "", "", ""]);
                        setRecoveryEmailStep("update");
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* DELETE ACCOUNT TAB CONTENT */}
        {activeTab === "delete" && (
          <div className="space-y-6">
            {/* WARNING MESSAGE */}
            <div className="p-6 bg-[var(--inside-card-bg)] border-2 border-[var(--border)] rounded-lg">
              <div className="flex items-start gap-3">
                <Shield
                  className="text-[var(--accent-color)] mt-0.5"
                  size={24}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Delete Your Account
                  </h3>
                  <p className="text-sm text-[var(--text-primary)] mb-4">
                    Once you delete your account, it will be flagged for
                    deletion. You will have <strong>30 days</strong> to log in
                    and reactivate your account. After 30 days, your account and
                    all data will be permanently deleted:
                  </p>
                  <ul className="list-disc list-inside text-sm text-[var(--text-primary)] space-y-1 mb-4">
                    <li>All your projects and tasks</li>
                    <li>Your profile information</li>
                    <li>All your settings and preferences</li>
                    <li>Your account history</li>
                  </ul>
                  <p className="text-sm text-[var(--text-primary)]">
                    Please be certain before proceeding.
                  </p>
                </div>
              </div>
            </div>
            {/* STEP 1: REQUEST VERIFICATION CODE */}
            {deletionStep === "request" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                    1
                  </div>
                  <span>Request Verification Code</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  Click the button below to receive a verification code via
                  email. This code is required to proceed with account deletion.
                </p>
                <button
                  onClick={handleSendDeletionCode}
                  disabled={isSendingDeletionCode}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isSendingDeletionCode ? (
                    <>
                      <RotateCcw size={18} className="animate-spin" />
                      Sending Code...
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
            {deletionStep === "verify" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                    2
                  </div>
                  <span>Verify Code</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  Enter the 6-digit verification code sent to your email
                  address.
                </p>
                <div className="flex gap-2 justify-center">
                  {deletionCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        deletionCodeRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          index,
                          setDeletionCode,
                          deletionCodeRefs
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(
                          e,
                          index,
                          setDeletionCode,
                          deletionCodeRefs
                        )
                      }
                      className="w-12 h-12 text-center text-lg font-semibold border-2 border-[var(--border)] rounded-lg focus:border-red-500 dark:focus:border-red-500 focus:outline-none bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVerifyDeletionCode}
                    disabled={
                      isVerifyingDeletionCode ||
                      deletionCode.join("").length !== 6
                    }
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: "var(--accent-color)" }}
                  >
                    {isVerifyingDeletionCode ? (
                      <>
                        <RotateCcw size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Verify Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleResendDeletionCode}
                    disabled={isResendingDeletionCode}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium border border-[var(--border)] hover:bg-[var(--hover-bg)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-[var(--text-primary)]"
                  >
                    {isResendingDeletionCode ? (
                      <>
                        <RotateCcw size={18} className="animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={18} />
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleResetDeletionFlow}
                  disabled={isCancellingDeletion}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent-color)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </div>
            )}
            {/* STEP 3: CONFIRM DELETION */}
            {deletionStep === "confirm" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--inside-card-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-color)] font-semibold">
                    3
                  </div>
                  <span>Confirm Deletion</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  Your verification code has been verified. Click the button
                  below to confirm account deletion.
                </p>
                <div className="p-4 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
                  <p className="text-sm text-[var(--text-primary)]">
                    <strong>Important:</strong> After confirming, your account
                    will be flagged for deletion. You will be logged out and
                    have 30 days to log in and reactivate your account. After 30
                    days, your account will be permanently deleted.
                  </p>
                </div>
                <button
                  onClick={handleConfirmDeletion}
                  disabled={isConfirmingDeletion}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  {isConfirmingDeletion ? (
                    <>
                      <RotateCcw size={18} className="animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Confirm Account Deletion
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelDeletion}
                  disabled={isCancellingDeletion}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent-color)] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <X size={16} />
                  Cancel Deletion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        showCancel={modalState.type === "warning"}
      />
    </div>
  );
};

export default Account;
