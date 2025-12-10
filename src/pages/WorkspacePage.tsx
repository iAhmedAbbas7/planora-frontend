// <== IMPORTS ==>
import {
  ArrowLeft,
  Users,
  GitBranch,
  Settings,
  Plus,
  Mail,
  Crown,
  Shield,
  User,
  Eye,
  MoreVertical,
  Trash2,
  UserMinus,
  Clock,
  X,
  ExternalLink,
  Lock,
  Globe,
  BarChart2,
} from "lucide-react";
import {
  useWorkspaceById,
  useWorkspaceMembers,
  useWorkspaceInvitations,
  useSendInvitation,
  useRemoveMember,
  useUpdateMemberRole,
  useCancelInvitation,
  useUnlinkRepository,
  WorkspaceMember,
  WorkspaceInvitation,
} from "../hooks/useWorkspace";
import { AxiosError } from "axios";
import { JSX, useState } from "react";
import useTitle from "../hooks/useTitle";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import { WorkspaceDetailSkeleton } from "../components/skeletons/WorkspaceSkeleton";
import DORAMetricsDashboard from "../components/workspace/analytics/DORAMetricsDashboard";

// <== ROLE BADGE COMPONENT ==>
const RoleBadge = ({
  role,
  size = "sm",
}: {
  role: "owner" | "admin" | "member" | "viewer";
  size?: "sm" | "md";
}): JSX.Element => {
  // ROLE CONFIG
  const roleConfig = {
    // OWNER ROLE CONFIG
    owner: {
      icon: Crown,
      label: "Owner",
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    // ADMIN ROLE CONFIG
    admin: {
      icon: Shield,
      label: "Admin",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    // MEMBER ROLE CONFIG
    member: {
      icon: User,
      label: "Member",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    // VIEWER ROLE CONFIG
    viewer: {
      icon: Eye,
      label: "Viewer",
      className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    },
  };
  // GET ROLE CONFIG (DEFAULT TO MEMBER IF NOT FOUND)
  const config = roleConfig[role] || roleConfig.member;
  // GET ICON
  const Icon = config.icon;
  // GET SIZE CLASS
  const sizeClass =
    size === "md" ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs";
  // RETURNING ROLE BADGE COMPONENT
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizeClass} ${config.className}`}
    >
      <Icon size={size === "md" ? 14 : 12} />
      {config.label}
    </span>
  );
};

// <== MEMBER CARD COMPONENT ==>
const MemberCard = ({
  member,
  currentUserRole,
  onRemove,
  onUpdateRole,
}: {
  member: WorkspaceMember;
  currentUserRole?: "owner" | "admin" | "member" | "viewer";
  onRemove: () => void;
  onUpdateRole: (role: "admin" | "member" | "viewer") => void;
}): JSX.Element => {
  // STATE
  const [showMenu, setShowMenu] = useState(false);
  // CAN MANAGE
  const canManage =
    currentUserRole === "owner" ||
    (currentUserRole === "admin" &&
      member.role !== "owner" &&
      member.role !== "admin");
  // RETURNING MEMBER CARD COMPONENT
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={
            member.user?.profilePic ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.user?.name || "User"
            )}&background=7c3aed&color=fff`
          }
          alt={member.user?.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--primary-text)] truncate">
            {member.user?.name}
          </p>
          <p className="text-xs text-[var(--light-text)] truncate">
            {member.user?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <RoleBadge role={member.role} />
        {canManage && member.role !== "owner" && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)]"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                  {member.role !== "admin" && (
                    <button
                      onClick={() => {
                        onUpdateRole("admin");
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2"
                    >
                      <Shield size={14} />
                      Make Admin
                    </button>
                  )}
                  {member.role !== "member" && (
                    <button
                      onClick={() => {
                        onUpdateRole("member");
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2"
                    >
                      <User size={14} />
                      Make Member
                    </button>
                  )}
                  {member.role !== "viewer" && (
                    <button
                      onClick={() => {
                        onUpdateRole("viewer");
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2"
                    >
                      <Eye size={14} />
                      Make Viewer
                    </button>
                  )}
                  <hr className="my-1 border-[var(--border)]" />
                  <button
                    onClick={() => {
                      onRemove();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-500/10 text-red-500 flex items-center gap-2"
                  >
                    <UserMinus size={14} />
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// <== INVITATION CARD COMPONENT ==>
const InvitationListCard = ({
  invitation,
  onCancel,
}: {
  invitation: WorkspaceInvitation;
  onCancel: () => void;
}): JSX.Element => {
  // GET EXPIRES AT DATE
  const expiresAt = new Date(invitation.expiresAt);
  // GET CURRENT DATE
  const now = new Date();
  // GET HOURS LEFT
  const hoursLeft = Math.max(
    0,
    Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))
  );
  // RETURNING INVITATION CARD COMPONENT
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--hover-bg)]/50 border border-[var(--border)] rounded-lg">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
          <Mail size={18} className="text-[var(--accent-color)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--primary-text)] truncate">
            {invitation.inviteeEmail}
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
            <span>Invited as {invitation.role}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {hoursLeft > 24
                ? `${Math.floor(hoursLeft / 24)}d`
                : `${hoursLeft}h`}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onCancel}
        className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// <== INVITE MODAL COMPONENT ==>
const InviteModal = ({
  workspaceId,
  onClose,
}: {
  workspaceId: string;
  onClose: () => void;
}): JSX.Element => {
  // STATE
  const [email, setEmail] = useState("");
  // STATE
  const [role, setRole] = useState<"admin" | "member" | "viewer">("member");
  // MUTATION
  const sendInvitation = useSendInvitation();
  // HANDLE SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    // PREVENT DEFAULT
    e.preventDefault();
    // CHECK IF EMAIL IS VALID
    if (!email.trim()) return;
    // SEND INVITATION
    sendInvitation.mutate(
      { workspaceId, email: email.trim(), role },
      {
        // ON SUCCESS
        onSuccess: () => {
          // CLOSE MODAL
          onClose();
        },
      }
    );
  };
  // RETURNING INVITE MODAL COMPONENT
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* MODAL CONTAINER */}
      <div className="w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--primary-text)]">
            Invite Member
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)]"
          >
            <X size={20} />
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* EMAIL ADDRESS */}
          <div>
            <label className="text-sm font-medium text-[var(--primary-text)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full mt-1.5 px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>
          {/* ROLE */}
          <div>
            <label className="text-sm font-medium text-[var(--primary-text)]">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(["admin", "member", "viewer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all capitalize ${
                    role === r
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)]"
                      : "border-[var(--border)] hover:border-[var(--light-text)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)]"
            >
              Cancel
            </button>
            {/* SEND INVITE BUTTON */}
            <button
              type="submit"
              disabled={!email.trim() || sendInvitation.isPending}
              className="px-4 py-2 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] disabled:opacity-50"
            >
              {sendInvitation.isPending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// <== WORKSPACE PAGE COMPONENT ==>
const WorkspacePage = (): JSX.Element => {
  // GET WORKSPACE ID FROM URL
  const { id: workspaceId } = useParams<{ id: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET PAGE TITLE
  useTitle("PlanOra - Workspace");
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "repos" | "analytics"
  >("overview");
  // SHOW INVITE MODAL STATE
  const [showInviteModal, setShowInviteModal] = useState(false);
  // FETCH DATA
  const { workspace, isLoading, isError, error } = useWorkspaceById(
    workspaceId || null
  );
  // FETCH MEMBERS
  const { members } = useWorkspaceMembers(workspaceId || null);
  // FETCH INVITATIONS
  const { invitations } = useWorkspaceInvitations(workspaceId || null);
  // REMOVE MEMBER MUTATION
  const removeMember = useRemoveMember();
  // UPDATE MEMBER ROLE MUTATION
  const updateMemberRole = useUpdateMemberRole();
  // CANCEL INVITATION MUTATION
  const cancelInvitation = useCancelInvitation();
  // UNLINK REPOSITORY MUTATION
  const unlinkRepository = useUnlinkRepository();
  // LOADING STATE
  if (isLoading) {
    // RETURN WORKSPACE DETAIL SKELETON
    return <WorkspaceDetailSkeleton />;
  }
  // IF ERROR OR NO WORKSPACE, SHOW ERROR MESSAGE
  if (isError || !workspace) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError<{ message?: string }>;
    // GET ERROR MESSAGE
    const errorMessage =
      axiosError?.response?.data?.message || "Workspace not found";
    // RETURN ERROR MESSAGE COMPONENT
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-red-500 mb-2">
            {errorMessage}
          </p>
          <button
            onClick={() => navigate("/workspaces")}
            className="text-[var(--accent-color)] hover:underline"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }
  // GET PENDING INVITATIONS COUNT
  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  // RETURNING THE WORKSPACE PAGE COMPONENT
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* HEADER */}
      <DashboardHeader
        title={workspace.name}
        subtitle={workspace.description || "Workspace"}
        showSearch={false}
      />
      {/* BACK BUTTON AND HEADER INFO */}
      <div className="p-4 md:p-6 border-b border-[var(--border)]">
        <button
          onClick={() => navigate("/workspaces")}
          className="flex items-center gap-2 text-sm text-[var(--light-text)] hover:text-[var(--primary-text)] mb-4"
        >
          <ArrowLeft size={16} />
          Back to Workspaces
        </button>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] font-bold text-xl sm:text-2xl flex-shrink-0">
            {workspace.avatar ? (
              <img
                src={workspace.avatar}
                alt={workspace.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              workspace.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">
                {workspace.name}
              </h1>
              {workspace.visibility === "private" ? (
                <Lock
                  size={16}
                  className="text-[var(--light-text)] flex-shrink-0"
                />
              ) : (
                <Globe
                  size={16}
                  className="text-[var(--light-text)] flex-shrink-0"
                />
              )}
              {workspace.userRole && (
                <RoleBadge role={workspace.userRole} size="md" />
              )}
            </div>
            {workspace.description && (
              <p className="text-[var(--light-text)] text-sm line-clamp-2">
                {workspace.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-[var(--light-text)]">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {workspace.memberCount || members.length} members
              </span>
              <span className="flex items-center gap-1">
                <GitBranch size={14} />
                {workspace.linkedRepositories?.length || 0} repos
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* TABS */}
      <div className="border-b border-[var(--border)] overflow-x-auto">
        <div className="flex gap-1 px-4 md:px-6 min-w-max">
          {[
            { id: "overview", label: "Overview", icon: Settings },
            {
              id: "members",
              label: "Members",
              icon: Users,
              count: members.length,
            },
            {
              id: "repos",
              label: "Repos",
              icon: GitBranch,
              count: workspace.linkedRepositories?.length || 0,
            },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "overview" | "members" | "repos" | "analytics"
                )
              }
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--accent-color)] text-[var(--accent-color)]"
                  : "border-transparent text-[var(--light-text)] hover:text-[var(--primary-text)]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 text-xs bg-[var(--hover-bg)] rounded">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* TAB CONTENT */}
      <div className="p-4 md:p-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* STATS CARDS */}
            <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">
                    {members.length}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--light-text)] truncate">
                    Members
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <GitBranch
                    size={16}
                    className="sm:w-5 sm:h-5 text-purple-500"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">
                    {workspace.linkedRepositories?.length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--light-text)] truncate">
                    Repositories
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">
                    {pendingInvitations.length}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--light-text)] truncate">
                    Invitations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* MEMBERS TAB */}
        {activeTab === "members" && (
          <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--primary-text)]">
                Team Members
              </h3>
              {(workspace.userRole === "owner" ||
                workspace.userRole === "admin" ||
                workspace.userPermissions?.canInvite) && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] text-sm font-medium"
                >
                  <Plus size={16} />
                  Invite Member
                </button>
              )}
            </div>
            {/* MEMBERS LIST */}
            <div className="space-y-2">
              {members.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  currentUserRole={workspace.userRole}
                  onRemove={() =>
                    removeMember.mutate({
                      workspaceId: workspaceId!,
                      memberId: member.userId,
                    })
                  }
                  onUpdateRole={(role) =>
                    updateMemberRole.mutate({
                      workspaceId: workspaceId!,
                      memberId: member.userId,
                      role,
                    })
                  }
                />
              ))}
            </div>
            {/* PENDING INVITATIONS */}
            {pendingInvitations.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-[var(--primary-text)] mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-[var(--accent-color)]" />
                  Pending Invitations ({pendingInvitations.length})
                </h4>
                <div className="space-y-2">
                  {pendingInvitations.map((invitation) => (
                    <InvitationListCard
                      key={invitation._id}
                      invitation={invitation}
                      onCancel={() =>
                        cancelInvitation.mutate({
                          workspaceId: workspaceId!,
                          invitationId: invitation._id,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* REPOSITORIES TAB */}
        {activeTab === "repos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--primary-text)]">
                Linked Repositories
              </h3>
            </div>
            {workspace.linkedRepositories &&
            workspace.linkedRepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workspace.linkedRepositories.map((repo) => (
                  <div
                    key={repo.repoId}
                    className="flex items-center justify-between p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center flex-shrink-0">
                        <GitBranch
                          size={20}
                          className="text-[var(--light-text)]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--primary-text)] truncate">
                          {repo.fullName}
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          Linked {new Date(repo.linkedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`https://github.com/${repo.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)]"
                      >
                        <ExternalLink size={16} />
                      </a>
                      {workspace.userPermissions?.canManageRepos && (
                        <button
                          onClick={() =>
                            unlinkRepository.mutate({
                              workspaceId: workspaceId!,
                              repoId: repo.repoId,
                            })
                          }
                          className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--light-text)]">
                <GitBranch size={40} className="mx-auto mb-3 opacity-50" />
                <p>No repositories linked yet</p>
                <p className="text-sm">
                  Link repositories to track code changes in this workspace
                </p>
              </div>
            )}
          </div>
        )}
        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <DORAMetricsDashboard workspaceId={workspaceId!} />
        )}
      </div>
      {/* INVITE MODAL */}
      {showInviteModal && (
        <InviteModal
          workspaceId={workspaceId!}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default WorkspacePage;
