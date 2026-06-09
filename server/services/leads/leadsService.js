const leadsDb = require('./leadsDb');

// Columns the importer is allowed to diff/update from a row.
// Excludes free-text-only fields the file doesn't carry (family_size,
// referred_by, assigned_to) so we never blank them on update.
const IMPORTABLE_COLUMNS = [
  'full_name', 'first_name', 'last_name', 'phone', 'email', 'status', 'notes',
  'followup_date',
  'price', 'discount', 'training', 'composition',
];

// Normalize phone for dedupe: digits-only; re-add leading 0 to 9-digit Israeli
// mobiles that lost it during Excel numeric coercion. Returns null if no
// digits at all.
const normalizePhone = (raw) => {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 9 && digits.startsWith('5')) return `0${digits}`;
  return digits;
};

// Normalize full name for the phone-less fallback match: strip invisible
// BiDi / zero-width characters Excel sneaks into RTL cells, collapse internal
// whitespace, trim. Hebrew is caseless, no case-fold needed. Returns null on
// an empty result so callers can short-circuit instead of bucketing on "".
const INVISIBLE_NAME_RE = /[​-‏‪-‮⁦-⁩﻿]/g;
const normalizeName = (raw) => {
  if (raw == null) return null;
  const s = String(raw).replace(INVISIBLE_NAME_RE, '').replace(/\s+/g, ' ').trim();
  return s || null;
};

// Normalize email for the second-tier match: strip invisibles, trim, lowercase.
// Returns null on empty so callers short-circuit instead of bucketing on "".
const normalizeEmail = (raw) => {
  if (raw == null) return null;
  const s = String(raw).replace(INVISIBLE_NAME_RE, '').trim().toLowerCase();
  return s || null;
};

// Compare a file value vs a DB value for a column. Empty-from-file means
// "no information" — we do NOT treat that as a change.
const valuesEqual = (col, fileVal, dbVal) => {
  if (fileVal === null || fileVal === undefined || fileVal === '') return true;
  if (dbVal === null || dbVal === undefined) return false;
  if (col === 'price' || col === 'discount') {
    return Number(fileVal) === Number(dbVal);
  }
  if (col === 'followup_date') {
    // DB returns a Date object or 'YYYY-MM-DD' string depending on driver.
    const dbStr = dbVal instanceof Date
      ? dbVal.toISOString().slice(0, 10)
      : String(dbVal).slice(0, 10);
    return String(fileVal) === dbStr;
  }
  if (col === 'email') {
    // Case-insensitive so a re-import with mixed-case email doesn't churn.
    return String(fileVal).trim().toLowerCase() === String(dbVal).trim().toLowerCase();
  }
  return String(fileVal).trim() === String(dbVal).trim();
};

const getAll = async (vacationId) => {
  return await leadsDb.getAll(vacationId);
};

const getById = async (vacationId, leadId) => {
  const lead = await leadsDb.getById(vacationId, leadId);
  if (!lead) return null;
  const notes = await leadsDb.getNotesByLeadId(vacationId, leadId);
  return { ...lead, notes };
};

const getSummary = async (vacationId) => {
  return await leadsDb.getSummary(vacationId);
};

const create = async (vacationId, data) => {
  const result = await leadsDb.create(vacationId, data);
  return await leadsDb.getById(vacationId, result.insertId);
};

// Public-form submission, WITH dedup — unlike `create` (coordinator add), a
// public submission that matches an existing lead in THIS vacation on phone OR
// email must NOT create a duplicate. Instead it flips the existing lead's
// highlight to 'returning'. Returns { lead, isReturning } so the controller can
// colour the notification (new vs returning).
//
// Phone/email are normalized with the SAME helpers the Excel importer uses, and
// a brand-new lead is STORED with the normalized phone — so a later resubmission
// matches via the plain `WHERE phone = ?` lookup (raw formatting like
// "050-..." would otherwise never equal the normalized query value). Email is
// stored as submitted; MySQL's case-insensitive collation handles the match.
const createPublic = async (vacationId, data) => {
  const normPhone = normalizePhone(data.phone);
  const normEmail = normalizeEmail(data.email);

  // Match on phone first (strongest key), then email. Name-only submissions
  // (no phone, no email) skip the lookup entirely and insert as new.
  let existing = null;
  if (normPhone) {
    existing = await leadsDb.getByPhone(vacationId, normPhone);
  }
  if (!existing && normEmail) {
    existing = await leadsDb.getByEmail(vacationId, normEmail);
  }

  if (existing) {
    // Returning interest — flip highlight, no new row. Unconditional set, so it
    // overrides 'new' or 'none'. bumpUpdatedAt:false so this doesn't masquerade
    // as a genuine coordinator edit.
    await leadsDb.update(
      vacationId,
      existing.lead_id,
      { highlight: 'returning' },
      { bumpUpdatedAt: false }
    );
    return { lead: existing, isReturning: true };
  }

  const result = await leadsDb.create(vacationId, {
    ...data,
    phone: normPhone,
    highlight: 'new',
  });
  const lead = await leadsDb.getById(vacationId, result.insertId);
  return { lead, isReturning: false };
};

// Coordinator opened the lead → clear its public-flow highlight. bumpUpdatedAt
// is false because viewing a lead is not a content edit.
const markSeen = async (vacationId, leadId) => {
  return await leadsDb.update(
    vacationId,
    leadId,
    { highlight: 'none' },
    { bumpUpdatedAt: false }
  );
};

const update = async (vacationId, leadId, data) => {
  // Auto-set is_active based on terminal statuses
  if (data.status === 'registered' || data.status === 'not_relevant') {
    data.is_active = 0;
  } else if (data.status && data.is_active === undefined) {
    data.is_active = 1;
  }
  await leadsDb.update(vacationId, leadId, data);
  return await leadsDb.getById(vacationId, leadId);
};

const remove = async (vacationId, leadId) => {
  return await leadsDb.remove(vacationId, leadId);
};

const removeAll = async (vacationId) => {
  return await leadsDb.removeAll(vacationId);
};

const addNote = async (vacationId, leadId, noteText, createdBy) => {
  await leadsDb.addNote(vacationId, leadId, noteText, createdBy);
  return await leadsDb.getNotesByLeadId(vacationId, leadId);
};

const getFollowupDueCount = async (vacationId) => {
  return await leadsDb.getFollowupDueCount(vacationId);
};

const importRows = async (vacationId, rows) => {
  if (!Array.isArray(rows)) {
    throw new Error('rows must be an array');
  }

  const existing = await leadsDb.getAll(vacationId);

  // Three-tier dedupe index, built from current DB state:
  //   phoneIndex         — normalized phone → lead (one-to-one; phone is the
  //                        strongest unique key when present).
  //   emailIndex         — normalized email → leads (one-to-many; rarely
  //                        shared, but family members occasionally do, so we
  //                        keep a bucket and refuse to auto-merge when >1).
  //                        Includes leads regardless of whether they have a
  //                        phone — email is strong enough for cross-phone
  //                        matching, gated by the phone-conflict check below.
  //   noPhoneNameIndex   — normalized full name → leads with no phone
  //                        (one-to-many; phone-less name collisions across
  //                        different families are common — we refuse to merge
  //                        across phone presence to avoid false positives).
  const phoneIndex = new Map();
  const emailIndex = new Map();
  const noPhoneNameIndex = new Map();
  for (const lead of existing) {
    const normPhone = normalizePhone(lead.phone);
    if (normPhone) {
      phoneIndex.set(normPhone, lead);
    }
    const normEmail = normalizeEmail(lead.email);
    if (normEmail) {
      const bucket = emailIndex.get(normEmail);
      if (bucket) bucket.push(lead);
      else emailIndex.set(normEmail, [lead]);
    }
    if (!normPhone) {
      const normName = normalizeName(lead.full_name);
      if (normName) {
        const bucket = noPhoneNameIndex.get(normName);
        if (bucket) bucket.push(lead);
        else noPhoneNameIndex.set(normName, [lead]);
      }
    }
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const raw of rows) {
    const row = { ...raw };
    row.phone = normalizePhone(row.phone);

    if (!row.full_name && !row.phone) {
      skipped += 1;
      continue;
    }

    // Three-tier match:
    //   1. phone           — strong unique key when present.
    //   2. email           — strong; runs after phone fails (whether or not
    //                        the row has a phone). Phone-conflict guard
    //                        prevents auto-merging "same email, different
    //                        phone" into the wrong record.
    //   3. name (no-phone) — last resort for phone-less rows only.
    // Each tier uses the same safety pattern: bucket-size-1 → match; bucket
    // >1 → prefer an __fromImport entry so in-file duplicates dedupe but
    // pre-existing ambiguous data isn't auto-merged.
    const rowEmail = normalizeEmail(row.email);
    const pickFromBucket = (bucket) => {
      if (!bucket) return null;
      if (bucket.length === 1) return bucket[0];
      return bucket.find((l) => l.__fromImport) || null;
    };
    const phoneConflict = (lead) =>
      !!row.phone && !!normalizePhone(lead.phone) && normalizePhone(lead.phone) !== row.phone;

    let match = null;
    if (row.phone) {
      match = phoneIndex.get(row.phone) || null;
    }
    if (!match && rowEmail) {
      const candidate = pickFromBucket(emailIndex.get(rowEmail));
      if (candidate && !phoneConflict(candidate)) match = candidate;
    }
    if (!match && !row.phone) {
      const nameKey = normalizeName(row.full_name);
      const bucket = nameKey ? noPhoneNameIndex.get(nameKey) : null;
      match = pickFromBucket(bucket);
    }

    if (!match) {
      const payload = {
        full_name: row.full_name || row.phone || 'ללא שם',
        first_name: row.first_name || null,
        last_name: row.last_name || null,
        phone: row.phone,
        email: row.email || null,
        status: row.status || 'new_interest',
        source: 'phone',
        notes: row.notes || null,
        followup_date:     row.followup_date     || null,
        price:    row.price    ?? null,
        discount: row.discount ?? null,
        training:    row.training    || null,
        composition: row.composition || null,
      };
      const result = await leadsDb.create(vacationId, payload);

      // Register the new lead in every in-memory index whose key it carries,
      // so subsequent rows in the same file dedupe against it instead of
      // INSERTing a duplicate. __fromImport tags it as "created this run",
      // which the email/name matchers use to allow merging even when the
      // pre-existing bucket was ambiguous.
      const synthetic = { ...payload, lead_id: result.insertId, __fromImport: true };
      if (row.phone) {
        phoneIndex.set(row.phone, synthetic);
      }
      const synthEmail = normalizeEmail(synthetic.email);
      if (synthEmail) {
        const bucket = emailIndex.get(synthEmail);
        if (bucket) bucket.push(synthetic);
        else emailIndex.set(synthEmail, [synthetic]);
      }
      if (!row.phone) {
        const normName = normalizeName(synthetic.full_name);
        if (normName) {
          const bucket = noPhoneNameIndex.get(normName);
          if (bucket) bucket.push(synthetic);
          else noPhoneNameIndex.set(normName, [synthetic]);
        }
      }
      created += 1;
      continue;
    }

    // Diff: build a payload of only the fields the file actually changes.
    const diff = {};
    for (const col of IMPORTABLE_COLUMNS) {
      if (row[col] === undefined || row[col] === null || row[col] === '') continue;
      if (!valuesEqual(col, row[col], match[col])) {
        diff[col] = row[col];
      }
    }

    if (Object.keys(diff).length === 0) {
      skipped += 1;
      continue;
    }

    // Auto-flip is_active for terminal statuses, mirroring the regular update flow.
    if (diff.status === 'registered' || diff.status === 'not_relevant') {
      diff.is_active = 0;
    }
    // Re-imports must NOT bump updated_at — that timestamp is reserved for
    // genuine in-app edits (manual edit, status pill, date change, note).
    await leadsDb.update(vacationId, match.lead_id, diff, { bumpUpdatedAt: false });
    // Reflect the write on the in-memory match so later rows in the same file
    // diff against the up-to-date state (avoids re-applying the same change
    // and avoids overwriting a row1 change with row2's stale comparison).
    Object.assign(match, diff);
    updated += 1;
  }

  return { created, updated, skipped };
};

// Record a leads Excel export in the global audit log. userId/userEmail are
// passed down from the controller's JWT-derived req.user — NEVER the client.
// count is sanitized to a non-negative integer; missing identity is stored as
// NULL rather than rejected (the export itself already succeeded client-side).
const logExport = async ({ userId, userEmail, vacationId, vacationName, count }) => {
  const n = Number(count);
  const leadCount = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0;
  return await leadsDb.logExport({
    userId: userId ?? null,
    userEmail: userEmail || null,
    vacationId,
    vacationName: vacationName || null,
    leadCount,
  });
};

module.exports = {
  getAll,
  getById,
  getSummary,
  create,
  createPublic,
  markSeen,
  update,
  remove,
  removeAll,
  addNote,
  getFollowupDueCount,
  importRows,
  logExport,
};
