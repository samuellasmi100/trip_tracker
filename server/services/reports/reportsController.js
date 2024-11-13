const router = require("express").Router();
const reportsQueue = require("../../utils/rabbitmq/reportsQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;

router.get("/:viewAsClientUserId", async (req, res, next) => {
  const date = req.query.date;
  const searchTerm = req.query.searchTerm;
  const clientUserId =
    req.params.viewAsClientUserId !== "undefined"
      ? req.params.viewAsClientUserId
      : req.clientUserId;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    reportsQueue.addRequest(req_id, poolData);

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
      type: "get_all_reports",
      id: req_id,
      data: {
        clientUserId,
        date,
        searchTerm,
      },
    };

    reportsQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
