// <== IMPORTS ==>
import { AxiosError } from "axios";
import apiClient from "../lib/axios";
import { toast } from "../lib/toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== ONBOARDING STATUS RESPONSE ==>
interface OnboardingStatusResponse {
  // <== MESSAGE ==>
  message: string;
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: {
    // <== ONBOARDING COMPLETED ==>
    onboardingCompleted: boolean;
    // <== SELECTED PLAN ==>
    selectedPlan: string | null;
  };
}
// <== COMPLETE ONBOARDING RESPONSE ==>
interface CompleteOnboardingResponse {
  // <== MESSAGE ==>
  message: string;
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: {
    // <== ONBOARDING COMPLETED ==>
    onboardingCompleted: boolean;
  };
}

// <== QUERY KEYS ==>
export const ONBOARDING_QUERY_KEYS = {
  status: ["onboarding", "status"],
};

// <== USE ONBOARDING STATUS ==>
export const useOnboardingStatus = () => {
  // GET AUTH STATE
  const { isAuthenticated, user } = useAuthStore();
  // RETURN QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ONBOARDING_QUERY_KEYS.status,
    // <== QUERY FUNCTION ==>
    queryFn: async () => {
      // CALL GET ONBOARDING STATUS API
      const response = await apiClient.get<OnboardingStatusResponse>(
        "/auth/onboarding/status"
      );
      // RETURN RESPONSE DATA
      return response.data.data;
    },
    // ONLY FETCH IF AUTHENTICATED
    enabled: isAuthenticated && !!user,
    // CACHE FOR 5 MINUTES
    staleTime: 5 * 60 * 1000,
    // RETRY 1 TIME ON FAILURE
    retry: 1,
  });
};

// <== USE COMPLETE ONBOARDING ==>
export const useCompleteOnboarding = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // GET NAVIGATE FUNCTION
  const navigate = useNavigate();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: async () => {
      // CALL COMPLETE ONBOARDING API
      const response = await apiClient.post<CompleteOnboardingResponse>(
        "/auth/onboarding/complete"
      );
      // RETURN RESPONSE DATA
      return response.data;
    },
    onSuccess: (data) => {
      // PREPARE THE UPDATED ONBOARDING DATA
      const updatedOnboardingData = {
        success: true,
        message: "Onboarding completed",
        data: { onboardingCompleted: true, selectedPlan: null },
      };
      // SET ONBOARDING QUERY CACHE
      queryClient.setQueryData(
        ["onboarding", "status", "protected-route"],
        updatedOnboardingData
      );
      // SET ONBOARDING QUERY CACHE
      queryClient.setQueryData(ONBOARDING_QUERY_KEYS.status, {
        onboardingCompleted: true,
        selectedPlan: null,
      });
      // SHOW SUCCESS TOAST
      toast.success(data.message || "Welcome to PlanOra!");
      // NAVIGATE TO DASHBOARD (WITH REPLACE TO PREVENT BACK NAVIGATION)
      navigate("/dashboard", { replace: true });
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to complete onboarding."
      );
    },
  });
};

// <== USE ONBOARDING ==>
export const useOnboarding = () => {
  // GET ONBOARDING STATUS
  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useOnboardingStatus();
  // GET COMPLETE ONBOARDING MUTATION
  const completeOnboarding = useCompleteOnboarding();
  // RETURN COMBINED VALUES
  return {
    onboardingCompleted: status?.onboardingCompleted ?? false,
    selectedPlan: status?.selectedPlan ?? null,
    isLoadingStatus,
    statusError,
    completeOnboarding,
  };
};

export default useOnboarding;
