// <== IMPORTS ==>
import { toast } from "sonner";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, FormEvent, JSX } from "react";
import { useVerifyEmail, useResendCode } from "../hooks/useVerifyEmail";

// <== VERIFY EMAIL PAGE COMPONENT ==>
const VerifyEmailPage = (): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // LOCATION HOOK (TO GET EMAIL FROM STATE)
  const location = useLocation();
  // GET EMAIL FROM LOCATION STATE OR REDIRECT
  const email = (location.state as { email?: string })?.email || "";
  // REDIRECT IF NO EMAIL
  useEffect(() => {
    if (!email) {
      toast.error("Please sign up first");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);
  // OTP INPUT REFS
  const otpInputRef = useRef<(HTMLInputElement | null)[]>([]);
  // OTP STATE (6 DIGITS)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  // VERIFY EMAIL MUTATION
  const verifyMutation = useVerifyEmail();
  // RESEND CODE MUTATION
  const resendMutation = useResendCode();
  // CHECK IF ALL OTP DIGITS ARE COMPLETED
  const isOtpComplete = otp.every((digit) => digit !== "");
  // CHECK IF ANY OTP DIGIT IS ENTERED
  const hasAnyOtpDigit = otp.some((digit) => digit !== "");
  // HANDLE FORM SUBMISSION
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CHECK IF EMAIL EXISTS
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/register", { replace: true });
      return;
    }
    // COMBINE ALL OTP DIGITS INTO ONE STRING
    const code = otp.join("");
    // CHECK IF CODE IS COMPLETE
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    // CALL VERIFY EMAIL MUTATION
    verifyMutation.mutate({ email, code });
  };
  // HANDLE CLEAR OTP
  const handleClearOtp = (): void => {
    // CLEAR ALL OTP DIGITS
    setOtp(["", "", "", "", "", ""]);
    // FOCUS FIRST INPUT
    otpInputRef.current[0]?.focus();
  };
  // HANDLE RESEND CODE
  const handleResendCode = (): void => {
    // CHECK IF EMAIL EXISTS
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/register", { replace: true });
      return;
    }
    // CALL RESEND CODE MUTATION
    resendMutation.mutate({ email });
  };
  // AUTO-FOCUS FIRST INPUT ON COMPONENT MOUNT
  useEffect(() => {
    otpInputRef.current[0]?.focus();
  }, []);
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
  // IF NO EMAIL, RETURN NULL (WILL REDIRECT)
  if (!email) {
    return <></>;
  }
  // RETURNING THE VERIFY EMAIL PAGE COMPONENT
  return (
    // VERIFY EMAIL PAGE MAIN CONTAINER
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
          <Mail className="text-violet-600" size={24} />
          <h2 className="text-xl sm:text-2xl font-medium text-gray-800">
            Verify Your Email
          </h2>
        </div>
        {/* PAGE DESCRIPTION */}
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          We've sent a 6-digit verification code to{" "}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
        <p className="text-gray-500 mb-6 text-xs sm:text-sm">
          The code will expire in 2 minutes
        </p>
        {/* VERIFY EMAIL FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* OTP INPUT CONTAINER */}
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
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={verifyMutation.isPending || !isOtpComplete}
            className="w-full py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Verify Email
              </>
            )}
          </button>
        </form>
        {/* RESEND CODE SECTION */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendMutation.isPending}
            className="w-full py-2 px-4 bg-white border border-violet-500 text-violet-500 rounded-lg hover:bg-violet-50 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {resendMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Resend Code
              </>
            )}
          </button>
        </div>
        {/* BACK TO SIGNUP LINK */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Wrong email?{" "}
          <Link
            to="/register"
            className="text-violet-500 font-semibold hover:underline"
          >
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
