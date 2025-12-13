// <== IMPORTS ==>
import { apiClient } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== REPORT PERIOD TYPE ==>
export type ReportPeriod = "week" | "month" | "quarter" | "year";
// <== DAILY COMPLETION TYPE ==>
export type DailyCompletion = {
  // <== DATE STRING ==>
  date: string;
  // <== COMPLETED COUNT ==>
  completed: number;
};
// <== PRIORITY DISTRIBUTION TYPE ==>
export type PriorityDistribution = {
  // <== PRIORITY ==>
  priority: string;
  // <== COUNT ==>
  count: number;
};
// <== PROJECT DISTRIBUTION TYPE ==>
export type ProjectDistribution = {
  // <== PROJECT ID ==>
  projectId: string | null;
  // <== PROJECT NAME ==>
  projectName: string;
  // <== TASKS COMPLETED ==>
  tasksCompleted: number;
};
// <== VELOCITY TREND TYPE ==>
export type VelocityTrend = {
  // <== WEEK LABEL ==>
  week: string;
  // <== COMPLETED COUNT ==>
  completed: number;
};
// <== PERSONAL REPORT SUMMARY TYPE ==>
export type PersonalReportSummary = {
  // <== TOTAL TASKS ==>
  totalTasks: number;
  // <== COMPLETED TASKS ==>
  completedTasks: number;
  // <== IN PROGRESS TASKS ==>
  inProgressTasks: number;
  // <== PENDING TASKS ==>
  pendingTasks: number;
  // <== OVERDUE TASKS ==>
  overdueTasks: number;
  // <== COMPLETION RATE ==>
  completionRate: number;
  // <== VELOCITY ==>
  velocity: number;
  // <== HIGH PRIORITY COMPLETED ==>
  highPriorityCompleted: number;
};
// <== FOCUS STATS TYPE ==>
export type FocusStatsReport = {
  // <== TOTAL SESSIONS ==>
  totalSessions: number;
  // <== COMPLETED SESSIONS ==>
  completedSessions: number;
  // <== TOTAL FOCUS TIME ==>
  totalFocusTime: number;
  // <== AVG SESSION LENGTH ==>
  avgSessionLength: number;
  // <== TOTAL POMODOROS ==>
  totalPomodoros: number;
};
// <== PRODUCTIVITY INSIGHTS TYPE ==>
export type ProductivityInsights = {
  // <== MOST PRODUCTIVE DAY ==>
  mostProductiveDay: string | null;
  // <== MOST PRODUCTIVE HOUR ==>
  mostProductiveHour: number | null;
};
// <== PERSONAL REPORT CHARTS TYPE ==>
export type PersonalReportCharts = {
  // <== DAILY COMPLETION ==>
  dailyCompletion: DailyCompletion[];
  // <== PRIORITY DISTRIBUTION ==>
  priorityDistribution: PriorityDistribution[];
  // <== PROJECT DISTRIBUTION ==>
  projectDistribution: ProjectDistribution[];
  // <== VELOCITY TREND ==>
  velocityTrend: VelocityTrend[];
};
// <== PERSONAL REPORT DATA TYPE ==>
export type PersonalReportData = {
  // <== SUMMARY ==>
  summary: PersonalReportSummary;
  // <== FOCUS STATS ==>
  focusStats: FocusStatsReport;
  // <== PRODUCTIVITY INSIGHTS ==>
  productivity: ProductivityInsights;
  // <== CHARTS DATA ==>
  charts: PersonalReportCharts;
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== DATE RANGE ==>
  dateRange: {
    // <== START DATE ==>
    start: string;
    // <== END DATE ==>
    end: string;
  };
};
// <== PROJECT REPORT SUMMARY TYPE ==>
export type ProjectReportSummary = {
  // <== TOTAL TASKS ==>
  totalTasks: number;
  // <== COMPLETED TASKS ==>
  completedTasks: number;
  // <== IN PROGRESS TASKS ==>
  inProgressTasks: number;
  // <== PENDING TASKS ==>
  pendingTasks: number;
  // <== OVERDUE TASKS ==>
  overdueTasks: number;
  // <== REMAINING TASKS ==>
  remainingTasks: number;
  // <== PROGRESS PERCENTAGE ==>
  progressPercentage: number;
};
// <== PROJECT INFO TYPE ==>
export type ProjectInfo = {
  // <== PROJECT ID ==>
  id: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT DESCRIPTION ==>
  description?: string;
  // <== PROJECT STATUS ==>
  status: string;
  // <== DUE DATE ==>
  dueDate?: string;
};
// <== STATUS DISTRIBUTION TYPE ==>
export type StatusDistribution = {
  // <== STATUS ==>
  status: string;
  // <== COUNT ==>
  count: number;
};
// <== BURNDOWN DATA TYPE ==>
export type BurndownData = {
  // <== DATE ==>
  date: string;
  // <== CREATED ==>
  created: number;
  // <== COMPLETED ==>
  completed: number;
};
// <== PROJECT REPORT CHARTS TYPE ==>
export type ProjectReportCharts = {
  // <== BURNDOWN DATA ==>
  burndownData: BurndownData[];
  // <== COMPLETION TREND ==>
  completionTrend: DailyCompletion[];
  // <== STATUS DISTRIBUTION ==>
  statusDistribution: StatusDistribution[];
  // <== PRIORITY DISTRIBUTION ==>
  priorityDistribution: PriorityDistribution[];
};
// <== PROJECT REPORT DATA TYPE ==>
export type ProjectReportData = {
  // <== PROJECT INFO ==>
  project: ProjectInfo;
  // <== SUMMARY ==>
  summary: ProjectReportSummary;
  // <== CHARTS DATA ==>
  charts: ProjectReportCharts;
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== DATE RANGE ==>
  dateRange: {
    // <== START DATE ==>
    start: string;
    // <== END DATE ==>
    end: string;
  };
};
// <== REPORTS OVERVIEW TYPE ==>
export type ReportsOverview = {
  // <== TASKS COMPLETED THIS WEEK ==>
  tasksCompletedThisWeek: number;
  // <== TASKS COMPLETED THIS MONTH ==>
  tasksCompletedThisMonth: number;
  // <== ACTIVE TASKS ==>
  activeTasks: number;
  // <== OVERDUE TASKS ==>
  overdueTasks: number;
  // <== ACTIVE PROJECTS ==>
  activeProjects: number;
  // <== FOCUS TIME THIS WEEK (MINUTES) ==>
  focusTimeThisWeek: number;
};
// <== API RESPONSE TYPES ==>
type PersonalReportResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: PersonalReportData;
};
// <== PROJECT REPORT RESPONSE TYPE ==>
type ProjectReportResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: ProjectReportData;
};
// <== REPORTS OVERVIEW RESPONSE TYPE ==>
type ReportsOverviewResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: ReportsOverview;
};

// <== FETCH PERSONAL REPORT FUNCTION ==>
const fetchPersonalReport = async (
  period: ReportPeriod
): Promise<PersonalReportData> => {
  // FETCH PERSONAL REPORT FROM API
  const response = await apiClient.get<PersonalReportResponse>(
    `/reports/personal?period=${period}`
  );
  // RETURN DATA
  return response.data.data;
};

// <== FETCH PROJECT REPORT FUNCTION ==>
const fetchProjectReport = async (
  projectId: string,
  period: ReportPeriod
): Promise<ProjectReportData> => {
  // FETCH PROJECT REPORT FROM API
  const response = await apiClient.get<ProjectReportResponse>(
    `/reports/project/${projectId}?period=${period}`
  );
  // RETURN DATA
  return response.data.data;
};

// <== FETCH REPORTS OVERVIEW FUNCTION ==>
const fetchReportsOverview = async (): Promise<ReportsOverview> => {
  // FETCH REPORTS OVERVIEW FROM API
  const response = await apiClient.get<ReportsOverviewResponse>(
    "/reports/overview"
  );
  // RETURN DATA
  return response.data.data;
};

// <== USE PERSONAL REPORT HOOK ==>
export const usePersonalReport = (period: ReportPeriod = "month") => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH PERSONAL REPORT
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["personalReport", period],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchPersonalReport(period),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME - 5 MINUTES ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME - 10 MINUTES ==>
    gcTime: 10 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== USE PROJECT REPORT HOOK ==>
export const useProjectReport = (
  projectId: string,
  period: ReportPeriod = "month"
) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH PROJECT REPORT
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["projectReport", projectId, period],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchProjectReport(projectId, period),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!projectId,
    // <== STALE TIME - 5 MINUTES ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME - 10 MINUTES ==>
    gcTime: 10 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== USE REPORTS OVERVIEW HOOK ==>
export const useReportsOverview = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH REPORTS OVERVIEW
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["reportsOverview"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchReportsOverview,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME - 2 MINUTES ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME - 5 MINUTES ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
  });
};

// <== FORMAT DURATION HELPER ==>
export const formatReportDuration = (minutes: number): string => {
  // IF ZERO, RETURN 0M
  if (minutes === 0) return "0m";
  // CALCULATE HOURS
  const hours = Math.floor(minutes / 60);
  // CALCULATE REMAINING MINUTES
  const mins = Math.round(minutes % 60);
  // IF LESS THAN 1 HOUR, RETURN MINUTES ONLY
  if (hours === 0) return `${mins}m`;
  // IF MINUTES ARE 0, RETURN HOURS ONLY
  if (mins === 0) return `${hours}h`;
  // RETURN HOURS AND MINUTES
  return `${hours}h ${mins}m`;
};

// <== FORMAT HOUR HELPER ==>
export const formatProductiveHour = (hour: number | null): string => {
  // IF NULL, RETURN N/A
  if (hour === null) return "N/A";
  // FORMAT 12 HOUR TIME
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};
