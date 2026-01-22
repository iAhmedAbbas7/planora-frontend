// <== IMPORTS ==>
import {
  CreditCard,
  Receipt,
  ExternalLink,
  Crown,
  AlertTriangle,
  Download,
  RefreshCw,
  Zap,
  Sparkles,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowLeft,
  Check,
  Infinity as InfinityIcon,
  Gift,
  User,
} from "lucide-react";
import {
  getPlanBadgeColor,
  getStatusBadgeColor,
  FEATURE_DISPLAY_NAMES,
  FeatureKey,
  PlanType,
  BillingCycle,
  TrialPlanType,
  formatLimitValue,
  canStartTrial,
  getPlanDisplayName,
} from "../../types/billing";
import {
  useInvoices,
  useUpcomingInvoice,
  useCancelSubscription,
  useReactivateSubscription,
  usePlans,
  useStartFreeTrial,
} from "../../hooks/useBilling";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, JSX } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import { useSubscriptionContext } from "../../hooks/useSubscriptionContext";

// <== PLAN ICONS ==>
const PlanIcons: Record<string, typeof Zap> = {
  free: User,
  free_trial: Gift,
  individual: Zap,
  team: Sparkles,
  enterprise: Building2,
};

// <== PLAN COLORS ==>
const PlanColors: Record<
  string,
  { bg: string; text: string; border: string; accent: string }
> = {
  // FREE PLAN COLORS
  free: {
    bg: "bg-slate-500/10",
    text: "text-slate-500",
    border: "border-slate-500/30",
    accent: "bg-slate-500",
  },
  // FREE TRIAL PLAN COLORS
  free_trial: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
    border: "border-cyan-500/30",
    accent: "bg-cyan-500",
  },
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

// <== VIEW TYPE ==>
type ViewType = "main" | "plans" | "trial";

// <== BILLING SETTINGS COMPONENT ==>
export const BillingSettings = (): JSX.Element => {
  // GET URL SEARCH PARAMS (FOR CHECKOUT REDIRECT FROM OAUTH)
  const [searchParams, setSearchParams] = useSearchParams();
  // GET CHECKOUT REQUESTED
  const checkoutRequested = searchParams.get("checkout") === "true";
  // GET CHECKOUT PLAN
  const checkoutPlan = searchParams.get("plan") as PlanType | null;
  // GET CHECKOUT CYCLE
  const checkoutCycle = (searchParams.get("cycle") || "monthly") as BillingCycle;
  // TRACK IF CHECKOUT HAS BEEN INITIATED
  const checkoutInitiated = useRef(false);
  // VIEW STATE
  const [currentView, setCurrentView] = useState<ViewType>("main");
  // BILLING CYCLE STATE (FOR PLAN SELECTION)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  // SELECTED PLAN STATE (FOR LOADING INDICATOR)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  // SELECTED TRIAL PLAN STATE
  const [selectedTrialPlan, setSelectedTrialPlan] = useState<TrialPlanType | null>(null);
  // CANCEL MODAL STATE
  const [showCancelModal, setShowCancelModal] = useState(false);
  // GET SUBSCRIPTION CONTEXT
  const {
    subscription,
    isLoading,
    currentPlan,
    isTrial,
    trialDaysRemaining,
    isCancelled,
    currentPeriodEnd,
    features,
    limits,
    usage,
    openCheckout,
    isCheckoutLoading,
    openBillingPortal,
    isPortalLoading,
  } = useSubscriptionContext();
  // GET ALL PLANS
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  // START FREE TRIAL MUTATION
  const { mutate: startTrial, isPending: isStartingTrial } = useStartFreeTrial();
  // CHECK IF USER CAN START A TRIAL
  const userCanStartTrial = canStartTrial(currentPlan, subscription?.status ?? "active");
  // AUTO-TRIGGER CHECKOUT IF REDIRECTED FROM OAUTH SIGNUP WITH PLAN
  useEffect(() => {
    if (
      checkoutRequested &&
      checkoutPlan &&
      ["individual", "team", "enterprise"].includes(checkoutPlan) &&
      !checkoutInitiated.current &&
      !isLoading
    ) {
      // SET CHECKOUT INITIATED TO TRUE
      checkoutInitiated.current = true;
      // CREATE NEW URL SEARCH PARAMS
      const newParams = new URLSearchParams(searchParams);
      // DELETE CHECKOUT PARAM
      newParams.delete("checkout");
      // DELETE PLAN PARAM
      newParams.delete("plan");
      // DELETE CYCLE PARAM
      newParams.delete("cycle");
      // DELETE OAUTH PARAM
      newParams.delete("oauth");
      // SET SEARCH PARAMS
      setSearchParams(newParams, { replace: true });
      // OPEN CHECKOUT
      openCheckout(checkoutPlan, checkoutCycle);
    }
  }, [checkoutRequested, checkoutPlan, checkoutCycle, isLoading, openCheckout, searchParams, setSearchParams]);
  // GET INVOICES
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices(5);
  // GET UPCOMING INVOICE
  const { data: upcomingInvoice } = useUpcomingInvoice(); 
  // CANCEL SUBSCRIPTION MUTATION
  const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription();
  // REACTIVATE SUBSCRIPTION MUTATION
  const { mutate: reactivateSubscription, isPending: isReactivating } = useReactivateSubscription();
  // GET CURRENT PLAN ICON
  const PlanIcon = PlanIcons[currentPlan] || Zap;
  // FORMAT DATE
  const formatDate = (dateStr: string | null): string => {
    // IF NO DATE STR, RETURN N/A
    if (!dateStr) return "N/A";
    // FORMAT DATE
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  // HANDLE CANCEL SUBSCRIPTION
  const handleCancel = () => {
    // CALL CANCEL SUBSCRIPTION MUTATION
    cancelSubscription();
    // CLOSE CANCEL MODAL
    setShowCancelModal(false);
  };
  // HANDLE UPGRADE CLICK
  const handleUpgradeClick = () => {
    // SET CURRENT VIEW TO PLANS
    setCurrentView("plans");
    // RESET SELECTED PLAN
    setSelectedPlan(null);
  };
  // HANDLE START TRIAL CLICK
  const handleStartTrialClick = () => {
    // SET CURRENT VIEW TO TRIAL
    setCurrentView("trial");
    // RESET SELECTED TRIAL PLAN
    setSelectedTrialPlan(null);
  };
  // HANDLE BACK TO MAIN
  const handleBackToMain = () => {
    // SET CURRENT VIEW TO MAIN
    setCurrentView("main");
    // RESET SELECTED PLAN
    setSelectedPlan(null);
    // RESET SELECTED TRIAL PLAN
    setSelectedTrialPlan(null);
  };
  // HANDLE SELECT PLAN
  const handleSelectPlan = (plan: PlanType) => {
    // SET SELECTED PLAN
    setSelectedPlan(plan);
    // OPEN CHECKOUT
    openCheckout(plan, billingCycle);
  };
  // HANDLE SELECT TRIAL PLAN
  const handleSelectTrialPlan = (plan: TrialPlanType) => {
    // SET SELECTED TRIAL PLAN
    setSelectedTrialPlan(plan);
    // START TRIAL
    startTrial(plan, {
      // ON SUCCESS
      onSuccess: () => {
        // SET CURRENT VIEW TO MAIN
        setCurrentView("main");
        // RESET SELECTED TRIAL PLAN
        setSelectedTrialPlan(null);
      },
    });
  };
  // FILTER AVAILABLE PLANS (HIGHER THAN CURRENT)
  const availablePlans =
    plans?.filter((plan) => {
      // GET PLAN ORDER
      const planOrder: PlanType[] = ["free", "free_trial", "individual", "team", "enterprise"];
      // GET CURRENT PLAN INDEX
      const currentIndex = planOrder.indexOf(currentPlan);
      // GET PLAN INDEX
      const planIndex = planOrder.indexOf(plan.name.toLowerCase() as PlanType);
      // RETURN TRUE IF PLAN INDEX IS GREATER THAN CURRENT PLAN INDEX
      return planIndex > currentIndex;
    }) ?? [];

  // GET TRIAL ELIGIBLE PLANS
  const trialEligiblePlans = plans?.filter((plan) => {
    // GET PLAN KEY
    const planKey = plan.name.toLowerCase();
    // RETURN TRUE IF PLAN KEY IS INDIVIDUAL, TEAM, OR ENTERPRISE
    return ["individual", "team", "enterprise"].includes(planKey);
  }) ?? [];
  // LOADING SKELETON
  if (isLoading) {
    // RETURN LOADING SKELETON
    return (
      <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          <div className="h-4 w-72 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
        <div className="h-40 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        <div className="h-32 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        <div className="h-48 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
      </div>
    );
  }
  // IF CURRENT VIEW IS PLANS
  if (currentView === "plans") {
    return (
      <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6">
        {/* HEADER WITH BACK BUTTON */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToMain}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition text-[var(--light-text)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Crown size={22} className="text-[var(--accent-color)]" />
              Choose Your Plan
            </p>
            <p className="text-sm text-[var(--light-text)]">
              Upgrade to unlock more features and higher limits
            </p>
          </div>
        </div>
        {/* BILLING CYCLE TOGGLE */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-[var(--cards-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[var(--cards-bg)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
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
        {/* PLANS GRID */}
        {isLoadingPlans ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
          </div>
        ) : availablePlans.length === 0 ? (
          <div className="p-6 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] text-center">
            <Crown size={48} className="mx-auto text-[var(--accent-color)] mb-4" />
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              You're on the highest plan!
            </p>
            <p className="text-sm text-[var(--light-text)] mt-2">
              You already have access to all premium features.
            </p>
            <button
              onClick={handleBackToMain}
              className="mt-4 px-6 py-2 rounded-lg text-sm font-medium border border-[var(--border)] hover:bg-[var(--hover-bg)] transition text-[var(--text-primary)]"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlans.map((plan) => {
              // GET PLAN KEY
              const planKey = plan.name.toLowerCase() as PlanType;
              // GET PLAN ICON
              const Icon = PlanIcons[planKey] || Zap;
              // GET PLAN COLORS
              const colors = PlanColors[planKey] || PlanColors.individual;
              // GET PLAN PRICE
              const price = billingCycle === "yearly" ? plan.pricing.yearly / 12 : plan.pricing.monthly;
              // GET IS SELECTED
              const isSelected = selectedPlan === planKey;
              // GET IS PROCESSING
              const isProcessing = isCheckoutLoading && isSelected;
              // RETURN PLAN CARD
              return (
                <div
                  key={plan.name}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    plan.isPopular
                      ? `${colors.border} ${colors.bg}`
                      : "border-[var(--border)] bg-[var(--inside-card-bg)]"
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
                  {/* PLAN HEADER */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                      <p className="text-xs text-[var(--light-text)]">{plan.tagline}</p>
                    </div>
                  </div>
                  {/* PRICE */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[var(--text-primary)]">
                        ${price.toFixed(0)}
                      </span>
                      <span className="text-sm text-[var(--light-text)]">/month</span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-xs text-green-500 mt-1">
                        Save ${plan.pricing.yearlySavings}/year
                      </p>
                    )}
                  </div>
                  {/* KEY LIMITS */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">Projects</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("projects", plan.limits.projects)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">Repositories</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("repos", plan.limits.repos)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">AI Requests/Day</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("aiRequestsPerDay", plan.limits.aiRequestsPerDay)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">Team Members</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("teamMembers", plan.limits.teamMembers)}
                      </span>
                    </div>
                  </div>
                  {/* KEY FEATURES */}
                  <div className="space-y-2 mb-6">
                    {Object.entries(plan.features)
                      .filter(([, value]) => value === true)
                      .slice(0, 4)
                      .map(([key]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Check className={`w-4 h-4 ${colors.text}`} />
                          <span className="text-[var(--light-text)]">
                            {FEATURE_DISPLAY_NAMES[key as FeatureKey]}
                          </span>
                        </div>
                      ))}
                  </div>
                  {/* UPGRADE BUTTON */}
                  <button
                    onClick={() => handleSelectPlan(planKey)}
                    disabled={isProcessing}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.isPopular
                        ? `${colors.accent} text-white hover:opacity-90`
                        : "bg-[var(--hover-bg)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Choose {plan.name}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* ENTERPRISE CONTACT CTA */}
        {!availablePlans.some((p) => p.name.toLowerCase() === "enterprise") &&
          currentPlan !== "enterprise" && (
            <div className="p-6 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Building2 className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">
                    Need Enterprise Features?
                  </h4>
                  <p className="text-sm text-[var(--light-text)] mt-1">
                    Get SSO, custom integrations, dedicated support, and unlimited everything.
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer">
                  Contact Sales
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }
  // TRIAL SELECTION VIEW
  if (currentView === "trial") {
    return (
      <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6">
        {/* HEADER WITH BACK BUTTON */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToMain}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition text-[var(--light-text)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Gift size={22} className="text-cyan-500" />
              Start Your Free Trial
            </p>
            <p className="text-sm text-[var(--light-text)]">
              Try any premium plan free for 14 days. No credit card required.
            </p>
          </div>
        </div>
        {/* TRIAL INFO BOX */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                How the trial works
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--light-text)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-500" />
                  Full access to all features of your chosen plan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-500" />
                  No credit card required to start
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-500" />
                  Automatically returns to Free plan after 14 days if not subscribed
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* TRIAL PLANS GRID */}
        {isLoadingPlans ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trialEligiblePlans.map((plan) => {
              // GET PLAN KEY
              const planKey = plan.name.toLowerCase() as TrialPlanType;
              // GET PLAN ICON
              const Icon = PlanIcons[planKey] || Zap;
              // GET PLAN COLORS
              const colors = PlanColors[planKey] || PlanColors.individual;
              // GET IS SELECTED
              const isSelected = selectedTrialPlan === planKey;
              // GET IS PROCESSING
              const isProcessing = isStartingTrial && isSelected;
              // RETURN PLAN CARD
              return (
                <div
                  key={plan.name}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    plan.isPopular
                      ? `${colors.border} ${colors.bg}`
                      : "border-[var(--border)] bg-[var(--inside-card-bg)]"
                  }`}
                >
                  {/* POPULAR BADGE */}
                  {plan.isPopular && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full text-white ${colors.accent}`}
                    >
                      Recommended
                    </div>
                  )}
                  {/* PLAN HEADER */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                      <p className="text-xs text-[var(--light-text)]">{plan.tagline}</p>
                    </div>
                  </div>
                  {/* TRIAL BADGE */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-full bg-cyan-500/20 text-cyan-500">
                      <Clock className="w-4 h-4" />
                      14 days free
                    </span>
                  </div>
                  {/* KEY LIMITS */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">Projects</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("projects", plan.limits.projects)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">Repositories</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("repos", plan.limits.repos)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--light-text)]">AI Requests/Day</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {formatLimitValue("aiRequestsPerDay", plan.limits.aiRequestsPerDay)}
                      </span>
                    </div>
                  </div>
                  {/* KEY FEATURES */}
                  <div className="space-y-2 mb-6">
                    {Object.entries(plan.features)
                      .filter(([, value]) => value === true)
                      .slice(0, 4)
                      .map(([key]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Check className={`w-4 h-4 ${colors.text}`} />
                          <span className="text-[var(--light-text)]">
                            {FEATURE_DISPLAY_NAMES[key as FeatureKey]}
                          </span>
                        </div>
                      ))}
                  </div>
                  {/* START TRIAL BUTTON */}
                  <button
                    onClick={() => handleSelectTrialPlan(planKey)}
                    disabled={isProcessing || isStartingTrial}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.isPopular
                        ? `${colors.accent} text-white hover:opacity-90`
                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting Trial...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        Start {plan.name} Trial
                      </>
                    )}
                  </button>
                  {/* PRICE AFTER TRIAL */}
                  <p className="mt-3 text-xs text-center text-[var(--light-text)]">
                    ${plan.pricing.monthly}/mo after trial
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {/* HELP TEXT */}
        <p className="text-center text-sm text-[var(--light-text)]">
          Questions about trials?{" "}
          <a href="#" className="text-[var(--accent-color)] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    );
  }
  // MAIN BILLING VIEW
  return (
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xl font-semibold text-[var(--text-primary)]">Billing & Subscription</p>
        <p className="text-sm text-[var(--light-text)]">
          Manage your subscription, billing information, and invoices.
        </p>
      </div>
      {/* CURRENT PLAN CARD */}
      <div className="p-5 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* PLAN INFO */}
          <div className="flex items-start gap-4">
            {/* PLAN ICON BOX */}
            <div className="relative p-3 rounded-lg overflow-hidden">
              {/* BACKGROUND WITH OPACITY */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: "var(--accent-color)", opacity: 0.15 }}
              />
              {/* ICON (FULLY VISIBLE) */}
              <PlanIcon className="relative w-6 h-6 text-[var(--accent-color)]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">
                  {currentPlan.replace("_", " ")} Plan
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPlanBadgeColor(currentPlan)}`}>
                  {currentPlan.replace("_", " ")}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeColor(subscription?.status ?? "trialing")}`}>
                  {subscription?.status ?? "trialing"}
                </span>
              </div>
              {/* TRIAL INFO */}
              {isTrial && trialDaysRemaining > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-cyan-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {trialDaysRemaining} days left in your{" "}
                    {subscription?.trialPlan ? getPlanDisplayName(subscription.trialPlan) : "premium"} trial
                  </span>
                </div>
              )}
              {/* FREE PLAN TRIAL CTA */}
              {userCanStartTrial && (
                <div className="mt-2 flex items-center gap-2 text-sm text-cyan-500">
                  <Gift className="w-4 h-4" />
                  <span>Try premium features free for 14 days!</span>
                </div>
              )}
              {/* CANCELLED INFO */}
              {isCancelled && currentPeriodEnd && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cancels on {formatDate(currentPeriodEnd.toISOString())}</span>
                </div>
              )}
              {/* BILLING PERIOD */}
              {subscription?.currentPeriodEnd && !isTrial && !isCancelled && (
                <p className="mt-2 text-sm text-[var(--light-text)]">
                  Next billing date: {formatDate(subscription.currentPeriodEnd)}
                </p>
              )}
              {/* PRICING */}
              {subscription?.planConfig?.pricing && (
                <p className="mt-1 text-sm text-[var(--light-text)]">
                  ${subscription.billingCycle === "yearly"
                    ? (subscription.planConfig.pricing.yearly / 12).toFixed(0)
                    : subscription.planConfig.pricing.monthly}
                  /month
                  {subscription.billingCycle === "yearly" && (
                    <span className="ml-1 text-green-500">(billed annually)</span>
                  )}
                </p>
              )}
            </div>
          </div>
          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-2">
            {/* START FREE TRIAL BUTTON (ONLY FOR FREE USERS) */}
            {userCanStartTrial && (
              <button
                onClick={handleStartTrialClick}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition flex items-center gap-2 cursor-pointer bg-cyan-500 hover:bg-cyan-600"
              >
                <Gift className="w-4 h-4" />
                Start Free Trial
              </button>
            )}
            {/* UPGRADE BUTTON (FOR TRIAL OR FREE USERS) */}
            {currentPlan !== "enterprise" && (
              <button
                onClick={handleUpgradeClick}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: "var(--accent-color)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-btn-hover-color)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-color)")}
              >
                <Crown className="w-4 h-4" />
                {currentPlan === "free" || isTrial ? "View Plans" : "Upgrade Plan"}
              </button>
            )}
            {/* MANAGE BILLING BUTTON (ONLY FOR PAID USERS WITH STRIPE) */}
            {subscription?.stripeSubscriptionId && (
              <button
                onClick={openBillingPortal}
                disabled={isPortalLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPortalLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Manage Billing
              </button>
            )}
          </div>
        </div>
        {/* CANCEL/REACTIVATE */}
        {subscription?.stripeSubscriptionId && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            {isCancelled ? (
              <button
                onClick={() => reactivateSubscription()}
                disabled={isReactivating}
                className="text-sm font-medium text-green-500 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isReactivating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Reactivate Subscription
              </button>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm font-medium text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Cancel Subscription
              </button>
            )}
          </div>
        )}
      </div>
      {/* USAGE OVERVIEW */}
      <div className="p-5 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Usage Overview</h3>
        <div className="space-y-4">
          {/* PROJECTS */}
          <UsageRow
            label="Projects"
            current={usage?.projectsCount ?? 0}
            max={limits?.projects ?? 0}
          />
          {/* REPOSITORIES */}
          <UsageRow
            label="Repositories"
            current={usage?.reposCount ?? 0}
            max={limits?.repos ?? 0}
          />
          {/* AI REQUESTS */}
          <UsageRow
            label="AI Requests / Day"
            current={usage?.aiRequestsToday ?? 0}
            max={limits?.aiRequestsPerDay ?? 0}
          />
          {/* CODE REVIEWS */}
          <UsageRow
            label="Code Reviews / Month"
            current={usage?.codeReviewsThisMonth ?? 0}
            max={limits?.codeReviewsPerMonth ?? 0}
          />
        </div>
      </div>
      {/* FEATURES INCLUDED */}
      <div className="p-5 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Features Included in Your Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features &&
            Object.entries(features).map(([key, value]) => (
              <div
                key={key}
                className={`flex items-center gap-2 text-sm ${
                  value ? "text-[var(--text-primary)]" : "text-[var(--light-text)] opacity-50"
                }`}
              >
                {value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-[var(--light-text)] flex-shrink-0" />
                )}
                <span>{FEATURE_DISPLAY_NAMES[key as FeatureKey] || key}</span>
              </div>
            ))}
        </div>
      </div>
      {/* UPCOMING INVOICE */}
      {upcomingInvoice && (
        <div className="p-5 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Upcoming Invoice</h3>
              <p className="text-sm text-[var(--light-text)] mt-1">
                {upcomingInvoice.nextPaymentAttempt
                  ? `Due on ${formatDate(upcomingInvoice.nextPaymentAttempt)}`
                  : "Processing"}
              </p>
            </div>
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {upcomingInvoice.formattedAmount}
            </span>
          </div>
        </div>
      )}
      {/* INVOICE HISTORY */}
      <div className="p-5 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Invoice History</h3>
          {subscription?.stripeCustomerId && (
            <button
              onClick={openBillingPortal}
              className="text-sm text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
        {/* INVOICE HISTORY LOADING SKELETON */}
        {isLoadingInvoices ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : invoices && invoices.length > 0 ? (
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)] gap-3"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-[var(--light-text)] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {invoice.number || `Invoice ${invoice.id.slice(-8)}`}
                    </p>
                    <p className="text-xs text-[var(--light-text)]">{formatDate(invoice.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-8 sm:ml-0">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-amber-500/20 text-amber-500"
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {invoice.formattedAmount}
                  </span>
                  {invoice.invoicePdfUrl && (
                    <a
                      href={invoice.invoicePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-[var(--hover-bg)] rounded transition"
                    >
                      <Download className="w-4 h-4 text-[var(--light-text)]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-[var(--light-text)] mx-auto mb-3 opacity-50" />
            <p className="text-sm text-[var(--light-text)]">No invoices yet</p>
          </div>
        )}
      </div>
      {/* CANCEL SUBSCRIPTION CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Subscription"
        message={`Your subscription will remain active until ${
          currentPeriodEnd ? formatDate(currentPeriodEnd.toISOString()) : "the end of your billing period"
        }. After that, you'll lose access to premium features.`}
        type="warning"
        confirmText={isCancelling ? "Cancelling..." : "Cancel Subscription"}
        cancelText="Keep Subscription"
        showCancel={true}
      />
    </div>
  );
};

// <== USAGE ROW COMPONENT ==>
interface UsageRowProps {
  // <== LABEL ==>
  label: string;
  // <== CURRENT USAGE ==>
  current: number;
  // <== MAX USAGE ==>
  max: number;
}

// <== USAGE ROW COMPONENT ==>
const UsageRow = ({ label, current, max }: UsageRowProps): JSX.Element => {
  // GET IS UNLIMITED
  const isUnlimited = max === -1;
  // GET PERCENTAGE
  const percentage = isUnlimited ? 0 : max > 0 ? (current / max) * 100 : 0;
  // GET IS DANGER
  const isDanger = !isUnlimited && percentage >= 90;
  // GET IS WARNING
  const isWarning = !isUnlimited && percentage >= 75 && percentage < 90;
  // RETURN USAGE ROW
  return (
    // USAGE ROW CONTAINER
    <div className="space-y-1.5">
      {/* USAGE ROW HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--light-text)]">{label}</span>
        {/* USAGE ROW VALUE */}
        <div className="flex items-center gap-1.5">
          {isUnlimited ? (
            <>
              <InfinityIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Unlimited</span>
            </>
          ) : (
            <>
              {(isDanger || isWarning) && (
                <AlertTriangle className={`w-4 h-4 ${isDanger ? "text-red-500" : "text-amber-500"}`} />
              )}
              <span
                className={`text-sm font-medium ${
                  isDanger ? "text-red-500" : isWarning ? "text-amber-500" : "text-[var(--text-primary)]"
                }`}
              >
                {current} / {max}
              </span>
              <span
                className={`text-sm ${
                  isDanger ? "text-red-500" : isWarning ? "text-amber-500" : "text-[var(--light-text)]"
                }`}
              >
                ({Math.round(percentage)}%)
              </span>
            </>
          )}
        </div>
      </div>
      {/* USAGE ROW PROGRESS BAR */}
      {!isUnlimited && (
        <div className="h-2 w-full bg-[var(--hover-bg)] rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isDanger ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-[var(--accent-color)]"
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default BillingSettings;
