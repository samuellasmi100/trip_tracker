'use strict';

/**
 * fix_leads_updated_at.js  —  ONE-TIME data correction (run manually, like a migration).
 *
 * Background
 * ----------
 * A migration/backfill bumped `leads.updated_at` to the migration time for
 * EVERY lead, even leads that were never genuinely edited. Business rule:
 * `updated_at` ("תאריך עדכון אחרון") must be EMPTY (NULL) until a lead is
 * actually edited (status / note / date / field change).
 *
 * What this script does, per tenant DB (`trip_tracker_<id>`):
 *   1. ALTERs `leads.updated_at` to `timestamp NULL DEFAULT NULL` IF it still
 *      has the old `NOT NULL` / `DEFAULT CURRENT_TIMESTAMP` / `ON UPDATE`
 *      definition. (Required: NOT NULL blocks NULL; this also makes new/imported
 *      leads start empty going forward, converging existing DBs with schema.js.)
 *   2. Sets `updated_at = NULL` for the migration-bumped rows — identified as
 *      "batch-timestamp clusters": exact `updated_at` seconds, on the migration
 *      date, that are SHARED by >= --min-cluster leads. A human never edits two
 *      leads in the same exact second, so a shared second is the migration
 *      batch; lone genuine edits (cluster size 1) are spared even if they
 *      happened on the same day. Handles a batch that spanned several seconds.
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Nothing is written unless you pass --apply.
 *   - Idempotent: after a successful --apply the batch clusters are NULL, so a
 *     re-run finds nothing to change.
 *   - --on=YYYY-MM-DD (the migration date) is REQUIRED for --apply, so you
 *     explicitly scope which day's batch gets cleared. Run the dry run first —
 *     it prints each tenant's updated_at distribution so you can read off the date.
 *
 * Usage (run from server/)
 *   node scripts/fix_leads_updated_at.js                          # dry run, all tenants
 *   node scripts/fix_leads_updated_at.js --vacation=123           # dry run, one tenant
 *   node scripts/fix_leads_updated_at.js --apply --on=2026-05-21  # APPLY, all tenants
 *   node scripts/fix_leads_updated_at.js --apply --on=2026-05-21 --vacation=123
 *
 * Flags
 *   --apply            actually write (ALTER + UPDATE). Omit for a dry run.
 *   --on=YYYY-MM-DD    migration date; required with --apply.
 *   --vacation=<id>    limit to trip_tracker_<id> (default: every tenant DB).
 *   --min-cluster=N    min leads sharing an exact second to treat it as the
 *                      migration batch (default 2).
 *   --min-share=F      safety guard: skip a tenant (warn) if the rows to be
 *                      nulled are < F of its non-null updated_at rows
 *                      (default 0.5). Pass --min-share=0 to disable.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { listTenantDatabases } = require('../migrations/engine');

// ─── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (name, dflt) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};

const APPLY = has('--apply');
const ON_DATE = val('on', null);
const ONLY_VACATION = val('vacation', null);
const MIN_CLUSTER = parseInt(val('min-cluster', '2'), 10);
const MIN_SHARE = parseFloat(val('min-share', '0.5'));

const log = (...a) => console.log(...a);

// ─── column-definition check ───────────────────────────────────────────────────
async function updatedAtNeedsAlter(conn, db) {
  const [rows] = await conn.query(
    `SELECT IS_NULLABLE, COLUMN_DEFAULT, EXTRA
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'leads' AND COLUMN_NAME = 'updated_at'`,
    [db]
  );
  if (rows.length === 0) return { exists: false };
  const c = rows[0];
  const isNullable = c.IS_NULLABLE === 'YES';
  const hasDefault = c.COLUMN_DEFAULT != null; // null COLUMN_DEFAULT == no default
  const hasOnUpdate = /on update/i.test(c.EXTRA || '');
  // Target: nullable, no default, no ON UPDATE.
  const needsAlter = !isNullable || hasDefault || hasOnUpdate;
  return { exists: true, needsAlter, current: c };
}

// ─── per-tenant work ──────────────────────────────────────────────────────────
async function processTenant(conn, db) {
  log(`\n── ${db}`);

  // leads table present?
  const [t] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'leads'`,
    [db]
  );
  if (t.length === 0) { log('   (no leads table — skipped)'); return { skipped: true }; }

  const colState = await updatedAtNeedsAlter(conn, db);

  const [totalRows] = await conn.query(
    `SELECT COUNT(*) AS total FROM \`${db}\`.leads`
  );
  const total = totalRows[0].total;
  const [nonNullRows] = await conn.query(
    `SELECT COUNT(*) AS nonNull FROM \`${db}\`.leads WHERE updated_at IS NOT NULL`
  );
  const nonNull = nonNullRows[0].nonNull;
  log(`   leads: ${total} total, ${nonNull} with a non-null updated_at`);

  // Distribution (top clusters) — informational, always shown.
  const [dist] = await conn.query(
    `SELECT DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS ts, COUNT(*) AS c
       FROM \`${db}\`.leads
      WHERE updated_at IS NOT NULL
      GROUP BY ts ORDER BY c DESC LIMIT 5`
  );
  if (dist.length) {
    log('   updated_at clusters (top 5):');
    for (const r of dist) log(`     ${r.ts}  ×${r.c}`);
  }

  // Column ALTER (idempotent).
  if (colState.needsAlter) {
    if (APPLY) {
      await conn.query(
        `ALTER TABLE \`${db}\`.leads MODIFY \`updated_at\` timestamp NULL DEFAULT NULL`
      );
      log('   ✓ ALTERed updated_at → timestamp NULL DEFAULT NULL');
    } else {
      log('   • would ALTER updated_at → timestamp NULL DEFAULT NULL '
        + `(currently: nullable=${colState.current.IS_NULLABLE}, `
        + `default=${colState.current.COLUMN_DEFAULT}, extra="${colState.current.EXTRA}")`);
    }
  } else {
    log('   • updated_at already nullable/no-default/no-on-update — no ALTER needed');
  }

  // Identify the migration batch on --on date: exact seconds shared by >= MIN_CLUSTER leads.
  if (!ON_DATE) {
    log('   • no --on date given → not selecting rows to null (dry-run inspection only)');
    return { inspectedOnly: true };
  }

  const [clusters] = await conn.query(
    `SELECT DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS ts, COUNT(*) AS c
       FROM \`${db}\`.leads
      WHERE updated_at IS NOT NULL AND DATE(updated_at) = ?
      GROUP BY ts HAVING c >= ?
      ORDER BY c DESC`,
    [ON_DATE, MIN_CLUSTER]
  );

  if (clusters.length === 0) {
    log(`   • no batch cluster (>=${MIN_CLUSTER} leads sharing a second) on ${ON_DATE} — nothing to null`);
    return { affected: 0 };
  }

  const batchTimestamps = clusters.map((r) => r.ts);
  const toNull = clusters.reduce((s, r) => s + r.c, 0);
  const share = nonNull > 0 ? toNull / nonNull : 0;
  log(`   migration batch on ${ON_DATE}: ${clusters.length} cluster(s), ${toNull} rows `
    + `(${(share * 100).toFixed(0)}% of non-null) →`);
  for (const r of clusters) log(`     ${r.ts}  ×${r.c}`);

  // Safety guard.
  if (MIN_SHARE > 0 && share < MIN_SHARE) {
    log(`   ! GUARD: ${ (share*100).toFixed(0) }% < --min-share ${(MIN_SHARE*100).toFixed(0)}% — `
      + 'SKIPPED. Verify the date is the mass-migration day, then re-run with '
      + '--min-share=0 (or a lower value) to override for this tenant.');
    return { guarded: true, wouldAffect: toNull };
  }

  if (!APPLY) {
    log(`   • would set updated_at = NULL for ${toNull} rows (dry run)`);
    return { wouldAffect: toNull };
  }

  const placeholders = batchTimestamps.map(() => '?').join(', ');
  const [res] = await conn.query(
    `UPDATE \`${db}\`.leads SET updated_at = NULL WHERE updated_at IN (${placeholders})`,
    batchTimestamps
  );
  log(`   ✓ set updated_at = NULL for ${res.affectedRows} rows`);
  return { affected: res.affectedRows };
}

// ─── main ─────────────────────────────────────────────────────────────────────
(async () => {
  if (APPLY && !ON_DATE) {
    console.error('ERROR: --apply requires --on=YYYY-MM-DD (the migration date). '
      + 'Run a dry run first to read each tenant\'s updated_at distribution.');
    process.exit(1);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ON_DATE || '2000-01-01')) {
    console.error('ERROR: --on must be YYYY-MM-DD.');
    process.exit(1);
  }

  log(APPLY ? '=== APPLY MODE — writes will be made ===' : '=== DRY RUN — no writes (pass --apply to execute) ===');
  log(`min-cluster=${MIN_CLUSTER}  min-share=${MIN_SHARE}${ON_DATE ? `  on=${ON_DATE}` : ''}`
    + `${ONLY_VACATION ? `  vacation=${ONLY_VACATION}` : ''}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: false,
  });

  try {
    let dbs = ONLY_VACATION
      ? [`trip_tracker_${ONLY_VACATION}`]
      : await listTenantDatabases(conn);

    const totals = { affected: 0, wouldAffect: 0, guarded: 0, tenants: 0 };
    for (const db of dbs) {
      try {
        const r = await processTenant(conn, db);
        totals.tenants += 1;
        totals.affected += r.affected || 0;
        totals.wouldAffect += r.wouldAffect || 0;
        if (r.guarded) totals.guarded += 1;
      } catch (e) {
        log(`   ! ERROR on ${db}: ${e.sqlMessage || e.message} — continuing`);
      }
    }

    log(`\n=== Summary: ${totals.tenants} tenant(s) processed ===`);
    if (APPLY) log(`    rows nulled: ${totals.affected}${totals.guarded ? `, guarded/skipped tenants: ${totals.guarded}` : ''}`);
    else log(`    rows that WOULD be nulled: ${totals.wouldAffect}`
      + `${totals.guarded ? `, tenants that would be guarded: ${totals.guarded}` : ''}`
      + `\n    Re-run with: --apply --on=YYYY-MM-DD`);
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error(e); process.exit(1); });
