"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Ticket from "@/components/Ticket";
import { useGetUserLatestBookings } from "@/hooks/useBooking";
import Loading from "@/app/loading";

export default function TicketSuccess() {
  const { data: latestTicket, isLoading, error } = useGetUserLatestBookings();


  if ( isLoading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading ticket.</p>
      </div>
    );
  }

  if (!latestTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No ticket found</p>
      </div>
    );
  }

  const { concertId: concert, user, seats, theaterId: theater, finalAmount, qrCode, bookingId, createdAt, status } = latestTicket;

  const seatDetails =
    seats?.map((s) => `R${s.row}-S${s.column} (${s.seatType})`).join(", ") || "General Admission";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ticket Purchase Successful!
          </h1>
          <p className="mt-2 text-gray-600">
            Your ticket has been confirmed and is ready to use
          </p>
        </div>

        {/* Ticket Card */}
        <Ticket
          ticket={{
            bookingId,
            concertId: concert,
            seats,
            user,
            theaterId: theater,
            status,
            createdAt,
            finalAmount,
            qrCode,
          }}
        />
     
        {/* Back to Events Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => window.location.href = "/events"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Events
          </Button>
        </div>
      </div>
    </div>
  );
}
