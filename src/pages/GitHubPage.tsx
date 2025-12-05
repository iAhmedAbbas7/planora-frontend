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
} from "lucide-react";
import {
  useGitHubStatus,
  useGitHubProfile,
  useGitHubRepositories,
  GitHubRepository,
} from "../hooks/useGitHub";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import type { LucideIcon } from "lucide-react";
import { JSX, useState, useMemo, useRef, useEffect } from "react";
import GitHubSkeleton from "../components/skeletons/GitHubSkeleton";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== DROPDOWN OPTION TYPE ==>
type DropdownOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

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
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // DROPDOWN REF FOR OUTSIDE CLICK
  const dropdownRef = useRef<HTMLDivElement>(null);
  // CURRENT LABEL
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || options[0].label;
  // HANDLE OUTSIDE CLICK TO CLOSE DROPDOWN
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
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
  // RETURN DROPDOWN COMPONENT
  return (
    <div ref={dropdownRef} className="relative">
      {/* DROPDOWN TRIGGER */}
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
      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
          {options.map((option) => {
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

// <== REPOSITORY CARD COMPONENT ==>
const RepositoryCard = ({
  repo,
  onClick,
}: {
  repo: GitHubRepository;
  onClick: () => void;
}): JSX.Element => {
  // FORMAT DATE FUNCTION
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
        // RETURN JUST NOW
        return "Just now";
      }
      // RETURN HOURS AGO
      return `${diffHours}h ago`;
    }
    // IF LESS THAN 7 DAYS, RETURN DAYS
    if (diffDays < 7) {
      // RETURN DAYS AGO
      return `${diffDays}d ago`;
    }
    // IF LESS THAN 30 DAYS, RETURN WEEKS
    if (diffDays < 30) {
      // CALCULATE WEEKS DIFFERENCE
      const weeks = Math.floor(diffDays / 7);
      // RETURN WEEKS AGO
      return `${weeks}w ago`;
    }
    // OTHERWISE RETURN FORMATTED DATE
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
    // IF NO LANGUAGE, RETURN GRAY
    if (!language) return "#6b7280";
    // RETURN LANGUAGE COLOR
    return languageColors[language] || "#6b7280";
  };
  // RETURNING THE REPOSITORY CARD
  return (
    // REPOSITORY CARD CONTAINER
    <div
      onClick={onClick}
      className="group p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)] hover:border-[var(--accent-color)] transition-all duration-200 hover:shadow-md cursor-pointer"
    >
      {/* REPOSITORY HEADER */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          {/* REPOSITORY NAME */}
          <div className="flex items-center gap-2">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition truncate"
            >
              {repo.name}
            </a>
            {/* VISIBILITY BADGE */}
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
          {/* FULL NAME */}
          <p className="text-xs text-[var(--light-text)] truncate">
            {repo.fullName}
          </p>
        </div>
        {/* EXTERNAL LINK */}
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition opacity-0 group-hover:opacity-100"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      {/* REPOSITORY DESCRIPTION */}
      <p className="text-sm text-[var(--light-text)] line-clamp-2 mb-3 min-h-[40px]">
        {repo.description || "No description provided"}
      </p>
      {/* REPOSITORY STATS */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--light-text)]">
        {/* LANGUAGE */}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            ></span>
            {repo.language}
          </span>
        )}
        {/* STARS */}
        <span className="flex items-center gap-1">
          <Star size={14} />
          {(repo.stars ?? 0).toLocaleString()}
        </span>
        {/* FORKS */}
        <span className="flex items-center gap-1">
          <GitFork size={14} />
          {(repo.forks ?? 0).toLocaleString()}
        </span>
        {/* FORK BADGE */}
        {repo.fork && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-[var(--inside-card-bg)] text-[var(--light-text)]">
            <GitFork size={10} />
            Fork
          </span>
        )}
      </div>
      {/* REPOSITORY FOOTER */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--light-text)]">
        {/* DEFAULT BRANCH */}
        <span className="flex items-center gap-1">
          <Code size={12} />
          {repo.defaultBranch || "main"}
        </span>
        {/* LAST UPDATED */}
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Updated {formatDate(repo.updatedAt)}
        </span>
      </div>
    </div>
  );
};

// <== GITHUB PAGE COMPONENT ==>
const GitHubPage = (): JSX.Element => {
  // NAVIGATE HOOK
  const navigate = useNavigate();
  // SET PAGE TITLE
  useTitle("PlanOra - GitHub");
  // GITHUB STATUS HOOK
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // GITHUB PROFILE HOOK
  const { profile, isLoading: isProfileLoading } = useGitHubProfile(
    status?.isConnected ?? false
  );
  // PAGINATION STATE
  const [page, setPage] = useState<number>(1);
  // FILTER STATES
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<string>("updated");
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState<string>("");
  // PER PAGE
  const perPage = 18;
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
  // FILTERED REPOSITORIES
  const filteredRepositories = useMemo(() => {
    // IF NO SEARCH QUERY, RETURN ALL REPOSITORIES
    if (!searchQuery.trim()) return repositories;
    // FILTER BY SEARCH QUERY
    const query = searchQuery.toLowerCase();
    // FILTER REPOSITORIES
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);
  // HANDLE PAGE CHANGE
  const handlePageChange = (newPage: number): void => {
    // SET NEW PAGE
    setPage(newPage);
    // SCROLL TO TOP
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // IF LOADING, SHOW SKELETON
  if (isStatusLoading) {
    // SHOW SKELETON
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
          subtitle="Browse and manage your GitHub repositories"
          showSearch={false}
        />
        <GitHubSkeleton />
      </div>
    );
  }
  // IF NOT CONNECTED, SHOW CONNECT PROMPT
  if (!status?.isConnected) {
    // SHOW NOT CONNECTED STATE
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
          subtitle="Browse and manage your GitHub repositories"
          showSearch={false}
        />
        {/* NOT CONNECTED STATE */}
        <div className="m-4 flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-6">
            <Github size={40} className="text-[var(--light-text)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Connect Your GitHub Account
          </h2>
          <p className="text-[var(--light-text)] text-center max-w-md mb-6">
            Link your GitHub account to browse repositories, view commit
            history, and generate tasks with AI.
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
  // RETURNING THE GITHUB PAGE COMPONENT
  return (
    // GITHUB PAGE MAIN CONTAINER
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
        subtitle="Browse and manage your GitHub repositories"
        showSearch={false}
      />
      {/* CONTENT CONTAINER */}
      <div className="m-4 space-y-4">
        {/* PROFILE & FILTERS SECTION */}
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-[var(--cards-bg)] rounded-2xl border border-[var(--border)]">
          {/* TOP ROW - PROFILE AND REFRESH */}
          <div className="flex items-center justify-between gap-3">
            {/* PROFILE INFO */}
            {isProfileLoading ? (
              <div className="flex items-center gap-2 sm:gap-3 animate-pulse">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[var(--inside-card-bg)] rounded-full flex-shrink-0"></div>
                <div>
                  <div className="h-4 sm:h-5 w-24 sm:w-32 bg-[var(--inside-card-bg)] rounded-md mb-1.5 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 w-32 sm:w-48 bg-[var(--inside-card-bg)] rounded-md"></div>
                </div>
              </div>
            ) : profile ? (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.login}
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--border)] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)] truncate">
                      @{profile.login}
                    </p>
                    <a
                      href={profile.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition flex-shrink-0"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs text-[var(--light-text)]">
                    <span className="flex items-center gap-1">
                      <GitFork size={12} />
                      <span className="hidden xs:inline">
                        {profile.publicRepos} repositories
                      </span>
                      <span className="xs:hidden">
                        {profile.publicRepos} repos
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {profile.followers} followers
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {/* REFRESH BUTTON */}
            <button
              onClick={() => refetchRepositories()}
              disabled={isReposLoading}
              className="p-2 text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Refresh repositories"
            >
              <RefreshCw
                size={18}
                className={isReposLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
          {/* BOTTOM ROW - SEARCH AND FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* SEARCH INPUT */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--accent-color)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                className="border border-[var(--border)] pl-9 sm:pl-10 pr-3 py-2 rounded-xl w-full focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-transparent text-[var(--text-primary)]"
              />
            </div>
            {/* FILTERS */}
            <div className="flex items-center gap-2">
              {/* TYPE FILTER */}
              <FilterDropdown
                value={type}
                options={typeFilterOptions}
                onChange={(value) => {
                  setType(value);
                  setPage(1);
                }}
                icon={Filter}
              />
              {/* SORT FILTER */}
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
          </div>
        </div>
        {/* REPOSITORIES GRID */}
        {isReposLoading ? (
          <GitHubSkeleton />
        ) : filteredRepositories.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-[var(--light-text)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              No repositories found
            </h3>
            <p className="text-[var(--light-text)] text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search query or filters."
                : "You don't have any repositories matching the current filters."}
            </p>
          </div>
        ) : (
          // REPOSITORIES GRID
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                onClick={() => navigate(`/github/${repo.fullName}`)}
              />
            ))}
          </div>
        )}
        {/* PAGINATION */}
        {pagination && !searchQuery && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            {/* PAGINATION INFO */}
            <p className="text-xs sm:text-sm text-[var(--light-text)] text-center sm:text-left">
              Showing{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {(page - 1) * perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {Math.min(page * perPage, pagination.totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {pagination.totalCount}
              </span>{" "}
              <span className="hidden xs:inline">repositories</span>
              <span className="xs:hidden">repos</span>
            </p>
            {/* PAGINATION BUTTONS */}
            <div className="flex items-center gap-2">
              {/* PREVIOUS BUTTON */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              >
                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              {/* PAGE INDICATOR */}
              <span className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                Page {page}
              </span>
              {/* NEXT BUTTON */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubPage;
