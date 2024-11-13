const mysql = require("mysql2");
const config = require("../config")
require("dotenv").config();
const env = config.NODE_ENV;
const logger = require("../utils/Logger")

const dbConfiguration = () => {
  if (env === "bonds_dev") {
    return {
      host: config.DEV_DB_HOST,
      user: config.DEV_DB_USER,
      password: config.DEV_DB_PASS,
      database: config.DEV_DB_NAME,
    };
  } else if (env === "bonds_local") {
    return {
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
    };
  }
};

const db = mysql.createPool(dbConfiguration());

db.getConnection((err) => {
  if (err) {
    console.log(`Failed to create connection + " + err`)
    return;
  }
  logger.info("We're connected to MySQL");
});

function execute(sql) {
  return new Promise((resolve, reject) => {
    db.execute(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function executeWithParameters(sql, parameters) {
  return new Promise((resolve, reject) => {
    db.execute(sql, parameters, (err, result) => {
      if (err) {
        console.log("Failed interacting with DB, calling reject" + err)
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = {
  execute,
  executeWithParameters,
};
