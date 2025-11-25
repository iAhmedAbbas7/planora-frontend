// <== IMPORTS ==>
import { useEffect } from "react";
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useDashboardStore } from "../store/useDashboardStore";

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
// <== PROJECT STATS TYPE INTERFACE ==>
export type ProjectStats = {
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
// <== MONTHLY SUMMARY TYPE INTERFACE ==>
export type MonthlySummary = {
  // <== MONTH ==>
  month: string;
  // <== COMPLETED COUNT ==>
  completed: number;
};
// <== WEEKLY SUMMARY TYPE INTERFACE ==>
export type WeeklySummary = {
  // <== COMPLETED PROJECTS ==>
  completedProjects: number;
  // <== TARGET PROJECTS ==>
  targetProjects: number;
};
// <== PROJECT TYPE INTERFACE ==>
export type Project = {
  // <== PROJECT ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT DUE DATE ==>
  dueDate?: string;
  // <== PROJECT IS TRASHED ==>
  isTrashed?: boolean;
  // <== PROJECT USER ID ==>
  userId?: string;
  // <== PROJECT CREATED AT ==>
  createdAt?: string;
};
// <== TASK TYPE INTERFACE ==>
export type Task = {
  // <== TASK ID ==>
  _id: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== TASK DUE DATE ==>
  dueDate: string;
  // <== TASK STATUS ==>
  status: "to do" | "in progress" | "completed";
};
// <== DASHBOARD DATA TYPE INTERFACE ==>
export type DashboardData = {
  // <== TASK STATS ==>
  taskStats: TaskStats;
  // <== PROJECT STATS ==>
  projectStats: ProjectStats;
  // <== MONTHLY SUMMARY ==>
  monthlySummary: MonthlySummary[];
  // <== WEEKLY SUMMARY ==>
  weeklySummary: WeeklySummary;
  // <== RECENT PROJECTS ==>
  recentProjects: Project[];
  // <== RECENT TASKS ==>
  recentTasks: Task[];
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
  } catch {
    // IF 404 OR ANY ERROR, RETURN DEFAULT STATS
    return {
      totalCount: 0,
      completedCount: 0,
      inProgressCount: 0,
      pendingCount: 0,
      dueTodayCount: 0,
    };
  }
};

/**
 * FETCH PROJECT STATISTICS
 * @returns Project Statistics
 */
const fetchProjectStats = async (): Promise<ProjectStats> => {
  try {
    const response = await apiClient.get<ApiResponse<ProjectStats>>(
      "/projects/stats"
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
  } catch {
    // IF 404 OR ANY ERROR, RETURN DEFAULT STATS
    return {
      totalCount: 0,
      completedCount: 0,
      inProgressCount: 0,
      pendingCount: 0,
      dueTodayCount: 0,
    };
  }
};

/**
 * FETCH MONTHLY SUMMARY
 * @returns Monthly Summary
 */
const fetchMonthlySummary = async (): Promise<MonthlySummary[]> => {
  try {
    const response = await apiClient.get<ApiResponse<MonthlySummary[]>>(
      "/tasks/monthly-summary"
    );
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // TRANSFORM MONTH FORMAT FROM "Jan 2024" TO "Jan"
    return response.data.data.map((item) => ({
      ...item,
      month: item.month?.split(" ")[0] || item.month,
    }));
  } catch (error: unknown) {
    // IF 404 OR NO DATA, RETURN EMPTY ARRAY
    const axiosError = error as AxiosError;
    // IF 404, RETURN EMPTY ARRAY
    if (axiosError.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * FETCH WEEKLY SUMMARY
 * @returns Weekly Summary
 */
const fetchWeeklySummary = async (): Promise<WeeklySummary> => {
  try {
    const response = await apiClient.get<ApiResponse<WeeklySummary>>(
      "/projects/weekly-summary"
    );
    // RETURN DEFAULT SUMMARY IF NO DATA
    if (!response.data?.data) {
      return {
        completedProjects: 0,
        targetProjects: 0,
      };
    }
    return response.data.data;
  } catch {
    // IF 404 OR ANY ERROR, RETURN DEFAULT SUMMARY
    return {
      completedProjects: 0,
      targetProjects: 0,
    };
  }
};

/**
 * FETCH RECENT PROJECTS
 * @returns Recent Projects
 */
const fetchRecentProjects = async (): Promise<Project[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects");
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // GET FIRST 5 PROJECTS (SORTED BY CREATED AT DESCENDING)
    const allProjects = response.data.data;
    // SORT BY CREATED AT AND TAKE FIRST 5
    return allProjects
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  } catch {
    // IF ERROR, RETURN EMPTY ARRAY (BACKEND NOW RETURNS 200 WITH EMPTY ARRAY, BUT HANDLE OTHER ERRORS)
    return [];
  }
};

/**
 * FETCH RECENT TASKS
 * @returns Recent Tasks
 */
const fetchRecentTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks/recent", {
      params: {
        limit: 10,
      },
    });
    // CHECK IF DATA EXISTS
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    return response.data.data;
  } catch (error: unknown) {
    // IF 404 OR NO DATA, RETURN EMPTY ARRAY
    const axiosError = error as AxiosError;
    // IF 404, RETURN EMPTY ARRAY
    if (axiosError.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * FETCH ALL DASHBOARD DATA
 * @returns Dashboard Data
 */
const fetchDashboardData = async (): Promise<DashboardData> => {
  // FETCH ALL DATA IN PARALLEL WITH ERROR HANDLING
  const results = await Promise.allSettled([
    fetchTaskStats(),
    fetchProjectStats(),
    fetchMonthlySummary(),
    fetchWeeklySummary(),
    fetchRecentProjects(),
    fetchRecentTasks(),
  ]);
  // EXTRACT RESULTS WITH FALLBACK VALUES
  const taskStats =
    results[0].status === "fulfilled"
      ? results[0].value
      : {
          totalCount: 0,
          completedCount: 0,
          inProgressCount: 0,
          pendingCount: 0,
          dueTodayCount: 0,
        };
  // EXTRACT PROJECT STATS WITH FALLBACK VALUES
  const projectStats =
    results[1].status === "fulfilled"
      ? results[1].value
      : {
          totalCount: 0,
          completedCount: 0,
          inProgressCount: 0,
          pendingCount: 0,
          dueTodayCount: 0,
        };
  // EXTRACT MONTHLY SUMMARY WITH FALLBACK VALUES
  const monthlySummary =
    results[2].status === "fulfilled" ? results[2].value : [];
  // EXTRACT WEEKLY SUMMARY WITH FALLBACK VALUES
  const weeklySummary =
    results[3].status === "fulfilled"
      ? results[3].value
      : {
          completedProjects: 0,
          targetProjects: 0,
        };
  // EXTRACT RECENT PROJECTS WITH FALLBACK VALUES
  const recentProjects =
    results[4].status === "fulfilled" ? results[4].value : [];
  // EXTRACT RECENT TASKS WITH FALLBACK VALUES
  const recentTasks = results[5].status === "fulfilled" ? results[5].value : [];
  // RETURN DASHBOARD DATA
  return {
    taskStats,
    projectStats,
    monthlySummary,
    weeklySummary,
    recentProjects,
    recentTasks,
  };
};

/**
 * USE DASHBOARD DATA HOOK
 * @returns Dashboard Data Query
 */
export const useDashboard = () => {
  // GET SETTER FROM STORE
  const setDashboardData = useDashboardStore((state) => state.setDashboardData);
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH DASHBOARD DATA
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["dashboard"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchDashboardData,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 10 * 60 * 1000,
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
      // DON'T RETRY ON 404 ERRORS
      if (axiosError?.response?.status === 404) {
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES (MAX RETRIES)
      return failureCount < 3;
    },
    // DON'T THROW ON 404 - TREAT AS SUCCESS WITH EMPTY DATA
    throwOnError: (error: unknown) => {
      // DON'T THROW ON 404 ERRORS
      const axiosError = error as AxiosError;
      // DON'T THROW ON 404 ERRORS
      return axiosError?.response?.status !== 404;
    },
  });

  // UPDATE STORE WHEN DATA IS LOADED
  useEffect(() => {
    // IF DATA EXISTS, UPDATE STORE
    if (query.data) {
      // UPDATE STORE
      setDashboardData(query.data);
    }
  }, [query.data, setDashboardData]);
  // RETURN QUERY
  return query;
};
