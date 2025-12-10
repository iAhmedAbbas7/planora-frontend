// <== IMPORTS ==>
import {
  Bot,
  Calendar,
  Target,
  GitPullRequest,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Zap,
  BarChart3,
  ListTodo,
  GitCommit,
} from "lucide-react";
import {
  useSprintPrediction,
  useCodeReviewInsights,
  SprintPrediction,
  CodeReviewInsights,
} from "../../../hooks/useWorkspaceAI";
import { JSX } from "react";

// <== CONFIDENCE BADGE COMPONENT ==>
const ConfidenceBadge = ({
  confidence,
}: {
  confidence: "high" | "medium" | "low";
}): JSX.Element => {
  // GET LABEL BASED ON CONFIDENCE
  const labels = {
    high: "High Confidence",
    medium: "Medium Confidence",
    low: "Low Confidence",
  };
  // RETURN CONFIDENCE BADGE
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
      {labels[confidence]}
    </span>
  );
};

// <== HEALTH BADGE COMPONENT ==>
const HealthBadge = ({
  health,
}: {
  health: "excellent" | "good" | "needs_improvement" | "critical";
}): JSX.Element => {
  // GET LABEL BASED ON HEALTH
  const labels = {
    excellent: "Excellent",
    good: "Good",
    needs_improvement: "Needs Work",
    critical: "Critical",
  };
  // RETURN HEALTH BADGE
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
      {labels[health]}
    </span>
  );
};

// <== STAT ITEM COMPONENT ==>
const StatItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}): JSX.Element => {
  // RETURN STAT ITEM
  return (
    <div className="bg-[var(--hover-bg)] rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-[var(--accent-color)]" />
        <span className="text-xs text-[var(--light-text)]">{label}</span>
      </div>
      <p className="text-sm sm:text-base font-semibold text-[var(--primary-text)]">
        {value}
      </p>
    </div>
  );
};

// <== SPRINT PREDICTION CARD COMPONENT ==>
const SprintPredictionCard = ({
  prediction,
  isLoading,
  onRefresh,
}: {
  prediction?: SprintPrediction;
  isLoading: boolean;
  onRefresh: () => void;
}): JSX.Element => {
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    // RETURN LOADING SKELETON
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--hover-bg)]" />
            <div className="h-4 w-32 bg-[var(--hover-bg)] rounded" />
          </div>
          <div className="h-5 w-24 bg-[var(--hover-bg)] rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-40 bg-[var(--hover-bg)] rounded" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-[var(--hover-bg)] rounded-lg" />
            <div className="h-16 bg-[var(--hover-bg)] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  // IF NO PREDICTION, SHOW EMPTY STATE
  if (!prediction) {
    // RETURN EMPTY STATE
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
            <Target size={16} className="text-[var(--accent-color)]" />
          </div>
          <h4 className="text-sm font-medium text-[var(--primary-text)]">
            Sprint Prediction
          </h4>
        </div>
        <p className="text-sm text-[var(--light-text)]">
          No prediction data available.
        </p>
      </div>
    );
  }
  // FORMAT PREDICTED DATE
  const predictedDate = new Date(prediction.predictedCompletionDate);
  // RETURN SPRINT PREDICTION CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent-color)]/30 transition-colors">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
            <Target size={16} className="text-[var(--accent-color)]" />
          </div>
          <h4 className="text-sm font-medium text-[var(--primary-text)]">
            Sprint Prediction
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge confidence={prediction.confidence} />
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
            title="Refresh prediction"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      {/* PREDICTED DATE */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={14} className="text-[var(--light-text)]" />
          <span className="text-xs text-[var(--light-text)]">
            Estimated Completion
          </span>
        </div>
        <p className="text-lg font-semibold text-[var(--primary-text)]">
          {predictedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-[var(--light-text)]">
          ~{prediction.estimatedDays} days remaining
        </p>
      </div>
      {/* STATS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatItem
          icon={Zap}
          label="Velocity"
          value={`${prediction.velocity.tasksPerDay} tasks/day`}
        />
        <StatItem
          icon={ListTodo}
          label="Remaining"
          value={`${prediction.remainingWork.totalTasks} tasks`}
        />
      </div>
      {/* RISK FACTORS */}
      {prediction.riskFactors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-[var(--light-text)] mb-2">
            Risk Factors
          </p>
          <ul className="space-y-1.5">
            {prediction.riskFactors.slice(0, 2).map((risk, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-[var(--light-text)]"
              >
                <AlertTriangle
                  size={12}
                  className="mt-0.5 flex-shrink-0 text-[var(--accent-color)]"
                />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* RECOMMENDATIONS */}
      {prediction.recommendations.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[var(--light-text)] mb-2">
            Recommendations
          </p>
          <ul className="space-y-1.5">
            {prediction.recommendations.slice(0, 2).map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-[var(--light-text)]"
              >
                <Sparkles
                  size={12}
                  className="mt-0.5 flex-shrink-0 text-[var(--accent-color)]"
                />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// <== CODE REVIEW INSIGHTS CARD COMPONENT ==>
const CodeReviewInsightsCard = ({
  insights,
  isLoading,
  onRefresh,
}: {
  insights?: CodeReviewInsights;
  isLoading: boolean;
  onRefresh: () => void;
}): JSX.Element => {
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    // RETURN LOADING SKELETON
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--hover-bg)]" />
            <div className="h-4 w-32 bg-[var(--hover-bg)] rounded" />
          </div>
          <div className="h-5 w-16 bg-[var(--hover-bg)] rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[var(--hover-bg)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  // IF NO INSIGHTS, SHOW EMPTY STATE
  if (!insights) {
    // RETURN EMPTY STATE
    return (
      <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
            <GitPullRequest size={16} className="text-[var(--accent-color)]" />
          </div>
          <h4 className="text-sm font-medium text-[var(--primary-text)]">
            Code Review Health
          </h4>
        </div>
        <p className="text-sm text-[var(--light-text)]">
          No code review data available.
        </p>
      </div>
    );
  }
  // RETURN CODE REVIEW INSIGHTS CARD
  return (
    <div className="bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent-color)]/30 transition-colors">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
            <GitPullRequest size={16} className="text-[var(--accent-color)]" />
          </div>
          <h4 className="text-sm font-medium text-[var(--primary-text)]">
            Code Review Health
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <HealthBadge health={insights.overallHealth} />
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
            title="Refresh insights"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      {/* PR STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatItem
          icon={GitCommit}
          label="Total PRs"
          value={insights.prStats.total}
        />
        <StatItem
          icon={CheckCircle2}
          label="Merged"
          value={insights.prStats.merged}
        />
        <StatItem icon={Clock} label="Open" value={insights.prStats.open} />
        <StatItem
          icon={BarChart3}
          label="Merge Rate"
          value={`${insights.mergeRate}%`}
        />
      </div>
      {/* METRICS */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 p-2 bg-[var(--hover-bg)] rounded-lg">
          <TrendingUp size={14} className="text-[var(--accent-color)]" />
          <div>
            <p className="text-xs text-[var(--light-text)]">Avg PR Size</p>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              +{insights.averagePRSize.additions}/-
              {insights.averagePRSize.deletions}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-[var(--hover-bg)] rounded-lg">
          <Clock size={14} className="text-[var(--accent-color)]" />
          <div>
            <p className="text-xs text-[var(--light-text)]">Avg Review Time</p>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {insights.averageReviewTime.hours < 24
                ? `${insights.averageReviewTime.hours}h`
                : `${Math.round(insights.averageReviewTime.hours / 24)}d`}
            </p>
          </div>
        </div>
      </div>
      {/* BOTTLENECKS */}
      {insights.bottlenecks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-[var(--light-text)] mb-2">
            Bottlenecks
          </p>
          <ul className="space-y-1.5">
            {insights.bottlenecks.slice(0, 2).map((bottleneck, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-[var(--light-text)]"
              >
                <AlertTriangle
                  size={12}
                  className="mt-0.5 flex-shrink-0 text-[var(--accent-color)]"
                />
                <span>{bottleneck.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* SUGGESTIONS */}
      {insights.suggestions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[var(--light-text)] mb-2">
            Suggestions
          </p>
          <ul className="space-y-1.5">
            {insights.suggestions.slice(0, 2).map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-[var(--light-text)]"
              >
                <CheckCircle2
                  size={12}
                  className="mt-0.5 flex-shrink-0 text-[var(--accent-color)]"
                />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// <== AI ASSISTANT PANEL COMPONENT ==>
const AIAssistantPanel = ({
  workspaceId,
  onOpenStandup,
  onOpenNLTasks,
}: {
  workspaceId: string;
  onOpenStandup?: () => void;
  onOpenNLTasks?: () => void;
}): JSX.Element => {
  // FETCH SPRINT PREDICTION
  const {
    prediction,
    isLoading: isPredictionLoading,
    refetch: refetchPrediction,
  } = useSprintPrediction(workspaceId);
  // FETCH CODE REVIEW INSIGHTS
  const {
    insights,
    isLoading: isInsightsLoading,
    refetch: refetchInsights,
  } = useCodeReviewInsights(workspaceId);
  // RETURN AI ASSISTANT PANEL
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 flex items-center justify-center">
          <Bot size={20} className="text-[var(--accent-color)]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[var(--primary-text)]">
            AI Copilot
          </h3>
          <p className="text-xs sm:text-sm text-[var(--light-text)]">
            Intelligent workspace assistant
          </p>
        </div>
      </div>
      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpenStandup}
          className="flex items-center gap-3 p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-[var(--accent-color)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--primary-text)]">
              Generate Standup
            </p>
            <p className="text-xs text-[var(--light-text)]">
              AI-powered daily summary
            </p>
          </div>
        </button>
        <button
          onClick={onOpenNLTasks}
          className="flex items-center gap-3 p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center flex-shrink-0">
            <ListTodo size={18} className="text-[var(--accent-color)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--primary-text)]">
              Create Tasks
            </p>
            <p className="text-xs text-[var(--light-text)]">
              From natural language
            </p>
          </div>
        </button>
      </div>
      {/* INSIGHTS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SPRINT PREDICTION */}
        <SprintPredictionCard
          prediction={prediction}
          isLoading={isPredictionLoading}
          onRefresh={() => refetchPrediction()}
        />
        {/* CODE REVIEW INSIGHTS */}
        <CodeReviewInsightsCard
          insights={insights}
          isLoading={isInsightsLoading}
          onRefresh={() => refetchInsights()}
        />
      </div>
    </div>
  );
};

export default AIAssistantPanel;
