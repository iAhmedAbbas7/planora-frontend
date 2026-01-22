// <== IMPORTS ==>
import {
  createContext,
  useMemo,
  useState,
  useCallback,
  JSX,
  ReactNode,
} from "react";
import {
  ISubscription,
  PlanType,
  BillingCycle,
  FeatureKey,
  IPlanFeatures,
  IPlanLimits,
  IUsageTracking,
  PLAN_HIERARCHY,
  TrialPlanType,
  canStartTrial as canStartTrialCheck,
} from "../types/billing";
import {
  useSubscription,
  useUsageStats,
  useCreateCheckout,
  useCreatePortal,
} from "../hooks/useBilling";

// <== SUBSCRIPTION CONTEXT VALUE INTERFACE ==>
export interface SubscriptionContextValue {
  // <== SUBSCRIPTION DATA ==>
  subscription: ISubscription | null;
  // <== LOADING STATE ==>
  isLoading: boolean;
  // <== ERROR STATE ==>
  error: Error | null;
  // <== CURRENT PLAN ==>
  currentPlan: PlanType;
  // <== TRIAL PLAN (WHICH PAID PLAN USER IS TRIALING) ==>
  trialPlan: TrialPlanType | null;
  // <== IS SUBSCRIPTION ACTIVE ==>
  isActive: boolean;
  // <== IS TRIAL ==>
  isTrial: boolean;
  // <== IS FREE PLAN ==>
  isFree: boolean;
  // <== CAN START TRIAL ==>
  canStartTrial: boolean;
  // <== TRIAL DAYS REMAINING ==>
  trialDaysRemaining: number;
  // <== IS CANCELLED (WILL CANCEL AT PERIOD END) ==>
  isCancelled: boolean;
  // <== CURRENT PERIOD END DATE ==>    
  currentPeriodEnd: Date | null;
  // <== FEATURES ==>
  features: IPlanFeatures | null;
  // <== LIMITS ==>
  limits: IPlanLimits | null;
  // <== USAGE ==>
  usage: IUsageTracking | null;
  // <== CHECK IF FEATURE IS AVAILABLE ==>
  hasFeature: (feature: FeatureKey) => boolean;
  // <== CHECK IF WITHIN LIMIT ==>
  isWithinLimit: (
    limitKey: keyof IPlanLimits,
    usageKey: keyof IUsageTracking
  ) => boolean;
  // <== GET REMAINING QUOTA ==>
  getRemainingQuota: (
    limitKey: keyof IPlanLimits,
    usageKey: keyof IUsageTracking
  ) => number;
  // <== CHECK IF USER CAN UPGRADE ==>
  canUpgradeTo: (plan: PlanType) => boolean;
  // <== CHECK IF USER CAN DOWNGRADE ==>
  canDowngradeTo: (plan: PlanType) => boolean;
  // <== OPEN CHECKOUT ==>
  openCheckout: (plan: PlanType, billingCycle: BillingCycle) => void;
  // <== OPEN BILLING PORTAL ==>
  openBillingPortal: () => void;
  // <== IS CHECKOUT LOADING ==>
  isCheckoutLoading: boolean;
  // <== IS PORTAL LOADING ==>    
  isPortalLoading: boolean;
  // <== SHOW UPGRADE MODAL ==>
  showUpgradeModal: boolean;
  // <== SET SHOW UPGRADE MODAL ==>
  setShowUpgradeModal: (show: boolean) => void;
  // <== UPGRADE MODAL FEATURE ==>
  upgradeModalFeature: FeatureKey | null;
  // <== TRIGGER UPGRADE MODAL ==>
  triggerUpgradeModal: (feature: FeatureKey) => void;
  // <== USAGE STATS ==>
  usageStats: ReturnType<typeof useUsageStats>["data"] | null;
  // <== REFRESH SUBSCRIPTION ==>
  refetchSubscription: () => void;
}

// <== CREATE CONTEXT ==>
const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

// <== SUBSCRIPTION PROVIDER COMPONENT ==>
export function SubscriptionProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // SUBSCRIPTION QUERY
  const {
    data: subscription,
    isLoading,
    error,
    refetch: refetchSubscription,
  } = useSubscription();
  // USAGE STATS QUERY
  const { data: usageStats } = useUsageStats();
  // CHECKOUT MUTATION
  const { mutate: createCheckout, isPending: isCheckoutLoading } =
    useCreateCheckout();
  // PORTAL MUTATION
  const { mutate: createPortal, isPending: isPortalLoading } = useCreatePortal();
  // UPGRADE MODAL STATE
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // UPGRADE MODAL FEATURE STATE
  const [upgradeModalFeature, setUpgradeModalFeature] =
    useState<FeatureKey | null>(null);
  // CURRENT PLAN
  const currentPlan = subscription?.plan ?? "free";
  // TRIAL PLAN STATE
  const trialPlan = subscription?.trialPlan ?? null;
  // IS ACTIVE STATE
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  // IS TRIAL STATE
  const isTrial = subscription?.status === "trialing";
  // IS FREE STATE
  const isFree = currentPlan === "free";
  // CAN START TRIAL STATE
  const canStartTrial = canStartTrialCheck(currentPlan, subscription?.status ?? "active");
  // TRIAL DAYS REMAINING STATE
  const trialDaysRemaining = subscription?.trialDaysRemaining ?? 0;
  // IS CANCELLED STATE
  const isCancelled = subscription?.cancelAtPeriodEnd ?? false;
  // FEATURES STATE
  const features = subscription?.features ?? null;
  // LIMITS STATE
  const limits = subscription?.limits ?? null;
  // USAGE STATE
  const usage = subscription?.usage ?? null;
  // CURRENT PERIOD END DATE STATE
  const currentPeriodEnd = useMemo(() => {
    // RETURN CURRENT PERIOD END DATE
    return subscription?.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;
  }, [subscription?.currentPeriodEnd]);
  // HAS FEATURE STATE
  const hasFeature = useCallback(
    (feature: FeatureKey): boolean => {
      // RETURN FALSE IF NO FEATURES
      if (!features) return false;
      // RETURN TRUE IF FEATURE IS AVAILABLE
      return features[feature] === true;
    },
    [features]
  );
  // IS WITHIN LIMIT STATE
  const isWithinLimit = useCallback(
    (
      limitKey: keyof IPlanLimits,
      usageKey: keyof IUsageTracking
    ): boolean => {
      // RETURN FALSE IF NO LIMITS OR USAGE
      if (!limits || !usage) return false;
      // GET LIMIT
      const limit = limits[limitKey];
      // GET CURRENT USAGE
      const currentUsage = usage[usageKey];
      // RETURN TRUE IF UNLIMITED
      if (limit === -1) return true;
      // CHECK IF USAGE IS A NUMBER
      if (typeof currentUsage !== "number") return false;
      // CHECK IF WITHIN LIMIT
      return currentUsage < limit;
    },
    [limits, usage]
  );
  // GET REMAINING QUOTA STATE
  const getRemainingQuota = useCallback(
    (
      limitKey: keyof IPlanLimits,
      usageKey: keyof IUsageTracking
    ): number => {
      // RETURN 0 IF NO LIMITS OR USAGE
      if (!limits || !usage) return 0;
      // GET LIMIT
      const limit = limits[limitKey];
      // GET CURRENT USAGE
      const currentUsage = usage[usageKey];
      // RETURN -1 IF UNLIMITED
      if (limit === -1) return -1;
      // RETURN 0 IF USAGE IS NOT A NUMBER
      if (typeof currentUsage !== "number") return 0;
      // RETURN REMAINING
      return Math.max(0, limit - currentUsage);
    },
    [limits, usage]
  );
  // CAN UPGRADE TO STATE
  const canUpgradeTo = useCallback(
    (plan: PlanType): boolean => {
      // RETURN TRUE IF PLAN IS HIGHER IN HIERARCHY
      return PLAN_HIERARCHY[plan] > PLAN_HIERARCHY[currentPlan];
    },
    [currentPlan]
  );
  // CAN DOWNGRADE TO STATE
  const canDowngradeTo = useCallback(
    (plan: PlanType): boolean => {
      // RETURN TRUE IF PLAN IS LOWER IN HIERARCHY
      return PLAN_HIERARCHY[plan] < PLAN_HIERARCHY[currentPlan];
    },
    [currentPlan]
  );
  // OPEN CHECKOUT STATE
  const openCheckout = useCallback(
    (plan: PlanType, billingCycle: BillingCycle) => {
      createCheckout({ plan, billingCycle });
    },
    [createCheckout]
  );
  // OPEN BILLING PORTAL STATE
  const openBillingPortal = useCallback(() => {
    // CREATE PORTAL
    createPortal();
  }, [createPortal]);
  // TRIGGER UPGRADE MODAL STATE
  const triggerUpgradeModal = useCallback((feature: FeatureKey) => {
    // SET UPGRADE MODAL FEATURE
    setUpgradeModalFeature(feature);
    // SET SHOW UPGRADE MODAL TO TRUE
    setShowUpgradeModal(true);
  }, []);
  // VALUE STATE
  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription: subscription ?? null,
      isLoading,
      error: error as Error | null,
      currentPlan,
      trialPlan,
      isActive,
      isTrial,
      isFree,
      canStartTrial,
      trialDaysRemaining,
      isCancelled,
      currentPeriodEnd,
      features,
      limits,
      usage,
      hasFeature,
      isWithinLimit,
      getRemainingQuota,
      canUpgradeTo,
      canDowngradeTo,
      openCheckout,
      openBillingPortal,
      isCheckoutLoading,
      isPortalLoading,
      showUpgradeModal,
      setShowUpgradeModal,
      upgradeModalFeature,
      triggerUpgradeModal,
      usageStats: usageStats ?? null,
      refetchSubscription,
    }),
    [
      subscription,
      isLoading,
      error,
      currentPlan,
      trialPlan,
      isActive,
      isTrial,
      isFree,
      canStartTrial,
      trialDaysRemaining,
      isCancelled,
      currentPeriodEnd,
      features,
      limits,
      usage,
      hasFeature,
      isWithinLimit,
      getRemainingQuota,
      canUpgradeTo,
      canDowngradeTo,
      openCheckout,
      openBillingPortal,
      isCheckoutLoading,
      isPortalLoading,
      showUpgradeModal,
      upgradeModalFeature,
      triggerUpgradeModal,
      usageStats,
      refetchSubscription,
    ]
  );
  // RETURN PROVIDER
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// <== EXPORT CONTEXT FOR HOOK ==>
export { SubscriptionContext };
