const fs = require("fs");


let errorHandler = (e, request, response, next) => {
  console.log(e, "messageHandler");
  // Safety net: if a controller forgot to wrap a raw Error in ErrorMessage,
  // don't crash the handler itself. Return a generic 500 so the client at
  // least sees a clean failure response instead of an empty body.
  if (!e || !e.errorType || e.errorType.message === undefined) {
    return response.status(500).json({
      message: "Something went wrong please try again",
      status: 500,
    });
  }
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
};
module.exports = errorHandler;
