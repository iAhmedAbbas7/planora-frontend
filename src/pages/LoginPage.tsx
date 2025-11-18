// <== IMPORTS ==>
import { Link } from "react-router-dom";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useState, ChangeEvent, FormEvent, JSX } from "react";

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
      // SHOW ERROR MESSAGE
      alert("Email and password are required");
      return;
    }
    // LOG LOGIN INFO (API INTEGRATION WILL BE ADDED LATER)
    console.log("Login info:", loginInfo);
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
            {/* EMAIL INPUT */}
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
            />
          </div>
          {/* PASSWORD INPUT FIELD */}
          <div>
            {/* PASSWORD LABEL */}
            <label htmlFor="password" className="text-sm text-gray-600">
              Password
            </label>
            {/* PASSWORD INPUT */}
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={loginInfo.password}
              placeholder="Enter your password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base"
            />
          </div>
          {/* SUBMIT BUTTON */}
          <button className="w-full py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition cursor-pointer text-sm sm:text-base">
            Login
          </button>
        </form>
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
