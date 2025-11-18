"use client";

import { userApi } from "@/lib/api"; // Adjust path as necessary
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast"; // Adjust path as necessary
import {
  IUser,
  IUpdateProfileData,
  IUpdatePasswordData,
  IAdminUpdateUserData,
  IResetPasswordData,
  IGetAllUsersParams,
} from "@/lib/types"; // Adjust path as necessary

// --- Query Keys ---
const PROFILE_QUERY_KEY = ["userProfile"];
const ALL_USERS_QUERY_KEY = ["allUsers"];


export const useGetProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => userApi.getProfile(),
    select: (res) => res.data as IUser,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Updates the name and phone of the currently logged-in user.
 * @PUT /profile
 */
export const useUpdateProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: IUpdateProfileData) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast({
        title: "Profile Updated ✨",
        description: "Your profile details have been successfully updated.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update profile.";
      toast({
        variant: "destructive",
        title: "Update Failed ❌",
        description: errorMessage,
      });
    },
  });
};

/**
 * Allows the logged-in user to change their own password.
 * @PUT /profile/password
 */
export const useUpdatePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: (data: IUpdatePasswordData) => userApi.updatePassword(data),
    onSuccess: () => {
      toast({
        title: "Password Updated ✅",
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update password.";
      toast({
        variant: "destructive",
        title: "Update Failed ❌",
        description: errorMessage,
      });
    },
  });
};

// ====================================================================
// 2. ADMIN HOOKS (User Management)
// ====================================================================

/**
 * Retrieves a paginated and searchable list of all users. (Admin Only)
 * @GET /users
 */
export const useGetAllUsers = (params: IGetAllUsersParams = {}) => {
  return useQuery({
    queryKey: [...ALL_USERS_QUERY_KEY, params],
    queryFn: () => userApi.getAllUsers(params),
    staleTime: 60 * 2000, // 2 minute stale time
  });
};

/**
 * Updates a user's details by ID. (Admin Only)
 * @PUT /users/:id
 */
export const useUpdateUserByAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUserByAdmin"],
    mutationFn: ({ userId, data }: { userId: string; data: IAdminUpdateUserData }) =>
      userApi.updateUserByAdmin(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_USERS_QUERY_KEY });
      toast({
        title: "User Updated ✏️",
        description: "User details updated successfully by admin.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update user.";
      toast({
        variant: "destructive",
        title: "Admin Update Failed ❌",
        description: errorMessage,
      });
    },
  });
};

/**
 * Resets a user's password by ID. (Admin Only)
 * @PUT /users/:id/password
 */
export const useResetUserPassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["resetUserPassword"],
    mutationFn: ({ userId, data }: { userId: string; data: IResetPasswordData }) =>
      userApi.resetUserPassword(userId, data),
    onSuccess: () => {
      toast({
        title: "Password Reset Success ✔️",
        description: "User's password has been successfully reset.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to reset password.";
      toast({
        variant: "destructive",
        title: "Reset Failed ❌",
        description: errorMessage,
      });
    },
  });
};

/**
 * Deletes a user by ID. (Admin Only)
 * @DELETE /users/:id
 */
export const useDeleteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_USERS_QUERY_KEY });
      toast({
        title: "User Deleted 🗑️",
        description: "User has been removed from the system.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to delete user.";
      toast({
        variant: "destructive",
        title: "Delete Failed ❌",
        description: errorMessage,
      });
    },
  });
};