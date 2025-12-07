// <== IMPORTS ==>
import {
  CircleDot,
  ArrowLeft,
  Plus,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  Filter,
  ArrowUpDown,
  Send,
  Tag,
  Sparkles,
  Lightbulb,
  Copy,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryIssues,
  useIssueDetails,
  useIssueComments,
  useCreateIssue,
  useUpdateIssue,
  useAddIssueComment,
  useRepositoryLabels,
  useSearchIssues,
  GitHubIssue,
  RepositoryLabel,
} from "../hooks/useGitHub";
import {
  useAIIssueAnalyzer,
  useAIGenerateIssue,
  AIIssueAnalysisResponse,
} from "../hooks/useAI";
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
  { value: "open", label: "Open", icon: CircleDot },
  { value: "closed", label: "Closed", icon: CheckCircle },
  { value: "all", label: "All", icon: Filter },
];

// <== SORT OPTIONS ==>
const sortOptions = [
  { value: "created", label: "Newest", icon: Clock },
  { value: "updated", label: "Recently Updated", icon: RefreshCw },
  { value: "comments", label: "Most Comments", icon: MessageSquare },
];

// <== ISSUE CARD COMPONENT ==>
type IssueCardProps = {
  // <== ISSUE ==>
  issue: GitHubIssue;
  // <== ON CLICK ==>
  onClick: () => void;
};

const IssueCard = ({ issue, onClick }: IssueCardProps): JSX.Element => {
  // GET STATUS COLOR
  const getStatusColor = () => {
    // CHECK IF CLOSED
    if (issue.state === "closed") return "text-purple-500";
    // RETURN OPEN COLOR
    return "text-green-500";
  };
  // GET STATUS ICON
  const getStatusIcon = () => {
    // CHECK IF CLOSED
    if (issue.state === "closed") return CheckCircle;
    // RETURN OPEN ICON
    return CircleDot;
  };
  // STATUS ICON
  const StatusIcon = getStatusIcon();
  // RETURN ISSUE CARD
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
            backgroundColor:
              issue.state === "closed"
                ? "rgba(147, 51, 234, 0.15)"
                : "rgba(34, 197, 94, 0.15)",
          }}
        >
          <StatusIcon size={20} className={getStatusColor()} />
        </div>
        {/* ISSUE INFO */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-color)] transition">
                {issue.title}
              </h3>
              <p className="text-xs text-[var(--light-text)] mt-1">
                #{issue.number} opened {formatTimeAgo(issue.createdAt)} by{" "}
                {issue.user?.login || "Unknown"}
              </p>
            </div>
            {/* EXTERNAL LINK */}
            <a
              href={issue.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          {/* META INFO */}
          <div className="flex items-center gap-3 mt-2">
            {/* COMMENTS */}
            {issue.commentsCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                <MessageSquare size={12} />
                <span>{issue.commentsCount}</span>
              </div>
            )}
            {/* ASSIGNEES */}
            {issue.assignees && issue.assignees.length > 0 && (
              <div className="flex items-center -space-x-1.5">
                {issue.assignees.slice(0, 3).map((assignee, index) => (
                  <img
                    key={index}
                    src={assignee.avatarUrl}
                    alt={assignee.login}
                    className="w-5 h-5 rounded-full border-2 border-[var(--cards-bg)]"
                    title={assignee.login}
                  />
                ))}
                {issue.assignees.length > 3 && (
                  <span className="text-[10px] text-[var(--light-text)] ml-1">
                    +{issue.assignees.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* LABELS */}
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {issue.labels.slice(0, 4).map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded border"
                  style={{
                    borderColor: label.color
                      ? `#${label.color}`
                      : "var(--border)",
                    backgroundColor: label.color
                      ? `#${label.color}15`
                      : "var(--inside-card-bg)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: label.color
                        ? `#${label.color}`
                        : "var(--light-text)",
                    }}
                  />
                  <span className="text-[var(--text-primary)]">
                    {label.name}
                  </span>
                </span>
              ))}
              {issue.labels.length > 4 && (
                <span className="text-[10px] text-[var(--light-text)]">
                  +{issue.labels.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== ISSUE SKELETON COMPONENT ==>
const IssueSkeleton = (): JSX.Element => {
  // RETURN ISSUE SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/2 mb-2" />
          <div className="flex gap-1 mt-2">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-12" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-16" />
          </div>
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

// <== CREATE ISSUE MODAL COMPONENT ==>
type CreateIssueModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== LABELS ==>
  labels: RepositoryLabel[];
};

const CreateIssueModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  labels,
}: CreateIssueModalProps): JSX.Element | null => {
  // ISSUE TITLE STATE
  const [title, setTitle] = useState("");
  // ISSUE DESCRIPTION STATE
  const [body, setBody] = useState("");
  // SELECTED LABELS STATE
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  // SHOW LABELS DROPDOWN STATE
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  // AI STATE
  const [showAIHelper, setShowAIHelper] = useState(false);
  // AI DESCRIPTION STATE
  const [aiDescription, setAIDescription] = useState("");
  // AI ISSUE TYPE STATE
  const [aiIssueType, setAIIssueType] = useState<
    "bug" | "feature" | "documentation" | "question"
  >("bug");
  // CREATE ISSUE MUTATION
  const createIssue = useCreateIssue();
  // AI GENERATE ISSUE MUTATION
  const generateIssue = useAIGenerateIssue();
  // HANDLE CREATE
  const handleCreate = () => {
    // VALIDATE TITLE
    if (!title.trim()) {
      // SHOW ERROR TOAST
      toast.error("Title is required");
      // RETURN
      return;
    }
    // CREATE ISSUE MUTATION
    createIssue.mutate(
      {
        owner,
        repo,
        title: title.trim(),
        body: body || undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET ISSUE TITLE
          setTitle("");
          // RESET ISSUE DESCRIPTION
          setBody("");
          // RESET SELECTED LABELS
          setSelectedLabels([]);
          // CLOSE CREATE ISSUE MODAL
          onClose();
        },
      }
    );
  };
  // HANDLE AI GENERATE
  const handleAIGenerate = () => {
    // VALIDATE DESCRIPTION
    if (!aiDescription.trim()) {
      // SHOW ERROR TOAST
      toast.error("Please describe the issue");
      // RETURN
      return;
    }
    // GENERATE ISSUE MUTATION
    generateIssue.mutate(
      {
        description: aiDescription.trim(),
        issueType: aiIssueType,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET GENERATED ISSUE TITLE
          setTitle(data.title);
          // SET GENERATED ISSUE DESCRIPTION
          setBody(data.body);
          // SET GENERATED ISSUE LABELS
          setSelectedLabels(
            data.suggestedLabels.filter((l) =>
              labels.some((label) => label.name === l)
            )
          );
          // HIDE AI HELPER
          setShowAIHelper(false);
          // RESET AI DESCRIPTION
          setAIDescription("");
          // HIDE AI HELPER
          setShowAIHelper(false);
        },
      }
    );
  };
  // TOGGLE LABEL
  const toggleLabel = (labelName: string) => {
    // SET SELECTED LABELS
    setSelectedLabels((prev) =>
      // IF LABEL IS ALREADY SELECTED, REMOVE IT
      prev.includes(labelName)
        ? prev.filter((l) => l !== labelName)
        : // IF LABEL IS NOT SELECTED, ADD IT
          [...prev, labelName]
    );
  };
  // CAPITALIZE LABEL NAME
  const capitalizeLabel = (name: string) => {
    // CAPITALIZE LABEL NAME
    return name
      .split(/[-_\s]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  // CLEAR ALL LABELS
  const clearAllLabels = () => {
    // CLEAR ALL LABELS
    setSelectedLabels([]);
  };
  // LOCK BODY SCROLL AND RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET ISSUE TITLE
      setTitle("");
      // RESET ISSUE DESCRIPTION
      setBody("");
      // RESET SELECTED LABELS
      setSelectedLabels([]);
      // HIDE LABELS DROPDOWN
      setShowLabelsDropdown(false);
      // HIDE AI HELPER
      setShowAIHelper(false);
      // RESET AI DESCRIPTION
      setAIDescription("");
    }
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN CREATE ISSUE MODAL
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
              <CircleDot size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Create Issue
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAIHelper(!showAIHelper)}
              className={`p-2 rounded-lg transition cursor-pointer ${
                showAIHelper
                  ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
              title="AI Helper"
            >
              <Sparkles size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* AI HELPER */}
          {showAIHelper && (
            <div className="p-4 bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--accent-color)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  AI Issue Generator
                </span>
              </div>
              <p className="text-xs text-[var(--light-text)]">
                Describe your issue in plain language and let AI create a
                well-structured issue for you.
              </p>
              <textarea
                value={aiDescription}
                onChange={(e) => setAIDescription(e.target.value)}
                placeholder="e.g., The login button doesn't work on mobile devices when using Safari browser..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {(
                    ["bug", "feature", "documentation", "question"] as const
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => setAIIssueType(type)}
                      className={`px-2 py-1 text-xs rounded-lg border transition cursor-pointer capitalize ${
                        aiIssueType === type
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                          : "border-[var(--border)] text-[var(--light-text)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAIGenerate}
                  disabled={generateIssue.isPending || !aiDescription.trim()}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {generateIssue.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  Generate
                </button>
              </div>
            </div>
          )}
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
              placeholder="Add a description... (Supports Markdown)"
              rows={6}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none font-mono"
            />
          </div>
          {/* LABELS */}
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Labels
            </label>
            <button
              onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Tag size={14} className="text-[var(--accent-color)]" />
                {selectedLabels.length > 0
                  ? `${selectedLabels.length} selected`
                  : "Select labels"}
              </span>
              <ChevronDown size={14} />
            </button>
            {showLabelsDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLabelsDropdown(false)}
                />
                <div className="absolute bottom-full left-0 mb-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                        selectedLabels.includes(label.name)
                          ? "bg-[var(--accent-color)]/10"
                          : "hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `#${label.color}` }}
                      />
                      <span className="flex-1 text-[var(--text-primary)]">
                        {capitalizeLabel(label.name)}
                      </span>
                      {selectedLabels.includes(label.name) && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  ))}
                  {labels.length === 0 && (
                    <p className="px-3 py-2 text-sm text-[var(--light-text)]">
                      No labels available
                    </p>
                  )}
                </div>
              </>
            )}
            {/* SELECTED LABELS DISPLAY */}
            {selectedLabels.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[var(--light-text)]">
                    {selectedLabels.length} label
                    {selectedLabels.length > 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={clearAllLabels}
                    className="text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
                  >
                    Remove all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLabels.map((labelName) => {
                    const label = labels.find((l) => l.name === labelName);
                    return (
                      <span
                        key={labelName}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border"
                        style={{
                          borderColor: label?.color
                            ? `#${label.color}`
                            : "var(--border)",
                          backgroundColor: label?.color
                            ? `#${label.color}15`
                            : "var(--inside-card-bg)",
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: label?.color
                              ? `#${label.color}`
                              : "var(--light-text)",
                          }}
                        />
                        <span className="text-[var(--text-primary)]">
                          {capitalizeLabel(labelName)}
                        </span>
                        <button
                          onClick={() => toggleLabel(labelName)}
                          className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                        >
                          <X size={10} className="text-[var(--light-text)]" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
            disabled={createIssue.isPending || !title.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createIssue.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
};

// <== ISSUE DETAILS MODAL COMPONENT ==>
type IssueDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== ISSUE NUMBER ==>
  issueNumber: number;
  // <== LABELS ==>
  labels: RepositoryLabel[];
  // <== EXISTING ISSUES ==>
  existingIssues: GitHubIssue[];
};

const IssueDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  issueNumber,
  labels,
  existingIssues,
}: IssueDetailsModalProps): JSX.Element | null => {
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"conversation" | "ai-analysis">(
    "conversation"
  );
  // COMMENT INPUT STATE
  const [commentText, setCommentText] = useState("");
  // AI ANALYSIS STATE
  const [aiAnalysis, setAIAnalysis] = useState<AIIssueAnalysisResponse | null>(
    null
  );
  // FETCH DATA
  const { issue, isLoading: isIssueLoading } = useIssueDetails(
    owner,
    repo,
    issueNumber,
    isOpen
  );
  // FETCH ISSUE COMMENTS
  const { comments, isLoading: isCommentsLoading } = useIssueComments(
    owner,
    repo,
    issueNumber,
    1,
    100,
    isOpen
  );
  // ADD ISSUE COMMENT MUTATION
  const addComment = useAddIssueComment();
  // UPDATE ISSUE MUTATION
  const updateIssue = useUpdateIssue();
  // AI ANALYZE ISSUE MUTATION
  const analyzeIssue = useAIIssueAnalyzer();
  // HANDLE ADD COMMENT
  const handleAddComment = () => {
    // VALIDATE COMMENT TEXT
    if (!commentText.trim()) {
      // SHOW ERROR TOAST
      toast.error("Comment is required");
      // RETURN
      return;
    }
    // ADD COMMENT
    addComment.mutate(
      { owner, repo, issueNumber, body: commentText.trim() },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET COMMENT TEXT
          setCommentText("");
        },
      }
    );
  };
  // HANDLE CLOSE ISSUE
  const handleCloseIssue = () => {
    updateIssue.mutate({
      owner,
      repo,
      issueNumber,
      state: "closed",
      stateReason: "completed",
    });
  };
  // HANDLE REOPEN ISSUE
  const handleReopenIssue = () => {
    updateIssue.mutate({
      owner,
      repo,
      issueNumber,
      state: "open",
      stateReason: "reopened",
    });
  };
  // HANDLE AI ANALYSIS
  const handleAIAnalysis = () => {
    // CHECK IF ISSUE IS LOADED
    if (!issue) return;
    // ANALYZE ISSUE
    analyzeIssue.mutate(
      {
        issue: {
          title: issue.title,
          body: issue.body || undefined,
        },
        existingIssues: existingIssues
          .filter((i) => i.number !== issueNumber)
          .map((i) => ({
            number: i.number,
            title: i.title,
            labels: i.labels
              ?.map((l) => l.name)
              .filter((n): n is string => n !== null),
            state: i.state,
          })),
        availableLabels: labels.map((l) => ({
          name: l.name,
          description: l.description || undefined,
        })),
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET AI ANALYSIS
          setAIAnalysis(data);
        },
      }
    );
  };
  // APPLY AI LABELS
  const handleApplyAILabels = () => {
    // CHECK IF AI ANALYSIS EXISTS
    if (!aiAnalysis) return;
    // UPDATE ISSUE WITH SUGGESTED LABELS
    updateIssue.mutate({
      owner,
      repo,
      issueNumber,
      labels: aiAnalysis.analysis.suggestedLabels,
    });
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // RESET AI ANALYSIS WHEN MODAL CLOSES
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (!isOpen) {
      // RESET AI ANALYSIS
      setAIAnalysis(null);
      // SET ACTIVE TAB TO CONVERSATION
      setActiveTab("conversation");
    }
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN ISSUE DETAILS MODAL
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
                  issue?.state === "closed"
                    ? "rgba(147, 51, 234, 0.15)"
                    : "rgba(34, 197, 94, 0.15)",
              }}
            >
              {issue?.state === "closed" ? (
                <CheckCircle size={20} className="text-purple-500" />
              ) : (
                <CircleDot size={20} className="text-green-500" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-2">
                {isIssueLoading ? (
                  <div className="h-5 bg-[var(--light-text)]/10 rounded w-64 animate-pulse" />
                ) : (
                  issue?.title
                )}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-[var(--light-text)]">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    issue?.state === "closed"
                      ? "bg-purple-500/15 text-purple-500"
                      : "bg-green-500/15 text-green-500"
                  }`}
                >
                  {issue?.state === "closed" ? "Closed" : "Open"}
                </span>
                <span>#{issueNumber}</span>
                {issue && (
                  <>
                    <span>•</span>
                    <span>{formatTimeAgo(issue.createdAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {issue?.htmlUrl && (
              <a
                href={issue.htmlUrl}
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
            {comments.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--inside-card-bg)]">
                {comments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ai-analysis")}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "ai-analysis"
                ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
                : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles size={14} />
            AI Analysis
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* CONVERSATION TAB */}
          {activeTab === "conversation" && (
            <div className="space-y-4">
              {/* ISSUE BODY */}
              {issue?.body && (
                <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {issue.user?.avatarUrl ? (
                      <img
                        src={issue.user.avatarUrl}
                        alt={issue.user.login || "Author"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-[var(--light-text)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {issue.user?.login}
                    </span>
                    <span className="text-xs text-[var(--light-text)]">
                      {formatTimeAgo(issue.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                    {issue.body}
                  </p>
                </div>
              )}
              {/* LABELS */}
              {issue?.labels && issue.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {issue.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border"
                      style={{
                        borderColor: label.color
                          ? `#${label.color}`
                          : "var(--border)",
                        backgroundColor: label.color
                          ? `#${label.color}15`
                          : "var(--inside-card-bg)",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: label.color
                            ? `#${label.color}`
                            : "var(--light-text)",
                        }}
                      />
                      <span className="text-[var(--text-primary)]">
                        {label.name}
                      </span>
                    </span>
                  ))}
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
              ) : comments.length === 0 && !issue?.body ? (
                <div className="flex flex-col items-center justify-center py-8 text-[var(--light-text)]">
                  <MessageSquare size={32} className="mb-2" />
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
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
              {issue && issue.state === "open" && (
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
          {/* AI ANALYSIS TAB */}
          {activeTab === "ai-analysis" && (
            <div className="space-y-4">
              {/* TRIGGER AI ANALYSIS */}
              {!aiAnalysis && !analyzeIssue.isPending && (
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
                    AI Issue Analysis
                  </h3>
                  <p className="text-sm text-[var(--light-text)] mb-4 max-w-md mx-auto">
                    Get AI-powered insights including suggested labels,
                    potential duplicates, priority assessment, and solution
                    suggestions.
                  </p>
                  <button
                    onClick={handleAIAnalysis}
                    disabled={!issue}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={16} />
                    Analyze Issue
                  </button>
                </div>
              )}
              {/* AI ANALYSIS LOADING */}
              {analyzeIssue.isPending && (
                <div className="p-8 bg-[var(--inside-card-bg)] rounded-xl text-center">
                  <Loader2
                    size={40}
                    className="animate-spin text-[var(--accent-color)] mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    Analyzing Issue...
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    AI is reviewing the issue content and comparing with
                    existing issues.
                  </p>
                </div>
              )}
              {/* AI ANALYSIS RESULTS */}
              {aiAnalysis && !analyzeIssue.isPending && (
                <div className="space-y-4">
                  {/* SUGGESTED LABELS */}
                  {aiAnalysis.analysis.suggestedLabels.length > 0 && (
                    <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                          <Tag
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                          Suggested Labels
                        </h4>
                        <button
                          onClick={handleApplyAILabels}
                          disabled={updateIssue.isPending}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {updateIssue.isPending ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Check size={10} />
                          )}
                          Apply
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.analysis.suggestedLabels.map(
                          (labelName, index) => {
                            const label = labels.find(
                              (l) => l.name === labelName
                            );
                            return (
                              <div key={index} className="flex flex-col">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border"
                                  style={{
                                    borderColor: label?.color
                                      ? `#${label.color}`
                                      : "var(--border)",
                                    backgroundColor: label?.color
                                      ? `#${label.color}15`
                                      : "var(--cards-bg)",
                                  }}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor: label?.color
                                        ? `#${label.color}`
                                        : "var(--light-text)",
                                    }}
                                  />
                                  <span className="text-[var(--text-primary)]">
                                    {labelName}
                                  </span>
                                </span>
                                {aiAnalysis.analysis.labelReasons[
                                  labelName
                                ] && (
                                  <span className="text-[10px] text-[var(--light-text)] mt-0.5 max-w-32 truncate">
                                    {
                                      aiAnalysis.analysis.labelReasons[
                                        labelName
                                      ]
                                    }
                                  </span>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                  {/* PRIORITY & CATEGORY */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                        <AlertTriangle
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                        Priority
                      </h4>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          aiAnalysis.analysis.priority === "critical"
                            ? "bg-red-500/15 text-red-500"
                            : aiAnalysis.analysis.priority === "high"
                            ? "bg-orange-500/15 text-orange-500"
                            : aiAnalysis.analysis.priority === "medium"
                            ? "bg-yellow-500/15 text-yellow-500"
                            : "bg-green-500/15 text-green-500"
                        }`}
                      >
                        {aiAnalysis.analysis.priority}
                      </span>
                      <p className="text-xs text-[var(--light-text)] mt-1">
                        {aiAnalysis.analysis.priorityReason}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl">
                      <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
                        <BookOpen
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                        Category
                      </h4>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)] capitalize">
                        {aiAnalysis.analysis.category}
                      </span>
                      <p className="text-xs text-[var(--light-text)] mt-1">
                        {aiAnalysis.analysis.categoryReason}
                      </p>
                    </div>
                  </div>
                  {/* POTENTIAL DUPLICATES */}
                  {aiAnalysis.analysis.potentialDuplicates.length > 0 && (
                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-yellow-600 flex items-center gap-2 mb-3">
                        <Copy size={14} />
                        Potential Duplicates
                      </h4>
                      <div className="space-y-2">
                        {aiAnalysis.analysis.potentialDuplicates.map(
                          (dup, index) => (
                            <div
                              key={index}
                              className="p-2 bg-[var(--cards-bg)] rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                  #{dup.issueNumber}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 text-[10px] rounded ${
                                    dup.similarity === "high"
                                      ? "bg-red-500/15 text-red-500"
                                      : dup.similarity === "medium"
                                      ? "bg-yellow-500/15 text-yellow-500"
                                      : "bg-green-500/15 text-green-500"
                                  }`}
                                >
                                  {dup.similarity}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-primary)] mt-1">
                                {dup.title}
                              </p>
                              <p className="text-[10px] text-[var(--light-text)] mt-0.5">
                                {dup.reason}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {/* SUGGESTED SOLUTION */}
                  {aiAnalysis.analysis.suggestedSolution && (
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <h4 className="text-sm font-medium text-green-600 flex items-center gap-2 mb-3">
                        <Lightbulb size={14} />
                        Suggested Solution
                      </h4>
                      <p className="text-sm text-[var(--text-primary)] mb-2">
                        {aiAnalysis.analysis.suggestedSolution.summary}
                      </p>
                      {aiAnalysis.analysis.suggestedSolution.steps.length >
                        0 && (
                        <ul className="space-y-1 mb-2">
                          {aiAnalysis.analysis.suggestedSolution.steps.map(
                            (step, index) => (
                              <li
                                key={index}
                                className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                              >
                                <span className="text-green-500 font-medium">
                                  {index + 1}.
                                </span>
                                {step}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                      {aiAnalysis.analysis.suggestedSolution
                        .additionalContext && (
                        <p className="text-xs text-[var(--light-text)] mt-2 italic">
                          {
                            aiAnalysis.analysis.suggestedSolution
                              .additionalContext
                          }
                        </p>
                      )}
                    </div>
                  )}
                  {/* RUN NEW ANALYSIS BUTTON */}
                  <div className="text-center">
                    <button
                      onClick={() => setAIAnalysis(null)}
                      className="text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
                    >
                      Run New Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* FOOTER - ACTION BUTTONS */}
        {issue && (
          <div className="flex items-center justify-between gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
            <div>
              {issue.state === "open" ? (
                <button
                  onClick={handleCloseIssue}
                  disabled={updateIssue.isPending}
                  className="px-3 py-1.5 text-sm rounded-lg text-purple-500 hover:bg-purple-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {updateIssue.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <CheckCircle size={14} />
                  Close Issue
                </button>
              ) : (
                <button
                  onClick={handleReopenIssue}
                  disabled={updateIssue.isPending}
                  className="px-3 py-1.5 text-sm rounded-lg text-green-500 hover:bg-green-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {updateIssue.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <CircleDot size={14} />
                  Reopen Issue
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// <== GITHUB ISSUES PAGE COMPONENT ==>
const GitHubIssuesPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Issues - ${owner}/${repo}`);
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // DEBOUNCED SEARCH QUERY STATE
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // FILTER STATE
  const [stateFilter, setStateFilter] = useState("open");
  // SORT FILTER STATE
  const [sortFilter, setSortFilter] = useState("created");
  // PAGE STATE
  const [page, setPage] = useState(1);
  // MODAL STATE
  const [showCreateModal, setShowCreateModal] = useState(false);
  // SELECTED ISSUE STATE
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  // DEBOUNCE SEARCH
  useEffect(() => {
    // SET DEBOUNCED SEARCH QUERY
    const timer = setTimeout(() => {
      // SET DEBOUNCED SEARCH QUERY
      setDebouncedQuery(searchQuery);
    }, 500);
    // CLEANUP
    return () => clearTimeout(timer);
  }, [searchQuery]);
  // FETCH REPOSITORY DETAILS
  const { isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH LABELS
  const { labels } = useRepositoryLabels(owner || "", repo || "");
  // FETCH ISSUES
  const {
    issues,
    hasMore,
    isLoading: isIssuesLoading,
    refetch,
  } = useRepositoryIssues(owner || "", repo || "", stateFilter, page, 20, true);
  // FETCH SEARCH RESULTS
  const { issues: searchResults, isLoading: isSearchLoading } = useSearchIssues(
    owner || "",
    repo || "",
    debouncedQuery,
    stateFilter !== "all" ? stateFilter : undefined,
    1,
    30,
    !!debouncedQuery
  );
  // DISPLAYED ISSUES
  const displayedIssues = debouncedQuery ? searchResults : issues;
  // IS LOADING STATE
  const isLoading = debouncedQuery ? isSearchLoading : isIssuesLoading;
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Issues"
          subtitle={`${owner}/${repo}`}
          showSearch={false}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <IssueSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN ISSUES PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Issues"
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
              {displayedIssues.length} issue
              {displayedIssues.length !== 1 ? "s" : ""}
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
            {/* CREATE ISSUE BUTTON */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Issue</span>
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
            placeholder="Search issues..."
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
        {/* ISSUES LIST */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => <IssueSkeleton key={i} />)
          ) : displayedIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <CircleDot size={40} className="text-[var(--light-text)] mb-3" />
              <p className="text-sm text-[var(--light-text)]">
                {searchQuery
                  ? "No issues match your search"
                  : "No issues found"}
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
              {displayedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue.number)}
                />
              ))}
              {/* PAGINATION */}
              {!debouncedQuery && (hasMore || page > 1) && (
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
      {/* CREATE ISSUE MODAL */}
      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        labels={labels}
      />
      {/* ISSUE DETAILS MODAL */}
      <IssueDetailsModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        owner={owner || ""}
        repo={repo || ""}
        issueNumber={selectedIssue || 0}
        labels={labels}
        existingIssues={issues}
      />
    </div>
  );
};

export default GitHubIssuesPage;
