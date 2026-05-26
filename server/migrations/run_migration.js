'use strict';

/**
 * run_migration.js — THE manual migration entry point for this project.
 *
 *   node migrations/run_migration.js
 *
 * This is the ONLY way the database schema is updated. There are NO automatic
 * startup migrations any more (migrateSharedDb.js / migrateBudgetTables.js were
 * absorbed into migrations/schema.js + engine.js and are no longer called).
 *
 * What it does (idempotent — safe to run any number of times):
 *   1. Syncs the shared `trip_tracker` database to migrations/schema.js.
 *   2. Discovers every `trip_tracker_<id>` schema and syncs each one.
 *
 * HARD RULES (enforced in engine.js): ADD / ALTER ADD only. Never DROP TABLE,
 * DROP COLUMN, DELETE, TRUNCATE, or RENAME. Narrow allowlisted exception:
 * TENANT_COLUMN_FIXUPS (in schema.js) lets specific column definitions be
 * MODIFY'd to converge legacy tenants — metadata-only, idempotent. Extra DB
 * objects not in schema.js are reported, never removed.
 *
 * To change the schema: edit migrations/schema.js, then run this script.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const {
  migrateSharedDb,
  migrateTenantDb,
  listTenantDatabases,
  newStats,
} = require('./engine');

async function run() {
  let conn;
  const stats = newStats();
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: false,
    });

    console.log('run_migration: starting (ADD/ALTER-only, idempotent)...');

    await migrateSharedDb(conn, console.log, stats);

    const tenants = await listTenantDatabases(conn);
    if (tenants.length === 0) {
      console.log('\n  No per-vacation schemas found.');
    } else {
      console.log(`\n  Found ${tenants.length} tenant schema(s): ${tenants.join(', ')}`);
      for (const db of tenants) {
        await migrateTenantDb(conn, db, console.log, stats);
      }
    }

    console.log('\n──────────────────────────────────────────────');
    console.log('run_migration: completed successfully.');
    console.log(
      `  tables created:   ${stats.tablesCreated}\n` +
      `  columns added:    ${stats.columnsAdded}\n` +
      `  indexes added:    ${stats.indexesAdded}\n` +
      `  foreign keys add: ${stats.fksAdded}\n` +
      `  tables seeded:    ${stats.seeded}\n` +
      `  columns fixed:    ${stats.columnsFixed} (narrow MODIFY for legacy tenants)\n` +
      `  extras reported:  ${stats.extrasReported} (left as-is, never dropped)`
    );
    if (stats.tablesCreated + stats.columnsAdded + stats.indexesAdded +
        stats.fksAdded + stats.seeded + stats.columnsFixed === 0) {
      console.log('  Everything was already up-to-date.');
    }
  } catch (err) {
    console.error('\nMigration FAILED:', err.message || err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();
