"use client";

import { bookingApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Reusable Booking Query Key
const BOOKING_QUERY_KEY = ["bookings"];

// --- Get all bookings of logged-in user
export const useGetUserBookings = () => {
  return useQuery({
    queryKey: BOOKING_QUERY_KEY,
    queryFn: () => bookingApi.getUserBookings(),
    select: (res) => res.data?.bookings || [],
    staleTime: 5 * 60 * 1000,
  });
};
export const useGetUserLatestBookings = () => {
  return useQuery({
    queryKey: BOOKING_QUERY_KEY,
    queryFn: () => bookingApi.getUserLatestBookings(),
    select: (res) => res.data?.booking || [],
    staleTime: 5 * 60 * 1000,
  });
};

// --- Get booking by ID
export const useGetBookingById = (bookingId?: string) => {
  return useQuery({
    queryKey: [...BOOKING_QUERY_KEY, bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId!),
    enabled: !!bookingId,
    select: (res) => res.data?.booking,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostBookingByIdDownload = () => {

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingApi.getBookingByIdDownload(bookingId),
    onSuccess: (res) => {
      console.log("Booking Download Data:");
    },
  });
};


export const useCancelBooking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancelBooking"],
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: (_, bookingId) => {
      // Invalidate all bookings & single booking detail
      queryClient.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...BOOKING_QUERY_KEY, bookingId] });

      toast({
        title: "Booking Cancelled ",
        description: "Your booking has been successfully cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description:
          error?.response?.data?.message || error?.message || "Could not cancel booking.",
      });
    },
  });
};
