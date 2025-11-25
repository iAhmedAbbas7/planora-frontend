// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== APPEARANCE TYPE INTERFACE ==>
export type Appearance = {
  // <== THEME ==>
  theme: "light" | "dark" | "system";
  // <== ACCENT COLOR ==>
  accentColor: "violet" | "pink" | "blue" | "green";
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
// <== UPDATE APPEARANCE PARAMS TYPE INTERFACE ==>
type UpdateAppearanceParams = {
  // <== THEME ==>
  theme?: "light" | "dark" | "system";
  // <== ACCENT COLOR ==>
  accentColor?: "violet" | "pink" | "blue" | "green";
};

// <== FETCH APPEARANCE FUNCTION ==>
const fetchAppearance = async (): Promise<Appearance> => {
  // FETCHING APPEARANCE
  const response = await apiClient.get<ApiResponse<Appearance>>(
    "/settings/appearance"
  );
  // RETURNING APPEARANCE DATA
  return response.data.data;
};

// <== UPDATE APPEARANCE FUNCTION ==>
const updateAppearance = async (
  params: UpdateAppearanceParams
): Promise<Appearance> => {
  // UPDATING APPEARANCE
  const response = await apiClient.put<ApiResponse<Appearance>>(
    "/settings/appearance",
    params
  );
  // RETURNING UPDATED APPEARANCE DATA
  return response.data.data;
};

// <== USE APPEARANCE HOOK ==>
export const useAppearance = (enabled: boolean = true) => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // FETCH APPEARANCE QUERY
  const {
    data: appearance,
    isLoading,
    isError,
    error,
    refetch: refetchAppearance,
  } = useQuery<Appearance, AxiosError<{ message?: string }>>({
    queryKey: ["appearance"],
    queryFn: fetchAppearance,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    // ENABLE QUERY ONLY IF ENABLED (FOR AUTHENTICATED USERS)
    enabled,
  });
  // UPDATE APPEARANCE MUTATION
  const updateAppearanceMutation = useMutation<
    Appearance,
    AxiosError<{ message?: string }>,
    UpdateAppearanceParams
  >({
    mutationFn: updateAppearance,
    onSuccess: (data) => {
      // UPDATE APPEARANCE QUERY DATA
      queryClient.setQueryData(["appearance"], data);
      // REFETCH APPEARANCE
      refetchAppearance();
    },
  });
  // RETURNING APPEARANCE HOOK DATA
  return {
    appearance,
    isLoading,
    isError,
    error,
    refetchAppearance,
    updateAppearance: updateAppearanceMutation.mutateAsync,
    isUpdating: updateAppearanceMutation.isPending,
    updateError: updateAppearanceMutation.error,
  };
};
