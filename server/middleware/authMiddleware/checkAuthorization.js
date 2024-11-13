const jwt = require("jsonwebtoken");
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");

const checkAuthorization = async (req, res, next) => {
  if (req.url === "/auth/login" || req.url === "/auth/forgot_password") {
    next();
  } else {
    try {
      let authorizationString = req.headers["authorization"];
      if (authorizationString === undefined) {
      } else {
        let token = authorizationString.substring("Bearer ".length);
        await verifyToken(req, token);
        next();
      }
    } catch (e) {
      next(e);
    }
  }
};

const verifyToken = (req, token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      `${process.env.TOKEN_SECRET_KEY}`,
      function (err, decoded) {
        if (err) {
          reject(new ErrorMessage(ErrorType.INVALID_TOKEN));
        }
        if (decoded === undefined) {
          reject(new ErrorMessage(ErrorType.INVALID_TOKEN));
        }
        
        req.clientUserId = decoded.clientUserId;
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        req.dailyLimit = decoded.dailyLimit;
        req.privileges = decoded.privileges;
        req.permission = decoded.permission;
        req.phone = decoded.phone;
        req.email = decoded.email;
        req.userTableId = decoded.userTableId;
        req.traderId = decoded.traderId
        req.name = decoded.name;
        req.clientName = decoded.clientName;
        return resolve(decoded);
      }
    );
  });
};


module.exports = {
  checkAuthorization,
};
