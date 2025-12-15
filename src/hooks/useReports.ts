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
// <== WORKSPACE REPORT TYPES ==>
export type WorkspaceInfo = {
  // <== WORKSPACE ID ==>
  id: string;
  // <== WORKSPACE NAME ==>
  name: string;
  // <== WORKSPACE DESCRIPTION ==>
  description?: string;
  // <== WORKSPACE VISIBILITY ==>
  visibility: string;
  // <== MEMBER COUNT ==>
  memberCount: number;
  // <== PROJECT COUNT ==>
  projectCount: number;
};
// <== WORKSPACE SUMMARY TYPE ==>
export type WorkspaceSummary = {
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
  // <== COMPLETED IN PERIOD ==>
  completedInPeriod: number;
  // <== COMPLETION RATE ==>
  completionRate: number;
  // <== TEAM VELOCITY ==>
  teamVelocity: number;
};
// <== MEMBER CONTRIBUTION TYPE ==>
export type MemberContribution = {
  // <== MEMBER ID ==>
  memberId: string;
  // <== USERNAME ==>
  username: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== AVATAR ==>
  avatar?: string;
  // <== TASKS COMPLETED ==>
  tasksCompleted: number;
  // <== HIGH PRIORITY ==>
  highPriority: number;
};
// <== VELOCITY DATA TYPE ==>
export type VelocityData = {
  // <== WEEK ==>
  week: string;
  // <== COMPLETED ==>
  completed: number;
};
// <== PROJECT STATUS DATA TYPE ==>
export type ProjectStatusData = {
  // <== STATUS ==>
  status: string;
  // <== COUNT ==>
  count: number;
};
// <== MEMBER ACTIVITY DATA TYPE ==>
export type MemberActivityData = {
  // <== DATE ==>
  date: string;
  // <== COMMITS ==>
  commits: number;
  // <== TASKS ==>
  tasks: number;
  // <== PULL REQUESTS ==>
  pullRequests: number;
};
// <== WORKSPACE REPORT CHARTS TYPE ==>
export type WorkspaceReportCharts = {
  // <== WEEKLY VELOCITY ==>
  weeklyVelocity: VelocityData[];
  // <== PROJECT STATUS ==>
  projectStatus: ProjectStatusData[];
  // <== MEMBER ACTIVITY TREND ==>
  memberActivityTrend: MemberActivityData[];
};
// <== WORKSPACE REPORT DATA TYPE ==>
export type WorkspaceReportData = {
  // <== WORKSPACE INFO ==>
  workspace: WorkspaceInfo;
  // <== SUMMARY ==>
  summary: WorkspaceSummary;
  // <== MEMBERS ==>
  members: MemberContribution[];
  // <== CHARTS DATA ==>
  charts: WorkspaceReportCharts;
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
// <== WORKSPACE REPORT RESPONSE TYPE ==>
type WorkspaceReportResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: WorkspaceReportData;
};
// <== SHARED REPORT TYPE ==>
export type SharedReportData = {
  // <== ID ==>
  id: string;
  // <== REPORT TYPE ==>
  reportType: "personal" | "project" | "workspace";
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== SHARE URL ==>
  shareUrl: string;
  // <== SHARE TOKEN ==>
  shareToken: string;
  // <== PROJECT NAME ==>
  projectName: string | null;
  // <== WORKSPACE NAME ==>
  workspaceName: string | null;
  // <== ACCESS COUNT ==>
  accessCount: number;
  // <== LAST ACCESSED AT ==>
  lastAccessedAt: string | null;
  // <== EXPIRES AT ==>
  expiresAt: string;
  // <== CREATED AT ==>
  createdAt: string;
};
// <== CREATE SHARE LINK REQUEST TYPE ==>
export type CreateShareLinkRequest = {
  // <== REPORT TYPE ==>
  reportType: "personal" | "project" | "workspace";
  // <== PROJECT ID (FOR PROJECT REPORTS) ==>
  projectId?: string;
  // <== WORKSPACE ID (FOR WORKSPACE REPORTS) ==>
  workspaceId?: string;
  // <== PERIOD ==>
  period: ReportPeriod;
  // <== EXPIRES IN DAYS ==>
  expiresInDays: number;
};
// <== CREATE SHARE LINK RESPONSE TYPE ==>
export type CreateShareLinkResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: {
    // <== SHARE URL ==>
    shareUrl: string;
    // <== SHARE TOKEN ==>
    shareToken: string;
    // <== EXPIRES AT ==>
    expiresAt: string;
    // <== REPORT TYPE ==>
    reportType: string;
    // <== PERIOD ==>
    period: string;
  };
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

// <== FETCH WORKSPACE REPORT FUNCTION ==>
const fetchWorkspaceReport = async (
  workspaceId: string,
  period: ReportPeriod
): Promise<WorkspaceReportData> => {
  // FETCH WORKSPACE REPORT FROM API
  const response = await apiClient.get<WorkspaceReportResponse>(
    `/reports/workspace/${workspaceId}?period=${period}`
  );
  // RETURN DATA
  return response.data.data;
};

// <== USE WORKSPACE REPORT HOOK ==>
export const useWorkspaceReport = (
  workspaceId: string,
  period: ReportPeriod = "month"
) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH WORKSPACE REPORT
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["workspaceReport", workspaceId, period],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchWorkspaceReport(workspaceId, period),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!workspaceId,
    // <== STALE TIME - 5 MINUTES ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME - 10 MINUTES ==>
    gcTime: 10 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
};

// <== EXPORT PERSONAL REPORT TO EXCEL ==>
export const exportPersonalReportToExcel = async (
  period: ReportPeriod
): Promise<void> => {
  // FETCH EXCEL FILE FROM API
  const response = await apiClient.get(
    `/reports/export/excel/personal?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute("download", `planora-personal-report-${period}.xlsx`);
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== EXPORT PROJECT REPORT TO EXCEL ==>
export const exportProjectReportToExcel = async (
  projectId: string,
  period: ReportPeriod,
  projectName?: string
): Promise<void> => {
  // FETCH EXCEL FILE FROM API
  const response = await apiClient.get(
    `/reports/export/excel/project/${projectId}?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // SANITIZE PROJECT NAME FOR FILENAME
  const sanitizedName = projectName
    ? projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    : "project";
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute(
    "download",
    `planora-project-${sanitizedName}-${period}.xlsx`
  );
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== EXPORT WORKSPACE REPORT TO EXCEL ==>
export const exportWorkspaceReportToExcel = async (
  workspaceId: string,
  period: ReportPeriod,
  workspaceName?: string
): Promise<void> => {
  // FETCH EXCEL FILE FROM API
  const response = await apiClient.get(
    `/reports/export/excel/workspace/${workspaceId}?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // SANITIZE WORKSPACE NAME FOR FILENAME
  const sanitizedName = workspaceName
    ? workspaceName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    : "workspace";
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute(
    "download",
    `planora-workspace-${sanitizedName}-${period}.xlsx`
  );
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== EXPORT PERSONAL REPORT TO PDF ==>
export const exportPersonalReportToPDF = async (
  period: ReportPeriod
): Promise<void> => {
  // FETCH PDF FILE FROM API
  const response = await apiClient.get(
    `/reports/export/pdf/personal?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute("download", `planora-personal-report-${period}.pdf`);
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== EXPORT PROJECT REPORT TO PDF ==>
export const exportProjectReportToPDF = async (
  projectId: string,
  period: ReportPeriod,
  projectName?: string
): Promise<void> => {
  // FETCH PDF FILE FROM API
  const response = await apiClient.get(
    `/reports/export/pdf/project/${projectId}?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // SANITIZE PROJECT NAME FOR FILENAME
  const sanitizedName = projectName
    ? projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    : "project";
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute(
    "download",
    `planora-project-${sanitizedName}-${period}.pdf`
  );
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== EXPORT WORKSPACE REPORT TO PDF ==>
export const exportWorkspaceReportToPDF = async (
  workspaceId: string,
  period: ReportPeriod,
  workspaceName?: string
): Promise<void> => {
  // FETCH PDF FILE FROM API
  const response = await apiClient.get(
    `/reports/export/pdf/workspace/${workspaceId}?period=${period}`,
    {
      responseType: "blob",
    }
  );
  // SANITIZE WORKSPACE NAME FOR FILENAME
  const sanitizedName = workspaceName
    ? workspaceName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    : "workspace";
  // CREATE OBJECT URL
  const url = window.URL.createObjectURL(new Blob([response.data]));
  // CREATE LINK ELEMENT
  const link = document.createElement("a");
  // SET LINK HREF
  link.href = url;
  // SET LINK ATTRIBUTE
  link.setAttribute(
    "download",
    `planora-workspace-${sanitizedName}-${period}.pdf`
  );
  // APPEND LINK TO BODY
  document.body.appendChild(link);
  // CLICK LINK
  link.click();
  // REMOVE LINK FROM BODY
  link.parentNode?.removeChild(link);
  // REVOKE OBJECT URL
  window.URL.revokeObjectURL(url);
};

// <== CREATE SHAREABLE LINK ==>
export const createShareableLink = async (
  request: CreateShareLinkRequest
): Promise<CreateShareLinkResponse["data"]> => {
  // CREATE SHAREABLE LINK
  const response = await apiClient.post<CreateShareLinkResponse>(
    "/reports/share",
    request
  );
  // RETURN DATA
  return response.data.data;
};

// <== FETCH USER SHARED REPORTS ==>
const fetchUserSharedReports = async (): Promise<SharedReportData[]> => {
  // FETCH SHARED REPORTS FROM API
  const response = await apiClient.get<{
    success: boolean;
    data: SharedReportData[];
  }>("/reports/shared-links");
  // RETURN DATA
  return response.data.data;
};

// <== USE USER SHARED REPORTS HOOK ==>
export const useUserSharedReports = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // FETCH USER SHARED REPORTS
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["userSharedReports"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchUserSharedReports,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME - 2 MINUTES ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME - 5 MINUTES ==>
    gcTime: 5 * 60 * 1000,
  });
};

// <== REVOKE SHAREABLE LINK ==>
export const revokeShareableLink = async (
  shareToken: string
): Promise<void> => {
  // REVOKE SHAREABLE LINK
  await apiClient.delete(`/reports/share/${shareToken}`);
};

// <== FETCH SHARED REPORT (PUBLIC) ==>
export const fetchSharedReport = async (
  shareToken: string
): Promise<{
  type: "personal" | "project" | "workspace";
  user?: { name: string; avatar?: string | null };
  project?: { title: string; description: string; status: string };
  workspace?: {
    name: string;
    description: string;
    memberCount: number;
    projectCount: number;
  };
  summary: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
  };
  period: ReportPeriod;
  dateRange: {
    start: string;
    end: string;
  };
}> => {
  // FETCH SHARED REPORT FROM API
  const response = await apiClient.get(`/reports/shared/${shareToken}`);
  // RETURN DATA
  return response.data.data;
};
