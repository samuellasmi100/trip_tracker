const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const errorHandler = require("./serverLogs/errorHandler");
const checkAuthorizationMiddleware = require("./middleware/authMiddleware/checkAuthorization");

//! services
const userController = require("./services/user/userController");
const roomsController = require("./services/rooms/roomsController");
const flightsController = require("./services/flights/flightsController");
const paymentsController = require("./services/payments/paymentsController");


app.use(cors());
app.use(express.json());

// app.use(checkAuthorizationMiddleware.checkAuthorization);


app.use("/user", userController);
app.use("/rooms", roomsController);
app.use("/flights",flightsController)
app.use("/payments",paymentsController)


app.use(errorHandler);
const launchServer = async () => {
  app.listen(process.env.REST_API_PORT, () =>
    console.log(`The Main Server is running on ${process.env.REST_API_PORT}`)
  );
};
launchServer();
