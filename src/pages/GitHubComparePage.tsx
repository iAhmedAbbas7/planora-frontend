// <== IMPORTS ==>
import {
  ArrowLeft,
  GitCompare,
  GitBranch,
  GitCommit,
  Plus,
  Minus,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  FileCode,
  ArrowLeftRight,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryBranches,
  useCommitComparison,
  CommitFile,
} from "../hooks/useGitHub";
import useTitle from "../hooks/useTitle";
import { JSX, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== GET FILE ICON FUNCTION ==>
const getFileIcon = (filename: string): JSX.Element => {
  // GET EXTENSION
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  // CODE EXTENSIONS
  const codeExts = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "py",
    "java",
    "c",
    "cpp",
    "cs",
    "go",
    "rs",
    "rb",
    "php",
    "swift",
    "kt",
  ];
  // CHECK IF CODE FILE
  if (codeExts.includes(ext)) {
    // RETURN FILE CODE ICON
    return <FileCode size={14} className="text-blue-400" />;
  }
  // DEFAULT
  return <FileText size={14} className="text-[var(--light-text)]" />;
};

// <== GET STATUS COLOR FUNCTION ==>
const getStatusColor = (
  status: string
): { bg: string; text: string; label: string } => {
  // CHECK STATUS
  switch (status) {
    case "added":
      return {
        bg: "bg-green-500/15",
        text: "text-green-500",
        label: "Added",
      };
    case "modified":
      return {
        bg: "bg-yellow-500/15",
        text: "text-yellow-500",
        label: "Modified",
      };
    case "removed":
      return {
        bg: "bg-red-500/15",
        text: "text-red-500",
        label: "Removed",
      };
    case "renamed":
      return {
        bg: "bg-blue-500/15",
        text: "text-blue-500",
        label: "Renamed",
      };
    default:
      return {
        bg: "bg-[var(--light-text)]/15",
        text: "text-[var(--light-text)]",
        label: status,
      };
  }
};

// <== BRANCH SELECTOR COMPONENT ==>
type BranchSelectorProps = {
  // <== LABEL ==>
  label: string;
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
  label,
  branches,
  selectedBranch,
  onSelectBranch,
  isLoading,
}: BranchSelectorProps): JSX.Element => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // RETURN BRANCH SELECTOR
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[var(--light-text)]">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <GitBranch size={14} className="text-[var(--accent-color)]" />
            <span className="truncate">
              {selectedBranch || "Select branch"}
            </span>
          </div>
          <ChevronDown
            size={14}
            className={`transition flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {/* DROPDOWN */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2
                  size={16}
                  className="animate-spin text-[var(--accent-color)]"
                />
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
                  {selectedBranch === branch.name && (
                    <Check size={14} className="text-[var(--accent-color)]" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// <== FILE CHANGE CARD COMPONENT ==>
type FileChangeCardProps = {
  // <== FILE ==>
  file: CommitFile;
  // <== EXPANDED ==>
  expanded: boolean;
  // <== ON TOGGLE ==>
  onToggle: () => void;
};

const FileChangeCard = ({
  file,
  expanded,
  onToggle,
}: FileChangeCardProps): JSX.Element => {
  // GET STATUS COLOR
  const statusStyle = getStatusColor(file.status);
  // RETURN FILE CHANGE CARD
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      {/* HEADER */}
      <div
        onClick={onToggle}
        className="flex items-center gap-2 p-2.5 bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <button className="p-0.5 text-[var(--light-text)]">
          {file.patch ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </button>
        {getFileIcon(file.filename)}
        <span className="flex-1 text-sm text-[var(--text-primary)] truncate font-mono">
          {file.filename}
        </span>
        <span
          className={`px-1.5 py-0.5 text-xs rounded ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
        <div className="flex items-center gap-2 text-xs">
          {file.additions > 0 && (
            <span className="text-green-500">+{file.additions}</span>
          )}
          {file.deletions > 0 && (
            <span className="text-red-500">-{file.deletions}</span>
          )}
        </div>
      </div>
      {/* PATCH */}
      {expanded && file.patch && (
        <div className="overflow-x-auto bg-[var(--bg)]">
          <pre className="p-3 text-xs font-mono whitespace-pre">
            {file.patch.split("\n").map((line, i) => {
              let className = "text-[var(--light-text)]";
              if (line.startsWith("+") && !line.startsWith("+++")) {
                className = "text-green-500 bg-green-500/10";
              } else if (line.startsWith("-") && !line.startsWith("---")) {
                className = "text-red-500 bg-red-500/10";
              } else if (line.startsWith("@@")) {
                className = "text-blue-400 bg-blue-500/10";
              }
              return (
                <div key={i} className={`${className} px-2 -mx-2`}>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
};

// <== GITHUB COMPARE PAGE COMPONENT ==>
const GitHubComparePage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Compare - ${owner}/${repo}`);
  // BASE BRANCH STATE
  const [baseBranch, setBaseBranch] = useState<string>("");
  // HEAD BRANCH STATE
  const [headBranch, setHeadBranch] = useState<string>("");
  // EXPANDED FILES STATE
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
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
  // SET DEFAULT BRANCHES
  useEffect(() => {
    // CHECK IF REPOSITORY IS LOADED
    if (repository?.defaultBranch && branches && branches.length > 0) {
      // SET BASE BRANCH TO DEFAULT
      if (!baseBranch) {
        // SET BASE BRANCH
        setBaseBranch(repository.defaultBranch);
      }
      // SET HEAD BRANCH TO FIRST NON-DEFAULT BRANCH
      if (!headBranch) {
        // FIND OTHER BRANCH
        const otherBranch = branches.find(
          (b) => b.name !== repository.defaultBranch
        );
        // SET HEAD BRANCH
        setHeadBranch(otherBranch?.name || repository.defaultBranch);
      }
    }
  }, [repository, branches, baseBranch, headBranch]);
  // FETCH COMPARISON (ONLY WHEN BOTH BRANCHES ARE SELECTED AND DIFFERENT)
  const shouldCompare =
    !!baseBranch && !!headBranch && baseBranch !== headBranch;
  const {
    comparison,
    isLoading: isComparisonLoading,
    isError,
    refetch,
  } = useCommitComparison(
    owner || "",
    repo || "",
    baseBranch,
    headBranch,
    shouldCompare
  );
  // TOGGLE FILE EXPANSION
  const toggleFile = (filename: string) => {
    // SET EXPANDED FILES
    setExpandedFiles((prev) => {
      // CREATE NEW SET
      const next = new Set(prev);
      // CHECK IF FILE IS EXPANDED
      if (next.has(filename)) {
        // REMOVE FILE FROM SET
        next.delete(filename);
      } else {
        // ADD FILE TO SET
        next.add(filename);
      }
      // RETURN NEW SET
      return next;
    });
  };
  // SWAP BRANCHES
  const swapBranches = () => {
    // TEMPORARY VARIABLE
    const temp = baseBranch;
    // SET BASE BRANCH
    setBaseBranch(headBranch);
    // SET HEAD BRANCH
    setHeadBranch(temp);
  };
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Compare Changes"
          subtitle={`${owner}/${repo}`}
          showSearch={false}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-[var(--light-text)]/10 rounded" />
          </div>
        </div>
      </div>
    );
  }
  // RETURN COMPARE PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Compare Changes"
        subtitle={`${owner}/${repo}`}
        showSearch={false}
      />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* BACK BUTTON */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate(`/github/${owner}/${repo}/commits`)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Commits
          </button>
        </div>
        {/* BRANCH SELECTORS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-6 p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
          {/* BASE BRANCH */}
          <div className="flex-1">
            <BranchSelector
              label="Base"
              branches={branches || []}
              selectedBranch={baseBranch}
              onSelectBranch={setBaseBranch}
              isLoading={isBranchesLoading}
            />
          </div>
          {/* SWAP BUTTON */}
          <button
            onClick={swapBranches}
            className="self-center sm:self-end p-2 rounded-lg border border-[var(--border)] text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            title="Swap branches"
          >
            <ArrowLeftRight size={16} />
          </button>
          {/* HEAD BRANCH */}
          <div className="flex-1">
            <BranchSelector
              label="Compare"
              branches={branches || []}
              selectedBranch={headBranch}
              onSelectBranch={setHeadBranch}
              isLoading={isBranchesLoading}
            />
          </div>
        </div>
        {/* SAME BRANCH WARNING */}
        {baseBranch && headBranch && baseBranch === headBranch && (
          <div className="p-4 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle size={16} />
              <p className="text-sm">
                Select two different branches to compare changes.
              </p>
            </div>
          </div>
        )}
        {/* COMPARISON RESULTS */}
        {shouldCompare && (
          <>
            {isComparisonLoading ? (
              // LOADING STATE
              <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                <Loader2
                  size={32}
                  className="animate-spin text-[var(--accent-color)] mb-3"
                />
                <p className="text-sm text-[var(--light-text)]">
                  Comparing branches...
                </p>
              </div>
            ) : isError ? (
              // ERROR STATE
              <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                <AlertCircle size={40} className="text-red-500 mb-3" />
                <p className="text-sm text-red-500 mb-3">
                  Failed to compare branches
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : comparison ? (
              <div className="space-y-6">
                {/* SUMMARY CARD */}
                <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* STATUS */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          comparison.status === "identical"
                            ? "bg-gray-500/15"
                            : comparison.status === "ahead"
                            ? "bg-green-500/15"
                            : comparison.status === "behind"
                            ? "bg-yellow-500/15"
                            : "bg-purple-500/15"
                        }`}
                      >
                        <GitCompare
                          size={20}
                          className={
                            comparison.status === "identical"
                              ? "text-gray-500"
                              : comparison.status === "ahead"
                              ? "text-green-500"
                              : comparison.status === "behind"
                              ? "text-yellow-500"
                              : "text-purple-500"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {comparison.status === "identical"
                            ? "Branches are identical"
                            : comparison.status === "ahead"
                            ? `${headBranch} is ahead of ${baseBranch}`
                            : comparison.status === "behind"
                            ? `${headBranch} is behind ${baseBranch}`
                            : `Branches have diverged`}
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          {comparison.totalCommits} commits •{" "}
                          {comparison.files?.length || 0} files changed
                        </p>
                      </div>
                    </div>
                    {/* STATS */}
                    <div className="flex items-center gap-4">
                      {comparison.aheadBy > 0 && (
                        <div className="flex items-center gap-1 text-sm text-green-500">
                          <Plus size={14} />
                          {comparison.aheadBy} ahead
                        </div>
                      )}
                      {comparison.behindBy > 0 && (
                        <div className="flex items-center gap-1 text-sm text-red-500">
                          <Minus size={14} />
                          {comparison.behindBy} behind
                        </div>
                      )}
                      <a
                        href={comparison.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
                      >
                        <ExternalLink size={14} />
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
                {/* COMMITS */}
                {comparison.commits.length > 0 && (
                  <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                      Commits ({comparison.commits.length})
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {comparison.commits.map((commit) => (
                        <a
                          key={commit.sha}
                          href={commit.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition"
                        >
                          {commit.author.avatarUrl ? (
                            <img
                              src={commit.author.avatarUrl}
                              alt={commit.author.name || "Author"}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center">
                              <GitCommit
                                size={12}
                                className="text-[var(--accent-color)]"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--text-primary)] truncate">
                              {commit.message.split("\n")[0]}
                            </p>
                            <p className="text-xs text-[var(--light-text)]">
                              {commit.author.login || commit.author.name}
                            </p>
                          </div>
                          <span className="text-xs font-mono text-[var(--light-text)]">
                            {commit.sha.slice(0, 7)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {/* FILES CHANGED */}
                {comparison.files && comparison.files.length > 0 && (
                  <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        Files Changed ({comparison.files.length})
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setExpandedFiles(
                              new Set(
                                comparison.files?.map((f) => f.filename) || []
                              )
                            )
                          }
                          className="text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
                        >
                          Expand All
                        </button>
                        <button
                          onClick={() => setExpandedFiles(new Set())}
                          className="text-xs text-[var(--light-text)] hover:underline cursor-pointer"
                        >
                          Collapse All
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {comparison.files.map((file) => (
                        <FileChangeCard
                          key={file.filename}
                          file={file}
                          expanded={expandedFiles.has(file.filename)}
                          onToggle={() => toggleFile(file.filename)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubComparePage;
