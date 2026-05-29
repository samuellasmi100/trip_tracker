'use strict';

/**
 * backfillRegistrationDocType.js — ONE-TIME idempotent backfill (run manually, like a migration).
 *
 * Background
 * ----------
 * `family_document_types` is seeded ONLY when the table is first created (see
 * schema.js HARD RULES). Adding 'signed_registration' to the seed string in
 * schema.js therefore covers only NEW tenant DBs created from that point on.
 * Tenant DBs that already exist need a one-time INSERT to get the new doc type.
 *
 * What this script does, per tenant DB (`trip_tracker_<id>`):
 *   - Checks whether the row (type_key = 'signed_registration') exists.
 *   - If missing, INSERTs it. Uses INSERT IGNORE on the natural-unique
 *     type_key (the seed treats type_key as the de-facto unique key for the
 *     three values present), so a re-run is a no-op even on tenants that
 *     already received it.
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Nothing is written unless you pass --apply.
 *   - Idempotent: re-running after --apply finds nothing to insert.
 *   - Skips tenants that don't have a `family_document_types` table yet
 *     (e.g. a DB that pre-dates that table) — reports them, never creates.
 *
 * Usage (run from server/)
 *   node scripts/backfillRegistrationDocType.js                    # dry run, all tenants
 *   node scripts/backfillRegistrationDocType.js --vacation=123     # dry run, one tenant
 *   node scripts/backfillRegistrationDocType.js --apply            # APPLY, all tenants
 *   node scripts/backfillRegistrationDocType.js --apply --vacation=123
 *
 * Flags
 *   --apply            actually write the INSERT. Omit for a dry run.
 *   --vacation=<id>    limit to trip_tracker_<id> (default: every tenant DB).
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
const ONLY_VACATION = val('vacation', null);

const TYPE_KEY    = 'signed_registration';
const TYPE_LABEL  = 'טופס רישום חתום';
const IS_REQUIRED = 1;
const SORT_ORDER  = 3;

const log = (...a) => console.log(...a);

// ─── per-tenant work ──────────────────────────────────────────────────────────
async function processTenant(conn, db) {
  log(`\n── ${db}`);

  // family_document_types table present?
  const [t] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'family_document_types'`,
    [db]
  );
  if (t.length === 0) {
    log('   (no family_document_types table — skipped)');
    return { skipped: true };
  }

  const [rows] = await conn.query(
    `SELECT id, label, sort_order FROM \`${db}\`.family_document_types WHERE type_key = ?`,
    [TYPE_KEY]
  );

  if (rows.length > 0) {
    const current = rows[0];
    // Row exists. If the label is already the target wording, no-op. Otherwise
    // relabel it — this is how existing tenants pick up a wording change (the
    // schema seed only covers brand-new tenants).
    if (current.label === TYPE_LABEL) {
      log(`   • already present with current label (id=${current.id}) — no-op`);
      return { alreadyPresent: true };
    }
    if (!APPLY) {
      log(`   • would UPDATE label (id=${current.id}) "${current.label}" → "${TYPE_LABEL}"  (dry run)`);
      return { wouldUpdate: true };
    }
    const [ures] = await conn.query(
      `UPDATE \`${db}\`.family_document_types SET label = ? WHERE type_key = ?`,
      [TYPE_LABEL, TYPE_KEY]
    );
    log(`   ✓ updated label (affectedRows=${ures.affectedRows}) "${current.label}" → "${TYPE_LABEL}"`);
    return { updated: ures.affectedRows };
  }

  if (!APPLY) {
    log(`   • would INSERT ('${TYPE_KEY}', '${TYPE_LABEL}', ${IS_REQUIRED}, ${SORT_ORDER})  (dry run)`);
    return { wouldInsert: true };
  }

  const [res] = await conn.query(
    `INSERT IGNORE INTO \`${db}\`.family_document_types (type_key, label, is_required, sort_order)
     VALUES (?, ?, ?, ?)`,
    [TYPE_KEY, TYPE_LABEL, IS_REQUIRED, SORT_ORDER]
  );
  log(`   ✓ inserted (affectedRows=${res.affectedRows})`);
  return { inserted: res.affectedRows };
}

// ─── main ─────────────────────────────────────────────────────────────────────
(async () => {
  log(APPLY ? '=== APPLY MODE — writes will be made ===' : '=== DRY RUN — no writes (pass --apply to execute) ===');
  log(`backfill: type_key='${TYPE_KEY}', label='${TYPE_LABEL}', sort_order=${SORT_ORDER}`
    + `${ONLY_VACATION ? `  vacation=${ONLY_VACATION}` : ''}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: false,
  });

  try {
    const dbs = ONLY_VACATION
      ? [`trip_tracker_${ONLY_VACATION}`]
      : await listTenantDatabases(conn);

    const totals = { tenants: 0, inserted: 0, updated: 0, already: 0, would: 0, wouldUpdate: 0, skipped: 0 };
    for (const db of dbs) {
      try {
        const r = await processTenant(conn, db);
        totals.tenants += 1;
        if (r.inserted)         totals.inserted += 1;
        if (r.updated)          totals.updated  += 1;
        if (r.alreadyPresent)   totals.already  += 1;
        if (r.wouldInsert)      totals.would    += 1;
        if (r.wouldUpdate)      totals.wouldUpdate += 1;
        if (r.skipped)          totals.skipped  += 1;
      } catch (e) {
        log(`   ! ERROR on ${db}: ${e.sqlMessage || e.message} — continuing`);
      }
    }

    log(`\n=== Summary: ${totals.tenants} tenant(s) processed ===`);
    if (APPLY) {
      log(`    inserted: ${totals.inserted}, relabeled: ${totals.updated}, already-current: ${totals.already}, skipped: ${totals.skipped}`);
    } else {
      log(`    would insert: ${totals.would}, would relabel: ${totals.wouldUpdate}, already-current: ${totals.already}, skipped: ${totals.skipped}`
        + `\n    Re-run with: --apply`);
    }
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error(e); process.exit(1); });
