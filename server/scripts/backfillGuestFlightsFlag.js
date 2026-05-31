'use strict';

/**
 * backfillGuestFlightsFlag.js — ONE-TIME idempotent backfill (run manually, like a migration).
 *
 * Background
 * ----------
 * The per-direction flight-ticket model reads `guest.flights` as "כולל טיסות"
 * (has flights WITH US). But the Excel import never set `guest.flights`, so it
 * is NULL for every imported guest — while those guests actually fly with us
 * (the import sets `flying_with_us = 1`). Reading the helper against that NULL
 * would misclassify them as fully self-arranged (→ wrongly require 2 tickets).
 * This backfill makes `guest.flights` reliable BEFORE any consumer is wired to
 * the helper (a later step).
 *
 * Mapping (the most reliable existing signal is `flying_with_us`, the flag the
 * import deliberately sets):
 *   flying_with_us = 1     → flights = '1'   (has flights with us)
 *   flying_with_us = 0     → flights = '0'   (fully self-arranged)
 *   flying_with_us IS NULL → left untouched  (indeterminate — reported, never guessed)
 * Values are the string '1'/'0' to match the display convention (`flights==="1"`)
 * and services/documents/flightTicketRequirement.js (`isTruthyFlag`).
 *
 * Only rows whose `flights` is unset (NULL or '') are touched — a guest who
 * already has an explicit in-app `flights` value ('1' or '0') is NEVER overwritten.
 *
 * Mirrors scripts/backfillFlightTicketDocTypes.js (same structure/flags/safety).
 *
 * SAFETY
 *   - DRY RUN BY DEFAULT. Nothing is written unless you pass --apply.
 *   - Idempotent: after --apply every touched row has '1'/'0', so the "unset"
 *     filter matches nothing on a re-run.
 *   - Skips tenants that don't have a `guest` table yet — reports, never creates.
 *
 * Usage (run from server/)
 *   node scripts/backfillGuestFlightsFlag.js                    # dry run, all tenants
 *   node scripts/backfillGuestFlightsFlag.js --vacation=123     # dry run, one tenant
 *   node scripts/backfillGuestFlightsFlag.js --apply            # APPLY, all tenants
 *   node scripts/backfillGuestFlightsFlag.js --apply --vacation=123
 *
 * Flags
 *   --apply            actually write the UPDATEs. Omit for a dry run.
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

// Only rows whose flights is unset get a derived value; explicit in-app values
// are preserved.
const UNSET = `(flights IS NULL OR flights = '')`;

const log = (...a) => console.log(...a);

const count = async (conn, db, where) => {
  const [[r]] = await conn.query(
    `SELECT COUNT(*) AS n FROM \`${db}\`.guest WHERE ${where}`
  );
  return r.n;
};

// ─── per-tenant work ──────────────────────────────────────────────────────────
async function processTenant(conn, db) {
  log(`\n── ${db}`);

  const [t] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'guest'`,
    [db]
  );
  if (t.length === 0) {
    log('   (no guest table — skipped)');
    return { skipped: true };
  }

  const toOne  = await count(conn, db, `${UNSET} AND flying_with_us = 1`);
  const toZero = await count(conn, db, `${UNSET} AND flying_with_us = 0`);
  const indet  = await count(conn, db, `${UNSET} AND flying_with_us IS NULL`);
  const explicit = await count(conn, db, `NOT ${UNSET}`);

  log(`   with-us → flights='1': ${toOne}   self-arranged → flights='0': ${toZero}`
    + `   indeterminate (flying_with_us NULL, left as-is): ${indet}   already-set (skipped): ${explicit}`);

  if (!APPLY) {
    log('   (dry run — no writes)');
    return { wouldOne: toOne, wouldZero: toZero, indet };
  }

  const [r1] = await conn.query(
    `UPDATE \`${db}\`.guest SET flights = '1' WHERE ${UNSET} AND flying_with_us = 1`
  );
  const [r0] = await conn.query(
    `UPDATE \`${db}\`.guest SET flights = '0' WHERE ${UNSET} AND flying_with_us = 0`
  );
  log(`   ✓ set '1': ${r1.affectedRows}, set '0': ${r0.affectedRows}`);
  return { one: r1.affectedRows, zero: r0.affectedRows, indet };
}

// ─── main ─────────────────────────────────────────────────────────────────────
(async () => {
  log(APPLY ? '=== APPLY MODE — writes will be made ===' : '=== DRY RUN — no writes (pass --apply to execute) ===');
  log(`backfill guest.flights from flying_with_us${ONLY_VACATION ? `  vacation=${ONLY_VACATION}` : ''}`);

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

    const totals = { tenants: 0, one: 0, zero: 0, indet: 0, skipped: 0 };
    for (const db of dbs) {
      try {
        const r = await processTenant(conn, db);
        totals.tenants += 1;
        if (r.one)      totals.one   += r.one;
        if (r.zero)     totals.zero  += r.zero;
        if (r.wouldOne) totals.one   += r.wouldOne;
        if (r.wouldZero)totals.zero  += r.wouldZero;
        if (r.indet)    totals.indet += r.indet;
        if (r.skipped)  totals.skipped += 1;
      } catch (e) {
        log(`   ! ERROR on ${db}: ${e.sqlMessage || e.message} — continuing`);
      }
    }

    log(`\n=== Summary: ${totals.tenants} tenant(s) processed ===`);
    log(`    ${APPLY ? 'set' : 'would set'} flights='1': ${totals.one}, flights='0': ${totals.zero}`
      + `, indeterminate left as-is: ${totals.indet}, tenants skipped: ${totals.skipped}`);
    if (!APPLY) log('    Re-run with: --apply');
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error(e); process.exit(1); });
