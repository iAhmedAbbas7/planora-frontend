// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== AI STATUS TYPE ==>
export type AIStatus = {
  // <== AI CONFIGURED ==>
  aiConfigured: boolean;
  // <== GITHUB CONNECTED ==>
  githubConnected: boolean;
  // <== READY ==>
  ready: boolean;
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
};
// <== REPOSITORY SUMMARY TYPE ==>
export type RepositorySummary = {
  // <== SUMMARY ==>
  summary: string;
  // <== REPOSITORY ==>
  repository: string;
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
// <== RAW AI STATUS TYPE (FROM BACKEND) ==>
type RawAIStatus = {
  // <== IS AI CONFIGURED ==>
  isAIConfigured: boolean;
  // <== IS GITHUB CONNECTED ==>
  isGitHubConnected: boolean;
  // <== CAN GENERATE TASKS ==>
  canGenerateTasks: boolean;
  // <== AI PROVIDER ==>
  aiProvider: string;
};

// <== FETCH AI STATUS ==>
const fetchAIStatus = async (): Promise<AIStatus> => {
  // FETCH AI STATUS
  const response = await apiClient.get<ApiResponse<RawAIStatus>>("/ai/status");
  // GET DATA
  const data = response.data.data;
  // MAP BACKEND RESPONSE TO FRONTEND TYPE
  return {
    aiConfigured: data.isAIConfigured,
    githubConnected: data.isGitHubConnected,
    ready: data.canGenerateTasks,
  };
};

// <== GENERATE TASKS FROM README ==>
const generateTasksFromReadme = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<{ tasks: GeneratedTask[]; source: string }> => {
  // GENERATE TASKS FROM README
  const response = await apiClient.post<
    ApiResponse<{ tasks: GeneratedTask[]; source: string }>
  >("/ai/generate/readme", { owner, repo });
  // GET DATA
  return response.data.data;
};

// <== GENERATE TASKS FROM COMMITS ==>
const generateTasksFromCommits = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<{ tasks: GeneratedTask[]; source: string }> => {
  // GENERATE TASKS FROM COMMITS
  const response = await apiClient.post<
    ApiResponse<{ tasks: GeneratedTask[]; source: string }>
  >("/ai/generate/commits", { owner, repo });
  // GET DATA
  return response.data.data;
};

// <== SUGGEST NEXT TASKS ==>
const suggestNextTasks = async (
  projectId: string
): Promise<{ tasks: GeneratedTask[]; projectTitle: string }> => {
  // SUGGEST NEXT TASKS
  const response = await apiClient.get<
    ApiResponse<{ tasks: GeneratedTask[]; projectTitle: string }>
  >(`/ai/suggest/${projectId}`);
  // GET DATA
  return response.data.data;
};

// <== SUMMARIZE REPOSITORY ==>
const summarizeRepository = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<RepositorySummary> => {
  // SUMMARIZE REPOSITORY
  const response = await apiClient.post<ApiResponse<RepositorySummary>>(
    "/ai/summarize",
    { owner, repo }
  );
  // GET DATA
  return response.data.data;
};

// <== SAVE GENERATED TASKS ==>
const saveGeneratedTasks = async ({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: GeneratedTask[];
}): Promise<{ savedCount: number; projectId: string }> => {
  // SAVE GENERATED TASKS
  const response = await apiClient.post<
    ApiResponse<{ savedCount: number; projectId: string }>
  >("/ai/save-tasks", { projectId, tasks });
  // GET DATA
  return response.data.data;
};

// <== USE AI STATUS HOOK ==>
export const useAIStatus = (enabled: boolean = true) => {
  // USE QUERY TO FETCH AI STATUS
  const { data, isLoading, isError, error, refetch } = useQuery<
    AIStatus,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-status"],
    queryFn: fetchAIStatus,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN AI STATUS
  return {
    status: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE GENERATE TASKS FROM README MUTATION ==>
export const useGenerateTasksFromReadme = () => {
  // USE MUTATION TO GENERATE TASKS FROM README
  return useMutation<
    { tasks: GeneratedTask[]; source: string },
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: generateTasksFromReadme,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate tasks from README. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE GENERATE TASKS FROM COMMITS MUTATION ==>
export const useGenerateTasksFromCommits = () => {
  // USE MUTATION TO GENERATE TASKS FROM COMMITS
  return useMutation<
    { tasks: GeneratedTask[]; source: string },
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: generateTasksFromCommits,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate tasks from commits. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SUGGEST NEXT TASKS MUTATION ==>
export const useSuggestNextTasks = () => {
  // USE MUTATION TO SUGGEST NEXT TASKS
  return useMutation<
    { tasks: GeneratedTask[]; projectTitle: string },
    AxiosError<{ message?: string }>,
    string
  >({
    // <== MUTATION FN ==>
    mutationFn: suggestNextTasks,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to suggest tasks. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SUMMARIZE REPOSITORY MUTATION ==>
export const useSummarizeRepository = () => {
  // USE MUTATION TO SUMMARIZE REPOSITORY
  return useMutation<
    RepositorySummary,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: summarizeRepository,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to summarize repository. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SAVE GENERATED TASKS MUTATION ==>
export const useSaveGeneratedTasks = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION TO SAVE GENERATED TASKS
  return useMutation<
    { savedCount: number; projectId: string },
    AxiosError<{ message?: string }>,
    { projectId: string; tasks: GeneratedTask[] }
  >({
    // <== MUTATION FN ==>
    mutationFn: saveGeneratedTasks,
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
