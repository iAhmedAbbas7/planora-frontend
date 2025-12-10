// <== IMPORTS ==>
import {
  Award,
  Flame,
  GitPullRequest,
  Eye,
  CheckCircle,
  Users,
  Trophy,
  Lock,
} from "lucide-react";
import {
  useMemberAchievements,
  type Achievement,
} from "../../../hooks/useDXScoring";

// <== COMPONENT PROPS ==>
interface AchievementBadgesProps {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== MEMBER ID (OPTIONAL) ==>
  memberId?: string;
  // <== SHOW IN PROGRESS ACHIEVEMENTS ==>
  showInProgress?: boolean;
  // <== COMPACT MODE ==>
  compact?: boolean;
}

// <== ICON MAP ==>
const iconMap: Record<string, React.ElementType> = {
  flame: Flame,
  "git-pull-request": GitPullRequest,
  eye: Eye,
  "check-circle": CheckCircle,
  users: Users,
  trophy: Trophy,
};

// <== TIER COLORS ==>
const tierColors: Record<
  Achievement["tier"],
  { bg: string; text: string; border: string; glow: string }
> = {
  // BRONZE TIER COLORS
  bronze: {
    bg: "bg-amber-700/10",
    text: "text-amber-700",
    border: "border-amber-700/20",
    glow: "shadow-amber-700/20",
  },
  // SILVER TIER COLORS
  silver: {
    bg: "bg-gray-400/10",
    text: "text-gray-400",
    border: "border-gray-400/20",
    glow: "shadow-gray-400/20",
  },
  // GOLD TIER COLORS
  gold: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    border: "border-yellow-500/20",
    glow: "shadow-yellow-500/20",
  },
  // PLATINUM TIER COLORS
  platinum: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/20",
  },
};

// <== ACHIEVEMENT BADGE COMPONENT ==>
const AchievementBadge = ({
  achievement,
  compact,
  showProgress = true,
}: {
  achievement: Achievement;
  compact: boolean;
  showProgress?: boolean;
}) => {
  // GET ICON
  const Icon = iconMap[achievement.icon] || Award;
  // GET TIER COLORS
  const colors = tierColors[achievement.tier];
  // IS EARNED
  const isEarned = !!achievement.earnedAt;
  // RENDER COMPACT
  if (compact) {
    // RETURN COMPACT ACHIEVEMENT BADGE
    return (
      <div
        className={`relative w-12 h-12 rounded-xl ${colors.bg} ${
          isEarned
            ? `border ${colors.border} shadow-lg ${colors.glow}`
            : "opacity-40"
        } flex items-center justify-center group cursor-pointer transition-all hover:scale-105`}
        title={`${achievement.name}: ${achievement.description}`}
      >
        <Icon
          className={`w-6 h-6 ${
            isEarned ? colors.text : "text-[var(--light-text)]"
          }`}
        />
        {!isEarned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
            <Lock className="w-4 h-4 text-white/60" />
          </div>
        )}
        {/* TOOLTIP */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[180px]">
          <div className="text-xs font-medium text-[var(--primary-text)] mb-1">
            {achievement.name}
          </div>
          <div className="text-xs text-[var(--light-text)]">
            {achievement.description}
          </div>
          {!isEarned && showProgress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--light-text)]">Progress</span>
                <span className="font-medium text-[var(--primary-text)]">
                  {achievement.progress}%
                </span>
              </div>
              <div className="h-1.5 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.bg.replace(
                    "/10",
                    ""
                  )} rounded-full`}
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  // RETURN FULL ACHIEVEMENT BADGE
  return (
    <div
      className={`p-4 rounded-xl ${colors.bg} border ${colors.border} ${
        isEarned ? `shadow-lg ${colors.glow}` : "opacity-60"
      } transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl ${
            isEarned ? colors.bg : "bg-[var(--hover-bg)]"
          } flex items-center justify-center flex-shrink-0`}
        >
          <Icon
            className={`w-6 h-6 ${
              isEarned ? colors.text : "text-[var(--light-text)]"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-medium ${
                isEarned
                  ? "text-[var(--primary-text)]"
                  : "text-[var(--light-text)]"
              }`}
            >
              {achievement.name}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {achievement.tier}
            </span>
          </div>
          <p className="text-xs text-[var(--light-text)] mb-2">
            {achievement.description}
          </p>
          {!isEarned && showProgress && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--light-text)]">Progress</span>
                <span className="font-medium text-[var(--primary-text)]">
                  {achievement.progress}%
                </span>
              </div>
              <div className="h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    achievement.progress >= 100
                      ? "bg-green-500"
                      : "bg-[var(--accent-color)]"
                  }`}
                  style={{ width: `${Math.min(100, achievement.progress)}%` }}
                />
              </div>
            </div>
          )}
          {isEarned && achievement.earnedAt && (
            <div className="text-xs text-[var(--light-text)] flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Earned{" "}
              {new Date(achievement.earnedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== ACHIEVEMENT BADGES COMPONENT ==>
const AchievementBadges = ({
  workspaceId,
  memberId,
  showInProgress = true,
  compact = false,
}: AchievementBadgesProps) => {
  // HOOKS
  const { earned, inProgress, stats, isLoading } = useMemberAchievements(
    workspaceId,
    memberId
  );
  // LOADING STATE
  if (isLoading) {
    // RETURN ACHIEVEMENT BADGES SKELETON
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[320px] animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
            <div className="h-5 w-28 bg-[var(--light-text)]/10 rounded" />
          </div>
          <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded" />
        </div>
        <div className="mb-4">
          <div className="h-3 w-16 bg-[var(--light-text)]/10 rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl bg-[var(--light-text)]/10"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="h-3 w-20 bg-[var(--light-text)]/10 rounded mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl bg-[var(--light-text)]/10"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // RETURN ACHIEVEMENT BADGES
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 sm:p-6 min-h-[320px] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="text-sm font-medium text-[var(--primary-text)]">
            Achievements
          </h3>
        </div>
        <span className="text-xs text-[var(--light-text)]">
          {stats.totalEarned} / {stats.totalAvailable} earned
        </span>
      </div>
      {/* EARNED ACHIEVEMENTS */}
      {earned.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-[var(--light-text)] uppercase tracking-wider mb-3">
            Earned
          </h4>
          {compact ? (
            <div className="flex flex-wrap gap-2">
              {earned.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  compact={compact}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earned.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* IN PROGRESS ACHIEVEMENTS */}
      {showInProgress && inProgress.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--light-text)] uppercase tracking-wider mb-3">
            In Progress
          </h4>
          {compact ? (
            <div className="flex flex-wrap gap-2">
              {inProgress.slice(0, 6).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  compact={compact}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inProgress.slice(0, 4).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* EMPTY STATE */}
      {earned.length === 0 && inProgress.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[var(--light-text)]">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No achievements yet</p>
            <p className="text-xs opacity-60 mt-1">
              Start contributing to earn achievements
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
