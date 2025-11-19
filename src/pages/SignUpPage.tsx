// <== IMPORTS ==>
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useState, ChangeEvent, FormEvent, JSX } from "react";

// <== SIGN UP INFO TYPE INTERFACE ==>
type SignUpInfo = {
  // <== NAME ==>
  name: string;
  // <== EMAIL ==>
  email: string;
  // <== PASSWORD ==>
  password: string;
};

// <== SIGN UP PAGE COMPONENT ==>
const SignUpPage = (): JSX.Element => {
  // SIGN UP INFO STATE
  const [signupInfo, setSignUpInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
  });
  // SIGNUP MUTATION
  const signupMutation = useSignup();
  // HANDLE CHANGE FUNCTION
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE SIGN UP INFO STATE
    setSignUpInfo((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLE SIGN UP FUNCTION
  const handleSignUp = (e: FormEvent<HTMLFormElement>): void => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // DESTRUCTURE SIGN UP INFO
    const { name, email, password } = signupInfo;
    // CHECK IF ALL FIELDS ARE FILLED
    if (!name || !email || !password) {
      // SHOW ERROR TOAST
      toast.error("All fields are required");
      return;
    }
    // CALL SIGNUP MUTATION
    signupMutation.mutate({ name, email, password });
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
              Name
            </label>
            {/* NAME INPUT */}
            <input
              type="text"
              id="name"
              name="name"
              value={signupInfo.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
            />
          </div>
          {/* EMAIL INPUT FIELD */}
          <div className="flex flex-col">
            {/* EMAIL LABEL */}
            <label htmlFor="email" className="text-sm text-gray-600 mb-0.5">
              Email
            </label>
            {/* EMAIL INPUT */}
            <input
              type="email"
              id="email"
              name="email"
              value={signupInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
            />
          </div>
          {/* PASSWORD INPUT FIELD */}
          <div className="flex flex-col">
            {/* PASSWORD LABEL */}
            <label htmlFor="password" className="text-sm text-gray-600 mb-0.5">
              Password
            </label>
            {/* PASSWORD INPUT */}
            <input
              type="password"
              id="password"
              name="password"
              value={signupInfo.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base"
            />
          </div>
          {/* TERMS CHECKBOX */}
          <div className="flex items-center text-sm text-gray-600">
            {/* CHECKBOX INPUT */}
            <input
              type="checkbox"
              id="terms"
              className="mr-2 accent-violet-500 cursor-pointer"
            />
            {/* CHECKBOX LABEL */}
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="#" className="text-violet-500 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm sm:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
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
