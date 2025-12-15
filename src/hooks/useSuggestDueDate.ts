// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

// <== WORKLOAD ANALYSIS TYPE ==>
export type WorkloadAnalysis = {
  // <== PENDING TASKS COUNT ==>
  pendingTasks: number;
  // <== OVERDUE TASKS COUNT ==>
  overdueTasks: number;
  // <== AVERAGE COMPLETION DAYS BY PRIORITY ==>
  avgCompletionDays: {
    // <== HIGH PRIORITY ==>
    high: number;
    // <== MEDIUM PRIORITY ==>
    medium: number;
    // <== LOW PRIORITY ==>
    low: number;
  };
};
// <== DUE DATE SUGGESTION TYPE ==>
export type DueDateSuggestion = {
  // <== SUGGESTED DATE (ISO STRING) ==>
  suggestedDate: string;
  // <== DAYS FROM NOW ==>
  daysFromNow?: number;
  // <== REASONING EXPLANATION ==>
  reasoning: string;
  // <== CONFIDENCE LEVEL ==>
  confidence: "high" | "medium" | "low";
  // <== COMPLEXITY ESTIMATE ==>
  complexityEstimate?: "simple" | "moderate" | "complex";
  // <== WORKLOAD IMPACT ==>
  workloadImpact?: "light" | "moderate" | "heavy";
  // <== WORKLOAD ANALYSIS DATA ==>
  workloadAnalysis: WorkloadAnalysis | null;
};
// <== SUGGEST DUE DATE REQUEST TYPE ==>
export type SuggestDueDateRequest = {
  // <== TASK TITLE (REQUIRED) ==>
  title: string;
  // <== TASK DESCRIPTION (OPTIONAL) ==>
  description?: string;
  // <== TASK PRIORITY (OPTIONAL) ==>
  priority?: "low" | "medium" | "high";
  // <== PROJECT ID (OPTIONAL) ==>
  projectId?: string;
};
// <== API RESPONSE TYPE ==>
type ApiResponse = {
  // <== SUCCESS FLAG ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // DATA
  data: DueDateSuggestion;
};

// <== SUGGEST DUE DATE FUNCTION ==>
const suggestDueDate = async (
  data: SuggestDueDateRequest
): Promise<DueDateSuggestion> => {
  // TRY TO SUGGEST DUE DATE
  const response = await apiClient.post<ApiResponse>(
    "/ai/suggest-due-date",
    data
  );
  // RETURN DATA
  return response.data.data;
};

// <== USE SUGGEST DUE DATE HOOK ==>
export const useSuggestDueDate = () => {
  // RETURN MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: suggestDueDate,
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to suggest due date. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FORMAT SUGGESTED DATE FOR DISPLAY FUNCTION ==>
export const formatSuggestedDate = (dateString: string): string => {
  // PARSE DATE
  const date = new Date(dateString);
  // FORMAT OPTIONS
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  // RETURN FORMATTED DATE
  return date.toLocaleDateString("en-US", options);
};

// <== GET CONFIDENCE COLOR FUNCTION ==>
export const getConfidenceColor = (
  confidence: "high" | "medium" | "low"
): string => {
  // SWITCH CONFIDENCE
  switch (confidence) {
    // HIGH CONFIDENCE
    case "high":
      return "text-green-500";
    // MEDIUM CONFIDENCE
    case "medium":
      return "text-yellow-500";
    // LOW CONFIDENCE
    case "low":
      return "text-red-500";
    // DEFAULT
    default:
      return "text-[var(--light-text)]";
  }
};

// <== GET COMPLEXITY LABEL FUNCTION ==>
export const getComplexityLabel = (
  complexity: "simple" | "moderate" | "complex" | undefined
): string => {
  // SWITCH COMPLEXITY
  switch (complexity) {
    // SIMPLE COMPLEXITY
    case "simple":
      return "Simple Task";
    // MODERATE COMPLEXITY
    case "moderate":
      return "Moderate Complexity";
    // COMPLEX COMPLEXITY
    case "complex":
      return "Complex Task";
    // DEFAULT
    default:
      return "Unknown";
  }
};
