const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Hard-fail on startup if any critical env var is missing. Without this, JWT
// sign/verify paths (auth middleware, socket auth, registration verify) would
// run with `undefined`, producing a `secretOrPrivateKey must have a value`
// crash deep inside a real user's request — or, with the template-literal
// `${process.env.X}` pattern elsewhere in the codebase, silently sign tokens
// against the literal string "undefined". Better to refuse to boot.
const REQUIRED_ENV = [
  "DB_HOST",
  "DB_USER",
  "DB_PASS",
  "REST_API_PORT",
  "TOKEN_SECRET_KEY",
];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(
    `\nFATAL: required environment variable(s) missing from server/.env: ${missingEnv.join(", ")}.\n` +
    `Set them and restart. See server/CLAUDE.md "Environment Variables" for the full list.\n`
  );
  process.exit(1);
}

const errorHandler = require("./serverLogs/errorHandler");
const checkAuthorizationMiddleware = require("./middleware/authMiddleware/checkAuthorization");

//! services
const userController = require("./services/users/userController");
const roomsController = require("./services/rooms/roomsController");
const flightsController = require("./services/flights/flightsController");
const paymentsController = require("./services/payments/paymentsController");
const notesController = require("./services/notes/notesController");
const authController = require("./services/auth/authController");
const familyController = require("./services/families/familyController");
const userRoomsController = require("./services/userRooms/userRoomsController");
const vacationsController = require("./services/vacations/vacationController");
const staticController = require("./services/static/staticController");
const budgetController = require("./services/budgets/budgetsController");
const leadsController = require("./services/leads/leadsController");
const publicLeadsController = require("./services/leads/publicLeadsController");
const notificationsController = require("./services/notifications/notificationsController");
const documentsController = require("./services/documents/documentsController");
const publicDocumentsController = require("./services/documents/publicDocumentsController");
const settingsController = require("./services/settings/settingsController");
const dashboardController = require("./services/dashboard/dashboardController");
const registrationsController = require("./services/registrations/registrationsController");
const publicRegistrationsController = require("./services/registrations/publicRegistrationsController");

app.use(cors());
// Raised from the body-parser default (100kb) to 5mb so legitimate internal
// bulk imports (e.g. the leads Excel upload — a few hundred-to-few-thousand
// rows ~ 100kb+) pass comfortably. Still capped as a safety guard.
app.use(express.json({ limit: "5mb" }));

// Public routes — no auth required (register BEFORE auth middleware)
app.use("/auth", authController);
app.use("/public", publicLeadsController);
app.use("/public", publicDocumentsController);
app.use("/public", publicRegistrationsController);
// Cardcom webhook — must be public (Cardcom POSTs here, no JWT)
app.post("/payments/webhook", paymentsController.webhookHandler);

app.use(checkAuthorizationMiddleware.checkAuthorization);

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
// Document files now live on Cloudflare R2 (served via presigned URLs); the
// former local-disk /uploads static mount was removed with the disk-multer path.
app.use('/leads', leadsController);
app.use('/notifications', notificationsController);
app.use('/documents', documentsController);
app.use('/settings', settingsController);
app.use('/dashboard', dashboardController);
app.use('/registrations', registrationsController);

app.use(errorHandler);

// ── Socket.io + HTTP server ────────────────────────────────────────────────
const { initSocket } = require("./socketServer");
const server = http.createServer(app);
initSocket(server);

// ── No automatic startup migrations ────────────────────────────────────────
// Schema changes are applied MANUALLY and intentionally via:
//   node migrations/run_migration.js
// (The old auto-migrations migrateSharedDb.js / migrateBudgetTables.js were
//  absorbed into migrations/schema.js + engine.js and are no longer called.)

const launchServer = async () => {
  server.listen(process.env.REST_API_PORT, () =>
    console.log(`The Main Server is running on ${process.env.REST_API_PORT}`)
  );
};
launchServer();
