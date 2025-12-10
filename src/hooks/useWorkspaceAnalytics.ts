// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== DORA METRIC TYPE ==>
export type DORAMetricValue = {
  // <== VALUE ==>
  value: number;
  // <== UNIT ==>
  unit: string;
  // <== RATING ==>
  rating: "elite" | "high" | "medium" | "low";
  // <== TREND ==>
  trend: number[];
};
// <== DORA METRICS TYPE ==>
export type DORAMetrics = {
  // <== DEPLOYMENT FREQUENCY ==>
  deploymentFrequency: DORAMetricValue;
  // <== LEAD TIME FOR CHANGES ==>
  leadTimeForChanges: DORAMetricValue;
  // <== CHANGE FAILURE RATE ==>
  changeFailureRate: DORAMetricValue;
  // <== MEAN TIME TO RECOVERY ==>
  meanTimeToRecovery: DORAMetricValue;
  // <== OVERALL RATING ==>
  overallRating: "elite" | "high" | "medium" | "low";
  // <== LAST UPDATED ==>
  lastUpdated: string;
  // <== MESSAGE (OPTIONAL) ==>
  message?: string;
};
// <== DEPLOYMENT TYPE ==>
export type Deployment = {
  // <== ID ==>
  id: number;
  // <== REPOSITORY ==>
  repository: string;
  // <== ENVIRONMENT ==>
  environment: string;
  // <== STATUS ==>
  status: string;
  // <== CREATOR ==>
  creator: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== SHA ==>
  sha: string;
};
// <== WORKFLOW RUN TYPE ==>
export type WorkflowRun = {
  // <== ID ==>
  id: number;
  // <== REPOSITORY ==>
  repository: string;
  // <== WORKFLOW NAME ==>
  workflowName: string;
  // <== STATUS ==>
  status: string;
  // <== CONCLUSION ==>
  conclusion: string | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== DURATION ==>
  duration: number;
};
// <== WORKFLOW SUMMARY TYPE ==>
export type WorkflowSummary = {
  // <== TOTAL ==>
  total: number;
  // <== SUCCESS ==>
  success: number;
  // <== FAILURE ==>
  failure: number;
  // <== PENDING ==>
  pending: number;
  // <== CANCELLED ==>
  cancelled: number;
  // <== SUCCESS RATE ==>
  successRate: number;
  // <== RUNS ==>
  runs: WorkflowRun[];
};

// <== DORA METRICS HOOK ==>
export const useDORAMetrics = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["doraMetrics", workspaceId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // FETCH DATA
      const response = await apiClient.get(
        `/workspaces/analytics/${workspaceId}/dora`
      );
      // RETURN DATA
      return response.data.data as DORAMetrics;
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (5 MINUTES)
    staleTime: 5 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    metrics: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== DEPLOYMENT HISTORY HOOK ==>
export const useDeploymentHistory = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["deploymentHistory", workspaceId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN EMPTY ARRAY
      if (!workspaceId) return [];
      // FETCH DATA
      const response = await apiClient.get(
        `/workspaces/analytics/${workspaceId}/deployments`
      );
      // RETURN DATA
      return response.data.data as Deployment[];
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    deployments: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== WORKFLOW RUNS SUMMARY HOOK ==>
export const useWorkflowRunsSummary = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["workflowSummary", workspaceId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN DEFAULT
      if (!workspaceId) return null;
      // FETCH DATA
      const response = await apiClient.get(
        `/workspaces/analytics/${workspaceId}/workflows`
      );
      // RETURN DATA
      return response.data.data as WorkflowSummary;
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    summary: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
