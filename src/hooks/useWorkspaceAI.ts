// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== STANDUP ITEM TYPE ==>
export type StandupItem = {
  // <== TYPE ==>
  type: "commit" | "pr" | "issue" | "review";
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== REPOSITORY ==>
  repository: string;
  // <== URL ==>
  url: string;
  // <== TIMESTAMP ==>
  timestamp: string;
};
// <== STANDUP SUMMARY TYPE ==>
export type StandupSummary = {
  // <== SUMMARY TEXT ==>
  summary: string;
  // <== YESTERDAY'S WORK ==>
  yesterday: string[];
  // <== TODAY'S PLAN ==>
  today: string[];
  // <== BLOCKERS ==>
  blockers: string[];
  // <== ACTIVITY ITEMS ==>
  activityItems: StandupItem[];
  // <== STATS ==>
  stats: {
    // <== COMMITS ==>
    commits: number;
    // <== PRS OPENED ==>
    prsOpened: number;
    // <== PRS MERGED ==>
    prsMerged: number;
    // <== ISSUES CLOSED ==>
    issuesClosed: number;
    // <== REVIEWS COMPLETED ==>
    reviewsCompleted: number;
  };
};
// <== GENERATED TASK TYPE ==>
export type GeneratedTask = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== STATUS ==>
  status: "to do" | "in progress" | "completed";
  // <== DUE DATE ==>
  dueDate?: string;
  // <== ESTIMATED HOURS ==>
  estimatedHours?: number;
};
// <== NL TO TASKS RESPONSE TYPE ==>
export type NLToTasksResponse = {
  // <== TASKS ==>
  tasks: GeneratedTask[];
  // <== ORIGINAL INPUT ==>
  originalInput: string;
  // <== TASK COUNT ==>
  taskCount: number;
};
// <== SPRINT PREDICTION TYPE ==>
export type SprintPrediction = {
  // <== PREDICTED COMPLETION DATE ==>
  predictedCompletionDate: string;
  // <== CONFIDENCE ==>
  confidence: "high" | "medium" | "low";
  // <== VELOCITY ==>
  velocity: {
    // <== TASKS PER DAY ==>
    tasksPerDay: number;
    // <== POINTS PER DAY ==>
    pointsPerDay: number;
  };
  // <== REMAINING WORK ==>
  remainingWork: {
    // <== TOTAL TASKS ==>
    totalTasks: number;
    // <== TODO TASKS ==>
    todoTasks: number;
    // <== IN PROGRESS TASKS ==>
    inProgressTasks: number;
  };
  // <== RISK FACTORS ==>
  riskFactors: string[];
  // <== RECOMMENDATIONS ==>
  recommendations: string[];
  // <== ESTIMATED DAYS ==>
  estimatedDays: number;
};
// <== CODE REVIEW INSIGHTS TYPE ==>
export type CodeReviewInsights = {
  // <== OVERALL HEALTH ==>
  overallHealth: "excellent" | "good" | "needs_improvement" | "critical";
  // <== AVERAGE PR SIZE ==>
  averagePRSize: {
    // <== ADDITIONS ==>
    additions: number;
    // <== DELETIONS ==>
    deletions: number;
    // <== RATING ==>
    rating: "small" | "medium" | "large" | "too_large";
  };
  // <== AVERAGE REVIEW TIME ==>
  averageReviewTime: {
    // <== HOURS ==>
    hours: number;
    // <== RATING ==>
    rating: "fast" | "acceptable" | "slow" | "too_slow";
  };
  // <== MERGE RATE ==>
  mergeRate: number;
  // <== BOTTLENECKS ==>
  bottlenecks: {
    // <== TYPE ==>
    type: "reviewer" | "author" | "process";
    // <== DESCRIPTION ==>
    description: string;
    // <== SUGGESTION ==>
    suggestion: string;
  }[];
  // <== SUGGESTIONS ==>
  suggestions: string[];
  // <== PR STATS ==>
  prStats: {
    // <== TOTAL ==>
    total: number;
    // <== OPEN ==>
    open: number;
    // <== MERGED ==>
    merged: number;
    // <== CLOSED ==>
    closed: number;
  };
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
};

// <== FETCH STANDUP SUMMARY ==>
const fetchStandupSummary = async (
  workspaceId: string,
  targetUserId?: string
): Promise<StandupSummary> => {
  // BUILD URL WITH OPTIONAL TARGET USER
  const url = targetUserId
    ? `/workspaces/ai/${workspaceId}/standup?targetUserId=${targetUserId}`
    : `/workspaces/ai/${workspaceId}/standup`;
  // FETCH STANDUP SUMMARY
  const response = await apiClient.get<ApiResponse<StandupSummary>>(url);
  // RETURN DATA
  return response.data.data;
};

// <== CONVERT NL TO TASKS ==>
const convertNLToTasks = async ({
  workspaceId,
  input,
  projectId,
}: {
  workspaceId: string;
  input: string;
  projectId?: string;
}): Promise<NLToTasksResponse> => {
  // CONVERT NL TO TASKS
  const response = await apiClient.post<ApiResponse<NLToTasksResponse>>(
    `/workspaces/ai/${workspaceId}/nl-to-tasks`,
    { input, projectId }
  );
  // RETURN DATA
  return response.data.data;
};

// <== FETCH SPRINT PREDICTION ==>
const fetchSprintPrediction = async (
  workspaceId: string,
  projectId?: string
): Promise<SprintPrediction> => {
  // BUILD URL WITH OPTIONAL PROJECT ID
  const url = projectId
    ? `/workspaces/ai/${workspaceId}/predict-sprint?projectId=${projectId}`
    : `/workspaces/ai/${workspaceId}/predict-sprint`;
  // FETCH SPRINT PREDICTION
  const response = await apiClient.get<ApiResponse<SprintPrediction>>(url);
  // RETURN DATA
  return response.data.data;
};

// <== FETCH CODE REVIEW INSIGHTS ==>
const fetchCodeReviewInsights = async (
  workspaceId: string
): Promise<CodeReviewInsights> => {
  // FETCH CODE REVIEW INSIGHTS
  const response = await apiClient.get<ApiResponse<CodeReviewInsights>>(
    `/workspaces/ai/${workspaceId}/code-review-insights`
  );
  // RETURN DATA
  return response.data.data;
};

// <== SAVE AI TASKS ==>
const saveAITasks = async ({
  workspaceId,
  projectId,
  tasks,
}: {
  workspaceId: string;
  projectId: string;
  tasks: GeneratedTask[];
}): Promise<{ savedCount: number; projectId: string }> => {
  // SAVE AI TASKS
  const response = await apiClient.post<
    ApiResponse<{ savedCount: number; projectId: string }>
  >(`/workspaces/ai/${workspaceId}/save-tasks`, { projectId, tasks });
  // RETURN DATA
  return response.data.data;
};

// <== USE STANDUP SUMMARY HOOK ==>
export const useStandupSummary = (
  workspaceId: string,
  targetUserId?: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH STANDUP SUMMARY
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    StandupSummary,
    AxiosError<{ message?: string }>
  >({
    // <== QUERY KEY ==>
    queryKey: ["workspace-standup", workspaceId, targetUserId],
    // <== QUERY FN ==>
    queryFn: () => fetchStandupSummary(workspaceId, targetUserId),
    // <== RETRY ==>
    retry: 1,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
    // <== ENABLED ==>
    enabled: enabled && !!workspaceId,
  });
  // RETURN STANDUP SUMMARY DATA
  return {
    standup: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE NL TO TASKS MUTATION ==>
export const useNLToTasks = () => {
  // USE MUTATION TO CONVERT NL TO TASKS
  return useMutation<
    NLToTasksResponse,
    AxiosError<{ message?: string }>,
    { workspaceId: string; input: string; projectId?: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: convertNLToTasks,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to convert text to tasks. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SPRINT PREDICTION HOOK ==>
export const useSprintPrediction = (
  workspaceId: string,
  projectId?: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH SPRINT PREDICTION
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    SprintPrediction,
    AxiosError<{ message?: string }>
  >({
    // <== QUERY KEY ==>
    queryKey: ["workspace-sprint-prediction", workspaceId, projectId],
    // <== QUERY FN ==>
    queryFn: () => fetchSprintPrediction(workspaceId, projectId),
    // <== RETRY ==>
    retry: 1,
    // <== STALE TIME ==>
    staleTime: 10 * 60 * 1000,
    // <== ENABLED ==>
    enabled: enabled && !!workspaceId,
  });
  // RETURN SPRINT PREDICTION DATA
  return {
    prediction: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE CODE REVIEW INSIGHTS HOOK ==>
export const useCodeReviewInsights = (
  workspaceId: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH CODE REVIEW INSIGHTS
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    CodeReviewInsights,
    AxiosError<{ message?: string }>
  >({
    // <== QUERY KEY ==>
    queryKey: ["workspace-code-review-insights", workspaceId],
    // <== QUERY FN ==>
    queryFn: () => fetchCodeReviewInsights(workspaceId),
    // <== RETRY ==>
    retry: 1,
    // <== STALE TIME ==>
    staleTime: 10 * 60 * 1000,
    // <== ENABLED ==>
    enabled: enabled && !!workspaceId,
  });
  // RETURN CODE REVIEW INSIGHTS DATA
  return {
    insights: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE SAVE AI TASKS MUTATION ==>
export const useSaveAITasks = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION TO SAVE AI TASKS
  return useMutation<
    { savedCount: number; projectId: string },
    AxiosError<{ message?: string }>,
    { workspaceId: string; projectId: string; tasks: GeneratedTask[] }
  >({
    // <== MUTATION FN ==>
    mutationFn: saveAITasks,
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE ALL TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASKS BY PROJECT QUERY
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", data.projectId],
      });
      // TASK WORD (SINGULAR OR PLURAL)
      const taskWord = data.savedCount === 1 ? "task" : "tasks";
      // SHOW SUCCESS TOAST
      toast.success(`${data.savedCount} ${taskWord} saved successfully!`);
    },
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save tasks. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
