// <== IMPORTS ==>
import {
  JSX,
  useState,
  useRef,
  useEffect,
  FormEvent,
  useCallback,
} from "react";
import {
  useRequestDeviceVerification,
  useVerifyDeviceCode,
  useVerifyDevice2FA,
} from "../../hooks/useDeviceVerification";
import { X, Shield, Smartphone, Mail, Monitor, MapPin } from "lucide-react";

// <== DEVICE VERIFICATION MODAL PROPS ==>
type DeviceVerificationModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== DEVICE INFO ==>
  deviceInfo?: {
    // <== DEVICE TYPE ==>
    deviceType: string;
    // <== DEVICE NAME ==>
    deviceName: string;
    // <== BROWSER NAME ==>
    browserName: string;
    // <== OPERATING SYSTEM ==>
    operatingSystem: string;
    // <== LOCATION ==>
    location?: {
      // <== COUNTRY ==>
      country: string;
      // <== CITY ==>
      city: string;
      // <== REGION ==>
      region: string;
    };
  };
  // <== REQUIRES 2FA ==>
  requires2FA?: boolean;
};

// <== DEVICE VERIFICATION MODAL COMPONENT ==>
const DeviceVerificationModal = ({
  isOpen,
  onClose,
  email,
  password,
  deviceInfo,
  requires2FA: initialRequires2FA = false,
}: DeviceVerificationModalProps): JSX.Element | null => {
  // STEP STATE (email-code, 2fa, complete)
  const [step, setStep] = useState<"email-code" | "2fa" | "complete">(
    "email-code"
  );
  // EMAIL CODE STATE
  const [emailCode, setEmailCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // EMAIL CODE REFS
  const emailCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // 2FA CODE STATE
  const [twoFactorCode, setTwoFactorCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  // 2FA CODE REFS
  const twoFactorCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  // USE BACKUP CODE STATE
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  // BACKUP CODE STATE
  const [backupCode, setBackupCode] = useState<string>("");
  // REMEMBER DEVICE STATE
  const [rememberDevice, setRememberDevice] = useState<boolean>(false);
  // SESSION ID STATE
  const [sessionId, setSessionId] = useState<string>("");
  // REQUIRES 2FA STATE
  const [requires2FA, setRequires2FA] = useState<boolean>(initialRequires2FA);
  // REQUEST VERIFICATION MUTATION
  const requestVerificationMutation = useRequestDeviceVerification();
  // VERIFY CODE MUTATION
  const verifyCodeMutation = useVerifyDeviceCode();
  // VERIFY 2FA MUTATION
  const verify2FAMutation = useVerifyDevice2FA();
  // PREVENT BACKGROUND SCROLLING
  useEffect(() => {
    // IF MODAL IS OPEN, PREVENT BACKGROUND SCROLLING
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // IF MODAL IS CLOSED, ALLOW BACKGROUND SCROLLING
      document.body.style.overflow = "unset";
    }
    return () => {
      // IF MODAL IS CLOSED, ALLOW BACKGROUND SCROLLING
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  // REQUEST VERIFICATION ON OPEN (ONLY ONCE)
  const hasRequestedVerification = useRef<boolean>(false);
  useEffect(() => {
    // RESET FLAG WHEN MODAL CLOSES
    if (!isOpen) {
      hasRequestedVerification.current = false;
      return;
    }
    // IF MODAL IS OPEN AND STEP IS EMAIL CODE AND NO SESSION ID AND NOT ALREADY REQUESTED
    if (
      isOpen &&
      step === "email-code" &&
      !sessionId &&
      !hasRequestedVerification.current &&
      !requestVerificationMutation.isPending
    ) {
      // MARK AS REQUESTED TO PREVENT MULTIPLE CALLS
      hasRequestedVerification.current = true;
      // CALL REQUEST VERIFICATION MUTATION
      requestVerificationMutation.mutate(
        { email, password },
        {
          // ON SUCCESS, SET SESSION ID
          onSuccess: (data) => {
            // IF SESSION ID IS SET, SET SESSION ID
            if (data.sessionId) {
              // SET SESSION ID
              setSessionId(data.sessionId);
            }
          },
          // ON ERROR, RESET FLAG SO USER CAN RETRY
          onError: () => {
            hasRequestedVerification.current = false;
          },
        }
      );
    }
  }, [isOpen, step, sessionId, email, password, requestVerificationMutation]);
  // HANDLE EMAIL CODE CHANGE
  const handleEmailCodeChange = useCallback(
    (value: string, index: number): void => {
      // IF VALUE IS NOT A NUMBER, RETURN
      if (value && !/^[0-9]$/.test(value)) return;
      // SET EMAIL CODE
      setEmailCode((prev) => {
        // CREATE NEW CODE ARRAY
        const newCode = [...prev];
        // SET VALUE AT INDEX
        newCode[index] = value;
        // AUTO FOCUS NEXT INPUT
        if (value && index < 5) {
          // SET TIMEOUT TO FOCUS NEXT INPUT
          setTimeout(() => {
            emailCodeRefs.current[index + 1]?.focus();
          }, 0);
        }
        // RETURN NEW CODE
        return newCode;
      });
    },
    []
  );
  // HANDLE EMAIL CODE KEY DOWN
  const handleEmailCodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
      // IF BACKSPACE KEY IS PRESSED AND VALUE AT INDEX IS EMPTY AND INDEX IS GREATER THAN 0, FOCUS PREVIOUS INPUT
      if (e.key === "Backspace" && !emailCode[index] && index > 0) {
        // FOCUS PREVIOUS INPUT
        emailCodeRefs.current[index - 1]?.focus();
      }
    },
    [emailCode]
  );
  // HANDLE 2FA CODE CHANGE
  const handle2FACodeChange = useCallback(
    (value: string, index: number): void => {
      // IF VALUE IS NOT A NUMBER, RETURN
      if (value && !/^[0-9]$/.test(value)) return;
      // SET 2FA CODE
      setTwoFactorCode((prev) => {
        // CREATE NEW CODE ARRAY
        const newCode = [...prev];
        // SET VALUE AT INDEX
        newCode[index] = value;
        // AUTO FOCUS NEXT INPUT
        if (value && index < 5) {
          // SET TIMEOUT TO FOCUS NEXT INPUT
          setTimeout(() => {
            twoFactorCodeRefs.current[index + 1]?.focus();
          }, 0);
        }
        // RETURN NEW CODE
        return newCode;
      });
    },
    []
  );
  // HANDLE 2FA CODE KEY DOWN
  const handle2FACodeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
      // IF BACKSPACE KEY IS PRESSED AND VALUE AT INDEX IS EMPTY AND INDEX IS GREATER THAN 0, FOCUS PREVIOUS INPUT
      if (e.key === "Backspace" && !twoFactorCode[index] && index > 0) {
        // FOCUS PREVIOUS INPUT
        twoFactorCodeRefs.current[index - 1]?.focus();
      }
    },
    [twoFactorCode]
  );
  // HANDLE VERIFY EMAIL CODE
  const handleVerifyEmailCode = async (e: FormEvent): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // IF ALREADY PENDING, PREVENT DUPLICATE REQUESTS
    if (verifyCodeMutation.isPending) {
      return;
    }
    // GET CODE FROM EMAIL CODE
    const code = emailCode.join("");
    // IF CODE IS NOT 6 DIGITS, RETURN
    if (code.length !== 6) {
      return;
    }
    // PREPARE REQUEST DATA (SESSION ID IS OPTIONAL - BACKEND CAN FIND IT)
    const requestData: {
      email: string;
      password: string;
      code: string;
      sessionId?: string;
      rememberDevice?: boolean;
    } = {
      email,
      password,
      code,
      rememberDevice,
    };
    // IF SESSION ID EXISTS, INCLUDE IT
    if (sessionId) {
      requestData.sessionId = sessionId;
    }
    // CALL VERIFY CODE MUTATION
    verifyCodeMutation.mutate(requestData);
  };
  // HANDLE VERIFY 2FA
  const handleVerify2FA = async (e: FormEvent): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // IF USING BACKUP CODE
    if (useBackupCode) {
      // IF BACKUP CODE IS NOT PROVIDED, RETURN
      if (!backupCode.trim()) {
        return;
      }
      // CALL VERIFY 2FA MUTATION
      verify2FAMutation.mutate({
        email,
        sessionId,
        backupCode: backupCode.trim(),
      });
    } else {
      // GET CODE FROM 2FA CODE
      const code = twoFactorCode.join("");
      // IF CODE IS NOT 6 DIGITS, RETURN
      if (code.length !== 6) {
        return;
      }
      // CALL VERIFY 2FA MUTATION
      verify2FAMutation.mutate({
        email,
        sessionId,
        twoFactorToken: code,
      });
    }
  };
  // MEMOIZE ONCLOSE TO PREVENT UNNECESSARY RE-RENDERS
  const handleClose = useCallback(() => {
    // RESET STEP TO EMAIL CODE
    setStep("email-code");
    // RESET EMAIL CODE
    setEmailCode(["", "", "", "", "", ""]);
    // RESET 2FA CODE
    setTwoFactorCode(["", "", "", "", "", ""]);
    // RESET BACKUP CODE
    setBackupCode("");
    // RESET USE BACKUP CODE
    setUseBackupCode(false);
    // RESET REMEMBER DEVICE
    setRememberDevice(false);
    // RESET REQUIRES 2FA
    setRequires2FA(initialRequires2FA);
    // RESET SESSION ID
    setSessionId("");
    // RESET REQUEST FLAG
    hasRequestedVerification.current = false;
    onClose();
  }, [onClose, initialRequires2FA]);
  // RESET FORM WHEN MODAL CLOSES
  useEffect(() => {
    // IF MODAL IS CLOSED, RESET FORM STATE
    if (!isOpen) {
      // RESET STEP TO EMAIL CODE
      setStep("email-code");
      // RESET EMAIL CODE
      setEmailCode(["", "", "", "", "", ""]);
      // RESET 2FA CODE
      setTwoFactorCode(["", "", "", "", "", ""]);
      // RESET BACKUP CODE
      setBackupCode("");
      // RESET USE BACKUP CODE
      setUseBackupCode(false);
      // RESET REMEMBER DEVICE
      setRememberDevice(false);
      // RESET REQUIRES 2FA
      setRequires2FA(initialRequires2FA);
      // RESET SESSION ID
      setSessionId("");
      // RESET REQUEST FLAG
      hasRequestedVerification.current = false;
    }
  }, [isOpen, initialRequires2FA]);

  // UPDATE STEP BASED ON MUTATION SUCCESS
  useEffect(() => {
    // IF VERIFY CODE MUTATION IS SUCCESS AND DATA IS SET
    if (verifyCodeMutation.isSuccess && verifyCodeMutation.data) {
      // IF 2FA IS REQUIRED, SET STEP TO 2FA
      if (verifyCodeMutation.data.requires2FA) {
        // SET REQUIRES 2FA TO TRUE
        setRequires2FA(true);
        // SET STEP TO 2FA
        setStep("2fa");
      } else {
        // CLOSE MODAL
        handleClose();
      }
      // IF SESSION ID IS SET, SET SESSION ID
      if (verifyCodeMutation.data.sessionId) {
        // SET SESSION ID
        setSessionId(verifyCodeMutation.data.sessionId);
      }
    }
  }, [verifyCodeMutation.isSuccess, verifyCodeMutation.data, handleClose]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="text-violet-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Device Verification
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {/* CONTENT */}
        <div className="p-6">
          {/* DEVICE INFO */}
          {deviceInfo && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Monitor size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login Attempt Details
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Device:</span>
                  <span>{deviceInfo.deviceName || "Unknown Device"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Browser:</span>
                  <span>{deviceInfo.browserName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">OS:</span>
                  <span>{deviceInfo.operatingSystem}</span>
                </div>
                {deviceInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>
                      {deviceInfo.location.city}, {deviceInfo.location.region},{" "}
                      {deviceInfo.location.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* EMAIL CODE STEP */}
          {step === "email-code" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="text-violet-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Verify Your Email
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                We've sent a verification code to <strong>{email}</strong>.
                Please enter the code below to verify this device.
              </p>
              <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {emailCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          emailCodeRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleEmailCodeChange(e.target.value, index)
                        }
                        onKeyDown={(e) => handleEmailCodeKeyDown(e, index)}
                        disabled={
                          verifyCodeMutation.isPending ||
                          requestVerificationMutation.isPending
                        }
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={
                    verifyCodeMutation.isPending ||
                    requestVerificationMutation.isPending ||
                    emailCode.join("").length !== 6
                  }
                  className="w-full py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyCodeMutation.isPending ||
                  requestVerificationMutation.isPending
                    ? "Verifying..."
                    : "Verify Code"}
                </button>
              </form>
            </div>
          )}
          {/* 2FA STEP */}
          {step === "2fa" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-violet-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Two-Factor Authentication
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter the 6-digit code from your authenticator app to complete
                login.
              </p>
              {!useBackupCode ? (
                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                      Authentication Code
                    </label>
                    <div className="flex gap-2 justify-center">
                      {twoFactorCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            twoFactorCodeRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handle2FACodeChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handle2FACodeKeyDown(e, index)}
                          disabled={verify2FAMutation.isPending}
                          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setUseBackupCode(true)}
                      className="text-sm text-violet-500 font-semibold hover:underline"
                    >
                      Use Backup Code Instead
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={
                      verify2FAMutation.isPending ||
                      twoFactorCode.join("").length !== 6
                    }
                    className="w-full py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verify2FAMutation.isPending ? "Verifying..." : "Verify"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                      Backup Code
                    </label>
                    <div className="relative flex items-center">
                      <Smartphone
                        className="absolute left-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value)}
                        placeholder="Enter backup code"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        autoFocus
                      />
                      {backupCode && (
                        <button
                          type="button"
                          onClick={() => setBackupCode("")}
                          className="absolute right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupCode(false);
                        setBackupCode("");
                      }}
                      className="text-sm text-violet-500 font-semibold hover:underline"
                    >
                      Use Authenticator Code Instead
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={verify2FAMutation.isPending || !backupCode.trim()}
                    className="w-full py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verify2FAMutation.isPending ? "Verifying..." : "Verify"}
                  </button>
                </form>
              )}
            </div>
          )}
          {/* REMEMBER DEVICE CHECKBOX (SHOW BEFORE COMPLETING) */}
          {step === "email-code" && !requires2FA && (
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 text-violet-500 rounded focus:ring-violet-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Remember this device (don't ask for verification again)
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceVerificationModal;
