import { io } from "socket.io-client";

const SERVER_URL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:4000";

let socket = null;

/**
 * Connect (or reconnect) with a JWT token.
 * Safe to call multiple times — returns existing connected socket if already connected.
 */
export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  // If socket exists but is disconnected, clean it up first
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SERVER_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 10,
  });

  socket.on("connect", () => {
    console.log("[socket] connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.warn("[socket] connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[socket] disconnected:", reason);
  });

  return socket;
};

/** Cleanly disconnect and null the singleton. */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/** Returns the current socket instance (may be null if not connected). */
export const getSocket = () => socket;
