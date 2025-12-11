// <== IMPORTS ==>
import {
  MessageSquare,
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
  RefreshCw,
  Filter,
  ArrowUpDown,
  Send,
  ThumbsUp,
  MessageCircle,
  Lock,
  CheckCircle,
  Reply,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryDiscussions,
  useDiscussionDetails,
  useDiscussionCategories,
  useCreateDiscussion,
  useAddDiscussionComment,
  useMarkDiscussionCommentAsAnswer,
  useUnmarkDiscussionCommentAsAnswer,
  Discussion,
  DiscussionCategory,
  DiscussionComment,
} from "../hooks/useGitHub";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { useParams, useNavigate } from "react-router-dom";
import { JSX, useState, useMemo, useEffect, useRef } from "react";
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

// <== SORT OPTIONS ==>
const sortOptions = [
  { value: "UPDATED_AT", label: "Recently Updated", icon: RefreshCw },
  { value: "CREATED_AT", label: "Newest", icon: Clock },
];

// <== FILTER OPTIONS ==>
const filterOptions = [
  { value: "all", label: "All", icon: MessageSquare },
  { value: "answered", label: "Answered", icon: CheckCircle },
  { value: "unanswered", label: "Unanswered", icon: MessageCircle },
];

// <== DISCUSSION CARD COMPONENT ==>
type DiscussionCardProps = {
  // <== DISCUSSION ==>
  discussion: Discussion;
  // <== ON CLICK ==>
  onClick: () => void;
};

const DiscussionCard = ({
  discussion,
  onClick,
}: DiscussionCardProps): JSX.Element => {
  // CHECK IF ANSWERED
  const isAnswered = !!discussion.answerChosenAt;
  // RETURN DISCUSSION CARD
  return (
    <div
      onClick={onClick}
      className="group p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* CATEGORY EMOJI / STATUS ICON */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: isAnswered
              ? "rgba(34, 197, 94, 0.15)"
              : "color-mix(in srgb, var(--accent-color) 15%, transparent)",
          }}
        >
          {discussion.category?.emoji ? (
            <span className="text-lg">{discussion.category.emoji}</span>
          ) : (
            <MessageSquare
              size={20}
              className={
                isAnswered ? "text-green-500" : "text-[var(--accent-color)]"
              }
            />
          )}
        </div>
        {/* DISCUSSION INFO */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-color)] transition">
                {discussion.title}
              </h3>
              <p className="text-xs text-[var(--light-text)] mt-1">
                #{discussion.number} opened{" "}
                {formatTimeAgo(discussion.createdAt)} by{" "}
                {discussion.author?.login || "Unknown"}
              </p>
            </div>
            {/* EXTERNAL LINK */}
            <a
              href={discussion.url}
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
            {/* CATEGORY BADGE */}
            {discussion.category && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-[var(--inside-card-bg)] text-[var(--light-text)]">
                {discussion.category.emoji} {discussion.category.name}
              </span>
            )}
            {/* ANSWERED BADGE */}
            {isAnswered && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-500/15 text-green-500">
                <Check size={10} />
                Answered
              </span>
            )}
            {/* LOCKED BADGE */}
            {discussion.locked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-orange-500/15 text-orange-500">
                <Lock size={10} />
                Locked
              </span>
            )}
          </div>
          {/* STATS */}
          <div className="flex items-center gap-3 mt-2">
            {/* UPVOTES */}
            <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
              <ThumbsUp size={12} />
              <span>{discussion.upvoteCount}</span>
            </div>
            {/* COMMENTS */}
            <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
              <MessageCircle size={12} />
              <span>{discussion.commentsCount}</span>
            </div>
            {/* REACTIONS */}
            {discussion.reactionsCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
                <span>❤️ {discussion.reactionsCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// <== DISCUSSION SKELETON COMPONENT ==>
const DiscussionSkeleton = (): JSX.Element => {
  // RETURN DISCUSSION SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-1/2 mb-2" />
          <div className="flex gap-2 mt-2">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-16" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-12" />
          </div>
          <div className="flex gap-3 mt-2">
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-8" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-8" />
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

// <== CATEGORY DROPDOWN COMPONENT ==>
type CategoryDropdownProps = {
  // <== CATEGORIES ==>
  categories: DiscussionCategory[];
  // <== SELECTED CATEGORY ==>
  selectedCategory: string;
  // <== ON CHANGE ==>
  onChange: (categoryId: string) => void;
};

const CategoryDropdown = ({
  categories,
  selectedCategory,
  onChange,
}: CategoryDropdownProps): JSX.Element => {
  // DROPDOWN STATE
  const [isOpen, setIsOpen] = useState(false);
  // GET SELECTED CATEGORY OBJECT
  const selected = categories.find((c) => c.id === selectedCategory);
  // RETURN CATEGORY DROPDOWN
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        {selected ? (
          <>
            <span>{selected.emoji}</span>
            <span className="hidden sm:inline">{selected.name}</span>
          </>
        ) : (
          <>
            <Filter size={14} className="text-[var(--accent-color)]" />
            <span className="hidden sm:inline">Category</span>
          </>
        )}
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
          <div className="absolute top-full left-0 mt-1 min-w-[180px] max-h-60 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
            {/* ALL OPTION */}
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                !selectedCategory
                  ? "text-[var(--accent-color)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              <Filter
                size={14}
                className={
                  !selectedCategory
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--light-text)]"
                }
              />
              <span className="flex-1 text-left">All Categories</span>
              {!selectedCategory && (
                <Check size={14} className="text-[var(--accent-color)]" />
              )}
            </button>
            {/* CATEGORY OPTIONS */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onChange(category.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                  selectedCategory === category.id
                    ? "text-[var(--accent-color)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                <span>{category.emoji}</span>
                <span className="flex-1 text-left">{category.name}</span>
                {selectedCategory === category.id && (
                  <Check size={14} className="text-[var(--accent-color)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// <== CREATE DISCUSSION MODAL COMPONENT ==>
type CreateDiscussionModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== CATEGORIES ==>
  categories: DiscussionCategory[];
};

const CreateDiscussionModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  categories,
}: CreateDiscussionModalProps): JSX.Element | null => {
  // DISCUSSION TITLE STATE
  const [title, setTitle] = useState("");
  // DISCUSSION BODY STATE
  const [body, setBody] = useState("");
  // DISCUSSION CATEGORY ID STATE
  const [categoryId, setCategoryId] = useState("");
  // SHOW CATEGORY DROPDOWN STATE
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  // CREATE DISCUSSION MUTATION
  const createDiscussion = useCreateDiscussion(owner, repo);
  // GET SELECTED CATEGORY
  const selectedCategory = categories.find((c) => c.id === categoryId);
  // HANDLE CREATE
  const handleCreate = () => {
    // VALIDATE TITLE
    if (!title.trim()) {
      // SHOW ERROR TOAST
      toast.error("Title is required");
      // RETURN FROM FUNCTION
      return;
    }
    // VALIDATE CATEGORY
    if (!categoryId) {
      // SHOW ERROR TOAST
      toast.error("Please select a category");
      // RETURN FROM FUNCTION
      return;
    }
    // CREATE DISCUSSION
    createDiscussion.mutate(
      { title: title.trim(), body: body.trim() || undefined, categoryId },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET DISCUSSION TITLE
          setTitle("");
          // RESET DISCUSSION BODY
          setBody("");
          // RESET DISCUSSION CATEGORY ID
          setCategoryId("");
          // CLOSE CREATE DISCUSSION MODAL
          onClose();
        },
      }
    );
  };
  // LOCK BODY SCROLL AND RESET ON CLOSE
  useEffect(() => {
    // CHECK IF CREATE DISCUSSION MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET DISCUSSION TITLE
      setTitle("");
      // RESET DISCUSSION BODY
      setBody("");
      // RESET DISCUSSION CATEGORY ID
      setCategoryId("");
      // RESET SHOW CATEGORY DROPDOWN
      setShowCategoryDropdown(false);
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN CREATE DISCUSSION MODAL
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
              <MessageSquare size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Start Discussion
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
          {/* CATEGORY */}
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Category
            </label>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {selectedCategory ? (
                  <>
                    <span>{selectedCategory.emoji}</span>
                    <span>{selectedCategory.name}</span>
                  </>
                ) : (
                  <span className="text-[var(--light-text)]">
                    Select a category...
                  </span>
                )}
              </span>
              <ChevronDown size={14} />
            </button>
            {showCategoryDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCategoryDropdown(false)}
                />
                <div className="absolute bottom-full left-0 mb-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setCategoryId(category.id);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                        categoryId === category.id
                          ? "bg-[var(--accent-color)]/10"
                          : "hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <span className="flex-shrink-0 mt-0.5">
                        {category.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-primary)]">
                            {category.name}
                          </span>
                          {category.isAnswerable && (
                            <span className="px-1 py-0.5 text-[8px] rounded bg-green-500/15 text-green-500">
                              Q&A
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-xs text-[var(--light-text)] line-clamp-1 mt-0.5">
                            {category.description}
                          </p>
                        )}
                      </div>
                      {categoryId === category.id && (
                        <Check
                          size={14}
                          className="text-[var(--accent-color)] flex-shrink-0"
                        />
                      )}
                    </button>
                  ))}
                  {categories.length === 0 && (
                    <p className="px-3 py-2 text-sm text-[var(--light-text)]">
                      No categories available
                    </p>
                  )}
                </div>
              </>
            )}
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
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* BODY */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Description
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share more details... (Supports Markdown)"
              rows={6}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none font-mono"
            />
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
            disabled={
              createDiscussion.isPending || !title.trim() || !categoryId
            }
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createDiscussion.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Start Discussion
          </button>
        </div>
      </div>
    </div>
  );
};

// <== COMMENT COMPONENT ==>
type CommentComponentProps = {
  // <== COMMENT ==>
  comment: DiscussionComment;
  // <== IS ANSWER ==>
  isAnswer?: boolean;
  // <== CAN MARK AS ANSWER ==>
  canMarkAsAnswer?: boolean;
  // <== ON MARK AS ANSWER ==>
  onMarkAsAnswer?: () => void;
  // <== ON UNMARK AS ANSWER ==>
  onUnmarkAsAnswer?: () => void;
  // <== IS MARKING ==>
  isMarking?: boolean;
  // <== ON REPLY ==>
  onReply?: (commentId: string) => void;
};

const CommentComponent = ({
  comment,
  isAnswer = false,
  canMarkAsAnswer = false,
  onMarkAsAnswer,
  onUnmarkAsAnswer,
  isMarking = false,
  onReply,
}: CommentComponentProps): JSX.Element => {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isAnswer
          ? "border-green-500/30 bg-green-500/5"
          : "border-[var(--border)] bg-[var(--cards-bg)]"
      }`}
    >
      {/* COMMENT HEADER */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* AVATAR */}
          {comment.author?.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.login}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={16} className="text-[var(--light-text)]" />
          )}
          {/* AUTHOR NAME */}
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {comment.author?.login || "Unknown"}
          </span>
          {/* TIME */}
          <span className="text-xs text-[var(--light-text)]">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {/* ANSWER BADGE */}
          {isAnswer && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-500/15 text-green-500">
              <Check size={10} />
              Answer
            </span>
          )}
        </div>
        {/* ACTIONS */}
        <div className="flex items-center gap-1">
          {/* MARK AS ANSWER BUTTON */}
          {canMarkAsAnswer && !isAnswer && onMarkAsAnswer && (
            <button
              onClick={onMarkAsAnswer}
              disabled={isMarking}
              className="flex items-center gap-1 px-2 py-1 text-xs text-green-500 hover:bg-green-500/10 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {isMarking ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CheckCircle size={12} />
              )}
              <span className="hidden sm:inline">Mark as answer</span>
            </button>
          )}
          {/* UNMARK AS ANSWER BUTTON */}
          {isAnswer && onUnmarkAsAnswer && (
            <button
              onClick={onUnmarkAsAnswer}
              disabled={isMarking}
              className="flex items-center gap-1 px-2 py-1 text-xs text-orange-500 hover:bg-orange-500/10 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              {isMarking ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
              <span className="hidden sm:inline">Unmark</span>
            </button>
          )}
          {/* REPLY BUTTON */}
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer"
            >
              <Reply size={12} />
              <span className="hidden sm:inline">Reply</span>
            </button>
          )}
        </div>
      </div>
      {/* COMMENT BODY */}
      <div
        className="prose prose-sm max-w-none dark:prose-invert text-[var(--text-primary)] text-sm"
        dangerouslySetInnerHTML={{ __html: comment.bodyHTML || comment.body }}
      />
      {/* REACTIONS */}
      {comment.reactionsCount > 0 && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-xs text-[var(--light-text)] bg-[var(--inside-card-bg)] px-2 py-1 rounded-full">
            ❤️ {comment.reactionsCount}
          </span>
        </div>
      )}
      {/* REPLIES */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-[var(--border)] space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="pt-2">
              <div className="flex items-center gap-2 mb-1">
                {reply.author?.avatarUrl ? (
                  <img
                    src={reply.author.avatarUrl}
                    alt={reply.author.login}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User size={12} className="text-[var(--light-text)]" />
                )}
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {reply.author?.login || "Unknown"}
                </span>
                <span className="text-[10px] text-[var(--light-text)]">
                  {formatTimeAgo(reply.createdAt)}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none dark:prose-invert text-[var(--text-primary)] text-xs"
                dangerouslySetInnerHTML={{
                  __html: reply.bodyHTML || reply.body,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// <== DISCUSSION DETAILS MODAL COMPONENT ==>
type DiscussionDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== DISCUSSION NUMBER ==>
  discussionNumber: number;
};

const DiscussionDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  discussionNumber,
}: DiscussionDetailsModalProps): JSX.Element | null => {
  // COMMENT INPUT STATE
  const [commentText, setCommentText] = useState("");
  // REPLY TO ID STATE
  const [replyToId, setReplyToId] = useState<string | null>(null);
  // COMMENT INPUT REF
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  // FETCH DISCUSSION DETAILS
  const { discussion, isLoading, refetch } = useDiscussionDetails(
    owner,
    repo,
    discussionNumber,
    { commentsFirst: 50 },
    isOpen
  );
  // CREATE COMMENT MUTATION
  const addComment = useAddDiscussionComment(owner, repo, discussionNumber);
  // MARK AS ANSWER MUTATION
  const markAsAnswer = useMarkDiscussionCommentAsAnswer(owner, repo);
  // UNMARK AS ANSWER MUTATION
  const unmarkAsAnswer = useUnmarkDiscussionCommentAsAnswer(owner, repo);
  // HANDLE SUBMIT COMMENT
  const handleSubmitComment = () => {
    // VALIDATE COMMENT TEXT
    if (!commentText.trim()) {
      // RETURN FROM FUNCTION
      return;
    }
    // ADD COMMENT
    addComment.mutate(
      { body: commentText.trim(), replyToId: replyToId || undefined },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET COMMENT TEXT
          setCommentText("");
          // RESET REPLY TO ID
          setReplyToId(null);
        },
      }
    );
  };
  // HANDLE REPLY
  const handleReply = (commentId: string) => {
    // SET REPLY TO ID
    setReplyToId(commentId);
    // FOCUS COMMENT INPUT
    commentInputRef.current?.focus();
  };
  // CHECK IF CATEGORY IS ANSWERABLE
  const isAnswerable = discussion?.category?.isAnswerable;
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF DISCUSSION DETAILS MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET COMMENT TEXT
      setCommentText("");
      // RESET REPLY TO ID
      setReplyToId(null);
      // RETURN FUNCTION TO UNLOCK BODY SCROLL
    }
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN DISCUSSION DETAILS MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: discussion?.answerChosenAt
                  ? "rgba(34, 197, 94, 0.15)"
                  : "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              {discussion?.category?.emoji ? (
                <span className="text-lg">{discussion.category.emoji}</span>
              ) : discussion?.answerChosenAt ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <MessageSquare
                  size={20}
                  className="text-[var(--accent-color)]"
                />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-2">
                {isLoading ? (
                  <div className="h-5 bg-[var(--light-text)]/10 rounded w-64 animate-pulse" />
                ) : (
                  discussion?.title
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--light-text)]">
                {discussion?.answerChosenAt && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/15 text-green-500">
                    Answered
                  </span>
                )}
                {discussion?.category && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--inside-card-bg)]">
                    {discussion.category.emoji} {discussion.category.name}
                  </span>
                )}
                <span>#{discussionNumber}</span>
                {discussion && (
                  <>
                    <span>•</span>
                    <span>{formatTimeAgo(discussion.createdAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <RefreshCw size={18} />
            </button>
            {discussion?.url && (
              <a
                href={discussion.url}
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
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          ) : !discussion ? (
            <div className="flex flex-col items-center justify-center py-8 text-[var(--light-text)]">
              <MessageSquare size={32} className="mb-2" />
              <p className="text-sm">Discussion not found</p>
            </div>
          ) : (
            <>
              {/* DISCUSSION BODY */}
              {(discussion.body || discussion.bodyHTML) && (
                <div className="p-4 bg-[var(--inside-card-bg)] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.author?.avatarUrl ? (
                      <img
                        src={discussion.author.avatarUrl}
                        alt={discussion.author.login}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-[var(--light-text)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {discussion.author?.login}
                    </span>
                    <span className="text-xs text-[var(--light-text)]">
                      started this discussion
                    </span>
                  </div>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{
                      __html: discussion.bodyHTML || discussion.body || "",
                    }}
                  />
                  {/* STATS */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--light-text)]">
                      <ThumbsUp size={12} />
                      {discussion.upvoteCount} upvotes
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--light-text)]">
                      <MessageCircle size={12} />
                      {discussion.commentsCount} comments
                    </span>
                  </div>
                </div>
              )}
              {/* ANSWER (if exists) */}
              {discussion.answer &&
                !discussion.comments?.some(
                  (c) => c.id === discussion.answer?.id
                ) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      Accepted Answer
                    </h4>
                    <CommentComponent
                      comment={{
                        id: discussion.answer.id,
                        body: discussion.answer.body,
                        bodyHTML:
                          discussion.answer.bodyHTML || discussion.answer.body,
                        createdAt: discussion.answer.createdAt,
                        updatedAt:
                          discussion.answer.updatedAt ||
                          discussion.answer.createdAt,
                        isAnswer: true,
                        author: discussion.answer.author,
                        reactionsCount: discussion.answer.reactionsCount || 0,
                        repliesCount: discussion.answer.repliesCount || 0,
                        replies: discussion.answer.replies || [],
                      }}
                      isAnswer
                      canMarkAsAnswer={false}
                      onUnmarkAsAnswer={
                        isAnswerable
                          ? () =>
                              unmarkAsAnswer.mutate({
                                commentId: discussion.answer!.id,
                                discussionNumber,
                              })
                          : undefined
                      }
                      isMarking={unmarkAsAnswer.isPending}
                    />
                  </div>
                )}
              {/* COMMENTS */}
              {discussion.comments && discussion.comments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <MessageCircle size={14} />
                    Comments ({discussion.commentsCount})
                  </h4>
                  {discussion.comments.map((c) => (
                    <CommentComponent
                      key={c.id}
                      comment={c}
                      isAnswer={c.isAnswer}
                      canMarkAsAnswer={
                        isAnswerable && !discussion.answerChosenAt
                      }
                      onMarkAsAnswer={() =>
                        markAsAnswer.mutate({
                          commentId: c.id,
                          discussionNumber,
                        })
                      }
                      onUnmarkAsAnswer={
                        c.isAnswer
                          ? () =>
                              unmarkAsAnswer.mutate({
                                commentId: c.id,
                                discussionNumber,
                              })
                          : undefined
                      }
                      isMarking={
                        markAsAnswer.isPending || unmarkAsAnswer.isPending
                      }
                      onReply={handleReply}
                    />
                  ))}
                </div>
              )}
              {/* ADD COMMENT */}
              {!discussion.locked && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--text-primary)]">
                    {replyToId ? "Reply to comment" : "Add a comment"}
                    {replyToId && (
                      <button
                        onClick={() => setReplyToId(null)}
                        className="ml-2 text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
                      >
                        Cancel reply
                      </button>
                    )}
                  </h4>
                  <div className="flex gap-2">
                    <textarea
                      ref={commentInputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
                    />
                    <button
                      onClick={handleSubmitComment}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// <== GITHUB DISCUSSIONS PAGE COMPONENT ==>
const GitHubDiscussionsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Discussions - ${owner}/${repo}`);
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // FILTER STATE
  const [answerFilter, setAnswerFilter] = useState("all");
  // SORT FILTER STATE
  const [sortFilter, setSortFilter] = useState("UPDATED_AT");
  // CATEGORY FILTER STATE
  const [categoryFilter, setCategoryFilter] = useState("");
  // CURSOR FOR PAGINATION
  const [cursor, setCursor] = useState<string | undefined>();
  // MODAL STATE
  const [showCreateModal, setShowCreateModal] = useState(false);
  // SELECTED DISCUSSION STATE
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(
    null
  );
  // BUILD PARAMS
  const discussionParams = useMemo(() => {
    // BUILD PARAMS OBJECT
    const params: {
      first?: number;
      after?: string;
      categoryId?: string;
      orderBy?: "CREATED_AT" | "UPDATED_AT";
      answered?: boolean;
    } = {
      first: 20,
      orderBy: sortFilter as "CREATED_AT" | "UPDATED_AT",
    };
    // SET CURSOR IF PROVIDED
    if (cursor) params.after = cursor;
    // SET CATEGORY FILTER IF PROVIDED
    if (categoryFilter) params.categoryId = categoryFilter;
    // SET ANSWER FILTER IF PROVIDED
    if (answerFilter === "answered") params.answered = true;
    // SET ANSWER FILTER IF PROVIDED
    if (answerFilter === "unanswered") params.answered = false;
    // RETURN PARAMS
    return params;
  }, [cursor, categoryFilter, sortFilter, answerFilter]);
  // FETCH REPOSITORY DETAILS
  const { isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH DISCUSSIONS
  const {
    discussions,
    categories,
    totalCount,
    pageInfo,
    isLoading: isDiscussionsLoading,
    refetch,
  } = useRepositoryDiscussions(
    owner || "",
    repo || "",
    discussionParams,
    !!owner && !!repo
  );
  // FETCH CATEGORIES SEPARATELY (IN CASE DISCUSSIONS ARE DISABLED)
  const { categories: allCategories } = useDiscussionCategories(
    owner || "",
    repo || "",
    !!owner && !!repo
  );
  // AVAILABLE CATEGORIES (USE ALL CATEGORIES IF DISCUSSIONS LIST CATEGORIES IS EMPTY)
  const availableCategories =
    categories.length > 0 ? categories : allCategories;
  // FILTERED DISCUSSIONS (CLIENT-SIDE SEARCH)
  const filteredDiscussions = useMemo(() => {
    // CHECK IF SEARCH QUERY IS PROVIDED
    if (!searchQuery) return discussions;
    // BUILD QUERY
    const query = searchQuery.toLowerCase();
    // FILTER DISCUSSIONS
    return discussions.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.body?.toLowerCase().includes(query) ||
        d.author?.login.toLowerCase().includes(query)
    );
    // RETURN FILTERED DISCUSSIONS
  }, [discussions, searchQuery]);
  // LOADING STATE
  const isLoading = isRepoLoading || isDiscussionsLoading;
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Discussions"
          subtitle={`${owner}/${repo}`}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <DiscussionSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN DISCUSSIONS PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Discussions"
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
            <span className="text-sm text-[var(--light-text)]">
              {totalCount} discussion
              {totalCount !== 1 ? "s" : ""}
            </span>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* CATEGORY FILTER */}
            <CategoryDropdown
              categories={availableCategories}
              selectedCategory={categoryFilter}
              onChange={(id) => {
                setCategoryFilter(id);
                setCursor(undefined);
              }}
            />
            {/* ANSWER FILTER */}
            <FilterDropdown
              value={answerFilter}
              options={filterOptions}
              onChange={(value) => {
                setAnswerFilter(value);
                setCursor(undefined);
              }}
              icon={Filter}
            />
            {/* SORT FILTER */}
            <FilterDropdown
              value={sortFilter}
              options={sortOptions}
              onChange={(value) => {
                setSortFilter(value);
                setCursor(undefined);
              }}
              icon={ArrowUpDown}
            />
            {/* CREATE DISCUSSION BUTTON */}
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={availableCategories.length === 0}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Discussion</span>
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
            placeholder="Search discussions..."
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
        {/* DISCUSSIONS LIST */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => <DiscussionSkeleton key={i} />)
          ) : filteredDiscussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <MessageSquare
                size={40}
                className="text-[var(--light-text)] mb-3"
              />
              <p className="text-sm text-[var(--light-text)]">
                {searchQuery
                  ? "No discussions match your search"
                  : "No discussions found"}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              ) : (
                availableCategories.length > 0 && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-3 text-sm text-[var(--accent-color)] hover:underline cursor-pointer"
                  >
                    Start a discussion
                  </button>
                )
              )}
            </div>
          ) : (
            <>
              {filteredDiscussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  onClick={() => setSelectedDiscussion(discussion.number)}
                />
              ))}
              {/* PAGINATION */}
              {!searchQuery &&
                (pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => setCursor(undefined)}
                      disabled={!pageInfo.hasPreviousPage}
                      className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCursor(pageInfo.endCursor || undefined)}
                      disabled={!pageInfo.hasNextPage}
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
      {/* CREATE DISCUSSION MODAL */}
      <CreateDiscussionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        categories={availableCategories}
      />
      {/* DISCUSSION DETAILS MODAL */}
      <DiscussionDetailsModal
        isOpen={!!selectedDiscussion}
        onClose={() => setSelectedDiscussion(null)}
        owner={owner || ""}
        repo={repo || ""}
        discussionNumber={selectedDiscussion || 0}
      />
    </div>
  );
};

export default GitHubDiscussionsPage;
