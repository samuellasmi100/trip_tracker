/* eslint-disable no-console */
/**
 * STANDALONE TEST-SEED SCRIPT — NOT A MIGRATION. DO NOT COMMIT.
 * ---------------------------------------------------------------------------
 * Seeds recognizable test families into ONE vacation's tenant DB so the
 * document portal — especially the multi-surname (שטרן-style) split modal —
 * can be exercised by hand.
 *
 * The split modal triggers when the guests of a single family (resolved by
 * families.doc_token, then fetched by family_id) have MORE THAN ONE distinct
 * hebrew_last_name (see server/services/documents grouping). So:
 *   - family #1 (one surname)      -> NO split modal
 *   - family #2 / #3 (multi)       -> split modal + per-surname filtered links
 *
 * Every seeded row is recognizable for easy removal:
 *   - guest.hebrew_first_name starts with the prefix 'בדיקה'
 *   - families.family_name    starts with the prefix 'בדיקה'
 * (the guest table has no `notes` column, so the name prefix IS the marker.)
 *
 * Usage — run from the server directory (so it finds node_modules + .env):
 *   node scripts/seed_test_families.js          # insert the test families
 *   node scripts/seed_test_families.js --clean  # delete previously seeded rows
 *
 * Record shapes mirror the real app/import (familyQuery.addFamily +
 * services/families/familyDb.js + the documents portal queries):
 *   families : family_id (UUID), family_name, doc_token (UUID), start/end dates
 *   guest    : family_id, user_id (UUID), hebrew names, phone (E.164),
 *              is_main_user, flying_with_us, week_chosen, arrival/departure
 * The single existing week is read from the master DB (trip_tracker.
 * vacation_date) and EVERY family/guest is assigned to it.
 */

const path = require("path");
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// .env in this repo writes values with a leading space after '=' and the
// password key is DB_PASS (NOT DB_PASSWORD). Read defensively + trim.
const env = (key, fallback = "") => {
  const v = process.env[key];
  return (v === undefined || v === null ? fallback : String(v)).trim();
};
const DB_HOST = env("DB_HOST", "localhost");
const DB_USER = env("DB_USER", "root");
const DB_PASS = env("DB_PASS") || env("DB_PASSWORD");
const MASTER_DB = env("DB_NAME", "trip_tracker");

// --- target vacation -------------------------------------------------------
const VACATION_ID = "ce7c7ed2_4d76_41f0_92e5_699f6082cb27";
const TENANT_DB = `trip_tracker_${VACATION_ID}`;

// --- recognizable test marker (prefix on every seeded name) ----------------
const NAME_PREFIX = "בדיקה"; // "test" in Hebrew; sole removal marker

// --- families to create ----------------------------------------------------
// Each spec = ONE family_id sharing ONE doc_token. `surnames` lists the
// hebrew_last_name groups (head-first); the first guest of the first group is
// the is_main_user=1 head and carries the known phone (last 4 = portal code).
const FAMILY_SPECS = [
  {
    label: "Single-surname (NO split modal expected)",
    headFirst: "כהן-ראש",
    primarySurname: "כהן",
    headPhone: "+972500001111", // portal 4-digit code = 1111
    surnames: [{ surname: "כהן", count: 10 }],
  },
  {
    label: "Multi-surname x3 (split modal expected)",
    headFirst: "לוי-ראש",
    primarySurname: "לוי",
    headPhone: "+972500002222", // portal 4-digit code = 2222
    surnames: [
      { surname: "לוי", count: 15 },
      { surname: "מזרחי", count: 10 },
      { surname: "פרץ", count: 5 },
    ],
  },
  {
    label: "Multi-surname x2 (split modal expected)",
    headFirst: "אברהם-ראש",
    primarySurname: "אברהם",
    headPhone: "+972500003333", // portal 4-digit code = 3333
    surnames: [
      { surname: "אברהם", count: 6 },
      { surname: "יוסף", count: 4 },
    ],
  },
];

// Explicit column lists — verified against the live tenant schema.
// families: family_name is NOT NULL; there are NO hebrew name columns here.
const FAMILY_COLS = ["family_id", "family_name", "doc_token", "start_date", "end_date"];
// guest: family_id is NOT NULL; dates live in arrival_date/departure_date;
// there is NO doc_token or notes column on guest.
const GUEST_COLS = [
  "family_id",
  "user_id",
  "hebrew_first_name",
  "hebrew_last_name",
  "phone",
  "is_main_user",
  "flying_with_us",
  "week_chosen",
  "arrival_date",
  "departure_date",
];

const makePool = (database) =>
  mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

// Read the vacation's single week from the master DB. DATE_FORMAT pins the
// values to clean 'YYYY-MM-DD' strings regardless of driver date handling, so
// they land in the tenant's varchar date columns exactly like the real app.
async function getVacationWeek(masterPool) {
  const [rows] = await masterPool.query(
    `SELECT name,
            DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(end_date,   '%Y-%m-%d') AS end_date
       FROM vacation_date
      WHERE vacation_id = ?
      ORDER BY start_date ASC`,
    [VACATION_ID]
  );
  if (!rows.length) {
    throw new Error(`No vacation_date rows for vacation_id='${VACATION_ID}' in ${MASTER_DB}.`);
  }
  if (rows.length > 1) {
    console.warn(`! vacation has ${rows.length} weeks; expected 1. Using first: "${rows[0].name}".`);
  }
  return rows[0]; // { name, start_date, end_date }  (strings)
}

// Build the ordered guest list + family row for one spec.
function buildFamily(spec, week) {
  const family_id = uuidv4();
  const doc_token = uuidv4();
  const guests = [];
  let n = 0;

  for (const grp of spec.surnames) {
    for (let i = 0; i < grp.count; i++) {
      n += 1;
      const isHead = n === 1;
      guests.push({
        family_id,
        user_id: uuidv4(), // real app stores a UUID user_id per guest
        hebrew_first_name: isHead ? `${NAME_PREFIX}-${spec.headFirst}` : `${NAME_PREFIX}${n}`,
        hebrew_last_name: grp.surname,
        phone: isHead ? spec.headPhone : null, // only the head needs a phone (portal code)
        is_main_user: isHead ? 1 : 0,
        // Mix flyers and non-flyers so flight-ticket slots appear for some.
        flying_with_us: isHead ? 1 : n % 3 === 0 ? 0 : 1,
        week_chosen: week.name,
        arrival_date: week.start_date,
        departure_date: week.end_date,
      });
    }
  }

  const familyRow = {
    family_id,
    family_name: `${NAME_PREFIX} ${spec.primarySurname}`, // starts with the marker prefix
    doc_token,
    start_date: week.start_date,
    end_date: week.end_date,
  };

  return { family_id, doc_token, head: guests[0], guests, familyRow };
}

async function insertFamily(pool, fam) {
  await pool.query(
    `INSERT INTO families (${FAMILY_COLS.join(", ")}) VALUES (${FAMILY_COLS.map(() => "?").join(", ")})`,
    FAMILY_COLS.map((c) => fam.familyRow[c])
  );
  const guestSql = `INSERT INTO guest (${GUEST_COLS.join(", ")}) VALUES (${GUEST_COLS.map(() => "?").join(", ")})`;
  for (const g of fam.guests) {
    await pool.query(guestSql, GUEST_COLS.map((c) => g[c]));
  }
}

function surnameBreakdown(guests) {
  const counts = {};
  for (const g of guests) counts[g.hebrew_last_name] = (counts[g.hebrew_last_name] || 0) + 1;
  return Object.entries(counts).map(([s, c]) => `${s}:${c}`).join(", ");
}

async function clean(pool) {
  const [g] = await pool.query(`DELETE FROM guest WHERE hebrew_first_name LIKE ?`, [`${NAME_PREFIX}%`]);
  const [f] = await pool.query(`DELETE FROM families WHERE family_name LIKE ?`, [`${NAME_PREFIX}%`]);
  console.log(`Cleanup complete: removed ${g.affectedRows} guest row(s), ${f.affectedRows} family row(s).`);
}

async function main() {
  if (!DB_PASS) console.warn("! DB_PASS is empty — check server/.env (key is DB_PASS).");
  const isClean = process.argv.includes("--clean");
  const masterPool = makePool(MASTER_DB);
  const tenantPool = makePool(TENANT_DB);

  try {
    if (isClean) {
      await clean(tenantPool);
      return;
    }

    const week = await getVacationWeek(masterPool);
    const weekDesc = `"${week.name}" (${week.start_date} → ${week.end_date})`;
    console.log(`Target vacation : ${VACATION_ID}`);
    console.log(`Tenant DB       : ${TENANT_DB}`);
    console.log(`Assigning week  : ${weekDesc}\n`);

    const created = [];
    for (const spec of FAMILY_SPECS) {
      const fam = buildFamily(spec, week);
      await insertFamily(tenantPool, fam);
      created.push({ spec, fam });
    }

    console.log("Seeded families (all assigned to the week above):\n");
    created.forEach(({ spec, fam }, i) => {
      const code = String(fam.head.phone).slice(-4);
      console.log(`${i + 1}. ${spec.label}`);
      console.log(`   family_name   : ${fam.familyRow.family_name}`);
      console.log(`   head guest    : ${fam.head.hebrew_first_name} ${fam.head.hebrew_last_name}`);
      console.log(`   family_id     : ${fam.family_id}`);
      console.log(`   doc_token     : ${fam.doc_token}`);
      console.log(`   head phone    : ${fam.head.phone}   (portal 4-digit code = ${code})`);
      console.log(`   guests        : ${fam.guests.length}  [${surnameBreakdown(fam.guests)}]`);
      console.log(
        `   flying_with_us: ${fam.guests.filter((g) => g.flying_with_us === 1).length} yes / ` +
          `${fam.guests.filter((g) => g.flying_with_us === 0).length} no`
      );
      console.log(`   week assigned : ${weekDesc}\n`);
    });

    console.log(`Done. To remove all seeded data: node scripts/seed_test_families.js --clean`);
  } finally {
    await masterPool.end();
    await tenantPool.end();
  }
}

main().catch((err) => {
  console.error("SEED FAILED:", err.message);
  process.exit(1);
});
