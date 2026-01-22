// <== IMPORTS ==>
import {
  FeatureKey,
  FEATURE_DISPLAY_NAMES,
  PlanType,
  PLAN_HIERARCHY,
} from "../../types/billing";
import { ReactNode, JSX } from "react";
import { Lock, Sparkles } from "lucide-react";
import { useSubscriptionContext } from "../../hooks/useSubscriptionContext";

// <== FEATURE GATE PROPS ==>
interface FeatureGateProps {
  // <== FEATURE TO CHECK ==>
  feature: FeatureKey;
  // <== CHILDREN TO RENDER IF FEATURE IS AVAILABLE ==>
  children: ReactNode;
  // <== FALLBACK TO RENDER IF FEATURE IS NOT AVAILABLE ==>
  fallback?: ReactNode;
  // <== SHOW LOCKED UI IF FEATURE IS NOT AVAILABLE ==>
  showLockedUI?: boolean;
  // <== CALLBACK WHEN LOCKED FEATURE IS CLICKED ==>
  onLockedClick?: () => void;
  // <== CUSTOM LOCKED MESSAGE ==>
  lockedMessage?: string;
  // <== MINIMUM PLAN REQUIRED (OPTIONAL - AUTO-DETECTED FROM FEATURE) ==>
  minimumPlan?: PlanType;
}

// <== GET MINIMUM PLAN FOR FEATURE ==>
const getMinimumPlanForFeature = (feature: FeatureKey): PlanType => {
  // FEATURE TO MINIMUM PLAN MAPPING
  const featurePlanMap: Record<FeatureKey, PlanType> = {
    githubIntegration: "free_trial",
    aiTaskSuggestions: "free_trial",
    aiCodeReview: "free_trial",
    aiBugDetection: "team",
    codeExplanation: "free_trial",
    focusMode: "free_trial",
    customThemes: "free_trial",
    advancedReports: "team",
    teamCollaboration: "team",
    workspaces: "team",
    sso: "enterprise",
    auditLogs: "team",
    prioritySupport: "team",
    dedicatedSupport: "enterprise",
    customIntegrations: "enterprise",
    sprintPlanning: "team",
    goalsAndOkrs: "individual",
  };
  return featurePlanMap[feature] || "enterprise";
};

// <== FEATURE GATE COMPONENT ==>
export const FeatureGate = ({
  feature,
  children,
  fallback,
  showLockedUI = true,
  onLockedClick,
  lockedMessage,
  minimumPlan,
}: FeatureGateProps): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const { hasFeature, triggerUpgradeModal, isLoading } =
    useSubscriptionContext();
  // IF LOADING, RETURN NULL OR SKELETON
  if (isLoading) {
    // RETURN NULL
    return null;
  }
  // CHECK IF FEATURE IS AVAILABLE
  const isAvailable = hasFeature(feature);
  // IF AVAILABLE, RENDER CHILDREN
  if (isAvailable) {
    // RETURN CHILDREN
    return <>{children}</>;
  }
  // IF FALLBACK PROVIDED, RENDER IT
  if (fallback) {
    // RETURN FALLBACK
    return <>{fallback}</>;
  }
  // IF NOT SHOWING LOCKED UI, RETURN NULL
  if (!showLockedUI) {
    // RETURN NULL
    return null;
  }
  // GET MINIMUM PLAN FOR FEATURE
  const requiredPlan = minimumPlan || getMinimumPlanForFeature(feature);
  // GET FEATURE NAME
  const featureName = FEATURE_DISPLAY_NAMES[feature];
  // HANDLE CLICK
  const handleClick = () => {
    // IF ON LOCKED CLICK, CALL ON LOCKED CLICK
    if (onLockedClick) {
      // CALL ON LOCKED CLICK
      onLockedClick();
    } else {
      // TRIGGER UPGRADE MODAL
      triggerUpgradeModal(feature);
    }
  };
  // RETURN LOCKED UI COMPONENT
  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer group"
      title={lockedMessage || `Upgrade to unlock ${featureName}`}
    >
      {/* BLURRED/DISABLED CHILDREN */}
      <div className="opacity-50 pointer-events-none filter blur-[1px]">
        {children}
      </div>
      {/* LOCK OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 rounded-lg transition-all group-hover:bg-[var(--bg)]/90">
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="p-3 rounded-full bg-[var(--accent-color)]/10">
            <Lock className="w-5 h-5 text-[var(--accent-color)]" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {featureName}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {lockedMessage ||
              `Requires ${requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} plan`}
          </span>
          <button className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover-color)] transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

// <== FEATURE CHECK PROPS ==>
interface FeatureCheckProps {
  // <== FEATURE TO CHECK ==>
  feature: FeatureKey;
  // <== CHILDREN TO RENDER IF FEATURE IS AVAILABLE ==>
  children: ReactNode;
  // <== FALLBACK TO RENDER IF FEATURE IS NOT AVAILABLE (OPTIONAL) ==>
  fallback?: ReactNode;
}

// <== FEATURE CHECK COMPONENT (SIMPLE VERSION WITHOUT LOCKED UI) ==>
export const FeatureCheck = ({
  feature,
  children,
  fallback = null,
}: FeatureCheckProps): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const { hasFeature, isLoading } = useSubscriptionContext();
  // IF LOADING, RETURN NULL
  if (isLoading) {
    // RETURN NULL
    return null;
  }
  // CHECK IF FEATURE IS AVAILABLE
  if (hasFeature(feature)) {
    // RETURN CHILDREN
    return <>{children}</>;
  }
  // RETURN FALLBACK
  return <>{fallback}</>;
};
// <== LIMIT GATE PROPS ==>
interface LimitGateProps {
  // <== LIMIT KEY TO CHECK ==>
  limitKey: "projects" | "repos" | "teamMembers" | "workspaces" | "aiRequestsPerDay" | "codeReviewsPerMonth";
  // <== USAGE KEY TO CHECK AGAINST ==>
  usageKey: "projectsCount" | "reposCount" | "teamMembersCount" | "workspacesCount" | "aiRequestsToday" | "codeReviewsThisMonth";
  // <== CHILDREN TO RENDER IF WITHIN LIMIT ==>
  children: ReactNode;
  // <== FALLBACK TO RENDER IF AT LIMIT ==>
  fallback?: ReactNode;
  // <== SHOW LIMIT REACHED UI ==>    
  showLimitUI?: boolean;
  // <== CALLBACK WHEN LIMIT IS REACHED ==>
  onLimitReached?: () => void;
}

// <== LIMIT GATE COMPONENT ==>
export const LimitGate = ({
  limitKey,
  usageKey,
  children,
  fallback,
  showLimitUI = true,
  onLimitReached,
}: LimitGateProps): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const { isWithinLimit, limits, isLoading, triggerUpgradeModal } =
    useSubscriptionContext();
  // IF LOADING, RETURN CHILDREN
  if (isLoading) {
    return <>{children}</>;
  }
  // CHECK IF WITHIN LIMIT
  const withinLimit = isWithinLimit(limitKey, usageKey);
  // GET LIMIT
  const limit = limits?.[limitKey] ?? 0;
  // IF WITHIN LIMIT
  if (withinLimit) {
    // RETURN CHILDREN
    return <>{children}</>;
  }
  // IF FALLBACK PROVIDED
  if (fallback) {
    // RETURN FALLBACK
    return <>{fallback}</>;
  }
  // IF NOT SHOWING LIMIT UI
  if (!showLimitUI) {
    // RETURN NULL
    return null;
  }
  // HANDLE CLICK
  const handleClick = () => {
    // IF ON LIMIT REACHED, CALL ON LIMIT REACHED
    if (onLimitReached) {
      // CALL ON LIMIT REACHED
      onLimitReached();
    } else {
      // TRIGGER UPGRADE MODAL FOR RELEVANT FEATURE
      const featureMap: Record<string, FeatureKey> = {
        projects: "githubIntegration",
        repos: "githubIntegration",
        teamMembers: "teamCollaboration",
        workspaces: "workspaces",
        aiRequestsPerDay: "aiTaskSuggestions",
        codeReviewsPerMonth: "aiCodeReview",
      };
      // TRIGGER UPGRADE MODAL FOR RELEVANT FEATURE
      triggerUpgradeModal(featureMap[limitKey] || "githubIntegration");
    }
  };
  // GET LIMIT NAMES
  const limitNames: Record<string, string> = {
    projects: "projects",
    repos: "repositories",
    teamMembers: "team members",
    workspaces: "workspaces",
    aiRequestsPerDay: "AI requests",
    codeReviewsPerMonth: "code reviews",
  };
  // RETURN LIMIT REACHED UI COMPONENT
  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer group"
    >
      {/* DISABLED CHILDREN */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      {/* LIMIT OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 rounded-lg transition-all group-hover:bg-[var(--bg)]/90">
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="p-3 rounded-full bg-amber-500/10">
            <Lock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Limit Reached
          </span>
          <span className="text-xs text-[var(--text-secondary)] text-center">
            You've reached your limit of {limit === -1 ? "unlimited" : limit} {limitNames[limitKey]}
          </span>
          <button className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover-color)] transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Upgrade for More
          </button>
        </div>
      </div>
    </div>
  );
};

// <== PLAN GATE PROPS ==>
interface PlanGateProps {
  // <== MINIMUM PLAN REQUIRED ==>
  minimumPlan: PlanType;
  // <== CHILDREN TO RENDER IF PLAN IS SUFFICIENT ==>
  children: ReactNode;
  // <== FALLBACK TO RENDER IF PLAN IS NOT SUFFICIENT ==>
  fallback?: ReactNode;
}

// <== PLAN GATE COMPONENT ==>
export const PlanGate = ({
  minimumPlan,
  children,
  fallback = null,
}: PlanGateProps): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const { currentPlan, isLoading } = useSubscriptionContext();
  // IF LOADING, RETURN NULL
  if (isLoading) {
    // RETURN NULL
    return null;
  }
  // GET CURRENT PLAN LEVEL
  const currentPlanLevel = PLAN_HIERARCHY[currentPlan];
  // GET REQUIRED PLAN LEVEL
  const requiredPlanLevel = PLAN_HIERARCHY[minimumPlan];
  // IF CURRENT PLAN LEVEL IS >= REQUIRED PLAN LEVEL
  if (currentPlanLevel >= requiredPlanLevel) {
    // RETURN CHILDREN
    return <>{children}</>;
  }
  // RETURN FALLBACK
  return <>{fallback}</>;
};

export default FeatureGate;
