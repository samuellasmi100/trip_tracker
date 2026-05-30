import { io } from "socket.io-client";

const SERVER_URL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:4000";

let socket = null;

/**
 * Connect (or reconnect) with a JWT token.
 * Safe to call multiple times — returns existing connected socket if already connected.
 */
export const connectSocket = (token) => {
  // Reuse the existing socket if it's connected OR still actively (re)connecting.
  // A socket mid-handshake has connected=false but active=true. The old check
  // (`socket?.connected`) treated that as "no socket" and recreated it — so when
  // a child component (FamilyList) called connectSocket and attached listeners
  // BEFORE the parent (App) effect ran, App's later call disconnected the first
  // socket and made a second one, stranding FamilyList's document_uploaded/
  // document_deleted listeners on the dead socket. Recreate ONLY when there is
  // no socket or it has permanently stopped (manually closed / retries exhausted).
  if (socket && (socket.connected || socket.active)) return socket;

  // If socket exists but is permanently disconnected, clean it up first
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
