const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const errorHandler = require("./serverLogs/errorHandler");
const checkAuthorizationMiddleware = require("./middleware/authMiddleware/checkAuthorization");

//! services
const userServices = require("./services/user/userController");


app.use(cors());
app.use(express.json());

// app.use(checkAuthorizationMiddleware.checkAuthorization);


app.use("/user", userServices);


app.use(errorHandler);
const launchServer = async () => {
  app.listen(process.env.REST_API_PORT, () =>
    console.log(`The Main Server is running on ${process.env.REST_API_PORT}`)
  );
};
launchServer();
