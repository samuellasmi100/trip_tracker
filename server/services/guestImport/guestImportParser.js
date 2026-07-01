// Pure workbook logic for the hotel-guest Excel import: read the .xlsx with
// ExcelJS (the ONLY reader available to us that exposes cell borders — the
// client's SheetJS community build cannot), segment rows into bordered "boxes",
// and run the case-1 stray-row relocation. No DB access lives here; the service
// layer turns the boxes into groups + guest inserts.
//
// Why borders: the sheet has no group column and no merged cells. Each visual
// box (one group) is drawn with thin cell borders. Validated rule (see the
// import guide): a new box STARTS exactly on the row where the Hebrew last-name
// column carries a top border; every interior/placeholder row lacks it. This
// fires once per box even when a box holds several surnames.

const ExcelJS = require("exceljs");

// 1-based ExcelJS columns (A=1). Layout is fixed for this report.
const COL = {
  he_last: 2,   // B — Hebrew last name (the box-boundary column)
  he_first: 3,  // C
  en_last: 4,   // D
  en_first: 5,  // E
  passport: 6,  // F — passport #; NOT a guest column → attached to a flights row.
                //     Also read for placeholder detection.
  validity: 7,  // G — passport validity → flights.validity_passport (DD/MM/YYYY)
  dob: 8,       // H — date of birth → guest.birth_date (stored DD/MM/YYYY)
  identity: 9,  // I — ת.ז (Israeli ID) → guest.identity_id (also the dedup key)
  age: 11,      // K — carries a garbage 126 sentinel; never trusted
};

// guest.age garbage sentinel — discarded everywhere, never used for detection.
const GARBAGE_AGE = "126";

// Strip the invisible BiDi marks Excel injects into RTL cells, collapse spaces.
const stripBidi = (s) =>
  String(s ?? "").replace(/[​-‏‪-‮⁦-⁩﻿]/g, "");

const cellText = (cell) => {
  if (!cell) return "";
  let v = cell.value;
  if (v == null) return "";
  // ExcelJS rich text / hyperlink / formula result shapes.
  if (typeof v === "object") {
    if (Array.isArray(v.richText)) v = v.richText.map((t) => t.text).join("");
    else if ("text" in v) v = v.text;
    else if ("result" in v) v = v.result;
    else v = "";
  }
  return stripBidi(v).replace(/\s+/g, " ").trim();
};

// Surname used for matching/relocation: drop a parenthetical/hyphen variant
// ("פרז (שנירר)" → "פרז", "שושן-(פישר)" → "שושן") and keep the leading token.
const normalizeSurname = (raw) => {
  let t = stripBidi(raw).trim();
  t = t.split(/[(（]/)[0];          // before the first parenthesis
  t = t.replace(/[-–\s]+$/, "");    // trailing hyphen/dash/space left by the split
  return t.replace(/\s+/g, " ").trim();
};

const hasTopBorder = (cell) =>
  !!(cell && cell.border && cell.border.top && cell.border.top.style);

// Birth date: the column is date-formatted, so ExcelJS hands back a JS Date (or
// an Excel serial number on odd files). Normalize to the DD/MM/YYYY string the
// app stores. Use UTC parts so a timezone offset can't shift the day.
const toDateStr = (value) => {
  if (value == null || value === "") return null;
  let d;
  if (value instanceof Date) d = value;
  else if (typeof value === "number") d = new Date(Math.round((value - 25569) * 86400000));
  else {
    const m = String(value).trim().match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (!m) return null;
    const yyyy = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${m[1].padStart(2, "0")}/${m[2].padStart(2, "0")}/${yyyy}`;
  }
  if (isNaN(d.getTime())) return null;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
};

// Real age only: a bare number that isn't the 126 sentinel. Everything else → null.
const toAge = (raw) => {
  const t = stripBidi(raw).trim();
  if (!t || t === GARBAGE_AGE || !/^\d+$/.test(t)) return null;
  return t;
};

// Read every data row into a flat list of guest records (last content row =
// the last row carrying any surname; the sheet has ~600 trailing blanks).
const readRows = (ws) => {
  const out = [];
  let lastWithName = 1;
  const maxRow = ws.rowCount;
  for (let r = 2; r <= maxRow; r++) {
    const row = ws.getRow(r);
    const heLast = cellText(row.getCell(COL.he_last));
    const enLast = cellText(row.getCell(COL.en_last));
    if (!heLast && !enLast) continue; // skip fully blank rows
    lastWithName = r;
    const heFirst = cellText(row.getCell(COL.he_first));
    const enFirst = cellText(row.getCell(COL.en_first));
    const passport = cellText(row.getCell(COL.passport));
    const identity = cellText(row.getCell(COL.identity));
    // Placeholder = a reserved slot: a last name but no first name, no passport,
    // and no ID. The age 126 sentinel is NEVER used for this (some named guests
    // carry 126, some real placeholders have a blank age).
    const isPlaceholder = !(heFirst || enFirst || passport || identity);
    out.push({
      rowNumber: r,
      heLast, heFirst, enLast, enFirst, identity,
      passport: passport || null,
      validity: toDateStr(row.getCell(COL.validity).value),
      birthDate: toDateStr(row.getCell(COL.dob).value),
      age: toAge(cellText(row.getCell(COL.age))),
      isPlaceholder,
      isBoxStart: hasTopBorder(row.getCell(COL.he_last)),
      surnameKey: normalizeSurname(heLast) || normalizeSurname(enLast),
      surnameRaw: heLast || enLast,
    });
  }
  return { rows: out, lastWithName };
};

// Group flat rows into boxes on the validated boundary signal.
const detectBoxes = (rows) => {
  const boxes = [];
  let cur = null;
  for (const row of rows) {
    if (row.isBoxStart || !cur) {
      cur = { rows: [] };
      boxes.push(cur);
    }
    cur.rows.push(row);
  }
  boxes.forEach(computeBoxSurnames);
  return boxes;
};

// Dominant surname = most frequent in the box (robust to a typo'd first row,
// e.g. גרינפל×1 vs גרינפלד×6 → גרינפלד). Ties broken by first appearance.
const computeBoxSurnames = (box) => {
  const freq = new Map();
  const order = [];
  for (const r of box.rows) {
    const k = r.surnameKey;
    if (!k) continue;
    if (!freq.has(k)) { freq.set(k, { count: 0, raw: r.surnameRaw }); order.push(k); }
    freq.get(k).count += 1;
  }
  box.surnameFreq = freq;
  box.distinctSurnames = order;
  let best = null;
  for (const k of order) {
    const f = freq.get(k);
    if (!best || f.count > best.count) best = { key: k, count: f.count, raw: f.raw };
  }
  box.dominant = best ? best.key : "";
  box.dominantRaw = best ? best.raw : "";
};

// Case-1 relocation: a surname that has its OWN standalone box (it is the
// dominant surname of some box) but also appears as stray row(s) inside another
// box is a secretary typo — move those stray rows into that surname's own box.
// Fully automatic, no report entry. Distinct from case-2 (a surname that only
// appears as a stray and has NO standalone box, e.g. פוגל) which is left in
// place and handled by ordinary box→group resolution.
const relocateStrays = (boxes) => {
  const ownBoxBySurname = new Map(); // surname -> its standalone box
  for (const box of boxes) {
    if (box.dominant && !ownBoxBySurname.has(box.dominant)) {
      ownBoxBySurname.set(box.dominant, box);
    }
  }
  let moved = 0;
  for (const box of boxes) {
    const keep = [];
    for (const row of box.rows) {
      const target = ownBoxBySurname.get(row.surnameKey);
      // Move only when this surname owns a DIFFERENT box than the one it's in.
      if (target && target !== box && row.surnameKey !== box.dominant) {
        target.rows.push(row);
        moved += 1;
      } else {
        keep.push(row);
      }
    }
    box.rows = keep;
  }
  if (moved) boxes.forEach(computeBoxSurnames); // surnames/dominant shifted
  // A box can be emptied if all its rows were strays — drop those.
  return { boxes: boxes.filter((b) => b.rows.length > 0), moved };
};

// Full parse: buffer -> relocated boxes ready for group resolution.
const parseWorkbook = async (buffer) => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) return { boxes: [], totalRows: 0, relocated: 0 };
  const { rows } = readRows(ws);
  const boxes = detectBoxes(rows);
  const { boxes: finalBoxes, moved } = relocateStrays(boxes);
  return { boxes: finalBoxes, totalRows: rows.length, relocated: moved };
};

module.exports = {
  parseWorkbook,
  normalizeSurname,
  // exported for unit tests
  detectBoxes,
  relocateStrays,
  computeBoxSurnames,
};
