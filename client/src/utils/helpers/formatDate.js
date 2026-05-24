/**
 * Reduce any date-ish value (JS Date, ISO datetime string, or YYYY-MM-DD) to a
 * LOCAL `YYYY-MM-DD` string. mysql2 returns DATE columns as Date objects that
 * JSON-serialize to UTC, so slicing the ISO string rolls the day back in Israel
 * (UTC+2/3). Reading LOCAL components keeps the date the user actually picked.
 * Empty/invalid -> "". Mirrors the server's toDateOnly for the read direction.
 */
export const toLocalYMD = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (value instanceof Date || (typeof value === "string" && value.includes("T"))) {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return String(value).slice(0, 10);
};

/** Today as a LOCAL `YYYY-MM-DD` (not UTC, so it doesn't flip a day at night). */
export const todayLocalYMD = () => toLocalYMD(new Date());

/**
 * Auto-format a date string as DD/MM/YYYY while the user types.
 * Strips non-digits, inserts slashes at positions 2 and 4.
 */
export const formatDateInput = (value) => {
  const raw = value.replace(/\D/g, "").slice(0, 8);
  if (raw.length > 4) return raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
  if (raw.length > 2) return raw.slice(0, 2) + "/" + raw.slice(2);
  return raw;
};

/**
 * Convert ISO date string (YYYY-MM-DD) to display format (DD/MM/YYYY).
 * If already in DD/MM/YYYY or empty, returns as-is.
 */
export const isoToDisplay = (value) => {
  if (!value) return "";
  // Already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  // ISO YYYY-MM-DD
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return value;
};

/**
 * Convert display date (DD/MM/YYYY) to ISO (YYYY-MM-DD).
 * If already ISO or empty, returns as-is.
 */
export const displayToIso = (value) => {
  if (!value) return "";
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return value;
};
