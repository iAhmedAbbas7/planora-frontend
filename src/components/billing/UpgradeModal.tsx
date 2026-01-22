// <== IMPORTS ==>
import {
  PlanType,
  BillingCycle,
  FeatureKey,
  FEATURE_DISPLAY_NAMES,
  formatLimitValue,
} from "../../types/billing";
import { useState, useEffect, JSX } from "react";
import { usePlans } from "../../hooks/useBilling";
import { X, Check, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { useSubscriptionContext } from "../../hooks/useSubscriptionContext";

// <== PLAN ICON MAP ==>
const PlanIcon: Record<string, typeof Zap> = {
  individual: Zap,
  team: Sparkles,
  enterprise: Crown,
};

// <== PLAN COLOR MAP ==>
const PlanColors: Record<
  string,
  { bg: string; text: string; border: string; accent: string }
> = {
  // INDIVIDUAL PLAN COLORS
  individual: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    accent: "bg-blue-500",
  },
  // TEAM PLAN COLORS
  team: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    accent: "bg-purple-500",
  },
  // ENTERPRISE PLAN COLORS
  enterprise: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-500",
  },
};

// <== UPGRADE MODAL COMPONENT ==>
export const UpgradeModal = (): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const {
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeModalFeature,
    currentPlan,
    openCheckout,
    isCheckoutLoading,
  } = useSubscriptionContext();
  // GET PLANS
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  // BILLING CYCLE STATE
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  // SELECTED PLAN STATE
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  // RESET SELECTED PLAN WHEN MODAL OPENS
  useEffect(() => {
    // IF SHOWING UPGRADE MODAL
    if (showUpgradeModal) {
      // RESET SELECTED PLAN
      setSelectedPlan(null);
    }
  }, [showUpgradeModal]);
  // IF NOT SHOWING UPGRADE MODAL
  if (!showUpgradeModal) {
    // RETURN NULL
    return null;
  }
  // HANDLE CLOSE MODAL
  const handleClose = () => {
    // SET SHOW UPGRADE MODAL TO FALSE
    setShowUpgradeModal(false);
  };
  // HANDLE BACKDROP CLICK
  const handleBackdropClick = (e: React.MouseEvent) => {
    // IF CLICKED ON BACKDROP (NOT MODAL CONTENT)
    if (e.target === e.currentTarget) {
      // CLOSE MODAL
      handleClose();
    }
  };
  // HANDLE UPGRADE PLAN
  const handleUpgrade = (plan: PlanType) => {
    // SET SELECTED PLAN
    setSelectedPlan(plan);
    // OPEN CHECKOUT
    openCheckout(plan, billingCycle);
  };
  // GET FEATURE NAME
  const featureName = upgradeModalFeature
    ? FEATURE_DISPLAY_NAMES[upgradeModalFeature]
    : "this feature";
  // GET AVAILABLE PLANS (ONLY HIGHER THAN CURRENT)
  const availablePlans =
    plans?.filter((plan) => {
      // GET PLAN ORDER
      const planOrder: PlanType[] = ["free_trial", "individual", "team", "enterprise"];
      // GET CURRENT PLAN INDEX
      const currentIndex = planOrder.indexOf(currentPlan);
      // GET PLAN INDEX
      const planIndex = planOrder.indexOf(plan.name.toLowerCase() as PlanType);
      // RETURN TRUE IF PLAN INDEX IS GREATER THAN CURRENT PLAN INDEX
      return planIndex > currentIndex;
    }) ?? [];
  // RETURN UPGRADE MODAL COMPONENT
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[var(--bg)] rounded-2xl shadow-2xl border border-[var(--border)]">
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-color)]" />
              Upgrade Your Plan
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Unlock <span className="font-medium">{featureName}</span> and more
              powerful features
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
        {/* BILLING CYCLE TOGGLE */}
        <div className="px-6 py-4 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-lg bg-[var(--bg-secondary)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-[var(--bg)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[var(--bg)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-green-500/10 text-green-600 dark:text-green-400">
                Save 17%
              </span>
            </button>
          </div>
        </div>
        {/* PLANS GRID */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => {
                // GET PLAN KEY
                const planKey = plan.name.toLowerCase() as PlanType;
                // GET PLAN ICON
                const Icon = PlanIcon[planKey] || Zap;
                // GET PLAN COLORS
                const colors = PlanColors[planKey] || PlanColors.individual;
                // GET PRICE
                const price =
                  billingCycle === "yearly"
                    ? plan.pricing.yearly / 12
                    : plan.pricing.monthly;
                // GET IS SELECTED
                const isSelected = selectedPlan === planKey;
                // GET IS LOADING
                const isLoading = isCheckoutLoading && isSelected;
                // RETURN PLAN CARD
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl border-2 p-6 transition-all ${
                      plan.isPopular
                        ? `${colors.border} ${colors.bg}`
                        : "border-[var(--border)] hover:border-[var(--border-hover)]"
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
                      <div
                        className={`p-2 rounded-lg ${colors.bg}`}
                      >
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {plan.tagline}
                        </p>
                      </div>
                    </div>
                    {/* PRICE */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[var(--text-primary)]">
                          ${price.toFixed(0)}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          /month
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Save ${plan.pricing.yearlySavings}/year
                        </p>
                      )}
                    </div>
                    {/* KEY LIMITS */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-[var(--border)]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          Projects
                        </span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {formatLimitValue("projects", plan.limits.projects)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          Repositories
                        </span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {formatLimitValue("repos", plan.limits.repos)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          AI Requests/Day
                        </span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {formatLimitValue(
                            "aiRequestsPerDay",
                            plan.limits.aiRequestsPerDay
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          Team Members
                        </span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {formatLimitValue("teamMembers", plan.limits.teamMembers)}
                        </span>
                      </div>
                    </div>
                    {/* KEY FEATURES */}
                    <div className="space-y-2 mb-6">
                      {Object.entries(plan.features)
                        .filter(([, value]) => value === true)
                        .slice(0, 5)
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className={`w-4 h-4 ${colors.text}`} />
                            <span className="text-[var(--text-secondary)]">
                              {FEATURE_DISPLAY_NAMES[key as FeatureKey]}
                            </span>
                          </div>
                        ))}
                    </div>
                    {/* UPGRADE BUTTON */}
                    <button
                      onClick={() => handleUpgrade(planKey)}
                      disabled={isLoading}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        plan.isPopular
                          ? `${colors.accent} text-white hover:opacity-90`
                          : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Upgrade to {plan.name}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {/* ENTERPRISE CONTACT */}
          {!availablePlans.some(
            (p) => p.name.toLowerCase() === "enterprise"
          ) && (
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">
                    Need Enterprise Features?
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Get SSO, custom integrations, dedicated support, and
                    unlimited everything for your organization.
                  </p>
                </div>
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
