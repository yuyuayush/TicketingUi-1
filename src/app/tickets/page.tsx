"use client";

import { CalendarDays, MapPin, ArrowRight, Clock } from "lucide-react";
import { useGetUserBookings } from "@/hooks/useBooking";
import Loading from "../loading";
import Link from "next/link";
import { getConcertImageUrl } from "@/lib/imageUtils";

export default function MyTicketsPage() {
  const { data, isLoading, error } = useGetUserBookings();

  // Normalize tickets safely
  const tickets = data?.data || data || [];

  const confirmed = tickets.filter(t => t.status === "CONFIRMED");

  const upcoming = confirmed.filter((t) => {
    const date = t.concertId?.startTime ? new Date(t.concertId.startTime) : null;
    return date && date > new Date();
  });

  const past = confirmed.filter((t) => {
    const date = t.concertId?.startTime ? new Date(t.concertId.startTime) : null;
    return date && date <= new Date();
  });


  const isEmpty = confirmed.length === 0;


  if (isLoading)
    return (<Loading />);

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
        {data?.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
}

/** 🎟️ WORKING TICKET CARD BASED ON YOUR EXACT DB */
function TicketCard({ ticket }) {
  const concert = ticket.concertId;
  console.log(ticket)

  // If no concertId → show fallback card
  if (!concert) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">
          Ticket #{ticket.bookingId}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Concert info not available
        </p>

        <p className="text-sm text-gray-600 mt-2">
          Status: <span className="font-medium">{ticket.status}</span>
        </p>

        <p className="text-sm text-gray-600">
          Amount: ₹{ticket.totalAmount / 100}
        </p>

        <Link
          href={`/tickets/${ticket._id}`}
          className="mt-3 inline-block text-blue-600 hover:underline text-sm"
        >
          View Ticket
        </Link>
      </div>
    );
  }

  // Normal rendering when concert exists
  const startDate = concert.startTime ? new Date(concert.startTime) : null;
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

        {startDate && (
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            {startDate.toLocaleDateString()}
          </div>
        )}

        {isPast && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Past Event
          </p>
        )}

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

