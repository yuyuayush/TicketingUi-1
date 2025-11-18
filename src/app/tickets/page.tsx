"use client";

import { CalendarDays, MapPin, ArrowRight, Clock } from "lucide-react";
import { useGetUserBookings } from "@/hooks/useBooking";
import Loading from "../loading";
import Link from "next/link";
import { getConcertImageUrl } from "@/lib/imageUtils";

export default function MyTicketsPage() {
  const { data: tickets = [], isLoading, error } = useGetUserBookings();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center py-12">
        <h1 className="text-red-600 font-semibold">Something went wrong...</h1>
      </div>
    );

  const confirmed = tickets.filter((t) => t.status === "CONFIRMED");

  const upcoming = confirmed.filter((t) => {
    const date = t.concertId?.startTime ? new Date(t.concertId.startTime) : null;
    return date && date > new Date();
  });

  const past = confirmed.filter((t) => {
    const date = t.concertId?.startTime ? new Date(t.concertId.startTime) : null;
    return date && date <= new Date();
  });

  const isEmpty = confirmed.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
        </div>

        {upcoming.length > 0 && <Section title="Upcoming Events" data={upcoming} />}
        {past.length > 0 && <Section title="Past Events" data={past} />}

        {isEmpty && (
          <div className="text-center py-20 text-gray-500">
            <p>No tickets available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, data }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
}

/** 🎟️ WORKING TICKET CARD BASED ON YOUR EXACT DB */
function TicketCard({ ticket }) {
  const concert = ticket.concertId;
  const startDate = concert?.startTime ? new Date(concert.startTime) : null;
  const isPast = startDate && startDate < new Date();

  return (
    <Link
      href={`/tickets/${ticket._id}`}
      className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
    >
      <img
        src={getConcertImageUrl(concert)}
        alt={concert?.title}
        className="w-full h-40 object-cover rounded-t-lg"
      />

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">{concert?.title}</h3>
        <p className="text-sm text-gray-600">By {concert?.artist}</p>

        {/* Event Date */}
        {startDate && (
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            {startDate.toLocaleDateString()}
          </div>
        )}

        {/* Past Label */}
        {isPast && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Past Event
          </p>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <span className="text-pink-600 font-medium">
            ₹{concert.basePrice / 100}
          </span>

          <span className="flex items-center text-gray-600">
            View Ticket
            <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
