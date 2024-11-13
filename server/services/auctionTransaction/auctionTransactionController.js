const router = require("express").Router();
const auctionTransactionQueue = require("../../utils/rabbitmq/auctionTransactionQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;
const REDIS_GROUP_USER_DATA = process.env.REDIS_GROUP_USER_DATA

router.get("/", async (req, res, next) => {
  const clientId = req.clientUserId;

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "get_auction_transaction_by_clientId",
      id: req_id,
      data: {
        clientId,
      },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const clientId = req.body.viewAsClientUserId
  ? req.body.viewAsClientUserId
  : req.clientUserId;
  let auctionBids = req.body;
  if(req.body.viewAsClientUserId){
    auctionBids = {...req.body , viewAs : true ,traderTableId : req.userId}
  }
  const traderId = req.traderId
  const userType = req.userType
  req.body.name = req.body.viewAsClientUserId === "" ? req.name : req.body.viewAsClientUserId 

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "add_auction_transaction_by_clientId",
      id: req_id,
      data: {
        clientId,
        auctionBids,
        traderId,
        userType

      },
    };

    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/remove_buy_transaction/:id/:clientId", async (req, res, next) => {
  let auctionId = req.params.id;
  let clientId = req.params.clientId
  const clientUserId = clientId === "undefined" ? req.clientUserId : clientId
   const traderId = req.traderId
   const auctionStaticIds = req.body.auctionStaticIds
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "remove_buy_transaction",
      id: req_id,
      data: {
        auctionId,
        clientUserId,
        traderId,
        auctionStaticIds
    },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/remove_sell_transaction/:id/:clientId", async (req, res, next) => {
  let auctionId = req.params.id;
  let clientId = req.params.clientId
  const clientUserId = clientId === "undefined" ? req.clientUserId : clientId
  const traderId = req.traderId
  const auctionStaticIds = req.body.auctionStaticIds

  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "remove_sell_transaction",
      id: req_id,
      data: {
        auctionId,
        clientUserId,
        traderId,
        auctionStaticIds
      },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/remove_all_transaction_of_auction/:id/:clientId", async (req, res, next) => {
  let auctionId = req.params.id;
  let clientId = req.params.clientId
  const clientUserId = clientId === "undefined" ? req.clientUserId : clientId
  const traderId = req.traderId
  const auctionStaticIds = req.body.auctionStaticIds
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "remove_all_transaction_of_auction",
      id: req_id,
      data: {
        auctionId,
        clientUserId,
        traderId,
        auctionStaticIds
      },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/remove_all_transaction/:clientId", async (req, res, next) => {
  let clientId = req.params.clientId
  let auctionsId = req.body.auctionsId
  const auctionStaticIds = req.body.result.map(auction => auction.auctionStaticId);
  const clientUserId = clientId === "undefined" ? req.clientUserId : clientId
  const traderId = req.traderId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "remove_all_transaction",
      id: req_id,
      data: {
        auctionsId,
        clientUserId,
        traderId,
        auctionStaticIds   
      },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.delete("/remove_all_transaction_log_out/:clientUserId", async (req, res, next) => {
  let clientUserId = req.params.clientUserId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    auctionTransactionQueue.addRequest(req_id, poolData);
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
      type: "remove_all_transaction_log_out",
      id: req_id,
      data: {
        clientUserId,  
      },
    };
    auctionTransactionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
