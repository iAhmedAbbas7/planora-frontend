// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== API RESPONSE TYPE ==>
type ApiResponse<T> = {
  // <== MESSAGE ==>
  message: string;
  // <== SUCCESS ==>
  success: boolean;
  // <== DATA ==>
  data: T;
};
// <== COMMENT TYPE ==>
export type Comment = {
  // <== ID ==>
  _id: string;
  // <== TEXT ==>
  text: string;
  // <== PROJECT ID ==>
  projectId: string;
  // <== USER ID ==>
  userId: string;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
};
// <== CREATE COMMENT REQUEST TYPE ==>
type CreateCommentRequest = {
  // <== TEXT ==>
  text: string;
  // <== PROJECT ID ==>
  projectId: string;
};

// <== FETCH COMMENTS BY PROJECT ID ==>
const fetchCommentsByProjectId = async (
  projectId: string | null
): Promise<Comment[]> => {
  // IF NO PROJECT ID, RETURN EMPTY ARRAY
  if (!projectId) return [];
  // FETCH COMMENTS
  const response = await apiClient.get<ApiResponse<Comment[]>>(
    `/projects/${projectId}/comments`
  );
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to fetch comments");
  }
  // RETURN COMMENTS
  return response.data.data;
};

// <== CREATE COMMENT API ==>
const createCommentAPI = async (
  commentData: CreateCommentRequest
): Promise<Comment> => {
  // CREATE COMMENT
  const response = await apiClient.post<ApiResponse<Comment>>(
    `/projects/${commentData.projectId}/comments`,
    { text: commentData.text }
  );
  // CHECK IF DATA EXISTS
  if (!response.data?.data) {
    // THROW ERROR
    throw new Error("Failed to create comment");
  }
  // RETURN CREATED COMMENT
  return response.data.data;
};

// <== DELETE COMMENT API ==>
const deleteCommentAPI = async (commentId: string): Promise<void> => {
  // DELETE COMMENT
  await apiClient.delete<ApiResponse<void>>(`/projects/comments/${commentId}`);
};

// <== USE COMMENTS BY PROJECT ID HOOK ==>
export const useCommentsByProjectId = (projectId: string | null) => {
  // RETURN USE QUERY
  return useQuery({
    queryKey: ["comments", "project", projectId],
    queryFn: () => fetchCommentsByProjectId(projectId),
    enabled: !!projectId,
  });
};

// <== USE CREATE COMMENT HOOK ==>
export const useCreateComment = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // CREATE COMMENT MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createCommentAPI,
    // <== ON SUCCESS ==>
    onSuccess: (data) => {
      // INVALIDATE COMMENTS QUERY
      queryClient.invalidateQueries({
        queryKey: ["comments", "project", data.projectId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Comment added successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET ERROR MESSAGE
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to add comment. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE DELETE COMMENT HOOK ==>
export const useDeleteComment = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // DELETE COMMENT MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: deleteCommentAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE ALL COMMENTS QUERIES
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      // SHOW SUCCESS TOAST
      toast.success("Comment deleted successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // GET ERROR MESSAGE
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to delete comment. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};
