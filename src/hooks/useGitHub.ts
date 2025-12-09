// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "@/lib/toast";
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
  // <== TOTAL COUNT (OPTIONAL) ==>
  totalCount?: number;
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
    // <== HAS MORE ==>
    hasMore: boolean;
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
  // <== PERMISSIONS ==>
  permissions: {
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
  } | null;
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
  // <== ASSIGNEES ==>
  assignees?: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  }[];
  // <== MILESTONE ==>
  milestone?: {
    // <== TITLE ==>
    title: string;
    // <== STATE ==>
    state: string;
    // <== DUE ON ==>
    dueOn: string | null;
  } | null;
};
// <== ISSUE DETAILS TYPE (EXTENDED) ==>
export type IssueDetails = GitHubIssue & {
  // <== BODY HTML ==>
  bodyHtml?: string;
  // <== STATE REASON ==>
  stateReason?: string | null;
  // <== USER HTML URL ==>
  user: GitHubIssue["user"] & {
    // <== HTML URL ==>
    htmlUrl?: string;
  };
  // <== LABELS (EXTENDED) ==>
  labels: {
    // <== ID ==>
    id?: number | null;
    // <== NAME ==>
    name: string | null;
    // <== COLOR ==>
    color: string | null;
    // <== DESCRIPTION ==>
    description?: string | null;
  }[];
  // <== ASSIGNEES (EXTENDED) ==>
  assignees?: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl?: string;
  }[];
  // <== MILESTONE (EXTENDED) ==>
  milestone?: {
    // <== ID ==>
    id: number;
    // <== NUMBER ==>
    number: number;
    // <== TITLE ==>
    title: string;
    // <== DESCRIPTION ==>
    description?: string | null;
    // <== STATE ==>
    state: string;
    // <== DUE ON ==>
    dueOn: string | null;
  } | null;
  // <== CLOSED BY ==>
  closedBy?: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  } | null;
  // <== REACTIONS ==>
  reactions?: {
    // <== TOTAL COUNT ==>
    totalCount: number;
    // <== PLUS ONE ==>
    plusOne: number;
    // <== MINUS ONE ==>
    minusOne: number;
    // <== LAUGH ==>
    laugh: number;
    // <== HOORAY ==>
    hooray: number;
    // <== CONFUSED ==>
    confused: number;
    // <== HEART ==>
    heart: number;
    // <== ROCKET ==>
    rocket: number;
    // <== EYES ==>
    eyes: number;
  };
  // <== LOCKED ==>
  locked?: boolean;
  // <== AUTHOR ASSOCIATION ==>
  authorAssociation?: string;
};
// <== ISSUE COMMENT TYPE ==>
export type IssueComment = {
  // <== ID ==>
  id: number;
  // <== BODY ==>
  body: string;
  // <== BODY HTML ==>
  bodyHtml?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
    // <== HTML URL ==>
    htmlUrl?: string;
  };
  // <== HTML URL ==>
  htmlUrl: string;
  // <== AUTHOR ASSOCIATION ==>
  authorAssociation?: string;
  // <== REACTIONS ==>
  reactions?: {
    // <== TOTAL COUNT ==>
    totalCount: number;
    // <== PLUS ONE ==>
    plusOne: number;
    // <== MINUS ONE ==>
    minusOne: number;
    // <== LAUGH ==>
    laugh: number;
    // <== HOORAY ==>
    hooray: number;
    // <== CONFUSED ==>
    confused: number;
    // <== HEART ==>
    heart: number;
    // <== ROCKET ==>
    rocket: number;
    // <== EYES ==>
    eyes: number;
  };
};
// <== REPOSITORY LABEL TYPE ==>
export type RepositoryLabel = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== COLOR ==>
  color: string;
  // <== DESCRIPTION ==>
  description: string | null;
  // <== DEFAULT ==>
  default: boolean;
};
// <== CREATE ISSUE INPUT TYPE ==>
export type CreateIssueInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body?: string;
  // <== LABELS ==>
  labels?: string[];
  // <== ASSIGNEES ==>
  assignees?: string[];
  // <== MILESTONE ==>
  milestone?: number;
};
// <== UPDATE ISSUE INPUT TYPE ==>
export type UpdateIssueInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== ISSUE NUMBER ==>
  issueNumber: number;
  // <== TITLE ==>
  title?: string;
  // <== BODY ==>
  body?: string;
  // <== STATE ==>
  state?: "open" | "closed";
  // <== STATE REASON ==>
  stateReason?: "completed" | "not_planned" | "reopened" | null;
  // <== LABELS ==>
  labels?: string[];
  // <== ASSIGNEES ==>
  assignees?: string[];
  // <== MILESTONE ==>
  milestone?: number | null;
};
// <== ADD ISSUE COMMENT INPUT TYPE ==>
export type AddIssueCommentInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== ISSUE NUMBER ==>
  issueNumber: number;
  // <== BODY ==>
  body: string;
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
// <== PULL REQUEST DETAILS TYPE ==>
export type PullRequestDetails = {
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
  // <== DIFF URL ==>
  diffUrl: string;
  // <== PATCH URL ==>
  patchUrl: string;
  // <== DRAFT ==>
  draft: boolean;
  // <== MERGED ==>
  merged: boolean;
  // <== MERGEABLE ==>
  mergeable: boolean | null;
  // <== MERGEABLE STATE ==>
  mergeableState: string | null;
  // <== MERGED AT ==>
  mergedAt: string | null;
  // <== MERGED BY ==>
  mergedBy: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  } | null;
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
    // <== LABEL ==>
    label: string;
    // <== REPO ==>
    repo: {
      // <== NAME ==>
      name: string;
      // <== FULL NAME ==>
      fullName: string;
    } | null;
  };
  // <== BASE ==>
  base: {
    // <== REF ==>
    ref: string;
    // <== SHA ==>
    sha: string;
    // <== LABEL ==>
    label: string;
    // <== REPO ==>
    repo: {
      // <== NAME ==>
      name: string;
      // <== FULL NAME ==>
      fullName: string;
    };
  };
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
    // <== HTML URL ==>
    htmlUrl: string | null;
  };
  // <== LABELS ==>
  labels: {
    // <== ID ==>
    id: number;
    // <== NAME ==>
    name: string;
    // <== COLOR ==>
    color: string;
    // <== DESCRIPTION ==>
    description: string | null;
  }[];
  // <== REQUESTED REVIEWERS ==>
  requestedReviewers: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  }[];
  // <== ADDITIONS ==>
  additions: number;
  // <== DELETIONS ==>
  deletions: number;
  // <== CHANGED FILES ==>
  changedFiles: number;
  // <== COMMITS ==>
  commits: number;
  // <== COMMENTS ==>
  comments: number;
  // <== REVIEW COMMENTS ==>
  reviewComments: number;
};
// <== PULL REQUEST COMMENT TYPE ==>
export type PullRequestComment = {
  // <== ID ==>
  id: number;
  // <== BODY ==>
  body: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  };
  // <== TYPE ==>
  type: "issue" | "review";
  // <== PATH (FOR REVIEW COMMENTS) ==>
  path?: string;
  // <== LINE (FOR REVIEW COMMENTS) ==>
  line?: number | null;
  // <== SIDE (FOR REVIEW COMMENTS) ==>
  side?: string;
  // <== COMMIT ID (FOR REVIEW COMMENTS) ==>
  commitId?: string;
  // <== DIFF HUNK (FOR REVIEW COMMENTS) ==>
  diffHunk?: string;
};
// <== PULL REQUEST REVIEW TYPE ==>
export type PullRequestReview = {
  // <== ID ==>
  id: number;
  // <== BODY ==>
  body: string | null;
  // <== STATE ==>
  state: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== COMMIT ID ==>
  commitId: string;
  // <== SUBMITTED AT ==>
  submittedAt: string | null;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string | null;
    // <== AVATAR URL ==>
    avatarUrl: string | null;
  };
};
// <== PULL REQUEST FILE TYPE ==>
export type PullRequestFile = {
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
  contentsUrl: string;
  // <== PATCH ==>
  patch?: string;
  // <== PREVIOUS FILENAME ==>
  previousFilename?: string;
};
// <== CREATE PULL REQUEST INPUT TYPE ==>
export type CreatePullRequestInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body?: string;
  // <== HEAD ==>
  head: string;
  // <== BASE ==>
  base: string;
  // <== DRAFT ==>
  draft?: boolean;
};
// <== MERGE PULL REQUEST INPUT TYPE ==>
export type MergePullRequestInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
  // <== COMMIT TITLE ==>
  commitTitle?: string;
  // <== COMMIT MESSAGE ==>
  commitMessage?: string;
  // <== MERGE METHOD ==>
  mergeMethod?: "merge" | "squash" | "rebase";
};
// <== UPDATE PULL REQUEST INPUT TYPE ==>
export type UpdatePullRequestInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
  // <== TITLE ==>
  title?: string;
  // <== BODY ==>
  body?: string;
  // <== STATE ==>
  state?: "open" | "closed";
  // <== BASE ==>
  base?: string;
};
// <== CREATE REVIEW INPUT TYPE ==>
export type CreateReviewInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
  // <== BODY ==>
  body?: string;
  // <== EVENT ==>
  event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT";
  // <== COMMENTS ==>
  comments?: {
    // <== PATH ==>
    path: string;
    // <== POSITION ==>
    position?: number;
    // <== BODY ==>
    body: string;
  }[];
};
// <== ADD COMMENT INPUT TYPE ==>
export type AddPRCommentInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
  // <== BODY ==>
  body: string;
};
// <== REQUEST REVIEWERS INPUT TYPE ==>
export type RequestReviewersInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== PULL NUMBER ==>
  pullNumber: number;
  // <== REVIEWERS ==>
  reviewers?: string[];
  // <== TEAM REVIEWERS ==>
  teamReviewers?: string[];
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
// <== REPOSITORY INVITATION TYPE ==>
export type RepositoryInvitation = {
  // <== ID ==>
  id: number;
  // <== INVITEE ==>
  invitee: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl: string;
  } | null;
  // <== INVITER ==>
  inviter: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  } | null;
  // <== PERMISSIONS ==>
  permissions: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== EXPIRED ==>
  expired: boolean;
};
// <== COLLABORATOR PERMISSION CHECK TYPE ==>
export type CollaboratorPermissionCheck = {
  // <== IS COLLABORATOR ==>
  isCollaborator: boolean;
  // <== PERMISSION ==>
  permission: string;
  // <== ROLE NAME ==>
  roleName: string | null;
  // <== USER ==>
  user: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl: string;
  } | null;
};
// <== UPDATE INVITATION INPUT TYPE ==>
export type UpdateInvitationInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== INVITATION ID ==>
  invitationId: number;
  // <== PERMISSIONS ==>
  permissions: "read" | "triage" | "write" | "maintain" | "admin";
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
// <== BRANCH DETAILS TYPE ==>
export type BranchDetails = {
  // <== NAME ==>
  name: string;
  // <== PROTECTED ==>
  protected: boolean;
  // <== COMMIT ==>
  commit: {
    // <== SHA ==>
    sha: string;
    // <== URL ==>
    url: string;
    // <== AUTHOR ==>
    author?: {
      // <== NAME ==>
      name?: string;
      // <== EMAIL ==>
      email?: string;
      // <== DATE ==>
      date?: string;
    };
    // <== COMMITTER ==>
    committer?: {
      // <== NAME ==>
      name?: string;
      // <== EMAIL ==>
      email?: string;
      // <== DATE ==>
      date?: string;
    };
    // <== MESSAGE ==>
    message?: string;
  };
  // <== PROTECTION ==>
  protection?: {
    // <== ENABLED ==>
    enabled: boolean;
    // <== REQUIRED STATUS CHECKS ==>
    requiredStatusChecks?: {
      // <== ENFORCEMENT LEVEL ==>
      enforcementLevel: string;
      // <== CONTEXTS ==>
      contexts: string[];
    };
  };
  // <== PROTECTION URL ==>
  protectionUrl?: string;
};
// <== BRANCH PROTECTION TYPE ==>
export type BranchProtection = {
  // <== IS PROTECTED ==>
  isProtected?: boolean;
  // <== URL ==>
  url?: string;
  // <== REQUIRED STATUS CHECKS ==>
  requiredStatusChecks?: {
    // <== STRICT ==>
    strict: boolean;
    // <== CONTEXTS ==>
    contexts: string[];
  } | null;
  // <== ENFORCE ADMINS ==>
  enforceAdmins?: boolean;
  // <== REQUIRED PULL REQUEST REVIEWS ==>
  requiredPullRequestReviews?: {
    // <== DISMISS STALE REVIEWS ==>
    dismissStaleReviews: boolean;
    // <== REQUIRE CODE OWNER REVIEWS ==>
    requireCodeOwnerReviews: boolean;
    // <== REQUIRED APPROVING REVIEW COUNT ==>
    requiredApprovingReviewCount: number;
    // <== REQUIRE LAST PUSH APPROVAL ==>
    requireLastPushApproval?: boolean;
  } | null;
  // <== RESTRICTIONS ==>
  restrictions?: {
    // <== USERS ==>
    users: string[];
    // <== TEAMS ==>
    teams: string[];
    // <== APPS ==>
    apps: string[];
  } | null;
  // <== REQUIRED LINEAR HISTORY ==>
  requiredLinearHistory?: boolean;
  // <== ALLOW FORCE PUSHES ==>
  allowForcePushes?: boolean;
  // <== ALLOW DELETIONS ==>
  allowDeletions?: boolean;
  // <== BLOCK CREATIONS ==>
  blockCreations?: boolean;
  // <== REQUIRED CONVERSATION RESOLUTION ==>
  requiredConversationResolution?: boolean;
  // <== LOCK BRANCH ==>
  lockBranch?: boolean;
  // <== ALLOW FORK SYNCING ==>
  allowForkSyncing?: boolean;
};
// <== MERGE RESULT TYPE ==>
export type MergeResult = {
  // <== SHA ==>
  sha?: string;
  // <== MERGED ==>
  merged: boolean;
  // <== ALREADY UP TO DATE ==>
  alreadyUpToDate?: boolean;
  // <== MESSAGE ==>
  message?: string;
  // <== HTML URL ==>
  htmlUrl?: string;
  // <== PARENTS ==>
  parents?: { sha: string; url: string }[];
};
// <== CREATE BRANCH INPUT TYPE ==>
type CreateBranchInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH NAME ==>
  branchName: string;
  // <== SOURCE BRANCH ==>
  sourceBranch?: string;
  // <== SOURCE SHA ==>
  sourceSha?: string;
};
// <== DELETE BRANCH INPUT TYPE ==>
type DeleteBranchInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
};
// <== MERGE BRANCHES INPUT TYPE ==>
type MergeBranchesInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BASE ==>
  base: string;
  // <== HEAD ==>
  head: string;
  // <== COMMIT MESSAGE ==>
  commitMessage?: string;
};
// <== UPDATE BRANCH PROTECTION INPUT TYPE ==>
type UpdateBranchProtectionInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
  // <== PROTECTION SETTINGS ==>
  requiredStatusChecks?: {
    // <== STRICT ==>
    strict: boolean;
    // <== CONTEXTS ==>
    contexts: string[];
  } | null;
  // <== ENFORCE ADMINS ==>
  enforceAdmins?: boolean;
  // <== REQUIRED PULL REQUEST REVIEWS ==>
  requiredPullRequestReviews?: {
    // <== DISMISS STALE REVIEWS ==>
    dismissStaleReviews?: boolean;
    // <== REQUIRE CODE OWNER REVIEWS ==>
    requireCodeOwnerReviews?: boolean;
    // <== REQUIRED APPROVING REVIEW COUNT ==>
    requiredApprovingReviewCount?: number;
    // <== REQUIRE LAST PUSH APPROVAL ==>
    requireLastPushApproval?: boolean;
  } | null;
  // <== RESTRICTIONS ==>
  restrictions?: {
    // <== USERS ==>
    users: string[];
    // <== TEAMS ==>
    teams: string[];
    // <== APPS ==>
    apps?: string[];
  } | null;
  // <== REQUIRED LINEAR HISTORY ==>
  requiredLinearHistory?: boolean;
  // <== ALLOW FORCE PUSHES ==>
  allowForcePushes?: boolean;
  // <== ALLOW DELETIONS ==>
  allowDeletions?: boolean;
  // <== REQUIRED CONVERSATION RESOLUTION ==>
  requiredConversationResolution?: boolean;
};
// <== DELETE BRANCH PROTECTION INPUT TYPE ==>
type DeleteBranchProtectionInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== BRANCH ==>
  branch: string;
};
// <== WORKFLOW TYPE ==>
export type Workflow = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== PATH ==>
  path: string;
  // <== STATE ==>
  state:
    | "active"
    | "deleted"
    | "disabled_fork"
    | "disabled_inactivity"
    | "disabled_manually";
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== BADGE URL ==>
  badgeUrl: string;
};
// <== WORKFLOW RUN TYPE ==>
export type WorkflowRun = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string | null;
  // <== DISPLAY TITLE ==>
  displayTitle: string;
  // <== WORKFLOW ID ==>
  workflowId: number;
  // <== HEAD BRANCH ==>
  headBranch: string | null;
  // <== HEAD SHA ==>
  headSha: string;
  // <== PATH ==>
  path: string;
  // <== RUN NUMBER ==>
  runNumber: number;
  // <== RUN ATTEMPT ==>
  runAttempt: number | undefined;
  // <== EVENT ==>
  event: string;
  // <== STATUS ==>
  status: string | null;
  // <== CONCLUSION ==>
  conclusion: string | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== RUN STARTED AT ==>
  runStartedAt: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== ACTOR ==>
  actor: {
    login: string;
    avatarUrl: string;
  } | null;
  // <== TRIGGERING ACTOR ==>
  triggeringActor: {
    login: string;
    avatarUrl: string;
  } | null;
};
// <== WORKFLOW RUN DETAILS TYPE ==>
export type WorkflowRunDetails = WorkflowRun & {
  // <== HEAD COMMIT ==>
  headCommit: {
    id: string;
    message: string;
    timestamp: string;
    author: {
      name: string | null;
      email: string | null;
    };
  } | null;
  // <== REPOSITORY ==>
  repository: {
    id: number;
    name: string;
    fullName: string;
  };
};
// <== WORKFLOW JOB STEP TYPE ==>
export type WorkflowJobStep = {
  // <== NAME ==>
  name: string;
  // <== STATUS ==>
  status: string;
  // <== CONCLUSION ==>
  conclusion: string | null;
  // <== NUMBER ==>
  number: number;
  // <== STARTED AT ==>
  startedAt: string | null;
  // <== COMPLETED AT ==>
  completedAt: string | null;
};
// <== WORKFLOW JOB TYPE ==>
export type WorkflowJob = {
  // <== ID ==>
  id: number;
  // <== RUN ID ==>
  runId: number;
  // <== NAME ==>
  name: string;
  // <== STATUS ==>
  status: string;
  // <== CONCLUSION ==>
  conclusion: string | null;
  // <== STARTED AT ==>
  startedAt: string | null;
  // <== COMPLETED AT ==>
  completedAt: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== RUNNER NAME ==>
  runnerName: string | null;
  // <== RUNNER GROUP NAME ==>
  runnerGroupName: string | null;
  // <== STEPS ==>
  steps: WorkflowJobStep[] | undefined;
};
// <== TRIGGER WORKFLOW INPUT TYPE ==>
export type TriggerWorkflowInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== WORKFLOW ID ==>
  workflowId: number;
  // <== REF ==>
  ref: string;
  // <== INPUTS ==>
  inputs?: Record<string, string>;
};
// <== RELEASE ASSET TYPE ==>
export type ReleaseAsset = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== LABEL ==>
  label?: string;
  // <== SIZE ==>
  size: number;
  // <== DOWNLOAD COUNT ==>
  downloadCount: number;
  // <== BROWSER DOWNLOAD URL ==>
  browserDownloadUrl: string;
  // <== CONTENT TYPE ==>
  contentType: string;
  // <== STATE ==>
  state?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
};
// <== RELEASE TYPE ==>
export type Release = {
  // <== ID ==>
  id: number;
  // <== TAG NAME ==>
  tagName: string;
  // <== TARGET COMMITISH ==>
  targetCommitish?: string;
  // <== NAME ==>
  name: string;
  // <== BODY ==>
  body: string | null;
  // <== DRAFT ==>
  draft: boolean;
  // <== PRERELEASE ==>
  prerelease: boolean;
  // <== CREATED AT ==>
  createdAt: string;
  // <== PUBLISHED AT ==>
  publishedAt: string | null;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== TARBALL URL ==>
  tarballUrl?: string;
  // <== ZIPBALL URL ==>
  zipballUrl?: string;
  // <== AUTHOR ==>
  author: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl?: string;
  } | null;
  // <== ASSETS ==>
  assets: ReleaseAsset[];
};
// <== TAG TYPE ==>
export type Tag = {
  // <== NAME ==>
  name: string;
  // <== SHA ==>
  sha: string;
  // <== ZIPBALL URL ==>
  zipballUrl?: string;
  // <== TARBALL URL ==>
  tarballUrl?: string;
  // <== NODE ID ==>
  nodeId?: string;
};
// <== TAG DETAILS TYPE ==>
export type TagDetails = {
  // <== NAME ==>
  name: string;
  // <== SHA ==>
  sha: string;
  // <== TYPE ==>
  type: string;
  // <== MESSAGE ==>
  message?: string;
  // <== TAGGER ==>
  tagger?: {
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== DATE ==>
    date: string;
  } | null;
  // <== OBJECT SHA ==>
  objectSha?: string;
  // <== OBJECT TYPE ==>
  objectType?: string;
  // <== VERIFIED ==>
  verified?: boolean;
  // <== RELEASE ==>
  release?: {
    // <== ID ==>
    id: number;
    // <== NAME ==>
    name: string | null;
    // <== HTML URL ==>
    htmlUrl: string;
    // <== DRAFT ==>
    draft: boolean;
    // <== PRERELEASE ==>
    prerelease: boolean;
    // <== PUBLISHED AT ==>
    publishedAt: string | null;
  } | null;
};
// <== CREATE RELEASE INPUT TYPE ==>
export type CreateReleaseInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TAG NAME ==>
  tagName: string;
  // <== TARGET COMMITISH ==>
  targetCommitish?: string;
  // <== NAME ==>
  name?: string;
  // <== BODY ==>
  body?: string;
  // <== DRAFT ==>
  draft?: boolean;
  // <== PRERELEASE ==>
  prerelease?: boolean;
  // <== GENERATE RELEASE NOTES ==>
  generateReleaseNotes?: boolean;
};
// <== UPDATE RELEASE INPUT TYPE ==>
export type UpdateReleaseInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== RELEASE ID ==>
  releaseId: number;
  // <== TAG NAME ==>
  tagName?: string;
  // <== TARGET COMMITISH ==>
  targetCommitish?: string;
  // <== NAME ==>
  name?: string;
  // <== BODY ==>
  body?: string;
  // <== DRAFT ==>
  draft?: boolean;
  // <== PRERELEASE ==>
  prerelease?: boolean;
};
// <== CREATE TAG INPUT TYPE ==>
export type CreateTagInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TAG NAME ==>
  tagName: string;
  // <== SHA ==>
  sha: string;
  // <== MESSAGE ==>
  message?: string;
};
// <== GENERATE RELEASE NOTES INPUT TYPE ==>
export type GenerateReleaseNotesInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TAG NAME ==>
  tagName: string;
  // <== TARGET COMMITISH ==>
  targetCommitish?: string;
  // <== PREVIOUS TAG NAME ==>
  previousTagName?: string;
};
// <== DEPLOYMENT CREATOR TYPE ==>
export type DeploymentCreator = {
  // <== LOGIN ==>
  login: string;
  // <== AVATAR URL ==>
  avatarUrl: string;
  // <== HTML URL ==>
  htmlUrl?: string;
};
// <== DEPLOYMENT STATUS TYPE ==>
export type DeploymentStatus = {
  // <== ID ==>
  id: number;
  // <== STATE ==>
  state:
    | "error"
    | "failure"
    | "inactive"
    | "in_progress"
    | "queued"
    | "pending"
    | "success";
  // <== DESCRIPTION ==>
  description: string | null;
  // <== ENVIRONMENT URL ==>
  environmentUrl: string | null;
  // <== LOG URL ==>
  logUrl: string | null;
  // <== CREATOR ==>
  creator: DeploymentCreator | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== NODE ID ==>
  nodeId?: string;
};
// <== DEPLOYMENT TYPE ==>
export type Deployment = {
  // <== ID ==>
  id: number;
  // <== SHA ==>
  sha: string;
  // <== REF ==>
  ref: string;
  // <== TASK ==>
  task: string;
  // <== ENVIRONMENT ==>
  environment: string;
  // <== DESCRIPTION ==>
  description: string | null;
  // <== CREATOR ==>
  creator: DeploymentCreator | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== TRANSIENT ENVIRONMENT ==>
  transientEnvironment?: boolean;
  // <== PRODUCTION ENVIRONMENT ==>
  productionEnvironment?: boolean;
  // <== NODE ID ==>
  nodeId?: string;
  // <== STATUSES URL ==>
  statusesUrl?: string;
  // <== REPOSITORY URL ==>
  repositoryUrl?: string;
  // <== LATEST STATUS ==>
  latestStatus?: DeploymentStatus | null;
};
// <== ENVIRONMENT PROTECTION RULE TYPE ==>
export type EnvironmentProtectionRule = {
  // <== ID ==>
  id: number;
  // <== TYPE ==>
  type: string;
  // <== WAIT TIMER ==>
  waitTimer?: number;
  // <== REVIEWERS ==>
  reviewers?: Array<{
    type: string;
    login?: string;
    avatarUrl?: string;
  }>;
};
// <== ENVIRONMENT TYPE ==>
export type Environment = {
  // <== ID ==>
  id: number;
  // <== NAME ==>
  name: string;
  // <== HTML URL ==>
  htmlUrl?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== PROTECTION RULES ==>
  protectionRules?: EnvironmentProtectionRule[];
  // <== DEPLOYMENT BRANCH POLICY ==>
  deploymentBranchPolicy?: {
    protectedBranches: boolean;
    customBranchPolicies: boolean;
  } | null;
};
// <== CREATE DEPLOYMENT INPUT TYPE ==>
export type CreateDeploymentInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== REF ==>
  ref: string;
  // <== TASK ==>
  task?: string;
  // <== AUTO MERGE ==>
  autoMerge?: boolean;
  // <== REQUIRED CONTEXTS ==>
  requiredContexts?: string[];
  // <== PAYLOAD ==>
  payload?: string | Record<string, unknown>;
  // <== ENVIRONMENT ==>
  environment?: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== TRANSIENT ENVIRONMENT ==>
  transientEnvironment?: boolean;
  // <== PRODUCTION ENVIRONMENT ==>
  productionEnvironment?: boolean;
};
// <== CREATE DEPLOYMENT STATUS INPUT TYPE ==>
export type CreateDeploymentStatusInput = {
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== DEPLOYMENT ID ==>
  deploymentId: number;
  // <== STATE ==>
  state:
    | "error"
    | "failure"
    | "inactive"
    | "in_progress"
    | "queued"
    | "pending"
    | "success";
  // <== LOG URL ==>
  logUrl?: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== ENVIRONMENT URL ==>
  environmentUrl?: string;
  // <== AUTO INACTIVE ==>
  autoInactive?: boolean;
};
// <== DASHBOARD STATS TYPE ==>
export type DashboardStats = {
  // <== REPOSITORIES STATS ==>
  repositories: {
    // <== TOTAL ==>
    total: number;
    // <== PUBLIC ==>
    public: number;
    // <== PRIVATE ==>
    private: number;
  };
  // <== STARS COUNT ==>
  stars: number;
  // <== FORKS COUNT ==>
  forks: number;
  // <== PULL REQUESTS STATS ==>
  pullRequests: {
    // <== OPEN ==>
    open: number;
    // <== PENDING REVIEWS ==>
    pendingReviews: number;
  };
  // <== ISSUES STATS ==>
  issues: {
    // <== OPEN ==>
    open: number;
    // <== ASSIGNED ==>
    assigned: number;
  };
  // <== TOP LANGUAGES ==>
  topLanguages: {
    // <== LANGUAGE ==>
    language: string;
    // <== COUNT ==>
    count: number;
  }[];
  // <== RECENT REPOS ==>
  recentRepos: {
    // <== ID ==>
    id: number;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
    // <== DESCRIPTION ==>
    description: string | null;
    // <== LANGUAGE ==>
    language: string | null;
    // <== STARS ==>
    stars: number;
    // <== FORKS ==>
    forks: number;
    // <== PRIVATE ==>
    private: boolean;
    // <== UPDATED AT ==>
    updatedAt: string;
    // <== PUSHED AT ==>
    pushedAt: string;
    // <== HTML URL ==>
    htmlUrl: string;
  }[];
};
// <== DASHBOARD ACTIVITY TYPE ==>
export type DashboardActivity = {
  // <== ID ==>
  id: string;
  // <== TYPE ==>
  type: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== REPO ==>
  repo: {
    // <== ID ==>
    id: number;
    // <== NAME ==>
    name: string;
    // <== URL ==>
    url: string;
  };
  // <== ACTOR ==>
  actor: {
    id: number;
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  };
  // <== DETAILS (VARIES BY TYPE) ==>
  details?: {
    // <== REF ==>
    ref?: string;
    // <== HEAD ==>
    head?: string;
    // <== BEFORE ==>
    before?: string;
    // <== ACTION ==>
    action?: string;
    // <== NUMBER ==>
    number?: number;
    // <== TITLE ==>
    title?: string;
    // <== STATE ==>
    state?: string;
    // <== MERGED ==>
    merged?: boolean;
    // <== ISSUE NUMBER ==>
    issueNumber?: number;
    // <== ISSUE TITLE ==>
    issueTitle?: string;
    // <== BODY ==>
    body?: string;
    // <== REF TYPE ==>
    refType?: string;
    // <== DESCRIPTION ==>
    description?: string;
    // <== FORK EVENT ==>
    forkee?: {
      // <== FULL NAME ==>
      fullName: string;
      // <== HTML URL ==>
      htmlUrl: string;
    };
    // <== RELEASE EVENT ==>
    tagName?: string;
    // <== NAME ==>
    name?: string;
    // <== PR REVIEW EVENT ==>
    prNumber?: number;
    // <== PR TITLE ==>
    prTitle?: string;
  };
};
// <== STARRED REPOSITORY TYPE ==>
export type StarredRepository = {
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
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
    // <== HTML URL ==>
    htmlUrl: string;
  };
};
// <== PINNED REPOSITORY TYPE ==>
export type PinnedRepository = {
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
  // <== LANGUAGE COLOR ==>
  languageColor: string | null;
  // <== STARS ==>
  stars: number;
  // <== FORKS ==>
  forks: number;
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
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  };
};
// <== GITHUB NOTIFICATION TYPE ==>
export type GitHubNotification = {
  // <== ID ==>
  id: string;
  // <== UNREAD ==>
  unread: boolean;
  // <== REASON ==>
  reason: GitHubNotificationReason;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== LAST READ AT ==>
  lastReadAt: string | null;
  // <== SUBJECT ==>
  subject: {
    // <== TITLE ==>
    title: string;
    // <== URL ==>
    url: string | null;
    // <== LATEST COMMENT URL ==>
    latestCommentUrl: string | null;
    // <== TYPE ==>
    type: GitHubNotificationSubjectType;
  };
  // <== REPOSITORY ==>
  repository: {
    // <== ID ==>
    id: number;
    // <== NAME ==>
    name: string;
    // <== FULL NAME ==>
    fullName: string;
    // <== OWNER ==>
    owner: {
      // <== LOGIN ==>
      login: string;
      // <== AVATAR URL ==>
      avatarUrl: string;
    };
    // <== PRIVATE ==>
    private: boolean;
    // <== HTML URL ==>
    htmlUrl: string;
  };
  // <== URL ==>
  url: string;
  // <== SUBSCRIPTION URL ==>
  subscriptionUrl: string;
};
// <== GITHUB NOTIFICATIONS RESPONSE TYPE ==>
export type GitHubNotificationsResponse = {
  // <== NOTIFICATIONS ==>
  notifications: GitHubNotification[];
  // <== COUNT ==>
  count: number;
  // <== PAGINATION ==>
  pagination: {
    // <== PAGE ==>
    page: number;
    // <== PER PAGE ==>
    perPage: number;
    // <== HAS NEXT ==>
    hasNext: boolean;
    // <== HAS PREV ==>
    hasPrev: boolean;
  };
};
// <== GITHUB DISCUSSION CATEGORY TYPE ==>
export type DiscussionCategory = {
  // <== ID ==>
  id: string;
  // <== NAME ==>
  name: string;
  // <== EMOJI ==>
  emoji: string;
  // <== EMOJI HTML ==>
  emojiHTML: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== IS ANSWERABLE ==>
  isAnswerable: boolean;
  // <== SLUG ==>
  slug: string;
};
// <== GITHUB DISCUSSION AUTHOR TYPE ==>
export type DiscussionAuthor = {
  // <== LOGIN ==>
  login: string;
  // <== AVATAR URL ==>
  avatarUrl: string;
};
// <== GITHUB DISCUSSION COMMENT REPLY TYPE ==>
export type DiscussionCommentReply = {
  // <== ID ==>
  id: string;
  // <== BODY ==>
  body: string;
  // <== BODY HTML ==>
  bodyHTML: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== AUTHOR ==>
  author: DiscussionAuthor | null;
  // <== REACTIONS COUNT ==>
  reactionsCount: number;
};
// <== GITHUB DISCUSSION COMMENT TYPE ==>
export type DiscussionComment = {
  // <== ID ==>
  id: string;
  // <== BODY ==>
  body: string;
  // <== BODY HTML ==>
  bodyHTML: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== IS ANSWER ==>
  isAnswer: boolean;
  // <== AUTHOR ==>
  author: DiscussionAuthor | null;
  // <== REACTIONS COUNT ==>
  reactionsCount: number;
  // <== REPLIES COUNT ==>
  repliesCount: number;
  // <== REPLIES ==>
  replies: DiscussionCommentReply[];
};
// <== GITHUB DISCUSSION ANSWER TYPE ==>
export type DiscussionAnswer = {
  // <== ID ==>
  id: string;
  // <== BODY ==>
  body: string;
  // <== BODY HTML ==>
  bodyHTML?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt?: string;
  // <== IS ANSWER ==>
  isAnswer?: boolean;
  // <== AUTHOR ==>
  author: DiscussionAuthor | null;
  // <== REACTIONS COUNT ==>
  reactionsCount?: number;
  // <== REPLIES COUNT ==>
  repliesCount?: number;
  // <== REPLIES ==>
  replies?: DiscussionCommentReply[];
};
// <== GITHUB DISCUSSION TYPE ==>
export type Discussion = {
  // <== ID ==>
  id: string;
  // <== NUMBER ==>
  number: number;
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body: string;
  // <== BODY HTML ==>
  bodyHTML?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== URL ==>
  url: string;
  // <== LOCKED ==>
  locked: boolean;
  // <== ACTIVE LOCK REASON ==>
  activeLockReason: string | null;
  // <== ANSWER CHOSEN AT ==>
  answerChosenAt: string | null;
  // <== ANSWER CHOSEN BY ==>
  answerChosenBy: DiscussionAuthor | null;
  // <== AUTHOR ==>
  author: DiscussionAuthor | null;
  // <== CATEGORY ==>
  category: DiscussionCategory | null;
  // <== ANSWER ==>
  answer: DiscussionAnswer | null;
  // <== COMMENTS COUNT ==>
  commentsCount: number;
  // <== REACTIONS COUNT ==>
  reactionsCount: number;
  // <== UPVOTE COUNT ==>
  upvoteCount: number;
};
// <== GITHUB DISCUSSION DETAILS TYPE ==>
export type DiscussionDetails = Discussion & {
  // <== COMMENTS ==>
  comments: DiscussionComment[];
  // <== COMMENTS PAGE INFO ==>
  commentsPageInfo: {
    // <== HAS NEXT PAGE ==>
    hasNextPage: boolean;
    // <== HAS PREVIOUS PAGE ==>
    hasPreviousPage: boolean;
    // <== START CURSOR ==>
    startCursor: string | null;
    // <== END CURSOR ==>
    endCursor: string | null;
  };
};
// <== GITHUB DISCUSSIONS RESPONSE TYPE ==>
export type DiscussionsResponse = {
  // <== DISCUSSIONS ==>
  discussions: Discussion[];
  // <== CATEGORIES ==>
  categories: DiscussionCategory[];
  // <== TOTAL COUNT ==>
  totalCount: number;
  // <== PAGE INFO ==>
  pageInfo: {
    // <== HAS NEXT PAGE ==>
    hasNextPage: boolean;
    // <== HAS PREVIOUS PAGE ==>
    hasPreviousPage: boolean;
    // <== START CURSOR ==>
    startCursor: string | null;
    // <== END CURSOR ==>
    endCursor: string | null;
  };
};
// <== EXTENDED PROFILE TYPE ==>
export type ExtendedProfile = {
  // <== ID ==>
  id: string;
  // <== LOGIN ==>
  login: string;
  // <== NAME ==>
  name: string | null;
  // <== EMAIL ==>
  email: string | null;
  // <== BIO ==>
  bio: string | null;
  // <== COMPANY ==>
  company: string | null;
  // <== LOCATION ==>
  location: string | null;
  // <== WEBSITE URL ==>
  websiteUrl: string | null;
  // <== TWITTER USERNAME ==>
  twitterUsername: string | null;
  // <== AVATAR URL ==>
  avatarUrl: string;
  // <== PROFILE URL ==>
  profileUrl: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== IS HIREABLE ==>
  isHireable: boolean | null;
  // <== PRONOUNS ==>
  pronouns: string | null;
  // <== FOLLOWERS ==>
  followers: number;
  // <== FOLLOWING ==>
  following: number;
  // <== PUBLIC REPOS ==>
  publicRepos: number;
  // <== PRIVATE REPOS ==>
  privateRepos: number;
  // <== TOTAL REPOS ==>
  totalRepos: number;
  // <== STARRED REPOS ==>
  starredRepos: number;
  // <== WATCHING ==>
  watching: number;
  // <== GISTS ==>
  gists: number;
  // <== PUBLIC GISTS ==>
  publicGists: number;
  // <== SPONSORING ==>
  sponsoring: number;
  // <== SPONSORS ==>
  sponsors: number;
  // <== STATUS ==>
  status: {
    // <== EMOJI ==>
    emoji: string | null;
    // <== MESSAGE ==>
    message: string | null;
    // <== BUSY ==>
    busy: boolean;
  } | null;
  // <== SOCIAL ACCOUNTS ==>
  socialAccounts: {
    // <== PROVIDER ==>
    provider: string;
    // <== URL ==>
    url: string;
    // <== DISPLAY NAME ==>
    displayName: string | null;
  }[];
};
// <== CONTRIBUTION DAY TYPE ==>
export type ContributionDay = {
  // <== COUNT ==>
  count: number;
  // <== LEVEL ==>
  level:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  // <== DATE ==>
  date: string;
  // <== WEEKDAY ==>
  weekday: number;
};
// <== CONTRIBUTION WEEK TYPE ==>
export type ContributionWeek = {
  // <== FIRST DAY ==>
  firstDay: string;
  // <== DAYS ==>
  days: ContributionDay[];
};
// <== CONTRIBUTION MONTH TYPE ==>
export type ContributionMonth = {
  // <== NAME ==>
  name: string;
  // <== YEAR ==>
  year: number;
  // <== FIRST DAY ==>
  firstDay: string;
  // <== TOTAL WEEKS ==>
  totalWeeks: number;
};
// <== TOP REPOSITORY TYPE ==>
export type TopContributionRepository = {
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== URL ==>
  url: string;
  // <== IS PRIVATE ==>
  isPrivate: boolean;
  // <== LANGUAGE ==>
  language: {
    // <== NAME ==>
    name: string;
    // <== COLOR ==>
    color: string;
  } | null;
  // <== COMMITS ==>
  commits: number;
};
// <== CONTRIBUTION STATS TYPE ==>
export type ContributionStats = {
  // <== TOTAL CONTRIBUTIONS ==>
  totalContributions: number;
  // <== COMMITS ==>
  commits: number;
  // <== ISSUES ==>
  issues: number;
  // <== PULL REQUESTS ==>
  pullRequests: number;
  // <== PULL REQUEST REVIEWS ==>
  pullRequestReviews: number;
  // <== REPOSITORIES CONTRIBUTED TO ==>
  repositoriesContributedTo: {
    // <== COMMITS ==>
    commits: number;
    // <== ISSUES ==>
    issues: number;
    // <== PULL REQUESTS ==>
    pullRequests: number;
    // <== REVIEWS ==>
    reviews: number;
  };
  // <== PRIVATE CONTRIBUTIONS ==>
  privateContributions: number;
  // <== STREAKS ==>
  streaks: {
    // <== CURRENT STREAK ==>
    current: {
      // <== COUNT ==>
      count: number;
      // <== START ==>
      start: string | null;
      // <== END ==>
      end: string | null;
    };
    // <== LONGEST STREAK ==>
    longest: {
      // <== COUNT ==>
      count: number;
      // <== START ==>
      start: string | null;
      // <== END ==>
      end: string | null;
    };
  };
  // <== CALENDAR ==>
  calendar: {
    // <== TOTAL CONTRIBUTIONS ==>
    totalContributions: number;
    // <== WEEKS ==>
    weeks: ContributionWeek[];
    // <== MONTHS ==>
    months: ContributionMonth[];
  };
  // <== TOP REPOSITORIES ==>
  topRepositories: TopContributionRepository[];
  // <== AVAILABLE YEARS ==>
  availableYears: number[];
  // <== DATE RANGE ==>
  dateRange: {
    // <== FROM ==>
    from: string;
    // <== TO ==>
    to: string;
  };
};
// <== PROFILE README TYPE ==>
export type ProfileReadme = {
  // <== CONTENT ==>
  content: string;
  // <== HTML URL ==>
  htmlUrl: string;
  // <== PATH ==>
  path: string;
  // <== SHA ==>
  sha: string;
  // <== SIZE ==>
  size: number;
} | null;
// <== CONTRIBUTION ACTIVITY REPOSITORY TYPE ==>
export type ContributionActivityRepository = {
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== URL ==>
  url: string;
  // <== IS PRIVATE ==>
  isPrivate: boolean;
  // <== COUNT ==>
  count: number;
  // <== OWNER (FOR COMMITS) ==>
  owner?: {
    // <== LOGIN ==>
    login: string;
    // <== AVATAR URL ==>
    avatarUrl: string;
  };
};
// <== CONTRIBUTION CREATED REPOSITORY TYPE ==>
export type ContributionCreatedRepository = {
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== URL ==>
  url: string;
  // <== IS PRIVATE ==>
  isPrivate: boolean;
  // <== CREATED AT ==>
  createdAt: string;
  // <== LANGUAGE ==>
  language: {
    // <== NAME ==>
    name: string;
    // <== COLOR ==>
    color: string;
  } | null;
};
// <== CONTRIBUTION MILESTONE TYPE ==>
export type ContributionMilestone = {
  // <== TITLE ==>
  title: string;
  // <== NUMBER ==>
  number: number;
  // <== URL ==>
  url: string;
  // <== REPOSITORY ==>
  repository: string;
  // <== OCCURRED AT ==>
  occurredAt: string;
} | null;
// <== GITHUB NOTIFICATION REASON TYPES ==>
export type GitHubNotificationReason =
  | "assign"
  | "author"
  | "comment"
  | "ci_activity"
  | "invitation"
  | "manual"
  | "mention"
  | "review_requested"
  | "security_alert"
  | "state_change"
  | "subscribed"
  | "team_mention";
// <== GITHUB NOTIFICATION SUBJECT TYPE ==>
export type GitHubNotificationSubjectType =
  | "Issue"
  | "PullRequest"
  | "Commit"
  | "Release"
  | "Discussion"
  | "RepositoryVulnerabilityAlert"
  | "CheckSuite"
  | "RepositoryInvitation";

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
    totalCount: rawData.pagination.totalCount || rawData.repositories.length,
    hasMore: rawData.pagination.hasMore ?? false,
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

// <== FETCH PULL REQUEST DETAILS FUNCTION ==>
const fetchPullRequestDetails = async (
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestDetails> => {
  // FETCH PULL REQUEST DETAILS
  const response = await apiClient.get<ApiResponse<PullRequestDetails>>(
    `/github/repositories/${owner}/${repo}/pulls/${pullNumber}`
  );
  // RETURN PULL REQUEST DETAILS
  return response.data.data;
};

// <== FETCH PULL REQUEST COMMENTS FUNCTION ==>
const fetchPullRequestComments = async (
  owner: string,
  repo: string,
  pullNumber: number
): Promise<{
  issueComments: PullRequestComment[];
  reviewComments: PullRequestComment[];
}> => {
  // FETCH PULL REQUEST COMMENTS
  const response = await apiClient.get<
    ApiResponse<{
      issueComments: PullRequestComment[];
      reviewComments: PullRequestComment[];
    }>
  >(`/github/repositories/${owner}/${repo}/pulls/${pullNumber}/comments`);
  // RETURN PULL REQUEST COMMENTS
  return response.data.data;
};

// <== FETCH PULL REQUEST REVIEWS FUNCTION ==>
const fetchPullRequestReviews = async (
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestReview[]> => {
  // FETCH PULL REQUEST REVIEWS
  const response = await apiClient.get<ApiResponse<PullRequestReview[]>>(
    `/github/repositories/${owner}/${repo}/pulls/${pullNumber}/reviews`
  );
  // RETURN PULL REQUEST REVIEWS
  return response.data.data;
};

// <== FETCH PULL REQUEST FILES FUNCTION ==>
const fetchPullRequestFiles = async (
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestFile[]> => {
  // FETCH PULL REQUEST FILES
  const response = await apiClient.get<ApiResponse<PullRequestFile[]>>(
    `/github/repositories/${owner}/${repo}/pulls/${pullNumber}/files`
  );
  // RETURN PULL REQUEST FILES
  return response.data.data;
};

// <== CREATE PULL REQUEST FUNCTION ==>
const createPullRequest = async (
  input: CreatePullRequestInput
): Promise<GitHubPullRequest> => {
  // CREATE PULL REQUEST
  const response = await apiClient.post<ApiResponse<GitHubPullRequest>>(
    `/github/repositories/${input.owner}/${input.repo}/pulls`,
    {
      title: input.title,
      body: input.body,
      head: input.head,
      base: input.base,
      draft: input.draft,
    }
  );
  // RETURN CREATED PULL REQUEST
  return response.data.data;
};

// <== MERGE PULL REQUEST FUNCTION ==>
const mergePullRequest = async (
  input: MergePullRequestInput
): Promise<{ sha: string; merged: boolean; message: string }> => {
  // MERGE PULL REQUEST
  const response = await apiClient.put<
    ApiResponse<{ sha: string; merged: boolean; message: string }>
  >(
    `/github/repositories/${input.owner}/${input.repo}/pulls/${input.pullNumber}/merge`,
    {
      commit_title: input.commitTitle,
      commit_message: input.commitMessage,
      merge_method: input.mergeMethod,
    }
  );
  // RETURN MERGE RESULT
  return response.data.data;
};

// <== UPDATE PULL REQUEST FUNCTION ==>
const updatePullRequest = async (
  input: UpdatePullRequestInput
): Promise<GitHubPullRequest> => {
  // UPDATE PULL REQUEST
  const response = await apiClient.patch<ApiResponse<GitHubPullRequest>>(
    `/github/repositories/${input.owner}/${input.repo}/pulls/${input.pullNumber}`,
    {
      title: input.title,
      body: input.body,
      state: input.state,
      base: input.base,
    }
  );
  // RETURN UPDATED PULL REQUEST
  return response.data.data;
};

// <== ADD PULL REQUEST COMMENT FUNCTION ==>
const addPullRequestComment = async (
  input: AddPRCommentInput
): Promise<PullRequestComment> => {
  // ADD COMMENT
  const response = await apiClient.post<ApiResponse<PullRequestComment>>(
    `/github/repositories/${input.owner}/${input.repo}/pulls/${input.pullNumber}/comments`,
    { body: input.body }
  );
  // RETURN ADDED COMMENT
  return response.data.data;
};

// <== CREATE PULL REQUEST REVIEW FUNCTION ==>
const createPullRequestReview = async (
  input: CreateReviewInput
): Promise<PullRequestReview> => {
  // CREATE REVIEW
  const response = await apiClient.post<ApiResponse<PullRequestReview>>(
    `/github/repositories/${input.owner}/${input.repo}/pulls/${input.pullNumber}/reviews`,
    {
      body: input.body,
      event: input.event,
      comments: input.comments,
    }
  );
  // RETURN CREATED REVIEW
  return response.data.data;
};

// <== REQUEST PULL REQUEST REVIEWERS FUNCTION ==>
const requestPullRequestReviewers = async (
  input: RequestReviewersInput
): Promise<{
  requestedReviewers: { login: string | null; avatarUrl: string | null }[];
}> => {
  // REQUEST REVIEWERS
  const response = await apiClient.post<
    ApiResponse<{
      requestedReviewers: { login: string | null; avatarUrl: string | null }[];
    }>
  >(
    `/github/repositories/${input.owner}/${input.repo}/pulls/${input.pullNumber}/reviewers`,
    {
      reviewers: input.reviewers,
      team_reviewers: input.teamReviewers,
    }
  );
  // RETURN REQUESTED REVIEWERS
  return response.data.data;
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

// <== FETCH ISSUE DETAILS ==>
const fetchIssueDetails = async (
  owner: string,
  repo: string,
  issueNumber: number
): Promise<IssueDetails> => {
  // FETCH ISSUE DETAILS
  const response = await apiClient.get<ApiResponse<IssueDetails>>(
    `/github/repositories/${owner}/${repo}/issues/${issueNumber}`
  );
  // RETURN ISSUE DETAILS
  return response.data.data;
};

// <== USE ISSUE DETAILS HOOK ==>
export const useIssueDetails = (
  owner: string,
  repo: string,
  issueNumber: number,
  enabled: boolean = true
) => {
  // USE ISSUE DETAILS
  const { data, isLoading, isError, error, refetch } = useQuery<
    IssueDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-issue-details", owner, repo, issueNumber],
    queryFn: () => fetchIssueDetails(owner, repo, issueNumber),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!issueNumber,
  });
  // RETURN ISSUE DETAILS
  return { issue: data, isLoading, isError, error, refetch };
};

// <== FETCH CREATE ISSUE ==>
const fetchCreateIssue = async (
  input: CreateIssueInput
): Promise<GitHubIssue> => {
  // CREATE ISSUE
  const response = await apiClient.post<ApiResponse<GitHubIssue>>(
    `/github/repositories/${input.owner}/${input.repo}/issues`,
    {
      title: input.title,
      body: input.body,
      labels: input.labels,
      assignees: input.assignees,
      milestone: input.milestone,
    }
  );
  // RETURN CREATED ISSUE
  return response.data.data;
};

// <== USE CREATE ISSUE HOOK ==>
export const useCreateIssue = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE CREATE ISSUE MUTATION
  return useMutation<
    GitHubIssue,
    AxiosError<{ message?: string }>,
    CreateIssueInput
  >({
    // <== MUTATION FN ==>
    mutationFn: fetchCreateIssue,
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE REPOSITORY ISSUES QUERIES
      queryClient.invalidateQueries({
        queryKey: ["github-repo-issues", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Issue created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message || "Failed to create issue.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FETCH UPDATE ISSUE ==>
const fetchUpdateIssue = async (
  input: UpdateIssueInput
): Promise<GitHubIssue> => {
  // UPDATE ISSUE
  const response = await apiClient.patch<ApiResponse<GitHubIssue>>(
    `/github/repositories/${input.owner}/${input.repo}/issues/${input.issueNumber}`,
    {
      title: input.title,
      body: input.body,
      state: input.state,
      stateReason: input.stateReason,
      labels: input.labels,
      assignees: input.assignees,
      milestone: input.milestone,
    }
  );
  // RETURN UPDATED ISSUE
  return response.data.data;
};

// <== USE UPDATE ISSUE HOOK ==>
export const useUpdateIssue = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE UPDATE ISSUE MUTATION
  return useMutation<
    GitHubIssue,
    AxiosError<{ message?: string }>,
    UpdateIssueInput
  >({
    // <== MUTATION FN ==>
    mutationFn: fetchUpdateIssue,
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE REPOSITORY ISSUES QUERIES
      queryClient.invalidateQueries({
        queryKey: ["github-repo-issues", variables.owner, variables.repo],
      });
      // INVALIDATE ISSUE DETAILS QUERY
      queryClient.invalidateQueries({
        queryKey: [
          "github-issue-details",
          variables.owner,
          variables.repo,
          variables.issueNumber,
        ],
      });
      // SHOW SUCCESS TOAST
      toast.success("Issue updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message || "Failed to update issue.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FETCH ISSUE COMMENTS ==>
const fetchIssueComments = async (
  owner: string,
  repo: string,
  issueNumber: number,
  page: number = 1,
  perPage: number = 30
): Promise<{ comments: IssueComment[]; hasMore: boolean }> => {
  // FETCH ISSUE COMMENTS
  const response = await apiClient.get<
    ApiResponse<{
      comments: IssueComment[];
      pagination: { hasMore: boolean };
    }>
  >(
    `/github/repositories/${owner}/${repo}/issues/${issueNumber}/comments?page=${page}&per_page=${perPage}`
  );
  // RETURN ISSUE COMMENTS
  return {
    comments: response.data.data.comments,
    hasMore: response.data.data.pagination.hasMore,
  };
};

// <== USE ISSUE COMMENTS HOOK ==>
export const useIssueComments = (
  owner: string,
  repo: string,
  issueNumber: number,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE ISSUE COMMENTS
  const { data, isLoading, isError, error, refetch } = useQuery<
    { comments: IssueComment[]; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      "github-issue-comments",
      owner,
      repo,
      issueNumber,
      page,
      perPage,
    ],
    queryFn: () => fetchIssueComments(owner, repo, issueNumber, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!issueNumber,
  });
  // RETURN ISSUE COMMENTS
  return {
    comments: data?.comments || [],
    hasMore: data?.hasMore || false,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== FETCH ADD ISSUE COMMENT ==>
const fetchAddIssueComment = async (
  input: AddIssueCommentInput
): Promise<IssueComment> => {
  // ADD ISSUE COMMENT
  const response = await apiClient.post<ApiResponse<IssueComment>>(
    `/github/repositories/${input.owner}/${input.repo}/issues/${input.issueNumber}/comments`,
    { body: input.body }
  );
  // RETURN CREATED COMMENT
  return response.data.data;
};

// <== USE ADD ISSUE COMMENT HOOK ==>
export const useAddIssueComment = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE ADD ISSUE COMMENT MUTATION
  return useMutation<
    IssueComment,
    AxiosError<{ message?: string }>,
    AddIssueCommentInput
  >({
    // <== MUTATION FN ==>
    mutationFn: fetchAddIssueComment,
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE ISSUE COMMENTS QUERIES
      queryClient.invalidateQueries({
        queryKey: [
          "github-issue-comments",
          variables.owner,
          variables.repo,
          variables.issueNumber,
        ],
      });
      // INVALIDATE ISSUE DETAILS QUERY (COMMENT COUNT CHANGED)
      queryClient.invalidateQueries({
        queryKey: [
          "github-issue-details",
          variables.owner,
          variables.repo,
          variables.issueNumber,
        ],
      });
      // SHOW SUCCESS TOAST
      toast.success("Comment added successfully!");
    },
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message || "Failed to add comment.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FETCH REPOSITORY LABELS ==>
const fetchRepositoryLabels = async (
  owner: string,
  repo: string
): Promise<RepositoryLabel[]> => {
  // FETCH REPOSITORY LABELS
  const response = await apiClient.get<
    ApiResponse<{ labels: RepositoryLabel[] }>
  >(`/github/repositories/${owner}/${repo}/labels?per_page=100`);
  // RETURN REPOSITORY LABELS
  return response.data.data.labels;
};

// <== USE REPOSITORY LABELS HOOK ==>
export const useRepositoryLabels = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY LABELS
  const { data, isLoading, isError, error, refetch } = useQuery<
    RepositoryLabel[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-repo-labels", owner, repo],
    queryFn: () => fetchRepositoryLabels(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN REPOSITORY LABELS
  return { labels: data || [], isLoading, isError, error, refetch };
};

// <== FETCH SEARCH ISSUES ==>
const fetchSearchIssues = async (
  owner: string,
  repo: string,
  query: string,
  state?: string,
  page: number = 1,
  perPage: number = 30
): Promise<{ issues: GitHubIssue[]; totalCount: number; hasMore: boolean }> => {
  // BUILD QUERY PARAMS
  let url = `/github/repositories/${owner}/${repo}/issues/search?page=${page}&per_page=${perPage}`;
  if (query) url += `&q=${encodeURIComponent(query)}`;
  if (state) url += `&state=${state}`;
  // FETCH SEARCH ISSUES
  const response = await apiClient.get<
    ApiResponse<{
      issues: GitHubIssue[];
      totalCount: number;
      pagination: { hasMore: boolean };
    }>
  >(url);
  // RETURN SEARCH RESULTS
  return {
    issues: response.data.data.issues,
    totalCount: response.data.data.totalCount,
    hasMore: response.data.data.pagination.hasMore,
  };
};

// <== USE SEARCH ISSUES HOOK ==>
export const useSearchIssues = (
  owner: string,
  repo: string,
  query: string,
  state?: string,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE SEARCH ISSUES
  const { data, isLoading, isError, error, refetch } = useQuery<
    { issues: GitHubIssue[]; totalCount: number; hasMore: boolean },
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      "github-search-issues",
      owner,
      repo,
      query,
      state,
      page,
      perPage,
    ],
    queryFn: () => fetchSearchIssues(owner, repo, query, state, page, perPage),
    retry: 1,
    staleTime: 1 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!query,
  });
  // RETURN SEARCH RESULTS
  return {
    issues: data?.issues || [],
    totalCount: data?.totalCount || 0,
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

// <== USE PULL REQUEST DETAILS HOOK ==>
export const usePullRequestDetails = (
  owner: string,
  repo: string,
  pullNumber: number,
  enabled: boolean = true
) => {
  // USE PULL REQUEST DETAILS
  const { data, isLoading, isError, error, refetch } = useQuery<
    PullRequestDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-pr-details", owner, repo, pullNumber],
    queryFn: () => fetchPullRequestDetails(owner, repo, pullNumber),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!pullNumber,
  });
  // RETURN PULL REQUEST DETAILS
  return { pullRequest: data, isLoading, isError, error, refetch };
};

// <== USE PULL REQUEST COMMENTS HOOK ==>
export const usePullRequestComments = (
  owner: string,
  repo: string,
  pullNumber: number,
  enabled: boolean = true
) => {
  // USE PULL REQUEST COMMENTS
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      issueComments: PullRequestComment[];
      reviewComments: PullRequestComment[];
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-pr-comments", owner, repo, pullNumber],
    queryFn: () => fetchPullRequestComments(owner, repo, pullNumber),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!pullNumber,
  });
  // RETURN PULL REQUEST COMMENTS
  return {
    issueComments: data?.issueComments || [],
    reviewComments: data?.reviewComments || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE PULL REQUEST REVIEWS HOOK ==>
export const usePullRequestReviews = (
  owner: string,
  repo: string,
  pullNumber: number,
  enabled: boolean = true
) => {
  // USE PULL REQUEST REVIEWS
  const { data, isLoading, isError, error, refetch } = useQuery<
    PullRequestReview[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-pr-reviews", owner, repo, pullNumber],
    queryFn: () => fetchPullRequestReviews(owner, repo, pullNumber),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!pullNumber,
  });
  // RETURN PULL REQUEST REVIEWS
  return { reviews: data || [], isLoading, isError, error, refetch };
};

// <== USE PULL REQUEST FILES HOOK ==>
export const usePullRequestFiles = (
  owner: string,
  repo: string,
  pullNumber: number,
  enabled: boolean = true
) => {
  // USE PULL REQUEST FILES
  const { data, isLoading, isError, error, refetch } = useQuery<
    PullRequestFile[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-pr-files", owner, repo, pullNumber],
    queryFn: () => fetchPullRequestFiles(owner, repo, pullNumber),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!pullNumber,
  });
  // RETURN PULL REQUEST FILES
  return { files: data || [], isLoading, isError, error, refetch };
};

// <== USE CREATE PULL REQUEST HOOK ==>
export const useCreatePullRequest = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE CREATE PULL REQUEST MUTATION
  return useMutation<
    GitHubPullRequest,
    AxiosError<{ message?: string }>,
    CreatePullRequestInput
  >({
    mutationFn: createPullRequest,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      toast.success("Pull request created successfully!");
      // INVALIDATE PULL REQUESTS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-pulls", variables.owner, variables.repo],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to create pull request"
      );
    },
  });
};

// <== USE MERGE PULL REQUEST HOOK ==>
export const useMergePullRequest = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MERGE PULL REQUEST MUTATION
  return useMutation<
    { sha: string; merged: boolean; message: string },
    AxiosError<{ message?: string }>,
    MergePullRequestInput
  >({
    mutationFn: mergePullRequest,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      toast.success("Pull request merged successfully!");
      // INVALIDATE QUERIES
      queryClient.invalidateQueries({
        queryKey: ["github-repo-pulls", variables.owner, variables.repo],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-details",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to merge pull request"
      );
    },
  });
};

// <== USE UPDATE PULL REQUEST HOOK ==>
export const useUpdatePullRequest = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE UPDATE PULL REQUEST MUTATION
  return useMutation<
    GitHubPullRequest,
    AxiosError<{ message?: string }>,
    UpdatePullRequestInput
  >({
    mutationFn: updatePullRequest,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      toast.success("Pull request updated successfully!");
      // INVALIDATE QUERIES
      queryClient.invalidateQueries({
        queryKey: ["github-repo-pulls", variables.owner, variables.repo],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-details",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to update pull request"
      );
    },
  });
};

// <== USE ADD PULL REQUEST COMMENT HOOK ==>
export const useAddPullRequestComment = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE ADD COMMENT MUTATION
  return useMutation<
    PullRequestComment,
    AxiosError<{ message?: string }>,
    AddPRCommentInput
  >({
    mutationFn: addPullRequestComment,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      toast.success("Comment added successfully!");
      // INVALIDATE COMMENTS QUERY
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-comments",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-details",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to add comment");
    },
  });
};

// <== USE CREATE PULL REQUEST REVIEW HOOK ==>
export const useCreatePullRequestReview = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE CREATE REVIEW MUTATION
  return useMutation<
    PullRequestReview,
    AxiosError<{ message?: string }>,
    CreateReviewInput
  >({
    mutationFn: createPullRequestReview,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      const eventMessages: Record<string, string> = {
        APPROVE: "Pull request approved!",
        REQUEST_CHANGES: "Changes requested!",
        COMMENT: "Review comment added!",
      };
      toast.success(eventMessages[variables.event] || "Review submitted!");
      // INVALIDATE QUERIES
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-reviews",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-details",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });
};

// <== USE REQUEST PULL REQUEST REVIEWERS HOOK ==>
export const useRequestPullRequestReviewers = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE REQUEST REVIEWERS MUTATION
  return useMutation<
    {
      requestedReviewers: { login: string | null; avatarUrl: string | null }[];
    },
    AxiosError<{ message?: string }>,
    RequestReviewersInput
  >({
    mutationFn: requestPullRequestReviewers,
    onSuccess: (_, variables) => {
      // SHOW SUCCESS TOAST
      toast.success("Reviewers requested successfully!");
      // INVALIDATE QUERIES
      queryClient.invalidateQueries({
        queryKey: [
          "github-pr-details",
          variables.owner,
          variables.repo,
          variables.pullNumber,
        ],
      });
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to request reviewers"
      );
    },
  });
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

// <== FETCH BRANCH DETAILS FUNCTION ==>
const fetchBranchDetails = async (
  owner: string,
  repo: string,
  branch: string
): Promise<BranchDetails> => {
  // FETCH BRANCH DETAILS
  const response = await apiClient.get<ApiResponse<BranchDetails>>(
    `/github/repositories/${owner}/${repo}/branches/${encodeURIComponent(
      branch
    )}`
  );
  // RETURN BRANCH DETAILS
  return response.data.data;
};

// <== USE BRANCH DETAILS HOOK ==>
export const useBranchDetails = (
  owner: string,
  repo: string,
  branch: string,
  enabled: boolean = true
) => {
  // USE BRANCH DETAILS
  const { data, isLoading, isError, error, refetch } = useQuery<
    BranchDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-branch-details", owner, repo, branch],
    queryFn: () => fetchBranchDetails(owner, repo, branch),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!branch,
  });
  // RETURN BRANCH DETAILS
  return { branchDetails: data, isLoading, isError, error, refetch };
};

// <== CREATE BRANCH FUNCTION ==>
const createBranchFn = async (
  input: CreateBranchInput
): Promise<{ ref: string; sha: string; branchName: string }> => {
  // CREATE BRANCH
  const response = await apiClient.post<
    ApiResponse<{ ref: string; sha: string; branchName: string }>
  >(`/github/repositories/${input.owner}/${input.repo}/branches`, {
    branchName: input.branchName,
    sourceBranch: input.sourceBranch,
    sourceSha: input.sourceSha,
  });
  // RETURN RESPONSE
  return response.data.data;
};

// <== USE CREATE BRANCH HOOK ==>
export const useCreateBranch = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE CREATE BRANCH MUTATION
  const mutation = useMutation<
    { ref: string; sha: string; branchName: string },
    AxiosError<{ message?: string }>,
    CreateBranchInput
  >({
    mutationFn: createBranchFn,
    onSuccess: (_data, variables) => {
      // INVALIDATE BRANCHES QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success(`Branch '${variables.branchName}' created successfully!`);
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to create branch");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== DELETE BRANCH FUNCTION ==>
const deleteBranchFn = async (
  input: DeleteBranchInput
): Promise<{ deletedBranch: string }> => {
  // DELETE BRANCH
  const response = await apiClient.delete<
    ApiResponse<{ deletedBranch: string }>
  >(
    `/github/repositories/${input.owner}/${
      input.repo
    }/branches/${encodeURIComponent(input.branch)}`
  );
  // RETURN RESPONSE
  return response.data.data;
};

// <== USE DELETE BRANCH HOOK ==>
export const useDeleteBranch = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE DELETE BRANCH MUTATION
  const mutation = useMutation<
    { deletedBranch: string },
    AxiosError<{ message?: string }>,
    DeleteBranchInput
  >({
    mutationFn: deleteBranchFn,
    // ON SUCCESS
    onSuccess: (_data, variables) => {
      // INVALIDATE BRANCHES QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success(`Branch '${variables.branch}' deleted successfully!`);
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to delete branch");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== MERGE BRANCHES FUNCTION ==>
const mergeBranchesFn = async (
  input: MergeBranchesInput
): Promise<MergeResult> => {
  // MERGE BRANCHES
  const response = await apiClient.post<ApiResponse<MergeResult>>(
    `/github/repositories/${input.owner}/${input.repo}/merges`,
    {
      base: input.base,
      head: input.head,
      commitMessage: input.commitMessage,
    }
  );
  // RETURN RESPONSE
  return response.data.data;
};

// <== USE MERGE BRANCHES HOOK ==>
export const useMergeBranches = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MERGE BRANCHES MUTATION
  const mutation = useMutation<
    MergeResult,
    AxiosError<{ message?: string }>,
    MergeBranchesInput
  >({
    mutationFn: mergeBranchesFn,
    onSuccess: (data, variables) => {
      // INVALIDATE BRANCHES QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
      // INVALIDATE COMMITS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-commits", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      if (data.alreadyUpToDate) {
        toast.info("Branches are already up to date.");
      } else if (data.merged) {
        toast.success(
          `Successfully merged '${variables.head}' into '${variables.base}'!`
        );
      }
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to merge branches");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH BRANCH PROTECTION FUNCTION ==>
const fetchBranchProtection = async (
  owner: string,
  repo: string,
  branch: string
): Promise<BranchProtection> => {
  // FETCH BRANCH PROTECTION
  const response = await apiClient.get<ApiResponse<BranchProtection>>(
    `/github/repositories/${owner}/${repo}/branches/${encodeURIComponent(
      branch
    )}/protection`
  );
  // RETURN BRANCH PROTECTION
  return response.data.data;
};

// <== USE BRANCH PROTECTION HOOK ==>
export const useBranchProtection = (
  owner: string,
  repo: string,
  branch: string,
  enabled: boolean = true
) => {
  // USE BRANCH PROTECTION
  const { data, isLoading, isError, error, refetch } = useQuery<
    BranchProtection,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-branch-protection", owner, repo, branch],
    queryFn: () => fetchBranchProtection(owner, repo, branch),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!branch,
  });
  // RETURN BRANCH PROTECTION
  return { protection: data, isLoading, isError, error, refetch };
};

// <== UPDATE BRANCH PROTECTION FUNCTION ==>
const updateBranchProtectionFn = async (
  input: UpdateBranchProtectionInput
): Promise<{ branch: string; protected: boolean }> => {
  // UPDATE BRANCH PROTECTION
  const response = await apiClient.put<
    ApiResponse<{ branch: string; protected: boolean }>
  >(
    `/github/repositories/${input.owner}/${
      input.repo
    }/branches/${encodeURIComponent(input.branch)}/protection`,
    {
      requiredStatusChecks: input.requiredStatusChecks,
      enforceAdmins: input.enforceAdmins,
      requiredPullRequestReviews: input.requiredPullRequestReviews,
      restrictions: input.restrictions,
      requiredLinearHistory: input.requiredLinearHistory,
      allowForcePushes: input.allowForcePushes,
      allowDeletions: input.allowDeletions,
      requiredConversationResolution: input.requiredConversationResolution,
    }
  );
  // RETURN RESPONSE
  return response.data.data;
};

// <== USE UPDATE BRANCH PROTECTION HOOK ==>
export const useUpdateBranchProtection = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE UPDATE BRANCH PROTECTION MUTATION
  const mutation = useMutation<
    { branch: string; protected: boolean },
    AxiosError<{ message?: string }>,
    UpdateBranchProtectionInput
  >({
    mutationFn: updateBranchProtectionFn,
    // ON SUCCESS
    onSuccess: (_data, variables) => {
      // INVALIDATE BRANCH PROTECTION QUERY
      queryClient.invalidateQueries({
        queryKey: [
          "github-branch-protection",
          variables.owner,
          variables.repo,
          variables.branch,
        ],
      });
      // INVALIDATE BRANCHES QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Branch protection updated successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to update branch protection"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== DELETE BRANCH PROTECTION FUNCTION ==>
const deleteBranchProtectionFn = async (
  input: DeleteBranchProtectionInput
): Promise<{ branch: string; protected: boolean }> => {
  // DELETE BRANCH PROTECTION
  const response = await apiClient.delete<
    ApiResponse<{ branch: string; protected: boolean }>
  >(
    `/github/repositories/${input.owner}/${
      input.repo
    }/branches/${encodeURIComponent(input.branch)}/protection`
  );
  // RETURN RESPONSE
  return response.data.data;
};

// <== USE DELETE BRANCH PROTECTION HOOK ==>
export const useDeleteBranchProtection = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE DELETE BRANCH PROTECTION MUTATION
  const mutation = useMutation<
    { branch: string; protected: boolean },
    AxiosError<{ message?: string }>,
    DeleteBranchProtectionInput
  >({
    mutationFn: deleteBranchProtectionFn,
    onSuccess: (_data, variables) => {
      // INVALIDATE BRANCH PROTECTION QUERY
      queryClient.invalidateQueries({
        queryKey: [
          "github-branch-protection",
          variables.owner,
          variables.repo,
          variables.branch,
        ],
      });
      // INVALIDATE BRANCHES QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-repo-branches", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Branch protection removed successfully!");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to remove branch protection"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
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

// <== FETCH REPOSITORY INVITATIONS ==>
const fetchRepositoryInvitations = async (
  owner: string,
  repo: string
): Promise<RepositoryInvitation[]> => {
  // FETCH REPOSITORY INVITATIONS
  const response = await apiClient.get<
    ApiResponse<{ invitations: RepositoryInvitation[] }>
  >(`/github/repositories/${owner}/${repo}/invitations`);
  // RETURN INVITATIONS
  return response.data.data.invitations;
};

// <== USE REPOSITORY INVITATIONS HOOK ==>
export const useRepositoryInvitations = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE REPOSITORY INVITATIONS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    RepositoryInvitation[],
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-invitations", owner, repo],
    queryFn: () => fetchRepositoryInvitations(owner, repo),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN INVITATIONS
  return { invitations: data || [], isLoading, isError, error, refetch };
};

// <== DELETE REPOSITORY INVITATION ==>
const deleteRepositoryInvitation = async (
  owner: string,
  repo: string,
  invitationId: number
): Promise<void> => {
  // DELETE REPOSITORY INVITATION
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/invitations/${invitationId}`
  );
};

// <== USE DELETE INVITATION HOOK ==>
export const useDeleteInvitation = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE INVITATION MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; invitationId: number }
  >({
    mutationFn: ({ owner, repo, invitationId }) =>
      deleteRepositoryInvitation(owner, repo, invitationId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE INVITATIONS
      queryClient.invalidateQueries({
        queryKey: ["github-invitations", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Invitation cancelled successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to cancel invitation."
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== UPDATE REPOSITORY INVITATION ==>
const updateRepositoryInvitation = async (
  input: UpdateInvitationInput
): Promise<RepositoryInvitation> => {
  // UPDATE REPOSITORY INVITATION
  const response = await apiClient.patch<ApiResponse<RepositoryInvitation>>(
    `/github/repositories/${input.owner}/${input.repo}/invitations/${input.invitationId}`,
    { permissions: input.permissions }
  );
  // RETURN UPDATED INVITATION
  return response.data.data;
};

// <== USE UPDATE INVITATION HOOK ==>
export const useUpdateInvitation = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE INVITATION MUTATION
  const mutation = useMutation<
    RepositoryInvitation,
    AxiosError<{ message?: string }>,
    UpdateInvitationInput
  >({
    mutationFn: updateRepositoryInvitation,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE INVITATIONS
      queryClient.invalidateQueries({
        queryKey: ["github-invitations", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Invitation permission updated successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to update invitation."
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== CHECK COLLABORATOR PERMISSION ==>
const checkCollaboratorPermission = async (
  owner: string,
  repo: string,
  username: string
): Promise<CollaboratorPermissionCheck> => {
  // CHECK COLLABORATOR PERMISSION
  const response = await apiClient.get<
    ApiResponse<CollaboratorPermissionCheck>
  >(
    `/github/repositories/${owner}/${repo}/collaborators/${username}/permission`
  );
  // RETURN PERMISSION CHECK
  return response.data.data;
};

// <== USE CHECK COLLABORATOR HOOK ==>
export const useCheckCollaborator = (
  owner: string,
  repo: string,
  username: string,
  enabled: boolean = true
) => {
  // USE CHECK COLLABORATOR QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    CollaboratorPermissionCheck,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-check-collaborator", owner, repo, username],
    queryFn: () => checkCollaboratorPermission(owner, repo, username),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!username,
  });
  // RETURN PERMISSION CHECK
  return { permissionCheck: data, isLoading, isError, error, refetch };
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

// <== FETCH WORKFLOWS FUNCTION ==>
const fetchWorkflows = async (
  owner: string,
  repo: string
): Promise<{ workflows: Workflow[]; totalCount: number }> => {
  // FETCH WORKFLOWS
  const response = await apiClient.get<
    ApiResponse<{ workflows: Workflow[]; totalCount: number }>
  >(`/github/repositories/${owner}/${repo}/actions/workflows`);
  // RETURN WORKFLOWS
  return response.data.data;
};

// <== FETCH WORKFLOW DETAILS FUNCTION ==>
const fetchWorkflowDetails = async (
  owner: string,
  repo: string,
  workflowId: number
): Promise<Workflow> => {
  // FETCH WORKFLOW DETAILS
  const response = await apiClient.get<ApiResponse<Workflow>>(
    `/github/repositories/${owner}/${repo}/actions/workflows/${workflowId}`
  );
  // RETURN WORKFLOW
  return response.data.data;
};

// <== FETCH WORKFLOW RUNS FUNCTION ==>
const fetchWorkflowRuns = async (
  owner: string,
  repo: string,
  options?: {
    workflowId?: number;
    branch?: string;
    event?: string;
    status?: string;
    actor?: string;
    page?: number;
    perPage?: number;
  }
): Promise<{
  runs: WorkflowRun[];
  totalCount: number;
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // BUILD QUERY STRING
  const params = new URLSearchParams();
  if (options?.workflowId)
    params.append("workflow_id", options.workflowId.toString());
  if (options?.branch) params.append("branch", options.branch);
  if (options?.event) params.append("event", options.event);
  if (options?.status) params.append("status", options.status);
  if (options?.actor) params.append("actor", options.actor);
  if (options?.page) params.append("page", options.page.toString());
  if (options?.perPage) params.append("per_page", options.perPage.toString());
  // FETCH WORKFLOW RUNS
  const response = await apiClient.get<
    ApiResponse<{
      runs: WorkflowRun[];
      totalCount: number;
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(`/github/repositories/${owner}/${repo}/actions/runs?${params.toString()}`);
  // RETURN RUNS
  return response.data.data;
};

// <== FETCH WORKFLOW RUN DETAILS FUNCTION ==>
const fetchWorkflowRunDetails = async (
  owner: string,
  repo: string,
  runId: number
): Promise<WorkflowRunDetails> => {
  // FETCH WORKFLOW RUN DETAILS
  const response = await apiClient.get<ApiResponse<WorkflowRunDetails>>(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}`
  );
  // RETURN RUN DETAILS
  return response.data.data;
};

// <== FETCH WORKFLOW RUN JOBS FUNCTION ==>
const fetchWorkflowRunJobs = async (
  owner: string,
  repo: string,
  runId: number,
  filter: "latest" | "all" = "latest"
): Promise<{ jobs: WorkflowJob[]; totalCount: number }> => {
  // FETCH WORKFLOW RUN JOBS
  const response = await apiClient.get<
    ApiResponse<{ jobs: WorkflowJob[]; totalCount: number }>
  >(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}/jobs?filter=${filter}`
  );
  // RETURN JOBS
  return response.data.data;
};

// <== FETCH JOB LOGS FUNCTION ==>
const fetchJobLogs = async (
  owner: string,
  repo: string,
  jobId: number
): Promise<string> => {
  // FETCH JOB LOGS
  const response = await apiClient.get<ApiResponse<{ logs: string }>>(
    `/github/repositories/${owner}/${repo}/actions/jobs/${jobId}/logs`
  );
  // RETURN LOGS
  return response.data.data.logs;
};

// <== TRIGGER WORKFLOW FUNCTION ==>
const triggerWorkflow = async (input: TriggerWorkflowInput): Promise<void> => {
  // TRIGGER WORKFLOW
  await apiClient.post(
    `/github/repositories/${input.owner}/${input.repo}/actions/workflows/${input.workflowId}/dispatches`,
    { ref: input.ref, inputs: input.inputs || {} }
  );
};

// <== RERUN WORKFLOW FUNCTION ==>
const rerunWorkflow = async (
  owner: string,
  repo: string,
  runId: number
): Promise<void> => {
  // RERUN WORKFLOW
  await apiClient.post(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}/rerun`
  );
};

// <== RERUN FAILED JOBS FUNCTION ==>
const rerunFailedJobs = async (
  owner: string,
  repo: string,
  runId: number
): Promise<void> => {
  // RERUN FAILED JOBS
  await apiClient.post(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}/rerun-failed-jobs`
  );
};

// <== CANCEL WORKFLOW RUN FUNCTION ==>
const cancelWorkflowRun = async (
  owner: string,
  repo: string,
  runId: number
): Promise<void> => {
  // CANCEL WORKFLOW RUN
  await apiClient.post(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}/cancel`
  );
};

// <== DELETE WORKFLOW RUN FUNCTION ==>
const deleteWorkflowRun = async (
  owner: string,
  repo: string,
  runId: number
): Promise<void> => {
  // DELETE WORKFLOW RUN
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/actions/runs/${runId}`
  );
};

// <== USE WORKFLOWS HOOK ==>
export const useWorkflows = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE WORKFLOWS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    { workflows: Workflow[]; totalCount: number },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-workflows", owner, repo],
    queryFn: () => fetchWorkflows(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN WORKFLOWS
  return {
    workflows: data?.workflows || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE WORKFLOW DETAILS HOOK ==>
export const useWorkflowDetails = (
  owner: string,
  repo: string,
  workflowId: number,
  enabled: boolean = true
) => {
  // USE WORKFLOW DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Workflow,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-workflow", owner, repo, workflowId],
    queryFn: () => fetchWorkflowDetails(owner, repo, workflowId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!workflowId,
  });
  // RETURN WORKFLOW DETAILS
  return { workflow: data, isLoading, isError, error, refetch };
};

// <== USE WORKFLOW RUNS HOOK ==>
export const useWorkflowRuns = (
  owner: string,
  repo: string,
  options?: {
    workflowId?: number;
    branch?: string;
    event?: string;
    status?: string;
    actor?: string;
    page?: number;
    perPage?: number;
  },
  enabled: boolean = true
) => {
  // USE WORKFLOW RUNS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      runs: WorkflowRun[];
      totalCount: number;
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-workflow-runs", owner, repo, options],
    queryFn: () => fetchWorkflowRuns(owner, repo, options),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN WORKFLOW RUNS
  return {
    runs: data?.runs || [],
    totalCount: data?.totalCount || 0,
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE WORKFLOW RUN DETAILS HOOK ==>
export const useWorkflowRunDetails = (
  owner: string,
  repo: string,
  runId: number,
  enabled: boolean = true
) => {
  // USE WORKFLOW RUN DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    WorkflowRunDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-workflow-run", owner, repo, runId],
    queryFn: () => fetchWorkflowRunDetails(owner, repo, runId),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo && !!runId,
  });
  // RETURN WORKFLOW RUN DETAILS
  return { run: data, isLoading, isError, error, refetch };
};

// <== USE WORKFLOW RUN JOBS HOOK ==>
export const useWorkflowRunJobs = (
  owner: string,
  repo: string,
  runId: number,
  filter: "latest" | "all" = "latest",
  enabled: boolean = true
) => {
  // USE WORKFLOW RUN JOBS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    { jobs: WorkflowJob[]; totalCount: number },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-workflow-run-jobs", owner, repo, runId, filter],
    queryFn: () => fetchWorkflowRunJobs(owner, repo, runId, filter),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo && !!runId,
  });
  // RETURN WORKFLOW RUN JOBS
  return {
    jobs: data?.jobs || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE JOB LOGS HOOK ==>
export const useJobLogs = (
  owner: string,
  repo: string,
  jobId: number,
  enabled: boolean = true
) => {
  // USE JOB LOGS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    string,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-job-logs", owner, repo, jobId],
    queryFn: () => fetchJobLogs(owner, repo, jobId),
    retry: 1,
    staleTime: 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!jobId,
  });
  // RETURN JOB LOGS
  return { logs: data || "", isLoading, isError, error, refetch };
};

// <== USE TRIGGER WORKFLOW HOOK ==>
export const useTriggerWorkflow = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // TRIGGER WORKFLOW MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    TriggerWorkflowInput
  >({
    mutationFn: (input) => triggerWorkflow(input),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE WORKFLOW RUNS
      queryClient.invalidateQueries({
        queryKey: ["github-workflow-runs", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE RERUN WORKFLOW HOOK ==>
export const useRerunWorkflow = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RERUN WORKFLOW MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; runId: number }
  >({
    mutationFn: ({ owner, repo, runId }) => rerunWorkflow(owner, repo, runId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE WORKFLOW RUN
      queryClient.invalidateQueries({
        queryKey: [
          "github-workflow-run",
          variables.owner,
          variables.repo,
          variables.runId,
        ],
      });
      // INVALIDATE WORKFLOW RUNS
      queryClient.invalidateQueries({
        queryKey: ["github-workflow-runs", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE RERUN FAILED JOBS HOOK ==>
export const useRerunFailedJobs = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RERUN FAILED JOBS MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; runId: number }
  >({
    mutationFn: ({ owner, repo, runId }) => rerunFailedJobs(owner, repo, runId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE WORKFLOW RUN
      queryClient.invalidateQueries({
        queryKey: [
          "github-workflow-run",
          variables.owner,
          variables.repo,
          variables.runId,
        ],
      });
      // INVALIDATE WORKFLOW RUNS
      queryClient.invalidateQueries({
        queryKey: ["github-workflow-runs", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE CANCEL WORKFLOW RUN HOOK ==>
export const useCancelWorkflowRun = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CANCEL WORKFLOW RUN MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; runId: number }
  >({
    mutationFn: ({ owner, repo, runId }) =>
      cancelWorkflowRun(owner, repo, runId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE WORKFLOW RUN
      queryClient.invalidateQueries({
        queryKey: [
          "github-workflow-run",
          variables.owner,
          variables.repo,
          variables.runId,
        ],
      });
      // INVALIDATE WORKFLOW RUNS
      queryClient.invalidateQueries({
        queryKey: ["github-workflow-runs", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE DELETE WORKFLOW RUN HOOK ==>
export const useDeleteWorkflowRun = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE WORKFLOW RUN MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; runId: number }
  >({
    mutationFn: ({ owner, repo, runId }) =>
      deleteWorkflowRun(owner, repo, runId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE WORKFLOW RUNS
      queryClient.invalidateQueries({
        queryKey: ["github-workflow-runs", variables.owner, variables.repo],
      });
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH RELEASES FUNCTION ==>
const fetchReleases = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 10
): Promise<{
  releases: Release[];
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // FETCH RELEASES
  const response = await apiClient.get<
    ApiResponse<{
      releases: Release[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(
    `/github/repositories/${owner}/${repo}/releases?page=${page}&per_page=${perPage}`
  );
  // RETURN RELEASES
  return response.data.data;
};

// <== FETCH RELEASE DETAILS FUNCTION ==>
const fetchReleaseDetails = async (
  owner: string,
  repo: string,
  releaseId: number
): Promise<Release> => {
  // FETCH RELEASE DETAILS
  const response = await apiClient.get<ApiResponse<Release>>(
    `/github/repositories/${owner}/${repo}/releases/${releaseId}`
  );
  // RETURN RELEASE
  return response.data.data;
};

// <== FETCH LATEST RELEASE FUNCTION ==>
const fetchLatestRelease = async (
  owner: string,
  repo: string
): Promise<Release> => {
  // FETCH LATEST RELEASE
  const response = await apiClient.get<ApiResponse<Release>>(
    `/github/repositories/${owner}/${repo}/releases/latest`
  );
  // RETURN RELEASE
  return response.data.data;
};

// <== CREATE RELEASE FUNCTION ==>
const createReleaseFn = async (input: CreateReleaseInput): Promise<Release> => {
  // CREATE RELEASE
  const response = await apiClient.post<ApiResponse<Release>>(
    `/github/repositories/${input.owner}/${input.repo}/releases`,
    {
      tagName: input.tagName,
      targetCommitish: input.targetCommitish,
      name: input.name,
      body: input.body,
      draft: input.draft,
      prerelease: input.prerelease,
      generateReleaseNotes: input.generateReleaseNotes,
    }
  );
  // RETURN RELEASE
  return response.data.data;
};

// <== UPDATE RELEASE FUNCTION ==>
const updateReleaseFn = async (input: UpdateReleaseInput): Promise<Release> => {
  // UPDATE RELEASE
  const response = await apiClient.patch<ApiResponse<Release>>(
    `/github/repositories/${input.owner}/${input.repo}/releases/${input.releaseId}`,
    {
      tagName: input.tagName,
      targetCommitish: input.targetCommitish,
      name: input.name,
      body: input.body,
      draft: input.draft,
      prerelease: input.prerelease,
    }
  );
  // RETURN RELEASE
  return response.data.data;
};

// <== DELETE RELEASE FUNCTION ==>
const deleteReleaseFn = async (
  owner: string,
  repo: string,
  releaseId: number
): Promise<void> => {
  // DELETE RELEASE
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/releases/${releaseId}`
  );
};

// <== FETCH TAGS FUNCTION ==>
const fetchTags = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
): Promise<{
  tags: Tag[];
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // FETCH TAGS
  const response = await apiClient.get<
    ApiResponse<{
      tags: Tag[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(
    `/github/repositories/${owner}/${repo}/tags?page=${page}&per_page=${perPage}`
  );
  // RETURN TAGS
  return response.data.data;
};

// <== FETCH TAG DETAILS FUNCTION ==>
const fetchTagDetails = async (
  owner: string,
  repo: string,
  tag: string
): Promise<TagDetails> => {
  // FETCH TAG DETAILS
  const response = await apiClient.get<ApiResponse<TagDetails>>(
    `/github/repositories/${owner}/${repo}/tags/${encodeURIComponent(tag)}`
  );
  // RETURN TAG DETAILS
  return response.data.data;
};

// <== CREATE TAG FUNCTION ==>
const createTagFn = async (
  input: CreateTagInput
): Promise<{ name: string; sha: string; ref: string }> => {
  // CREATE TAG
  const response = await apiClient.post<
    ApiResponse<{ name: string; sha: string; ref: string }>
  >(`/github/repositories/${input.owner}/${input.repo}/tags`, {
    tagName: input.tagName,
    sha: input.sha,
    message: input.message,
  });
  // RETURN TAG
  return response.data.data;
};

// <== DELETE TAG FUNCTION ==>
const deleteTagFn = async (
  owner: string,
  repo: string,
  tag: string
): Promise<void> => {
  // DELETE TAG
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/tags/${encodeURIComponent(tag)}`
  );
};

// <== GENERATE RELEASE NOTES FUNCTION ==>
const generateReleaseNotesFn = async (
  input: GenerateReleaseNotesInput
): Promise<{ name: string; body: string }> => {
  // GENERATE RELEASE NOTES
  const response = await apiClient.post<
    ApiResponse<{ name: string; body: string }>
  >(
    `/github/repositories/${input.owner}/${input.repo}/releases/generate-notes`,
    {
      tagName: input.tagName,
      targetCommitish: input.targetCommitish,
      previousTagName: input.previousTagName,
    }
  );
  // RETURN RELEASE NOTES
  return response.data.data;
};

// <== USE RELEASES HOOK ==>
export const useReleases = (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 10,
  enabled: boolean = true
) => {
  // USE RELEASES QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      releases: Release[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-releases", owner, repo, page, perPage],
    queryFn: () => fetchReleases(owner, repo, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN RELEASES
  return {
    releases: data?.releases || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE RELEASE DETAILS HOOK ==>
export const useReleaseDetails = (
  owner: string,
  repo: string,
  releaseId: number,
  enabled: boolean = true
) => {
  // USE RELEASE DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Release,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-release", owner, repo, releaseId],
    queryFn: () => fetchReleaseDetails(owner, repo, releaseId),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!releaseId,
  });
  // RETURN RELEASE DETAILS
  return { release: data, isLoading, isError, error, refetch };
};

// <== USE LATEST RELEASE HOOK ==>
export const useLatestRelease = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE LATEST RELEASE QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Release,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-latest-release", owner, repo],
    queryFn: () => fetchLatestRelease(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN LATEST RELEASE
  return { release: data, isLoading, isError, error, refetch };
};

// <== USE CREATE RELEASE HOOK ==>
export const useCreateRelease = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE RELEASE MUTATION
  const mutation = useMutation<
    Release,
    AxiosError<{ message?: string }>,
    CreateReleaseInput
  >({
    mutationFn: createReleaseFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELEASES
      queryClient.invalidateQueries({
        queryKey: ["github-releases", variables.owner, variables.repo],
      });
      // INVALIDATE LATEST RELEASE
      queryClient.invalidateQueries({
        queryKey: ["github-latest-release", variables.owner, variables.repo],
      });
      // INVALIDATE TAGS
      queryClient.invalidateQueries({
        queryKey: ["github-tags", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Release created successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to create release");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE UPDATE RELEASE HOOK ==>
export const useUpdateRelease = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UPDATE RELEASE MUTATION
  const mutation = useMutation<
    Release,
    AxiosError<{ message?: string }>,
    UpdateReleaseInput
  >({
    mutationFn: updateReleaseFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELEASES
      queryClient.invalidateQueries({
        queryKey: ["github-releases", variables.owner, variables.repo],
      });
      // INVALIDATE RELEASE DETAILS
      queryClient.invalidateQueries({
        queryKey: [
          "github-release",
          variables.owner,
          variables.repo,
          variables.releaseId,
        ],
      });
      // INVALIDATE LATEST RELEASE
      queryClient.invalidateQueries({
        queryKey: ["github-latest-release", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Release updated successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to update release");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE DELETE RELEASE HOOK ==>
export const useDeleteRelease = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE RELEASE MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; releaseId: number }
  >({
    mutationFn: ({ owner, repo, releaseId }) =>
      deleteReleaseFn(owner, repo, releaseId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE RELEASES
      queryClient.invalidateQueries({
        queryKey: ["github-releases", variables.owner, variables.repo],
      });
      // INVALIDATE LATEST RELEASE
      queryClient.invalidateQueries({
        queryKey: ["github-latest-release", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Release deleted successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to delete release");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE TAGS HOOK ==>
export const useTags = (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE TAGS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      tags: Tag[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-tags", owner, repo, page, perPage],
    queryFn: () => fetchTags(owner, repo, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN TAGS
  return {
    tags: data?.tags || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE TAG DETAILS HOOK ==>
export const useTagDetails = (
  owner: string,
  repo: string,
  tag: string,
  enabled: boolean = true
) => {
  // USE TAG DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    TagDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-tag", owner, repo, tag],
    queryFn: () => fetchTagDetails(owner, repo, tag),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!tag,
  });
  // RETURN TAG DETAILS
  return { tagDetails: data, isLoading, isError, error, refetch };
};

// <== USE CREATE TAG HOOK ==>
export const useCreateTag = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE TAG MUTATION
  const mutation = useMutation<
    { name: string; sha: string; ref: string },
    AxiosError<{ message?: string }>,
    CreateTagInput
  >({
    mutationFn: createTagFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE TAGS
      queryClient.invalidateQueries({
        queryKey: ["github-tags", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success(`Tag '${variables.tagName}' created successfully!`);
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to create tag");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE DELETE TAG HOOK ==>
export const useDeleteTag = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE TAG MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; tag: string }
  >({
    mutationFn: ({ owner, repo, tag }) => deleteTagFn(owner, repo, tag),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE TAGS
      queryClient.invalidateQueries({
        queryKey: ["github-tags", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success(`Tag '${variables.tag}' deleted successfully!`);
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to delete tag");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE GENERATE RELEASE NOTES HOOK ==>
export const useGenerateReleaseNotes = () => {
  // GENERATE RELEASE NOTES MUTATION
  const mutation = useMutation<
    { name: string; body: string },
    AxiosError<{ message?: string }>,
    GenerateReleaseNotesInput
  >({
    mutationFn: generateReleaseNotesFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to generate release notes"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH DEPLOYMENTS FUNCTION ==>
const fetchDeployments = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 20,
  environment?: string
): Promise<{
  deployments: Deployment[];
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // BUILD PARAMS
  const params: Record<string, string | number> = {
    page,
    per_page: perPage,
  };
  if (environment) params.environment = environment;
  // FETCH DEPLOYMENTS
  const response = await apiClient.get<
    ApiResponse<{
      deployments: Deployment[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(`/github/repositories/${owner}/${repo}/deployments`, { params });
  // RETURN DEPLOYMENTS
  return response.data.data;
};

// <== FETCH DEPLOYMENT DETAILS FUNCTION ==>
const fetchDeploymentDetails = async (
  owner: string,
  repo: string,
  deploymentId: number
): Promise<Deployment> => {
  // FETCH DEPLOYMENT DETAILS
  const response = await apiClient.get<ApiResponse<Deployment>>(
    `/github/repositories/${owner}/${repo}/deployments/${deploymentId}`
  );
  // RETURN DEPLOYMENT
  return response.data.data;
};

// <== FETCH DEPLOYMENT STATUSES FUNCTION ==>
const fetchDeploymentStatuses = async (
  owner: string,
  repo: string,
  deploymentId: number,
  page: number = 1,
  perPage: number = 30
): Promise<{
  statuses: DeploymentStatus[];
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // FETCH DEPLOYMENT STATUSES
  const response = await apiClient.get<
    ApiResponse<{
      statuses: DeploymentStatus[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(
    `/github/repositories/${owner}/${repo}/deployments/${deploymentId}/statuses?page=${page}&per_page=${perPage}`
  );
  // RETURN STATUSES
  return response.data.data;
};

// <== CREATE DEPLOYMENT FUNCTION ==>
const createDeploymentFn = async (
  input: CreateDeploymentInput
): Promise<Deployment | null> => {
  // CREATE DEPLOYMENT
  const response = await apiClient.post<ApiResponse<Deployment | null>>(
    `/github/repositories/${input.owner}/${input.repo}/deployments`,
    {
      ref: input.ref,
      task: input.task,
      autoMerge: input.autoMerge,
      requiredContexts: input.requiredContexts,
      payload: input.payload,
      environment: input.environment,
      description: input.description,
      transientEnvironment: input.transientEnvironment,
      productionEnvironment: input.productionEnvironment,
    }
  );
  // RETURN DEPLOYMENT
  return response.data.data;
};

// <== CREATE DEPLOYMENT STATUS FUNCTION ==>
const createDeploymentStatusFn = async (
  input: CreateDeploymentStatusInput
): Promise<DeploymentStatus> => {
  // CREATE DEPLOYMENT STATUS
  const response = await apiClient.post<ApiResponse<DeploymentStatus>>(
    `/github/repositories/${input.owner}/${input.repo}/deployments/${input.deploymentId}/statuses`,
    {
      state: input.state,
      logUrl: input.logUrl,
      description: input.description,
      environmentUrl: input.environmentUrl,
      autoInactive: input.autoInactive,
    }
  );
  // RETURN STATUS
  return response.data.data;
};

// <== DELETE DEPLOYMENT FUNCTION ==>
const deleteDeploymentFn = async (
  owner: string,
  repo: string,
  deploymentId: number
): Promise<void> => {
  // DELETE DEPLOYMENT
  await apiClient.delete(
    `/github/repositories/${owner}/${repo}/deployments/${deploymentId}`
  );
};

// <== FETCH ENVIRONMENTS FUNCTION ==>
const fetchEnvironments = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
): Promise<{
  environments: Environment[];
  totalCount: number;
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // FETCH ENVIRONMENTS
  const response = await apiClient.get<
    ApiResponse<{
      environments: Environment[];
      totalCount: number;
      pagination: { page: number; perPage: number; hasMore: boolean };
    }>
  >(
    `/github/repositories/${owner}/${repo}/environments?page=${page}&per_page=${perPage}`
  );
  // RETURN ENVIRONMENTS
  return response.data.data;
};

// <== FETCH ENVIRONMENT DETAILS FUNCTION ==>
const fetchEnvironmentDetails = async (
  owner: string,
  repo: string,
  environmentName: string
): Promise<Environment> => {
  // FETCH ENVIRONMENT DETAILS
  const response = await apiClient.get<ApiResponse<Environment>>(
    `/github/repositories/${owner}/${repo}/environments/${encodeURIComponent(
      environmentName
    )}`
  );
  // RETURN ENVIRONMENT
  return response.data.data;
};

// <== USE DEPLOYMENTS HOOK ==>
export const useDeployments = (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 20,
  environment?: string,
  enabled: boolean = true
) => {
  // USE DEPLOYMENTS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      deployments: Deployment[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-deployments", owner, repo, page, perPage, environment],
    queryFn: () => fetchDeployments(owner, repo, page, perPage, environment),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN DEPLOYMENTS
  return {
    deployments: data?.deployments || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE DEPLOYMENT DETAILS HOOK ==>
export const useDeploymentDetails = (
  owner: string,
  repo: string,
  deploymentId: number,
  enabled: boolean = true
) => {
  // USE DEPLOYMENT DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Deployment,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-deployment", owner, repo, deploymentId],
    queryFn: () => fetchDeploymentDetails(owner, repo, deploymentId),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo && !!deploymentId,
  });
  // RETURN DEPLOYMENT DETAILS
  return { deployment: data, isLoading, isError, error, refetch };
};

// <== USE DEPLOYMENT STATUSES HOOK ==>
export const useDeploymentStatuses = (
  owner: string,
  repo: string,
  deploymentId: number,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE DEPLOYMENT STATUSES QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      statuses: DeploymentStatus[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      "github-deployment-statuses",
      owner,
      repo,
      deploymentId,
      page,
      perPage,
    ],
    queryFn: () =>
      fetchDeploymentStatuses(owner, repo, deploymentId, page, perPage),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!owner && !!repo && !!deploymentId,
  });
  // RETURN DEPLOYMENT STATUSES
  return {
    statuses: data?.statuses || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE CREATE DEPLOYMENT HOOK ==>
export const useCreateDeployment = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE DEPLOYMENT MUTATION
  const mutation = useMutation<
    Deployment | null,
    AxiosError<{ message?: string }>,
    CreateDeploymentInput
  >({
    mutationFn: createDeploymentFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE DEPLOYMENTS
      queryClient.invalidateQueries({
        queryKey: ["github-deployments", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Deployment created successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to create deployment"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE CREATE DEPLOYMENT STATUS HOOK ==>
export const useCreateDeploymentStatus = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE DEPLOYMENT STATUS MUTATION
  const mutation = useMutation<
    DeploymentStatus,
    AxiosError<{ message?: string }>,
    CreateDeploymentStatusInput
  >({
    mutationFn: createDeploymentStatusFn,
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE DEPLOYMENT STATUSES
      queryClient.invalidateQueries({
        queryKey: [
          "github-deployment-statuses",
          variables.owner,
          variables.repo,
          variables.deploymentId,
        ],
      });
      // INVALIDATE DEPLOYMENTS
      queryClient.invalidateQueries({
        queryKey: ["github-deployments", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Deployment status updated!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to update deployment status"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE DELETE DEPLOYMENT HOOK ==>
export const useDeleteDeployment = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE DEPLOYMENT MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string; deploymentId: number }
  >({
    mutationFn: ({ owner, repo, deploymentId }) =>
      deleteDeploymentFn(owner, repo, deploymentId),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE DEPLOYMENTS
      queryClient.invalidateQueries({
        queryKey: ["github-deployments", variables.owner, variables.repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Deployment deleted successfully!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to delete deployment"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE ENVIRONMENTS HOOK ==>
export const useEnvironments = (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30,
  enabled: boolean = true
) => {
  // USE ENVIRONMENTS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      environments: Environment[];
      totalCount: number;
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-environments", owner, repo, page, perPage],
    queryFn: () => fetchEnvironments(owner, repo, page, perPage),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN ENVIRONMENTS
  return {
    environments: data?.environments || [],
    totalCount: data?.totalCount || 0,
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE ENVIRONMENT DETAILS HOOK ==>
export const useEnvironmentDetails = (
  owner: string,
  repo: string,
  environmentName: string,
  enabled: boolean = true
) => {
  // USE ENVIRONMENT DETAILS QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    Environment,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-environment", owner, repo, environmentName],
    queryFn: () => fetchEnvironmentDetails(owner, repo, environmentName),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!environmentName,
  });
  // RETURN ENVIRONMENT DETAILS
  return { environment: data, isLoading, isError, error, refetch };
};

// <== FETCH DASHBOARD STATS FUNCTION ==>
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // FETCH DASHBOARD STATS
  const response = await apiClient.get<{ data: DashboardStats }>(
    "/github/dashboard/stats"
  );
  // RETURN DASHBOARD STATS
  return response.data.data;
};

// <== FETCH DASHBOARD ACTIVITY FUNCTION ==>
const fetchDashboardActivity = async (
  limit: number = 20
): Promise<{ activity: DashboardActivity[]; count: number }> => {
  // FETCH DASHBOARD ACTIVITY
  const response = await apiClient.get<{
    data: { activity: DashboardActivity[]; count: number };
  }>("/github/dashboard/activity", { params: { limit } });
  // RETURN DASHBOARD ACTIVITY
  return response.data.data;
};

// <== USE DASHBOARD STATS HOOK ==>
export const useDashboardStats = (enabled: boolean = true) => {
  // USE DASHBOARD STATS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    DashboardStats,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-dashboard-stats"],
    queryFn: fetchDashboardStats,
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled,
  });
  // RETURN DASHBOARD STATS
  return {
    stats: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE DASHBOARD ACTIVITY HOOK ==>
export const useDashboardActivity = (
  limit: number = 20,
  enabled: boolean = true
) => {
  // USE DASHBOARD ACTIVITY QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    { activity: DashboardActivity[]; count: number },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-dashboard-activity", limit],
    queryFn: () => fetchDashboardActivity(limit),
    retry: 1,
    staleTime: 1 * 60 * 1000,
    enabled,
  });
  // RETURN DASHBOARD ACTIVITY
  return {
    activity: data?.activity || [],
    count: data?.count || 0,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== FETCH STARRED REPOSITORIES FUNCTION ==>
const fetchStarredRepositories = async (
  page: number = 1,
  perPage: number = 30,
  sort: string = "created",
  direction: string = "desc"
): Promise<{
  repositories: StarredRepository[];
  pagination: { page: number; perPage: number; hasMore: boolean };
}> => {
  // FETCH STARRED REPOS
  const response = await apiClient.get<{
    data: {
      repositories: StarredRepository[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    };
  }>("/github/starred", {
    params: { page, per_page: perPage, sort, direction },
  });
  // RETURN STARRED REPOS
  return response.data.data;
};

// <== STAR REPOSITORY FUNCTION ==>
const starRepositoryFn = async (owner: string, repo: string): Promise<void> => {
  // STAR REPO
  await apiClient.put(`/github/starred/${owner}/${repo}`);
};

// <== UNSTAR REPOSITORY FUNCTION ==>
const unstarRepositoryFn = async (
  owner: string,
  repo: string
): Promise<void> => {
  // UNSTAR REPO
  await apiClient.delete(`/github/starred/${owner}/${repo}`);
};

// <== CHECK IF STARRED FUNCTION ==>
const checkIfStarredFn = async (
  owner: string,
  repo: string
): Promise<boolean> => {
  // CHECK IF STARRED
  const response = await apiClient.get<{ data: { isStarred: boolean } }>(
    `/github/starred/${owner}/${repo}`
  );
  // RETURN IS STARRED
  return response.data.data.isStarred;
};

// <== USE STARRED REPOSITORIES HOOK ==>
export const useStarredRepositories = (
  page: number = 1,
  perPage: number = 30,
  sort: string = "created",
  direction: string = "desc",
  enabled: boolean = true
) => {
  // USE STARRED REPOS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    {
      repositories: StarredRepository[];
      pagination: { page: number; perPage: number; hasMore: boolean };
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-starred-repos", page, perPage, sort, direction],
    queryFn: () => fetchStarredRepositories(page, perPage, sort, direction),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled,
  });
  // RETURN STARRED REPOS
  return {
    repositories: data?.repositories || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE CHECK IF STARRED HOOK ==>
export const useCheckIfStarred = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE CHECK IF STARRED QUERY
  const { data, isLoading, isError, error, refetch } = useQuery<
    boolean,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-is-starred", owner, repo],
    queryFn: () => checkIfStarredFn(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN IS STARRED
  return { isStarred: data ?? false, isLoading, isError, error, refetch };
};

// <== USE STAR REPOSITORY HOOK ==>
export const useStarRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // STAR MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    mutationFn: ({ owner, repo }) => starRepositoryFn(owner, repo),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE STARRED CHECK
      queryClient.invalidateQueries({
        queryKey: ["github-is-starred", variables.owner, variables.repo],
      });
      // INVALIDATE STARRED LIST
      queryClient.invalidateQueries({
        queryKey: ["github-starred-repos"],
      });
      // INVALIDATE DASHBOARD STATS
      queryClient.invalidateQueries({
        queryKey: ["github-dashboard-stats"],
      });
      // SHOW SUCCESS TOAST
      toast.success("Repository starred!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to star repository");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE UNSTAR REPOSITORY HOOK ==>
export const useUnstarRepository = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // UNSTAR MUTATION
  const mutation = useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    mutationFn: ({ owner, repo }) => unstarRepositoryFn(owner, repo),
    // ON SUCCESS
    onSuccess: (_, variables) => {
      // INVALIDATE STARRED CHECK
      queryClient.invalidateQueries({
        queryKey: ["github-is-starred", variables.owner, variables.repo],
      });
      // INVALIDATE STARRED LIST
      queryClient.invalidateQueries({
        queryKey: ["github-starred-repos"],
      });
      // INVALIDATE DASHBOARD STATS
      queryClient.invalidateQueries({
        queryKey: ["github-dashboard-stats"],
      });
      // SHOW SUCCESS TOAST
      toast.success("Repository unstarred!");
    },
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to unstar repository"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== FETCH PINNED REPOSITORIES FUNCTION ==>
const fetchPinnedRepositories = async (): Promise<{
  repositories: PinnedRepository[];
  count: number;
}> => {
  // FETCH PINNED REPOS
  const response = await apiClient.get<{
    data: { repositories: PinnedRepository[]; count: number };
  }>("/github/pinned");
  // RETURN PINNED REPOS
  return response.data.data;
};

// <== USE PINNED REPOSITORIES HOOK ==>
export const usePinnedRepositories = (enabled: boolean = true) => {
  // USE PINNED REPOS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    { repositories: PinnedRepository[]; count: number },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-pinned-repos"],
    queryFn: fetchPinnedRepositories,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN PINNED REPOS
  return {
    repositories: data?.repositories || [],
    count: data?.count || 0,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== FETCH GITHUB NOTIFICATIONS FUNCTION ==>
const fetchGitHubNotifications = async (
  page: number = 1,
  perPage: number = 50,
  all: boolean = false,
  participating: boolean = false
): Promise<GitHubNotificationsResponse> => {
  // BUILD PARAMS
  const params: Record<string, string | number | boolean> = {
    page,
    per_page: perPage,
    all,
    participating,
  };
  // FETCH NOTIFICATIONS
  const response = await apiClient.get<
    ApiResponse<GitHubNotificationsResponse>
  >("/github/notifications", { params });
  // RETURN NOTIFICATIONS DATA
  return response.data.data;
};

// <== FETCH GITHUB NOTIFICATION THREAD FUNCTION ==>
const fetchGitHubNotificationThread = async (
  threadId: string
): Promise<GitHubNotification> => {
  // FETCH NOTIFICATION THREAD
  const response = await apiClient.get<ApiResponse<GitHubNotification>>(
    `/github/notifications/${threadId}`
  );
  // RETURN NOTIFICATION DATA
  return response.data.data;
};

// <== MARK GITHUB NOTIFICATION AS READ FUNCTION ==>
const markGitHubNotificationAsRead = async (
  threadId: string
): Promise<void> => {
  // MARK NOTIFICATION AS READ
  await apiClient.patch(`/github/notifications/${threadId}`);
};

// <== MARK ALL GITHUB NOTIFICATIONS AS READ FUNCTION ==>
const markAllGitHubNotificationsAsRead = async (): Promise<void> => {
  // MARK ALL NOTIFICATIONS AS READ
  await apiClient.put("/github/notifications");
};

// <== MARK REPO GITHUB NOTIFICATIONS AS READ FUNCTION ==>
const markRepoGitHubNotificationsAsRead = async (
  owner: string,
  repo: string
): Promise<void> => {
  // MARK REPO NOTIFICATIONS AS READ
  await apiClient.put(`/github/repositories/${owner}/${repo}/notifications`);
};

// <== UNSUBSCRIBE GITHUB NOTIFICATION FUNCTION ==>
const unsubscribeGitHubNotification = async (
  threadId: string
): Promise<void> => {
  // UNSUBSCRIBE FROM NOTIFICATION
  await apiClient.delete(`/github/notifications/${threadId}/subscription`);
};

// <== USE GITHUB NOTIFICATIONS HOOK ==>
export const useGitHubNotifications = (
  page: number = 1,
  perPage: number = 50,
  all: boolean = false,
  participating: boolean = false,
  enabled: boolean = true
) => {
  // USE NOTIFICATIONS QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    GitHubNotificationsResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-notifications", page, perPage, all, participating],
    queryFn: () => fetchGitHubNotifications(page, perPage, all, participating),
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    enabled,
  });
  // RETURN NOTIFICATIONS
  return {
    notifications: data?.notifications || [],
    count: data?.count || 0,
    pagination: data?.pagination || {
      page: 1,
      perPage: 50,
      hasNext: false,
      hasPrev: false,
    },
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE GITHUB NOTIFICATION THREAD HOOK ==>
export const useGitHubNotificationThread = (
  threadId: string,
  enabled: boolean = true
) => {
  // USE NOTIFICATION THREAD QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    GitHubNotification,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-notification-thread", threadId],
    queryFn: () => fetchGitHubNotificationThread(threadId),
    retry: 1,
    staleTime: 30 * 1000,
    enabled: enabled && !!threadId,
  });
  // RETURN NOTIFICATION
  return {
    notification: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE MARK GITHUB NOTIFICATION AS READ HOOK ==>
export const useMarkGitHubNotificationAsRead = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<void, AxiosError<{ message?: string }>, string>({
    mutationFn: markGitHubNotificationAsRead,
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["github-notifications"] });
      // SHOW SUCCESS TOAST
      toast.success("Notification marked as read");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    },
  });
};

// <== USE MARK ALL GITHUB NOTIFICATIONS AS READ HOOK ==>
export const useMarkAllGitHubNotificationsAsRead = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<void, AxiosError<{ message?: string }>, void>({
    mutationFn: markAllGitHubNotificationsAsRead,
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["github-notifications"] });
      // SHOW SUCCESS TOAST
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    },
  });
};

// <== USE MARK REPO GITHUB NOTIFICATIONS AS READ HOOK ==>
export const useMarkRepoGitHubNotificationsAsRead = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<
    void,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    mutationFn: ({ owner, repo }) =>
      markRepoGitHubNotificationsAsRead(owner, repo),
    onSuccess: (_, { owner, repo }) => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["github-notifications"] });
      // SHOW SUCCESS TOAST
      toast.success(`Notifications for ${owner}/${repo} marked as read`);
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message ||
          "Failed to mark repository notifications as read"
      );
    },
  });
};

// <== USE UNSUBSCRIBE GITHUB NOTIFICATION HOOK ==>
export const useUnsubscribeGitHubNotification = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<void, AxiosError<{ message?: string }>, string>({
    mutationFn: unsubscribeGitHubNotification,
    onSuccess: () => {
      // INVALIDATE NOTIFICATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["github-notifications"] });
      // SHOW SUCCESS TOAST
      toast.success("Unsubscribed from notification");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message ||
          "Failed to unsubscribe from notification"
      );
    },
  });
};

// <=== GITHUB DISCUSSIONS API ===>

// <== FETCH REPOSITORY DISCUSSIONS FUNCTION ==>
const fetchRepositoryDiscussions = async (
  owner: string,
  repo: string,
  params?: {
    first?: number;
    after?: string;
    categoryId?: string;
    orderBy?: "CREATED_AT" | "UPDATED_AT";
    answered?: boolean;
  }
): Promise<DiscussionsResponse> => {
  // BUILD QUERY STRING
  const queryParams = new URLSearchParams();
  // SET FIRST IF PROVIDED
  if (params?.first) queryParams.set("first", params.first.toString());
  // SET AFTER IF PROVIDED
  if (params?.after) queryParams.set("after", params.after);
  // SET CATEGORY ID IF PROVIDED
  if (params?.categoryId) queryParams.set("categoryId", params.categoryId);
  // SET ORDER BY IF PROVIDED
  if (params?.orderBy) queryParams.set("orderBy", params.orderBy);
  // SET ANSWERED IF PROVIDED
  if (params?.answered !== undefined)
    queryParams.set("answered", params.answered.toString());
  // FETCH DISCUSSIONS
  const response = await apiClient.get(
    `/github/repositories/${owner}/${repo}/discussions?${queryParams.toString()}`
  );
  // RETURN DISCUSSIONS DATA
  return response.data.data;
};

// <== FETCH DISCUSSION DETAILS FUNCTION ==>
const fetchDiscussionDetails = async (
  owner: string,
  repo: string,
  discussionNumber: number,
  params?: {
    commentsFirst?: number;
    commentsAfter?: string;
  }
): Promise<DiscussionDetails> => {
  // BUILD QUERY STRING
  const queryParams = new URLSearchParams();
  // SET COMMENTS FIRST IF PROVIDED
  if (params?.commentsFirst)
    queryParams.set("commentsFirst", params.commentsFirst.toString());
  // SET COMMENTS AFTER IF PROVIDED
  if (params?.commentsAfter)
    queryParams.set("commentsAfter", params.commentsAfter);
  // FETCH DISCUSSION DETAILS
  const response = await apiClient.get(
    `/github/repositories/${owner}/${repo}/discussions/${discussionNumber}?${queryParams.toString()}`
  );
  // RETURN DISCUSSION DETAILS DATA
  return response.data.data;
};

// <== FETCH DISCUSSION CATEGORIES FUNCTION ==>
const fetchDiscussionCategories = async (
  owner: string,
  repo: string
): Promise<{ categories: DiscussionCategory[]; count: number }> => {
  // FETCHING CATEGORIES
  const response = await apiClient.get(
    `/github/repositories/${owner}/${repo}/discussions/categories`
  );
  // RETURN DATA
  return response.data.data;
};

// <== CREATE DISCUSSION FUNCTION ==>
const createDiscussion = async (
  owner: string,
  repo: string,
  data: {
    title: string;
    body?: string;
    categoryId: string;
  }
): Promise<Discussion> => {
  // CREATING DISCUSSION
  const response = await apiClient.post(
    `/github/repositories/${owner}/${repo}/discussions`,
    data
  );
  // RETURN DATA
  return response.data.data;
};

// <== ADD DISCUSSION COMMENT FUNCTION ==>
const addDiscussionComment = async (
  owner: string,
  repo: string,
  discussionNumber: number,
  data: {
    body: string;
    replyToId?: string;
  }
): Promise<DiscussionComment> => {
  // ADDING COMMENT
  const response = await apiClient.post(
    `/github/repositories/${owner}/${repo}/discussions/${discussionNumber}/comments`,
    data
  );
  // RETURN DATA
  return response.data.data;
};

// <== MARK DISCUSSION COMMENT AS ANSWER FUNCTION ==>
const markDiscussionCommentAsAnswer = async (
  owner: string,
  repo: string,
  commentId: string
): Promise<{
  discussionId: string;
  discussionNumber: number;
  answerChosenAt: string;
}> => {
  // MARKING AS ANSWER
  const response = await apiClient.put(
    `/github/repositories/${owner}/${repo}/discussions/comments/${commentId}/answer`
  );
  // RETURN DATA
  return response.data.data;
};

// <== UNMARK DISCUSSION COMMENT AS ANSWER FUNCTION ==>
const unmarkDiscussionCommentAsAnswer = async (
  owner: string,
  repo: string,
  commentId: string
): Promise<{ discussionId: string; discussionNumber: number }> => {
  // UNMARKING AS ANSWER
  const response = await apiClient.delete(
    `/github/repositories/${owner}/${repo}/discussions/comments/${commentId}/answer`
  );
  // RETURN DATA
  return response.data.data;
};

// <== USE REPOSITORY DISCUSSIONS HOOK ==>
export const useRepositoryDiscussions = (
  owner: string,
  repo: string,
  params?: {
    first?: number;
    after?: string;
    categoryId?: string;
    orderBy?: "CREATED_AT" | "UPDATED_AT";
    answered?: boolean;
  },
  enabled: boolean = true
) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    DiscussionsResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      "github-discussions",
      owner,
      repo,
      params?.first,
      params?.after,
      params?.categoryId,
      params?.orderBy,
      params?.answered,
    ],
    queryFn: () => fetchRepositoryDiscussions(owner, repo, params),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN DISCUSSIONS
  return {
    discussions: data?.discussions || [],
    categories: data?.categories || [],
    totalCount: data?.totalCount || 0,
    pageInfo: data?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE DISCUSSION DETAILS HOOK ==>
export const useDiscussionDetails = (
  owner: string,
  repo: string,
  discussionNumber: number,
  params?: {
    commentsFirst?: number;
    commentsAfter?: string;
  },
  enabled: boolean = true
) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    DiscussionDetails,
    AxiosError<{ message?: string }>
  >({
    queryKey: [
      "github-discussion-details",
      owner,
      repo,
      discussionNumber,
      params?.commentsFirst,
      params?.commentsAfter,
    ],
    queryFn: () =>
      fetchDiscussionDetails(owner, repo, discussionNumber, params),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!owner && !!repo && !!discussionNumber,
  });
  // RETURN DISCUSSION
  return {
    discussion: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE DISCUSSION CATEGORIES HOOK ==>
export const useDiscussionCategories = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    { categories: DiscussionCategory[]; count: number },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-discussion-categories", owner, repo],
    queryFn: () => fetchDiscussionCategories(owner, repo),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN CATEGORIES
  return {
    categories: data?.categories || [],
    count: data?.count || 0,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE CREATE DISCUSSION HOOK ==>
export const useCreateDiscussion = (owner: string, repo: string) => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<
    Discussion,
    AxiosError<{ message?: string }>,
    { title: string; body?: string; categoryId: string }
  >({
    mutationFn: (data) => createDiscussion(owner, repo, data),
    onSuccess: () => {
      // INVALIDATE DISCUSSIONS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-discussions", owner, repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Discussion created successfully");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to create discussion"
      );
    },
  });
};

// <== USE ADD DISCUSSION COMMENT HOOK ==>
export const useAddDiscussionComment = (
  owner: string,
  repo: string,
  discussionNumber: number
) => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<
    DiscussionComment,
    AxiosError<{ message?: string }>,
    { body: string; replyToId?: string }
  >({
    mutationFn: (data) =>
      addDiscussionComment(owner, repo, discussionNumber, data),
    onSuccess: () => {
      // INVALIDATE DISCUSSION DETAILS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-discussion-details", owner, repo, discussionNumber],
      });
      // SHOW SUCCESS TOAST
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to add comment");
    },
  });
};

// <== USE MARK DISCUSSION COMMENT AS ANSWER HOOK ==>
export const useMarkDiscussionCommentAsAnswer = (
  owner: string,
  repo: string
) => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<
    { discussionId: string; discussionNumber: number; answerChosenAt: string },
    AxiosError<{ message?: string }>,
    { commentId: string; discussionNumber: number }
  >({
    mutationFn: ({ commentId }) =>
      markDiscussionCommentAsAnswer(owner, repo, commentId),
    onSuccess: (_, { discussionNumber }) => {
      // INVALIDATE DISCUSSION DETAILS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-discussion-details", owner, repo, discussionNumber],
      });
      // INVALIDATE DISCUSSIONS LIST
      queryClient.invalidateQueries({
        queryKey: ["github-discussions", owner, repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Comment marked as answer");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to mark comment as answer"
      );
    },
  });
};

// <== USE UNMARK DISCUSSION COMMENT AS ANSWER HOOK ==>
export const useUnmarkDiscussionCommentAsAnswer = (
  owner: string,
  repo: string
) => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION
  return useMutation<
    { discussionId: string; discussionNumber: number },
    AxiosError<{ message?: string }>,
    { commentId: string; discussionNumber: number }
  >({
    mutationFn: ({ commentId }) =>
      unmarkDiscussionCommentAsAnswer(owner, repo, commentId),
    onSuccess: (_, { discussionNumber }) => {
      // INVALIDATE DISCUSSION DETAILS QUERY
      queryClient.invalidateQueries({
        queryKey: ["github-discussion-details", owner, repo, discussionNumber],
      });
      // INVALIDATE DISCUSSIONS LIST
      queryClient.invalidateQueries({
        queryKey: ["github-discussions", owner, repo],
      });
      // SHOW SUCCESS TOAST
      toast.success("Answer status removed");
    },
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to remove answer status"
      );
    },
  });
};

// <== CONTRIBUTION ACTIVITY TYPE ==>
export type ContributionActivity = {
  // <== COMMITS ==>
  commits: {
    // <== TOTAL ==>
    total: number;
    // <== REPOSITORIES ==>
    repositories: ContributionActivityRepository[];
  };
  // <== ISSUES ==>
  issues: {
    // <== TOTAL ==>
    total: number;
    // <== REPOSITORIES ==>
    repositories: ContributionActivityRepository[];
  };
  // <== PULL REQUESTS ==>
  pullRequests: {
    // <== TOTAL ==>
    total: number;
    // <== REPOSITORIES ==>
    repositories: ContributionActivityRepository[];
  };
  // <== REVIEWS ==>
  reviews: {
    // <== TOTAL ==>
    total: number;
    // <== REPOSITORIES ==>
    repositories: ContributionActivityRepository[];
  };
  // <== REPOSITORIES CREATED ==>
  repositoriesCreated: ContributionCreatedRepository[];
  // <== MILESTONES ==>
  milestones: {
    // <== FIRST ISSUE ==>
    firstIssue: ContributionMilestone;
    // <== FIRST PULL REQUEST ==>
    firstPullRequest: ContributionMilestone;
  };
  // <== DATE RANGE ==>
  dateRange: {
    // <== FROM ==>
    from: string;
    // <== TO ==>
    to: string;
  };
};

// <== FETCH EXTENDED PROFILE ==>
const fetchExtendedProfile = async (): Promise<ExtendedProfile> => {
  // FETCH EXTENDED PROFILE
  const response = await apiClient.get("/github/profile/extended");
  // RETURN DATA
  return response.data.data;
};

// <== FETCH CONTRIBUTION STATS ==>
const fetchContributionStats = async (
  year?: number
): Promise<ContributionStats> => {
  // BUILD QUERY STRING
  const queryParams = new URLSearchParams();
  // SET YEAR IF PROVIDED
  if (year) queryParams.set("year", year.toString());
  // FETCH CONTRIBUTION STATS
  const response = await apiClient.get(
    `/github/profile/contributions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  // RETURN DATA
  return response.data.data;
};

// <== FETCH PROFILE README ==>
const fetchProfileReadme = async (): Promise<ProfileReadme> => {
  // FETCH PROFILE README
  const response = await apiClient.get("/github/profile/readme");
  // RETURN DATA
  return response.data.data;
};

// <== FETCH CONTRIBUTION ACTIVITY ==>
const fetchContributionActivity = async (params?: {
  year?: number;
  month?: number;
}): Promise<ContributionActivity> => {
  // BUILD QUERY STRING
  const queryParams = new URLSearchParams();
  // SET YEAR IF PROVIDED
  if (params?.year) queryParams.set("year", params.year.toString());
  // SET MONTH IF PROVIDED
  if (params?.month) queryParams.set("month", params.month.toString());
  // FETCH CONTRIBUTION ACTIVITY
  const response = await apiClient.get(
    `/github/profile/activity${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  // RETURN DATA
  return response.data.data;
};

// <== USE EXTENDED PROFILE HOOK ==>
export const useExtendedProfile = (enabled: boolean = true) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    ExtendedProfile,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-extended-profile"],
    queryFn: fetchExtendedProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN PROFILE
  return {
    profile: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE CONTRIBUTION STATS HOOK ==>
export const useContributionStats = (
  year?: number,
  enabled: boolean = true
) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    ContributionStats,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-contribution-stats", year],
    queryFn: () => fetchContributionStats(year),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN STATS
  return {
    stats: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE PROFILE README HOOK ==>
export const useProfileReadme = (enabled: boolean = true) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    ProfileReadme,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-profile-readme"],
    queryFn: fetchProfileReadme,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled,
  });
  // RETURN README
  return {
    readme: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

// <== USE CONTRIBUTION ACTIVITY HOOK ==>
export const useContributionActivity = (
  params?: {
    year?: number;
    month?: number;
  },
  enabled: boolean = true
) => {
  // USE QUERY
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    ContributionActivity,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["github-contribution-activity", params?.year, params?.month],
    queryFn: () => fetchContributionActivity(params),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN ACTIVITY
  return {
    activity: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
