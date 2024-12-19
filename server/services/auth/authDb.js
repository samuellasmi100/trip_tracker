const connection = require("../../db/connection-wrapper");
const authQuery = require("../../sql/query/authQuery");
const ErrorType = require("../../serverLogs/errorType");;
const logger = require("../../utils/logger");

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
    logger.error(
      `Error: Function:checkUserInfo :, ${error.sqlMessage}`,
    );
  }
};

module.exports = {
  checkUserInfo,
};
