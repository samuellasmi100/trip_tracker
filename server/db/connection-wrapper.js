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

// Run `fn` while holding a MySQL named advisory lock (GET_LOCK). The lock is
// session-scoped, so it MUST be acquired and released on the SAME connection —
// hence a dedicated pool connection is held for the whole call (the pool can't
// RELEASE_LOCK on a different connection than the one that GET_LOCK'd). `fn`'s
// own queries still go through the pool independently; this connection only
// gates entry. Throws with code 'LOCK_TIMEOUT' if the lock isn't granted within
// `timeoutSec`. Always releases the lock and the connection.
function withAdvisoryLock(lockName, timeoutSec, fn) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => {
      if (err) { reject(err); return; }

      const q = (sql, params) =>
        new Promise((res, rej) => {
          conn.execute(sql, params, (e, rows) => (e ? rej(e) : res(rows)));
        });

      (async () => {
        let acquired = false;
        try {
          const r = await q("SELECT GET_LOCK(?, ?) AS got", [lockName, timeoutSec]);
          acquired = !!(r && r[0] && Number(r[0].got) === 1);
          if (!acquired) {
            const lockErr = new Error(`Could not acquire advisory lock '${lockName}' within ${timeoutSec}s`);
            lockErr.code = "LOCK_TIMEOUT";
            throw lockErr;
          }
          return await fn();
        } finally {
          if (acquired) {
            try { await q("SELECT RELEASE_LOCK(?)", [lockName]); } catch (_) { /* best-effort */ }
          }
          conn.release();
        }
      })().then(resolve, reject);
    });
  });
}

module.exports = {
  execute,
  executeWithParameters,
  withTransaction,
  withAdvisoryLock,
};