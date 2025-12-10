// <== IMPORTS ==>
import {
  Activity,
  UserPlus,
  UserMinus,
  CheckSquare,
  GitBranch,
  MessageSquare,
  Send,
  Clock,
} from "lucide-react";
import { JSX, useState } from "react";
import { WorkspaceActivity } from "../../../hooks/useWorkspaceSocket";

// <== ACTIVITY STREAM PROPS ==>
interface ActivityStreamProps {
  // <== ACTIVITIES ==>
  activities: WorkspaceActivity[];
  // <== IS CONNECTED ==>
  isConnected: boolean;
  // <== ON SEND MESSAGE ==>
  onSendMessage?: (message: string) => void;
  // <== COMPACT MODE ==>
  compact?: boolean;
  // <== MAX ITEMS ==>
  maxItems?: number;
}

// <== GET ACTIVITY ICON ==>
const getActivityIcon = (type: WorkspaceActivity["type"]) => {
  // RETURN ICON AND COLOR BASED ON TYPE
  switch (type) {
    // MEMBER JOINED
    case "member_joined":
      return { icon: UserPlus, color: "text-green-500", bg: "bg-green-500/10" };
    // MEMBER LEFT
    case "member_left":
      return { icon: UserMinus, color: "text-red-500", bg: "bg-red-500/10" };
    // TASK UPDATED
    case "task_updated":
      return {
        icon: CheckSquare,
        color: "text-[var(--accent-color)]",
        bg: "bg-[var(--accent-color)]/10",
      };
    // REPO ACTIVITY
    case "repo_activity":
      return {
        icon: GitBranch,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      };
    // MESSAGE
    case "message":
      return {
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      };
    // DEFAULT
    default:
      return {
        icon: Activity,
        color: "text-[var(--light-text)]",
        bg: "bg-[var(--hover-bg)]",
      };
  }
};

// <== FORMAT TIME AGO ==>
const formatTimeAgo = (timestamp: string): string => {
  // PARSE TIMESTAMP
  const date = new Date(timestamp);
  // GET DIFFERENCE IN SECONDS
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  // IF LESS THAN 1 MINUTE, RETURN JUST NOW
  if (seconds < 60) return "just now";
  // IF LESS THAN 1 HOUR, RETURN MINUTES AGO
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  // IF LESS THAN 1 DAY, RETURN HOURS AGO
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  // IF LESS THAN 1 DAY, RETURN DAYS AGO
  return `${Math.floor(seconds / 86400)}d ago`;
};

// <== GET ACTIVITY MESSAGE ==>
const getActivityMessage = (activity: WorkspaceActivity): string => {
  // RETURN MESSAGE BASED ON TYPE
  switch (activity.type) {
    // MEMBER JOINED
    case "member_joined":
      return `${activity.userName} joined the workspace`;
    // MEMBER LEFT
    case "member_left":
      return `${activity.userName} left the workspace`;
    // TASK UPDATED
    case "task_updated":
      return `${activity.userName} updated a task`;
    // REPO ACTIVITY
    case "repo_activity":
      return `${activity.userName} pushed to repository`;
    // MESSAGE
    case "message":
      return (activity.data.message as string) || "sent a message";
    // DEFAULT
    default:
      return `${activity.userName} performed an action`;
  }
};

// <== ACTIVITY ITEM COMPONENT ==>
const ActivityItem = ({
  activity,
}: {
  activity: WorkspaceActivity;
}): JSX.Element => {
  // GET ICON AND COLOR BASED ON TYPE
  const { icon: Icon, color, bg } = getActivityIcon(activity.type);
  // RETURN ACTIVITY ITEM
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
      {/* ICON */}
      <div
        className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={14} className={color} />
      </div>
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--primary-text)]">
          {activity.type === "message" ? (
            <>
              <span className="font-medium">{activity.userName}</span>
              <span className="text-[var(--light-text)]">: </span>
              <span>{activity.data.message as string}</span>
            </>
          ) : (
            getActivityMessage(activity)
          )}
        </p>
        <p className="text-xs text-[var(--light-text)] mt-0.5 flex items-center gap-1">
          <Clock size={10} />
          {formatTimeAgo(activity.timestamp)}
        </p>
      </div>
      {/* AVATAR */}
      {activity.userAvatar ? (
        <img
          src={activity.userAvatar}
          alt={activity.userName}
          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-semibold text-[var(--accent-color)]">
            {activity.userName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

// <== ACTIVITY STREAM COMPONENT ==>
const ActivityStream = ({
  activities,
  isConnected,
  onSendMessage,
  compact = false,
  maxItems = 20,
}: ActivityStreamProps): JSX.Element => {
  // STATE
  const [message, setMessage] = useState("");
  // GET VISIBLE ACTIVITIES
  const visibleActivities = activities.slice(0, maxItems);
  // HANDLE SEND MESSAGE
  const handleSend = () => {
    // IF MESSAGE IS EMPTY OR NO CALLBACK, RETURN
    if (!message.trim() || !onSendMessage) return;
    // SEND MESSAGE
    onSendMessage(message.trim());
    // CLEAR MESSAGE
    setMessage("");
  };
  // HANDLE KEY PRESS
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // IF ENTER KEY PRESSED, SEND MESSAGE
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // COMPACT VIEW
  if (compact) {
    // RETURN COMPACT VIEW
    return (
      <div className="space-y-1">
        {visibleActivities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-center gap-2 text-xs">
            <div
              className={`w-1.5 h-1.5 rounded-full ${getActivityIcon(
                activity.type
              ).color.replace("text-", "bg-")}`}
            />
            <span className="text-[var(--light-text)] truncate">
              {getActivityMessage(activity)}
            </span>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-xs text-[var(--light-text)]">No recent activity</p>
        )}
      </div>
    );
  }
  // FULL VIEW
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[var(--accent-color)]" />
          <h3 className="text-sm font-semibold text-[var(--primary-text)]">
            Activity Stream
          </h3>
        </div>
        {/* CONNECTION STATUS */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-[var(--light-text)]">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
      {/* ACTIVITY LIST */}
      <div className="max-h-80 overflow-y-auto">
        {visibleActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity
              size={24}
              className="mx-auto text-[var(--light-text)] mb-2"
            />
            <p className="text-sm text-[var(--light-text)]">
              {isConnected ? "No recent activity" : "Connecting..."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {visibleActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
      {/* MESSAGE INPUT */}
      {onSendMessage && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Send a quick message..."
              className="flex-1 px-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--primary-text)] placeholder:text-[var(--light-text)] focus:outline-none focus:border-[var(--accent-color)]"
              disabled={!isConnected}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || !isConnected}
              className="p-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityStream;
