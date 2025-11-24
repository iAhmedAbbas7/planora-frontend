// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== TRASH TASK TYPE INTERFACE ==>
export type TrashTask = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DELETED ON ==>
  deletedOn: string | Date | null;
  // <== ORIGINAL STATUS ==>
  originalStatus?: string | null;
  // <== STATUS ==>
  status: string;
};
// <== TRASH PROJECT TYPE INTERFACE ==>
export type TrashProject = {
  // <== ID ==>
  _id: string;
  // <== TITLE ==>
  title: string;
  // <== DELETED ON ==>
  deletedOn: string | Date | null;
  // <== STATUS ==>
  status: string;
};
// <== TRASH DATA TYPE INTERFACE ==>
export type TrashData = {
  // <== PROJECTS ==>
  projects: TrashProject[];
  // <== TASKS ==>
  tasks: TrashTask[];
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
// <== BULK RESTORE RESPONSE TYPE ==>
type BulkRestoreResponse = {
  // <== RESTORED PROJECTS ==>
  restoredProjects: unknown[];
  // <== RESTORED TASKS ==>
  restoredTasks: unknown[];
  // <== ERRORS ==>
  errors: string[];
};
// <== BULK DELETE RESPONSE TYPE ==>
type BulkDeleteResponse = {
  // <== DELETED PROJECTS ==>
  deletedProjects: unknown[];
  // <== DELETED TASKS ==>
  deletedTasks: unknown[];
  // <== ERRORS ==>
  errors: string[];
};
// <== EMPTY TRASH RESPONSE TYPE ==>
type EmptyTrashResponse = {
  // <== DELETED PROJECTS COUNT ==>
  deletedProjects: number;
  // <== DELETED TASKS COUNT ==>
  deletedTasks: number;
};
// <== BULK RESTORE REQUEST TYPE ==>
type BulkRestoreRequest = {
  // <== PROJECT IDS ==>
  projectIds?: string[];
  // <== TASK IDS ==>
  taskIds?: string[];
};
// <== BULK DELETE REQUEST TYPE ==>
type BulkDeleteRequest = {
  // <== PROJECT IDS ==>
  projectIds?: string[];
  // <== TASK IDS ==>
  taskIds?: string[];
};

/**
 * FETCH TRASHED ITEMS
 * @returns Trash Data
 */
const fetchTrashedItems = async (): Promise<TrashData> => {
  try {
    const response = await apiClient.get<ApiResponse<TrashData>>("/trash");
    // RETURN DEFAULT DATA IF NO DATA
    if (!response.data?.data) {
      return {
        projects: [],
        tasks: [],
      };
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // IF 404 OR ANY ERROR, RETURN DEFAULT DATA
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT DATA
    if (axiosError.response?.status === 404) {
      return {
        projects: [],
        tasks: [],
      };
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * USE TRASH DATA HOOK
 * @returns Trash Data Query and Mutations
 */
export const useTrash = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // FETCH TRASH DATA
  const trashQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["trash"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchTrashedItems,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 1 * 60 * 1000,
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
  // BULK RESTORE MUTATION
  const bulkRestoreMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (data: BulkRestoreRequest) => {
      const response = await apiClient.post<ApiResponse<BulkRestoreResponse>>(
        "/trash/bulk-restore",
        data
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TRASH QUERY
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      // INVALIDATE PROJECTS QUERY
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  // BULK DELETE MUTATION
  const bulkDeleteMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (data: BulkDeleteRequest) => {
      const response = await apiClient.post<ApiResponse<BulkDeleteResponse>>(
        "/trash/bulk-delete",
        data
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TRASH QUERY
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });
  // EMPTY TRASH MUTATION
  const emptyTrashMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<EmptyTrashResponse>>(
        "/trash/empty"
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE TRASH QUERY
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });
  // RETURN QUERIES AND MUTATIONS
  return {
    // TRASH DATA
    trashData: trashQuery.data || { projects: [], tasks: [] },
    // TRASH TASKS
    trashTasks: trashQuery.data?.tasks || [],
    // TRASH PROJECTS
    trashProjects: trashQuery.data?.projects || [],
    // TRASH LOADING
    isLoading: trashQuery.isLoading,
    // TRASH ERROR
    isError: trashQuery.isError,
    // TRASH ERROR OBJECT
    trashError: trashQuery.error,
    // REFETCH TRASH
    refetchTrash: trashQuery.refetch,
    // BULK RESTORE MUTATION
    bulkRestore: bulkRestoreMutation.mutate,
    // BULK RESTORE LOADING
    isRestoring: bulkRestoreMutation.isPending,
    // BULK RESTORE ERROR
    restoreError: bulkRestoreMutation.error,
    // BULK DELETE MUTATION
    bulkDelete: bulkDeleteMutation.mutate,
    // BULK DELETE LOADING
    isDeleting: bulkDeleteMutation.isPending,
    // BULK DELETE ERROR
    deleteError: bulkDeleteMutation.error,
    // EMPTY TRASH MUTATION
    emptyTrash: emptyTrashMutation.mutate,
    // EMPTY TRASH LOADING
    isEmptying: emptyTrashMutation.isPending,
    // EMPTY TRASH ERROR
    emptyError: emptyTrashMutation.error,
  };
};
