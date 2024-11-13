const jwt = require("jsonwebtoken");
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");

const verifyToken = (req,token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.TOKEN_SECRET_KEY,
        function (err, decoded) {
          if (err) {
            reject(new ErrorMessage(ErrorType.INVALID_TOKEN));
          }
          if (decoded === undefined) {
            reject(new ErrorMessage(ErrorType.INVALID_TOKEN));
          }
          req.clientUserId = decoded.clientUserId 
          req.userId = decoded.userId;
          req.userType = decoded.userType;
          req.dailyLimit = decoded.dailyLimit;
          req.privileges = decoded.privileges;
          req.permission = decoded.permission;
          req.phone = decoded.phone;
          req.email = decoded.email;
          req.userTableId = decoded.userTableId;
          req.name = decoded.name
          req.traderId = decoded.traderId
          return resolve(decoded);
        }
      );
    });
  };

  module.exports = {
    verifyToken,
  }