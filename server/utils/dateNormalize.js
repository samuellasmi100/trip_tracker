/**
 * parseDateLoose — accept either ISO `YYYY-MM-DD` or zero-padded
 * `DD/MM/YYYY` (the Israeli display format the in-app GuestWizard stores in
 * `families.start_date` / `end_date`). Returns a strict `YYYY-MM-DD` string
 * suitable for MySQL DATE columns, or `null` if the input doesn't match one
 * of those two shapes OR if the date is not a real calendar date.
 *
 * Strict on purpose: no single-digit day/month (`1/2/2026`), no two-digit
 * year, no `-` separators on the EU form, no time component. Anything that
 * doesn't match becomes `null` so the caller can return a clear validation
 * error instead of letting MySQL throw `Incorrect date value` later.
 *
 * The round-trip check (re-parse the result and verify components match)
 * rejects rollovers like `31/02/2026` that the regex itself would accept.
 */
const parseDateLoose = (value) => {
  if (typeof value !== 'string') return null;

  let y, m, d;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const eu  = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  // Israeli dotted form — D.M.YY, DD.MM.YYYY (single-digit components OK).
  const dot = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
  if (iso) {
    [, y, m, d] = iso;
  } else if (eu) {
    [, d, m, y] = eu;
  } else if (dot) {
    [, d, m, y] = dot;
    d = d.padStart(2, '0');
    m = m.padStart(2, '0');
    if (y.length === 2) y = `20${y}`;
  } else {
    return null;
  }

  // Calendar-validity check via round-trip. `new Date('2026-02-31T00:00:00Z')`
  // rolls over to March 3, so we re-extract the UTC components and require
  // them to match the input — otherwise it wasn't a real date.
  const dt = new Date(`${y}-${m}-${d}T00:00:00Z`);
  if (
    isNaN(dt.getTime()) ||
    dt.getUTCFullYear()   !== Number(y) ||
    dt.getUTCMonth() + 1  !== Number(m) ||
    dt.getUTCDate()       !== Number(d)
  ) {
    return null;
  }

  return `${y}-${m}-${d}`;
};

/**
 * toDateOnly — reduce any date-ish value to a strict `YYYY-MM-DD` string for a
 * MySQL DATE column, or `null`.
 *
 * Covers the shapes parseDateLoose intentionally rejects but that still reach
 * us in practice: a JS `Date` (mysql2 returns DATE columns as Date objects)
 * and a full ISO datetime string like `2026-02-07T22:00:00.000Z` — what such a
 * Date becomes after a JSON round-trip out to the client and back on an UPDATE.
 *
 * For those we read the *local* calendar components, i.e. the same timezone
 * mysql2 used when it built the Date while reading the column (the pool sets no
 * `timezone`/`dateStrings`, so it's the server's local TZ). Reversing with the
 * same local TZ recovers the original calendar date instead of slicing the UTC
 * instant, which would shift by a day for evening-in-UTC values. Plain date
 * strings (YYYY-MM-DD, DD/MM/YYYY, D.M.YY) fall through to parseDateLoose for
 * strict calendar validation.
 */
const toDateOnly = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
    const dt = value instanceof Date ? value : new Date(value);
    if (isNaN(dt.getTime())) return null;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return parseDateLoose(String(value));
};

module.exports = { parseDateLoose, toDateOnly };
