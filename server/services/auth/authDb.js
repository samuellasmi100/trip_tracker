const connection = require("../../db/connection-wrapper");
const authQuery = require("../../sql/query/authQuery");
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");
const MessageType = require("../../serverLogs/messages/messageType");

const checkUserInfo = async (email, password) => {
  let sql = authQuery.getAll();
  let parameters = [email, password];

  try {
    const [result] = await connection.executeWithParameters(sql, parameters);
    if (result === undefined) {
      return ErrorType.UNAUTHORIZED;
    } else {
      return result;
    }
  } catch (error) {
    if (error.code === "ER_PARSE_ERROR") {
      throw new ErrorMessage(
        ErrorType.SQL_GENERAL_ERROR,
        { sql: sql, parameters: parameters, time: new Date() },
        error
      );
    } else {
      // if (error.errorType.httpCode === 401) {
      //   throw new ErrorMessage(error.errorType, sql, error);
      // }
    }
  }
};

module.exports = {
  checkUserInfo,
};
