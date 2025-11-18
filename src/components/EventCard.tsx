"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { IConcertFormData } from "@/lib/types";
import { getConcertImageUrl } from "@/lib/imageUtils";

interface EventCardProps {
  event: IConcertFormData;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  console.log("getting this message from card ", event);

  const eventDate = new Date(event.startTime).getTime();
  const isPastEvent = eventDate < Date.now();

  // ⭐ FIX: theaterId may be string or object
  const theater =
    event.theaterId && typeof event.theaterId === "object"
      ? event.theaterId
      : null;

  const location = theater?.name ?? "Unknown Theater";
  const city = theater?.city ?? "";

  const image = getConcertImageUrl(event, "/fallback.jpg");

  const availableTickets = event?.availableTickets ?? event.totalTickets ?? 0;

  return (
    <div
      onClick={() => event._id && router.push(`/event/${event._id}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 
        border border-gray-100 cursor-pointer overflow-hidden 
        ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={event.title || "Event Image"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {event.title || "Untitled Event"}
            </h2>

            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Event
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col items-end gap-2 ml-4">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full ${
                isPastEvent ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"
              }`}
            >
              ₹{event.basePrice ?? 0}
            </span>

            {availableTickets <= 0 && (
              <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {location} {city && `• ${city}`}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>{new Date(event.startTime).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2" />
            <span>
              {availableTickets} / {event.totalTickets ?? 0} available
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {event.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
