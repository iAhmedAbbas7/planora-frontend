// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== LINKED REPOSITORY TYPE ==>
export type LinkedRepository = {
  // <== OWNER ==>
  owner: string;
  // <== NAME ==>
  name: string;
  // <== FULL NAME ==>
  fullName: string;
  // <== REPO ID ==>
  repoId: number;
  // <== LINKED AT ==>
  linkedAt: string;
};
// <== WORKSPACE SETTINGS TYPE ==>
export type WorkspaceSettings = {
  // <== DEFAULT ROLE ==>
  defaultRole: "member" | "viewer";
  // <== ALLOW INVITES ==>
  allowInvites: boolean;
  // <== NOTIFICATION PREFS ==>
  notificationPrefs: {
    // <== ON NEW MEMBER ==>
    onNewMember: boolean;
    // <== ON TASK UPDATE ==>
    onTaskUpdate: boolean;
    // <== ON PROJECT UPDATE ==>
    onProjectUpdate: boolean;
    // <== ON REPO ACTIVITY ==>
    onRepoActivity: boolean;
  };
};
// <== WORKSPACE OWNER TYPE ==>
export type WorkspaceOwner = {
  // <== ID ==>
  _id: string;
  // <== NAME ==>
  name: string;
  // <== EMAIL ==>
  email: string;
  // <== PROFILE PIC ==>
  profilePic?: string;
};
// <== MEMBER PERMISSIONS TYPE ==>
export type MemberPermissions = {
  // <== CAN INVITE ==>
  canInvite: boolean;
  // <== CAN REMOVE ==>
  canRemove: boolean;
  // <== CAN EDIT SETTINGS ==>
  canEditSettings: boolean;
  // <== CAN MANAGE PROJECTS ==>
  canManageProjects: boolean;
  // <== CAN MANAGE REPOS ==>
  canManageRepos: boolean;
};
// <== WORKSPACE MEMBER TYPE ==>
export type WorkspaceMember = {
  // <== ID ==>
  _id: string;
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== USER ID ==>
  userId: string;
  // <== ROLE ==>
  role: "owner" | "admin" | "member" | "viewer";
  // <== PERMISSIONS ==>
  permissions: MemberPermissions;
  // <== JOINED AT ==>
  joinedAt: string;
  // <== INVITED BY ==>
  invitedBy?: string;
  // <== STATUS ==>
  status: "active" | "suspended";
  // <== USER INFO ==>
  user?: {
    // <== ID ==>
    _id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== PROFILE PIC ==>
    profilePic?: string;
  };
  // <== INVITER INFO ==>
  inviter?: {
    // <== ID ==>
    _id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
  };
};
// <== WORKSPACE INVITATION TYPE ==>
export type WorkspaceInvitation = {
  // <== ID ==>
  _id: string;
  // <== WORKSPACE ID ==>
  workspaceId: string;
  // <== INVITER ID ==>
  inviterId: string;
  // <== INVITEE EMAIL ==>
  inviteeEmail: string;
  // <== ROLE ==>
  role: "admin" | "member" | "viewer";
  // <== TOKEN ==>
  token: string;
  // <== STATUS ==>
  status: "pending" | "accepted" | "declined" | "expired";
  // <== EXPIRES AT ==>
  expiresAt: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== INVITER INFO ==>
  inviter?: {
    // <== ID ==>
    _id: string;
    // <== NAME ==>
    name: string;
    // <== EMAIL ==>
    email: string;
    // <== PROFILE PIC ==>
    profilePic?: string;
  };
  // <== WORKSPACE INFO (FOR MY INVITATIONS) ==>
  workspace?: {
    // <== ID ==>
    _id: string;
    // <== NAME ==>
    name: string;
    // <== AVATAR ==>
    avatar?: string;
  };
};
// <== WORKSPACE TYPE ==>
export type Workspace = {
  // <== ID ==>
  _id: string;
  // <== NAME ==>
  name: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== AVATAR ==>
  avatar: string;
  // <== AVATAR PUBLIC ID ==>
  avatarPublicId: string;
  // <== VISIBILITY ==>
  visibility: "public" | "private";
  // <== OWNER ID ==>
  ownerId: string;
  // <== SETTINGS ==>
  settings: WorkspaceSettings;
  // <== LINKED REPOSITORIES ==>
  linkedRepositories: LinkedRepository[];
  // <== IS ARCHIVED ==>
  isArchived: boolean;
  // <== ARCHIVED AT ==>
  archivedAt?: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
  // <== MEMBER COUNT ==>
  memberCount?: number;
  // <== REPO COUNT ==>
  repoCount?: number;
  // <== USER ROLE ==>
  userRole?: "owner" | "admin" | "member" | "viewer";
  // <== USER PERMISSIONS ==>
  userPermissions?: MemberPermissions;
  // <== OWNER INFO ==>
  owner?: WorkspaceOwner;
  // <== MEMBERS (FOR DETAIL VIEW) ==>
  members?: WorkspaceMember[];
  // <== MEMBER USERS (FOR DETAIL VIEW) ==>
  memberUsers?: WorkspaceOwner[];
};
// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
  // <== MESSAGE ==>
  message?: string;
  // <== COUNT ==>
  count?: number;
};
// <== CREATE WORKSPACE REQUEST TYPE ==>
type CreateWorkspaceRequest = {
  // <== NAME ==>
  name: string;
  // <== DESCRIPTION ==>
  description?: string;
  // <== VISIBILITY ==>
  visibility?: "public" | "private";
  // <== SETTINGS ==>
  settings?: Partial<WorkspaceSettings>;
};
// <== UPDATE WORKSPACE REQUEST TYPE ==>
type UpdateWorkspaceRequest = Partial<CreateWorkspaceRequest> & {
  // <== AVATAR ==>
  avatar?: string;
  // <== AVATAR PUBLIC ID ==>
  avatarPublicId?: string;
};

// <== FETCH ALL WORKSPACES FOR USER ==>
const fetchWorkspaces = async (): Promise<Workspace[]> => {
  // TRY TO FETCH WORKSPACES
  try {
    // FETCH WORKSPACES
    const response = await apiClient.get<ApiResponse<Workspace[]>>(
      "/workspaces"
    );
    // CHECK IF RESPONSE IS VALID
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // RETURN WORKSPACES
    return response.data.data;
  } catch (error: unknown) {
    // GET AXIOS ERROR
    const axiosError = error as AxiosError;
    // CHECK IF RESPONSE IS 404
    if (axiosError.response?.status === 404) {
      // RETURN EMPTY ARRAY
      return [];
    }
    // FOR OTHER ERRORS, RE-THROW
    throw error;
  }
};

// <== FETCH SINGLE WORKSPACE ==>
const fetchWorkspaceById = async (workspaceId: string): Promise<Workspace> => {
  // TRY TO FETCH WORKSPACE
  const response = await apiClient.get<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Workspace not found");
  }
  // RETURN WORKSPACE
  return response.data.data;
};

// <== CREATE WORKSPACE ==>
const createWorkspaceAPI = async (
  data: CreateWorkspaceRequest
): Promise<Workspace> => {
  // TRY TO CREATE WORKSPACE
  const response = await apiClient.post<ApiResponse<Workspace>>(
    "/workspaces",
    data
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to create workspace");
  }
  // RETURN WORKSPACE
  return response.data.data;
};

// <== UPDATE WORKSPACE ==>
const updateWorkspaceAPI = async (
  workspaceId: string,
  data: UpdateWorkspaceRequest
): Promise<Workspace> => {
  // TRY TO UPDATE WORKSPACE
  const response = await apiClient.put<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}`,
    data
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to update workspace");
  }
  // RETURN WORKSPACE
  return response.data.data;
};

// <== DELETE WORKSPACE ==>
const deleteWorkspaceAPI = async (workspaceId: string): Promise<void> => {
  // TRY TO DELETE WORKSPACE
  const response = await apiClient.delete<ApiResponse<void>>(
    `/workspaces/${workspaceId}`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.success) {
    // RETURN ERROR
    throw new Error("Failed to delete workspace");
  }
  // RETURN VOID
  return;
};

// <== ARCHIVE WORKSPACE ==>
const archiveWorkspaceAPI = async (workspaceId: string): Promise<Workspace> => {
  // TRY TO ARCHIVE WORKSPACE
  const response = await apiClient.put<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}/archive`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to archive workspace");
  }
  // RETURN WORKSPACE
  return response.data.data;
};

// <== UNARCHIVE WORKSPACE ==>
const unarchiveWorkspaceAPI = async (
  workspaceId: string
): Promise<Workspace> => {
  // TRY TO UNARCHIVE WORKSPACE
  const response = await apiClient.put<ApiResponse<Workspace>>(
    `/workspaces/${workspaceId}/unarchive`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to unarchive workspace");
  }
  // RETURN WORKSPACE
  return response.data.data;
};

// <== FETCH WORKSPACE MEMBERS ==>
const fetchWorkspaceMembers = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  // TRY TO FETCH WORKSPACE MEMBERS
  const response = await apiClient.get<ApiResponse<WorkspaceMember[]>>(
    `/workspaces/${workspaceId}/members`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN EMPTY ARRAY
    return [];
  }
  // RETURN MEMBERS
  return response.data.data;
};

// <== UPDATE MEMBER ROLE ==>
const updateMemberRoleAPI = async (
  workspaceId: string,
  memberId: string,
  role: "admin" | "member" | "viewer"
): Promise<WorkspaceMember> => {
  // TRY TO UPDATE MEMBER ROLE
  const response = await apiClient.put<ApiResponse<WorkspaceMember>>(
    `/workspaces/${workspaceId}/members/${memberId}`,
    { role }
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to update member role");
  }
  // RETURN MEMBER
  return response.data.data;
};

// <== REMOVE MEMBER ==>
const removeMemberAPI = async (
  workspaceId: string,
  memberId: string
): Promise<void> => {
  // TRY TO REMOVE MEMBER
  const response = await apiClient.delete<ApiResponse<void>>(
    `/workspaces/${workspaceId}/members/${memberId}`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.success) {
    // RETURN ERROR
    throw new Error("Failed to remove member");
  }
  // RETURN VOID
  return;
};

// <== SEND INVITATION ==>
const sendInvitationAPI = async (
  workspaceId: string,
  email: string,
  role?: "admin" | "member" | "viewer"
): Promise<{ invitationId: string; token: string; expiresAt: string }> => {
  // TRY TO SEND INVITATION
  const response = await apiClient.post<
    ApiResponse<{ invitationId: string; token: string; expiresAt: string }>
  >(`/workspaces/${workspaceId}/invitations`, { email, role });
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to send invitation");
  }
  // RETURN INVITATION
  return response.data.data;
};

// <== FETCH WORKSPACE INVITATIONS ==>
const fetchWorkspaceInvitations = async (
  workspaceId: string
): Promise<WorkspaceInvitation[]> => {
  // TRY TO FETCH WORKSPACE INVITATIONS
  const response = await apiClient.get<ApiResponse<WorkspaceInvitation[]>>(
    `/workspaces/${workspaceId}/invitations`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN EMPTY ARRAY
    return [];
  }
  // RETURN INVITATIONS
  return response.data.data;
};

// <== CANCEL INVITATION ==>
const cancelInvitationAPI = async (
  workspaceId: string,
  invitationId: string
): Promise<void> => {
  // TRY TO CANCEL INVITATION
  const response = await apiClient.delete<ApiResponse<void>>(
    `/workspaces/${workspaceId}/invitations/${invitationId}`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.success) {
    // RETURN ERROR
    throw new Error("Failed to cancel invitation");
  }
  // RETURN VOID
  return;
};

// <== FETCH MY PENDING INVITATIONS ==>
const fetchMyInvitations = async (): Promise<WorkspaceInvitation[]> => {
  // TRY TO FETCH MY PENDING INVITATIONS
  const response = await apiClient.get<ApiResponse<WorkspaceInvitation[]>>(
    "/workspaces/invitations/me"
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN EMPTY ARRAY
    return [];
  }
  // RETURN INVITATIONS
  return response.data.data;
};

// <== ACCEPT INVITATION ==>
const acceptInvitationAPI = async (
  token: string
): Promise<{ workspaceId: string; workspaceName: string; role: string }> => {
  // TRY TO ACCEPT INVITATION
  const response = await apiClient.post<
    ApiResponse<{ workspaceId: string; workspaceName: string; role: string }>
  >(`/workspaces/invitations/${token}/accept`);
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to accept invitation");
  }
  // RETURN ACCEPTANCE DATA
  return response.data.data;
};

// <== DECLINE INVITATION ==>
const declineInvitationAPI = async (token: string): Promise<void> => {
  // TRY TO DECLINE INVITATION
  const response = await apiClient.post<ApiResponse<void>>(
    `/workspaces/invitations/${token}/decline`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.success) {
    // RETURN ERROR
    throw new Error("Failed to decline invitation");
  }
  // RETURN VOID
  return;
};

// <== LINK REPOSITORY TO WORKSPACE ==>
const linkRepositoryAPI = async (
  workspaceId: string,
  repoData: { owner: string; name: string; fullName: string; repoId: number }
): Promise<LinkedRepository[]> => {
  // TRY TO LINK REPOSITORY TO WORKSPACE
  const response = await apiClient.post<ApiResponse<LinkedRepository[]>>(
    `/workspaces/${workspaceId}/repositories`,
    repoData
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to link repository");
  }
  // RETURN LINKED REPOSITORIES
  return response.data.data;
};

// <== UNLINK REPOSITORY FROM WORKSPACE ==>
const unlinkRepositoryAPI = async (
  workspaceId: string,
  repoId: number
): Promise<LinkedRepository[]> => {
  // TRY TO UNLINK REPOSITORY FROM WORKSPACE
  const response = await apiClient.delete<ApiResponse<LinkedRepository[]>>(
    `/workspaces/${workspaceId}/repositories/${repoId}`
  );
  // CHECK IF RESPONSE IS VALID
  if (!response.data?.data) {
    // RETURN ERROR
    throw new Error("Failed to unlink repository");
  }
  // RETURN REMAINING REPOSITORIES
  return response.data.data;
};

// <== USE WORKSPACES HOOK ==>
export const useWorkspaces = () => {
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // TRY TO FETCH WORKSPACES
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["workspaces"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchWorkspaces,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T RETRY ON 404
      if (axiosError?.response?.status === 404) {
        // DON'T RETRY
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES
      return failureCount < 3;
    },
  });
  // RETURN WORKSPACES
  return {
    workspaces: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// <== USE WORKSPACE BY ID HOOK ==>
export const useWorkspaceById = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // TRY TO FETCH WORKSPACE BY ID
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["workspace", workspaceId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchWorkspaceById(workspaceId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!workspaceId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
    // <== RETRY ==>
    retry: (failureCount, error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError;
      // DON'T RETRY ON 404
      if (axiosError?.response?.status === 404) {
        // DON'T RETRY
        return false;
      }
      // RETRY OTHER ERRORS UP TO 3 TIMES
      return failureCount < 3;
    },
  });
  // RETURN WORKSPACE
  return {
    workspace: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// <== USE CREATE WORKSPACE HOOK ==>
export const useCreateWorkspace = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO CREATE WORKSPACE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: createWorkspaceAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Workspace created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create workspace. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE UPDATE WORKSPACE HOOK ==>
export const useUpdateWorkspace = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO UPDATE WORKSPACE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: UpdateWorkspaceRequest;
    }) => updateWorkspaceAPI(workspaceId, data),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Workspace updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update workspace. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE DELETE WORKSPACE HOOK ==>
export const useDeleteWorkspace = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO DELETE WORKSPACE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: deleteWorkspaceAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Workspace deleted successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to delete workspace. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE ARCHIVE WORKSPACE HOOK ==>
export const useArchiveWorkspace = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO ARCHIVE WORKSPACE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: archiveWorkspaceAPI,
    // <== ON SUCCESS ==>
    onSuccess: (_, workspaceId) => {
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      // SHOW SUCCESS TOAST
      toast.success("Workspace archived successfully!");
    },
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to archive workspace. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE UNARCHIVE WORKSPACE HOOK ==>
export const useUnarchiveWorkspace = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO UNARCHIVE WORKSPACE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: unarchiveWorkspaceAPI,
    // <== ON SUCCESS ==>
    onSuccess: (_, workspaceId) => {
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      // SHOW SUCCESS TOAST
      toast.success("Workspace restored successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to restore workspace. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE WORKSPACE MEMBERS HOOK ==>
export const useWorkspaceMembers = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // TRY TO FETCH WORKSPACE MEMBERS
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["workspaceMembers", workspaceId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchWorkspaceMembers(workspaceId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!workspaceId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
  // RETURN WORKSPACE MEMBERS
  return {
    members: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// <== USE UPDATE MEMBER ROLE HOOK ==>
export const useUpdateMemberRole = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO UPDATE MEMBER ROLE
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      memberId,
      role,
    }: {
      workspaceId: string;
      memberId: string;
      role: "admin" | "member" | "viewer";
    }) => updateMemberRoleAPI(workspaceId, memberId, role),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE MEMBERS QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", variables.workspaceId],
      });
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Member role updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update member role. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE REMOVE MEMBER HOOK ==>
export const useRemoveMember = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO REMOVE MEMBER
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => removeMemberAPI(workspaceId, memberId),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE MEMBERS QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspaceMembers", variables.workspaceId],
      });
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Member removed successfully!");
    },
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to remove member. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE WORKSPACE INVITATIONS HOOK ==>
export const useWorkspaceInvitations = (workspaceId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // TRY TO FETCH WORKSPACE INVITATIONS
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["workspaceInvitations", workspaceId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchWorkspaceInvitations(workspaceId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!workspaceId,
    // <== STALE TIME ==>
    staleTime: 2 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: false,
  });
  // RETURN WORKSPACE INVITATIONS
  return {
    invitations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// <== USE SEND INVITATION HOOK ==>
export const useSendInvitation = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO SEND INVITATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      email,
      role,
    }: {
      workspaceId: string;
      email: string;
      role?: "admin" | "member" | "viewer";
    }) => sendInvitationAPI(workspaceId, email, role),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE INVITATIONS QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspaceInvitations", variables.workspaceId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Invitation sent successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to send invitation. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE CANCEL INVITATION HOOK ==>
export const useCancelInvitation = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO CANCEL INVITATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      invitationId,
    }: {
      workspaceId: string;
      invitationId: string;
    }) => cancelInvitationAPI(workspaceId, invitationId),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE INVITATIONS QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspaceInvitations", variables.workspaceId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Invitation cancelled!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to cancel invitation. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE MY INVITATIONS HOOK ==>
export const useMyInvitations = () => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // TRY TO FETCH MY INVITATIONS
  const query = useQuery({
    // <== QUERY KEY ==>
    queryKey: ["myInvitations"],
    // <== QUERY FUNCTION ==>
    queryFn: fetchMyInvitations,
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 1 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 5 * 60 * 1000,
    // <== REFETCH ON MOUNT ==>
    refetchOnMount: true,
    // <== REFETCH ON WINDOW FOCUS ==>
    refetchOnWindowFocus: true,
  });
  // RETURN MY INVITATIONS
  return {
    invitations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// <== USE ACCEPT INVITATION HOOK ==>
export const useAcceptInvitation = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO ACCEPT INVITATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: acceptInvitationAPI,
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE MY INVITATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success(`Joined workspace "${data.workspaceName}"!`);
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to accept invitation. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE DECLINE INVITATION HOOK ==>
export const useDeclineInvitation = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO DECLINE INVITATION
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: declineInvitationAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE MY INVITATIONS QUERY
      queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Invitation declined!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to decline invitation. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE LINK REPOSITORY HOOK ==>
export const useLinkRepository = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO LINK REPOSITORY
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      repoData,
    }: {
      workspaceId: string;
      repoData: {
        owner: string;
        name: string;
        fullName: string;
        repoId: number;
      };
    }) => linkRepositoryAPI(workspaceId, repoData),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Repository linked successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to link repository. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE UNLINK REPOSITORY HOOK ==>
export const useUnlinkRepository = () => {
  // GET QUERY CLIENT
  const queryClient = useQueryClient();
  // TRY TO UNLINK REPOSITORY
  return useMutation({
    // <== MUTATION FUNCTION ==>
    mutationFn: ({
      workspaceId,
      repoId,
    }: {
      workspaceId: string;
      repoId: number;
    }) => unlinkRepositoryAPI(workspaceId, repoId),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE WORKSPACE QUERY
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // INVALIDATE WORKSPACES QUERY
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      // SHOW SUCCESS TOAST
      toast.success("Repository unlinked successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to unlink repository. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
