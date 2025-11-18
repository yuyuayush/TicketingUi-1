"use client";

import { showsApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Reusable query key
const SHOW_QUERY_KEY = ["shows"];

//  Get all shows
export const useGetShows = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...SHOW_QUERY_KEY, params],
    queryFn: () => showsApi.getAll(params),
    select: (res) => res.data?.shows || [],
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

//  Get single show by ID
export const useGetShowById = (id?: string) => {
  return useQuery({
    queryKey: ["show", id],
    queryFn: () => showsApi.getById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });
};

//  Create show
export const useCreateShow = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createShow"],
    mutationFn: showsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOW_QUERY_KEY });
      toast({
        title: "Show Added ",
        description: "New show has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Create Failed ❌",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create show.",
      });
    },
  });
};

//  Update show
export const useUpdateShow = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateShow"],
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      showsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOW_QUERY_KEY });
      toast({
        title: "Show Updated ✏️",
        description: "Show details updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update Failed ❌",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update show.",
      });
    },
  });
};

//  Delete show
export const useDeleteShow = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteShow"],
    mutationFn: (id: string) => showsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOW_QUERY_KEY });
      toast({
        title: "Show Deleted 🗑️",
        description: "Show has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Delete Failed ❌",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete show.",
      });
    },
  });
};
