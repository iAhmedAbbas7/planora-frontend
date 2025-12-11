// <== IMPORTS ==>
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== TIME SESSION TYPE ==>
export type TimeSession = {
  // <== ID ==>
  _id?: string;
  // <== STARTED AT ==>
  startedAt: string;
  // <== ENDED AT ==>
  endedAt?: string | null;
  // <== DURATION ==>
  duration: number;
  // <== NOTE ==>
  note?: string;
};
// <== TIME TRACKING TYPE ==>
export type TimeTracking = {
  // <== ESTIMATED ==>
  estimated: number | null;
  // <== LOGGED ==>
  logged: number;
  // <== SESSIONS ==>
  sessions: TimeSession[];
  // <== ACTIVE SESSION ==>
  activeSession: {
    // <== STARTED AT ==>
    startedAt: string | null;
    // <== NOTE ==>
    note: string;
  } | null;
};
// <== ACTIVE TIMER TYPE ==>
export type ActiveTimer = {
  // <== TASK ID ==>
  taskId: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== TITLE ==>
  title: string;
  // <== PROJECT ==>
  project: {
    // <== ID ==>
    _id: string;
    // <== TITLE ==>
    title: string;
  } | null;
  // <== STARTED AT ==>
  startedAt: string;
  // <== NOTE ==>
  note: string;
} | null;
// <== TASK TIME TRACKING TYPE ==>
export type TaskTimeTracking = {
  // <== TASK ID ==>
  taskId: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== TITLE ==>
  title: string;
  // <== TIME TRACKING ==>
  timeTracking: TimeTracking;
};
// <== TIME REPORT PROJECT TYPE ==>
export type TimeReportProject = {
  // <== ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  projectTitle: string;
  // <== TOTAL LOGGED ==>
  totalLogged: number;
  // <== TOTAL ESTIMATED ==>
  totalEstimated: number;
  // <== TASK COUNT ==>
  taskCount: number;
  // <== TASKS ==>
  tasks: {
    // <== TASK ID ==>
    taskId: string;
    // <== TASK KEY ==>
    taskKey: string;
    // <== TITLE ==>
    title: string;
    // <== STATUS ==>
    status: string;
    // <== LOGGED ==>
    logged: number;
    // <== ESTIMATED ==>
    estimated: number | null;
    // <== SESSION COUNT ==>
    sessionCount: number;
  }[];
};
// <== TIME REPORT TYPE ==>
export type TimeReport = {
  // <== PROJECTS ==>
  projects: TimeReportProject[];
  // <== TOTALS ==>
  totals: {
    // <== TOTAL LOGGED ==>
    totalLogged: number;
    // <== TOTAL ESTIMATED ==>
    totalEstimated: number;
    // <== TASK COUNT ==>
    taskCount: number;
    // <== PROJECT COUNT ==>
    projectCount: number;
  };
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message?: string;
  // <== DATA ==>
  data: T;
};
// <== START TIMER RESPONSE TYPE ==>
type StartTimerResponse = {
  // <== TASK ID ==>
  taskId: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== TITLE ==>
  title: string;
  // <== STARTED AT ==>
  startedAt: string;
};
// <== STOP TIMER RESPONSE TYPE ==>
type StopTimerResponse = {
  // <== TASK ID ==>
  taskId: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== TITLE ==>
  title: string;
  // <== SESSION ==>
  session: TimeSession;
  // <== TOTAL LOGGED ==>
  totalLogged: number;
};
// <== LOG TIME RESPONSE TYPE ==>
type LogTimeResponse = {
  // <== TASK ID ==>
  taskId: string;
  // <== SESSION ==>
  session: TimeSession;
  // <== TOTAL LOGGED ==>
  totalLogged: number;
};

// <== FETCH ACTIVE TIMER ==>
const fetchActiveTimer = async (): Promise<ActiveTimer> => {
  // FETCHING ACTIVE TIMER
  const response = await apiClient.get<ApiResponse<ActiveTimer>>(
    "/time-tracking/active"
  );
  // RETURNING ACTIVE TIMER
  return response.data.data;
};

// <== FETCH TASK TIME TRACKING ==>
const fetchTaskTimeTracking = async (
  taskId: string
): Promise<TaskTimeTracking> => {
  // FETCHING TASK TIME TRACKING
  const response = await apiClient.get<ApiResponse<TaskTimeTracking>>(
    `/time-tracking/task/${taskId}`
  );
  // RETURNING TASK TIME TRACKING
  return response.data.data;
};

// <== FETCH TIME REPORT ==>
const fetchTimeReport = async (params?: {
  projectId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TimeReport> => {
  // CREATING QUERY PARAMS
  const queryParams = new URLSearchParams();
  // IF PROJECT ID PROVIDED, ADDING TO QUERY PARAMS
  if (params?.projectId) queryParams.append("projectId", params.projectId);
  // IF START DATE PROVIDED, ADDING TO QUERY PARAMS
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  // IF END DATE PROVIDED, ADDING TO QUERY PARAMS
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  // FETCHING TIME REPORT
  const response = await apiClient.get<ApiResponse<TimeReport>>(
    `/time-tracking/report?${queryParams.toString()}`
  );
  // RETURNING TIME REPORT
  return response.data.data;
};

// <== USE ACTIVE TIMER HOOK ==>
export const useActiveTimer = () => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURNING ACTIVE TIMER HOOK
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["activeTimer"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchActiveTimer,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 30 * 1000,
    // <== REFETCH INTERVAL ==>
    refetchInterval: 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
  });
};

// <== USE TASK TIME TRACKING HOOK ==>
export const useTaskTimeTracking = (taskId: string | undefined) => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURNING TASK TIME TRACKING HOOK
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["taskTimeTracking", taskId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchTaskTimeTracking(taskId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!taskId,
    // <== STALE TIME ==>
    staleTime: 30 * 1000,
  });
};

// <== USE TIME REPORT HOOK ==>
export const useTimeReport = (params?: {
  projectId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURNING TIME REPORT HOOK
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["timeReport", params],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchTimeReport(params),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
  });
};

// <== USE START TIMER MUTATION ==>
export const useStartTimer = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING START TIMER MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      taskId,
      note,
    }: {
      taskId: string;
      note?: string;
    }): Promise<StartTimerResponse> => {
      // FETCHING START TIMER
      const response = await apiClient.post<ApiResponse<StartTimerResponse>>(
        "/time-tracking/start",
        { taskId, note }
      );
      // RETURNING START TIMER RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(`Timer started for "${data.title}"`);
      // INVALIDATE ACTIVE TIMER QUERY
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to start timer");
    },
  });
};

// <== USE STOP TIMER MUTATION ==>
export const useStopTimer = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING STOP TIMER MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      taskId,
      note,
    }: {
      taskId: string;
      note?: string;
    }): Promise<StopTimerResponse> => {
      // FETCHING STOP TIMER
      const response = await apiClient.post<ApiResponse<StopTimerResponse>>(
        "/time-tracking/stop",
        { taskId, note }
      );
      // RETURNING STOP TIMER RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // CALCULATING TIME STR
      const minutes = data.session.duration;
      // CALCULATING HOURS
      const hours = Math.floor(minutes / 60);
      // CALCULATING MINUTES
      const mins = minutes % 60;
      // CREATING TIME STRING
      const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      // SHOW SUCCESS TOAST
      toast.success(`Timer stopped. Logged ${timeStr}`);
      // INVALIDATE ACTIVE TIMER QUERY
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
      // INVALIDATE TIME REPORT QUERY
      queryClient.invalidateQueries({ queryKey: ["timeReport"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to stop timer");
    },
  });
};

// <== USE DISCARD TIMER MUTATION ==>
export const useDiscardTimer = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING DISCARD TIMER MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (taskId: string): Promise<void> => {
      // FETCHING DISCARD TIMER
      await apiClient.post("/time-tracking/discard", { taskId });
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Timer discarded");
      // INVALIDATE ACTIVE TIMER QUERY
      queryClient.invalidateQueries({ queryKey: ["activeTimer"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to discard timer");
    },
  });
};

// <== USE LOG MANUAL TIME MUTATION ==>
export const useLogManualTime = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING LOG MANUAL TIME MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      taskId,
      duration,
      date,
      note,
    }: {
      taskId: string;
      duration: number;
      date?: string;
      note?: string;
    }): Promise<LogTimeResponse> => {
      // FETCHING LOG MANUAL TIME
      const response = await apiClient.post<ApiResponse<LogTimeResponse>>(
        "/time-tracking/log",
        { taskId, duration, date, note }
      );
      // RETURNING LOG MANUAL TIME RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success("Time logged successfully");
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
      // INVALIDATE TIME REPORT QUERY
      queryClient.invalidateQueries({ queryKey: ["timeReport"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to log time");
    },
  });
};

// <== USE UPDATE TIME ESTIMATE MUTATION ==>
export const useUpdateTimeEstimate = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING UPDATE TIME ESTIMATE MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      taskId,
      estimated,
    }: {
      taskId: string;
      estimated: number | null;
    }): Promise<{ taskId: string; estimated: number | null }> => {
      // FETCHING UPDATE TIME ESTIMATE
      const response = await apiClient.put<
        ApiResponse<{ taskId: string; estimated: number | null }>
      >(`/time-tracking/estimate/${taskId}`, { estimated });
      // RETURNING UPDATE TIME ESTIMATE RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success("Time estimate updated");
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to update estimate");
    },
  });
};

// <== USE DELETE TIME SESSION MUTATION ==>
export const useDeleteTimeSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING DELETE TIME SESSION MUTATION
  return useMutation({
    mutationFn: async ({
      taskId,
      sessionId,
    }: {
      taskId: string;
      sessionId: string;
    }): Promise<{ taskId: string; totalLogged: number }> => {
      // FETCHING DELETE TIME SESSION
      const response = await apiClient.delete<
        ApiResponse<{ taskId: string; totalLogged: number }>
      >(`/time-tracking/session/${taskId}/${sessionId}`);
      // RETURNING DELETE TIME SESSION RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success("Time session deleted");
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
      // INVALIDATE TIME REPORT QUERY
      queryClient.invalidateQueries({ queryKey: ["timeReport"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to delete session");
    },
  });
};

// <== USE UPDATE TIME SESSION MUTATION ==>
export const useUpdateTimeSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING UPDATE TIME SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      taskId,
      sessionId,
      updates,
    }: {
      taskId: string;
      sessionId: string;
      updates: {
        duration?: number;
        note?: string;
        startedAt?: string;
        endedAt?: string;
      };
    }): Promise<{
      taskId: string;
      session: TimeSession;
      totalLogged: number;
    }> => {
      // FETCHING UPDATE TIME SESSION
      const response = await apiClient.put<
        ApiResponse<{
          taskId: string;
          session: TimeSession;
          totalLogged: number;
        }>
      >(`/time-tracking/session/${taskId}/${sessionId}`, updates);
      // RETURNING UPDATE TIME SESSION RESPONSE
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success("Time session updated");
      // INVALIDATE TASK TIME TRACKING QUERY
      queryClient.invalidateQueries({
        queryKey: ["taskTimeTracking", data.taskId],
      });
      // INVALIDATE TIME REPORT QUERY
      queryClient.invalidateQueries({ queryKey: ["timeReport"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to update session");
    },
  });
};

// <== UTILITY FUNCTION: FORMAT DURATION ==>
export const formatDuration = (minutes: number): string => {
  // IF MINUTES LESS THAN 1, RETURN "< 1m"
  if (minutes < 1) return "< 1m";
  // CALCULATING HOURS
  const hours = Math.floor(minutes / 60);
  // CALCULATING MINUTES
  const mins = minutes % 60;
  // IF HOURS IS 0, RETURN MINUTES
  if (hours === 0) return `${mins}m`;
  // IF MINUTES IS 0, RETURN HOURS
  if (mins === 0) return `${hours}h`;
  // RETURN HOURS AND MINUTES
  return `${hours}h ${mins}m`;
};

// <== UTILITY FUNCTION: FORMAT ELAPSED TIME ==>
export const formatElapsedTime = (startedAt: string): string => {
  // GETTING START TIME
  const start = new Date(startedAt).getTime();
  // GETTING NOW TIME
  const now = Date.now();
  // CALCULATING ELAPSED TIME
  const elapsed = Math.floor((now - start) / 1000);
  // CALCULATING HOURS
  const hours = Math.floor(elapsed / 3600);
  // CALCULATING MINUTES
  const minutes = Math.floor((elapsed % 3600) / 60);
  // CALCULATING SECONDS
  const seconds = elapsed % 60;
  // IF HOURS IS GREATER THAN 0, RETURN HOURS AND MINUTES AND SECONDS
  if (hours > 0) {
    // RETURN HOURS AND MINUTES AND SECONDS
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  // RETURN MINUTES AND SECONDS
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
