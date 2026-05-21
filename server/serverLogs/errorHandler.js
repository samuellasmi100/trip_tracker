const fs = require("fs");
const path = require("path");

// Anchor the SQL error log to this module's location (server/error/) rather
// than the process CWD, and use a space-free filename. appendFileSync creates
// the file but NOT the directory, so the dir must be ensured first.
const SQL_ERROR_LOG = path.join(__dirname, "..", "error", "sql_error.txt");


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
    // Never let a logging failure throw out of the handler — the response has
    // already been sent above.
    try {
      fs.mkdirSync(path.dirname(SQL_ERROR_LOG), { recursive: true });
      fs.appendFileSync(SQL_ERROR_LOG, e.message + "\r\n");
    } catch (logErr) {
      console.error("Failed to write sql_error log:", logErr.message);
    }
  }
};
module.exports = errorHandler;
