// <== IMPORTS ==>
import {
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Clock,
  GitBranch,
  User,
  Plus,
  Trash2,
  Globe,
  CheckCircle,
  XCircle,
  Pause,
  Timer,
  Server,
  Activity,
  Calendar,
  Link2,
  ChevronRight,
  Shield,
} from "lucide-react";
import {
  useRepositoryDetails,
  useDeployments,
  useDeploymentDetails,
  useDeploymentStatuses,
  useEnvironments,
  useCreateDeployment,
  useCreateDeploymentStatus,
  useDeleteDeployment,
  useRepositoryBranches,
  Deployment,
  DeploymentStatus,
  Environment,
} from "../hooks/useGitHub";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { formatDistanceToNow, format } from "date-fns";
import { JSX, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== STATUS CONFIG ==>
const statusConfig: Record<
  DeploymentStatus["state"],
  { icon: typeof CheckCircle; color: string; bgColor: string; label: string }
> = {
  success: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/15",
    label: "Success",
  },
  failure: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/15",
    label: "Failure",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/15",
    label: "Error",
  },
  in_progress: {
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/15",
    label: "In Progress",
  },
  queued: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/15",
    label: "Queued",
  },
  pending: {
    icon: Timer,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/15",
    label: "Pending",
  },
  inactive: {
    icon: Pause,
    color: "text-gray-500",
    bgColor: "bg-gray-500/15",
    label: "Inactive",
  },
};

// <== DEPLOYMENT CARD COMPONENT ==>
type DeploymentCardProps = {
  // <== DEPLOYMENT ==>
  deployment: Deployment;
  // <== ON CLICK ==>
  onClick: () => void;
};

const DeploymentCard = ({
  deployment,
  onClick,
}: DeploymentCardProps): JSX.Element => {
  // GET STATUS CONFIG
  const status = deployment.latestStatus
    ? statusConfig[deployment.latestStatus.state]
    : null;
  const StatusIcon = status?.icon || Clock;
  // RETURN DEPLOYMENT CARD
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition text-left cursor-pointer"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              status?.bgColor || "bg-gray-500/15"
            }`}
          >
            <StatusIcon
              size={16}
              className={`${status?.color || "text-gray-500"} ${
                deployment.latestStatus?.state === "in_progress"
                  ? "animate-spin"
                  : ""
              }`}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
              {deployment.environment}
            </h3>
            <p className="text-xs text-[var(--light-text)] truncate">
              {deployment.ref}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deployment.productionEnvironment && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500/15 text-green-500 rounded-full">
              Production
            </span>
          )}
          {deployment.transientEnvironment && (
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/15 text-purple-500 rounded-full">
              Transient
            </span>
          )}
        </div>
      </div>
      {/* META */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--light-text)]">
        {deployment.creator && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {deployment.creator.login}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDistanceToNow(new Date(deployment.createdAt), {
            addSuffix: true,
          })}
        </span>
        <span className="flex items-center gap-1 font-mono">
          {deployment.sha.substring(0, 7)}
        </span>
        {deployment.latestStatus && (
          <span className={`flex items-center gap-1 ${status?.color}`}>
            {status?.label}
          </span>
        )}
      </div>
      {/* DESCRIPTION */}
      {deployment.description && (
        <p className="mt-2 text-xs text-[var(--light-text)] line-clamp-1">
          {deployment.description}
        </p>
      )}
    </button>
  );
};

// <== ENVIRONMENT CARD COMPONENT ==>
type EnvironmentCardProps = {
  // <== ENVIRONMENT ==>
  environment: Environment;
  // <== DEPLOYMENT COUNT ==>
  deploymentCount?: number;
  // <== ON CLICK ==>
  onClick: () => void;
};

const EnvironmentCard = ({
  environment,
  deploymentCount,
  onClick,
}: EnvironmentCardProps): JSX.Element => {
  // RETURN ENVIRONMENT CARD
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition text-left cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-color) 15%, transparent)",
            }}
          >
            <Server size={18} className="text-[var(--accent-color)]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
              {environment.name}
            </h3>
            <p className="text-xs text-[var(--light-text)]">
              {deploymentCount !== undefined
                ? `${deploymentCount} deployment${
                    deploymentCount !== 1 ? "s" : ""
                  }`
                : "Environment"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {environment.protectionRules &&
            environment.protectionRules.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-500/15 text-yellow-500 rounded-full">
                <Shield size={10} />
                Protected
              </span>
            )}
          <ChevronRight size={16} className="text-[var(--light-text)]" />
        </div>
      </div>
    </button>
  );
};

// <== DEPLOYMENT DETAILS MODAL COMPONENT ==>
type DeploymentDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== DEPLOYMENT ID ==>
  deploymentId: number;
  // <== CAN MANAGE ==>
  canManage: boolean;
  // <== ON DELETE ==>
  onDelete: (deploymentId: number) => void;
  // <== ON SET STATUS ==>
  onSetStatus: (deploymentId: number, state: DeploymentStatus["state"]) => void;
};

const DeploymentDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  deploymentId,
  canManage,
  onDelete,
  onSetStatus,
}: DeploymentDetailsModalProps): JSX.Element | null => {
  // FETCH DEPLOYMENT DETAILS
  const { deployment, isLoading } = useDeploymentDetails(
    owner,
    repo,
    deploymentId,
    isOpen
  );
  // FETCH DEPLOYMENT STATUSES
  const { statuses, isLoading: isStatusesLoading } = useDeploymentStatuses(
    owner,
    repo,
    deploymentId,
    1,
    20,
    isOpen
  );
  // STATUS DROPDOWN STATE
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
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
  // CHECK IF DEPLOYMENT CAN BE DELETED
  const canDelete = canManage && deployment?.latestStatus?.state === "inactive";
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Globe size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {deployment?.environment || "Deployment Details"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {deployment?.ref} • {deployment?.sha.substring(0, 7)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          ) : deployment ? (
            <>
              {/* META INFO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <p className="text-xs font-medium text-[var(--light-text)] mb-1">
                    Created
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {format(
                      new Date(deployment.createdAt),
                      "MMM d, yyyy HH:mm"
                    )}
                  </p>
                </div>
                {deployment.creator && (
                  <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <p className="text-xs font-medium text-[var(--light-text)] mb-1">
                      Creator
                    </p>
                    <a
                      href={deployment.creator.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[var(--accent-color)] hover:underline"
                    >
                      <img
                        src={deployment.creator.avatarUrl}
                        alt={deployment.creator.login}
                        className="w-4 h-4 rounded-full"
                      />
                      {deployment.creator.login}
                    </a>
                  </div>
                )}
              </div>
              {/* DESCRIPTION */}
              {deployment.description && (
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <p className="text-xs font-medium text-[var(--light-text)] mb-1">
                    Description
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {deployment.description}
                  </p>
                </div>
              )}
              {/* ENVIRONMENT URL */}
              {deployment.latestStatus?.environmentUrl && (
                <a
                  href={deployment.latestStatus.environmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-xl text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition"
                >
                  <Link2 size={16} />
                  <span className="text-sm font-medium">View Deployment</span>
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              )}
              {/* STATUS HISTORY */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Status History
                </h3>
                {isStatusesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2
                      size={20}
                      className="animate-spin text-[var(--accent-color)]"
                    />
                  </div>
                ) : statuses.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[var(--light-text)] bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    No status history
                  </div>
                ) : (
                  <div className="space-y-2">
                    {statuses.map((status, index) => {
                      const config = statusConfig[status.state];
                      const StatusIcon = config.icon;
                      return (
                        <div
                          key={status.id}
                          className="flex items-start gap-3 p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}
                          >
                            <StatusIcon
                              size={14}
                              className={`${config.color} ${
                                status.state === "in_progress"
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-sm font-medium ${config.color}`}
                              >
                                {config.label}
                              </span>
                              <span className="text-xs text-[var(--light-text)]">
                                {formatDistanceToNow(
                                  new Date(status.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                            {status.description && (
                              <p className="text-xs text-[var(--light-text)] mt-0.5">
                                {status.description}
                              </p>
                            )}
                            {status.logUrl && (
                              <a
                                href={status.logUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline mt-1"
                              >
                                View logs
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                          {index === 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--accent-color)]/15 text-[var(--accent-color)] rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-sm text-[var(--text-primary)]">
                Deployment not found
              </p>
            </div>
          )}
        </div>
        {/* FOOTER */}
        {canManage && deployment && (
          <div className="flex items-center justify-between gap-3 p-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              {/* SET STATUS DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <Activity size={14} />
                  Set Status
                  <ChevronDown
                    size={14}
                    className={`transition ${
                      showStatusDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showStatusDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowStatusDropdown(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-1 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                      {(
                        [
                          "success",
                          "failure",
                          "error",
                          "in_progress",
                          "queued",
                          "pending",
                          "inactive",
                        ] as const
                      ).map((state) => {
                        const config = statusConfig[state];
                        const Icon = config.icon;
                        return (
                          <button
                            key={state}
                            onClick={() => {
                              onSetStatus(deploymentId, state);
                              setShowStatusDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                          >
                            <Icon size={14} className={config.color} />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              {/* DELETE BUTTON */}
              <button
                onClick={() => onDelete(deploymentId)}
                disabled={!canDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  canDelete
                    ? "Delete deployment"
                    : "Set status to 'inactive' first"
                }
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// <== CREATE DEPLOYMENT MODAL COMPONENT ==>
type CreateDeploymentModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
};

const CreateDeploymentModal = ({
  isOpen,
  onClose,
  owner,
  repo,
}: CreateDeploymentModalProps): JSX.Element | null => {
  // BRANCH STATE
  const [ref, setRef] = useState("");
  // ENVIRONMENT STATE
  const [environment, setEnvironment] = useState("production");
  // DESCRIPTION STATE
  const [description, setDescription] = useState("");
  // PRODUCTION ENVIRONMENT STATE
  const [isProductionEnv, setIsProductionEnv] = useState(true);
  // SHOW BRANCH DROPDOWN STATE
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // SHOW ENVIRONMENT DROPDOWN STATE
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  // FETCH BRANCHES
  const { branches } = useRepositoryBranches(owner, repo, isOpen);
  // FETCH ENVIRONMENTS
  const { environments } = useEnvironments(owner, repo, 1, 100, isOpen);
  // CREATE DEPLOYMENT MUTATION
  const createDeployment = useCreateDeployment();
  // SET DEFAULT BRANCH
  useEffect(() => {
    // CHECK IF BRANCHES ARE LOADED AND NO BRANCH IS SELECTED
    if (branches.length > 0 && !ref) {
      // FIND DEFAULT BRANCH
      const defaultBranch = branches.find(
        (b) => b.name === "main" || b.name === "master"
      );
      // SET DEFAULT BRANCH
      setRef(defaultBranch?.name || branches[0].name);
    }
  }, [branches, ref]);
  // RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (!isOpen) {
      // RESET BRANCH
      setRef("");
      // RESET ENVIRONMENT
      setEnvironment("production");
      // RESET DESCRIPTION
      setDescription("");
      // RESET PRODUCTION ENVIRONMENT
      setIsProductionEnv(true);
      // RESET SHOW BRANCH DROPDOWN
      setShowBranchDropdown(false);
      // RESET SHOW ENVIRONMENT DROPDOWN
      setShowEnvDropdown(false);
    }
  }, [isOpen]);
  // HANDLE SUBMIT
  const handleSubmit = () => {
    // VALIDATE BRANCH
    if (!ref.trim()) {
      // SHOW ERROR TOAST
      toast.error("Please select a branch");
      // RETURN FROM FUNCTION
      return;
    }
    // CREATE DEPLOYMENT
    createDeployment.mutate(
      {
        owner,
        repo,
        ref,
        environment,
        description: description || undefined,
        productionEnvironment: isProductionEnv,
        requiredContexts: [],
      },
      {
        // <== ON SUCCESS ==>
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
  // ENVIRONMENT OPTIONS
  const envOptions = [
    "production",
    "staging",
    "development",
    "preview",
    ...environments
      .map((e) => e.name)
      .filter(
        (name) =>
          !["production", "staging", "development", "preview"].includes(
            name.toLowerCase()
          )
      ),
  ];
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Globe size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Create Deployment
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Deploy a branch to an environment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {/* BRANCH SELECT */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Branch *
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                disabled={createDeployment.isPending}
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  {ref || "Select branch"}
                </span>
                <ChevronDown size={14} className="text-[var(--light-text)]" />
              </button>
              {showBranchDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowBranchDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {branches.map((branch) => (
                      <button
                        key={branch.name}
                        onClick={() => {
                          setRef(branch.name);
                          setShowBranchDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          ref === branch.name
                            ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={14} />
                        {branch.name}
                        {ref === branch.name && (
                          <Check size={14} className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* ENVIRONMENT SELECT */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Environment *
            </label>
            <div className="relative">
              <button
                onClick={() => setShowEnvDropdown(!showEnvDropdown)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                disabled={createDeployment.isPending}
              >
                <span className="flex items-center gap-2">
                  <Server size={14} className="text-[var(--accent-color)]" />
                  {environment}
                </span>
                <ChevronDown size={14} className="text-[var(--light-text)]" />
              </button>
              {showEnvDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEnvDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {envOptions.map((env) => (
                      <button
                        key={env}
                        onClick={() => {
                          setEnvironment(env);
                          setIsProductionEnv(env === "production");
                          setShowEnvDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          environment === env
                            ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <Server size={14} />
                        {env}
                        {environment === env && (
                          <Check size={14} className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deployment description..."
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              disabled={createDeployment.isPending}
            />
          </div>
          {/* PRODUCTION ENVIRONMENT CHECKBOX */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isProductionEnv}
              onChange={(e) => setIsProductionEnv(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]/30"
              disabled={createDeployment.isPending}
            />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Production Environment
              </p>
              <p className="text-xs text-[var(--light-text)]">
                Mark this as a production deployment
              </p>
            </div>
          </label>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            disabled={createDeployment.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createDeployment.isPending || !ref.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createDeployment.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create Deployment
          </button>
        </div>
      </div>
    </div>
  );
};

// <== DELETE CONFIRMATION MODAL ==>
type DeleteConfirmModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== ON CONFIRM ==>
  onConfirm: () => void;
  // <== IS PENDING ==>
  isPending: boolean;
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps): JSX.Element | null => {
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-sm bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* CONTENT */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Delete Deployment?
          </h3>
          <p className="text-sm text-[var(--light-text)]">
            Are you sure you want to delete this deployment? This action cannot
            be undone.
          </p>
        </div>
        {/* FOOTER */}
        <div className="flex items-center gap-3 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// <== SKELETON COMPONENTS ==>
const DeploymentSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--light-text)]/10 rounded-lg" />
          <div className="space-y-1">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          </div>
        </div>
        <div className="h-5 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
    </div>
  );
};

const EnvironmentSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--light-text)]/10 rounded-xl" />
          <div className="space-y-1">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
          </div>
        </div>
        <div className="h-4 bg-[var(--light-text)]/10 rounded w-4" />
      </div>
    </div>
  );
};

// <== PAGE LOADING SKELETON ==>
const PageLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-[var(--light-text)]/10 rounded w-48" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-32" />
      </div>
      {/* TABS SKELETON */}
      <div className="flex gap-2 animate-pulse">
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-28" />
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-28" />
      </div>
      {/* CONTENT SKELETON */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <DeploymentSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// <== GITHUB DEPLOYMENTS PAGE COMPONENT ==>
const GitHubDeploymentsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Deployments - ${owner}/${repo}`);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"deployments" | "environments">(
    "deployments"
  );
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // ENVIRONMENT FILTER STATE
  const [environmentFilter, setEnvironmentFilter] = useState<string>("");
  // SHOW ENVIRONMENT FILTER DROPDOWN STATE
  const [showEnvFilterDropdown, setShowEnvFilterDropdown] = useState(false);
  // SELECTED DEPLOYMENT ID STATE
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<
    number | null
  >(null);
  // CREATE DEPLOYMENT MODAL STATE
  const [showCreateDeploymentModal, setShowCreateDeploymentModal] =
    useState(false);
  // DELETE CONFIRMATION STATE
  const [deleteDeploymentId, setDeleteDeploymentId] = useState<number | null>(
    null
  );
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH DEPLOYMENTS
  const {
    deployments,
    isLoading: isDeploymentsLoading,
    isFetching: isDeploymentsFetching,
    refetch: refetchDeployments,
  } = useDeployments(
    owner || "",
    repo || "",
    1,
    100,
    environmentFilter || undefined
  );
  // FETCH ENVIRONMENTS
  const {
    environments,
    isLoading: isEnvironmentsLoading,
    isFetching: isEnvironmentsFetching,
    refetch: refetchEnvironments,
  } = useEnvironments(owner || "", repo || "");
  // MUTATIONS
  const deleteDeployment = useDeleteDeployment();
  // CREATE DEPLOYMENT STATUS MUTATION
  const createDeploymentStatus = useCreateDeploymentStatus();
  // FILTER DEPLOYMENTS BY SEARCH
  const filteredDeployments = useMemo(() => {
    // IF SEARCH QUERY IS EMPTY, RETURN ALL DEPLOYMENTS
    if (!searchQuery.trim()) return deployments;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER DEPLOYMENTS BY QUERY
    return deployments.filter(
      (deployment) =>
        deployment.environment.toLowerCase().includes(query) ||
        deployment.ref.toLowerCase().includes(query) ||
        deployment.sha.toLowerCase().includes(query) ||
        deployment.description?.toLowerCase().includes(query) ||
        deployment.creator?.login.toLowerCase().includes(query)
    );
  }, [deployments, searchQuery]);
  // FILTER ENVIRONMENTS BY SEARCH
  const filteredEnvironments = useMemo(() => {
    // IF SEARCH QUERY IS EMPTY, RETURN ALL ENVIRONMENTS
    if (!searchQuery.trim()) return environments;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER ENVIRONMENTS BY QUERY
    return environments.filter((env) => env.name.toLowerCase().includes(query));
  }, [environments, searchQuery]);
  // GET DEPLOYMENT COUNT BY ENVIRONMENT
  const getDeploymentCount = (envName: string) => {
    return deployments.filter((d) => d.environment === envName).length;
  };
  // HAS ADMIN PERMISSION
  const hasAdminPermission = repository?.permissions?.admin || false;
  // HANDLE REFRESH
  const handleRefresh = () => {
    // REFRESH DEPLOYMENTS
    refetchDeployments();
    // REFRESH ENVIRONMENTS
    refetchEnvironments();
  };
  // HANDLE DELETE DEPLOYMENT
  const handleDeleteDeployment = (deploymentId: number) => {
    // SET DELETE DEPLOYMENT ID
    setDeleteDeploymentId(deploymentId);
    // CLOSE DETAILS MODAL
    setSelectedDeploymentId(null);
  };
  // HANDLE CONFIRM DELETE
  const handleConfirmDelete = () => {
    // DELETE DEPLOYMENT
    if (deleteDeploymentId) {
      deleteDeployment.mutate(
        {
          owner: owner || "",
          repo: repo || "",
          deploymentId: deleteDeploymentId,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: () => {
            // CLOSE DELETE CONFIRM
            setDeleteDeploymentId(null);
          },
        }
      );
    }
  };
  // HANDLE SET DEPLOYMENT STATUS
  const handleSetStatus = (
    deploymentId: number,
    state: DeploymentStatus["state"]
  ) => {
    // CREATE DEPLOYMENT STATUS
    createDeploymentStatus.mutate({
      owner: owner || "",
      repo: repo || "",
      deploymentId,
      state,
      description: `Status set to ${state}`,
    });
  };
  // HANDLE ENVIRONMENT CLICK
  const handleEnvironmentClick = (envName: string) => {
    // SET ENVIRONMENT FILTER
    setEnvironmentFilter(envName);
    // SWITCH TO DEPLOYMENTS TAB
    setActiveTab("deployments");
  };
  // UNIQUE ENVIRONMENTS FROM DEPLOYMENTS
  const uniqueEnvironments = useMemo(() => {
    const envs = new Set(deployments.map((d) => d.environment));
    return Array.from(envs);
  }, [deployments]);
  // RETURN PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="Deployments"
        subtitle={`${owner}/${repo}`}
      />
      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(`/github/${owner}/${repo}`)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Repository
        </button>
        {/* LOADING STATE */}
        {isRepoLoading || (isDeploymentsLoading && isEnvironmentsLoading) ? (
          <PageLoadingSkeleton />
        ) : !repository ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <AlertCircle size={40} className="text-red-500 mb-3" />
            <p className="text-sm text-[var(--text-primary)]">
              Repository not found
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  {activeTab === "deployments" ? "Deployments" : "Environments"}
                </h1>
                <p className="text-sm text-[var(--light-text)]">
                  {activeTab === "deployments"
                    ? `${deployments.length} deployment${
                        deployments.length !== 1 ? "s" : ""
                      }`
                    : `${environments.length} environment${
                        environments.length !== 1 ? "s" : ""
                      }`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* REFRESH BUTTON */}
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>
                {/* CREATE DEPLOYMENT BUTTON */}
                {hasAdminPermission && activeTab === "deployments" && (
                  <button
                    onClick={() => setShowCreateDeploymentModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                  >
                    <Plus size={16} />
                    New Deployment
                  </button>
                )}
              </div>
            </div>
            {/* TABS */}
            <div className="flex items-center gap-1 mb-4 p-1 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab("deployments");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === "deployments"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Globe size={14} />
                Deployments
              </button>
              <button
                onClick={() => {
                  setActiveTab("environments");
                  setSearchQuery("");
                  setEnvironmentFilter("");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === "environments"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Server size={14} />
                Environments
              </button>
            </div>
            {/* FILTERS (DEPLOYMENTS TAB ONLY) */}
            {activeTab === "deployments" && (
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* SEARCH */}
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="text"
                    placeholder="Search deployments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
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
                {/* ENVIRONMENT FILTER */}
                <div className="relative w-full sm:w-48">
                  <button
                    onClick={() =>
                      setShowEnvFilterDropdown(!showEnvFilterDropdown)
                    }
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Server
                        size={14}
                        className="text-[var(--accent-color)]"
                      />
                      {environmentFilter || "All Environments"}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-[var(--light-text)]"
                    />
                  </button>
                  {showEnvFilterDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowEnvFilterDropdown(false)}
                      />
                      <div className="absolute top-full left-0 sm:left-auto sm:right-0 w-full mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => {
                            setEnvironmentFilter("");
                            setShowEnvFilterDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                            !environmentFilter
                              ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                              : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          <Server size={14} />
                          All Environments
                          {!environmentFilter && (
                            <Check size={14} className="ml-auto" />
                          )}
                        </button>
                        {uniqueEnvironments.map((env) => (
                          <button
                            key={env}
                            onClick={() => {
                              setEnvironmentFilter(env);
                              setShowEnvFilterDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                              environmentFilter === env
                                ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                                : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            <Server size={14} />
                            {env}
                            {environmentFilter === env && (
                              <Check size={14} className="ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* ENVIRONMENTS TAB SEARCH */}
            {activeTab === "environments" && (
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                />
                <input
                  type="text"
                  placeholder="Search environments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
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
            )}
            {/* ENVIRONMENT FILTER BADGE */}
            {environmentFilter && activeTab === "deployments" && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-[var(--light-text)]">
                  Filtered by:
                </span>
                <button
                  onClick={() => setEnvironmentFilter("")}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-[var(--accent-color)]/15 text-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-color)]/25 transition cursor-pointer"
                >
                  <Server size={12} />
                  {environmentFilter}
                  <X size={12} />
                </button>
              </div>
            )}
            {/* DEPLOYMENTS TAB */}
            {activeTab === "deployments" && (
              <div className="space-y-3">
                {isDeploymentsFetching && !isDeploymentsLoading ? (
                  // SHOW SKELETONS DURING REFRESH
                  [1, 2, 3].map((i) => <DeploymentSkeleton key={i} />)
                ) : filteredDeployments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <Globe
                      size={40}
                      className="text-[var(--light-text)] mb-3"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      {searchQuery || environmentFilter
                        ? "No deployments match your search"
                        : "No deployments yet"}
                    </p>
                    {!searchQuery &&
                      !environmentFilter &&
                      hasAdminPermission && (
                        <button
                          onClick={() => setShowCreateDeploymentModal(true)}
                          className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                        >
                          <Plus size={14} />
                          Create first deployment
                        </button>
                      )}
                  </div>
                ) : (
                  filteredDeployments.map((deployment) => (
                    <DeploymentCard
                      key={deployment.id}
                      deployment={deployment}
                      onClick={() => setSelectedDeploymentId(deployment.id)}
                    />
                  ))
                )}
              </div>
            )}
            {/* ENVIRONMENTS TAB */}
            {activeTab === "environments" && (
              <div className="space-y-3">
                {isEnvironmentsFetching && !isEnvironmentsLoading ? (
                  // SHOW SKELETONS DURING REFRESH
                  [1, 2, 3].map((i) => <EnvironmentSkeleton key={i} />)
                ) : filteredEnvironments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <Server
                      size={40}
                      className="text-[var(--light-text)] mb-3"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      {searchQuery
                        ? "No environments match your search"
                        : "No environments configured"}
                    </p>
                  </div>
                ) : (
                  filteredEnvironments.map((env) => (
                    <EnvironmentCard
                      key={env.id}
                      environment={env}
                      deploymentCount={getDeploymentCount(env.name)}
                      onClick={() => handleEnvironmentClick(env.name)}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
      {/* DEPLOYMENT DETAILS MODAL */}
      {selectedDeploymentId && (
        <DeploymentDetailsModal
          isOpen={!!selectedDeploymentId}
          onClose={() => setSelectedDeploymentId(null)}
          owner={owner || ""}
          repo={repo || ""}
          deploymentId={selectedDeploymentId}
          canManage={hasAdminPermission}
          onDelete={handleDeleteDeployment}
          onSetStatus={handleSetStatus}
        />
      )}
      {/* CREATE DEPLOYMENT MODAL */}
      <CreateDeploymentModal
        isOpen={showCreateDeploymentModal}
        onClose={() => setShowCreateDeploymentModal(false)}
        owner={owner || ""}
        repo={repo || ""}
      />
      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteDeploymentId}
        onClose={() => setDeleteDeploymentId(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteDeployment.isPending}
      />
    </div>
  );
};

export default GitHubDeploymentsPage;
