'use strict';

/**
 * createDb.js — creates a brand-new per-vacation `trip_tracker_<id>` database.
 *
 * Source of truth is migrations/schema.js (via migrations/engine.js) — the
 * SAME definitions used by run_migration.js. A newly created vacation therefore
 * gets every table, column, index, foreign key and seed row that an existing
 * tenant gets after migration. (Replaces the old trip_tracker_dump.js path —
 * that file is now unused and kept only for reference.)
 */

const mysql = require('mysql2/promise');
const logger = require('../../utils/logger');
const { migrateTenantDb } = require('../../migrations/engine');

const createDatabaseAndTable = async (vacationId) => {
  const db = `trip_tracker_${vacationId}`;
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: false,
  });

  try {
    // CREATE SCHEMA IF NOT EXISTS — never drops an existing schema.
    await connection.query(`CREATE SCHEMA IF NOT EXISTS \`${db}\``);

    // Build every table/column/index/FK + seed data from the single source
    // of truth. Idempotent: re-running on an existing schema only ADDs.
    await migrateTenantDb(connection, db, console.log);

    console.log(`Database and tables created successfully for ${db}`);
  } catch (error) {
    // Do NOT swallow — the caller must know tenant creation failed so it can
    // avoid writing a phantom trip_tracker.vacations row and return an error.
    logger.error(
      `Error: Function:createDatabaseAndTable (${db}): ${error.message}`
    );
    throw error;
  } finally {
    await connection.end();
  }
};

module.exports = createDatabaseAndTable;
