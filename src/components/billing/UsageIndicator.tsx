// <== IMPORTS ==>
import { useMemo, JSX } from "react";
import type { IPlanLimits, IUsageTracking } from "../../types/billing";
import { useSubscriptionContext } from "../../hooks/useSubscriptionContext";
import { LIMIT_DISPLAY_NAMES, formatLimitValue } from "../../types/billing";
import { AlertTriangle, TrendingUp, Infinity as InfinityIcon } from "lucide-react";

// <== USAGE INDICATOR PROPS ==>
interface UsageIndicatorProps {
  // <== LIMIT KEY ==>
  limitKey: keyof IPlanLimits;
  // <== USAGE KEY ==>
  usageKey: keyof IUsageTracking;
  // <== SHOW LABEL ==>
  showLabel?: boolean;
  // <== SIZE VARIANT ==>
  size?: "sm" | "md" | "lg";
  // <== SHOW PERCENTAGE ==>
  showPercentage?: boolean;
  // <== CUSTOM LABEL ==>
  label?: string;
  // <== WARNING THRESHOLD (0-100) ==>
  warningThreshold?: number;
  // <== DANGER THRESHOLD (0-100) ==>
  dangerThreshold?: number;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== USAGE INDICATOR COMPONENT ==>
export const UsageIndicator = ({
  limitKey,
  usageKey,
  showLabel = true,
  size = "md",
  showPercentage = true,
  label,
  warningThreshold = 75,
  dangerThreshold = 90,
  compact = false,
}: UsageIndicatorProps): JSX.Element => {
  // GET SUBSCRIPTION CONTEXT
  const { limits, usage, isLoading, triggerUpgradeModal } =
    useSubscriptionContext();
  // CALCULATE VALUES
  const { current, max, percentage, isUnlimited, status } = useMemo(() => {
    // GET MAX LIMIT
    const max = limits?.[limitKey] ?? 0;
    // GET RAW USAGE
    const rawUsage = usage?.[usageKey];
    // GET CURRENT USAGE
    const current = typeof rawUsage === "number" ? rawUsage : 0;
    // GET IS UNLIMITED
    const isUnlimited = max === -1;
    // GET PERCENTAGE
    const percentage = isUnlimited ? 0 : max > 0 ? (current / max) * 100 : 0;
    // GET STATUS
    let status: "normal" | "warning" | "danger" = "normal";
    // IF NOT UNLIMITED
    if (!isUnlimited) {
      // IF PERCENTAGE IS >= DANGER THRESHOLD, SET STATUS TO DANGER
      if (percentage >= dangerThreshold) {
        // SET STATUS TO DANGER
        status = "danger";
      } else if (percentage >= warningThreshold) {
        // IF PERCENTAGE IS >= WARNING THRESHOLD, SET STATUS TO WARNING
        status = "warning";
      }
    }
    // RETURN VALUES
    return { current, max, percentage, isUnlimited, status };
  }, [limits, usage, limitKey, usageKey, warningThreshold, dangerThreshold]);
  // GET SIZE CLASSES
  const sizeClasses = {
    // SMALL SIZE
    sm: {
      bar: "h-1.5",
      text: "text-xs",
      icon: "w-3 h-3",
    },
    // MEDIUM SIZE
    md: {
      bar: "h-2",
      text: "text-sm",
      icon: "w-4 h-4",
    },
    // LARGE SIZE
    lg: {
      bar: "h-3",
      text: "text-base",
      icon: "w-5 h-5",
    },
  };
  // GET STATUS COLORS
  const statusColors = {
    // NORMAL STATUS
    normal: {
      bar: "bg-[var(--accent-color)]",
      text: "text-[var(--text-secondary)]",
    },
    // WARNING STATUS
    warning: {
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    },
    // DANGER STATUS
    danger: {
      bar: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    },
  };
  // GET DISPLAY LABEL
  const displayLabel = label || LIMIT_DISPLAY_NAMES[limitKey];
  // IF LOADING, RETURN SKELETON
  if (isLoading) {
    // RETURN SKELETON
    return (
      <div className={`animate-pulse ${compact ? "" : "space-y-1"}`}>
        {showLabel && !compact && (
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-24" />
        )}
        <div
          className={`${sizeClasses[size].bar} bg-[var(--bg-secondary)] rounded-full w-full`}
        />
      </div>
    );
  }
  // IF COMPACT MODE, RETURN COMPACT MODE
  if (compact) {
    // RETURN COMPACT MODE
    return (
      // COMPACT MODE CONTAINER
      <div className="flex items-center gap-2">
        {isUnlimited ? (
          <>
            <InfinityIcon className={`${sizeClasses[size].icon} text-green-500`} />
            <span className={`${sizeClasses[size].text} text-[var(--text-secondary)]`}>
              Unlimited
            </span>
          </>
        ) : (
          <>
            <span
              className={`${sizeClasses[size].text} font-medium ${statusColors[status].text}`}
            >
              {current}/{max}
            </span>
            {status !== "normal" && (
              <AlertTriangle
                className={`${sizeClasses[size].icon} ${statusColors[status].text}`}
              />
            )}
          </>
        )}
      </div>
    );
  }
  // RETURN FULL RENDER
  return (
    // FULL RENDER CONTAINER
    <div className="space-y-1.5">
      {/* LABEL AND VALUES CONTAINER */}
      <div className="flex items-center justify-between">
        {showLabel && (
          <span
            className={`${sizeClasses[size].text} text-[var(--text-secondary)]`}
          >
            {displayLabel}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {isUnlimited ? (
            <>
              <InfinityIcon
                className={`${sizeClasses[size].icon} text-green-500`}
              />
              <span
                className={`${sizeClasses[size].text} text-green-600 dark:text-green-400 font-medium`}
              >
                Unlimited
              </span>
            </>
          ) : (
            <>
              {status !== "normal" && (
                <AlertTriangle
                  className={`${sizeClasses[size].icon} ${statusColors[status].text}`}
                />
              )}
              <span
                className={`${sizeClasses[size].text} font-medium ${statusColors[status].text}`}
              >
                {current} / {formatLimitValue(limitKey, max)}
              </span>
              {showPercentage && (
                <span
                  className={`${sizeClasses[size].text} ${statusColors[status].text}`}
                >
                  ({Math.round(percentage)}%)
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {/* PROGRESS BAR */}
      {!isUnlimited && (
        <div className="relative">
          {/* BACKGROUND */}
          <div
            className={`${sizeClasses[size].bar} w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden`}
          >
            {/* PROGRESS */}
            <div
              className={`${sizeClasses[size].bar} ${statusColors[status].bar} rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>
      )}
      {/* WARNING MESSAGE */}
      {status === "danger" && (
        <button
          onClick={() => triggerUpgradeModal("githubIntegration")}
          className={`${sizeClasses[size].text} text-red-600 dark:text-red-400 hover:underline flex items-center gap-1`}
        >
          <TrendingUp className={sizeClasses[size].icon} />
          Upgrade for more
        </button>
      )}
    </div>
  );
};

// <== USAGE OVERVIEW COMPONENT ==>
export const UsageOverview = (): JSX.Element => {
  // RETURN USAGE OVERVIEW
  return (
    // USAGE OVERVIEW CONTAINER
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-[var(--text-primary)]">
        Usage Overview
      </h3>
      <div className="space-y-3">
        <UsageIndicator limitKey="projects" usageKey="projectsCount" />
        <UsageIndicator limitKey="repos" usageKey="reposCount" />
        <UsageIndicator
          limitKey="aiRequestsPerDay"
          usageKey="aiRequestsToday"
        />
        <UsageIndicator
          limitKey="codeReviewsPerMonth"
          usageKey="codeReviewsThisMonth"
        />
      </div>
    </div>
  );
};

// <== USAGE BADGE COMPONENT ==>
interface UsageBadgeProps {
  // <== LIMIT KEY ==>
  limitKey: keyof IPlanLimits;
  // <== USAGE KEY ==>
  usageKey: keyof IUsageTracking;
}

// <== USAGE BADGE COMPONENT ==>
export const UsageBadge = ({
  limitKey,
  usageKey,
}: UsageBadgeProps): JSX.Element | null => {
  // GET SUBSCRIPTION CONTEXT
  const { limits, usage, isLoading } = useSubscriptionContext();
  // IF LOADING, RETURN NULL
  if (isLoading) return null;
  // GET MAX LIMIT
  const max = limits?.[limitKey] ?? 0;
  // GET RAW USAGE
  const rawUsage = usage?.[usageKey];
  // GET CURRENT USAGE
  const current = typeof rawUsage === "number" ? rawUsage : 0;
  // GET IS UNLIMITED
  const isUnlimited = max === -1;
  // GET PERCENTAGE
  const percentage = isUnlimited ? 0 : max > 0 ? (current / max) * 100 : 0;
  // IF NOT UNLIMITED AND PERCENTAGE IS < 75, RETURN NULL
  if (isUnlimited || percentage < 75) return null;
  // GET IS DANGER
  const isDanger = percentage >= 90;
  // RETURN USAGE BADGE
  return (
    <span
      className={`px-1.5 py-0.5 text-xs font-medium rounded ${
        isDanger
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      }`}
    >
      {current}/{max}
    </span>
  );
};

export default UsageIndicator;
