// <== IMPORTS ==>
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Loader2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  useRequestPasswordReset,
  useResetPassword,
} from "../hooks/usePasswordReset";
import { toast } from "../lib/toast";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useState, useRef, useEffect, FormEvent, JSX } from "react";

// <== CONDITION ITEM COMPONENT ==>
const ConditionItem = ({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) => (
  <div
    className={`w-full flex items-center gap-2 p-1.5 rounded ${
      passed ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"
    }`}
  >
    {passed ? (
      <CheckCircle2 size={16} className="text-violet-600" />
    ) : (
      <Lock size={16} className="text-gray-400" />
    )}
    <span className="text-xs">{label}</span>
  </div>
);

// <== FORGOT PASSWORD PAGE COMPONENT ==>
const ForgotPasswordPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Forgot Password");
  // STEP STATE (1: ENTER EMAIL, 2: ENTER CODE AND NEW PASSWORD)
  const [step, setStep] = useState<1 | 2>(1);
  // EMAIL STATE
  const [email, setEmail] = useState<string>("");
  // OTP INPUT REFS
  const otpInputRef = useRef<(HTMLInputElement | null)[]>([]);
  // OTP STATE (6 DIGITS)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  // NEW PASSWORD STATE
  const [newPassword, setNewPassword] = useState<string>("");
  // CONFIRM PASSWORD STATE
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // PASSWORD VISIBILITY STATES
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // CONFIRM PASSWORD VISIBILITY STATE
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  // MINIMUM LENGTH STATE
  const [hasMinLength, setHasMinLength] = useState<boolean>(false);
  // HAS LOWERCASE LETTER STATE
  const [hasLower, setHasLower] = useState<boolean>(false);
  // HAS UPPERCASE LETTER STATE
  const [hasUpper, setHasUpper] = useState<boolean>(false);
  // HAS DIGIT STATE
  const [hasDigit, setHasDigit] = useState<boolean>(false);
  // HAS SPECIAL CHARACTER STATE
  const [hasSpecial, setHasSpecial] = useState<boolean>(false);
  // PASSWORDS MATCH STATE
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  // REQUEST PASSWORD RESET MUTATION
  const requestResetMutation = useRequestPasswordReset();
  // RESET PASSWORD MUTATION
  const resetPasswordMutation = useResetPassword();
  // CHECKING FOR EACH PASSWORD CONDITION WHEN NEW PASSWORD CHANGES
  useEffect(() => {
    // GET PASSWORD FROM STATE
    const password = newPassword;
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
  }, [newPassword]);
  // CHECKING FOR PASSWORD MATCH WHEN NEW PASSWORD AND CONFIRM PASSWORD CHANGES
  useEffect(() => {
    // CHECK IF PASSWORD AND CONFIRM PASSWORD ARE NOT EMPTY AND IF THEY MATCH
    setPasswordsMatch(
      newPassword !== "" &&
        confirmPassword !== "" &&
        newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);
  // CHECKING IF ALL VALIDATIONS PASS
  const isFormValid =
    hasMinLength &&
    hasLower &&
    hasUpper &&
    hasDigit &&
    hasSpecial &&
    passwordsMatch;
  // CHECK IF ALL OTP DIGITS ARE COMPLETED
  const isOtpComplete = otp.every((digit) => digit !== "");
  // CHECK IF ANY OTP DIGIT IS ENTERED
  const hasAnyOtpDigit = otp.some((digit) => digit !== "");
  // HANDLE STEP 1 SUBMISSION (REQUEST RESET CODE)
  const handleRequestReset = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // VALIDATE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // CHECK IF EMAIL IS VALID
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    // CALL REQUEST PASSWORD RESET MUTATION WITH EMAIL
    requestResetMutation.mutate(
      { email },
      {
        onSuccess: () => {
          // MOVE TO STEP 2
          setStep(2);
          // AUTO-FOCUS FIRST OTP INPUT
          setTimeout(() => {
            otpInputRef.current[0]?.focus();
          }, 100);
        },
      }
    );
  };
  // HANDLE STEP 2 SUBMISSION (RESET PASSWORD)
  const handleResetPassword = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // COMBINE ALL OTP DIGITS INTO ONE STRING
    const code = otp.join("");
    // CHECK IF CODE IS COMPLETE
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    // CHECK IF FORM IS VALID
    if (!isFormValid) {
      toast.error("Please meet all password requirements");
      return;
    }
    // CALL RESET PASSWORD MUTATION
    resetPasswordMutation.mutate({ email, code, newPassword });
  };
  // HANDLE CLEAR OTP
  const handleClearOtp = (): void => {
    // CLEAR ALL OTP DIGITS
    setOtp(["", "", "", "", "", ""]);
    // FOCUS FIRST INPUT
    otpInputRef.current[0]?.focus();
  };
  // HANDLE OTP INPUT CHANGE
  const handleOtpChange = (value: string, index: number): void => {
    // ONLY ALLOW NUMBERS TO BE ADDED
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }
    // GET NEW OTP
    const newOtp = [...otp];
    // ASSIGNING THE VALUE
    newOtp[index] = value;
    // SETTING THE NEW OTP
    setOtp(newOtp);
    // AUTO-FOCUSING THE NEXT INPUT
    if (value && index < 5) {
      otpInputRef.current[index + 1]?.focus();
    }
  };
  // HANDLE KEY DOWN (BACKSPACE HANDLING)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    // BACKSPACE INPUT REMOVAL HANDLING
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRef.current[index - 1]?.focus();
    }
    // PREVENTING THE NON-NUMERIC ENTRY IN THE OTP INPUT
    if (
      !/^[0-9]$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };
  // HANDLE BACK TO STEP 1
  const handleBackToStep1 = (): void => {
    // RESET STEP
    setStep(1);
    // CLEAR OTP
    setOtp(["", "", "", "", "", ""]);
    // CLEAR NEW PASSWORD
    setNewPassword("");
    // CLEAR CONFIRM PASSWORD
    setConfirmPassword("");
  };
  // RETURNING THE FORGOT PASSWORD PAGE COMPONENT
  return (
    // FORGOT PASSWORD PAGE MAIN CONTAINER
    <div className="min-h-screen flex items-center justify-center px-6 py-4 sm:px-10 lg:px-16 bg-gray-50 overflow-hidden">
      {/* FORM CONTAINER */}
      <div className="w-full max-w-md rounded-2xl">
        {/* LOGO AND TITLE CONTAINER */}
        <div className="flex items-center mb-4 gap-3">
          {/* LOGO IMAGE */}
          <img src={PURPLE_LOGO} alt="PlanOra Logo" className="w-10 h-10" />
          {/* LOGO TEXT */}
          <h1 className="text-2xl font-semibold text-violet-900">PlanOra</h1>
        </div>
        {/* PAGE HEADING */}
        <div className="flex items-center gap-2 mb-1">
          <Lock className="text-violet-600" size={24} />
          <h2 className="text-xl sm:text-2xl font-medium text-gray-800">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
        </div>
        {/* PAGE DESCRIPTION */}
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          {step === 1
            ? "Enter your email address and we'll send you a verification code to reset your password."
            : `We've sent a 6-digit verification code to ${email}. Enter the code and your new password below.`}
        </p>
        {/* STEP 1: REQUEST RESET CODE */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
            {/* EMAIL INPUT FIELD */}
            <div className="relative flex flex-col">
              {/* EMAIL LABEL */}
              <label htmlFor="email" className="text-sm text-gray-600 mb-0.5">
                Email
              </label>
              {/* EMAIL INPUT CONTAINER */}
              <div className="relative flex items-center">
                {/* EMAIL ICON */}
                <Mail
                  size={18}
                  className="absolute left-3 text-gray-400 pointer-events-none"
                />
                {/* EMAIL INPUT */}
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoFocus
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
                />
                {/* CLEAR EMAIL BUTTON */}
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute right-3 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    title="Clear"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={requestResetMutation.isPending || !email.trim()}
              className="w-full py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {requestResetMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Send Verification Code
                </>
              )}
            </button>
          </form>
        )}
        {/* STEP 2: ENTER CODE AND NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBackToStep1}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition mb-2"
            >
              <ArrowLeft size={16} />
              Back to email
            </button>
            {/* OTP INPUT CONTAINER */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Verification Code</label>
              <div className="flex items-center justify-center gap-3 w-full">
                {otp.map((digit: string, idx: number) => (
                  <input
                    key={idx}
                    value={digit}
                    type="text"
                    inputMode="numeric"
                    ref={(element) => {
                      otpInputRef.current[idx] = element;
                    }}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 outline-none text-center text-xl sm:text-2xl font-semibold text-violet-600 transition ${
                      digit
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-300 bg-white"
                    } focus:border-violet-500 focus:ring-2 focus:ring-violet-200`}
                  />
                ))}
              </div>
              {/* CLEAR OTP BUTTON */}
              {hasAnyOtpDigit && (
                <button
                  type="button"
                  onClick={handleClearOtp}
                  className="w-full py-2 px-4 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base text-gray-700"
                >
                  <Trash2 size={18} />
                  Clear Code
                </button>
              )}
            </div>
            {/* NEW PASSWORD INPUT FIELD */}
            <div className="relative flex flex-col">
              {/* NEW PASSWORD LABEL */}
              <label
                htmlFor="newPassword"
                className="text-sm text-gray-600 mb-0.5"
              >
                New Password
              </label>
              {/* NEW PASSWORD INPUT CONTAINER */}
              <div className="relative flex items-center">
                {/* PASSWORD ICON */}
                <Lock
                  size={18}
                  className="absolute left-3 text-gray-400 pointer-events-none"
                />
                {/* NEW PASSWORD INPUT */}
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
                />
                {/* TOGGLE PASSWORD VISIBILITY BUTTON */}
                {newPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 p-1 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                )}
              </div>
              {/* PASSWORD CONDITIONS */}
              {newPassword.trim() !== "" && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <ConditionItem
                    label="Min 8 characters"
                    passed={hasMinLength}
                  />
                  <ConditionItem
                    label="One lowercase letter"
                    passed={hasLower}
                  />
                  <ConditionItem
                    label="One uppercase letter"
                    passed={hasUpper}
                  />
                  <ConditionItem label="One digit" passed={hasDigit} />
                  <ConditionItem
                    label="One special character"
                    passed={hasSpecial}
                  />
                </div>
              )}
            </div>
            {/* CONFIRM PASSWORD INPUT FIELD */}
            <div className="relative flex flex-col">
              {/* CONFIRM PASSWORD LABEL */}
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-600 mb-0.5"
              >
                Confirm Password
              </label>
              {/* CONFIRM PASSWORD INPUT CONTAINER */}
              <div className="relative flex items-center">
                {/* CONFIRM PASSWORD ICON */}
                <Lock
                  size={18}
                  className="absolute left-3 text-gray-400 pointer-events-none"
                />
                {/* CONFIRM PASSWORD INPUT */}
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
                />
                {/* TOGGLE CONFIRM PASSWORD VISIBILITY BUTTON */}
                {confirmPassword && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 p-1 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
                    title={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                )}
              </div>
              {/* PASSWORDS MATCH CONDITION */}
              {confirmPassword && (
                <div className="mt-2">
                  <ConditionItem
                    label="Passwords match"
                    passed={passwordsMatch}
                  />
                </div>
              )}
            </div>
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={
                resetPasswordMutation.isPending ||
                !isOtpComplete ||
                !isFormValid
              }
              className="w-full py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Resetting...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}
        {/* LOGIN LINK */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-violet-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
