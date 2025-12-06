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
  // <== OWNER ==>
  owner: {
    login: string;
    avatarUrl?: string;
  };
};
// <== RAW API REPOSITORY TYPE ==>
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
  // <== OWNER ==>
  owner?: {
    login?: string;
    avatarUrl?: string;
  };
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
// <== CREATE REPOSITORY INPUT TYPE ==>
export type CreateRepositoryInput = {
  // <== NAME ==>
  name: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== PRIVATE ==>
  private?: boolean;
  // <== AUTO INIT ==>
  autoInit?: boolean;
  // <== GITIGNORE TEMPLATE ==>
  gitignoreTemplate?: string;
  // <== LICENSE TEMPLATE ==>
  licenseTemplate?: string;
};
// <== CREATED REPOSITORY TYPE ==>
export type CreatedRepository = {
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
  // <== DEFAULT BRANCH ==>
  defaultBranch: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== OWNER ==>
  owner: {
    login: string;
    avatarUrl: string;
  };
};
// <== FORK REPOSITORY INPUT TYPE ==>
export type ForkRepositoryInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== NEW NAME (OPTIONAL) ==>
  name?: string;
  // <== DEFAULT BRANCH ONLY ==>
  defaultBranchOnly?: boolean;
};
// <== UPDATE REPOSITORY INPUT TYPE ==>
export type UpdateRepositoryInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== NAME ==>
  name?: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== HOMEPAGE ==>
  homepage?: string;
  // <== PRIVATE ==>
  private?: boolean;
  // <== HAS ISSUES ==>
  hasIssues?: boolean;
  // <== HAS PROJECTS ==>
  hasProjects?: boolean;
  // <== HAS WIKI ==>
  hasWiki?: boolean;
  // <== ARCHIVED ==>
  archived?: boolean;
  // <== DEFAULT BRANCH ==>
  defaultBranch?: string;
};
// <== LANGUAGE DATA TYPE ==>
export type LanguageData = {
  name: string;
  bytes: number;
  percentage: string;
};
// <== GIT COMMANDS TYPE ==>
export type GitCommands = {
  // <== CLONE COMMANDS ==>
  clone: {
    // <== HTTPS ==>
    https: string;
    // <== SSH ==>
    ssh: string;
  };
  // <== ADD REMOTE COMMANDS ==>
  addRemote: {
    // <== HTTPS ==>
    https: string;
    // <== SSH ==>
    ssh: string;
  };
  // <== PUSH COMMANDS ==>
  push: {
    // <== FIRST PUSH ==>
    firstPush: string;
    // <== REGULAR ==>
    regular: string;
  };
  // <== PULL COMMAND ==>
  pull: string;
  // <== FETCH COMMAND ==>
  fetch: string;
  // <== QUICKSTART COMMANDS ==>
  quickstart: {
    // <== NEW REPO ==>
    newRepo: string[];
    // <== EXISTING REPO ==>
    existingRepo: string[];
  };
};
// <== COLLABORATOR TYPE ==>
export type Collaborator = {
  // <== ID ==>
  id: number;
  // <== LOGIN ==>
  login: string;
  // <== AVATAR URL ==>
  avatarUrl: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== PERMISSIONS ==>
  permissions?: {
    // <== ADMIN ==>
    admin: boolean;
    // <== MAINTAIN ==>
    maintain: boolean;
    // <== PUSH ==>
    push: boolean;
    // <== TRIAGE ==>
    triage: boolean;
    // <== PULL ==>
    pull: boolean;
  };
  // <== ROLE NAME ==>
  roleName?: string;
};
// <== UPDATE TOPICS INPUT TYPE ==>
export type UpdateTopicsInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TOPICS ==>
  topics: string[];
};
// <== ADD COLLABORATOR INPUT TYPE ==>
export type AddCollaboratorInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== USERNAME ==>
  username: string;
  // <== PERMISSION ==>
  permission?: "pull" | "push" | "admin" | "maintain" | "triage";
};
// <== TRANSFER REPOSITORY INPUT TYPE ==>
export type TransferRepositoryInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== NEW OWNER ==>
  newOwner: string;
  // <== TEAM IDS ==>
  teamIds?: number[];
};
// <== FILE TREE ITEM TYPE ==>
export type FileTreeItem = {
  // <== NAME ==>
  name: string;
  // <== PATH ==>
  path: string;
  // <== SHA ==>
  sha: string;
  // <== SIZE ==>
  size?: number;
  // <== TYPE ==>
  type: "file" | "dir" | "submodule" | "symlink";
  // <== DOWNLOAD URL ==>
  downloadUrl?: string | null;
  // <== HTML URL ==>
  htmlUrl?: string;
};
// <== FILE CONTENT TYPE ==>
export type FileContent = {
  // <== NAME ==>
  name: string;
  // <== PATH ==>
  path: string;
  // <== SHA ==>
  sha: string;
  // <== SIZE ==>
  size: number;
  // <== CONTENT ==>
  content: string;
  // <== ENCODING ==>
  encoding?: string;
  // <== HTML URL ==>
  htmlUrl?: string;
  // <== DOWNLOAD URL ==>
  downloadUrl?: string | null;
  // <== LANGUAGE ==>
  language: string;
  // <== EXTENSION ==>
  extension: string;
};
// <== REPOSITORY TREE TYPE ==>
export type RepositoryTree = {
  // <== SHA ==>
  sha: string;
  // <== URL ==>
  url: string;
  // <== TRUNCATED ==>
  truncated: boolean;
  // <== TREE ==>
  tree: {
    // <== PATH ==>
    path: string;
    // <== MODE ==>
    mode: string;
    // <== TYPE ==>
    type: string;
    // <== SHA ==>
    sha: string;
    // <== SIZE ==>
    size?: number;
    // <== URL ==>
    url: string;
  }[];
};
// <== FILE BLAME TYPE ==>
export type FileBlame = {
  // <== PATH ==>
  path: string;
  // <== COMMITS ==>
  commits: {
    // <== SHA ==>
    sha: string;
    // <== SHORT SHA ==>
    shortSha: string;
    // <== MESSAGE ==>
    message: string;
    // <== AUTHOR ==>
    author: {
      // <== NAME ==>
      name: string;
      // <== EMAIL ==>
      email: string;
      // <== DATE ==>
      date: string;
      // <== AVATAR URL ==>
      avatarUrl: string;
      // <== LOGIN ==>
      login: string;
    };
    // <== HTML URL ==>
    htmlUrl: string;
  }[];
  // <== TOTAL COMMITS ==>
  totalCommits: number;
};
// <== CREATE FILE INPUT TYPE ==>
export type CreateFileInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PATH ==>
  path: string;
  // <== CONTENT ==>
  content: string;
  // <== MESSAGE ==>
  message: string;
  // <== BRANCH ==>
  branch?: string;
};
// <== UPDATE FILE INPUT TYPE ==>
export type UpdateFileInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PATH ==>
  path: string;
  // <== CONTENT ==>
  content: string;
  // <== MESSAGE ==>
  message: string;
  // <== SHA ==>
  sha: string;
  // <== BRANCH ==>
  branch?: string;
};
// <== DELETE FILE INPUT TYPE ==>
export type DeleteFileInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PATH ==>
  path: string;
  // <== MESSAGE ==>
  message: string;
  // <== SHA ==>
  sha: string;
  // <== BRANCH ==>
  branch?: string;
};
// <== FILE OPERATION RESULT TYPE ==>
export type FileOperationResult = {
  // <== PATH ==>
  path?: string;
  // <== SHA ==>
  sha?: string;
  // <== HTML URL ==>
  htmlUrl?: string;
  // <== COMMIT ==>
  commit: {
    // <== SHA ==>
    sha: string;
    // <== MESSAGE ==>
    message: string;
    // <== HTML URL ==>
    htmlUrl: string;
  };
};
// <== COMMIT DETAILS TYPE ==>
export type CommitDetails = {
  // <== SHA ==>
  sha: string;
  // <== NODE ID ==>
  nodeId: string;
  // <== MESSAGE ==>
  message: string;
  // <== AUTHOR ==>
  author: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    // <== DATE ==>
    date?: string;
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== COMMITTER ==>
  committer: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    // <== DATE ==>
    date?: string;
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== TREE ==>
  tree: {
    // <== SHA ==>
    sha: string;
    // <== URL ==>
    url: string;
  };
  // <== PARENTS ==>
  parents: {
    // <== SHA ==>
    sha: string;
    // <== URL ==>
    url: string;
  }[];
  // <== HTML URL ==>
  htmlUrl: string;
  // <== STATS ==>
  stats?: {
    // <== ADDITIONS ==>
    additions: number;
    // <== DELETIONS ==>
    deletions: number;
    // <== TOTAL ==>
    total: number;
  };
  // <== FILES ==>
  files?: CommitFile[];
  // <== VERIFIED ==>
  verified?: boolean;
  // <== VERIFICATION REASON ==>
  verificationReason?: string;
};
// <== COMMIT FILE TYPE ==>
export type CommitFile = {
  // <== SHA ==>
  sha: string;
  // <== FILENAME ==>
  filename: string;
  // <== STATUS ==>
  status: string;
  // <== ADDITIONS ==>
  additions: number;
  // <== DELETIONS ==>
  deletions: number;
  // <== CHANGES ==>
  changes: number;
  // <== BLOB URL ==>
  blobUrl: string;
  // <== RAW URL ==>
  rawUrl: string;
  // <== CONTENTS URL ==>
  contentsUrl?: string;
  // <== PATCH ==>
  patch?: string;
  // <== PREVIOUS FILENAME ==>
  previousFilename?: string;
};
// <== COMMIT COMPARISON TYPE ==>
export type CommitComparison = {
  // <== URL ==>
  url: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== PERMALINK URL ==>
  permalinkUrl: string;
  // <== DIFF URL ==>
  diffUrl: string;
  // <== PATCH URL ==>
  patchUrl: string;
  // <== STATUS ==>
  status: "behind" | "ahead" | "diverged" | "identical";
  // <== AHEAD BY ==>
  aheadBy: number;
  // <== BEHIND BY ==>
  behindBy: number;
  // <== TOTAL COMMITS ==>
  totalCommits: number;
  // <== BASE COMMIT ==>
  baseCommit: {
    // <== SHA ==>
    sha: string;
    // <== MESSAGE ==>
    message: string;
    // <== AUTHOR ==>
    author: {
      // <== NAME ==>
      name?: string;
      // <== EMAIL ==>
      email?: string;
      // <== DATE ==>
      date?: string;
      // <== LOGIN ==>
      login?: string;
      // <== AVATAR URL ==>
      avatarUrl?: string;
    };
    // <== HTML URL ==>
    htmlUrl: string;
  };
  // <== MERGE BASE COMMIT ==>
  mergeBaseCommit: {
    // <== SHA ==>
    sha: string;
    // <== MESSAGE ==>
    message: string;
    // <== AUTHOR ==>
    author: {
      // <== NAME ==>
      name?: string;
      // <== EMAIL ==>
      email?: string;
      // <== DATE ==>
      date?: string;
      // <== LOGIN ==>
      login?: string;
      // <== AVATAR URL ==>
      avatarUrl?: string;
    };
    // <== HTML URL ==>
    htmlUrl: string;
  };
  // <== COMMITS ==>
  commits: {
    // <== SHA ==>
    sha: string;
    // <== MESSAGE ==>
    message: string;
    // <== AUTHOR ==>
    author: {
      // <== NAME ==>
      name?: string;
      // <== EMAIL ==>
      email?: string;
      // <== DATE ==>
      date?: string;
      // <== LOGIN ==>
      login?: string;
      // <== AVATAR URL ==>
      avatarUrl?: string;
    };
    // <== HTML URL ==>
    htmlUrl: string;
  }[];
  // <== FILES ==>
  files?: CommitFile[];
};
// <== COMMIT BRANCH TYPE ==>
export type CommitBranch = {
  // <== NAME ==>
  name: string;
  // <== PROTECTED ==>
  protected: boolean;
};
// <== COMMIT PR TYPE ==>
export type CommitPullRequest = {
  // <== NUMBER ==>
  number: number;
  // <== TITLE ==>
  title: string;
  // <== STATE ==>
  state: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== CREATED AT ==>
  createdAt: string;
  // <== MERGED AT ==>
  mergedAt?: string;
  // <== CLOSED AT ==>
  closedAt?: string;
};
// <== SEARCH COMMIT RESULT TYPE ==>
export type SearchCommitResult = {
  // <== SHA ==>
  sha: string;
  // <== MESSAGE ==>
  message: string;
  // <== AUTHOR ==>
  author: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    // <== DATE ==>
    date?: string;
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== COMMITTER ==>
  committer: {
    // <== NAME ==>
    name?: string;
    // <== EMAIL ==>
    email?: string;
    // <== DATE ==>
    date?: string;
    // <== LOGIN ==>
    login?: string;
    // <== AVATAR URL ==>
    avatarUrl?: string;
  };
  // <== HTML URL ==>
  htmlUrl: string;
  // <== SCORE ==>
  score?: number;
};
// <== SEARCH COMMITS RESPONSE TYPE ==>
type SearchCommitsResponse = {
  // <== COMMITS ==>
  commits: SearchCommitResult[];
  // <== TOTAL COUNT ==>
  totalCount: number;
  // <== PAGINATION ==>
  pagination: {
    // <== PAGE ==>
    page: number;
    // <== PER PAGE ==>
    perPage: number;
    // <== HAS MORE ==>
    hasMore: boolean;
  };
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
  sort: string = "updated",
  searchQuery: string = ""
): Promise<RepositoriesResponse> => {
  // BUILD PARAMS
  const params: Record<string, string | number> = {
    page,
    per_page: perPage,
    type,
    sort,
  };
  // ADD SEARCH QUERY IF PROVIDED
  if (searchQuery.trim()) {
    params.q = searchQuery.trim();
  }
  // FETCHING REPOSITORIES
  const response = await apiClient.get<ApiResponse<RawRepositoriesResponse>>(
    "/github/repositories",
    { params }
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
      owner: {
        login: repo.owner?.login ?? repo.fullName.split("/")[0],
        avatarUrl: repo.owner?.avatarUrl,
      },
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
  enabled: boolean = true,
  searchQuery: string = ""
) => {
  // FETCH REPOSITORIES QUERY
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchRepositories,
  } = useQuery<RepositoriesResponse, AxiosError<{ message?: string }>>({
    queryKey: ["github-repositories", page, perPage, type, sort, searchQuery],
    queryFn: () => fetchRepositories(page, perPage, type, sort, searchQuery),
    retry: 1,
    staleTime: searchQuery ? 30 * 1000 : 2 * 60 * 1000,
    enabled,
  });
  // RETURNING REPOSITORIES HOOK DATA
  return {
    repositories: data?.repositories || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
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
  perPage: number = 10,
  sha?: string
): Promise<{ commits: GitHubCommit[]; hasMore: boolean }> => {
  // BUILD PARAMS
  const params: Record<string, string | number> = { page, per_page: perPage };
  // ADD SHA IF PROVIDED (branch name or commit sha)
  if (sha) params.sha = sha;
  // FETCH REPOSITORY COMMITS
  const response = await apiClient.get<
    ApiResponse<{ commits: GitHubCommit[]; pagination: { hasMore: boolean } }>
  >(`/github/repositories/${owner}/${repo}/commits`, { params });
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
  sha?: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY COMMITS
  const { data, isLoading, isError, error, refetch } = useQuery<
    { commits: GitHubCommit[]; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-commits", owner, repo, page, perPage, sha],
    queryFn: () => fetchRepositoryCommits(owner, repo, page, perPage, sha),
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

// <== CREATE REPOSITORY FUNCTION ==>
const createRepository = async (
  input: CreateRepositoryInput
): Promise<CreatedRepository> => {
  // CREATE REPOSITORY
  const response = await apiClient.post<ApiResponse<CreatedRepository>>(
    "/github/repositories",
    input
  );
  // RETURN CREATED REPOSITORY
  return response.data.data;
};

// <== FORK REPOSITORY FUNCTION ==>
const forkRepository = async (
  input: ForkRepositoryInput
): Promise<CreatedRepository> => {
  // FORK REPOSITORY
  const response = await apiClient.post<ApiResponse<CreatedRepository>>(
    `/github/repositories/${input.owner}/${input.repo}/fork`,
    {
      name: input.name,
      defaultBranchOnly: input.defaultBranchOnly,
    }
  );
  // RETURN FORKED REPOSITORY
  return response.data.data;
};

// <== DELETE REPOSITORY FUNCTION ==>
const deleteRepository = async (owner: string, repo: string): Promise<void> => {
  // DELETE REPOSITORY
  await apiClient.delete(`/github/repositories/${owner}/${repo}`);
};

// <== UPDATE REPOSITORY FUNCTION ==>
const updateRepository = async (
  input: UpdateRepositoryInput
): Promise<RepositoryDetails> => {
  // DESTRUCTURE OWNER AND REPO
  const { owner, repo, ...updateData } = input;
  // UPDATE REPOSITORY
  const response = await apiClient.patch<ApiResponse<RepositoryDetails>>(
    `/github/repositories/${owner}/${repo}`,
    updateData
  );
  // RETURN UPDATED REPOSITORY
  return response.data.data;
};

// <== FETCH GIT COMMANDS FUNCTION ==>
const fetchGitCommands = async (
  owner: string,
  repo: string
): Promise<GitCommands> => {
  // FETCH GIT COMMANDS
  const response = await apiClient.get<
    ApiResponse<{ commands: GitCommands; repository: GitHubRepository }>
  >(`/github/repositories/${owner}/${repo}/commands`);
  // RETURN GIT COMMANDS
  return response.data.data.commands;
};

// <== USE CREATE REPOSITORY HOOK ==>
export const useCreateRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE REPOSITORY MUTATION
  const mutation = useMutation<
    CreatedRepository,
    AxiosError<{ message?: string }>,
    CreateRepositoryInput
  >({
    mutationFn: createRepository,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE REPOSITORIES QUERY
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
    },
  });
  // RETURN CREATE REPOSITORY MUTATION
  return mutation;
};

// <== USE FORK REPOSITORY HOOK ==>
export const useForkRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // FORK REPOSITORY MUTATION
  const mutation = useMutation<
    CreatedRepository,
    AxiosError<{ message?: string }>,
    ForkRepositoryInput
  >({
    mutationFn: forkRepository,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE REPOSITORIES QUERY
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
    },
  });
  // RETURN FORK REPOSITORY MUTATION
  return mutation;
};

// <== USE DELETE REPOSITORY HOOK ==>
export const useDeleteRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE REPOSITORY MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    mutationFn: ({ owner, repo }) => deleteRepository(owner, repo),
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE REPOSITORIES QUERY
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
    },
  });
  // RETURN DELETE REPOSITORY MUTATION
  return mutation;
};

// <== USE UPDATE REPOSITORY HOOK ==>
export const useUpdateRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE REPOSITORY MUTATION
  const mutation = useMutation<
    RepositoryDetails,
    AxiosError<{ message?: string }>,
    UpdateRepositoryInput
  >({
    mutationFn: updateRepository,
    // ON SUCCESS
    onSuccess: (_data, variables) => {
      // INVALIDATE REPOSITORIES QUERY
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
      // INVALIDATE REPOSITORY DETAILS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-details", variables.owner, variables.repo],
      });
    },
  });
  // RETURN UPDATE REPOSITORY MUTATION
  return mutation;
};

// <== USE GIT COMMANDS HOOK ==>
export const useGitCommands = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE GIT COMMANDS
  const { data, isLoading, isError, error, refetch } = useQuery<
    GitCommands,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-git-commands", owner, repo],
    queryFn: () => fetchGitCommands(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN GIT COMMANDS
  return { commands: data, isLoading, isError, error, refetch };
};

// <== UPDATE TOPICS FUNCTION ==>
const updateRepositoryTopics = async (
  input: UpdateTopicsInput
): Promise<{ topics: string[] }> => {
  // UPDATE TOPICS
  const response = await apiClient.put<ApiResponse<{ topics: string[] }>>(
    `/github/repositories/${input.owner}/${input.repo}/topics`,
    {
      topics: input.topics,
    }
  );
  // RETURN TOPICS
  return response.data.data;
};

// <== FETCH COLLABORATORS FUNCTION ==>
const fetchCollaborators = async (
  owner: string,
  repo: string
): Promise<Collaborator[]> => {
  // FETCH COLLABORATORS
  const response = await apiClient.get<
    ApiResponse<{ collaborators: Collaborator[] }>
  >(`/github/repositories/${owner}/${repo}/collaborators`);
  // RETURN COLLABORATORS
  return response.data.data.collaborators;
};

// <== ADD COLLABORATOR FUNCTION ==>
const addCollaborator = async (
  input: AddCollaboratorInput
): Promise<{ username: string; permission: string }> => {
  // ADD COLLABORATOR
  const response = await apiClient.put<
    ApiResponse<{ username: string; permission: string }>
  >(
    `/github/repositories/${input.owner}/${input.repo}/collaborators/${input.username}`,
    { permission: input.permission || "push" }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== REMOVE COLLABORATOR FUNCTION ==>
const removeCollaborator = async (
  owner: string,
  repo: string,
  username: string
): Promise<void> => {
  // REMOVE COLLABORATOR
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/collaborators/${username}`
  );
};

// <== TRANSFER REPOSITORY FUNCTION ==>
const transferRepositoryFn = async (
  input: TransferRepositoryInput
): Promise<{ fullName: string; newOwner: string; htmlUrl: string }> => {
  // TRANSFER REPOSITORY
  const response = await apiClient.post<
    ApiResponse<{
      id: number;
      name: string;
      fullName: string;
      newOwner: string;
      htmlUrl: string;
    }>
  >(`/github/repositories/${input.owner}/${input.repo}/transfer`, {
    newOwner: input.newOwner,
    teamIds: input.teamIds,
  });
  // RETURN RESULT
  return response.data.data;
};

// <== USE UPDATE TOPICS HOOK ==>
export const useUpdateTopics = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE TOPICS MUTATION
  const mutation = useMutation<
    { topics: string[] },
    AxiosError<{ message?: string }>,
    UpdateTopicsInput
  >({
    mutationFn: updateRepositoryTopics,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE REPOSITORY DETAILS
      queryClient.invalidateQueries({
        queryKey: ["github-repo-details", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE COLLABORATORS HOOK ==>
export const useCollaborators = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE COLLABORATORS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Collaborator[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-collaborators", owner, repo],
    queryFn: () => fetchCollaborators(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN COLLABORATORS
  return { collaborators: data || [], isLoading, isError, error, refetch };
};

// <== USE ADD COLLABORATOR HOOK ==>
export const useAddCollaborator = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ADD COLLABORATOR MUTATION
  const mutation = useMutation<
    { username: string; permission: string },
    AxiosError<{ message?: string }>,
    AddCollaboratorInput
  >({
    mutationFn: addCollaborator,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE COLLABORATORS
      queryClient.invalidateQueries({
        queryKey: ["github-collaborators", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE REMOVE COLLABORATOR HOOK ==>
export const useRemoveCollaborator = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // REMOVE COLLABORATOR MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; username: string }
  >({
    mutationFn: ({ owner, repo, username }) =>
      removeCollaborator(owner, repo, username),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE COLLABORATORS
      queryClient.invalidateQueries({
        queryKey: ["github-collaborators", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE TRANSFER REPOSITORY HOOK ==>
export const useTransferRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // TRANSFER REPOSITORY MUTATION
  const mutation = useMutation<
    { fullName: string; newOwner: string; htmlUrl: string },
    AxiosError<{ message?: string }>,
    TransferRepositoryInput
  >({
    mutationFn: transferRepositoryFn,
    // ON SUCCESS
    onSuccess: () => {
      // INVALIDATE REPOSITORIES
      queryClient.invalidateQueries({ queryKey: ["github-repositories"] });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH REPOSITORY CONTENTS FUNCTION ==>
const fetchRepositoryContents = async (
  owner: string,
  repo: string,
  path: string = "",
  ref?: string
): Promise<FileTreeItem[]> => {
  // BUILD URL WITH QUERY PARAMS
  let url = `/github/repositories/${owner}/${repo}/contents?path=${encodeURIComponent(
    path
  )}`;
  if (ref) url += `&ref=${encodeURIComponent(ref)}`;
  // FETCH CONTENTS
  const response = await apiClient.get<ApiResponse<FileTreeItem[]>>(url);
  // RETURN CONTENTS
  return Array.isArray(response.data.data)
    ? response.data.data
    : [response.data.data];
};

// <== FETCH FILE CONTENT FUNCTION ==>
const fetchFileContent = async (
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<FileContent> => {
  // BUILD URL WITH QUERY PARAMS
  let url = `/github/repositories/${owner}/${repo}/file?path=${encodeURIComponent(
    path
  )}`;
  if (ref) url += `&ref=${encodeURIComponent(ref)}`;
  // FETCH FILE
  const response = await apiClient.get<ApiResponse<FileContent>>(url);
  // RETURN FILE
  return response.data.data;
};

// <== FETCH REPOSITORY TREE FUNCTION ==>
const fetchRepositoryTree = async (
  owner: string,
  repo: string,
  ref?: string,
  recursive: boolean = true
): Promise<RepositoryTree> => {
  // BUILD URL WITH QUERY PARAMS
  let url = `/github/repositories/${owner}/${repo}/tree?recursive=${recursive}`;
  if (ref) url += `&ref=${encodeURIComponent(ref)}`;
  // FETCH TREE
  const response = await apiClient.get<ApiResponse<RepositoryTree>>(url);
  // RETURN TREE
  return response.data.data;
};

// <== FETCH FILE BLAME FUNCTION ==>
const fetchFileBlame = async (
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<FileBlame> => {
  // BUILD URL WITH QUERY PARAMS
  let url = `/github/repositories/${owner}/${repo}/blame?path=${encodeURIComponent(
    path
  )}`;
  if (ref) url += `&ref=${encodeURIComponent(ref)}`;
  // FETCH BLAME
  const response = await apiClient.get<ApiResponse<FileBlame>>(url);
  // RETURN BLAME
  return response.data.data;
};

// <== CREATE FILE FUNCTION ==>
const createFileFn = async (
  input: CreateFileInput
): Promise<FileOperationResult> => {
  // CREATE FILE
  const response = await apiClient.post<ApiResponse<FileOperationResult>>(
    `/github/repositories/${input.owner}/${input.repo}/file`,
    {
      path: input.path,
      content: input.content,
      message: input.message,
      branch: input.branch,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== UPDATE FILE FUNCTION ==>
const updateFileFn = async (
  input: UpdateFileInput
): Promise<FileOperationResult> => {
  // UPDATE FILE
  const response = await apiClient.put<ApiResponse<FileOperationResult>>(
    `/github/repositories/${input.owner}/${input.repo}/file`,
    {
      path: input.path,
      content: input.content,
      message: input.message,
      sha: input.sha,
      branch: input.branch,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== DELETE FILE FUNCTION ==>
const deleteFileFn = async (
  input: DeleteFileInput
): Promise<FileOperationResult> => {
  // DELETE FILE
  const response = await apiClient.delete<ApiResponse<FileOperationResult>>(
    `/github/repositories/${input.owner}/${input.repo}/file`,
    {
      data: {
        path: input.path,
        message: input.message,
        sha: input.sha,
        branch: input.branch,
      },
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE REPOSITORY CONTENTS HOOK ==>
export const useRepositoryContents = (
  owner: string,
  repo: string,
  path: string = "",
  ref?: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY CONTENTS
  const {
    data: contents,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FileTreeItem[], AxiosError<{ message?: string }>>({
    queryKey: ["github-contents", owner, repo, path, ref],
    queryFn: () => fetchRepositoryContents(owner, repo, path, ref),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN CONTENTS
  return { contents: contents || [], isLoading, isError, error, refetch };
};

// <== USE FILE CONTENT HOOK ==>
export const useFileContent = (
  owner: string,
  repo: string,
  path: string,
  ref?: string,
  enabled: boolean = true
) => {
  // USE FILE CONTENT
  const {
    data: file,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FileContent, AxiosError<{ message?: string }>>({
    queryKey: ["github-file", owner, repo, path, ref],
    queryFn: () => fetchFileContent(owner, repo, path, ref),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!path,
  });
  // RETURN FILE
  return { file, isLoading, isError, error, refetch };
};

// <== USE REPOSITORY TREE HOOK ==>
export const useRepositoryTree = (
  owner: string,
  repo: string,
  ref?: string,
  recursive: boolean = true,
  enabled: boolean = true
) => {
  // USE REPOSITORY TREE
  const {
    data: tree,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RepositoryTree, AxiosError<{ message?: string }>>({
    queryKey: ["github-tree", owner, repo, ref, recursive],
    queryFn: () => fetchRepositoryTree(owner, repo, ref, recursive),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN TREE
  return { tree, isLoading, isError, error, refetch };
};

// <== USE FILE BLAME HOOK ==>
export const useFileBlame = (
  owner: string,
  repo: string,
  path: string,
  ref?: string,
  enabled: boolean = true
) => {
  // USE FILE BLAME
  const {
    data: blame,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FileBlame, AxiosError<{ message?: string }>>({
    queryKey: ["github-blame", owner, repo, path, ref],
    queryFn: () => fetchFileBlame(owner, repo, path, ref),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!path,
  });
  // RETURN BLAME
  return { blame, isLoading, isError, error, refetch };
};

// <== USE CREATE FILE HOOK ==>
export const useCreateFile = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE FILE MUTATION
  const mutation = useMutation<
    FileOperationResult,
    AxiosError<{ message?: string }>,
    CreateFileInput
  >({
    mutationFn: createFileFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE CONTENTS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-contents", variables.owner, variables.repo],
      });
      // INVALIDATE TREE QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-tree", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE UPDATE FILE HOOK ==>
export const useUpdateFile = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE FILE MUTATION
  const mutation = useMutation<
    FileOperationResult,
    AxiosError<{ message?: string }>,
    UpdateFileInput
  >({
    mutationFn: updateFileFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE FILE AND CONTENTS
      queryClient.invalidateQueries({
        queryKey: [
          "github-file",
          variables.owner,
          variables.repo,
          variables.path,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["github-contents", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE DELETE FILE HOOK ==>
export const useDeleteFile = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE FILE MUTATION
  const mutation = useMutation<
    FileOperationResult,
    AxiosError<{ message?: string }>,
    DeleteFileInput
  >({
    mutationFn: deleteFileFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE CONTENTS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-contents", variables.owner, variables.repo],
      });
      // INVALIDATE TREE QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-tree", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH COMMIT DETAILS FUNCTION ==>
const fetchCommitDetails = async (
  owner: string,
  repo: string,
  sha: string
): Promise<CommitDetails> => {
  // FETCH COMMIT DETAILS
  const response = await apiClient.get<ApiResponse<CommitDetails>>(
    `/github/repositories/${owner}/${repo}/commits/${sha}`
  );
  // RETURN COMMIT DETAILS
  return response.data.data;
};

// <== USE COMMIT DETAILS HOOK ==>
export const useCommitDetails = (
  owner: string,
  repo: string,
  sha: string,
  enabled: boolean = true
) => {
  // USE COMMIT DETAILS
  const {
    data: commit,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CommitDetails, AxiosError<{ message?: string }>>({
    queryKey: ["github-commit", owner, repo, sha],
    queryFn: () => fetchCommitDetails(owner, repo, sha),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!sha,
  });
  // RETURN COMMIT DETAILS
  return { commit, isLoading, isError, error, refetch };
};

// <== FETCH COMMIT COMPARISON FUNCTION ==>
const fetchCommitComparison = async (
  owner: string,
  repo: string,
  base: string,
  head: string
): Promise<CommitComparison> => {
  // FETCH COMMIT COMPARISON
  const response = await apiClient.get<ApiResponse<CommitComparison>>(
    `/github/repositories/${owner}/${repo}/compare?base=${encodeURIComponent(
      base
    )}&head=${encodeURIComponent(head)}`
  );
  // RETURN COMMIT COMPARISON
  return response.data.data;
};

// <== USE COMMIT COMPARISON HOOK ==>
export const useCommitComparison = (
  owner: string,
  repo: string,
  base: string,
  head: string,
  enabled: boolean = true
) => {
  // USE COMMIT COMPARISON
  const {
    data: comparison,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CommitComparison, AxiosError<{ message?: string }>>({
    queryKey: ["github-compare", owner, repo, base, head],
    queryFn: () => fetchCommitComparison(owner, repo, base, head),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!base && !!head,
  });
  // RETURN COMMIT COMPARISON
  return { comparison, isLoading, isError, error, refetch };
};

// <== FETCH COMMIT BRANCHES FUNCTION ==>
const fetchCommitBranches = async (
  owner: string,
  repo: string,
  sha: string
): Promise<CommitBranch[]> => {
  // FETCH COMMIT BRANCHES
  const response = await apiClient.get<ApiResponse<CommitBranch[]>>(
    `/github/repositories/${owner}/${repo}/commits/${sha}/branches`
  );
  // RETURN COMMIT BRANCHES
  return response.data.data;
};

// <== USE COMMIT BRANCHES HOOK ==>
export const useCommitBranches = (
  owner: string,
  repo: string,
  sha: string,
  enabled: boolean = true
) => {
  // USE COMMIT BRANCHES
  const {
    data: branches,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CommitBranch[], AxiosError<{ message?: string }>>({
    queryKey: ["github-commit-branches", owner, repo, sha],
    queryFn: () => fetchCommitBranches(owner, repo, sha),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!sha,
  });
  // RETURN COMMIT BRANCHES
  return { branches, isLoading, isError, error, refetch };
};

// <== FETCH COMMIT PULL REQUESTS FUNCTION ==>
const fetchCommitPullRequests = async (
  owner: string,
  repo: string,
  sha: string
): Promise<CommitPullRequest[]> => {
  // FETCH COMMIT PULL REQUESTS
  const response = await apiClient.get<ApiResponse<CommitPullRequest[]>>(
    `/github/repositories/${owner}/${repo}/commits/${sha}/pulls`
  );
  // RETURN COMMIT PULL REQUESTS
  return response.data.data;
};

// <== USE COMMIT PULL REQUESTS HOOK ==>
export const useCommitPullRequests = (
  owner: string,
  repo: string,
  sha: string,
  enabled: boolean = true
) => {
  // USE COMMIT PULL REQUESTS
  const {
    data: pullRequests,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CommitPullRequest[], AxiosError<{ message?: string }>>({
    queryKey: ["github-commit-prs", owner, repo, sha],
    queryFn: () => fetchCommitPullRequests(owner, repo, sha),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!sha,
  });
  // RETURN COMMIT PULL REQUESTS
  return { pullRequests, isLoading, isError, error, refetch };
};

// <== FETCH SEARCH COMMITS FUNCTION ==>
const fetchSearchCommits = async (
  owner: string,
  repo: string,
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<SearchCommitsResponse> => {
  // FETCH SEARCH COMMITS
  const response = await apiClient.get<ApiResponse<SearchCommitsResponse>>(
    `/github/repositories/${owner}/${repo}/commits/search?q=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${perPage}`
  );
  // RETURN SEARCH COMMITS
  return response.data.data;
};

// <== USE SEARCH COMMITS HOOK ==>
export const useSearchCommits = (
  owner: string,
  repo: string,
  query: string,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE SEARCH COMMITS
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    SearchCommitsResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-search-commits", owner, repo, query, page, perPage],
    queryFn: () => fetchSearchCommits(owner, repo, query, page, perPage),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo && !!query && query.trim().length > 0,
  });
  // RETURN SEARCH COMMITS
  return {
    commits: data?.commits || [],
    totalCount: data?.totalCount || 0,
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
