const router = require("express").Router();
const notificationQueue = require("../../utils/rabbitmq/notificationQueue");
const authQueue = require("../../utils/rabbitmq/authQueue");
const uuid = require("uuid").v4;
const redisGroup = require("../../redis/redisGroup");
const moment = require("moment");

const REDIS_GROUP_POOL_REQUEST = process.env.REDIS_GROUP_POOL_REQUEST;
const EXPIRED_REQ_IN_SEC = 60;

router.post("/login", async (req, res, next) => {
  const userLoggedDetails = req.body;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    // notificationQueue.addRequest(req_id, poolData)

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
      type: "login",
      id: req_id,
      data: {
        userLoggedDetails,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/forgot_password", async (req, res, next) => {
  const userEmail = req.body;
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);

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
      type: "forgot_password",
      id: req_id,
      data: {
        userEmail,
      },
    };

    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.get("/protected_route", async (req, res, next) => {
  const permission = req.permission;
  const privileges = req.privileges;
  let userInfo = { permission, privileges };
  if (req.userType === "client") {
    userInfo = {
      ...userInfo,
      name: req.name,
      clientName: req.clientName,
      clientUserId: req.clientUserId,
    };
  }

  try {
    res.status(200).send(userInfo);
  } catch (error) {
    return next(error);
  }
});

router.post("/auth_check_type", async (req, res, next) => {
  const userData = {
    chosenWay: req.body.chosenWay,
    userTableId: req.userTableId,
    email: req.email,
    phone: req.phone,
  };

  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    notificationQueue.addRequest(req_id, poolData);

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
      type: "auth_check_type",
      id: req_id,
      data: {
        userData,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/auth_check_qr_code", async (req, res, next) => {
  const { sixDigits } = req.body;
  const verifyQrCodeData = {
    sixDigits: sixDigits,
    userId: req.userId,
    userType: req.userType,
    userTableId: req.userTableId,
    permission: req.permission,
    clientUserId: req.clientUserId,
    privileges: req.privileges,
  };
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    notificationQueue.addRequest(req_id, poolData);

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
      type: "auth_check_qr_code",
      id: req_id,
      data: {
        verifyQrCodeData,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.post("/auth_check_six_digits", async (req, res, next) => {
  let verifySixDigitsData = {
    userId: req.userTableId,
    sixDigits: req.body.sixDigits,
    userType: req.userType,
    permission: req.permission,
    clientUserId: req.clientUserId,
    privileges: req.privileges,
    authTypeRequest: req.body.authTypeRequest,
    traderId: req.traderId,
    name: req.name,
    clientName: req.clientName,
    phone: req.phone,
  };
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    notificationQueue.addRequest(req_id, poolData);

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
      type: "auth_check_six_digits",
      id: req_id,
      data: {
        verifySixDigitsData,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.put("/impersonation_auth", async (req, res, next) => {
  const viewAsClientUserData = req.body;
  let authData = {
    client_user_id: viewAsClientUserData.clientUserId,
    userTableId: viewAsClientUserData,
    userId: viewAsClientUserData.userTableId,
    privileges: viewAsClientUserData.privileges,
    dailyLimit: viewAsClientUserData.dailyLimit,
    userType: "client",
    permission: viewAsClientUserData.permission,
    phone: `${viewAsClientUserData.phone.code}${viewAsClientUserData.phone.number}`,
    email: viewAsClientUserData.email,
  };
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    notificationQueue.addRequest(req_id, poolData);

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
      type: "impersonation_auth",
      id: req_id,
      data: {
        authData,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

router.put("/reset_password", async (req, res, next) => {
  const userData = {
    userId: req.userTableId,
    ...req.body,
  };
  try {
    const req_id = uuid();

    const poolData = {
      res,
      expired_at: moment().add(EXPIRED_REQ_IN_SEC, "seconds"),
    };
    authQueue.addRequest(req_id, poolData);
    notificationQueue.addRequest(req_id, poolData);

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
      type: "reset_password",
      id: req_id,
      data: {
        userData,
      },
    };
    authQueue.sendMessageToQueue(messageToQueue);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
