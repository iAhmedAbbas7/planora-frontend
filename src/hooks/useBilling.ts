// <== IMPORTS ==>
import {
  PlanType,
  BillingCycle,
  TrialPlanType,
  ISubscription,
  IPlanConfig,
  IInvoice,
  IUpcomingInvoice,
  IProrationPreview,
  IUsageStats,
  ICheckoutSessionResponse,
  IPortalSessionResponse,
  IBillingApiResponse,
  canStartTrial,
} from "../types/billing";
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== QUERY KEYS ==>
export const BILLING_QUERY_KEYS = {
  subscription: ["billing", "subscription"] as const,
  plans: ["billing", "plans"] as const,
  invoices: ["billing", "invoices"] as const,
  upcomingInvoice: ["billing", "upcoming-invoice"] as const,
  usage: ["billing", "usage"] as const,
  usageKey: (key: string) => ["billing", "usage", key] as const,
};

// <== GET SUBSCRIPTION ==>
const getSubscription = async (): Promise<ISubscription> => {
  // GET SUBSCRIPTION
  const response = await apiClient.get<IBillingApiResponse<ISubscription>>(
    "/billing/subscription"
  );
  // RETURN SUBSCRIPTION
  return response.data.data;
};

// <== GET ALL PLANS ==>
const getAllPlans = async (): Promise<IPlanConfig[]> => {
  // GET ALL PLANS
  const response = await apiClient.get<IBillingApiResponse<IPlanConfig[]>>(
    "/billing/plans"
  );
  // RETURN ALL PLANS
  return response.data.data;
};

// <== GET INVOICES ==>
const getInvoices = async (limit: number = 10): Promise<IInvoice[]> => {
  // GET INVOICES
  const response = await apiClient.get<IBillingApiResponse<IInvoice[]>>(
    `/billing/invoices?limit=${limit}`
  );
  // RETURN INVOICES
  return response.data.data;
};

// <== GET UPCOMING INVOICE ==>
const getUpcomingInvoice = async (): Promise<IUpcomingInvoice | null> => {
  // GET UPCOMING INVOICE
  const response = await apiClient.get<
    IBillingApiResponse<IUpcomingInvoice | null>
  >("/billing/invoices/upcoming");
  // RETURN UPCOMING INVOICE
  return response.data.data;
};

// <== GET USAGE STATS ==>
const getUsageStats = async (): Promise<IUsageStats> => {
  // GET USAGE STATS
  const response = await apiClient.get<IBillingApiResponse<IUsageStats>>(
    "/billing/usage"
  );
  // RETURN USAGE STATS
  return response.data.data;
};

// <== CREATE CHECKOUT SESSION ==>
const createCheckoutSession = async (
  plan: PlanType,
  billingCycle: BillingCycle
): Promise<ICheckoutSessionResponse> => {
  // CREATE CHECKOUT SESSION
  const response = await apiClient.post<
    IBillingApiResponse<ICheckoutSessionResponse>
  >("/billing/checkout", { plan, billingCycle });
  // RETURN CHECKOUT SESSION
  return response.data.data;
};

// <== VERIFY CHECKOUT SESSION ==>
const verifyCheckoutSession = async (
  sessionId: string
): Promise<{ subscription: ISubscription }> => {
  // VERIFY CHECKOUT SESSION
  const response = await apiClient.get<
    IBillingApiResponse<{ subscription: ISubscription }>
  >(`/billing/checkout/verify?session_id=${sessionId}`);
  // RETURN VERIFIED CHECKOUT SESSION
  return response.data.data;
};

// <== CREATE PORTAL SESSION ==>
const createPortalSession = async (): Promise<IPortalSessionResponse> => {
  // CREATE PORTAL SESSION
  const response = await apiClient.post<
    IBillingApiResponse<IPortalSessionResponse>
  >("/billing/portal");
  // RETURN PORTAL SESSION
  return response.data.data;
};

// <== CANCEL SUBSCRIPTION ==>
const cancelSubscription = async (): Promise<{
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
}> => {
  // CANCEL SUBSCRIPTION
  const response = await apiClient.post<
    IBillingApiResponse<{
      cancelAtPeriodEnd: boolean;
      currentPeriodEnd: string;
    }>
  >("/billing/cancel");
  // RETURN CANCELLED SUBSCRIPTION
  return response.data.data;
};

// <== REACTIVATE SUBSCRIPTION ==>
const reactivateSubscription = async (): Promise<{
  cancelAtPeriodEnd: boolean;
}> => {
  // REACTIVATE SUBSCRIPTION
  const response = await apiClient.post<
    IBillingApiResponse<{ cancelAtPeriodEnd: boolean }>
  >("/billing/reactivate");
  // RETURN REACTIVATED SUBSCRIPTION
  return response.data.data;
};

// <== CHANGE PLAN ==>
const changePlan = async (
  plan: PlanType,
  billingCycle: BillingCycle
): Promise<{
  previousPlan: PlanType;
  newPlan: PlanType;
  billingCycle: BillingCycle;
  changeType: "upgrade" | "downgrade" | "same";
}> => {
  // CHANGE PLAN
  const response = await apiClient.post<
    IBillingApiResponse<{
      previousPlan: PlanType;
      newPlan: PlanType;
      billingCycle: BillingCycle;
      changeType: "upgrade" | "downgrade" | "same";
    }>
  >("/billing/change-plan", { plan, billingCycle });
  // RETURN CHANGED PLAN
  return response.data.data;
};

// <== GET PRORATION PREVIEW ==>
const getProrationPreview = async (
  plan: PlanType,
  billingCycle: BillingCycle
): Promise<IProrationPreview> => {
  // GET PRORATION PREVIEW
  const response = await apiClient.get<IBillingApiResponse<IProrationPreview>>(
    `/billing/proration?plan=${plan}&billingCycle=${billingCycle}`
  );
  // RETURN PRORATION PREVIEW
  return response.data.data;
};

// <== SYNC USAGE ==>
const syncUsage = async (): Promise<{ usage: IUsageStats["usage"] }> => {
  // SYNC USAGE
  const response = await apiClient.post<
    IBillingApiResponse<{ usage: IUsageStats["usage"] }>
  >("/billing/usage/sync");
  // RETURN SYNCED USAGE
  return response.data.data;
};

// <== START FREE TRIAL ==>
const startFreeTrial = async (plan: TrialPlanType): Promise<ISubscription> => {
  // START FREE TRIAL
  const response = await apiClient.post<IBillingApiResponse<ISubscription>>(
    "/billing/trial/start",
    { plan }
  );
  // RETURN STARTED FREE TRIAL
  return response.data.data;
};

// <== USE SUBSCRIPTION HOOK ==>
export const useSubscription = () => {
  // GET IS AUTHENTICATED
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: BILLING_QUERY_KEYS.subscription,
    // QUERY FUNCTION
    queryFn: getSubscription,
    // ENABLED
    enabled: isAuthenticated,
    // STALE TIME
    staleTime: 1000 * 60 * 5,
    // REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: true,
  });
};

// <== USE PLANS HOOK ==>
export const usePlans = () => {
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: BILLING_QUERY_KEYS.plans,
    // QUERY FUNCTION
    queryFn: getAllPlans,
    // STALE TIME
    staleTime: 1000 * 60 * 60,
    // REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: false,
  });
};

// <== USE INVOICES HOOK ==>
export const useInvoices = (limit: number = 10) => {
  // GET IS AUTHENTICATED
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: [...BILLING_QUERY_KEYS.invoices, limit],
    // QUERY FUNCTION
    queryFn: () => getInvoices(limit),
    // ENABLED
    enabled: isAuthenticated,
    // STALE TIME
    staleTime: 1000 * 60 * 5,
  });
};

// <== USE UPCOMING INVOICE HOOK ==>
export const useUpcomingInvoice = () => {
  // GET IS AUTHENTICATED
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: BILLING_QUERY_KEYS.upcomingInvoice,
    // QUERY FUNCTION
    queryFn: getUpcomingInvoice,
    // ENABLED
    enabled: isAuthenticated,
    // STALE TIME
    staleTime: 1000 * 60 * 5,
  });
};

// <== USE USAGE STATS HOOK ==>
export const useUsageStats = () => {
  // GET IS AUTHENTICATED
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: BILLING_QUERY_KEYS.usage,
    // QUERY FUNCTION
    queryFn: getUsageStats,
    // ENABLED
    enabled: isAuthenticated,
    // STALE TIME
    staleTime: 1000 * 60,
    // REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: true,
  });
};

// <== USE CREATE CHECKOUT MUTATION ==>
export const useCreateCheckout = () => {
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: ({
      plan,
      billingCycle,
    }: {
      plan: PlanType;
      billingCycle: BillingCycle;
    }) => createCheckoutSession(plan, billingCycle),
    // ON SUCCESS
    onSuccess: (data) => {
      // REDIRECT TO STRIPE CHECKOUT
      if (data.url) {
        // REDIRECT TO STRIPE CHECKOUT
        window.location.href = data.url;
      }
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(
        // GET ERROR MESSAGE
        error.response?.data?.message || "Failed to create checkout session"
        // SHOW ERROR TOAST
      );
    },
  });
};

// <== USE VERIFY CHECKOUT MUTATION ==>
export const useVerifyCheckout = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: (sessionId: string) => verifyCheckoutSession(sessionId),
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE SUBSCRIPTION QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.subscription,
      });
      // SHOW SUCCESS TOAST
      toast.success("Subscription activated successfully!");
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(
        // GET ERROR MESSAGE
        error.response?.data?.message || "Failed to verify checkout"
      );
    },
  });
};

// <== USE CREATE PORTAL MUTATION ==>
export const useCreatePortal = () => {
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: createPortalSession,
    // ON SUCCESS
    onSuccess: (data) => {
      // REDIRECT TO STRIPE PORTAL
      if (data.url) {
        // REDIRECT TO STRIPE PORTAL
        window.location.href = data.url;
      }
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(
          error.response?.data?.message || "Failed to open billing portal"
      );
    },
  });
};

// <== USE CANCEL SUBSCRIPTION MUTATION ==>
export const useCancelSubscription = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: cancelSubscription,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE SUBSCRIPTION QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.subscription,
      });
      // SHOW SUCCESS TOAST
      toast.success("Subscription will be cancelled at the end of the billing period");
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // GET ERROR MESSAGE
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    },
  });
};

// <== USE REACTIVATE SUBSCRIPTION MUTATION ==>
export const useReactivateSubscription = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: reactivateSubscription,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE SUBSCRIPTION QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.subscription,
      });
      // SHOW SUCCESS TOAST
      toast.success("Subscription reactivated successfully!");
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // GET ERROR MESSAGE
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to reactivate subscription"
      );
    },
  });
};

// <== USE CHANGE PLAN MUTATION ==>
export const useChangePlan = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: ({
      plan,
      billingCycle,
    }: {
      plan: PlanType;
      billingCycle: BillingCycle;
    }) => changePlan(plan, billingCycle),
    // ON SUCCESS
    onSuccess: (data) => {
      // INVALIDATE SUBSCRIPTION QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.subscription,
      });
      // SHOW SUCCESS TOAST
      const action = data.changeType === "upgrade" ? "upgraded" : "changed";
      // SHOW SUCCESS TOAST
      toast.success(`Plan ${action} successfully!`);
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string; requiresCheckout?: boolean }>) => {
      // IF REQUIRES CHECKOUT, SHOW INFO TOAST
      if (error.response?.data?.requiresCheckout) {
        // SHOW INFO TOAST
        toast.info("Please complete checkout to change your plan");
        // RETURN
        return;
      }
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to change plan");
    },
  });
};

// <== USE PRORATION PREVIEW HOOK ==>
export const useProrationPreview = (
  plan: PlanType | null,
  billingCycle: BillingCycle | null,
  enabled: boolean = false
) => {
  // GET IS AUTHENTICATED
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // RETURN QUERY
  return useQuery({
    // QUERY KEY
    queryKey: ["billing", "proration", plan, billingCycle],
    // QUERY FUNCTION
    queryFn: () => getProrationPreview(plan!, billingCycle!),
    // ENABLED
    enabled: isAuthenticated && enabled && !!plan && !!billingCycle,
    // STALE TIME
    staleTime: 1000 * 30,
  });
};

// <== USE SYNC USAGE MUTATION ==>
export const useSyncUsage = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: syncUsage,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE USAGE QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.usage,
      });
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to sync usage");
    },
  });
};

// <== USE START FREE TRIAL MUTATION ==>
export const useStartFreeTrial = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION
  return useMutation({
    // MUTATION FUNCTION
    mutationFn: (plan: TrialPlanType) => startFreeTrial(plan),
    // ON SUCCESS
    onSuccess: (data) => {
      // INVALIDATE SUBSCRIPTION QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.subscription,
      });
      // INVALIDATE USAGE QUERY
      queryClient.invalidateQueries({
        queryKey: BILLING_QUERY_KEYS.usage,
      });
      // SHOW SUCCESS TOAST
      const planName = data.trialPlan || "premium";
      // SHOW SUCCESS TOAST
      toast.success(`Your 14-day ${planName} trial has started! Enjoy all premium features.`);
    },
    // ON ERROR
    onError: (error: AxiosError<{ message: string }>) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to start free trial"
      );
    },
  });
};

// <== HELPER HOOKS ==>

// <== USE IS FEATURE AVAILABLE ==>
export const useIsFeatureAvailable = (featureKey: keyof ISubscription["features"]) => {
  // GET SUBSCRIPTION
  const { data: subscription, isLoading } = useSubscription();
  // IF LOADING, RETURN LOADING STATE
  if (isLoading) {
    // RETURN LOADING STATE
    return { available: false, isLoading: true };
  }
  // IF NO SUBSCRIPTION, RETURN FALSE
  if (!subscription) {
    // RETURN FALSE STATE
    return { available: false, isLoading: false };
  }
  // CHECK IF FEATURE IS AVAILABLE
  const available = subscription.features?.[featureKey] === true;
  // RETURN AVAILABILITY STATE
  return { available, isLoading: false, subscription };
};

// <== USE IS WITHIN LIMIT ==>
export const useIsWithinLimit = (
  limitKey: keyof ISubscription["limits"],
  usageKey: keyof ISubscription["usage"]
) => {
  // GET SUBSCRIPTION
  const { data: subscription, isLoading } = useSubscription();
  // IF LOADING, RETURN LOADING STATE
  if (isLoading) {
    // RETURN LOADING STATE
    return { withinLimit: false, isLoading: true, remaining: 0, limit: 0, usage: 0 };
  }
  // IF NO SUBSCRIPTION, RETURN FALSE
  if (!subscription) {
    // RETURN FALSE STATE
    return { withinLimit: false, isLoading: false, remaining: 0, limit: 0, usage: 0 };
  }
  // GET LIMIT
  const limit = subscription.limits?.[limitKey] ?? 0;
  // GET USAGE
  const usage =
    typeof subscription.usage?.[usageKey] === "number"
      ? subscription.usage[usageKey]
      : 0;
  // IF UNLIMITED, RETURN TRUE
  if (limit === -1) {
    // RETURN TRUE STATE
    return {
      withinLimit: true,
      isLoading: false,
      remaining: -1,
      limit: -1,
      usage: usage as number,
    };
  }
  // CHECK IF WITHIN LIMIT
  const withinLimit = (usage as number) < limit;
  // GET REMAINING
  const remaining = Math.max(0, limit - (usage as number));
  // RETURN RESULT
  return { withinLimit, isLoading: false, remaining, limit, usage: usage as number };
};

// <== USE PLAN INFO ==>
export const usePlanInfo = () => {
  // GET SUBSCRIPTION
  const { data: subscription, isLoading } = useSubscription();
  // DETERMINE IF USER CAN START A TRIAL
  const canUserStartTrial = canStartTrial(
    subscription?.plan ?? "free",
    subscription?.status ?? "active"
  );
  // RETURN PLAN INFO
  return {
    plan: subscription?.plan ?? "free",
    trialPlan: subscription?.trialPlan ?? null,
    status: subscription?.status ?? "active",
    isActive:
      subscription?.status === "active" || subscription?.status === "trialing",
    isTrial: subscription?.status === "trialing",
    isFree: subscription?.plan === "free",
    trialDaysRemaining: subscription?.trialDaysRemaining ?? 0,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
    canStartTrial: canUserStartTrial,
    isLoading,
    subscription,
  };
};
