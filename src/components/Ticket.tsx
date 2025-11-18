"use client";

import { CalendarDays, IdCard, MapPin, Ticket as TicketIcon, User } from "lucide-react";
import Image from "next/image";
import { getConcertImageUrl } from "@/lib/imageUtils";

export default function Ticket({ ticket }: { ticket: any }) {
  if (!ticket) {


    
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Ticket data not found</p>
      </div>
    );
  }

  const concert = ticket.concertId;
  const theater = concert?.theaterId;
  const seatDetails = ticket.seats
    ?.map((s) => `Row ${s.row} - Seat ${s.column} (${s.seatType})`)
    .join(", ") || "General Admission";

  const user = ticket.user;
  const isCancelled = ticket.status === "cancelled";
  const isUsed = ticket.status === "used";

  const statusText = isCancelled
    ? "Cancelled"
    : isUsed
      ? "Used Ticket"
      : "Valid Ticket";

  const poster = getConcertImageUrl(concert);

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-lg border ${isCancelled ? "border-red-300" : "border-gray-200"}`}>
      {/* Event Poster */}
      <div className="relative">
        {poster && (
          <div className="relative w-full aspect-[21/9]">
            <img
              src={poster}
              alt={concert.title}
              className={`object-cover object-center ${isCancelled ? "opacity-50" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          </div>
        )}

        <div className={`px-6 py-4 ${poster ? "absolute bottom-0 left-0 right-0" : isCancelled ? "bg-red-600" : "bg-indigo-600"}`}>
          <h2 className="text-2xl font-bold text-white">{concert.title}</h2>
          {isCancelled && <p className="text-red-200 mt-1">This event has been cancelled</p>}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-center text-gray-700">
              <CalendarDays className="w-5 h-5 mr-3 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(concert.startTime).toLocaleDateString()} —{" "}
                  {new Date(concert.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {/* Theater & Location */}
            {theater && (
              <div className="flex flex-col text-gray-700">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Theater</p>
                    <p className="font-medium">{theater.name}</p>
                  </div>
                </div>
                <div className="ml-8 mt-1">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{theater.address}</p>
                  {theater.city && <p className="text-xs text-gray-500">City ID: {theater.city}</p>}
                  {theater.facilities?.length > 0 && (
                    <p className="text-xs text-gray-500">Facilities: {theater.facilities.join(", ")}</p>
                  )}
                </div>
              </div>
            )}

            {/* User */}
            <div className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-3 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Seat Numbers */}
            <div className="flex items-center text-gray-700">
              <TicketIcon className="w-5 h-5 mr-3 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Seats</p>
                <p className="text-sm font-medium text-gray-700">{seatDetails}</p>
              </div>
            </div>

            {/* Booking ID */}
            <div className="flex items-center text-gray-700 break-all">
              <IdCard className="w-5 h-5 mr-3 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Booking No</p>
                <p className="font-medium">{ticket.bookingId}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center text-gray-700">
              <TicketIcon className="w-5 h-5 mr-3 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-medium">₹{concert.basePrice}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center border-l border-gray-300 pl-6">
            {ticket.qrCode && (
              <div className={`bg-gray-100 p-4 rounded-lg ${isCancelled ? "opacity-40" : ""}`}>
                <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500 uppercase text-center break-words">{ticket.bookingId}</p>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Important Information</h3>

          {isCancelled ? (
            <p className="text-sm text-red-600">Event is cancelled. Refund will be issued automatically.</p>
          ) : (
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Please carry a valid ID</li>
              <li>• Reach at least 30 minutes early</li>
              <li>• Show QR code at entry for scanning</li>
              <li>• Theater: {theater?.name}, Address: {theater?.address}</li>
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Booked on: {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
        <span className={`text-sm font-medium ${isCancelled ? "text-red-600" : isUsed ? "text-yellow-600" : "text-green-600"}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
