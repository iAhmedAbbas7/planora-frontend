// <== IMPORTS ==>
import { JSX, useState } from "react";
import {
  Sparkles,
  Target,
  Trophy,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Github,
  GitPullRequest,
  GitCommit,
  XCircle,
  Zap,
} from "lucide-react";
import {
  useDailyBriefing,
  FocusSuggestion,
  Highlight,
  AttentionItem,
} from "../../hooks/useDailyBriefing";

// <== PRIORITY BADGE COMPONENT ==>
const PriorityBadge = ({
  priority,
}: {
  priority: "high" | "medium" | "low";
}): JSX.Element => {
  // GET PRIORITY STYLES
  const styles = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  // RETURN BADGE
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};

// <== URGENCY BADGE COMPONENT ==>
const UrgencyBadge = ({
  urgency,
}: {
  urgency: "high" | "medium" | "low";
}): JSX.Element => {
  // GET URGENCY STYLES
  const styles = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-blue-500/20 text-blue-400",
  };
  // GET ICON
  const icons = {
    high: <AlertCircle size={12} />,
    medium: <Clock size={12} />,
    low: <CheckCircle2 size={12} />,
  };
  // RETURN BADGE
  return (
    <span
      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${styles[urgency]}`}
    >
      {icons[urgency]}
      {urgency}
    </span>
  );
};

// <== FOCUS SUGGESTION CARD COMPONENT ==>
const FocusSuggestionCard = ({
  suggestion,
  index,
}: {
  suggestion: FocusSuggestion;
  index: number;
}): JSX.Element => {
  // RETURN CARD
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--inside-card-bg)] hover:bg-[var(--hover-bg)] transition-colors group">
      {/* INDEX BADGE */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center text-xs font-bold">
        {index + 1}
      </div>
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {suggestion.task}
          </p>
          <PriorityBadge priority={suggestion.priority} />
        </div>
        <p className="text-xs text-[var(--light-text)]">{suggestion.reason}</p>
      </div>
    </div>
  );
};

// <== HIGHLIGHT CARD COMPONENT ==>
const HighlightCard = ({
  highlight,
}: {
  highlight: Highlight;
}): JSX.Element => {
  // RETURN CARD
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
      {/* ICON */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
        <Trophy size={16} className="text-green-400" />
      </div>
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {highlight.achievement}
        </p>
        <p className="text-xs text-[var(--light-text)] mt-0.5">
          {highlight.impact}
        </p>
      </div>
    </div>
  );
};

// <== ATTENTION ITEM CARD COMPONENT ==>
const AttentionItemCard = ({ item }: { item: AttentionItem }): JSX.Element => {
  // RETURN CARD
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
      {/* ICON */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
        <AlertTriangle size={16} className="text-orange-400" />
      </div>
      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {item.item}
          </p>
          <UrgencyBadge urgency={item.urgency} />
        </div>
        <p className="text-xs text-[var(--light-text)]">{item.action}</p>
      </div>
    </div>
  );
};

// <== STAT CARD COMPONENT ==>
const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: JSX.Element;
  color: string;
}): JSX.Element => {
  // RETURN CARD
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--inside-card-bg)]">
      {/* ICON */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      {/* CONTENT */}
      <div>
        <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-xs text-[var(--light-text)]">{label}</p>
      </div>
    </div>
  );
};

// <== DAILY BRIEFING COMPONENT ==>
const DailyBriefing = (): JSX.Element => {
  // FETCH DAILY BRIEFING WITH CACHING
  const {
    data: briefing,
    isLoading,
    isError,
    forceRefresh,
    isFetching,
  } = useDailyBriefing();
  // EXPANDED STATE VARIABLE
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    // RETURN SKELETON
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-6">
        {/* HEADER SKELETON */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--inside-card-bg)] animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
          </div>
        </div>
        {/* CONTENT SKELETON */}
        <div className="space-y-3">
          <div className="h-16 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
          <div className="h-16 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
          <div className="h-16 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }
  // IF ERROR, SHOW ERROR STATE
  if (isError || !briefing) {
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
              <Sparkles size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                AI Daily Briefing
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Your personalized productivity summary
              </p>
            </div>
          </div>
        </div>
        {/* ERROR MESSAGE */}
        <div className="text-center py-8">
          <XCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm text-[var(--text-primary)] mb-2">
            Unable to generate briefing
          </p>
          <p className="text-xs text-[var(--light-text)] mb-4">
            Please check your AI configuration and try again
          </p>
          <button
            onClick={() => forceRefresh()}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }
  // RETURN DAILY BRIEFING COMPONENT
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* HEADER CONTAINER */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--hover-bg)] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* ICON */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-purple-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          {/* TITLE */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              AI Daily Briefing
            </h2>
            <p className="text-xs text-[var(--light-text)]">
              {briefing.greeting.split("!")[0]}!
            </p>
          </div>
        </div>
        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* REFRESH BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              forceRefresh();
            }}
            disabled={isFetching}
            className="p-2 hover:bg-[var(--inside-card-bg)] rounded-lg transition-colors disabled:opacity-50"
            title="Refresh briefing"
          >
            <RefreshCw
              size={16}
              className={`text-[var(--light-text)] ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </button>
          {/* EXPAND/COLLAPSE */}
          <button className="p-2 hover:bg-[var(--inside-card-bg)] rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp size={16} className="text-[var(--light-text)]" />
            ) : (
              <ChevronDown size={16} className="text-[var(--light-text)]" />
            )}
          </button>
        </div>
      </div>
      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* SUMMARY */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-[var(--accent-color)]/10 to-purple-500/10 border border-[var(--accent-color)]/20">
            <p className="text-sm text-[var(--text-primary)]">
              {briefing.summary}
            </p>
          </div>
          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Due Today"
              value={briefing.stats.tasksDueToday}
              icon={<Target size={18} className="text-blue-400" />}
              color="bg-blue-500/20"
            />
            <StatCard
              label="Overdue"
              value={briefing.stats.overdueTasks}
              icon={<AlertCircle size={18} className="text-red-400" />}
              color="bg-red-500/20"
            />
            <StatCard
              label="In Progress"
              value={briefing.stats.inProgress}
              icon={<Clock size={18} className="text-yellow-400" />}
              color="bg-yellow-500/20"
            />
            <StatCard
              label="This Week"
              value={briefing.stats.weeklyVelocity}
              icon={<Zap size={18} className="text-green-400" />}
              color="bg-green-500/20"
            />
          </div>
          {/* GITHUB ACTIVITY (IF AVAILABLE) */}
          {briefing.rawData?.githubActivity && (
            <div className="p-4 rounded-lg bg-[var(--inside-card-bg)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-3">
                <Github size={16} className="text-[var(--light-text)]" />
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  GitHub Activity
                </h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <GitCommit size={14} className="text-green-400" />
                  <span className="text-sm text-[var(--text-primary)]">
                    {briefing.rawData.githubActivity.recentCommits} commits
                    today
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GitPullRequest size={14} className="text-blue-400" />
                  <span className="text-sm text-[var(--text-primary)]">
                    {briefing.rawData.githubActivity.openPRs} open PRs
                  </span>
                </div>
                {briefing.rawData.githubActivity.pendingReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-yellow-400" />
                    <span className="text-sm text-[var(--text-primary)]">
                      {briefing.rawData.githubActivity.pendingReviews} pending
                      reviews
                    </span>
                  </div>
                )}
              </div>
              {/* FAILED WORKFLOWS */}
              {briefing.rawData.githubActivity.failedWorkflows?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <p className="text-xs text-red-400 flex items-center gap-1 mb-1">
                    <XCircle size={12} />
                    Failed Workflows:
                  </p>
                  {briefing.rawData.githubActivity.failedWorkflows.map(
                    (wf, i) => (
                      <p
                        key={i}
                        className="text-xs text-[var(--light-text)] ml-4"
                      >
                        • {wf}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          )}
          {/* FOCUS SUGGESTIONS */}
          {briefing.focusSuggestions?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-[var(--accent-color)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Focus Today
                </h3>
              </div>
              <div className="space-y-2">
                {briefing.focusSuggestions
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <FocusSuggestionCard
                      key={index}
                      suggestion={suggestion}
                      index={index}
                    />
                  ))}
              </div>
            </div>
          )}
          {/* HIGHLIGHTS */}
          {briefing.highlights?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={16} className="text-green-400" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Yesterday's Highlights
                </h3>
              </div>
              <div className="space-y-2">
                {briefing.highlights.slice(0, 3).map((highlight, index) => (
                  <HighlightCard key={index} highlight={highlight} />
                ))}
              </div>
            </div>
          )}
          {/* ATTENTION NEEDED */}
          {briefing.attentionNeeded?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-orange-400" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Needs Attention
                </h3>
              </div>
              <div className="space-y-2">
                {briefing.attentionNeeded.slice(0, 3).map((item, index) => (
                  <AttentionItemCard key={index} item={item} />
                ))}
              </div>
            </div>
          )}
          {/* PRODUCTIVITY TIP */}
          {briefing.productivityTip && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Lightbulb
                  size={18}
                  className="text-purple-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-medium text-purple-400 uppercase mb-1">
                    Tip of the Day
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {briefing.productivityTip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* COLLAPSED SUMMARY */}
      {!isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-4 text-xs text-[var(--light-text)]">
            <span className="flex items-center gap-1">
              <Target size={12} />
              {briefing.stats.tasksDueToday} due today
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle size={12} />
              {briefing.stats.overdueTasks} overdue
            </span>
            <span className="flex items-center gap-1">
              <Zap size={12} />
              {briefing.stats.weeklyVelocity} this week
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyBriefing;
