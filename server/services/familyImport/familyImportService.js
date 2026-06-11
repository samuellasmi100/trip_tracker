const { v4: uuidv4 } = require("uuid");
const familyService = require("../families/familyService");
const userRoomsService = require("../userRooms/userRoomsService");
const vacationDb = require("../vacations/vacationDb");
const familyImportDb = require("./familyImportDb");
const connection = require("../../db/connection-wrapper");
const { parseDateLoose } = require("../../utils/dateNormalize");

// How long a second concurrent import waits for the first to finish before
// giving up. Generous enough for a full sheet (families + room assignments).
const IMPORT_LOCK_TIMEOUT_SEC = 30;

// Exception families ("חריגים") carry a DD.MM-DD.MM range with no year in the
// sheet; the registration file is for the 2026 season, so we stamp that year.
const EXCEPTION_YEAR = 2026;

// Strip the invisible BiDi marks Excel injects into RTL cells, then collapse
// whitespace. Used both for dedup keys and for clean stored values.
const stripBidi = (s) =>
  String(s ?? "").replace(/[​-‏‪-‮⁦-⁩﻿]/g, "");

const cleanStr = (s) => {
  const t = stripBidi(s).trim();
  return t === "" ? null : t;
};

// Dedup key for a family name: BiDi-stripped, whitespace-collapsed.
const normalizeName = (s) => stripBidi(s).replace(/\s+/g, " ").trim();

// Integer-as-string for the varchar count columns; null when blank/non-numeric.
const parseIntStr = (s) => {
  const t = cleanStr(s);
  if (!t) return null;
  const n = parseInt(t.replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(n) ? null : String(n);
};

// Money: drop thousands separators / currency symbols, keep the bare number.
// NIS column is usually plain ("109070"); EUR comes as "10,180€".
const parseMoney = (s) => {
  const t = cleanStr(s);
  if (!t) return null;
  const digits = t.replace(/[^\d.-]/g, "");
  return digits === "" ? null : digits;
};

// Registration date "DD.MM.YY" (or DD.MM.YYYY) → "YYYY-MM-DD" for the
// backdated created_at. Returns null on anything that isn't a clean date.
const parseRegDate = (s) => {
  const t = cleanStr(s);
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (!m) return null;
  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  const yyyy = m[3].length === 2 ? `20${m[3]}` : m[3];
  if (+mm < 1 || +mm > 12 || +dd < 1 || +dd > 31) return null;
  return `${yyyy}-${mm}-${dd}`;
};

// Resolve the "אחר" column into a date assignment.
//   bare number N  -> the part named "שבוע N+1" (the season has an extra week
//                     before, so the offset; copy that part's dates)
//   DD.MM-DD.MM    -> exception family (custom dates, year stamped 2026)
//   anything else  -> no dates (caller lists it for manual handling)
const resolveWeek = (raw, partsByName) => {
  const t = cleanStr(raw);
  if (!t) return { type: "none" };

  if (/^\d+$/.test(t)) {
    const name = `שבוע ${parseInt(t, 10) + 1}`;
    const part = partsByName.get(name);
    if (part && part.start && part.end) {
      return { type: "week", start: part.start, end: part.end, label: name };
    }
    return { type: "none", reason: `לא נמצא שבוע מתאים (${name})` };
  }

  // Multi-week: "1+2", "2+3", "1+2+3" — the family stays across several weeks.
  // Each number is a week (same offset N → שבוע N+1). Consecutive weeks collapse
  // into ONE continuous range (earliest start → latest end) classified as חריגים,
  // exactly like a date-range exception. Non-consecutive (e.g. 1+3), or any week
  // that doesn't resolve, is NOT guessed: no dates + reported, like an unparsable
  // value.
  if (/^\d+(\s*\+\s*\d+)+$/.test(t)) {
    const nums = t.split("+").map((x) => parseInt(x.trim(), 10));
    const resolved = nums.map((n) => partsByName.get(`שבוע ${n + 1}`));
    if (resolved.some((p) => !p || !p.start || !p.end)) {
      return { type: "none", reason: `לא נמצאו שבועות מתאימים (${t})` };
    }
    const sorted = [...nums].sort((a, b) => a - b);
    const consecutive = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
    if (!consecutive) {
      return { type: "none", reason: `שבועות לא רצופים (${t})` };
    }
    // Earliest start / latest end across the parts (ISO dates sort lexicographically).
    const start = resolved.map((p) => p.start).sort()[0];
    const end = resolved.map((p) => p.end).sort().slice(-1)[0];
    return { type: "exception", start, end };
  }

  const m = t.match(/^(\d{1,2})\.(\d{1,2})\s*[-–]\s*(\d{1,2})\.(\d{1,2})$/);
  if (m) {
    const [, d1, mo1, d2, mo2] = m;
    if (+mo1 < 1 || +mo1 > 12 || +mo2 < 1 || +mo2 > 12 || +d1 < 1 || +d1 > 31 || +d2 < 1 || +d2 > 31) {
      return { type: "none", reason: `טווח תאריכים לא תקין (${t})` };
    }
    const start = `${EXCEPTION_YEAR}-${mo1.padStart(2, "0")}-${d1.padStart(2, "0")}`;
    const end = `${EXCEPTION_YEAR}-${mo2.padStart(2, "0")}-${d2.padStart(2, "0")}`;
    return { type: "exception", start, end };
  }

  return { type: "none", reason: `ערך שבוע לא מזוהה (${t})` };
};

// Serialize concurrent imports for the SAME vacation behind a named advisory
// lock. The dedup reads a one-time snapshot of existing families; without
// serialization, two overlapping imports each snapshot at a different time and
// the later one re-inserts whatever the first hadn't yet committed (the past
// duplicate-families bug). A lock — not a unique index on family_name — is used
// so legitimately same-named families and manual adds stay unaffected. The
// second import simply waits for the first to finish, then snapshots fresh.
const importFamilies = async (vacationId, rows) => {
  return connection.withAdvisoryLock(
    `family_import_${vacationId}`,
    IMPORT_LOCK_TIMEOUT_SEC,
    () => runImport(vacationId, rows)
  );
};

const runImport = async (vacationId, rows) => {
  const report = {
    totalRows: rows.length,
    imported: 0,
    skippedDuplicates: [],
    withoutDates: [],
    exceptionFamilies: [],
    roomsAssigned: 0,
    roomsSkippedNoDates: [],
    roomsFailedNotExist: [],
    roomsFailedOverlap: [],
    parseProblems: [],
  };

  // ── Load the data the mapping rules depend on ──────────────────────────────
  // Vacation parts (weeks), keyed by exact name "שבוע N", with dates normalized
  // to ISO so they can be copied straight onto the family / room booking.
  const partRows = (await vacationDb.getVacationDates(vacationId)) || [];
  const partsByName = new Map();
  for (const p of partRows) {
    partsByName.set(String(p.name).trim(), {
      start: parseDateLoose(p.start_date),
      end: parseDateLoose(p.end_date),
    });
  }

  // Existing families → dedup by normalized name (the only key available; the
  // sheet has no ID and we don't import heads). Re-running the import therefore
  // skips families already present instead of duplicating them.
  const existing = (await familyImportDb.getExistingFamilies(vacationId)) || [];
  const seenNames = new Set();
  for (const f of existing) seenNames.add(normalizeName(f.family_name));

  // Valid room ids → so a room number that doesn't exist is reported, not a
  // hard FK failure that would abort the whole import.
  const roomRows = (await familyImportDb.getValidRoomIds(vacationId)) || [];
  const validRooms = new Set(roomRows.map((r) => String(r.rooms_id).trim()));

  for (const row of rows) {
    const rowNum = row.rowNumber;
    const familyName = cleanStr(row.family_name);

    if (!familyName) {
      report.parseProblems.push({ row: rowNum, message: "שורה ללא שם משפחה — דולגה" });
      continue;
    }

    const key = normalizeName(familyName);
    if (seenNames.has(key)) {
      report.skippedDuplicates.push({ row: rowNum, family_name: familyName });
      continue;
    }

    // ── Week / dates ─────────────────────────────────────────────────────────
    const wk = resolveWeek(row.week_raw, partsByName);
    const start_date = wk.type === "none" ? null : wk.start;
    const end_date = wk.type === "none" ? null : wk.end;
    if (wk.type === "none") {
      report.withoutDates.push({
        row: rowNum,
        family_name: familyName,
        week_raw: cleanStr(row.week_raw) || "",
        reason: wk.reason || "",
      });
    } else if (wk.type === "exception") {
      report.exceptionFamilies.push({ row: rowNum, family_name: familyName, start_date, end_date });
    }

    // ── Registration date → backdated created_at ─────────────────────────────
    const created_at = parseRegDate(row.registration_date);
    if (cleanStr(row.registration_date) && !created_at) {
      report.parseProblems.push({
        row: rowNum,
        message: `תאריך רישום לא תקין: '${cleanStr(row.registration_date)}'`,
      });
    }

    const familyId = uuidv4();
    const data = {
      familyName,
      familyId,
      number_of_guests: parseIntStr(row.number_of_guests),
      number_of_babies: parseIntStr(row.number_of_babies),
      number_of_rooms: parseIntStr(row.number_of_rooms),
      total_amount: parseMoney(row.total_amount),
      total_amount_eur: parseMoney(row.total_amount_eur),
      special_requests: cleanStr(row.notes),
      start_date,
      end_date,
    };
    if (created_at) data.created_at = created_at;

    try {
      await familyService.addFamily(data, vacationId);
    } catch (error) {
      report.parseProblems.push({
        row: rowNum,
        message: `יצירת המשפחה נכשלה: ${error.sqlMessage || error.message}`,
      });
      continue;
    }
    report.imported += 1;
    seenNames.add(key); // also dedup repeats within this same file

    // ── Room assignment ──────────────────────────────────────────────────────
    const roomsRaw = cleanStr(row.rooms_raw);
    if (!roomsRaw) continue;
    const tokens = roomsRaw.split(/[,\s/]+/).map((x) => x.trim()).filter(Boolean);
    if (tokens.length === 0) continue;

    if (!start_date || !end_date) {
      report.roomsSkippedNoDates.push({ row: rowNum, family_name: familyName, rooms: tokens });
      continue;
    }

    const existingRooms = [];
    for (const tok of tokens) {
      if (validRooms.has(tok)) existingRooms.push(tok);
      else report.roomsFailedNotExist.push({ row: rowNum, family_name: familyName, room: tok });
    }
    if (existingRooms.length === 0) continue;

    try {
      await userRoomsService.assignMainRoom(
        existingRooms.map((id) => ({ rooms_id: id })),
        familyId,
        vacationId,
        start_date,
        end_date
      );
      report.roomsAssigned += existingRooms.length;
    } catch (error) {
      if (error && error.code === userRoomsService.ROOM_OVERLAP) {
        report.roomsFailedOverlap.push({ row: rowNum, family_name: familyName, room: error.roomId });
      } else {
        report.parseProblems.push({
          row: rowNum,
          message: `שיבוץ חדר נכשל: ${error.sqlMessage || error.message}`,
        });
      }
    }
  }

  return report;
};

module.exports = {
  importFamilies,
};
