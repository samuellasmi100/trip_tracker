'use strict';

/**
 * engine.js — idempotent, ADD/ALTER-only migration engine.
 *
 * Drives BOTH:
 *   - run_migration.js  (manual CLI: shared DB + every tenant)
 *   - sql/utils/createDb.js (new-vacation tenant creation)
 *
 * HARD RULES — never violated by this engine:
 *   - Only CREATE TABLE (for missing tables) and ALTER TABLE ... ADD
 *     (for missing columns / indexes / foreign keys).
 *   - NEVER DROP TABLE, DROP COLUMN, DELETE, TRUNCATE, RENAME, or MODIFY.
 *   - Seed data is inserted ONLY into a table this run just created.
 *   - Anything in the DB but not in schema.js is REPORTED, never touched.
 *
 * Every action is logged. A per-run summary counter is returned.
 */

// ─── introspection helpers ───────────────────────────────────────────────────

async function tableExists(conn, db, table) {
  const [rows] = await conn.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [db, table]
  );
  return rows.length > 0;
}

async function getColumns(conn, db, table) {
  const [rows] = await conn.query(
    `SELECT COLUMN_NAME, COLUMN_TYPE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [db, table]
  );
  const map = new Map();
  for (const r of rows) map.set(r.COLUMN_NAME, r.COLUMN_TYPE);
  return map;
}

async function indexExists(conn, db, table, indexName) {
  const [rows] = await conn.query(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [db, table, indexName]
  );
  return rows.length > 0;
}

async function fkExists(conn, db, table, fkName) {
  const [rows] = await conn.query(
    `SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'
       AND CONSTRAINT_NAME = ?`,
    [db, table, fkName]
  );
  return rows.length > 0;
}

async function listTables(conn, db) {
  const [rows] = await conn.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?`,
    [db]
  );
  return rows.map(r => r.TABLE_NAME);
}

async function tableIsEmpty(conn, db, table) {
  const [rows] = await conn.query(
    `SELECT 1 FROM \`${db}\`.\`${table}\` LIMIT 1`
  );
  return rows.length === 0;
}

// ─── SQL builders ────────────────────────────────────────────────────────────

function buildCreateTableSql(db, table, def) {
  const lines = def.columns.map(c => `  \`${c.name}\` ${c.definition}`);

  if (def.primaryKey) lines.push(`  PRIMARY KEY ${def.primaryKey}`);

  for (const idx of def.indexes || []) {
    const kind = idx.unique ? 'UNIQUE KEY' : 'KEY';
    const cols = idx.columns.map(c => `\`${c}\``).join(', ');
    lines.push(`  ${kind} \`${idx.name}\` (${cols})`);
  }

  for (const fk of def.foreignKeys || []) {
    lines.push(
      `  CONSTRAINT \`${fk.name}\` FOREIGN KEY (\`${fk.column}\`) ` +
      `REFERENCES \`${fk.refTable}\` (\`${fk.refColumn}\`) ` +
      `ON DELETE ${fk.onDelete} ON UPDATE ${fk.onUpdate}`
    );
  }

  return `CREATE TABLE \`${db}\`.\`${table}\` (\n${lines.join(',\n')}\n) ${def.options}`;
}

// ─── per-table sync (idempotent, additive only) ──────────────────────────────

async function ensureTable(conn, db, table, def, log, stats) {
  const exists = await tableExists(conn, db, table);

  if (!exists) {
    await conn.query(buildCreateTableSql(db, table, def));
    log(`    + CREATED table ${table}`);
    stats.tablesCreated++;

    if (def.seed) {
      const sql = def.seed.replace(/\{\{T\}\}/g, `\`${db}\`.\`${table}\``);
      await conn.query(sql);
      log(`      + seeded ${table} with default rows`);
      stats.seeded++;
    }
    return;
  }

  // Table exists → reconcile columns / indexes / FKs (ADD only).
  const actual = await getColumns(conn, db, table);
  let prevCol = null;

  for (const col of def.columns) {
    if (!actual.has(col.name)) {
      const after = prevCol ? ` AFTER \`${prevCol}\`` : '';
      await conn.query(
        `ALTER TABLE \`${db}\`.\`${table}\` ADD COLUMN \`${col.name}\` ${col.definition}${after}`
      );
      log(`    + ADDED column ${table}.${col.name}`);
      stats.columnsAdded++;
    }
    prevCol = col.name;
  }

  for (const idx of def.indexes || []) {
    if (!await indexExists(conn, db, table, idx.name)) {
      const kind = idx.unique ? 'UNIQUE' : 'INDEX';
      const cols = idx.columns.map(c => `\`${c}\``).join(', ');
      await conn.query(
        `ALTER TABLE \`${db}\`.\`${table}\` ADD ${kind} \`${idx.name}\` (${cols})`
      );
      log(`    + ADDED ${idx.unique ? 'unique ' : ''}index ${table}.${idx.name}`);
      stats.indexesAdded++;
    }
  }

  for (const fk of def.foreignKeys || []) {
    if (!await fkExists(conn, db, table, fk.name)) {
      await conn.query(
        `ALTER TABLE \`${db}\`.\`${table}\` ADD CONSTRAINT \`${fk.name}\` ` +
        `FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.refTable}\` (\`${fk.refColumn}\`) ` +
        `ON DELETE ${fk.onDelete} ON UPDATE ${fk.onUpdate}`
      );
      log(`    + ADDED foreign key ${table}.${fk.name}`);
      stats.fksAdded++;
    }
  }

  // Report-only: columns present in DB but absent from schema (NEVER removed).
  const expected = new Set(def.columns.map(c => c.name));
  for (const colName of actual.keys()) {
    if (!expected.has(colName)) {
      log(`    ! EXTRA column ${table}.${colName} exists in DB but not in schema — left as-is (no drop)`);
      stats.extrasReported++;
    }
  }
}

// ─── database-level sync ─────────────────────────────────────────────────────

async function applySchema(conn, db, schemas, order, log, stats) {
  for (const table of order) {
    await ensureTable(conn, db, table, schemas[table], log, stats);
  }

  // Report-only: tables present in DB but absent from schema (NEVER dropped).
  const known = new Set(order);
  for (const t of await listTables(conn, db)) {
    if (!known.has(t)) {
      log(`    ! EXTRA table ${db}.${t} exists in DB but not in schema — left as-is (no drop)`);
      stats.extrasReported++;
    }
  }
}

function newStats() {
  return {
    tablesCreated: 0, columnsAdded: 0, indexesAdded: 0,
    fksAdded: 0, seeded: 0, extrasReported: 0,
  };
}

const { SHARED_TABLE_SCHEMAS, SHARED_TABLE_ORDER,
        TENANT_TABLE_SCHEMAS, TENANT_TABLE_ORDER } = require('./schema');

/** Sync the shared `trip_tracker` database. */
async function migrateSharedDb(conn, log = console.log, stats = newStats()) {
  log(`\n  Shared DB: trip_tracker`);
  await applySchema(conn, 'trip_tracker', SHARED_TABLE_SCHEMAS, SHARED_TABLE_ORDER, log, stats);
  return stats;
}

/** Sync one per-vacation `trip_tracker_<id>` database (schema must already exist). */
async function migrateTenantDb(conn, db, log = console.log, stats = newStats()) {
  log(`\n  Tenant DB: ${db}`);
  await applySchema(conn, db, TENANT_TABLE_SCHEMAS, TENANT_TABLE_ORDER, log, stats);
  return stats;
}

/** Discover every per-vacation schema (excludes the shared `trip_tracker`). */
async function listTenantDatabases(conn) {
  const [rows] = await conn.query(
    `SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
     WHERE SCHEMA_NAME LIKE 'trip\\_tracker\\_%'`
  );
  return rows.map(r => r.SCHEMA_NAME);
}

module.exports = {
  migrateSharedDb,
  migrateTenantDb,
  listTenantDatabases,
  newStats,
  buildCreateTableSql,
};
