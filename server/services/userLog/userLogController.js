const router = require("express").Router();
const userLogQueue = require("../../utils/rabbitmq/userLogQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;

router.post("/", async (req, res, next) => {
  const userLogDetails = req.body;
  userLogDetails.onBehalf =
    userLogDetails.viewAsClientUserId !== "" ? req.name : "";
  userLogDetails.name = req.name;
  userLogDetails.traderId = req.traderId;
  userLogDetails.userType = req.userType
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userLogQueue.addRequest(req_id, poolData);
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
      type: "add_log_details",
      id: req_id,
      data: {
        userLogDetails,
      },
    };
    userLogQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const userType = req.userType
  const traderId = req.traderId
  const clientUserId = req.clientUserId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userLogQueue.addRequest(req_id, poolData);
    const redisData = {
      id: req_id,
    };
    redisGroup.insertToGroup(
      REDIS_GROUP_POOL_REQUEST,
      req_id,
      JSON.stringify(redisData),
      { EX: 600 }
    );
    if(userType === "trader"){
      const messageToQueue = {
        type: "get_log_details",
        id: req_id,
        data: {
          searchTerm,
          userType,
          traderId
        },
      };
      userLogQueue.sendMessageToQueue(messageToQueue);
    }else {
      const messageToQueue = {
        type: "get_user_log_details",
        id: req_id,
        data: {
          clientUserId,
          userType,
        },
      };
      userLogQueue.sendMessageToQueue(messageToQueue);
    }

  } catch (error) {
    return next(error);
  }
});

router.get("/:viewAsClientUserId", async (req, res, next) => {

  const date = req.query.date;
  const searchTerm = req.query.searchTerm;
  const requestOrigin = req.query.requestOrigin;
  const userType = req.userType
  const viewAs = req.params.viewAsClientUserId !== "undefined" ? true : false
  const clientUserId =
    req.params.viewAsClientUserId !== "undefined"
      ? req.params.viewAsClientUserId
      : req.clientUserId !== "undefined"
      ? req.clientUserId
      : undefined;
      
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userLogQueue.addRequest(req_id, poolData);
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
      type: "get_user_log_details",
      id: req_id,
      data: {
        clientUserId,
        date,
        searchTerm,
        requestOrigin,
        userType,
        viewAs 

      },
    };
    userLogQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/reports/:viewAsClientUserId", async (req, res, next) => {
  const date = req.query.date;
  const searchTerm = req.query.searchTerm;
  const requestOrigin = req.query.requestOrigin;
  const clientUserId =
    req.params.viewAsClientUserId !== "undefined"
      ? req.params.viewAsClientUserId
      : req.clientUserId !== "undefined"
      ? req.clientUserId
      : undefined;
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    userLogQueue.addRequest(req_id, poolData);
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
      type: "get_user_log_details_reports",
      id: req_id,
      data: {
        clientUserId,
        date,
        searchTerm,
        requestOrigin
      },
    };
    userLogQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
