// <== IMPORTS ==>
import {
  GitCommit,
  GitPullRequest,
  FileCode2,
  GitBranch,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  ChevronDown,
  ChevronRight,
  XCircle,
  Loader2,
  Link2,
  Unlink,
} from "lucide-react";
import {
  useLinkedCode,
  useTaskImpactAnalysis,
  useUnlinkCode,
  type LinkedCommit,
  type LinkedPullRequest,
  type LinkedFile,
  type LinkedBranch,
} from "../../../hooks/useCodeLinking";
import { useState } from "react";

// <== COMPONENT PROPS ==>
interface TaskCodeContextProps {
  // <== TASK ID ==>
  taskId: string;
  // <== SHOW ANALYSIS ==>
  showAnalysis?: boolean;
  // <== COMPACT ==>
  compact?: boolean;
}

// <== FORMAT DATE HELPER ==>
const formatDate = (dateString: string): string => {
  // CREATE DATE OBJECT
  const date = new Date(dateString);
  // CREATE NOW OBJECT
  const now = new Date();
  // CALCULATE DIFFERENCE IN MILLISECONDS
  const diffMs = now.getTime() - date.getTime();
  // CALCULATE DIFFERENCE IN DAYS
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  // IF DIFFERENCE IN DAYS IS 0, CALCULATE DIFFERENCE IN HOURS
  if (diffDays === 0) {
    // CALCULATE DIFFERENCE IN HOURS
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    // IF DIFFERENCE IN HOURS IS 0, CALCULATE DIFFERENCE IN MINUTES
    if (diffHours === 0) {
      // CALCULATE DIFFERENCE IN MINUTES
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      // RETURN DIFFERENCE IN MINUTES
      return `${diffMinutes}m ago`;
    }
    // RETURN DIFFERENCE IN HOURS
    return `${diffHours}h ago`;
  }
  // IF DIFFERENCE IN DAYS IS LESS THAN 7, RETURN DIFFERENCE IN DAYS
  if (diffDays < 7) {
    // RETURN DIFFERENCE IN DAYS
    return `${diffDays}d ago`;
  }
  // RETURN FORMATTED DATE
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// <== TRUNCATE MESSAGE HELPER ==>
const truncateMessage = (message: string, maxLength: number = 60): string => {
  // GET FIRST LINE
  const firstLine = message.split("\n")[0];
  // IF FIRST LINE IS LESS THAN OR EQUAL TO MAX LENGTH, RETURN FIRST LINE
  if (firstLine.length <= maxLength) return firstLine;
  // RETURN TRUNCATED MESSAGE
  return `${firstLine.slice(0, maxLength)}...`;
};

// <== COMMIT ITEM COMPONENT ==>
const CommitItem = ({
  commit,
  onUnlink,
  isUnlinking,
}: {
  commit: LinkedCommit;
  onUnlink: () => void;
  isUnlinking: boolean;
}) => (
  // RETURN COMMIT ITEM
  <div className="group flex items-start gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30 hover:bg-[var(--hover-bg)]/50 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
      <GitCommit className="w-4 h-4 text-[var(--accent-color)]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <a
          href={commit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[var(--primary-text)] hover:text-[var(--accent-color)] truncate"
        >
          {truncateMessage(commit.message)}
        </a>
        <ExternalLink className="w-3 h-3 text-[var(--light-text)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
      <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
        <code className="px-1.5 py-0.5 rounded bg-[var(--hover-bg)] font-mono">
          {commit.sha.slice(0, 7)}
        </code>
        <span>•</span>
        <span>{commit.repository.fullName}</span>
        <span>•</span>
        <span>{formatDate(commit.committedAt)}</span>
      </div>
      {commit.author.username && (
        <div className="flex items-center gap-1.5 mt-1.5">
          {commit.author.avatarUrl ? (
            <img
              src={commit.author.avatarUrl}
              alt={commit.author.username}
              className="w-4 h-4 rounded-full"
            />
          ) : (
            <div className="w-4 h-4 rounded-full bg-[var(--accent-color)]/20" />
          )}
          <span className="text-xs text-[var(--light-text)]">
            {commit.author.username}
          </span>
        </div>
      )}
    </div>
    <button
      onClick={onUnlink}
      disabled={isUnlinking}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition-all"
      title="Unlink commit"
    >
      {isUnlinking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Unlink className="w-4 h-4" />
      )}
    </button>
  </div>
);

// <== PULL REQUEST ITEM COMPONENT ==>
const PullRequestItem = ({
  pr,
  onUnlink,
  isUnlinking,
}: {
  pr: LinkedPullRequest;
  onUnlink: () => void;
  isUnlinking: boolean;
}) => {
  // STATE COLORS
  const stateColors = {
    open: "text-green-500 bg-green-500/10",
    closed: "text-red-500 bg-red-500/10",
    merged: "text-purple-500 bg-purple-500/10",
  };
  // STATE ICON
  const StateIcon =
    pr.state === "merged"
      ? CheckCircle2
      : pr.state === "closed"
      ? XCircle
      : Clock;
  // RETURN PULL REQUEST ITEM
  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30 hover:bg-[var(--hover-bg)]/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
        <GitPullRequest className="w-4 h-4 text-[var(--accent-color)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--primary-text)] hover:text-[var(--accent-color)] truncate"
          >
            {pr.title}
          </a>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
              stateColors[pr.state]
            }`}
          >
            <StateIcon className="w-3 h-3" />
            {pr.state}
          </span>
          <ExternalLink className="w-3 h-3 text-[var(--light-text)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
          <span>#{pr.number}</span>
          <span>•</span>
          <span>{pr.repository.fullName}</span>
          <span>•</span>
          <span>{formatDate(pr.createdAt)}</span>
        </div>
      </div>
      <button
        onClick={onUnlink}
        disabled={isUnlinking}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition-all"
        title="Unlink pull request"
      >
        {isUnlinking ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Unlink className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

// <== FILE ITEM COMPONENT ==>
const FileItem = ({
  file,
  onUnlink,
  isUnlinking,
}: {
  file: LinkedFile;
  onUnlink: () => void;
  isUnlinking: boolean;
}) => (
  // RETURN FILE ITEM
  <div className="group flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30 hover:bg-[var(--hover-bg)]/50 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
      <FileCode2 className="w-4 h-4 text-[var(--accent-color)]" />
    </div>
    <div className="flex-1 min-w-0">
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-[var(--primary-text)] hover:text-[var(--accent-color)] truncate block"
      >
        {file.path}
      </a>
      <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
        <span>{file.repository.fullName}</span>
      </div>
    </div>
    <button
      onClick={onUnlink}
      disabled={isUnlinking}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition-all"
      title="Unlink file"
    >
      {isUnlinking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Unlink className="w-4 h-4" />
      )}
    </button>
  </div>
);

// <== BRANCH ITEM COMPONENT ==>
const BranchItem = ({
  branch,
  onUnlink,
  isUnlinking,
}: {
  branch: LinkedBranch;
  onUnlink: () => void;
  isUnlinking: boolean;
}) => (
  // RETURN BRANCH ITEM
  <div className="group flex items-center gap-3 p-3 rounded-lg bg-[var(--hover-bg)]/30 hover:bg-[var(--hover-bg)]/50 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
      <GitBranch className="w-4 h-4 text-[var(--accent-color)]" />
    </div>
    <div className="flex-1 min-w-0">
      <a
        href={branch.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-[var(--primary-text)] hover:text-[var(--accent-color)] truncate block"
      >
        {branch.name}
      </a>
      <div className="flex items-center gap-2 text-xs text-[var(--light-text)]">
        <span>{branch.repository.fullName}</span>
      </div>
    </div>
    <button
      onClick={onUnlink}
      disabled={isUnlinking}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-[var(--light-text)] hover:text-red-500 transition-all"
      title="Unlink branch"
    >
      {isUnlinking ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Unlink className="w-4 h-4" />
      )}
    </button>
  </div>
);

// <== COLLAPSIBLE SECTION COMPONENT ==>
const CollapsibleSection = ({
  title,
  icon: Icon,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  // STATE
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // IF COUNT IS 0, RETURN NULL
  if (count === 0) return null;
  // RETURN COLLAPSIBLE SECTION
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-[var(--cards-bg)] hover:bg-[var(--hover-bg)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="text-sm font-medium text-[var(--primary-text)]">
            {title}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-medium">
            {count}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-[var(--light-text)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--light-text)]" />
        )}
      </button>
      {isOpen && (
        <div className="p-2 space-y-2 bg-[var(--cards-bg)]">{children}</div>
      )}
    </div>
  );
};

// <== TASK CODE CONTEXT COMPONENT ==>
const TaskCodeContext = ({
  taskId,
  showAnalysis = true,
  compact = false,
}: TaskCodeContextProps) => {
  // SHOW IMPACT STATE
  const [showImpact, setShowImpact] = useState(false);
  // USE LINKED CODE HOOK
  const { taskKey, linkedCode, isLoading, refetch } = useLinkedCode(taskId);
  // USE UNLINK CODE HOOK
  const unlinkMutation = useUnlinkCode();
  // USE TASK IMPACT ANALYSIS HOOK
  const impactMutation = useTaskImpactAnalysis();
  // TOTAL LINKED COUNT
  const totalLinked =
    linkedCode.commits.length +
    linkedCode.pullRequests.length +
    linkedCode.files.length +
    linkedCode.branches.length;
  // HANDLE UNLINK CODE
  const handleUnlink = (
    type: "commits" | "pullRequests" | "files" | "branches",
    identifier: string
  ) => {
    unlinkMutation.mutate(
      { taskId, type, identifier },
      {
        // ON SUCCESS
        onSuccess: () => {
          // REFETCH LINKED CODE
          refetch();
        },
      }
    );
  };
  // HANDLE ANALYZE IMPACT
  const handleAnalyzeImpact = () => {
    // SET SHOW IMPACT TO TRUE
    setShowImpact(true);
    // IF NO IMPACT DATA, MUTATE IMPACT MUTATION
    if (!impactMutation.data) {
      // MUTATE IMPACT MUTATION
      impactMutation.mutate({ taskId });
    }
  };
  // LOADING STATE
  if (isLoading) {
    // RETURN LOADING STATE
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-[var(--hover-bg)] rounded-lg" />
        <div className="h-24 bg-[var(--hover-bg)] rounded-lg" />
      </div>
    );
  }
  // EMPTY STATE
  if (totalLinked === 0 && !compact) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mx-auto mb-3">
          <Link2 className="w-6 h-6 text-[var(--light-text)]" />
        </div>
        <h3 className="text-sm font-medium text-[var(--primary-text)] mb-1">
          No linked code
        </h3>
        <p className="text-xs text-[var(--light-text)] max-w-sm mx-auto">
          Link commits, pull requests, files, or branches to track code changes
          related to this task.
        </p>
        {taskKey && (
          <p className="text-xs text-[var(--light-text)] mt-3">
            Reference{" "}
            <code className="px-1.5 py-0.5 rounded bg-[var(--hover-bg)] font-mono">
              {taskKey}
            </code>{" "}
            in your commit messages to auto-link.
          </p>
        )}
      </div>
    );
  }
  // RETURN COMPACT VIEW IF COMPACT
  if (compact) {
    // RETURN COMPACT VIEW
    return (
      <div className="flex items-center gap-3 text-xs text-[var(--light-text)]">
        {linkedCode.commits.length > 0 && (
          <div className="flex items-center gap-1">
            <GitCommit className="w-3.5 h-3.5" />
            <span>{linkedCode.commits.length}</span>
          </div>
        )}
        {linkedCode.pullRequests.length > 0 && (
          <div className="flex items-center gap-1">
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>{linkedCode.pullRequests.length}</span>
          </div>
        )}
        {linkedCode.files.length > 0 && (
          <div className="flex items-center gap-1">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{linkedCode.files.length}</span>
          </div>
        )}
        {linkedCode.branches.length > 0 && (
          <div className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{linkedCode.branches.length}</span>
          </div>
        )}
      </div>
    );
  }
  // RETURN FULL VIEW IF NOT COMPACT
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="text-sm font-medium text-[var(--primary-text)]">
            Linked Code
          </span>
          {taskKey && (
            <code className="px-1.5 py-0.5 rounded bg-[var(--hover-bg)] text-xs font-mono text-[var(--light-text)]">
              {taskKey}
            </code>
          )}
        </div>
        {showAnalysis && (
          <button
            onClick={handleAnalyzeImpact}
            disabled={impactMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-medium hover:bg-[var(--accent-color)]/20 transition-colors disabled:opacity-50"
          >
            {impactMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Brain className="w-3.5 h-3.5" />
            )}
            Analyze Impact
          </button>
        )}
      </div>
      {/* IMPACT ANALYSIS */}
      {showImpact && impactMutation.data && (
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="text-sm font-medium text-[var(--primary-text)]">
              AI Impact Analysis
            </span>
            <button
              onClick={() => setShowImpact(false)}
              className="ml-auto p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--light-text)]"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          {/* RISK LEVEL */}
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-4 h-4 ${
                impactMutation.data.analysis.riskLevel === "high"
                  ? "text-red-500"
                  : impactMutation.data.analysis.riskLevel === "medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
            <span className="text-sm text-[var(--primary-text)]">
              Risk Level:{" "}
              <span
                className={`font-medium capitalize ${
                  impactMutation.data.analysis.riskLevel === "high"
                    ? "text-red-500"
                    : impactMutation.data.analysis.riskLevel === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {impactMutation.data.analysis.riskLevel}
              </span>
            </span>
          </div>
          {/* ESTIMATED FILES */}
          {impactMutation.data.analysis.estimatedFiles.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--light-text)] mb-1">
                Estimated Files Affected
              </p>
              <div className="flex flex-wrap gap-1">
                {impactMutation.data.analysis.estimatedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[var(--hover-bg)] text-xs font-mono text-[var(--primary-text)]"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* IMPLEMENTATION TIPS */}
          {impactMutation.data.analysis.implementationTips.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--light-text)] mb-1">
                Implementation Tips
              </p>
              <ul className="text-xs text-[var(--primary-text)] space-y-1">
                {impactMutation.data.analysis.implementationTips.map(
                  (tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent-color)]">•</span>
                      <span>{tip}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* SECTIONS */}
      <div className="space-y-3">
        {/* COMMITS */}
        <CollapsibleSection
          title="Commits"
          icon={GitCommit}
          count={linkedCode.commits.length}
        >
          {linkedCode.commits.map((commit) => (
            <CommitItem
              key={commit.sha}
              commit={commit}
              onUnlink={() => handleUnlink("commits", commit.sha)}
              isUnlinking={
                unlinkMutation.isPending &&
                unlinkMutation.variables?.identifier === commit.sha
              }
            />
          ))}
        </CollapsibleSection>
        {/* PULL REQUESTS */}
        <CollapsibleSection
          title="Pull Requests"
          icon={GitPullRequest}
          count={linkedCode.pullRequests.length}
        >
          {linkedCode.pullRequests.map((pr) => (
            <PullRequestItem
              key={pr.number}
              pr={pr}
              onUnlink={() => handleUnlink("pullRequests", String(pr.number))}
              isUnlinking={
                unlinkMutation.isPending &&
                unlinkMutation.variables?.identifier === String(pr.number)
              }
            />
          ))}
        </CollapsibleSection>
        {/* FILES */}
        <CollapsibleSection
          title="Files"
          icon={FileCode2}
          count={linkedCode.files.length}
        >
          {linkedCode.files.map((file) => (
            <FileItem
              key={file.path}
              file={file}
              onUnlink={() => handleUnlink("files", file.path)}
              isUnlinking={
                unlinkMutation.isPending &&
                unlinkMutation.variables?.identifier === file.path
              }
            />
          ))}
        </CollapsibleSection>
        {/* BRANCHES */}
        <CollapsibleSection
          title="Branches"
          icon={GitBranch}
          count={linkedCode.branches.length}
        >
          {linkedCode.branches.map((branch) => (
            <BranchItem
              key={branch.name}
              branch={branch}
              onUnlink={() => handleUnlink("branches", branch.name)}
              isUnlinking={
                unlinkMutation.isPending &&
                unlinkMutation.variables?.identifier === branch.name
              }
            />
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default TaskCodeContext;
