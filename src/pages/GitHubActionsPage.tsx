// <== IMPORTS ==>
import {
  Play,
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Clock,
  GitBranch,
  User,
  Sparkles,
  CheckCircle,
  XCircle,
  Circle,
  RotateCcw,
  StopCircle,
  ChevronRight,
  FileCode,
  Zap,
  Info,
} from "lucide-react";
import {
  useRepositoryDetails,
  useWorkflows,
  useWorkflowRuns,
  useWorkflowRunDetails,
  useWorkflowRunJobs,
  useTriggerWorkflow,
  useRerunWorkflow,
  useRerunFailedJobs,
  useCancelWorkflowRun,
  useRepositoryBranches,
  Workflow,
  WorkflowRun,
  WorkflowJob,
  WorkflowJobStep,
} from "../hooks/useGitHub";
import {
  useAIAnalyzeWorkflowFailure,
  AIWorkflowFailureResponse,
} from "../hooks/useAI";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import { JSX, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== STATUS BADGE COMPONENT ==>
const StatusBadge = ({
  status,
  conclusion,
}: {
  status: string | null;
  conclusion: string | null;
}): JSX.Element => {
  // DETERMINE BADGE STYLE BASED ON STATUS AND CONCLUSION
  const getBadgeStyle = () => {
    // IF COMPLETED, CHECK CONCLUSION
    if (status === "completed") {
      switch (conclusion) {
        case "success":
          return {
            bg: "bg-green-500/15",
            text: "text-green-500",
            icon: <CheckCircle size={12} />,
            label: "Success",
          };
        case "failure":
          return {
            bg: "bg-red-500/15",
            text: "text-red-500",
            icon: <XCircle size={12} />,
            label: "Failed",
          };
        case "cancelled":
          return {
            bg: "bg-gray-500/15",
            text: "text-gray-500",
            icon: <StopCircle size={12} />,
            label: "Cancelled",
          };
        case "skipped":
          return {
            bg: "bg-gray-500/15",
            text: "text-gray-400",
            icon: <Circle size={12} />,
            label: "Skipped",
          };
        default:
          return {
            bg: "bg-gray-500/15",
            text: "text-gray-500",
            icon: <Circle size={12} />,
            label: conclusion || "Completed",
          };
      }
    }
    // IF IN PROGRESS
    if (
      status === "in_progress" ||
      status === "queued" ||
      status === "pending"
    ) {
      return {
        bg: "bg-yellow-500/15",
        text: "text-yellow-500",
        icon: <Loader2 size={12} className="animate-spin" />,
        label:
          status === "in_progress"
            ? "Running"
            : status === "queued"
            ? "Queued"
            : "Pending",
      };
    }
    // DEFAULT
    return {
      bg: "bg-gray-500/15",
      text: "text-gray-500",
      icon: <Circle size={12} />,
      label: status || "Unknown",
    };
  };
  // GET STYLE
  const style = getBadgeStyle();
  // RETURN BADGE
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${style.bg} ${style.text}`}
    >
      {style.icon}
      {style.label}
    </span>
  );
};

// <== WORKFLOW CARD COMPONENT ==>
type WorkflowCardProps = {
  // <== WORKFLOW ==>
  workflow: Workflow;
  // <== ON CLICK ==>
  onClick: () => void;
  // <== IS SELECTED ==>
  isSelected: boolean;
  // <== LATEST RUN ==>
  latestRun?: WorkflowRun;
};

const WorkflowCard = ({
  workflow,
  onClick,
  isSelected,
  latestRun,
}: WorkflowCardProps): JSX.Element => {
  // RETURN WORKFLOW CARD
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 text-left rounded-xl border transition cursor-pointer ${
        isSelected
          ? "bg-[var(--accent-color)]/10 border-[var(--accent-color)]/30"
          : "bg-[var(--cards-bg)] border-[var(--border)] hover:border-[var(--accent-color)]/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode
            size={16}
            className={
              isSelected
                ? "text-[var(--accent-color)]"
                : "text-[var(--light-text)]"
            }
          />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {workflow.name}
          </span>
        </div>
        {latestRun && (
          <StatusBadge
            status={latestRun.status}
            conclusion={latestRun.conclusion}
          />
        )}
      </div>
      <p className="mt-1 text-xs text-[var(--light-text)] truncate">
        {workflow.path}
      </p>
    </button>
  );
};

// <== WORKFLOW RUN CARD COMPONENT ==>
type WorkflowRunCardProps = {
  // <== RUN ==>
  run: WorkflowRun;
  // <== ON CLICK ==>
  onClick: () => void;
};

const WorkflowRunCard = ({
  run,
  onClick,
}: WorkflowRunCardProps): JSX.Element => {
  // FORMAT DATE
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // RETURN RUN CARD
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 hover:shadow-lg transition cursor-pointer text-left"
    >
      <div className="flex items-start justify-between gap-3">
        {/* LEFT SECTION */}
        <div className="flex-1 min-w-0">
          {/* TITLE */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
              {run.displayTitle || run.name || `Run #${run.runNumber}`}
            </h3>
            <StatusBadge status={run.status} conclusion={run.conclusion} />
          </div>
          {/* META */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* EVENT */}
            <span className="inline-flex items-center gap-1 text-xs text-[var(--light-text)]">
              <Zap size={12} />
              {run.event}
            </span>
            {/* BRANCH */}
            {run.headBranch && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--light-text)]">
                <GitBranch size={12} />
                {run.headBranch}
              </span>
            )}
            {/* ACTOR */}
            {run.actor && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--light-text)]">
                <User size={12} />
                {run.actor.login}
              </span>
            )}
            {/* DATE */}
            <span className="inline-flex items-center gap-1 text-xs text-[var(--light-text)]">
              <Clock size={12} />
              {formatDate(run.createdAt)}
            </span>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-[var(--light-text)]">
            #{run.runNumber}
          </span>
          <ChevronRight size={16} className="text-[var(--light-text)]" />
        </div>
      </div>
    </button>
  );
};

// <== JOB STEP COMPONENT ==>
const JobStep = ({ step }: { step: WorkflowJobStep }): JSX.Element => {
  // GET STATUS ICON
  const getStatusIcon = () => {
    // CHECK CONCLUSION
    switch (step.conclusion) {
      // IF SUCCESS, RETURN CHECK CIRCLE
      case "success":
        return <CheckCircle size={14} className="text-green-500" />;
      // IF FAILURE, RETURN X CIRCLE
      case "failure":
        return <XCircle size={14} className="text-red-500" />;
      // IF SKIPPED, RETURN CIRCLE
      case "skipped":
        return <Circle size={14} className="text-gray-400" />;
      default:
        // IF IN PROGRESS, RETURN LOADER
        if (step.status === "in_progress") {
          return <Loader2 size={14} className="text-yellow-500 animate-spin" />;
        }
        // DEFAULT RETURN CIRCLE
        return <Circle size={14} className="text-gray-500" />;
    }
  };
  // RETURN STEP
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 text-sm">
      {getStatusIcon()}
      <span className="text-[var(--text-primary)]">{step.name}</span>
    </div>
  );
};

// <== JOB CARD COMPONENT ==>
type JobCardProps = {
  // <== JOB ==>
  job: WorkflowJob;
  // <== IS EXPANDED ==>
  isExpanded: boolean;
  // <== ON TOGGLE ==>
  onToggle: () => void;
};

const JobCard = ({ job, isExpanded, onToggle }: JobCardProps): JSX.Element => {
  // RETURN JOB CARD
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      {/* HEADER */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 p-3 bg-[var(--cards-bg)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge status={job.status} conclusion={job.conclusion} />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {job.name}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[var(--light-text)] transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {/* STEPS */}
      {isExpanded && job.steps && job.steps.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] divide-y divide-[var(--border)]">
          {job.steps.map((step) => (
            <JobStep key={step.number} step={step} />
          ))}
        </div>
      )}
    </div>
  );
};

// <== RUN DETAILS MODAL COMPONENT ==>
type RunDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== RUN ID ==>
  runId: number;
};

const RunDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  runId,
}: RunDetailsModalProps): JSX.Element | null => {
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"jobs" | "ai">("jobs");
  // EXPANDED JOBS STATE
  const [expandedJobs, setExpandedJobs] = useState<number[]>([]);
  // AI ANALYSIS STATE
  const [aiAnalysis, setAiAnalysis] =
    useState<AIWorkflowFailureResponse | null>(null);
  // FETCH RUN DETAILS
  const {
    run,
    isLoading: isRunLoading,
    refetch: refetchRun,
  } = useWorkflowRunDetails(owner, repo, runId, isOpen);
  // FETCH JOBS
  const {
    jobs,
    isLoading: isJobsLoading,
    refetch: refetchJobs,
  } = useWorkflowRunJobs(owner, repo, runId, "latest", isOpen);
  // RERUN WORKFLOW
  const rerunWorkflow = useRerunWorkflow();
  // RERUN FAILED JOBS
  const rerunFailedJobs = useRerunFailedJobs();
  // CANCEL WORKFLOW RUN
  const cancelWorkflowRun = useCancelWorkflowRun();
  // AI ANALYSIS
  const analyzeFailure = useAIAnalyzeWorkflowFailure();
  // TOGGLE JOB EXPANSION
  const toggleJob = (jobId: number) => {
    // TOGGLE JOB EXPANSION
    setExpandedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };
  // HANDLE RERUN
  const handleRerun = () => {
    // RERUN WORKFLOW
    rerunWorkflow.mutate(
      { owner, repo, runId },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Workflow re-run triggered!");
          // REFRESH RUN AND JOBS
          refetchRun();
          // REFRESH JOBS
          refetchJobs();
        },
      }
    );
  };
  // HANDLE RERUN FAILED
  const handleRerunFailed = () => {
    rerunFailedJobs.mutate(
      { owner, repo, runId },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Failed jobs re-run triggered!");
          // REFRESH RUN AND JOBS
          refetchRun();
          // REFRESH JOBS
          refetchJobs();
        },
      }
    );
  };
  // HANDLE CANCEL
  const handleCancel = () => {
    cancelWorkflowRun.mutate(
      { owner, repo, runId },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Workflow run cancelled!");
          // REFRESH RUN AND JOBS
          refetchRun();
          // REFRESH JOBS
          refetchJobs();
        },
      }
    );
  };
  // HANDLE AI ANALYSIS
  const handleAIAnalysis = () => {
    // GET FAILED STEPS
    const failedSteps = jobs
      .flatMap((job) => job.steps || [])
      .filter(
        (step) =>
          step.conclusion === "failure" || step.conclusion === "cancelled"
      )
      .map((step) => ({
        name: step.name,
        conclusion: step.conclusion || "unknown",
      }));
    // ANALYZE
    analyzeFailure.mutate(
      {
        workflowName: run?.name || undefined,
        jobName: jobs.find((j) => j.conclusion === "failure")?.name,
        conclusion: run?.conclusion || undefined,
        steps: failedSteps.length > 0 ? failedSteps : undefined,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET AI ANALYSIS
          setAiAnalysis(data);
        },
      }
    );
  };
  // FORMAT DATE
  const formatDate = (date: string | null) => {
    // IF DATE IS NULL, RETURN N/A
    if (!date) return "N/A";
    // FORMAT DATE
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // RESET STATE ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (!isOpen) {
      // SET ACTIVE TAB TO JOBS
      setActiveTab("jobs");
      // SET EXPANDED JOBS TO EMPTY ARRAY
      setExpandedJobs([]);
      // SET AI ANALYSIS TO NULL
      setAiAnalysis(null);
    }
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // HAS FAILURES
  const hasFailures =
    run?.conclusion === "failure" ||
    jobs.some((j) => j.conclusion === "failure");
  // IS RUNNING
  const isRunning = run?.status === "in_progress" || run?.status === "queued";
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                }}
              >
                <Play size={20} className="text-[var(--accent-color)]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                  {run?.displayTitle || run?.name || `Run #${runId}`}
                </h2>
                <p className="text-xs text-[var(--light-text)]">
                  Run #{run?.runNumber} • {run?.event} •{" "}
                  {formatDate(run?.createdAt || null)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {run && (
                <StatusBadge status={run.status} conclusion={run.conclusion} />
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* ACTIONS */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* RERUN */}
            {!isRunning && (
              <button
                onClick={handleRerun}
                disabled={rerunWorkflow.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
              >
                {rerunWorkflow.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Re-run all
              </button>
            )}
            {/* RERUN FAILED */}
            {hasFailures && !isRunning && (
              <button
                onClick={handleRerunFailed}
                disabled={rerunFailedJobs.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
              >
                {rerunFailedJobs.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RotateCcw size={12} />
                )}
                Re-run failed
              </button>
            )}
            {/* CANCEL */}
            {isRunning && (
              <button
                onClick={handleCancel}
                disabled={cancelWorkflowRun.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
              >
                {cancelWorkflowRun.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <StopCircle size={12} />
                )}
                Cancel
              </button>
            )}
            {/* VIEW ON GITHUB */}
            {run?.htmlUrl && (
              <a
                href={run.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <ExternalLink size={12} />
                View on GitHub
              </a>
            )}
          </div>
        </div>
        {/* TABS */}
        <div className="border-b border-[var(--border)] px-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition cursor-pointer ${
                activeTab === "jobs"
                  ? "border-[var(--accent-color)] text-[var(--accent-color)]"
                  : "border-transparent text-[var(--light-text)] hover:text-[var(--text-primary)]"
              }`}
            >
              Jobs
            </button>
            {hasFailures && (
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "ai"
                    ? "border-[var(--accent-color)] text-[var(--accent-color)]"
                    : "border-transparent text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Sparkles size={14} />
                AI Analysis
              </button>
            )}
          </div>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* LOADING */}
          {(isRunLoading || isJobsLoading) && (
            <div className="flex items-center justify-center py-12">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          )}
          {/* JOBS TAB */}
          {activeTab === "jobs" && !isJobsLoading && (
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <AlertCircle
                    size={40}
                    className="text-[var(--light-text)] mb-3"
                  />
                  <p className="text-sm text-[var(--light-text)]">
                    No jobs found
                  </p>
                </div>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isExpanded={expandedJobs.includes(job.id)}
                    onToggle={() => toggleJob(job.id)}
                  />
                ))
              )}
            </div>
          )}
          {/* AI TAB */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              {/* GENERATE BUTTON */}
              {!aiAnalysis && (
                <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <Sparkles
                    size={40}
                    className="text-[var(--accent-color)] mb-3"
                  />
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                    AI Failure Analysis
                  </h3>
                  <p className="text-xs text-[var(--light-text)] mb-4 text-center max-w-sm">
                    Let AI analyze this workflow failure and suggest fixes
                  </p>
                  <button
                    onClick={handleAIAnalysis}
                    disabled={analyzeFailure.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
                  >
                    {analyzeFailure.isPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Analyze Failure
                      </>
                    )}
                  </button>
                </div>
              )}
              {/* ANALYSIS RESULTS */}
              {aiAnalysis && (
                <div className="space-y-4">
                  {/* SUMMARY */}
                  <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={16} className="text-[var(--accent-color)]" />
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">
                        Summary
                      </h4>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {aiAnalysis.analysis.summary}
                    </p>
                  </div>
                  {/* ROOT CAUSE */}
                  <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">
                        Root Cause
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          aiAnalysis.analysis.severity === "high"
                            ? "bg-red-500/15 text-red-500"
                            : aiAnalysis.analysis.severity === "medium"
                            ? "bg-yellow-500/15 text-yellow-500"
                            : "bg-blue-500/15 text-blue-500"
                        }`}
                      >
                        {aiAnalysis.analysis.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {aiAnalysis.analysis.rootCause}
                    </p>
                    <p className="mt-1 text-xs text-[var(--light-text)]">
                      Error type: {aiAnalysis.analysis.errorType}
                    </p>
                  </div>
                  {/* SUGGESTED FIXES */}
                  {aiAnalysis.analysis.suggestedFixes.length > 0 && (
                    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={16} className="text-green-500" />
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">
                          Suggested Fixes
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {aiAnalysis.analysis.suggestedFixes.map(
                          (fix, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="w-6 h-6 rounded-full bg-[var(--accent-color)]/15 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-[var(--accent-color)]">
                                  {fix.step}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                  {fix.action}
                                </p>
                                <p className="text-xs text-[var(--light-text)] mt-0.5">
                                  {fix.details}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {/* PREVENTION TIPS */}
                  {aiAnalysis.analysis.preventionTips.length > 0 && (
                    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles
                          size={16}
                          className="text-[var(--accent-color)]"
                        />
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">
                          Prevention Tips
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {aiAnalysis.analysis.preventionTips.map(
                          (tip, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check
                                size={14}
                                className="text-green-500 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-[var(--text-primary)]">
                                {tip}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== TRIGGER WORKFLOW MODAL COMPONENT ==>
type TriggerWorkflowModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== WORKFLOW ==>
  workflow: Workflow | null;
};

const TriggerWorkflowModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  workflow,
}: TriggerWorkflowModalProps): JSX.Element | null => {
  // BRANCH STATE
  const [selectedBranch, setSelectedBranch] = useState("");
  // SHOW BRANCH DROPDOWN STATE
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // FETCH BRANCHES
  const { branches, isLoading: isBranchesLoading } = useRepositoryBranches(
    owner,
    repo,
    isOpen
  );
  // TRIGGER WORKFLOW MUTATION
  const triggerWorkflow = useTriggerWorkflow();
  // SET DEFAULT BRANCH
  useEffect(() => {
    // CHECK IF BRANCHES ARE LOADED AND NO BRANCH IS SELECTED
    if (branches.length > 0 && !selectedBranch) {
      // FIND DEFAULT BRANCH
      const defaultBranch = branches.find(
        (b) => b.name === "main" || b.name === "master"
      );
      // SET DEFAULT BRANCH
      setSelectedBranch(defaultBranch?.name || branches[0].name);
    }
  }, [branches, selectedBranch]);
  // RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (!isOpen) {
      // SET SELECTED BRANCH TO EMPTY STRING
      setSelectedBranch("");
      // SET SHOW BRANCH DROPDOWN TO FALSE
      setShowBranchDropdown(false);
    }
  }, [isOpen]);
  // HANDLE TRIGGER
  const handleTrigger = () => {
    // CHECK IF WORKFLOW AND SELECTED BRANCH ARE PROVIDED
    if (!workflow || !selectedBranch) return;
    // TRIGGER WORKFLOW
    triggerWorkflow.mutate(
      {
        owner,
        repo,
        workflowId: workflow.id,
        ref: selectedBranch,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // SHOW SUCCESS TOAST
          toast.success("Workflow triggered successfully!");
          // CLOSE MODAL
          onClose();
        },
      }
    );
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen || !workflow) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Play size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Run Workflow
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {workflow.name}
              </p>
            </div>
          </div>
        </div>
        {/* BODY */}
        <div className="p-4 space-y-4">
          {/* BRANCH SELECT */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Branch
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                disabled={isBranchesLoading}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--light-text)]" />
                  {selectedBranch || "Select branch"}
                </span>
                <ChevronDown size={14} className="text-[var(--light-text)]" />
              </button>
              {showBranchDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowBranchDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {branches.map((branch) => (
                      <button
                        key={branch.name}
                        onClick={() => {
                          setSelectedBranch(branch.name);
                          setShowBranchDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          selectedBranch === branch.name
                            ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={14} />
                        {branch.name}
                        {selectedBranch === branch.name && (
                          <Check size={14} className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* INFO */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-primary)]">
              This workflow uses{" "}
              <code className="px-1 py-0.5 bg-[var(--hover-bg)] rounded">
                workflow_dispatch
              </code>{" "}
              trigger. Make sure the workflow file includes this trigger type.
            </p>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleTrigger}
            disabled={triggerWorkflow.isPending || !selectedBranch}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {triggerWorkflow.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Run Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

// <== SKELETON COMPONENT ==>
const RunSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-3/4 mb-2" />
          <div className="flex gap-3">
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-16" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
          </div>
        </div>
        <div className="h-5 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
    </div>
  );
};

// <== WORKFLOW SKELETON COMPONENT ==>
const WorkflowSkeleton = (): JSX.Element => {
  return (
    <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
        </div>
        <div className="h-5 bg-[var(--light-text)]/10 rounded w-14" />
      </div>
      <div className="mt-1 h-3 bg-[var(--light-text)]/10 rounded w-32" />
    </div>
  );
};

// <== PAGE LOADING SKELETON COMPONENT ==>
const PageLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT SIDEBAR SKELETON */}
      <div className="lg:col-span-1 space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-24 animate-pulse" />
          <div className="w-6 h-6 bg-[var(--light-text)]/10 rounded animate-pulse" />
        </div>
        {/* ALL RUNS BUTTON SKELETON */}
        <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
            <div className="h-4 bg-[var(--light-text)]/10 rounded w-28" />
          </div>
        </div>
        {/* WORKFLOW SKELETONS */}
        {[1, 2, 3].map((i) => (
          <WorkflowSkeleton key={i} />
        ))}
      </div>
      {/* RIGHT SECTION SKELETON */}
      <div className="lg:col-span-3 space-y-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-6 bg-[var(--light-text)]/10 rounded w-48 mb-2 animate-pulse" />
            <div className="h-3 bg-[var(--light-text)]/10 rounded w-24 animate-pulse" />
          </div>
        </div>
        {/* FILTERS SKELETON */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
          <div className="h-10 w-full sm:w-36 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
          <div className="h-10 w-full sm:w-36 bg-[var(--light-text)]/10 rounded-lg animate-pulse" />
        </div>
        {/* RUNS SKELETON */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <RunSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// <== GITHUB ACTIONS PAGE COMPONENT ==>
const GitHubActionsPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Actions - ${owner}/${repo}`);
  // SELECTED WORKFLOW STATE
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // FILTER STATES
  const [statusFilter, setStatusFilter] = useState<string>("");
  // BRANCH FILTER STATE
  const [branchFilter, setBranchFilter] = useState<string>("");
  // SHOW FILTER DROPDOWNS STATE
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  // SHOW BRANCH DROPDOWN STATE
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // SELECTED RUN STATE
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  // TRIGGER MODAL STATE
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH WORKFLOWS
  const {
    workflows,
    isLoading: isWorkflowsLoading,
    isFetching: isWorkflowsFetching,
    refetch: refetchWorkflows,
  } = useWorkflows(owner || "", repo || "");
  // FETCH WORKFLOW RUNS
  const {
    runs,
    totalCount,
    isLoading: isRunsLoading,
    isFetching: isRunsFetching,
    refetch: refetchRuns,
  } = useWorkflowRuns(
    owner || "",
    repo || "",
    {
      workflowId: selectedWorkflow?.id,
      status: statusFilter || undefined,
      branch: branchFilter || undefined,
      perPage: 20,
    },
    !isWorkflowsLoading
  );
  // FETCH BRANCHES FOR FILTER
  const { branches } = useRepositoryBranches(owner || "", repo || "");
  // FILTER RUNS BY SEARCH
  const filteredRuns = useMemo(() => {
    // IF SEARCH QUERY IS EMPTY, RETURN ALL RUNS
    if (!searchQuery.trim()) return runs;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER RUNS BY QUERY
    return runs.filter(
      // CHECK IF DISPLAY TITLE, NAME, HEAD BRANCH, OR ACTOR LOGIN INCLUDES QUERY
      (run) =>
        run.displayTitle?.toLowerCase().includes(query) ||
        run.name?.toLowerCase().includes(query) ||
        run.headBranch?.toLowerCase().includes(query) ||
        run.actor?.login.toLowerCase().includes(query)
    );
  }, [runs, searchQuery]);
  // STATUS OPTIONS WITH ICONS
  const statusOptions = [
    {
      value: "",
      label: "All statuses",
      icon: Circle,
      color: "text-[var(--light-text)]",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "text-blue-500",
    },
    {
      value: "in_progress",
      label: "In progress",
      icon: Loader2,
      color: "text-yellow-500",
    },
    { value: "queued", label: "Queued", icon: Clock, color: "text-orange-500" },
    {
      value: "success",
      label: "Success",
      icon: CheckCircle,
      color: "text-green-500",
    },
    { value: "failure", label: "Failed", icon: XCircle, color: "text-red-500" },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: StopCircle,
      color: "text-gray-500",
    },
  ];
  // HANDLE REFRESH
  const handleRefresh = () => {
    // REFRESH WORKFLOWS
    refetchWorkflows();
    // REFRESH RUNS
    refetchRuns();
  };
  // RETURN PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="GitHub Actions"
        subtitle={`${owner}/${repo}`}
      />
      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(`/github/${owner}/${repo}`)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Repository
        </button>
        {/* LOADING STATE */}
        {isRepoLoading || isWorkflowsLoading ? (
          <PageLoadingSkeleton />
        ) : !repository ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <AlertCircle size={40} className="text-red-500 mb-3" />
            <p className="text-sm text-[var(--text-primary)]">
              Repository not found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT SIDEBAR - WORKFLOWS */}
            <div className="lg:col-span-1 space-y-4">
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-[var(--text-primary)]">
                  Workflows ({workflows.length})
                </h2>
                <button
                  onClick={handleRefresh}
                  className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              {/* ALL RUNS BUTTON */}
              <button
                onClick={() => setSelectedWorkflow(null)}
                className={`w-full p-3 text-left rounded-xl border transition cursor-pointer ${
                  !selectedWorkflow
                    ? "bg-[var(--accent-color)]/10 border-[var(--accent-color)]/30"
                    : "bg-[var(--cards-bg)] border-[var(--border)] hover:border-[var(--accent-color)]/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Play
                    size={16}
                    className={
                      !selectedWorkflow
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--light-text)]"
                    }
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    All workflow runs
                  </span>
                </div>
              </button>
              {/* WORKFLOW LIST */}
              <div className="space-y-2">
                {isWorkflowsFetching && !isWorkflowsLoading
                  ? // SHOW SKELETONS DURING REFRESH
                    [1, 2, 3].map((i) => <WorkflowSkeleton key={i} />)
                  : workflows.map((workflow) => (
                      <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        onClick={() => setSelectedWorkflow(workflow)}
                        isSelected={selectedWorkflow?.id === workflow.id}
                        latestRun={runs.find(
                          (r) => r.workflowId === workflow.id
                        )}
                      />
                    ))}
              </div>
              {workflows.length === 0 && !isWorkflowsFetching && (
                <div className="flex flex-col items-center justify-center py-8 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <FileCode
                    size={32}
                    className="text-[var(--light-text)] mb-2"
                  />
                  <p className="text-xs text-[var(--light-text)] text-center">
                    No workflows found.
                    <br />
                    Add a .github/workflows file to get started.
                  </p>
                </div>
              )}
            </div>
            {/* RIGHT SECTION - RUNS */}
            <div className="lg:col-span-3 space-y-4">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    {selectedWorkflow
                      ? selectedWorkflow.name
                      : "All Workflow Runs"}
                  </h2>
                  <p className="text-xs text-[var(--light-text)]">
                    {totalCount} total runs
                  </p>
                </div>
                {/* TRIGGER BUTTON */}
                {selectedWorkflow && (
                  <button
                    onClick={() => setShowTriggerModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                  >
                    <Play size={14} />
                    Run workflow
                  </button>
                )}
              </div>
              {/* FILTERS */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* SEARCH */}
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
                  />
                  <input
                    type="text"
                    placeholder="Search runs..."
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
                {/* STATUS FILTER */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer min-w-[140px]"
                  >
                    {(() => {
                      const selected = statusOptions.find(
                        (s) => s.value === statusFilter
                      );
                      const Icon = selected?.icon || Circle;
                      return (
                        <Icon
                          size={14}
                          className={
                            selected?.color || "text-[var(--light-text)]"
                          }
                        />
                      );
                    })()}
                    <span className="flex-1 text-left">
                      {statusOptions.find((s) => s.value === statusFilter)
                        ?.label || "Status"}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-[var(--light-text)]"
                    />
                  </button>
                  {showStatusDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 min-w-[180px]">
                        {statusOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                setStatusFilter(option.value);
                                setShowStatusDropdown(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                                statusFilter === option.value
                                  ? "bg-[var(--accent-color)]/10"
                                  : "hover:bg-[var(--hover-bg)]"
                              }`}
                            >
                              <Icon size={14} className={option.color} />
                              <span className="flex-1 text-[var(--text-primary)]">
                                {option.label}
                              </span>
                              {statusFilter === option.value && (
                                <Check
                                  size={14}
                                  className="text-[var(--accent-color)]"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                {/* BRANCH FILTER */}
                <div className="relative">
                  <button
                    onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                    className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer min-w-[140px]"
                  >
                    <GitBranch
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    <span className="flex-1 text-left truncate">
                      {branchFilter || "All branches"}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-[var(--light-text)]"
                    />
                  </button>
                  {showBranchDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowBranchDropdown(false)}
                      />
                      <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 min-w-[180px] max-h-48 overflow-y-auto">
                        <button
                          onClick={() => {
                            setBranchFilter("");
                            setShowBranchDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                            !branchFilter
                              ? "bg-[var(--accent-color)]/10"
                              : "hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          <GitBranch
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                          <span className="flex-1 text-[var(--text-primary)]">
                            All branches
                          </span>
                          {!branchFilter && (
                            <Check
                              size={14}
                              className="text-[var(--accent-color)]"
                            />
                          )}
                        </button>
                        {branches.map((branch) => (
                          <button
                            key={branch.name}
                            onClick={() => {
                              setBranchFilter(branch.name);
                              setShowBranchDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition cursor-pointer ${
                              branchFilter === branch.name
                                ? "bg-[var(--accent-color)]/10"
                                : "hover:bg-[var(--hover-bg)]"
                            }`}
                          >
                            <GitBranch
                              size={14}
                              className="text-[var(--accent-color)]"
                            />
                            <span className="flex-1 text-[var(--text-primary)] truncate">
                              {branch.name}
                            </span>
                            {branchFilter === branch.name && (
                              <Check
                                size={14}
                                className="text-[var(--accent-color)] flex-shrink-0"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* RUNS LIST */}
              <div className="space-y-3">
                {isRunsLoading ||
                (isRunsFetching && filteredRuns.length === 0) ? (
                  // SHOW SKELETONS DURING INITIAL LOAD OR REFRESH WITH NO DATA
                  [1, 2, 3, 4, 5].map((i) => <RunSkeleton key={i} />)
                ) : filteredRuns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <Play size={40} className="text-[var(--light-text)] mb-3" />
                    <p className="text-sm text-[var(--light-text)]">
                      {searchQuery || statusFilter || branchFilter
                        ? "No runs match your filters"
                        : "No workflow runs yet"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* SHOW SKELETONS OVERLAY DURING REFRESH */}
                    {isRunsFetching && (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <RunSkeleton key={i} />
                        ))}
                      </div>
                    )}
                    {/* ACTUAL RUNS */}
                    {!isRunsFetching &&
                      filteredRuns.map((run) => (
                        <WorkflowRunCard
                          key={run.id}
                          run={run}
                          onClick={() => setSelectedRunId(run.id)}
                        />
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      {/* RUN DETAILS MODAL */}
      <RunDetailsModal
        isOpen={!!selectedRunId}
        onClose={() => setSelectedRunId(null)}
        owner={owner || ""}
        repo={repo || ""}
        runId={selectedRunId || 0}
      />
      {/* TRIGGER WORKFLOW MODAL */}
      <TriggerWorkflowModal
        isOpen={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        owner={owner || ""}
        repo={repo || ""}
        workflow={selectedWorkflow}
      />
    </div>
  );
};

export default GitHubActionsPage;
