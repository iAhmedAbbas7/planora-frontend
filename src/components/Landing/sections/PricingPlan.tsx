// <== IMPORTS ==>
import { JSX } from "react";

// <== PLAN TYPE INTERFACE ==>
type Plan = {
  // <== PLAN NAME ==>
  name: string;
  // <== PLAN PRICE ==>
  price: string;
  // <== PLAN TAGLINE ==>
  tagline: string;
  // <== PLAN FEATURES ==>
  features: string[];
  // <== PLAN HIGHLIGHTED ==>
  highlighted: boolean;
};

// <== PRICING PLAN COMPONENT ==>
const PricingPlan = (): JSX.Element => {
  // PLANS DATA ARRAY
  const plans: Plan[] = [
    // <== PLAN 1 ==>
    {
      name: "Essential",
      price: "$9/mo",
      tagline: "Perfect for freelancers",
      features: [
        "Unlimited tasks & projects",
        "Basic collaboration tools",
        "Email support",
        "Access on all devices",
      ],
      highlighted: false,
    },
    // <== PLAN 2 ==>
    {
      name: "Pro",
      price: "$19/mo",
      tagline: "Best for small teams",
      features: [
        "Everything in Essential",
        "Advanced collaboration",
        "File sharing & attachments",
        "Priority support",
      ],
      highlighted: true,
    },
    // <== PLAN 3 ==>
    {
      name: "Team",
      price: "$49/mo",
      tagline: "For growing companies",
      features: [
        "Everything in Pro",
        "Team analytics",
        "Custom integrations",
        "Dedicated support",
      ],
      highlighted: false,
    },
  ];
  // RETURNING THE PRICING PLAN COMPONENT
  return (
    // PRICING PLAN MAIN CONTAINER
    <section
      id="pricing"
      className="mt-2 py-16 px-6 sm:px-10 lg:px-20 bg-violet-50 w-[100%] mx-auto"
    >
      {/* SECTION HEADING CONTAINER */}
      <div className="text-center mb-16">
        {/* BADGE */}
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Pricing
        </p>
        {/* MAIN HEADING */}
        <p className="text-4xl sm:text-5xl font-medium text-black mb-3">
          Flexible Plans for Every Team Size
        </p>
        {/* DESCRIPTION TEXT */}
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Whether you're a solo creator or managing a full team, PlanOra scales
          with your ambitions.
        </p>
      </div>
      {/* PRICING CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* MAPPING THROUGH PLANS */}
        {plans.map((plan, index) => (
          // PRICING CARD CONTAINER
          <div
            key={index}
            className={`flex flex-col p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${
              plan.highlighted
                ? "border-violet-500 bg-white ring-2 ring-violet-200"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* CARD HEADER CONTAINER */}
            <div className="mb-4">
              {/* PLAN NAME */}
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide">
                {plan.name}
              </p>
              {/* PLAN PRICE */}
              <h1 className="text-4xl font-bold mt-2 text-gray-900">
                {plan.price}
              </h1>
              {/* PLAN TAGLINE */}
              <p className="text-gray-600 mt-1">{plan.tagline}</p>
            </div>
            {/* FEATURES LIST CONTAINER */}
            <ul className="flex-1 space-y-3 mt-6 mb-8">
              {/* MAPPING THROUGH FEATURES */}
              {plan.features.map((feature, i) => (
                // FEATURE ITEM
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-700 text-base"
                >
                  {/* CHECKMARK ICON */}
                  <span className="text-violet-600">✔</span>
                  {/* FEATURE TEXT */}
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {/* BUTTON CONTAINER */}
            <button
              className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 cursor-pointer ${
                plan.highlighted
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {plan.highlighted ? "Get Started" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>
      {/* FOOTER NOTE */}
      <p className="text-center text-gray-500 text-sm mt-12">
        💡 Cancel anytime. No hidden fees. Upgrade or downgrade anytime.
      </p>
    </section>
  );
};

export default PricingPlan;
