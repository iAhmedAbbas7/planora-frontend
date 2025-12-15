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
// <== TASK DEPENDENCY INTERFACE ==>
export type TaskDependency = {
  // <== DEPENDENCY ID ==>
  _id: string;
  // <== TASK ID ==>
  taskId: string;
  // <== DEPENDENCY TYPE ==>
  type: "blocks" | "blocked_by" | "relates_to";
  // <== LINKED AT ==>
  linkedAt: string;
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
  // <== TASK KEY ==>
  taskKey?: string;
  // <== TASK DEPENDENCIES ==>
  dependencies?: TaskDependency[];
  // <== SUBTASKS ==>
  subtasks?: string[];
  // <== PARENT TASK ID ==>
  parentTask?: string;
  // <== IS BLOCKED (VIRTUAL) ==>
  isBlocked?: boolean;
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
// <== RECURRENCE TYPE INTERFACE ==>
export type TaskRecurrence = {
  // <== IS RECURRING FLAG ==>
  isRecurring: boolean;
  // <== RECURRENCE PATTERN ==>
  pattern: "daily" | "weekly" | "monthly" | "yearly" | "custom" | null;
  // <== INTERVAL ==>
  interval: number;
  // <== DAYS OF WEEK ==>
  daysOfWeek: number[];
  // <== DAY OF MONTH ==>
  dayOfMonth: number | null;
  // <== END DATE ==>
  endDate: string | null;
  // <== SKIP WEEKENDS ==>
  skipWeekends: boolean;
  // <== NEXT OCCURRENCE ==>
  nextOccurrence: string | null;
  // <== LAST GENERATED AT ==>
  lastGeneratedAt: string | null;
  // <== ORIGINAL TASK ID ==>
  originalTaskId: string | null;
  // <== OCCURRENCE COUNT ==>
  occurrenceCount: number;
};
// <== RECURRING TASK TYPE ==>
export type RecurringTask = Task & {
  // <== RECURRENCE ==>
  recurrence?: TaskRecurrence;
};

// <== FETCH TASK STATISTICS FUNCTION ==>
const fetchTaskStats = async (): Promise<TaskStats> => {
  // TRY TO FETCH TASK STATISTICS
  try {
    // FETCH TASK STATISTICS
    const response = await apiClient.get<ApiResponse<TaskStats>>(
      "/tasks/stats"
    );
    // RETURN DEFAULT STATS IF NO DATA
    if (!response.data?.data) {
      // RETURN DEFAULT STATS
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
      // RETURN DEFAULT STATS
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

// <== FETCH ALL TASKS FUNCTION ==>
const fetchTasks = async (): Promise<Task[]> => {
  // TRY TO FETCH ALL TASKS
  try {
    // FETCH ALL TASKS
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // RETURN ALL TASKS (FILTER OUT TRASHED)
    return response.data.data.filter((task) => !task.isTrashed);
  } catch (error: unknown) {
    // DON'T RETURN IF 404 OR ANY ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== CREATE TASK FUNCTION ==>
const createTaskAPI = async (taskData: CreateTaskRequest): Promise<Task> => {
  // CREATE TASK
  const response = await apiClient.post<ApiResponse<Task>>("/tasks", taskData);
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to create task");
  }
  // RETURN CREATED TASK
  return response.data.data;
};

// <== UPDATE TASK FUNCTION ==>
const updateTaskAPI = async (
  taskId: string,
  taskData: Partial<CreateTaskRequest>
): Promise<Task> => {
  // UPDATE TASK
  const response = await apiClient.put<ApiResponse<Task>>(
    `/tasks/${taskId}`,
    taskData
  );
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to update task");
  }
  // RETURN UPDATED TASK
  return response.data.data;
};

// <== DELETE TASK FUNCTION ==>
const deleteTaskAPI = async (taskId: string): Promise<void> => {
  // DELETE TASK
  await apiClient.delete<ApiResponse<void>>(`/tasks/${taskId}`);
};

// <== USE TASKS DATA HOOK ==>
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
        // DON'T RETRY
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
        // DON'T RETRY
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

// <== FETCH TASKS BY PROJECT ID FUNCTION ==>
const fetchTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  // TRY TO FETCH TASKS BY PROJECT ID
  try {
    // FETCH TASKS BY PROJECT ID
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/project/${projectId}`
    );
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // RETURN ALL TASKS (FILTER OUT TRASHED)
    return response.data.data.filter((task) => !task.isTrashed);
  } catch (error: unknown) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== USE CREATE TASK HOOK ==>
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
      // INVALIDATE TASKS BY PROJECT QUERY
      queryClient.invalidateQueries({ queryKey: ["tasksByProject"] });
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

// <== USE UPDATE TASK HOOK ==>
export const useUpdateTask = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE TASK MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: Partial<CreateTaskRequest>;
    }) => updateTaskAPI(taskId, taskData),
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASK STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      // INVALIDATE TASKS BY PROJECT QUERY
      queryClient.invalidateQueries({ queryKey: ["tasksByProject"] });
      // SHOW SUCCESS TOAST
      toast.success("Task updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update task. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE DELETE TASK HOOK ==>
export const useDeleteTask = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE TASK MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: deleteTaskAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASK STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      // INVALIDATE TASKS BY PROJECT QUERY
      queryClient.invalidateQueries({ queryKey: ["tasksByProject"] });
      // SHOW SUCCESS TOAST
      toast.success("Task deleted successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to delete task. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE TASKS BY PROJECT ID HOOK ==>
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
        // DON'T RETRY
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

// <== FETCH RECURRING TASKS FUNCTION ==>
const fetchRecurringTasks = async (): Promise<RecurringTask[]> => {
  // TRY TO FETCH RECURRING TASKS
  try {
    // FETCH RECURRING TASKS
    const response = await apiClient.get<ApiResponse<RecurringTask[]>>(
      "/tasks/recurring"
    );
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // RETURN RECURRING TASKS
    return response.data.data;
  } catch (error: unknown) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError<{ message?: string }>;
    // THROW ERROR
    throw new Error(
      axiosError?.response?.data?.message || "Failed to fetch recurring tasks"
    );
  }
};

// <== USE RECURRING TASKS HOOK ==>
export const useRecurringTasks = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH RECURRING TASKS
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["tasks", "recurring"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchRecurringTasks,
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

// <== GENERATE RECURRING TASK OCCURRENCE FUNCTION ==>
const generateRecurringTaskOccurrence = async (
  taskId: string
): Promise<RecurringTask> => {
  // TRY TO GENERATE RECURRING TASK OCCURRENCE
  const response = await apiClient.post<ApiResponse<RecurringTask>>(
    `/tasks/${taskId}/generate-occurrence`
  );
  // CHECK IF DATA EXISTS
  return response.data.data;
};

// <== USE GENERATE RECURRING TASK MUTATION ==>
export const useGenerateRecurringTask = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: generateRecurringTaskOccurrence,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TASKS QUERIES
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // SHOW SUCCESS TOAST
      toast.success("Recurring task occurrence generated!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to generate recurring task occurrence.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== UPDATE TASK RECURRENCE FUNCTION ==>
const updateTaskRecurrence = async ({
  taskId,
  recurrence,
}: {
  taskId: string;
  recurrence: Partial<TaskRecurrence>;
}): Promise<RecurringTask> => {
  // TRY TO UPDATE TASK RECURRENCE
  const response = await apiClient.put<ApiResponse<RecurringTask>>(
    `/tasks/${taskId}/recurrence`,
    { recurrence }
  );
  // CHECK IF DATA EXISTS
  return response.data.data;
};

// <== USE UPDATE TASK RECURRENCE MUTATION ==>
export const useUpdateTaskRecurrence = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: updateTaskRecurrence,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TASKS QUERIES
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // SHOW SUCCESS TOAST
      toast.success("Task recurrence updated!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update task recurrence.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FETCH TASK OCCURRENCES FUNCTION ==>
const fetchTaskOccurrences = async (
  taskId: string
): Promise<RecurringTask[]> => {
  // TRY TO FETCH TASK OCCURRENCES
  const response = await apiClient.get<ApiResponse<RecurringTask[]>>(
    `/tasks/${taskId}/occurrences`
  );
  // CHECK IF DATA EXISTS
  return response.data.data;
};

// <== USE TASK OCCURRENCES HOOK ==>
export const useTaskOccurrences = (taskId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH TASK OCCURRENCES
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["tasks", "occurrences", taskId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchTaskOccurrences(taskId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!taskId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
  });
};
