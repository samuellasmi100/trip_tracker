'use strict';

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

/**
 * Initialize Socket.io on top of an existing http.Server.
 * Call once from index.js after creating the http server.
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  console.log(`[socket.io] server initialized on port ${process.env.REST_API_PORT}`);

  // Auth middleware — every socket connection must carry a valid JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error: no token'));
    const raw = token.replace(/^Bearer\s+/i, '');
    jwt.verify(raw, `${process.env.TOKEN_SECRET_KEY}`, (err, decoded) => {
      if (err) {
        console.warn('[socket.io] auth failed:', err.message, '| token prefix:', raw.substring(0, 20));
        return next(new Error('Authentication error: invalid token'));
      }
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    // All authenticated coordinators join a shared room
    socket.join('coordinators');
    console.log(`[socket] user connected: ${socket.user?.email} (${socket.id})`);

    socket.on('disconnect', (reason) => {
      console.log(`[socket] user disconnected: ${socket.user?.email} — ${reason}`);
    });
  });

  return io;
};

/**
 * Returns the io instance. Usable by any controller after initSocket() is called.
 */
const getIO = () => io;

module.exports = { initSocket, getIO };
