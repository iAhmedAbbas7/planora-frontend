// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== DEPENDENCY TYPE ==>
export type DependencyType = "blocks" | "blocked_by" | "relates_to";
// <== TASK DEPENDENCY INTERFACE ==>
export interface TaskDependency {
  // <== DEPENDENCY ID ==>
  _id: string;
  // <== TASK ID ==>
  taskId: string;
  // <== DEPENDENCY TYPE ==>
  type: DependencyType;
  // <== LINKED AT ==>
  linkedAt: string;
}
// <== DEPENDENCY TASK INTERFACE ==>
export interface DependencyTask {
  // <== TASK ID ==>
  _id: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK STATUS ==>
  status: string;
  // <== TASK PRIORITY ==>
  priority: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== DUE DATE ==>
  dueDate?: string;
  // <== LINKED AT ==>
  linkedAt?: string;
  // <== DEPENDENCY ID ==>
  dependencyId?: string;
}
// <== DEPENDENCIES RESPONSE INTERFACE ==>
export interface TaskDependenciesResponse {
  // <== BLOCKERS (TASKS BLOCKING THIS TASK) ==>
  blockers: DependencyTask[];
  // <== BLOCKING (TASKS THIS TASK BLOCKS) ==>
  blocking: DependencyTask[];
  // <== RELATED (RELATED TASKS) ==>
  related: DependencyTask[];
}
// <== SUBTASK INTERFACE ==>
export interface Subtask {
  // <== SUBTASK ID ==>
  _id: string;
  // <== SUBTASK TITLE ==>
  title: string;
  // <== SUBTASK STATUS ==>
  status: string;
  // <== SUBTASK PRIORITY ==>
  priority: string;
  // <== SUBTASK KEY ==>
  taskKey: string;
  // <== DUE DATE ==>
  dueDate?: string;
  // <== CREATED AT ==>
  createdAt?: string;
}
// <== GRAPH NODE INTERFACE ==>
export interface GraphNode {
  // <== NODE ID ==>
  id: string;
  // <== NODE TYPE ==>
  type: string;
  // <== NODE POSITION ==>
  position: { x: number; y: number };
  // <== NODE DATA ==>
  data: {
    // <== LABEL ==>
    label: string;
    // <== TASK KEY ==>
    taskKey: string;
    // <== STATUS ==>
    status: string;
    // <== PRIORITY ==>
    priority: string;
    // <== IS BLOCKED ==>
    isBlocked: boolean;
    // <== HAS SUBTASKS ==>
    hasSubtasks: boolean;
    // <== IS SUBTASK ==>
    isSubtask: boolean;
  };
}
// <== GRAPH EDGE INTERFACE ==>
export interface GraphEdge {
  // <== EDGE ID ==>
  id: string;
  // <== SOURCE NODE ID ==>
  source: string;
  // <== TARGET NODE ID ==>
  target: string;
  // <== EDGE TYPE ==>
  type: string;
  // <== ANIMATED ==>
  animated?: boolean;
  // <== STYLE ==>
  style?: { stroke: string; strokeDasharray?: string };
  // <== LABEL ==>
  label?: string;
  // <== DATA ==>
  data?: { type: string };
}
// <== DEPENDENCY GRAPH RESPONSE INTERFACE ==>
export interface DependencyGraphResponse {
  // <== NODES ==>
  nodes: GraphNode[];
  // <== EDGES ==>
  edges: GraphEdge[];
  // <== TASK COUNT ==>
  taskCount: number;
}
// <== API RESPONSE TYPE INTERFACE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
  // <== COUNT ==>
  count?: number;
};
// <== ADD DEPENDENCY REQUEST TYPE ==>
type AddDependencyRequest = {
  // <== TASK ID ==>
  taskId: string;
  // <== DEPENDENCY TASK ID ==>
  dependencyTaskId: string;
  // <== DEPENDENCY TYPE ==>
  type: DependencyType;
};
// <== ADD SUBTASK REQUEST TYPE ==>
type AddSubtaskRequest = {
  // <== PARENT TASK ID ==>
  parentTaskId: string;
  // <== SUBTASK TITLE ==>
  title: string;
  // <== SUBTASK DESCRIPTION ==>
  description?: string;
  // <== SUBTASK PRIORITY ==>
  priority?: string;
  // <== SUBTASK DUE DATE ==>
  dueDate?: string | null;
  // <== PROJECT ID ==>
  projectId?: string;
};

// <== FETCH TASK DEPENDENCIES FUNCTION ==>
const fetchTaskDependencies = async (
  taskId: string
): Promise<TaskDependenciesResponse> => {
  // TRY TO FETCH TASK DEPENDENCIES
  try {
    // FETCH TASK DEPENDENCIES
    const response = await apiClient.get<ApiResponse<TaskDependenciesResponse>>(
      `/tasks/${taskId}/dependencies`
    );
    // IF NO DATA IS RETURNED, RETURN EMPTY ARRAYS
    if (!response.data?.data) {
      // RETURN EMPTY ARRAYS
      return { blockers: [], blocking: [], related: [] };
    }
    // RETURN TASK DEPENDENCIES
    return response.data.data;
  } catch (error: unknown) {
    // TYPE ERROR AS AXIOS ERROR
    const axiosError = error as AxiosError;
    // IF 404 ERROR, RETURN EMPTY ARRAYS
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY ARRAYS
      return { blockers: [], blocking: [], related: [] };
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== FETCH SUBTASKS FUNCTION ==>
const fetchSubtasks = async (taskId: string): Promise<Subtask[]> => {
  // TRY TO FETCH SUBTASKS
  try {
    // FETCH SUBTASKS
    const response = await apiClient.get<ApiResponse<Subtask[]>>(
      `/tasks/${taskId}/subtasks`
    );
    // IF NO DATA IS RETURNED, RETURN EMPTY ARRAY
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // RETURN SUBTASKS
    return response.data.data;
  } catch (error: unknown) {
    // TYPE ERROR AS AXIOS ERROR
    const axiosError = error as AxiosError;
    // IF 404 ERROR, RETURN EMPTY ARRAY
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== FETCH DEPENDENCY GRAPH FUNCTION ==>
const fetchDependencyGraph = async (
  projectId?: string
): Promise<DependencyGraphResponse> => {
  // TRY TO FETCH DEPENDENCY GRAPH
  try {
    // FETCH DEPENDENCY GRAPH
    const url = projectId
      ? `/tasks/dependency-graph?projectId=${projectId}`
      : `/tasks/dependency-graph`;
    // FETCH DEPENDENCY GRAPH
    const response = await apiClient.get<ApiResponse<DependencyGraphResponse>>(
      url
    );
    // IF NO DATA IS RETURNED, RETURN EMPTY OBJECT
    if (!response.data?.data) {
      // RETURN EMPTY OBJECT
      return { nodes: [], edges: [], taskCount: 0 };
    }
    // RETURN DEPENDENCY GRAPH
    return response.data.data;
  } catch (error: unknown) {
    // TYPE ERROR AS AXIOS ERROR
    const axiosError = error as AxiosError;
    // IF 404 ERROR, RETURN EMPTY OBJECT
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY OBJECT
      return { nodes: [], edges: [], taskCount: 0 };
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== ADD DEPENDENCY API FUNCTION ==>
const addDependencyAPI = async (data: AddDependencyRequest): Promise<void> => {
  // ADD DEPENDENCY
  await apiClient.post(`/tasks/${data.taskId}/dependencies`, {
    dependencyTaskId: data.dependencyTaskId,
    type: data.type,
  });
};

// <== REMOVE DEPENDENCY API FUNCTION ==>
const removeDependencyAPI = async (
  taskId: string,
  dependencyId: string
): Promise<void> => {
  // REMOVE DEPENDENCY
  await apiClient.delete(`/tasks/${taskId}/dependencies/${dependencyId}`);
};

// <== ADD SUBTASK API FUNCTION ==>
const addSubtaskAPI = async (data: AddSubtaskRequest): Promise<Subtask> => {
  // ADD SUBTASK
  const response = await apiClient.post<ApiResponse<Subtask>>(
    `/tasks/${data.parentTaskId}/subtasks`,
    {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      projectId: data.projectId,
    }
  );
  // IF NO DATA IS RETURNED, THROW ERROR
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to create subtask");
  }
  // RETURN SUBTASK
  return response.data.data;
};

// <== REMOVE SUBTASK API FUNCTION ==>
const removeSubtaskAPI = async (
  parentTaskId: string,
  subtaskId: string
): Promise<void> => {
  // REMOVE SUBTASK
  await apiClient.delete(`/tasks/${parentTaskId}/subtasks/${subtaskId}`);
};

// <== USE TASK DEPENDENCIES HOOK ==>
export const useTaskDependencies = (taskId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH TASK DEPENDENCIES
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["taskDependencies", taskId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchTaskDependencies(taskId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!taskId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== USE SUBTASKS HOOK ==>
export const useSubtasks = (taskId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH SUBTASKS
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["subtasks", taskId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchSubtasks(taskId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!taskId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== USE DEPENDENCY GRAPH HOOK ==>
export const useDependencyGraph = (projectId?: string) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH DEPENDENCY GRAPH
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["dependencyGraph", projectId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchDependencyGraph(projectId),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== USE ADD DEPENDENCY HOOK ==>
export const useAddDependency = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ADD DEPENDENCY MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: addDependencyAPI,
    // <== ON SUCCESS ==>
    onSuccess: (_data, variables) => {
      // INVALIDATE TASK DEPENDENCIES QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskDependencies", variables.taskId],
      });
      // INVALIDATE TARGET TASK DEPENDENCIES
      queryClient.invalidateQueries({
        queryKey: ["taskDependencies", variables.dependencyTaskId],
      });
      // INVALIDATE DEPENDENCY GRAPH
      queryClient.invalidateQueries({ queryKey: ["dependencyGraph"] });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // SHOW SUCCESS TOAST
      toast.success("Dependency added successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to add dependency. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE REMOVE DEPENDENCY HOOK ==>
export const useRemoveDependency = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // REMOVE DEPENDENCY MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: ({
      taskId,
      dependencyId,
    }: {
      taskId: string;
      dependencyId: string;
    }) => removeDependencyAPI(taskId, dependencyId),
    // <== ON SUCCESS ==>
    onSuccess: (_data, variables) => {
      // INVALIDATE TASK DEPENDENCIES QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskDependencies", variables.taskId],
      });
      // INVALIDATE DEPENDENCY GRAPH
      queryClient.invalidateQueries({ queryKey: ["dependencyGraph"] });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // SHOW SUCCESS TOAST
      toast.success("Dependency removed successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to remove dependency. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE ADD SUBTASK HOOK ==>
export const useAddSubtask = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ADD SUBTASK MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: addSubtaskAPI,
    // <== ON SUCCESS ==>
    onSuccess: (_data, variables) => {
      // INVALIDATE SUBTASKS QUERY
      queryClient.invalidateQueries({
        queryKey: ["subtasks", variables.parentTaskId],
      });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASK STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      // INVALIDATE DEPENDENCY GRAPH
      queryClient.invalidateQueries({ queryKey: ["dependencyGraph"] });
      // SHOW SUCCESS TOAST
      toast.success("Subtask created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create subtask. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE REMOVE SUBTASK HOOK ==>
export const useRemoveSubtask = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // REMOVE SUBTASK MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: ({
      parentTaskId,
      subtaskId,
    }: {
      parentTaskId: string;
      subtaskId: string;
    }) => removeSubtaskAPI(parentTaskId, subtaskId),
    // <== ON SUCCESS ==>
    onSuccess: (_data, variables) => {
      // INVALIDATE SUBTASKS QUERY
      queryClient.invalidateQueries({
        queryKey: ["subtasks", variables.parentTaskId],
      });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE DEPENDENCY GRAPH
      queryClient.invalidateQueries({ queryKey: ["dependencyGraph"] });
      // SHOW SUCCESS TOAST
      toast.success("Subtask removed successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to remove subtask. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
