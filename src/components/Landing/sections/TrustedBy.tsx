// <== IMPORTS ==>
import { JSX } from "react";

// <== TRUSTED BY COMPONENT ==>
const TrustedBy = (): JSX.Element => {
  // TRUSTED BY CATEGORIES ARRAY
  const categories = [
    "Tech Startups",
    "Agencies",
    "Freelancers",
    "Product Teams",
    "Marketing Teams",
  ];
  // RETURNING THE TRUSTED BY COMPONENT
  return (
    // TRUSTED BY MAIN CONTAINER
    <section className="mt-10 py-12 px-6 sm:px-10 lg:px-20 text-center bg-gradient-to-b bg-transparent rounded-3xl w-full mx-auto">
      {/* TRUSTED BY HEADING */}
      <h2 className="text-base sm:text-lg text-gray-700 mb-10 font-medium tracking-wide">
        Trusted by teams and individuals around the world
      </h2>
      {/* TRUSTED BY CATEGORY PILLS CONTAINER */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {/* MAPPING THROUGH CATEGORIES */}
        {categories.map((item, index) => (
          // CATEGORY PILL ITEM
          <div
            key={index}
            className="text-sm sm:text-base md:text-lg font-medium bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-violet-300 transition-all duration-300 cursor-default"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;
