import { io, Socket } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket: Socket | null = null;

/**
 * Initialize socket connection with authentication
 */
export const initSocket = (): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const token = getToken();

  socket = io(SOCKET_URL, {
    auth: {
      token: token ? `Bearer ${token}` : undefined,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = (): Socket | null => {
  if (!socket || !socket.connected) {
    return initSocket();
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a concert room for real-time seat updates
 */
export const joinConcertRoom = (concertId: string): void => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.emit('joinConcert', concertId);
    console.log(`📡 Joined concert room: concert-${concertId}`);
  }
};

/**
 * Leave a concert room
 */
export const leaveConcertRoom = (concertId: string): void => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.emit('leaveConcert', concertId);
    console.log(`📡 Left concert room: concert-${concertId}`);
  }
};

export default socket;

