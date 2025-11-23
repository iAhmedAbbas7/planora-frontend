// <== IMPORTS ==>
import { JSX } from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { Lock, LogIn, UserPlus } from "lucide-react";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";

// <== ACCESS DENIED PAGE COMPONENT ==>
const AccessDenied = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Access Denied");
  // RETURNING THE ACCESS DENIED PAGE
  return (
    // ACCESS DENIED PAGE MAIN CONTAINER
    <div className="w-full min-h-screen flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 bg-gray-50 overflow-hidden">
      {/* CONTENT CONTAINER */}
      <div className="w-full max-w-md rounded-2xl text-center">
        {/* LOGO AND TITLE CONTAINER */}
        <div className="flex items-center justify-center mb-6 gap-3">
          {/* LOGO IMAGE */}
          <img src={PURPLE_LOGO} alt="PlanOra Logo" className="w-12 h-12" />
          {/* LOGO TEXT */}
          <h1 className="text-3xl font-semibold text-violet-900">PlanOra</h1>
        </div>
        {/* LOCK ICON */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-violet-100 mb-6">
          <Lock className="h-10 w-10 text-violet-600" strokeWidth={2.5} />
        </div>
        {/* PAGE HEADING */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Access Denied
        </h2>
        {/* PAGE DESCRIPTION */}
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          You need to login or sign up to continue accessing this page.
        </p>
        {/* BUTTONS CONTAINER */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* LOGIN BUTTON */}
          <Link
            to="/login"
            className="flex-1 px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {/* LOGIN ICON */}
            <LogIn className="h-5 w-5" strokeWidth={2.5} />
            {/* BUTTON TEXT */}
            <span>Login</span>
          </Link>
          {/* SIGNUP BUTTON */}
          <Link
            to="/register"
            className="flex-1 px-6 py-3 bg-white text-violet-500 border-2 border-violet-500 rounded-lg hover:bg-violet-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {/* SIGNUP ICON */}
            <UserPlus className="h-5 w-5" strokeWidth={2.5} />
            {/* BUTTON TEXT */}
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
