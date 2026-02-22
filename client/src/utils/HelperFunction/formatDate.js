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
