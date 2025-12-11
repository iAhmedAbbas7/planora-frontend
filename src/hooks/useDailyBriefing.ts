// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// <== BRIEFING STORAGE KEY CONSTANT ==>
const BRIEFING_STORAGE_KEY = "planora_daily_briefing";
// <== CACHE DATE KEY CONSTANT ==>
const BRIEFING_DATE_KEY = "planora_daily_briefing_date";

// <== FOCUS SUGGESTION TYPE ==>
export type FocusSuggestion = {
  // TASK TITLE
  task: string;
  // REASON TO FOCUS
  reason: string;
  // PRIORITY LEVEL
  priority: "high" | "medium" | "low";
};

// <== HIGHLIGHT TYPE ==>
export type Highlight = {
  // ACHIEVEMENT DESCRIPTION
  achievement: string;
  // IMPACT DESCRIPTION
  impact: string;
};

// <== ATTENTION ITEM TYPE ==>
export type AttentionItem = {
  // ITEM DESCRIPTION
  item: string;
  // URGENCY LEVEL
  urgency: "high" | "medium" | "low";
  // SUGGESTED ACTION
  action: string;
};

// <== BRIEFING STATS TYPE ==>
export type BriefingStats = {
  // TASKS DUE TODAY
  tasksDueToday: number;
  // OVERDUE TASKS
  overdueTasks: number;
  // IN PROGRESS TASKS
  inProgress: number;
  // WEEKLY VELOCITY
  weeklyVelocity: number;
};

// <== GITHUB ACTIVITY TYPE ==>
export type GitHubActivity = {
  // RECENT COMMITS COUNT
  recentCommits: number;
  // OPEN PRS COUNT
  openPRs: number;
  // PENDING REVIEWS COUNT
  pendingReviews: number;
  // FAILED WORKFLOWS
  failedWorkflows: string[];
};

// <== RAW TASK DATA TYPE ==>
export type RawTaskData = {
  // TASK ID
  _id: string;
  // TASK TITLE
  title: string;
  // TASK DESCRIPTION
  description?: string;
  // TASK PRIORITY
  priority: "high" | "medium" | "low";
  // TASK STATUS
  status: "to do" | "in progress" | "completed";
  // TASK DUE DATE
  dueDate?: string;
};

// <== RAW DATA TYPE ==>
export type RawBriefingData = {
  // TASKS DUE TODAY
  tasksDueToday: RawTaskData[];
  // OVERDUE TASKS
  overdueTasks: RawTaskData[];
  // IN PROGRESS TASKS
  inProgressTasks: RawTaskData[];
  // COMPLETED YESTERDAY
  completedYesterday: RawTaskData[];
  // GITHUB ACTIVITY
  githubActivity: GitHubActivity | null;
};

// <== DAILY BRIEFING TYPE ==>
export type DailyBriefing = {
  // GREETING MESSAGE
  greeting: string;
  // SUMMARY
  summary: string;
  // FOCUS SUGGESTIONS
  focusSuggestions: FocusSuggestion[];
  // HIGHLIGHTS
  highlights: Highlight[];
  // ATTENTION NEEDED
  attentionNeeded: AttentionItem[];
  // PRODUCTIVITY TIP
  productivityTip: string;
  // STATS
  stats: BriefingStats;
  // RAW DATA
  rawData: RawBriefingData;
};

// <== API RESPONSE TYPE ==>
type ApiResponse = {
  // SUCCESS FLAG
  success: boolean;
  // MESSAGE
  message: string;
  // DATA
  data: DailyBriefing;
};

// <== GET TODAY'S DATE STRING ==>
const getTodayDateString = (): string => {
  // GET TODAY'S DATE
  const today = new Date();
  // RETURN TODAY'S DATE STRING
  return today.toISOString().split("T")[0];
};

// <== GET CACHED BRIEFING ==>
const getCachedBriefing = (): DailyBriefing | null => {
  try {
    // GET CACHED DATE
    const cachedDate = localStorage.getItem(BRIEFING_DATE_KEY);
    // GET TODAY'S DATE STRING
    const today = getTodayDateString();
    // CHECK IF CACHED DATE IS TODAY
    if (cachedDate !== today) {
      // RETURN NULL
      return null;
    }
    // GET CACHED BRIEFING
    const cachedBriefing = localStorage.getItem(BRIEFING_STORAGE_KEY);
    // CHECK IF CACHED BRIEFING EXISTS
    if (!cachedBriefing) {
      // RETURN NULL
      return null;
    }
    // PARSE AND RETURN CACHED BRIEFING
    return JSON.parse(cachedBriefing) as DailyBriefing;
  } catch {
    // IF ERROR, RETURN NULL
    return null;
  }
};

// <== CACHE BRIEFING ==>
const cacheBriefing = (briefing: DailyBriefing): void => {
  try {
    // STORE BRIEFING IN LOCAL STORAGE
    localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(briefing));
    // STORE TODAY'S DATE IN LOCAL STORAGE
    localStorage.setItem(BRIEFING_DATE_KEY, getTodayDateString());
  } catch {
    // IGNORE STORAGE ERRORS - CONTINUE ANYWAY
  }
};

// <== CLEAR BRIEFING CACHE ==>
export const clearBriefingCache = (): void => {
  try {
    // REMOVE BRIEFING FROM LOCAL STORAGE
    localStorage.removeItem(BRIEFING_STORAGE_KEY);
    // REMOVE TODAY'S DATE FROM LOCAL STORAGE
    localStorage.removeItem(BRIEFING_DATE_KEY);
  } catch {
    // IGNORE STORAGE ERRORS
  }
};

// <== FETCH DAILY BRIEFING ==>
const fetchDailyBriefing = async (): Promise<DailyBriefing> => {
  // CHECK FOR CACHED BRIEFING FIRST
  const cachedBriefing = getCachedBriefing();
  // IF CACHED BRIEFING EXISTS AND IS FROM TODAY, RETURN IT
  if (cachedBriefing) {
    // RETURN CACHED BRIEFING
    return cachedBriefing;
  }
  // FETCH DAILY BRIEFING FROM API
  const response = await apiClient.get<ApiResponse>("/ai/daily-briefing");
  // GET BRIEFING DATA FROM RESPONSE
  const briefing = response.data.data;
  // CACHE THE BRIEFING
  cacheBriefing(briefing);
  // RETURN DATA
  return briefing;
};

// <== USE DAILY BRIEFING HOOK ==>
export const useDailyBriefing = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE QUERY FOR DAILY BRIEFING
  const query = useQuery({
    // QUERY KEY - INCLUDES TODAY'S DATE FOR AUTOMATIC DAILY REFRESH
    queryKey: ["dailyBriefing", getTodayDateString()],
    // QUERY FUNCTION
    queryFn: fetchDailyBriefing,
    // ENABLED WHEN AUTHENTICATED AND NOT LOGGING OUT
    enabled: isAuthenticated && !isLoggingOut,
    // STALE TIME - 4 HOURS (DAILY BRIEFING STAYS FRESH FOR A WHILE)
    staleTime: 4 * 60 * 60 * 1000,
    // GC TIME - 24 HOURS (KEEP IN MEMORY FOR THE DAY)
    gcTime: 24 * 60 * 60 * 1000,
    // DON'T REFETCH ON MOUNT IF DATA EXISTS
    refetchOnMount: false,
    // DON'T REFETCH ON WINDOW FOCUS
    refetchOnWindowFocus: false,
    // DON'T REFETCH ON RECONNECT
    refetchOnReconnect: false,
    // RETRY 2 TIMES ON FAILURE
    retry: 2,
    // USE CACHED DATA AS INITIAL DATA
    initialData: () => getCachedBriefing() || undefined,
    // MARK INITIAL DATA AS FRESH IF IT EXISTS
    initialDataUpdatedAt: () => {
      // GET CACHED DATE
      const cachedDate = localStorage.getItem(BRIEFING_DATE_KEY);
      // CHECK IF CACHED DATE IS TODAY
      if (cachedDate === getTodayDateString()) {
        // RETURN CURRENT TIME TO MARK AS FRESH
        return Date.now();
      }
      // RETURN 0 TO MARK AS NOT FRESH
      return 0;
    },
  });
  // FUNCTION TO FORCE REFRESH BRIEFING
  const forceRefresh = async () => {
    // CLEAR CACHE
    clearBriefingCache();
    // INVALIDATE QUERY TO FORCE REFETCH
    await queryClient.invalidateQueries({ queryKey: ["dailyBriefing"] });
  };
  // RETURN QUERY WITH FORCE REFRESH FUNCTION
  return {
    ...query,
    forceRefresh,
  };
};
