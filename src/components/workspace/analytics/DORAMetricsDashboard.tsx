// <== IMPORTS ==>
import {
  Rocket,
  Clock,
  AlertTriangle,
  Wrench,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  useDORAMetrics,
  DORAMetricValue,
} from "../../../hooks/useWorkspaceAnalytics";
import { JSX } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// <== RATING CONFIG ==>
const RATING_CONFIG = {
  // <== ELITE RATING CONFIG ==>
  elite: {
    label: "Elite",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  // <== HIGH RATING CONFIG ==>
  high: {
    label: "High",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  // <== MEDIUM RATING CONFIG ==>
  medium: {
    label: "Medium",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  // <== LOW RATING CONFIG ==>
  low: {
    label: "Low",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
};

// <== METRIC CONFIG ==>
const METRIC_CONFIG = {
  // <== DEPLOYMENT FREQUENCY METRIC CONFIG ==>
  deploymentFrequency: {
    icon: Rocket,
    title: "Deployment Frequency",
    description: "How often code is deployed to production",
    color: "purple",
  },
  // <== LEAD TIME FOR CHANGES METRIC CONFIG ==>
  leadTimeForChanges: {
    icon: Clock,
    title: "Lead Time for Changes",
    description: "Time from commit to production",
    color: "blue",
  },
  // <== CHANGE FAILURE RATE METRIC CONFIG ==>
  changeFailureRate: {
    icon: AlertTriangle,
    title: "Change Failure Rate",
    description: "Percentage of deployments causing failures",
    color: "amber",
  },
  // <== MEAN TIME TO RECOVERY METRIC CONFIG ==>
  meanTimeToRecovery: {
    icon: Wrench,
    title: "Mean Time to Recovery",
    description: "Time to restore service after failure",
    color: "emerald",
  },
};

// <== RATING BADGE COMPONENT ==>
const RatingBadge = ({
  rating,
  size = "sm",
}: {
  rating: "elite" | "high" | "medium" | "low";
  size?: "sm" | "md" | "lg";
}): JSX.Element => {
  // GET CONFIG FOR RATING
  const config = RATING_CONFIG[rating];
  // GET SIZE CLASS
  const sizeClass =
    size === "lg"
      ? "px-3 py-1.5 text-sm"
      : size === "md"
      ? "px-2.5 py-1 text-xs"
      : "px-2 py-0.5 text-xs";
  // RETURN RATING BADGE
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      {config.label}
    </span>
  );
};

// <== TREND INDICATOR COMPONENT ==>
const TrendIndicator = ({ trend }: { trend: number[] }): JSX.Element => {
  // IF TREND IS LESS THAN 2, RETURN MINUS ICON
  if (trend.length < 2) {
    // RETURN MINUS ICON
    return <Minus size={14} className="text-[var(--light-text)]" />;
  }
  // GET LAST TWO VALUES
  const lastTwo = trend.slice(-2);
  // GET FIRST VALUE
  const first = lastTwo[0] || 0;
  // GET SECOND VALUE
  const second = lastTwo[1] || 0;
  // IF SECOND VALUE IS GREATER THAN FIRST VALUE, RETURN TRENDING UP ICON
  if (second > first) {
    // RETURN TRENDING UP ICON
    return <TrendingUp size={14} className="text-emerald-500" />;
  } else if (second < first) {
    // RETURN TRENDING DOWN ICON
    return <TrendingDown size={14} className="text-red-500" />;
  }
  // RETURN MINUS ICON
  return <Minus size={14} className="text-[var(--light-text)]" />;
};

// <== METRIC CARD COMPONENT ==>
const MetricCard = ({
  metricKey,
  metric,
}: {
  metricKey: keyof typeof METRIC_CONFIG;
  metric: DORAMetricValue;
}): JSX.Element => {
  // GET CONFIG FOR METRIC
  const config = METRIC_CONFIG[metricKey];
  // GET ICON FOR METRIC
  const Icon = config.icon;
  // FORMAT VALUE BASED ON UNIT
  const formatValue = () => {
    // IF UNIT IS PERCENTAGE, RETURN VALUE WITH PERCENTAGE SIGN
    if (metric.unit === "percentage") {
      // RETURN VALUE WITH PERCENTAGE SIGN
      return `${metric.value}%`;
    }
    // IF UNIT IS PER DAY, RETURN VALUE WITH PER DAY SIGN
    if (metric.unit === "per_day") {
      // RETURN VALUE WITH PER DAY SIGN
      return metric.value < 1
        ? `${Math.round(metric.value * 7)}/week`
        : `${metric.value}/day`;
    }
    // IF UNIT IS HOURS, RETURN VALUE WITH HOURS SIGN
    if (metric.unit === "hours") {
      // RETURN VALUE WITH HOURS SIGN
      return metric.value < 1
        ? `${Math.round(metric.value * 60)}min`
        : `${metric.value}h`;
    }
    // IF UNIT IS DAYS, RETURN VALUE WITH DAYS SIGN
    if (metric.unit === "days") {
      // RETURN VALUE WITH DAYS SIGN
      return `${metric.value}d`;
    }
    // RETURN VALUE AS STRING
    return metric.value.toString();
  };
  // PREPARE CHART DATA
  const chartData = metric.trend.map((value, index) => ({
    week: `W${index + 1}`,
    value,
  }));
  // PREPARE COLOR MAP
  const colorMap: Record<string, string> = {
    purple: "#a855f7",
    blue: "#3b82f6",
    amber: "#f59e0b",
    emerald: "#10b981",
  };
  // GET CHART COLOR
  const chartColor = colorMap[config.color] || "#7c3aed";
  // RETURN METRIC CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent-color)]/30 transition-colors">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-lg bg-${config.color}-500/10 flex items-center justify-center`}
            style={{ backgroundColor: `${chartColor}15` }}
          >
            <Icon size={18} style={{ color: chartColor }} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {config.title}
            </p>
            <p className="text-xs text-[var(--light-text)]">
              {config.description}
            </p>
          </div>
        </div>
        <RatingBadge rating={metric.rating} />
      </div>
      {/* VALUE */}
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[var(--primary-text)]">
            {formatValue()}
          </span>
          <TrendIndicator trend={metric.trend} />
        </div>
      </div>
      {/* MINI CHART */}
      {chartData.length > 0 && chartData.some((d) => d.value > 0) && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${metricKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${metricKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// <== BENCHMARK INFO COMPONENT ==>
const BenchmarkInfo = (): JSX.Element => {
  // RETURN BENCHMARK INFO
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-[var(--accent-color)]" />
        <h4 className="text-sm font-medium text-[var(--primary-text)]">
          DORA Benchmarks
        </h4>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* ELITE */}
        <div className="space-y-1">
          <RatingBadge rating="elite" />
          <p className="text-[var(--light-text)]">Deploy: Multiple/day</p>
          <p className="text-[var(--light-text)]">Lead: {"<"}1 hour</p>
          <p className="text-[var(--light-text)]">Failure: {"<"}15%</p>
          <p className="text-[var(--light-text)]">MTTR: {"<"}1 hour</p>
        </div>
        {/* HIGH */}
        <div className="space-y-1">
          <RatingBadge rating="high" />
          <p className="text-[var(--light-text)]">Deploy: Weekly</p>
          <p className="text-[var(--light-text)]">Lead: {"<"}1 day</p>
          <p className="text-[var(--light-text)]">Failure: {"<"}30%</p>
          <p className="text-[var(--light-text)]">MTTR: {"<"}1 day</p>
        </div>
        {/* MEDIUM */}
        <div className="space-y-1">
          <RatingBadge rating="medium" />
          <p className="text-[var(--light-text)]">Deploy: Monthly</p>
          <p className="text-[var(--light-text)]">Lead: {"<"}1 week</p>
          <p className="text-[var(--light-text)]">Failure: {"<"}45%</p>
          <p className="text-[var(--light-text)]">MTTR: {"<"}1 week</p>
        </div>
        {/* LOW */}
        <div className="space-y-1">
          <RatingBadge rating="low" />
          <p className="text-[var(--light-text)]">Deploy: {"<"}Monthly</p>
          <p className="text-[var(--light-text)]">Lead: {">"}1 month</p>
          <p className="text-[var(--light-text)]">Failure: {">"}45%</p>
          <p className="text-[var(--light-text)]">MTTR: {">"}1 week</p>
        </div>
      </div>
    </div>
  );
};

// <== LOADING SKELETON COMPONENT ==>
const LoadingSkeleton = (): JSX.Element => {
  // RETURN LOADING SKELETON
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[var(--hover-bg)]" />
                <div>
                  <div className="h-4 w-32 bg-[var(--hover-bg)] rounded mb-1" />
                  <div className="h-3 w-40 bg-[var(--hover-bg)] rounded" />
                </div>
              </div>
              <div className="h-5 w-14 bg-[var(--hover-bg)] rounded-full" />
            </div>
            <div className="h-8 w-20 bg-[var(--hover-bg)] rounded mb-3" />
            <div className="h-12 bg-[var(--hover-bg)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

// <== DORA METRICS DASHBOARD COMPONENT ==>
const DORAMetricsDashboard = ({
  workspaceId,
}: {
  workspaceId: string;
}): JSX.Element => {
  // GET DORA METRICS
  const { metrics, isLoading, isError, refetch } = useDORAMetrics(workspaceId);
  // IF LOADING, RETURN LOADING SKELETON
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  // IF ERROR, RETURN ERROR MESSAGE
  if (isError) {
    // RETURN ERROR MESSAGE
    return (
      <div className="text-center py-12">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-3" />
        <p className="text-[var(--primary-text)] font-medium mb-2">
          Failed to load DORA metrics
        </p>
        <p className="text-sm text-[var(--light-text)] mb-4">
          Please check your GitHub connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }
  // IF NO METRICS OR HAS MESSAGE (NO REPOS), RETURN NO METRICS MESSAGE
  if (!metrics || metrics.message) {
    // RETURN NO METRICS MESSAGE
    return (
      <div className="text-center py-12">
        <Rocket
          size={40}
          className="mx-auto text-[var(--light-text)] opacity-50 mb-3"
        />
        <p className="text-[var(--primary-text)] font-medium mb-2">
          No DORA Metrics Available
        </p>
        <p className="text-sm text-[var(--light-text)]">
          {metrics?.message ||
            "Link repositories to this workspace to see DORA metrics."}
        </p>
      </div>
    );
  }
  // RETURN DASHBOARD COMPONENT
  return (
    <div className="space-y-4">
      {/* OVERALL RATING */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[var(--primary-text)]">
            DORA Metrics
          </h3>
          <RatingBadge rating={metrics.overallRating} size="md" />
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
          title="Refresh metrics"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          metricKey="deploymentFrequency"
          metric={metrics.deploymentFrequency}
        />
        <MetricCard
          metricKey="leadTimeForChanges"
          metric={metrics.leadTimeForChanges}
        />
        <MetricCard
          metricKey="changeFailureRate"
          metric={metrics.changeFailureRate}
        />
        <MetricCard
          metricKey="meanTimeToRecovery"
          metric={metrics.meanTimeToRecovery}
        />
      </div>
      {/* BENCHMARKS */}
      <BenchmarkInfo />
      {/* LAST UPDATED */}
      <p className="text-xs text-[var(--light-text)] text-right">
        Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default DORAMetricsDashboard;
