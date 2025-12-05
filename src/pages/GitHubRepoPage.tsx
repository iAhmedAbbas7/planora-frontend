// <== IMPORTS ==>
import {
  Star,
  GitFork,
  Eye,
  ExternalLink,
  ArrowLeft,
  GitCommit,
  CircleDot,
  GitPullRequest,
  GitBranch,
  Users,
  Clock,
  Code,
  Lock,
  Globe,
  FileText,
  Scale,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  GitMerge,
  Sparkles,
  Activity,
  Shield,
  Lightbulb,
  Tag,
  Layers,
  RefreshCw,
} from "lucide-react";
import {
  useGitHubStatus,
  useRepositoryDetails,
  useRepositoryCommits,
  useRepositoryIssues,
  useRepositoryPullRequests,
  useRepositoryReadme,
  useRepositoryBranches,
  useRepositoryLanguages,
  useRepositoryContributors,
  GitHubCommit,
  GitHubIssue,
  GitHubPullRequest,
  GitHubBranch,
  GitHubContributor,
} from "../hooks/useGitHub";
import {
  useRepositoryCategorization,
  useRepositoryHealthScore,
} from "../hooks/useAI";
import { JSX, useState } from "react";
import useTitle from "../hooks/useTitle";
import ReactMarkdown from "react-markdown";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== LANGUAGE COLORS MAP ==>
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Shell: "#89e051",
  SCSS: "#c6538c",
  Dockerfile: "#384d54",
};

// <== GET LANGUAGE COLOR FUNCTION ==>
const getLanguageColor = (language: string): string => {
  return languageColors[language] || "#6b7280";
};

// <== FORMAT DATE FUNCTION ==>
const formatDate = (dateString: string): string => {
  // CREATE DATE OBJECT
  const date = new Date(dateString);
  // CREATE NOW DATE OBJECT
  const now = new Date();
  // CALCULATE TIME DIFFERENCE
  const diffTime = Math.abs(now.getTime() - date.getTime());
  // CALCULATE DAYS DIFFERENCE
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // IF LESS THAN 1 DAY, RETURN HOURS
  if (diffDays < 1) {
    // CALCULATE HOURS DIFFERENCE
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    // IF LESS THAN 1 HOUR, RETURN JUST NOW
    if (diffHours < 1) {
      // CALCULATE MINUTES DIFFERENCE
      const diffMins = Math.floor(diffTime / (1000 * 60));
      // IF LESS THAN 1 MINUTE, RETURN JUST NOW
      return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
    }
    // RETURN HOURS AGO
    return `${diffHours}h ago`;
  }
  // IF LESS THAN 7 DAYS, RETURN DAYS
  if (diffDays < 7) return `${diffDays}d ago`;
  // IF LESS THAN 30 DAYS, RETURN WEEKS
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  // RETURN FORMATTED DATE
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color?: string;
}): JSX.Element => (
  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
    <Icon
      size={16}
      className="sm:w-[18px] sm:h-[18px] flex-shrink-0"
      style={{ color: color || "var(--accent-color)" }}
    />
    <div className="min-w-0">
      <p className="text-xs text-[var(--light-text)] truncate">{label}</p>
      <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  </div>
);

// <== SECTION HEADER COMPONENT ==>
const SectionHeader = ({
  icon: Icon,
  title,
  count,
  isOpen,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
}): JSX.Element => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-3 sm:p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <Icon size={18} className="text-[var(--accent-color)] flex-shrink-0" />
      <span className="font-medium text-sm sm:text-base text-[var(--text-primary)]">
        {title}
      </span>
      {count !== undefined && (
        <span
          className="px-2 py-0.5 text-xs font-medium rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent-color) 15%, var(--cards-bg))",
            color: "var(--accent-color)",
          }}
        >
          {count}
        </span>
      )}
    </div>
    {isOpen ? (
      <ChevronUp size={18} className="text-[var(--light-text)]" />
    ) : (
      <ChevronDown size={18} className="text-[var(--light-text)]" />
    )}
  </button>
);

// <== EMPTY STATE COMPONENT ==>
const EmptyState = ({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}): JSX.Element => (
  <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)]">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-2 sm:mb-3">
      <Icon size={18} className="sm:w-5 sm:h-5 text-[var(--light-text)]" />
    </div>
    <p className="text-xs sm:text-sm text-[var(--light-text)] text-center">
      {message}
    </p>
  </div>
);

// <== COMMIT ITEM COMPONENT ==>
const CommitItem = ({ commit }: { commit: GitHubCommit }): JSX.Element => (
  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition">
    {commit.author.avatarUrl ? (
      <img
        src={commit.author.avatarUrl}
        alt={commit.author.login || commit.author.name || "Author"}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
      />
    ) : (
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center flex-shrink-0">
        <GitCommit
          size={12}
          className="sm:w-[14px] sm:h-[14px] text-[var(--light-text)]"
        />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] line-clamp-2">
        {commit.message.split("\n")[0]}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-[var(--light-text)]">
        <span className="truncate max-w-[80px] sm:max-w-none">
          {commit.author.login || commit.author.name || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} className="sm:w-3 sm:h-3" />
          {commit.author.date ? formatDate(commit.author.date) : "Unknown"}
        </span>
        <a
          href={commit.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[var(--accent-color)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <Code size={10} className="sm:w-3 sm:h-3" />
          {commit.sha.slice(0, 7)}
        </a>
      </div>
    </div>
  </div>
);

// <== ISSUE ITEM COMPONENT ==>
const IssueItem = ({ issue }: { issue: GitHubIssue }): JSX.Element => (
  <a
    href={issue.htmlUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition"
  >
    <CircleDot
      size={16}
      className="flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]"
      style={{
        color:
          issue.state === "open"
            ? "var(--accent-green-500)"
            : "var(--accent-red-500)",
      }}
    />
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] line-clamp-2 sm:line-clamp-1">
        <span className="text-[var(--light-text)]">#{issue.number}</span>{" "}
        {issue.title}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-[var(--light-text)]">
        <span className="truncate max-w-[60px] sm:max-w-none">
          {issue.user.login || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} className="sm:w-3 sm:h-3" />
          {formatDate(issue.createdAt)}
        </span>
        {issue.commentsCount > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare size={10} className="sm:w-3 sm:h-3" />
            {issue.commentsCount}
          </span>
        )}
      </div>
      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
          {issue.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full"
              style={{
                backgroundColor: label.color
                  ? `#${label.color}20`
                  : "var(--inside-card-bg)",
                color: label.color ? `#${label.color}` : "var(--light-text)",
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  </a>
);

// <== PULL REQUEST ITEM COMPONENT ==>
const PullRequestItem = ({ pr }: { pr: GitHubPullRequest }): JSX.Element => (
  <a
    href={pr.htmlUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition"
  >
    {pr.merged ? (
      <GitMerge
        size={16}
        className="flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px] text-purple-500"
      />
    ) : pr.state === "open" ? (
      <GitPullRequest
        size={16}
        className="flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px] text-green-500"
      />
    ) : (
      <GitPullRequest
        size={16}
        className="flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px] text-red-500"
      />
    )}
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] line-clamp-2 sm:line-clamp-1">
          <span className="text-[var(--light-text)]">#{pr.number}</span>{" "}
          {pr.title}
        </p>
        {pr.draft && (
          <span className="px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs rounded bg-[var(--inside-card-bg)] text-[var(--light-text)] flex-shrink-0">
            Draft
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-[var(--light-text)]">
        <span className="truncate max-w-[60px] sm:max-w-none">
          {pr.user.login || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} className="sm:w-3 sm:h-3" />
          {formatDate(pr.createdAt)}
        </span>
        <span className="text-[var(--light-text)] truncate max-w-[100px] sm:max-w-none">
          {pr.head.ref} → {pr.base.ref}
        </span>
      </div>
    </div>
  </a>
);

// <== BRANCH ITEM COMPONENT ==>
const BranchItem = ({ branch }: { branch: GitHubBranch }): JSX.Element => (
  <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)]">
    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
      <GitBranch
        size={12}
        className="sm:w-[14px] sm:h-[14px] text-[var(--accent-color)] flex-shrink-0"
      />
      <span className="text-xs sm:text-sm text-[var(--text-primary)] truncate">
        {branch.name}
      </span>
    </div>
    {branch.protected && (
      <span
        className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full flex-shrink-0"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--accent-yellow-500) 15%, var(--cards-bg))",
          color: "var(--accent-yellow-500)",
        }}
      >
        Protected
      </span>
    )}
  </div>
);

// <== CONTRIBUTOR ITEM COMPONENT ==>
const ContributorItem = ({
  contributor,
}: {
  contributor: GitHubContributor;
}): JSX.Element => (
  <a
    href={contributor.htmlUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-2 sm:p-2.5 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition"
  >
    <img
      src={contributor.avatarUrl}
      alt={contributor.login}
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
        {contributor.login}
      </p>
      <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
        {contributor.contributions.toLocaleString()} commits
      </p>
    </div>
  </a>
);

// <== LANGUAGE DATA TYPE (LOCAL) ==>
type LanguageDataItem = {
  name: string;
  bytes: number;
  percentage: string;
};

// <== LANGUAGES BAR COMPONENT ==>
const LanguagesBar = ({
  languages,
}: {
  languages: LanguageDataItem[];
}): JSX.Element => {
  return (
    <div className="space-y-3">
      {/* BAR */}
      <div className="h-2.5 rounded-full overflow-hidden flex bg-[var(--inside-card-bg)]">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: getLanguageColor(lang.name),
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>
      {/* LEGEND */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {languages.slice(0, 6).map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getLanguageColor(lang.name) }}
            />
            <span className="text-[var(--text-primary)]">{lang.name}</span>
            <span className="text-[var(--light-text)]">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== LOADING SKELETON ==>
const LoadingSkeleton = (): JSX.Element => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-64 bg-[var(--inside-card-bg)] rounded-lg"></div>
    <div className="h-4 w-96 bg-[var(--inside-card-bg)] rounded-lg"></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 bg-[var(--inside-card-bg)] rounded-lg"
        ></div>
      ))}
    </div>
    <div className="h-48 bg-[var(--inside-card-bg)] rounded-lg"></div>
  </div>
);

// <== GITHUB REPO PAGE COMPONENT ==>
const GitHubRepoPage = (): JSX.Element => {
  // GET PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  // SET PAGE TITLE
  useTitle(`PlanOra - ${owner}/${repo}`);
  // SECTION STATES
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    commits: true,
    issues: false,
    pullRequests: false,
    readme: false,
    branches: false,
    contributors: false,
  });
  // TOGGLE SECTION
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  // GITHUB STATUS
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // REPOSITORY DETAILS HOOK
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || "",
    status?.isConnected ?? false
  );
  // REPOSITORY COMMITS HOOK
  const { commits, isLoading: isCommitsLoading } = useRepositoryCommits(
    owner || "",
    repo || "",
    1,
    10,
    status?.isConnected && openSections.commits
  );
  // REPOSITORY ISSUES HOOK
  const { issues, isLoading: isIssuesLoading } = useRepositoryIssues(
    owner || "",
    repo || "",
    "open",
    1,
    10,
    status?.isConnected && openSections.issues
  );
  // REPOSITORY PULL REQUESTS HOOK
  const { pullRequests, isLoading: isPRsLoading } = useRepositoryPullRequests(
    owner || "",
    repo || "",
    "open",
    1,
    10,
    status?.isConnected && openSections.pullRequests
  );
  // REPOSITORY README HOOK
  const { readme, isLoading: isReadmeLoading } = useRepositoryReadme(
    owner || "",
    repo || "",
    status?.isConnected && openSections.readme
  );
  // REPOSITORY BRANCHES HOOK
  const { branches, isLoading: isBranchesLoading } = useRepositoryBranches(
    owner || "",
    repo || "",
    status?.isConnected && openSections.branches
  );
  // REPOSITORY LANGUAGES HOOK
  const { languages, isLoading: isLanguagesLoading } = useRepositoryLanguages(
    owner || "",
    repo || "",
    status?.isConnected ?? false
  );
  // REPOSITORY CONTRIBUTORS HOOK
  const { contributors, isLoading: isContributorsLoading } =
    useRepositoryContributors(
      owner || "",
      repo || "",
      status?.isConnected && openSections.contributors
    );
  // AI INSIGHTS STATE
  const [showAIInsights, setShowAIInsights] = useState<boolean>(false);
  // AI CATEGORIZATION HOOK
  const {
    categorization,
    isLoading: isCategorizationLoading,
    refetch: refetchCategorization,
  } = useRepositoryCategorization(
    owner || "",
    repo || "",
    status?.isConnected && showAIInsights
  );
  // AI HEALTH SCORE HOOK
  const {
    healthScore,
    suggestions,
    isLoading: isHealthLoading,
    refetch: refetchHealth,
  } = useRepositoryHealthScore(
    owner || "",
    repo || "",
    status?.isConnected && showAIInsights
  );
  // NOT CONNECTED STATE
  if (!isStatusLoading && !status?.isConnected) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <DashboardHeader
          title="Repository"
          subtitle="View repository details"
          showSearch={false}
        />
        <div className="m-4 flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-[var(--light-text)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            GitHub Not Connected
          </h2>
          <p className="text-[var(--light-text)] text-center max-w-md mb-6">
            Connect your GitHub account to view repository details.
          </p>
          <Link
            to="/settings?tab=Integrations"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition text-white cursor-pointer"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            Connect GitHub
          </Link>
        </div>
      </div>
    );
  }
  // LOADING STATE
  if (isStatusLoading || isRepoLoading) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <DashboardHeader
          title="Repository"
          subtitle="Loading repository details..."
          showSearch={false}
        />
        <div className="m-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }
  // ERROR STATE
  if (!repository) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
      >
        <DashboardHeader
          title="Repository"
          subtitle="Repository not found"
          showSearch={false}
        />
        <div className="m-4 flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-[var(--light-text)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Repository Not Found
          </h2>
          <p className="text-[var(--light-text)] text-center max-w-md mb-6">
            The repository you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={() => navigate("/github")}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition text-white cursor-pointer"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <ArrowLeft size={18} />
            Back to Repositories
          </button>
        </div>
      </div>
    );
  }
  // RETURNING THE GITHUB REPO PAGE COMPONENT
  return (
    <div
      className="min-h-screen pb-0.5"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* HEADER */}
      <DashboardHeader
        title="Repository"
        subtitle={repository.fullName}
        showSearch={false}
      />
      {/* CONTENT */}
      <div className="m-4 space-y-4">
        {/* BACK BUTTON & REPO HEADER */}
        <div className="bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)] p-4 sm:p-6">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/github")}
            className="inline-flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--accent-color)] transition mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Repositories
          </button>
          {/* REPO INFO */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* LEFT SIDE */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {repository.name}
                </h1>
                {/* VISIBILITY BADGE */}
                {repository.private ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, #eab308 15%, var(--cards-bg))",
                      color: "#eab308",
                    }}
                  >
                    <Lock size={10} />
                    Private
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, #22c55e 15%, var(--cards-bg))",
                      color: "var(--accent-green-500)",
                    }}
                  >
                    <Globe size={10} />
                    Public
                  </span>
                )}
                {repository.archived && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--inside-card-bg)",
                      color: "var(--light-text)",
                    }}
                  >
                    Archived
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--light-text)] mb-3">
                {repository.description || "No description provided"}
              </p>
              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--light-text)]">
                {repository.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(repository.language),
                      }}
                    />
                    {repository.language}
                  </span>
                )}
                {repository.license && (
                  <span className="flex items-center gap-1">
                    <Scale size={12} />
                    {repository.license.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Updated {formatDate(repository.updatedAt)}
                </span>
              </div>
              {/* TOPICS */}
              {repository.topics && repository.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {repository.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--accent-color) 15%, var(--cards-bg))",
                        color: "var(--accent-color)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* RIGHT SIDE - ACTIONS */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition text-white cursor-pointer"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </a>
            </div>
          </div>
          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            <StatCard
              icon={Star}
              label="Stars"
              value={repository.stargazersCount}
              color="#eab308"
            />
            <StatCard
              icon={GitFork}
              label="Forks"
              value={repository.forksCount}
            />
            <StatCard
              icon={Eye}
              label="Watchers"
              value={repository.watchersCount}
            />
            <StatCard
              icon={CircleDot}
              label="Open Issues"
              value={repository.openIssuesCount}
              color="var(--accent-green-500)"
            />
          </div>
        </div>
        {/* LANGUAGES */}
        {!isLanguagesLoading && languages.length > 0 && (
          <div className="bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)] p-4 sm:p-6">
            <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Code size={16} className="text-[var(--accent-color)]" />
              Languages
            </h3>
            <LanguagesBar languages={languages} />
          </div>
        )}
        {/* AI INSIGHTS SECTION */}
        <div className="bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {/* AI INSIGHTS HEADER */}
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                }}
              >
                <Sparkles size={20} className="text-[var(--accent-color)]" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                  AI Insights
                </h3>
                <p className="text-xs text-[var(--light-text)]">
                  Repository analysis, health score & recommendations
                </p>
              </div>
            </div>
            {showAIInsights ? (
              <ChevronUp size={20} className="text-[var(--light-text)]" />
            ) : (
              <ChevronDown size={20} className="text-[var(--light-text)]" />
            )}
          </button>
          {/* AI INSIGHTS CONTENT */}
          {showAIInsights && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              {/* LOADING STATE */}
              {(isCategorizationLoading || isHealthLoading) && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 text-[var(--light-text)]">
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="text-sm">Analyzing repository...</span>
                  </div>
                </div>
              )}
              {/* HEALTH SCORE */}
              {healthScore && !isHealthLoading && (
                <div className="space-y-4">
                  {/* HEALTH SCORE CARD */}
                  <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Activity
                          size={18}
                          className="text-[var(--accent-color)]"
                        />
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">
                          Repository Health
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          refetchHealth();
                          refetchCategorization();
                        }}
                        className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                        title="Refresh analysis"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    {/* SCORE DISPLAY */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{
                          backgroundColor:
                            healthScore.overall >= 80
                              ? "color-mix(in srgb, #22c55e 15%, transparent)"
                              : healthScore.overall >= 60
                              ? "color-mix(in srgb, #eab308 15%, transparent)"
                              : "color-mix(in srgb, #ef4444 15%, transparent)",
                          color:
                            healthScore.overall >= 80
                              ? "#22c55e"
                              : healthScore.overall >= 60
                              ? "#eab308"
                              : "#ef4444",
                        }}
                      >
                        {healthScore.grade}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">
                          {healthScore.overall}/100
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          Overall Health Score
                        </p>
                      </div>
                    </div>
                    {/* METRIC BARS */}
                    <div className="space-y-2">
                      {[
                        {
                          label: "Documentation",
                          score: healthScore.metrics.documentation.score,
                          icon: FileText,
                        },
                        {
                          label: "Maintenance",
                          score: healthScore.metrics.maintenance.score,
                          icon: Clock,
                        },
                        {
                          label: "Community",
                          score: healthScore.metrics.community.score,
                          icon: Users,
                        },
                        {
                          label: "Issues",
                          score: healthScore.metrics.issues.score,
                          icon: CircleDot,
                        },
                        {
                          label: "Best Practices",
                          score: healthScore.metrics.bestPractices.score,
                          icon: Shield,
                        },
                      ].map((metric) => (
                        <div key={metric.label} className="flex items-center gap-2">
                          <metric.icon
                            size={14}
                            className="text-[var(--light-text)] flex-shrink-0"
                          />
                          <span className="text-xs text-[var(--light-text)] w-24 flex-shrink-0">
                            {metric.label}
                          </span>
                          <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${metric.score}%`,
                                backgroundColor:
                                  metric.score >= 80
                                    ? "#22c55e"
                                    : metric.score >= 60
                                    ? "#eab308"
                                    : "#ef4444",
                              }}
                            />
                          </div>
                          <span className="text-xs text-[var(--text-primary)] w-8 text-right">
                            {metric.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* SUGGESTIONS */}
                  {suggestions.length > 0 && (
                    <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl border border-[var(--border)]">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={18} className="text-[var(--accent-color)]" />
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">
                          Recommendations
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {suggestions.slice(0, 4).map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-[var(--bg)] rounded-lg"
                          >
                            <span
                              className="w-5 h-5 flex items-center justify-center rounded text-xs font-medium flex-shrink-0"
                              style={{
                                backgroundColor:
                                  suggestion.priority === "high"
                                    ? "color-mix(in srgb, #ef4444 15%, transparent)"
                                    : suggestion.priority === "medium"
                                    ? "color-mix(in srgb, #eab308 15%, transparent)"
                                    : "color-mix(in srgb, #22c55e 15%, transparent)",
                                color:
                                  suggestion.priority === "high"
                                    ? "#ef4444"
                                    : suggestion.priority === "medium"
                                    ? "#eab308"
                                    : "#22c55e",
                              }}
                            >
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {suggestion.title}
                              </p>
                              <p className="text-xs text-[var(--light-text)] mt-0.5">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* CATEGORIZATION */}
              {categorization && !isCategorizationLoading && (
                <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers size={18} className="text-[var(--accent-color)]" />
                    <h4 className="text-sm font-medium text-[var(--text-primary)]">
                      Project Analysis
                    </h4>
                  </div>
                  {/* CATEGORY INFO */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-[var(--light-text)] mb-1">Category</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                        {categorization.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--light-text)] mb-1">Type</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                        {categorization.projectType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--light-text)] mb-1">Complexity</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                        {categorization.complexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--light-text)] mb-1">Subcategory</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {categorization.subcategory}
                      </p>
                    </div>
                  </div>
                  {/* PURPOSE */}
                  <div className="mb-4">
                    <p className="text-xs text-[var(--light-text)] mb-1">Purpose</p>
                    <p className="text-sm text-[var(--text-primary)]">
                      {categorization.purpose}
                    </p>
                  </div>
                  {/* TECH STACK */}
                  {categorization.techStack.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-[var(--light-text)] mb-2">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {categorization.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded-lg bg-[var(--bg)] text-[var(--text-primary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* SUGGESTED TAGS */}
                  {categorization.suggestedTags.length > 0 && (
                    <div>
                      <p className="text-xs text-[var(--light-text)] mb-2 flex items-center gap-1">
                        <Tag size={12} />
                        Suggested Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categorization.suggestedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                              color: "var(--accent-color)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* COMMITS SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={GitCommit}
            title="Recent Commits"
            count={commits.length}
            isOpen={openSections.commits}
            onToggle={() => toggleSection("commits")}
          />
          {openSections.commits && (
            <div className="space-y-2">
              {isCommitsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-[var(--inside-card-bg)] rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : commits.length === 0 ? (
                <EmptyState
                  icon={GitCommit}
                  message="No commits found in this repository."
                />
              ) : (
                commits.map((commit) => (
                  <CommitItem key={commit.sha} commit={commit} />
                ))
              )}
            </div>
          )}
        </div>
        {/* ISSUES SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={CircleDot}
            title="Open Issues"
            count={repository.openIssuesCount}
            isOpen={openSections.issues}
            onToggle={() => toggleSection("issues")}
          />
          {openSections.issues && (
            <div className="space-y-2">
              {isIssuesLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-[var(--inside-card-bg)] rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : issues.length === 0 ? (
                <EmptyState
                  icon={CircleDot}
                  message="No open issues in this repository."
                />
              ) : (
                issues.map((issue) => (
                  <IssueItem key={issue.id} issue={issue} />
                ))
              )}
            </div>
          )}
        </div>
        {/* PULL REQUESTS SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={GitPullRequest}
            title="Pull Requests"
            count={pullRequests.length}
            isOpen={openSections.pullRequests}
            onToggle={() => toggleSection("pullRequests")}
          />
          {openSections.pullRequests && (
            <div className="space-y-2">
              {isPRsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-[var(--inside-card-bg)] rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : pullRequests.length === 0 ? (
                <EmptyState
                  icon={GitPullRequest}
                  message="No open pull requests in this repository."
                />
              ) : (
                pullRequests.map((pr) => (
                  <PullRequestItem key={pr.id} pr={pr} />
                ))
              )}
            </div>
          )}
        </div>
        {/* README SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={FileText}
            title="README"
            isOpen={openSections.readme}
            onToggle={() => toggleSection("readme")}
          />
          {openSections.readme && (
            <div className="bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] p-4 sm:p-6">
              {isReadmeLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-3/4 bg-[var(--inside-card-bg)] rounded"></div>
                  <div className="h-4 w-full bg-[var(--inside-card-bg)] rounded"></div>
                  <div className="h-4 w-5/6 bg-[var(--inside-card-bg)] rounded"></div>
                </div>
              ) : readme ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-color)] prose-code:text-[var(--accent-color)] prose-pre:bg-[var(--inside-card-bg)] prose-pre:border prose-pre:border-[var(--border)]">
                  <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-2 sm:mb-3">
                    <FileText
                      size={18}
                      className="sm:w-5 sm:h-5 text-[var(--light-text)]"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--light-text)] text-center">
                    This repository doesn't have a README file.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* BRANCHES SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={GitBranch}
            title="Branches"
            count={branches.length}
            isOpen={openSections.branches}
            onToggle={() => toggleSection("branches")}
          />
          {openSections.branches && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {isBranchesLoading ? (
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-[var(--inside-card-bg)] rounded-lg animate-pulse"
                  ></div>
                ))
              ) : branches.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={GitBranch}
                    message="No branches found in this repository."
                  />
                </div>
              ) : (
                branches.map((branch) => (
                  <BranchItem key={branch.name} branch={branch} />
                ))
              )}
            </div>
          )}
        </div>
        {/* CONTRIBUTORS SECTION */}
        <div className="space-y-2">
          <SectionHeader
            icon={Users}
            title="Contributors"
            count={contributors.length}
            isOpen={openSections.contributors}
            onToggle={() => toggleSection("contributors")}
          />
          {openSections.contributors && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {isContributorsLoading ? (
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-[var(--inside-card-bg)] rounded-lg animate-pulse"
                  ></div>
                ))
              ) : contributors.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={Users}
                    message="No contributors found in this repository."
                  />
                </div>
              ) : (
                contributors.map((contributor) => (
                  <ContributorItem
                    key={contributor.login}
                    contributor={contributor}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubRepoPage;
