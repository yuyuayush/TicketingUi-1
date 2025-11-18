"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, initSocket, disconnectSocket, joinConcertRoom, leaveConcertRoom } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuth";
import type { ISeat } from "@/lib/types";

interface SeatUpdateEvent {
  type: "LOCKED" | "UNLOCKED" | "BOOKED";
  seats: Array<{ _id: string; status: ISeat["status"]; lockedBy?: string | null }>;
}

interface UseSocketOptions {
  concertId?: string;
  onSeatUpdate?: (data: SeatUpdateEvent) => void;
  enabled?: boolean;
}

/**
 * Custom hook for managing socket connection and real-time seat updates
 */
export const useSocket = (options: UseSocketOptions = {}) => {
  const { concertId, onSeatUpdate, enabled = true } = options;
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    const socket = initSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      console.log("✅ Socket connected");

      if (concertId) {
        joinConcertRoom(concertId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (onSeatUpdate && concertId) {
      socket.on("seatUpdate", onSeatUpdate);
      console.log(`👂 Listening for seat updates on: concert-${concertId}`);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      if (concertId) {
        leaveConcertRoom(concertId);
      }

      if (onSeatUpdate) {
        socket.off("seatUpdate", onSeatUpdate);
      }
    };
  }, [enabled, isAuthenticated, concertId, onSeatUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
};

