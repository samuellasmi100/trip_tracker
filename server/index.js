const express = require("express");
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


app.use(cors());
app.use(express.json());

app.use("/auth",authController)

app.use(checkAuthorizationMiddleware.checkAuthorization);
const uploadsPath = path.resolve(__dirname, 'uploads');

app.use("/user", userController);
app.use("/family", familyController);
app.use("/rooms", roomsController);
app.use("/user_rooms", userRoomsController);
app.use("/flights",flightsController)
app.use("/payments",paymentsController)
app.use("/notes",notesController)
app.use("/vacations",vacationsController)
app.use("/static",staticController)
app.use("/budget",budgetController)
app.use('/uploads', express.static(uploadsPath),uploadsController);

app.use(errorHandler);
const launchServer = async () => {
  console.log(process.env.REST_API_PORT)
  app.listen(process.env.REST_API_PORT, () =>
    console.log(`The Main Server is running on ${process.env.REST_API_PORT}`)
  );
};
launchServer();
