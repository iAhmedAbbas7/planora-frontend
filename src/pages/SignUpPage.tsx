// <== IMPORTS ==>
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { toast } from "../lib/toast";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import "react-phone-number-input/style.css";
import { useSignup } from "../hooks/useAuth";
import PhoneInput from "react-phone-number-input";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useState, useEffect, ChangeEvent, FormEvent, JSX } from "react";

// <== SIGN UP INFO TYPE INTERFACE ==>
type SignUpInfo = {
  // <== NAME ==>
  name: string;
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
  // <== CONFIRM PASSWORD ==>
  confirmPassword: string;
  // <== PHONE NUMBER ==>
  phoneNumber: string;
};

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

// <== SIGN UP PAGE COMPONENT ==>
const SignUpPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Sign Up");
  // SIGN UP INFO STATE
  const [signupInfo, setSignUpInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  // PHONE NUMBER VALUE STATE (FOR PHONE INPUT COMPONENT)
  const [phoneValue, setPhoneValue] = useState<string | undefined>(undefined);
  // SHOW PASSWORD STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // SHOW CONFIRM PASSWORD STATE
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  // SIGNUP MUTATION
  const signupMutation = useSignup();
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
  // EMAIL VALIDATION STATE
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  // TERMS ACCEPTANCE STATE
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  // CHECKING FOR EACH PASSWORD CONDITION WHEN NEW PASSWORD CHANGES
  useEffect(() => {
    // GET PASSWORD FROM SIGN UP INFO
    const password = signupInfo.password;
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
  }, [signupInfo.password]);
  // CHECKING FOR PASSWORD MATCH ON EACH CHANGE
  useEffect(() => {
    // CHECK IF PASSWORD AND CONFIRM PASSWORD ARE NOT EMPTY AND IF THEY MATCH
    setPasswordsMatch(
      signupInfo.password !== "" &&
        signupInfo.confirmPassword !== "" &&
        signupInfo.password === signupInfo.confirmPassword
    );
  }, [signupInfo.password, signupInfo.confirmPassword]);
  // CHECKING FOR EMAIL VALIDATION ON EACH CHANGE
  useEffect(() => {
    // CREATE EMAIL REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // CHECK IF EMAIL IS VALID
    setIsValidEmail(emailRegex.test(signupInfo.email));
  }, [signupInfo.email]);
  // CHECKING IF ALL VALIDATIONS PASS
  const allValid =
    signupInfo.name.trim() !== "" &&
    isValidEmail &&
    hasMinLength &&
    hasLower &&
    hasUpper &&
    hasDigit &&
    hasSpecial &&
    passwordsMatch &&
    termsAccepted;
  // HANDLING CHANGE OF INPUT FIELDS
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE SIGN UP INFO STATE
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLING PHONE NUMBER CHANGE
  const handlePhoneChange = (value: string | undefined): void => {
    // UPDATE PHONE VALUE STATE
    setPhoneValue(value);
    // UPDATE SIGN UP INFO STATE
    setSignUpInfo((prev) => ({
      ...prev,
      phoneNumber: value || "",
    }));
  };
  // HANDLING SIGN UP FORM SUBMISSION
  const handleSignUp = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // DESTRUCTURE SIGN UP INFO
    const { name, email, password } = signupInfo;
    // CHECK IF TERMS ARE ACCEPTED
    if (!termsAccepted) {
      // SHOW ERROR TOAST
      toast.error("Please accept the Terms & Conditions to continue");
      return;
    }
    // CHECK IF ALL VALIDATIONS PASS
    if (!allValid) {
      // SHOW ERROR TOAST
      toast.error("Please ensure all fields meet the requirements");
      return;
    }
    // PREPARE SIGNUP DATA
    const signupData: {
      name: string;
      email: string;
      password: string;
      acceptedTerms: boolean;
      phoneNumber?: string;
    } = {
      name,
      email,
      password,
      acceptedTerms: true,
    };
    // ADD PHONE NUMBER IF PROVIDED
    if (signupInfo.phoneNumber && signupInfo.phoneNumber.trim() !== "") {
      signupData.phoneNumber = signupInfo.phoneNumber;
    }
    // CALL SIGNUP MUTATION
    signupMutation.mutate(signupData);
  };
  // RETURNING THE SIGN UP PAGE COMPONENT
  return (
    // SIGN UP PAGE MAIN CONTAINER
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
        <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-1">
          Get Started Now
        </h2>
        {/* PAGE DESCRIPTION */}
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          Create your account and start managing your tasks efficiently
        </p>
        {/* SIGN UP FORM */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
          {/* NAME INPUT FIELD */}
          <div className="flex flex-col">
            {/* NAME LABEL */}
            <label htmlFor="name" className="text-sm text-gray-600 mb-0.5">
              Full Name
            </label>
            {/* NAME INPUT CONTAINER */}
            <div className="relative flex items-center">
              {/* USER ICON */}
              <User className="absolute left-3 text-gray-400" size={18} />
              {/* NAME INPUT */}
              <input
                type="text"
                id="name"
                name="name"
                value={signupInfo.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoFocus
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {signupInfo.name && signupInfo.name.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setSignUpInfo((prev) => ({ ...prev, name: "" }))
                  }
                  className="absolute right-3 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  title="Clear"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
          {/* EMAIL INPUT FIELD */}
          <div className="flex flex-col">
            {/* EMAIL LABEL */}
            <label htmlFor="email" className="text-sm text-gray-600 mb-0.5">
              Email
            </label>
            {/* EMAIL INPUT CONTAINER */}
            <div className="relative flex items-center">
              {/* MAIL ICON */}
              <Mail className="absolute left-3 text-gray-400" size={18} />
              {/* EMAIL INPUT */}
              <input
                type="email"
                id="email"
                name="email"
                value={signupInfo.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {signupInfo.email && signupInfo.email.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setSignUpInfo((prev) => ({ ...prev, email: "" }))
                  }
                  className="absolute right-3 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  title="Clear"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            {/* EMAIL VALIDATION INFO */}
            {signupInfo.email && (
              <div className="mt-1">
                <ConditionItem
                  label="Valid email format (will be verified)"
                  passed={isValidEmail}
                />
              </div>
            )}
            {/* EMAIL VERIFICATION INFO */}
            {signupInfo.email && isValidEmail && (
              <p className="text-xs text-gray-500 mt-1">
                A verification code will be sent to this email address
              </p>
            )}
          </div>
          {/* PHONE NUMBER INPUT FIELD */}
          <div className="flex flex-col">
            {/* PHONE NUMBER LABEL */}
            <label
              htmlFor="phoneNumber"
              className="text-sm text-gray-600 mb-0.5"
            >
              Phone Number <span className="text-gray-400">(Optional)</span>
            </label>
            {/* PHONE NUMBER INPUT CONTAINER */}
            <div className="relative flex items-center">
              {/* PHONE ICON */}
              <Phone className="absolute left-3 text-gray-400 z-10" size={18} />
              {/* PHONE INPUT COMPONENT */}
              <PhoneInput
                international
                defaultCountry="PK"
                value={phoneValue}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
                numberInputProps={{
                  className:
                    "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base",
                }}
              />
              {/* CLEAR BUTTON */}
              {phoneValue && (
                <button
                  type="button"
                  onClick={() => {
                    setPhoneValue(undefined);
                    setSignUpInfo((prev) => ({ ...prev, phoneNumber: "" }));
                  }}
                  className="absolute right-3 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer z-10"
                  title="Clear"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            {/* PHONE NUMBER INFO */}
            {signupInfo.phoneNumber && (
              <p className="text-xs text-gray-500 mt-1">
                Phone number will be saved in international format
              </p>
            )}
          </div>
          {/* PASSWORD INPUT FIELD */}
          <div className="flex flex-col">
            {/* PASSWORD LABEL */}
            <label htmlFor="password" className="text-sm text-gray-600 mb-0.5">
              Password
            </label>
            {/* PASSWORD INPUT CONTAINER */}
            <div className="relative flex items-center">
              {/* LOCK ICON */}
              <Lock className="absolute left-3 text-gray-400" size={18} />
              {/* PASSWORD INPUT */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={signupInfo.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {signupInfo.password && signupInfo.password.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setSignUpInfo((prev) => ({ ...prev, password: "" }))
                  }
                  className="absolute right-12 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  title="Clear"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
              {/* SHOW/HIDE PASSWORD BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 p-1 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            {/* PASSWORD VALIDATION CONDITIONS */}
            {signupInfo.password && (
              <div className="mt-2 flex flex-col gap-1">
                <ConditionItem
                  label="Minimum 8 characters"
                  passed={hasMinLength}
                />
                <ConditionItem
                  label="At least one lowercase letter"
                  passed={hasLower}
                />
                <ConditionItem
                  label="At least one uppercase letter"
                  passed={hasUpper}
                />
                <ConditionItem label="At least one digit" passed={hasDigit} />
                <ConditionItem
                  label="At least one special character"
                  passed={hasSpecial}
                />
              </div>
            )}
          </div>
          {/* CONFIRM PASSWORD INPUT FIELD */}
          <div className="flex flex-col">
            {/* CONFIRM PASSWORD LABEL */}
            <label
              htmlFor="confirmPassword"
              className="text-sm text-gray-600 mb-0.5"
            >
              Confirm Password
            </label>
            {/* CONFIRM PASSWORD INPUT CONTAINER */}
            <div className="relative flex items-center">
              {/* LOCK ICON */}
              <Lock className="absolute left-3 text-gray-400" size={18} />
              {/* CONFIRM PASSWORD INPUT */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={signupInfo.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {signupInfo.confirmPassword &&
                signupInfo.confirmPassword.trim() && (
                  <button
                    type="button"
                    onClick={() =>
                      setSignUpInfo((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }))
                    }
                    className="absolute right-12 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                    title="Clear"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              {/* SHOW/HIDE CONFIRM PASSWORD BUTTON */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 p-1 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            {/* PASSWORD MATCH VALIDATION */}
            {signupInfo.confirmPassword && (
              <div className="mt-1">
                <ConditionItem
                  label="Passwords match"
                  passed={passwordsMatch}
                />
              </div>
            )}
          </div>
          {/* TERMS CHECKBOX */}
          <div className="flex items-center text-sm text-gray-600">
            {/* CHECKBOX INPUT */}
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 accent-violet-500 cursor-pointer"
              required
            />
            {/* CHECKBOX LABEL */}
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the{" "}
              <Link
                to="/terms-of-service"
                className="text-violet-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={signupMutation.isPending || !allValid}
            className="w-full py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        {/* OAUTH DIVIDER */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        {/* OAUTH BUTTONS */}
        <div className="flex flex-col gap-2">
          {/* GOOGLE OAUTH BUTTON */}
          <a
            href={`${
              import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1"
            }/auth/google`}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm sm:text-base text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>
          {/* GITHUB OAUTH BUTTON */}
          <a
            href={`${
              import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1"
            }/auth/github`}
            className="w-full py-2 px-4 bg-gray-900 border border-gray-900 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm sm:text-base text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Continue with GitHub</span>
          </a>
        </div>
        {/* LOGIN LINK */}
        <p className="mt-4 text-left text-sm text-gray-600">
          Already have an account?{" "}
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

export default SignUpPage;
