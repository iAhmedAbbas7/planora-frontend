// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
// <== PROJECT TYPE INTERFACE ==>
export type Project = {
  // <== PROJECT ID ==>
  _id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT DESCRIPTION ==>
  description?: string;
  // <== PROJECT STATUS ==>
  status?: string;
  // <== PROJECT DUE DATE ==>
  dueDate?: string;
  // <== PROJECT IN CHARGE NAME ==>
  inChargeName?: string;
  // <== PROJECT IS TRASHED ==>
  isTrashed?: boolean;
  // <== PROJECT ROLE ==>
  role?: string;
  // <== PROJECT COMPLETED TASKS ==>
  completedTasks?: number;
  // <== PROJECT TOTAL TASKS ==>
  totalTasks?: number;
  // <== PROJECT PROGRESS ==>
  progress?: number;
  // <== PROJECT USER ID ==>
  userId?: string;
  // <== PROJECT CREATED AT ==>
  createdAt?: string;
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
// <== CREATE PROJECT REQUEST TYPE ==>
type CreateProjectRequest = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== PRIORITY ==>
  priority?: string;
  // <== IN CHARGE NAME ==>
  inChargeName: string;
  // <== ROLE ==>
  role: string;
  // <== STATUS ==>
  status?: string;
  // <== DUE DATE ==>
  dueDate?: string | null;
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
  } catch (error: unknown) {
    // IF 404 OR ANY ERROR, RETURN DEFAULT STATS
    const axiosError = error as AxiosError;
    // DON'T RETURN ON 404
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
 * FETCH ALL PROJECTS
 * @returns Projects Array
 */
const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects");
    // DON'T RETURN IF NO DATA OR NOT AN ARRAY
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // RETURN ALL PROJECTS WITH FILTERED TRASHED
    return response.data.data.filter((project) => !project.isTrashed);
  } catch (error: unknown) {
    // DON'T RETURN IF 404 OR ANY ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN ON 404
    if (axiosError.response?.status === 404) {
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * CREATE PROJECT
 * @param projectData - Project Data
 * @returns Created Project
 */
const createProjectAPI = async (
  projectData: CreateProjectRequest
): Promise<Project> => {
  // CREATE PROJECT
  const response = await apiClient.post<ApiResponse<Project>>(
    "/projects",
    projectData
  );
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to create project");
  }
  // RETURN CREATED PROJECT
  return response.data.data;
};

/**
 * FETCH SINGLE PROJECT BY ID
 * @param projectId - Project ID
 * @returns Project
 */
const fetchProjectById = async (projectId: string): Promise<Project> => {
  try {
    // FETCH PROJECT BY ID
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${projectId}`
    );
    // CHECK IF DATA EXISTS
    if (!response.data?.data) {
      throw new Error("Project not found");
    }
    // RETURN PROJECT
    return response.data.data;
  } catch (error: unknown) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError;
    // DON'T RETURN IF 404
    if (axiosError.response?.status === 404) {
      throw new Error("Project not found");
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * UPDATE PROJECT
 * @param projectId - Project ID
 * @param projectData - Project Data to Update
 * @returns Updated Project
 */
const updateProjectAPI = async (
  projectId: string,
  projectData: Partial<CreateProjectRequest>
): Promise<Project> => {
  // UPDATE PROJECT
  const response = await apiClient.put<ApiResponse<Project>>(
    `/projects/${projectId}`,
    projectData
  );
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to update project");
  }
  // RETURN UPDATED PROJECT
  return response.data.data;
};

/**
 * DELETE PROJECT
 * @param projectId - Project ID
 * @returns void
 */
const deleteProjectAPI = async (projectId: string): Promise<void> => {
  // DELETE PROJECT
  const response = await apiClient.delete<ApiResponse<void>>(
    `/projects/${projectId}`
  );
  // CHECK IF SUCCESS
  if (!response.data?.success) {
    // THROW ERROR
    throw new Error("Failed to delete project");
  }
  // RETURN VOID
  return;
};

/**
 * USE PROJECTS DATA HOOK
 * @returns Projects Data Query
 */
export const useProjects = (): {
  // PROJECTS QUERY
  projects: Project[];
  // PROJECTS LOADING
  isLoadingProjects: boolean;
  // PROJECTS ERROR
  isErrorProjects: boolean;
  // PROJECTS ERROR OBJECT
  projectsError: unknown;
  // PROJECT STATS
  projectStats: ProjectStats | undefined;
  // PROJECT STATS LOADING
  isLoadingStats: boolean;
  // PROJECT STATS ERROR
  isErrorStats: boolean;
  // PROJECT STATS ERROR OBJECT
  statsError: unknown;
  // OVERALL LOADING
  isLoading: boolean;
  // OVERALL ERROR
  isError: boolean;
  // REFETCH PROJECTS
  refetchProjects: () => Promise<unknown>;
  // REFETCH STATS
  refetchStats: () => Promise<unknown>;
} => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH PROJECTS DATA
  const projectsQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["projects"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchProjects,
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
      // RETRY OTHER ERRORS UP TO 3 TIMES
      return failureCount < 3;
    },
    // DON'T THROW ON 404 - TREAT AS SUCCESS WITH EMPTY DATA
    throwOnError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T THROW ON 404
      return axiosError?.response?.status !== 404;
    },
  });
  // FETCH PROJECT STATS
  const statsQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["projectStats"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchProjectStats,
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
    // PROJECTS QUERY
    projects: projectsQuery.data || [],
    // PROJECTS LOADING
    isLoadingProjects: projectsQuery.isLoading,
    // PROJECTS ERROR
    isErrorProjects: projectsQuery.isError,
    // PROJECTS ERROR OBJECT
    projectsError: projectsQuery.error,
    // PROJECT STATS
    projectStats: statsQuery.data,
    // PROJECT STATS LOADING
    isLoadingStats: statsQuery.isLoading,
    // PROJECT STATS ERROR
    isErrorStats: statsQuery.isError,
    // PROJECT STATS ERROR OBJECT
    statsError: statsQuery.error,
    // OVERALL LOADING
    isLoading: projectsQuery.isLoading || statsQuery.isLoading,
    // OVERALL ERROR
    isError: projectsQuery.isError || statsQuery.isError,
    // REFETCH PROJECTS
    refetchProjects: projectsQuery.refetch,
    // REFETCH STATS
    refetchStats: statsQuery.refetch,
  };
};

/**
 * USE CREATE PROJECT HOOK
 * @returns Create Project Mutation
 */
export const useCreateProject = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE PROJECT MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createProjectAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE PROJECTS QUERY
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // INVALIDATE PROJECT STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["projectStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Project created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create project. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

/**
 * USE PROJECT BY ID HOOK
 * @param projectId - Project ID
 * @returns Project Query
 */
export const useProjectById = (projectId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH PROJECT BY ID
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["project", projectId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchProjectById(projectId!),
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

/**
 * USE UPDATE PROJECT HOOK
 * @returns Update Project Mutation
 */
export const useUpdateProject = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE PROJECT MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: ({
      projectId,
      projectData,
    }: {
      projectId: string;
      projectData: Partial<CreateProjectRequest>;
    }) => updateProjectAPI(projectId, projectData),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE PROJECTS QUERY
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // INVALIDATE PROJECT STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["projectStats"] });
      // INVALIDATE SPECIFIC PROJECT QUERY
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Project updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update project. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

/**
 * USE DELETE PROJECT HOOK
 * @returns Delete Project Mutation
 */
export const useDeleteProject = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE PROJECT MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: deleteProjectAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE PROJECTS QUERY
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // INVALIDATE PROJECT STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["projectStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Project deleted successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to delete project. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
