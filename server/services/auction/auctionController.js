const router = require("express").Router();
const auctionQueue = require("../../utils/rabbitmq/auctionQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;

router.get("/:viewAsClientUserId", async (req, res, next) => {
  const viewAsClientUserId = req.params.viewAsClientUserId;
  const userId = req.userId;
  let userType = req.userType;
  let clientUserId =
    viewAsClientUserId === "undefined" ? req.clientUserId : viewAsClientUserId;
  let viewAs = viewAsClientUserId === "undefined" ? false : true;
  const traderId = req.traderId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "get_all_auction",
      id: req_id,
      data: {
        userId,
        userType,
        clientUserId,
        viewAs,
        traderId
      },
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/add", async (req, res, next) => {
  let auctionData = req.body;
  const traderId = req.userId;
  const userType = req.userType;
  const clientUserId = req.clientUserId;
  auctionData = { ...auctionData, trader_id: traderId, userType, clientUserId };
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "add_auction",
      id: req_id,
      data: {
        auctionData,
      },
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/update_auction", async (req, res, next) => {
  let auctionData = req.body;
  const traderId = req.userId;
  const userType = req.userType;
  const clientUserId = req.clientUserId;
  auctionData = { ...auctionData, trader_id: traderId, userType, clientUserId };

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "update_auction",
      id: req_id,
      data: {
        auctionData,
      },
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/update/:id", async (req, res, next) => {
  let auctionId = req.params.id;
  const userId = req.userId;
  const userType = req.userType;
  const clientUserId = req.clientUser;

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "update_auction_status",
      id: req_id,
      data: {
        auctionId,
        userId,
        userType,
        clientUserId,
      },
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/remove", async (req, res, next) => {

  const auctionsStaticIds = req.body;
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "remove_bond_from auction",
      id: req_id,
      data: {
        auctionsStaticIds
      },
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.delete("/remove_auctions_view_as", async (req, res, next) => {
  const traderId = req.traderId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionQueue.addRequest(req_id, poolData);
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
      type: "remove_auctions_view_as",
      id: req_id,
      data: {traderId},
    };
    auctionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
