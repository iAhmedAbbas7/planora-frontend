// <== IMPORTS ==>
import {
  Plus,
  Users,
  Lock,
  Globe,
  GitBranch,
  Crown,
  Shield,
  User,
  Eye,
  Mail,
  Check,
  X,
  Clock,
  Building2,
} from "lucide-react";
import {
  useWorkspaces,
  useMyInvitations,
  useAcceptInvitation,
  useDeclineInvitation,
  Workspace,
  WorkspaceInvitation,
} from "../hooks/useWorkspace";
import { AxiosError } from "axios";
import { JSX, useState } from "react";
import useTitle from "../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import WorkspaceSkeleton from "../components/skeletons/WorkspaceSkeleton";
import CreateWorkspaceModal from "../components/workspace/CreateWorkspaceModal";

// <== ROLE BADGE COMPONENT ==>
const RoleBadge = ({
  role,
}: {
  role: "owner" | "admin" | "member" | "viewer";
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
  // RETURNING ROLE BADGE COMPONENT
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

// <== WORKSPACE CARD COMPONENT ==>
const WorkspaceCard = ({
  workspace,
  onClick,
}: {
  workspace: Workspace;
  onClick: () => void;
}): JSX.Element => {
  // RETURNING WORKSPACE CARD COMPONENT
  return (
    <div
      onClick={onClick}
      className="group relative bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-color)]/5"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        {/* AVATAR AND NAME */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* AVATAR */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] font-bold text-base sm:text-lg flex-shrink-0">
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
          {/* NAME AND VISIBILITY */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--primary-text)] group-hover:text-[var(--accent-color)] transition-colors truncate">
              {workspace.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--light-text)]">
              {workspace.visibility === "private" ? (
                <>
                  <Lock size={12} />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe size={12} />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* ROLE BADGE */}
        {workspace.userRole && <RoleBadge role={workspace.userRole} />}
      </div>
      {/* DESCRIPTION */}
      {workspace.description && (
        <p className="text-sm text-[var(--light-text)] line-clamp-2 mb-3 sm:mb-4">
          {workspace.description}
        </p>
      )}
      {/* STATS */}
      <div className="flex items-center gap-4 text-xs text-[var(--light-text)]">
        {/* MEMBERS */}
        <div className="flex items-center gap-1.5">
          <Users size={14} />
          <span>{workspace.memberCount || 1} members</span>
        </div>
        {/* REPOSITORIES */}
        <div className="flex items-center gap-1.5">
          <GitBranch size={14} />
          <span>{workspace.linkedRepositories?.length || 0} repos</span>
        </div>
      </div>
      {/* OWNER INFO */}
      {workspace.owner && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
            <img
              src={
                workspace.owner.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  workspace.owner.name
                )}&background=7c3aed&color=fff`
              }
              alt={workspace.owner.name}
              className="w-5 h-5 rounded-full"
            />
            <span className="truncate">Owned by {workspace.owner.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// <== INVITATION CARD COMPONENT ==>
const InvitationCard = ({
  invitation,
  onAccept,
  onDecline,
  isLoading,
}: {
  invitation: WorkspaceInvitation;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
}): JSX.Element => {
  // FORMAT EXPIRY DATE
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
    <div className="bg-gradient-to-r from-[var(--accent-color)]/5 to-purple-500/5 border border-[var(--accent-color)]/20 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* ICON */}
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
            <Mail size={20} className="text-[var(--accent-color)]" />
          </div>
          {/* INFO */}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-[var(--primary-text)] truncate">
              {invitation.workspace?.name || "Workspace"}
            </h4>
            <p className="text-xs text-[var(--light-text)] truncate">
              Invited by {invitation.inviter?.name || "Unknown"} as{" "}
              <span className="font-medium">{invitation.role}</span>
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
              <Clock size={12} />
              <span>
                Expires in{" "}
                {hoursLeft > 24
                  ? `${Math.floor(hoursLeft / 24)} days`
                  : `${hoursLeft} hours`}
              </span>
            </div>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onDecline}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition-colors disabled:opacity-50"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// <== EMPTY STATE COMPONENT ==>
const EmptyState = ({
  onCreateClick,
}: {
  onCreateClick: () => void;
}): JSX.Element => {
  // RETURNING EMPTY STATE COMPONENT
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-[var(--accent-color)]/10 flex items-center justify-center mb-6">
        <Building2 size={40} className="text-[var(--accent-color)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--primary-text)] mb-2">
        No Workspaces Yet
      </h3>
      <p className="text-[var(--light-text)] text-center max-w-md mb-6 text-sm sm:text-base">
        Create your first workspace to collaborate with your team, track
        projects, and manage repositories all in one place.
      </p>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors shadow-lg shadow-[var(--accent-color)]/20"
      >
        <Plus size={18} />
        Create Workspace
      </button>
    </div>
  );
};

// <== WORKSPACES PAGE COMPONENT ==>
const WorkspacesPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Workspaces");
  // NAVIGATE
  const navigate = useNavigate();
  // MODAL STATE
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // FETCH WORKSPACES
  const { workspaces, isLoading, isError, error } = useWorkspaces();
  // FETCH MY INVITATIONS
  const { invitations: myInvitations } = useMyInvitations();
  // ACCEPT INVITATION MUTATION
  const acceptInvitation = useAcceptInvitation();
  // DECLINE INVITATION MUTATION
  const declineInvitation = useDeclineInvitation();
  // HANDLE ACCEPT INVITATION
  const handleAcceptInvitation = (token: string) => {
    acceptInvitation.mutate(token);
  };
  // HANDLE DECLINE INVITATION
  const handleDeclineInvitation = (token: string) => {
    declineInvitation.mutate(token);
  };
  // HANDLE WORKSPACE CLICK
  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`);
  };
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <WorkspaceSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE COMPONENT
  if (isError && error) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError<{ message?: string }>;
    // GET ERROR MESSAGE
    const errorMessage =
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Unknown error";
    // RETURN ERROR MESSAGE COMPONENT
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-center px-4">
          <p className="text-lg font-medium text-red-500 mb-2">
            Error loading workspaces
          </p>
          <p className="text-sm text-[var(--light-text)]">{errorMessage}</p>
        </div>
      </div>
    );
  }
  // RETURNING THE WORKSPACES PAGE COMPONENT
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* PAGE HEADER */}
      <DashboardHeader
        title="Workspaces"
        subtitle="Collaborate with your team in shared workspaces"
      />
      {/* MAIN CONTENT */}
      <div className="p-4 md:p-6">
        {/* PENDING INVITATIONS */}
        {myInvitations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[var(--primary-text)] mb-3 flex items-center gap-2">
              <Mail size={16} className="text-[var(--accent-color)]" />
              Pending Invitations ({myInvitations.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation._id}
                  invitation={invitation}
                  onAccept={() => handleAcceptInvitation(invitation.token)}
                  onDecline={() => handleDeclineInvitation(invitation.token)}
                  isLoading={
                    acceptInvitation.isPending || declineInvitation.isPending
                  }
                />
              ))}
            </div>
          </div>
        )}
        {/* HEADER ROW */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--primary-text)]">
            Your Workspaces
          </h2>
          {workspaces.length > 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              New Workspace
            </button>
          )}
        </div>
        {/* WORKSPACES GRID OR EMPTY STATE */}
        {workspaces.length === 0 ? (
          <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onClick={() => handleWorkspaceClick(workspace._id)}
              />
            ))}
          </div>
        )}
      </div>
      {/* CREATE WORKSPACE MODAL */}
      {isCreateModalOpen && (
        <CreateWorkspaceModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default WorkspacesPage;
