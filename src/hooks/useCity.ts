"use client";

import { citiesApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";


//  Reusable query key
const CITY_QUERY_KEY = ["cities"];

export const useGetCities = (params?: Record<string, any>) => {
    return useQuery({
        queryKey: [...CITY_QUERY_KEY, params],
        queryFn: () => citiesApi.getAll(params),
        select: (res) => res.data.cities,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetCityById = (id?: string) => {
    return useQuery({
        queryKey: ["city", id],
        queryFn: () => citiesApi.getById(id!),
        enabled: !!id, // only run if id exists
        select: (res) => res.data,
    });
};

export const useCreateCity = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createCity"],
        mutationFn: citiesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CITY_QUERY_KEY });
            toast({
                title: "City Added ✅",
                description: "New city has been added successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Create Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create city.",
            });
        },
    });
};

export const useUpdateCity = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateCity"],
        mutationFn: ({ id, data }: { id: string; data: any }) => citiesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CITY_QUERY_KEY });
            toast({
                title: "City Updated ✏️",
                description: "City details updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Update Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update city.",
            });
        },
    });
};

export const useDeleteCity = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteCity"],
        mutationFn: (id: string) => citiesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CITY_QUERY_KEY });
            toast({
                title: "City Deleted 🗑️",
                description: "City has been removed successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Delete Failed ❌",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to delete city.",
            });
        },
    });
};
