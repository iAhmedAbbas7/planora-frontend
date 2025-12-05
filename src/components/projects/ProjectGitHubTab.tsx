// <== IMPORTS ==>
import {
  Github,
  Link2,
  Unlink,
  ExternalLink,
  GitCommit,
  CircleDot,
  GitPullRequest,
  Search,
  Star,
  GitFork,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  Code,
  X,
  Loader2,
} from "lucide-react";
import {
  useGitHubStatus,
  useGitHubRepositories,
  useRepositoryCommits,
  useRepositoryIssues,
  useRepositoryPullRequests,
  GitHubCommit,
  GitHubIssue,
  GitHubPullRequest,
  GitHubRepository,
} from "../../hooks/useGitHub";
import {
  useLinkGitHubRepo,
  useUnlinkGitHubRepo,
  GitHubRepoLink,
} from "../../hooks/useProjects";
import { Link } from "react-router-dom";
import { JSX, useState, useEffect, useCallback } from "react";

// <== PROPS TYPE INTERFACE ==>
type ProjectGitHubTabProps = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== GITHUB REPO ==>
  githubRepo?: GitHubRepoLink;
  // <== ON SHOW FULL SELECTOR ==>
  onShowFullSelector?: () => void;
};
// <== FULL DRAWER REPO SELECTOR PROPS ==>
type FullDrawerRepoSelectorProps = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== ON CLOSE ==>
  onClose: () => void;
};

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
};

// <== GET LANGUAGE COLOR ==>
const getLanguageColor = (language: string | null): string => {
  // IF NO LANGUAGE, RETURN GRAY
  if (!language) return "#6b7280";
  // IF LANGUAGE IS NOT IN LANGUAGE COLORS MAP, RETURN GRAY
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

// <== REPOSITORY CARD COMPONENT ==>
const RepositoryCard = ({
  repo,
  onSelect,
  isLinking,
}: {
  repo: GitHubRepository;
  onSelect: () => void;
  isLinking: boolean;
}): JSX.Element => (
  <div
    onClick={onSelect}
    className={`group p-3 sm:p-4 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] hover:border-[var(--accent-color)] transition-all duration-200 cursor-pointer ${
      isLinking ? "opacity-50 pointer-events-none" : ""
    }`}
  >
    {/* HEADER */}
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className="flex-1 min-w-0">
        {/* NAME & VISIBILITY */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm sm:text-base text-[var(--text-primary)] truncate">
            {repo.name}
          </span>
          {repo.private ? (
            <span
              className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
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
              className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
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
        <p className="text-[10px] sm:text-xs text-[var(--light-text)] truncate mt-0.5">
          {repo.fullName}
        </p>
      </div>
      {/* EXTERNAL LINK */}
      <a
        href={repo.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <ExternalLink size={14} />
      </a>
    </div>
    {/* DESCRIPTION */}
    <p className="text-xs sm:text-sm text-[var(--light-text)] line-clamp-2 mb-3 min-h-[36px] sm:min-h-[40px]">
      {repo.description || "No description provided"}
    </p>
    {/* STATS */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[var(--light-text)]">
      {/* LANGUAGE */}
      {repo.language && (
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ backgroundColor: getLanguageColor(repo.language) }}
          />
          {repo.language}
        </span>
      )}
      {/* STARS */}
      <span className="flex items-center gap-1">
        <Star size={12} />
        {(repo.stars ?? 0).toLocaleString()}
      </span>
      {/* FORKS */}
      <span className="flex items-center gap-1">
        <GitFork size={12} />
        {(repo.forks ?? 0).toLocaleString()}
      </span>
      {/* FORK BADGE */}
      {repo.fork && (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-[var(--inside-card-bg)] text-[var(--light-text)]">
          <GitFork size={10} />
          Fork
        </span>
      )}
    </div>
    {/* FOOTER */}
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] text-[10px] sm:text-xs text-[var(--light-text)]">
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

// <== REPOSITORY SELECTOR SKELETON ==>
const RepositorySelectorSkeleton = (): JSX.Element => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="p-3 sm:p-4 bg-[var(--cards-bg)] rounded-lg border border-[var(--border)] animate-pulse"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 sm:h-5 w-28 bg-[var(--inside-card-bg)] rounded" />
          <div className="h-4 sm:h-5 w-14 bg-[var(--inside-card-bg)] rounded-full" />
        </div>
        <div className="h-3 w-32 bg-[var(--inside-card-bg)] rounded mb-3" />
        <div className="h-3 sm:h-4 w-full bg-[var(--inside-card-bg)] rounded mb-1.5" />
        <div className="h-3 sm:h-4 w-2/3 bg-[var(--inside-card-bg)] rounded mb-3" />
        <div className="flex gap-3">
          <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded" />
          <div className="h-3 w-10 bg-[var(--inside-card-bg)] rounded" />
          <div className="h-3 w-10 bg-[var(--inside-card-bg)] rounded" />
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <div className="h-3 w-16 bg-[var(--inside-card-bg)] rounded" />
          <div className="h-3 w-24 bg-[var(--inside-card-bg)] rounded" />
        </div>
      </div>
    ))}
  </div>
);

// <== DEBOUNCE HOOK ==>
const useDebounce = <T,>(value: T, delay: number): T => {
  // DEBOUNCED VALUE STATE
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // USE EFFECT TO SET DEBOUNCED VALUE
  useEffect(() => {
    // SET DEBOUNCED VALUE HANDLER
    const handler = setTimeout(() => {
      // SET DEBOUNCED VALUE
      setDebouncedValue(value);
    }, delay);
    // CLEAR TIMEOUT ON UNMOUNT
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// <== FULL DRAWER REPOSITORY SELECTOR ==>
export const FullDrawerRepoSelector = ({
  projectId,
  onClose,
}: FullDrawerRepoSelectorProps): JSX.Element => {
  // SEARCH INPUT STATE
  const [searchInput, setSearchInput] = useState<string>("");
  // DEBOUNCED SEARCH QUERY
  const debouncedSearchQuery = useDebounce(searchInput, 400);
  // PAGINATION STATE
  const [page, setPage] = useState<number>(1);
  // PER PAGE LIMIT
  const perPage = 15;
  // GITHUB STATUS
  const { status } = useGitHubStatus();
  // LINK GITHUB REPO MUTATION
  const linkMutation = useLinkGitHubRepo();
  // RESET PAGE WHEN SEARCH QUERY CHANGES
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);
  // FETCH REPOSITORIES
  const { repositories, pagination, isLoading, isFetching } =
    useGitHubRepositories(
      page,
      perPage,
      "all",
      "updated",
      status?.isConnected ?? false,
      debouncedSearchQuery
    );
  // IS SEARCHING
  const isSearching =
    (searchInput.trim() !== debouncedSearchQuery &&
      searchInput.trim() !== "") ||
    (isFetching && debouncedSearchQuery.trim() !== "");
  // HAS PREVIOUS PAGE
  const hasPrevPage = page > 1;
  // HAS NEXT PAGE
  const hasNextPage = pagination?.hasNextPage ?? false;
  // HANDLE PAGE CHANGE
  const handlePageChange = useCallback((newPage: number): void => {
    // IF NEW PAGE IS LESS THAN 1, RETURN
    if (newPage < 1) return;
    // SET NEW PAGE
    setPage(newPage);
  }, []);
  // HANDLE SELECT REPO
  const handleSelectRepo = useCallback(
    (repo: GitHubRepository): void => {
      // LINK GITHUB REPO MUTATION
      linkMutation.mutate(
        {
          projectId,
          owner: repo.owner.login,
          name: repo.name,
          fullName: repo.fullName,
          repoId: repo.id,
          htmlUrl: repo.htmlUrl,
        },
        {
          // ON SUCCESS
          onSuccess: () => {
            // CLOSE FULL DRAWER
            onClose();
          },
        }
      );
    },
    [projectId, linkMutation, onClose]
  );
  // RETURN FULL DRAWER REPOSITORY SELECTOR
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Github size={24} className="text-[var(--accent-color)]" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
              Link Repository
            </h2>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Select a repository to link to this project
            </p>
          </div>
        </div>
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          disabled={linkMutation.isPending}
          className="p-1.5 rounded-full bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={16} />
        </button>
      </header>
      {/* SEARCH */}
      <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
        <div className="relative">
          {isSearching ? (
            <Loader2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-color)] animate-spin"
            />
          ) : (
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-color)]"
            />
          )}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all repositories..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-[var(--text-primary)] placeholder:text-[var(--light-text)]"
          />
        </div>
        {/* PAGE INFO */}
        {!isLoading && !isSearching && (
          <p className="text-[10px] sm:text-xs text-[var(--light-text)] mt-2">
            {debouncedSearchQuery
              ? `${repositories.length} result${
                  repositories.length !== 1 ? "s" : ""
                } found`
              : `Page ${page} • Showing ${repositories.length} repositories`}
          </p>
        )}
        {isSearching && (
          <p className="text-[10px] sm:text-xs text-[var(--light-text)] mt-2">
            Searching...
          </p>
        )}
      </div>
      {/* REPOSITORIES LIST */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
        {isLoading || isSearching ? (
          <RepositorySelectorSkeleton />
        ) : repositories.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
              <Github
                size={28}
                className="sm:w-8 sm:h-8 text-[var(--light-text)]"
              />
            </div>
            <p className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
              No repositories found
            </p>
            <p className="text-xs sm:text-sm text-[var(--light-text)] text-center max-w-[250px]">
              {debouncedSearchQuery
                ? "Try a different search term"
                : "You don't have any repositories on GitHub"}
            </p>
          </div>
        ) : (
          repositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onSelect={() => handleSelectRepo(repo)}
              isLinking={linkMutation.isPending}
            />
          ))
        )}
      </div>
      {/* PAGINATION */}
      {(hasPrevPage || hasNextPage) &&
        !debouncedSearchQuery &&
        !isSearching && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)] flex-shrink-0 bg-[var(--bg)]">
            {/* PAGE INFO */}
            <p className="text-xs sm:text-sm text-[var(--light-text)]">
              Page {page}
            </p>
            {/* PAGINATION CONTROLS */}
            <div className="flex items-center gap-2">
              {/* PREVIOUS */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={!hasPrevPage || isLoading || linkMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border border-[var(--border)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              {/* CURRENT PAGE */}
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-[var(--accent-color)] text-white">
                {page}
              </span>
              {/* NEXT */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNextPage || isLoading || linkMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] border border-[var(--border)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

// <== LINKED REPO INFO COMPONENT ==>
const LinkedRepoInfo = ({
  githubRepo,
  onUnlink,
  isUnlinking,
}: {
  githubRepo: GitHubRepoLink;
  onUnlink: () => void;
  isUnlinking: boolean;
}): JSX.Element => {
  // EXPANDED SECTIONS STATE
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // GITHUB STATUS
  const { status } = useGitHubStatus();
  // FETCH COMMITS
  const { commits, isLoading: isCommitsLoading } = useRepositoryCommits(
    githubRepo.owner,
    githubRepo.name,
    1,
    10,
    status?.isConnected && expandedSection === "commits"
  );
  // FETCH ISSUES
  const { issues, isLoading: isIssuesLoading } = useRepositoryIssues(
    githubRepo.owner,
    githubRepo.name,
    "open",
    1,
    10,
    status?.isConnected && expandedSection === "issues"
  );
  // FETCH PULL REQUESTS
  const { pullRequests, isLoading: isPRsLoading } = useRepositoryPullRequests(
    githubRepo.owner,
    githubRepo.name,
    "open",
    1,
    10,
    status?.isConnected && expandedSection === "pullRequests"
  );
  // TOGGLE SECTION FUNCTION
  const toggleSection = (section: string): void => {
    // TOGGLE SECTION
    setExpandedSection((prev) => (prev === section ? null : section));
  };
  // RETURN LINKED REPO INFO COMPONENT
  return (
    <div className="space-y-3">
      {/* REPO CARD */}
      <div className="p-3 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Github
              size={16}
              className="text-[var(--accent-color)] flex-shrink-0"
            />
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {githubRepo.fullName}
            </p>
          </div>
          {/* ACTIONS */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href={githubRepo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[var(--light-text)] hover:text-[var(--accent-color)] transition"
              title="Open in GitHub"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onUnlink}
              disabled={isUnlinking}
              className="p-1.5 text-[var(--light-text)] hover:text-red-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Unlink repository"
            >
              <Unlink size={14} />
            </button>
          </div>
        </div>
        {/* LINKED DATE */}
        <p className="text-[10px] text-[var(--light-text)] flex items-center gap-1">
          <Clock size={10} />
          Linked {formatDate(githubRepo.linkedAt)}
        </p>
        {/* VIEW IN APP LINK */}
        <Link
          to={`/github/${githubRepo.owner}/${githubRepo.name}`}
          className="mt-2 text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1"
        >
          View repository details
          <ExternalLink size={10} />
        </Link>
      </div>
      {/* ACTIVITY SECTIONS */}
      <div className="space-y-2">
        {/* COMMITS SECTION */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("commits")}
            className="w-full flex items-center justify-between p-2 bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <GitCommit size={14} className="text-[var(--accent-color)]" />
              <span className="text-xs font-medium text-[var(--text-primary)]">
                Recent Commits
              </span>
            </div>
            {expandedSection === "commits" ? (
              <ChevronUp size={14} className="text-[var(--light-text)]" />
            ) : (
              <ChevronDown size={14} className="text-[var(--light-text)]" />
            )}
          </button>
          {expandedSection === "commits" && (
            <div className="p-2 space-y-1.5 max-h-[150px] overflow-y-auto custom-scroll">
              {isCommitsLoading ? (
                <div className="space-y-1.5">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-[var(--hover-bg)] rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : commits.length === 0 ? (
                <p className="text-[10px] text-[var(--light-text)] text-center py-2">
                  No commits found
                </p>
              ) : (
                commits.slice(0, 5).map((commit: GitHubCommit) => (
                  <a
                    key={commit.sha}
                    href={commit.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1.5 bg-[var(--hover-bg)] rounded hover:bg-[var(--cards-bg)] transition"
                  >
                    <p className="text-[10px] text-[var(--text-primary)] line-clamp-1">
                      {commit.message.split("\n")[0]}
                    </p>
                    <p className="text-[9px] text-[var(--light-text)] mt-0.5">
                      {commit.author.login || commit.author.name} •{" "}
                      {commit.author.date && formatDate(commit.author.date)}
                    </p>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
        {/* ISSUES SECTION */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("issues")}
            className="w-full flex items-center justify-between p-2 bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-[var(--accent-color)]" />
              <span className="text-xs font-medium text-[var(--text-primary)]">
                Open Issues
              </span>
            </div>
            {expandedSection === "issues" ? (
              <ChevronUp size={14} className="text-[var(--light-text)]" />
            ) : (
              <ChevronDown size={14} className="text-[var(--light-text)]" />
            )}
          </button>
          {expandedSection === "issues" && (
            <div className="p-2 space-y-1.5 max-h-[150px] overflow-y-auto custom-scroll">
              {isIssuesLoading ? (
                <div className="space-y-1.5">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-[var(--hover-bg)] rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : issues.length === 0 ? (
                <p className="text-[10px] text-[var(--light-text)] text-center py-2">
                  No open issues
                </p>
              ) : (
                issues.slice(0, 5).map((issue: GitHubIssue) => (
                  <a
                    key={issue.id}
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1.5 bg-[var(--hover-bg)] rounded hover:bg-[var(--cards-bg)] transition"
                  >
                    <p className="text-[10px] text-[var(--text-primary)] line-clamp-1">
                      <span className="text-[var(--light-text)]">
                        #{issue.number}
                      </span>{" "}
                      {issue.title}
                    </p>
                    <p className="text-[9px] text-[var(--light-text)] mt-0.5">
                      {issue.user.login} • {formatDate(issue.createdAt)}
                    </p>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
        {/* PULL REQUESTS SECTION */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("pullRequests")}
            className="w-full flex items-center justify-between p-2 bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <GitPullRequest
                size={14}
                className="text-[var(--accent-color)]"
              />
              <span className="text-xs font-medium text-[var(--text-primary)]">
                Pull Requests
              </span>
            </div>
            {expandedSection === "pullRequests" ? (
              <ChevronUp size={14} className="text-[var(--light-text)]" />
            ) : (
              <ChevronDown size={14} className="text-[var(--light-text)]" />
            )}
          </button>
          {expandedSection === "pullRequests" && (
            <div className="p-2 space-y-1.5 max-h-[150px] overflow-y-auto custom-scroll">
              {isPRsLoading ? (
                <div className="space-y-1.5">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-[var(--hover-bg)] rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : pullRequests.length === 0 ? (
                <p className="text-[10px] text-[var(--light-text)] text-center py-2">
                  No open pull requests
                </p>
              ) : (
                pullRequests.slice(0, 5).map((pr: GitHubPullRequest) => (
                  <a
                    key={pr.id}
                    href={pr.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1.5 bg-[var(--hover-bg)] rounded hover:bg-[var(--cards-bg)] transition"
                  >
                    <p className="text-[10px] text-[var(--text-primary)] line-clamp-1">
                      <span className="text-[var(--light-text)]">
                        #{pr.number}
                      </span>{" "}
                      {pr.title}
                    </p>
                    <p className="text-[9px] text-[var(--light-text)] mt-0.5">
                      {pr.user.login} • {formatDate(pr.createdAt)}
                    </p>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== PROJECT GITHUB TAB COMPONENT ==>
const ProjectGitHubTab = ({
  projectId,
  githubRepo,
  onShowFullSelector,
}: ProjectGitHubTabProps): JSX.Element => {
  // GITHUB STATUS
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // UNLINK GITHUB REPO MUTATION
  const unlinkMutation = useUnlinkGitHubRepo();
  // HANDLE UNLINK REPO FUNCTION
  const handleUnlinkRepo = (): void => {
    // UNLINK GITHUB REPO MUTATION
    unlinkMutation.mutate(projectId);
  };
  // LOADING STATE
  if (isStatusLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--inside-card-bg)] animate-pulse" />
        <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
      </div>
    );
  }
  // NOT CONNECTED STATE
  if (!status?.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
          <Github size={24} className="text-[var(--light-text)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          GitHub Not Connected
        </p>
        <p className="text-xs text-[var(--light-text)] text-center max-w-[200px]">
          Connect your GitHub account to link repositories to this project.
        </p>
        <Link
          to="/settings?tab=Integrations"
          className="mt-2 px-3 py-1.5 text-xs bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition"
        >
          Connect GitHub
        </Link>
      </div>
    );
  }
  // HAS LINKED REPO
  if (githubRepo?.fullName) {
    return (
      <LinkedRepoInfo
        githubRepo={githubRepo}
        onUnlink={handleUnlinkRepo}
        isUnlinking={unlinkMutation.isPending}
      />
    );
  }
  // NO LINKED REPO - SHOW LINK BUTTON
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-12 h-12 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
        <Link2 size={24} className="text-[var(--light-text)]" />
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)]">
        No Repository Linked
      </p>
      <p className="text-xs text-[var(--light-text)] text-center max-w-[200px]">
        Link a GitHub repository to track commits, issues, and pull requests.
      </p>
      <button
        onClick={onShowFullSelector}
        className="mt-2 px-3 py-1.5 text-xs bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer flex items-center gap-1.5"
      >
        <Github size={14} />
        Link Repository
      </button>
    </div>
  );
};

export default ProjectGitHubTab;
