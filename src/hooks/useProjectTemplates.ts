// <== IMPORTS ==>
import { AxiosError } from "axios";
import { toast } from "../lib/toast";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== TEMPLATE TASK TYPE ==>
export type TemplateTask = {
  // <== TASK ID ==>
  _id?: string;
  // <== TASK TITLE ==>
  title: string;
  // <== TASK DESCRIPTION ==>
  description?: string;
  // <== TASK PRIORITY ==>
  priority: "low" | "medium" | "high";
  // <== RELATIVE DUE DATE ==>
  relativeDueDate?: number | null;
  // <== TASK ORDER ==>
  order: number;
  // <== TASK PHASE ==>
  phase: string;
};
// <== PROJECT TEMPLATE TYPE ==>
export type ProjectTemplate = {
  // <== TEMPLATE ID ==>
  _id: string;
  // <== TEMPLATE NAME ==>
  name: string;
  // <== TEMPLATE DESCRIPTION ==>
  description?: string;
  // <== TEMPLATE CATEGORY ==>
  category: string;
  // <== TEMPLATE ICON ==>
  icon: string;
  // <== TEMPLATE COLOR ==>
  color: string;
  tasks: TemplateTask[];
  // <== IS SYSTEM TEMPLATE ==>
  isSystem: boolean;
  // <== CREATED BY ==>
  createdBy?: string | null;
  // <== IS PUBLIC TEMPLATE ==>
  isPublic: boolean;
  // <== USAGE COUNT ==>
  usageCount: number;
  // <== TAGS ==>
  tags: string[];
  // <== ESTIMATED DURATION ==>
  estimatedDuration?: number | null;
  // <== CREATED AT ==>
  createdAt: string;
  // <== UPDATED AT ==>
  updatedAt: string;
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
// <== CREATE TEMPLATE REQUEST ==>
type CreateTemplateRequest = {
  // <== TEMPLATE NAME ==>
  name: string;
  // <== TEMPLATE DESCRIPTION ==>
  description?: string;
  // <== TEMPLATE CATEGORY ==>
  category: string;
  // <== TEMPLATE ICON ==>
  icon?: string;
  // <== TEMPLATE COLOR ==>
  color?: string;
  // <== TEMPLATE TASKS ==>
  tasks?: TemplateTask[];
  // <== IS PUBLIC TEMPLATE ==>
  isPublic?: boolean;
  // <== TEMPLATE TAGS ==>
  tags?: string[];
  // <== ESTIMATED DURATION ==>
  estimatedDuration?: number;
};
// <== CREATE FROM TEMPLATE REQUEST ==>
type CreateFromTemplateRequest = {
  // <== TEMPLATE ID ==>
  templateId: string;
  // <== PROJECT TITLE ==>
  title: string;
  // <== PROJECT DESCRIPTION ==>
  description?: string;
  // <== IN CHARGE NAME ==>
  inChargeName: string;
  // <== ROLE ==>
  role: string;
  // <== DUE DATE ==>
  dueDate?: string;
  // <== PRIORITY ==>
  priority?: string;
  // <== CREATE TASKS ==>
  createTasks?: boolean;
};

// <== FETCH ALL PROJECT TEMPLATES ==>
const fetchProjectTemplates = async (
  category?: string,
  search?: string
): Promise<ProjectTemplate[]> => {
  // CREATE URL SEARCH PARAMS
  const params = new URLSearchParams();
  // ADD CATEGORY IF PROVIDED
  if (category && category !== "all") params.append("category", category);
  // ADD SEARCH IF PROVIDED
  if (search) params.append("search", search);
  // FETCH PROJECT TEMPLATES
  const response = await apiClient.get<ApiResponse<ProjectTemplate[]>>(
    `/templates${params.toString() ? `?${params.toString()}` : ""}`
  );
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.data) {
    // RETURN DEFAULT
    return [];
  }
  // RETURN DATA
  return response.data.data;
};

// <== FETCH SINGLE PROJECT TEMPLATE ==>
const fetchProjectTemplate = async (
  templateId: string
): Promise<ProjectTemplate> => {
  // FETCH PROJECT TEMPLATE
  const response = await apiClient.get<ApiResponse<ProjectTemplate>>(
    `/templates/${templateId}`
  );
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.data) {
    // RETURN DEFAULT
    throw new Error("Template not found");
  }
  // RETURN DATA
  return response.data.data;
};

// <== CREATE PROJECT TEMPLATE ==>
const createTemplateAPI = async (
  data: CreateTemplateRequest
): Promise<ProjectTemplate> => {
  // CREATE PROJECT TEMPLATE
  const response = await apiClient.post<ApiResponse<ProjectTemplate>>(
    "/templates",
    data
  );
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.data) {
    // RETURN DEFAULT
    throw new Error("Failed to create template");
  }
  // RETURN DATA
  return response.data.data;
};

// <== UPDATE PROJECT TEMPLATE ==>
const updateTemplateAPI = async (
  templateId: string,
  data: Partial<CreateTemplateRequest>
): Promise<ProjectTemplate> => {
  // UPDATE PROJECT TEMPLATE
  const response = await apiClient.put<ApiResponse<ProjectTemplate>>(
    `/templates/${templateId}`,
    data
  );
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.data) {
    // RETURN DEFAULT
    throw new Error("Failed to update template");
  }
  // RETURN DATA
  return response.data.data;
};

// <== DELETE PROJECT TEMPLATE ==>
const deleteTemplateAPI = async (templateId: string): Promise<void> => {
  // DELETE PROJECT TEMPLATE
  const response = await apiClient.delete<ApiResponse<void>>(
    `/templates/${templateId}`
  );
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.success) {
    // RETURN DEFAULT
    throw new Error("Failed to delete template");
  }
  // RETURN DATA
  return response.data.data;
};

// <== CREATE PROJECT FROM TEMPLATE ==>
const createFromTemplateAPI = async (
  data: CreateFromTemplateRequest
): Promise<{
  project: unknown;
  tasksCreated: number;
  templateUsed: string;
}> => {
  // CREATE PROJECT FROM TEMPLATE
  const response = await apiClient.post<
    ApiResponse<{
      project: unknown;
      tasksCreated: number;
      templateUsed: string;
    }>
  >(`/templates/${data.templateId}/create-project`, {
    title: data.title,
    description: data.description,
    inChargeName: data.inChargeName,
    role: data.role,
    dueDate: data.dueDate,
    priority: data.priority,
    createTasks: data.createTasks,
  });
  // RETURN DEFAULT IF NO DATA
  if (!response.data?.data) {
    // RETURN DEFAULT
    throw new Error("Failed to create project from template");
  }
  // RETURN DATA
  return response.data.data;
};

// <== USE PROJECT TEMPLATES HOOK ==>
export const useProjectTemplates = (category?: string, search?: string) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN PROJECT TEMPLATES QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["projectTemplates", category, search],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchProjectTemplates(category, search),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 10 * 60 * 1000,
  });
};

// <== USE PROJECT TEMPLATE HOOK ==>
export const useProjectTemplate = (templateId: string | null) => {
  // GET AUTH STATE
  const { isAuthenticated, isLoggingOut } = useAuthStore();
  // RETURN PROJECT TEMPLATE QUERY
  return useQuery({
    // <== QUERY KEY ==>
    queryKey: ["projectTemplate", templateId],
    // <== QUERY FUNCTION ==>
    queryFn: () => fetchProjectTemplate(templateId!),
    // <== ENABLED ==>
    enabled: isAuthenticated && !isLoggingOut && !!templateId,
    // <== STALE TIME ==>
    staleTime: 5 * 60 * 1000,
    // <== GC TIME ==>
    gcTime: 10 * 60 * 1000,
  });
};

// <== USE CREATE PROJECT TEMPLATE HOOK ==>
export const useCreateProjectTemplate = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN CREATE PROJECT TEMPLATE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createTemplateAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE PROJECT TEMPLATES QUERY
      queryClient.invalidateQueries({ queryKey: ["projectTemplates"] });
      // SHOW SUCCESS TOAST
      toast.success("Template created successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create template. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE UPDATE PROJECT TEMPLATE HOOK ==>
export const useUpdateProjectTemplate = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN UPDATE PROJECT TEMPLATE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: Partial<CreateTemplateRequest>;
    }) => updateTemplateAPI(templateId, data),
    // <== ON SUCCESS ==>
    onSuccess: (_, variables) => {
      // INVALIDATE PROJECT TEMPLATES QUERY
      queryClient.invalidateQueries({ queryKey: ["projectTemplates"] });
      // INVALIDATE PROJECT TEMPLATE QUERY
      queryClient.invalidateQueries({
        queryKey: ["projectTemplate", variables.templateId],
      });
      // SHOW SUCCESS TOAST
      toast.success("Template updated successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to update template. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE DELETE PROJECT TEMPLATE HOOK ==>
export const useDeleteProjectTemplate = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN DELETE PROJECT TEMPLATE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: deleteTemplateAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE PROJECT TEMPLATES QUERY
      queryClient.invalidateQueries({ queryKey: ["projectTemplates"] });
      // SHOW SUCCESS TOAST
      toast.success("Template deleted successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to delete template. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== USE CREATE PROJECT FROM TEMPLATE HOOK ==>
export const useCreateProjectFromTemplate = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // RETURN CREATE PROJECT FROM TEMPLATE MUTATION
  return useMutation({
    // <== MUTATION FN ==>
    mutationFn: createFromTemplateAPI,
    // <== ON SUCCESS ==>
    onSuccess: () => {
      // INVALIDATE PROJECTS QUERY
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // INVALIDATE PROJECT STATS QUERY
      queryClient.invalidateQueries({ queryKey: ["projectStats"] });
      // INVALIDATE TASKS QUERY
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // INVALIDATE PROJECT TEMPLATES QUERY
      queryClient.invalidateQueries({ queryKey: ["projectTemplates"] });
      // SHOW SUCCESS TOAST
      toast.success("Project created from template successfully!");
    },
    // <== ON ERROR ==>
    onError: (error: unknown) => {
      // TYPE ERROR AS AXIOS ERROR
      const axiosError = error as AxiosError<{ message?: string }>;
      // GET ERROR MESSAGE
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to create project from template. Please try again.";
      // SHOW ERROR TOAST
      toast.error(errorMessage);
    },
  });
};

// <== TEMPLATE CATEGORIES ==>
export const TEMPLATE_CATEGORIES = [
  // <== ALL TEMPLATES ==>
  { value: "all", label: "All Templates" },
  // <== WEB DEVELOPMENT ==>
  { value: "Web Development", label: "Web Development" },
  // <== MOBILE DEVELOPMENT ==>
  { value: "Mobile Development", label: "Mobile Development" },
  // <== BACKEND DEVELOPMENT ==>
  { value: "Backend Development", label: "Backend Development" },
  // <== DEVOPS ==>
  { value: "DevOps", label: "DevOps" },
  // <== DATA SCIENCE ==>
  { value: "Data Science", label: "Data Science" },
  // <== DESIGN ==>
  { value: "Design", label: "Design" },
  // <== MARKETING ==>
  { value: "Marketing", label: "Marketing" },
  // <== BUSINESS ==>
  { value: "Business", label: "Business" },
  // <== PERSONAL ==>
  { value: "Personal", label: "Personal" },
  // <== OTHER ==>
  { value: "Other", label: "Other" },
];
