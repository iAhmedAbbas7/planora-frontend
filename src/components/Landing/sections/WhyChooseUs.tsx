// <== IMPORTS ==>
import { JSX } from "react";
import GROWTH_IMAGE from "../../../assets/images/GROWTH.jpg";
import HABITS_IMAGE from "../../../assets/images/HABITS.jpg";
import ORGANIZED_IMAGE from "../../../assets/images/ORGANIZED.jpg";

// <== WHY CHOOSE US COMPONENT ==>
const WhyChooseUs = (): JSX.Element => {
  // REASONS DATA ARRAY
  const reasons = [
    // REASON 1
    {
      title: "Stay Organized Effortlessly",
      desc: "Keep all your goals, to-dos, and projects in one simple dashboard that keeps you focused and stress-free.",
      image: ORGANIZED_IMAGE,
    },
    // REASON 2
    {
      title: "Build Better Habits",
      desc: "Track your daily progress, set priorities, and stay consistent with reminders that actually help you follow through.",
      image: HABITS_IMAGE,
    },
    // REASON 3
    {
      title: "See Your Growth",
      desc: "Visualize your productivity over time with progress charts and milestones that keep you motivated every step of the way.",
      image: GROWTH_IMAGE,
    },
  ];
  // RETURNING THE WHY CHOOSE US COMPONENT
  return (
    // WHY CHOOSE US MAIN CONTAINER
    <section className="pt-15 mt-10 bg-violet-50 py-18 px-6 sm:px-10 lg:px-20">
      {/* HEADING CONTAINER */}
      <div className="text-center mb-14">
        {/* BADGE */}
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Why Choose Us
        </p>
        {/* MAIN HEADING */}
        <p className="text-4xl sm:text-5xl font-medium text-black mb-3">
          Make Your Goals Happen
        </p>
        {/* DESCRIPTION TEXT */}
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Simple, powerful, and built to help you stay consistent, motivated,
          and organized every single day.
        </p>
      </div>
      {/* CARDS GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* MAPPING THROUGH REASONS */}
        {reasons.map((item, index) => (
          // REASON CARD ITEM
          <div
            key={index}
            className="group bg-white border border-violet-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* CARD IMAGE CONTAINER */}
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* CARD CONTENT CONTAINER */}
            <div className="p-6">
              {/* CARD TITLE */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              {/* CARD DESCRIPTION */}
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
