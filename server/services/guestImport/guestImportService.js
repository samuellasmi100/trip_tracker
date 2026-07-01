const { v4: uuidv4 } = require("uuid");
const familyService = require("../families/familyService");
const userService = require("../users/userService");
const flightsService = require("../flights/flightsService");
const connection = require("../../db/connection-wrapper");
const guestImportDb = require("./guestImportDb");
const { parseWorkbook, normalizeSurname } = require("./guestImportParser");

// A second concurrent import waits this long for the first to finish. The group
// snapshot is read once per run; serializing prevents two overlapping imports
// from each creating the same new group (the family-import duplicate bug).
const IMPORT_LOCK_TIMEOUT_SEC = 30;

const importGuests = (vacationId, buffer) =>
  connection.withAdvisoryLock(
    `guest_import_${vacationId}`,
    IMPORT_LOCK_TIMEOUT_SEC,
    () => runImport(vacationId, buffer)
  );

// Map a parsed guest row to the column set `guest` accepts. Placeholders carry
// only their last name(s); every field other than the names is left empty.
// is_in_group marks a guest who shares a group with a different surname.
// (gender and passport are intentionally absent — gender has no guest column,
// and passport lives on the flights entity, not guest.)
const toPerson = (row, isInGroup) => ({
  user_id: uuidv4(),
  hebrew_first_name: row.heFirst || null,
  hebrew_last_name: row.heLast || null,
  english_first_name: row.enFirst || null,
  english_last_name: row.enLast || null,
  identity_id: row.identity || null,
  birth_date: row.birthDate || null,
  age: row.age || null,
  is_in_group: isInGroup ? 1 : 0,
});

const isEmpty = (v) => v == null || String(v).trim() === "";

// Columns a fill-empty-only update may touch on a matched (same-ת.ז) guest,
// mapped to the parsed-row field that feeds them. identity_id is excluded —
// it's the match key, so it already equals the incoming value.
const FILL_MAP = {
  hebrew_first_name: "heFirst",
  hebrew_last_name: "heLast",
  english_first_name: "enFirst",
  english_last_name: "enLast",
  birth_date: "birthDate",
  age: "age",
};

const surnameKeyOf = (g) =>
  normalizeSurname(g.hebrew_last_name) || normalizeSurname(g.english_last_name);

// Reconcile one box's guests into its group idempotently:
//   • a guest whose ת.ז already exists in the group is NOT re-inserted — instead
//     its blank fields are filled from the sheet (never overwriting a value);
//   • reserved slots / rows without a ת.ז can't be matched by ID, so they dedup
//     by surname count: the group is topped up only to the box's count for that
//     surname, so a re-run adds nothing.
const reconcileGroup = async (box, familyId, vacationId, report) => {
  const existing = (await guestImportDb.getGroupGuests(vacationId, familyId)) || [];
  const byId = new Map();          // ת.ז -> existing guest row
  const surnameCount = new Map();  // surnameKey -> # existing guests of that surname
  for (const g of existing) {
    const id = (g.identity_id || "").trim();
    if (id) byId.set(id, g);
    const k = surnameKeyOf(g);
    if (k) surnameCount.set(k, (surnameCount.get(k) || 0) + 1);
  }

  const isInGroup = box.distinctSurnames.length > 1;
  const toInsert = [];
  const seenIncomingId = new Set();
  const noIdRowsBySurname = new Map();

  for (const row of box.rows) {
    const id = (row.identity || "").trim();
    if (!id) {
      const k = row.surnameKey || "";
      if (!noIdRowsBySurname.has(k)) noIdRowsBySurname.set(k, []);
      noIdRowsBySurname.get(k).push(row);
      continue;
    }
    if (seenIncomingId.has(id)) { report.skippedExisting += 1; continue; } // dup within the file
    seenIncomingId.add(id);

    const match = byId.get(id);
    if (match) {
      const fill = {};
      for (const [col, key] of Object.entries(FILL_MAP)) {
        if (isEmpty(match[col]) && !isEmpty(row[key])) fill[col] = String(row[key]).trim();
      }
      if (Object.keys(fill).length) {
        await guestImportDb.fillEmptyGuestFields(vacationId, match.user_id, fill);
        report.filledGuests += 1;
      } else {
        report.skippedExisting += 1;
      }
    } else {
      toInsert.push({ person: toPerson(row, isInGroup), row });
      const k = row.surnameKey;
      if (k) surnameCount.set(k, (surnameCount.get(k) || 0) + 1); // counts toward top-up below
    }
  }

  // Top up reserved/no-ת.ז rows only to the box's per-surname count.
  for (const [k, rows] of noIdRowsBySurname) {
    const boxCount = box.rows.filter((r) => (r.surnameKey || "") === k).length;
    const need = Math.max(0, boxCount - (surnameCount.get(k) || 0));
    for (let i = 0; i < rows.length; i++) {
      if (i < need) toInsert.push({ person: toPerson(rows[i], isInGroup), row: rows[i] });
      else report.skippedExisting += 1;
    }
  }

  if (toInsert.length === 0) return;
  let created;
  try {
    created = await userService.addGuestsBulk(familyId, toInsert.map((t) => t.person), vacationId);
    report.importedGuests += created.length;
  } catch (error) {
    if (error && error.code === userService.EXCEEDS_FAMILY_SIZE) {
      report.capacityIssues.push({
        firstRow: box.rows[0].rowNumber,
        group: box.dominant,
        remaining: error.remaining,
        attempted: toInsert.length,
      });
      return;
    }
    throw error;
  }

  // Passport has no guest column — it lives on `flights`. For each guest we just
  // inserted that carries a passport, add a flights row (user_id + family_id +
  // passport). Only newly-inserted guests get one, so a re-import never piles up
  // duplicate flight rows.
  const insertedIds = new Set(created);
  for (const { person, row } of toInsert) {
    if (!row.passport || !insertedIds.has(person.user_id)) continue;
    try {
      await flightsService.addFlightsDetails(
        {
          user_id: person.user_id,
          family_id: familyId,
          passport_number: row.passport,
          validity_passport: row.validity || null,
        },
        vacationId
      );
      report.passportsAttached += 1;
    } catch (error) {
      report.parseProblems.push({
        firstRow: row.rowNumber,
        message: `שמירת דרכון נכשלה: ${error.sqlMessage || error.message}`,
      });
    }
  }
};

// Decide which group a box's guests belong to, creating the group if needed.
// Resolution order (locked business rules):
//   1. If any surname in the box already exists as a group (DB snapshot OR a
//      group created earlier in this same run) → use it. The matched surname
//      with the highest in-box frequency wins; >1 distinct existing match is
//      the rare ambiguous case — pick most-frequent and flag for review.
//   2. Otherwise create a new group named after the most-frequent surname
//      (robust to typos), keyed by its normalized name so a later box with the
//      same new name merges into it.
const resolveGroup = async (box, groupByName, report, vacationId) => {
  const matched = box.distinctSurnames
    .map((key) => ({ key, freq: box.surnameFreq.get(key).count, familyId: groupByName.get(key) }))
    .filter((m) => m.familyId);

  if (matched.length > 0) {
    matched.sort((a, b) => b.freq - a.freq);
    const distinctGroups = new Set(matched.map((m) => m.familyId));
    if (distinctGroups.size > 1) {
      report.multiSurnameMatches.push({
        firstRow: box.rows[0].rowNumber,
        chosen: matched[0].key,
        surnames: matched.map((m) => m.key),
      });
    }
    report.groupsMatched.push({ firstRow: box.rows[0].rowNumber, group: matched[0].key });
    return matched[0].familyId;
  }

  // No match → create from the dominant (most-frequent) surname.
  const key = box.dominant;
  const existingByRun = groupByName.get(key);
  if (existingByRun) {
    report.groupsMatched.push({ firstRow: box.rows[0].rowNumber, group: key, merged: true });
    return existingByRun;
  }
  const familyId = uuidv4();
  await familyService.addFamily(
    { familyName: box.dominantRaw, familyId, number_of_guests: null },
    vacationId
  );
  groupByName.set(key, familyId);
  report.groupsCreated.push({ firstRow: box.rows[0].rowNumber, group: box.dominantRaw });
  return familyId;
};

const runImport = async (vacationId, buffer) => {
  const report = {
    totalBoxes: 0,
    totalGuests: 0,
    importedGuests: 0,    // newly inserted this run
    skippedExisting: 0,   // already present (idempotent re-import)
    filledGuests: 0,      // matched by ת.ז, had blank fields filled
    passportsAttached: 0, // flights rows added for newly-inserted guests
    placeholders: 0,
    relocatedRows: 0,
    groupsCreated: [],
    groupsMatched: [],
    multiSurnameMatches: [],
    capacityIssues: [],
    parseProblems: [],
  };

  let parsed;
  try {
    parsed = await parseWorkbook(buffer);
  } catch (error) {
    report.parseProblems.push({ message: `קריאת הקובץ נכשלה: ${error.message}` });
    return report;
  }
  report.totalBoxes = parsed.boxes.length;
  report.relocatedRows = parsed.relocated;

  // Snapshot existing groups once, normalized, so matching is stable for the
  // whole run. Groups created during this run are added to the same map, which
  // also merges a surname that recurs across boxes into a single group.
  const existing = (await guestImportDb.getExistingGroups(vacationId)) || [];
  const groupByName = new Map();
  for (const g of existing) {
    const key = normalizeSurname(g.family_name);
    if (key && !groupByName.has(key)) groupByName.set(key, g.family_id);
  }

  for (const box of parsed.boxes) {
    report.totalGuests += box.rows.length;
    report.placeholders += box.rows.filter((r) => r.isPlaceholder).length;

    let familyId;
    try {
      familyId = await resolveGroup(box, groupByName, report, vacationId);
    } catch (error) {
      report.parseProblems.push({
        firstRow: box.rows[0].rowNumber,
        message: `יצירת/איתור קבוצה נכשלה: ${error.sqlMessage || error.message}`,
      });
      continue;
    }

    try {
      await reconcileGroup(box, familyId, vacationId, report);
    } catch (error) {
      report.parseProblems.push({
        firstRow: box.rows[0].rowNumber,
        message: `הוספת אורחים נכשלה: ${error.sqlMessage || error.message}`,
      });
    }
  }

  return report;
};

module.exports = {
  importGuests,
};
