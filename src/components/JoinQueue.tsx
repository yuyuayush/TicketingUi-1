"use client";

import { useState } from "react";
import { Clock, OctagonXIcon } from "lucide-react";
import { EventType } from "@/lib/types";
import { Button } from "./ui/button";


interface JoinQueueProps {
  event: EventType;
  userId?: string; // optional, simulate logged-in user
}

export default function JoinQueue({ event, userId }: JoinQueueProps) {
  const [joined, setJoined] = useState(false);

  const isEventOwner = userId === event.userId;
  const isPastEvent = event.eventDate < Date.now();
  const availableTickets = event.totalTickets - event.purchasedCount;

  const handleJoinQueue = () => {
    if (!joined) {
      setJoined(true);
      alert("Dummy: Successfully joined the queue!");
    }
  };

  if (joined) {
    return (
      <div className="text-green-700 font-medium p-3 bg-green-50 rounded-lg text-center">
        You have joined the queue!
      </div>
    );
  }

  if (isEventOwner) {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg">
        <OctagonXIcon className="w-5 h-5" />
        <span>You cannot buy a ticket for your own event</span>
      </div>
    );
  }

  if (isPastEvent) {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
        <Clock className="w-5 h-5" />
        <span>Event has ended</span>
      </div>
    );
  }

  if (availableTickets <= 0) {
    return (
      <div className="text-center p-4 text-red-600 font-semibold">
        Sorry, this event is sold out
      </div>
    );
  }

  return (
    <Button
      onClick={handleJoinQueue}
      className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-500 transition-colors duration-200 shadow-md flex items-center justify-center"
    >
      Buy Ticket
    </Button>
  );
}
