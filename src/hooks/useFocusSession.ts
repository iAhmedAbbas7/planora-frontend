// <== IMPORTS ==>
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== BREAK TYPE ==>
export type FocusBreak = {
  // <== STARTED AT ==>
  startedAt: string;
  // <== ENDED AT ==>
  endedAt: string | null;
  // <== DURATION ==>
  duration: number;
};
// <== POMODORO SETTINGS TYPE ==>
export type PomodoroSettings = {
  // <== WORK DURATION ==>
  workDuration: number;
  // <== BREAK DURATION ==>
  breakDuration: number;
  // <== LONG BREAK DURATION ==>
  longBreakDuration: number;
  // <== SESSIONS BEFORE LONG BREAK ==>
  sessionsBeforeLongBreak: number;
};
// <== FOCUS SESSION TASK TYPE ==>
export type FocusSessionTask = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== TASK KEY ==>
  taskKey: string;
  // <== STATUS ==>
  status: string;
  // <== PRIORITY ==>
  priority: string;
};
// <== FOCUS SESSION TYPE ==>
export type FocusSession = {
  // <== ID ==>
  _id: string;
  // <== USER ID ==>
  userId: string;
  // <== TASK ID ==>
  taskId: FocusSessionTask | string | null;
  // <== TITLE ==>
  title: string | null;
  // <== STARTED AT ==>
  startedAt: string;
  // <== ENDED AT ==>
  endedAt: string | null;
  // <== DURATION ==>
  duration: number;
  // <== PLANNED DURATION ==>
  plannedDuration: number;
  // <== STATUS ==>
  status: "active" | "paused" | "completed" | "abandoned";
  // <== BREAKS ==>
  breaks: FocusBreak[];
  // <== NOTES ==>
  notes: string | null;
  // <== IS POMODORO MODE ==>
  isPomodoroMode: boolean;
  // <== POMODORO SETTINGS ==>
  pomodoroSettings: PomodoroSettings;
  // <== CURRENT POMODORO ==>
  currentPomodoro: number;
  // <== POMODOROS COMPLETED ==>
  pomodorosCompleted: number;
  // <== IS ON BREAK ==>
  isOnBreak: boolean;
  // <== PAUSED AT ==>
  pausedAt: string | null;
  // <== TOTAL PAUSE DURATION ==>
  totalPauseDuration: number;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== VIRTUAL FIELDS ==>
  elapsedMinutes?: number;
  // <== IS ACTIVE ==>
  isActive?: boolean;
  // <== PROGRESS PERCENT ==>
  progressPercent?: number;
};
// <== FOCUS STATS SUMMARY TYPE ==>
export type FocusStatsSummary = {
  // <== TOTAL SESSIONS ==>
  totalSessions: number;
  // <== COMPLETED SESSIONS ==>
  completedSessions: number;
  // <== ABANDONED SESSIONS ==>
  abandonedSessions: number;
  // <== TOTAL DURATION ==>
  totalDuration: number;
  // <== AVG DURATION ==>
  avgDuration: number;
  // <== TOTAL POMODOROS ==>
  totalPomodoros: number;
  // <== LONGEST SESSION ==>
  longestSession: number;
  // <== COMPLETION RATE ==>
  completionRate: number;
};
// <== DAILY BREAKDOWN TYPE ==>
export type DailyBreakdown = {
  // <== DATE ==>
  date: string;
  // <== SESSIONS ==>
  sessions: number;
  // <== DURATION ==>
  duration: number;
};
// <== BEST FOCUS HOUR TYPE ==>
export type BestFocusHour = {
  // <== HOUR ==>
  hour: number;
  // <== SESSIONS ==>
  sessions: number;
  // <== TOTAL MINUTES ==>
  totalMinutes: number;
};
// <== FOCUS STATS TYPE ==>
export type FocusStats = {
  // <== SUMMARY ==>
  summary: FocusStatsSummary;
  // <== DAILY BREAKDOWN ==>
  dailyBreakdown: DailyBreakdown[];
  // <== BEST FOCUS HOURS ==>
  bestFocusHours: BestFocusHour[];
};
// <== SESSION HISTORY RESPONSE TYPE ==>
export type SessionHistoryResponse = {
  // <== COUNT ==>
  count: number;
  // <== TOTAL ==>
  total: number;
  // <== PAGE ==>
  page: number;
  // <== TOTAL PAGES ==>
  totalPages: number;
  // <== DATA ==>
  data: FocusSession[];
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
// <== START SESSION PARAMS ==>
type StartSessionParams = {
  // <== TASK ID ==>
  taskId?: string;
  // <== TITLE ==>
  title?: string;
  // <== PLANNED DURATION ==>
  plannedDuration?: number;
  // <== IS POMODORO MODE ==>
  isPomodoroMode?: boolean;
  // <== POMODORO SETTINGS ==>
  pomodoroSettings?: Partial<PomodoroSettings>;
};

// <== FETCH ACTIVE SESSION ==>
const fetchActiveSession = async (): Promise<FocusSession | null> => {
  // FETCHING ACTIVE SESSION
  const response = await apiClient.get<ApiResponse<FocusSession | null>>(
    "/focus/active"
  );
  // RETURNING ACTIVE SESSION
  return response.data.data;
};

// <== FETCH SESSION HISTORY ==>
const fetchSessionHistory = async (params?: {
  limit?: number;
  page?: number;
  status?: string;
  taskId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<SessionHistoryResponse> => {
  // CREATING QUERY PARAMS
  const queryParams = new URLSearchParams();
  // IF LIMIT PROVIDED, ADDING TO QUERY PARAMS
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  // IF PAGE PROVIDED, ADDING TO QUERY PARAMS
  if (params?.page) queryParams.append("page", params.page.toString());
  // IF STATUS PROVIDED, ADDING TO QUERY PARAMS
  if (params?.status) queryParams.append("status", params.status);
  // IF TASK ID PROVIDED, ADDING TO QUERY PARAMS
  if (params?.taskId) queryParams.append("taskId", params.taskId);
  // IF START DATE PROVIDED, ADDING TO QUERY PARAMS
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  // IF END DATE PROVIDED, ADDING TO QUERY PARAMS
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  // FETCHING SESSION HISTORY
  const response = await apiClient.get<ApiResponse<SessionHistoryResponse>>(
    `/focus/history?${queryParams.toString()}`
  );
  // RETURNING SESSION HISTORY RESPONSE
  return response.data.data;
};

// <== FETCH FOCUS STATS ==>
const fetchFocusStats = async (
  period?: "week" | "month" | "year"
): Promise<FocusStats> => {
  // GET USER'S TIMEZONE
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // BUILD QUERY PARAMS
  const params = new URLSearchParams();
  // IF PERIOD PROVIDED, ADDING TO QUERY PARAMS
  if (period) params.append("period", period);
  // ADDING TIMEZONE TO QUERY PARAMS
  params.append("timezone", timezone);
  // FETCHING FOCUS STATS
  const response = await apiClient.get<ApiResponse<FocusStats>>(
    `/focus/stats?${params.toString()}`
  );
  // RETURNING FOCUS STATS
  return response.data.data;
};

// <== USE ACTIVE SESSION HOOK ==>
export const useActiveSession = () => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURNING ACTIVE SESSION HOOK
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["focusSession", "active"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchActiveSession,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 10 * 1000,
    // <== REFETCH INTERVAL ==>
    refetchInterval: 30 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
  });
};

// <== USE SESSION HISTORY HOOK ==>
export const useSessionHistory = (params?: {
  limit?: number;
  page?: number;
  status?: string;
  taskId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // CREATE STABLE QUERY KEY (ONLY INCLUDE DEFINED VALUES)
  const queryKey = [
    "focusSession",
    "history",
    params?.limit,
    params?.page,
    params?.status || null,
    params?.taskId || null,
    params?.startDate || null,
    params?.endDate || null,
  ];
  // RETURNING SESSION HISTORY HOOK
  return useQuery({
    // <== QUERY KEY ==> (STABLE ARRAY OF PRIMITIVES)
    queryKey,
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchSessionHistory(params),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 60 * 1000,
    // <== KEEP PREVIOUS DATA WHILE FETCHING NEW DATA ==>
    placeholderData: (previousData) => previousData,
  });
};

// <== USE FOCUS STATS HOOK ==>
export const useFocusStats = (period?: "week" | "month" | "year") => {
  // GETTING AUTH STATE FROM AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURNING FOCUS STATS HOOK
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["focusSession", "stats", period],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchFocusStats(period),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
  });
};

// <== USE START SESSION MUTATION ==>
export const useStartSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING START SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (params: StartSessionParams): Promise<FocusSession> => {
      // FETCHING START SESSION
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        "/focus/start",
        params
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success("Focus session started!");
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
      // SET ACTIVE SESSION DATA
      queryClient.setQueryData(["focusSession", "active"], data);
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to start session");
    },
  });
};

// <== USE PAUSE SESSION MUTATION ==>
export const usePauseSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING PAUSE SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (sessionId: string): Promise<FocusSession> => {
      // FETCHING PAUSE SESSION
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/pause`
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Session paused");
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to pause session");
    },
  });
};

// <== USE RESUME SESSION MUTATION ==>
export const useResumeSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING RESUME SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (sessionId: string): Promise<FocusSession> => {
      // FETCHING RESUME SESSION
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/resume`
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Session resumed");
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to resume session");
    },
  });
};

// <== USE END SESSION MUTATION ==>
export const useEndSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING END SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      sessionId,
      notes,
      completed,
    }: {
      sessionId: string;
      notes?: string;
      completed?: boolean;
    }): Promise<FocusSession> => {
      // FETCHING END SESSION
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/end`,
        { notes, completed }
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      const status = data.status === "completed" ? "completed" : "ended";
      // CALCULATING DURATION STRING
      const durationStr = formatFocusDuration(data.duration);
      // SHOW SUCCESS TOAST
      toast.success(`Session ${status}! Duration: ${durationStr}`);
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
      // INVALIDATE SESSION HISTORY QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "history"] });
      // INVALIDATE FOCUS STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "stats"] });
      // SET ACTIVE SESSION DATA TO NULL
      queryClient.setQueryData(["focusSession", "active"], null);
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to end session");
    },
  });
};

// <== USE COMPLETE POMODORO MUTATION ==>
export const useCompletePomodoro = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING COMPLETE POMODORO MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      sessionId,
      startBreak,
    }: {
      sessionId: string;
      startBreak?: boolean;
    }): Promise<FocusSession> => {
      // FETCHING COMPLETE POMODORO
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/pomodoro/complete`,
        { startBreak }
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // SHOW SUCCESS TOAST
      toast.success(`Pomodoro ${data.pomodorosCompleted} completed! 🍅`);
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
    },
    // ON ERROR
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to complete pomodoro");
    },
  });
};

// <== USE END POMODORO BREAK MUTATION ==>
export const useEndPomodoroBreak = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING END POMODORO BREAK MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (sessionId: string): Promise<FocusSession> => {
      // FETCHING END POMODORO BREAK
      const response = await apiClient.post<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/pomodoro/end-break`
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Break over! Back to focus 💪");
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to end break");
    },
  });
};

// <== USE UPDATE SESSION NOTES MUTATION ==>
export const useUpdateSessionNotes = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING UPDATE SESSION NOTES MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async ({
      sessionId,
      notes,
    }: {
      sessionId: string;
      notes: string;
    }): Promise<FocusSession> => {
      // FETCHING UPDATE SESSION NOTES
      const response = await apiClient.put<ApiResponse<FocusSession>>(
        `/focus/${sessionId}/notes`,
        { notes }
      );
      // RETURNING FOCUS SESSION
      return response.data.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Notes updated");
      // INVALIDATE ACTIVE SESSION QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "active"] });
      // INVALIDATE SESSION HISTORY QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "history"] });
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // SHOW ERROR TOAST
      const err = error as { response?: { data?: { message?: string } } };
      // GET ERROR MESSAGE
      toast.error(err.response?.data?.message || "Failed to update notes");
    },
  });
};

// <== USE DELETE SESSION MUTATION ==>
export const useDeleteSession = () => {
  // GETTING QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURNING DELETE SESSION MUTATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (sessionId: string): Promise<void> => {
      // FETCHING DELETE SESSION
      await apiClient.delete(`/focus/${sessionId}`);
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // SHOW SUCCESS TOAST
      toast.success("Session deleted");
      // INVALIDATE SESSION HISTORY QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "history"] });
      // INVALIDATE FOCUS STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["focusSession", "stats"] });
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

// <== UTILITY: FORMAT FOCUS DURATION ==>
export const formatFocusDuration = (minutes: number): string => {
  // IF MINUTES LESS THAN 1, RETURN "< 1m"
  if (minutes < 1) return "< 1m";
  // CALCULATING HOURS
  const hours = Math.floor(minutes / 60);
  // CALCULATING MINUTES
  const mins = Math.round(minutes % 60);
  // IF HOURS IS 0, RETURN MINUTES
  if (hours === 0) return `${mins}m`;
  // IF MINUTES IS 0, RETURN HOURS
  if (mins === 0) return `${hours}h`;
  // RETURN HOURS AND MINUTES
  return `${hours}h ${mins}m`;
};

// <== UTILITY: GET ELAPSED SECONDS ==>
export const getElapsedSeconds = (
  startedAt: string,
  pausedAt?: string | null,
  totalPauseDuration?: number
): number => {
  // GETTING START TIME
  const start = new Date(startedAt).getTime();
  // GETTING END TIME (NOW OR PAUSED AT)
  const end = pausedAt ? new Date(pausedAt).getTime() : Date.now();
  // CALCULATING ELAPSED TIME
  const elapsed = (end - start) / 1000;
  // SUBTRACTING PAUSE DURATION
  const pauseDurationSeconds = (totalPauseDuration || 0) * 60;
  // RETURN ELAPSED SECONDS
  return Math.max(0, elapsed - pauseDurationSeconds);
};

// <== UTILITY: FORMAT TIMER DISPLAY ==>
export const formatTimerDisplay = (seconds: number): string => {
  // CALCULATING HOURS
  const hours = Math.floor(seconds / 3600);
  // CALCULATING MINUTES
  const minutes = Math.floor((seconds % 3600) / 60);
  // CALCULATING SECONDS
  const secs = Math.floor(seconds % 60);
  // IF HOURS IS GREATER THAN 0, RETURN HOURS AND MINUTES AND SECONDS
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  // RETURN MINUTES AND SECONDS
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// <== UTILITY: GET REMAINING SECONDS ==>
export const getRemainingSeconds = (
  startedAt: string,
  plannedDuration: number,
  pausedAt?: string | null,
  totalPauseDuration?: number
): number => {
  // GETTING ELAPSED SECONDS
  const elapsed = getElapsedSeconds(startedAt, pausedAt, totalPauseDuration);
  // CALCULATING REMAINING SECONDS
  const remaining = plannedDuration * 60 - elapsed;
  // RETURN REMAINING SECONDS
  return Math.max(0, remaining);
};

// <== UTILITY: GET PROGRESS PERCENT ==>
export const getProgressPercent = (
  startedAt: string,
  plannedDuration: number,
  pausedAt?: string | null,
  totalPauseDuration?: number
): number => {
  // IF NO PLANNED DURATION, RETURN 0
  if (!plannedDuration) return 0;
  // GETTING ELAPSED SECONDS
  const elapsed = getElapsedSeconds(startedAt, pausedAt, totalPauseDuration);
  // CALCULATING PERCENT
  const percent = (elapsed / (plannedDuration * 60)) * 100;
  // RETURN PERCENT (CAPPED AT 100)
  return Math.min(100, Math.round(percent));
};
