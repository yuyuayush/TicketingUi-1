"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { useGetConcertById } from "@/hooks/useConcert";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ArenaSeating from "@/components/AreanSeets";
import JoinQueue from "@/components/JoinQueue";
import { useAuthStore } from "@/store/useAuth";
import Loading from "@/app/loading";
import { getConcertImageUrl } from "@/lib/imageUtils";

export default function EventPage() {
  const user = null; // not logged in example
  const params = useParams();
  const concertId = params.id as string;
  const { isAuthenticated } = useAuthStore()

  const { data: event, isLoading, isError } = useGetConcertById(concertId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  // Convert backend → frontend shape
  const eventDate = new Date(event.startTime).getTime();
  const isPastEvent = eventDate < Date.now();

  const image = getConcertImageUrl(event, "/fallback.jpg");
  const location = event.theaterId?.name ?? "Unknown Theater";
  const city = event.theaterId?.city ?? "";
  const availableTickets = event.availableTickets ?? event.totalTickets;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Event Image */}
          <div className="aspect-[21/9] relative w-full">
            <Image
              src={image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Section */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-pink-500" />
                      Date
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.startTime).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-5 h-5 mr-2 text-pink-600" />
                      Location
                    </div>
                    <p className="text-gray-900">{location} {city && `• ${city}`}</p>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Ticket className="w-5 h-5 mr-2 text-pink-600" />
                      Price
                    </div>
                    <p className="text-gray-900">₹{event.basePrice}</p>
                  </div>

                  {/* Availability */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-5 h-5 mr-2 text-pink-600" />
                      Availability
                    </div>
                    <p className="text-gray-900">
                      {availableTickets} / {event.totalTickets} left
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Event Information
                  </h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Tickets are non-refundable unless the event is canceled</li>
                    <li>• Please arrive 30 minutes early</li>
                    <li>• Bring valid ID</li>
                    <li>• Age restriction: 18+</li>
                  </ul>
                </div>
              </div>


              {/* Right Section */}
              <div>
                <div className="sticky top-8 space-y-4">
                  {/* Reuse EventCard */}
                  <EventCard event={event} />

                  {isAuthenticated ? (
                    <Link href={`${concertId}/seat`}>
                      <Button className="w-full bg-blue-600 text-white">
                        Select your seat
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button className="w-full bg-blue-600 text-white">
                        Please sign before you select the seat
                      </Button>
                    </Link>

                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
