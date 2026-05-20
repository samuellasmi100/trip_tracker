const flightsService = require("../flights/flightsService");
const userRoomsService = require("../userRooms/userRoomsService");
const notesService = require("../notes/notesService");
const paymentsService = require("../payments/paymentsService");
const userDb = require("./userDb");
const userRoomService = require("../userRooms/userRoomsService");
const { parseDateLoose } = require("../../utils/dateNormalize");

// Sentinel thrown by updateGuest when arrival/departure dates are supplied
// but not parseable — the controller maps this to a 400 with a Hebrew
// message instead of a generic 500.
const INVALID_DATES = 'INVALID_DATES';

const addGuest = async (data, vacationId) => {
  return await userDb.addGuest(data, vacationId);
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
  await userRoomService.updateStartEndAndDate(
    vacationId,
    familyId,
    sdArg,
    edArg
  );
  return await userDb.updateGuest(data, vacationId);
};

const getFamilyMember = async (id, vacationId) => {
  return await userDb.getFamilyMember(id, vacationId);
};

const saveRegistrationForm = async (filename, fileType, filePath, id) => {
  return await userDb.saveRegistrationForm(filename, fileType, filePath, id);
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
  getFamilyGuests,
  updateGuest,
  getFamilyMember,
  saveRegistrationForm,
  getUserDetails,
  deleteGuest,
  deleteMainGuest,
  INVALID_DATES,
};
