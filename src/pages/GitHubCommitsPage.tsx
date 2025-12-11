// <== IMPORTS ==>
import {
  ArrowLeft,
  GitCommit,
  GitBranch,
  User,
  Clock,
  Plus,
  Minus,
  ExternalLink,
  Search,
  ChevronDown,
  RefreshCw,
  GitCompare,
  Sparkles,
  Copy,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryCommits,
  useRepositoryBranches,
  useSearchCommits,
} from "../hooks/useGitHub";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { useSummarizeCommits } from "../hooks/useAI";
import { useParams, useNavigate } from "react-router-dom";
import { JSX, useState, useEffect, useCallback } from "react";
import DashboardHeader from "../components/layout/DashboardHeader";
import CommitDetailsModal from "../components/github/CommitDetailsModal";

// <== DEBOUNCE HOOK ==>
const useDebounce = <T,>(value: T, delay: number): T => {
  // STATE
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // EFFECT
  useEffect(() => {
    // SET TIMEOUT
    const handler = setTimeout(() => {
      // SET DEBOUNCED VALUE
      setDebouncedValue(value);
    }, delay);
    // CLEANUP
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  // RETURN DEBOUNCED VALUE
  return debouncedValue;
};

// <== FORMAT TIME AGO FUNCTION ==>
const formatTimeAgo = (dateString?: string | null): string => {
  // CHECK IF DATE STRING IS VALID
  if (!dateString) return "Unknown";
  // PARSE DATE
  const date = new Date(dateString);
  // GET NOW
  const now = new Date();
  // GET DIFF IN SECONDS
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  // CHECK DIFF IN SECONDS
  if (diffInSeconds < 60) return "just now";
  // CHECK DIFF IN MINUTES
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  // CHECK DIFF IN HOURS
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  // CHECK DIFF IN DAYS
  if (diffInSeconds < 2592000)
    // RETURN DAYS AGO
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  // CHECK DIFF IN MONTHS
  if (diffInSeconds < 31536000)
    // RETURN MONTHS AGO
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  // RETURN YEARS AGO
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

// <== FORMAT DATE FUNCTION ==>
const formatDate = (dateString?: string | null): string => {
  // CHECK IF DATE STRING IS VALID
  if (!dateString) return "Unknown";
  // PARSE DATE
  const date = new Date(dateString);
  // FORMAT DATE
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// <== BRANCH SELECTOR COMPONENT ==>
type BranchSelectorProps = {
  // <== BRANCHES ==>
  branches: { name: string; protected?: boolean }[];
  // <== SELECTED BRANCH ==>
  selectedBranch: string;
  // <== ON SELECT BRANCH ==>
  onSelectBranch: (branch: string) => void;
  // <== IS LOADING ==>
  isLoading: boolean;
};

const BranchSelector = ({
  branches,
  selectedBranch,
  onSelectBranch,
  isLoading,
}: BranchSelectorProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // RETURN BRANCH SELECTOR
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
      >
        <GitBranch size={14} className="text-[var(--accent-color)]" />
        <span className="max-w-[120px] truncate">{selectedBranch}</span>
        <ChevronDown
          size={14}
          className={`transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 max-h-[250px] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2
                size={16}
                className="animate-spin text-[var(--accent-color)]"
              />
              <span className="ml-2 text-sm text-[var(--light-text)]">
                Loading...
              </span>
            </div>
          ) : (
            branches.map((branch) => (
              <button
                key={branch.name}
                onClick={() => {
                  onSelectBranch(branch.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                  selectedBranch === branch.name
                    ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <GitBranch size={14} />
                <span className="truncate flex-1">{branch.name}</span>
                {branch.protected && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500">
                    protected
                  </span>
                )}
                {selectedBranch === branch.name && (
                  <Check size={14} className="text-[var(--accent-color)]" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// <== COMMIT TYPE ==>
type Commit = {
  // <== SHA ==>
  sha: string;
  // <== MESSAGE ==>
  message: string;
  // <== AUTHOR ==>
  author: {
    // <== NAME ==>
    name?: string | null;
    // <== EMAIL ==>
    email?: string | null;
    // <== DATE ==>
    date?: string | null;
    // <== LOGIN ==>
    login?: string | null;
    // <== AVATAR URL ==>
    avatarUrl?: string | null;
  };
  committer?: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    date?: string;
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== HTML URL ==>
  htmlUrl: string;
  // <== STATS ==>
  stats?: {
    // <== ADDITIONS ==>
    additions?: number;
    // <== DELETIONS ==>
    deletions?: number;
    // <== TOTAL ==>
    total?: number;
  };
  // <== SCORE ==>
  score?: number;
};

// <== COMMIT CARD COMPONENT ==>
type CommitCardProps = {
  // <== COMMIT ==>
  commit: Commit;
  // <== ON CLICK ==>
  onClick: () => void;
  // <== IS SEARCH RESULT ==>
  isSearchResult?: boolean;
};

const CommitCard = ({
  commit,
  onClick,
  isSearchResult,
}: CommitCardProps): JSX.Element => {
  // COPIED STATE
  const [copied, setCopied] = useState(false);
  // GET SHORT SHA
  const shortSha = commit.sha.slice(0, 7);
  // GET MESSAGE LINES
  const messageLines = commit.message.split("\n");
  // GET SUBJECT
  const subject = messageLines[0];
  // GET BODY
  const body = messageLines.slice(1).join("\n").trim();
  // HANDLE COPY SHA
  const handleCopySha = (e: React.MouseEvent) => {
    // STOP PROPAGATION
    e.stopPropagation();
    // COPY SHA
    navigator.clipboard.writeText(commit.sha);
    // SET COPIED
    setCopied(true);
    // SHOW TOAST
    toast.success("Commit SHA copied!");
    // RESET AFTER 2 SECONDS
    setTimeout(() => setCopied(false), 2000);
  };
  // RETURN COMMIT CARD
  return (
    <div
      onClick={onClick}
      className={`group p-3 sm:p-4 bg-[var(--cards-bg)] border rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition cursor-pointer ${
        isSearchResult
          ? "border-[var(--accent-color)]/20"
          : "border-[var(--border)]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* AVATAR */}
        <div className="hidden sm:block flex-shrink-0">
          {commit.author.avatarUrl ? (
            <img
              src={commit.author.avatarUrl}
              alt={commit.author.name || "Author"}
              className="w-10 h-10 rounded-full ring-2 ring-[var(--border)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center">
              <User size={20} className="text-[var(--accent-color)]" />
            </div>
          )}
        </div>
        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* SUBJECT */}
          <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition line-clamp-2">
            {subject}
          </h3>
          {/* BODY PREVIEW */}
          {body && (
            <p className="mt-1 text-xs text-[var(--light-text)] line-clamp-1">
              {body}
            </p>
          )}
          {/* META */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {/* AUTHOR */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--light-text)]">
              <User size={12} />
              <span>
                {commit.author.login || commit.author.name || "Unknown"}
              </span>
            </div>
            {/* DATE */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--light-text)]">
              <Clock size={12} />
              <span title={formatDate(commit.author.date)}>
                {formatTimeAgo(commit.author.date)}
              </span>
            </div>
            {/* STATS */}
            {commit.stats && (
              <div className="flex items-center gap-2">
                {commit.stats.additions !== undefined && (
                  <span className="flex items-center gap-0.5 text-xs text-green-500">
                    <Plus size={10} />
                    {commit.stats.additions}
                  </span>
                )}
                {commit.stats.deletions !== undefined && (
                  <span className="flex items-center gap-0.5 text-xs text-red-500">
                    <Minus size={10} />
                    {commit.stats.deletions}
                  </span>
                )}
              </div>
            )}
            {/* SEARCH SCORE BADGE */}
            {isSearchResult && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                Search Result
              </span>
            )}
          </div>
        </div>
        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:flex-shrink-0">
          {/* SHA */}
          <button
            onClick={handleCopySha}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-md bg-[var(--inside-card-bg)] text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            title="Copy SHA"
          >
            {copied ? (
              <Check size={12} className="text-green-500" />
            ) : (
              <Copy size={12} />
            )}
            {shortSha}
          </button>
          {/* EXTERNAL LINK */}
          <a
            href={commit.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-md text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            title="View on GitHub"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

// <== COMMIT SKELETON COMPONENT ==>
const CommitSkeleton = (): JSX.Element => {
  // RETURN COMMIT SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--light-text)]/10 hidden sm:block" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/2 mb-3" />
          <div className="flex gap-3">
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          </div>
        </div>
        <div className="h-6 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
    </div>
  );
};

// <== AI SUMMARY PANEL COMPONENT ==>
type AISummaryPanelProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== COMMITS ==>
  commits: Commit[];
};

const AISummaryPanel = ({
  isOpen,
  onClose,
  commits,
}: AISummaryPanelProps): JSX.Element | null => {
  // SUMMARIZE COMMITS MUTATION
  const summarizeCommits = useSummarizeCommits();
  // HANDLE SUMMARIZE
  const handleSummarize = useCallback(() => {
    // FORMAT COMMITS FOR API (convert null to undefined)
    const formattedCommits = commits.map((c) => ({
      sha: c.sha,
      message: c.message,
      author: {
        name: c.author.name ?? undefined,
        date: c.author.date ?? undefined,
      },
      stats: c.stats,
    }));
    // SUMMARIZE COMMITS
    summarizeCommits.mutate({ commits: formattedCommits, includeStats: true });
  }, [commits, summarizeCommits]);
  // EFFECT TO SUMMARIZE ON OPEN
  useEffect(() => {
    // CHECK IF OPEN AND NO DATA
    if (isOpen && !summarizeCommits.data && !summarizeCommits.isPending) {
      // SUMMARIZE COMMITS
      handleSummarize();
    }
  }, [
    isOpen,
    summarizeCommits.data,
    summarizeCommits.isPending,
    handleSummarize,
  ]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET SUMMARY DATA
  const summary = summarizeCommits.data?.summary;
  // RETURN AI SUMMARY PANEL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
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
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                AI Commit Summary
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Analyzing {commits.length} commits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {summarizeCommits.isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2
                size={32}
                className="animate-spin text-[var(--accent-color)] mb-3"
              />
              <p className="text-sm text-[var(--light-text)]">
                AI is analyzing commits...
              </p>
            </div>
          ) : summarizeCommits.isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle size={32} className="text-red-500 mb-3" />
              <p className="text-sm text-red-500">Failed to generate summary</p>
              <button
                onClick={handleSummarize}
                className="mt-3 px-3 py-1.5 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              {/* SUMMARY */}
              <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                  Summary
                </h3>
                <p className="text-sm text-[var(--light-text)]">
                  {summary.summary}
                </p>
              </div>
              {/* MAIN CHANGES */}
              {summary.mainChanges?.length > 0 && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                    Main Changes
                  </h3>
                  <ul className="space-y-1">
                    {summary.mainChanges.map((change, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--light-text)] flex items-start gap-2"
                      >
                        <span className="text-[var(--accent-color)]">•</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* HIGHLIGHTS */}
              {summary.highlights?.length > 0 && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                    Highlights
                  </h3>
                  <ul className="space-y-1">
                    {summary.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--light-text)] flex items-start gap-2"
                      >
                        <Sparkles
                          size={12}
                          className="text-yellow-500 mt-1 flex-shrink-0"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* RELEASE NOTES */}
              {summary.suggestedReleaseNotes && (
                <div className="p-3 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--accent-color)] mb-2">
                    Suggested Release Notes
                  </h3>
                  <p className="text-sm text-[var(--text-primary)]">
                    {summary.suggestedReleaseNotes}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// <== GITHUB COMMITS PAGE COMPONENT ==>
const GitHubCommitsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Commits - ${owner}/${repo}`);
  // SELECTED BRANCH STATE
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // DEBOUNCED SEARCH QUERY
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  // PAGE STATE
  const [page, setPage] = useState(1);
  // SELECTED COMMIT SHA STATE
  const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(
    null
  );
  // SHOW AI SUMMARY STATE
  const [showAISummary, setShowAISummary] = useState(false);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH BRANCHES
  const { branches, isLoading: isBranchesLoading } = useRepositoryBranches(
    owner || "",
    repo || ""
  );
  // FETCH COMMITS (NORMAL LIST)
  const {
    commits,
    isLoading: isCommitsLoading,
    isError: isCommitsError,
    refetch,
  } = useRepositoryCommits(
    owner || "",
    repo || "",
    page,
    30,
    selectedBranch || undefined,
    true
  );
  // SEARCH COMMITS (WHEN SEARCHING)
  const isSearching = debouncedSearchQuery.trim().length > 0;
  const {
    commits: searchResults,
    totalCount: searchTotalCount,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchCommits(
    owner || "",
    repo || "",
    debouncedSearchQuery,
    1,
    30,
    isSearching
  );
  // SET DEFAULT BRANCH
  useEffect(() => {
    // CHECK IF DEFAULT BRANCH IS SET
    if (repository?.defaultBranch && !selectedBranch) {
      // SET DEFAULT BRANCH
      setSelectedBranch(repository.defaultBranch);
    }
  }, [repository, selectedBranch]);
  // RESET PAGE WHEN BRANCH CHANGES
  useEffect(() => {
    // RESET PAGE
    setPage(1);
  }, [selectedBranch]);
  // GET DISPLAYED COMMITS
  const displayedCommits = isSearching ? searchResults : commits;
  // CHECK IF LOADING
  const isLoading = isSearching
    ? isSearchLoading || isSearchFetching
    : isCommitsLoading;
  // CHECK IF ERROR
  const isError = isSearching ? isSearchError : isCommitsError;
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Commit History"
          subtitle={`${owner}/${repo}`}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* COMMITS SKELETON */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <CommitSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN COMMITS PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Commit History"
        subtitle={`${owner}/${repo}`}
      />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/github/${owner}/${repo}`)}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              title="Back to repository"
            >
              <ArrowLeft size={18} />
            </button>
            {/* BRANCH SELECTOR */}
            <BranchSelector
              branches={branches || []}
              selectedBranch={
                selectedBranch || repository?.defaultBranch || "main"
              }
              onSelectBranch={setSelectedBranch}
              isLoading={isBranchesLoading}
            />
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* COMPARE BUTTON */}
            <button
              onClick={() => navigate(`/github/${owner}/${repo}/compare`)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <GitCompare size={14} />
              <span className="hidden sm:inline">Compare</span>
            </button>
            {/* AI SUMMARY BUTTON */}
            <button
              onClick={() => setShowAISummary(true)}
              disabled={!commits || commits.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">AI Summary</span>
            </button>
            {/* REFRESH BUTTON */}
            <button
              onClick={() => refetch()}
              disabled={isSearching}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        {/* SEARCH BAR */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-color)]"
          />
          <input
            type="text"
            placeholder="Search commits by message, author, or SHA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-[var(--border)] rounded-xl bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
          />
          {/* LOADING INDICATOR OR CLEAR BUTTON */}
          {searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isSearchFetching && (
                <Loader2
                  size={14}
                  className="animate-spin text-[var(--accent-color)]"
                />
              )}
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-md text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        {/* SEARCH RESULTS INFO */}
        {isSearching && !isSearchLoading && (
          <div className="flex items-center gap-2 mb-4 text-sm text-[var(--light-text)]">
            <Search size={14} />
            <span>
              Found{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {searchTotalCount}
              </span>{" "}
              {searchTotalCount === 1 ? "commit" : "commits"} matching "
              {debouncedSearchQuery}"
            </span>
          </div>
        )}
        {/* COMMITS LIST */}
        <div className="space-y-3">
          {isLoading ? (
            // LOADING SKELETONS
            [1, 2, 3, 4, 5].map((i) => <CommitSkeleton key={i} />)
          ) : isError ? (
            // ERROR STATE
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-sm text-red-500 mb-3">
                Failed to load commits
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : displayedCommits && displayedCommits.length === 0 ? (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <GitCommit size={40} className="text-[var(--light-text)] mb-3" />
              <p className="text-sm text-[var(--light-text)]">
                {isSearching
                  ? "No commits match your search"
                  : "No commits found"}
              </p>
              {isSearching && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            // COMMITS LIST
            displayedCommits?.map((commit) => (
              <CommitCard
                key={commit.sha}
                commit={commit}
                onClick={() => setSelectedCommitSha(commit.sha)}
                isSearchResult={isSearching}
              />
            ))
          )}
        </div>
        {/* PAGINATION (ONLY WHEN NOT SEARCHING) */}
        {!isSearching && commits && commits.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-[var(--light-text)]">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={commits.length < 30}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* COMMIT DETAILS MODAL */}
      <CommitDetailsModal
        isOpen={!!selectedCommitSha}
        onClose={() => setSelectedCommitSha(null)}
        owner={owner || ""}
        repo={repo || ""}
        sha={selectedCommitSha || ""}
      />
      {/* AI SUMMARY PANEL */}
      <AISummaryPanel
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
        commits={commits || []}
      />
    </div>
  );
};

export default GitHubCommitsPage;
