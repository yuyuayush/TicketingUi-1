"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { concertApi } from "@/lib/api";

// Reusable query key
const MOVIE_QUERY_KEY = ["movies"];


/**
 * Get all movies
 * @param params Query parameters for filtering/pagination
 */
export const useGetMovies = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, params],
        queryFn: () => concertApi.getAll(params),
        // Assuming the API response for getAll contains the list of movies in a 'movies' property
        select: (res) => res.data?.movies || [],
        staleTime: 5 * 60 * 1000, // 5 min cache
    });
};

/**
 * Get single movie by ID
 * @param id The ID of the movie
 */
export const useGetMovieById = (id?: string) => {
    return useQuery({
        queryKey: ["movie", id],
        queryFn: () => concertApi.getById(id!),
        enabled: !!id,
        select: (res) => res.data,
    });
};

// --- Mutation Hooks ---

/**
 * Create movie
 */
export const useCreateMovie = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createMovie"],
        mutationFn: concertApi.create,
        onSuccess: () => {
            // Invalidate the list of movies to refetch it after a successful creation
            queryClient.invalidateQueries({ queryKey: MOVIE_QUERY_KEY });
            toast({
                title: "Movie Added 🎬",
                description: "New movie has been added successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Create Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create movie.",
            });
        },
    });
};

/**
 * Update movie
 */
export const useUpdateMovie = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateMovie"],
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            concertApi.update(id, data),
        onSuccess: () => {
            // Invalidate the list of movies to potentially update the listing
            queryClient.invalidateQueries({ queryKey: MOVIE_QUERY_KEY });
            // Invalidate the specific movie detail query to ensure the detail page is fresh
            // queryClient.invalidateQueries({ queryKey: ["movie", id] }); // Optional: Requires `id` from success payload or context

            toast({
                title: "Movie Updated ✏️",
                description: "Movie details updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Update Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update movie.",
            });
        },
    });
};

/**
 * Delete movie
 */
export const useDeleteMovie = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteMovie"],
        mutationFn: (id: string) => concertApi.delete(id),
        onSuccess: () => {
            // Invalidate the list of movies to remove the deleted movie from the list
            queryClient.invalidateQueries({ queryKey: MOVIE_QUERY_KEY });
            toast({
                title: "Movie Deleted 🗑️",
                description: "Movie has been removed successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Delete Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to delete movie.",
            });
        },
    });
};