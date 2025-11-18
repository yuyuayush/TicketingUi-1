"use client";

import { theatersApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

const THEATER_QUERY_KEY = ["theaters"];

//  Get all theaters (public)
export const useGetTheaters = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...THEATER_QUERY_KEY, params],
        queryFn: () => theatersApi.getAll(params),
        select: (res) => res.data?.theaters,
        staleTime: 5 * 60 * 1000, // cache for 5 mins
    });
};

//  Get single theater by ID
export const useGetTheaterById = (id?: string) => {
    return useQuery({
        queryKey: [...THEATER_QUERY_KEY, id],
        queryFn: () => (id ? theatersApi.getById(id) : null),
        enabled: !!id,
        select: (res) => res?.data,
    });
};

//  Create theater (Admin only)
export const useCreateTheater = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationKey: [...THEATER_QUERY_KEY, "create"],
        mutationFn: theatersApi.create,
        onSuccess: () => {
            toast({
                title: "Theater Created 🎬",
                description: "New theater added successfully.",
            });
            queryClient.invalidateQueries({ queryKey: THEATER_QUERY_KEY });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Failed to Create Theater ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Please try again later.",
            });
        },
    });
};

//  Update theater (Admin only)
export const useUpdateTheater = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationKey: [...THEATER_QUERY_KEY, "update"],
        mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) =>
            await theatersApi.update(id, data),
        onSuccess: () => {
            toast({
                title: "Theater Updated ✅",
                description: "Theater details updated successfully.",
            });
            queryClient.invalidateQueries({ queryKey: THEATER_QUERY_KEY });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Update Failed ⚠️",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong.",
            });
        },
    });
};

//  Delete theater (Admin only)
export const useDeleteTheater = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationKey: [...THEATER_QUERY_KEY, "delete"],
        mutationFn: theatersApi.delete,
        onSuccess: () => {
            toast({
                title: "Theater Deleted 🗑️",
                description: "Theater has been removed successfully.",
            });
            queryClient.invalidateQueries({ queryKey: THEATER_QUERY_KEY });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Deletion Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to delete this theater.",
            });
        },
    });
};
