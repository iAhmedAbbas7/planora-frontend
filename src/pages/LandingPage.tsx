// <== IMPORTS ==>
import { JSX } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Landing/sections/Navbar";
import Footer from "@/components/Landing/sections/Footer";
import Reviews from "@/components/Landing/sections/Reviews";
import Overview from "@/components/Landing/sections/Overview";
import Features from "@/components/Landing/sections/Features";
import TrustedBy from "@/components/Landing/sections/TrustedBy";
import PricingPlan from "@/components/Landing/sections/PricingPlan";
import WhyChooseUs from "@/components/Landing/sections/WhyChooseUs";

// <== LANDING PAGE COMPONENT ==>
const LandingPage = (): JSX.Element => {
  // RETURNING THE LANDING PAGE COMPONENT
  return (
    // LANDING PAGE MAIN CONTAINER
    <div className="bg-gradient-to-b from-violet-50 via-white to-white text-black min-h-screen">
      {/* NAVBAR COMPONENT */}
      <Navbar />
      {/* HERO SECTION */}
      <section
        id="Home"
        className="relative flex flex-col justify-center items-center text-center py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
      >
        {/* SOFT GRID & GLOW BACKGROUND */}
        <div
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,220,255,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,220,255,0.4) 1px, transparent 1px),
              radial-gradient(circle 800px at 10% 200px, #e1d3ff, transparent 70%)
            `,
            backgroundSize: "90px 64px, 90px 64px, 100% 100%",
          }}
        />
        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* HERO MAIN HEADING PART 1 */}
          <p className="font-heading text-4xl md:text-5xl lg:text-6xl  leading-tight mb-3 font-semibold">
            Need More Focus?
          </p>
          {/* HERO MAIN HEADING PART 2 */}
          <p className="font-heading text-4xl md:text-5xl lg:text-6xl  leading-tight font-semibold text-violet-800 mb-6">
            PlanOra Keeps You on Track.
          </p>
          {/* HERO DESCRIPTION TEXT */}
          <p className="font-body text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            From personal goals to team projects, PlanOra helps you organize
            tasks, track progress, and stay productive effortlessly.
          </p>
          {/* CTA BUTTONS CONTAINER */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* START FOR FREE BUTTON */}
            <Link
              to="/register"
              className="px-8 py-3 bg-violet-400 text-black font-semibold rounded-full shadow-md hover:bg-violet-500 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:text-white"
            >
              Start for Free
            </Link>
            {/* EXPLORE FEATURES BUTTON */}
            <button className="px-8 py-3 border border-gray-400 text-black font-semibold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer">
              Explore Features
            </button>
          </div>
        </div>
        {/* TOP RIGHT GLOW ORB */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse" />
        {/* BOTTOM LEFT GLOW ORB */}
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        {/* OVERVIEW PREVIEW BELOW HERO */}
        <div className="relative z-10 mt-24 w-full">
          {/* OVERVIEW COMPONENT */}
          <Overview />
        </div>
      </section>
      {/* REST OF THE LANDING PAGE SECTIONS */}
      <main className="flex flex-col justify-center items-center">
        {/* TRUSTED BY SECTION */}
        <TrustedBy />
        {/* WHY CHOOSE US SECTION */}
        <WhyChooseUs />
        {/* FEATURES SECTION */}
        <Features />
        {/* PRICING PLAN SECTION */}
        <PricingPlan />
        {/* REVIEWS SECTION */}
        <Reviews />
      </main>
      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
};

export default LandingPage;
