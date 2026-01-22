// <== IMPORTS ==>
import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import { toast } from "../lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// <== API ERROR RESPONSE TYPE ==>
type ApiErrorResponse = {
  // <== CODE ==>
  code?: string;
  // <== MESSAGE ==>
  message?: string;
  // <== SUCCESS ==>
  success?: boolean;
};
// <== SESSION TYPE ==>
export type Session = {
  // <== SESSION ID ==>
  sessionId: string;
  // <== DEVICE TYPE ==>
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  // <== DEVICE NAME ==>
  deviceName: string;
  // <== BROWSER NAME ==>
  browserName: string;
  // <== BROWSER VERSION ==>
  browserVersion: string;
  // <== OPERATING SYSTEM ==>
  operatingSystem: string;
  // <== IP ADDRESS ==>
  ipAddress: string;
  // <== LOCATION COUNTRY ==>
  locationCountry: string;
  // <== LOCATION CITY ==>
  locationCity: string;
  // <== LOCATION REGION ==>
  locationRegion: string;
  // <== IS TRUSTED ==>
  isTrusted: boolean;
  // <== LAST ACTIVITY ==>
  lastActivity: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== EXPIRES AT ==>
  expiresAt: string;
  // <== IS SUSPICIOUS ==>
  isSuspicious: boolean;
  // <== SUSPICIOUS REASON ==>
  suspiciousReason: string;
};
// <== GET SESSIONS RESPONSE ==>
type GetSessionsResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data: {
    // <== SESSIONS ==>
    sessions: Session[];
  };
};
// <== REVOKE SESSION RESPONSE ==>
type RevokeSessionResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
};
// <== REVOKE ALL OTHER SESSIONS REQUEST ==>
type RevokeAllOtherSessionsRequest = {
  // <== CURRENT SESSION ID ==>
  currentSessionId?: string;
};
// <== REVOKE ALL OTHER SESSIONS RESPONSE ==>
type RevokeAllOtherSessionsResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
  // <== DATA ==>
  data?: {
    // <== REVOKED COUNT ==>
    revokedCount: number;
  };
};
// <== TRUST DEVICE RESPONSE ==>
type TrustDeviceResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== MESSAGE ==>
  message: string;
};

// <== USE GET SESSIONS HOOK ==>
export const useGetSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async (): Promise<Session[]> => {
      const response = await apiClient.get<GetSessionsResponse>(
        "/security/sessions"
      );
      return response.data.data.sessions;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// <== USE REVOKE SESSION HOOK ==>
export const useRevokeSession = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // REVOKE SESSION MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (sessionId: string): Promise<RevokeSessionResponse> => {
      // CALL REVOKE SESSION API
      const response = await apiClient.delete<RevokeSessionResponse>(
        `/security/sessions/${sessionId}`
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE SESSIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Session revoked successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to revoke session. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE REVOKE ALL OTHER SESSIONS HOOK ==>
export const useRevokeAllOtherSessions = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // REVOKE ALL OTHER SESSIONS MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (
      params?: RevokeAllOtherSessionsRequest
    ): Promise<RevokeAllOtherSessionsResponse> => {
      // CALL REVOKE ALL OTHER SESSIONS API
      const response = await apiClient.post<RevokeAllOtherSessionsResponse>(
        "/security/sessions/revoke-all",
        params || {}
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE SESSIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // SHOW SUCCESS TOAST
      toast.success(
        data.message ||
          `Successfully revoked ${data.data?.revokedCount || 0} session(s)!`
      );
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to revoke sessions. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE TRUST DEVICE HOOK ==>
export const useTrustDevice = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRUST DEVICE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (sessionId: string): Promise<TrustDeviceResponse> => {
      // CALL TRUST DEVICE API
      const response = await apiClient.put<TrustDeviceResponse>(
        `/security/sessions/${sessionId}/trust`
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE SESSIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Device marked as trusted!");
    },
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to trust device. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE UNTRUST DEVICE HOOK ==>
export const useUntrustDevice = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // UNTRUST DEVICE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: async (sessionId: string): Promise<TrustDeviceResponse> => {
      // CALL UNTRUST DEVICE API
      const response = await apiClient.put<TrustDeviceResponse>(
        `/security/sessions/${sessionId}/untrust`
      );
      return response.data;
    },
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE SESSIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Device trust removed!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to untrust device. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
