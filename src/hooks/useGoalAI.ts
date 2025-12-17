// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation } from "@tanstack/react-query";

// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS FIELD ==>
  success: boolean;
  // <== DATA FIELD ==>
  data: T;
  // <== MESSAGE FIELD ==>
  message?: string;
};
// <== SUGGESTED KEY RESULT TYPE ==>
export interface SuggestedKeyResult {
  // <== TITLE FIELD ==>
  title: string;
  // <== DESCRIPTION FIELD ==>
  description: string;
  // <== TARGET VALUE FIELD ==>
  targetValue: number;
  // <== UNIT FIELD ==>
  unit: "number" | "percentage" | "currency";
  // <== PRIORITY FIELD ==>
  priority: "low" | "medium" | "high";
}
// <== GOAL ANALYSIS TYPE ==>
export interface GoalAnalysis {
  // <== SUMMARY FIELD ==>
  summary: string;
  // <== INSIGHTS FIELD ==>
  insights: string[];
  // <== RECOMMENDATIONS FIELD ==>
  recommendations: string[];
}
// <== ALIGNMENT SUGGESTION TYPE ==>
export interface AlignmentSuggestion {
  // <== SUGGESTED PROJECTS FIELD ==>
  suggestedProjects: {
    // <== ID FIELD ==>
    _id: string;
    // <== TITLE FIELD ==>
    title: string;
    // <== DESCRIPTION FIELD ==>
    description?: string;
  }[];
  // <== SUGGESTED TASKS FIELD ==>
  suggestedTasks: {
    // <== ID FIELD ==>
    _id: string;
    // <== TITLE FIELD ==>
    title: string;
    // <== DESCRIPTION FIELD ==>
    description?: string;
  }[];
  // <== REASONING FIELD ==>
  reasoning: string;
}
// <== GENERATED OBJECTIVE TYPE ==>
export interface GeneratedObjective {
  // <== OBJECTIVE FIELD ==>
  objective: {
    // <== TITLE FIELD ==>
    title: string;
    // <== DESCRIPTION FIELD ==>
    description: string;
  };
  // <== SUGGESTED KEY RESULTS FIELD ==>
  suggestedKeyResults: {
    // <== TITLE FIELD ==>
    title: string;
    // <== TARGET VALUE FIELD ==>
    targetValue: number;
    // <== UNIT FIELD ==>
    unit: "number" | "percentage" | "currency";
  }[];
}
// <== SUGGEST KEY RESULTS PARAMS TYPE ==>
type SuggestKeyResultsParams = {
  // <== OBJECTIVE TITLE FIELD ==>
  objectiveTitle: string;
  // <== OBJECTIVE DESCRIPTION FIELD ==>
  objectiveDescription?: string;
  // <== COUNT FIELD ==>
  count?: number;
};
// <== GENERATE OBJECTIVE PARAMS TYPE ==>
type GenerateObjectiveParams = {
  // <== DESCRIPTION FIELD ==>
  description: string;
  // <== CONTEXT FIELD ==>
  context?: string;
};

// <== SUGGEST KEY RESULTS FUNCTION ==>
const suggestKeyResults = async (
  params: SuggestKeyResultsParams
): Promise<SuggestedKeyResult[]> => {
  // SENDING SUGGEST KEY RESULTS REQUEST TO API
  const response = await apiClient.post<ApiResponse<SuggestedKeyResult[]>>(
    "/goals/ai/suggest-key-results",
    params
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== USE SUGGEST KEY RESULTS HOOK ==>
export const useSuggestKeyResults = () => {
  // RETURN MUTATION HOOK
  return useMutation<
    SuggestedKeyResult[],
    AxiosError<{ message?: string }>,
    SuggestKeyResultsParams
  >({
    // MUTATION FUNCTION
    mutationFn: suggestKeyResults,
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to suggest key results."
      );
    },
  });
};

// <== ANALYZE GOAL PROGRESS FUNCTION ==>
const analyzeGoalProgress = async (): Promise<GoalAnalysis> => {
  // SENDING ANALYZE GOAL PROGRESS REQUEST TO API
  const response = await apiClient.get<ApiResponse<GoalAnalysis>>(
    "/goals/ai/analyze-progress"
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== USE GOAL PROGRESS ANALYSIS HOOK ==>
export const useGoalProgressAnalysis = () => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<GoalAnalysis, AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goal-progress-analysis"],
    // QUERY FUNCTION
    queryFn: analyzeGoalProgress,
    // ENABLE QUERY ONLY IF AUTHENTICATED AND NOT LOGGING OUT
    enabled: isAuthenticated && !isLoggingOut,
    // STALE TIME (10 MINUTES)
    staleTime: 10 * 60 * 1000,
    // GARBAGE COLLECTION TIME (15 MINUTES)
    gcTime: 15 * 60 * 1000,
  });
};

// <== SUGGEST GOAL ALIGNMENT FUNCTION ==>
const suggestGoalAlignment = async (
  goalId: string
): Promise<AlignmentSuggestion> => {
  // SENDING SUGGEST GOAL ALIGNMENT REQUEST TO API
  const response = await apiClient.get<ApiResponse<AlignmentSuggestion>>(
    `/goals/ai/${goalId}/suggest-alignment`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== USE GOAL ALIGNMENT SUGGESTIONS HOOK ==>
export const useGoalAlignmentSuggestions = (goalId: string) => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<AlignmentSuggestion, AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goal-alignment", goalId],
    // QUERY FUNCTION
    queryFn: () => suggestGoalAlignment(goalId),
    // ENABLE QUERY ONLY IF AUTHENTICATED, NOT LOGGING OUT, AND GOAL ID EXISTS
    enabled: isAuthenticated && !isLoggingOut && !!goalId,
    // STALE TIME (5 MINUTES)
    staleTime: 5 * 60 * 1000,
    // GARBAGE COLLECTION TIME (10 MINUTES)
    gcTime: 10 * 60 * 1000,
  });
};

// <== GENERATE OBJECTIVE FUNCTION ==>
const generateObjective = async (
  params: GenerateObjectiveParams
): Promise<GeneratedObjective> => {
  // SENDING GENERATE OBJECTIVE REQUEST TO API
  const response = await apiClient.post<ApiResponse<GeneratedObjective>>(
    "/goals/ai/generate-objective",
    params
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== USE GENERATE OBJECTIVE HOOK ==>
export const useGenerateObjective = () => {
  // RETURN MUTATION HOOK
  return useMutation<
    GeneratedObjective,
    AxiosError<{ message?: string }>,
    GenerateObjectiveParams
  >({
    // MUTATION FUNCTION
    mutationFn: generateObjective,
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to generate objective."
      );
    },
  });
};
