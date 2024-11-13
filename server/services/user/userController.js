const router = require("express").Router();
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;
const userQueue = require("../../utils/rabbitmq/userQueue");
const regionQueue = require("../../utils/rabbitmq/regionQueue");
const wsService = require("../../ws/service");
const { get_sessions, get_session } = require("../../ws/helper/sessionManager");

router.post("/sign_up_trader", async (req, res, next) => {
  try {
    const newTraderData = req.body;

    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "sign_up_trader",
      id: req_id,
      data: {
        newTraderData,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/sign_up_client", async (req, res, next) => {
  const newClientData = req.body;
  newClientData.trader_id = req.userId;

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };

    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "sign_up_client",
      id: req_id,
      data: {
        newClientData,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/sign_up_client_user", async (req, res, next) => {
  const newClientUserData = req.body;

  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    regionQueue.addRequest(req_id, poolData);
    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "sign_up_client_user",
      id: req_id,
      data: {
        newClientUserData,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/clients", async (req, res, next) => {
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );
    const messageToQueue = {
      type: "clients",
      id: req_id,
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/clients/:id", async (req, res, next) => {
  const clientId = req.params.id;
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "get_client",
      id: req_id,
      data: {
        clientId,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/clients_users", async (req, res, next) => {
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "get_clients_users",
      id: req_id,
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/client_user/:id", async (req, res, next) => {
  const clientUserId = req.params.id;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "get_client_user",
      id: req_id,
      data: {
        clientUserId,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/traders", async (req, res, next) => {
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "get_traders",
      id: req_id,
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/get_users_online", async (req, res, next) => {
const usersOnline = get_sessions()
const filteredData = Object.values(usersOnline)
.filter(obj => obj.clientUserId !== undefined)
.map(obj => ({ name: obj.name }));

  try {
    res.status(200).send(filteredData);
  } catch (error) {
    return next(error);
  }
});

router.post("/clients/:id", async (req, res, next) => {
  const traderIdId = req.userId;

  const updateClientData = {
    data: req.body,
    clientId: req.params.id,
    traderId: traderIdId,
  };
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );

    const messageToQueue = {
      type: "update_client",
      id: req_id,
      data: {
        updateClientData,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/client_user/:id", async (req, res, next) => {
  req.privileges = req.body.privileges;
  const traderId = req.traderId
  const updateClientUserData = {
    data: req.body,
    clientUserId: req.params.id,
    userId: req.body.clientUserIdTable,
    traderId
  };

  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    regionQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );
    const messageToQueue = {
      type: "update_client_user",
      id: req_id,
      data: {
        updateClientUserData,
      },
    };
    userQueue.sendMessageToQueue(messageToQueue);
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/update_client_user_regions", async (req, res, next) => {
  const viewAsClientObj = req.body.viewAsClientUserObject;
  const clientUserId =
    viewAsClientObj === undefined
      ? req.clientUserId
      : viewAsClientObj.clientUserTableId;
  const userId =
    viewAsClientObj === undefined ? req.userId : viewAsClientObj.userId;
  const userType = req.userType;
  const viewAs = viewAsClientObj === undefined ? false : true;
  let newRegions = req.body.regions.map((region) => {
    return {
      client_id: clientUserId,
      name: region.region_name,
      id: region.region_id,
    };
  });
  const traderId = req.traderId
  const updateClientUserData = {
    data: {
      regions: newRegions,
      clientUserIdTable: userId,
      clientUserId: clientUserId,
      userType: userType,
      viewAs: viewAs,
      traderId
    },
  };
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userQueue.addRequest(req_id, poolData);
    regionQueue.addRequest(req_id, poolData);

    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );
    const messageToQueue = {
      type: "update_client_user",
      id: req_id,
      data: {
        updateClientUserData,
      },
    };
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});




module.exports = router;
