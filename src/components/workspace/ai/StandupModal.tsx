// <== IMPORTS ==>
import {
  X,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { useStandupSummary, StandupItem } from "../../../hooks/useWorkspaceAI";

// <== ACTIVITY ICON COMPONENT ==>
const ActivityIcon = ({
  type,
}: {
  type: "commit" | "pr" | "issue" | "review";
}): JSX.Element => {
  // GET ICON BASED ON TYPE
  switch (type) {
    // COMMIT TYPE
    case "commit":
      return <GitCommit size={14} className="text-[var(--accent-color)]" />;
    // PULL REQUEST TYPE
    case "pr":
      // RETURN GIT PULL REQUEST ICON
      return (
        <GitPullRequest size={14} className="text-[var(--accent-color)]" />
      );
    case "issue":
      // RETURN ALERT CIRCLE ICON
      return <AlertCircle size={14} className="text-[var(--accent-color)]" />;
    case "review":
      // RETURN MESSAGE SQUARE ICON
      return <MessageSquare size={14} className="text-[var(--accent-color)]" />;
    // DEFAULT
    default:
      return <GitCommit size={14} className="text-[var(--light-text)]" />;
  }
};

// <== ACTIVITY ITEM COMPONENT ==>
const ActivityItemCard = ({ item }: { item: StandupItem }): JSX.Element => {
  // FORMAT TIMESTAMP
  const formatTime = (timestamp: string) => {
    // CREATE DATE OBJECT
    const date = new Date(timestamp);
    // RETURN TIME STRING
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  // RETURN ACTIVITY ITEM CARD
  return (
    <div className="flex items-start gap-2 p-2 bg-[var(--hover-bg)] rounded-lg">
      <div className="mt-0.5">
        <ActivityIcon type={item.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--primary-text)] line-clamp-1">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--light-text)] truncate">
            {item.repository}
          </span>
          <span className="text-xs text-[var(--light-text)]">•</span>
          <span className="text-xs text-[var(--light-text)]">
            {formatTime(item.timestamp)}
          </span>
        </div>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 rounded hover:bg-[var(--cards-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
        title="Open in GitHub"
      >
        <ExternalLink size={12} />
      </a>
    </div>
  );
};

// <== STATS CARD COMPONENT ==>
const StatsCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}): JSX.Element => {
  // RETURN STATS CARD
  return (
    <div className="bg-[var(--hover-bg)] rounded-lg p-2 sm:p-3 text-center">
      <div className="flex items-center justify-center mb-1">
        <Icon size={14} className="text-[var(--accent-color)]" />
      </div>
      <p className="text-base sm:text-lg font-semibold text-[var(--primary-text)]">
        {value}
      </p>
      <p className="text-xs text-[var(--light-text)] truncate">{label}</p>
    </div>
  );
};

// <== LOADING SKELETON COMPONENT ==>
const LoadingSkeleton = (): JSX.Element => {
  // RETURN LOADING SKELETON
  return (
    <div className="space-y-4 animate-pulse">
      {/* SUMMARY */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-[var(--hover-bg)] rounded" />
        <div className="h-16 w-full bg-[var(--hover-bg)] rounded-lg" />
      </div>
      {/* STATS */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-[var(--hover-bg)] rounded-lg" />
        ))}
      </div>
      {/* LISTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 bg-[var(--hover-bg)] rounded" />
            <div className="space-y-1">
              <div className="h-8 bg-[var(--hover-bg)] rounded" />
              <div className="h-8 bg-[var(--hover-bg)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// <== STANDUP MODAL COMPONENT ==>
const StandupModal = ({
  isOpen,
  onClose,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}): JSX.Element | null => {
  // STATE FOR COPIED
  const [copied, setCopied] = useState(false);
  // FETCH STANDUP SUMMARY
  const { standup, isLoading, isError, refetch } = useStandupSummary(
    workspaceId,
    undefined,
    isOpen
  );
  // RESET COPIED STATE ON CLOSE
  useEffect(() => {
    // RESET COPIED STATE ON CLOSE
    if (!isOpen) {
      // RESET COPIED STATE
      setCopied(false);
    }
  }, [isOpen]);
  // PREVENT BODY SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    // IF OPEN, PREVENT BODY SCROLL
    if (isOpen) {
      // PREVENT BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // ALLOW BODY SCROLL
      document.body.style.overflow = "";
    }
    // CLEANUP FUNCTION
    return () => {
      // ALLOW BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) {
    return null;
  }
  // COPY STANDUP TO CLIPBOARD
  const copyToClipboard = () => {
    // CHECK IF STANDUP IS AVAILABLE
    if (!standup) return;
    // BUILD TEXT
    const text =
      `📋 **Daily Standup**\n\n` +
      `**Summary:**\n${standup.summary}\n\n` +
      `**Yesterday:**\n${standup.yesterday
        .map((item) => `• ${item}`)
        .join("\n")}\n\n` +
      `**Today:**\n${standup.today.map((item) => `• ${item}`).join("\n")}\n\n` +
      (standup.blockers.length > 0
        ? `**Blockers:**\n${standup.blockers
            .map((item) => `• ${item}`)
            .join("\n")}`
        : "");
    // COPY TO CLIPBOARD
    navigator.clipboard.writeText(text);
    // SET COPIED STATE
    setCopied(true);
    // RESET COPIED STATE AFTER 2 SECONDS
    setTimeout(() => setCopied(false), 2000);
  };
  // RETURN STANDUP MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* MODAL */}
      <div className="relative bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
              <Sparkles size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--primary-text)]">
                Daily Standup
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                AI-generated summary of your last 24 hours
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!standup || isLoading}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors disabled:opacity-50"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckCircle2
                  size={18}
                  className="text-[var(--accent-color)]"
                />
              ) : (
                <Copy size={18} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {/* CONTENT */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* LOADING STATE */}
          {isLoading && <LoadingSkeleton />}
          {/* ERROR STATE */}
          {isError && (
            <div className="text-center py-8">
              <AlertTriangle
                size={40}
                className="mx-auto text-[var(--accent-color)] mb-3"
              />
              <p className="text-[var(--primary-text)] font-medium mb-2">
                Failed to generate standup
              </p>
              <p className="text-sm text-[var(--light-text)] mb-4">
                Please check your GitHub connection and try again.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}
          {/* STANDUP CONTENT */}
          {!isLoading && !isError && standup && (
            <div className="space-y-4">
              {/* SUMMARY */}
              <div>
                <h3 className="text-sm font-medium text-[var(--light-text)] mb-2">
                  Summary
                </h3>
                <div className="p-3 bg-[var(--hover-bg)] rounded-lg">
                  <p className="text-sm text-[var(--primary-text)]">
                    {standup.summary}
                  </p>
                </div>
              </div>
              {/* STATS */}
              <div>
                <h3 className="text-sm font-medium text-[var(--light-text)] mb-2">
                  Activity Stats
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <StatsCard
                    label="Commits"
                    value={standup.stats.commits}
                    icon={GitCommit}
                  />
                  <StatsCard
                    label="PRs Open"
                    value={standup.stats.prsOpened}
                    icon={GitPullRequest}
                  />
                  <StatsCard
                    label="Merged"
                    value={standup.stats.prsMerged}
                    icon={TrendingUp}
                  />
                  <StatsCard
                    label="Issues"
                    value={standup.stats.issuesClosed}
                    icon={AlertCircle}
                  />
                  <StatsCard
                    label="Reviews"
                    value={standup.stats.reviewsCompleted}
                    icon={MessageSquare}
                  />
                </div>
              </div>
              {/* YESTERDAY/TODAY/BLOCKERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* YESTERDAY */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <h3 className="text-sm font-medium text-[var(--light-text)]">
                      Yesterday
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {standup.yesterday.length > 0 ? (
                      standup.yesterday.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-[var(--primary-text)]"
                        >
                          <CheckCircle2
                            size={14}
                            className="mt-0.5 text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-[var(--light-text)]">
                        No activity recorded
                      </li>
                    )}
                  </ul>
                </div>
                {/* TODAY */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <h3 className="text-sm font-medium text-[var(--light-text)]">
                      Today's Plan
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {standup.today.length > 0 ? (
                      standup.today.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-[var(--primary-text)]"
                        >
                          <Clock
                            size={14}
                            className="mt-0.5 text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-[var(--light-text)]">
                        No suggestions available
                      </li>
                    )}
                  </ul>
                </div>
                {/* BLOCKERS */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <h3 className="text-sm font-medium text-[var(--light-text)]">
                      Blockers
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {standup.blockers.length > 0 ? (
                      standup.blockers.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-[var(--primary-text)]"
                        >
                          <AlertTriangle
                            size={14}
                            className="mt-0.5 text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-[var(--accent-color)]">
                        No blockers 🎉
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {/* ACTIVITY ITEMS */}
              {standup.activityItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--light-text)] mb-2">
                    Recent Activity
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {standup.activityItems.slice(0, 10).map((item, index) => (
                      <ActivityItemCard key={index} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandupModal;
