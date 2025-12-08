// <== IMPORTS ==>
import {
  Bell,
  Check,
  CheckCheck,
  GitPullRequest,
  CircleDot,
  MessageSquare,
  Tag,
  AlertTriangle,
  Mail,
  MailOpen,
  GitCommit,
  Loader2,
  RefreshCw,
  BellOff,
  Search,
  X,
  Filter,
  ChevronDown,
  ArrowLeft,
  Settings,
} from "lucide-react";
import {
  useGitHubNotifications,
  useMarkGitHubNotificationAsRead,
  useMarkAllGitHubNotificationsAsRead,
  useUnsubscribeGitHubNotification,
  useGitHubStatus,
  GitHubNotification,
  GitHubNotificationSubjectType,
  GitHubNotificationReason,
} from "../hooks/useGitHub";
import useTitle from "../hooks/useTitle";
import { JSX, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== NOTIFICATION ICON COMPONENT ==>
const NotificationIcon = ({
  type,
  size = 18,
}: {
  type: GitHubNotificationSubjectType;
  size?: number;
}): JSX.Element => {
  // GET ICON BASED ON TYPE
  switch (type) {
    // ISSUE
    case "Issue":
      return <CircleDot size={size} className="text-green-500" />;
    // PULL REQUEST
    case "PullRequest":
      return <GitPullRequest size={size} className="text-purple-500" />;
    // COMMIT
    case "Commit":
      return <GitCommit size={size} className="text-blue-500" />;
    // RELEASE
    case "Release":
      return <Tag size={size} className="text-orange-500" />;
    // DISCUSSION
    case "Discussion":
      return <MessageSquare size={size} className="text-cyan-500" />;
    // REPOSITORY VULNERABILITY ALERT
    case "RepositoryVulnerabilityAlert":
      return <AlertTriangle size={size} className="text-red-500" />;
    // CHECK SUITE
    case "CheckSuite":
      return <Check size={size} className="text-yellow-500" />;
    // REPOSITORY INVITATION
    case "RepositoryInvitation":
      return <Mail size={size} className="text-pink-500" />;
    // DEFAULT
    default:
      return <Bell size={size} className="text-[var(--light-text)]" />;
  }
};

// <== GET ICON BACKGROUND COLOR ==>
const getIconBgColor = (type: GitHubNotificationSubjectType): string => {
  switch (type) {
    // ISSUE
    case "Issue":
      return "bg-green-500/10";
    // PULL REQUEST
    case "PullRequest":
      return "bg-purple-500/10";
    // COMMIT
    case "Commit":
      return "bg-blue-500/10";
    // RELEASE
    case "Release":
      return "bg-orange-500/10";
    // DISCUSSION
    case "Discussion":
      return "bg-cyan-500/10";
    // REPOSITORY VULNERABILITY ALERT
    case "RepositoryVulnerabilityAlert":
      return "bg-red-500/10";
    // CHECK SUITE
    case "CheckSuite":
      return "bg-yellow-500/10";
    // REPOSITORY INVITATION
    case "RepositoryInvitation":
      return "bg-pink-500/10";
    // DEFAULT
    default:
      return "bg-[var(--hover-bg)]";
  }
};

// <== GET REASON TEXT ==>
const getReasonText = (reason: GitHubNotificationReason): string => {
  switch (reason) {
    // ASSIGN
    case "assign":
      return "You were assigned";
    // AUTHOR
    case "author":
      return "You created this";
    // COMMENT
    case "comment":
      return "You commented";
    // CI ACTIVITY
    case "ci_activity":
      return "CI activity";
    // INVITATION
    case "invitation":
      return "You were invited";
    // MANUAL
    case "manual":
      return "You subscribed";
    // MENTION
    case "mention":
      return "You were mentioned";
    // REVIEW REQUESTED
    case "review_requested":
      return "Review requested";
    // SECURITY ALERT
    case "security_alert":
      return "Security alert";
    // STATE CHANGE
    case "state_change":
      return "State changed";
    // SUBSCRIBED
    case "subscribed":
      return "Subscribed";
    // TEAM MENTION
    case "team_mention":
      return "Team mentioned";
    // DEFAULT
    default:
      return reason;
  }
};

// <== GET TYPE LABEL ==>
const getTypeLabel = (type: GitHubNotificationSubjectType): string => {
  switch (type) {
    // ISSUE
    case "Issue":
      return "Issue";
    // PULL REQUEST
    case "PullRequest":
      return "Pull Request";
    // COMMIT
    case "Commit":
      return "Commit";
    // RELEASE
    case "Release":
      return "Release";
    // DISCUSSION
    case "Discussion":
      return "Discussion";
    // REPOSITORY VULNERABILITY ALERT
    case "RepositoryVulnerabilityAlert":
      return "Security Alert";
    // CHECK SUITE
    case "CheckSuite":
      return "Check Suite";
    // REPOSITORY INVITATION
    case "RepositoryInvitation":
      return "Invitation";
    // DEFAULT
    default:
      return type;
  }
};

// <== NOTIFICATION CARD COMPONENT ==>
type NotificationCardProps = {
  // <== NOTIFICATION ==>
  notification: GitHubNotification;
  // <== MARK AS READ ==>
  onMarkAsRead: (id: string) => void;
  // <== UNSUBSCRIBE ==>
  onUnsubscribe: (id: string) => void;
  // <== IS MARK AS READ ==>
  isMarkingAsRead: boolean;
  // <== IS UNSUBSCRIBING ==>
  isUnsubscribing: boolean;
};

// <== NOTIFICATION CARD COMPONENT ==>
const NotificationCard = ({
  notification,
  onMarkAsRead,
  onUnsubscribe,
  isMarkingAsRead,
  isUnsubscribing,
}: NotificationCardProps): JSX.Element => {
  // NAVIGATE
  const navigate = useNavigate();
  // HANDLE CLICK
  const handleClick = () => {
    // EXTRACT ISSUE/PR NUMBER FROM URL
    const url = notification.subject.url;
    // CHECK IF URL EXISTS
    if (url) {
      // PARSE URL TO GET NUMBER
      const match = url.match(/\/(issues|pulls)\/(\d+)$/);
      // CHECK IF MATCH EXISTS
      if (match) {
        // GET TYPE AND NUMBER
        const type = match[1];
        // GET NUMBER
        const number = match[2];
        // GET OWNER AND REPO
        const [owner, repo] = notification.repository.fullName.split("/");
        // NAVIGATE TO THE APPROPRIATE PAGE
        if (type === "issues") {
          // ISSUE
          navigate(`/github/${owner}/${repo}/issues/${number}`);
          // PULL REQUEST
        } else if (type === "pulls") {
          // PULL REQUEST
          navigate(`/github/${owner}/${repo}/pulls/${number}`);
        }
        // MARK AS READ IF NOTIFICATION IS UNREAD
        if (notification.unread) {
          // MARK AS READ
          onMarkAsRead(notification.id);
        }
        // RETURN
        return;
      }
      // CHECK FOR COMMIT URL
      const commitMatch = url.match(/\/commits\/([a-f0-9]+)$/);
      // CHECK IF COMMIT MATCH EXISTS
      if (commitMatch) {
        // GET OWNER AND REPO
        const [owner, repo] = notification.repository.fullName.split("/");
        // NAVIGATE TO COMMITS PAGE
        navigate(`/github/${owner}/${repo}/commits`);
        // MARK AS READ IF NOTIFICATION IS UNREAD
        if (notification.unread) {
          // MARK AS READ
          onMarkAsRead(notification.id);
        }
        // RETURN
        return;
      }
    }
    // GET OWNER AND REPO
    const [owner, repo] = notification.repository.fullName.split("/");
    // NAVIGATE TO REPO PAGE
    navigate(`/github/${owner}/${repo}`);
    // MARK AS READ IF NOTIFICATION IS UNREAD
    if (notification.unread) {
      // MARK AS READ
      onMarkAsRead(notification.id);
    }
  };
  // RETURN NOTIFICATION CARD
  return (
    <div
      className={`p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl transition group ${
        notification.unread
          ? "border-l-4 border-l-[var(--accent-color)]"
          : "hover:border-[var(--accent-color)]/30"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgColor(
            notification.subject.type
          )}`}
        >
          <NotificationIcon type={notification.subject.type} size={20} />
        </div>
        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <button
              onClick={handleClick}
              className="text-left cursor-pointer group/title"
            >
              <h3
                className={`text-sm group-hover/title:text-[var(--accent-color)] transition ${
                  notification.unread
                    ? "font-semibold text-[var(--text-primary)]"
                    : "font-medium text-[var(--text-primary)]"
                }`}
              >
                {notification.subject.title}
              </h3>
            </button>
            {/* ACTIONS */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {notification.unread && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  disabled={isMarkingAsRead}
                  className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition cursor-pointer disabled:opacity-50"
                  title="Mark as read"
                >
                  {isMarkingAsRead ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
              )}
              <button
                onClick={() => onUnsubscribe(notification.id)}
                disabled={isUnsubscribing}
                className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
                title="Mute this thread"
              >
                {isUnsubscribing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <BellOff size={14} />
                )}
              </button>
            </div>
          </div>
          {/* META */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--light-text)]">
            {/* REPO */}
            <button
              onClick={() => {
                const [owner, repo] =
                  notification.repository.fullName.split("/");
                navigate(`/github/${owner}/${repo}`);
              }}
              className="flex items-center gap-1.5 hover:text-[var(--accent-color)] transition cursor-pointer"
            >
              <img
                src={notification.repository.owner.avatarUrl}
                alt={notification.repository.owner.login}
                className="w-4 h-4 rounded-full"
              />
              {notification.repository.fullName}
            </button>
            {/* TYPE */}
            <span className="flex items-center gap-1">
              <NotificationIcon type={notification.subject.type} size={12} />
              {getTypeLabel(notification.subject.type)}
            </span>
            {/* REASON */}
            <span>{getReasonText(notification.reason)}</span>
            {/* TIME */}
            <span>
              {formatDistanceToNow(new Date(notification.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        {/* UNREAD INDICATOR */}
        {notification.unread && (
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] flex-shrink-0 mt-1" />
        )}
      </div>
    </div>
  );
};

// <== SKELETON COMPONENTS ==>
const NotificationSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[var(--light-text)]/10 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="flex gap-3">
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-20" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PageLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-[var(--light-text)]/10 rounded w-48" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-40" />
      </div>
      {/* FILTER SKELETON */}
      <div className="flex gap-2 animate-pulse">
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-24" />
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-24" />
        <div className="h-10 bg-[var(--light-text)]/10 rounded flex-1 max-w-xs" />
      </div>
      {/* CONTENT SKELETON */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// <== GITHUB NOTIFICATIONS PAGE COMPONENT ==>
const GitHubNotificationsPage = (): JSX.Element => {
  // SET TITLE
  useTitle("PlanOra - GitHub Notifications");
  // NAVIGATE
  const navigate = useNavigate();
  // FILTER STATE
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  // TYPE FILTER STATE
  const [typeFilter, setTypeFilter] = useState<
    GitHubNotificationSubjectType | "all"
  >("all");
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // SHOW TYPE DROPDOWN STATE
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  // PAGE STATE
  const [page, setPage] = useState(1);
  // GITHUB STATUS
  const { status, isLoading: isStatusLoading } = useGitHubStatus();
  // NOTIFICATIONS
  const { notifications, pagination, isLoading, isFetching, refetch } =
    useGitHubNotifications(
      page,
      50,
      filter === "all",
      false,
      status?.isConnected
    );
  // MARK AS READ MUTATION
  const markAsRead = useMarkGitHubNotificationAsRead();
  // MARK ALL AS READ MUTATION
  const markAllAsRead = useMarkAllGitHubNotificationsAsRead();
  // UNSUBSCRIBE MUTATION
  const unsubscribe = useUnsubscribeGitHubNotification();
  // FILTERED NOTIFICATIONS
  const filteredNotifications = useMemo(() => {
    // INITIALIZE RESULT
    let result = notifications;
    // FILTER BY UNREAD
    if (filter === "unread") {
      // FILTER BY UNREAD
      result = result.filter((n) => n.unread);
    }
    // FILTER BY TYPE
    if (typeFilter !== "all") {
      // FILTER BY TYPE
      result = result.filter((n) => n.subject.type === typeFilter);
    }
    // FILTER BY SEARCH
    if (searchQuery.trim()) {
      // FILTER BY SEARCH
      const query = searchQuery.toLowerCase();
      // FILTER BY SEARCH
      result = result.filter(
        (n) =>
          n.subject.title.toLowerCase().includes(query) ||
          n.repository.fullName.toLowerCase().includes(query)
      );
    }
    // RETURN RESULT
    return result;
  }, [notifications, filter, typeFilter, searchQuery]);
  // UNREAD COUNT
  const unreadCount = useMemo(() => {
    // RETURN UNREAD COUNT
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);
  // NOTIFICATION TYPES
  const notificationTypes: {
    value: GitHubNotificationSubjectType | "all";
    label: string;
  }[] = [
    { value: "all", label: "All Types" },
    { value: "Issue", label: "Issues" },
    { value: "PullRequest", label: "Pull Requests" },
    { value: "Commit", label: "Commits" },
    { value: "Release", label: "Releases" },
    { value: "Discussion", label: "Discussions" },
    { value: "RepositoryVulnerabilityAlert", label: "Security Alerts" },
    { value: "CheckSuite", label: "Check Suites" },
    { value: "RepositoryInvitation", label: "Invitations" },
  ];
  // NOT CONNECTED
  if (!isStatusLoading && !status?.isConnected) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <DashboardHeader
          title="GitHub Notifications"
          subtitle="Stay updated with your GitHub activity"
          showSearch={false}
        />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center py-16 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <div className="w-16 h-16 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mb-4">
              <Bell size={32} className="text-[var(--light-text)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Connect GitHub to View Notifications
            </h2>
            <p className="text-sm text-[var(--light-text)] text-center max-w-md mb-4">
              Link your GitHub account to see your notifications from issues,
              pull requests, and more.
            </p>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              <Settings size={16} />
              Go to Settings
            </button>
          </div>
        </main>
      </div>
    );
  }
  // RETURN PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="GitHub Notifications"
        subtitle="Stay updated with your GitHub activity"
        showSearch={false}
      />
      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/github")}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to GitHub
        </button>
        {/* LOADING STATE */}
        {isStatusLoading || (isLoading && page === 1) ? (
          <PageLoadingSkeleton />
        ) : (
          <>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Notifications
                </h1>
                <p className="text-sm text-[var(--light-text)]">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount !== 1 ? "s" : ""
                      }`
                    : "All caught up!"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* REFRESH BUTTON */}
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw
                    size={16}
                    className={isFetching ? "animate-spin" : ""}
                  />
                </button>
                {/* MARK ALL AS READ */}
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead.mutate()}
                    disabled={markAllAsRead.isPending}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
                  >
                    {markAllAsRead.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCheck size={14} />
                    )}
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* READ/UNREAD TABS */}
              <div className="flex items-center gap-1 p-1 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg">
                <button
                  onClick={() => setFilter("unread")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                    filter === "unread"
                      ? "bg-[var(--accent-color)] text-white"
                      : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Mail size={14} />
                  Unread
                  {unreadCount > 0 && filter !== "unread" && (
                    <span className="px-1.5 py-0.5 text-xs bg-[var(--accent-color)]/20 text-[var(--accent-color)] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setFilter("all")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                    filter === "all"
                      ? "bg-[var(--accent-color)] text-white"
                      : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <MailOpen size={14} />
                  All
                </button>
              </div>
              {/* TYPE FILTER */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <Filter size={14} className="text-[var(--light-text)]" />
                  {notificationTypes.find((t) => t.value === typeFilter)?.label}
                  <ChevronDown size={14} className="text-[var(--light-text)]" />
                </button>
                {showTypeDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowTypeDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {notificationTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => {
                            setTypeFilter(type.value);
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                            typeFilter === type.value
                              ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                              : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          {type.value !== "all" && (
                            <NotificationIcon
                              type={type.value as GitHubNotificationSubjectType}
                              size={14}
                            />
                          )}
                          {type.label}
                          {typeFilter === type.value && (
                            <Check size={14} className="ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* SEARCH */}
              <div className="relative flex-1 max-w-xs">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
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
            </div>
            {/* NOTIFICATIONS LIST */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mb-4">
                    <BellOff size={32} className="text-[var(--light-text)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {searchQuery || typeFilter !== "all"
                      ? "No matching notifications"
                      : filter === "unread"
                      ? "All caught up!"
                      : "No notifications yet"}
                  </h2>
                  <p className="text-sm text-[var(--light-text)] text-center max-w-md">
                    {searchQuery || typeFilter !== "all"
                      ? "Try adjusting your filters to see more notifications"
                      : filter === "unread"
                      ? "You have no unread notifications. Great job staying on top of things!"
                      : "Notifications from GitHub issues, pull requests, and more will appear here"}
                  </p>
                </div>
              ) : (
                <>
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(id) => markAsRead.mutate(id)}
                      onUnsubscribe={(id) => unsubscribe.mutate(id)}
                      isMarkingAsRead={markAsRead.isPending}
                      isUnsubscribing={unsubscribe.isPending}
                    />
                  ))}
                  {/* PAGINATION */}
                  {(pagination.hasNext || pagination.hasPrev) && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!pagination.hasPrev || isFetching}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-[var(--light-text)]">
                        Page {page}
                      </span>
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.hasNext || isFetching}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default GitHubNotificationsPage;
