// <== IMPORTS ==>
import { Link } from "react-router-dom";
import { useState, useEffect, JSX } from "react";
import PURPLE_LOGO from "../../../assets/images/LOGO-PURPLE.png";

// <== NAVBAR COMPONENT ==>
const Navbar = (): JSX.Element => {
  // SCROLL DETECTION STATE
  const [isScrolled, setIsScrolled] = useState(false);
  // SCROLL DETECTION EFFECT
  useEffect(() => {
    // HANDLE SCROLL EVENT
    const handleScroll = () => {
      // SET SCROLL STATE
      setIsScrolled(window.scrollY > 50);
    };
    // ADD SCROLL EVENT LISTENER
    window.addEventListener("scroll", handleScroll);
    // REMOVE SCROLL EVENT LISTENER
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // RETURNING THE NAVBAR COMPONENT
  return (
    // NAVBAR MAIN CONTAINER
    <>
      {/* NAVBAR CONTENT CONTAINER */}
      <nav
        className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        {/* NAVBAR LOGO AND LINKS CONTAINER */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* NAVBAR LOGO CONTAINER */}
          <div className="flex items-center gap-2">
            {/* NAVBAR LOGO IMAGE */}
            <img src={PURPLE_LOGO} alt="PlanOra Logo" className="h-7 w-7" />
            {/* NAVBAR LOGO TEXT */}
            <h1 className="text-2xl font-heading font-medium text-gray-700 cursor-pointer">
              PlanOra
            </h1>
          </div>
          {/* NAVBAR LINKS CONTAINER */}
          <div className="hidden md:flex gap-8 font-body text-gray-700">
            {/* NAVBAR HOME LINK */}
            <a href="/" className="hover:text-violet-600 transition">
              Home
            </a>
            {/* NAVBAR FEATURES LINK */}
            <a href="#features" className="hover:text-violet-600 transition">
              Features
            </a>
            {/* NAVBAR PRICING LINK */}
            <a href="#pricing" className="hover:text-violet-600 transition">
              Pricing
            </a>
            {/* NAVBAR CONTACT LINK */}
            <a href="#contact" className="hover:text-violet-600 transition">
              Contact
            </a>
          </div>
          {/* NAVBAR AUTH BUTTONS CONTAINER */}
          <div className="flex items-center gap-4">
            {/* NAVBAR LOGIN LINK */}
            <Link
              to="/login"
              className="text-gray-700 font-body hover:text-violet-600 transition cursor-pointer"
            >
              Login
            </Link>
            {/* NAVBAR REGISTER LINK */}
            <Link
              to="/register"
              className="px-5 py-2.5 bg-violet-500 text-white rounded-full font-medium cursor-pointer hover:bg-violet-600 transition hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

