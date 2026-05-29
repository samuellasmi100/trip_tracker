'use strict';

/**
 * run_cleanup_drops.js — apply the legacy-cleanup DROPs to every tenant DB.
 *
 *   node scripts/run_cleanup_drops.js            # dry run, all tenants
 *   node scripts/run_cleanup_drops.js --apply    # APPLY, all tenants
 *
 * The migration engine (migrations/engine.js) is ADD-ONLY and will never drop
 * anything, so the legacy signature/upload/booking tables + dead schema have to
 * be dropped out-of-band. This script does that across all tenants, with
 * per-tenant reporting. (Replaces the earlier hand-run manual_cleanup_drops.sql
 * so cleanup follows the same `node scripts/xxx.js` convention as
 * run_migration.js / backfill_*.js.)
 *
 * What it drops, per tenant (trip_tracker_<id>):
 *   - tables : family_signatures, booking_submissions, booking_guests,
 *              payments_old, staff, vehicles, files
 *   - columns: families.signature_sent_at,
 *              user_room_assignments.week_chosen   (present in only one tenant)
 *
 * It checks information_schema BEFORE acting, so it is IDEMPOTENT and safe to
 * re-run: an object already gone is reported "not present — skipped", not an
 * error. DROP TABLE uses IF EXISTS; DROP COLUMN is guarded by the existence
 * check (MySQL has no DROP COLUMN IF EXISTS), which also handles week_chosen
 * existing in only one tenant.
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Nothing is dropped unless you pass --apply.
 *   - ⚠ Deploy the code changes + restart the app BEFORE --apply, or a still-
 *     mounted route/reader will 500 against a just-dropped object.
 *   - Never touches families.doc_token or family_documents (both still in use).
 *
 * Flags
 *   --apply           actually run the DROPs. Omit for a dry run.
 *   --vacation=<id>   limit to trip_tracker_<id> (default: every tenant DB).
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { listTenantDatabases } = require('../migrations/engine');

// ─── what to drop ─────────────────────────────────────────────────────────────
// Tables: booking_guests is listed before booking_submissions (child first), in
// case a tenant ever had a FK between them. The rest are independent.
const TABLE_DROPS = [
  'family_signatures',
  'booking_guests',
  'booking_submissions',
  'payments_old',
  'staff',
  'vehicles',
  // `files` — its only writer (userQuery/userDb/userService saveRegistrationForm)
  // is dead code, never called by any controller; zero readers anywhere.
  'files',
];

const COLUMN_DROPS = [
  { table: 'families',               column: 'signature_sent_at' }, // KEEP families.doc_token
  { table: 'user_room_assignments',  column: 'week_chosen' },       // orphan, one tenant only
];

// ─── args ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (name, dflt) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};

const APPLY = has('--apply');
const ONLY_VACATION = val('vacation', null);

const log = (...a) => console.log(...a);

// ─── introspection ───────────────────────────────────────────────────────────
async function tableExists(conn, db, table) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [db, table]
  );
  return rows.length > 0;
}

async function columnExists(conn, db, table, column) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [db, table, column]
  );
  return rows.length > 0;
}

// ─── per-tenant work ──────────────────────────────────────────────────────────
async function processTenant(conn, db) {
  log(`\n── ${db}`);
  const r = { tablesDropped: [], columnsDropped: [], skipped: 0, errors: 0 };

  // Tables
  for (const table of TABLE_DROPS) {
    try {
      if (!(await tableExists(conn, db, table))) {
        log(`   • table ${table} not present — skipped`);
        r.skipped += 1;
        continue;
      }
      if (APPLY) {
        await conn.query(`DROP TABLE IF EXISTS \`${db}\`.\`${table}\``);
        log(`   ✓ dropped table ${table}`);
      } else {
        log(`   • would drop table ${table}`);
      }
      r.tablesDropped.push(table);
    } catch (e) {
      log(`   ! ERROR dropping table ${table}: ${e.sqlMessage || e.message}`);
      r.errors += 1;
    }
  }

  // Columns (guarded — only drop when the column actually exists)
  for (const { table, column } of COLUMN_DROPS) {
    try {
      if (!(await tableExists(conn, db, table))) {
        log(`   • ${table}.${column}: table not present — skipped`);
        r.skipped += 1;
        continue;
      }
      if (!(await columnExists(conn, db, table, column))) {
        log(`   • ${table}.${column} not present — skipped`);
        r.skipped += 1;
        continue;
      }
      if (APPLY) {
        await conn.query(`ALTER TABLE \`${db}\`.\`${table}\` DROP COLUMN \`${column}\``);
        log(`   ✓ dropped column ${table}.${column}`);
      } else {
        log(`   • would drop column ${table}.${column}`);
      }
      r.columnsDropped.push(`${table}.${column}`);
    } catch (e) {
      log(`   ! ERROR dropping column ${table}.${column}: ${e.sqlMessage || e.message}`);
      r.errors += 1;
    }
  }

  const verb = APPLY ? 'dropped' : 'would drop';
  log(`   → ${verb}: ${r.tablesDropped.length} table(s)`
    + `${r.tablesDropped.length ? ` [${r.tablesDropped.join(', ')}]` : ''}`
    + `, ${r.columnsDropped.length} column(s)`
    + `${r.columnsDropped.length ? ` [${r.columnsDropped.join(', ')}]` : ''}`
    + `, ${r.skipped} skipped, ${r.errors} error(s)`);
  return r;
}

// ─── main ─────────────────────────────────────────────────────────────────────
(async () => {
  log(APPLY ? '=== APPLY MODE — DROPs will be executed ===' : '=== DRY RUN — no changes (pass --apply to execute) ===');
  log(`operations: drop ${TABLE_DROPS.length} table(s) [${TABLE_DROPS.join(', ')}], `
    + `drop ${COLUMN_DROPS.length} column(s) [${COLUMN_DROPS.map((c) => `${c.table}.${c.column}`).join(', ')}]`
    + `${ONLY_VACATION ? `  vacation=${ONLY_VACATION}` : ''}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: false,
  });

  try {
    const dbs = ONLY_VACATION
      ? [`trip_tracker_${ONLY_VACATION}`]
      : await listTenantDatabases(conn);

    if (dbs.length === 0) {
      log('\n  No per-vacation schemas found.');
      return;
    }
    log(`\n  Found ${dbs.length} tenant schema(s): ${dbs.join(', ')}`);

    const totals = { tenants: 0, tables: 0, columns: 0, skipped: 0, errors: 0 };
    for (const db of dbs) {
      try {
        const r = await processTenant(conn, db);
        totals.tenants += 1;
        totals.tables += r.tablesDropped.length;
        totals.columns += r.columnsDropped.length;
        totals.skipped += r.skipped;
        totals.errors += r.errors;
      } catch (e) {
        log(`   ! ERROR on ${db}: ${e.sqlMessage || e.message} — continuing`);
        totals.errors += 1;
      }
    }

    const verb = APPLY ? 'dropped' : 'would be dropped';
    log('\n──────────────────────────────────────────────');
    log(`=== Summary: ${totals.tenants} tenant(s) processed ===`);
    log(`    tables ${verb}:  ${totals.tables}`);
    log(`    columns ${verb}: ${totals.columns}`);
    log(`    skipped (already gone): ${totals.skipped}`);
    log(`    errors: ${totals.errors}`);
    if (!APPLY) log('\n    Re-run with --apply to execute (deploy + restart the app first).');
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error(e); process.exit(1); });
