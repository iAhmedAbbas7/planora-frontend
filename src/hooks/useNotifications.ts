// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== NOTIFICATION TYPE INTERFACE ==>
export type NotificationType =
  | "project_created"
  | "project_updated"
  | "project_deleted"
  | "task_created"
  | "task_updated"
  | "task_deleted"
  | "task_due_soon";
// <== NOTIFICATION TYPE INTERFACE ==>
export type Notification = {
  // <== ID ==>
  _id: string;
  // <== TYPE ==>
  type: NotificationType;
  // <== TITLE ==>
  title: string;
  // <== MESSAGE ==>
  message: string;
  // <== RELATED ID ==>
  relatedId?: string;
  // <== IS READ ==>
  isRead: boolean;
  // <== CREATED AT ==>
  createdAt: string;
};
// <== NOTIFICATIONS RESPONSE TYPE INTERFACE ==>
type NotificationsResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== COUNT ==>
  count: number;
  // <== TOTAL ==>
  total: number;
  // <== PAGE ==>
  page: number;
  // <== TOTAL PAGES ==>
  totalPages: number;
  // <== DATA ==>
  data: Notification[];
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
// <== UNREAD COUNT RESPONSE TYPE ==>
type UnreadCountResponse = {
  // <== UNREAD COUNT ==>
  unreadCount: number;
};

/**
 * FETCH NOTIFICATIONS
 * @param limit - Limit of notifications to fetch
 * @param page - Page number
 * @param isRead - Filter by read status
 * @returns Notifications Array
 */
const fetchNotifications = async (
  limit: number = 50,
  page: number = 1,
  isRead?: boolean
): Promise<Notification[]> => {
  try {
    // BUILD QUERY PARAMS
    const params = new URLSearchParams();
    // APPEND LIMIT PARAM
    params.append("limit", limit.toString());
    // APPEND PAGE PARAM
    params.append("page", page.toString());
    // APPEND IS READ PARAM
    if (isRead !== undefined) {
      params.append("isRead", isRead.toString());
    }
    // FETCH NOTIFICATIONS
    const response = await apiClient.get<NotificationsResponse>(
      `/notifications?${params.toString()}`
    );
    // RETURN DEFAULT DATA IF NO DATA
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      return [];
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // IF 404 OR ANY ERROR, RETURN DEFAULT DATA
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT DATA
    if (axiosError.response?.status === 404) {
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * FETCH UNREAD COUNT
 * @returns Unread Count
 */
const fetchUnreadCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      "/notifications/unread-count"
    );
    // RETURN DEFAULT COUNT IF NO DATA
    if (!response.data?.data?.unreadCount) {
      return 0;
    }
    // RETURN COUNT
    return response.data.data.unreadCount;
  } catch (error: unknown) {
    // IF 404 OR ANY ERROR, RETURN DEFAULT COUNT
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT COUNT
    if (axiosError.response?.status === 404) {
      return 0;
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

/**
 * USE NOTIFICATIONS DATA HOOK
 * @returns Notifications Data Query and Mutations
 */
export const useNotifications = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // FETCH NOTIFICATIONS DATA
  const notificationsQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["notifications"],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchNotifications(50, 1),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 30 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: true,
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
  // FETCH UNREAD COUNT
  const unreadCountQuery = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["notifications", "unread-count"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchUnreadCount,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 10 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: true,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    // DON'T THROW ON 404
    throwOnError: (error: unknown) => {
      const axiosError = error as AxiosError;
      return axiosError?.response?.status !== 404;
    },
  });
  // MARK AS READ MUTATION
  const markAsReadMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.put<ApiResponse<Notification>>(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // INVALIDATE UNREAD COUNT QUERY
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
  // MARK ALL AS READ MUTATION
  const markAllAsReadMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async () => {
      const response = await apiClient.put<
        ApiResponse<{ modifiedCount: number }>
      >("/notifications/read-all");
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // INVALIDATE UNREAD COUNT QUERY
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
  // DELETE NOTIFICATION MUTATION
  const deleteNotificationMutation = useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/notifications/${notificationId}`
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // INVALIDATE UNREAD COUNT QUERY
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
  // RETURN QUERIES AND MUTATIONS
  return {
    // NOTIFICATIONS DATA
    notifications: notificationsQuery.data || [],
    // NOTIFICATIONS LOADING
    isLoading: notificationsQuery.isLoading,
    // NOTIFICATIONS ERROR
    isError: notificationsQuery.isError,
    // NOTIFICATIONS ERROR OBJECT
    notificationsError: notificationsQuery.error,
    // UNREAD COUNT
    unreadCount: unreadCountQuery.data || 0,
    // UNREAD COUNT LOADING
    isLoadingUnreadCount: unreadCountQuery.isLoading,
    // REFETCH NOTIFICATIONS
    refetchNotifications: notificationsQuery.refetch,
    // MARK AS READ MUTATION
    markAsRead: markAsReadMutation.mutate,
    // MARK AS READ LOADING
    isMarkingAsRead: markAsReadMutation.isPending,
    // MARK ALL AS READ MUTATION
    markAllAsRead: markAllAsReadMutation.mutate,
    // MARK ALL AS READ LOADING
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    // DELETE NOTIFICATION MUTATION
    deleteNotification: deleteNotificationMutation.mutate,
    // DELETE NOTIFICATION LOADING
    isDeleting: deleteNotificationMutation.isPending,
  };
};
