// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== TASK STATS TYPE INTERFACE ==>
export type TaskStats = {
  // <== TOTAL COUNT ==>
  totalCount: number;
  // <== COMPLETED COUNT ==>
  completedCount: number;
  // <== IN PROGRESS COUNT ==>
  inProgressCount: number;
  // <== PENDING COUNT ==>
  pendingCount: number;
  // <== DUE TODAY COUNT ==>
  dueTodayCount: number;
};
// <== TASK TYPE INTERFACE ==>
export type Task = {
  // <== TASK ID ==>
  _id: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK DESCRIPTION ==>
  description?: string;
  // <== TASK PRIORITY ==>
  priority?: string;
  // <== TASK DUE DATE ==>
  dueDate?: number | string;
  // <== TASK STATUS ==>
  status: "to do" | "in progress" | "completed";
  // <== TASK PROJECT ID ==>
  projectId?: string;
  // <== TASK IS TRASHED ==>
  isTrashed?: boolean;
  // <== TASK USER ID ==>
  userId?: string;
  // <== TASK CREATED AT ==>
  createdAt?: string;
  // <== TASK UPDATED AT ==>
  updatedAt?: string;
  // <== TASK COMPLETED AT ==>
  completedAt?: Date;
};
// <== API RESPONSE TYPE INTERFACE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
};
// <== CREATE TASK REQUEST TYPE ==>
type CreateTaskRequest = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== STATUS ==>
  status?: string;
  // <== PRIORITY ==>
  priority?: string;
  // <== DUE DATE ==>
  dueDate?: string | null;
  // <== PROJECT ID ==>
  projectId: string;
};

/**
 * FETCH TASK STATISTICS
 * @returns Task Statistics
 */
const fetchTaskStats = async (): Promise<TaskStats> => {
  try {
    const response = await apiClient.get<ApiResponse<TaskStats>>(
      "/tasks/stats"
    );
    // RETURN DEFAULT STATS IF NO DATA
    if (!response.data?.data) {
      return {
        totalCount: 0,
        completedCount: 0,
        inProgressCount: 0,
        pendingCount: 0,
        dueTodayCount: 0,
      };
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // DON'T RETURN IF 404 OR ANY ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      return {
        totalCount: 0,
        completedCount: 0,
        inProgressCount: 0,
        pendingCount: 0,
        dueTodayCount: 0,
      };
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * FETCH ALL TASKS
 * @returns Tasks Array
 */
const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // RETURN ALL TASKS (FILTER OUT TRASHED)
    return response.data.data.filter((task) => !task.isTrashed);
  } catch (error: unknown) {
    // DON'T RETURN IF 404 OR ANY ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * CREATE TASK
 * @param taskData - Task Data
 * @returns Created Task
 */
const createTaskAPI = async (taskData: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<ApiResponse<Task>>("/tasks", taskData);
  if (!response.data?.data) {
    throw new Error("Failed to create task");
  }
  return response.data.data;
};

/**
 * USE TASKS DATA HOOK
 * @returns Tasks Data Query
 */
export const useTasks = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH TASKS DATA
  const tasksQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["tasks"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchTasks,
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
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: false,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      // DON'T RETRY ON 404 ERRORS (NO DATA)
      const axiosError = error as AxiosError;
      // DON'T RETRY ON 404
      if (axiosError?.response?.status === 404) {
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES (MAX RETRIES)
      return failureCount < 3;
    },
    // DON'T THROW ON 404 - TREAT AS SUCCESS WITH EMPTY DATA (NO DATA)
    throwOnError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T THROW ON 404
      return axiosError?.response?.status !== 404;
    },
  });
  // FETCH TASK STATS
  const statsQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["taskStats"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchTaskStats,
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
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: false,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T RETRY ON 404
      if (axiosError?.response?.status === 404) {
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES (MAX RETRIES)
      return failureCount < 3;
    },
    // DON'T THROW ON 404
    throwOnError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T THROW ON 404
      return axiosError?.response?.status !== 404;
    },
  });
  // RETURN QUERIES
  return {
    // TASKS QUERY
    tasks: tasksQuery.data || [],
    // TASKS LOADING
    isLoadingTasks: tasksQuery.isLoading,
    // TASKS ERROR
    isErrorTasks: tasksQuery.isError,
    // TASKS ERROR OBJECT
    tasksError: tasksQuery.error,
    // TASK STATS
    taskStats: statsQuery.data,
    // TASK STATS LOADING
    isLoadingStats: statsQuery.isLoading,
    // TASK STATS ERROR
    isErrorStats: statsQuery.isError,
    // TASK STATS ERROR OBJECT
    statsError: statsQuery.error,
    // OVERALL LOADING
    isLoading: tasksQuery.isLoading || statsQuery.isLoading,
    // OVERALL ERROR
    isError: tasksQuery.isError || statsQuery.isError,
    // REFETCH TASKS
    refetchTasks: tasksQuery.refetch,
    // REFETCH STATS
    refetchStats: statsQuery.refetch,
  };
};

/**
 * FETCH TASKS BY PROJECT ID
 * @param projectId - Project ID
 * @returns Tasks Array
 */
const fetchTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  try {
    // FETCH TASKS BY PROJECT ID
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/project/${projectId}`
    );
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // RETURN ALL TASKS (FILTER OUT TRASHED)
    return response.data.data.filter((task) => !task.isTrashed);
  } catch (error: unknown) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * USE CREATE TASK HOOK
 * @returns Create Task Mutation
 */
export const useCreateTask = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE TASK MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createTaskAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASK STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Task created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create task. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

/**
 * USE TASKS BY PROJECT ID HOOK
 * @param projectId - Project ID
 * @returns Tasks Query
 */
export const useTasksByProjectId = (projectId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH TASKS BY PROJECT ID
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["tasks", "project", projectId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchTasksByProjectId(projectId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!projectId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: false,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T RETRY ON 404
      if (axiosError?.response?.status === 404) {
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES (MAX RETRIES)
      return failureCount < 3;
    },
    // <== THROW ON ERROR ==>
    throwOnError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T THROW ON 404
      return axiosError?.response?.status !== 404;
    },
  });
};
