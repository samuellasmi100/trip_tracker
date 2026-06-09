const flightsService = require("../flights/flightsService");
const userRoomsService = require("../userRooms/userRoomsService");
const notesService = require("../notes/notesService");
const paymentsService = require("../payments/paymentsService");
const userDb = require("./userDb");
const flightsDb = require("../flights/flightsDb");
const userRoomService = require("../userRooms/userRoomsService");
const connection = require("../../db/connection-wrapper");
const { parseDateLoose } = require("../../utils/dateNormalize");

// Coerce the form's is_main_user (which can arrive as true, 1, "1", false, 0,
// undefined, null) into a boolean intent. We only switch to the transactional
// path when the caller is *promoting* this guest to main.
const isPromotingToMain = (v) =>
  v === true || v === 1 || v === "1";

// Sentinel thrown by updateGuest when arrival/departure dates are supplied
// but not parseable — the controller maps this to a 400 with a Hebrew
// message instead of a generic 500.
const INVALID_DATES = 'INVALID_DATES';

// Sentinel thrown by updateGuest when the dates would actually change while
// the family still holds room_taken rows. Controller maps to 409 with a
// clear Hebrew "remove the assignments first" message.
const HAS_ROOM_ASSIGNMENTS = 'HAS_ROOM_ASSIGNMENTS';

// Sentinel thrown by addGuestsBulk when the requested additions would push the
// family past its defined size (families.number_of_guests). Controller maps it
// to a 400 with a Hebrew message; err.remaining carries how many MAY still be added.
const EXCEEDS_FAMILY_SIZE = 'EXCEEDS_FAMILY_SIZE';

const addGuest = async (data, vacationId) => {
  // Uniqueness rule: only one guest per family can carry is_main_user=1.
  // When the new guest is being promoted to main, demote everyone else in
  // the family *first*, then insert — both inside one transaction so we
  // never observe a "two mains" state.
  if (isPromotingToMain(data.is_main_user)) {
    return await connection.withTransaction(async (tx) => {
      await userDb.clearOtherMainUsersTx(tx, vacationId, data.family_id, data.user_id || '');
      return await userDb.addGuestTx(tx, data, vacationId);
    });
  }
  return await userDb.addGuest(data, vacationId);
};

// At least one of the four name fields must be non-empty for a row to be a
// real person — fully blank rows are skipped (defensive; the client skips too).
const hasAnyName = (p = {}) =>
  ["hebrew_first_name", "hebrew_last_name", "english_first_name", "english_last_name"]
    .some((f) => p[f] && String(p[f]).trim() !== "");

// Bulk-add people to a family by names (+ inherited trip info from the client).
// All-or-nothing: one transaction so a mid-list failure rolls everything back.
// is_main_user is forced to 0 here — bulk-add never creates a head (the family
// already has one), so the single-main-per-family rule always holds. family_id
// comes from the route/body, never trusted from each row.
const addGuestsBulk = async (familyId, people, vacationId) => {
  const rows = (people || []).filter(hasAnyName);
  if (rows.length === 0) return [];
  return await connection.withTransaction(async (tx) => {
    // Enforce the family's defined size: existing guests + the additions must not
    // exceed families.number_of_guests (NULL/blank = no limit). Read inside the
    // transaction so the check and the inserts are consistent.
    const cap = await userDb.getFamilyCapacityTx(tx, familyId, vacationId);
    const limit = Number(cap.limit_size);
    const hasLimit = cap.limit_size !== null && cap.limit_size !== undefined
      && String(cap.limit_size).trim() !== "" && !Number.isNaN(limit);
    if (hasLimit) {
      const remaining = Math.max(0, limit - Number(cap.current_count || 0));
      if (rows.length > remaining) {
        const err = new Error(`Adding ${rows.length} guests would exceed family size (${remaining} remaining)`);
        err.code = EXCEEDS_FAMILY_SIZE;
        err.remaining = remaining;
        throw err;
      }
    }

    const created = [];
    for (const person of rows) {
      const data = {
        ...person,
        family_id: familyId,
        is_main_user: 0,
        user_type: person.user_type || "client",
      };
      // user_classification lives on the flights table, NOT guest — pull it out
      // before the guest INSERT (else "Unknown column") and write it to a flights
      // row in the same transaction. birth_date/age stay on guest.
      const classification = data.user_classification;
      delete data.user_classification;

      await userDb.addGuestTx(tx, data, vacationId);
      if (classification && String(classification).trim() !== "") {
        await flightsDb.insertFlightRowTx(
          tx,
          { user_id: data.user_id, family_id: familyId, user_classification: String(classification).trim() },
          vacationId
        );
      }
      created.push(data.user_id);
    }
    return created;
  });
};

const deleteGuest = async (userId, vacationId) => {
  await userDb.deleteGuest(userId, vacationId);
  await userDb.deleteGuestFlights(userId, vacationId);
  await userDb.deleteGuestRooms(userId, vacationId);
  await userDb.deleteNotes(userId, vacationId);
};

const deleteMainGuest = async (familyId, vacationId) => {
  await userDb.deleteFamilyGuests(familyId, vacationId);
  await userDb.deleteFamilyFlights(familyId, vacationId);
  await userDb.deleteFamilyRooms(familyId, vacationId);
  await userDb.deleteFamilyGuestRooms(familyId, vacationId);
  await userDb.deleteFamilyNotes(familyId, vacationId);
  await userDb.deleteFamilyPayments(familyId, vacationId);
  await userDb.deleteFamily(familyId, vacationId);
};

const getFamilyGuests = async (id, vacationId) => {
  return await userDb.getFamilyGuests(id, vacationId);
};

const updateGuest = async (data, vacationId) => {
  const familyId = data.family_id;
  let startDate = data.arrival_date;
  let endDate = data.departure_date;

  // Normalize the guest's arrival/departure to ISO before they reach
  // room_taken (DATE NOT NULL). The form sends DD/MM/YYYY for in-app rows
  // and the underlying DB function silently no-op'd on bad formats — this
  // tightens it. Empty values stay empty; the DB-layer's existing guard
  // skips the UPDATE when either is undefined.
  const sd = startDate ? parseDateLoose(startDate) : null;
  const ed = endDate   ? parseDateLoose(endDate)   : null;
  if ((startDate && !sd) || (endDate && !ed)) {
    const err = new Error("Invalid arrival/departure date format");
    err.code = INVALID_DATES;
    throw err;
  }
  // updateStartEndAndDate's guard requires both `!== undefined` to fire.
  // Mirror that: only pass strings (ISO) when both parsed; otherwise pass
  // undefined to keep the existing skip-the-UPDATE behaviour intact.
  const sdArg = sd && ed ? sd : undefined;
  const edArg = sd && ed ? ed : undefined;

  // Rule: do not let a guest edit mutate the family's room_taken dates
  // while the family is still assigned. If both dates are supplied and they
  // differ from what room_taken currently holds for this family, throw a
  // sentinel that the controller turns into a 409 with a Hebrew message.
  // If room_taken has no rows for this family, or the submitted dates match
  // exactly what's already there, the edit goes through (the latter being a
  // no-op for room_taken).
  if (sdArg !== undefined && edArg !== undefined) {
    const bookings = await userRoomService.getBookingDatesForFamily(vacationId, familyId);
    if (bookings && bookings.length > 0) {
      const current = bookings[0];
      if (current.start_date !== sdArg || current.end_date !== edArg) {
        const err = new Error("Cannot change family dates while assigned to rooms");
        err.code = HAS_ROOM_ASSIGNMENTS;
        throw err;
      }
    }
  }

  await userRoomService.updateStartEndAndDate(
    vacationId,
    familyId,
    sdArg,
    edArg
  );

  // Same uniqueness rule as addGuest: if this update promotes the guest to
  // main, demote every other guest in the family inside the same transaction.
  if (isPromotingToMain(data.is_main_user)) {
    return await connection.withTransaction(async (tx) => {
      await userDb.clearOtherMainUsersTx(tx, vacationId, familyId, data.user_id);
      return await userDb.updateGuestTx(tx, data, vacationId);
    });
  }
  return await userDb.updateGuest(data, vacationId);
};

const getFamilyMember = async (id, vacationId) => {
  return await userDb.getFamilyMember(id, vacationId);
};

const getUserDetails = async (id, familyId, isIngroup, vacationId) => {
  const [
    userDetails,
    flightsDetails,
    roomsDetails,
    notesDetails,
    paymentsDetails,
  ] = await Promise.all([
    getFamilyMember(id, vacationId),
    flightsService.getFlightsDetails(id, familyId, isIngroup, vacationId),
    userRoomsService.getChosenRoom(id, vacationId),
    notesService.getUserNotes(id, vacationId),
    paymentsService.getPayments(familyId, vacationId),
  ]);
  let dataToReturn = {
    userDetails,
    flightsDetails,
    roomsDetails,
    notesDetails,
    paymentsDetails,
  };
 
  return dataToReturn;
};

module.exports = {
  addGuest,
  addGuestsBulk,
  getFamilyGuests,
  updateGuest,
  getFamilyMember,
  getUserDetails,
  deleteGuest,
  deleteMainGuest,
  INVALID_DATES,
  HAS_ROOM_ASSIGNMENTS,
  EXCEEDS_FAMILY_SIZE,
};
