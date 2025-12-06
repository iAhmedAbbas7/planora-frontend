// <== IMPORTS ==>
import {
  X,
  GitCommit,
  GitBranch,
  GitPullRequest,
  User,
  Calendar,
  Clock,
  FileText,
  Plus,
  Minus,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Shield,
  ShieldAlert,
  FileCode,
  FileDiff,
} from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import {
  useCommitDetails,
  useCommitBranches,
  useCommitPullRequests,
  CommitFile,
} from "../../hooks/useGitHub";

// <== FORMAT DATE FUNCTION ==>
const formatDate = (dateString?: string): string => {
  // CHECK IF DATE STRING IS VALID
  if (!dateString) return "Unknown";
  // PARSE DATE
  const date = new Date(dateString);
  // FORMAT DATE
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
    case "copied":
      return {
        bg: "bg-purple-500/15",
        text: "text-purple-500",
        label: "Copied",
      };
    default:
      return {
        bg: "bg-[var(--light-text)]/15",
        text: "text-[var(--light-text)]",
        label: status,
      };
  }
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
        {/* EXPAND ICON */}
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
        {/* FILE ICON */}
        {getFileIcon(file.filename)}
        {/* FILENAME */}
        <span className="flex-1 text-sm text-[var(--text-primary)] truncate font-mono">
          {file.filename}
          {file.previousFilename && (
            <span className="text-[var(--light-text)]">
              {" "}
              ← {file.previousFilename}
            </span>
          )}
        </span>
        {/* STATUS */}
        <span
          className={`px-1.5 py-0.5 text-xs rounded ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
        {/* STATS */}
        <div className="flex items-center gap-2 text-xs">
          {file.additions > 0 && (
            <span className="text-green-500">+{file.additions}</span>
          )}
          {file.deletions > 0 && (
            <span className="text-red-500">-{file.deletions}</span>
          )}
        </div>
        {/* EXTERNAL LINK */}
        <a
          href={file.blobUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded text-[var(--light-text)] hover:text-[var(--accent-color)] transition"
        >
          <ExternalLink size={12} />
        </a>
      </div>
      {/* PATCH */}
      {expanded && file.patch && (
        <div className="overflow-x-auto bg-[var(--bg)]">
          <pre className="p-3 text-xs font-mono whitespace-pre">
            {file.patch.split("\n").map((line, i) => {
              // DETERMINE LINE COLOR
              let className = "text-[var(--light-text)]";
              if (line.startsWith("+") && !line.startsWith("+++")) {
                className = "text-green-500 bg-green-500/10";
              } else if (line.startsWith("-") && !line.startsWith("---")) {
                className = "text-red-500 bg-red-500/10";
              } else if (line.startsWith("@@")) {
                className = "text-blue-400 bg-blue-500/10";
              }
              // RETURN LINE
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

// <== COMMIT DETAILS MODAL PROPS ==>
type CommitDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== SHA ==>
  sha: string;
};

// <== COMMIT DETAILS MODAL COMPONENT ==>
const CommitDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  sha,
}: CommitDetailsModalProps): JSX.Element | null => {
  // EXPANDED FILES STATE
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  // COPIED STATE
  const [copied, setCopied] = useState(false);
  // FETCH COMMIT DETAILS
  const { commit, isLoading, isError, refetch } = useCommitDetails(
    owner,
    repo,
    sha,
    isOpen && !!sha
  );
  // FETCH COMMIT BRANCHES
  const { branches, isLoading: isBranchesLoading } = useCommitBranches(
    owner,
    repo,
    sha,
    isOpen && !!sha
  );
  // FETCH COMMIT PULL REQUESTS
  const { pullRequests, isLoading: isPRsLoading } = useCommitPullRequests(
    owner,
    repo,
    sha,
    isOpen && !!sha
  );
  // RESET EXPANDED FILES ON CLOSE
  useEffect(() => {
    // CHECK IF NOT OPEN
    if (!isOpen) {
      // RESET EXPANDED FILES
      setExpandedFiles(new Set());
    }
  }, [isOpen]);
  // PREVENT BODY SCROLL
  useEffect(() => {
    // CHECK IF OPEN
    if (isOpen) {
      // SET BODY STYLE
      document.body.style.overflow = "hidden";
    } else {
      // RESET BODY STYLE
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // RESET BODY STYLE
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // TOGGLE FILE EXPANSION
  const toggleFile = (filename: string) => {
    // SET EXPANDED FILES
    setExpandedFiles((prev) => {
      // CREATE NEW SET
      const next = new Set(prev);
      // TOGGLE FILE
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      // RETURN NEW SET
      return next;
    });
  };
  // HANDLE COPY SHA
  const handleCopySha = () => {
    // COPY SHA
    navigator.clipboard.writeText(sha);
    // SET COPIED
    setCopied(true);
    // SHOW TOAST
    toast.success("Full SHA copied to clipboard!");
    // RESET AFTER 2 SECONDS
    setTimeout(() => setCopied(false), 2000);
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET MESSAGE LINES
  const messageLines = commit?.message.split("\n") || [];
  // GET SUBJECT
  const subject = messageLines[0] || "";
  // GET BODY
  const body = messageLines.slice(1).join("\n").trim();
  // RETURN MODAL
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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
              <GitCommit size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Commit Details
              </h2>
              <button
                onClick={handleCopySha}
                className="flex items-center gap-1 text-xs font-mono text-[var(--light-text)] hover:text-[var(--accent-color)] transition cursor-pointer"
              >
                {copied ? (
                  <Check size={10} className="text-green-500" />
                ) : (
                  <Copy size={10} />
                )}
                {sha.slice(0, 7)}
              </button>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            // LOADING STATE
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2
                size={32}
                className="animate-spin text-[var(--accent-color)] mb-3"
              />
              <p className="text-sm text-[var(--light-text)]">
                Loading commit details...
              </p>
            </div>
          ) : isError ? (
            // ERROR STATE
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-sm text-red-500 mb-3">
                Failed to load commit details
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : commit ? (
            <>
              {/* COMMIT MESSAGE */}
              <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-2">
                  {subject}
                </h3>
                {body && (
                  <p className="text-sm text-[var(--light-text)] whitespace-pre-wrap">
                    {body}
                  </p>
                )}
                {/* VERIFICATION */}
                {commit.verified !== undefined && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                    {commit.verified ? (
                      <>
                        <Shield size={14} className="text-green-500" />
                        <span className="text-xs text-green-500">
                          Verified commit
                        </span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={14} className="text-yellow-500" />
                        <span className="text-xs text-yellow-500">
                          Unverified commit
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* AUTHOR INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AUTHOR */}
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <p className="text-xs text-[var(--light-text)] mb-2">Author</p>
                  <div className="flex items-center gap-2">
                    {commit.author.avatarUrl ? (
                      <img
                        src={commit.author.avatarUrl}
                        alt={commit.author.name || "Author"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center">
                        <User size={16} className="text-[var(--accent-color)]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {commit.author.name || commit.author.login || "Unknown"}
                      </p>
                      <p className="text-xs text-[var(--light-text)]">
                        {formatDate(commit.author.date)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* COMMITTER (IF DIFFERENT) */}
                {commit.committer.name !== commit.author.name && (
                  <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <p className="text-xs text-[var(--light-text)] mb-2">
                      Committer
                    </p>
                    <div className="flex items-center gap-2">
                      {commit.committer.avatarUrl ? (
                        <img
                          src={commit.committer.avatarUrl}
                          alt={commit.committer.name || "Committer"}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/15 flex items-center justify-center">
                          <User size={16} className="text-[var(--light-text)]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {commit.committer.name ||
                            commit.committer.login ||
                            "Unknown"}
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          {formatDate(commit.committer.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* STATS */}
              {commit.stats && (
                <div className="flex items-center gap-4 p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileDiff size={16} className="text-[var(--light-text)]" />
                    <span className="text-sm text-[var(--text-primary)]">
                      {commit.files?.length || 0} files changed
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <Plus size={14} />
                    {commit.stats.additions} additions
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <Minus size={14} />
                    {commit.stats.deletions} deletions
                  </div>
                </div>
              )}
              {/* BRANCHES */}
              {(branches && branches.length > 0) || isBranchesLoading ? (
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch size={14} className="text-[var(--light-text)]" />
                    <span className="text-xs text-[var(--light-text)]">
                      Branches containing this commit
                    </span>
                  </div>
                  {isBranchesLoading ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-[var(--accent-color)]"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {branches?.map((branch) => (
                        <span
                          key={branch.name}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                        >
                          <GitBranch size={10} />
                          {branch.name}
                          {branch.protected && (
                            <Shield size={10} className="text-yellow-500" />
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              {/* PULL REQUESTS */}
              {(pullRequests && pullRequests.length > 0) || isPRsLoading ? (
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <GitPullRequest
                      size={14}
                      className="text-[var(--light-text)]"
                    />
                    <span className="text-xs text-[var(--light-text)]">
                      Associated Pull Requests
                    </span>
                  </div>
                  {isPRsLoading ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-[var(--accent-color)]"
                    />
                  ) : (
                    <div className="space-y-2">
                      {pullRequests?.map((pr) => (
                        <a
                          key={pr.number}
                          href={pr.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition"
                        >
                          <GitPullRequest
                            size={14}
                            className={
                              pr.state === "open"
                                ? "text-green-500"
                                : pr.mergedAt
                                  ? "text-purple-500"
                                  : "text-red-500"
                            }
                          />
                          <span className="text-sm text-[var(--text-primary)] flex-1 truncate">
                            #{pr.number} {pr.title}
                          </span>
                          <ExternalLink
                            size={12}
                            className="text-[var(--light-text)]"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              {/* FILES CHANGED */}
              {commit.files && commit.files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[var(--text-primary)]">
                      Files Changed ({commit.files.length})
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setExpandedFiles(
                            new Set(commit.files?.map((f) => f.filename) || [])
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
                    {commit.files.map((file) => (
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
            </>
          ) : null}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {/* PARENT COMMITS */}
            {commit?.parents && commit.parents.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                <span>Parents:</span>
                {commit.parents.map((parent, i) => (
                  <span key={parent.sha}>
                    <a
                      href={parent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[var(--accent-color)] hover:underline"
                    >
                      {parent.sha.slice(0, 7)}
                    </a>
                    {i < commit.parents.length - 1 && ", "}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* VIEW ON GITHUB */}
            {commit?.htmlUrl && (
              <a
                href={commit.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <ExternalLink size={14} />
                View on GitHub
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitDetailsModal;

