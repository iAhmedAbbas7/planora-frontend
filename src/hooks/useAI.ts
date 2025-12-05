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
// <== REPOSITORY CATEGORIZATION TYPE ==>
export type RepositoryCategorization = {
  // <== CATEGORY ==>
  category: string;
  // <== SUBCATEGORY ==>
  subcategory: string;
  // <== TECH STACK ==>
  techStack: string[];
  // <== FRAMEWORKS ==>
  frameworks: string[];
  // <== PURPOSE ==>
  purpose: string;
  // <== PROJECT TYPE ==>
  projectType: string;
  // <== COMPLEXITY ==>
  complexity: string;
  // <== SUGGESTED TAGS ==>
  suggestedTags: string[];
};
// <== HEALTH SCORE METRICS TYPE ==>
export type HealthScoreMetrics = {
  // <== DOCUMENTATION ==>
  documentation: {
    // <== SCORE ==>
    score: number;
    // <== HAS README ==>
    hasReadme: boolean;
    // <== HAS DESCRIPTION ==>
    hasDescription: boolean;
    // <== HAS TOPICS ==>
    hasTopics: boolean;
  };
  // <== MAINTENANCE ==>
  maintenance: {
    // <== SCORE ==>
    score: number;
    // <== DAYS SINCE UPDATE ==>
    daysSinceUpdate: number;
    // <== LAST COMMIT DATE ==>
    lastCommitDate: string | null;
    // <== RECENT COMMITS ==>
    recentCommits: number;
  };
  // <== COMMUNITY ==>
  community: {
    // <== SCORE ==>
    score: number;
    // <== STARS ==>
    stars: number;
    // <== FORKS ==>
    forks: number;
    // <== WATCHERS ==>
    watchers: number;
  };
  // <== ISSUES ==>
  issues: {
    // <== SCORE ==>
    score: number;
    // <== OPEN ISSUES ==>
    openIssues: number;
    // <== OPEN PULL REQUESTS ==>
    openPRs: number;
  };
  // <== BEST PRACTICES ==>
  bestPractices: {
    // <== SCORE ==>
    score: number;
    // <== HAS LICENSE ==>
    hasLicense: boolean;
    // <== LICENSE NAME ==>
    licenseName: string | null;
  };
};
// <== HEALTH SUGGESTION TYPE ==>
export type HealthSuggestion = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "high" | "medium" | "low";
  // <== CATEGORY ==>
  category: string;
};
// <== REPOSITORY HEALTH SCORE TYPE ==>
export type RepositoryHealthScore = {
  // <== OVERALL SCORE ==>
  overall: number;
  // <== GRADE ==>
  grade: string;
  // <== METRICS ==>
  metrics: HealthScoreMetrics;
};
// <== CODE EXPLANATION TYPE ==>
export type CodeExplanationType =
  | "general"
  | "line-by-line"
  | "function"
  | "security"
  | "performance";
// <== GENERAL CODE EXPLANATION TYPE ==>
export type GeneralCodeExplanation = {
  // <== SUMMARY ==>
  summary: string;
  // <== PURPOSE ==>
  purpose: string;
  // <== KEY COMPONENTS ==>
  keyComponents: {
    name: string;
    description: string;
    lineRange: string;
  }[];
  // <== COMPLEXITY ==>
  complexity: "low" | "medium" | "high";
  // <== SUGGESTIONS ==>
  suggestions?: string[];
  // <== DEPENDENCIES ==>
  dependencies?: string[];
  // <== PATTERNS ==>
  patterns?: string[];
};
// <== LINE BY LINE EXPLANATION TYPE ==>
export type LineByLineExplanation = {
  // <== EXPLANATIONS ==>
  explanations: {
    lineNumber: number;
    code: string;
    explanation: string;
  }[];
  // <== SUMMARY ==>
  summary: string;
};
// <== FUNCTION EXPLANATION TYPE ==>
export type FunctionExplanation = {
  // <== FUNCTIONS ==>
  functions: {
    name: string;
    parameters: { name: string; type: string; description: string }[];
    returnType: string;
    purpose: string;
    example?: string;
    complexity: "low" | "medium" | "high";
  }[];
  // <== RELATIONSHIPS ==>
  relationships: string;
};
// <== SECURITY EXPLANATION TYPE ==>
export type SecurityExplanation = {
  // <== SECURITY LEVEL ==>
  securityLevel: "low" | "medium" | "high" | "critical";
  // <== ISSUES ==>
  issues: {
    severity: "low" | "medium" | "high" | "critical";
    type: string;
    description: string;
    location: string;
    recommendation: string;
  }[];
  // <== GOOD PRACTICES ==>
  goodPractices: string[];
  // <== RECOMMENDATIONS ==>
  recommendations: string[];
};
// <== PERFORMANCE EXPLANATION TYPE ==>
export type PerformanceExplanation = {
  // <== PERFORMANCE RATING ==>
  performanceRating: "poor" | "fair" | "good" | "excellent";
  // <== ISSUES ==>
  issues: {
    severity: "low" | "medium" | "high";
    type: string;
    description: string;
    location: string;
    recommendation: string;
  }[];
  // <== OPTIMIZATIONS ==>
  optimizations: {
    title: string;
    description: string;
    impact: string;
  }[];
  // <== BIG O ==>
  bigO?: string;
};
// <== CODE EXPLANATION RESULT TYPE ==>
export type CodeExplanationResult = {
  // <== TYPE ==>
  type: CodeExplanationType;
  // <== LANGUAGE ==>
  language: string;
  // <== FILE NAME ==>
  fileName: string | null;
  // <== EXPLANATION ==>
  explanation:
    | GeneralCodeExplanation
    | LineByLineExplanation
    | FunctionExplanation
    | SecurityExplanation
    | PerformanceExplanation
    | { rawExplanation: string };
};
// <== EXPLAIN CODE INPUT TYPE ==>
export type ExplainCodeInput = {
  // <== CODE ==>
  code: string;
  // <== LANGUAGE ==>
  language?: string;
  // <== FILE NAME ==>
  fileName?: string;
  // <== EXPLAIN TYPE ==>
  explainType?: CodeExplanationType;
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

// <== FETCH REPOSITORY CATEGORIZATION ==>
const fetchRepositoryCategorization = async (
  owner: string,
  repo: string
): Promise<{
  repository: {
    fullName: string;
    description: string;
    language: string;
    topics: string[];
  };
  categorization: RepositoryCategorization;
}> => {
  // FETCH REPOSITORY CATEGORIZATION
  const response = await apiClient.get<
    ApiResponse<{
      repository: {
        fullName: string;
        description: string;
        language: string;
        topics: string[];
      };
      categorization: RepositoryCategorization;
    }>
  >(`/ai/categorize/${owner}/${repo}`);
  // RETURN DATA
  return response.data.data;
};

// <== FETCH REPOSITORY HEALTH SCORE ==>
const fetchRepositoryHealthScore = async (
  owner: string,
  repo: string
): Promise<{
  repository: { fullName: string; description: string; language: string };
  healthScore: RepositoryHealthScore;
  suggestions: HealthSuggestion[];
}> => {
  // FETCH REPOSITORY HEALTH SCORE
  const response = await apiClient.get<
    ApiResponse<{
      repository: { fullName: string; description: string; language: string };
      healthScore: RepositoryHealthScore;
      suggestions: HealthSuggestion[];
    }>
  >(`/ai/health/${owner}/${repo}`);
  // RETURN DATA
  return response.data.data;
};

// <== USE REPOSITORY CATEGORIZATION HOOK ==>
export const useRepositoryCategorization = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH CATEGORIZATION
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      repository: {
        fullName: string;
        description: string;
        language: string;
        topics: string[];
      };
      categorization: RepositoryCategorization;
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-categorization", owner, repo],
    queryFn: () => fetchRepositoryCategorization(owner, repo),
    retry: 1,
    staleTime: 30 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN CATEGORIZATION DATA
  return {
    categorization: data?.categorization,
    repository: data?.repository,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE REPOSITORY HEALTH SCORE HOOK ==>
export const useRepositoryHealthScore = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH HEALTH SCORE
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      repository: { fullName: string; description: string; language: string };
      healthScore: RepositoryHealthScore;
      suggestions: HealthSuggestion[];
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-health-score", owner, repo],
    queryFn: () => fetchRepositoryHealthScore(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN HEALTH SCORE DATA
  return {
    healthScore: data?.healthScore,
    suggestions: data?.suggestions || [],
    repository: data?.repository,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== EXPLAIN CODE FUNCTION ==>
const explainCodeFn = async (
  input: ExplainCodeInput
): Promise<CodeExplanationResult> => {
  // EXPLAIN CODE
  const response = await apiClient.post<ApiResponse<CodeExplanationResult>>(
    "/ai/explain-code",
    {
      code: input.code,
      language: input.language,
      fileName: input.fileName,
      explainType: input.explainType || "general",
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE EXPLAIN CODE HOOK ==>
export const useExplainCode = () => {
  // EXPLAIN CODE MUTATION
  const mutation = useMutation<
    CodeExplanationResult,
    AxiosError<{ message?: string }>,
    ExplainCodeInput
  >({
    mutationFn: explainCodeFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to explain code");
    },
  });
  // RETURN MUTATION
  return mutation;
};
