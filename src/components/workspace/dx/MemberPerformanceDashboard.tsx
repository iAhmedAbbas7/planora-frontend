// <== IMPORTS ==>
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Award,
  RefreshCw,
  Loader2,
  BarChart3,
  GitCommit,
  GitPullRequest,
  CheckSquare,
  Eye,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Check,
  Calendar,
} from "lucide-react";
import {
  useMemberDXScore,
  useAIDXRecommendations,
  useSyncActivity,
  type DXScore,
  type Recommendation,
} from "../../../hooks/useDXScoring";
import { useState, useRef, useEffect } from "react";
import { DXScoreTabSkeleton } from "../../skeletons/WorkspaceSkeleton";

// <== COMPONENT PROPS ==>
interface MemberPerformanceDashboardProps {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== MEMBER ID (OPTIONAL) ==>
  memberId?: string;
}

// <== PERIOD OPTIONS ==>
const periodOptions = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

// <== PERIOD DROPDOWN COMPONENT ==>
const PeriodDropdown = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  // IS DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // CURRENT LABEL
  const currentLabel =
    periodOptions.find((opt) => opt.value === value)?.label ||
    periodOptions[2].label;
  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE THE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RETURN DROPDOWN
  return (
    <div ref={dropdownRef} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--primary-text)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <Calendar
          size={14}
          className="text-[var(--accent-color)] flex-shrink-0"
        />
        <span className="hidden sm:inline">{currentLabel}</span>
        <span className="sm:hidden">{value}d</span>
        <ChevronDown
          size={14}
          className={`transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 min-w-[160px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                value === option.value
                  ? "text-[var(--accent-color)]"
                  : "text-[var(--primary-text)]"
              }`}
            >
              <Calendar
                size={14}
                className={
                  value === option.value
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--light-text)]"
                }
              />
              <span className="flex-1 text-left">{option.label}</span>
              {value === option.value && (
                <Check size={14} className="text-[var(--accent-color)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// <== DX SCORE CARD SKELETON ==>
const DXScoreCardSkeleton = () => (
  // RETURN DX SCORE CARD SKELETON
  <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="h-4 w-20 bg-[var(--light-text)]/10 rounded mb-2" />
        <div className="flex items-baseline gap-2">
          <div className="h-10 w-16 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 w-8 bg-[var(--light-text)]/10 rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-[var(--light-text)]/10 rounded-full" />
    </div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
      <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded" />
            <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-2 bg-[var(--light-text)]/10 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

// <== DX SCORE CARD COMPONENT ==>
const DXScoreCard = ({
  dxScore,
  isLoading,
}: {
  dxScore: DXScore | null;
  isLoading: boolean;
}) => {
  // RATING COLORS
  const ratingColors = {
    excellent: "text-green-500 bg-green-500/10 border-green-500/20",
    good: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    average: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    needs_improvement: "text-red-500 bg-red-500/10 border-red-500/20",
  };
  // RATING LABELS
  const ratingLabels = {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    needs_improvement: "Needs Improvement",
  };
  // LOADING STATE
  if (isLoading || !dxScore) {
    // RETURN DX SCORE CARD SKELETON
    return <DXScoreCardSkeleton />;
  }
  // RETURN DX SCORE CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--light-text)]">
            DX Score
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold text-[var(--primary-text)]">
              {dxScore.overall}
            </span>
            <span className="text-sm text-[var(--light-text)]">/ 100</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            ratingColors[dxScore.rating]
          }`}
        >
          {ratingLabels[dxScore.rating]}
        </span>
      </div>
      {/* PERCENTILE */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-[var(--accent-color)]" />
        <span className="text-sm text-[var(--light-text)]">
          Top{" "}
          <span className="font-medium text-[var(--primary-text)]">
            {dxScore.percentile}%
          </span>{" "}
          of team
        </span>
      </div>
      {/* SCORE BREAKDOWN */}
      <div className="space-y-3">
        {Object.entries(dxScore.components).map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[var(--light-text)] capitalize">{key}</span>
              <span className="font-medium text-[var(--primary-text)]">
                {value}
              </span>
            </div>
            <div className="h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] rounded-full transition-all"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== STATS CARD SKELETON ==>
const StatsCardSkeleton = () => (
  // RETURN STATS CARD SKELETON
  <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
      <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="h-7 w-12 bg-[var(--light-text)]/10 rounded mb-1" />
    <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
  </div>
);

// <== STATS CARD COMPONENT ==>
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  comparison,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  comparison?: string;
  isLoading?: boolean;
}) => {
  // LOADING STATE
  if (isLoading) {
    // RETURN STATS CARD SKELETON
    return <StatsCardSkeleton />;
  }
  // RETURN STATS CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--accent-color)]" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend > 0
                ? "text-green-500"
                : trend < 0
                ? "text-red-500"
                : "text-[var(--light-text)]"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[var(--primary-text)]">
        {value}
      </div>
      <div className="text-xs text-[var(--light-text)]">{title}</div>
      {comparison && (
        <div className="text-xs text-[var(--light-text)] mt-1 opacity-60">
          Team avg: {comparison}
        </div>
      )}
    </div>
  );
};

// <== RADAR CHART SKELETON ==>
const RadarChartSkeleton = () => (
  // RETURN RADAR CHART SKELETON
  <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
      <div className="h-4 w-40 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="h-64 flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-2 border-dashed border-[var(--light-text)]/10 relative">
        <div className="absolute inset-4 rounded-full border border-[var(--light-text)]/5" />
        <div className="absolute inset-8 rounded-full border border-[var(--light-text)]/5" />
        <div className="absolute inset-12 rounded-full border border-[var(--light-text)]/5" />
      </div>
    </div>
  </div>
);

// <== RADAR CHART COMPONENT ==>
const PerformanceRadar = ({
  components,
  isLoading,
}: {
  components: DXScore["components"] | null;
  isLoading: boolean;
}) => {
  // LOADING STATE
  if (isLoading || !components) {
    // RETURN RADAR CHART SKELETON
    return <RadarChartSkeleton />;
  }
  // FORMAT DATA - USING SHORTER LABELS TO PREVENT CUTOFF
  const data = [
    { subject: "Productivity", value: components.productivity, fullMark: 100 },
    { subject: "Quality", value: components.quality, fullMark: 100 },
    { subject: "Collab", value: components.collaboration, fullMark: 100 },
    { subject: "Consist", value: components.consistency, fullMark: 100 },
  ];
  // RETURN RADAR CHART
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-sm font-medium text-[var(--primary-text)] mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[var(--accent-color)]" />
        Performance Breakdown
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="70%"
            margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
          >
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--light-text)", fontSize: 11 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "var(--light-text)", fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="var(--accent-color)"
              fill="var(--accent-color)"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// <== ACTIVITY TREND SKELETON ==>
const ActivityTrendSkeleton = () => (
  // RETURN ACTIVITY TREND SKELETON
  <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
      <div className="h-4 w-28 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="h-48 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradientSkeleton" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--light-text)" stopOpacity={0.1} />
            <stop offset="95%" stopColor="var(--light-text)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d="M0,35 Q10,30 20,28 T40,22 T60,18 T80,15 T100,12 L100,40 L0,40 Z"
          fill="url(#areaGradientSkeleton)"
        />
        <path
          d="M0,35 Q10,30 20,28 T40,22 T60,18 T80,15 T100,12"
          fill="none"
          stroke="var(--light-text)"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
      </svg>
    </div>
  </div>
);

// <== ACTIVITY TREND CHART COMPONENT ==>
const ActivityTrendChart = ({
  data,
  isLoading,
}: {
  data: Array<{ date: string; commits: number; tasksCompleted: number }>;
  isLoading: boolean;
}) => {
  // LOADING STATE
  if (isLoading) {
    // RETURN ACTIVITY TREND SKELETON
    return <ActivityTrendSkeleton />;
  }
  // EMPTY STATE
  if (data.length === 0) {
    // RETURN EMPTY STATE
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[200px] flex flex-col">
        <h3 className="text-sm font-medium text-[var(--primary-text)] mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
          Activity Trend
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-[var(--light-text)] opacity-40" />
            <p className="text-sm text-[var(--light-text)]">
              No activity data available
            </p>
            <p className="text-xs text-[var(--light-text)] opacity-60 mt-1">
              Sync your activity to see trends
            </p>
          </div>
        </div>
      </div>
    );
  }
  // FORMAT DATA
  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
  // RETURN ACTIVITY TREND CHART
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-sm font-medium text-[var(--primary-text)] mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
        Activity Trend
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--accent-color)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--accent-color)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--light-text)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--light-text)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--cards-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="var(--accent-color)"
              fill="url(#colorCommits)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// <== RECOMMENDATIONS SKELETON ==>
const RecommendationsSkeleton = () => (
  // RETURN RECOMMENDATIONS SKELETON
  <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
      <div className="h-4 w-36 bg-[var(--light-text)]/10 rounded" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-[var(--hover-bg)]/30 border border-[var(--border)]"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-32 bg-[var(--light-text)]/10 rounded" />
                <div className="h-4 w-12 bg-[var(--light-text)]/10 rounded" />
              </div>
              <div className="h-3 w-full bg-[var(--light-text)]/10 rounded mb-1" />
              <div className="h-3 w-3/4 bg-[var(--light-text)]/10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// <== RECOMMENDATIONS CARD COMPONENT ==>
const RecommendationsCard = ({
  recommendations,
  isLoading,
}: {
  recommendations: Recommendation[];
  isLoading: boolean;
}) => {
  // PRIORITY COLORS
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20",
  };
  // CATEGORY ICONS
  const categoryIcons = {
    productivity: TrendingUp,
    quality: CheckSquare,
    collaboration: Eye,
    wellbeing: Sparkles,
  };
  // LOADING STATE
  if (isLoading) {
    // RETURN RECOMMENDATIONS SKELETON
    return <RecommendationsSkeleton />;
  }
  // RETURN RECOMMENDATIONS CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[280px] flex flex-col">
      <h3 className="text-sm font-medium text-[var(--primary-text)] mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
        AI Recommendations
      </h3>
      {recommendations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-[var(--light-text)] opacity-40" />
            <p className="text-sm text-[var(--light-text)]">
              No recommendations available
            </p>
            <p className="text-xs text-[var(--light-text)] opacity-60 mt-1">
              Sync your activity to get AI insights
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const Icon = categoryIcons[rec.category] || TrendingUp;
            return (
              <div
                key={index}
                className="p-3 rounded-lg bg-[var(--hover-bg)]/30 border border-[var(--border)]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--accent-color)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--primary-text)]">
                        {rec.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium border ${
                          priorityColors[rec.priority]
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--light-text)]">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// <== MEMBER PERFORMANCE DASHBOARD COMPONENT ==>
const MemberPerformanceDashboard = ({
  workspaceId,
  memberId,
}: MemberPerformanceDashboardProps) => {
  // STATE
  const [period, setPeriod] = useState(30);
  // HOOKS
  const {
    data: scoreData,
    isLoading: scoreLoading,
    refetch: refetchScore,
  } = useMemberDXScore(workspaceId, memberId, period);
  // AI DX RECOMMENDATIONS
  const { recommendations, isLoading: recsLoading } = useAIDXRecommendations(
    workspaceId,
    memberId
  );
  // SYNC MUTATION
  const syncMutation = useSyncActivity();
  // HANDLE SYNC
  const handleSync = () => {
    syncMutation.mutate({ workspaceId }, { onSuccess: () => refetchScore() });
  };
  // INITIAL LOADING STATE - SHOW FULL SKELETON
  if (scoreLoading && !scoreData) {
    return <DXScoreTabSkeleton />;
  }
  // RETURN MEMBER PERFORMANCE DASHBOARD
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--primary-text)] flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--accent-color)]" />
            Performance Dashboard
          </h2>
          <p className="text-sm text-[var(--light-text)]">
            Track your developer experience metrics
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PERIOD DROPDOWN */}
          <PeriodDropdown value={period} onChange={setPeriod} />
          {/* SYNC BUTTON */}
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-[var(--accent-color)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {syncMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* DX SCORE CARD */}
        <DXScoreCard
          dxScore={scoreData?.dxScore || null}
          isLoading={scoreLoading}
        />
        {/* RADAR CHART */}
        <PerformanceRadar
          components={scoreData?.dxScore?.components || null}
          isLoading={scoreLoading}
        />
        {/* RECOMMENDATIONS */}
        <RecommendationsCard
          recommendations={recommendations}
          isLoading={recsLoading}
        />
      </div>
      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Commits"
          value={scoreData?.stats?.commits || 0}
          icon={GitCommit}
          comparison={String(Math.round(scoreData?.teamAverages?.commits || 0))}
          isLoading={scoreLoading}
        />
        <StatsCard
          title="PRs Opened"
          value={scoreData?.stats?.prsOpened || 0}
          icon={GitPullRequest}
          comparison={String(
            Math.round(scoreData?.teamAverages?.prsOpened || 0)
          )}
          isLoading={scoreLoading}
        />
        <StatsCard
          title="Tasks Done"
          value={scoreData?.stats?.tasksCompleted || 0}
          icon={CheckSquare}
          comparison={String(
            Math.round(scoreData?.teamAverages?.tasksCompleted || 0)
          )}
          isLoading={scoreLoading}
        />
        <StatsCard
          title="Reviews"
          value={scoreData?.stats?.prsReviewed || 0}
          icon={Eye}
          comparison={String(
            Math.round(scoreData?.teamAverages?.prsReviewed || 0)
          )}
          isLoading={scoreLoading}
        />
      </div>
      {/* ACTIVITY TREND */}
      <ActivityTrendChart
        data={scoreData?.dailyTrend || []}
        isLoading={scoreLoading}
      />
    </div>
  );
};

export default MemberPerformanceDashboard;
