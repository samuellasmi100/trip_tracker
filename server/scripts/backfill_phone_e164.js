'use strict';

/**
 * backfill_phone_e164.js — one-time, idempotent backfill of the unified
 * `guest.phone` column (E.164) from the legacy phone_a/phone_b pair.
 *
 *   node scripts/backfill_phone_e164.js              # DRY RUN (default, no writes)
 *   node scripts/backfill_phone_e164.js --commit     # actually writes
 *
 * Behaviour:
 *   • Discovers every `trip_tracker_<id>` tenant schema (same query the
 *     migration engine uses) and processes each one.
 *   • Only touches rows where `phone` IS NULL or '' — so it is safe to re-run,
 *     and it never overwrites a value already set (e.g. by the new GuestEditor).
 *   • Uses utils/phoneNormalize.toE164 — the EXACT logic the WhatsApp link uses
 *     — so the stored value and the wa.me digits can't diverge.
 *   • Numbers that resolve to something implausible (too short/long) or carry
 *     the known-bad legacy "+1081" operator prefix are LEFT NULL and listed for
 *     manual fixup, rather than silently writing garbage. Leaving them NULL also
 *     means the reader fallback keeps using phone_a/phone_b until fixed, and a
 *     re-run picks them up once corrected.
 *
 * Prereq: run `node migrations/run_migration.js` first so the `phone` column
 * exists in every tenant.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { toE164 } = require('../utils/phoneNormalize');

const COMMIT = process.argv.includes('--commit');

// E.164 allows up to 15 digits; a real number here is at least ~9 (Israeli
// local 9 digits → 12 with the 972 country code). Outside this band we treat
// the resolution as untrustworthy.
const MIN_PLAUSIBLE_DIGITS = 9;
const MAX_PLAUSIBLE_DIGITS = 15;

// Classify a candidate E.164 value. Returns { ok, reason }.
const classify = (e164) => {
  if (!e164) return { ok: false, reason: 'no digits' };
  const digits = e164.replace(/\D/g, '');
  if (digits.startsWith('1081')) return { ok: false, reason: 'legacy +1081 prefix' };
  if (digits.length < MIN_PLAUSIBLE_DIGITS) return { ok: false, reason: `too short (${digits.length})` };
  if (digits.length > MAX_PLAUSIBLE_DIGITS) return { ok: false, reason: `too long (${digits.length})` };
  return { ok: true };
};

async function listTenants(conn) {
  const [rows] = await conn.query(
    `SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
     WHERE SCHEMA_NAME LIKE 'trip\\_tracker\\_%'`
  );
  return rows.map((r) => r.SCHEMA_NAME);
}

async function processTenant(conn, schema) {
  // Pull only rows that still need a phone. mysql2 needs the schema qualified
  // explicitly since this connection has no default database selected.
  const [rows] = await conn.query(
    `SELECT id, phone_a, phone_b FROM \`${schema}\`.guest
     WHERE phone IS NULL OR phone = ''`
  );

  let written = 0;
  const skipped = [];

  for (const row of rows) {
    const e164 = toE164(row.phone_a, row.phone_b);
    const { ok, reason } = classify(e164);
    if (!ok) {
      skipped.push({ id: row.id, phone_a: row.phone_a, phone_b: row.phone_b, e164, reason });
      continue;
    }
    if (COMMIT) {
      await conn.query(`UPDATE \`${schema}\`.guest SET phone = ? WHERE id = ?`, [e164, row.id]);
    }
    written += 1;
  }

  console.log(
    `  ${schema}: ${rows.length} unmigrated → ${written} ${COMMIT ? 'written' : 'would write'}, ` +
    `${skipped.length} skipped`
  );
  for (const s of skipped) {
    console.log(
      `      ⚠ id=${s.id} skipped (${s.reason}) — phone_a=${JSON.stringify(s.phone_a)} ` +
      `phone_b=${JSON.stringify(s.phone_b)} → ${JSON.stringify(s.e164)}`
    );
  }
  return { scanned: rows.length, written, skipped: skipped.length };
}

async function run() {
  let conn;
  const totals = { scanned: 0, written: 0, skipped: 0 };
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: false,
    });

    console.log(`backfill_phone_e164: starting (${COMMIT ? 'COMMIT — writing' : 'DRY RUN — no writes'})...`);

    const tenants = await listTenants(conn);
    if (tenants.length === 0) {
      console.log('  No tenant schemas found.');
    } else {
      console.log(`  Found ${tenants.length} tenant schema(s): ${tenants.join(', ')}\n`);
      for (const schema of tenants) {
        const r = await processTenant(conn, schema);
        totals.scanned += r.scanned;
        totals.written += r.written;
        totals.skipped += r.skipped;
      }
    }

    console.log('\n──────────────────────────────────────────────');
    console.log(`backfill_phone_e164: done (${COMMIT ? 'COMMIT' : 'DRY RUN'}).`);
    console.log(
      `  rows scanned:  ${totals.scanned}\n` +
      `  rows ${COMMIT ? 'written ' : 'to write'}: ${totals.written}\n` +
      `  rows skipped:  ${totals.skipped} (left NULL for manual fixup — see ⚠ above)`
    );
    if (!COMMIT && totals.written > 0) {
      console.log('\n  Re-run with --commit to apply.');
    }
  } catch (err) {
    console.error('\nBackfill FAILED:', err.message || err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

run();
