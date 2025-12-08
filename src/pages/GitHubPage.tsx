// <== IMPORTS ==>
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Search,
  Filter,
  Users,
  AlertCircle,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Code,
  Clock,
  Link2,
  SortDesc,
  Check,
  FolderGit2,
  User,
  ArrowUpCircle,
  CalendarPlus,
  ArrowDownAZ,
  Plus,
  GitPullRequest,
  CircleDot,
  Eye,
  Activity,
  GitCommit,
  Tag,
  Zap,
  TrendingUp,
  Pin,
  Loader2,
} from "lucide-react";
import {
  useGitHubStatus,
  useGitHubProfile,
  useGitHubRepositories,
  useDashboardStats,
  useDashboardActivity,
  useStarredRepositories,
  usePinnedRepositories,
  useStarRepository,
  useUnstarRepository,
  useCheckIfStarred,
  GitHubRepository,
  DashboardActivity,
  StarredRepository,
  PinnedRepository,
} from "../hooks/useGitHub";
import useTitle from "../hooks/useTitle";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { JSX, useState, useMemo, useRef, useEffect } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";
import GitHubSkeleton from "../components/skeletons/GitHubSkeleton";
import CreateRepositoryModal from "../components/github/CreateRepositoryModal";

// <== DROPDOWN OPTION TYPE ==>
type DropdownOption = {
  // <== VALUE ==>
  value: string;
  // <== LABEL ==>
  label: string;
  // <== ICON ==>
  icon: LucideIcon;
};

// <== TAB TYPE ==>
type TabType = "all" | "starred" | "pinned";

// <== TYPE FILTER OPTIONS ==>
const typeFilterOptions: DropdownOption[] = [
  { value: "all", label: "All Repos", icon: FolderGit2 },
  { value: "owner", label: "My Repos", icon: User },
  { value: "public", label: "Public", icon: Globe },
  { value: "private", label: "Private", icon: Lock },
  { value: "forks", label: "Forks", icon: GitFork },
];

// <== SORT OPTIONS ==>
const sortOptions: DropdownOption[] = [
  { value: "updated", label: "Recently Updated", icon: Clock },
  { value: "pushed", label: "Recently Pushed", icon: ArrowUpCircle },
  { value: "created", label: "Newest First", icon: CalendarPlus },
  { value: "full_name", label: "Name (A-Z)", icon: ArrowDownAZ },
];

// <== FILTER DROPDOWN COMPONENT ==>
const FilterDropdown = ({
  value,
  options,
  onChange,
  icon: Icon,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon: React.ElementType;
}): JSX.Element => {
  // IS DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // CURRENT LABEL
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || options[0].label;
  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE
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
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RETURN FILTER DROPDOWN
  return (
    <div ref={dropdownRef} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <Icon size={14} className="text-[var(--accent-color)] flex-shrink-0" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
          {options.map((option) => {
            // GET OPTION ICON
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                  value === option.value
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                <OptionIcon
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
            );
          })}
        </div>
      )}
    </div>
  );
};

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  color = "accent",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subValue?: string;
  color?: "accent" | "green" | "yellow" | "blue" | "purple";
}): JSX.Element => {
  const colorClasses = {
    accent: "text-[var(--accent-color)] bg-[var(--accent-color)]/10",
    green: "text-green-500 bg-green-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };
  // RETURN STAT CARD
  return (
    <div className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] hover:border-[var(--accent-color)]/30 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--light-text)] mb-1">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subValue && (
            <p className="text-xs text-[var(--light-text)] mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

// <== ACTIVITY ITEM COMPONENT ==>
const ActivityItem = ({
  activity,
}: {
  activity: DashboardActivity;
}): JSX.Element => {
  // FORMAT TIME AGO
  const formatTimeAgo = (dateString: string): string => {
    // GET DATE
    const date = new Date(dateString);
    // GET NOW
    const now = new Date();
    // GET DIFFERENCE IN MILLISECONDS
    const diffMs = now.getTime() - date.getTime();
    // GET DIFFERENCE IN MINUTES
    const diffMins = Math.floor(diffMs / 60000);
    // GET DIFFERENCE IN HOURS
    const diffHours = Math.floor(diffMs / 3600000);
    // GET DIFFERENCE IN DAYS
    const diffDays = Math.floor(diffMs / 86400000);
    // CHECK IF DIFFERENCE IS LESS THAN 1 MINUTE
    if (diffMins < 1) return "just now";
    // CHECK IF DIFFERENCE IS LESS THAN 1 HOUR
    if (diffMins < 60) return `${diffMins}m ago`;
    // CHECK IF DIFFERENCE IS LESS THAN 1 DAY
    if (diffHours < 24) return `${diffHours}h ago`;
    // CHECK IF DIFFERENCE IS LESS THAN 1 WEEK
    if (diffDays < 7) return `${diffDays}d ago`;
    // RETURN DATE
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  // GET ACTIVITY ICON
  const getActivityIcon = (): {
    // <== ICON ==>
    icon: LucideIcon;
    color: string;
    bgColor: string;
  } => {
    // SWITCH ON ACTIVITY TYPE
    switch (activity.type) {
      // PUSH EVENT
      case "PushEvent":
        // RETURN GIT COMMIT ICON
        return {
          icon: GitCommit,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        };
      // PULL REQUEST EVENT
      case "PullRequestEvent":
        // RETURN GIT PULL REQUEST ICON
        return {
          icon: GitPullRequest,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        };
      // ISSUES EVENT
      case "IssuesEvent":
        // RETURN CIRCLE DOT ICON
        return {
          icon: CircleDot,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        };
      // ISSUE COMMENT EVENT
      case "IssueCommentEvent":
        // RETURN ACTIVITY ICON
        return {
          icon: Activity,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        };
      // CREATE EVENT
      case "CreateEvent":
        // RETURN PLUS ICON
        return {
          icon: Plus,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        };
      // FORK EVENT
      case "ForkEvent":
        // RETURN GIT FORK ICON
        return {
          icon: GitFork,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        };
      // WATCH EVENT
      case "WatchEvent":
        // RETURN STAR ICON
        return {
          icon: Star,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        };
      // RELEASE EVENT
      case "ReleaseEvent":
        // RETURN TAG ICON
        return {
          icon: Tag,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        };
      // DEFAULT
      default:
        // RETURN ACTIVITY ICON
        return {
          icon: Activity,
          color: "text-[var(--light-text)]",
          bgColor: "bg-[var(--hover-bg)]",
        };
    }
  };
  // GET ACTIVITY INFO
  const getActivityInfo = (): { action: string; detail: string } => {
    // GET DETAILS
    const details = activity.details;
    // SWITCH ON ACTIVITY TYPE
    switch (activity.type) {
      // PUSH EVENT
      case "PushEvent": {
        // GET BRANCH
        const branch = details?.ref?.replace("refs/heads/", "") || "main";
        // RETURN ACTION AND DETAIL
        return {
          action: "Pushed commits",
          detail: `to ${branch}`,
        };
      }
      // PULL REQUEST EVENT
      case "PullRequestEvent": {
        // GET ACTION
        const action =
          details?.action === "opened"
            ? "Opened"
            : details?.action === "closed"
            ? details?.merged
              ? "Merged"
              : "Closed"
            : details?.action || "Updated";
        // RETURN ACTION AND DETAIL
        return {
          action: `${action} pull request`,
          detail: details?.title
            ? `#${details?.number} ${details.title}`
            : `#${details?.number}`,
        };
      }
      // ISSUES EVENT
      case "IssuesEvent": {
        // GET ACTION
        const action =
          details?.action === "opened"
            ? "Opened"
            : details?.action === "closed"
            ? "Closed"
            : details?.action || "Updated";
        // RETURN ACTION AND DETAIL
        return {
          action: `${action} issue`,
          detail: details?.title
            ? `#${details?.number} ${details.title}`
            : `#${details?.number}`,
        };
      }
      // ISSUE COMMENT EVENT
      case "IssueCommentEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: "Commented on issue",
          detail: details?.issueTitle
            ? `#${details?.issueNumber} ${details.issueTitle}`
            : `#${details?.issueNumber}`,
        };
      // CREATE EVENT
      case "CreateEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: `Created ${details?.refType || "branch"}`,
          detail: details?.ref || "",
        };
      // DELETE EVENT
      case "DeleteEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: `Deleted ${details?.refType || "branch"}`,
          detail: details?.ref || "",
        };
      // FORK EVENT
      case "ForkEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: "Forked to",
          detail: details?.forkee?.fullName || "",
        };
      // WATCH EVENT
      case "WatchEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: "Starred repository",
          detail: "",
        };
      // RELEASE EVENT
      case "ReleaseEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: "Published release",
          detail: details?.tagName || details?.name || "",
        };
      // PULL REQUEST REVIEW EVENT
      case "PullRequestReviewEvent":
        // RETURN ACTION AND DETAIL
        return {
          action: details?.state === "approved" ? "Approved PR" : "Reviewed PR",
          detail: details?.prTitle
            ? `#${details?.prNumber} ${details.prTitle}`
            : `#${details?.prNumber}`,
        };
      // DEFAULT
      default:
        // RETURN ACTION AND DETAIL
        return {
          action: activity.type.replace("Event", ""),
          detail: "",
        };
    }
  };
  // GET ACTIVITY ICON
  const { icon: ActivityIcon, color, bgColor } = getActivityIcon();
  // GET ACTIVITY INFO
  const { action, detail } = getActivityInfo();
  // GET REPO NAME
  const repoName = activity.repo.name.split("/")[1] || activity.repo.name;
  // RETURN ACTIVITY ITEM
  return (
    <Link
      to={`/github/${activity.repo.name}`}
      className="block p-3 -mx-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* ICON */}
        <div className={`p-2 rounded-lg ${bgColor} ${color} flex-shrink-0`}>
          <ActivityIcon size={14} />
        </div>
        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* ACTION */}
          <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
            {action}
          </p>
          {/* DETAIL */}
          {detail && (
            <p className="text-xs text-[var(--light-text)] truncate mt-0.5">
              {detail}
            </p>
          )}
          {/* META */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-[var(--accent-color)] font-medium">
              {repoName}
            </span>
            <span className="text-[var(--border)]">·</span>
            <span className="text-xs text-[var(--light-text)]">
              {formatTimeAgo(activity.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// <== STAR BUTTON COMPONENT ==>
const StarButton = ({
  owner,
  repo,
  initialStarred = false,
}: {
  owner: string;
  repo: string;
  initialStarred?: boolean;
}): JSX.Element => {
  // CHECK IF STARRED
  const { isStarred, isLoading: isCheckingStarred } = useCheckIfStarred(
    owner,
    repo
  );
  // STAR REPOSITORY MUTATION
  const starMutation = useStarRepository();
  // UNSTAR REPOSITORY MUTATION
  const unstarMutation = useUnstarRepository();
  // CHECK IF STARRED
  const starred = isCheckingStarred ? initialStarred : isStarred;
  // CHECK IF LOADING
  const isLoading =
    isCheckingStarred || starMutation.isPending || unstarMutation.isPending;
  // HANDLE TOGGLE STAR
  const handleToggleStar = (e: React.MouseEvent) => {
    // STOP PROPAGATION
    e.stopPropagation();
    // CHECK IF LOADING
    if (isLoading) return;
    // CHECK IF STARRED
    if (starred) {
      // UNSTAR REPOSITORY
      unstarMutation.mutate({ owner, repo });
    } else {
      // STAR REPOSITORY
      starMutation.mutate({ owner, repo });
    }
  };
  // RETURN STAR BUTTON
  return (
    <button
      onClick={handleToggleStar}
      disabled={isLoading}
      className={`p-1.5 rounded-lg transition cursor-pointer disabled:opacity-50 ${
        starred
          ? "text-yellow-500 hover:bg-yellow-500/10"
          : "text-[var(--light-text)] hover:text-yellow-500 hover:bg-[var(--hover-bg)]"
      }`}
      title={starred ? "Unstar" : "Star"}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Star size={16} fill={starred ? "currentColor" : "none"} />
      )}
    </button>
  );
};

// <== REPOSITORY CARD COMPONENT ==>
const RepositoryCard = ({
  repo,
  onClick,
  showStarButton = true,
}: {
  repo: GitHubRepository | StarredRepository | PinnedRepository;
  onClick: () => void;
  showStarButton?: boolean;
}): JSX.Element => {
  // FORMAT DATE
  const formatDate = (dateString: string): string => {
    // GET DATE
    const date = new Date(dateString);
    // GET NOW
    const now = new Date();
    // GET DIFFERENCE IN TIME
    const diffTime = Math.abs(now.getTime() - date.getTime());
    // GET DIFFERENCE IN DAYS
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // CHECK IF DIFFERENCE IS LESS THAN 1 DAY
    if (diffDays < 1) {
      // GET DIFFERENCE IN HOURS
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      // CHECK IF DIFFERENCE IS LESS THAN 1 HOUR
      if (diffHours < 1) return "Just now";
      // RETURN HOURS AGO
      return `${diffHours}h ago`;
    }
    // CHECK IF DIFFERENCE IS LESS THAN 1 WEEK
    if (diffDays < 7) return `${diffDays}d ago`;
    // CHECK IF DIFFERENCE IS LESS THAN 1 MONTH
    if (diffDays < 30) {
      // GET WEEKS
      const weeks = Math.floor(diffDays / 7);
      // RETURN WEEKS AGO
      return `${weeks}w ago`;
    }
    // RETURN FORMATTED DATE
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };
  // LANGUAGE COLORS MAP
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
  };
  // GET LANGUAGE COLOR
  const getLanguageColor = (language: string | null): string => {
    // CHECK IF LANGUAGE IS NULL
    if (!language) return "#6b7280";
    // RETURN LANGUAGE COLOR
    return languageColors[language] || "#6b7280";
  };
  // GET OWNER AND REPO NAME
  const [owner, repoName] = repo.fullName.split("/");
  // RETURN REPOSITORY CARD
  return (
    <div
      onClick={onClick}
      className="group p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] hover:border-[var(--accent-color)] transition-all duration-200 hover:shadow-md cursor-pointer"
    >
      {/* REPOSITORY HEADER */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition truncate"
            >
              {repo.name}
            </a>
            {repo.private ? (
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
          </div>
          <p className="text-xs text-[var(--light-text)] truncate">
            {repo.fullName}
          </p>
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          {/* STAR BUTTON */}
          {showStarButton && <StarButton owner={owner} repo={repoName} />}
          {/* EXTERNAL LINK */}
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
      {/* REPOSITORY DESCRIPTION */}
      <p className="text-sm text-[var(--light-text)] line-clamp-2 mb-3 min-h-[40px]">
        {repo.description || "No description provided"}
      </p>
      {/* REPOSITORY STATS */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--light-text)]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            ></span>
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={14} />
          {(repo.stars ?? 0).toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={14} />
          {(repo.forks ?? 0).toLocaleString()}
        </span>
        {repo.fork && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-[var(--inside-card-bg)] text-[var(--light-text)]">
            <GitFork size={10} />
            Fork
          </span>
        )}
      </div>
      {/* REPOSITORY FOOTER */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--light-text)]">
        <span className="flex items-center gap-1">
          <Code size={12} />
          {repo.defaultBranch || "main"}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Updated {formatDate(repo.updatedAt)}
        </span>
      </div>
    </div>
  );
};

// <== STATS SKELETON COMPONENT ==>
const StatsSkeleton = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="h-3 bg-[var(--light-text)]/10 rounded w-16 mb-2" />
              <div className="h-7 bg-[var(--light-text)]/10 rounded w-12" />
            </div>
            <div className="w-10 h-10 bg-[var(--light-text)]/10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

// <== ACTIVITY SKELETON COMPONENT ==>
const ActivitySkeleton = (): JSX.Element => {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
          <div className="w-8 h-8 bg-[var(--light-text)]/10 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-1.5" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-full mb-1.5" />
            <div className="flex items-center gap-2">
              <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
              <div className="h-3 bg-[var(--light-text)]/10 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// <== GITHUB PAGE COMPONENT ==>
const GitHubPage = (): JSX.Element => {
  const navigate = useNavigate();
  useTitle("PlanOra - GitHub");
  // GITHUB STATUS HOOK
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // GITHUB PROFILE HOOK
  const { profile, isLoading: isProfileLoading } = useGitHubProfile(
    status?.isConnected ?? false
  );
  // DASHBOARD STATS HOOK
  const {
    stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useDashboardStats(status?.isConnected ?? false);
  // DASHBOARD ACTIVITY HOOK
  const {
    activity,
    isLoading: isActivityLoading,
    refetch: refetchActivity,
  } = useDashboardActivity(15, status?.isConnected ?? false);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<TabType>("all");
  // PAGINATION STATE
  const [page, setPage] = useState<number>(1);
  // STARRED PAGE STATE
  const [starredPage, setStarredPage] = useState<number>(1);
  // FILTER STATES
  const [type, setType] = useState<string>("all");
  // SORT STATE
  const [sort, setSort] = useState<string>("updated");
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  // CREATE REPOSITORY MODAL STATE
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  // SHOW ACTIVITY STATE (FOR MOBILE)
  const [showActivity, setShowActivity] = useState<boolean>(false);
  // PER PAGE
  const perPage = 12;
  // GITHUB REPOSITORIES HOOK
  const {
    repositories,
    pagination,
    isLoading: isReposLoading,
    refetchRepositories,
  } = useGitHubRepositories(
    page,
    perPage,
    type,
    sort,
    status?.isConnected ?? false
  );
  // STARRED REPOSITORIES HOOK
  const {
    repositories: starredRepositories,
    pagination: starredPagination,
    isLoading: isStarredLoading,
    refetch: refetchStarred,
  } = useStarredRepositories(
    starredPage,
    perPage,
    "created",
    "desc",
    (status?.isConnected ?? false) && activeTab === "starred"
  );
  // PINNED REPOSITORIES HOOK (FETCHES FROM GITHUB GRAPHQL)
  const {
    repositories: pinnedRepositories,
    isLoading: isPinnedLoading,
    refetch: refetchPinned,
  } = usePinnedRepositories(
    (status?.isConnected ?? false) && activeTab === "pinned"
  );
  // FILTERED REPOSITORIES
  const filteredRepositories = useMemo(() => {
    // CHECK IF SEARCH QUERY IS EMPTY
    if (!searchQuery.trim()) return repositories;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER REPOSITORIES BY QUERY
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);
  // FILTERED STARRED REPOSITORIES
  const filteredStarredRepositories = useMemo(() => {
    // CHECK IF SEARCH QUERY IS EMPTY
    if (!searchQuery.trim()) return starredRepositories;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER STARRED REPOSITORIES BY QUERY
    return starredRepositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [starredRepositories, searchQuery]);
  // FILTERED PINNED REPOSITORIES (FROM GITHUB)
  const filteredPinnedRepositories = useMemo(() => {
    // CHECK IF SEARCH QUERY IS EMPTY
    if (!searchQuery.trim()) return pinnedRepositories;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER PINNED REPOSITORIES BY QUERY
    return pinnedRepositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [pinnedRepositories, searchQuery]);
  // HANDLE PAGE CHANGE
  const handlePageChange = (newPage: number): void => {
    // CHECK IF ACTIVE TAB IS ALL
    if (activeTab === "all") {
      setPage(newPage);
    } else {
      // SET STARRED PAGE
      setStarredPage(newPage);
    }
    // SCROLL TO TOP
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // HANDLE REFRESH ALL
  const handleRefreshAll = () => {
    // REFRESH STATS
    refetchStats();
    // REFRESH ACTIVITY
    refetchActivity();
    // REFRESH REPOSITORIES
    refetchRepositories();
    // CHECK IF ACTIVE TAB IS STARRED
    if (activeTab === "starred") {
      // REFRESH STARRED REPOSITORIES
      refetchStarred();
    }
    // CHECK IF ACTIVE TAB IS PINNED
    if (activeTab === "pinned") {
      // REFRESH PINNED REPOSITORIES
      refetchPinned();
    }
  };
  // HANDLE TAB CHANGE
  const handleTabChange = (tab: TabType) => {
    // SET ACTIVE TAB
    setActiveTab(tab);
    // SET SEARCH QUERY TO EMPTY
    setSearchQuery("");
  };
  // GET CURRENT REPOSITORIES BASED ON TAB
  const getCurrentRepositories = () => {
    // CHECK IF ACTIVE TAB IS STARRED
    switch (activeTab) {
      case "starred":
        // RETURN FILTERED STARRED REPOSITORIES
        return filteredStarredRepositories;
      // CHECK IF ACTIVE TAB IS PINNED
      case "pinned":
        // RETURN FILTERED PINNED REPOSITORIES
        return filteredPinnedRepositories;
      // DEFAULT
      default:
        // RETURN FILTERED REPOSITORIES
        return filteredRepositories;
    }
  };
  // GET CURRENT LOADING STATE
  const isCurrentLoading =
    activeTab === "starred"
      ? isStarredLoading
      : activeTab === "pinned"
      ? isPinnedLoading
      : isReposLoading;
  // GET CURRENT PAGINATION
  const currentPagination =
    activeTab === "starred" ? starredPagination : pagination;
  const currentPage = activeTab === "starred" ? starredPage : page;
  // IF LOADING STATUS, SHOW SKELETON
  if (isStatusLoading) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <DashboardHeader
          title="GitHub"
          subtitle="Your GitHub command center"
          showSearch={false}
        />
        <div className="m-4 space-y-4">
          <StatsSkeleton />
          <GitHubSkeleton />
        </div>
      </div>
    );
  }
  // IF NOT CONNECTED, SHOW CONNECT PROMPT
  if (!status?.isConnected) {
    return (
      <div
        className="min-h-screen pb-0.5"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <DashboardHeader
          title="GitHub"
          subtitle="Your GitHub command center"
          showSearch={false}
        />
        <div className="m-4 flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-6">
            <Github size={40} className="text-[var(--light-text)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Connect Your GitHub Account
          </h2>
          <p className="text-[var(--light-text)] text-center max-w-md mb-6">
            Link your GitHub account to browse repositories, track activity, and
            manage your projects with AI-powered insights.
          </p>
          <Link
            to="/settings?tab=Integrations"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition text-white cursor-pointer"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <Link2 size={18} />
            Connect GitHub in Settings
          </Link>
        </div>
      </div>
    );
  }
  // RETURN GITHUB HUB PAGE
  return (
    <div
      className="min-h-screen pb-0.5"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="GitHub"
        subtitle="Your GitHub command center"
        showSearch={false}
      />
      {/* CONTENT CONTAINER */}
      <div className="m-4 space-y-4">
        {/* PROFILE & ACTIONS SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)]">
          {/* PROFILE INFO */}
          {isProfileLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-[var(--inside-card-bg)] rounded-full"></div>
              <div>
                <div className="h-5 w-32 bg-[var(--inside-card-bg)] rounded-md mb-2"></div>
                <div className="h-4 w-48 bg-[var(--inside-card-bg)] rounded-md"></div>
              </div>
            </div>
          ) : profile ? (
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.login}
                className="w-12 h-12 rounded-full border-2 border-[var(--border)]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--text-primary)]">
                    @{profile.login}
                  </p>
                  <a
                    href={profile.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--light-text)]">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {profile.followers} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {profile.following} following
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Repo</span>
            </button>
            <button
              onClick={handleRefreshAll}
              disabled={isReposLoading || isStatsLoading}
              className="p-2 text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer disabled:opacity-50"
              title="Refresh all data"
            >
              <RefreshCw
                size={18}
                className={
                  isReposLoading || isStatsLoading ? "animate-spin" : ""
                }
              />
            </button>
          </div>
        </div>
        {/* STATS CARDS */}
        {isStatsLoading ? (
          <StatsSkeleton />
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={FolderGit2}
              label="Repositories"
              value={stats.repositories.total}
              subValue={`${stats.repositories.public} public · ${stats.repositories.private} private`}
              color="accent"
            />
            <StatCard
              icon={GitPullRequest}
              label="Open PRs"
              value={stats.pullRequests.open}
              subValue={`${stats.pullRequests.pendingReviews} pending reviews`}
              color="purple"
            />
            <StatCard
              icon={CircleDot}
              label="Open Issues"
              value={stats.issues.open}
              subValue={`${stats.issues.assigned} assigned to you`}
              color="yellow"
            />
            <StatCard
              icon={Star}
              label="Total Stars"
              value={stats.stars}
              subValue={`${stats.forks} total forks`}
              color="green"
            />
          </div>
        ) : null}
        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* REPOSITORIES SECTION */}
          <div className="lg:col-span-3 space-y-4">
            {/* TABS */}
            <div className="flex items-center gap-1 p-1.5 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
              <button
                onClick={() => handleTabChange("all")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[var(--accent-color)] text-white shadow-sm"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <FolderGit2 size={16} />
                  All Repos
                </span>
              </button>
              <button
                onClick={() => handleTabChange("starred")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "starred"
                    ? "bg-[var(--accent-color)] text-white shadow-sm"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Star size={16} />
                  Starred
                </span>
              </button>
              <button
                onClick={() => handleTabChange("pinned")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "pinned"
                    ? "bg-[var(--accent-color)] text-white shadow-sm"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Pin size={16} />
                  Pinned
                </span>
              </button>
            </div>
            {/* FILTERS AND SEARCH */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
              {/* SEARCH INPUT */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--accent-color)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${
                    activeTab === "starred"
                      ? "starred "
                      : activeTab === "pinned"
                      ? "pinned "
                      : ""
                  }repositories...`}
                  className="border border-[var(--border)] pl-10 pr-3 py-2 rounded-lg w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-transparent text-[var(--text-primary)]"
                />
              </div>
              {/* FILTERS (ONLY FOR ALL TAB) */}
              {activeTab === "all" && (
                <div className="flex items-center gap-2">
                  <FilterDropdown
                    value={type}
                    options={typeFilterOptions}
                    onChange={(value) => {
                      setType(value);
                      setPage(1);
                    }}
                    icon={Filter}
                  />
                  <FilterDropdown
                    value={sort}
                    options={sortOptions}
                    onChange={(value) => {
                      setSort(value);
                      setPage(1);
                    }}
                    icon={SortDesc}
                  />
                </div>
              )}
            </div>
            {/* REPOSITORIES GRID */}
            {isCurrentLoading ? (
              <GitHubSkeleton />
            ) : getCurrentRepositories().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
                <div className="w-16 h-16 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-4">
                  {activeTab === "starred" ? (
                    <Star size={32} className="text-[var(--light-text)]" />
                  ) : activeTab === "pinned" ? (
                    <Pin size={32} className="text-[var(--light-text)]" />
                  ) : (
                    <AlertCircle
                      size={32}
                      className="text-[var(--light-text)]"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {activeTab === "starred"
                    ? "No starred repositories"
                    : activeTab === "pinned"
                    ? "No pinned repositories"
                    : "No repositories found"}
                </h3>
                <p className="text-[var(--light-text)] text-center max-w-md">
                  {searchQuery
                    ? "Try adjusting your search query."
                    : activeTab === "starred"
                    ? "Star repositories to see them here."
                    : activeTab === "pinned"
                    ? "Pin repositories for quick access."
                    : "You don't have any repositories matching the current filters."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentRepositories().map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    onClick={() => navigate(`/github/${repo.fullName}`)}
                    showStarButton={activeTab !== "starred"}
                  />
                ))}
              </div>
            )}
            {/* PAGINATION (NOT FOR PINNED TAB) */}
            {activeTab !== "pinned" && currentPagination && !searchQuery && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
                <p className="text-xs sm:text-sm text-[var(--light-text)]">
                  Page {currentPage}
                  {currentPagination.hasMore && " · More available"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium text-[var(--text-primary)]">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!currentPagination.hasMore}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* ACTIVITY SIDEBAR */}
          <div className="lg:col-span-1">
            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setShowActivity(!showActivity)}
              className="lg:hidden w-full flex items-center justify-between p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] mb-4"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <Activity size={16} className="text-[var(--accent-color)]" />
                Recent Activity
              </span>
              <ChevronDown
                size={16}
                className={`text-[var(--light-text)] transition ${
                  showActivity ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* ACTIVITY PANEL */}
            <div
              className={`${
                showActivity ? "block" : "hidden"
              } lg:block bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] overflow-hidden`}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Zap size={16} className="text-[var(--accent-color)]" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => refetchActivity()}
                  disabled={isActivityLoading}
                  className="p-1 text-[var(--light-text)] hover:text-[var(--accent-color)] transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={isActivityLoading ? "animate-spin" : ""}
                  />
                </button>
              </div>
              {/* ACTIVITY LIST */}
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {isActivityLoading ? (
                  <ActivitySkeleton />
                ) : activity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity
                      size={32}
                      className="mx-auto text-[var(--light-text)] mb-2"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {activity.map((item) => (
                      <ActivityItem key={item.id} activity={item} />
                    ))}
                  </div>
                )}
              </div>
              {/* VIEW ALL LINK */}
              {activity.length > 0 && (
                <div className="p-3 border-t border-[var(--border)]">
                  <a
                    href={`https://github.com/${profile?.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 text-xs text-[var(--accent-color)] hover:underline"
                  >
                    View all on GitHub
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
            {/* TOP LANGUAGES */}
            {stats?.topLanguages && stats.topLanguages.length > 0 && (
              <div className="mt-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                  <TrendingUp
                    size={16}
                    className="text-[var(--accent-color)]"
                  />
                  Top Languages
                </h3>
                <div className="space-y-2">
                  {stats.topLanguages.map((lang) => (
                    <div
                      key={lang.language}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-[var(--text-primary)]">
                        {lang.language}
                      </span>
                      <span className="text-xs text-[var(--light-text)]">
                        {lang.count} repos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CREATE REPOSITORY MODAL */}
      <CreateRepositoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          refetchRepositories();
          refetchStats();
        }}
      />
    </div>
  );
};

export default GitHubPage;
