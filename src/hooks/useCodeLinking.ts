// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== LINKED COMMIT TYPE ==>
export type LinkedCommit = {
  // <== SHA ==>
  sha: string;
  // <== MESSAGE ==>
  message: string;
  // <== URL ==>
  url: string;
  // <== AUTHOR ==>
  author: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    // <== USERNAME ==>
    username?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== REPOSITORY ==>
  repository: {
    // <== OWNER ==>
    owner: string;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
  };
  // <== COMMITTED AT ==>
  committedAt: string;
  // <== LINKED AT ==>
  linkedAt: string;
};
// <== LINKED PULL REQUEST TYPE ==>
export type LinkedPullRequest = {
  // <== NUMBER ==>
  number: number;
  // <== TITLE ==>
  title: string;
  // <== URL ==>
  url: string;
  // <== STATE ==>
  state: "open" | "closed" | "merged";
  // <== AUTHOR ==>
  author: {
    // <== USERNAME ==>
    username?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== REPOSITORY ==>
  repository: {
    // <== OWNER ==>
    owner: string;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
  };
  // <== CREATED AT ==>
  createdAt: string;
  // <== MERGED AT ==>
  mergedAt: string | null;
  // <== LINKED AT ==>
  linkedAt: string;
};
// <== LINKED FILE TYPE ==>
export type LinkedFile = {
  // <== PATH ==>
  path: string;
  // <== REPOSITORY ==>
  repository: {
    // <== OWNER ==>
    owner: string;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
  };
  // <== URL ==>
  url?: string;
  // <== LINKED AT ==>
  linkedAt: string;
};
// <== LINKED BRANCH TYPE ==>
export type LinkedBranch = {
  // <== NAME ==>
  name: string;
  // <== REPOSITORY ==>
  repository: {
    // <== OWNER ==>
    owner: string;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
  };
  // <== URL ==>
  url?: string;
  // <== LINKED AT ==>
  linkedAt: string;
};
// <== LINKED CODE TYPE ==>
export type LinkedCode = {
  // <== COMMITS ==>
  commits: LinkedCommit[];
  // <== PULL REQUESTS ==>
  pullRequests: LinkedPullRequest[];
  // <== FILES ==>
  files: LinkedFile[];
  // <== BRANCHES ==>
  branches: LinkedBranch[];
};
// <== TASK WITH LINKED CODE TYPE ==>
export type TaskWithLinkedCode = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== TASK KEY ==>
  taskKey?: string;
  // <== STATUS ==>
  status: "to do" | "in progress" | "completed";
  // <== PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== LINKED CODE ==>
  linkedCode?: LinkedCode;
  // <== ASSIGNEE ID ==>
  assigneeId?: {
    // <== ID ==>
    _id: string;
    // <== NAME ==>
    name: string;
    // <== PROFILE PIC ==>
    profilePic?: string;
  };
  // <== CREATED AT ==>
  createdAt: string;
};
// <== TASK IMPACT ANALYSIS TYPE ==>
export type TaskImpactAnalysis = {
  // <== RISK LEVEL ==>
  riskLevel: "low" | "medium" | "high";
  // <== ESTIMATED FILES ==>
  estimatedFiles: string[];
  // <== DEPENDENCIES ==>
  dependencies: string[];
  // <== TESTING RECOMMENDATIONS ==>
  testingRecommendations: string[];
  // <== IMPLEMENTATION TIPS ==>
  implementationTips: string[];
};
// <== SCAN RESULT TYPE ==>
export type ScanResult = {
  // <== SCANNED COUNT ==>
  scannedCount: number;
  // <== LINKED COUNT ==>
  linkedCount: number;
  // <== FOUND REFERENCES ==>
  foundReferences: number;
};

// <== USE LINKED CODE HOOK ==>
export const useLinkedCode = (taskId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["linkedCode", taskId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO TASK ID, RETURN NULL
      if (!taskId) return null;
      // FETCH DATA
      const response = await apiClient.get(`/code-linking/tasks/${taskId}`);
      // RETURN DATA
      return response.data.data as {
        taskKey: string;
        linkedCode: LinkedCode;
      };
    },
    // ENABLED
    enabled: !!taskId && isAuthenticated,
    // STALE TIME (5 MINUTES)
    staleTime: 5 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    taskKey: data?.taskKey || null,
    linkedCode: data?.linkedCode || {
      commits: [],
      pullRequests: [],
      files: [],
      branches: [],
    },
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE WORKSPACE TASKS WITH CODE HOOK ==>
export const useWorkspaceTasksWithCode = (
  workspaceId: string | null,
  options: { hasCode?: boolean; page?: number; limit?: number } = {}
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // GET OPTIONS
  const { hasCode = false, page = 1, limit = 20 } = options;
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["workspaceTasksWithCode", workspaceId, hasCode, page, limit],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // FETCH DATA
      const response = await apiClient.get(
        `/code-linking/${workspaceId}/tasks`,
        { params: { hasCode, page, limit } }
      );
      // RETURN DATA
      return response.data.data as {
        tasks: TaskWithLinkedCode[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
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
    tasks: data?.tasks || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE SCAN COMMITS MUTATION ==>
export const useScanCommits = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      workspaceId,
      owner,
      repo,
      branch = "main",
      since,
    }: {
      workspaceId: string;
      owner: string;
      repo: string;
      branch?: string;
      since?: string;
    }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/${workspaceId}/scan`,
        { owner, repo, branch, since }
      );
      // RETURN DATA
      return response.data.data as ScanResult;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["workspaceTasksWithCode", variables.workspaceId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE LINK COMMIT MUTATION ==>
export const useLinkCommit = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      taskId,
      owner,
      repo,
      sha,
    }: {
      taskId: string;
      owner: string;
      repo: string;
      sha: string;
    }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/tasks/${taskId}/commits`,
        { owner, repo, sha }
      );
      // RETURN DATA
      return response.data.data as LinkedCommit;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["linkedCode", variables.taskId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE LINK PULL REQUEST MUTATION ==>
export const useLinkPullRequest = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      taskId,
      owner,
      repo,
      number,
    }: {
      taskId: string;
      owner: string;
      repo: string;
      number: number;
    }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/tasks/${taskId}/pull-requests`,
        { owner, repo, number }
      );
      // RETURN DATA
      return response.data.data as LinkedPullRequest;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["linkedCode", variables.taskId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE LINK FILE MUTATION ==>
export const useLinkFile = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      taskId,
      owner,
      repo,
      path,
      branch = "main",
    }: {
      taskId: string;
      owner: string;
      repo: string;
      path: string;
      branch?: string;
    }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/tasks/${taskId}/files`,
        { owner, repo, path, branch }
      );
      // RETURN DATA
      return response.data.data as LinkedFile;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["linkedCode", variables.taskId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE LINK BRANCH MUTATION ==>
export const useLinkBranch = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      taskId,
      owner,
      repo,
      name,
    }: {
      taskId: string;
      owner: string;
      repo: string;
      name: string;
    }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/tasks/${taskId}/branches`,
        { owner, repo, name }
      );
      // RETURN DATA
      return response.data.data as LinkedBranch;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["linkedCode", variables.taskId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE UNLINK CODE MUTATION ==>
export const useUnlinkCode = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({
      taskId,
      type,
      identifier,
    }: {
      taskId: string;
      type: "commits" | "pullRequests" | "files" | "branches";
      identifier: string;
    }) => {
      // SEND REQUEST
      const response = await apiClient.delete(
        `/code-linking/tasks/${taskId}/${type}/${identifier}`
      );
      // RETURN DATA
      return response.data;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELATED QUERIES
      queryClient.invalidateQueries({
        queryKey: ["linkedCode", variables.taskId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE TASK IMPACT ANALYSIS MUTATION ==>
export const useTaskImpactAnalysis = () => {
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({ taskId }: { taskId: string }) => {
      // SEND REQUEST
      const response = await apiClient.post(
        `/code-linking/tasks/${taskId}/analyze-impact`
      );
      // RETURN DATA
      return response.data.data as {
        taskKey: string;
        analysis: TaskImpactAnalysis;
      };
    },
  });
  // RETURN MUTATION
  return mutation;
};
