// <== IMPORTS ==>
import {
  Check,
  Loader2,
  Sparkles,
  Building2,
  Crown,
  ArrowRight,
  Zap,
  Gift,
} from "lucide-react";
import {
  PlanType,
  BillingCycle,
  TrialPlanType,
  IPlanConfig,
  FEATURE_DISPLAY_NAMES,
  FeatureKey,
} from "../types/billing";
import {
  usePlans,
  useCreateCheckout,
  useStartFreeTrial,
} from "../hooks/useBilling";
import useTitle from "../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { useState, JSX, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";

// <== PLAN ICONS ==>
const PlanIcons: Record<string, typeof Sparkles> = {
  individual: Sparkles,
  team: Building2,
  enterprise: Crown,
};

// <== PLAN COLORS ==>
const PlanColors: Record<
  string,
  { bg: string; text: string; border: string; accent: string }
> = {
  // INDIVIDUAL PLAN COLORS
  individual: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    accent: "bg-blue-500",
  },
  // TEAM PLAN COLORS
  team: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
    accent: "bg-purple-500",
  },
  // ENTERPRISE PLAN COLORS
  enterprise: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
    accent: "bg-amber-500",
  },
};

// <== PLAN CARD COMPONENT ==>
const PlanCard = ({
  plan,
  billingCycle,
  onSelectPlan,
  onStartTrial,
  isProcessingCheckout,
  isProcessingTrial,
}: {
  plan: IPlanConfig;
  billingCycle: BillingCycle;
  onSelectPlan: (plan: PlanType) => void;
  onStartTrial: (plan: TrialPlanType) => void;
  isProcessingCheckout: boolean;
  isProcessingTrial: boolean;
}): JSX.Element => {
  // GET PLAN KEY
  const planKey = plan.name.toLowerCase() as PlanType;
  // GET ICON
  const Icon = PlanIcons[planKey] || Sparkles;
  // GET COLORS
  const colors = PlanColors[planKey] || PlanColors.individual;
  // GET PRICE
  const price =
    billingCycle === "yearly"
      ? plan.pricing.yearly / 12
      : plan.pricing.monthly;
  // GET ENABLED FEATURES
  const enabledFeatures = Object.entries(plan.features)
    .filter(([, value]) => value === true)
    .slice(0, 6);
  // RETURN CARD
  return (
    <div
      className={`relative p-6 sm:p-8 rounded-xl border-2 transition-all hover:shadow-lg ${
        plan.isPopular
          ? `${colors.border} ${colors.bg}`
          : "border-[var(--border)] bg-[var(--cards-bg)]"
      }`}
    >
      {/* POPULAR BADGE */}
      {plan.isPopular && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full text-white ${colors.accent}`}
        >
          Most Popular
        </div>
      )}
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            {plan.name}
          </h3>
          <p className="text-sm text-[var(--light-text)]">{plan.tagline}</p>
        </div>
      </div>
      {/* PRICE */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[var(--text-primary)]">
            ${price.toFixed(0)}
          </span>
          <span className="text-base text-[var(--light-text)]">/month</span>
        </div>
        {billingCycle === "yearly" && (
          <p className="text-sm text-green-500 mt-1">
            Save ${plan.pricing.yearlySavings}/year
          </p>
        )}
      </div>
      {/* FEATURES */}
      <ul className="space-y-3 mb-8">
        {enabledFeatures.map(([key]) => (
          <li
            key={key}
            className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
          >
            <Check className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
            <span>{FEATURE_DISPLAY_NAMES[key as FeatureKey]}</span>
          </li>
        ))}
        {Object.keys(plan.features).filter(
          (key) => plan.features[key as FeatureKey] === true
        ).length > 6 && (
          <li className="text-sm text-[var(--light-text)] pl-6">
            ... and more
          </li>
        )}
      </ul>
      {/* BUTTONS */}
      <div className="space-y-3">
        {/* START FREE TRIAL BUTTON */}
        <button
          onClick={() => onStartTrial(planKey as TrialPlanType)}
          disabled={isProcessingCheckout || isProcessingTrial}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            plan.isPopular
              ? `${colors.accent} text-white hover:opacity-90`
              : "bg-[var(--accent-color)] text-white hover:opacity-90"
          }`}
        >
          {isProcessingTrial ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Starting Trial...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Start 14-Day Free Trial
            </>
          )}
        </button>
        {/* SUBSCRIBE NOW BUTTON */}
        <button
          onClick={() => onSelectPlan(planKey)}
          disabled={isProcessingCheckout || isProcessingTrial}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--border)]"
        >
          {isProcessingCheckout ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Subscribe to ${plan.name}`
          )}
        </button>
      </div>
    </div>
  );
};

// <== PLAN SELECTION PAGE COMPONENT ==>
const PlanSelectionPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Choose Your Plan");
  // GET NAVIGATE FUNCTION
  const navigate = useNavigate();
  // GET USER FROM AUTH STORE
  const { user } = useAuthStore();
  // HEADER SCROLL STATE
  const [isScrolled, setIsScrolled] = useState(false);
  // BILLING CYCLE STATE
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  // HANDLE SCROLL FOR HEADER EFFECT
  useEffect(() => {
    // HANDLE SCROLL FOR HEADER EFFECT
    const handleScroll = () => {
      // SET IS SCROLLED STATE
      setIsScrolled(window.scrollY > 10);
    };
    // ADD SCROLL EVENT LISTENER
    window.addEventListener("scroll", handleScroll);
    // CLEANUP: REMOVE SCROLL EVENT LISTENER
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // SELECTED PLAN STATES
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] =
    useState<PlanType | null>(null);
  // SELECTED PLAN FOR TRIAL STATE
  const [selectedPlanForTrial, setSelectedPlanForTrial] =
    useState<TrialPlanType | null>(null);
  // GET PLANS
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  // CREATE CHECKOUT MUTATION
  const createCheckoutMutation = useCreateCheckout();
  // START FREE TRIAL MUTATION
  const startFreeTrialMutation = useStartFreeTrial();
  // HANDLE SELECT PLAN FOR CHECKOUT
  const handleSelectPlan = (plan: PlanType): void => {
    // SET SELECTED PLAN FOR CHECKOUT
    setSelectedPlanForCheckout(plan);
    // CREATE CHECKOUT
    createCheckoutMutation.mutate(
      { plan, billingCycle },
      {
        // ON ERROR, SET SELECTED PLAN FOR CHECKOUT TO NULL
        onError: () => {
          // SET SELECTED PLAN FOR CHECKOUT TO NULL
          setSelectedPlanForCheckout(null);
        },
      }
    );
  };
  // HANDLE START TRIAL
  const handleStartTrial = (plan: TrialPlanType): void => {
    // SET SELECTED PLAN FOR TRIAL
    setSelectedPlanForTrial(plan);
    // START FREE TRIAL
    startFreeTrialMutation.mutate(plan, {
      // ON SUCCESS, NAVIGATE TO SETUP PAGE
      onSuccess: () => {
        // NAVIGATE TO ONBOARDING SETUP AFTER STARTING TRIAL
        navigate("/onboarding/setup");
      },
      // ON ERROR, SET SELECTED PLAN FOR TRIAL TO NULL
      onError: () => {
        // SET SELECTED PLAN FOR TRIAL TO NULL
        setSelectedPlanForTrial(null);
      },
    });
  };
  // HANDLE SKIP - NAVIGATE TO SETUP PAGE
  const handleSkip = (): void => {
    // NAVIGATE TO ONBOARDING SETUP PAGE
    navigate("/onboarding/setup");
  };
  // FILTER PREMIUM PLANS (EXCLUDE FREE AND FREE TRIAL)
  const premiumPlans =
    plans?.filter(
      (p) => p.name !== "Free" && p.name !== "Free Trial"
    ) || [];
  // RETURN COMPONENT
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      {/* FIXED INTERACTIVE HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--bg)]/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* LEFT: LOGO AND BRANDING */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <img
                  src={PURPLE_LOGO}
                  alt="PlanOra"
                  className="h-8 sm:h-9"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl font-semibold text-[#562aae]">
                  PlanOra
                </span>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-5 w-px bg-[var(--border)]" />
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Gift className="w-3 h-3 inline mr-1" />
                    Choose Plan
                  </span>
                </div>
              </div>
            </div>
            {/* RIGHT: SKIP BUTTON */}
            <button
              onClick={handleSkip}
              className="group flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--cards-bg)] border border-transparent hover:border-[var(--border)] transition-all duration-200"
            >
              <span className="hidden sm:inline">Continue with Free</span>
              <span className="sm:hidden">Skip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>
      {/* SPACER FOR FIXED HEADER */}
      <div className="h-16 sm:h-18" />
      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl mx-auto">
          {/* PAGE HEADER */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 🎉
            </h1>
            <p className="text-base sm:text-lg text-[var(--light-text)] max-w-2xl mx-auto">
              You're starting with the Free plan. Unlock powerful features with a
              premium plan or continue with Free.
            </p>
          </div>
        {/* BILLING CYCLE TOGGLE */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center p-1 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[var(--hover-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-green-500/20 text-green-500">
                Save 17%
              </span>
            </button>
          </div>
        </div>
        {/* PLAN CARDS */}
        {isLoadingPlans ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumPlans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                billingCycle={billingCycle}
                onSelectPlan={handleSelectPlan}
                onStartTrial={handleStartTrial}
                isProcessingCheckout={
                  createCheckoutMutation.isPending &&
                  selectedPlanForCheckout === plan.name.toLowerCase()
                }
                isProcessingTrial={
                  startFreeTrialMutation.isPending &&
                  selectedPlanForTrial === plan.name.toLowerCase()
                }
              />
            ))}
          </div>
        )}
          {/* SKIP BUTTON */}
          <div className="text-center mt-10">
            <button
              onClick={handleSkip}
              className="text-[var(--light-text)] hover:text-[var(--text-primary)] transition flex items-center gap-2 mx-auto"
            >
              Continue with Free plan
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-2 text-xs text-[var(--light-text)]">
              You can always upgrade later from your settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionPage;
