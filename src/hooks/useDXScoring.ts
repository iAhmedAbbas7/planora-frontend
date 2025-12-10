// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== DX SCORE TYPE ==>
export type DXScore = {
  // <== OVERALL SCORE (0-100) ==>
  overall: number;
  // <== RATING ==>
  rating: "excellent" | "good" | "average" | "needs_improvement";
  // <== COMPONENT SCORES ==>
  components: {
    // <== PRODUCTIVITY SCORE ==>
    productivity: number;
    // <== QUALITY SCORE ==>
    quality: number;
    // <== COLLABORATION SCORE ==>
    collaboration: number;
    // <== CONSISTENCY SCORE ==>
    consistency: number;
  };
  // <== PERCENTILE RANK ==>
  percentile: number;
};
// <== MEMBER STATS TYPE ==>
export type MemberStats = {
  // <== COMMITS COUNT ==>
  commits: number;
  // <== PRS OPENED COUNT ==>
  prsOpened: number;
  // <== PRS MERGED COUNT ==>
  prsMerged: number;
  // <== PRS REVIEWED COUNT ==>
  prsReviewed: number;
  // <== ISSUES CLOSED COUNT ==>
  issuesClosed: number;
  // <== TASKS COMPLETED COUNT ==>
  tasksCompleted: number;
  // <== TASKS CREATED COUNT ==>
  tasksCreated: number;
  // <== LINES ADDED COUNT ==>
  linesAdded: number;
  // <== LINES REMOVED COUNT ==>
  linesRemoved: number;
  // <== CODE REVIEW COMMENTS COUNT ==>
  codeReviewComments: number;
  // <== ACTIVE TIME (MINUTES) ==>
  activeMinutes: number;
};
// <== DAILY TREND TYPE ==>
export type DailyTrend = {
  // <== DATE ==>
  date: string;
  // <== COMMITS COUNT ==>
  commits: number;
  // <== TASKS COMPLETED COUNT ==>
  tasksCompleted: number;
};
// <== DX SCORE DATA TYPE ==>
export type DXScoreData = {
  // <== DX SCORE ==>
  dxScore: DXScore;
  // <== MEMBER STATS ==>
  stats: MemberStats;
  // <== TEAM AVERAGES ==>
  teamAverages: MemberStats;
  // <== DAILY TREND ==>
  dailyTrend: DailyTrend[];
  // <== PERIOD ==>
  period: number;
};
// <== LEADERBOARD ENTRY TYPE ==>
export type LeaderboardEntry = {
  // <== RANK ==>
  rank: number;
  // <== USER ID ==>
  userId: string;
  // <== USER NAME ==>
  userName: string;
  // <== USER AVATAR ==>
  userAvatar?: string;
  // <== DX SCORE ==>
  dxScore: number;
  // <== STATS ==>
  stats: {
    // <== COMMITS COUNT ==>
    commits: number;
    // <== PRS OPENED COUNT ==>
    prsOpened: number;
    // <== PRS MERGED COUNT ==>
    prsMerged: number;
    // <== TASKS COMPLETED COUNT ==>
    tasksCompleted: number;
  };
  // <== CHANGE FROM PREVIOUS PERIOD ==>
  change: number;
};
// <== ACHIEVEMENT TYPE ==>
export type Achievement = {
  // <== ID ==>
  id: string;
  // <== NAME ==>
  name: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== ICON ==>
  icon: string;
  // <== TIER ==>
  tier: "bronze" | "silver" | "gold" | "platinum";
  // <== EARNED AT ==>
  earnedAt?: string;
  // <== PROGRESS (0-100) ==>
  progress: number;
};
// <== ACHIEVEMENTS DATA TYPE ==>
export type AchievementsData = {
  // <== EARNED ==>
  earned: Achievement[];
  // <== IN PROGRESS ==>
  inProgress: Achievement[];
  // <== STATS ==>
  stats: {
    // <== TOTAL EARNED ==>
    totalEarned: number;
    // <== TOTAL AVAILABLE ==>
    totalAvailable: number;
  };
};
// <== RECOMMENDATION TYPE ==>
export type Recommendation = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "high" | "medium" | "low";
  // <== CATEGORY ==>
  category: "productivity" | "quality" | "collaboration" | "wellbeing";
};
// <== TEAM SUMMARY TYPE ==>
export type TeamSummary = {
  // <== SUMMARY ==>
  summary: {
    // <== TOTAL COMMITS ==>
    totalCommits: number;
    // <== TOTAL PRS OPENED ==>
    totalPRsOpened: number;
    // <== TOTAL PRS MERGED ==>
    totalPRsMerged: number;
    // <== TOTAL PRS REVIEWED ==>
    totalPRsReviewed: number;
    // <== TOTAL TASKS COMPLETED ==>
    totalTasksCompleted: number;
    // <== TOTAL LINES ADDED ==>
    totalLinesAdded: number;
    // <== TOTAL LINES REMOVED ==>
    totalLinesRemoved: number;
    // <== ACTIVE MEMBERS ==>
    activeMembers: number;
  };
  // <== DAILY ACTIVITY ==>
  dailyActivity: Array<{
    // <== DATE ==>
    date: string;
    // <== COMMITS COUNT ==>
    commits: number;
    // <== PRS COUNT ==>
    prs: number;
    // <== TASKS COUNT ==>
    tasks: number;
    // <== ACTIVE MEMBERS ==>
    activeMembers: number;
  }>;
  // <== PERIOD ==>
  period: number;
};

// <== USE MEMBER DX SCORE HOOK ==>
export const useMemberDXScore = (
  workspaceId: string | null,
  memberId?: string,
  period: number = 30
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["dxScore", workspaceId, memberId, period],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // BUILD URL
      const url = memberId
        ? `/dx/${workspaceId}/score/${memberId}`
        : `/dx/${workspaceId}/score`;
      // FETCH DATA
      const response = await apiClient.get(url, { params: { period } });
      // RETURN DATA
      return response.data.data as DXScoreData;
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (5 MINUTES)
    staleTime: 5 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    data: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE WORKSPACE LEADERBOARD HOOK ==>
export const useWorkspaceLeaderboard = (
  workspaceId: string | null,
  period: number = 30,
  limit: number = 10
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["leaderboard", workspaceId, period, limit],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // FETCH DATA
      const response = await apiClient.get(`/dx/${workspaceId}/leaderboard`, {
        params: { period, limit },
      });
      // RETURN DATA
      return response.data.data as {
        leaderboard: LeaderboardEntry[];
        period: number;
        totalMembers: number;
      };
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    leaderboard: data?.leaderboard || [],
    totalMembers: data?.totalMembers || 0,
    period: data?.period || period,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE MEMBER ACHIEVEMENTS HOOK ==>
export const useMemberAchievements = (
  workspaceId: string | null,
  memberId?: string
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["achievements", workspaceId, memberId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // BUILD URL
      const url = memberId
        ? `/dx/${workspaceId}/achievements/${memberId}`
        : `/dx/${workspaceId}/achievements`;
      // FETCH DATA
      const response = await apiClient.get(url);
      // RETURN DATA
      return response.data.data as AchievementsData;
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (5 MINUTES)
    staleTime: 5 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    earned: data?.earned || [],
    inProgress: data?.inProgress || [],
    stats: data?.stats || { totalEarned: 0, totalAvailable: 0 },
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE AI DX RECOMMENDATIONS HOOK ==>
export const useAIDXRecommendations = (
  workspaceId: string | null,
  memberId?: string
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["dxRecommendations", workspaceId, memberId],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // BUILD URL
      const url = memberId
        ? `/dx/${workspaceId}/recommendations/${memberId}`
        : `/dx/${workspaceId}/recommendations`;
      // FETCH DATA
      const response = await apiClient.get(url);
      // RETURN DATA
      return response.data.data as {
        recommendations: Recommendation[];
        stats: MemberStats;
        teamAverages: Record<string, number>;
      };
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (10 MINUTES)
    staleTime: 10 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    recommendations: data?.recommendations || [],
    stats: data?.stats || null,
    teamAverages: data?.teamAverages || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE TEAM PERFORMANCE SUMMARY HOOK ==>
export const useTeamPerformanceSummary = (
  workspaceId: string | null,
  period: number = 30
) => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore();
  // USE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery({
    // QUERY KEY
    queryKey: ["teamSummary", workspaceId, period],
    // QUERY FUNCTION
    queryFn: async () => {
      // IF NO WORKSPACE ID, RETURN NULL
      if (!workspaceId) return null;
      // FETCH DATA
      const response = await apiClient.get(`/dx/${workspaceId}/team-summary`, {
        params: { period },
      });
      // RETURN DATA
      return response.data.data as TeamSummary;
    },
    // ENABLED
    enabled: !!workspaceId && isAuthenticated,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // RETRY
    retry: 1,
  });
  // RETURN DATA AND STATE
  return {
    summary: data?.summary || null,
    dailyActivity: data?.dailyActivity || [],
    period: data?.period || period,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE SYNC ACTIVITY MUTATION ==>
export const useSyncActivity = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  const mutation = useMutation({
    // MUTATION FUNCTION
    mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
      // SEND REQUEST
      const response = await apiClient.post(`/dx/${workspaceId}/sync`);
      // RETURN DATA
      return response.data.data;
    },
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE MEMBER DX SCORE QUERY
      queryClient.invalidateQueries({
        queryKey: ["dxScore", variables.workspaceId],
      });
      // INVALIDATE WORKSPACE LEADERBOARD QUERY
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", variables.workspaceId],
      });
      // INVALIDATE MEMBER ACHIEVEMENTS QUERY
      queryClient.invalidateQueries({
        queryKey: ["achievements", variables.workspaceId],
      });
      // INVALIDATE TEAM PERFORMANCE SUMMARY QUERY
      queryClient.invalidateQueries({
        queryKey: ["teamSummary", variables.workspaceId],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};
