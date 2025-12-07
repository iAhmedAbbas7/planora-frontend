// <== IMPORTS ==>
import {
  GitPullRequest,
  ArrowLeft,
  Plus,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  GitMerge,
  GitBranch,
  Clock,
  User,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  ArrowUpDown,
  Send,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Code,
  ChevronRight,
  Circle,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  Bug,
  Lightbulb,
  TestTube,
  ShieldAlert,
  CheckCheck,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryBranches,
  useRepositoryPullRequests,
  usePullRequestDetails,
  usePullRequestComments,
  usePullRequestReviews,
  usePullRequestFiles,
  useCreatePullRequest,
  useMergePullRequest,
  useUpdatePullRequest,
  useAddPullRequestComment,
  useCreatePullRequestReview,
  GitHubPullRequest,
  GitHubBranch,
} from "../hooks/useGitHub";
import { useAICodeReview, AICodeReviewResponse } from "../hooks/useAI";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { JSX, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

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
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  // CHECK DIFF IN MONTHS
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  // RETURN YEARS AGO
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

// <== STATE FILTER OPTIONS ==>
const stateOptions = [
  { value: "open", label: "Open", icon: GitPullRequest },
  { value: "closed", label: "Closed", icon: XCircle },
  { value: "all", label: "All", icon: Filter },
];

// <== SORT OPTIONS ==>
const sortOptions = [
  { value: "created", label: "Newest", icon: Clock },
  { value: "updated", label: "Recently Updated", icon: RefreshCw },
];

// <== PR CARD COMPONENT ==>
type PRCardProps = {
  // <== PR ==>
  pr: GitHubPullRequest;
  // <== ON CLICK ==>
  onClick: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
};

const PRCard = ({ pr, onClick }: PRCardProps): JSX.Element => {
  // GET STATUS COLOR
  const getStatusColor = () => {
    // CHECK IF MERGED
    if (pr.merged) return "text-purple-500";
    // CHECK IF CLOSED
    if (pr.state === "closed") return "text-red-500";
    // CHECK IF DRAFT
    if (pr.draft) return "text-[var(--light-text)]";
    // RETURN OPEN COLOR
    return "text-green-500";
  };
  // GET STATUS ICON
  const getStatusIcon = () => {
    // CHECK IF MERGED
    if (pr.merged) return GitMerge;
    // CHECK IF CLOSED
    if (pr.state === "closed") return XCircle;
    // CHECK IF DRAFT
    if (pr.draft) return Circle;
    // RETURN OPEN ICON
    return GitPullRequest;
  };
  // STATUS ICON
  const StatusIcon = getStatusIcon();
  // RETURN PR CARD
  return (
    <div
      onClick={onClick}
      className="group p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* STATUS ICON */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: pr.merged
              ? "rgba(147, 51, 234, 0.15)"
              : pr.state === "closed"
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(34, 197, 94, 0.15)",
          }}
        >
          <StatusIcon size={20} className={getStatusColor()} />
        </div>
        {/* PR INFO */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-color)] transition">
                {pr.title}
              </h3>
              <p className="text-xs text-[var(--light-text)] mt-1">
                #{pr.number} opened {formatTimeAgo(pr.createdAt)} by{" "}
                {pr.user?.login || "Unknown"}
              </p>
            </div>
            {/* EXTERNAL LINK */}
            <a
              href={pr.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          {/* BRANCH INFO */}
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--light-text)]">
            <GitBranch size={12} className="text-[var(--accent-color)]" />
            <span className="truncate">
              {pr.head?.ref} → {pr.base?.ref}
            </span>
          </div>
          {/* LABELS */}
          {pr.labels && pr.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pr.labels.slice(0, 3).map((label, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 text-[10px] rounded-full"
                  style={{
                    backgroundColor: label.color
                      ? `#${label.color}20`
                      : "var(--inside-card-bg)",
                    color: label.color
                      ? `#${label.color}`
                      : "var(--light-text)",
                  }}
                >
                  {label.name}
                </span>
              ))}
              {pr.labels.length > 3 && (
                <span className="text-[10px] text-[var(--light-text)]">
                  +{pr.labels.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== PR SKELETON COMPONENT ==>
const PRSkeleton = (): JSX.Element => {
  // RETURN PR SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/2 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

// <== FILTER DROPDOWN COMPONENT ==>
type FilterDropdownProps = {
  // <== VALUE ==>
  value: string;
  // <== OPTIONS ==>
  options: { value: string; label: string; icon: React.ElementType }[];
  // <== ON CHANGE ==>
  onChange: (value: string) => void;
  // <== ICON ==>
  icon: React.ElementType;
};

const FilterDropdown = ({
  value,
  options,
  onChange,
  icon: Icon,
}: FilterDropdownProps): JSX.Element => {
  // DROPDOWN STATE
  const [isOpen, setIsOpen] = useState(false);
  // CURRENT LABEL
  const currentOption = options.find((o) => o.value === value) || options[0];
  // RETURN FILTER DROPDOWN
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <Icon size={14} className="text-[var(--accent-color)] flex-shrink-0" />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <ChevronDown
          size={14}
          className={`transition flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 min-w-[150px] bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
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
        </>
      )}
    </div>
  );
};

// <== CREATE PR MODAL COMPONENT ==>
type CreatePRModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCHES ==>
  branches: GitHubBranch[];
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
};

const CreatePRModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branches,
  defaultBranch,
}: CreatePRModalProps): JSX.Element | null => {
  // PULL REQUEST TITLE STATE
  const [title, setTitle] = useState("");
  // PULL REQUEST DESCRIPTION STATE
  const [body, setBody] = useState("");
  // PULL REQUEST SOURCE BRANCH STATE
  const [head, setHead] = useState("");
  // PULL REQUEST TARGET BRANCH STATE
  const [base, setBase] = useState(defaultBranch);
  // PULL REQUEST DRAFT STATE
  const [draft, setDraft] = useState(false);
  // SHOW HEAD DROPDOWN STATE
  const [showHeadDropdown, setShowHeadDropdown] = useState(false);
  // SHOW BASE DROPDOWN STATE
  const [showBaseDropdown, setShowBaseDropdown] = useState(false);
  // CREATE PR MUTATION
  const createPR = useCreatePullRequest();
  // HANDLE CREATE
  const handleCreate = () => {
    // VALIDATE PULL REQUEST TITLE
    if (!title.trim()) {
      // SHOW ERROR TOAST
      toast.error("Title is required");
      // RETURN FROM FUNCTION
      return;
    }
    // VALIDATE PULL REQUEST SOURCE BRANCH
    if (!head) {
      // SHOW ERROR TOAST
      toast.error("Source branch is required");
      // RETURN FROM FUNCTION
      return;
    }
    // VALIDATE PULL REQUEST SOURCE AND TARGET BRANCHES ARE DIFFERENT
    if (head === base) {
      // SHOW ERROR TOAST
      toast.error("Source and target branches must be different");
      // RETURN FROM FUNCTION
      return;
    }
    // CREATE PULL REQUEST
    createPR.mutate(
      { owner, repo, title: title.trim(), body, head, base, draft },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET PULL REQUEST FORM
          setTitle("");
          // RESET PULL REQUEST DESCRIPTION
          setBody("");
          // RESET PULL REQUEST SOURCE BRANCH
          setHead("");
          // RESET PULL REQUEST TARGET BRANCH
          setBase(defaultBranch);
          // RESET PULL REQUEST DRAFT STATE
          setDraft(false);
          // CLOSE CREATE PR MODAL
          onClose();
        },
      }
    );
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF CREATE PR MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN CREATE PR MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <GitPullRequest
                size={20}
                className="text-[var(--accent-color)]"
              />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Create Pull Request
            </h2>
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
          {/* BRANCH SELECTION */}
          <div className="flex items-center gap-2 p-3 bg-[var(--inside-card-bg)] rounded-lg">
            {/* HEAD BRANCH */}
            <div className="flex-1 relative">
              <label className="block text-xs text-[var(--light-text)] mb-1">
                Compare
              </label>
              <button
                onClick={() => {
                  setShowHeadDropdown(!showHeadDropdown);
                  setShowBaseDropdown(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <GitBranch size={12} className="text-[var(--accent-color)]" />
                  {head || "Select branch"}
                </span>
                <ChevronDown size={12} />
              </button>
              {showHeadDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                  {branches
                    .filter((b) => b.name !== base)
                    .map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setHead(b.name);
                          setShowHeadDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          head === b.name
                            ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={12} />
                        <span className="truncate">{b.name}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
            {/* ARROW */}
            <ChevronRight
              size={16}
              className="text-[var(--accent-color)] mt-5"
            />
            {/* BASE BRANCH */}
            <div className="flex-1 relative">
              <label className="block text-xs text-[var(--light-text)] mb-1">
                Base
              </label>
              <button
                onClick={() => {
                  setShowBaseDropdown(!showBaseDropdown);
                  setShowHeadDropdown(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <GitBranch size={12} className="text-[var(--accent-color)]" />
                  {base}
                </span>
                <ChevronDown size={12} />
              </button>
              {showBaseDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                  {branches
                    .filter((b) => b.name !== head)
                    .map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setBase(b.name);
                          setShowBaseDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          base === b.name
                            ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={12} />
                        <span className="truncate">{b.name}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Description
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
            />
          </div>
          {/* DRAFT OPTION */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent-color)]"
            />
            <span className="text-sm text-[var(--text-primary)]">
              Create as draft
            </span>
          </label>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createPR.isPending || !title.trim() || !head}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createPR.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create Pull Request
          </button>
        </div>
      </div>
    </div>
  );
};

// <== PR DETAILS MODAL COMPONENT ==>
type PRDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
};

const PRDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  pullNumber,
}: PRDetailsModalProps): JSX.Element | null => {
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<
    "conversation" | "files" | "reviews" | "ai-review"
  >("conversation");
  // COMMENT INPUT STATE
  const [commentText, setCommentText] = useState("");
  // REVIEW STATE
  const [reviewBody, setReviewBody] = useState("");
  // PULL REQUEST REVIEW EVENT STATE
  const [reviewEvent, setReviewEvent] = useState<
    "APPROVE" | "REQUEST_CHANGES" | "COMMENT"
  >("COMMENT");
  // SHOW REVIEW FORM STATE
  const [showReviewForm, setShowReviewForm] = useState(false);
  // SHOW MERGE OPTIONS STATE
  const [showMergeOptions, setShowMergeOptions] = useState(false);
  // MERGE METHOD STATE
  const [mergeMethod, setMergeMethod] = useState<"merge" | "squash" | "rebase">(
    "merge"
  );
  // AI REVIEW STATE
  const [aiReviewType, setAIReviewType] = useState<
    "comprehensive" | "security" | "performance" | "best-practices"
  >("comprehensive");
  // AI REVIEW RESULT STATE
  const [aiReviewResult, setAIReviewResult] =
    useState<AICodeReviewResponse | null>(null);
  // SHOW AI REVIEW TYPE DROPDOWN STATE
  const [showAIReviewTypeDropdown, setShowAIReviewTypeDropdown] =
    useState(false);
  // AI REVIEW MUTATION
  const aiReview = useAICodeReview();
  // FETCH PULL REQUEST DETAILS
  const { pullRequest, isLoading: isPRLoading } = usePullRequestDetails(
    owner,
    repo,
    pullNumber,
    isOpen
  );
  // FETCH PULL REQUEST COMMENTS
  const { issueComments, isLoading: isCommentsLoading } =
    usePullRequestComments(owner, repo, pullNumber, isOpen);
  // FETCH PULL REQUEST REVIEWS
  const { reviews, isLoading: isReviewsLoading } = usePullRequestReviews(
    owner,
    repo,
    pullNumber,
    isOpen
  );
  // FETCH PULL REQUEST FILES
  const { files, isLoading: isFilesLoading } = usePullRequestFiles(
    owner,
    repo,
    pullNumber,
    isOpen
  );
  // ADD PULL REQUEST COMMENT
  const addComment = useAddPullRequestComment();
  // CREATE PULL REQUEST REVIEW
  const createReview = useCreatePullRequestReview();
  // MERGE PULL REQUEST
  const mergePR = useMergePullRequest();
  // UPDATE PULL REQUEST
  const updatePR = useUpdatePullRequest();
  // HANDLE ADD COMMENT
  const handleAddComment = () => {
    // VALIDATE COMMENT TEXT
    if (!commentText.trim()) return;
    // ADD PULL REQUEST COMMENT
    addComment.mutate(
      { owner, repo, pullNumber, body: commentText.trim() },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET COMMENT TEXT
          setCommentText("");
        },
      }
    );
  };
  // HANDLE SUBMIT REVIEW
  const handleSubmitReview = () => {
    // SUBMIT REVIEW
    createReview.mutate(
      { owner, repo, pullNumber, body: reviewBody, event: reviewEvent },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET REVIEW BODY
          setReviewBody("");
          // CLOSE REVIEW FORM
          setShowReviewForm(false);
        },
      }
    );
  };
  // HANDLE MERGE
  const handleMerge = () => {
    // MERGE PULL REQUEST
    mergePR.mutate(
      { owner, repo, pullNumber, mergeMethod },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // CLOSE MERGE OPTIONS
          setShowMergeOptions(false);
        },
      }
    );
  };
  // HANDLE CLOSE PR
  const handleClosePR = () => {
    // CLOSE PULL REQUEST
    updatePR.mutate({ owner, repo, pullNumber, state: "closed" });
  };
  // HANDLE REOPEN PR
  const handleReopenPR = () => {
    // REOPEN PULL REQUEST
    updatePR.mutate({ owner, repo, pullNumber, state: "open" });
  };
  // HANDLE AI REVIEW
  const handleAIReview = () => {
    // CHECK IF FILES ARE LOADED
    if (files.length === 0) {
      // SHOW ERROR TOAST
      toast.error("No files to review");
      // RETURN FROM FUNCTION
      return;
    }
    // TRIGGER AI CODE REVIEW
    aiReview.mutate(
      {
        files: files.map((f) => ({
          filename: f.filename,
          status: f.status,
          additions: f.additions,
          deletions: f.deletions,
          patch: f.patch,
        })),
        pullRequestInfo: pullRequest
          ? {
              title: pullRequest.title,
              body: pullRequest.body || undefined,
              head: pullRequest.head?.ref || "",
              base: pullRequest.base?.ref || "",
            }
          : undefined,
        reviewType: aiReviewType,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET AI REVIEW RESULT
          setAIReviewResult(data);
        },
      }
    );
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF PR DETAILS MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET STATUS INFO
  const getStatusInfo = () => {
    // CHECK IF MERGED
    if (pullRequest?.merged) {
      return { color: "purple", label: "Merged", icon: GitMerge };
    }
    // CHECK IF CLOSED
    if (pullRequest?.state === "closed") {
      return { color: "red", label: "Closed", icon: XCircle };
    }
    // CHECK IF DRAFT
    if (pullRequest?.draft) {
      return { color: "gray", label: "Draft", icon: Circle };
    }
    // RETURN OPEN
    return { color: "green", label: "Open", icon: GitPullRequest };
  };
  // STATUS INFO
  const statusInfo = getStatusInfo();
  // STATUS ICON
  const StatusIcon = statusInfo.icon;
  // RETURN PULL REQUEST DETAILS MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor:
                  statusInfo.color === "purple"
                    ? "rgba(147, 51, 234, 0.15)"
                    : statusInfo.color === "red"
                    ? "rgba(239, 68, 68, 0.15)"
                    : statusInfo.color === "gray"
                    ? "rgba(107, 114, 128, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
              }}
            >
              <StatusIcon
                size={20}
                className={
                  statusInfo.color === "purple"
                    ? "text-purple-500"
                    : statusInfo.color === "red"
                    ? "text-red-500"
                    : statusInfo.color === "gray"
                    ? "text-gray-500"
                    : "text-green-500"
                }
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-2">
                {isPRLoading ? (
                  <div className="h-5 bg-[var(--light-text)]/10 rounded w-64 animate-pulse" />
                ) : (
                  pullRequest?.title
                )}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-[var(--light-text)]">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    statusInfo.color === "purple"
                      ? "bg-purple-500/15 text-purple-500"
                      : statusInfo.color === "red"
                      ? "bg-red-500/15 text-red-500"
                      : statusInfo.color === "gray"
                      ? "bg-gray-500/15 text-gray-500"
                      : "bg-green-500/15 text-green-500"
                  }`}
                >
                  {statusInfo.label}
                </span>
                <span>#{pullNumber}</span>
                {pullRequest && (
                  <>
                    <span>•</span>
                    <span>
                      {pullRequest.head?.ref} → {pullRequest.base?.ref}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pullRequest?.htmlUrl && (
              <a
                href={pullRequest.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
              >
                <ExternalLink size={18} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* TABS */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-[var(--border)] flex-shrink-0">
          <button
            onClick={() => setActiveTab("conversation")}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "conversation"
                ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            <MessageSquare size={14} />
            Conversation
            {issueComments.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--inside-card-bg)]">
                {issueComments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "files"
                ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FileText size={14} />
            Files
            {pullRequest?.changedFiles && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--inside-card-bg)]">
                {pullRequest.changedFiles}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "reviews"
                ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Eye size={14} />
            Reviews
            {reviews.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--inside-card-bg)]">
                {reviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ai-review")}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "ai-review"
                ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles size={14} />
            AI Review
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* CONVERSATION TAB */}
          {activeTab === "conversation" && (
            <div className="space-y-4">
              {/* PR DESCRIPTION */}
              {pullRequest?.body && (
                <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {pullRequest.user?.avatarUrl ? (
                      <img
                        src={pullRequest.user.avatarUrl}
                        alt={pullRequest.user.login || "Author"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-[var(--light-text)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {pullRequest.user?.login}
                    </span>
                    <span className="text-xs text-[var(--light-text)]">
                      {formatTimeAgo(pullRequest.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                    {pullRequest.body}
                  </p>
                </div>
              )}
              {/* COMMENTS */}
              {isCommentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={24}
                    className="animate-spin text-[var(--accent-color)]"
                  />
                </div>
              ) : issueComments.length === 0 && !pullRequest?.body ? (
                <div className="flex flex-col items-center justify-center py-8 text-[var(--light-text)]">
                  <MessageSquare size={32} className="mb-2" />
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                issueComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {comment.user?.avatarUrl ? (
                        <img
                          src={comment.user.avatarUrl}
                          alt={comment.user.login || "User"}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User size={16} className="text-[var(--light-text)]" />
                      )}
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {comment.user?.login}
                      </span>
                      <span className="text-xs text-[var(--light-text)]">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                ))
              )}
              {/* ADD COMMENT */}
              {pullRequest && pullRequest.state === "open" && (
                <div className="flex gap-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={addComment.isPending || !commentText.trim()}
                    className="px-3 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addComment.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          {/* FILES TAB */}
          {activeTab === "files" && (
            <div className="space-y-2">
              {isFilesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={24}
                    className="animate-spin text-[var(--accent-color)]"
                  />
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-[var(--light-text)]">
                  <FileText size={32} className="mb-2" />
                  <p className="text-sm">No files changed</p>
                </div>
              ) : (
                <>
                  {/* STATS */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="text-[var(--text-primary)]">
                      {files.length} files changed
                    </span>
                    <span className="text-green-500">
                      +{files.reduce((acc, f) => acc + f.additions, 0)}
                    </span>
                    <span className="text-red-500">
                      -{files.reduce((acc, f) => acc + f.deletions, 0)}
                    </span>
                  </div>
                  {/* FILE LIST */}
                  {files.map((file) => (
                    <div
                      key={file.sha}
                      className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Code
                            size={14}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span className="text-sm text-[var(--text-primary)] truncate">
                            {file.filename}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                              file.status === "added"
                                ? "bg-green-500/15 text-green-500"
                                : file.status === "removed"
                                ? "bg-red-500/15 text-red-500"
                                : file.status === "renamed"
                                ? "bg-yellow-500/15 text-yellow-500"
                                : "bg-blue-500/15 text-blue-500"
                            }`}
                          >
                            {file.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-green-500">
                            +{file.additions}
                          </span>
                          <span className="text-red-500">
                            -{file.deletions}
                          </span>
                        </div>
                      </div>
                      {file.patch && (
                        <pre className="mt-2 p-2 text-xs bg-[var(--inside-card-bg)] rounded overflow-x-auto max-h-40">
                          <code className="text-[var(--light-text)]">
                            {file.patch.slice(0, 500)}
                            {file.patch.length > 500 && "..."}
                          </code>
                        </pre>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {isReviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={24}
                    className="animate-spin text-[var(--accent-color)]"
                  />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-[var(--light-text)]">
                  <Eye size={32} className="mb-2" />
                  <p className="text-sm">No reviews yet</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {review.user?.avatarUrl ? (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.login || "Reviewer"}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User size={16} className="text-[var(--light-text)]" />
                      )}
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {review.user?.login}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          review.state === "APPROVED"
                            ? "bg-green-500/15 text-green-500"
                            : review.state === "CHANGES_REQUESTED"
                            ? "bg-red-500/15 text-red-500"
                            : "bg-[var(--inside-card-bg)] text-[var(--light-text)]"
                        }`}
                      >
                        {review.state === "APPROVED"
                          ? "Approved"
                          : review.state === "CHANGES_REQUESTED"
                          ? "Changes Requested"
                          : review.state === "COMMENTED"
                          ? "Commented"
                          : review.state}
                      </span>
                      <span className="text-xs text-[var(--light-text)]">
                        {formatTimeAgo(review.submittedAt)}
                      </span>
                    </div>
                    {review.body && (
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                        {review.body}
                      </p>
                    )}
                  </div>
                ))
              )}
              {/* ADD REVIEW FORM */}
              {pullRequest &&
                pullRequest.state === "open" &&
                !pullRequest.merged && (
                  <>
                    {!showReviewForm ? (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Eye size={14} />
                        Add Review
                      </button>
                    ) : (
                      <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg space-y-3">
                        <textarea
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          placeholder="Leave a review comment..."
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReviewEvent("APPROVE")}
                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition cursor-pointer flex items-center justify-center gap-2 ${
                              reviewEvent === "APPROVE"
                                ? "border-green-500 bg-green-500/15 text-green-500"
                                : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            <ThumbsUp size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => setReviewEvent("REQUEST_CHANGES")}
                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition cursor-pointer flex items-center justify-center gap-2 ${
                              reviewEvent === "REQUEST_CHANGES"
                                ? "border-red-500 bg-red-500/15 text-red-500"
                                : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            <ThumbsDown size={14} />
                            Request Changes
                          </button>
                          <button
                            onClick={() => setReviewEvent("COMMENT")}
                            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition cursor-pointer flex items-center justify-center gap-2 ${
                              reviewEvent === "COMMENT"
                                ? "border-[var(--accent-color)] bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                                : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            <MessageSquare size={14} />
                            Comment
                          </button>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setShowReviewForm(false);
                              setReviewBody("");
                            }}
                            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitReview}
                            disabled={createReview.isPending}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {createReview.isPending && (
                              <Loader2 size={14} className="animate-spin" />
                            )}
                            Submit Review
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
            </div>
          )}
          {/* AI REVIEW TAB */}
          {activeTab === "ai-review" && (
            <div className="space-y-4">
              {/* AI REVIEW TRIGGER */}
              {!aiReviewResult && !aiReview.isPending && (
                <div className="p-6 bg-[var(--inside-card-bg)] rounded-xl text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                    }}
                  >
                    <Sparkles
                      size={32}
                      className="text-[var(--accent-color)]"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    AI Code Review
                  </h3>
                  <p className="text-sm text-[var(--light-text)] mb-4 max-w-md mx-auto">
                    Let AI analyze the code changes in this pull request and
                    provide detailed feedback on quality, security, and best
                    practices.
                  </p>
                  {/* REVIEW TYPE SELECTION */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                    <span className="text-sm text-[var(--light-text)]">
                      Review Type:
                    </span>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowAIReviewTypeDropdown(!showAIReviewTypeDropdown)
                        }
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                      >
                        {aiReviewType === "comprehensive" && (
                          <BookOpen
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                        {aiReviewType === "security" && (
                          <Shield
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                        {aiReviewType === "performance" && (
                          <Zap
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                        {aiReviewType === "best-practices" && (
                          <CheckCheck
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                        <span className="capitalize">
                          {aiReviewType.replace("-", " ")}
                        </span>
                        <ChevronDown size={14} />
                      </button>
                      {showAIReviewTypeDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowAIReviewTypeDropdown(false)}
                          />
                          <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                            <button
                              onClick={() => {
                                setAIReviewType("comprehensive");
                                setShowAIReviewTypeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                                aiReviewType === "comprehensive"
                                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                              }`}
                            >
                              <BookOpen
                                size={14}
                                className={
                                  aiReviewType === "comprehensive"
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              Comprehensive
                            </button>
                            <button
                              onClick={() => {
                                setAIReviewType("security");
                                setShowAIReviewTypeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                                aiReviewType === "security"
                                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                              }`}
                            >
                              <Shield
                                size={14}
                                className={
                                  aiReviewType === "security"
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              Security
                            </button>
                            <button
                              onClick={() => {
                                setAIReviewType("performance");
                                setShowAIReviewTypeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                                aiReviewType === "performance"
                                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                              }`}
                            >
                              <Zap
                                size={14}
                                className={
                                  aiReviewType === "performance"
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              Performance
                            </button>
                            <button
                              onClick={() => {
                                setAIReviewType("best-practices");
                                setShowAIReviewTypeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                                aiReviewType === "best-practices"
                                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                              }`}
                            >
                              <CheckCheck
                                size={14}
                                className={
                                  aiReviewType === "best-practices"
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              Best Practices
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* GENERATE REVIEW BUTTON */}
                  <button
                    onClick={handleAIReview}
                    disabled={files.length === 0 || isFilesLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={16} />
                    Generate AI Review
                  </button>
                  {files.length === 0 && !isFilesLoading && (
                    <p className="mt-3 text-xs text-[var(--light-text)]">
                      No files to review. Make sure the PR has file changes.
                    </p>
                  )}
                </div>
              )}
              {/* AI REVIEW LOADING */}
              {aiReview.isPending && (
                <div className="p-8 bg-[var(--inside-card-bg)] rounded-xl text-center">
                  <Loader2
                    size={40}
                    className="animate-spin text-[var(--accent-color)] mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Analyzing Code Changes...
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    AI is reviewing {files.length} file
                    {files.length !== 1 ? "s" : ""}. This may take a moment.
                  </p>
                </div>
              )}
              {/* AI REVIEW RESULTS */}
              {aiReviewResult && !aiReview.isPending && (
                <div className="space-y-4">
                  {/* SUMMARY CARD */}
                  <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              aiReviewResult.review.overallRating === "approve"
                                ? "bg-green-500/15 text-green-500"
                                : aiReviewResult.review.overallRating ===
                                  "request_changes"
                                ? "bg-red-500/15 text-red-500"
                                : "bg-yellow-500/15 text-yellow-500"
                            }`}
                          >
                            {aiReviewResult.review.overallRating === "approve"
                              ? "✓ Looks Good"
                              : aiReviewResult.review.overallRating ===
                                "request_changes"
                              ? "⚠ Changes Needed"
                              : "💬 Comments"}
                          </span>
                          <span className="text-xs text-[var(--light-text)]">
                            {aiReviewResult.filesReviewed} of{" "}
                            {aiReviewResult.totalFiles} files reviewed
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)]">
                          {aiReviewResult.review.summary}
                        </p>
                        <p className="text-xs text-[var(--light-text)] mt-1">
                          {aiReviewResult.review.ratingReason}
                        </p>
                      </div>
                      <button
                        onClick={() => setAIReviewResult(null)}
                        className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                        title="Run new review"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                  {/* ISSUES */}
                  {aiReviewResult.review.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <Bug size={14} className="text-[var(--accent-color)]" />
                        Issues ({aiReviewResult.review.issues.length})
                      </h4>
                      {aiReviewResult.review.issues.map((issue, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            issue.severity === "critical"
                              ? "bg-red-500/5 border-red-500/20"
                              : issue.severity === "warning"
                              ? "bg-yellow-500/5 border-yellow-500/20"
                              : issue.severity === "suggestion"
                              ? "bg-blue-500/5 border-blue-500/20"
                              : "bg-[var(--cards-bg)] border-[var(--border)]"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                                issue.severity === "critical"
                                  ? "bg-red-500/15 text-red-500"
                                  : issue.severity === "warning"
                                  ? "bg-yellow-500/15 text-yellow-500"
                                  : issue.severity === "suggestion"
                                  ? "bg-blue-500/15 text-blue-500"
                                  : "bg-[var(--inside-card-bg)] text-[var(--light-text)]"
                              }`}
                            >
                              {issue.severity}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                  {issue.title}
                                </span>
                                <span className="text-xs text-[var(--light-text)]">
                                  {issue.file}
                                  {issue.line && `:${issue.line}`}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--light-text)] mt-1">
                                {issue.description}
                              </p>
                              {issue.suggestion && (
                                <div className="mt-2 p-2 bg-[var(--bg)] rounded text-xs">
                                  <span className="text-[var(--accent-color)] font-medium">
                                    Suggestion:
                                  </span>{" "}
                                  <span className="text-[var(--text-primary)]">
                                    {issue.suggestion}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* POSITIVES */}
                  {aiReviewResult.review.positives.length > 0 && (
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-green-500 flex items-center gap-2 mb-2">
                        <ThumbsUp size={14} />
                        Good Practices Found
                      </h4>
                      <ul className="space-y-1">
                        {aiReviewResult.review.positives.map(
                          (positive, index) => (
                            <li
                              key={index}
                              className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                            >
                              <CheckCircle
                                size={12}
                                className="text-green-500 mt-0.5 flex-shrink-0"
                              />
                              {positive}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {/* SUGGESTIONS */}
                  {aiReviewResult.review.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <Lightbulb
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                        Suggestions
                      </h4>
                      <div className="grid gap-2">
                        {aiReviewResult.review.suggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg"
                            >
                              <span
                                className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded mb-1 ${
                                  suggestion.category === "security"
                                    ? "bg-red-500/15 text-red-500"
                                    : suggestion.category === "performance"
                                    ? "bg-yellow-500/15 text-yellow-500"
                                    : suggestion.category === "testing"
                                    ? "bg-purple-500/15 text-purple-500"
                                    : suggestion.category === "documentation"
                                    ? "bg-blue-500/15 text-blue-500"
                                    : "bg-[var(--inside-card-bg)] text-[var(--light-text)]"
                                }`}
                              >
                                {suggestion.category}
                              </span>
                              <p className="text-xs text-[var(--text-primary)]">
                                {suggestion.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {/* TESTING RECOMMENDATIONS */}
                  {aiReviewResult.review.testingRecommendations.length > 0 && (
                    <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-purple-500 flex items-center gap-2 mb-2">
                        <TestTube size={14} />
                        Testing Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {aiReviewResult.review.testingRecommendations.map(
                          (rec, index) => (
                            <li
                              key={index}
                              className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                            >
                              <span className="text-purple-500 mt-0.5">•</span>
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {/* SECURITY NOTES */}
                  {aiReviewResult.review.securityNotes.length > 0 && (
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-red-500 flex items-center gap-2 mb-2">
                        <ShieldAlert size={14} />
                        Security Notes
                      </h4>
                      <ul className="space-y-1">
                        {aiReviewResult.review.securityNotes.map(
                          (note, index) => (
                            <li
                              key={index}
                              className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                            >
                              <AlertCircle
                                size={12}
                                className="text-red-500 mt-0.5 flex-shrink-0"
                              />
                              {note}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* FOOTER - ACTION BUTTONS */}
        {pullRequest && !pullRequest.merged && (
          <div className="flex items-center justify-between gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
            <div>
              {pullRequest.state === "open" ? (
                <button
                  onClick={handleClosePR}
                  disabled={updatePR.isPending}
                  className="px-3 py-1.5 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePR.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <XCircle size={14} />
                  Close PR
                </button>
              ) : (
                <button
                  onClick={handleReopenPR}
                  disabled={updatePR.isPending}
                  className="px-3 py-1.5 text-sm rounded-lg text-green-500 hover:bg-green-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePR.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <GitPullRequest size={14} />
                  Reopen PR
                </button>
              )}
            </div>
            {pullRequest.state === "open" && (
              <div className="relative">
                <button
                  onClick={() => setShowMergeOptions(!showMergeOptions)}
                  disabled={
                    pullRequest.mergeable === false || mergePR.isPending
                  }
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {mergePR.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <GitMerge size={14} />
                  )}
                  Merge Pull Request
                  <ChevronDown size={14} />
                </button>
                {showMergeOptions && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMergeOptions(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-1 w-56 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                      <button
                        onClick={() => {
                          setMergeMethod("merge");
                          handleMerge();
                        }}
                        className="w-full flex items-start gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--hover-bg)] transition cursor-pointer"
                      >
                        <GitMerge
                          size={14}
                          className="text-[var(--accent-color)] mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            Merge commit
                          </p>
                          <p className="text-xs text-[var(--light-text)]">
                            All commits will be added
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setMergeMethod("squash");
                          handleMerge();
                        }}
                        className="w-full flex items-start gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--hover-bg)] transition cursor-pointer"
                      >
                        <GitMerge
                          size={14}
                          className="text-[var(--accent-color)] mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            Squash and merge
                          </p>
                          <p className="text-xs text-[var(--light-text)]">
                            Commits will be squashed
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setMergeMethod("rebase");
                          handleMerge();
                        }}
                        className="w-full flex items-start gap-2 px-3 py-2 text-sm text-left hover:bg-[var(--hover-bg)] transition cursor-pointer"
                      >
                        <GitMerge
                          size={14}
                          className="text-[var(--accent-color)] mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            Rebase and merge
                          </p>
                          <p className="text-xs text-[var(--light-text)]">
                            Commits will be rebased
                          </p>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// <== GITHUB PULL REQUESTS PAGE COMPONENT ==>
const GitHubPullRequestsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Pull Requests - ${owner}/${repo}`);
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // FILTER STATE
  const [stateFilter, setStateFilter] = useState("open");
  // SORT FILTER STATE
  const [sortFilter, setSortFilter] = useState("created");
  // PAGE STATE
  const [page, setPage] = useState(1);
  // MODAL STATE
  const [showCreateModal, setShowCreateModal] = useState(false);
  // SELECTED PULL REQUEST STATE
  const [selectedPR, setSelectedPR] = useState<number | null>(null);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH BRANCHES
  const { branches } = useRepositoryBranches(owner || "", repo || "");
  // FETCH PULL REQUESTS
  const {
    pullRequests,
    hasMore,
    isLoading: isPRsLoading,
    refetch,
  } = useRepositoryPullRequests(
    owner || "",
    repo || "",
    stateFilter,
    page,
    20,
    true
  );
  // FILTER PULL REQUESTS BY SEARCH
  const filteredPRs = pullRequests.filter(
    (pr) =>
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.number.toString().includes(searchQuery) ||
      pr.user?.login?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Pull Requests"
          subtitle={`${owner}/${repo}`}
          showSearch={false}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <PRSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN PULL REQUESTS PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Pull Requests"
        subtitle={`${owner}/${repo}`}
        showSearch={false}
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
            <span className="text-sm text-[var(--light-text)]">
              {pullRequests.length} pull request
              {pullRequests.length !== 1 ? "s" : ""}
            </span>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* STATE FILTER */}
            <FilterDropdown
              value={stateFilter}
              options={stateOptions}
              onChange={(value) => {
                setStateFilter(value);
                setPage(1);
              }}
              icon={Filter}
            />
            {/* SORT FILTER */}
            <FilterDropdown
              value={sortFilter}
              options={sortOptions}
              onChange={(value) => {
                setSortFilter(value);
                setPage(1);
              }}
              icon={ArrowUpDown}
            />
            {/* CREATE PR BUTTON */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Pull Request</span>
            </button>
            {/* REFRESH BUTTON */}
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
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
            placeholder="Search pull requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-[var(--border)] rounded-xl bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {/* PULL REQUESTS LIST */}
        <div className="space-y-3">
          {isPRsLoading ? (
            [1, 2, 3, 4, 5].map((i) => <PRSkeleton key={i} />)
          ) : filteredPRs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <GitPullRequest
                size={40}
                className="text-[var(--light-text)] mb-3"
              />
              <p className="text-sm text-[var(--light-text)]">
                {searchQuery
                  ? "No pull requests match your search"
                  : "No pull requests found"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {filteredPRs.map((pr) => (
                <PRCard
                  key={pr.id}
                  pr={pr}
                  onClick={() => setSelectedPR(pr.number)}
                  owner={owner || ""}
                  repo={repo || ""}
                />
              ))}
              {/* PAGINATION */}
              {(hasMore || page > 1) && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[var(--light-text)]">
                    Page {page}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* CREATE PR MODAL */}
      <CreatePRModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        branches={branches}
        defaultBranch={repository?.defaultBranch || "main"}
      />
      {/* PR DETAILS MODAL */}
      <PRDetailsModal
        isOpen={!!selectedPR}
        onClose={() => setSelectedPR(null)}
        owner={owner || ""}
        repo={repo || ""}
        pullNumber={selectedPR || 0}
      />
    </div>
  );
};

export default GitHubPullRequestsPage;
