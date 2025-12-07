// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== AI STATUS TYPE ==>
export type AIStatus = {
  // <== AI CONFIGURED ==>
  aiConfigured: boolean;
  // <== GITHUB CONNECTED ==>
  githubConnected: boolean;
  // <== READY ==>
  ready: boolean;
};
// <== GENERATED TASK TYPE ==>
export type GeneratedTask = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== STATUS ==>
  status: "to do" | "in progress" | "completed";
};
// <== REPOSITORY SUMMARY TYPE ==>
export type RepositorySummary = {
  // <== SUMMARY ==>
  summary: string;
  // <== REPOSITORY ==>
  repository: string;
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
};
// <== RAW AI STATUS TYPE (FROM BACKEND) ==>
type RawAIStatus = {
  // <== IS AI CONFIGURED ==>
  isAIConfigured: boolean;
  // <== IS GITHUB CONNECTED ==>
  isGitHubConnected: boolean;
  // <== CAN GENERATE TASKS ==>
  canGenerateTasks: boolean;
  // <== AI PROVIDER ==>
  aiProvider: string;
};
// <== REPOSITORY CATEGORIZATION TYPE ==>
export type RepositoryCategorization = {
  // <== CATEGORY ==>
  category: string;
  // <== SUBCATEGORY ==>
  subcategory: string;
  // <== TECH STACK ==>
  techStack: string[];
  // <== FRAMEWORKS ==>
  frameworks: string[];
  // <== PURPOSE ==>
  purpose: string;
  // <== PROJECT TYPE ==>
  projectType: string;
  // <== COMPLEXITY ==>
  complexity: string;
  // <== SUGGESTED TAGS ==>
  suggestedTags: string[];
};
// <== HEALTH SCORE METRICS TYPE ==>
export type HealthScoreMetrics = {
  // <== DOCUMENTATION ==>
  documentation: {
    // <== SCORE ==>
    score: number;
    // <== HAS README ==>
    hasReadme: boolean;
    // <== HAS DESCRIPTION ==>
    hasDescription: boolean;
    // <== HAS TOPICS ==>
    hasTopics: boolean;
  };
  // <== MAINTENANCE ==>
  maintenance: {
    // <== SCORE ==>
    score: number;
    // <== DAYS SINCE UPDATE ==>
    daysSinceUpdate: number;
    // <== LAST COMMIT DATE ==>
    lastCommitDate: string | null;
    // <== RECENT COMMITS ==>
    recentCommits: number;
  };
  // <== COMMUNITY ==>
  community: {
    // <== SCORE ==>
    score: number;
    // <== STARS ==>
    stars: number;
    // <== FORKS ==>
    forks: number;
    // <== WATCHERS ==>
    watchers: number;
  };
  // <== ISSUES ==>
  issues: {
    // <== SCORE ==>
    score: number;
    // <== OPEN ISSUES ==>
    openIssues: number;
    // <== OPEN PULL REQUESTS ==>
    openPRs: number;
  };
  // <== BEST PRACTICES ==>
  bestPractices: {
    // <== SCORE ==>
    score: number;
    // <== HAS LICENSE ==>
    hasLicense: boolean;
    // <== LICENSE NAME ==>
    licenseName: string | null;
  };
};
// <== HEALTH SUGGESTION TYPE ==>
export type HealthSuggestion = {
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== PRIORITY ==>
  priority: "high" | "medium" | "low";
  // <== CATEGORY ==>
  category: string;
};
// <== REPOSITORY HEALTH SCORE TYPE ==>
export type RepositoryHealthScore = {
  // <== OVERALL SCORE ==>
  overall: number;
  // <== GRADE ==>
  grade: string;
  // <== METRICS ==>
  metrics: HealthScoreMetrics;
};
// <== CODE EXPLANATION TYPE ==>
export type CodeExplanationType =
  | "general"
  | "line-by-line"
  | "function"
  | "security"
  | "performance";
// <== GENERAL CODE EXPLANATION TYPE ==>
export type GeneralCodeExplanation = {
  // <== SUMMARY ==>
  summary: string;
  // <== PURPOSE ==>
  purpose: string;
  // <== KEY COMPONENTS ==>
  keyComponents: {
    name: string;
    description: string;
    lineRange: string;
  }[];
  // <== COMPLEXITY ==>
  complexity: "low" | "medium" | "high";
  // <== SUGGESTIONS ==>
  suggestions?: string[];
  // <== DEPENDENCIES ==>
  dependencies?: string[];
  // <== PATTERNS ==>
  patterns?: string[];
};
// <== LINE BY LINE EXPLANATION TYPE ==>
export type LineByLineExplanation = {
  // <== EXPLANATIONS ==>
  explanations: {
    lineNumber: number;
    code: string;
    explanation: string;
  }[];
  // <== SUMMARY ==>
  summary: string;
};
// <== FUNCTION EXPLANATION TYPE ==>
export type FunctionExplanation = {
  // <== FUNCTIONS ==>
  functions: {
    name: string;
    parameters: { name: string; type: string; description: string }[];
    returnType: string;
    purpose: string;
    example?: string;
    complexity: "low" | "medium" | "high";
  }[];
  // <== RELATIONSHIPS ==>
  relationships: string;
};
// <== SECURITY EXPLANATION TYPE ==>
export type SecurityExplanation = {
  // <== SECURITY LEVEL ==>
  securityLevel: "low" | "medium" | "high" | "critical";
  // <== ISSUES ==>
  issues: {
    severity: "low" | "medium" | "high" | "critical";
    type: string;
    description: string;
    location: string;
    recommendation: string;
  }[];
  // <== GOOD PRACTICES ==>
  goodPractices: string[];
  // <== RECOMMENDATIONS ==>
  recommendations: string[];
};
// <== PERFORMANCE EXPLANATION TYPE ==>
export type PerformanceExplanation = {
  // <== PERFORMANCE RATING ==>
  performanceRating: "poor" | "fair" | "good" | "excellent";
  // <== ISSUES ==>
  issues: {
    severity: "low" | "medium" | "high";
    type: string;
    description: string;
    location: string;
    recommendation: string;
  }[];
  // <== OPTIMIZATIONS ==>
  optimizations: {
    title: string;
    description: string;
    impact: string;
  }[];
  // <== BIG O ==>
  bigO?: string;
};
// <== CODE EXPLANATION RESULT TYPE ==>
export type CodeExplanationResult = {
  // <== TYPE ==>
  type: CodeExplanationType;
  // <== LANGUAGE ==>
  language: string;
  // <== FILE NAME ==>
  fileName: string | null;
  // <== EXPLANATION ==>
  explanation:
    | GeneralCodeExplanation
    | LineByLineExplanation
    | FunctionExplanation
    | SecurityExplanation
    | PerformanceExplanation
    | { rawExplanation: string };
};
// <== EXPLAIN CODE INPUT TYPE ==>
export type ExplainCodeInput = {
  // <== CODE ==>
  code: string;
  // <== LANGUAGE ==>
  language?: string;
  // <== FILE NAME ==>
  fileName?: string;
  // <== EXPLAIN TYPE ==>
  explainType?: CodeExplanationType;
};
// <== GENERATED COMMIT MESSAGE TYPE ==>
export type GeneratedCommitMessage = {
  // <== SUBJECT ==>
  subject: string;
  // <== BODY ==>
  body: string | null;
  // <== TYPE ==>
  type: string;
  // <== SCOPE ==>
  scope: string | null;
  // <== BREAKING ==>
  breaking: boolean;
  // <== ALTERNATIVES ==>
  alternatives: string[];
};
// <== COMMIT MESSAGE INPUT TYPE ==>
export type GenerateCommitMessageInput = {
  // <== CHANGES ==>
  changes: {
    // <== FILENAME ==>
    filename: string;
    // <== STATUS ==>
    status: string;
    // <== ADDITIONS ==>
    additions?: number;
    // <== DELETIONS ==>
    deletions?: number;
    // <== PATCH ==>
    patch?: string;
  }[];
  // <== TYPE ==>
  type?: "conventional" | "descriptive" | "simple" | "semantic";
  // <== CONTEXT ==>
  context?: string;
};
// <== COMMIT HISTORY SUMMARY TYPE ==>
export type CommitHistorySummary = {
  // <== COMMIT COUNT ==>
  commitCount: number;
  // <== SUMMARY ==>
  summary: {
    // <== SUMMARY TEXT ==>
    summary: string;
    // <== MAIN CHANGES ==>
    mainChanges: string[];
    // <== CATEGORIES ==>
    categories: {
      // <== FEATURES ==>
      features: string[];
      // <== FIXES ==>
      fixes: string[];
      // <== REFACTORING ==>
      refactoring: string[];
      // <== DOCUMENTATION ==>
      documentation: string[];
      // <== OTHER ==>
      other: string[];
    };
    // <== CONTRIBUTORS ==>
    contributors: string[];
    // <== TIMELINE ==>
    timeline: {
      // <== START DATE ==>
      startDate: string;
      // <== END DATE ==>
      endDate: string;
      // <== DURATION ==>
      duration: string;
    };
    // <== HIGHLIGHTS ==>
    highlights: string[];
    // <== SUGGESTED RELEASE NOTES ==>
    suggestedReleaseNotes: string;
  };
};
// <== SUMMARIZE COMMITS INPUT TYPE ==>
export type SummarizeCommitsInput = {
  // <== COMMITS ==>
  commits: {
    // <== SHA ==>
    sha: string;
    // <== MESSAGE ==>
    message: string;
    // <== AUTHOR ==>
    author?: {
      // <== NAME ==>
      name?: string;
      // <== DATE ==>
      date?: string;
    };
    // <== STATS ==>
    stats?: {
      // <== ADDITIONS ==>
      additions?: number;
      // <== DELETIONS ==>
      deletions?: number;
      // <== TOTAL ==>
      total?: number;
    };
  }[];
  // <== INCLUDE STATS ==>
  includeStats?: boolean;
};
// <== BRANCH STRATEGY SUGGESTION TYPE ==>
export type BranchStrategySuggestion = {
  // <== CURRENT BRANCH COUNT ==>
  currentBranchCount: number;
  // <== SUGGESTION ==>
  suggestion: {
    // <== RECOMMENDED STRATEGY ==>
    recommendedStrategy: string;
    // <== STRATEGY DESCRIPTION ==>
    strategyDescription: string;
    // <== BRANCH STRUCTURE ==>
    branchStructure: {
      // <== MAIN BRANCHES ==>
      mainBranches: string[];
      // <== SUPPORTING BRANCHES ==>
      supportingBranches: string[];
    };
    // <== NAMING CONVENTIONS ==>
    namingConventions: {
      // <== TYPE ==>
      type: string;
      // <== PATTERN ==>
      pattern: string;
      // <== EXAMPLE ==>
      example: string;
    }[];
    // <== PROTECTION RECOMMENDATIONS ==>
    protectionRecommendations: {
      // <== BRANCH ==>
      branch: string;
      // <== RULES ==>
      rules: string[];
    }[];
    // <== MERGE STRATEGY ==>
    mergeStrategy: {
      // <== RECOMMENDED ==>
      recommended: string;
      // <== REASON ==>
      reason: string;
    };
    // <== WORKFLOW STEPS ==>
    workflowSteps: string[];
    // <== ADDITIONAL TIPS ==>
    additionalTips: string[];
  };
};
// <== SUGGEST BRANCH STRATEGY INPUT TYPE ==>
export type SuggestBranchStrategyInput = {
  // <== BRANCHES ==>
  branches: { name: string; protected?: boolean }[];
  // <== REPO INFO ==>
  repoInfo?: {
    // <== NAME ==>
    name?: string;
    // <== DEFAULT BRANCH ==>
    defaultBranch?: string;
  };
  // <== TEAM SIZE ==>
  teamSize?: string;
  // <== PROJECT TYPE ==>
  projectType?: string;
};
// <== AI CODE REVIEW ISSUE TYPE ==>
export type AICodeReviewIssue = {
  // <== SEVERITY ==>
  severity: "critical" | "warning" | "suggestion" | "nitpick";
  // <== FILE ==>
  file: string;
  // <== LINE ==>
  line: string;
  // <== TITLE ==>
  title: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== SUGGESTION ==>
  suggestion: string;
};
// <== AI CODE REVIEW SUGGESTION TYPE ==>
export type AICodeReviewSuggestion = {
  // <== CATEGORY ==>
  category:
    | "refactoring"
    | "testing"
    | "documentation"
    | "performance"
    | "security";
  // <== DESCRIPTION ==>
  description: string;
};
// <== AI CODE REVIEW RESULT TYPE ==>
export type AICodeReviewResult = {
  // <== SUMMARY ==>
  summary: string;
  // <== OVERALL RATING ==>
  overallRating: "approve" | "request_changes" | "comment";
  // <== RATING REASON ==>
  ratingReason: string;
  // <== ISSUES ==>
  issues: AICodeReviewIssue[];
  // <== POSITIVES ==>
  positives: string[];
  // <== SUGGESTIONS ==>
  suggestions: AICodeReviewSuggestion[];
  // <== TESTING RECOMMENDATIONS ==>
  testingRecommendations: string[];
  // <== SECURITY NOTES ==>
  securityNotes: string[];
  // <== RAW REVIEW (IF PARSING FAILED) ==>
  rawReview?: string;
};
// <== AI CODE REVIEW RESPONSE TYPE ==>
export type AICodeReviewResponse = {
  // <== FILES REVIEWED ==>
  filesReviewed: number;
  // <== TOTAL FILES ==>
  totalFiles: number;
  // <== REVIEW TYPE ==>
  reviewType: string;
  // <== REVIEW ==>
  review: AICodeReviewResult;
};
// <== AI CODE REVIEW INPUT TYPE ==>
export type AICodeReviewInput = {
  // <== FILES ==>
  files: {
    // <== FILENAME ==>
    filename: string;
    // <== STATUS ==>
    status: string;
    // <== ADDITIONS ==>
    additions: number;
    // <== DELETIONS ==>
    deletions: number;
    // <== PATCH ==>
    patch?: string;
  }[];
  // <== PULL REQUEST INFO ==>
  pullRequestInfo?: {
    // <== TITLE ==>
    title: string;
    // <== BODY ==>
    body?: string;
    // <== HEAD ==>
    head: string;
    // <== BASE ==>
    base: string;
  };
  // <== REVIEW TYPE ==>
  reviewType?: "comprehensive" | "security" | "performance" | "best-practices";
};
// <== AI ISSUE ANALYSIS INPUT TYPE ==>
export type AIIssueAnalysisInput = {
  // <== ISSUE ==>
  issue: {
    // <== TITLE ==>
    title: string;
    // <== BODY ==>
    body?: string;
  };
  // <== EXISTING ISSUES ==>
  existingIssues?: {
    // <== NUMBER ==>
    number: number;
    // <== TITLE ==>
    title: string;
    // <== LABELS ==>
    labels?: string[];
    // <== STATE ==>
    state: string;
  }[];
  // <== AVAILABLE LABELS ==>
  availableLabels?: {
    // <== NAME ==>
    name: string;
    // <== DESCRIPTION ==>
    description?: string;
  }[];
  // <== ANALYSIS TYPE ==>
  analysisType?: "full" | "labels" | "duplicates";
};
// <== AI ISSUE ANALYSIS RESULT TYPE ==>
export type AIIssueAnalysisResult = {
  // <== SUGGESTED LABELS ==>
  suggestedLabels: string[];
  // <== LABEL REASONS ==>
  labelReasons: Record<string, string>;
  // <== POTENTIAL DUPLICATES ==>
  potentialDuplicates: {
    // <== ISSUE NUMBER ==>
    issueNumber: number;
    // <== TITLE ==>
    title: string;
    // <== SIMILARITY ==>
    similarity: "high" | "medium" | "low";
    // <== REASON ==>
    reason: string;
  }[];
  // <== SUGGESTED SOLUTION ==>
  suggestedSolution: {
    // <== SUMMARY ==>
    summary: string;
    // <== STEPS ==>
    steps: string[];
    // <== ADDITIONAL CONTEXT ==>
    additionalContext?: string | null;
  };
  // <== PRIORITY ==>
  priority: "critical" | "high" | "medium" | "low";
  // <== PRIORITY REASON ==>
  priorityReason: string;
  // <== CATEGORY ==>
  category: "bug" | "feature" | "question" | "documentation" | "other";
  // <== CATEGORY REASON ==>
  categoryReason: string;
  // <== ESTIMATED EFFORT ==>
  estimatedEffort: "small" | "medium" | "large";
  // <== SUGGESTED ASSIGNEE TYPE ==>
  suggestedAssigneeType:
    | "maintainer"
    | "contributor"
    | "new-contributor"
    | null;
};
// <== AI ISSUE ANALYSIS RESPONSE TYPE ==>
export type AIIssueAnalysisResponse = {
  // <== ISSUE TITLE ==>
  issueTitle: string;
  // <== ANALYSIS TYPE ==>
  analysisType: string;
  // <== ANALYSIS ==>
  analysis: AIIssueAnalysisResult;
};
// <== AI GENERATE ISSUE INPUT TYPE ==>
export type AIGenerateIssueInput = {
  // <== DESCRIPTION ==>
  description: string;
  // <== ISSUE TYPE ==>
  issueType?: "bug" | "feature" | "documentation" | "question";
  // <== CONTEXT ==>
  context?: string;
};
// <== AI GENERATED ISSUE TYPE ==>
export type AIGeneratedIssue = {
  // <== TITLE ==>
  title: string;
  // <== BODY ==>
  body: string;
  // <== SUGGESTED LABELS ==>
  suggestedLabels: string[];
  // <== PRIORITY ==>
  priority: "high" | "medium" | "low";
  // <== TYPE ==>
  type: "bug" | "feature" | "documentation" | "question";
};
// <== AI PERMISSION RECOMMENDATION INPUT TYPE ==>
export type AIPermissionRecommendationInput = {
  // <== USERNAME ==>
  username: string;
  // <== REPOSITORY INFO ==>
  repositoryInfo: {
    // <== NAME ==>
    name: string;
    // <== DESCRIPTION ==>
    description?: string;
    // <== IS PRIVATE ==>
    isPrivate: boolean;
    // <== LANGUAGE ==>
    language?: string;
    // <== HAS ISSUES ==>
    hasIssues?: boolean;
    // <== HAS WIKI ==>
    hasWiki?: boolean;
  };
  // <== USER ACTIVITY ==>
  userActivity?: {
    // <== CONTRIBUTIONS ==>
    contributions?: number;
    // <== PULL REQUESTS ==>
    pullRequests?: number;
    // <== ISSUES ==>
    issues?: number;
  };
  // <== EXISTING COLLABORATORS ==>
  existingCollaborators?: {
    // <== LOGIN ==>
    login: string;
    // <== PERMISSION ==>
    permission: string;
  }[];
};
// <== AI PERMISSION RECOMMENDATION RESULT TYPE ==>
export type AIPermissionRecommendationResult = {
  // <== RECOMMENDED PERMISSION ==>
  recommendedPermission: "read" | "triage" | "write" | "maintain" | "admin";
  // <== CONFIDENCE ==>
  confidence: "high" | "medium" | "low";
  // <== REASONING ==>
  reasoning: string;
  // <== CONSIDERATIONS ==>
  considerations: string[];
  // <== ALTERNATIVE PERMISSION ==>
  alternativePermission: {
    // <== LEVEL ==>
    level: string;
    // <== WHEN ==>
    when: string;
  } | null;
  // <== SECURITY NOTES ==>
  securityNotes: string[];
};
// <== AI PERMISSION RECOMMENDATION RESPONSE TYPE ==>
export type AIPermissionRecommendationResponse = {
  // <== USERNAME ==>
  username: string;
  // <== REPOSITORY ==>
  repository: string;
  // <== RECOMMENDATION ==>
  recommendation: AIPermissionRecommendationResult;
};
// <== AI WORKFLOW FAILURE ANALYSIS INPUT TYPE ==>
export type AIWorkflowFailureInput = {
  // <== WORKFLOW NAME ==>
  workflowName?: string;
  // <== JOB NAME ==>
  jobName?: string;
  // <== LOGS ==>
  logs?: string;
  // <== CONCLUSION ==>
  conclusion?: string;
  // <== STEPS ==>
  steps?: Array<{
    name: string;
    conclusion: string;
  }>;
};
// <== AI WORKFLOW FAILURE FIX TYPE ==>
export type AIWorkflowFailureFix = {
  // <== STEP ==>
  step: number;
  // <== ACTION ==>
  action: string;
  // <== DETAILS ==>
  details: string;
};
// <== AI WORKFLOW FAILURE ANALYSIS RESPONSE TYPE ==>
export type AIWorkflowFailureResponse = {
  // <== WORKFLOW NAME ==>
  workflowName: string;
  // <== JOB NAME ==>
  jobName: string;
  // <== CONCLUSION ==>
  conclusion: string;
  // <== ANALYSIS ==>
  analysis: {
    // <== ROOT CAUSE ==>
    rootCause: string;
    // <== ERROR TYPE ==>
    errorType: string;
    // <== SEVERITY ==>
    severity: "high" | "medium" | "low";
    // <== SUGGESTED FIXES ==>
    suggestedFixes: AIWorkflowFailureFix[];
    // <== PREVENTION TIPS ==>
    preventionTips: string[];
    // <== RELATED DOCS ==>
    relatedDocs: string[];
    // <== SUMMARY ==>
    summary: string;
  };
};
// <== AI WORKFLOW IMPROVEMENTS INPUT TYPE ==>
export type AIWorkflowImprovementsInput = {
  // <== WORKFLOW CONTENT ==>
  workflowContent: string;
  // <== WORKFLOW PATH ==>
  workflowPath?: string;
  // <== RECENT RUNS ==>
  recentRuns?: {
    total: number;
    successRate: number;
    avgDuration: string;
    commonFailures?: string[];
  };
};
// <== AI WORKFLOW IMPROVEMENT SUGGESTION TYPE ==>
export type AIWorkflowImprovementSuggestion = {
  // <== ISSUE ==>
  issue: string;
  // <== SUGGESTION ==>
  suggestion: string;
  // <== IMPACT ==>
  impact: "high" | "medium" | "low";
};
// <== AI WORKFLOW IMPROVEMENTS CATEGORY TYPE ==>
export type AIWorkflowImprovementsCategory = {
  // <== SCORE ==>
  score: number;
  // <== SUGGESTIONS ==>
  suggestions: AIWorkflowImprovementSuggestion[];
};
// <== AI WORKFLOW IMPROVEMENTS RESPONSE TYPE ==>
export type AIWorkflowImprovementsResponse = {
  // <== WORKFLOW PATH ==>
  workflowPath: string;
  // <== SUGGESTIONS ==>
  suggestions: {
    // <== OVERALL SCORE ==>
    overallScore: number;
    // <== PERFORMANCE ==>
    performance: AIWorkflowImprovementsCategory;
    // <== BEST PRACTICES ==>
    bestPractices: AIWorkflowImprovementsCategory;
    // <== SECURITY ==>
    security: AIWorkflowImprovementsCategory;
    // <== COST ==>
    cost: AIWorkflowImprovementsCategory;
    // <== RELIABILITY ==>
    reliability: AIWorkflowImprovementsCategory;
    // <== SUMMARY ==>
    summary: string;
  };
};

// <== FETCH AI STATUS ==>
const fetchAIStatus = async (): Promise<AIStatus> => {
  // FETCH AI STATUS
  const response = await apiClient.get<ApiResponse<RawAIStatus>>("/ai/status");
  // GET DATA
  const data = response.data.data;
  // MAP BACKEND RESPONSE TO FRONTEND TYPE
  return {
    aiConfigured: data.isAIConfigured,
    githubConnected: data.isGitHubConnected,
    ready: data.canGenerateTasks,
  };
};

// <== GENERATE TASKS FROM README ==>
const generateTasksFromReadme = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<{ tasks: GeneratedTask[]; source: string }> => {
  // GENERATE TASKS FROM README
  const response = await apiClient.post<
    ApiResponse<{ tasks: GeneratedTask[]; source: string }>
  >("/ai/generate/readme", { owner, repo });
  // GET DATA
  return response.data.data;
};

// <== GENERATE TASKS FROM COMMITS ==>
const generateTasksFromCommits = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<{ tasks: GeneratedTask[]; source: string }> => {
  // GENERATE TASKS FROM COMMITS
  const response = await apiClient.post<
    ApiResponse<{ tasks: GeneratedTask[]; source: string }>
  >("/ai/generate/commits", { owner, repo });
  // GET DATA
  return response.data.data;
};

// <== SUGGEST NEXT TASKS ==>
const suggestNextTasks = async (
  projectId: string
): Promise<{ tasks: GeneratedTask[]; projectTitle: string }> => {
  // SUGGEST NEXT TASKS
  const response = await apiClient.get<
    ApiResponse<{ tasks: GeneratedTask[]; projectTitle: string }>
  >(`/ai/suggest/${projectId}`);
  // GET DATA
  return response.data.data;
};

// <== SUMMARIZE REPOSITORY ==>
const summarizeRepository = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}): Promise<RepositorySummary> => {
  // SUMMARIZE REPOSITORY
  const response = await apiClient.post<ApiResponse<RepositorySummary>>(
    "/ai/summarize",
    { owner, repo }
  );
  // GET DATA
  return response.data.data;
};

// <== SAVE GENERATED TASKS ==>
const saveGeneratedTasks = async ({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: GeneratedTask[];
}): Promise<{ savedCount: number; projectId: string }> => {
  // SAVE GENERATED TASKS
  const response = await apiClient.post<
    ApiResponse<{ savedCount: number; projectId: string }>
  >("/ai/save-tasks", { projectId, tasks });
  // GET DATA
  return response.data.data;
};

// <== USE AI STATUS HOOK ==>
export const useAIStatus = (enabled: boolean = true) => {
  // USE QUERY TO FETCH AI STATUS
  const { data, isLoading, isError, error, refetch } = useQuery<
    AIStatus,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-status"],
    queryFn: fetchAIStatus,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
  // RETURN AI STATUS
  return {
    status: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE GENERATE TASKS FROM README MUTATION ==>
export const useGenerateTasksFromReadme = () => {
  // USE MUTATION TO GENERATE TASKS FROM README
  return useMutation<
    { tasks: GeneratedTask[]; source: string },
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: generateTasksFromReadme,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate tasks from README. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE GENERATE TASKS FROM COMMITS MUTATION ==>
export const useGenerateTasksFromCommits = () => {
  // USE MUTATION TO GENERATE TASKS FROM COMMITS
  return useMutation<
    { tasks: GeneratedTask[]; source: string },
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: generateTasksFromCommits,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to generate tasks from commits. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SUGGEST NEXT TASKS MUTATION ==>
export const useSuggestNextTasks = () => {
  // USE MUTATION TO SUGGEST NEXT TASKS
  return useMutation<
    { tasks: GeneratedTask[]; projectTitle: string },
    AxiosError<{ message?: string }>,
    string
  >({
    // <== MUTATION FN ==>
    mutationFn: suggestNextTasks,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to suggest tasks. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SUMMARIZE REPOSITORY MUTATION ==>
export const useSummarizeRepository = () => {
  // USE MUTATION TO SUMMARIZE REPOSITORY
  return useMutation<
    RepositorySummary,
    AxiosError<{ message?: string }>,
    { owner: string; repo: string }
  >({
    // <== MUTATION FN ==>
    mutationFn: summarizeRepository,
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to summarize repository. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE SAVE GENERATED TASKS MUTATION ==>
export const useSaveGeneratedTasks = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // USE MUTATION TO SAVE GENERATED TASKS
  return useMutation<
    { savedCount: number; projectId: string },
    AxiosError<{ message?: string }>,
    { projectId: string; tasks: GeneratedTask[] }
  >({
    // <== MUTATION FN ==>
    mutationFn: saveGeneratedTasks,
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE ALL TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE TASKS BY PROJECT QUERY
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", data.projectId],
      });
      // TASK WORD (SINGULAR OR PLURAL)
      const taskWord = data.savedCount === 1 ? "task" : "tasks";
      // SHOW SUCCESS TOAST
      toast.success(`${data.savedCount} ${taskWord} saved successfully!`);
    },
    // <== ON ERROR ==>
    onError: (error) => {
      // GET ERROR MESSAGE
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save tasks. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== FETCH REPOSITORY CATEGORIZATION ==>
const fetchRepositoryCategorization = async (
  owner: string,
  repo: string
): Promise<{
  repository: {
    fullName: string;
    description: string;
    language: string;
    topics: string[];
  };
  categorization: RepositoryCategorization;
}> => {
  // FETCH REPOSITORY CATEGORIZATION
  const response = await apiClient.get<
    ApiResponse<{
      repository: {
        fullName: string;
        description: string;
        language: string;
        topics: string[];
      };
      categorization: RepositoryCategorization;
    }>
  >(`/ai/categorize/${owner}/${repo}`);
  // RETURN DATA
  return response.data.data;
};

// <== FETCH REPOSITORY HEALTH SCORE ==>
const fetchRepositoryHealthScore = async (
  owner: string,
  repo: string
): Promise<{
  repository: { fullName: string; description: string; language: string };
  healthScore: RepositoryHealthScore;
  suggestions: HealthSuggestion[];
}> => {
  // FETCH REPOSITORY HEALTH SCORE
  const response = await apiClient.get<
    ApiResponse<{
      repository: { fullName: string; description: string; language: string };
      healthScore: RepositoryHealthScore;
      suggestions: HealthSuggestion[];
    }>
  >(`/ai/health/${owner}/${repo}`);
  // RETURN DATA
  return response.data.data;
};

// <== USE REPOSITORY CATEGORIZATION HOOK ==>
export const useRepositoryCategorization = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH CATEGORIZATION
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      repository: {
        fullName: string;
        description: string;
        language: string;
        topics: string[];
      };
      categorization: RepositoryCategorization;
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-categorization", owner, repo],
    queryFn: () => fetchRepositoryCategorization(owner, repo),
    retry: 1,
    staleTime: 30 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN CATEGORIZATION DATA
  return {
    categorization: data?.categorization,
    repository: data?.repository,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== USE REPOSITORY HEALTH SCORE HOOK ==>
export const useRepositoryHealthScore = (
  owner: string,
  repo: string,
  enabled: boolean = true
) => {
  // USE QUERY TO FETCH HEALTH SCORE
  const { data, isLoading, isError, error, refetch } = useQuery<
    {
      repository: { fullName: string; description: string; language: string };
      healthScore: RepositoryHealthScore;
      suggestions: HealthSuggestion[];
    },
    AxiosError<{ message?: string }>
  >({
    queryKey: ["ai-health-score", owner, repo],
    queryFn: () => fetchRepositoryHealthScore(owner, repo),
    retry: 1,
    staleTime: 10 * 60 * 1000,
    enabled: enabled && !!owner && !!repo,
  });
  // RETURN HEALTH SCORE DATA
  return {
    healthScore: data?.healthScore,
    suggestions: data?.suggestions || [],
    repository: data?.repository,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// <== EXPLAIN CODE FUNCTION ==>
const explainCodeFn = async (
  input: ExplainCodeInput
): Promise<CodeExplanationResult> => {
  // EXPLAIN CODE
  const response = await apiClient.post<ApiResponse<CodeExplanationResult>>(
    "/ai/explain-code",
    {
      code: input.code,
      language: input.language,
      fileName: input.fileName,
      explainType: input.explainType || "general",
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE EXPLAIN CODE HOOK ==>
export const useExplainCode = () => {
  // EXPLAIN CODE MUTATION
  const mutation = useMutation<
    CodeExplanationResult,
    AxiosError<{ message?: string }>,
    ExplainCodeInput
  >({
    mutationFn: explainCodeFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to explain code");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== GENERATE COMMIT MESSAGE FUNCTION ==>
const generateCommitMessageFn = async (
  input: GenerateCommitMessageInput
): Promise<GeneratedCommitMessage> => {
  // GENERATE COMMIT MESSAGE
  const response = await apiClient.post<ApiResponse<GeneratedCommitMessage>>(
    "/ai/generate-commit-message",
    {
      changes: input.changes,
      type: input.type || "conventional",
      context: input.context,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE GENERATE COMMIT MESSAGE HOOK ==>
export const useGenerateCommitMessage = () => {
  // GENERATE COMMIT MESSAGE MUTATION
  const mutation = useMutation<
    GeneratedCommitMessage,
    AxiosError<{ message?: string }>,
    GenerateCommitMessageInput
  >({
    mutationFn: generateCommitMessageFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to generate commit message"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== SUMMARIZE COMMITS FUNCTION ==>
const summarizeCommitsFn = async (
  input: SummarizeCommitsInput
): Promise<CommitHistorySummary> => {
  // SUMMARIZE COMMITS
  const response = await apiClient.post<ApiResponse<CommitHistorySummary>>(
    "/ai/summarize-commits",
    {
      commits: input.commits,
      includeStats: input.includeStats ?? true,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE SUMMARIZE COMMITS HOOK ==>
export const useSummarizeCommits = () => {
  // SUMMARIZE COMMITS MUTATION
  const mutation = useMutation<
    CommitHistorySummary,
    AxiosError<{ message?: string }>,
    SummarizeCommitsInput
  >({
    mutationFn: summarizeCommitsFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to summarize commits"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== SUGGEST BRANCH STRATEGY FUNCTION ==>
const suggestBranchStrategyFn = async (
  input: SuggestBranchStrategyInput
): Promise<BranchStrategySuggestion> => {
  // SUGGEST BRANCH STRATEGY
  const response = await apiClient.post<ApiResponse<BranchStrategySuggestion>>(
    "/ai/suggest-branch-strategy",
    {
      branches: input.branches,
      repoInfo: input.repoInfo,
      teamSize: input.teamSize,
      projectType: input.projectType,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE SUGGEST BRANCH STRATEGY HOOK ==>
export const useSuggestBranchStrategy = () => {
  // SUGGEST BRANCH STRATEGY MUTATION
  const mutation = useMutation<
    BranchStrategySuggestion,
    AxiosError<{ message?: string }>,
    SuggestBranchStrategyInput
  >({
    mutationFn: suggestBranchStrategyFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to generate branch strategy"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== AI CODE REVIEW FUNCTION ==>
const aiCodeReviewFn = async (
  input: AICodeReviewInput
): Promise<AICodeReviewResponse> => {
  // AI CODE REVIEW
  const response = await apiClient.post<ApiResponse<AICodeReviewResponse>>(
    "/ai/review-pr",
    {
      files: input.files,
      pullRequestInfo: input.pullRequestInfo,
      reviewType: input.reviewType || "comprehensive",
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE AI CODE REVIEW HOOK ==>
export const useAICodeReview = () => {
  // AI CODE REVIEW MUTATION
  const mutation = useMutation<
    AICodeReviewResponse,
    AxiosError<{ message?: string }>,
    AICodeReviewInput
  >({
    mutationFn: aiCodeReviewFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to generate AI code review"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== AI ISSUE ANALYZER FUNCTION ==>
const aiIssueAnalyzerFn = async (
  input: AIIssueAnalysisInput
): Promise<AIIssueAnalysisResponse> => {
  // ANALYZE ISSUE
  const response = await apiClient.post<ApiResponse<AIIssueAnalysisResponse>>(
    "/ai/analyze-issue",
    {
      issue: input.issue,
      existingIssues: input.existingIssues,
      availableLabels: input.availableLabels,
      analysisType: input.analysisType || "full",
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE AI ISSUE ANALYZER HOOK ==>
export const useAIIssueAnalyzer = () => {
  // AI ISSUE ANALYZER MUTATION
  const mutation = useMutation<
    AIIssueAnalysisResponse,
    AxiosError<{ message?: string }>,
    AIIssueAnalysisInput
  >({
    mutationFn: aiIssueAnalyzerFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to analyze issue");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== AI GENERATE ISSUE FUNCTION ==>
const aiGenerateIssueFn = async (
  input: AIGenerateIssueInput
): Promise<AIGeneratedIssue> => {
  // GENERATE ISSUE
  const response = await apiClient.post<ApiResponse<AIGeneratedIssue>>(
    "/ai/generate-issue",
    {
      description: input.description,
      issueType: input.issueType || "bug",
      context: input.context,
    }
  );
  // RETURN RESULT
  return response.data.data;
};

// <== USE AI GENERATE ISSUE HOOK ==>
export const useAIGenerateIssue = () => {
  // AI GENERATE ISSUE MUTATION
  const mutation = useMutation<
    AIGeneratedIssue,
    AxiosError<{ message?: string }>,
    AIGenerateIssueInput
  >({
    mutationFn: aiGenerateIssueFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(error.response?.data?.message || "Failed to generate issue");
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== AI PERMISSION RECOMMENDATION FUNCTION ==>
const aiPermissionRecommendationFn = async (
  input: AIPermissionRecommendationInput
): Promise<AIPermissionRecommendationResponse> => {
  // FETCH RECOMMENDATION
  const response = await apiClient.post<
    ApiResponse<AIPermissionRecommendationResponse>
  >("/ai/recommend-permission", {
    username: input.username,
    repositoryInfo: input.repositoryInfo,
    userActivity: input.userActivity,
    existingCollaborators: input.existingCollaborators,
  });
  // RETURN RECOMMENDATION
  return response.data.data;
};

// <== USE AI PERMISSION RECOMMENDATION HOOK ==>
export const useAIPermissionRecommendation = () => {
  // AI PERMISSION RECOMMENDATION MUTATION
  const mutation = useMutation<
    AIPermissionRecommendationResponse,
    AxiosError<{ message?: string }>,
    AIPermissionRecommendationInput
  >({
    mutationFn: aiPermissionRecommendationFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message ||
          "Failed to generate permission recommendation"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== AI ANALYZE WORKFLOW FAILURE FUNCTION ==>
const aiAnalyzeWorkflowFailureFn = async (
  input: AIWorkflowFailureInput
): Promise<AIWorkflowFailureResponse> => {
  // FETCH ANALYSIS
  const response = await apiClient.post<ApiResponse<AIWorkflowFailureResponse>>(
    "/ai/analyze-workflow-failure",
    input
  );
  // RETURN ANALYSIS
  return response.data.data;
};

// <== AI SUGGEST WORKFLOW IMPROVEMENTS FUNCTION ==>
const aiSuggestWorkflowImprovementsFn = async (
  input: AIWorkflowImprovementsInput
): Promise<AIWorkflowImprovementsResponse> => {
  // FETCH SUGGESTIONS
  const response = await apiClient.post<
    ApiResponse<AIWorkflowImprovementsResponse>
  >("/ai/suggest-workflow-improvements", input);
  // RETURN SUGGESTIONS
  return response.data.data;
};

// <== USE AI ANALYZE WORKFLOW FAILURE HOOK ==>
export const useAIAnalyzeWorkflowFailure = () => {
  // AI ANALYZE WORKFLOW FAILURE MUTATION
  const mutation = useMutation<
    AIWorkflowFailureResponse,
    AxiosError<{ message?: string }>,
    AIWorkflowFailureInput
  >({
    mutationFn: aiAnalyzeWorkflowFailureFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message || "Failed to analyze workflow failure"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};

// <== USE AI SUGGEST WORKFLOW IMPROVEMENTS HOOK ==>
export const useAISuggestWorkflowImprovements = () => {
  // AI SUGGEST WORKFLOW IMPROVEMENTS MUTATION
  const mutation = useMutation<
    AIWorkflowImprovementsResponse,
    AxiosError<{ message?: string }>,
    AIWorkflowImprovementsInput
  >({
    mutationFn: aiSuggestWorkflowImprovementsFn,
    // ON ERROR
    onError: (error) => {
      // SHOW ERROR TOAST
      toast.error(
        error.response?.data?.message ||
          "Failed to suggest workflow improvements"
      );
    },
  });
  // RETURN MUTATION
  return mutation;
};
