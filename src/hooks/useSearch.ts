// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

// <== SEARCH RESULT ITEM TYPE INTERFACE ==>
export type SearchResultItem = {
  // <== ID ==>
  id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== TYPE ==>
  type: "task" | "project";
  // <== STATUS ==>
  status?: string;
  // <== PATH ==>
  path: string;
  // <== DUE DATE ==>
  dueDate?: string | null;
  // <== PRIORITY ==>
  priority?: string;
  // <== PROJECT ID ==>
  projectId?: string;
  // <== PROJECT TITLE ==>
  projectTitle?: string;
};
// <== SEARCH RESULTS TYPE INTERFACE ==>
export type SearchResults = {
  // <== TASKS ==>
  tasks: SearchResultItem[];
  // <== PROJECTS ==>
  projects: SearchResultItem[];
};
// <== SEARCH API RESPONSE TYPE INTERFACE ==>
type SearchApiResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== QUERY ==>
  query: string;
  // <== TOTAL COUNT ==>
  totalCount: number;
  // <== DATA ==>
  data: SearchResults;
};
// <== RECENT ITEMS API RESPONSE TYPE INTERFACE ==>
type RecentItemsApiResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: SearchResults;
};
// <== QUICK ACTION TYPE INTERFACE ==>
export type QuickAction = {
  // <== ID ==>
  id: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== ICON ==>
  icon: string;
  // <== PATH ==>
  path: string;
  // <== SHORTCUT ==>
  shortcut: string;
};
// <== QUICK ACTIONS API RESPONSE TYPE INTERFACE ==>
type QuickActionsApiResponse = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: QuickAction[];
};

// <== GLOBAL SEARCH API ==>
const globalSearchAPI = async (
  query: string,
  limit = 10,
  types?: string[]
): Promise<SearchResults> => {
  try {
    // BUILD QUERY PARAMS
    const params = new URLSearchParams();
    // ADD QUERY
    params.append("q", query);
    // ADD LIMIT
    params.append("limit", limit.toString());
    // ADD TYPES IF PROVIDED
    if (types && types.length > 0) {
      // ADD TYPES
      params.append("types", types.join(","));
    }
    // FETCH SEARCH RESULTS
    const response = await apiClient.get<SearchApiResponse>(
      `/search?${params.toString()}`
    );
    // RETURN DEFAULT IF NO DATA
    if (!response.data?.data) {
      // RETURN DEFAULT
      return { tasks: [], projects: [] };
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // IF 404, RETURN DEFAULT
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT
    if (axiosError.response?.status === 404) {
      // RETURN DEFAULT
      return { tasks: [], projects: [] };
    }
    // THROW ERROR
    throw error;
  }
};

// <== GET RECENT ITEMS API ==>
const getRecentItemsAPI = async (limit = 5): Promise<SearchResults> => {
  try {
    // FETCH RECENT ITEMS
    const response = await apiClient.get<RecentItemsApiResponse>(
      `/search/recent?limit=${limit}`
    );
    // RETURN DEFAULT IF NO DATA
    if (!response.data?.data) {
      // RETURN DEFAULT
      return { tasks: [], projects: [] };
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // IF 404, RETURN DEFAULT
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT
    if (axiosError.response?.status === 404) {
      // RETURN DEFAULT
      return { tasks: [], projects: [] };
    }
    // THROW ERROR
    throw error;
  }
};

// <== GET QUICK ACTIONS API ==>
const getQuickActionsAPI = async (): Promise<QuickAction[]> => {
  try {
    // FETCH QUICK ACTIONS
    const response = await apiClient.get<QuickActionsApiResponse>(
      "/search/actions"
    );
    // RETURN DEFAULT IF NO DATA
    if (!response.data?.data) {
      // RETURN DEFAULT
      return [];
    }
    // RETURN DATA
    return response.data.data;
  } catch (error: unknown) {
    // IF 404, RETURN DEFAULT
    const axiosError = error as AxiosError;
    // IF 404, RETURN DEFAULT
    if (axiosError.response?.status === 404) {
      // RETURN DEFAULT
      return [];
    }
    // THROW ERROR
    throw error;
  }
};

// <== USE GLOBAL SEARCH HOOK ==>
export const useGlobalSearch = (
  query: string,
  options?: { limit?: number; types?: string[]; enabled?: boolean }
) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // SEARCH QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["globalSearch", query, options?.limit, options?.types],
    // <== QUERY FUNCTION ==>
    queryFn: () => globalSearchAPI(query, options?.limit || 10, options?.types),
    // <== ENABLED ==>
    enabled:
      isAuthenticated &&
      !isLoggingOut &&
      query.trim().length > 0 &&
      options?.enabled !== false,
    // <== STALE TIME ==>
    staleTime: 30 * 1000,
    // <== GC TIME ==>
    gcTime: 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== RETRY ==>
    retry: 1,
  });
};

// <== USE RECENT ITEMS HOOK ==>
export const useRecentItems = (limit = 5) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RECENT ITEMS QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["recentItems", limit],
    // <== QUERY FUNCTION ==>
    queryFn: () => getRecentItemsAPI(limit),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== RETRY ==>
    retry: 1,
  });
};

// <== USE QUICK ACTIONS HOOK ==>
export const useQuickActions = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // QUICK ACTIONS QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["quickActions"],
    // <== QUERY FUNCTION ==>
    queryFn: getQuickActionsAPI,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 10 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 30 * 60 * 1000,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== RETRY ==>
    retry: 1,
  });
};
