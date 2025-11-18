"use client";

import { seatApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { ISeatCreatePayload, ISeatLockPayload, ISeatUnlockPayload } from "@/lib/types";


// Reusable query key
const SEAT_QUERY_KEY = ["seats"];

export const useGetSeatsByConcert = (concertId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...SEAT_QUERY_KEY, concertId],
    queryFn: () => seatApi.getSeatsByConcert(concertId!),
    enabled: options?.enabled !== undefined ? (!!concertId && options.enabled) : !!concertId,
    select: (res) => res.data || [],
    staleTime: 5 * 60 * 1000,
  });
};


// --- Create seats (admin)
export const useCreateSeats = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSeats"],
    mutationFn: ({ concertId, seats }: { concertId: string; seats: ISeatCreatePayload[] }) =>
      seatApi.createSeats(concertId, seats),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...SEAT_QUERY_KEY, variables.concertId] });
      toast({
        title: "Seats Created 🎫",
        description: "Seats have been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Create Failed ",
        description: error?.response?.data?.message || error?.message || "Failed to create seats.",
      });
    },
  });
};

// --- Lock seats
export const useLockSeats = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["lockSeats"],
    mutationFn: (payload: ISeatLockPayload) => seatApi.lockSeats(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...SEAT_QUERY_KEY, payload.concertId] });
      toast({
        title: "Seats Locked 🔒",
        description: "Selected seats are locked temporarily.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lock Failed ❌",
        description: error?.response?.data?.message || error?.message || "Failed to lock seats.",
      });
    },
  });
};

// --- Unlock seats
export const useUnlockSeats = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unlockSeats"],
    mutationFn: (payload: ISeatUnlockPayload) => seatApi.unlockSeats(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [...SEAT_QUERY_KEY, payload.concertId] });
      toast({
        title: "Seats Released 🔓",
        description: "Selected seats are now available.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Unlock Failed ❌",
        description: error?.response?.data?.message || error?.message || "Failed to unlock seats.",
      });
    },
  });
};
