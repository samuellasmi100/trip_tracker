const flightsService = require("../flights/flightsService")
const roomsService = require("../rooms/roomsService")
const notesService = require("../notes/notesService")
const paymentsService = require("../payments/paymentsService")
const familyDb = require("./familyDb")
const { PAGE_SIZE } = require("../../sql/query/familyQuery")

const addFamily = async (data, vacationId) => {
  return await familyDb.addFamily(data, vacationId)
}

const getFamilies = async (vacationId, options = {}) => {
  const [rows, total] = await Promise.all([
    familyDb.getFamilies(vacationId, options),
    familyDb.countFamilies(vacationId, options),
  ]);
  const { page = 1 } = options;
  return { rows, total, hasMore: page * PAGE_SIZE < total };
}

const getUserDetails = async (id, familyId) => {
  const [userDetails, flightsDetails, roomsDetails, notesDetails, paymentsDetails] = await Promise.all([
    getParentFamilyMember(id),
    flightsService.getFlightsDetails(id),
    roomsService.getChosenRoom(id),
    notesService.getParentNote(id),
    paymentsService.getHistoryPayments(familyId)
  ])
  return { userDetails, flightsDetails, roomsDetails, notesDetails, paymentsDetails }
}

const getStats = async (vacationId) => {
  return await familyDb.getStats(vacationId);
}

const updateFamily = async (data, vacationId) => {
  return await familyDb.updateFamily(data, vacationId)
}

const searchFamilies = async (vacationId, searchTerm) => {
  return await familyDb.searchFamilies(vacationId, searchTerm);
};

module.exports = {
  addFamily,
  getFamilies,
  getStats,
  getUserDetails,
  updateFamily,
  searchFamilies,
}
