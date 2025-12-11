// <== IMPORTS ==>
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Sparkles,
  Shield,
  Activity,
  FileText,
  Code,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Brain,
  Zap,
  Target,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryReadme,
  useRepositoryLanguages,
  useRepositoryContributors,
  useRepositoryCommits,
  useRepositoryIssues,
  useRepositoryPullRequests,
  useRepositoryTree,
} from "../hooks/useGitHub";
import {
  useAIStatus,
  useAIRepositoryAnalysis,
  useAICodeQualityScan,
  useAISecurityScan,
  useAIGenerateReadme,
  useAIActivityInsights,
  AIRepositoryAnalysisResponse,
  AICodeQualityScanResponse,
  AISecurityScanResponse,
  AIActivityInsightsResponse,
} from "../hooks/useAI";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { useParams, useNavigate } from "react-router-dom";
import { JSX, useState, useEffect, useCallback } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== SCORE CIRCLE COMPONENT ==>
type ScoreCircleProps = {
  // <== SCORE ==>
  score: number;
  // <== SIZE ==>
  size?: "sm" | "md" | "lg";
  // <== LABEL ==>
  label?: string;
};

const ScoreCircle = ({
  score,
  size = "md",
  label,
}: ScoreCircleProps): JSX.Element => {
  // GET SIZE CLASSES
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-20 h-20 text-2xl",
    lg: "w-28 h-28 text-3xl",
  };
  // GET COLOR BASED ON SCORE
  const getColor = (s: number) => {
    // IF SCORE IS >= 80, RETURN GREEN
    if (s >= 80) return "text-green-500";
    // IF SCORE IS >= 60, RETURN YELLOW
    if (s >= 60) return "text-yellow-500";
    // IF SCORE IS >= 40, RETURN ORANGE
    if (s >= 40) return "text-orange-500";
    // OTHERWISE, RETURN RED
    return "text-red-500";
  };
  // GET RING COLOR
  const getRingColor = (s: number) => {
    // IF SCORE IS >= 80, RETURN GREEN
    if (s >= 80) return "stroke-green-500";
    // IF SCORE IS >= 60, RETURN YELLOW
    if (s >= 60) return "stroke-yellow-500";
    // IF SCORE IS >= 40, RETURN ORANGE
    if (s >= 40) return "stroke-orange-500";
    // OTHERWISE, RETURN RED
    return "stroke-red-500";
  };
  // CALCULATE RADIUS
  const radius = size === "lg" ? 50 : size === "md" ? 36 : 22;
  // CALCULATE CIRCUMFERENCE
  const circumference = 2 * Math.PI * radius;
  // CALCULATE OFFSET
  const offset = circumference - (score / 100) * circumference;
  // RETURN SCORE CIRCLE
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-[var(--border)]"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={getRingColor(score)}
          />
        </svg>
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
      </div>
      {label && (
        <span className="text-xs text-[var(--light-text)] text-center">
          {label}
        </span>
      )}
    </div>
  );
};

// <== SCORE BAR COMPONENT ==>
type ScoreBarProps = {
  // <== SCORE ==>
  score: number;
  // <== LABEL ==>
  label: string;
  // <== MAX SCORE ==>
  maxScore?: number;
};

const ScoreBar = ({
  score,
  label,
  maxScore = 10,
}: ScoreBarProps): JSX.Element => {
  // CALCULATE PERCENTAGE
  const percentage = (score / maxScore) * 100;
  // GET COLOR BASED ON SCORE
  const getColor = (s: number, max: number) => {
    // CALCULATE PERCENTAGE
    const pct = (s / max) * 100;
    // IF SCORE IS >= 80, RETURN GREEN
    if (pct >= 80) return "bg-green-500";
    // IF SCORE IS >= 60, RETURN YELLOW
    if (pct >= 60) return "bg-yellow-500";
    // IF SCORE IS >= 40, RETURN ORANGE
    if (pct >= 40) return "bg-orange-500";
    // OTHERWISE, RETURN RED
    return "bg-red-500";
  };
  // RETURN SCORE BAR
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--light-text)]">{label}</span>
        <span className="font-medium text-[var(--text-primary)]">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(
            score,
            maxScore
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// <== INSIGHT CARD COMPONENT ==>
type InsightCardProps = {
  // <== ICON ==>
  icon: typeof Sparkles;
  // <== TITLE ==>
  title: string;
  children: React.ReactNode;
  // <== LOADING ==>
  loading?: boolean;
  // <== ON REFRESH ==>
  onRefresh?: () => void;
  // <== IS REFRESHING ==>
  isRefreshing?: boolean;
  // <== EXPANDABLE ==>
  expandable?: boolean;
  // <== DEFAULT EXPANDED ==>
  defaultExpanded?: boolean;
  // <== SKELETON ==>
  skeleton?: React.ReactNode;
};

const InsightCard = ({
  icon: Icon,
  title,
  children,
  loading,
  onRefresh,
  isRefreshing,
  expandable = false,
  defaultExpanded = true,
  skeleton,
}: InsightCardProps): JSX.Element => {
  // EXPANDED STATE
  const [expanded, setExpanded] = useState(defaultExpanded);
  // RETURN INSIGHT CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* HEADER */}
      <div
        className={`flex items-center justify-between gap-3 p-4 ${
          expandable ? "cursor-pointer hover:bg-[var(--hover-bg)]" : ""
        }`}
        onClick={() => expandable && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-color) 15%, transparent)",
            }}
          >
            <Icon size={18} className="text-[var(--accent-color)]" />
          </div>
          <h3 className="text-sm font-medium text-[var(--text-primary)]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          )}
          {expandable && (
            <ChevronDown
              size={16}
              className={`text-[var(--light-text)] transition ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      {/* CONTENT */}
      {(!expandable || expanded) && (
        <div className="px-4 pb-4">
          {loading ? (
            skeleton ? (
              <div className="animate-pulse">{skeleton}</div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2
                  size={24}
                  className="animate-spin text-[var(--accent-color)]"
                />
              </div>
            )
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

// <== PRIORITY BADGE COMPONENT ==>
type PriorityBadgeProps = {
  // <== PRIORITY ==>
  priority: string;
};

const PriorityBadge = ({ priority }: PriorityBadgeProps): JSX.Element => {
  // GET BADGE CLASSES
  const getBadgeClasses = (p: string) => {
    // IF PRIORITY IS HIGH OR CRITICAL, RETURN RED
    switch (p.toLowerCase()) {
      // IF PRIORITY IS HIGH OR CRITICAL, RETURN RED
      case "high":
      case "critical":
        return "bg-red-500/15 text-red-500";
      // IF PRIORITY IS MEDIUM, RETURN YELLOW
      case "medium":
        return "bg-yellow-500/15 text-yellow-500";
      // IF PRIORITY IS LOW, RETURN GREEN
      case "low":
        return "bg-green-500/15 text-green-500";
      // OTHERWISE, RETURN GRAY
      default:
        // RETURN GRAY
        return "bg-gray-500/15 text-gray-500";
    }
  };
  // RETURN BADGE
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getBadgeClasses(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

// <== TREND ICON COMPONENT ==>
type TrendIconProps = {
  // <== TREND ==>
  trend: string;
};

const TrendIcon = ({ trend }: TrendIconProps): JSX.Element => {
  // CHECK TREND
  switch (trend.toLowerCase()) {
    // IF TREND IS INCREASING OR GROWING, RETURN GREEN
    case "increasing":
    case "growing":
      return <TrendingUp size={14} className="text-green-500" />;
    // IF TREND IS DECREASING OR DECLINING, RETURN RED
    case "decreasing":
    case "declining":
      return <TrendingDown size={14} className="text-red-500" />;
    // OTHERWISE, RETURN GRAY
    default:
      // RETURN GRAY
      return <Minus size={14} className="text-gray-500" />;
  }
};

// <== SKELETON COMPONENTS ==>

// BASE INSIGHT CARD SKELETON WRAPPER
const InsightCardSkeleton = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="w-6 h-6 bg-[var(--light-text)]/10 rounded" />
      </div>
      {/* CONTENT */}
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
};

// OVERVIEW SECTION SKELETON
const OverviewSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-3">
      {/* SUMMARY */}
      <div className="space-y-2">
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-full" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-5/6" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-3/4" />
      </div>
      {/* DETAILS */}
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="flex items-start gap-2">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-5 bg-[var(--light-text)]/10 rounded-full w-14"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// CODE QUALITY SECTION SKELETON
const CodeQualitySkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* SCORE AND INFO */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--light-text)]/10 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-32" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
        </div>
      </div>
      {/* ISSUES */}
      <div className="space-y-2">
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-5 bg-[var(--light-text)]/10 rounded-full w-14" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

// SECURITY SECTION SKELETON
const SecuritySkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* SCORE AND RISK */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--light-text)]/10 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-28" />
        </div>
      </div>
      {/* ACTIONS */}
      <div className="space-y-2">
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-5 bg-[var(--light-text)]/10 rounded-full w-14" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ACTIVITY SECTION SKELETON
const ActivitySkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* SCORE AND TREND */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[var(--light-text)]/10 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-28" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
        </div>
      </div>
      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="p-2 bg-[var(--light-text)]/5 rounded-lg">
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16 mb-1" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

// HEALTH SCORE SKELETON
const HealthScoreSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* MAIN SCORE CIRCLE */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 bg-[var(--light-text)]/10 rounded-full" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
        </div>
        {/* BREAKDOWN BARS */}
        <div className="flex-1 w-full space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
                <div className="h-3 bg-[var(--light-text)]/10 rounded w-8" />
              </div>
              <div className="h-2 bg-[var(--light-text)]/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// KEY INSIGHTS SKELETON
const KeyInsightsSkeleton = (): JSX.Element => {
  return (
    <div className="bg-[var(--light-text)]/5 border border-[var(--light-text)]/10 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
        <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[var(--light-text)]/10 rounded mt-0.5" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

// IMPROVEMENTS SECTION SKELETON
const ImprovementsSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 bg-[var(--light-text)]/5 rounded-lg"
        >
          <div className="h-5 bg-[var(--light-text)]/10 rounded-full w-14" />
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-full" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// README GENERATOR SKELETON
const ReadmeGeneratorSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <div className="h-6 bg-[var(--light-text)]/10 rounded w-14" />
        <div className="h-6 bg-[var(--light-text)]/10 rounded w-20" />
      </div>
      <div className="p-4 bg-[var(--light-text)]/5 border border-[var(--light-text)]/10 rounded-lg space-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className={`h-3 bg-[var(--light-text)]/10 rounded ${
              i % 3 === 0 ? "w-3/4" : i % 2 === 0 ? "w-5/6" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// <== PAGE LOADING SKELETON ==>
const PageLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
            <div className="h-6 bg-[var(--light-text)]/10 rounded w-48" />
          </div>
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-40" />
        </div>
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-36" />
      </div>

      {/* HEALTH SCORE SKELETON */}
      <HealthScoreSkeleton />

      {/* KEY INSIGHTS SKELETON */}
      <KeyInsightsSkeleton />

      {/* INSIGHTS GRID SKELETON */}
      <div className="grid gap-4 md:grid-cols-2">
        <InsightCardSkeleton>
          <OverviewSkeleton />
        </InsightCardSkeleton>
        <InsightCardSkeleton>
          <CodeQualitySkeleton />
        </InsightCardSkeleton>
        <InsightCardSkeleton>
          <SecuritySkeleton />
        </InsightCardSkeleton>
        <InsightCardSkeleton>
          <ActivitySkeleton />
        </InsightCardSkeleton>
      </div>

      {/* IMPROVEMENTS SKELETON */}
      <InsightCardSkeleton>
        <ImprovementsSkeleton />
      </InsightCardSkeleton>

      {/* README GENERATOR SKELETON */}
      <InsightCardSkeleton>
        <div className="text-center py-4">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-64 mx-auto mb-3" />
          <div className="h-10 bg-[var(--light-text)]/10 rounded w-36 mx-auto" />
        </div>
      </InsightCardSkeleton>
    </div>
  );
};

// <== GITHUB INSIGHTS PAGE COMPONENT ==>
const GitHubInsightsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - AI Insights - ${owner}/${repo}`);
  // ANALYSIS DATA STATE
  const [analysisData, setAnalysisData] =
    useState<AIRepositoryAnalysisResponse | null>(null);
  // CODE QUALITY DATA STATE
  const [codeQualityData, setCodeQualityData] =
    useState<AICodeQualityScanResponse | null>(null);
  // SECURITY DATA STATE
  const [securityData, setSecurityData] =
    useState<AISecurityScanResponse | null>(null);
  // ACTIVITY DATA STATE
  const [activityData, setActivityData] =
    useState<AIActivityInsightsResponse | null>(null);
  // GENERATED README STATE
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  // COPIED README STATE
  const [copiedReadme, setCopiedReadme] = useState(false);
  // FETCH REPOSITORY DATA HOOK
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH README DATA HOOK
  const { readme } = useRepositoryReadme(owner || "", repo || "");
  // FETCH LANGUAGES DATA HOOK
  const { languages } = useRepositoryLanguages(owner || "", repo || "");
  // FETCH CONTRIBUTORS DATA HOOK
  const { contributors } = useRepositoryContributors(owner || "", repo || "");
  // FETCH COMMITS DATA HOOK
  const { commits } = useRepositoryCommits(owner || "", repo || "", 1, 30);
  // FETCH ISSUES DATA HOOK
  const { issues } = useRepositoryIssues(owner || "", repo || "", "all", 1, 20);
  // FETCH PULL REQUESTS DATA HOOK
  const { pullRequests } = useRepositoryPullRequests(
    owner || "",
    repo || "",
    "all",
    1,
    20
  );
  // FETCH TREE DATA HOOK
  const { tree: treeData } = useRepositoryTree(owner || "", repo || "");
  // GET FILES ARRAY FROM TREE DATA
  const files = treeData?.tree || [];
  // AI STATUS
  const { status: aiStatus, isLoading: isAILoading } = useAIStatus();
  // CHECK IF AI IS READY
  const isAIReady = aiStatus?.ready ?? false;
  // TRACK IF RUNNING FULL ANALYSIS (for full page skeleton)
  const [isRunningFullAnalysis, setIsRunningFullAnalysis] = useState(false);
  // REPOSITORY ANALYSIS MUTATION
  const repositoryAnalysis = useAIRepositoryAnalysis();
  // CODE QUALITY SCAN MUTATION
  const codeQualityScan = useAICodeQualityScan();
  // SECURITY SCAN MUTATION
  const securityScan = useAISecurityScan();
  // ACTIVITY INSIGHTS MUTATION
  const activityInsights = useAIActivityInsights();
  // README GENERATION MUTATION
  const generateReadme = useAIGenerateReadme();
  // RUN REPOSITORY ANALYSIS
  const runRepositoryAnalysis = useCallback(() => {
    // PREPARE REPOSITORY INFO
    const repoInfo = repository
      ? {
          description: repository.description || undefined,
          stars: repository.stargazersCount,
          forks: repository.forksCount,
          watchers: repository.watchersCount,
          createdAt: repository.createdAt,
          updatedAt: repository.updatedAt,
        }
      : undefined;
    // PREPARE COMMIT DATA
    const commitData = commits.map((c) => ({
      message: c.message,
      date: c.author?.date || "",
      author: c.author?.login || "Unknown",
    }));
    // CONVERT LANGUAGES ARRAY TO RECORD (LANGUAGE: BYTES)
    const languagesRecord = languages?.reduce((acc, lang) => {
      acc[lang.name] = lang.bytes;
      return acc;
    }, {} as Record<string, number>);
    // RUN REPOSITORY ANALYSIS
    repositoryAnalysis.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        readme: readme || undefined,
        languages: languagesRecord,
        recentCommits: commitData,
        openIssues: issues.map((i) => ({ title: i.title, state: i.state })),
        openPRs: pullRequests.map((pr) => ({
          title: pr.title,
          state: pr.state,
        })),
        contributors: contributors.map((c) => ({ login: c.login })),
        repoInfo,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET ANALYSIS DATA
          setAnalysisData(data);
        },
      }
    );
  }, [
    repository,
    commits,
    languages,
    issues,
    pullRequests,
    contributors,
    readme,
    owner,
    repo,
    repositoryAnalysis,
  ]);
  // RUN CODE QUALITY SCAN
  const runCodeQualityScan = () => {
    // PREPARE FILES DATA
    const filesData = files.map((f) => ({
      path: f.path,
      type: f.type,
      size: f.size,
    }));
    // CONVERT LANGUAGES ARRAY TO RECORD (LANGUAGE: BYTES)
    const languagesRecord = languages?.reduce((acc, lang) => {
      acc[lang.name] = lang.bytes;
      return acc;
    }, {} as Record<string, number>);
    // RUN CODE QUALITY SCAN
    codeQualityScan.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        files: filesData,
        languages: languagesRecord,
        recentCommits: commits.slice(0, 5).map((c) => ({ message: c.message })),
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET CODE QUALITY DATA
          setCodeQualityData(data);
        },
      }
    );
  };
  // RUN SECURITY SCAN
  const runSecurityScan = () => {
    // PREPARE FILES DATA
    const filesData = files.map((f) => ({ path: f.path }));
    // FIND PACKAGE FILES
    const packageFiles = files
      .filter(
        (f) =>
          f.path.includes("package.json") ||
          f.path.includes("requirements.txt") ||
          f.path.includes("Gemfile") ||
          f.path.includes("pom.xml") ||
          f.path.includes("build.gradle")
      )
      .map((f) => f.path);
    // CONVERT LANGUAGES ARRAY TO RECORD (LANGUAGE: BYTES)
    const languagesRecord = languages?.reduce((acc, lang) => {
      acc[lang.name] = lang.bytes;
      return acc;
    }, {} as Record<string, number>);
    // RUN SECURITY SCAN
    securityScan.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        files: filesData,
        languages: languagesRecord,
        packageFiles,
        isPublic: !repository?.private,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET SECURITY DATA
          setSecurityData(data);
        },
      }
    );
  };
  // RUN ACTIVITY INSIGHTS
  const runActivityInsights = () => {
    // PREPARE COMMIT DATA
    const commitData = commits.map((c) => ({
      message: c.message,
      date: c.author?.date || "",
      author: c.author?.login || "Unknown",
    }));
    // RUN ACTIVITY INSIGHTS
    activityInsights.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        commits: commitData,
        issues: issues.map((i) => ({
          title: i.title,
          state: i.state,
          createdAt: i.createdAt,
          labels: i.labels
            ?.map((l) => l.name)
            .filter((name): name is string => name !== null),
        })),
        pullRequests: pullRequests.map((pr) => ({
          title: pr.title,
          state: pr.state,
          createdAt: pr.createdAt,
          merged: pr.mergedAt !== null,
        })),
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET ACTIVITY DATA
          setActivityData(data);
        },
      }
    );
  };
  // RUN README GENERATION
  const runReadmeGeneration = () => {
    // PREPARE FILES DATA
    const filesData = files.slice(0, 30).map((f) => ({ path: f.path }));
    // CONVERT LANGUAGES ARRAY TO RECORD (LANGUAGE: BYTES)
    const languagesRecord = languages?.reduce((acc, lang) => {
      acc[lang.name] = lang.bytes;
      return acc;
    }, {} as Record<string, number>);
    // RUN README GENERATION
    generateReadme.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        files: filesData,
        languages: languagesRecord,
        repoInfo: repository
          ? { description: repository.description || undefined }
          : undefined,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET GENERATED README
          setGeneratedReadme(data.content);
          // SHOW SUCCESS TOAST
          toast.success("README generated successfully!");
        },
      }
    );
  };
  // COPY README TO CLIPBOARD
  const copyReadme = () => {
    // IF GENERATED README IS NOT NULL
    if (generatedReadme) {
      // COPY GENERATED README TO CLIPBOARD
      navigator.clipboard.writeText(generatedReadme);
      // SET COPIED README STATE TO TRUE
      setCopiedReadme(true);
      // SHOW SUCCESS TOAST
      toast.success("README copied to clipboard!");
      // SET COPIED README STATE TO FALSE AFTER 2 SECONDS
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };
  // RESET FULL ANALYSIS STATE WHEN ALL RUNNING ANALYSES COMPLETE
  useEffect(() => {
    // IF RUNNING FULL ANALYSIS AND ALL ANALYSES ARE NOT PENDING (completed or errored)
    if (
      isRunningFullAnalysis &&
      !repositoryAnalysis.isPending &&
      !codeQualityScan.isPending &&
      !securityScan.isPending &&
      !activityInsights.isPending
    ) {
      // SET RUNNING FULL ANALYSIS STATE TO FALSE
      setIsRunningFullAnalysis(false);
    }
  }, [
    isRunningFullAnalysis,
    repositoryAnalysis.isPending,
    codeQualityScan.isPending,
    securityScan.isPending,
    activityInsights.isPending,
  ]);
  // RETURN PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="AI Insights"
        subtitle={`${owner}/${repo}`}
      />
      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(`/github/${owner}/${repo}`)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Repository
        </button>
        {/* LOADING STATE */}
        {isRepoLoading || isAILoading || isRunningFullAnalysis ? (
          <PageLoadingSkeleton />
        ) : !repository ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <AlertCircle size={40} className="text-red-500 mb-3" />
            <p className="text-sm text-[var(--text-primary)]">
              Repository not found
            </p>
          </div>
        ) : !isAIReady ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <AlertCircle size={40} className="text-yellow-500 mb-3" />
            <p className="text-sm text-[var(--text-primary)] mb-2">
              AI Service Not Available
            </p>
            <p className="text-xs text-[var(--light-text)]">
              Please configure the GEMINI_API_KEY to enable AI insights
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles size={20} className="text-[var(--accent-color)]" />
                  AI-Powered Insights
                </h1>
                <p className="text-sm text-[var(--light-text)]">
                  Comprehensive analysis of {owner}/{repo}
                </p>
              </div>
              <button
                onClick={() => {
                  // SET RUNNING FULL ANALYSIS STATE
                  setIsRunningFullAnalysis(true);
                  // RUN ALL ANALYSES
                  runRepositoryAnalysis();
                  runCodeQualityScan();
                  runSecurityScan();
                  runActivityInsights();
                }}
                disabled={
                  repositoryAnalysis.isPending ||
                  codeQualityScan.isPending ||
                  securityScan.isPending ||
                  activityInsights.isPending
                }
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain size={16} />
                Run Full Analysis
              </button>
            </div>

            {/* HEALTH SCORE OVERVIEW */}
            {repositoryAnalysis.isPending && !isRunningFullAnalysis ? (
              <HealthScoreSkeleton />
            ) : (
              analysisData && (
                <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* MAIN SCORE */}
                    <div className="flex flex-col items-center gap-2">
                      <ScoreCircle
                        score={analysisData.healthScore.overall}
                        size="lg"
                        label="Overall Health"
                      />
                    </div>
                    {/* BREAKDOWN */}
                    <div className="flex-1 w-full space-y-3">
                      <ScoreBar
                        score={Math.round(
                          analysisData.healthScore.breakdown.codeQuality / 10
                        )}
                        label="Code Quality"
                      />
                      <ScoreBar
                        score={Math.round(
                          analysisData.healthScore.breakdown.activity / 10
                        )}
                        label="Activity"
                      />
                      <ScoreBar
                        score={Math.round(
                          analysisData.healthScore.breakdown.documentation / 10
                        )}
                        label="Documentation"
                      />
                      <ScoreBar
                        score={Math.round(
                          analysisData.healthScore.breakdown.community / 10
                        )}
                        label="Community"
                      />
                      <ScoreBar
                        score={Math.round(
                          analysisData.healthScore.breakdown.security / 10
                        )}
                        label="Security"
                      />
                    </div>
                  </div>
                </div>
              )
            )}

            {/* KEY INSIGHTS */}
            {repositoryAnalysis.isPending && !isRunningFullAnalysis ? (
              <KeyInsightsSkeleton />
            ) : (
              analysisData?.keyInsights &&
              analysisData.keyInsights.length > 0 && (
                <div className="bg-gradient-to-r from-[var(--accent-color)]/10 to-transparent border border-[var(--accent-color)]/20 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-[var(--accent-color)]" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {analysisData.keyInsights.map((insight, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-[var(--light-text)]"
                      >
                        <ChevronRight
                          size={14}
                          className="text-[var(--accent-color)] mt-0.5 flex-shrink-0"
                        />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {/* INSIGHTS GRID */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* OVERVIEW CARD */}
              <InsightCard
                icon={Target}
                title="Project Overview"
                loading={repositoryAnalysis.isPending && !isRunningFullAnalysis}
                onRefresh={runRepositoryAnalysis}
                isRefreshing={repositoryAnalysis.isPending}
                skeleton={<OverviewSkeleton />}
              >
                {analysisData ? (
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-primary)]">
                      {analysisData.overview.summary}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-[var(--light-text)] w-20">
                          Purpose:
                        </span>
                        <span className="text-xs text-[var(--text-primary)]">
                          {analysisData.overview.primaryPurpose}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-[var(--light-text)] w-20">
                          Audience:
                        </span>
                        <span className="text-xs text-[var(--text-primary)]">
                          {analysisData.overview.targetAudience}
                        </span>
                      </div>
                      {analysisData.overview.techStack.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-[var(--light-text)] w-20">
                            Tech Stack:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysisData.overview.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-xs bg-[var(--hover-bg)] rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--light-text)]">
                    Click refresh to analyze the project
                  </p>
                )}
              </InsightCard>

              {/* CODE QUALITY CARD */}
              <InsightCard
                icon={Code}
                title="Code Quality"
                loading={codeQualityScan.isPending && !isRunningFullAnalysis}
                onRefresh={runCodeQualityScan}
                isRefreshing={codeQualityScan.isPending}
                skeleton={<CodeQualitySkeleton />}
              >
                {codeQualityData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <ScoreCircle
                        score={codeQualityData.overallScore}
                        size="sm"
                      />
                      <div className="text-xs text-[var(--light-text)]">
                        <p>
                          Architecture:{" "}
                          <span className="text-[var(--text-primary)]">
                            {codeQualityData.architecture.pattern}
                          </span>
                        </p>
                        {codeQualityData.testing.testingFrameworkDetected && (
                          <p>
                            Testing:{" "}
                            <span className="text-[var(--text-primary)]">
                              {codeQualityData.testing.testingFrameworkDetected}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    {codeQualityData.potentialIssues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-[var(--light-text)]">
                          Potential Issues
                        </p>
                        {codeQualityData.potentialIssues
                          .slice(0, 3)
                          .map((issue, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <PriorityBadge priority={issue.severity} />
                              <span className="text-[var(--text-primary)]">
                                {issue.issue}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--light-text)]">
                    Click refresh to scan code quality
                  </p>
                )}
              </InsightCard>

              {/* SECURITY CARD */}
              <InsightCard
                icon={Shield}
                title="Security Analysis"
                loading={securityScan.isPending && !isRunningFullAnalysis}
                onRefresh={runSecurityScan}
                isRefreshing={securityScan.isPending}
                skeleton={<SecuritySkeleton />}
              >
                {securityData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <ScoreCircle
                        score={securityData.securityScore}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                          Risk Level:{" "}
                          <span
                            className={`${
                              securityData.overallRisk === "low"
                                ? "text-green-500"
                                : securityData.overallRisk === "medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {securityData.overallRisk}
                          </span>
                        </p>
                      </div>
                    </div>
                    {securityData.prioritizedActions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-[var(--light-text)]">
                          Priority Actions
                        </p>
                        {securityData.prioritizedActions
                          .slice(0, 3)
                          .map((action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <PriorityBadge priority={action.severity} />
                              <span className="text-[var(--text-primary)]">
                                {action.action}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--light-text)]">
                    Click refresh to run security scan
                  </p>
                )}
              </InsightCard>

              {/* ACTIVITY INSIGHTS CARD */}
              <InsightCard
                icon={Activity}
                title="Activity Insights"
                loading={activityInsights.isPending && !isRunningFullAnalysis}
                onRefresh={runActivityInsights}
                isRefreshing={activityInsights.isPending}
                skeleton={<ActivitySkeleton />}
              >
                {activityData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <ScoreCircle
                        score={activityData.activityScore}
                        size="sm"
                      />
                      <div className="text-xs">
                        <p className="flex items-center gap-1 text-[var(--text-primary)]">
                          <TrendIcon trend={activityData.patterns.trend} />
                          {activityData.patterns.trend} activity
                        </p>
                        <p className="text-[var(--light-text)]">
                          ~{activityData.patterns.averageCommitsPerWeek}{" "}
                          commits/week
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-[var(--hover-bg)] rounded-lg">
                        <p className="text-[var(--light-text)]">
                          PR Merge Rate
                        </p>
                        <p className="font-medium text-[var(--text-primary)]">
                          {activityData.prWorkflow.mergeRate}%
                        </p>
                      </div>
                      <div className="p-2 bg-[var(--hover-bg)] rounded-lg">
                        <p className="text-[var(--light-text)]">Contributors</p>
                        <p className="font-medium text-[var(--text-primary)]">
                          {activityData.contributors.totalActive} active
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--light-text)]">
                    Click refresh to analyze activity
                  </p>
                )}
              </InsightCard>
            </div>

            {/* IMPROVEMENTS SECTION */}
            {repositoryAnalysis.isPending && !isRunningFullAnalysis ? (
              <InsightCard
                icon={Zap}
                title="Recommended Improvements"
                expandable
                defaultExpanded={false}
                loading={true}
                skeleton={<ImprovementsSkeleton />}
              >
                <div />
              </InsightCard>
            ) : (
              analysisData?.improvements &&
              analysisData.improvements.length > 0 && (
                <InsightCard
                  icon={Zap}
                  title="Recommended Improvements"
                  expandable
                  defaultExpanded={false}
                >
                  <div className="space-y-3">
                    {analysisData.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-[var(--hover-bg)] rounded-lg"
                      >
                        <PriorityBadge priority={improvement.priority} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {improvement.suggestion}
                          </p>
                          <p className="text-xs text-[var(--light-text)] mt-0.5">
                            {improvement.category} • {improvement.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </InsightCard>
              )
            )}

            {/* README GENERATOR */}
            <InsightCard
              icon={FileText}
              title="README Generator"
              expandable
              defaultExpanded={false}
              loading={
                generateReadme.isPending &&
                !generatedReadme &&
                !isRunningFullAnalysis
              }
              skeleton={<ReadmeGeneratorSkeleton />}
            >
              {generatedReadme ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={copyReadme}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer"
                    >
                      {copiedReadme ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                      Copy
                    </button>
                    <button
                      onClick={runReadmeGeneration}
                      disabled={generateReadme.isPending}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw
                        size={12}
                        className={
                          generateReadme.isPending ? "animate-spin" : ""
                        }
                      />
                      Regenerate
                    </button>
                  </div>
                  {generateReadme.isPending ? (
                    <div className="animate-pulse">
                      <ReadmeGeneratorSkeleton />
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                      <pre className="text-xs text-[var(--text-primary)] whitespace-pre-wrap font-mono">
                        {generatedReadme}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-[var(--light-text)] mb-3">
                    Generate a professional README based on your repository
                    structure
                  </p>
                  <button
                    onClick={runReadmeGeneration}
                    disabled={generateReadme.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                  >
                    <FileText size={14} />
                    Generate README
                  </button>
                </div>
              )}
            </InsightCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default GitHubInsightsPage;
