"use client";

import { concertsApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { IConcertData } from "@/lib/types";

const CONCERT_QUERY_KEY = ["concerts"];

export const useGetConcerts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [...CONCERT_QUERY_KEY, params],
    queryFn: () => concertsApi.getAll(params),
    select: (res) => res.data || [],
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetConcertById = (id?: string) => {
  return useQuery({
    queryKey: ["concert", id],
    queryFn: () => concertsApi.getById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });
};

/**
 * Create concert (supports FormData for images)
 */
export const useCreateConcert = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createConcert"],
    mutationFn: (data: IConcertData | FormData) => concertsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONCERT_QUERY_KEY });
      toast({
        title: "Concert Added 🎤",
        description: "New concert has been successfully scheduled.",
      });
    },
    onError: (error: any) => {
      console.error("Concert creation failed:", error);
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to create concert.";
      toast({
        variant: "destructive",
        title: "Creation Failed ❌",
        description: errorMessage,
      });
    },
  });
};

/**
 * Update concert (supports FormData for images)
 */
export const useUpdateConcert = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateConcert"],
    mutationFn: ({ id, data }: { id: string; data: Partial<IConcertData> | FormData }) =>
      concertsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONCERT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["concert", variables.id] });
      toast({
        title: "Concert Updated ✏️",
        description: "Concert details updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Concert update failed:", error);
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to update concert.";
      toast({
        variant: "destructive",
        title: "Update Failed ❌",
        description: errorMessage,
      });
    },
  });
};

/**
 * Delete concert
 */
export const useDeleteConcert = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteConcert"],
    mutationFn: (id: string) => concertsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONCERT_QUERY_KEY });
      toast({
        title: "Concert Deleted 🗑️",
        description: "Concert has been removed successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Concert deletion failed:", error);
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to delete concert.";
      toast({
        variant: "destructive",
        title: "Delete Failed ❌",
        description: errorMessage,
      });
    },
  });
};
