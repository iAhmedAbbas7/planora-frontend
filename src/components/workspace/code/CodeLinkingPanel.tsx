// <== IMPORTS ==>
import { useState } from "react";
import {
  GitCommit,
  GitPullRequest,
  FileCode2,
  GitBranch,
  RefreshCw,
  Scan,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Link2,
  Code2,
  Clock,
} from "lucide-react";
import TaskCodeContext from "./TaskCodeContext";
import {
  useWorkspaceTasksWithCode,
  useScanCommits,
  type TaskWithLinkedCode,
} from "../../../hooks/useCodeLinking";
import type { LinkedRepository } from "../../../hooks/useWorkspace";
import { CodeLinkingPanelSkeleton } from "../../skeletons/WorkspaceSkeleton";

// <== COMPONENT PROPS ==>
interface CodeLinkingPanelProps {
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== REPOSITORIES ==>
  repositories: LinkedRepository[];
}

// <== FORMAT DATE HELPER ==>
const formatDate = (dateString: string): string => {
  // CREATE DATE OBJECT
  const date = new Date(dateString);
  // RETURN FORMATTED DATE
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// <== TASK CARD COMPONENT ==>
const TaskCard = ({
  task,
  onSelect,
  isSelected,
}: {
  task: TaskWithLinkedCode;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  // TOTAL LINKED COUNT
  const linkedCount =
    (task.linkedCode?.commits?.length || 0) +
    (task.linkedCode?.pullRequests?.length || 0) +
    (task.linkedCode?.files?.length || 0) +
    (task.linkedCode?.branches?.length || 0);
  // STATUS COLORS
  const statusColors = {
    "to do": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "in progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
  };
  // PRIORITY COLORS
  const priorityColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };
  // RETURN TASK CARD
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
          : "border-[var(--border)] bg-[var(--cards-bg)] hover:border-[var(--accent-color)]/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.taskKey && (
              <code className="px-1.5 py-0.5 rounded bg-[var(--hover-bg)] text-xs font-mono text-[var(--accent-color)]">
                {task.taskKey}
              </code>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                statusColors[task.status]
              }`}
            >
              {task.status}
            </span>
          </div>
          <h4 className="text-sm font-medium text-[var(--primary-text)] truncate">
            {task.title}
          </h4>
        </div>
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
            priorityColors[task.priority]
          }`}
          title={`${task.priority} priority`}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--light-text)]">
        <div className="flex items-center gap-3">
          {linkedCount > 0 ? (
            <>
              {task.linkedCode?.commits?.length ? (
                <span className="flex items-center gap-1">
                  <GitCommit className="w-3 h-3" />
                  {task.linkedCode.commits.length}
                </span>
              ) : null}
              {task.linkedCode?.pullRequests?.length ? (
                <span className="flex items-center gap-1">
                  <GitPullRequest className="w-3 h-3" />
                  {task.linkedCode.pullRequests.length}
                </span>
              ) : null}
              {task.linkedCode?.files?.length ? (
                <span className="flex items-center gap-1">
                  <FileCode2 className="w-3 h-3" />
                  {task.linkedCode.files.length}
                </span>
              ) : null}
              {task.linkedCode?.branches?.length ? (
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  {task.linkedCode.branches.length}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-[var(--light-text)]/60">No linked code</span>
          )}
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};

// <== SCAN MODAL COMPONENT ==>
const ScanModal = ({
  isOpen,
  onClose,
  repositories,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  repositories: LinkedRepository[];
  workspaceId: string;
}) => {
  // SELECTED REPO STATE
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  // BRANCH STATE
  const [branch, setBranch] = useState("main");
  // SCAN MUTATION
  const scanMutation = useScanCommits();
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // HANDLE SCAN
  const handleScan = () => {
    // IF NO SELECTED REPO, RETURN
    if (!selectedRepo) return;
    // GET OWNER AND REPO FROM SELECTED REPO
    const [owner, repo] = selectedRepo.split("/");
    // MUTATE SCAN MUTATION
    scanMutation.mutate(
      { workspaceId, owner, repo, branch },
      {
        // ON SUCCESS
        onSuccess: () => {
          // SET TIMEOUT TO CLOSE MODAL
          setTimeout(() => {
            // CLOSE MODAL
            onClose();
          }, 2000);
        },
      }
    );
  };
  // RETURN SCAN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl bg-[var(--bg)] border border-[var(--border)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
            <Scan className="w-5 h-5 text-[var(--accent-color)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--primary-text)]">
              Scan Commits
            </h3>
            <p className="text-sm text-[var(--light-text)]">
              Link commits to tasks automatically
            </p>
          </div>
        </div>
        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {/* REPOSITORY SELECT */}
          <div>
            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1.5">
              Repository
            </label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] text-[var(--primary-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
            >
              <option value="">Select a repository</option>
              {repositories.map((repo) => (
                <option key={repo.repoId} value={repo.fullName}>
                  {repo.fullName}
                </option>
              ))}
            </select>
          </div>
          {/* BRANCH INPUT */}
          <div>
            <label className="block text-sm font-medium text-[var(--primary-text)] mb-1.5">
              Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--cards-bg)] text-[var(--primary-text)] text-sm placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
            />
          </div>
          {/* RESULT */}
          {scanMutation.isSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div className="text-sm">
                <p className="font-medium text-green-500">Scan completed!</p>
                <p className="text-[var(--light-text)]">
                  Found {scanMutation.data.foundReferences} references, linked{" "}
                  {scanMutation.data.linkedCount} commits.
                </p>
              </div>
            </div>
          )}
          {/* ERROR */}
          {scanMutation.isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-500">
                Failed to scan commits. Please try again.
              </p>
            </div>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--primary-text)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleScan}
            disabled={!selectedRepo || scanMutation.isPending}
            className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {scanMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                Scan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// <== CODE LINKING PANEL COMPONENT ==>
const CodeLinkingPanel = ({
  workspaceId,
  repositories,
}: CodeLinkingPanelProps) => {
  // SHOW SCAN MODAL STATE
  const [showScanModal, setShowScanModal] = useState(false);
  // SELECTED TASK ID STATE
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // FILTER HAS CODE STATE
  const [filterHasCode, setFilterHasCode] = useState(false);
  // PAGE STATE
  const [page, setPage] = useState(1);
  // USE WORKSPACE TASKS WITH CODE HOOK
  const { tasks, pagination, isLoading, refetch } = useWorkspaceTasksWithCode(
    workspaceId,
    { hasCode: filterHasCode, page, limit: 10 }
  );
  // HANDLE PAGE CHANGE
  const handlePageChange = (newPage: number) => {
    // SET PAGE TO NEW PAGE
    setPage(newPage);
    // SET SELECTED TASK ID TO NULL
    setSelectedTaskId(null);
  };
  // RETURN CODE LINKING PANEL
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--primary-text)] flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[var(--accent-color)]" />
            Code Linking
          </h2>
          <p className="text-sm text-[var(--light-text)]">
            Track code changes related to your tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterHasCode(!filterHasCode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterHasCode
                ? "bg-[var(--accent-color)] text-white"
                : "bg-[var(--hover-bg)] text-[var(--primary-text)] hover:bg-[var(--hover-bg)]/80"
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-1.5" />
            Has Code
          </button>
          <button
            onClick={() => setShowScanModal(true)}
            disabled={repositories.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Scan className="w-4 h-4" />
            Scan Commits
          </button>
        </div>
      </div>
      {/* LOADING SKELETON */}
      {isLoading && <CodeLinkingPanelSkeleton />}
      {/* CONTENT IF NOT LOADING */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* TASKS LIST */}
          <div className="flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[var(--primary-text)]">
                Tasks ({pagination.total})
              </h3>
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {/* NO TASKS */}
            {tasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-[var(--border)]">
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mx-auto mb-3">
                    <Code2 className="w-6 h-6 text-[var(--light-text)]" />
                  </div>
                  <p className="text-sm text-[var(--light-text)]">
                    {filterHasCode
                      ? "No tasks with linked code found"
                      : "No tasks found in this workspace"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onSelect={() =>
                        setSelectedTaskId(
                          selectedTaskId === task._id ? null : task._id
                        )
                      }
                      isSelected={selectedTaskId === task._id}
                    />
                  ))}
                </div>
                {/* PAGINATION IF MORE THAN ONE PAGE */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[var(--light-text)]">
                      {page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* TASK DETAILS IF SELECTED TASK ID */}
          <div className="border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] p-4 min-h-[400px] flex flex-col">
            {selectedTaskId ? (
              <TaskCodeContext taskId={selectedTaskId} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mx-auto mb-3">
                    <ExternalLink className="w-6 h-6 text-[var(--light-text)]" />
                  </div>
                  <h3 className="text-sm font-medium text-[var(--primary-text)] mb-1">
                    Select a task
                  </h3>
                  <p className="text-xs text-[var(--light-text)]">
                    Click on a task to view its linked code
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* SCAN MODAL */}
      <ScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        repositories={repositories}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default CodeLinkingPanel;
