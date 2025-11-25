// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== NOTIFICATION SETTINGS TYPE ==>
export type NotificationSettings = {
  // <== ID ==>
  _id?: string;
  // <== USER ID ==>
  userId?: string;
  // <== TASK REMINDERS ==>
  taskReminders: boolean;
  // <== DUE DATE ALERTS ==>
  dueDateAlerts: boolean;
  // <== EMAIL UPDATES ==>
  emailUpdates: boolean;
  // <== CREATED AT ==>
  createdAt?: string;
  // <== UPDATED AT ==>
  updatedAt?: string;
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
};
// <== UPDATE NOTIFICATION SETTINGS PARAMS TYPE ==>
type UpdateNotificationSettingsParams = {
  // <== TASK REMINDERS ==>
  taskReminders?: boolean;
  // <== DUE DATE ALERTS ==>
  dueDateAlerts?: boolean;
  // <== EMAIL UPDATES ==>
  emailUpdates?: boolean;
};

// <== FETCH NOTIFICATION SETTINGS FUNCTION ==>
const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiClient.get<ApiResponse<NotificationSettings>>(
    "/notifications/preferences"
  );
  // RETURN NOTIFICATION SETTINGS
  return response.data.data;
};

// <== UPDATE NOTIFICATION SETTINGS FUNCTION ==>
const updateNotificationSettings = async (
  params: UpdateNotificationSettingsParams
): Promise<NotificationSettings> => {
  const response = await apiClient.put<ApiResponse<NotificationSettings>>(
    "/notifications/preferences",
    params
  );
  // RETURN NOTIFICATION SETTINGS
  return response.data.data;
};

// <== USE NOTIFICATION SETTINGS HOOK ==>
export const useNotificationSettings = () => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // FETCH NOTIFICATION SETTINGS QUERY
  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch: refetchSettings,
  } = useQuery<NotificationSettings, AxiosError<{ message?: string }>>({
    queryKey: ["notificationSettings"],
    queryFn: fetchNotificationSettings,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated,
  });
  // UPDATE NOTIFICATION SETTINGS MUTATION
  const updateSettingsMutation = useMutation<
    NotificationSettings,
    AxiosError<{ message?: string }>,
    UpdateNotificationSettingsParams
  >({
    mutationFn: updateNotificationSettings,
    onSuccess: (data) => {
      // UPDATE QUERY CACHE
      queryClient.setQueryData(["notificationSettings"], data);
      // REFETCH SETTINGS
      refetchSettings();
    },
  });
  // RETURN HOOK VALUES
  return {
    settings,
    isLoading,
    isError,
    error,
    refetchSettings,
    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdating: updateSettingsMutation.isPending,
    updateError: updateSettingsMutation.error,
  };
};
