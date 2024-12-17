const flightsService = require("../flights/flightsService");
const userRoomsService = require("../userRooms/userRoomsService");
const notesService = require("../notes/notesService");
const paymentsService = require("../payments/paymentsService");
const userDb = require("./userDb");
const userRoomService = require("../userRooms/userRoomsService");

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
  await userRoomService.updateStartEndAndDate(
    vacationId,
    familyId,
    startDate,
    endDate
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
    paymentsService.getHistoryPayments(id, vacationId),
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
  deleteMainGuest
};
