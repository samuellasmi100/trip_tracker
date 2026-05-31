'use strict';

/**
 * backfillFlightTicketDocTypes.js — ONE-TIME idempotent backfill (run manually, like a migration).
 *
 * Background
 * ----------
 * `family_document_types` is seeded ONLY when the table is first created (see
 * schema.js HARD RULES). The per-direction flight-ticket feature adds two new
 * doc types — 'flight_ticket_outbound' and 'flight_ticket_return' — to the seed
 * string, which covers only NEW tenant DBs created from that point on. Tenant
 * DBs that already exist need a one-time INSERT to get the new doc types.
 *
 * Mirrors scripts/backfillRegistrationDocType.js (same structure/flags/safety).
 *
 * What this script does, per tenant DB (`trip_tracker_<id>`):
 *   - For each of the two new types, checks whether the row (by type_key) exists.
 *   - If missing, INSERTs it (is_required=0 — requiredness is decided per guest
 *     by services/documents/flightTicketRequirement.js, not by this flag).
 *   - Idempotent: a row that already exists is left untouched (existence checked
 *     by SELECT on type_key first, exactly like the registration backfill).
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Nothing is written unless you pass --apply.
 *   - Idempotent: re-running after --apply finds nothing to insert.
 *   - Skips tenants that don't have a `family_document_types` table yet — reports
 *     them, never creates.
 *
 * Usage (run from server/)
 *   node scripts/backfillFlightTicketDocTypes.js                    # dry run, all tenants
 *   node scripts/backfillFlightTicketDocTypes.js --vacation=123     # dry run, one tenant
 *   node scripts/backfillFlightTicketDocTypes.js --apply            # APPLY, all tenants
 *   node scripts/backfillFlightTicketDocTypes.js --apply --vacation=123
 *
 * Flags
 *   --apply            actually write the INSERTs. Omit for a dry run.
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

// The two new doc types (must match the seed in migrations/schema.js and the
// type_keys in services/documents/flightTicketRequirement.js). is_required=0 by
// design — these are conditionally required per guest via the shared helper.
const NEW_TYPES = [
  { type_key: 'flight_ticket_outbound', label: 'צילום כרטיס טיסה - הלוך', is_required: 0, sort_order: 4 },
  { type_key: 'flight_ticket_return',   label: 'צילום כרטיס טיסה - חזור', is_required: 0, sort_order: 5 },
];

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

  let inserted = 0;
  let already = 0;
  let would = 0;

  for (const ty of NEW_TYPES) {
    const [rows] = await conn.query(
      `SELECT id FROM \`${db}\`.family_document_types WHERE type_key = ?`,
      [ty.type_key]
    );
    if (rows.length > 0) {
      log(`   • '${ty.type_key}' already present (id=${rows[0].id}) — no-op`);
      already += 1;
      continue;
    }
    if (!APPLY) {
      log(`   • would INSERT ('${ty.type_key}', '${ty.label}', ${ty.is_required}, ${ty.sort_order})  (dry run)`);
      would += 1;
      continue;
    }
    const [res] = await conn.query(
      `INSERT INTO \`${db}\`.family_document_types (type_key, label, is_required, sort_order)
       VALUES (?, ?, ?, ?)`,
      [ty.type_key, ty.label, ty.is_required, ty.sort_order]
    );
    log(`   ✓ inserted '${ty.type_key}' (affectedRows=${res.affectedRows})`);
    inserted += 1;
  }

  return { inserted, already, would };
}

// ─── main ─────────────────────────────────────────────────────────────────────
(async () => {
  log(APPLY ? '=== APPLY MODE — writes will be made ===' : '=== DRY RUN — no writes (pass --apply to execute) ===');
  log(`backfill: ${NEW_TYPES.map((t) => `'${t.type_key}'`).join(', ')}`
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

    const totals = { tenants: 0, inserted: 0, already: 0, would: 0, skipped: 0 };
    for (const db of dbs) {
      try {
        const r = await processTenant(conn, db);
        totals.tenants += 1;
        if (r.inserted) totals.inserted += r.inserted;
        if (r.already)  totals.already  += r.already;
        if (r.would)    totals.would    += r.would;
        if (r.skipped)  totals.skipped  += 1;
      } catch (e) {
        log(`   ! ERROR on ${db}: ${e.sqlMessage || e.message} — continuing`);
      }
    }

    log(`\n=== Summary: ${totals.tenants} tenant(s) processed ===`);
    if (APPLY) {
      log(`    inserted rows: ${totals.inserted}, already-present: ${totals.already}, tenants skipped: ${totals.skipped}`);
    } else {
      log(`    would insert rows: ${totals.would}, already-present: ${totals.already}, tenants skipped: ${totals.skipped}`
        + `\n    Re-run with: --apply`);
    }
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error(e); process.exit(1); });
