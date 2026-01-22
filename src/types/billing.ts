// <== PLAN TYPE ENUM ==>
export type PlanType = "free" | "free_trial" | "individual" | "team" | "enterprise";

// <== TRIAL PLAN TYPE (WHICH PAID PLAN USER CAN TRIAL) ==>
export type TrialPlanType = "individual" | "team" | "enterprise";

// <== BILLING CYCLE ENUM ==>
export type BillingCycle = "monthly" | "yearly";

// <== SUBSCRIPTION STATUS ENUM ==>
export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing"
  | "expired"
  | "incomplete"
  | "incomplete_expired";

// <== PLAN LIMITS INTERFACE ==>
export interface IPlanLimits {
  // <== MAXIMUM NUMBER OF PROJECTS ==>
  projects: number;
  // <== MAXIMUM NUMBER OF LINKED REPOSITORIES ==>
  repos: number;
  // <== MAXIMUM NUMBER OF TEAM MEMBERS (-1 = UNLIMITED) ==>
  teamMembers: number;
  // <== MAXIMUM AI REQUESTS PER DAY (-1 = UNLIMITED) ==>
  aiRequestsPerDay: number;
  // <== MAXIMUM CODE REVIEWS PER MONTH (-1 = UNLIMITED) ==>
  codeReviewsPerMonth: number;
  // <== MAXIMUM WORKSPACES (-1 = UNLIMITED) ==>
  workspaces: number;
  // <== MAXIMUM STORAGE IN MB (-1 = UNLIMITED) ==>
  storageMB: number;
  // <== MAXIMUM ACTIVE SESSIONS (DEVICES) ==>
  maxSessions: number;
}

// <== USAGE TRACKING INTERFACE ==>
export interface IUsageTracking {
  // <== CURRENT NUMBER OF PROJECTS ==>
  projectsCount: number;
  // <== CURRENT NUMBER OF LINKED REPOSITORIES ==>
  reposCount: number;
  // <== CURRENT NUMBER OF TEAM MEMBERS ==>
  teamMembersCount: number;
  // <== CURRENT NUMBER OF WORKSPACES ==>
  workspacesCount: number;
  // <== AI REQUESTS MADE TODAY ==> 
  aiRequestsToday: number;
  // <== TIMESTAMP WHEN AI REQUESTS RESET ==>
  aiRequestsResetAt: string | null;
  // <== CODE REVIEWS MADE THIS MONTH ==>
  codeReviewsThisMonth: number;
  // <== TIMESTAMP WHEN CODE REVIEWS RESET ==>  
  codeReviewsResetAt: string | null;
  // <== STORAGE USED IN MB ==>
  storageUsedMB: number;
}

// <== FEATURES INTERFACE ==>
export interface IPlanFeatures {
  // <== GITHUB INTEGRATION ==>
  githubIntegration: boolean;
  // <== AI TASK SUGGESTIONS ==>
  aiTaskSuggestions: boolean;
  // <== AI CODE REVIEW ==>
  aiCodeReview: boolean;
  // <== AI BUG DETECTION ==>
  aiBugDetection: boolean;
  // <== CODE EXPLANATION ==>
  codeExplanation: boolean;
  // <== FOCUS MODE ==>
  focusMode: boolean;
  // <== CUSTOM THEMES ==>
  customThemes: boolean;
  // <== ADVANCED REPORTS ==>
  advancedReports: boolean;
  // <== TEAM COLLABORATION ==>
  teamCollaboration: boolean;
  // <== WORKSPACES ==>
  workspaces: boolean;
  // <== SSO (SINGLE SIGN-ON) ==>
  sso: boolean;
  // <== AUDIT LOGS ==> 
  auditLogs: boolean;
  // <== PRIORITY SUPPORT ==>
  prioritySupport: boolean;
  // <== DEDICATED SUPPORT ==>
  dedicatedSupport: boolean;
  // <== CUSTOM INTEGRATIONS ==>
  customIntegrations: boolean;
  // <== SPRINT PLANNING ==>
  sprintPlanning: boolean;
  // <== GOALS AND OKRS ==>
  goalsAndOkrs: boolean;
}

// <== FEATURE KEY TYPE ==>
export type FeatureKey = keyof IPlanFeatures;

// <== PLAN PRICING INTERFACE ==>
export interface IPlanPricing {
  // <== MONTHLY PRICE IN DOLLARS ==>
  monthly: number;
  // <== YEARLY PRICE IN DOLLARS (TOTAL FOR YEAR) ==>
  yearly: number;
  // <== YEARLY SAVINGS IN DOLLARS ==>
  yearlySavings: number;
}

// <== PLAN CONFIG INTERFACE ==>
export interface IPlanConfig {
  // <== PLAN NAME ==>
  name: string;
  // <== PLAN DESCRIPTION ==>
  description: string;
  // <== PLAN TAGLINE ==>
  tagline: string;
  // <== PRICING ==>          
  pricing: IPlanPricing;
  // <== LIMITS ==>
  limits: IPlanLimits;
  // <== FEATURES ==>
  features: IPlanFeatures;
  // <== IS POPULAR FLAG ==>
  isPopular: boolean;
  // <== IS ENTERPRISE FLAG ==>
  isEnterprise: boolean;
}

// <== SUBSCRIPTION INTERFACE ==>
export interface ISubscription {
  // <== SUBSCRIPTION ID ==>
  _id: string;
  // <== USER ID ==>
  userId: string;
  // <== PLAN TYPE ==>
  plan: PlanType;
  // <== TRIAL PLAN (WHICH PAID PLAN USER IS TRIALING, IF ANY) ==>
  trialPlan: TrialPlanType | null;
  // <== BILLING CYCLE ==>
  billingCycle: BillingCycle;
  // <== SUBSCRIPTION STATUS ==>
  status: SubscriptionStatus;
  // <== STRIPE CUSTOMER ID ==>
  stripeCustomerId: string | null;
  // <== STRIPE SUBSCRIPTION ID ==>   
  stripeSubscriptionId: string | null;
  // <== STRIPE PRICE ID ==>
  stripePriceId: string | null;
  // <== TRIAL END DATE ==>
  trialEndsAt: string | null;
  // <== CURRENT BILLING PERIOD START ==>
  currentPeriodStart: string | null;
  // <== CURRENT BILLING PERIOD END ==>
  currentPeriodEnd: string | null;
  // <== CANCEL AT PERIOD END FLAG ==>
  cancelAtPeriodEnd: boolean;
  // <== CANCELLED AT TIMESTAMP ==>
  cancelledAt: string | null;
  // <== PLAN LIMITS ==>
  limits: IPlanLimits;
  // <== USAGE TRACKING ==>
  usage: IUsageTracking;
  // <== FEATURES ==>
  features: IPlanFeatures;
  // <== PLAN CONFIG (POPULATED) ==>
  planConfig?: {
    // <== NAME ==>
    name: string;
    // <== DESCRIPTION ==>
    description: string;
    // <== TAGLINE ==>
    tagline: string;
    // <== PRICING ==>
    pricing: IPlanPricing;
    // <== IS POPULAR FLAG ==>
    isPopular: boolean;
    // <== IS ENTERPRISE FLAG ==>
    isEnterprise: boolean;
  };
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== VIRTUALS ==>
  isActive?: boolean;
  // <== IS TRIAL FLAG ==>
  isTrial?: boolean;
  // <== TRIAL DAYS REMAINING ==>
  trialDaysRemaining?: number;
}

// <== INVOICE LINE ITEM INTERFACE ==>
export interface IInvoiceLineItem {
  // <== DESCRIPTION ==>
  description: string;
  // <== AMOUNT (IN CENTS) ==>
  amount: number;
  // <== QUANTITY ==>
  quantity: number;
  // <== UNIT AMOUNT (IN CENTS) ==>
  unitAmount: number;
  // <== PRICE ID (STRIPE) ==>  
  priceId: string | null;
}

// <== INVOICE INTERFACE ==>
export interface IInvoice {
  // <== INVOICE ID ==>
  id: string;
  // <== INVOICE NUMBER ==>
  number: string | null;
  // <== INVOICE STATUS ==>
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  // <== AMOUNT DUE (IN CENTS) ==>
  amountDue: number;
  // <== AMOUNT PAID (IN CENTS) ==>
  amountPaid: number;
  // <== TOTAL (IN CENTS) ==>
  total: number;
  // <== CURRENCY ==>
  currency: string;
  // <== BILLING PERIOD START ==>
  periodStart: string | null;
  // <== BILLING PERIOD END ==>
  periodEnd: string | null;
  // <== PAID AT TIMESTAMP ==>
  paidAt: string | null;
  // <== INVOICE PDF URL ==>
  invoicePdfUrl: string | null;
  // <== HOSTED INVOICE URL ==>
  hostedInvoiceUrl: string | null;
  // <== FORMATTED AMOUNT ==>
  formattedAmount: string;
  // <== CREATED AT ==>
  createdAt: string;
}

// <== UPCOMING INVOICE INTERFACE ==>
export interface IUpcomingInvoice {
  // <== AMOUNT DUE (IN CENTS) ==>    
  amountDue: number;
  // <== TOTAL (IN CENTS) ==>
  total: number;
  // <== CURRENCY ==>
  currency: string;
  // <== BILLING PERIOD START ==>
  periodStart: string | null;
  // <== BILLING PERIOD END ==>
  periodEnd: string | null;
  // <== FORMATTED AMOUNT ==>
  formattedAmount: string;
  // <== NEXT PAYMENT ATTEMPT ==>
  nextPaymentAttempt: string | null;
}

// <== PRORATION PREVIEW INTERFACE ==>
export interface IProrationPreview {
  // <== PRORATED AMOUNT (IN CENTS) ==>
  proratedAmount: number;
  // <== IMMEDIATE CHARGE (IN CENTS) ==>
  immediateCharge: number;
  // <== NEXT BILLING AMOUNT (IN CENTS) ==>
  nextBillingAmount: number;
  // <== FORMATTED PRORATED AMOUNT ==>
  formattedProratedAmount: string;
  // <== FORMATTED IMMEDIATE CHARGE ==>
  formattedImmediateCharge: string;
  // <== FORMATTED NEXT BILLING AMOUNT ==>    
  formattedNextBillingAmount: string;
}

// <== USAGE STATS INTERFACE ==>
export interface IUsageStats {
  // <== USAGE DATA ==>
  usage: IUsageTracking;
  // <== LIMITS DATA ==>
  limits: IPlanLimits;
  // <== USAGE PERCENTAGES ==>
  percentages: {
    // <== PROJECTS ==>
    projects: number;
    // <== REPOSITORIES ==>
    repos: number;
    // <== TEAM MEMBERS ==>
    teamMembers: number;
    // <== AI REQUESTS TODAY ==>
    aiRequestsToday: number;
    // <== CODE REVIEWS THIS MONTH ==>
    codeReviewsThisMonth: number;
    // <== WORKSPACES ==>
    workspaces: number;
    // <== STORAGE ==>
    storage: number;
  };
  // <== PLAN TYPE ==>
  plan: PlanType;
  // <== SUBSCRIPTION STATUS ==>
  status: SubscriptionStatus;
}

// <== CHECKOUT SESSION RESPONSE ==>
export interface ICheckoutSessionResponse {
  // <== SESSION ID ==>
  sessionId: string;
  // <== URL ==>
  url: string;
}

// <== PORTAL SESSION RESPONSE ==>
export interface IPortalSessionResponse {
  // <== URL ==>
  url: string;
}

// <== API RESPONSE WRAPPER ==>
export interface IBillingApiResponse<T> {
  // <== MESSAGE ==>
  message: string;
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
}

// <== FEATURE DISPLAY NAMES ==>
export const FEATURE_DISPLAY_NAMES: Record<FeatureKey, string> = {
  githubIntegration: "GitHub Integration",
  aiTaskSuggestions: "AI Task Suggestions",
  aiCodeReview: "AI Code Review",
  aiBugDetection: "AI Bug Detection",
  codeExplanation: "Code Explanation",
  focusMode: "Focus Mode",
  customThemes: "Custom Themes",
  advancedReports: "Advanced Reports",
  teamCollaboration: "Team Collaboration",
  workspaces: "Workspaces",
  sso: "Single Sign-On (SSO)",
  auditLogs: "Audit Logs",
  prioritySupport: "Priority Support",
  dedicatedSupport: "Dedicated Support",
  customIntegrations: "Custom Integrations",
  sprintPlanning: "Sprint Planning",
  goalsAndOkrs: "Goals & OKRs",
};

// <== LIMIT DISPLAY NAMES ==>
export const LIMIT_DISPLAY_NAMES: Record<keyof IPlanLimits, string> = {
  projects: "Projects",
  repos: "Repositories",
  teamMembers: "Team Members",
  aiRequestsPerDay: "AI Requests / Day",
  codeReviewsPerMonth: "Code Reviews / Month",
  workspaces: "Workspaces",
  storageMB: "Storage",
  maxSessions: "Active Devices",
};

// <== FORMAT LIMIT VALUE FOR DISPLAY ==>
export const formatLimitValue = (
  limitKey: keyof IPlanLimits,
  value: number
): string => {
  // IF UNLIMITED
  if (value === -1) return "Unlimited";
  // IF STORAGE, FORMAT AS MB/GB
  if (limitKey === "storageMB") {
    // IF STORAGE IS GREATER THAN OR EQUAL TO 1000, FORMAT AS GB
    if (value >= 1000) {
      // RETURN VALUE AS GB
      return `${(value / 1000).toFixed(0)} GB`;
    }
    // RETURN VALUE AS MB
    return `${value} MB`;
  }
  // OTHERWISE, RETURN VALUE AS STRING
  return value.toString();
};

// <== GET PLAN BADGE COLOR ==>
export const getPlanBadgeColor = (plan: PlanType): string => {
  // SWITCH ON PLAN TYPE
  switch (plan) {
    // IF FREE PLAN, RETURN SLATE COLOR
    case "free":
      return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100";
    // IF FREE TRIAL PLAN, RETURN CYAN COLOR
    case "free_trial":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100";
    // IF INDIVIDUAL PLAN, RETURN BLUE COLOR
    case "individual":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100";
    // IF TEAM PLAN, RETURN PURPLE COLOR
    case "team":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100";
    // IF ENTERPRISE PLAN, RETURN AMBER COLOR
    case "enterprise":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-100";
    // OTHERWISE, RETURN GRAY COLOR
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white";
  }
};

// <== GET STATUS BADGE COLOR ==>
export const getStatusBadgeColor = (status: SubscriptionStatus): string => {
  // SWITCH ON SUBSCRIPTION STATUS
  switch (status) {
    // IF ACTIVE, RETURN GREEN COLOR
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100";
    // IF TRIALING, RETURN CYAN COLOR
    case "trialing":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100";
    // IF PAST DUE, RETURN YELLOW COLOR
    case "past_due":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100";
    // IF CANCELLED OR EXPIRED, RETURN RED COLOR
    case "cancelled":
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100";
    // OTHERWISE, RETURN GRAY COLOR
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white";
  }
};

// <== PLAN HIERARCHY (FOR COMPARISON) ==>
export const PLAN_HIERARCHY: Record<PlanType, number> = {
  free: 0,
  free_trial: 1,
  individual: 2,
  team: 3,
  enterprise: 4,
};

// <== COMPARE PLANS ==>
export const comparePlans = (
  currentPlan: PlanType,
  targetPlan: PlanType
): "upgrade" | "downgrade" | "same" => {
  // GET CURRENT PLAN VALUE
  const currentValue = PLAN_HIERARCHY[currentPlan];
  // GET TARGET PLAN VALUE
  const targetValue = PLAN_HIERARCHY[targetPlan];
  // IF TARGET PLAN IS HIGHER, RETURN UPGRADE
  if (targetValue > currentValue) return "upgrade";
  // IF TARGET PLAN IS LOWER, RETURN DOWNGRADE
  if (targetValue < currentValue) return "downgrade";
  // OTHERWISE, RETURN SAME
  return "same";
};

// <== CHECK IF USER CAN START A TRIAL ==>
export const canStartTrial = (plan: PlanType, status: SubscriptionStatus): boolean => {
  // ONLY FREE PLAN USERS WITH ACTIVE STATUS CAN START A TRIAL
  return plan === "free" && status === "active";
};

// <== GET PLAN DISPLAY NAME ==>
export const getPlanDisplayName = (plan: PlanType): string => {
  // SWITCH ON PLAN TYPE
  switch (plan) {
    // IF FREE PLAN, RETURN FREE
    case "free":
      return "Free";
    // IF FREE TRIAL PLAN, RETURN FREE TRIAL
    case "free_trial":
      return "Free Trial";
    // IF INDIVIDUAL PLAN, RETURN INDIVIDUAL
    case "individual":
      return "Individual";
    // IF TEAM PLAN, RETURN TEAM
    case "team":
      return "Team";
    // IF ENTERPRISE PLAN, RETURN ENTERPRISE
    case "enterprise":
      return "Enterprise";
    // OTHERWISE, RETURN PLAN
    default:
      return plan;
  }
};
