// <== IMPORTS ==>
import {
  X,
  Settings,
  Globe,
  Lock,
  Tag,
  Users,
  Trash2,
  Archive,
  AlertTriangle,
  Check,
  Plus,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  UserMinus,
  Eye,
  Pencil,
  Shield,
} from "lucide-react";
import {
  useUpdateRepository,
  useDeleteRepository,
  useUpdateTopics,
  useCollaborators,
  useAddCollaborator,
  useRemoveCollaborator,
  RepositoryDetails,
  Collaborator,
} from "../../hooks/useGitHub";
import { toast } from "@/lib/toast";
import type { LucideIcon } from "lucide-react";
import { useState, JSX, useEffect, useRef } from "react";

// <== PERMISSION OPTION TYPE ==>
type PermissionOption = {
  // <== VALUE ==>
  value: string;
  // <== LABEL ==>
  label: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== ICON ==>
  icon: LucideIcon;
};
// <== REPOSITORY SETTINGS PANEL PROPS ==>
type RepositorySettingsPanelProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== REPOSITORY ==>
  repository: RepositoryDetails;
  // <== ON UPDATE ==>
  onUpdate?: () => void;
  // <== ON DELETE ==>
  onDelete?: () => void;
};

// <== PERMISSION OPTIONS ==>
const permissionOptions: PermissionOption[] = [
  {
    value: "pull",
    label: "Read",
    description: "Can read and clone",
    icon: Eye,
  },
  {
    value: "push",
    label: "Write",
    description: "Can read, clone, and push",
    icon: Pencil,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full access to repository",
    icon: Shield,
  },
];

// <== SECTION COMPONENT ==>
const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  danger = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  danger?: boolean;
}): JSX.Element => {
  // SECTION OPEN STATE
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // RETURNING SECTION
  return (
    <div
      className={`border rounded-xl ${
        danger ? "border-red-500/30" : "border-[var(--border)]"
      }`}
    >
      {/* SECTION HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 sm:p-4 hover:bg-[var(--hover-bg)] transition cursor-pointer ${
          danger ? "bg-red-500/5" : ""
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Icon
            size={18}
            className={danger ? "text-red-500" : "text-[var(--accent-color)]"}
          />
          <span
            className={`font-medium text-sm sm:text-base ${
              danger ? "text-red-500" : "text-[var(--text-primary)]"
            }`}
          >
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-[var(--light-text)]" />
        ) : (
          <ChevronDown size={18} className="text-[var(--light-text)]" />
        )}
      </button>
      {/* SECTION CONTENT */}
      {isOpen && (
        <div className="p-3 sm:p-4 pt-0 border-t border-[var(--border)]">
          {children}
        </div>
      )}
    </div>
  );
};

// <== REPOSITORY SETTINGS PANEL COMPONENT ==>
const RepositorySettingsPanel = ({
  isOpen,
  onClose,
  repository,
  onUpdate,
  onDelete,
}: RepositorySettingsPanelProps): JSX.Element | null => {
  // UPDATE REPOSITORY MUTATION
  const updateRepoMutation = useUpdateRepository();
  // DELETE REPOSITORY MUTATION
  const deleteRepoMutation = useDeleteRepository();
  // UPDATE TOPICS MUTATION
  const updateTopicsMutation = useUpdateTopics();
  // ADD COLLABORATOR MUTATION
  const addCollaboratorMutation = useAddCollaborator();
  // REMOVE COLLABORATOR MUTATION
  const removeCollaboratorMutation = useRemoveCollaborator();
  // GET COLLABORATORS QUERY
  const {
    collaborators,
    isLoading: isCollaboratorsLoading,
    refetch: refetchCollaborators,
  } = useCollaborators(repository.owner.login, repository.name, isOpen);
  // DESCRIPTION STATE
  const [description, setDescription] = useState(repository.description || "");
  // HOMEPAGE STATE
  const [homepage, setHomepage] = useState(repository.homepage || "");
  // PRIVATE STATE
  const [isPrivate, setIsPrivate] = useState(repository.private);
  // ARCHIVED STATE
  const [isArchived, setIsArchived] = useState(repository.archived);
  // TOPICS STATE
  const [topics, setTopics] = useState<string[]>(repository.topics || []);
  // NEW TOPIC STATE
  const [newTopic, setNewTopic] = useState("");
  // NEW COLLABORATOR STATE
  const [newCollaborator, setNewCollaborator] = useState("");
  // COLLABORATOR PERMISSION STATE
  const [collaboratorPermission, setCollaboratorPermission] = useState<
    "pull" | "push" | "admin"
  >("push");
  // PERMISSION DROPDOWN OPEN STATE
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] =
    useState(false);
  // DELETE CONFIRMATION STATE
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // DELETE CONFIRM TEXT STATE
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  // ARCHIVE CONFIRMATION STATE
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  // VISIBILITY CONFIRMATION STATE
  const [showVisibilityConfirm, setShowVisibilityConfirm] = useState(false);
  // DROPDOWN REF
  const permissionDropdownRef = useRef<HTMLDivElement>(null);
  // RESET FORM WHEN REPOSITORY DETAILS CHANGE
  useEffect(() => {
    setDescription(repository.description || "");
    setHomepage(repository.homepage || "");
    setIsPrivate(repository.private);
    setIsArchived(repository.archived);
    setTopics(repository.topics || []);
  }, [repository]);
  // HANDLE OUTSIDE CLICK FOR PERMISSION DROPDOWN (CLICKING OUTSIDE THE DROPDOWN WILL CLOSE IT)
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE THE DROPDOWN
      if (
        permissionDropdownRef.current &&
        !permissionDropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsPermissionDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    // IF MODAL IS OPEN, PREVENT BACKGROUND SCROLL
    if (isOpen) {
      // PREVENT BACKGROUND SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // IF MODAL IS NOT OPEN, ALLOW BACKGROUND SCROLL
      document.body.style.overflow = "";
    }
    // CLEANUP
    return () => {
      // ALLOW BACKGROUND SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // HANDLE UPDATE GENERAL SETTINGS
  const handleUpdateGeneral = () => {
    // UPDATE REPOSITORY MUTATION
    updateRepoMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        description: description || undefined,
        homepage: homepage || undefined,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Repository settings updated!");
          // CALL ON UPDATE
          onUpdate?.();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to update settings"
          );
        },
      }
    );
  };
  // HANDLE VISIBILITY CHANGE
  const handleVisibilityChange = () => {
    // UPDATE REPOSITORY MUTATION
    updateRepoMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        private: !isPrivate,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET PRIVATE STATE
          setIsPrivate(!isPrivate);
          // SET VISIBILITY CONFIRMATION STATE
          setShowVisibilityConfirm(false);
          // SHOW SUCCESS TOAST
          toast.success(
            `Repository is now ${!isPrivate ? "private" : "public"}!`
          );
          // CALL ON UPDATE
          onUpdate?.();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to change visibility"
          );
        },
      }
    );
  };
  // HANDLE ARCHIVE TOGGLE
  const handleArchiveToggle = () => {
    // UPDATE REPOSITORY MUTATION
    updateRepoMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        archived: !isArchived,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET ARCHIVED STATE
          setIsArchived(!isArchived);
          // SET ARCHIVE CONFIRMATION STATE
          setShowArchiveConfirm(false);
          // SHOW SUCCESS TOAST
          toast.success(
            `Repository ${!isArchived ? "archived" : "unarchived"}!`
          );
          // CALL ON UPDATE
          onUpdate?.();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to update archive status"
          );
        },
      }
    );
  };
  // HANDLE ADD TOPIC
  const handleAddTopic = () => {
    // CHECK IF NEW TOPIC IS VALID
    if (!newTopic.trim()) return;
    // NORMALIZE TOPIC
    const normalizedTopic = newTopic.toLowerCase().trim().replace(/\s+/g, "-");
    // CHECK IF TOPIC ALREADY EXISTS
    if (topics.includes(normalizedTopic)) {
      // SHOW ERROR TOAST
      toast.error("Topic already exists!");
      // RETURN FROM FUNCTION
      return;
    }
    // ADD NEW TOPIC TO TOPICS STATE
    const newTopics = [...topics, normalizedTopic];
    // UPDATE TOPICS MUTATION
    updateTopicsMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        topics: newTopics,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET TOPICS STATE
          setTopics(newTopics);
          // SET NEW TOPIC STATE
          setNewTopic("");
          // SHOW SUCCESS TOAST
          toast.success("Topic added!");
          // CALL ON UPDATE
          onUpdate?.();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(error.response?.data?.message || "Failed to add topic");
        },
      }
    );
  };
  // HANDLE REMOVE TOPIC
  const handleRemoveTopic = (topicToRemove: string) => {
    // REMOVE TOPIC FROM TOPICS STATE
    const newTopics = topics.filter((t) => t !== topicToRemove);
    // UPDATE TOPICS MUTATION
    updateTopicsMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        topics: newTopics,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET TOPICS STATE
          setTopics(newTopics);
          // SHOW SUCCESS TOAST
          toast.success("Topic removed!");
          // CALL ON UPDATE
          onUpdate?.();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to remove topic"
          );
        },
      }
    );
  };
  // HANDLE ADD COLLABORATOR
  const handleAddCollaborator = () => {
    // CHECK IF NEW COLLABORATOR IS VALID
    if (!newCollaborator.trim()) return;
    // ADD NEW COLLABORATOR TO COLLABORATORS MUTATION
    addCollaboratorMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        username: newCollaborator.trim(),
        permission: collaboratorPermission,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET NEW COLLABORATOR STATE
          setNewCollaborator("");
          // SHOW SUCCESS TOAST
          toast.success(`Invitation sent to ${newCollaborator}!`);
          // REFETCH COLLABORATORS
          refetchCollaborators();
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
  // HANDLE REMOVE COLLABORATOR
  const handleRemoveCollaborator = (username: string) => {
    // REMOVE COLLABORATOR FROM COLLABORATORS MUTATION
    removeCollaboratorMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
        username,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success(`${username} removed from collaborators`);
          // REFETCH COLLABORATORS
          refetchCollaborators();
        },
        // ON ERROR
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to remove collaborator"
          );
        },
      }
    );
  };
  // HANDLE DELETE REPOSITORY
  const handleDeleteRepository = () => {
    // CHECK IF DELETE CONFIRM TEXT IS CORRECT
    if (deleteConfirmText !== repository.name) {
      // SHOW ERROR TOAST
      toast.error("Please type the repository name to confirm deletion");
      return;
    }
    // DELETE REPOSITORY MUTATION
    deleteRepoMutation.mutate(
      {
        owner: repository.owner.login,
        repo: repository.name,
      },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Repository deleted successfully!");
          // CALL ON DELETE
          onDelete?.();
          // CLOSE MODAL
          onClose();
        },
        onError: (error) => {
          // SHOW ERROR TOAST
          toast.error(
            error.response?.data?.message || "Failed to delete repository"
          );
        },
      }
    );
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // GET CURRENT PERMISSION OPTION (DEFAULT TO PUSH)
  const currentPermission =
    permissionOptions.find((opt) => opt.value === collaboratorPermission) ||
    permissionOptions[1];
  // RETURNING SETTINGS PANEL
  return (
    // MODAL OVERLAY
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL CONTENT */}
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Settings size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Repository Settings
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {repository.fullName}
              </p>
            </div>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* GENERAL SETTINGS */}
          <Section title="General" icon={Settings} defaultOpen={true}>
            <div className="flex flex-col gap-3 pt-3">
              {/* DESCRIPTION */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of your repository..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                />
              </div>
              {/* HOMEPAGE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Homepage URL
                </label>
                <input
                  type="url"
                  value={homepage}
                  onChange={(e) => setHomepage(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                />
              </div>
              {/* SAVE BUTTON */}
              <button
                onClick={handleUpdateGeneral}
                disabled={updateRepoMutation.isPending}
                className="self-start px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
              >
                {updateRepoMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Section>
          {/* VISIBILITY */}
          <Section title="Visibility" icon={isPrivate ? Lock : Globe}>
            <div className="flex flex-col gap-3 pt-3">
              <div className="flex flex-col gap-2 p-3 bg-[var(--inside-card-bg)] rounded-lg">
                <div className="flex items-center gap-2">
                  {isPrivate ? (
                    <Lock size={16} className="text-yellow-500" />
                  ) : (
                    <Globe size={16} className="text-green-500" />
                  )}
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {isPrivate ? "Private Repository" : "Public Repository"}
                  </p>
                </div>
                <p className="text-xs text-[var(--light-text)]">
                  {isPrivate
                    ? "Only you and collaborators can see this repository"
                    : "Anyone can see this repository"}
                </p>
                <button
                  onClick={() => setShowVisibilityConfirm(true)}
                  className="self-start px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Change to {isPrivate ? "Public" : "Private"}
                </button>
              </div>
              {/* CONFIRMATION */}
              {showVisibilityConfirm && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-yellow-500" />
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Change visibility to {isPrivate ? "public" : "private"}?
                      </p>
                    </div>
                    <p className="text-xs text-[var(--light-text)]">
                      {isPrivate
                        ? "This will make the repository visible to everyone."
                        : "This will hide the repository from public view."}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVisibilityChange}
                        disabled={updateRepoMutation.isPending}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition cursor-pointer disabled:opacity-50"
                      >
                        {updateRepoMutation.isPending
                          ? "Changing..."
                          : "Confirm"}
                      </button>
                      <button
                        onClick={() => setShowVisibilityConfirm(false)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>
          {/* TOPICS */}
          <Section title="Topics" icon={Tag}>
            <div className="flex flex-col gap-3 pt-3">
              {/* CURRENT TOPICS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Current Topics
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {topics.length === 0 ? (
                    <p className="text-xs text-[var(--light-text)]">
                      No topics yet
                    </p>
                  ) : (
                    topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                          color: "var(--accent-color)",
                        }}
                      >
                        {topic}
                        <button
                          onClick={() => handleRemoveTopic(topic)}
                          className="hover:text-red-500 transition cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
              {/* ADD TOPIC */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Add Topic
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. react, typescript, api"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                    className="flex-1 px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                  />
                  <button
                    onClick={handleAddTopic}
                    disabled={
                      updateTopicsMutation.isPending || !newTopic.trim()
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Section>
          {/* COLLABORATORS */}
          <Section title="Collaborators" icon={Users}>
            <div className="flex flex-col gap-3 pt-3">
              {/* COLLABORATOR LIST */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Current Collaborators
                </label>
                {isCollaboratorsLoading ? (
                  <div className="flex items-center justify-center py-3">
                    <Loader2
                      size={18}
                      className="animate-spin text-[var(--light-text)]"
                    />
                  </div>
                ) : collaborators.length === 0 ? (
                  <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg text-center">
                    <Users
                      size={20}
                      className="mx-auto text-[var(--light-text)] mb-1.5"
                    />
                    <p className="text-xs text-[var(--light-text)]">
                      No collaborators yet
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {collaborators.map((collaborator: Collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center justify-between p-2 bg-[var(--inside-card-bg)] rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={collaborator.avatarUrl}
                            alt={collaborator.login}
                            className="w-7 h-7 rounded-full"
                          />
                          <div>
                            <p className="text-xs font-medium text-[var(--text-primary)]">
                              {collaborator.login}
                            </p>
                            <p className="text-[10px] text-[var(--light-text)] capitalize">
                              {collaborator.roleName || "Collaborator"}
                            </p>
                          </div>
                        </div>
                        {collaborator.login !== repository.owner.login && (
                          <button
                            onClick={() =>
                              handleRemoveCollaborator(collaborator.login)
                            }
                            disabled={removeCollaboratorMutation.isPending}
                            className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Remove collaborator"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ADD COLLABORATOR */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Add Collaborator
                </label>
                {/* USERNAME INPUT */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[var(--light-text)]">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    placeholder="Enter GitHub username..."
                    className="w-full px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                  />
                </div>
                {/* PERMISSION DROPDOWN */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[var(--light-text)]">
                    Permission Level
                  </label>
                  <div ref={permissionDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsPermissionDropdownOpen(!isPermissionDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:border-[var(--light-text)] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <currentPermission.icon
                          size={14}
                          className="text-[var(--accent-color)]"
                        />
                        <span className="text-xs">
                          {currentPermission.label}
                        </span>
                        <span className="text-[10px] text-[var(--light-text)]">
                          - {currentPermission.description}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-[var(--light-text)] transition ${
                          isPermissionDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {/* DROPDOWN MENU */}
                    {isPermissionDropdownOpen && (
                      <div className="absolute z-20 top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                        {permissionOptions.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setCollaboratorPermission(
                                  option.value as "pull" | "push" | "admin"
                                );
                                setIsPermissionDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                                collaboratorPermission === option.value
                                  ? "text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              <OptionIcon
                                size={14}
                                className={
                                  collaboratorPermission === option.value
                                    ? "text-[var(--accent-color)]"
                                    : "text-[var(--light-text)]"
                                }
                              />
                              <div className="flex-1 text-left">
                                <p className="font-medium">{option.label}</p>
                                <p className="text-[10px] text-[var(--light-text)]">
                                  {option.description}
                                </p>
                              </div>
                              {collaboratorPermission === option.value && (
                                <Check
                                  size={12}
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
                {/* ADD BUTTON */}
                <button
                  onClick={handleAddCollaborator}
                  disabled={
                    addCollaboratorMutation.isPending || !newCollaborator.trim()
                  }
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
                >
                  {addCollaboratorMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </div>
          </Section>
          {/* DANGER ZONE */}
          <Section title="Danger Zone" icon={AlertTriangle} danger>
            <div className="flex flex-col gap-3 pt-3">
              {/* ARCHIVE REPOSITORY */}
              <div className="flex flex-col gap-2 p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Archive size={16} className="text-yellow-500" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {isArchived ? "Unarchive Repository" : "Archive Repository"}
                  </p>
                </div>
                <p className="text-xs text-[var(--light-text)]">
                  {isArchived
                    ? "Unarchive to make the repository editable again"
                    : "Mark this repository as archived and read-only"}
                </p>
                <button
                  onClick={() => setShowArchiveConfirm(true)}
                  className="self-start px-2.5 py-1 text-xs rounded-lg border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition cursor-pointer"
                >
                  {isArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
              {/* ARCHIVE CONFIRMATION */}
              {showArchiveConfirm && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Archive size={16} className="text-yellow-500" />
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {isArchived ? "Unarchive" : "Archive"} this repository?
                      </p>
                    </div>
                    <p className="text-xs text-[var(--light-text)]">
                      {isArchived
                        ? "This will make the repository editable again."
                        : "This will make the repository read-only."}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleArchiveToggle}
                        disabled={updateRepoMutation.isPending}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition cursor-pointer disabled:opacity-50"
                      >
                        {updateRepoMutation.isPending
                          ? "Processing..."
                          : "Confirm"}
                      </button>
                      <button
                        onClick={() => setShowArchiveConfirm(false)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* DELETE REPOSITORY */}
              <div className="flex flex-col gap-2 p-3 bg-red-500/5 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-2">
                  <Trash2 size={16} className="text-red-500" />
                  <p className="text-sm font-medium text-red-500">
                    Delete Repository
                  </p>
                </div>
                <p className="text-xs text-[var(--light-text)]">
                  Permanently delete this repository. This action cannot be
                  undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="self-start px-2.5 py-1 text-xs rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
              {/* DELETE CONFIRMATION */}
              {showDeleteConfirm && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <p className="text-sm font-medium text-red-500">
                        Are you absolutely sure?
                      </p>
                    </div>
                    <p className="text-xs text-[var(--light-text)]">
                      This action <strong>cannot</strong> be undone. This will
                      permanently delete the{" "}
                      <strong>{repository.fullName}</strong> repository and all
                      associated data.
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[var(--light-text)]">
                        Please type <strong>{repository.name}</strong> to
                        confirm:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder={repository.name}
                        className="w-full px-2.5 py-1.5 text-sm border border-red-500/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-transparent text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleDeleteRepository}
                        disabled={
                          deleteRepoMutation.isPending ||
                          deleteConfirmText !== repository.name
                        }
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteRepoMutation.isPending
                          ? "Deleting..."
                          : "Delete Repository"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
        {/* MODAL FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[var(--border)]">
          <a
            href={`${repository.htmlUrl}/settings`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--accent-color)] transition"
          >
            <ExternalLink size={14} />
            Open in GitHub
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepositorySettingsPanel;
