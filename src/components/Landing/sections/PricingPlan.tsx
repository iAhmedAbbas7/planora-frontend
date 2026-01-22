// <== IMPORTS ==>
import {
  PlanType,
  BillingCycle,
  IPlanConfig,
  FEATURE_DISPLAY_NAMES,
  formatLimitValue,
  FeatureKey,
} from "../../../types/billing";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../../../hooks/useBilling";
import { useAuthStore } from "../../../store/useAuthStore";
import { Check, X, Zap, Users, Building2 } from "lucide-react";

// <== PLAN ICON MAP ==>
const PlanIcons: Record<string, typeof Zap> = {
  individual: Zap,
  team: Users,
  enterprise: Building2,
};

// <== KEY FEATURES TO DISPLAY ==>
const KEY_FEATURES: FeatureKey[] = [
  "githubIntegration",
  "aiTaskSuggestions",
  "aiCodeReview",
  "aiBugDetection",
  "teamCollaboration",
  "workspaces",
  "advancedReports",
  "prioritySupport",
];

// <== PRICING PLAN COMPONENT ==>
const PricingPlan = (): JSX.Element => {
  // NAVIGATION
  const navigate = useNavigate();
  // AUTH STATE
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // BILLING CYCLE STATE
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  // FETCH PLANS
  const { data: plans, isLoading } = usePlans();
  // HANDLE PLAN SELECTION
  const handleSelectPlan = (planKey: PlanType): void => {
    // IF AUTHENTICATED, REDIRECT TO SETTINGS BILLING TAB
    if (isAuthenticated) {
      // REDIRECT TO SETTINGS BILLING TAB
      navigate(`/settings?tab=Billing&plan=${planKey}&cycle=${billingCycle}`);
    } else {
      // REDIRECT TO REGISTER WITH PLAN PRE-SELECTED
      navigate(`/register?plan=${planKey}&cycle=${billingCycle}`);
    }
  };
  // GET PRICE FOR DISPLAY
  const getDisplayPrice = (plan: IPlanConfig): string => {
    // IF BILLING CYCLE IS YEARLY, RETURN YEARLY PRICE
    if (billingCycle === "yearly") {
      // RETURN YEARLY PRICE
      return `$${Math.round(plan.pricing.yearly / 12)}`;
    }
    // RETURN MONTHLY PRICE
    return `$${plan.pricing.monthly}`;
  };
  // RETURNING THE PRICING PLAN COMPONENT
  return (
    // PRICING PLAN MAIN CONTAINER
    <section
      id="pricing"
      className="mt-2 py-16 px-6 sm:px-10 lg:px-20 bg-violet-50 w-[100%] mx-auto"
    >
      {/* SECTION HEADING CONTAINER */}
      <div className="text-center mb-12">
        {/* BADGE */}
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Pricing
        </p>
        {/* MAIN HEADING */}
        <p className="text-4xl sm:text-5xl font-medium text-black mb-3">
          Flexible Plans for Every Developer
        </p>
        {/* DESCRIPTION TEXT */}
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
          Whether you're a solo developer or managing a full team, PlanOra
          scales with your workflow.
        </p>
        {/* BILLING CYCLE TOGGLE */}
        <div className="inline-flex items-center p-1.5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-violet-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-violet-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white">
              Save 17%
            </span>
          </button>
        </div>
      </div>
      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        /* PRICING CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* MAPPING THROUGH PLANS */}
          {plans?.map((plan) => {
            const planKey = plan.name.toLowerCase() as PlanType;
            const Icon = PlanIcons[planKey] || Zap;

            return (
              // PRICING CARD CONTAINER
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white ${
                  plan.isPopular
                    ? "border-violet-500 ring-2 ring-violet-200"
                    : "border-gray-200"
                }`}
              >
                {/* POPULAR BADGE */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-lg uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}
                {/* CARD HEADER CONTAINER */}
                <div className="mb-6">
                  {/* PLAN ICON & NAME */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        plan.isPopular ? "bg-violet-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          plan.isPopular ? "text-violet-600" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide">
                        {plan.name}
                      </p>
                    </div>
                  </div>
                  {/* PLAN PRICE */}
                  <div className="flex items-baseline gap-1">
                    <h1 className="text-4xl font-bold text-gray-900">
                      {getDisplayPrice(plan)}
                    </h1>
                    <span className="text-gray-500 text-lg">/mo</span>
                  </div>
                  {/* YEARLY SAVINGS */}
                  {billingCycle === "yearly" && plan.pricing.yearlySavings > 0 && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      Save ${plan.pricing.yearlySavings}/year
                    </p>
                  )}
                  {/* PLAN TAGLINE */}
                  <p className="text-gray-600 mt-2">{plan.tagline}</p>
                </div>
                {/* LIMITS SECTION */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Includes
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Projects:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {formatLimitValue("projects", plan.limits.projects)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Repos:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {formatLimitValue("repos", plan.limits.repos)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">AI/Day:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {formatLimitValue(
                          "aiRequestsPerDay",
                          plan.limits.aiRequestsPerDay
                        )}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Team:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {formatLimitValue("teamMembers", plan.limits.teamMembers)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* FEATURES LIST CONTAINER */}
                <ul className="flex-1 space-y-3 mb-8">
                  {/* MAPPING THROUGH FEATURES */}
                  {KEY_FEATURES.map((featureKey) => {
                    // CHECK IF FEATURE IS ENABLED
                    const hasFeature = plan.features[featureKey] === true;
                    // RETURN FEATURE LIST ITEM
                    return (
                      <li
                        key={featureKey}
                        className={`flex items-start gap-2 text-sm ${
                          hasFeature ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {/* CHECKMARK/X ICON */}
                        {hasFeature ? (
                          <span className="flex-shrink-0 mt-0.5 p-0.5 rounded-full bg-violet-100">
                            <Check className="w-3 h-3 text-violet-600" />
                          </span>
                        ) : (
                          <span className="flex-shrink-0 mt-0.5 p-0.5 rounded-full bg-gray-100">
                            <X className="w-3 h-3 text-gray-400" />
                          </span>
                        )}
                        {/* FEATURE TEXT */}
                        <span>{FEATURE_DISPLAY_NAMES[featureKey]}</span>
                      </li>
                    );
                  })}
                </ul>
                {/* BUTTON CONTAINER */}
                <button
                  onClick={() => handleSelectPlan(planKey)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer ${
                    plan.isPopular
                      ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.isPopular ? "Get Started" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* FOOTER NOTES */}
      <div className="text-center mt-12 space-y-2">
        <p className="text-gray-500 text-sm">
          💡 14-day free trial on all plans. No credit card required.
        </p>
        <p className="text-gray-400 text-sm">
          Cancel anytime. Upgrade or downgrade whenever you need.
        </p>
      </div>
    </section>
  );
};

export default PricingPlan;
