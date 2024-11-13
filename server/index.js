const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
let config = require("./config");
const RabbitConnectionManager = require("./message_stream/RabbitMQConnectionManager");
const init_rabbit_queues = require("./utils/rabbitmq/init");
const ws_service = require("./ws/service");
const errorHandler = require("./serverLogs/errorHandler");
const checkAuthorizationMiddleware = require("./middleware/authMiddleware/checkAuthorization");
const logger = require("./utils/Logger");

//! services
const authServices = require("./services/auth/authController");
const regionServices = require("./services/region/regionController");
const notificationServices = require("./services/notification/notification");
const userServices = require("./services/user/userController");
const bondService = require("./services/bond/bondController");
const auctionService = require("./services/auction/auctionController");
const auctionTransactionService = require("./services/auctionTransaction/auctionTransactionController");
const reportsService = require("./services/reports/reportsController");
const userLogService = require("./services/userLog/userLogController");
const { startIntervalSendingMessages } = require("./ws/helper/broadcast");

app.use(cors());
app.use(express.json());

app.use(checkAuthorizationMiddleware.checkAuthorization);

app.use("/auth", authServices);
app.use("/regions", regionServices);
app.use("/notification", notificationServices);
app.use("/user", userServices);
app.use("/bonds", bondService);
app.use("/auction", auctionService);
app.use("/auction_transaction", auctionTransactionService);
app.use("/reports", reportsService);
app.use("/user_log",userLogService)

app.use(errorHandler);
const launchServer = async () => {
  await RabbitConnectionManager.initialize();
  await init_rabbit_queues.init_queues();
  ws_service.web_socket_service();
  startIntervalSendingMessages();
  app.listen(config.REST_API_PORT, () =>
    logger.info(`The Main Server is running on ${config.REST_API_PORT}`)
  );
};
launchServer();
