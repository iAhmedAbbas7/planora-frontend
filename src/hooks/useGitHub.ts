// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== GITHUB STATUS TYPE INTERFACE ==>
export type GitHubStatus = {
  // <== IS CONNECTED ==>
  isConnected: boolean;
  // <== GITHUB USERNAME ==>
  githubUsername: string | null;
  // <== CONNECTED AT ==>
  connectedAt: string | null;
  // <== SCOPES ==>
  scopes: string[];
};
// <== GITHUB PROFILE TYPE INTERFACE ==>
export type GitHubProfile = {
  // <== ID ==>
  id: number;
  // <== LOGIN ==>
  login: string;
  // <== NAME ==>
  name: string | null;
  // <== AVATAR URL ==>
  avatarUrl: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== BIO ==>
  bio: string | null;
  // <== COMPANY ==>
  company: string | null;
  // <== LOCATION ==>
  location: string | null;
  // <== PUBLIC REPOS ==>
  publicRepos: number;
  // <== PUBLIC GISTS ==>
  publicGists: number;
  // <== FOLLOWERS ==>
  followers: number;
  // <== FOLLOWING ==>
  following: number;
  // <== CREATED AT ==>
  createdAt: string;
};
// <== GITHUB REPOSITORY TYPE INTERFACE ==>
export type GitHubRepository = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== DESCRIPTION ==>
  description: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== PRIVATE ==>
  private: boolean;
  // <== FORK ==>
  fork: boolean;
  // <== LANGUAGE ==>
  language: string | null;
  // <== STARS ==>
  stars: number;
  // <== FORKS ==>
  forks: number;
  // <== OPEN ISSUES ==>
  openIssues: number;
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== PUSHED AT ==>
  pushedAt: string;
};
// <== RAW API REPOSITORY TYPE (FROM BACKEND) ==>
type RawApiRepository = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== DESCRIPTION ==>
  description: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== PRIVATE ==>
  private: boolean;
  // <== FORK ==>
  fork?: boolean;
  // <== LANGUAGE ==>
  language: string | null;
  // <== STARS COUNT ==>
  stargazersCount?: number;
  // <== FORKS COUNT ==>
  forksCount?: number;
  // <== OPEN ISSUES COUNT ==>
  openIssuesCount?: number;
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== PUSHED AT ==>
  pushedAt: string;
};
// <== RAW API PAGINATION TYPE (FROM BACKEND) ==>
type RawApiPagination = {
  // <== PAGE ==>
  page: number;
  // <== PER PAGE ==>
  perPage: number;
  // <== HAS MORE ==>
  hasMore?: boolean;
};
// <== RAW API RESPONSE TYPE (FROM BACKEND) ==>
type RawRepositoriesResponse = {
  // <== REPOSITORIES ==>
  repositories: RawApiRepository[];
  // <== PAGINATION ==>
  pagination: RawApiPagination;
};
// <== REPOSITORIES RESPONSE TYPE INTERFACE ==>
type RepositoriesResponse = {
  // <== REPOSITORIES ==>
  repositories: GitHubRepository[];
  // <== PAGINATION ==>
  pagination: {
    // <== PAGE ==>
    page: number;
    // <== PER PAGE ==>
    perPage: number;
    // <== TOTAL COUNT ==>
    totalCount: number;
    // <== HAS NEXT PAGE ==>
    hasNextPage: boolean;
    // <== HAS PREVIOUS PAGE ==>
    hasPreviousPage: boolean;
  };
};

// <== API RESPONSE TYPE INTERFACE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
};

// <== FETCH GITHUB STATUS FUNCTION ==>
const fetchGitHubStatus = async (): Promise<GitHubStatus> => {
  // FETCHING GITHUB STATUS
  const response = await apiClient.get<ApiResponse<GitHubStatus>>(
    "/github/status"
  );
  // RETURNING GITHUB STATUS DATA
  return response.data.data;
};

// <== FETCH GITHUB PROFILE FUNCTION ==>
const fetchGitHubProfile = async (): Promise<GitHubProfile> => {
  // FETCHING GITHUB PROFILE
  const response = await apiClient.get<ApiResponse<GitHubProfile>>(
    "/github/profile"
  );
  // RETURNING GITHUB PROFILE DATA
  return response.data.data;
};

// <== FETCH REPOSITORIES FUNCTION ==>
const fetchRepositories = async (
  page: number = 1,
  perPage: number = 20,
  type: string = "all",
  sort: string = "updated"
): Promise<RepositoriesResponse> => {
  // FETCHING REPOSITORIES
  const response = await apiClient.get<ApiResponse<RawRepositoriesResponse>>(
    "/github/repositories",
    {
      params: { page, per_page: perPage, type, sort },
    }
  );
  // GET RAW DATA
  const rawData = response.data.data;
  // MAP REPOSITORIES TO EXPECTED FORMAT
  const mappedRepositories: GitHubRepository[] = rawData.repositories.map(
    (repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      description: repo.description,
      htmlUrl: repo.htmlUrl,
      private: repo.private,
      fork: repo.fork ?? false,
      language: repo.language,
      stars: repo.stargazersCount ?? 0,
      forks: repo.forksCount ?? 0,
      openIssues: repo.openIssuesCount ?? 0,
      defaultBranch: repo.defaultBranch,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      pushedAt: repo.pushedAt,
    })
  );
  // MAP PAGINATION TO EXPECTED FORMAT
  const mappedPagination = {
    page: rawData.pagination.page,
    perPage: rawData.pagination.perPage,
    totalCount: rawData.repositories.length,
    hasNextPage: rawData.pagination.hasMore ?? false,
    hasPreviousPage: rawData.pagination.page > 1,
  };
  // RETURNING MAPPED DATA
  return {
    repositories: mappedRepositories,
    pagination: mappedPagination,
  };
};

// <== DISCONNECT GITHUB FUNCTION ==>
const disconnectGitHub = async (): Promise<void> => {
  // DISCONNECTING GITHUB
  await apiClient.delete("/github/disconnect");
};

// <== VERIFY GITHUB TOKEN FUNCTION ==>
const verifyGitHubToken = async (): Promise<{ valid: boolean }> => {
  // VERIFYING GITHUB TOKEN
  const response = await apiClient.get<ApiResponse<{ valid: boolean }>>(
    "/github/verify"
  );
  // RETURNING VERIFICATION RESULT
  return response.data.data;
};

// <== USE GITHUB STATUS HOOK ==>
export const useGitHubStatus = () => {
  // FETCH GITHUB STATUS QUERY
  const {
    data: status,
    isLoading,
    isError,
    error,
    refetch: refetchStatus,
  } = useQuery<GitHubStatus, AxiosError<{ message?: string }>>({
    queryKey: ["github-status"],
    queryFn: fetchGitHubStatus,
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });
  // RETURNING GITHUB STATUS HOOK DATA
  return {
    status,
    isLoading,
    isError,
    error,
    refetchStatus,
  };
};

// <== USE GITHUB PROFILE HOOK ==>
export const useGitHubProfile = (enabled: boolean = true) => {
  // FETCH GITHUB PROFILE QUERY
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch: refetchProfile,
  } = useQuery<GitHubProfile, AxiosError<{ message?: string }>>({
    queryKey: ["github-profile"],
    queryFn: fetchGitHubProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURNING GITHUB PROFILE HOOK DATA
  return {
    profile,
    isLoading,
    isError,
    error,
    refetchProfile,
  };
};

// <== USE GITHUB REPOSITORIES HOOK ==>
export const useGitHubRepositories = (
  page: number = 1,
  perPage: number = 20,
  type: string = "all",
  sort: string = "updated",
  enabled: boolean = true
) => {
  // FETCH REPOSITORIES QUERY
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchRepositories,
  } = useQuery<RepositoriesResponse, AxiosError<{ message?: string }>>({
    queryKey: ["github-repositories", page, perPage, type, sort],
    queryFn: () => fetchRepositories(page, perPage, type, sort),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled,
  });
  // RETURNING REPOSITORIES HOOK DATA
  return {
    repositories: data?.repositories || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    refetchRepositories,
  };
};

// <== USE DISCONNECT GITHUB HOOK ==>
export const useDisconnectGitHub = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DISCONNECT GITHUB MUTATION
  const mutation = useMutation<void, AxiosError<{ message?: string }>, void>({
    mutationFn: disconnectGitHub,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE GITHUB STATUS QUERY
      queryClient.invalidateQueries({ queryKey: ["github-status"] });
      // INVALIDATE GITHUB PROFILE QUERY
      queryClient.invalidateQueries({ queryKey: ["github-profile"] });
      // INVALIDATE GITHUB REPOSITORIES QUERY
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
    },
  });
  // RETURNING DISCONNECT GITHUB MUTATION
  return mutation;
};

// <== USE VERIFY GITHUB TOKEN HOOK ==>
export const useVerifyGitHubToken = () => {
  // VERIFY GITHUB TOKEN MUTATION
  const mutation = useMutation<
    { valid: boolean },
    AxiosError<{ message?: string }>,
    void
  >({
    mutationFn: verifyGitHubToken,
  });
  // RETURNING VERIFY GITHUB TOKEN MUTATION
  return mutation;
};

// <== GET GITHUB LINK URL FUNCTION ==>
export const getGitHubLinkUrl = (): string => {
  // GET API BASE URL
  const apiBaseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1";
  // RETURN GITHUB LINK URL
  return `${apiBaseUrl}/auth/github/link`;
};
