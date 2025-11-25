// <== IMPORTS ==>
import { AxiosError } from "axios";
import { apiClient } from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// <== PROFILE TYPE INTERFACE ==>
export type Profile = {
  // <== EMAIL ==>
  email: string;
  // <== NAME ==>
  name: string;
  // <== ROLE ==>
  role: string;
  // <== BIO ==>
  bio: string;
  // <== PROFILE PICTURE ==>
  profilePic: string;
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
// <== UPDATE PROFILE PARAMS TYPE INTERFACE ==>
type UpdateProfileParams = {
  // <== NAME ==>
  name?: string;
  // <== ROLE ==>
  role?: string;
  // <== BIO ==>
  bio?: string;
  // <== PROFILE PICTURE FILE ==>
  profilePicFile?: File;
  // <== DELETE PROFILE PICTURE FLAG ==>
  deleteProfilePic?: boolean;
};

// <== FETCH PROFILE FUNCTION ==>
const fetchProfile = async (): Promise<Profile> => {
  // FETCHING PROFILE
  const response = await apiClient.get<ApiResponse<Profile>>("/profile/info");
  // RETURNING PROFILE DATA
  return response.data.data;
};

// <== UPDATE PROFILE FUNCTION ==>
const updateProfile = async (params: UpdateProfileParams): Promise<Profile> => {
  // CREATING FORM DATA
  const formData = new FormData();
  // ADDING NAME IF PROVIDED
  if (params.name !== undefined) {
    formData.append("name", params.name);
  }
  // ADDING ROLE IF PROVIDED
  if (params.role !== undefined) {
    formData.append("role", params.role);
  }
  // ADDING BIO IF PROVIDED
  if (params.bio !== undefined) {
    formData.append("bio", params.bio);
  }
  // ADDING PROFILE PICTURE FILE IF PROVIDED
  if (params.profilePicFile) {
    formData.append("profilePic", params.profilePicFile);
  }
  // ADDING DELETE PROFILE PICTURE FLAG IF PROVIDED
  if (params.deleteProfilePic === true) {
    formData.append("deleteProfilePic", "true");
  }
  // UPDATING PROFILE
  const response = await apiClient.put<ApiResponse<Profile>>(
    "/profile/update",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  // RETURNING UPDATED PROFILE DATA
  return response.data.data;
};

// <== USE PROFILE HOOK ==>
export const useProfile = () => {
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // FETCH PROFILE QUERY
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch: refetchProfile,
  } = useQuery<Profile, AxiosError<{ message?: string }>>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
  // UPDATE PROFILE MUTATION
  const updateProfileMutation = useMutation<
    Profile,
    AxiosError<{ message?: string }>,
    UpdateProfileParams
  >({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // INVALIDATE PROFILE QUERY
      queryClient.setQueryData(["profile"], data);
      // REFETCH PROFILE
      refetchProfile();
    },
  });
  // RETURNING PROFILE HOOK DATA
  return {
    profile,
    isLoading,
    isError,
    error,
    refetchProfile,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
};
