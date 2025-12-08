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
  X,
  RefreshCw,
  BellOff,
  ChevronRight,
} from "lucide-react";
import {
  useGitHubNotifications,
  useMarkGitHubNotificationAsRead,
  useMarkAllGitHubNotificationsAsRead,
  useGitHubStatus,
  GitHubNotification,
  GitHubNotificationSubjectType,
  GitHubNotificationReason,
} from "../../hooks/useGitHub";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { JSX, useState, useRef, useEffect, useMemo } from "react";

// <== NOTIFICATION ICON COMPONENT ==>
const NotificationIcon = ({
  type,
}: {
  type: GitHubNotificationSubjectType;
}): JSX.Element => {
  // GET ICON BASED ON TYPE
  const getIcon = () => {
    // SWITCH ON TYPE
    switch (type) {
      // ISSUE
      case "Issue":
        return <CircleDot size={16} className="text-green-500" />;
      // PULL REQUEST
      case "PullRequest":
        return <GitPullRequest size={16} className="text-purple-500" />;
      // COMMIT
      case "Commit":
        return <GitCommit size={16} className="text-blue-500" />;
      // RELEASE
      case "Release":
        return <Tag size={16} className="text-orange-500" />;
      // DISCUSSION
      case "Discussion":
        return <MessageSquare size={16} className="text-cyan-500" />;
      // REPOSITORY VULNERABILITY ALERT
      case "RepositoryVulnerabilityAlert":
        return <AlertTriangle size={16} className="text-red-500" />;
      // CHECK SUITE
      case "CheckSuite":
        return <Check size={16} className="text-yellow-500" />;
      // REPOSITORY INVITATION
      case "RepositoryInvitation":
        return <Mail size={16} className="text-pink-500" />;
      // DEFAULT
      default:
        return <Bell size={16} className="text-[var(--light-text)]" />;
    }
  };
  // GET BACKGROUND COLOR BASED ON TYPE
  const getBgColor = () => {
    // SWITCH ON TYPE
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
  // RETURN ICON
  return (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgColor()}`}
    >
      {getIcon()}
    </div>
  );
};

// <== NOTIFICATION ITEM COMPONENT ==>
type NotificationItemProps = {
  // <== NOTIFICATION ==>
  notification: GitHubNotification;
  // <== MARK AS READ FUNCTION ==>
  onMarkAsRead: (id: string) => void;
  // <== IS MARKING AS READ ==>
  isMarkingAsRead: boolean;
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: NotificationItemProps): JSX.Element => {
  // NAVIGATE
  const navigate = useNavigate();
  // GET REASON TEXT
  const getReasonText = (reason: GitHubNotificationReason): string => {
    // SWITCH ON REASON
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
        return;
      }
    }
    // DEFAULT: OPEN GITHUB IN NEW TAB
    window.open(notification.repository.htmlUrl, "_blank");
    // MARK AS READ IF NOTIFICATION IS UNREAD
    if (notification.unread) {
      // MARK AS READ
      onMarkAsRead(notification.id);
    }
  };
  // RETURN NOTIFICATION ITEM
  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 rounded-xl transition cursor-pointer group ${
        notification.unread
          ? "bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/10"
          : "hover:bg-[var(--hover-bg)]"
      }`}
    >
      {/* ICON */}
      <NotificationIcon type={notification.subject.type} />
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* TITLE */}
        <p
          className={`text-sm truncate ${
            notification.unread
              ? "font-medium text-[var(--text-primary)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {notification.subject.title}
        </p>
        {/* META */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--light-text)] truncate">
            {notification.repository.fullName}
          </span>
          <span className="text-xs text-[var(--light-text)]">•</span>
          <span className="text-xs text-[var(--light-text)]">
            {getReasonText(notification.reason)}
          </span>
        </div>
        {/* TIME */}
        <p className="text-xs text-[var(--light-text)] mt-1">
          {formatDistanceToNow(new Date(notification.updatedAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      {/* ACTIONS */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        {notification.unread && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
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
      </div>
      {/* UNREAD INDICATOR */}
      {notification.unread && (
        <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] flex-shrink-0 mt-2" />
      )}
    </div>
  );
};

// <== GITHUB NOTIFICATIONS DROPDOWN COMPONENT ==>
const GitHubNotificationsDropdown = (): JSX.Element | null => {
  // DROPDOWN OPEN STATE
  const [isOpen, setIsOpen] = useState(false);
  // FILTER STATE
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // NAVIGATE
  const navigate = useNavigate();
  // GITHUB STATUS
  const { status } = useGitHubStatus();
  // NOTIFICATIONS
  const { notifications, isLoading, isFetching, refetch } =
    useGitHubNotifications(1, 20, filter === "all", false, status?.isConnected);
  // MARK AS READ MUTATION
  const markAsRead = useMarkGitHubNotificationAsRead();
  // MARK ALL AS READ MUTATION
  const markAllAsRead = useMarkAllGitHubNotificationsAsRead();
  // FILTERED NOTIFICATIONS
  const filteredNotifications = useMemo(() => {
    // FILTER BY UNREAD
    if (filter === "unread") {
      // FILTER BY UNREAD
      return notifications.filter((n) => n.unread);
    }
    // RETURN ALL NOTIFICATIONS
    return notifications;
  }, [notifications, filter]);
  // UNREAD COUNT
  const unreadCount = useMemo(() => {
    // RETURN UNREAD COUNT
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);
  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    // HANDLE CLICK OUTSIDE FUNCTION
    const handleClickOutside = (e: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // IF NOT CONNECTED, DON'T SHOW
  if (!status?.isConnected) {
    // RETURN NULL
    return null;
  }
  // RETURN DROPDOWN
  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full transition cursor-pointer text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
      >
        <Bell size={20} />
        {/* UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-[var(--accent-color)] rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-h-[500px] bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden flex flex-col z-50">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 p-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[var(--accent-color)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-[var(--accent-color)]/15 text-[var(--accent-color)] rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* REFRESH BUTTON */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />
              </button>
              {/* MARK ALL AS READ BUTTON */}
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  disabled={markAllAsRead.isPending}
                  className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition cursor-pointer disabled:opacity-50"
                  title="Mark all as read"
                >
                  {markAllAsRead.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCheck size={14} />
                  )}
                </button>
              )}
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {/* FILTER TABS */}
          <div className="flex items-center gap-1 p-2 border-b border-[var(--border)]">
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                filter === "unread"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              <Mail size={12} />
              Unread
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                filter === "all"
                  ? "bg-[var(--accent-color)] text-white"
                  : "text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              <MailOpen size={12} />
              All
            </button>
          </div>
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  size={24}
                  className="animate-spin text-[var(--accent-color)]"
                />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mb-3">
                  <BellOff size={24} className="text-[var(--light-text)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  {filter === "unread"
                    ? "All caught up!"
                    : "No notifications yet"}
                </p>
                <p className="text-xs text-[var(--light-text)] text-center">
                  {filter === "unread"
                    ? "You have no unread notifications"
                    : "Notifications from GitHub will appear here"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={(id) => markAsRead.mutate(id)}
                    isMarkingAsRead={markAsRead.isPending}
                  />
                ))}
              </div>
            )}
          </div>
          {/* FOOTER */}
          <div className="p-2 border-t border-[var(--border)]">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/github/notifications");
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-lg transition cursor-pointer"
            >
              View all notifications
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubNotificationsDropdown;
