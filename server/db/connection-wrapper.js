const mysql = require("mysql2");

require("dotenv").config();



const dbConfiguration = () => {

    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    };
};

const db = mysql.createPool(dbConfiguration());

db.getConnection((err) => {
  if (err) {

    console.log(`Failed to create connection + " + err`)
    return;
  }
 console.log("We're connected to MySQL");
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

// Run `fn` inside a MySQL transaction. `fn` is called with a transaction-scoped
// connection that exposes `executeWithParameters(sql, params)` returning rows
// (same shape as the pool-level helper above). On any thrown error the
// transaction is rolled back; otherwise it's committed. Always releases the
// connection back to the pool.
function withTransaction(fn) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => {
      if (err) { reject(err); return; }

      const tx = {
        executeWithParameters(sql, parameters) {
          return new Promise((res, rej) => {
            conn.execute(sql, parameters, (e, rows) => {
              if (e) { rej(e); return; }
              res(rows);
            });
          });
        },
      };

      conn.beginTransaction(async (beginErr) => {
        if (beginErr) { conn.release(); reject(beginErr); return; }
        try {
          const result = await fn(tx);
          conn.commit((commitErr) => {
            conn.release();
            if (commitErr) reject(commitErr);
            else resolve(result);
          });
        } catch (workErr) {
          conn.rollback(() => {
            conn.release();
            reject(workErr);
          });
        }
      });
    });
  });
}

module.exports = {
  execute,
  executeWithParameters,
  withTransaction,
};