const router = require("express").Router();
const regionQueue = require("../../utils/rabbitmq/regionQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;

router.get("/", async (req, res, next) => {
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };

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
      type: "get_all",
      id: req_id,
    };

    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/client_user_region/:viewAsClientUserId", async (req, res, next) => {
  const userType = req.userType
  const viewAsClientUserId = req.params.viewAsClientUserId
  const clientUserId = viewAsClientUserId === "undefined" ?
  req.clientUserId : viewAsClientUserId;
  const viewAs = viewAsClientUserId === "undefined" ? false  : true
  const traderId = req.traderId
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
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
      type: "get_client_user_regions",
      id: req_id,
      data: {
        clientUserId,
        userType,
        viewAs,
        traderId
      },
    };
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const clientUserId = req.params.id;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
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
      type: "get_region_by_user_id",
      id: req_id,
      data: {
        clientUserId,
      },
    };
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/bond/:id", async (req, res, next) => {
  const regionId = req.params.id;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
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
      type: "get_bond_by_region",
      id: req_id,
      data: {
        regionId,
      },
    };
    regionQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
