"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, initSocket, disconnectSocket, joinConcertRoom, leaveConcertRoom } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuth";

interface UseSocketOptions {
  concertId?: string;
  onSeatUpdate?: (data: { seats: Array<{ _id: string; status: string; lockedBy?: string | null }> }) => void;
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

    // Initialize socket
    const socket = initSocket();
    socketRef.current = socket;

    // Connection status handlers
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    });

    // Join concert room if concertId is provided
    if (concertId) {
      joinConcertRoom(concertId);
    }

    // Listen for seat updates
    if (onSeatUpdate && concertId) {
      socket.on('seatUpdate', onSeatUpdate);
      console.log(`👂 Listening for seat updates on: concert-${concertId}`);
    }

    // Cleanup
    return () => {
      if (socket && concertId) {
        leaveConcertRoom(concertId);
        if (onSeatUpdate) {
          socket.off('seatUpdate', onSeatUpdate);
        }
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

