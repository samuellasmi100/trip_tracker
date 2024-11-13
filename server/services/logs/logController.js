const router = require("express").Router();
const logQueue = require("../../utils/rabbitmq/logQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");
const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;


router.post("/", async (req, res, next) => {
  const bondsData = req.body;
  try {
    const req_id = uuid();
    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    bondQueue.addRequest(req_id, poolData);
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
      type: "update_or_add_bonds",
      id: req_id,
      data: {
        bondsData,
      },
    };
    logQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
