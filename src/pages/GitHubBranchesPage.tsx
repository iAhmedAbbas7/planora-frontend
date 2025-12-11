// <== IMPORTS ==>
import {
  GitBranch,
  ArrowLeft,
  Plus,
  Trash2,
  Shield,
  ShieldOff,
  GitMerge,
  Sparkles,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Copy,
  ArrowRight,
  Lock,
  Info,
  CheckCircle,
  User,
  Users,
  UsersRound,
  Building2,
  Globe,
  Smartphone,
  Server,
  Package,
  Layers,
  Code,
} from "lucide-react";
import {
  useRepositoryDetails,
  useRepositoryBranches,
  useCreateBranch,
  useDeleteBranch,
  useMergeBranches,
  useBranchProtection,
  useUpdateBranchProtection,
  useDeleteBranchProtection,
  GitHubBranch,
} from "../hooks/useGitHub";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { JSX, useState, useEffect } from "react";
import { useSuggestBranchStrategy } from "../hooks/useAI";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== BRANCH CARD COMPONENT ==>
type BranchCardProps = {
  // <== BRANCH ==>
  branch: GitHubBranch;
  // <== IS DEFAULT ==>
  isDefault: boolean;
  // <== ON DELETE ==>
  onDelete: () => void;
  // <== ON PROTECTION ==>
  onProtection: () => void;
  // <== ON MERGE ==>
  onMerge: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
};

const BranchCard = ({
  branch,
  isDefault,
  onDelete,
  onProtection,
  onMerge,
  owner,
  repo,
}: BranchCardProps): JSX.Element => {
  // COPIED STATE
  const [copied, setCopied] = useState(false);
  // HANDLE COPY
  const handleCopy = () => {
    // COPY BRANCH NAME
    navigator.clipboard.writeText(branch.name);
    // SET COPIED
    setCopied(true);
    // SHOW TOAST
    toast.success("Branch name copied!");
    // RESET AFTER 2 SECONDS
    setTimeout(() => setCopied(false), 2000);
  };
  // RETURN BRANCH CARD
  return (
    <div className="group p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          {/* ICON */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: isDefault
                ? "color-mix(in srgb, var(--accent-color) 15%, transparent)"
                : "var(--inside-card-bg)",
            }}
          >
            <GitBranch
              size={20}
              className={
                isDefault
                  ? "text-[var(--accent-color)]"
                  : "text-[var(--light-text)]"
              }
            />
          </div>
          {/* BRANCH INFO */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                {branch.name}
              </h3>
              {isDefault && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                  default
                </span>
              )}
              {branch.protected && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-500/15 text-yellow-500 flex items-center gap-1">
                  <Shield size={10} />
                  protected
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--light-text)] mt-0.5 font-mono truncate">
              {branch.commit?.sha?.slice(0, 7)}
            </p>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* COPY BUTTON */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            title="Copy branch name"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
          {/* MERGE BUTTON */}
          {!isDefault && (
            <button
              onClick={onMerge}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition cursor-pointer"
              title="Merge branch"
            >
              <GitMerge size={16} />
            </button>
          )}
          {/* PROTECTION BUTTON */}
          <button
            onClick={onProtection}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-yellow-500 hover:bg-yellow-500/10 transition cursor-pointer"
            title={branch.protected ? "Edit protection" : "Add protection"}
          >
            {branch.protected ? <Shield size={16} /> : <ShieldOff size={16} />}
          </button>
          {/* DELETE BUTTON */}
          {!isDefault && !branch.protected && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              title="Delete branch"
            >
              <Trash2 size={16} />
            </button>
          )}
          {/* EXTERNAL LINK */}
          <a
            href={`https://github.com/${owner}/${repo}/tree/${branch.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            title="View on GitHub"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// <== BRANCH SKELETON COMPONENT ==>
const BranchSkeleton = (): JSX.Element => {
  // RETURN BRANCH SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
          <div>
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-32 mb-1" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
          <div className="w-8 h-8 rounded-lg bg-[var(--light-text)]/10" />
        </div>
      </div>
    </div>
  );
};

// <== CREATE BRANCH MODAL COMPONENT ==>
type CreateBranchModalProps = {
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

const CreateBranchModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branches,
  defaultBranch,
}: CreateBranchModalProps): JSX.Element | null => {
  // BRANCH NAME STATE
  const [branchName, setBranchName] = useState("");
  // SOURCE BRANCH STATE
  const [sourceBranch, setSourceBranch] = useState(defaultBranch);
  // SHOW DROPDOWN STATE
  const [showDropdown, setShowDropdown] = useState(false);
  // CREATE BRANCH MUTATION
  const createBranch = useCreateBranch();
  // HANDLE CREATE BRANCH FUNCTION
  const handleCreate = () => {
    // VALIDATE BRANCH NAME
    if (!branchName.trim()) {
      toast.error("Branch name is required");
      return;
    }
    // CREATE BRANCH
    createBranch.mutate(
      { owner, repo, branchName: branchName.trim(), sourceBranch },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // RESET BRANCH NAME AND SOURCE BRANCH
          setBranchName("");
          // RESET SHOW DROPDOWN
          setShowDropdown(false);
          // RESET SOURCE BRANCH TO DEFAULT BRANCH
          setSourceBranch(defaultBranch);
          // CLOSE CREATE BRANCH MODAL
          onClose();
        },
      }
    );
  };
  // HANDLE KEY PRESS FUNCTION
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // CHECK IF ENTER KEY IS PRESSED AND CREATE BRANCH IS NOT PENDING
    if (e.key === "Enter" && !createBranch.isPending) {
      // CREATE BRANCH
      handleCreate();
    }
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
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN CREATE BRANCH MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
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
              <GitBranch size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Create Branch
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
        <div className="p-4 space-y-4">
          {/* BRANCH NAME */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Branch Name
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="feature/new-feature"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* SOURCE BRANCH */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Source Branch
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  {sourceBranch}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                  {branches.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => {
                        setSourceBranch(b.name);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                        sourceBranch === b.name
                          ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <GitBranch size={14} />
                      <span className="truncate flex-1">{b.name}</span>
                      {sourceBranch === b.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createBranch.isPending || !branchName.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createBranch.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create Branch
          </button>
        </div>
      </div>
    </div>
  );
};

// <== DELETE BRANCH MODAL COMPONENT ==>
type DeleteBranchModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
};

const DeleteBranchModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
}: DeleteBranchModalProps): JSX.Element | null => {
  // DELETE BRANCH MUTATION
  const deleteBranch = useDeleteBranch();
  // HANDLE DELETE
  const handleDelete = () => {
    // DELETE BRANCH
    deleteBranch.mutate(
      { owner, repo, branch },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // CLOSE DELETE BRANCH MODAL
          onClose();
        },
      }
    );
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
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN DELETE BRANCH MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Delete Branch
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
        <div className="p-4">
          <p className="text-sm text-[var(--light-text)]">
            Are you sure you want to delete the branch{" "}
            <span className="font-medium text-[var(--text-primary)]">
              {branch}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteBranch.isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleteBranch.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Delete Branch
          </button>
        </div>
      </div>
    </div>
  );
};

// <== MERGE BRANCH MODAL COMPONENT ==>
type MergeBranchModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== SOURCE BRANCH (HEAD) ==>
  sourceBranch: string;
  // <== BRANCHES ==>
  branches: GitHubBranch[];
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
};

const MergeBranchModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  sourceBranch,
  branches,
  defaultBranch,
}: MergeBranchModalProps): JSX.Element | null => {
  // TARGET BRANCH STATE
  const [targetBranch, setTargetBranch] = useState(defaultBranch);
  // COMMIT MESSAGE STATE
  const [commitMessage, setCommitMessage] = useState(
    `Merge ${sourceBranch} into ${defaultBranch}`
  );
  // SHOW DROPDOWN STATE
  const [showDropdown, setShowDropdown] = useState(false);
  // MERGE BRANCHES MUTATION
  const mergeBranches = useMergeBranches();
  // UPDATE COMMIT MESSAGE WHEN TARGET CHANGES
  useEffect(() => {
    // UPDATE COMMIT MESSAGE
    setCommitMessage(`Merge ${sourceBranch} into ${targetBranch}`);
  }, [sourceBranch, targetBranch]);
  // HANDLE MERGE BRANCHES FUNCTION
  const handleMerge = () => {
    // MERGE BRANCHES
    mergeBranches.mutate(
      {
        owner,
        repo,
        base: targetBranch,
        head: sourceBranch,
        commitMessage,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // CLOSE MERGE BRANCH MODAL
          onClose();
        },
      }
    );
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
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MERGE BRANCH MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
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
              <GitMerge size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Merge Branch
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
        <div className="p-4 space-y-4">
          {/* MERGE DIRECTION */}
          <div className="flex items-center justify-center gap-3 p-3 bg-[var(--inside-card-bg)] rounded-lg">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--cards-bg)] border border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {sourceBranch}
              </span>
            </div>
            <ArrowRight size={16} className="text-[var(--accent-color)]" />
            <div className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30">
              <span className="text-sm font-medium text-[var(--accent-color)]">
                {targetBranch}
              </span>
            </div>
          </div>
          {/* TARGET BRANCH */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Merge Into
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  {targetBranch}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
                  {branches
                    .filter((b) => b.name !== sourceBranch)
                    .map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setTargetBranch(b.name);
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          targetBranch === b.name
                            ? "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={14} />
                        <span className="truncate flex-1">{b.name}</span>
                        {targetBranch === b.name && <Check size={14} />}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          {/* COMMIT MESSAGE */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Commit Message
            </label>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
            />
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={mergeBranches.isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {mergeBranches.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Merge Branch
          </button>
        </div>
      </div>
    </div>
  );
};

// <== BRANCH PROTECTION MODAL COMPONENT ==>
type BranchProtectionModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
};

const BranchProtectionModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  branch,
}: BranchProtectionModalProps): JSX.Element | null => {
  // FETCH PROTECTION
  const { protection, isLoading } = useBranchProtection(
    owner,
    repo,
    branch,
    isOpen
  );
  // REQUIRE PULL REQUEST REVIEW STATE
  const [requirePR, setRequirePR] = useState(false);
  // DISMISS STALE REVIEW STATE
  const [dismissStale, setDismissStale] = useState(false);
  // REQUIRE CODE OWNER REVIEW STATE
  const [requireCodeOwner, setRequireCodeOwner] = useState(false);
  // REQUIRED APPROVING REVIEW COUNT STATE
  const [requiredReviewers, setRequiredReviewers] = useState(1);
  // ENFORCE ADMINS STATE
  const [enforceAdmins, setEnforceAdmins] = useState(false);
  // REQUIRE LINEAR HISTORY STATE
  const [requireLinearHistory, setRequireLinearHistory] = useState(false);
  // ALLOW FORCE PUSH STATE
  const [allowForcePush, setAllowForcePush] = useState(false);
  // ALLOW DELETIONS STATE
  const [allowDeletions, setAllowDeletions] = useState(false);
  // UPDATE PROTECTION MUTATION
  const updateProtection = useUpdateBranchProtection();
  // DELETE PROTECTION MUTATION
  const deleteProtection = useDeleteBranchProtection();
  // UPDATE FORM STATE WHEN PROTECTION LOADS
  useEffect(() => {
    // CHECK IF PROTECTION IS LOADING
    if (protection && protection.isProtected !== false) {
      // SET REQUIRE PULL REQUEST REVIEW
      setRequirePR(!!protection.requiredPullRequestReviews);
      // SET DISMISS STALE REVIEW
      setDismissStale(
        protection.requiredPullRequestReviews?.dismissStaleReviews || false
      );
      // SET REQUIRE CODE OWNER REVIEW
      setRequireCodeOwner(
        protection.requiredPullRequestReviews?.requireCodeOwnerReviews || false
      );
      // SET REQUIRED APPROVING REVIEW COUNT
      setRequiredReviewers(
        protection.requiredPullRequestReviews?.requiredApprovingReviewCount || 1
      );
      // SET ENFORCE ADMINS
      setEnforceAdmins(protection.enforceAdmins || false);
      // SET REQUIRE LINEAR HISTORY
      setRequireLinearHistory(protection.requiredLinearHistory || false);
      // SET ALLOW FORCE PUSH
      setAllowForcePush(protection.allowForcePushes || false);
      // SET ALLOW DELETIONS
      setAllowDeletions(protection.allowDeletions || false);
    }
  }, [protection]);
  // HANDLE SAVE
  const handleSave = () => {
    // UPDATE PROTECTION
    updateProtection.mutate(
      {
        owner,
        repo,
        branch,
        requiredPullRequestReviews: requirePR
          ? {
              dismissStaleReviews: dismissStale,
              requireCodeOwnerReviews: requireCodeOwner,
              requiredApprovingReviewCount: requiredReviewers,
            }
          : null,
        enforceAdmins,
        requiredLinearHistory: requireLinearHistory,
        allowForcePushes: allowForcePush,
        allowDeletions,
        restrictions: null,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // CLOSE BRANCH PROTECTION MODAL
          onClose();
        },
      }
    );
  };
  // HANDLE REMOVE PROTECTION
  const handleRemove = () => {
    // DELETE PROTECTION
    deleteProtection.mutate(
      { owner, repo, branch },
      {
        onSuccess: () => {
          // CLOSE MODAL
          onClose();
        },
      }
    );
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
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // IS PROTECTED
  const isProtected = protection && protection.isProtected !== false;
  // RETURN BRANCH PROTECTION MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500/15">
              <Shield size={20} className="text-yellow-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Branch Protection
              </h2>
              <p className="text-xs text-[var(--light-text)]">{branch}</p>
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
            <div className="flex items-center justify-center py-8">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          ) : (
            <>
              {/* REQUIRE PR SECTION */}
              <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <GitMerge
                      size={16}
                      className="text-[var(--accent-color)]"
                    />
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      Require pull request reviews
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requirePR}
                    onChange={(e) => setRequirePR(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                </label>
                {requirePR && (
                  <div className="pl-6 space-y-3 border-l-2 border-[var(--border)] ml-2">
                    {/* REQUIRED REVIEWERS */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--light-text)]">
                        Required approvals
                      </span>
                      <select
                        value={requiredReviewers}
                        onChange={(e) =>
                          setRequiredReviewers(Number(e.target.value))
                        }
                        className="px-2 py-1 text-xs border border-[var(--border)] rounded bg-[var(--cards-bg)] text-[var(--text-primary)]"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* DISMISS STALE */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-[var(--light-text)]">
                        Dismiss stale reviews
                      </span>
                      <input
                        type="checkbox"
                        checked={dismissStale}
                        onChange={(e) => setDismissStale(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[var(--accent-color)]"
                      />
                    </label>
                    {/* REQUIRE CODE OWNER */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs text-[var(--light-text)]">
                        Require code owner review
                      </span>
                      <input
                        type="checkbox"
                        checked={requireCodeOwner}
                        onChange={(e) => setRequireCodeOwner(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[var(--accent-color)]"
                      />
                    </label>
                  </div>
                )}
              </div>
              {/* OTHER SETTINGS */}
              <div className="space-y-2">
                {/* ENFORCE ADMINS */}
                <label className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-yellow-500" />
                    <span className="text-sm text-[var(--text-primary)]">
                      Include administrators
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enforceAdmins}
                    onChange={(e) => setEnforceAdmins(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                </label>
                {/* REQUIRE LINEAR HISTORY */}
                <label className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <GitBranch
                      size={16}
                      className="text-[var(--accent-color)]"
                    />
                    <span className="text-sm text-[var(--text-primary)]">
                      Require linear history
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireLinearHistory}
                    onChange={(e) => setRequireLinearHistory(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                </label>
                {/* ALLOW FORCE PUSH */}
                <label className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm text-[var(--text-primary)]">
                      Allow force pushes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowForcePush}
                    onChange={(e) => setAllowForcePush(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                </label>
                {/* ALLOW DELETIONS */}
                <label className="flex items-center justify-between p-3 bg-[var(--inside-card-bg)] rounded-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Trash2 size={16} className="text-red-500" />
                    <span className="text-sm text-[var(--text-primary)]">
                      Allow deletions
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowDeletions}
                    onChange={(e) => setAllowDeletions(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                </label>
              </div>
            </>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
          {isProtected ? (
            <button
              onClick={handleRemove}
              disabled={deleteProtection.isPending}
              className="px-3 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {deleteProtection.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Remove Protection
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateProtection.isPending}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateProtection.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Save Protection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// <== AI BRANCH STRATEGY PANEL COMPONENT ==>
type AIBranchStrategyPanelProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== BRANCHES ==>
  branches: GitHubBranch[];
  // <== REPO INFO ==>
  repoInfo?: {
    name?: string;
    defaultBranch?: string;
  };
};

// <== TEAM SIZE OPTIONS ==>
const teamSizeOptions = [
  { value: "solo", label: "Solo (1 developer)", icon: User },
  { value: "small", label: "Small (2-5 developers)", icon: Users },
  { value: "medium", label: "Medium (6-15 developers)", icon: UsersRound },
  { value: "large", label: "Large (15+ developers)", icon: Building2 },
];

// <== PROJECT TYPE OPTIONS ==>
const projectTypeOptions = [
  { value: "web", label: "Web Application", icon: Globe },
  { value: "mobile", label: "Mobile App", icon: Smartphone },
  { value: "api", label: "API / Backend", icon: Server },
  { value: "library", label: "Library / Package", icon: Package },
  { value: "monorepo", label: "Monorepo", icon: Layers },
  { value: "other", label: "Other", icon: Code },
];

const AIBranchStrategyPanel = ({
  isOpen,
  onClose,
  branches,
  repoInfo,
}: AIBranchStrategyPanelProps): JSX.Element | null => {
  // SUGGEST BRANCH STRATEGY MUTATION
  const suggestStrategy = useSuggestBranchStrategy();
  // TEAM SIZE STATE
  const [teamSize, setTeamSize] = useState("small");
  // PROJECT TYPE STATE
  const [projectType, setProjectType] = useState("web");
  // DROPDOWN STATES
  const [showTeamSizeDropdown, setShowTeamSizeDropdown] = useState(false);
  // SHOW PROJECT TYPE DROPDOWN STATE
  const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);
  // GET CURRENT LABELS
  const currentTeamSizeOption =
    teamSizeOptions.find((o) => o.value === teamSize) || teamSizeOptions[1];
  // GET CURRENT PROJECT TYPE OPTION
  const currentProjectTypeOption =
    projectTypeOptions.find((o) => o.value === projectType) ||
    projectTypeOptions[0];
  // HANDLE GENERATE BRANCH STRATEGY FUNCTION
  const handleGenerate = () => {
    // GENERATE SUGGESTION
    suggestStrategy.mutate({
      branches: branches.map((b) => ({ name: b.name, protected: b.protected })),
      repoInfo,
      teamSize,
      projectType,
    });
  };
  // GET RESET FUNCTION FOR STABLE REFERENCE
  const resetMutation = suggestStrategy.reset;
  // RESET STATE WHEN MODAL CLOSES
  useEffect(() => {
    // CHECK IF MODAL IS CLOSED
    if (!isOpen) {
      // RESET TEAM SIZE AND PROJECT TYPE
      setTeamSize("small");
      // RESET PROJECT TYPE
      setProjectType("web");
      // RESET SHOW DROPDOWN
      setShowTeamSizeDropdown(false);
      // RESET SHOW PROJECT TYPE DROPDOWN
      setShowProjectTypeDropdown(false);
      // RESET MUTATION STATE
      resetMutation();
    }
  }, [isOpen, resetMutation]);
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
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET SUGGESTION DATA
  const suggestion = suggestStrategy.data?.suggestion;
  // RETURN AI BRANCH STRATEGY PANEL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col ${
          suggestion ? "overflow-hidden" : ""
        }`}
      >
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
              <Sparkles size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                AI Branch Strategy
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Get AI-powered branching recommendations
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
        <div
          className={`flex-1 p-4 space-y-4 ${
            suggestion ? "overflow-y-auto" : ""
          }`}
        >
          {/* CONFIG SECTION */}
          {!suggestion && !suggestStrategy.isPending && (
            <div className="flex flex-col gap-6">
              {/* INFO TEXT */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
                <Info
                  size={18}
                  className="text-[var(--accent-color)] flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-[var(--light-text)]">
                  Select your team size and project type to get tailored branch
                  strategy recommendations for your workflow.
                </p>
              </div>
              {/* DROPDOWNS - VERTICAL LAYOUT */}
              <div className="flex flex-col gap-4">
                {/* TEAM SIZE DROPDOWN */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Team Size
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowTeamSizeDropdown(!showTeamSizeDropdown);
                        setShowProjectTypeDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <currentTeamSizeOption.icon
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        {currentTeamSizeOption.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition text-[var(--light-text)] ${
                          showTeamSizeDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showTeamSizeDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                        {teamSizeOptions.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                setTeamSize(option.value);
                                setShowTeamSizeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                                teamSize === option.value
                                  ? "text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              <OptionIcon
                                size={16}
                                className={
                                  teamSize === option.value
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              <span className="flex-1 text-left">
                                {option.label}
                              </span>
                              {teamSize === option.value && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {/* PROJECT TYPE DROPDOWN */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Project Type
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowProjectTypeDropdown(!showProjectTypeDropdown);
                        setShowTeamSizeDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <currentProjectTypeOption.icon
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        {currentProjectTypeOption.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition text-[var(--light-text)] ${
                          showProjectTypeDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showProjectTypeDropdown && (
                      <div className="absolute bottom-full left-0 mb-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                        {projectTypeOptions.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                setProjectType(option.value);
                                setShowProjectTypeDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                                projectType === option.value
                                  ? "text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              <OptionIcon
                                size={16}
                                className={
                                  projectType === option.value
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              <span className="flex-1 text-left">
                                {option.label}
                              </span>
                              {projectType === option.value && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* LOADING STATE */}
          {suggestStrategy.isPending && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2
                size={32}
                className="animate-spin text-[var(--accent-color)] mb-3"
              />
              <p className="text-sm text-[var(--light-text)]">
                AI is analyzing your repository...
              </p>
            </div>
          )}
          {/* ERROR STATE */}
          {suggestStrategy.isError && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle size={32} className="text-red-500 mb-3" />
              <p className="text-sm text-red-500">
                Failed to generate strategy
              </p>
              <button
                onClick={handleGenerate}
                className="mt-3 px-3 py-1.5 text-sm rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
          {/* SUGGESTION RESULTS */}
          {suggestion && (
            <div className="space-y-4">
              {/* RECOMMENDED STRATEGY */}
              <div className="p-4 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-xl">
                <h3 className="text-sm font-semibold text-[var(--accent-color)] mb-1">
                  Recommended: {suggestion.recommendedStrategy}
                </h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {suggestion.strategyDescription}
                </p>
              </div>
              {/* BRANCH STRUCTURE */}
              <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  Branch Structure
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[var(--light-text)] mb-1">
                      Main Branches:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.branchStructure.mainBranches.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--light-text)] mb-1">
                      Supporting Branches:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.branchStructure.supportingBranches.map(
                        (b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-full bg-[var(--cards-bg)] text-[var(--text-primary)]"
                          >
                            {b}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* NAMING CONVENTIONS */}
              {suggestion.namingConventions?.length > 0 && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                    Naming Conventions
                  </h3>
                  <div className="space-y-2">
                    {suggestion.namingConventions.map((conv, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium text-[var(--accent-color)]">
                          {conv.type}:
                        </span>
                        <code className="ml-2 px-1.5 py-0.5 rounded bg-[var(--cards-bg)] text-[var(--text-primary)]">
                          {conv.pattern}
                        </code>
                        <span className="ml-2 text-[var(--light-text)]">
                          e.g., {conv.example}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* PROTECTION RECOMMENDATIONS */}
              {suggestion.protectionRecommendations?.length > 0 && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <Shield size={14} className="text-yellow-500" />
                    Protection Recommendations
                  </h3>
                  <div className="space-y-2">
                    {suggestion.protectionRecommendations.map((rec, i) => (
                      <div key={i}>
                        <p className="text-xs font-medium text-[var(--text-primary)]">
                          {rec.branch}
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {rec.rules.map((rule, j) => (
                            <li
                              key={j}
                              className="text-xs text-[var(--light-text)] flex items-center gap-1"
                            >
                              <CheckCircle
                                size={10}
                                className="text-green-500"
                              />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* MERGE STRATEGY */}
              <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <GitMerge size={14} className="text-[var(--accent-color)]" />
                  Merge Strategy
                </h3>
                <p className="text-xs">
                  <span className="font-medium text-[var(--accent-color)]">
                    {suggestion.mergeStrategy.recommended}
                  </span>
                  <span className="text-[var(--light-text)]">
                    {" "}
                    - {suggestion.mergeStrategy.reason}
                  </span>
                </p>
              </div>
              {/* WORKFLOW STEPS */}
              {suggestion.workflowSteps?.length > 0 && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                    Workflow Steps
                  </h3>
                  <ol className="space-y-1">
                    {suggestion.workflowSteps.map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-[var(--light-text)] flex items-start gap-2"
                      >
                        <span className="font-medium text-[var(--accent-color)]">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {/* ADDITIONAL TIPS */}
              {suggestion.additionalTips?.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-2">
                    <Info size={14} />
                    Tips
                  </h3>
                  <ul className="space-y-1">
                    {suggestion.additionalTips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-[var(--text-primary)] flex items-start gap-2"
                      >
                        <span className="text-yellow-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Close
          </button>
          {!suggestion && !suggestStrategy.isPending && (
            <button
              onClick={handleGenerate}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={14} />
              Generate Strategy
            </button>
          )}
          {suggestion && (
            <button
              onClick={() => suggestStrategy.reset()}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// <== GITHUB BRANCHES PAGE COMPONENT ==>
const GitHubBranchesPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Branches - ${owner}/${repo}`);
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // CREATE BRANCH MODAL STATE
  const [showCreateModal, setShowCreateModal] = useState(false);
  // DELETE BRANCH MODAL STATE
  const [deleteBranch, setDeleteBranch] = useState<string | null>(null);
  // MERGE BRANCH MODAL STATE
  const [mergeBranch, setMergeBranch] = useState<string | null>(null);
  // PROTECTION BRANCH MODAL STATE
  const [protectionBranch, setProtectionBranch] = useState<string | null>(null);
  // AI STRATEGY MODAL STATE
  const [showAIStrategy, setShowAIStrategy] = useState(false);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH BRANCHES
  const {
    branches,
    isLoading: isBranchesLoading,
    refetch,
  } = useRepositoryBranches(owner || "", repo || "");
  // FILTER BRANCHES BY SEARCH
  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // SORT BRANCHES (DEFAULT FIRST, THEN PROTECTED, THEN ALPHABETICALLY)
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    // CHECK IF DEFAULT BRANCH
    if (a.name === repository?.defaultBranch) return -1;
    // CHECK IF DEFAULT BRANCH
    if (b.name === repository?.defaultBranch) return 1;
    // CHECK IF PROTECTED BRANCH
    if (a.protected && !b.protected) return -1;
    // CHECK IF PROTECTED BRANCH
    if (!a.protected && b.protected) return 1;
    // ALPHABETICALLY
    return a.name.localeCompare(b.name);
  });
  // PAGE LOADING STATE
  if (isRepoLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Branches"
          subtitle={`${owner}/${repo}`}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <BranchSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN BRANCHES PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Branches"
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
              {branches.length} {branches.length === 1 ? "branch" : "branches"}
            </span>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* AI STRATEGY BUTTON */}
            <button
              onClick={() => setShowAIStrategy(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">AI Strategy</span>
            </button>
            {/* CREATE BRANCH BUTTON */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Branch</span>
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
            placeholder="Search branches..."
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
        {/* BRANCHES LIST */}
        <div className="space-y-3">
          {isBranchesLoading ? (
            [1, 2, 3, 4, 5].map((i) => <BranchSkeleton key={i} />)
          ) : sortedBranches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
              <GitBranch size={40} className="text-[var(--light-text)] mb-3" />
              <p className="text-sm text-[var(--light-text)]">
                {searchQuery
                  ? "No branches match your search"
                  : "No branches found"}
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
            sortedBranches.map((branch) => (
              <BranchCard
                key={branch.name}
                branch={branch}
                isDefault={branch.name === repository?.defaultBranch}
                onDelete={() => setDeleteBranch(branch.name)}
                onProtection={() => setProtectionBranch(branch.name)}
                onMerge={() => setMergeBranch(branch.name)}
                owner={owner || ""}
                repo={repo || ""}
              />
            ))
          )}
        </div>
      </div>
      {/* MODALS */}
      <CreateBranchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        branches={branches}
        defaultBranch={repository?.defaultBranch || "main"}
      />
      <DeleteBranchModal
        isOpen={!!deleteBranch}
        onClose={() => setDeleteBranch(null)}
        owner={owner || ""}
        repo={repo || ""}
        branch={deleteBranch || ""}
      />
      <MergeBranchModal
        isOpen={!!mergeBranch}
        onClose={() => setMergeBranch(null)}
        owner={owner || ""}
        repo={repo || ""}
        sourceBranch={mergeBranch || ""}
        branches={branches}
        defaultBranch={repository?.defaultBranch || "main"}
      />
      <BranchProtectionModal
        isOpen={!!protectionBranch}
        onClose={() => setProtectionBranch(null)}
        owner={owner || ""}
        repo={repo || ""}
        branch={protectionBranch || ""}
      />
      <AIBranchStrategyPanel
        isOpen={showAIStrategy}
        onClose={() => setShowAIStrategy(false)}
        branches={branches}
        repoInfo={{
          name: repository?.name,
          defaultBranch: repository?.defaultBranch,
        }}
      />
    </div>
  );
};

export default GitHubBranchesPage;
