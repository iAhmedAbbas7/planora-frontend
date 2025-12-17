// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== GOAL TYPE ENUM ==>
export type GoalType = "objective" | "key_result" | "milestone";

// <== GOAL STATUS ENUM ==>
export type GoalStatus =
  | "not_started"
  | "on_track"
  | "at_risk"
  | "behind"
  | "completed"
  | "cancelled";
// <== LINKED PROJECT TYPE ==>
export type LinkedProject = {
  // <== ID FIELD ==>
  _id: string;
  // <== TITLE FIELD ==>
  title: string;
  // <== STATUS FIELD ==>
  status: string;
};
// <== LINKED TASK TYPE ==>
export type LinkedTask = {
  // <== ID FIELD ==>
  _id: string;
  // <== TITLE FIELD ==>
  title: string;
  // <== STATUS FIELD ==>
  status: string;
  // <== PRIORITY FIELD ==>
  priority: string;
};
// <== PARENT GOAL TYPE ==>
export type ParentGoal = {
  // <== ID FIELD ==>
  _id: string;
  // <== TITLE FIELD ==>
  title: string;
  // <== TYPE FIELD ==>
  type: GoalType;
  // <== STATUS FIELD ==>
  status: GoalStatus;
  // <== PROGRESS FIELD ==>
  progress?: number;
};
// <== GOAL TYPE ==>
export type Goal = {
  // <== ID FIELD ==>
  _id: string;
  // <== USER ID FIELD ==>
  userId: string;
  // <== WORKSPACE ID FIELD ==>
  workspaceId?: string;
  // <== TITLE FIELD ==>
  title: string;
  // <== DESCRIPTION FIELD ==>
  description?: string;
  // <== TYPE FIELD ==>
  type: GoalType;
  // <== PARENT GOAL FIELD ==>
  parentGoal?: ParentGoal | string;
  // <== LINKED PROJECTS FIELD ==>
  linkedProjects: LinkedProject[];
  // <== LINKED TASKS FIELD ==>
  linkedTasks: LinkedTask[];
  // <== TARGET VALUE FIELD ==>
  targetValue: number;
  // <== CURRENT VALUE FIELD ==>
  currentValue: number;
  // <== UNIT FIELD ==>
  unit: string;
  // <== START DATE FIELD ==>
  startDate?: string;
  // <== DEADLINE FIELD ==>
  deadline?: string;
  // <== STATUS FIELD ==>
  status: GoalStatus;
  // <== PROGRESS FIELD ==>
  progress: number;
  // <== COLOR FIELD ==>
  color?: string;
  // <== ICON FIELD ==>
  icon?: string;
  // <== QUARTER FIELD ==>
  quarter?: string;
  // <== YEAR FIELD ==>
  year?: number;
  // <== IS ARCHIVED FIELD ==>
  isArchived: boolean;
  // <== CREATED AT FIELD ==>
  createdAt: string;
  // <== UPDATED AT FIELD ==>
  updatedAt: string;
  // <== CHILD GOALS FIELD ==>
  childGoals?: Goal[];
  // <== KEY RESULTS FIELD ==>
  keyResults?: Goal[];
};
// <== CREATE GOAL INPUT TYPE ==>
export type CreateGoalInput = {
  // <== TITLE FIELD ==>
  title: string;
  // <== DESCRIPTION FIELD ==>
  description?: string;
  // <== TYPE FIELD ==>
  type?: GoalType;
  // <== PARENT GOAL FIELD ==>
  parentGoal?: string;
  // <== LINKED PROJECTS FIELD ==>
  linkedProjects?: string[];
  // <== LINKED TASKS FIELD ==>
  linkedTasks?: string[];
  // <== TARGET VALUE FIELD ==>
  targetValue?: number;
  // <== CURRENT VALUE FIELD ==>
  currentValue?: number;
  // <== UNIT FIELD ==>
  unit?: string;
  // <== START DATE FIELD ==>
  startDate?: string;
  // <== DEADLINE FIELD ==>
  deadline?: string;
  // <== STATUS FIELD ==>
  status?: GoalStatus;
  // <== COLOR FIELD ==>
  color?: string;
  // <== ICON FIELD ==>
  icon?: string;
  // <== QUARTER FIELD ==>
  quarter?: string;
  // <== YEAR FIELD ==>
  year?: number;
  // <== WORKSPACE ID FIELD ==>
  workspaceId?: string;
};
// <== UPDATE GOAL INPUT TYPE ==>
export type UpdateGoalInput = Partial<CreateGoalInput> & {
  // <== IS ARCHIVED FIELD ==>
  isArchived?: boolean;
};
// <== GOAL STATS TYPE ==>
export type GoalStats = {
  // <== TOTAL GOALS FIELD ==>
  totalGoals: number;
  // <== COMPLETED GOALS FIELD ==>
  completedGoals: number;
  // <== AT RISK GOALS FIELD ==>
  atRiskGoals: number;
  // <== AVG PROGRESS FIELD ==>
  avgProgress: number;
  // <== COMPLETION RATE FIELD ==>
  completionRate: number;
  // <== BY STATUS FIELD ==>
  byStatus: Record<string, number>;
  // <== BY TYPE FIELD ==>
  byType: Record<string, number>;
};
// <== GOAL FILTERS TYPE ==>
export type GoalFilters = {
  // <== STATUS FIELD ==>
  status?: GoalStatus;
  // <== TYPE FIELD ==>
  type?: GoalType;
  // <== QUARTER FIELD ==>
  quarter?: string;
  // <== YEAR FIELD ==>
  year?: string;
  // <== WORKSPACE ID FIELD ==>
  workspaceId?: string;
  // <== INCLUDE ARCHIVED FIELD ==>
  includeArchived?: boolean;
  // <== PARENT GOAL FIELD ==>
  parentGoal?: string | "null";
};
// <== HIERARCHY FILTERS TYPE ==>
type HierarchyFilters = {
  // <== QUARTER FIELD ==>
  quarter?: string;
  // <== YEAR FIELD ==>
  year?: string;
  // <== WORKSPACE ID FIELD ==>
  workspaceId?: string;
  // <== INCLUDE ARCHIVED FIELD ==>
  includeArchived?: boolean;
};
// <== STATS FILTERS TYPE ==>
type StatsFilters = {
  // <== QUARTER FIELD ==>
  quarter?: string;
  // <== YEAR FIELD ==>
  year?: string;
  // <== WORKSPACE ID FIELD ==>
  workspaceId?: string;
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS FIELD ==>
  success: boolean;
  // <== MESSAGE FIELD ==>
  message: string;
  // <== DATA FIELD ==>
  data: T;
};
// <== LINK TASK TO GOAL PARAMS TYPE ==>
type LinkTaskParams = {
  // <== GOAL ID FIELD ==>
  goalId: string;
  // <== TASK ID FIELD ==>
  taskId: string;
};
// <== LINK PROJECT TO GOAL PARAMS TYPE ==>
type LinkProjectParams = {
  // <== GOAL ID FIELD ==>
  goalId: string;
  // <== PROJECT ID FIELD ==>
  projectId: string;
};
// <== STATUS CONFIG TYPE ==>
type StatusConfig = {
  // <== LABEL FIELD ==>
  label: string;
  // <== COLOR FIELD ==>
  color: string;
  // <== BG FIELD ==>
  bg: string;
};
// <== TYPE CONFIG TYPE ==>
type TypeConfig = {
  // <== LABEL FIELD ==>
  label: string;
  // <== COLOR FIELD ==>
  color: string;
  // <== ICON FIELD ==>
  icon: string;
};
// <== QUARTER OPTION TYPE ==>
type QuarterOption = {
  // <== VALUE FIELD ==>
  value: string;
  // <== LABEL FIELD ==>
  label: string;
};

// <== FETCH GOALS FUNCTION ==>
const fetchGoals = async (filters?: GoalFilters): Promise<Goal[]> => {
  // BUILD QUERY PARAMS
  const params = new URLSearchParams();
  // ADD STATUS FILTER IF PROVIDED
  if (filters?.status) params.append("status", filters.status);
  // ADD TYPE FILTER IF PROVIDED
  if (filters?.type) params.append("type", filters.type);
  // ADD QUARTER FILTER IF PROVIDED
  if (filters?.quarter) params.append("quarter", filters.quarter);
  // ADD YEAR FILTER IF PROVIDED
  if (filters?.year) params.append("year", filters.year);
  // ADD WORKSPACE ID FILTER IF PROVIDED
  if (filters?.workspaceId) params.append("workspaceId", filters.workspaceId);
  // ADD INCLUDE ARCHIVED FILTER IF PROVIDED
  if (filters?.includeArchived) params.append("includeArchived", "true");
  // ADD PARENT GOAL FILTER IF PROVIDED
  if (filters?.parentGoal) params.append("parentGoal", filters.parentGoal);
  // SENDING FETCH GOALS REQUEST TO API
  const response = await apiClient.get<ApiResponse<Goal[]>>(
    `/goals?${params.toString()}`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== FETCH GOAL BY ID FUNCTION ==>
const fetchGoalById = async (id: string): Promise<Goal> => {
  // SENDING FETCH GOAL BY ID REQUEST TO API
  const response = await apiClient.get<ApiResponse<Goal>>(`/goals/${id}`);
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== FETCH GOALS HIERARCHY FUNCTION ==>
const fetchGoalsHierarchy = async (
  filters?: HierarchyFilters
): Promise<Goal[]> => {
  // BUILD QUERY PARAMS
  const params = new URLSearchParams();
  // ADD QUARTER FILTER IF PROVIDED
  if (filters?.quarter) params.append("quarter", filters.quarter);
  // ADD YEAR FILTER IF PROVIDED
  if (filters?.year) params.append("year", filters.year);
  // ADD WORKSPACE ID FILTER IF PROVIDED
  if (filters?.workspaceId) params.append("workspaceId", filters.workspaceId);
  // ADD INCLUDE ARCHIVED FILTER IF PROVIDED
  if (filters?.includeArchived) params.append("includeArchived", "true");
  // SENDING FETCH GOALS HIERARCHY REQUEST TO API
  const response = await apiClient.get<ApiResponse<Goal[]>>(
    `/goals/hierarchy?${params.toString()}`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== FETCH GOAL STATS FUNCTION ==>
const fetchGoalStats = async (filters?: StatsFilters): Promise<GoalStats> => {
  // BUILD QUERY PARAMS
  const params = new URLSearchParams();
  // ADD QUARTER FILTER IF PROVIDED
  if (filters?.quarter) params.append("quarter", filters.quarter);
  // ADD YEAR FILTER IF PROVIDED
  if (filters?.year) params.append("year", filters.year);
  // ADD WORKSPACE ID FILTER IF PROVIDED
  if (filters?.workspaceId) params.append("workspaceId", filters.workspaceId);
  // SENDING FETCH GOAL STATS REQUEST TO API
  const response = await apiClient.get<ApiResponse<GoalStats>>(
    `/goals/stats?${params.toString()}`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CREATE GOAL FUNCTION ==>
const createGoal = async (input: CreateGoalInput): Promise<Goal> => {
  // SENDING CREATE GOAL REQUEST TO API
  const response = await apiClient.post<ApiResponse<Goal>>("/goals", input);
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== UPDATE GOAL FUNCTION ==>
const updateGoal = async ({
  id,
  ...input
}: UpdateGoalInput & { id: string }): Promise<Goal> => {
  // SENDING UPDATE GOAL REQUEST TO API
  const response = await apiClient.put<ApiResponse<Goal>>(
    `/goals/${id}`,
    input
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== DELETE GOAL FUNCTION ==>
const deleteGoal = async (id: string): Promise<void> => {
  // SENDING DELETE GOAL REQUEST TO API
  await apiClient.delete(`/goals/${id}`);
};

// <== LINK TASK TO GOAL FUNCTION ==>
const linkTaskToGoal = async ({
  goalId,
  taskId,
}: LinkTaskParams): Promise<Goal> => {
  // SENDING LINK TASK TO GOAL REQUEST TO API
  const response = await apiClient.post<ApiResponse<Goal>>(
    `/goals/${goalId}/link-task`,
    { taskId }
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== UNLINK TASK FROM GOAL FUNCTION ==>
const unlinkTaskFromGoal = async ({
  goalId,
  taskId,
}: LinkTaskParams): Promise<Goal> => {
  // SENDING UNLINK TASK FROM GOAL REQUEST TO API
  const response = await apiClient.delete<ApiResponse<Goal>>(
    `/goals/${goalId}/unlink-task/${taskId}`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== LINK PROJECT TO GOAL FUNCTION ==>
const linkProjectToGoal = async ({
  goalId,
  projectId,
}: LinkProjectParams): Promise<Goal> => {
  // SENDING LINK PROJECT TO GOAL REQUEST TO API
  const response = await apiClient.post<ApiResponse<Goal>>(
    `/goals/${goalId}/link-project`,
    { projectId }
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== UNLINK PROJECT FROM GOAL FUNCTION ==>
const unlinkProjectFromGoal = async ({
  goalId,
  projectId,
}: LinkProjectParams): Promise<Goal> => {
  // SENDING UNLINK PROJECT FROM GOAL REQUEST TO API
  const response = await apiClient.delete<ApiResponse<Goal>>(
    `/goals/${goalId}/unlink-project/${projectId}`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== CALCULATE PROGRESS FUNCTION ==>
const calculateProgress = async (goalId: string): Promise<Goal> => {
  // SENDING CALCULATE PROGRESS REQUEST TO API
  const response = await apiClient.post<ApiResponse<Goal>>(
    `/goals/${goalId}/calculate-progress`
  );
  // RETURN DATA FROM RESPONSE
  return response.data.data;
};

// <== USE GOALS HOOK ==>
export const useGoals = (filters?: GoalFilters) => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<Goal[], AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goals", filters],
    // QUERY FUNCTION
    queryFn: () => fetchGoals(filters),
    // ENABLE QUERY ONLY IF AUTHENTICATED AND NOT LOGGING OUT
    enabled: isAuthenticated && !isLoggingOut,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // GARBAGE COLLECTION TIME (5 MINUTES)
    gcTime: 5 * 60 * 1000,
  });
};

// <== USE GOAL HOOK ==>
export const useGoal = (id: string) => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<Goal, AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goal", id],
    // QUERY FUNCTION
    queryFn: () => fetchGoalById(id),
    // ENABLE QUERY ONLY IF AUTHENTICATED, NOT LOGGING OUT, AND ID EXISTS
    enabled: isAuthenticated && !isLoggingOut && !!id,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // GARBAGE COLLECTION TIME (5 MINUTES)
    gcTime: 5 * 60 * 1000,
  });
};

// <== USE GOALS HIERARCHY HOOK ==>
export const useGoalsHierarchy = (filters?: HierarchyFilters) => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<Goal[], AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goalsHierarchy", filters],
    // QUERY FUNCTION
    queryFn: () => fetchGoalsHierarchy(filters),
    // ENABLE QUERY ONLY IF AUTHENTICATED AND NOT LOGGING OUT
    enabled: isAuthenticated && !isLoggingOut,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // GARBAGE COLLECTION TIME (5 MINUTES)
    gcTime: 5 * 60 * 1000,
  });
};

// <== USE GOAL STATS HOOK ==>
export const useGoalStats = (filters?: StatsFilters) => {
  // GET AUTH STORE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN QUERY HOOK
  return useQuery<GoalStats, AxiosError<{ message?: string }>>({
    // QUERY KEY
    queryKey: ["goalStats", filters],
    // QUERY FUNCTION
    queryFn: () => fetchGoalStats(filters),
    // ENABLE QUERY ONLY IF AUTHENTICATED AND NOT LOGGING OUT
    enabled: isAuthenticated && !isLoggingOut,
    // STALE TIME (2 MINUTES)
    staleTime: 2 * 60 * 1000,
    // GARBAGE COLLECTION TIME (5 MINUTES)
    gcTime: 5 * 60 * 1000,
  });
};

// <== USE CREATE GOAL HOOK ==>
export const useCreateGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, CreateGoalInput>({
    // MUTATION FUNCTION
    mutationFn: createGoal,
    // ON SUCCESS HANDLER
    onSuccess: () => {
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // INVALIDATE GOALS HIERARCHY QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalsHierarchy"] });
      // INVALIDATE GOAL STATS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Goal created successfully!");
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to create goal");
    },
  });
};

// <== USE UPDATE GOAL HOOK ==>
export const useUpdateGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<
    Goal,
    AxiosError<{ message?: string }>,
    UpdateGoalInput & { id: string }
  >({
    // MUTATION FUNCTION
    mutationFn: updateGoal,
    // ON SUCCESS HANDLER
    onSuccess: (_, variables) => {
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // INVALIDATE SPECIFIC GOAL QUERY
      queryClient.invalidateQueries({ queryKey: ["goal", variables.id] });
      // INVALIDATE GOALS HIERARCHY QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalsHierarchy"] });
      // INVALIDATE GOAL STATS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Goal updated successfully!");
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to update goal");
    },
  });
};

// <== USE DELETE GOAL HOOK ==>
export const useDeleteGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<void, AxiosError<{ message?: string }>, string>({
    // MUTATION FUNCTION
    mutationFn: deleteGoal,
    // ON SUCCESS HANDLER
    onSuccess: () => {
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // INVALIDATE GOALS HIERARCHY QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalsHierarchy"] });
      // INVALIDATE GOAL STATS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalStats"] });
      // SHOW SUCCESS TOAST
      toast.success("Goal deleted successfully!");
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to delete goal");
    },
  });
};

// <== USE LINK TASK TO GOAL HOOK ==>
export const useLinkTaskToGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, LinkTaskParams>({
    // MUTATION FUNCTION
    mutationFn: linkTaskToGoal,
    // ON SUCCESS HANDLER
    onSuccess: (_, variables) => {
      // INVALIDATE SPECIFIC GOAL QUERY
      queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // SHOW SUCCESS TOAST
      toast.success("Task linked to goal!");
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to link task");
    },
  });
};

// <== USE UNLINK TASK FROM GOAL HOOK ==>
export const useUnlinkTaskFromGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, LinkTaskParams>({
    // MUTATION FUNCTION
    mutationFn: unlinkTaskFromGoal,
    // ON SUCCESS HANDLER
    onSuccess: (_, variables) => {
      // INVALIDATE SPECIFIC GOAL QUERY
      queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // SHOW SUCCESS TOAST
      toast.success("Task unlinked from goal!");
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to unlink task");
    },
  });
};

// <== USE LINK PROJECT TO GOAL HOOK ==>
export const useLinkProjectToGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, LinkProjectParams>(
    {
      // MUTATION FUNCTION
      mutationFn: linkProjectToGoal,
      // ON SUCCESS HANDLER
      onSuccess: (_, variables) => {
        // INVALIDATE SPECIFIC GOAL QUERY
        queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
        // INVALIDATE GOALS QUERIES
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        // SHOW SUCCESS TOAST
        toast.success("Project linked to goal!");
      },
      // ON ERROR HANDLER
      onError: (error) => {
        // SHOW ERROR TOAST
        toast.error(error.response?.data?.message || "Failed to link project");
      },
    }
  );
};

// <== USE UNLINK PROJECT FROM GOAL HOOK ==>
export const useUnlinkProjectFromGoal = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, LinkProjectParams>(
    {
      // MUTATION FUNCTION
      mutationFn: unlinkProjectFromGoal,
      // ON SUCCESS HANDLER
      onSuccess: (_, variables) => {
        // INVALIDATE SPECIFIC GOAL QUERY
        queryClient.invalidateQueries({ queryKey: ["goal", variables.goalId] });
        // INVALIDATE GOALS QUERIES
        queryClient.invalidateQueries({ queryKey: ["goals"] });
        // SHOW SUCCESS TOAST
        toast.success("Project unlinked from goal!");
      },
      // ON ERROR HANDLER
      onError: (error) => {
        // SHOW ERROR TOAST
        toast.error(
          error.response?.data?.message || "Failed to unlink project"
        );
      },
    }
  );
};

// <== USE CALCULATE PROGRESS HOOK ==>
export const useCalculateProgress = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN MUTATION HOOK
  return useMutation<Goal, AxiosError<{ message?: string }>, string>({
    // MUTATION FUNCTION
    mutationFn: calculateProgress,
    // ON SUCCESS HANDLER
    onSuccess: (_, goalId) => {
      // INVALIDATE SPECIFIC GOAL QUERY
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] });
      // INVALIDATE GOALS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      // INVALIDATE GOALS HIERARCHY QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalsHierarchy"] });
      // INVALIDATE GOAL STATS QUERIES
      queryClient.invalidateQueries({ queryKey: ["goalStats"] });
    },
    // ON ERROR HANDLER
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to calculate progress"
      );
    },
  });
};

// <== HELPER: GET STATUS CONFIG ==>
export const GOAL_STATUS_CONFIG: Record<GoalStatus, StatusConfig> = {
  // <== NOT STARTED CONFIG ==>
  not_started: {
    label: "Not Started",
    color: "text-gray-500",
    bg: "bg-gray-500/10",
  },
  // <== ON TRACK CONFIG ==>
  on_track: {
    label: "On Track",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  // <== AT RISK CONFIG ==>
  at_risk: {
    label: "At Risk",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  // <== BEHIND CONFIG ==>
  behind: {
    label: "Behind",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  // <== COMPLETED CONFIG ==>
  completed: {
    label: "Completed",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  // <== CANCELLED CONFIG ==>
  cancelled: {
    label: "Cancelled",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
  },
};

// <== HELPER: GET TYPE CONFIG ==>
export const GOAL_TYPE_CONFIG: Record<GoalType, TypeConfig> = {
  // <== OBJECTIVE CONFIG ==>
  objective: {
    label: "Objective",
    color: "#6366f1",
    icon: "target",
  },
  // <== KEY RESULT CONFIG ==>
  key_result: {
    label: "Key Result",
    color: "#10b981",
    icon: "check-circle",
  },
  // <== MILESTONE CONFIG ==>
  milestone: {
    label: "Milestone",
    color: "#f59e0b",
    icon: "flag",
  },
};

// <== HELPER: GET QUARTER OPTIONS ==>
export const QUARTER_OPTIONS: QuarterOption[] = [
  // <== Q1 OPTION ==>
  { value: "Q1", label: "Q1 (Jan-Mar)" },
  // <== Q2 OPTION ==>
  { value: "Q2", label: "Q2 (Apr-Jun)" },
  // <== Q3 OPTION ==>
  { value: "Q3", label: "Q3 (Jul-Sep)" },
  // <== Q4 OPTION ==>
  { value: "Q4", label: "Q4 (Oct-Dec)" },
];

// <== HELPER: GET CURRENT QUARTER ==>
export const getCurrentQuarter = (): string => {
  // GET CURRENT MONTH
  const month = new Date().getMonth();
  // RETURN Q1 IF MONTH IS JAN-MAR
  if (month < 3) return "Q1";
  // RETURN Q2 IF MONTH IS APR-JUN
  if (month < 6) return "Q2";
  // RETURN Q3 IF MONTH IS JUL-SEP
  if (month < 9) return "Q3";
  // RETURN Q4 IF MONTH IS OCT-DEC
  return "Q4";
};

// <== HELPER: GET CURRENT YEAR ==>
export const getCurrentYear = (): number => {
  // RETURN CURRENT YEAR
  return new Date().getFullYear();
};
