const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
require("dotenv").config();
const errorHandler = require("./serverLogs/errorHandler");
const checkAuthorizationMiddleware = require("./middleware/authMiddleware/checkAuthorization");
const path = require('path');

//! services
const userController = require("./services/user/userController");
const roomsController = require("./services/rooms/roomsController");
const flightsController = require("./services/flights/flightsController");
const paymentsController = require("./services/payments/paymentsController");
const notesController = require("./services/notes/notesController");
const authController = require("./services/auth/authController");
const familyController = require("./services/family/familyController");
const userRoomsController = require("./services/userRooms/userRoomsController");
const vacationsController = require("./services/vacation/vacationController");
const staticController = require("./services/static/staticController");
const budgetController = require("./services/budget/budgetsController");
const uploadsController = require("./services/uploads/uploadsController");
const leadsController = require("./services/leads/leadsController");
const publicLeadsController = require("./services/leads/publicLeadsController");
const notificationsController = require("./services/notifications/notificationsController");
const documentsController = require("./services/documents/documentsController");
const publicDocumentsController = require("./services/documents/publicDocumentsController");
const signaturesController = require("./services/signatures/signaturesController");
const publicSignaturesController = require("./services/signatures/publicSignaturesController");
const settingsController = require("./services/settings/settingsController");
const bookingsController = require("./services/bookings/bookingsController");
const publicBookingsController = require("./services/bookings/publicBookingsController");
const dashboardController = require("./services/dashboard/dashboardController");

app.use(cors());
app.use(express.json());

// Public routes — no auth required (register BEFORE auth middleware)
app.use("/auth", authController);
app.use("/public", publicLeadsController);
app.use("/public", publicDocumentsController);
app.use("/public", publicSignaturesController);
app.use("/public", publicBookingsController);
// Cardcom webhook — must be public (Cardcom POSTs here, no JWT)
app.post("/payments/webhook", paymentsController.webhookHandler);

app.use(checkAuthorizationMiddleware.checkAuthorization);

const uploadsPath = path.resolve(__dirname, 'uploads');

app.use("/user", userController);
app.use("/family", familyController);
app.use("/rooms", roomsController);
app.use("/user_rooms", userRoomsController);
app.use("/flights", flightsController);
app.use("/payments", paymentsController);
app.use("/notes", notesController);
app.use("/vacations", vacationsController);
app.use("/static", staticController);
app.use("/budget", budgetController);
app.use('/uploads', express.static(uploadsPath), uploadsController);
app.use('/leads', leadsController);
app.use('/notifications', notificationsController);
app.use('/documents', documentsController);
app.use('/signatures', signaturesController);
app.use('/settings', settingsController);
app.use('/bookings', bookingsController);
app.use('/dashboard', dashboardController);

app.use(errorHandler);

// ── Socket.io + HTTP server ────────────────────────────────────────────────
const { initSocket } = require("./socketServer");
const server = http.createServer(app);
initSocket(server);

// ── Startup migrations ─────────────────────────────────────────────────────
const migrateBudgetTables = require("./sql/utils/migrateBudgetTables");
const migrateSharedDb = require("./sql/utils/migrateSharedDb");

const launchServer = async () => {
  await migrateBudgetTables();
  await migrateSharedDb();
  server.listen(process.env.REST_API_PORT, () =>
    console.log(`The Main Server is running on ${process.env.REST_API_PORT}`)
  );
};
launchServer();
