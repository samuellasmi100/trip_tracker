const uuid = require("uuid").v4;
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const checkSocketAuthorizationMiddleware = require("../middleware/authMiddleware/socketAuthorization");
const sessionManager = require("./helper/sessionManager");
const notificationQueue = require("../utils/rabbitmq/authQueue");
const { startSendingMessages } = require('./helper/broadcast');
app.use(cors());
app.use(bodyParser.json());

const interval = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      return ws.close();
    }

    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

const heartbeat = (ws) => {
  ws.isAlive = true;
};

const get_wss_of_ws_service = () => wss;



const web_socket_service = async () => {

  try {
    wss.on("connection", async (ws, req) => {
      ws.id = uuid();
      
      let user = {};

      try {
        user.token = req.url.split("/?token=")[1];
        await handleToken({ req, token: user.token, ws });

    
      } catch (error) {
        console.log(error);
        ws.send("login failed");
        ws.close(4401);
        return;
      }

      ws.on("message", async (client_msg) => {
        try {
        } catch (error) {
          ws.send("error");
          ws.close(4401);
          return;
        }
      });

      ws.on("close", async () => {
        
        const session = sessionManager.get_session(ws.id);
    

        sessionManager.delete_session(ws.id);

        ws.close();
        ws.terminate();
      });

      ws.on("error", async () => {
        sessionManager.delete_session(ws.id);
      });

      ws.on("pong", () => {
        heartbeat(ws);
      });
    });
    wss.on("close", () => {

      clearInterval(interval);
    });
  } catch (error) {
    console.log(error);
  }
};

const handleToken = async ({ req, token, ws }) => {
  try {
    const tokenData = await checkSocketAuthorizationMiddleware.verifyToken(
      req,
      token
    );
    const {
      clientUserId,
      userTableId,
      userId,
      privileges,
      dailyLimit,
      userType,
      permission,
      phone,
      email,
      name,
      traderId,
    } = tokenData;
    ws.user_id = userId;

    const new_session = {
      ws_id: ws.id,
      clientUserId,
      userTableId,
      userId,
      privileges,
      dailyLimit,
      userType,
      permission,
      phone,
      email,
      name,
      traderId,
    };
    sessionManager.add_session(ws.id, new_session);
  } catch (error) {
    ws.send("login failed");
    ws.close(4401);
    console.log(error);
  }
};

server.listen(process.env.WEBSOCKET_PORT || 8080, () => {
  console.log(`Creating ws server on port ${process.env.WEBSOCKET_PORT}.`);
});

exports.web_socket_service = web_socket_service;
exports.get_wss_of_ws_service = get_wss_of_ws_service;
