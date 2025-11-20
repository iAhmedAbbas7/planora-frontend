// <== IMPORTS ==>
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../store/useAuthStore";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent, JSX } from "react";

// <== LOGIN INFO TYPE INTERFACE ==>
type LoginInfo = {
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
};

// <== LOGIN PAGE COMPONENT ==>
const LoginPage = (): JSX.Element => {
  // LOGIN INFO STATE
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });
  // SHOW PASSWORD STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // LOGIN MUTATION
  const loginMutation = useLogin();
  // AUTH STORE
  const { setLoggingOut } = useAuthStore();
  // RESET LOGGING OUT FLAG WHEN LOGIN PAGE MOUNTS
  useEffect(() => {
    setLoggingOut(false);
  }, [setLoggingOut]);
  // HANDLE CHANGE FUNCTION
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE LOGIN INFO STATE
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // HANDLE LOGIN FUNCTION
  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // DESTRUCTURE LOGIN INFO
    const { email, password } = loginInfo;
    // CHECK IF EMAIL AND PASSWORD ARE FILLED
    if (!email || !password) {
      // SHOW ERROR TOAST
      toast.error("Email and password are required");
      return;
    }
    // CALL LOGIN MUTATION
    loginMutation.mutate({ email, password });
  };
  // RETURNING THE LOGIN PAGE COMPONENT
  return (
    // LOGIN PAGE MAIN CONTAINER
    <div className="w-full min-h-screen flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 bg-gray-50 overflow-hidden">
      {/* FORM CONTAINER */}
      <div className="w-full max-w-md rounded-2xl">
        {/* LOGO AND TITLE CONTAINER */}
        <div className="flex items-center mb-6 gap-3">
          {/* LOGO IMAGE */}
          <img src={PURPLE_LOGO} alt="PlanOra Logo" className="w-12 h-12" />
          {/* LOGO TEXT */}
          <h1 className="text-3xl font-semibold text-violet-900">PlanOra</h1>
        </div>
        {/* PAGE HEADING */}
        <h2 className="text-2xl sm:text-2xl font-light text-gray-800 mb-2">
          Welcome Back
        </h2>
        {/* PAGE DESCRIPTION */}
        <p className="text-gray-500 mb-5 text-sm sm:text-base">
          Enter your details to login to your account
        </p>
        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* EMAIL INPUT FIELD */}
          <div>
            {/* EMAIL LABEL */}
            <label htmlFor="email" className="text-sm text-gray-600">
              Email
            </label>
            {/* EMAIL INPUT CONTAINER */}
            <div className="relative flex items-center mt-1">
              {/* MAIL ICON */}
              <Mail className="absolute left-3 text-gray-400" size={18} />
              {/* EMAIL INPUT */}
              <input
                type="email"
                id="email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoFocus
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {loginInfo.email && loginInfo.email.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setLoginInfo((prev) => ({ ...prev, email: "" }))
                  }
                  className="absolute right-3 p-1 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  title="Clear"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
          {/* PASSWORD INPUT FIELD */}
          <div>
            {/* PASSWORD LABEL */}
            <label htmlFor="password" className="text-sm text-gray-600">
              Password
            </label>
            {/* PASSWORD INPUT CONTAINER */}
            <div className="relative flex items-center mt-1">
              {/* LOCK ICON */}
              <Lock className="absolute left-3 text-gray-400" size={18} />
              {/* PASSWORD INPUT */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                value={loginInfo.password}
                placeholder="Enter your password"
                className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
              />
              {/* CLEAR BUTTON */}
              {loginInfo.password && loginInfo.password.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setLoginInfo((prev) => ({ ...prev, password: "" }))
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
          </div>
          {/* FORGOT PASSWORD LINK */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-violet-500 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
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
        {/* SIGN UP LINK */}
        <p className="mt-4 text-left text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-violet-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
