// <== IMPORTS ==>
import {
  Github,
  ExternalLink,
  Unlink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Sparkles,
  Users,
  GitFork,
  Star,
  Calendar,
  Link2,
  RotateCcw,
} from "lucide-react";
import { AxiosError } from "axios";
import { JSX, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ConfirmationModal from "../common/ConfirmationModal";
import type { ModalType } from "../common/ConfirmationModal";
import IntegrationsSkeleton from "../skeletons/IntegrationsSkeleton";
import {
  useGitHubStatus,
  useGitHubProfile,
  useDisconnectGitHub,
  getGitHubLinkUrl,
} from "../../hooks/useGitHub";

// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== MESSAGE FIELD ==>
  message?: string;
  // <== SUCCESS FIELD ==>
  success?: boolean;
};

// <== INTEGRATIONS COMPONENT ==>
const Integrations = (): JSX.Element => {
  // SEARCH PARAMS HOOK
  const [searchParams, setSearchParams] = useSearchParams();
  // GITHUB STATUS HOOK
  const { status, isLoading, refetchStatus } = useGitHubStatus();
  // GITHUB PROFILE HOOK (ONLY FETCH IF CONNECTED)
  const { profile, isLoading: isProfileLoading } = useGitHubProfile(
    status?.isConnected ?? false
  );
  // DISCONNECT GITHUB MUTATION
  const disconnectMutation = useDisconnectGitHub();
  // MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  // SHOW DISCONNECT CONFIRM MODAL STATE
  const [showDisconnectModal, setShowDisconnectModal] =
    useState<boolean>(false);
  // HANDLE URL PARAMS FOR SUCCESS/ERROR MESSAGES
  useEffect(() => {
    // CHECK FOR SUCCESS PARAM
    const success = searchParams.get("success");
    // CHECK FOR ERROR PARAM
    const error = searchParams.get("error");
    // CHECK FOR MESSAGE PARAM
    const message = searchParams.get("message");
    // IF SUCCESS PARAM EXISTS
    if (success === "github_linked") {
      // SHOW SUCCESS MODAL
      setModalState({
        isOpen: true,
        type: "success",
        title: "GitHub Connected!",
        message:
          "Your GitHub account has been successfully linked to PlanOra. You can now access your repositories and use AI features.",
      });
      // REFETCH STATUS
      refetchStatus();
      // CLEAR URL PARAMS
      setSearchParams({});
    }
    // IF ERROR PARAM EXISTS
    if (error === "github_link_failed") {
      // SHOW ERROR MODAL
      setModalState({
        isOpen: true,
        type: "error",
        title: "Connection Failed",
        message:
          message || "Failed to connect your GitHub account. Please try again.",
      });
      // CLEAR URL PARAMS
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refetchStatus]);
  // HANDLE CONNECT GITHUB
  const handleConnectGitHub = (): void => {
    // GET GITHUB LINK URL
    const linkUrl = getGitHubLinkUrl();
    // REDIRECT TO GITHUB OAUTH
    window.location.href = linkUrl;
  };
  // HANDLE DISCONNECT GITHUB
  const handleDisconnectGitHub = (): void => {
    // SHOW DISCONNECT CONFIRM MODAL
    setShowDisconnectModal(true);
  };
  // CONFIRM DISCONNECT GITHUB
  const confirmDisconnectGitHub = (): void => {
    // DISCONNECT GITHUB
    disconnectMutation.mutate(undefined, {
      // <== ON SUCCESS ==>
      onSuccess: () => {
        // CLOSE DISCONNECT MODAL
        setShowDisconnectModal(false);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "GitHub Disconnected",
          message:
            "Your GitHub account has been disconnected from PlanOra. You can reconnect it anytime.",
        });
        // REFETCH STATUS
        refetchStatus();
      },
      // <== ON ERROR ==>
      onError: (error: unknown) => {
        // TYPE ERROR AS AXIOS ERROR
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // GET ERROR MESSAGE
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to disconnect GitHub account. Please try again.";
        // CLOSE DISCONNECT MODAL
        setShowDisconnectModal(false);
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: errorMessage,
        });
      },
    });
  };
  // FORMAT DATE FUNCTION
  const formatDate = (dateString: string | null): string => {
    // IF NO DATE STRING, RETURN N/A
    if (!dateString) return "N/A";
    // RETURN FORMATTED DATE
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <IntegrationsSkeleton />;
  }
  // RETURNING THE INTEGRATIONS COMPONENT
  return (
    // INTEGRATIONS MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-4 sm:p-6 bg-[var(--cards-bg)] space-y-4 sm:space-y-6 shadow-sm">
      {/* HEADER SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
          Integrations
        </p>
        {/* DESCRIPTION */}
        <p className="text-xs sm:text-sm text-[var(--light-text)]">
          Connect external services to enhance your PlanOra experience.
        </p>
      </div>
      {/* GITHUB INTEGRATION SECTION */}
      <div className="p-3 sm:p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
        {/* GITHUB HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          {/* GITHUB INFO */}
          <div className="flex items-center gap-3">
            {/* GITHUB ICON */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <Github
                size={20}
                className="text-[var(--text-primary)] sm:w-6 sm:h-6"
              />
            </div>
            <div className="min-w-0">
              {/* GITHUB TITLE */}
              <p className="font-medium text-sm sm:text-base text-[var(--text-primary)]">
                GitHub
              </p>
              {/* GITHUB DESCRIPTION */}
              <p className="text-xs sm:text-sm text-[var(--light-text)]">
                Access repositories, commits, and issues
              </p>
            </div>
          </div>
          {/* CONNECTION STATUS BADGE */}
          {status?.isConnected ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold self-start sm:self-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, #22c55e 15%, var(--cards-bg))",
                color: "var(--accent-green-500)",
              }}
            >
              <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
              Connected
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold self-start sm:self-center"
              style={{
                backgroundColor: "var(--hover-bg)",
                color: "var(--light-text)",
              }}
            >
              <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />
              Not Connected
            </span>
          )}
        </div>
        {/* GITHUB CONTENT - CONNECTED */}
        {status?.isConnected && (
          <div className="space-y-3 sm:space-y-4">
            {/* PROFILE INFO */}
            {isProfileLoading ? (
              // PROFILE LOADING SKELETON
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg animate-pulse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--hover-bg)] rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 sm:h-5 w-24 sm:w-32 bg-[var(--hover-bg)] rounded-md mb-2"></div>
                  <div className="h-3 sm:h-4 w-36 sm:w-48 bg-[var(--hover-bg)] rounded-md"></div>
                </div>
              </div>
            ) : profile ? (
              // PROFILE INFO CARD
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg">
                {/* AVATAR */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.login}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--border)] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  {/* USERNAME */}
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm sm:text-base text-[var(--text-primary)] truncate">
                      @{profile.login}
                    </p>
                    <a
                      href={profile.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--light-text)] hover:text-[var(--accent-color)] transition flex-shrink-0"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  {/* STATS */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--light-text)] mt-1">
                    <span className="flex items-center gap-1">
                      <GitFork size={11} />
                      {profile.publicRepos} repos
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {profile.followers} followers
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Star size={11} />
                      {profile.following} following
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {/* CONNECTION INFO */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs text-[var(--light-text)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Connected: {formatDate(status.connectedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Link2 size={13} />
                Username: @{status.githubUsername}
              </span>
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 border-t border-[var(--border)]">
              {/* VIEW REPOSITORIES BUTTON */}
              <a
                href="/github"
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition text-white cursor-pointer w-full sm:w-auto"
                style={{ backgroundColor: "var(--accent-color)" }}
              >
                <Github size={15} />
                View Repositories
              </a>
              {/* REFRESH CONNECTION BUTTON */}
              <button
                onClick={() => refetchStatus()}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer text-[var(--text-primary)] w-full sm:w-auto"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
              {/* DISCONNECT BUTTON */}
              <button
                onClick={handleDisconnectGitHub}
                disabled={disconnectMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                style={{
                  borderColor: "color-mix(in srgb, #ef4444 40%, var(--border))",
                  color: "#ef4444",
                }}
              >
                {disconnectMutation.isPending ? (
                  <>
                    <RotateCcw size={15} className="animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Unlink size={15} />
                    Disconnect
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {/* GITHUB CONTENT - NOT CONNECTED */}
        {!status?.isConnected && (
          <div className="space-y-3 sm:space-y-4">
            {/* BENEFITS LIST */}
            <div className="p-2.5 sm:p-3 bg-[var(--cards-bg)] rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-2">
                Connect GitHub to:
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[var(--light-text)]">
                <li className="flex items-start sm:items-center gap-2">
                  <CheckCircle
                    size={13}
                    className="text-[var(--accent-green-500)] flex-shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span>Browse your repositories and view commit history</span>
                </li>
                <li className="flex items-start sm:items-center gap-2">
                  <CheckCircle
                    size={13}
                    className="text-[var(--accent-green-500)] flex-shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span>Link repositories to your PlanOra projects</span>
                </li>
                <li className="flex items-start sm:items-center gap-2">
                  <CheckCircle
                    size={13}
                    className="text-[var(--accent-green-500)] flex-shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span>
                    Generate tasks from README files and commits using AI
                  </span>
                </li>
                <li className="flex items-start sm:items-center gap-2">
                  <CheckCircle
                    size={13}
                    className="text-[var(--accent-green-500)] flex-shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span>
                    Get AI-powered task suggestions based on your code
                  </span>
                </li>
              </ul>
            </div>
            {/* CONNECT BUTTON */}
            <button
              onClick={handleConnectGitHub}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition text-white cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <Github size={16} />
              Connect GitHub Account
            </button>
          </div>
        )}
      </div>
      {/* AI FEATURES SECTION */}
      <div className="p-3 sm:p-4 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
        {/* AI HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* AI INFO */}
          <div className="flex items-center gap-3">
            {/* AI ICON */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <Sparkles
                size={20}
                className="text-[var(--accent-color)] sm:w-6 sm:h-6"
              />
            </div>
            <div className="min-w-0">
              {/* AI TITLE */}
              <p className="font-medium text-sm sm:text-base text-[var(--text-primary)]">
                AI Task Generation
              </p>
              {/* AI DESCRIPTION */}
              <p className="text-xs sm:text-sm text-[var(--light-text)]">
                Powered by Google Gemini • Generate tasks from GitHub data
              </p>
            </div>
          </div>
          {/* AI STATUS BADGE */}
          {status?.isConnected ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold self-start sm:self-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, #22c55e 15%, var(--cards-bg))",
                color: "var(--accent-green-500)",
              }}
            >
              <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
              Ready
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold self-start sm:self-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, #eab308 15%, var(--cards-bg))",
                color: "#eab308",
              }}
            >
              <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />
              Connect GitHub
            </span>
          )}
        </div>
        {/* AI FEATURES INFO */}
        {!status?.isConnected && (
          <p className="text-xs sm:text-sm text-[var(--light-text)] mt-3 sm:pl-12 lg:pl-13">
            Connect your GitHub account above to unlock AI-powered task
            generation features.
          </p>
        )}
      </div>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (modalState.onConfirm) {
            modalState.onConfirm();
          }
          setModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
      {/* DISCONNECT CONFIRM MODAL */}
      <ConfirmationModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={confirmDisconnectGitHub}
        title="Disconnect GitHub"
        message="Are you sure you want to disconnect your GitHub account? You will lose access to repository browsing and AI task generation features until you reconnect."
        type="warning"
      />
    </div>
  );
};

export default Integrations;
