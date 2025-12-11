// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

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

// <== EMPTY BRIEFING DATA (USED WHEN API FAILS) ==>
const EMPTY_BRIEFING: DailyBriefing = {
  greeting: "",
  summary: "",
  focusSuggestions: [],
  highlights: [],
  attentionNeeded: [],
  productivityTip: "",
  stats: {
    tasksDueToday: 0,
    overdueTasks: 0,
    inProgress: 0,
    weeklyVelocity: 0,
  },
  rawData: {
    tasksDueToday: [],
    overdueTasks: [],
    inProgressTasks: [],
    completedYesterday: [],
    githubActivity: null,
  },
};

// <== FETCH DAILY BRIEFING FUNCTION ==>
const fetchDailyBriefing = async (): Promise<DailyBriefing> => {
  try {
    // FETCH DAILY BRIEFING FROM API
    const response = await apiClient.get<ApiResponse>("/ai/daily-briefing");
    // RETURN DATA
    return response.data.data;
  } catch {
    // ON ERROR, RETURN EMPTY BRIEFING SO IT GETS CACHED
    return EMPTY_BRIEFING;
  }
};

// <== USE DAILY BRIEFING HOOK ==>
export const useDailyBriefing = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH DAILY BRIEFING
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["dailyBriefing"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchDailyBriefing,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME - 1 HOUR ==>
    staleTime: 60 * 60 * 1000,
    // <== GC TIME - 2 HOURS ==>
    gcTime: 2 * 60 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== REFETCH ON RECONNECT ==>
    refetchOnReconnect: false,
    // <== RETRY ==>
    retry: false,
  });
  // RETURN QUERY
  return {
    ...query,
    forceRefresh: query.refetch,
  };
};
