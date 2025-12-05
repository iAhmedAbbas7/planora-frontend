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
// <== REPOSITORY DETAILS TYPE ==>
export type RepositoryDetails = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== DESCRIPTION ==>
  description: string | null;
  // <== PRIVATE ==>
  private: boolean;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== CLONE URL ==>
  cloneUrl: string;
  // <== SSH URL ==>
  sshUrl: string;
  // <== HOMEPAGE ==>
  homepage: string | null;
  // <== LANGUAGE ==>
  language: string | null;
  // <== STARS COUNT ==>
  stargazersCount: number;
  // <== WATCHERS COUNT ==>
  watchersCount: number;
  // <== FORKS COUNT ==>
  forksCount: number;
  // <== OPEN ISSUES COUNT ==>
  openIssuesCount: number;
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
  // <== TOPICS ==>
  topics: string[];
  // <== HAS ISSUES ==>
  hasIssues: boolean;
  // <== HAS PROJECTS ==>
  hasProjects: boolean;
  // <== HAS WIKI ==>
  hasWiki: boolean;
  // <== HAS PAGES ==>
  hasPages: boolean;
  // <== HAS DOWNLOADS ==>
  hasDownloads: boolean;
  // <== ARCHIVED ==>
  archived: boolean;
  // <== VISIBILITY ==>
  visibility: string;
  // <== LICENSE ==>
  license: {
    key: string;
    name: string;
    spdxId: string;
  } | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== PUSHED AT ==>
  pushedAt: string;
  // <== SIZE ==>
  size: number;
  // <== OWNER ==>
  owner: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl: string;
  };
};
// <== COMMIT TYPE ==>
export type GitHubCommit = {
  // <== SHA ==>
  sha: string;
  // <== MESSAGE ==>
  message: string;
  // <== AUTHOR ==>
  author: {
    // <== NAME ==>
    name: string | null;
    // <== EMAIL ==>
    email: string | null;
    // <== DATE ==>
    date: string | null;
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  };
  // <== HTML URL ==>
  htmlUrl: string;
};
// <== ISSUE TYPE ==>
export type GitHubIssue = {
  // <== ID ==>
  id: number;
  // <== NUMBER ==>
  number: number;
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body: string | null;
  // <== STATE ==>
  state: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== COMMENTS COUNT ==>
  commentsCount: number;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== CLOSED AT ==>
  closedAt: string | null;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  };
  // <== LABELS ==>
  labels: {
    // <== NAME ==>
    name: string | null;
    // <== COLOR ==>
    color: string | null;
  }[];
};
// <== PULL REQUEST TYPE ==>
export type GitHubPullRequest = {
  // <== ID ==>
  id: number;
  // <== NUMBER ==>
  number: number;
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body: string | null;
  // <== STATE ==>
  state: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== DRAFT ==>
  draft: boolean;
  // <== MERGED ==>
  merged: boolean;
  // <== MERGED AT ==>
  mergedAt: string | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== CLOSED AT ==>
  closedAt: string | null;
  // <== HEAD ==>
  head: {
    // <== REF ==>
    ref: string;
    // <== SHA ==>
    sha: string;
  };
  base: {
    // <== REF ==>
    ref: string;
    // <== SHA ==>
    sha: string;
  };
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  };
  labels: {
    // <== NAME ==>
    name: string | null;
    // <== COLOR ==>
    color: string | null;
  }[];
};
// <== BRANCH TYPE ==>
export type GitHubBranch = {
  // <== NAME ==>
  name: string;
  // <== PROTECTED ==>
  protected: boolean;
  commit: {
    // <== SHA ==>
    sha: string;
    // <== URL ==>
    url: string;
  };
};
// <== CONTRIBUTOR TYPE ==>
export type GitHubContributor = {
  // <== LOGIN ==>
  login: string;
  // <== AVATAR URL ==>
  avatarUrl: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== CONTRIBUTIONS ==>
  contributions: number;
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

// <== FETCH REPOSITORY DETAILS FUNCTION ==>
const fetchRepositoryDetails = async (
  owner: string,
  repo: string
): Promise<RepositoryDetails> => {
  // FETCH REPOSITORY DETAILS
  const response = await apiClient.get<ApiResponse<RepositoryDetails>>(
    `/github/repositories/${owner}/${repo}`
  );
  // RETURN REPOSITORY DETAILS
  return response.data.data;
};

// <== FETCH REPOSITORY COMMITS FUNCTION ==>
const fetchRepositoryCommits = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ commits: GitHubCommit[]; hasMore: boolean }> => {
  // FETCH REPOSITORY COMMITS
  const response = await apiClient.get<
    ApiResponse<{ commits: GitHubCommit[]; pagination: { hasMore: boolean } }>
  >(`/github/repositories/${owner}/${repo}/commits`, {
    params: { page, per_page: perPage },
  });
  // RETURN REPOSITORY COMMITS
  return {
    commits: response.data.data.commits,
    hasMore: response.data.data.pagination.hasMore,
  };
};

// <== FETCH REPOSITORY ISSUES FUNCTION ==>
const fetchRepositoryIssues = async (
  owner: string,
  repo: string,
  state: string = "open",
  page: number = 1,
  perPage: number = 10
): Promise<{ issues: GitHubIssue[]; hasMore: boolean }> => {
  // FETCH REPOSITORY ISSUES
  const response = await apiClient.get<
    ApiResponse<{ issues: GitHubIssue[]; pagination: { hasMore: boolean } }>
  >(`/github/repositories/${owner}/${repo}/issues`, {
    params: { state, page, per_page: perPage },
  });
  // RETURN REPOSITORY ISSUES
  return {
    issues: response.data.data.issues,
    hasMore: response.data.data.pagination.hasMore,
  };
};

// <== FETCH REPOSITORY PULL REQUESTS FUNCTION ==>
const fetchRepositoryPullRequests = async (
  owner: string,
  repo: string,
  state: string = "open",
  page: number = 1,
  perPage: number = 10
): Promise<{ pullRequests: GitHubPullRequest[]; hasMore: boolean }> => {
  // FETCH REPOSITORY PULL REQUESTS
  const response = await apiClient.get<
    ApiResponse<{
      pullRequests: GitHubPullRequest[];
      pagination: { hasMore: boolean };
    }>
  >(`/github/repositories/${owner}/${repo}/pulls`, {
    params: { state, page, per_page: perPage },
  });
  // RETURN REPOSITORY PULL REQUESTS
  return {
    pullRequests: response.data.data.pullRequests,
    hasMore: response.data.data.pagination.hasMore,
  };
};

// <== FETCH REPOSITORY README FUNCTION ==>
const fetchRepositoryReadme = async (
  owner: string,
  repo: string
): Promise<string | null> => {
  // FETCH REPOSITORY README
  const response = await apiClient.get<ApiResponse<{ content: string | null }>>(
    `/github/repositories/${owner}/${repo}/readme`
  );
  // RETURN REPOSITORY README
  return response.data.data.content;
};

// <== FETCH REPOSITORY BRANCHES FUNCTION ==>
const fetchRepositoryBranches = async (
  owner: string,
  repo: string
): Promise<GitHubBranch[]> => {
  // FETCH REPOSITORY BRANCHES
  const response = await apiClient.get<
    ApiResponse<{ branches: GitHubBranch[] }>
  >(`/github/repositories/${owner}/${repo}/branches`);
  // RETURN REPOSITORY BRANCHES
  return response.data.data.branches;
};

// <== LANGUAGE DATA TYPE ==>
export type LanguageData = {
  name: string;
  bytes: number;
  percentage: string;
};

// <== FETCH REPOSITORY LANGUAGES FUNCTION ==>
const fetchRepositoryLanguages = async (
  owner: string,
  repo: string
): Promise<LanguageData[]> => {
  // FETCH REPOSITORY LANGUAGES
  const response = await apiClient.get<
    ApiResponse<{ languages: LanguageData[]; totalBytes: number }>
  >(`/github/repositories/${owner}/${repo}/languages`);
  // RETURN REPOSITORY LANGUAGES
  return response.data.data.languages;
};

// <== FETCH REPOSITORY CONTRIBUTORS FUNCTION ==>
const fetchRepositoryContributors = async (
  owner: string,
  repo: string
): Promise<GitHubContributor[]> => {
  // FETCH REPOSITORY CONTRIBUTORS
  const response = await apiClient.get<
    ApiResponse<{ contributors: GitHubContributor[] }>
  >(`/github/repositories/${owner}/${repo}/contributors`);
  // RETURN REPOSITORY CONTRIBUTORS
  return response.data.data.contributors;
};

// <== USE REPOSITORY DETAILS HOOK ==>
export const useRepositoryDetails = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY DETAILS
  const {
    data: repository,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RepositoryDetails, AxiosError<{ message?: string }>>({
    queryKey: ["github-repo-details", owner, repo],
    queryFn: () => fetchRepositoryDetails(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY DETAILS
  return { repository, isLoading, isError, error, refetch };
};

// <== USE REPOSITORY COMMITS HOOK ==>
export const useRepositoryCommits = (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 10,
  enabled: boolean = true
) => {
  // USE REPOSITORY COMMITS
  const { data, isLoading, isError, error, refetch } = useQuery<
    { commits: GitHubCommit[]; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-commits", owner, repo, page, perPage],
    queryFn: () => fetchRepositoryCommits(owner, repo, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY COMMITS
  return {
    commits: data?.commits || [],
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE REPOSITORY ISSUES HOOK ==>
export const useRepositoryIssues = (
  owner: string,
  repo: string,
  state: string = "open",
  page: number = 1,
  perPage: number = 10,
  enabled: boolean = true
) => {
  // USE REPOSITORY ISSUES
  const { data, isLoading, isError, error, refetch } = useQuery<
    { issues: GitHubIssue[]; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-issues", owner, repo, state, page, perPage],
    queryFn: () => fetchRepositoryIssues(owner, repo, state, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY ISSUES
  return {
    issues: data?.issues || [],
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE REPOSITORY PULL REQUESTS HOOK ==>
export const useRepositoryPullRequests = (
  owner: string,
  repo: string,
  state: string = "open",
  page: number = 1,
  perPage: number = 10,
  enabled: boolean = true
) => {
  // USE REPOSITORY PULL REQUESTS
  const { data, isLoading, isError, error, refetch } = useQuery<
    { pullRequests: GitHubPullRequest[]; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-pulls", owner, repo, state, page, perPage],
    queryFn: () =>
      fetchRepositoryPullRequests(owner, repo, state, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY PULL REQUESTS
  return {
    pullRequests: data?.pullRequests || [],
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE REPOSITORY README HOOK ==>
export const useRepositoryReadme = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY README
  const { data, isLoading, isError, error, refetch } = useQuery<
    string | null,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-readme", owner, repo],
    queryFn: () => fetchRepositoryReadme(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY README
  return { readme: data, isLoading, isError, error, refetch };
};

// <== USE REPOSITORY BRANCHES HOOK ==>
export const useRepositoryBranches = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY BRANCHES
  const { data, isLoading, isError, error, refetch } = useQuery<
    GitHubBranch[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-branches", owner, repo],
    queryFn: () => fetchRepositoryBranches(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY BRANCHES
  return { branches: data || [], isLoading, isError, error, refetch };
};

// <== USE REPOSITORY LANGUAGES HOOK ==>
export const useRepositoryLanguages = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY LANGUAGES
  const { data, isLoading, isError, error, refetch } = useQuery<
    LanguageData[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-languages", owner, repo],
    queryFn: () => fetchRepositoryLanguages(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY LANGUAGES
  return { languages: data || [], isLoading, isError, error, refetch };
};

// <== USE REPOSITORY CONTRIBUTORS HOOK ==>
export const useRepositoryContributors = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY CONTRIBUTORS
  const { data, isLoading, isError, error, refetch } = useQuery<
    GitHubContributor[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-contributors", owner, repo],
    queryFn: () => fetchRepositoryContributors(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY CONTRIBUTORS
  return { contributors: data || [], isLoading, isError, error, refetch };
};
