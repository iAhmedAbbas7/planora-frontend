// <== IMPORTS ==>
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Crown,
  GitCommit,
  GitPullRequest,
  CheckSquare,
} from "lucide-react";
import {
  useWorkspaceLeaderboard,
  type LeaderboardEntry,
} from "../../../hooks/useDXScoring";

// <== COMPONENT PROPS ==>
interface LeaderboardCardProps {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== PERIOD (DEFAULT: 30) ==>
  period?: number;
  // <== LIMIT (DEFAULT: 10) ==>
  limit?: number;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== RANK BADGE COMPONENT ==>
const RankBadge = ({ rank }: { rank: number }) => {
  // RANK STYLES
  const rankStyles: Record<
    number,
    { bg: string; text: string; icon?: React.ElementType }
  > = {
    1: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: Crown },
    2: { bg: "bg-gray-300/10", text: "text-gray-400", icon: Medal },
    3: { bg: "bg-amber-600/10", text: "text-amber-600", icon: Medal },
  };
  // GET STYLE
  const style = rankStyles[rank] || {
    bg: "bg-[var(--hover-bg)]",
    text: "text-[var(--light-text)]",
  };
  // GET ICON
  const Icon = style.icon;
  // RETURN RANK BADGE
  return (
    <div
      className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center flex-shrink-0`}
    >
      {Icon ? (
        <Icon className={`w-4 h-4 ${style.text}`} />
      ) : (
        <span className={`text-sm font-bold ${style.text}`}>{rank}</span>
      )}
    </div>
  );
};

// <== LEADERBOARD ENTRY COMPONENT ==>
const LeaderboardEntryRow = ({
  entry,
  compact,
}: {
  entry: LeaderboardEntry;
  compact: boolean;
}) => {
  // CHANGE INDICATOR COMPONENT
  const ChangeIndicator = () => {
    // IF CHANGE IS POSITIVE
    if (entry.change > 0) {
      // RETURN POSITIVE CHANGE INDICATOR
      return (
        <div className="flex items-center gap-0.5 text-green-500">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">+{entry.change}</span>
        </div>
      );
    }
    // IF CHANGE IS NEGATIVE
    else if (entry.change < 0) {
      // RETURN NEGATIVE CHANGE INDICATOR
      return (
        <div className="flex items-center gap-0.5 text-red-500">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">{entry.change}</span>
        </div>
      );
    }
    // IF CHANGE IS ZERO
    return (
      <div className="flex items-center gap-0.5 text-[var(--light-text)]">
        <Minus className="w-3 h-3" />
        <span className="text-xs">-</span>
      </div>
    );
  };
  // RETURN COMPACT LEADERBOARD ENTRY ROW
  if (compact) {
    // RETURN COMPACT LEADERBOARD ENTRY ROW
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--hover-bg)]/30 transition-colors">
        <RankBadge rank={entry.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {entry.userAvatar ? (
              <img
                src={entry.userAvatar}
                alt={entry.userName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
                <span className="text-xs font-medium text-[var(--accent-color)]">
                  {entry.userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-[var(--primary-text)] truncate">
              {entry.userName}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[var(--primary-text)]">
            {entry.dxScore}
          </div>
        </div>
      </div>
    );
  }
  // RETURN FULL LEADERBOARD ENTRY ROW
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30 hover:bg-[var(--hover-bg)]/50 transition-colors">
      <RankBadge rank={entry.rank} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {entry.userAvatar ? (
            <img
              src={entry.userAvatar}
              alt={entry.userName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
              <span className="text-sm font-medium text-[var(--accent-color)]">
                {entry.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-[var(--primary-text)] truncate block">
              {entry.userName}
            </span>
            <div className="flex items-center gap-3 text-xs text-[var(--light-text)]">
              <span className="flex items-center gap-1">
                <GitCommit className="w-3 h-3" />
                {entry.stats.commits}
              </span>
              <span className="flex items-center gap-1">
                <GitPullRequest className="w-3 h-3" />
                {entry.stats.prsMerged}
              </span>
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                {entry.stats.tasksCompleted}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-[var(--primary-text)]">
          {entry.dxScore}
        </div>
        <ChangeIndicator />
      </div>
    </div>
  );
};

// <== LEADERBOARD CARD COMPONENT ==>
const LeaderboardCard = ({
  workspaceId,
  period = 30,
  limit = 10,
  compact = false,
}: LeaderboardCardProps) => {
  // WORKSPACE LEADERBOARD HOOK
  const { leaderboard, totalMembers, isLoading } = useWorkspaceLeaderboard(
    workspaceId,
    period,
    limit
  );
  // LOADING STATE - SHOW SKELETON
  if (isLoading) {
    // RETURN LEADERBOARD CARD SKELETON
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[320px] animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
          <div className="h-5 w-32 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[var(--light-text)]/10" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-[var(--light-text)]/10 rounded mb-1" />
                    <div className="h-3 w-32 bg-[var(--light-text)]/10 rounded" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 w-12 bg-[var(--light-text)]/10 rounded mb-1" />
                <div className="h-3 w-8 bg-[var(--light-text)]/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // EMPTY STATE - SHOW EMPTY STATE
  if (leaderboard.length === 0) {
    // RETURN EMPTY LEADERBOARD CARD
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[320px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="text-sm font-medium text-[var(--primary-text)]">
            Leaderboard
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-[var(--light-text)]">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No activity data yet</p>
            <p className="text-xs opacity-60 mt-1">
              Sync your activity to appear on the leaderboard
            </p>
          </div>
        </div>
      </div>
    );
  }
  // RETURN LEADERBOARD CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="text-sm font-medium text-[var(--primary-text)]">
            Leaderboard
          </h3>
        </div>
        <span className="text-xs text-[var(--light-text)]">
          {totalMembers} members
        </span>
      </div>
      {/* LEADERBOARD LIST */}
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <LeaderboardEntryRow
            key={entry.userId}
            entry={entry}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardCard;
