const fs = require("fs");
const logger = require("../utils/Logger");

let errorHandler = (e, request, response, next) => {
  console.log(e, "messageHandler");
  if (e.errorType === undefined) {
  }
  if (e.errorType.message !== undefined) {
    if (e.errorType.returnMessageToUser) {
      // logger.info(e.errorType.message)
      response
        .status(e.errorType.httpCode)
        .json({ message: e.errorType.message, status: e.errorType.httpCode });
    } else {
      // console.log("Something went worng please try again")
      response.status(e.errorType.httpCode).json({
        message: "Something went worng please try again",
        status: e.errorType.httpCode,
      });
    }
    if (e.errorType.writeToFile) {
      fs.appendFileSync("./error/sql_error .txt", e.message + "\r\n");
    }
  }
};
module.exports = errorHandler;
