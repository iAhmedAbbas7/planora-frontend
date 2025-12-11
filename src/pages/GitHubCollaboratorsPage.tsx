// <== IMPORTS ==>
import {
  Users,
  ArrowLeft,
  Plus,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  Shield,
  Mail,
  Trash2,
  Sparkles,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  useRepositoryDetails,
  useCollaborators,
  useAddCollaborator,
  useRemoveCollaborator,
  useRepositoryInvitations,
  useDeleteInvitation,
  useUpdateInvitation,
  Collaborator,
  RepositoryInvitation,
} from "../hooks/useGitHub";
import {
  useAIPermissionRecommendation,
  AIPermissionRecommendationResponse,
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

// <== PERMISSION LEVELS ==>
const permissionLevels = [
  {
    value: "pull",
    label: "Read",
    description: "Can read and clone repository",
    color: "text-blue-500",
    bgColor: "bg-blue-500/15",
  },
  {
    value: "triage",
    label: "Triage",
    description: "Can manage issues and pull requests",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/15",
  },
  {
    value: "push",
    label: "Write",
    description: "Can read, clone, and push",
    color: "text-green-500",
    bgColor: "bg-green-500/15",
  },
  {
    value: "maintain",
    label: "Maintain",
    description: "Can manage repository settings",
    color: "text-orange-500",
    bgColor: "bg-orange-500/15",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full access to repository",
    color: "text-red-500",
    bgColor: "bg-red-500/15",
  },
];

// <== GET PERMISSION INFO ==>
const getPermissionInfo = (permission: string) => {
  // FIND PERMISSION INFO
  const info = permissionLevels.find(
    (p) => p.value === permission || p.label.toLowerCase() === permission
  );
  // RETURN INFO OR DEFAULT
  return (
    info || {
      value: permission,
      label: permission,
      description: "",
      color: "text-[var(--light-text)]",
      bgColor: "bg-[var(--inside-card-bg)]",
    }
  );
};

// <== COLLABORATOR CARD COMPONENT ==>
type CollaboratorCardProps = {
  // <== COLLABORATOR ==>
  collaborator: Collaborator;
  // <== ON REMOVE ==>
  onRemove: () => void;
  // <== IS REMOVING ==>
  isRemoving: boolean;
  // <== IS OWNER ==>
  isOwner: boolean;
  // <== CAN MANAGE ==>
  canManage: boolean;
};

const CollaboratorCard = ({
  collaborator,
  onRemove,
  isRemoving,
  isOwner,
  canManage,
}: CollaboratorCardProps): JSX.Element => {
  // GET PERMISSION INFO - USE ROLE NAME DIRECTLY FROM GITHUB
  const permissionInfo = getPermissionInfo(collaborator.roleName || "read");
  // RETURN COLLABORATOR CARD
  return (
    <div className="group p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR */}
          <img
            src={collaborator.avatarUrl}
            alt={collaborator.login}
            className="w-10 h-10 rounded-lg border border-[var(--border)]"
          />
          {/* INFO */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                {collaborator.login}
              </h3>
              {isOwner && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                  owner
                </span>
              )}
            </div>
            {/* PERMISSION BADGE */}
            <span
              className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-xs rounded-full ${permissionInfo.bgColor} ${permissionInfo.color}`}
            >
              <Shield size={10} />
              {permissionInfo.label}
            </span>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* EXTERNAL LINK */}
          <a
            href={collaborator.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition"
            title="View on GitHub"
          >
            <ExternalLink size={16} />
          </a>
          {/* REMOVE BUTTON - ONLY SHOW IF USER HAS ADMIN PERMISSION AND NOT OWNER */}
          {!isOwner && canManage && (
            <button
              onClick={onRemove}
              disabled={isRemoving}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
              title="Remove collaborator"
            >
              {isRemoving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// <== INVITATION CARD COMPONENT ==>
type InvitationCardProps = {
  // <== INVITATION ==>
  invitation: RepositoryInvitation;
  // <== ON DELETE ==>
  onDelete: () => void;
  // <== ON UPDATE PERMISSION ==>
  onUpdatePermission: (permission: string) => void;
  // <== IS DELETING ==>
  isDeleting: boolean;
  // <== IS UPDATING ==>
  isUpdating: boolean;
  // <== CAN MANAGE ==>
  canManage: boolean;
};

const InvitationCard = ({
  invitation,
  onDelete,
  onUpdatePermission,
  isDeleting,
  isUpdating,
  canManage,
}: InvitationCardProps): JSX.Element => {
  // SHOW PERMISSION DROPDOWN STATE
  const [showPermissionDropdown, setShowPermissionDropdown] = useState(false);
  // GET PERMISSION INFO
  const permissionInfo = getPermissionInfo(invitation.permissions);
  // RETURN INVITATION CARD
  return (
    <div className="group p-4 bg-[var(--cards-bg)] border border-[var(--border)] border-dashed rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition">
      <div className="flex items-center justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          {/* AVATAR */}
          {invitation.invitee ? (
            <img
              src={invitation.invitee.avatarUrl}
              alt={invitation.invitee.login}
              className="w-10 h-10 rounded-lg border border-[var(--border)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--inside-card-bg)] flex items-center justify-center">
              <Mail size={20} className="text-[var(--light-text)]" />
            </div>
          )}
          {/* INFO */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                {invitation.invitee?.login || "Pending"}
              </h3>
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-500/15 text-yellow-500">
                pending
              </span>
              {invitation.expired && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500/15 text-red-500">
                  expired
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--light-text)] mt-0.5">
              Invited {formatTimeAgo(invitation.createdAt)}
              {invitation.inviter && ` by ${invitation.inviter.login}`}
            </p>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* PERMISSION DROPDOWN - ONLY INTERACTIVE IF USER HAS ADMIN */}
          {canManage ? (
            <div className="relative">
              <button
                onClick={() =>
                  setShowPermissionDropdown(!showPermissionDropdown)
                }
                disabled={isUpdating}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg border transition cursor-pointer ${permissionInfo.bgColor} border-transparent`}
              >
                {isUpdating ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Shield size={10} className={permissionInfo.color} />
                )}
                <span className={permissionInfo.color}>
                  {permissionInfo.label}
                </span>
                <ChevronDown size={10} className={permissionInfo.color} />
              </button>
              {showPermissionDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPermissionDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                    {permissionLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          onUpdatePermission(level.value);
                          setShowPermissionDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          invitation.permissions === level.value
                            ? "bg-[var(--accent-color)]/10"
                            : "hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <Shield size={14} className={level.color} />
                        <div className="flex-1">
                          <span className="text-[var(--text-primary)]">
                            {level.label}
                          </span>
                          <p className="text-[10px] text-[var(--light-text)]">
                            {level.description}
                          </p>
                        </div>
                        {invitation.permissions === level.value && (
                          <Check
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // READ-ONLY PERMISSION BADGE
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${permissionInfo.bgColor}`}
            >
              <Shield size={10} className={permissionInfo.color} />
              <span className={permissionInfo.color}>
                {permissionInfo.label}
              </span>
            </span>
          )}
          {/* DELETE BUTTON - ONLY SHOW IF USER HAS ADMIN PERMISSION */}
          {canManage && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
              title="Cancel invitation"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <X size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// <== COLLABORATOR SKELETON COMPONENT ==>
const CollaboratorSkeleton = (): JSX.Element => {
  // RETURN COLLABORATOR SKELETON
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--light-text)]/10" />
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32 mb-2" />
          <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

// <== ADD COLLABORATOR MODAL COMPONENT ==>
type AddCollaboratorModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== REPOSITORY INFO ==>
  repositoryInfo: {
    // <== NAME ==>
    name: string;
    // <== DESCRIPTION ==>
    description?: string;
    // <== IS PRIVATE ==>
    isPrivate: boolean;
    // <== LANGUAGE ==>
    language?: string;
    // <== HAS ISSUES ==>
    hasIssues?: boolean;
    // <== HAS WIKI ==>
    hasWiki?: boolean;
  };
  // <== EXISTING COLLABORATORS ==>
  existingCollaborators: Collaborator[];
};

const AddCollaboratorModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  repositoryInfo,
  existingCollaborators,
}: AddCollaboratorModalProps): JSX.Element | null => {
  // USERNAME STATE
  const [username, setUsername] = useState("");
  // PERMISSION STATE
  const [permission, setPermission] = useState<
    "pull" | "push" | "admin" | "maintain" | "triage"
  >("push");
  // AI RECOMMENDATION STATE
  const [aiRecommendation, setAIRecommendation] =
    useState<AIPermissionRecommendationResponse | null>(null);
  // ADD COLLABORATOR MUTATION
  const addCollaborator = useAddCollaborator();
  // AI PERMISSION RECOMMENDATION MUTATION
  const recommendPermission = useAIPermissionRecommendation();
  // HANDLE ADD COLLABORATOR
  const handleAdd = () => {
    // VALIDATE USERNAME
    if (!username.trim()) {
      // SHOW ERROR TOAST
      toast.error("Username is required");
      // RETURN
      return;
    }
    // ADD COLLABORATOR
    addCollaborator.mutate(
      { owner, repo, username: username.trim(), permission },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success(`Invitation sent to ${username}`);
          // RESET USERNAME
          setUsername("");
          // RESET PERMISSION
          setPermission("push");
          // RESET AI RECOMMENDATION
          setAIRecommendation(null);
          // CLOSE MODAL
          onClose();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to add collaborator"
          );
        },
      }
    );
  };
  // HANDLE AI RECOMMENDATION
  const handleGetAIRecommendation = () => {
    // VALIDATE USERNAME
    if (!username.trim()) {
      // SHOW ERROR TOAST
      toast.error("Enter a username first");
      // RETURN
      return;
    }
    // GET RECOMMENDATION
    recommendPermission.mutate(
      {
        username: username.trim(),
        repositoryInfo,
        existingCollaborators: existingCollaborators.map((c) => ({
          login: c.login,
          permission: c.roleName || "write",
        })),
      },
      {
        // ON SUCCESS
        onSuccess: (data) => {
          // SET AI RECOMMENDATION
          setAIRecommendation(data);
          // MAP RECOMMENDED PERMISSION TO INPUT VALUE
          const permMap: Record<string, typeof permission> = {
            read: "pull",
            triage: "triage",
            write: "push",
            maintain: "maintain",
            admin: "admin",
          };
          // SET PERMISSION FROM RECOMMENDATION
          const newPerm = permMap[data.recommendation.recommendedPermission];
          // CHECK IF NEW PERMISSION IS VALID
          if (newPerm) {
            // SET PERMISSION
            setPermission(newPerm);
          }
        },
      }
    );
  };
  // GET CURRENT PERMISSION INFO
  const currentPermissionInfo = getPermissionInfo(permission);
  // LOCK BODY SCROLL AND RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET USERNAME
      setUsername("");
      // RESET PERMISSION
      setPermission("push");
      // RESET AI RECOMMENDATION
      setAIRecommendation(null);
    }
    // CLEANUP
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN ADD COLLABORATOR MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
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
              <Users size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Add Collaborator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* FORM SECTION - NON-SCROLLABLE */}
        <div className="p-4 space-y-4 flex-shrink-0 border-b border-[var(--border)]">
          {/* USERNAME INPUT */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              GitHub Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              />
              <button
                onClick={handleGetAIRecommendation}
                disabled={recommendPermission.isPending || !username.trim()}
                className="px-3 py-2 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Get AI recommendation"
              >
                {recommendPermission.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
              </button>
            </div>
          </div>
          {/* PERMISSION SELECT - INLINE BUTTON GROUP */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Permission Level
            </label>
            <div className="grid grid-cols-5 gap-1">
              {permissionLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setPermission(level.value as typeof permission)
                  }
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition cursor-pointer ${
                    permission === level.value
                      ? `border-[var(--accent-color)] bg-[var(--accent-color)]/10`
                      : "border-[var(--border)] hover:bg-[var(--hover-bg)]"
                  }`}
                  title={level.description}
                >
                  <Shield
                    size={16}
                    className={
                      permission === level.value
                        ? "text-[var(--accent-color)]"
                        : level.color
                    }
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      permission === level.value
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--light-text)] mt-1.5">
              {currentPermissionInfo.description}
            </p>
          </div>
        </div>
        {/* AI RECOMMENDATION - SCROLLABLE SECTION */}
        {aiRecommendation && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="p-3 bg-[var(--accent-color)]/5 border border-[var(--accent-color)]/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-color)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  AI Recommendation
                </span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                    aiRecommendation.recommendation.confidence === "high"
                      ? "bg-green-500/15 text-green-500"
                      : aiRecommendation.recommendation.confidence === "medium"
                      ? "bg-yellow-500/15 text-yellow-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {aiRecommendation.recommendation.confidence} confidence
                </span>
              </div>
              <p className="text-xs text-[var(--text-primary)]">
                {aiRecommendation.recommendation.reasoning}
              </p>
              {aiRecommendation.recommendation.considerations.length > 0 && (
                <ul className="space-y-1">
                  {aiRecommendation.recommendation.considerations.map(
                    (consideration, index) => (
                      <li
                        key={index}
                        className="text-[10px] text-[var(--light-text)] flex items-start gap-1"
                      >
                        <Info size={10} className="flex-shrink-0 mt-0.5" />
                        {consideration}
                      </li>
                    )
                  )}
                </ul>
              )}
              {aiRecommendation.recommendation.securityNotes.length > 0 && (
                <div className="pt-1 border-t border-[var(--border)]">
                  {aiRecommendation.recommendation.securityNotes.map(
                    (note, index) => (
                      <p
                        key={index}
                        className="text-[10px] text-yellow-600 flex items-start gap-1"
                      >
                        <AlertTriangle
                          size={10}
                          className="flex-shrink-0 mt-0.5"
                        />
                        {note}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={addCollaborator.isPending || !username.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addCollaborator.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

// <== CONFIRMATION MODAL COMPONENT ==>
type ConfirmationModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== ON CONFIRM ==>
  onConfirm: () => void;
  // <== TITLE ==>
  title: string;
  // <== MESSAGE ==>
  message: string;
  // <== CONFIRM TEXT ==>
  confirmText?: string;
  // <== IS LOADING ==>
  isLoading?: boolean;
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  isLoading = false,
}: ConfirmationModalProps): JSX.Element | null => {
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
    // CLEANUP
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN CONFIRMATION MODAL
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          </div>
        </div>
        {/* BODY */}
        <div className="p-4">
          <p className="text-sm text-[var(--text-primary)]">{message}</p>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// <== GITHUB COLLABORATORS PAGE COMPONENT ==>
const GitHubCollaboratorsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Collaborators - ${owner}/${repo}`);
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"collaborators" | "invitations">(
    "collaborators"
  );
  // MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  // CONFIRMATION MODAL STATE FOR REMOVING COLLABORATOR
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<{
    login: string;
    avatarUrl: string;
  } | null>(null);
  // CONFIRMATION MODAL STATE FOR DELETING INVITATION
  const [invitationToDelete, setInvitationToDelete] = useState<{
    id: number;
    login: string;
  } | null>(null);
  // REMOVING COLLABORATOR STATE
  const [removingUsername, setRemovingUsername] = useState<string | null>(null);
  // DELETING INVITATION STATE
  const [deletingInvitationId, setDeletingInvitationId] = useState<
    number | null
  >(null);
  // UPDATING INVITATION STATE
  const [updatingInvitationId, setUpdatingInvitationId] = useState<
    number | null
  >(null);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // CHECK IF USER HAS ADMIN PERMISSION
  const hasAdminPermission = repository?.permissions?.admin ?? false;
  // FETCH COLLABORATORS
  const {
    collaborators,
    isLoading: isCollaboratorsLoading,
    refetch: refetchCollaborators,
  } = useCollaborators(owner || "", repo || "");
  // FETCH INVITATIONS
  const {
    invitations,
    isLoading: isInvitationsLoading,
    refetch: refetchInvitations,
  } = useRepositoryInvitations(owner || "", repo || "");
  // REMOVE COLLABORATOR MUTATION
  const removeCollaborator = useRemoveCollaborator();
  // DELETE INVITATION MUTATION
  const deleteInvitation = useDeleteInvitation();
  // UPDATE INVITATION MUTATION
  const updateInvitation = useUpdateInvitation();
  // HANDLE CONFIRM REMOVE COLLABORATOR
  const handleConfirmRemoveCollaborator = () => {
    // CHECK IF COLLABORATOR TO REMOVE EXISTS
    if (!collaboratorToRemove) return;
    // SET REMOVING USERNAME
    setRemovingUsername(collaboratorToRemove.login);
    // REMOVE COLLABORATOR
    removeCollaborator.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        username: collaboratorToRemove.login,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success(
            `${collaboratorToRemove.login} removed from collaborators`
          );
          // RESET REMOVING USERNAME
          setRemovingUsername(null);
          // CLOSE CONFIRMATION MODAL
          setCollaboratorToRemove(null);
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to remove collaborator"
          );
          // RESET REMOVING USERNAME
          setRemovingUsername(null);
          // CLOSE CONFIRMATION MODAL
          setCollaboratorToRemove(null);
        },
      }
    );
  };
  // HANDLE CONFIRM DELETE INVITATION
  const handleConfirmDeleteInvitation = () => {
    // CHECK IF INVITATION TO DELETE EXISTS
    if (!invitationToDelete) return;
    // SET DELETING INVITATION ID
    setDeletingInvitationId(invitationToDelete.id);
    // DELETE INVITATION
    deleteInvitation.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        invitationId: invitationToDelete.id,
      },
      {
        // ON SETTLED
        onSettled: () => {
          // RESET DELETING INVITATION ID
          setDeletingInvitationId(null);
          // CLOSE CONFIRMATION MODAL
          setInvitationToDelete(null);
        },
      }
    );
  };
  // HANDLE UPDATE INVITATION
  const handleUpdateInvitation = (
    invitationId: number,
    permissions: string
  ) => {
    // SET UPDATING INVITATION ID
    setUpdatingInvitationId(invitationId);
    // UPDATE INVITATION
    updateInvitation.mutate(
      {
        owner: owner || "",
        repo: repo || "",
        invitationId,
        permissions: permissions as
          | "read"
          | "triage"
          | "write"
          | "maintain"
          | "admin",
      },
      {
        // ON SETTLED
        onSettled: () => {
          // RESET UPDATING INVITATION ID
          setUpdatingInvitationId(null);
        },
      }
    );
  };
  // FILTER COLLABORATORS
  const filteredCollaborators = collaborators.filter((c) =>
    c.login.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // FILTER INVITATIONS
  const filteredInvitations = invitations.filter(
    (i) =>
      i.invitee?.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery === ""
  );
  // REPOSITORY INFO FOR AI
  const repositoryInfo = repository
    ? {
        name: repository.name,
        description: repository.description || undefined,
        isPrivate: repository.private,
        language: repository.language || undefined,
        hasIssues: repository.hasIssues,
        hasWiki: repository.hasWiki,
      }
    : {
        name: repo || "",
        isPrivate: false,
      };
  // PAGE LOADING STATE
  if (isRepoLoading) {
    // RETURN LOADING SKELETON
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="Collaborators"
          subtitle={`${owner}/${repo}`}
        />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <CollaboratorSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN COLLABORATORS PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <DashboardHeader
        title="Collaborators"
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
            {/* TABS */}
            <div className="flex items-center gap-1 p-1 bg-[var(--inside-card-bg)] rounded-lg">
              <button
                onClick={() => setActiveTab("collaborators")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === "collaborators"
                    ? "bg-[var(--cards-bg)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  Collaborators
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--inside-card-bg)]">
                    {collaborators.length}
                  </span>
                </span>
              </button>
              {/* PENDING TAB - ONLY SHOW IF USER HAS ADMIN PERMISSION */}
              {hasAdminPermission && (
                <button
                  onClick={() => setActiveTab("invitations")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                    activeTab === "invitations"
                      ? "bg-[var(--cards-bg)] text-[var(--text-primary)] shadow-sm"
                      : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} />
                    Pending
                    {invitations.length > 0 && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-500/15 text-yellow-500">
                        {invitations.length}
                      </span>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* ADD COLLABORATOR BUTTON - ONLY SHOW IF USER HAS ADMIN PERMISSION */}
            {hasAdminPermission && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add Collaborator</span>
              </button>
            )}
            {/* REFRESH BUTTON */}
            <button
              onClick={() => {
                refetchCollaborators();
                refetchInvitations();
              }}
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
            placeholder="Search collaborators..."
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
        {/* INFO MESSAGE FOR NON-ADMIN USERS */}
        {!hasAdminPermission && !isRepoLoading && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
            <Info size={16} className="text-blue-500 flex-shrink-0" />
            <p className="text-sm text-[var(--text-primary)]">
              You can view collaborators but need admin access to manage them.
            </p>
          </div>
        )}
        {/* COLLABORATORS TAB */}
        {activeTab === "collaborators" && (
          <div className="space-y-3">
            {isCollaboratorsLoading ? (
              [1, 2, 3, 4, 5].map((i) => <CollaboratorSkeleton key={i} />)
            ) : filteredCollaborators.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                <Users size={40} className="text-[var(--light-text)] mb-3" />
                <p className="text-sm text-[var(--light-text)]">
                  {searchQuery
                    ? "No collaborators match your search"
                    : "No collaborators found"}
                </p>
              </div>
            ) : (
              filteredCollaborators.map((collaborator) => (
                <CollaboratorCard
                  key={collaborator.id}
                  collaborator={collaborator}
                  onRemove={() =>
                    setCollaboratorToRemove({
                      login: collaborator.login,
                      avatarUrl: collaborator.avatarUrl,
                    })
                  }
                  isRemoving={removingUsername === collaborator.login}
                  isOwner={collaborator.login === owner}
                  canManage={hasAdminPermission}
                />
              ))
            )}
          </div>
        )}
        {/* INVITATIONS TAB - ONLY SHOW IF USER HAS ADMIN PERMISSION */}
        {activeTab === "invitations" && hasAdminPermission && (
          <div className="space-y-3">
            {isInvitationsLoading ? (
              [1, 2, 3].map((i) => <CollaboratorSkeleton key={i} />)
            ) : filteredInvitations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                <Mail size={40} className="text-[var(--light-text)] mb-3" />
                <p className="text-sm text-[var(--light-text)]">
                  {searchQuery
                    ? "No invitations match your search"
                    : "No pending invitations"}
                </p>
              </div>
            ) : (
              filteredInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onDelete={() =>
                    setInvitationToDelete({
                      id: invitation.id,
                      login: invitation.invitee?.login || "this user",
                    })
                  }
                  onUpdatePermission={(permission) =>
                    handleUpdateInvitation(invitation.id, permission)
                  }
                  isDeleting={deletingInvitationId === invitation.id}
                  isUpdating={updatingInvitationId === invitation.id}
                  canManage={hasAdminPermission}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* ADD COLLABORATOR MODAL */}
      <AddCollaboratorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        repositoryInfo={repositoryInfo}
        existingCollaborators={collaborators}
      />
      {/* REMOVE COLLABORATOR CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={!!collaboratorToRemove}
        onClose={() => setCollaboratorToRemove(null)}
        onConfirm={handleConfirmRemoveCollaborator}
        title="Remove Collaborator"
        message={`Are you sure you want to remove ${collaboratorToRemove?.login} from this repository? They will lose access immediately.`}
        confirmText="Remove"
        isLoading={!!removingUsername}
      />
      {/* DELETE INVITATION CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={!!invitationToDelete}
        onClose={() => setInvitationToDelete(null)}
        onConfirm={handleConfirmDeleteInvitation}
        title="Cancel Invitation"
        message={`Are you sure you want to cancel the invitation for ${invitationToDelete?.login}?`}
        confirmText="Cancel Invitation"
        isLoading={!!deletingInvitationId}
      />
    </div>
  );
};

export default GitHubCollaboratorsPage;
