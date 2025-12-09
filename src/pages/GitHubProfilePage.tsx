// <== IMPORTS ==>
import {
  Github,
  MapPin,
  Mail,
  Link2,
  Building2,
  Calendar,
  Users,
  Star,
  Eye,
  BookOpen,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Flame,
  Trophy,
  TrendingUp,
  GitCommit,
  GitPullRequest,
  CircleDot,
  Code,
  Lock,
  Loader2,
  ArrowLeft,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Globe,
} from "lucide-react";
import {
  useGitHubStatus,
  useExtendedProfile,
  useContributionStats,
  useProfileReadme,
  useContributionActivity,
  usePinnedRepositories,
  ContributionDay,
  ContributionStats,
  TopContributionRepository,
  PinnedRepository,
} from "../hooks/useGitHub";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import useTitle from "../hooks/useTitle";
import ReactMarkdown from "react-markdown";
import { format, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, JSX } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== CONTRIBUTION LEVEL COLORS ==>
const getContributionColor = (
  level: ContributionDay["level"],
  isDark: boolean
): string => {
  // RETURN CONTRIBUTION COLOR
  switch (level) {
    // NONE
    case "NONE":
      return isDark ? "rgba(255, 255, 255, 0.06)" : "#ebedf0";
    // FIRST QUARTILE
    case "FIRST_QUARTILE":
      return isDark ? "#0e4429" : "#9be9a8";
    // SECOND QUARTILE
    case "SECOND_QUARTILE":
      return isDark ? "#006d32" : "#40c463";
    // THIRD QUARTILE
    case "THIRD_QUARTILE":
      return isDark ? "#26a641" : "#30a14e";
    // FOURTH QUARTILE
    case "FOURTH_QUARTILE":
      return isDark ? "#39d353" : "#216e39";
    // DEFAULT
    default:
      return isDark ? "rgba(255, 255, 255, 0.06)" : "#ebedf0";
  }
};

// <== SOCIAL ICON COMPONENT ==>
const SocialIcon = ({ provider }: { provider: string }): JSX.Element => {
  // ICON CLASS
  const iconClass = "w-4 h-4";
  // RETURN SOCIAL ICON
  switch (provider.toUpperCase()) {
    // TWITTER
    case "TWITTER":
      return <Twitter className={iconClass} />;
    // LINKEDIN
    case "LINKEDIN":
      return <Linkedin className={iconClass} />;
    // FACEBOOK
    case "FACEBOOK":
      return <Facebook className={iconClass} />;
    // INSTAGRAM
    case "INSTAGRAM":
      return <Instagram className={iconClass} />;
    // DEFAULT
    default:
      return <Globe className={iconClass} />;
  }
};

// <== CONTRIBUTION GRAPH COMPONENT ==>
const ContributionGraph = ({
  stats,
  isLoading,
}: {
  stats: ContributionStats | undefined;
  isLoading: boolean;
}): JSX.Element => {
  // STATE FOR TOOLTIP
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    date: string;
    count: number;
  } | null>(null);
  // GET DARK MODE
  const isDark = document.documentElement.classList.contains("dark");
  // CELL SIZE
  const cellSize = 11;
  // CELL GAP
  const cellGap = 3;
  // RENDER LOADING SKELETON
  if (isLoading || !stats) {
    return (
      <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
        {/* HEADER SKELETON */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          <div className="h-8 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
        {/* GRAPH SKELETON */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1">
            {Array.from({ length: 53 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="w-[11px] h-[11px] rounded-sm bg-[var(--inside-card-bg)] animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RENDER CONTRIBUTION GRAPH
  return (
    <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {stats.calendar.totalContributions} contributions in the last year
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span>Less</span>
          <div className="flex gap-1">
            {(
              [
                "NONE",
                "FIRST_QUARTILE",
                "SECOND_QUARTILE",
                "THIRD_QUARTILE",
                "FOURTH_QUARTILE",
              ] as const
            ).map((level) => (
              <div
                key={level}
                className="w-[10px] h-[10px] rounded-sm"
                style={{ backgroundColor: getContributionColor(level, isDark) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      {/* MONTHS LABELS */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit">
          {/* MONTHS */}
          <div className="flex mb-2 ml-[28px]">
            {stats.calendar.months.map((month, index) => (
              <div
                key={index}
                className="text-xs text-[var(--text-secondary)]"
                style={{
                  width: `${month.totalWeeks * (cellSize + cellGap)}px`,
                }}
              >
                {month.name.slice(0, 3)}
              </div>
            ))}
          </div>
          {/* GRAPH */}
          <div className="flex">
            {/* WEEKDAY LABELS */}
            <div className="flex flex-col justify-between mr-2 py-[2px]">
              {["Mon", "", "Wed", "", "Fri", "", ""].map((day, index) => (
                <span
                  key={index}
                  className="text-xs text-[var(--text-secondary)] h-[11px] leading-[11px]"
                >
                  {day}
                </span>
              ))}
            </div>
            {/* WEEKS */}
            <div className="flex gap-[3px] relative">
              {stats.calendar.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="rounded-sm cursor-pointer transition-transform hover:scale-110"
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: getContributionColor(
                          day.level,
                          isDark
                        ),
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          show: true,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          date: day.date,
                          count: day.count,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
              {/* TOOLTIP */}
              {tooltip?.show && (
                <div
                  className="fixed z-50 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded shadow-lg text-xs text-[var(--text-primary)] pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <strong>
                    {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}
                  </strong>{" "}
                  on {format(parseISO(tooltip.date), "MMM d, yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  color,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  subValue?: string;
  color: string;
  isLoading: boolean;
}): JSX.Element => {
  // RENDER LOADING STATE
  if (isLoading) {
    return (
      <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-5 border border-[var(--border)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--inside-card-bg)] animate-pulse mb-3" />
          <div className="h-8 w-16 bg-[var(--inside-card-bg)] rounded animate-pulse mb-1" />
          <div className="h-4 w-20 bg-[var(--inside-card-bg)] rounded animate-pulse" />
        </div>
      </div>
    );
  }
  // RENDER STAT CARD
  return (
    <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-5 border border-[var(--border)] hover:border-[var(--accent-color)] transition-colors">
      <div className="flex flex-col items-center text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {value}
        </span>
        <span className="text-sm text-[var(--text-secondary)] mt-1">
          {label}
        </span>
        {subValue && (
          <span className="text-xs text-[var(--text-secondary)] mt-0.5">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

// <== ACTIVITY ITEM COMPONENT ==>
const ActivityItem = ({
  icon: Icon,
  title,
  count,
  repos,
  color,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
  repos: {
    name: string;
    fullName: string;
    count: number;
    isPrivate: boolean;
  }[];
  color: string;
}): JSX.Element => {
  // STATE FOR EXPANDED
  const [isExpanded, setIsExpanded] = useState(false);
  // IF NO REPOS
  if (count === 0) return <></>;
  // RENDER ACTIVITY ITEM
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      {/* HEADER */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {title}
            </span>
            <span className="text-xs text-[var(--text-secondary)] ml-2">
              {count} total in {repos.length}{" "}
              {repos.length === 1 ? "repo" : "repos"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="p-3 space-y-2 bg-[var(--cards-bg)]">
          {repos.map((repo, index) => (
            <Link
              key={index}
              to={`/github/${repo.fullName}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--inside-card-bg)] transition-colors"
            >
              <div className="flex items-center gap-2">
                {repo.isPrivate ? (
                  <Lock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                )}
                <span className="text-sm text-[var(--accent-color)] hover:underline">
                  {repo.fullName}
                </span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">
                {repo.count}{" "}
                {title.toLowerCase().includes("commit") ? "commits" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// <== TOP REPO CARD COMPONENT ==>
const TopRepoCard = ({
  repo,
}: {
  repo: TopContributionRepository;
}): JSX.Element => {
  // RENDER TOP REPO CARD
  return (
    <Link
      to={`/github/${repo.fullName}`}
      className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        {repo.isPrivate ? (
          <Lock className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
        ) : (
          <BookOpen className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
        )}
        <div className="min-w-0">
          <span className="text-sm font-medium text-[var(--accent-color)] truncate block">
            {repo.name}
          </span>
          {repo.language && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: repo.language.color || "#8b949e" }}
              />
              <span className="text-xs text-[var(--text-secondary)]">
                {repo.language.name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <GitCommit className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {repo.commits}
        </span>
      </div>
    </Link>
  );
};

// <== PINNED REPO CARD COMPONENT ==>
const PinnedRepoCard = ({ repo }: { repo: PinnedRepository }): JSX.Element => {
  // RENDER PINNED REPO CARD
  return (
    <Link
      to={`/github/${repo.fullName}`}
      className="block p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition-colors"
    >
      <div className="flex items-start gap-2 mb-2">
        {repo.private ? (
          <Lock className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
        ) : (
          <BookOpen className="w-4 h-4 text-[var(--accent-color)] flex-shrink-0 mt-0.5" />
        )}
        <span className="text-sm font-semibold text-[var(--accent-color)] truncate">
          {repo.name}
        </span>
      </div>
      {repo.description && (
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
          {repo.description}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: repo.languageColor || "#8b949e" }}
            />
            <span>{repo.language}</span>
          </div>
        )}
        {repo.stars > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            <span>{repo.stars}</span>
          </div>
        )}
        {repo.forks > 0 && (
          <div className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <span>{repo.forks}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

// <== PROFILE SKELETON COMPONENT ==>
const ProfileSkeleton = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="Profile"
        subtitle="Loading your GitHub profile..."
        showSearch={false}
      />
      {/* CONTENT */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* BACK BUTTON */}
          <div className="h-9 w-32 bg-[var(--cards-bg)] rounded-lg animate-pulse mb-6" />
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3 space-y-6">
              {/* AVATAR */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-48 h-48 rounded-full bg-[var(--cards-bg)] animate-pulse border-4 border-[var(--border)]" />
                <div className="mt-4 space-y-2 w-full">
                  <div className="h-7 w-40 bg-[var(--cards-bg)] rounded animate-pulse mx-auto lg:mx-0" />
                  <div className="h-5 w-28 bg-[var(--cards-bg)] rounded animate-pulse mx-auto lg:mx-0" />
                </div>
              </div>
              {/* BIO */}
              <div className="h-16 bg-[var(--cards-bg)] rounded-lg animate-pulse" />
              {/* DETAILS */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-5 bg-[var(--cards-bg)] rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            {/* MAIN CONTENT */}
            <div className="lg:col-span-9 space-y-6">
              {/* STATS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-[var(--cards-bg)] rounded-xl animate-pulse"
                  />
                ))}
              </div>
              {/* CONTRIBUTION GRAPH */}
              <div className="h-48 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
              {/* PINNED */}
              <div className="h-40 bg-[var(--cards-bg)] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// <== GITHUB PROFILE PAGE COMPONENT ==>
const GitHubProfilePage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("GitHub Profile - PlanOra");
  // NAVIGATION
  const navigate = useNavigate();
  // STATE FOR SELECTED YEAR
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  // STATE FOR YEAR DROPDOWN
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  // YEAR DROPDOWN REF
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  // FETCH GITHUB STATUS
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // FETCH EXTENDED PROFILE
  const {
    profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useExtendedProfile(status?.isConnected ?? false);
  // FETCH CONTRIBUTION STATS
  const {
    stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useContributionStats(selectedYear, status?.isConnected ?? false);
  // FETCH PROFILE README
  const { readme, isLoading: isReadmeLoading } = useProfileReadme(
    status?.isConnected ?? false
  );
  // FETCH CONTRIBUTION ACTIVITY
  const {
    activity,
    isLoading: isActivityLoading,
    refetch: refetchActivity,
  } = useContributionActivity(
    selectedYear ? { year: selectedYear } : undefined,
    status?.isConnected ?? false
  );
  // FETCH PINNED REPOSITORIES
  const { repositories: pinnedRepos, isLoading: isPinnedLoading } =
    usePinnedRepositories(status?.isConnected ?? false);
  // HANDLE YEAR CHANGE
  const handleYearChange = (year: number | undefined) => {
    // SET SELECTED YEAR
    setSelectedYear(year);
    // CLOSE YEAR DROPDOWN
    setYearDropdownOpen(false);
  };
  // CLOSE YEAR DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE YEAR DROPDOWN
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE YEAR DROPDOWN
        setYearDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // HANDLE REFRESH ALL
  const handleRefreshAll = () => {
    // REFRESH PROFILE
    refetchProfile();
    // REFRESH STATS
    refetchStats();
    // REFRESH ACTIVITY
    refetchActivity();
  };
  // IS LOADING
  const isLoading = isStatusLoading || isProfileLoading;
  // IF NOT CONNECTED
  if (!isStatusLoading && !status?.isConnected) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="GitHub Profile"
          subtitle="View your GitHub profile"
          showSearch={false}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[var(--cards-bg)] rounded-xl p-8 border border-[var(--border)] text-center">
              <Github className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Connect GitHub to View Profile
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Link your GitHub account to see your profile, contributions, and
                activity.
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition"
              >
                <Github className="w-4 h-4" />
                Connect GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // IF LOADING
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  // RENDER PROFILE PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="GitHub Profile"
        subtitle={profile?.login ? `@${profile.login}` : "Your GitHub Profile"}
        showSearch={false}
      />
      {/* CONTENT */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* TOOLBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* BACK BUTTON */}
            <button
              onClick={() => navigate("/github")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--cards-bg)] rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to GitHub
            </button>
            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {/* YEAR SELECTOR */}
              <div ref={yearDropdownRef} className="relative">
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>{selectedYear || "Last Year"}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      yearDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {yearDropdownOpen && stats?.availableYears && (
                  <div className="absolute top-full right-0 mt-1 min-w-[140px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                    <button
                      onClick={() => handleYearChange(undefined)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                        !selectedYear
                          ? "text-[var(--accent-color)] bg-[var(--inside-card-bg)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      Last Year
                    </button>
                    {stats.availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                          selectedYear === year
                            ? "text-[var(--accent-color)] bg-[var(--inside-card-bg)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* REFRESH BUTTON */}
              <button
                onClick={handleRefreshAll}
                disabled={isStatsLoading || isActivityLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
              >
                {isStatsLoading || isActivityLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {/* VIEW ON GITHUB */}
              <a
                href={profile?.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View on GitHub</span>
              </a>
            </div>
          </div>
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDEBAR - PROFILE INFO */}
            <div className="lg:col-span-3 space-y-6">
              {/* AVATAR & NAME */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <img
                    src={profile?.avatarUrl}
                    alt={profile?.login}
                    className="w-48 h-48 rounded-full border-4 border-[var(--border)] shadow-lg"
                  />
                  {profile?.status && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-[var(--bg)] rounded-full border-2 border-[var(--border)] flex items-center justify-center text-lg">
                      {profile.status.emoji || "😀"}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center lg:text-left">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {profile?.name || profile?.login}
                  </h1>
                  <p className="text-lg text-[var(--text-secondary)]">
                    @{profile?.login}
                    {profile?.pronouns && (
                      <span className="ml-2 text-sm">({profile.pronouns})</span>
                    )}
                  </p>
                </div>
              </div>
              {/* STATUS */}
              {profile?.status?.message && (
                <div className="p-3 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{profile.status.emoji}</span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {profile.status.message}
                    </span>
                    {profile.status.busy && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                        Busy
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* BIO */}
              {profile?.bio && (
                <p className="text-sm text-[var(--text-secondary)] text-center lg:text-left">
                  {profile.bio}
                </p>
              )}
              {/* FOLLOWERS/FOLLOWING */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="font-semibold text-[var(--text-primary)]">
                    {profile?.followers}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    followers
                  </span>
                </div>
                <span className="text-[var(--text-secondary)]">·</span>
                <div className="text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {profile?.following}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {" "}
                    following
                  </span>
                </div>
              </div>
              {/* DETAILS */}
              <div className="space-y-3">
                {profile?.company && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0 text-[var(--text-secondary)]" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-[var(--accent-color)] hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.websiteUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="w-4 h-4 flex-shrink-0 text-[var(--text-secondary)]" />
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-color)] hover:underline truncate"
                    >
                      {profile.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {profile?.twitterUsername && (
                  <div className="flex items-center gap-2 text-sm">
                    <Twitter className="w-4 h-4 flex-shrink-0 text-[var(--text-secondary)]" />
                    <a
                      href={`https://twitter.com/${profile.twitterUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-color)] hover:underline"
                    >
                      @{profile.twitterUsername}
                    </a>
                  </div>
                )}
                {profile?.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Joined {format(parseISO(profile.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
              {/* SOCIAL ACCOUNTS */}
              {profile?.socialAccounts && profile.socialAccounts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Social Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.socialAccounts.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition"
                      >
                        <SocialIcon provider={social.provider} />
                        <span>{social.displayName || social.provider}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* REPO STATS */}
              <div className="p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  Repository Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" />
                    <div className="text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {profile?.publicRepos}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {" "}
                        public
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                    <div className="text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {profile?.privateRepos}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {" "}
                        private
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[var(--text-secondary)]" />
                    <div className="text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {profile?.starredRepos}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {" "}
                        starred
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                    <div className="text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {profile?.watching}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {" "}
                        watching
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* MAIN CONTENT */}
            <div className="lg:col-span-9 space-y-6">
              {/* STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  icon={TrendingUp}
                  label="Total Contributions"
                  value={stats?.totalContributions || 0}
                  color="#22c55e"
                  isLoading={isStatsLoading}
                />
                <StatCard
                  icon={Flame}
                  label="Current Streak"
                  value={stats?.streaks.current.count || 0}
                  subValue={
                    stats?.streaks.current.start
                      ? `${format(
                          parseISO(stats.streaks.current.start),
                          "MMM d"
                        )} - ${format(
                          parseISO(
                            stats.streaks.current.end ||
                              new Date().toISOString()
                          ),
                          "MMM d"
                        )}`
                      : undefined
                  }
                  color="#f97316"
                  isLoading={isStatsLoading}
                />
                <StatCard
                  icon={Trophy}
                  label="Longest Streak"
                  value={stats?.streaks.longest.count || 0}
                  subValue={
                    stats?.streaks.longest.start
                      ? `${format(
                          parseISO(stats.streaks.longest.start),
                          "MMM d"
                        )} - ${format(
                          parseISO(
                            stats.streaks.longest.end ||
                              new Date().toISOString()
                          ),
                          "MMM d"
                        )}`
                      : undefined
                  }
                  color="#8b5cf6"
                  isLoading={isStatsLoading}
                />
                <StatCard
                  icon={GitCommit}
                  label="Total Commits"
                  value={stats?.commits || 0}
                  color="#3b82f6"
                  isLoading={isStatsLoading}
                />
              </div>
              {/* CONTRIBUTION GRAPH */}
              <ContributionGraph stats={stats} isLoading={isStatsLoading} />
              {/* README */}
              {!isReadmeLoading && readme && (
                <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[var(--accent-color)]" />
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        {profile?.login}/{profile?.login}
                      </h3>
                    </div>
                    <a
                      href={readme.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="github-readme-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // CUSTOM HEADING STYLES - ALL SAME SIZE WITH DIVIDERS
                        h1: ({ children }) => (
                          <h3 className="text-base font-semibold text-[var(--text-primary)] pb-2 mb-3 mt-5 flex items-center gap-2 border-b border-[var(--border)]">
                            {children}
                          </h3>
                        ),
                        h2: ({ children }) => (
                          <h3 className="text-base font-semibold text-[var(--text-primary)] pb-2 mb-3 mt-5 flex items-center gap-2 border-b border-[var(--border)]">
                            {children}
                          </h3>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold text-[var(--text-primary)] pb-2 mb-3 mt-5 flex items-center gap-2 border-b border-[var(--border)]">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-base font-semibold text-[var(--text-primary)] pb-2 mb-3 mt-5 flex items-center gap-2 border-b border-[var(--border)]">
                            {children}
                          </h4>
                        ),
                        // PARAGRAPH
                        p: ({ children }) => (
                          <p className="text-[var(--text-secondary)] mb-4 leading-relaxed text-sm sm:text-base">
                            {children}
                          </p>
                        ),
                        // LINKS
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent-color)] hover:underline"
                          >
                            {children}
                          </a>
                        ),
                        // IMAGES - KEY FOR BADGES
                        img: ({ src, alt }) => (
                          <img
                            src={src}
                            alt={alt || ""}
                            className="inline-block align-middle h-auto max-h-8"
                            style={{ verticalAlign: "middle" }}
                          />
                        ),
                        // LISTS
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-4 text-[var(--text-secondary)] space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-4 text-[var(--text-secondary)] space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[var(--text-secondary)]">
                            {children}
                          </li>
                        ),
                        // CODE BLOCKS
                        code: ({ className, children }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="px-1.5 py-0.5 bg-[var(--inside-card-bg)] text-[var(--accent-color)] rounded text-sm font-mono">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className="block p-4 bg-[var(--inside-card-bg)] rounded-lg text-sm font-mono overflow-x-auto">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="mb-4 rounded-lg overflow-hidden">
                            {children}
                          </pre>
                        ),
                        // BLOCKQUOTE
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[var(--accent-color)] pl-4 py-1 my-4 text-[var(--text-secondary)] italic">
                            {children}
                          </blockquote>
                        ),
                        // HORIZONTAL RULE
                        hr: () => (
                          <hr className="my-6 border-[var(--border)]" />
                        ),
                        // TABLE
                        table: ({ children }) => (
                          <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-[var(--border)] rounded-lg">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-[var(--inside-card-bg)]">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border)]">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border)]">
                            {children}
                          </td>
                        ),
                        // STRONG/BOLD
                        strong: ({ children }) => (
                          <strong className="font-semibold text-[var(--text-primary)]">
                            {children}
                          </strong>
                        ),
                        // EMPHASIS/ITALIC
                        em: ({ children }) => (
                          <em className="italic text-[var(--text-secondary)]">
                            {children}
                          </em>
                        ),
                      }}
                    >
                      {readme.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              {/* PINNED REPOSITORIES */}
              {!isPinnedLoading && pinnedRepos && pinnedRepos.length > 0 && (
                <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                    Pinned Repositories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pinnedRepos.map((repo) => (
                      <PinnedRepoCard key={repo.fullName} repo={repo} />
                    ))}
                  </div>
                </div>
              )}
              {/* CONTRIBUTION BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TOP REPOSITORIES */}
                {!isStatsLoading &&
                  stats?.topRepositories &&
                  stats.topRepositories.length > 0 && (
                    <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                        Top Contributed Repositories
                      </h3>
                      <div className="space-y-2">
                        {stats.topRepositories
                          .slice(0, 5)
                          .map((repo, index) => (
                            <TopRepoCard key={index} repo={repo} />
                          ))}
                      </div>
                    </div>
                  )}
                {/* CONTRIBUTION STATS */}
                {!isStatsLoading && stats && (
                  <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                      Contribution Breakdown
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitCommit className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            Commits
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {stats.commits}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitPullRequest className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            Pull Requests
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {stats.pullRequests}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CircleDot className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            Issues
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {stats.issues}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-[var(--text-secondary)]">
                            Code Reviews
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {stats.pullRequestReviews}
                        </span>
                      </div>
                      {stats.privateContributions > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                            <span className="text-sm text-[var(--text-secondary)]">
                              Private Contributions
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {stats.privateContributions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* ACTIVITY BREAKDOWN */}
              {!isActivityLoading && activity && (
                <div className="bg-[var(--cards-bg)] rounded-xl p-4 sm:p-6 border border-[var(--border)]">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                    Contribution Activity
                  </h3>
                  <div className="space-y-3">
                    <ActivityItem
                      icon={GitCommit}
                      title="Created commits"
                      count={activity.commits.total}
                      repos={activity.commits.repositories}
                      color="#3b82f6"
                    />
                    <ActivityItem
                      icon={GitPullRequest}
                      title="Pull requests"
                      count={activity.pullRequests.total}
                      repos={activity.pullRequests.repositories}
                      color="#8b5cf6"
                    />
                    <ActivityItem
                      icon={CircleDot}
                      title="Issues opened"
                      count={activity.issues.total}
                      repos={activity.issues.repositories}
                      color="#22c55e"
                    />
                    <ActivityItem
                      icon={Eye}
                      title="Code reviews"
                      count={activity.reviews.total}
                      repos={activity.reviews.repositories}
                      color="#f97316"
                    />
                  </div>
                  {/* REPOSITORIES CREATED */}
                  {activity.repositoriesCreated.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                        Created {activity.repositoriesCreated.length}{" "}
                        {activity.repositoriesCreated.length === 1
                          ? "repository"
                          : "repositories"}
                      </h4>
                      <div className="space-y-2">
                        {activity.repositoriesCreated.map((repo, index) => (
                          <Link
                            key={index}
                            to={`/github/${repo.fullName}`}
                            className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {repo.isPrivate ? (
                                <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-[var(--accent-color)]" />
                              )}
                              <span className="text-sm font-medium text-[var(--accent-color)]">
                                {repo.fullName}
                              </span>
                              {repo.language && (
                                <div className="flex items-center gap-1 ml-2">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor:
                                        repo.language.color || "#8b949e",
                                    }}
                                  />
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    {repo.language.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-[var(--text-secondary)]">
                              {format(parseISO(repo.createdAt), "MMM d, yyyy")}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfilePage;
