// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

// <== CODEBASE ANALYSIS TYPES ==>
export type CodebaseOverview = {
  // <== PROJECT TYPE ==>
  projectType: string;
  // <== TECH STACK ==>
  techStack: string[];
  // <== ARCHITECTURE ==>
  architecture: string;
  // <== MATURITY LEVEL ==>
  maturityLevel: string;
  // <== SUMMARY ==>
  summary: string;
};
// <== CODE QUALITY TYPES ==>
export type CodeQuality = {
  // <== SCORE ==>
  score: number;
  // <== STRENGTHS ==>
  strengths: string[];
  improvements: string[];
};
// <== SUGGESTED FEATURE TYPES ==>
export type SuggestedFeature = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "high" | "medium" | "low";
  // <== ESTIMATED EFFORT ==>
  estimatedEffort: "small" | "medium" | "large";
  // <== CATEGORY ==>
  category: "feature" | "bugfix" | "improvement" | "documentation";
};
// <== TECHNICAL DEBT TYPES ==>
export type TechnicalDebt = {
  // <== ISSUE ==>
  issue: string;
  // <== IMPACT ==>
  impact: "high" | "medium" | "low";
  // <== SUGGESTED FIX ==>
  suggestedFix: string;
};
// <== CODEBASE ANALYSIS TYPES ==>
export type CodebaseAnalysis = {
  // <== OVERVIEW ==>
  overview: CodebaseOverview;
  // <== CODE QUALITY ==>
  codeQuality: CodeQuality;
  // <== SUGGESTED FEATURES ==>
  suggestedFeatures: SuggestedFeature[];
  // <== TECHNICAL DEBT ==>
  technicalDebt: TechnicalDebt[];
  // <== SECURITY CONSIDERATIONS ==>
  securityConsiderations: string[];
  // <== SCALABILITY NOTES ==>
  scalabilityNotes: string;
};
// <== ANALYZE CODEBASE REQUEST TYPES ==>
export type AnalyzeCodebaseRequest = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== REPOSITORY DATA ==>
  repositoryData: {
    // <== FULL NAME ==>
    fullName?: string;
    // <== DESCRIPTION ==>
    description?: string;
    // <== LANGUAGE ==>
    language?: string;
    // <== STARGAZERS COUNT ==>
    stargazersCount?: number;
    // <== FORKS COUNT ==>
    forksCount?: number;
    // <== DEFAULT BRANCH ==>
    defaultBranch?: string;
  };
  // <== FILE TREE ==>
  fileTree?: unknown;
  // <== README ==>
  readme?: string;
  // <== PACKAGE JSON ==>
  packageJson?: unknown;
};
// <== ANALYZE CODEBASE RESPONSE TYPES ==>
export type AnalyzeCodebaseResponse = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== REPOSITORY ==>
  repository: string;
  // <== ANALYSIS ==>
  analysis: CodebaseAnalysis;
  // <== ANALYZED AT ==>
  analyzedAt: string;
};
// <== SPRINT PLAN TYPES ==>
export type SprintTask = {
  // <== TASK INDEX ==>
  taskIndex: number;
  // <== REASON ==>
  reason: string;
  // <== SUGGESTED ORDER ==>
  suggestedOrder: number;
  // <== ESTIMATED DAYS ==>
  estimatedDays: number;
  // <== TASK ==>
  task: {
    // <== TASK ID ==>
    _id: string;
    // <== TITLE ==>
    title: string;
    // <== DESCRIPTION ==>
    description?: string;
    // <== PRIORITY ==>
    priority?: string;
    // <== STATUS ==>
    status: string;
    // <== DUE DATE ==>
    dueDate?: string;
  } | null;
};
export type DeferredTask = {
  // <== TASK INDEX ==>
  taskIndex: number;
  // <== REASON ==>
  reason: string;
  // <== TASK ==>
  task: {
    // <== TASK ID ==>
    _id: string;
    // <== TITLE ==>
    title: string;
    // <== PRIORITY ==>
    priority?: string;
  } | null;
};
// <== SPRINT METRICS TYPES ==>
export type SprintMetrics = {
  // <== TOTAL ESTIMATED DAYS ==>
  totalEstimatedDays: number;
  // <== CAPACITY UTILIZATION ==>
  capacityUtilization: number;
  // <== TASKS SELECTED ==>
  tasksSelected: number;
  // <== TASKS DEFERRED ==>
  tasksDeferred: number;
  // <== AVG TASK TIME ==>
  avgTaskTime: string;
};
// <== SPRINT PLAN TYPES ==>
export type SprintPlan = {
  // <== NAME ==>
  name: string;
  // <== GOAL ==>
  goal: string;
  // <== START DATE ==>
  startDate: string;
  // <== END DATE ==>
  endDate: string;
  // <== DURATION ==>
  duration: number;
  // <== TEAM SIZE ==>
  teamSize: number;
  // <== SELECTED TASKS ==>
  selectedTasks: SprintTask[];
  // <== DEFERRED TASKS ==>
  deferredTasks: DeferredTask[];
  // <== METRICS ==>
  metrics: SprintMetrics;
  // <== RISKS ==>
  risks: string[];
  // <== RECOMMENDATIONS ==>
  recommendations: string[];
};
// <== CREATE SPRINT PLAN REQUEST TYPES ==>
export type CreateSprintPlanRequest = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== SPRINT DURATION ==>
  sprintDuration?: number;
  // <== TEAM SIZE ==>
  teamSize?: number;
  // <== SPRINT GOAL ==>
  sprintGoal?: string;
  // <== FOCUS AREAS ==>
  focusAreas?: string[];
  // <== EXCLUDE TASK IDs ==>
  excludeTaskIds?: string[];
};
// <== CREATE SPRINT PLAN RESPONSE TYPES ==>
export type CreateSprintPlanResponse = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== PROJECT TITLE ==>
  projectTitle: string;
  // <== SPRINT ==>
  sprint: SprintPlan;
  // <== CREATED AT ==>
  createdAt: string;
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

// <== ANALYZE CODEBASE FOR A PROJECT ==>
const analyzeCodebaseAPI = async (
  data: AnalyzeCodebaseRequest
): Promise<AnalyzeCodebaseResponse> => {
  // ANALYZE CODEBASE FOR A PROJECT
  const response = await apiClient.post<ApiResponse<AnalyzeCodebaseResponse>>(
    `/ai/analyze-codebase/${data.projectId}`,
    {
      repositoryData: data.repositoryData,
      fileTree: data.fileTree,
      readme: data.readme,
      packageJson: data.packageJson,
    }
  );
  // CHECK IF RESPONSE DATA IS VALID
  if (!response.data?.data) {
    // THROW ERROR IF RESPONSE DATA IS NOT VALID
    throw new Error("Failed to analyze codebase");
  }
  // RETURN RESPONSE DATA
  return response.data.data;
};

// <== CREATE SPRINT PLAN FOR A PROJECT ==>
const createSprintPlanAPI = async (
  data: CreateSprintPlanRequest
): Promise<CreateSprintPlanResponse> => {
  // CREATE SPRINT PLAN FOR A PROJECT
  const response = await apiClient.post<ApiResponse<CreateSprintPlanResponse>>(
    `/ai/sprint-plan/${data.projectId}`,
    {
      sprintDuration: data.sprintDuration,
      teamSize: data.teamSize,
      sprintGoal: data.sprintGoal,
      focusAreas: data.focusAreas,
      excludeTaskIds: data.excludeTaskIds,
    }
  );
  // CHECK IF RESPONSE DATA IS VALID
  if (!response.data?.data) {
    // THROW ERROR IF RESPONSE DATA IS NOT VALID
    throw new Error("Failed to create sprint plan");
  }
  // RETURN RESPONSE DATA
  return response.data.data;
};

// <== USE ANALYZE CODEBASE HOOK ==>
export const useAnalyzeCodebase = () => {
  // RETURN ANALYZE CODEBASE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: analyzeCodebaseAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Codebase analyzed successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to analyze codebase. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE CREATE SPRINT PLAN HOOK ==>
export const useCreateSprintPlan = () => {
  // RETURN CREATE SPRINT PLAN MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createSprintPlanAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Sprint plan created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create sprint plan. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
